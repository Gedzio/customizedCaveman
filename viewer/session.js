// Dane sesji (schemat lean). Docelowo: JSONL append — agent dopisuje JEDNA ture per odpowiedz.
// turn = { prompt, items[], danger?[], need?[] }
// item = { q?, m, teza, detal, dow?[], opcje?[], rekomendacja?, opinia? }
//   q         tylko gdy >1 item (mapowanie 1:1 do promptu); status liczony z m przez widok
//   opcje     [{id,label,nota?}] punkt decyzyjny -> radio (widok sam dokleja "wlasna odpowiedz"); nielimitowane
//   rekomendacja  id rekomendowanej opcji (gdy mam zdanie)
//   opinia    { kryteria:[{k,w,why}], opcje:[{n,oceny[],src?}], wynik } — wagi 1-5, oceny -2..+2, wynik=suma(w*ocena)
// W teza/detal dozwolony lekki markdown: **pogrubienie** i `kod`.
window.SESSION = {
  topic: "Budowa trybu custom: markery, bramka wartości i podgląd rozmowy",
  title: "Konsola Markerów",
  updated: "2026-11-09",
  turns: [
    {
      prompt: "Czym różni się Skill od Output Style w cavemanie?",
      items: [
        { m:"[KLAMALEM!!]",
          teza:"Skill w cavemanie jest **wymuszany hookiem** SessionStart — nie wymaga triggera, więc moje wcześniejsze `[FAKT]` było błędne.",
          detal:"Oparłem się na **domyślnym** zachowaniu skilli zamiast sprawdzić hooki tego repo. Caveman ustawia tryb na starcie sesji, więc działa **zawsze** po ustawieniu konfiguracji.",
          dow:["file:///E:/Coding/customizedCaveman/.claude-plugin/plugin.json","hook: SessionStart → caveman-activate.js"] }
      ]
    },
    {
      prompt: "Jaką teraz mam wersję zaczytaną?",
      items: [
        { m:"[FAKT][ZROBILEM]",
          teza:"Wczytana wersja to **4.0.2** — nowa treść, nie stara.",
          detal:"Cache na dysku ma nowy opis skilla i **11 trafień** nowych tokenów; stary `4.0.1` został przycięty.",
          dow:["file:///C:/Users/ka/.claude/plugins/cache/customizedCaveman/customizedCaveman/4.0.2/skills/custom/SKILL.md"] }
      ]
    },
    {
      prompt: "Co zostało do zrobienia? HTML? JSON? Co brakuje? Łączyć backlog z TODO?",
      items: [
        { q:"Co zostało do zrobienia?", m:"[FAKT]",
          teza:"Zostały **4 rzeczy**: flaga operacji, próg stop-vs-jedź, Faza D (json/html), weryfikacja na żywo.",
          detal:"Legacy w pełni wchłonięta do `SKILL.md` — reszta reguł już jest.",
          dow:["grep → test-markery tylko w SKILL.legacy.md"] },
        { q:"Jak ma wyglądać widok HTML?", m:"[PROPOZYCJA]",
          teza:"Statyczna **konsola** ze scrollem przez tury i nawigacją w railu.", detal:"Prototyp, który właśnie oglądasz." },
        { q:"Jaka struktura JSON?", m:"[PROPOZYCJA]",
          teza:"`turns[] → items[]` z markerem, tezą i detalem.", detal:"Puste pola pomijane; status liczony z markerów." },
        { q:"Co jeszcze brakuje?", m:"[OPINIA]",
          teza:"Największa luka to **mechanizm przechwytywania** — jak output agenta trafia do danych.",
          detal:"Bez niego widok żyje na sztucznych danych. To decyduje o całej pętli." },
        { q:"Łączyć backlog z TODO?", m:"[OPINIA]",
          teza:"**Tak** — jeden plik, dwie sekcje: Do zrobienia + Do rozstrzygnięcia.",
          detal:"Jedno miejsce do pilnowania, a podział zdecydowane/otwarte zostaje." }
      ],
      need:["Widok jako plik lokalny czy panel w workstation?","Dane zapisywane co odpowiedź czy na żądanie?"]
    },
    {
      prompt: "Odśwież plugin — zrób reset i wymuś stan z repo.",
      items: [
        { m:"[DANGER][POTRZEBUJE]",
          teza:"Odświeżenie pluginu **nie wymaga** resetu — wystarczy bump wersji + update + restart.",
          detal:"Twardy `git reset --hard` **skasowałby niezcommitowane zmiany** bez cofnięcia, więc nie robię go bez Twojej zgody.",
          dow:["git status → 2 pliki niezcommitowane"] }
      ],
      danger:["git reset --hard skasuje niezcommitowane zmiany nieodwracalnie — najpierw commit albo stash."],
      need:["Potwierdź twardy reset, albo wskaż co zachować przed nim."]
    },
    {
      prompt: "Co robimy dalej?",
      items: [
        { m:"[NIE WIEM][POTRZEBUJE]",
          teza:"Bez Twojej decyzji **nie wiem**, co jest priorytetem.",
          detal:"Kierunki w grze: design widoku, mechanizm danych, albo powrót do reguł skilla." }
      ],
      need:["Wybierz kierunek: (a) design widoku, (b) mechanizm danych, (c) reguły skilla."]
    },
    {
      prompt: "Dopracujmy: statusy pod-pytań, formatowanie odpowiedzi, strukturę JSON. Czy JSON to najlepsza forma, czy coś oszczędniejszego?",
      items: [
        { q:"Statusy pod-pytań — sensowna definicja?", m:"[PROPOZYCJA]",
          teza:"**Kasujemy** osobne pole status — widok **wylicza** je z markerów.",
          detal:"`[POTRZEBUJE]`/`[NIE WIEM]` → otwarte, `[CZESCIOWO]` → częściowe, reszta → pełne. Jedno źródło prawdy, jedno pole mniej do pomylenia." },
        { q:"Emfaza/formatowanie w odpowiedziach?", m:"[PROPOZYCJA]",
          teza:"Każda odpowiedź = **teza** (wyróżniona) + **detal** (zwijalny), z lekkim markdownem.",
          detal:"Teza to jednozdaniowy precyzyjny konkret; detal to rozwinięcie pod spodem, zwijane na stronie. Przy kilku propozycjach **każda** ma własną tezę + detal." },
        { q:"Struktura JSON?", m:"[PROPOZYCJA]",
          teza:"Lean JSON: `turns[] → items[]{q?, m, teza, detal, dow?}`, puste pola pomijane.",
          detal:"Klucze stałe i krótkie; model emituje tylko wartości." },
        { q:"JSON czy coś oszczędniejszego?", m:"[OPINIA]",
          teza:"**JSON zostaje**, ale zapisujemy go **append per tura** (JSONL) — nie przepisujemy historii.",
          detal:"Decyduje **niezawodność emisji przez model**: własny DSL i markdown-jako-dane odpadają, bo parsowanie jest kruche i mnoży błędy. Realny zysk tokenowy nie leży w formacie, tylko w tym, że każda odpowiedź emituje **tylko swoją turę**, a nie całą rozmowę." }
      ]
    }
  ]
};
