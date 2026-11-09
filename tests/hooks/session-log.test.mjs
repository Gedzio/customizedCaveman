// src/hooks/caveman-session-log.js — Stop hook that appends each finished answer
// to <cwd>/.sessions/<session_id>.jsonl while the session's mode is `custom`.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const HOOK = path.join(ROOT, 'src/hooks/caveman-session-log.js');
const cfg = createRequire(import.meta.url)(path.join(ROOT, 'src/hooks/caveman-config.js'));
const SID = '11111111-2222-4333-8444-555555555555';

function fixture(t, mode) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'caveman-session-log-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const claudeDir = path.join(dir, 'claude');
  const project = path.join(dir, 'project');
  fs.mkdirSync(claudeDir);
  fs.mkdirSync(project);
  if (mode) cfg.writeSessionMode(claudeDir, SID, mode);
  const transcript = path.join(dir, 'transcript.jsonl');
  fs.writeFileSync(transcript, [
    { type: 'user', message: { content: 'old prompt' } },
    { type: 'assistant', message: { content: [{ type: 'text', text: 'old answer' }] } },
    { type: 'user', message: { content: 'Ile to kosztuje?' } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Bash', input: {} }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', content: 'ok' }] } },
    { type: 'user', isMeta: true, message: { content: 'system reminder' } },
  ].map((o) => JSON.stringify(o)).join('\n') + '\n');
  const env = { ...process.env, CLAUDE_CONFIG_DIR: claudeDir };
  return { dir, project, transcript, env };
}

function run({ env, payload }) {
  const r = spawnSync(process.execPath, [HOOK], { env, input: JSON.stringify(payload), encoding: 'utf8', timeout: 5000 });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, '', 'hook must print nothing (stdout could reach the host)');
}

const logFile = (project) => path.join(project, '.sessions', SID + '.jsonl');

test('custom mode: appends one line per answer with prompt and verbatim text', (t) => {
  const f = fixture(t, 'custom');
  const payload = { session_id: SID, transcript_path: f.transcript, cwd: f.project, last_assistant_message: '> [FAKT] Zero tokenów.\n\n## 1. Temat' };
  run({ env: f.env, payload });
  run({ env: f.env, payload: { ...payload, last_assistant_message: 'druga odpowiedź' } });
  const lines = fs.readFileSync(logFile(f.project), 'utf8').trimEnd().split('\n').map((l) => JSON.parse(l));
  assert.equal(lines.length, 2);
  assert.equal(lines[0].prompt, 'Ile to kosztuje?', 'skips tool_result and isMeta entries');
  assert.equal(lines[0].text, '> [FAKT] Zero tokenów.\n\n## 1. Temat');
  assert.equal(lines[1].text, 'druga odpowiedź');
  assert.ok(!Number.isNaN(Date.parse(lines[0].ts)));
});

test('other mode: writes nothing', (t) => {
  const f = fixture(t, 'caveman');
  run({ env: f.env, payload: { session_id: SID, transcript_path: f.transcript, cwd: f.project, last_assistant_message: 'x' } });
  assert.equal(fs.existsSync(path.join(f.project, '.sessions')), false);
});

test('invalid session id or empty answer: writes nothing', (t) => {
  const f = fixture(t, 'custom');
  run({ env: f.env, payload: { session_id: '../../evil', cwd: f.project, last_assistant_message: 'x' } });
  run({ env: f.env, payload: { session_id: SID, cwd: f.project, last_assistant_message: '   ' } });
  assert.equal(fs.existsSync(path.join(f.project, '.sessions')), false);
});

test('missing transcript: still logs the answer with an empty prompt', (t) => {
  const f = fixture(t, 'custom');
  run({ env: f.env, payload: { session_id: SID, transcript_path: path.join(f.dir, 'nope.jsonl'), cwd: f.project, last_assistant_message: 'odpowiedź' } });
  const line = JSON.parse(fs.readFileSync(logFile(f.project), 'utf8'));
  assert.equal(line.prompt, '');
  assert.equal(line.text, 'odpowiedź');
});

test('garbage payload: exits 0 silently', (t) => {
  const r = spawnSync(process.execPath, [HOOK], { input: 'not json', encoding: 'utf8', timeout: 5000 });
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '');
});
