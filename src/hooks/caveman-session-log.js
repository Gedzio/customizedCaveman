#!/usr/bin/env node
// caveman — Stop hook: append each finished answer to <cwd>/.sessions/<session_id>.jsonl
//
// Only while the session's mode is `custom`. One JSON object per line:
//   { ts, prompt, text }
//   ts     ISO time the answer finished
//   prompt the user's prompt for this turn (read from the transcript; "" if not found)
//   text   the final answer prose, verbatim (Stop payload `last_assistant_message`)
//
// No model tokens: plain stdout of a Stop hook never reaches Claude, and this hook
// prints nothing. Registered with async: true, so it never delays the session.
// Never throws, never blocks: any failure is swallowed and the hook exits 0.

const fs = require('fs');
const os = require('os');
const path = require('path');

let cfg = null;
try { cfg = require('./caveman-config'); } catch (e) { /* standalone: no mode gate available */ }

const SESSIONS_DIR = '.sessions';
const PAYLOAD_WATCHDOG_MS = 2000;

function isCustomMode(sessionId) {
  if (!cfg || typeof cfg.resolveActiveMode !== 'function') return false;
  const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  return cfg.resolveActiveMode(claudeDir, sessionId) === 'custom';
}

// Last real user prompt in the transcript: a `user` entry whose content is text,
// not a tool_result. The prompt is written at turn start, so it is on disk by Stop
// time even when the final assistant message is not yet.
function lastUserPrompt(transcriptPath) {
  if (typeof transcriptPath !== 'string' || !transcriptPath) return '';
  let raw;
  try { raw = fs.readFileSync(transcriptPath, 'utf8'); } catch (e) { return ''; }
  const lines = raw.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i]) continue;
    let o;
    try { o = JSON.parse(lines[i]); } catch (e) { continue; }
    if (o.type !== 'user' || o.isMeta || !o.message) continue;
    const c = o.message.content;
    if (typeof c === 'string') return c;
    if (Array.isArray(c)) {
      if (c.some((b) => b && b.type === 'tool_result')) continue;
      const text = c.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n');
      if (text) return text;
    }
  }
  return '';
}

function logTurn(payload) {
  let data;
  try { data = JSON.parse(payload); } catch (e) { return; }
  if (!data) return;
  const sessionId = cfg && cfg.validateSessionId ? cfg.validateSessionId(data.session_id) : null;
  if (!sessionId) return;                                  // also blocks path traversal via the id
  const text = data.last_assistant_message;
  if (typeof text !== 'string' || !text.trim()) return;
  if (!isCustomMode(sessionId)) return;

  const dir = path.join(typeof data.cwd === 'string' && data.cwd ? data.cwd : process.cwd(), SESSIONS_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const line = JSON.stringify({ ts: new Date().toISOString(), prompt: lastUserPrompt(data.transcript_path), text });
  fs.appendFileSync(path.join(dir, sessionId + '.jsonl'), line + '\n', 'utf8');
}

// Same contour as the other caveman hooks: act on the first complete JSON object,
// never wait for EOF (pipe close lags on Windows), give up after the watchdog.
function readHookPayload(onPayload) {
  for (const stream of [process.stdout, process.stderr]) stream.on('error', () => process.exit(0));
  if (process.stdin.isTTY) return;
  let input = '';
  let done = false;
  const finish = (p) => {
    if (done) return;
    done = true;
    clearTimeout(watchdog);
    try { process.stdin.pause(); } catch (e) {}
    try { process.stdin.unref(); } catch (e) {}
    if (p) { try { onPayload(p); } catch (e) { /* silent: never fail the session */ } }
  };
  const watchdog = setTimeout(() => finish(null), PAYLOAD_WATCHDOG_MS);
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    input += chunk;
    try { JSON.parse(input); } catch (e) { return; }
    finish(input);
  });
  process.stdin.on('error', () => finish(null));
  process.stdin.on('end', () => finish(input));
}

if (require.main === module) readHookPayload(logTurn);

module.exports = { logTurn, lastUserPrompt };
