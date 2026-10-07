import type { Store } from "./types";
export const ctas = [
  "Zamów online",
  "Zamów Nanami Sushi",
  "Sprawdź menu",
  "Zarezerwuj swoje sushi",
  "Napisz do nas",
  "Odwiedź Nanami Sushi",
];
export const hookCategories = [
  "ciekawość",
  "głód",
  "promocja",
  "premium",
  "FOMO",
  "lokalny Poznań",
  "viral",
  "nowość",
];
export const hooks: Record<string, string[]> = {
  ciekawość: [
    "Co sprawia, że ten pierwszy kęs zostaje w pamięci?",
    "Jeden wieczór. Kilka rolek. Którą wybierzesz?",
    "Spójrz bliżej. Tu każdy detal ma znaczenie.",
  ],
  głód: [
    "Twój wieczór właśnie nabrał smaku.",
    "Chrupiący pierwszy kęs. Delikatny środek.",
    "Dzisiaj masz ochotę na coś naprawdę dobrego.",
  ],
  promocja: [
    "Czwartek smakuje lepiej: 4 futomaki w cenie 3.",
    "Więcej sushi do wspólnego stołu.",
    "Dobry plan na wieczór? Sprawdź naszą promocję.",
  ],
  premium: [
    "Prostota, w której czuć jakość.",
    "Mały rytuał. Duża przyjemność.",
    "Wieczór wart dobrego sushi.",
  ],
  FOMO: [
    "Zanim zaplanujesz kolację, zajrzyj do naszego menu.",
    "Czwartkowy plan? Futomaki przy wspólnym stole.",
    "Nie odkładaj dobrego wieczoru na później.",
  ],
  "lokalny Poznań": [
    "Poznań, dzisiaj widzimy się przy sushi.",
    "Smardzewska 2. Twój przystanek po dobry smak.",
    "Jeżyce czy Grunwald? Dobry wieczór zaczyna się od sushi.",
  ],
  viral: [
    "POV: ktoś mówi „weźmy tylko jedną rolkę”.",
    "Wyślij to osobie, z którą dzielisz ostatni kawałek.",
    "Sushi na ekranie. Teraz czas na sushi na stole.",
  ],
  nowość: [
    "Nowy powód, żeby zajrzeć do menu.",
    "Poznaj swój kolejny ulubiony smak.",
    "Coś nowego przy naszym stole.",
  ],
};
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function initialStore(): Store {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return {
    brand: {
      name: "Nanami Sushi",
      city: "Poznań",
      address: "Smardzewska 2",
      website: "www.nanamisushi.pl",
      tone: "Premium, apetyczny, nowoczesny, bez przesadnego języka reklamowego",
    },
    promotions: [
      {
        id: "promo-1",
        name: "4 futomaki w cenie 3",
        day: "Czwartek",
        description:
          "Czwartkowa promocja Nanami Sushi. Szczegóły i dostępność potwierdź przed publikacją.",
      },
    ],
    products: [],
    entries: [
      {
        id: "entry-1",
        date: localDate(today),
        time: "18:00",
        platform: "Instagram",
        topic: "Wieczór w Nanami",
        category: "Reel",
        status: "Do przygotowania",
        cta: "Sprawdź menu",
      },
      {
        id: "entry-2",
        date: localDate(tomorrow),
        time: "12:00",
        platform: "Instagram",
        topic: "4 futomaki w cenie 3",
        category: "Post",
        status: "Pomysł",
        cta: "Zamów online",
      },
    ],
  };
}
