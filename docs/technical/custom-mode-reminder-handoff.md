# Tryb custom: przypomnienie doklejane do każdej wiadomości (notatka dla agenta)

Data: 2026-11-18. Status: **nic nie zmieniono w kodzie**; notatka przekazuje ustalenia z długiej sesji do dalszej pracy.

## Problem w jednym zdaniu

Do każdej wiadomości użytkownika hook doklejał krótkie przypomnienie o **zwięzłości** („Answer only what was asked: no unrequested background, lists, examples…"), a nie o regułach custom (marker na początku, numery i skróty zawsze z wyjaśnieniem, zdanie otwierające). Po kilkudziesięciu wywołaniach narzędzi agent przestawał stosować pełne reguły, które dostał tylko raz na starcie sesji.

## Ustalenia (z kodem)

1. Pełny tekst `skills/custom/SKILL.md` trafia do agenta **raz**, w hooku `SessionStart` (`src/hooks/caveman-activate.js`), i ponownie tylko przy zmianie trybu w trakcie sesji (`src/hooks/caveman-mode-tracker.js`, linie 376-392).
2. Przy zwykłej wiadomości `UserPromptSubmit` uruchamia `src/hooks/caveman-mode-tracker.js`. Funkcja `reinforcementForMode` (linie 115-121) składa: `CAVEMAN MODE ACTIVE (<tryb>). ` + linia tezy + stałe zdanie o zakresie odpowiedzi. Zdanie jest **to samo dla każdego trybu**; komentarz w liniach 112-114 mówi o „wszystkich trzech trybach" (caveman, ultracave, megacave), więc custom je dziedziczy bez żadnego warunku.
3. „Linia tezy" to `thesisLine` w `src/hooks/caveman-config.js` (linie 822-831): pierwsza niepusta linia pod nagłówkiem `# <id>` w pliku `skills/<id>/SKILL.md`.
   - Dla custom widziałem w przypomnieniu: `CAVEMAN MODE ACTIVE (custom). ## Cel (po co ten tryb) Answer only what was asked: …`. Czyli teza = **nagłówek**, a nie zdanie. Tego nagłówka nie weryfikowałem w pliku, tylko w tekście przypomnienia; `skills/custom/SKILL.md` ma niezacommitowane zmiany, więc sprawdź aktualną treść.
   - `FALLBACK_THESIS` (linie 778-782) nie ma klucza `custom`. Gdy w pliku nie ma nagłówka `# custom`, `thesisLine` zwróci `undefined`, a przypomnienie dostanie ten tekst. To wniosek z czytania kodu, nie uruchomiony przypadek.
4. Zdanie o zakresie jest zablokowane testami: `tests/test_mode_tracker_stdin.js` (linie 254-263), `tests/test_mode_tracker_ruleset.js` (linie 133 i 197) oraz migawką `evals/snapshots/reminder.json` (linia 11). Zmiana wymaga ich dostosowania.
5. Zbiór plików hooków jest przypięty w `checksums.sha256` i `tests/verify_repo.py` (komentarz w `caveman-config.js`, linie 767-771), więc po edycji hooków trzeba je zaktualizować.

## Dlaczego to szkodzi custom

- Własna bramka wartości custom jest podobna („odpowiadasz tylko na zadane pytanie"), ale przypomnienie dodaje zakaz „list, przykładów, omówień", a custom wymaga tabel, drzew punktów, przykładów i diagramów.
- Przypomnienie wypiera tezę trybu, więc reguły o wyjaśnianiu numerów, skrótów i o zdaniu otwierającym z markerem nie są przypominane wcale.

## Możliwe poprawki (do decyzji)

1. W `skills/custom/SKILL.md` wstawić **prawdziwe jednozdaniowe tezy** tuż pod `# custom` (z kluczowymi regułami: marker na początku, numer i skrót zawsze z wyjaśnieniem) i dodać wpis `custom` do `FALLBACK_THESIS`.
2. W `reinforcementForMode` dla `custom` pominąć stałe zdanie o zakresie albo zastąpić je zdaniem o regułach wyjaśniania i markerach.
3. Dostosować trzy miejsca z punktu 4 i przeliczyć sumy kontrolne.

## Czego nie sprawdzono

- Nie uruchamiałem testów ani hooka.
- Nie sprawdzałem, czy inne hosty (opencode, codex, gemini) i katalog `dist/` mają własną kopię tej logiki.
- Przyczyna zachowania agenta jest hipotezą (kontekst, w którym pełne reguły są daleko, a na bieżące zachowanie mocniej działa krótkie przypomnienie), nie zmierzonym faktem.
