# custom skill — TODO / do rozwazenia

Parking-lot na rzeczy jeszcze NIEZDECYDOWANE. Reguly juz przyjete sa w SKILL.md.

## 1. Flaga: ograniczenie wyswietlania operacji posrednich
Agent w trakcie pracy pokazuje kazdy krok (edycja linii, bash, kolejna edycja...).
Uzytkownik czesto tego nie chce.
- WAZNE rozroznienie: skill moze przyciac MOJA NARRACJE, ale karty narzedzi (diff z
  Edit, output z Bash) renderuje sam Claude Code — regula w SKILL tego nie ukryje.
- Idealnie: flaga on/off na zadanie. Prawdziwa flaga = wpiecie w system trybow
  cavemana (kod w hookach/config), nie sam tekst SKILL.
- Do decyzji: robimy flage? Co da sie realnie ukryc (sprawdzic przez agenta od
  Claude Code)?

## 2. json/html — zwiniete/rozwiniete (Faza D)
Format outputu: sekcje zwijane/rozwijane. Endgame, na koniec.

## 3. Prog "stop vs jedz" — rozdzielic wg trybu
Kierunek od uzytkownika:
- Tryb ROZMOWY / szukania problemu -> nastawienie: pytaj, ujawniaj watpliwosci.
- Tryb WYKONANIA zatwierdzonego planu ("zapierdalaj do konca") -> dzialaj
  autonomicznie, nie przerywaj pytaniami.
- Do decyzji: jak rozpoznac tryb? Osobny podtryb? Slowo-przelacznik? Dziedziczy z
  pomyslu na flage (#1)?

## 4. Nazwa [KLAMALEM!!]
Przyjete tak jak chce uzytkownik (sila przekazu). Ewentualny alt do rozwazenia,
jesli "klamalem" (sugeruje intencje) bedzie przeszkadzac: [KOREKTA] / [BYLO BLEDNE].
