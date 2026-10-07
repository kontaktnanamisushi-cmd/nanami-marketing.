import test from "node:test";
import assert from "node:assert/strict";
import { generateTemplate, visualRules, templateProvider } from "./generators";
import { initialStore, localDate } from "./data";
import { isStore } from "./storage";
const brand = initialStore().brand;
test("Post zawiera hook, treść, CTA, hashtagi i Stories oraz podaną promocję", () => {
  const result = generateTemplate(
    "posts",
    { dish: "Futomaki", promotion: "4 w cenie 3", goal: "zaangażowanie" },
    brand,
  );
  for (const label of ["Hook", "Treść posta", "CTA", "Hashtagi", "Stories"])
    assert.ok(result.sections.some((s) => s.label === label));
  assert.match(
    result.sections.find((s) => s.label === "Treść posta")!.text,
    /4 w cenie 3/,
  );
  assert.match(
    result.sections.find((s) => s.label === "CTA")!.text,
    /komentarzu/,
  );
});
test("Prompty zachowują liczbę kawałków i ograniczenia dla sushi", () => {
  for (const kind of ["photos", "reels", "ads"] as const) {
    const r = generateTemplate(
      kind,
      {
        dish: "Zestaw 24 kawałki",
        pieces: "24",
        category: "premium cinematic",
        light: "Ciepłe boczne światło",
        format: "4:5",
      },
      brand,
    );
    const prompt = r.sections.find((s) => /Prompt/.test(s.label))!.text;
    for (const phrase of [
      "dokładnie 24",
      "Bez pary",
      "bez przypadkowych dłoni",
      "bez dodatkowych składników",
      "naturalne tekstury",
    ])
      assert.ok(prompt.includes(phrase));
    if (kind !== "photos") assert.match(prompt, /9:16/);
  }
  assert.match(visualRules({}), /Nie zmieniaj liczby kawałków/);
});
test("Provider odrzuca pustą nazwę i pozwala wymienić implementację na API", async () => {
  await assert.rejects(
    templateProvider.generate("posts", { dish: "   " }, brand),
    /Podaj nazwę/,
  );
  const r = await templateProvider.generate(
    "ads",
    { dish: "Sashimi", platform: "Meta Ads", goal: "zasięg lokalny" },
    brand,
  );
  assert.match(
    r.sections.find((s) => s.label === "CTA")!.text,
    /Smardzewska 2/,
  );
  assert.ok(r.sections.some((s) => s.label === "Headline"));
});
test("Walidacja lokalnych danych odrzuca uszkodzone kopie i nieprawidłowe ceny", () => {
  const store = initialStore();
  assert.equal(isStore(store), true);
  assert.equal(isStore({ ...store, entries: [{ topic: "niepełny" }] }), false);
  assert.equal(isStore({ ...store, brand: null }), false);
  assert.equal(
    isStore({
      ...store,
      products: [
        {
          id: "1",
          name: "Sushi",
          category: "Sushi",
          description: "",
          promotion: "",
          image: "",
          price: NaN,
          active: true,
        },
      ],
    }),
    false,
  );
  assert.equal(isStore(null), false);
});
test("Daty kalendarza używają dnia lokalnego, bez konwersji UTC", () => {
  assert.equal(localDate(new Date(2026, 9, 7, 0, 5)), "2026-10-07");
  assert.equal(localDate(new Date(2026, 0, 2, 23, 55)), "2026-01-02");
});
test("Generator odrzuca nieprawidłową liczbę kawałków", () => {
  for (const pieces of ["0", "-3", "1.5", "abc", "501"]) {
    assert.throws(() => generateTemplate("photos", { dish: "Sushi", pieces }, brand), /Liczba kawałków/);
  }
});
test("Kategorie rolek mają odrębne ujęcia, fotografia ma kompletne wartości domyślne", () => {
  const shots = ["food porn", "premium cinematic", "dynamic commercial", "macro food", "exploded food", "slow motion", "viral reel"].map(category => generateTemplate("reels", { dish: "Sushi", category }, brand).sections.find(s => s.label === "Ujęcia")!.text);
  assert.equal(new Set(shots).size, 7);
  const photo = generateTemplate("photos", { dish: "Sushi" }, brand);
  assert.ok(!photo.sections[0].text.includes("undefined"));
});
