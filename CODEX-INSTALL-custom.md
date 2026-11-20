# Instalacja trybu `custom` (customizedCaveman) na Codex CLI

Instrukcja na później. Dotyczy forka w `E:\Coding\customizedCaveman` z dodanym trybem `custom`.
Droga przez installer forka (fork NIE korzysta z natywnego marketplace'u Codeksa — instaluje się przez mechanizm `skills` + hook SessionStart).

Wszystkie komendy w terminalu (bash). Na Windows używaj ukośników w przód (`/`), bo bash zjada `\`.

## Krok 0 — Codex CLI zainstalowany?
```
codex --version
```
Jeśli brak:
```
npm i -g @openai/codex
```

## Krok 1 — wejdź do katalogu forka
```
cd /e/Coding/customizedCaveman
```

## Krok 2 — (opcjonalnie) podgląd bez zmian
```
node installer/install.js --only codex --dry-run
```

## Krok 3 — instalacja integracji Codeksa
```
node installer/install.js --only codex
```
Kopiuje payload (razem z `skills/custom/SKILL.md`) do `~/.codex/caveman/` i dodaje wpis hooka SessionStart do `~/.codex/hooks.json`.

## Krok 4 — włącz funkcję hooków, jeśli wyłączona
```
codex features list
```
Jeśli `hooks` = off, dopisz do `C:\Users\ka\.codex\config.toml`:
```toml
[features]
hooks = true
```

## Krok 5 — zaufaj hookowi
W Codeksie wpisz `/hooks` i zatwierdź ten od caveman (Codex nie uruchomi nowego hooka bez zgody).

## Krok 6 — włącz tryb custom
Domyślny tryb to `off`, a Codex ustala tryb na starcie sesji. Wybierz jedno:
- Dla konkretnego projektu (zalecane): utworz `.caveman.json` w korzeniu projektu:
  ```json
  {"defaultMode":"custom"}
  ```
- Albo globalnie do testu: `C:\Users\ka\AppData\Roaming\caveman\config.json` -> `{"defaultMode":"custom"}`
  (uwaga: to wlaczy custom takze w Claude Code).

## Krok 7 — odpal NOWĄ sesję Codeksa
Uruchom Codex w tym projekcie, zadaj dowolne pytanie. Odpowiedz powinna zaczynac sie od:
```
!!!Jestem w trybie Custom caveman.
```

## Krok 8 — diagnoza, jeśli nie działa
- Czy istnieje `C:\Users\ka\.codex\caveman\skills\custom\SKILL.md` (dowod, ze installer skopiowal tryb)?
- Czy `~/.codex/hooks.json` ma wpis `caveman` i czy zostal zaufany przez `/hooks`?

## Uwaga: `$custom` na żądanie
Wywolanie `$custom` (Codex wola skille przez `$`) NIE poniesie naszej wersji, dopoki fork nie jest wypchniety na GitHub i wskazany instalatorowi — ta droga ciagnie skille z `JuliusBrussee/caveman` (oryginal). Pewna droga teraz = hook SessionStart + domyslny tryb (powyzej).

## Opcja docelowa (lepsza, na potem)
Codex ma wlasny marketplace pluginow (od marca 2026): `codex plugin marketplace add owner/repo` + `/plugins`. Docelowo mozna wystawic fork jako natywny plugin Codeksa i instalowac tak jak w Claude Code. Wymaga: wypchniecia forka na GitHub + manifestu pluginu Codeksa (do sprawdzenia, czy fork jest gotowy).
