# nanami-marketing.

## Nanami Marketing AI

Polski panel marketingowy dla Nanami Sushi (Poznań, Smardzewska 2). Next.js 15, React 19, TypeScript i Tailwind CSS 4. Działa bez płatnych API, kont zewnętrznych i kluczy. Generowanie odbywa się przez lokalne szablony; aplikacja nie publikuje treści ani reklam automatycznie.

### Uruchomienie

Wymagany Node.js 22 lub 24 LTS i npm. Z katalogu repozytorium:

```bash
npm ci
npm run dev
```

Otwórz aplikację w przeglądarce na porcie 3000. Tryb produkcyjny:

```bash
npm run build
npm run start
```

### Weryfikacja

```bash
npm run lint
npm test
npm run build
```

Lint nie dopuszcza ostrzeżeń. Testy sprawdzają kompletność generowanych treści, zasady promptów i zachowanie liczby kawałków, wymienny provider, walidację danych i lokalne daty kalendarza. Dodatkowo podczas implementacji sprawdzono przepływy w Chromium: generatory, planowanie, zapis produktów i promocji, ustawienia, biblioteki, tydzień/miesiąc oraz mobilną nawigację.

### Moduły

- Dashboard: zadania na dziś, zaplanowane publikacje, promocje, inspiracje i szybkie akcje.
- Generator postów: hook, treść, CTA, hashtagi i Stories.
- Generator rolek: 7 kategorii, scenariusz, ujęcia, kamera, światło, montaż, CTA i prompt video 9:16.
- Prompty fotograficzne: kategoria produktu, światło, tło, obiektyw, kąt, głębia ostrości, styl, format i dokładna liczba kawałków.
- Generator reklam: Instagram, Facebook i Meta Ads; teksty, koncepcja grafiki, filmu i prompt AI.
- Biblioteka 24 hooków w 8 kategoriach oraz 6 CTA z kopiowaniem.
- Kalendarz: tydzień/miesiąc, dodawanie, edycja, usuwanie, statusy, platforma i CTA. Daty i godziny odnoszą się do czasu lokalnego użytkownika.
- Promocje: zapis, edycja i usuwanie; przykład „4 futomaki w cenie 3” w czwartek.
- Produkty: nazwa, kategoria, opis, cena, promocja, zdjęcie JPG/PNG/WebP do 1 MB i aktywność. Baza startuje pusta, aby nie wprowadzać fikcyjnych cen.
- Ustawienia marki: dane restauracji i styl komunikacji, zasady wizualne Nanami i eksport JSON.

### Dane i ograniczenia pierwszego etapu

Produkty, promocje, kalendarz i marka są zapisywane w `localStorage` pod kluczem `nanami-marketing-v1`. Pozostają po odświeżeniu strony, ale tylko w tej samej przeglądarce i pod tym samym adresem aplikacji. Nie ma logowania, bazy serwerowej ani synchronizacji między urządzeniami. Zdjęcia są zapisane lokalnie jako data URL. Limit pamięci zależy od przeglądarki; błąd zapisu jest wyświetlany i nie oznacza sukcesu.

Eksportuj kopię JSON w ustawieniach lub w stopce przed wyczyszczeniem pamięci. Na tym etapie odtworzenie kopii wymaga ręcznego przywrócenia jej do localStorage; import przez interfejs jest kolejnym możliwym rozszerzeniem. Uszkodzony zapis blokuje nadpisanie; panel umożliwia świadomy reset. Przykładowe wpisy kalendarza powstają tylko przy pierwszym otwarciu. Wygenerowane materiały pozostają w bieżącym widoku do czasu przełączenia modułu — kopiuj je przed opuszczeniem generatora. Przycisk „Zaplanuj publikację” przenosi tytuł i kategorię do formularza kalendarza.

Prompty opisują realistyczne jedzenie, naturalne tekstury, premium food photography, ciemne tło, ciepłe boczne światło, refleksy i małą głębię ostrości. Sushi bez pary, losowych dłoni/pałeczek i dodatkowych składników. Podana liczba kawałków jest zachowywana w instrukcji. Wynik zewnętrznego narzędzia obrazowego należy porównać z produktem. Teksty i warunki promocji wymagają zwykłej korekty przed publikacją.

### Struktura

```text
src/
  app/
    page.tsx                # wejście aplikacji
    layout.tsx              # język PL i metadane
    globals.css             # Tailwind, motyw i responsywność
  components/
    marketing-app.tsx        # nawigacja, dashboard i lokalny zapis
    generator.tsx           # formularze i wyniki generatorów
    calendar.tsx            # kalendarz i edycja wpisów
    collections.tsx         # produkty, promocje, marka
    ui.tsx                  # pola, kopiowanie, puste stany
  lib/
    types.ts                # model danych
    data.ts                 # marka, hooki, CTA i przykłady
    generators.ts           # provider i szablony treści
    generators.test.ts      # testy jednostkowe
    storage.ts              # walidacja zapisanych danych
public/
  sushi-art.svg             # lokalna ilustracja, bez zewnętrznych assetów
```

### Przyszłe API AI

Interfejs `GenerationProvider` w `src/lib/generators.ts` oddziela formularze od generowania. Nowy provider może wywoływać przyszły Route Handler Next.js, który łączy się z modelem AI po stronie serwera. Klucze muszą pozostać po stronie serwera. Obecna wersja nie wymaga `.env`; dlatego nie dodano pustego `.env.example`.

Proponowana kolejność rozwoju: baza danych i logowanie, zapis wersji materiałów i import kopii, następnie opcjonalny provider AI oraz integracja publikacji Meta po uzyskaniu odpowiednich uprawnień.
