import type { Brand, Generated, GeneratorInput } from "./types";
export type GeneratorKind = "posts" | "reels" | "photos" | "ads";
export interface GenerationProvider {
  generate(
    kind: GeneratorKind,
    input: GeneratorInput,
    brand: Brand,
  ): Promise<Generated>;
}
const section = (label: string, text: string) => ({ label, text });
export function visualRules(i: GeneratorInput) {
  return `Realistyczne jedzenie, naturalne tekstury, premium food photography, eleganckie ciemne tło, ciepłe boczne światło, realistyczne refleksy, mała głębia ostrości. Bez pary nad sushi, bez przypadkowych dłoni i pałeczek, bez dodatkowych składników. Nie zmieniaj liczby kawałków podanej w opisie${i.pieces ? `: dokładnie ${i.pieces} kawałków sushi` : ""}. Zachowaj skład i wygląd produktu; nie dodawaj niepodanych składników.`;
}
export function generateTemplate(
  kind: GeneratorKind,
  i: GeneratorInput,
  b: Brand,
): Generated {
  const dish = i.dish.trim();
  if (!dish) throw new Error("Podaj nazwę dania lub temat.");
  if (
    i.pieces &&
    (!/^\d+$/.test(i.pieces) || Number(i.pieces) < 1 || Number(i.pieces) > 500)
  ) {
    throw new Error("Liczba kawałków musi być całkowita, od 1 do 500.");
  }
  const cta =
    i.goal === "zaangażowanie"
      ? "Napisz w komentarzu, z kim podzielisz ten zestaw."
      : i.goal === "nowi obserwujący"
        ? `Obserwuj ${b.name} po kolejne inspiracje.`
        : i.goal === "zasięg lokalny"
          ? `Odwiedź nas: ${b.address}, ${b.city}.`
          : `Sprawdź menu i zamów: ${b.website}`;
  const promo = i.promotion ? ` ${i.promotion}.` : "";
  const hook =
    i.goal === "zaangażowanie"
      ? `${dish}. Z kim podzielisz się ostatnim kawałkiem?`
      : i.goal === "nowi obserwujący"
        ? `Poznaj ${b.name} od najbardziej apetycznej strony: ${dish}.`
        : `${dish}. Twój wieczór właśnie nabrał smaku.`;
  const context = `Odbiorcy: ${i.audience || `miłośnicy sushi w ${b.city}`}. Cel: ${i.goal || "sprzedaż"}. Ton: ${i.tone || b.tone}.`;
  if (kind === "posts")
    return {
      title: `Post · ${dish}`,
      sections: [
        section("Hook", hook),
        section(
          "Treść posta",
          `${dish} w ${b.name} — dobry powód, żeby na chwilę zwolnić i usiąść przy wspólnym stole.${promo}\n${i.goal === "zaangażowanie" ? "Wolisz wieczór we dwoje czy sushi z przyjaciółmi?" : `Odkryj swój ulubiony smak w ${b.city}.`}\n${b.address} · ${b.website}`,
        ),
        section("CTA", cta),
        section(
          "Hashtagi",
          `#NanamiSushi #Sushi #Poznań #SushiPoznań #FoodLovers #Kolacja`,
        ),
        section("Stories", `${dish} na dzisiejszy wieczór?${promo}\n${cta}`),
        section(
          "Wskazówki publikacji",
          `${i.type || "Post"} · ${context} Przed publikacją sprawdź dostępność i warunki promocji.`,
        ),
      ],
    };
  if (kind === "photos")
    return {
      title: `Prompt fotograficzny · ${dish}`,
      sections: [
        section(
          "Prompt do skopiowania",
          `Fotografia ${i.category || "sushi"} dla ${b.name}. Produkt: ${dish}. ${visualRules(i)} Światło: ${i.light || "Ciepłe boczne światło"}. Tło: ${i.background || "Eleganckie ciemne tło"}. Obiektyw: ${i.lens || "85 mm"}. Kąt kamery: ${i.angle || "45°"}. Głębia ostrości: ${i.depth || "Mała głębia ostrości"}. Styl: ${i.style || "Premium food photography"}. Format: ${i.format || "4:5"}. Kompozycja reklamowa z wolną przestrzenią na tekst, bez napisów i znaków wodnych.`,
        ),
        section(
          "Kontrola jakości",
          "Porównaj wygenerowany obraz z produktem: składniki, liczba kawałków i proporcje muszą się zgadzać. Użyj zdjęcia referencyjnego, jeśli narzędzie je obsługuje.",
        ),
      ],
    };
  const cinematic = /cinematic|slow motion|macro/.test(i.category || "");
  const categoryShots: Record<string, string> = {
    "food porn":
      "0–3 s: apetyczny detal rzeczywistego produktu. 3–7 s: zbliżenie na naturalne tekstury. 7–12 s: odsłonięcie całego talerza. 12–15 s: CTA.",
    "premium cinematic":
      "0–3 s: ciemny kadr i ciepły refleks na produkcie. 3–7 s: powolny przejazd kamery. 7–12 s: elegancka pełna kompozycja. 12–15 s: logo i CTA.",
    "dynamic commercial":
      "0–2 s: produkt i mocny hook. 2–5 s: trzy szybkie detale. 5–9 s: talerz w pełnym kadrze. 9–12 s: oferta jako napis w montażu. 12–15 s: CTA.",
    "macro food":
      "0–3 s: makro naturalnych ziaren ryżu. 3–7 s: detal rzeczywistych składników. 7–12 s: miękkie przejście ostrości na całą rolkę. 12–15 s: pełny talerz i CTA.",
    "exploded food":
      "0–3 s: kompletny produkt. 3–7 s: kontrolowane rozdzielenie jego rzeczywistych elementów w kompozycji. 7–12 s: powrót do identycznego produktu, bez zmiany składników i liczby kawałków. 12–15 s: CTA.",
    "slow motion":
      "0–3 s: powolny najazd na talerz. 3–7 s: detal produktu w 60 fps odtworzony w 30 fps. 7–12 s: delikatne przesunięcie światła bez ruchu jedzenia. 12–15 s: spokojna plansza CTA.",
    "viral reel":
      "0–2 s: POV — plan na wieczór pojawia się na stole. 2–5 s: szybkie zbliżenie produktu. 5–10 s: detal i tekst „Z kim dzielisz ostatni kawałek?”. 10–15 s: pełny talerz i zaproszenie do komentarza.",
  };
  const shots =
    categoryShots[i.category] ||
    (cinematic
      ? "0–3 s: makro tekstury sushi. 3–7 s: powolny przejazd wzdłuż talerza. 7–12 s: pełna kompozycja. 12–15 s: plansza CTA."
      : "0–2 s: mocne zbliżenie produktu. 2–5 s: detal z innego kąta. 5–9 s: cała kompozycja. 9–12 s: produkt i hook. 12–15 s: CTA.");
  const video = `Film reklamowy ${b.name}, ${i.category || "premium cinematic"}, produkt: ${dish}, format 9:16, 15 sekund. ${visualRules(i)} ${shots} Kamera: ${cinematic ? "powolny, stabilny dolly-in" : "krótkie, stabilne przejazdy i rytmiczne cięcia"}. Bez deformacji jedzenia, migotania i napisów generowanych w obrazie. Tekst i logo dodaj w montażu. ${context}`;
  if (kind === "reels")
    return {
      title: `Rolka · ${dish}`,
      sections: [
        section(
          "Pomysł",
          `${i.category}: ${dish} jako główny bohater krótkiego, apetycznego filmu.${promo}`,
        ),
        section("Hook pierwszych sekund", hook),
        section(
          "Scenariusz",
          `Pokaż detal, odsłoń kompozycję, zakończ zaproszeniem do ${b.name}. ${i.category === "exploded food" ? "Rozdzielenie elementów wyłącznie jako świadomy efekt montażowy; zachowaj wszystkie rzeczywiste składniki i liczbę kawałków." : ""}`,
        ),
        section("Ujęcia", shots),
        section(
          "Ruch kamery",
          cinematic
            ? "Powolny dolly-in, stabilny slider, delikatna zmiana ostrości."
            : "Krótki push-in, stabilne przejścia między detalem a planem całości.",
        ),
        section(
          "Światło",
          "Ciepłe boczne światło, miękki kontrast, realistyczne refleksy, ciemne tło.",
        ),
        section(
          "Montaż",
          `${cinematic ? "Spokojne cięcia, dłuższe detale" : "Rytmiczne cięcia w takt muzyki"}; napisy w bezpiecznym obszarze 9:16. Użyj muzyki z prawem do publikacji reklamowej.`,
        ),
        section("CTA", cta),
        section("Prompt AI video", video),
      ],
    };
  return {
    title: `Reklama · ${dish}`,
    sections: [
      section("Hook", hook),
      section(
        "Primary text",
        `${dish} w ${b.name}. Zaplanuj dobry wieczór w ${b.city}.${promo} ${cta}`,
      ),
      section("Headline", `${dish} · ${b.name}`),
      section("CTA", cta),
      section(
        "Koncepcja grafiki",
        `Produkt na eleganckim ciemnym tle. Krótki nagłówek, logo ${b.name}, czytelne CTA. ${i.platform} · ${context}`,
      ),
      section("Koncepcja filmu", shots),
      section("Prompt AI", video),
      section(
        "Przed emisją",
        "Potwierdź ceny i warunki promocji. Dobierz obszar lokalny i budżet w panelu reklamowym. Ten generator nie publikuje reklam.",
      ),
    ],
  };
}
export const templateProvider: GenerationProvider = {
  async generate(kind, input, brand) {
    return generateTemplate(kind, input, brand);
  },
};
