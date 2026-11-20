# Handoff dla CloudeWorkingStation: reguły z trybu custom do przeniesienia

Data: 2026-11-18. Autor: agent pracujący w repozytorium `E:\Coding\customizedCaveman`.
Adresat: agent pracujący w repozytorium `E:\Coding\__Windows2\CloudeWorkingStation` (skrót: CWS).

## 1. Po co ten dokument

W repozytorium customizedCaveman zmieniliśmy skill `custom` (reguły stylu odpowiedzi agenta). Część tych reguł ma własne kopie w skillu `conversation`, który leży w CWS i buduje formularz pod adresem `http://localhost:3001/conversation?...`. Dwie rzeczy z naszych ustaleń nie mogły być zrobione z tamtego repozytorium i zostają dla Ciebie:

1. Przepisanie czterech reguł w skillu `conversation` (punkt 3).
2. Zmiana kodu aplikacji: duże diagramy mają się otwierać w panelu obok rozmowy (punkt 4).

Nie zmieniaj niczego w customizedCaveman. Źródłem prawdy dla stylu jest tam plik `E:\Coding\customizedCaveman\skills\custom\SKILL.md`.

## 2. Skąd te decyzje

1. [FAKT] Wszystkie decyzje padły w formularzu `/conversation`: projekt `cws`, temat `custom-clarity-and-size`, sesja `8b0476bd-cfb5-4bfa-b30d-551c013219c3`. Plik tematu leży w `E:\Coding\__Windows2\CloudeWorkingStation\.debug\questions\8b0476bd-cfb5-4bfa-b30d-551c013219c3\custom-clarity-and-size.json`.
2. [FAKT] Każdy krok tematu ma wybrane rozwiązanie przez użytkownika. Pełny kontekst i dyskusję (z uzasadnieniami) znajdziesz w tym pliku, w polach `discussion` poszczególnych kroków.
3. [FAKT] Skill `custom` w customizedCaveman został już zaktualizowany (wersja wtyczki 4.0.18). Ten dokument dotyczy tylko tego, co zostało po stronie CWS.

## 3. Skill `conversation`: cztery reguły do przepisania

Plik: `E:\Coding\__Windows2\CloudeWorkingStation\.claude\skills\conversation\SKILL.md`. Reguły jakości pól są w sekcji „Jakość treści" (linie 93-189 w momencie pisania).

[IMPORTANT] Backend formularza odrzuca emoji w polach tekstowych (`400 invalid after value`), co skill `conversation` już opisuje (linia 343). Poniższy tekst jest bez emoji; nie dodawaj ich przy przepisywaniu.

### 3.1 Zdanie przed tabelą zamienić na regułę celu

- Dziś: reguła 8 w „Reguły dla wszystkich pól" (linia 106) mówi: „Tabela lub lista ma jednozdaniową zapowiedź z wnioskiem."
- Decyzja użytkownika: ta reguła jest mechaniczna i błędna co do sedna. Chodziło o to, żeby czytelnik zawsze wiedział, dlaczego mu coś pokazano.
- Powód (słowa użytkownika, skrócone): kiedyś pokazano mu tabelę bez żadnego wyjaśnienia, czym jest i po co; wyjaśnienie może stać w polu „kontekst" lub „opis".
- Proponowany tekst (do wklejenia w miejsce reguły 8):

> **Wyjaśnienie celu.** Każda tabela, lista, diagram lub blok kodu ma wyjaśnione: co pokazuje, po co go widzisz i jaki jest wniosek. Wyjaśnienie może stać w dowolnym miejscu przy elemencie (w opisie, kontekście lub zdaniu przed nim), byle czytelnik widział je przed elementem lub tuż obok. Element bez wyjaśnienia, po co go pokazujesz, jest błędem.

### 3.2 Punkty z myślnikami albo proza: kryterium zależne od budowy

