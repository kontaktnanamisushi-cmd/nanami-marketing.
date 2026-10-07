"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Sparkles,
  FileText,
  Check,
  CalendarPlus,
} from "lucide-react";
import { templateProvider, type GeneratorKind } from "@/lib/generators";
import type { Brand, Generated, GeneratorInput } from "@/lib/types";
import { CopyButton, Field } from "./ui";
const goals = [
  "sprzedaż",
  "nowi obserwujący",
  "zaangażowanie",
  "promocja konkretnego produktu",
  "ruch na stronie",
];
const reelCategories = [
  "food porn",
  "premium cinematic",
  "dynamic commercial",
  "macro food",
  "exploded food",
  "slow motion",
  "viral reel",
];
const photoCategories = [
  "sushi",
  "sashimi",
  "rolki",
  "zestawy sushi",
  "dania ciepłe",
  "fotografia reklamowa",
  "fotografia premium",
  "macro food photography",
];
export default function Generator({
  kind,
  brand,
  notify,
  schedule,
}: {
  kind: GeneratorKind;
  brand: Brand;
  notify: (s: string) => void;
  schedule: (title: string, category: string) => void;
}) {
  const [input, setInput] = useState<GeneratorInput>({
    dish: "",
    type: "Post w feedzie",
    goal: "sprzedaż",
    promotion: "",
    audience: "Miłośnicy sushi w Poznaniu",
    tone: brand.tone,
    category: kind === "photos" ? "sushi" : "premium cinematic",
    light: "Ciepłe boczne światło",
    background: "Eleganckie ciemne tło",
    lens: "85 mm",
    angle: "45°",
    depth: "Mała głębia ostrości",
    style: "Premium food photography",
    format: kind === "reels" ? "9:16" : "4:5",
    platform: "Instagram",
    pieces: "",
  });
  const [result, setResult] = useState<Generated | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (k: string, v: string) =>
    setInput((old) => ({ ...old, [k]: v }));
  const field = (
    key: string,
    label: string,
    options?: string[],
    type?: string,
    required = false,
  ) => (
    <Field
      key={key}
      label={label}
      value={input[key] || ""}
      onChange={(v) => update(key, v)}
      options={options}
      type={type}
      required={required}
    />
  );
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (
        input.pieces &&
        (!/^\d+$/.test(input.pieces) ||
          Number(input.pieces) < 1 ||
          Number(input.pieces) > 500)
      )
        throw new Error("Liczba kawałków musi być całkowita, od 1 do 500.");
      setResult(await templateProvider.generate(kind, input, brand));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Nie udało się wygenerować materiału.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="generator-layout">
      <form className="panel generator-form" onSubmit={submit}>
        <div className="panel-heading">
          <div className="icon-tile">
            <FileText size={20} />
          </div>
          <div>
            <h2>Szczegóły materiału</h2>
            <p>Dobry brief to początek dobrej treści.</p>
          </div>
        </div>
        <div className="form-grid">
          {field("dish", "Nazwa dania / temat", undefined, "text", true)}
          {kind === "posts" &&
            field("type", "Typ publikacji", [
              "Post w feedzie",
              "Karuzela",
              "Stories",
            ])}
          {kind === "ads" &&
            field("platform", "Platforma", [
              "Instagram",
              "Facebook",
              "Meta Ads",
            ])}
          {(kind === "posts" || kind === "ads") &&
            field(
              "goal",
              "Cel publikacji",
              kind === "ads"
                ? [
                    "sprzedaż",
                    "zamówienia online",
                    "pozyskanie nowych klientów",
                    "zasięg lokalny",
                    "remarketing",
                  ]
                : goals,
            )}
          {(kind === "posts" || kind === "ads" || kind === "reels") &&
            field("promotion", "Promocja (opcjonalnie)")}
          {kind !== "photos" && field("audience", "Grupa odbiorców")}
          {kind !== "photos" && field("tone", "Ton komunikacji")}
          {kind === "reels" && field("category", "Kategoria", reelCategories)}
          {kind === "photos" && (
            <>
              {field("category", "Kategoria", photoCategories)}
              {field("light", "Rodzaj światła", [
                "Ciepłe boczne światło",
                "Miękkie boczne światło studyjne",
                "Ciepłe światło okienne",
              ])}
              {field("background", "Tło", [
                "Eleganckie ciemne tło",
                "Ciemny kamień",
                "Ciemne drewno",
              ])}
              {field("lens", "Obiektyw", ["85 mm", "100 mm macro", "50 mm"])}
              {field("angle", "Kąt kamery", [
                "45°",
                "Z góry 90°",
                "Poziom talerza",
              ])}
              {field("depth", "Głębia ostrości", [
                "Mała głębia ostrości",
                "Mała głębia ostrości, produkt w całości czytelny",
              ])}
              {field("style", "Styl", [
                "Premium food photography",
                "Fotografia reklamowa",
                "Minimalistyczny editorial",
              ])}
              {field("format", "Format obrazu", ["4:5", "1:1", "9:16", "16:9"])}
            </>
          )}
          {(kind === "photos" || kind === "reels") &&
            field("pieces", "Dokładna liczba kawałków (opcjonalnie)")}
        </div>
        {kind === "reels" && (
          <p className="info-note">Format 9:16 · 15 sekund · Instagram Reels</p>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary full" disabled={busy}>
          <Sparkles size={17} />
          {busy ? "Przygotowuję…" : "Wygeneruj materiał"}
          <ArrowUpRight size={17} />
        </button>
        <p className="fine-print">Generator szablonowy · bez kosztów API</p>
      </form>
      <div className="panel result-panel">
        <div className="panel-heading">
          <div className="icon-tile">
            <Sparkles size={20} />
          </div>
          <div>
            <h2>Twoja inspiracja</h2>
            <p>Gotowa do dopracowania i publikacji.</p>
          </div>
          {result && (
            <CopyButton
              text={result.sections
                .map((s) => `${s.label}\n${s.text}`)
                .join("\n\n")}
              notify={notify}
            />
          )}
        </div>
        {result ? (
          <>
            <div className="generated-heading">
              <span className="pill green">
                <Check size={13} /> Wygenerowano
              </span>
              <h3>{result.title}</h3>
            </div>
            {result.sections.map((s) => (
              <section className="result-section" key={s.label}>
                <div>
                  <h3>{s.label}</h3>
                  <CopyButton text={s.text} notify={notify} />
                </div>
                <p>{s.text}</p>
              </section>
            ))}
            <button
              className="button secondary full"
              onClick={() =>
                schedule(
                  result.title,
                  kind === "reels"
                    ? "Reel"
                    : kind === "ads"
                      ? "Reklama"
                      : "Post",
                )
              }
            >
              <CalendarPlus size={16} />
              Zaplanuj publikację
            </button>
          </>
        ) : (
          <div className="result-empty">
            <div className="sparkle-orbit">
              <Sparkles size={35} />
            </div>
            <h3>Od pomysłu do dobrego smaku.</h3>
            <p>
              Uzupełnij szczegóły po lewej.
              <br />
              Tu pojawi się Twój nowy materiał.
            </p>
            <span className="pill">Stworzone dla {brand.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