- Dziś: żadna z dwunastu reguł nie mówi nic o długości ani budowie akapitu, więc zdarzają się długie, nieczytelne bloki.
- Decyzja użytkownika: kryterium NIE zależy od liczby zdań, bo i jedno zdanie może zawierać trzy równorzędne elementy, a czasem punkty nie mają sensu.
- Proponowany tekst (nowa reguła na końcu „Reguły dla wszystkich pól"):

> **Punkty czy proza.** Punkty z myślnikami stosuj, gdy treść to kilka równorzędnych elementów (kroki, warunki, dowody, opcje, przykłady). Test: czy każdy element da się przeczytać osobno i zrozumieć bez poprzedniego? Prozę stosuj, gdy elementy łączy ciąg przyczynowo-skutkowy („A, bo B, więc C"), bo punkty rozerwałyby logikę. Przy jednej myśli nie dawaj ani punktów, ani dłuższego akapitu, niż potrzeba. Liczba zdań nie jest kryterium.

- Przykłady do wklejenia obok reguły (z domeny formularza):
  - Punkty (równorzędne elementy): skala rozmiaru „XS: modyfikacja w kilku plikach / S: małe zadanie e2e z 1-5 endpointami / M: bardziej skomplikowane zadanie e2e".
  - Proza (ciąg przyczynowo-skutkowy): „Status wychodzi zielony, bo wszystkie wpisy w podstawie to fakty, ale znaczeniem ma być czerwony, bo odpowiedź mówi, że się nie da; dlatego reguła o statusach jest sprzeczna."

### 3.3 Przykład z domeny przy wyjaśnianiu

- Dziś: reguła 12 (linia 110) wymaga przykładu tylko przy decyzji o formie lub zachowaniu.
- Decyzja użytkownika: wymóg jest zbyt słabo zaakcentowany; przykład ma być oparty na domenie i kontekście rozwiązywanego problemu, a nie wymyślony od zera, chyba że losowy przykład jest dużo łatwiejszy do zrozumienia.
- Proponowany tekst (rozszerzenie reguły 12 na każde wyjaśnienie):

> **Przykład z domeny.** Wyjaśniając niejasną sprawę, regułę lub problem, dodaj przykład pochodzący z domeny i kontekstu rozwiązywanego problemu (np. z bieżącego tematu), a nie wymyślony od zera. Przykład ogólny dopuszczalny tylko wtedy, gdy domenowy byłby trudniejszy do zrozumienia. Przykładu nie dajesz, gdy sprawa jest oczywista. Przy decyzji o formie lub zachowaniu przykład jest zawsze potrzebny (jak dotąd).

### 3.4 Przykład do opcji, gdy różnica jest nieoczywista

- Dziś: nie ma reguły, że każda opcja ma własny przykład; zdarzało się pokazać przykład tylko jednej z dwóch, co nie pozwalało porównać.
- Decyzja użytkownika: łagodniejsza wersja. Przykłady są wartościowe, ale nie muszą być do każdej drobnej rzeczy.
- Proponowany tekst (do pola „Opis rozwiązania, opis kroku" w sekcji o etykiecie i opisie):

> **Przykład do opcji, gdy różnica nie jest oczywista.** Gdy z samych etykiet opcji nie widać, jak wyglądałby wynik każdej z nich, każda opcja dostaje „Scenariusz A", „Scenariusz B" z krótkim opisem i przykładem, w tym samym układzie i z tej samej sytuacji (przykłady równie szczegółowe). Gdy różnicę widać od razu (np. „tak" i „nie") albo opcje różnią się drobiazgiem, przykładu nie ma. Test: czy po samych etykietach czytelnik wie, jak wygląda wynik każdej opcji? Jeśli nie, dodaj przykład.

### 3.5 Opcjonalnie: dopasować regułę o weryfikacji

- [PROPOZYCJA] Reguła 2 w „Reguły dla wszystkich pól" (linia 100) mówi „najpierw sprawdź (przeczytaj kod, uruchom komendę)". W custom doszło do niej: buduj aplikację, uruchamiaj testy nawet gdy trwają długo, przypuszczenie tylko gdy sprawdzenie jest niemożliwe lub ekstremalnie drogie; pewność ważniejsza niż szybkość. Warto to dopisać, ale to nie jest decyzja z formularza dla skilla `conversation`, więc zapytaj użytkownika.

### 3.6 Po edycji skilla

- Przeczytaj `CLAUDE.md` w CWS: zawiera reguły projektu dotyczące edycji skilli (czy `SKILL.md` można edytować bezpośrednio, rejestr zależności itp.). [NIE WIEM] Nie czytałem go w tej sesji, więc nie wiem, co wymaga.
- Zaktualizuj przykłady w `references/create-template.json` i `references/agent-patch-template.json`, jeśli powielają stary styl (poprzednia analiza wskazała, że agent kopiuje wzorce).

## 4. Aplikacja CWS: duże diagramy w panelu obok

- Decyzja użytkownika: diagramy złożone z więcej niż paru elementów mają się wyświetlać w panelu obok rozmowy, a nie w treści odpowiedzi. To edycja kontrolki wyświetlającej, a nie skilla.
- Próg: 8 węzłów. [ZALOZENIE] Wartość zaproponowałem ja; użytkownik wybrał rozwiązanie z tym progiem, ale go nie ustalał. Skill `custom` dopuszcza diagramy do około 12 węzłów.

### 4.1 Co już jest w kodzie

1. [FAKT] Mermaid w treści renderuje `RichContent`: [RichContent.tsx](file:///E:/Coding/__Windows2/CloudeWorkingStation/App/src/components/Questionnaire/RichContent.tsx), [linie 47-60](file:///E:/Coding/__Windows2/CloudeWorkingStation/App/src/components/Questionnaire/RichContent.tsx#L47-L60). Blok jest zwijany i domyślnie otwarty (`useState(true)`, [linia 197](file:///E:/Coding/__Windows2/CloudeWorkingStation/App/src/components/Questionnaire/RichContent.tsx#L197)).
2. [FAKT] Kontrolka `DiagramBlock` ma przycisk „Otwórz w panelu" z podpowiedzią „Otwórz diagram w panelu obok rozmowy" i używa `useOpenPreview`: [DiagramBlock.tsx](file:///E:/Coding/__Windows2/CloudeWorkingStation/App/src/components/ClaudeSessions/DiagramBlock.tsx), [linie 34-38](file:///E:/Coding/__Windows2/CloudeWorkingStation/App/src/components/ClaudeSessions/DiagramBlock.tsx#L34-L38).
3. [FAKT] Formularz rozmów jest opakowany w obszar roboczy sesji (`SessionWorkspace`): [ConversationsApp.tsx](file:///E:/Coding/__Windows2/CloudeWorkingStation/App/src/components/Conversations/ConversationsApp.tsx), [linie 709-763](file:///E:/Coding/__Windows2/CloudeWorkingStation/App/src/components/Conversations/ConversationsApp.tsx#L709-L763). `RichContent` jest użyty tam w opisie rozwiązania (linia 2025), szczegółach (linia 2098) i w poście dyskusji (`DiscussionPostView.tsx`, linia 50).
4. [CZESCIOWO] Nie sprawdziłem w przeglądarce, czy przycisk „Otwórz w panelu" pojawia się w formularzu rozmów; wniosek wynika wyłącznie z kodu.

### 4.2 Co zrobić

1. Policz węzły diagramu mermaid w `RichContent` (istnieje narzędzie `App/src/components/EndpointFlowDiagram/utils/parseMermaidNodeId.ts`; [NIE WIEM] czy nadaje się do liczenia węzłów w ogólnym mermaidzie, tego nie czytałem).
2. Dla diagramu powyżej progu pokaż w treści tylko podgląd (np. zwinięty blok z przyciskiem „Otwórz w panelu") albo otwórz go od razu w panelu. Wybór między tymi dwoma wariantami nie był przedmiotem decyzji; zapytaj użytkownika.
3. Dopisz testy do `App/src/components/Questionnaire/__tests__/RichContent.test.tsx` (istnieje i dotyczy mermaida) i do `App/src/components/ClaudeSessions/__tests__/AnswerRichContent.test.tsx`, jeśli ten sam komponent jest tam używany.
4. Stosuj reguły CWS (`CLAUDE.md`, polityka kodu, testy), których ja nie czytałem.

## 5. Zakres, którego NIE dotykaj

- Skill `custom` i jego hooki w customizedCaveman.
- Zasady rozmiaru problemu (XS do XL), statusów, znaczników oceny i zmiany: dotyczą tylko stylu odpowiedzi w czacie, nie formularza. Formularz nie przyjmuje emoji w polach, więc znaczników ✅❌⚠️ ani kółek statusów tam nie przenoś.

## 6. Czego nie sprawdziłem

1. Nie czytałem `CLAUDE.md` w CWS ani reguł projektu.
2. Nie uruchamiałem aplikacji CWS ani jej testów.
3. Nie sprawdziłem, czy skill `conversation` jest też skopiowany do innych miejsc (worktree, `.claude/worktrees`); wyszukiwanie plików pokazało takie kopie `SKILL.md` w innych skillach, ale nie weryfikowałem tego dla `conversation`.
