"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Tag,
  MapPin,
  Save,
} from "lucide-react";
import type { Brand, Product, Promotion } from "@/lib/types";
import { Field, Empty } from "./ui";
const categories = [
  "Sushi",
  "Sashimi",
  "Rolki",
  "Zestawy sushi",
  "Dania ciepłe",
];
export function Products({
  products,
  save,
  remove,
  notify,
}: {
  products: Product[];
  save: (p: Product) => boolean;
  remove: (id: string) => void;
  notify: (s: string) => void;
}) {
  const blank: Product = {
    id: "",
    name: "",
    category: categories[0],
    description: "",
    price: 0,
    promotion: "",
    image: "",
    active: true,
  };
  const [draft, setDraft] = useState(blank);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const update = (key: string, value: string | boolean | number) =>
    setDraft((d) => ({ ...d, [key]: value }));
  async function image(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      notify("Wybierz zdjęcie JPG, PNG lub WebP.");
      return;
    }
    if (file.size > 1024 * 1024) {
      notify("Zdjęcie może mieć maksymalnie 1 MB.");
      return;
    }
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      update("image", data);
    } catch {
      notify("Nie udało się odczytać zdjęcia.");
    }
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !draft.name.trim() ||
      !Number.isFinite(draft.price) ||
      draft.price < 0
    ) {
      notify("Podaj nazwę i poprawną cenę.");
      return;
    }
    if (
      !save({
        ...draft,
        name: draft.name.trim(),
        id: draft.id || crypto.randomUUID(),
      })
    )
      return;
    setEditing(false);
    setDraft(blank);
    notify("Produkt zapisany.");
  }
  return (
    <>
      <div className="collection-toolbar">
        <input
          className="search-input"
          aria-label="Szukaj produktu"
          placeholder="Szukaj w bazie produktów…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="button primary"
          onClick={() => {
            setDraft(blank);
            setEditing(true);
          }}
        >
          <Plus size={16} />
          Dodaj produkt
        </button>
      </div>
      {editing && (
        <form className="panel edit-panel" onSubmit={submit}>
          <h2>{draft.id ? "Edytuj produkt" : "Nowy produkt"}</h2>
          <div className="form-grid">
            <Field
              label="Nazwa produktu"
              value={draft.name}
              onChange={(v) => update("name", v)}
              required
            />
            <Field
              label="Kategoria"
              value={draft.category}
              onChange={(v) => update("category", v)}
              options={categories}
            />
            <Field
              label="Opis"
              value={draft.description}
              onChange={(v) => update("description", v)}
              type="textarea"
            />
            <Field
              label="Cena (zł)"
              value={String(draft.price)}
              onChange={(v) => update("price", v === "" ? 0 : Number(v))}
              type="number"
              min="0"
              max="100000"
              required
            />
            <Field
              label="Promocja"
              value={draft.promotion}
              onChange={(v) => update("promotion", v)}
            />
            <label className="field">
              <span>Zdjęcie (do 1 MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => void image(e.target.files?.[0])}
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => update("active", e.target.checked)}
              />
              Produkt aktywny
            </label>
          </div>
          {draft.image && (
            <div className="image-preview">
              <Image
                src={draft.image}
                alt="Podgląd zdjęcia produktu"
                width={110}
                height={75}
                unoptimized
              />
              <button
                type="button"
                className="button secondary small"
                onClick={() => update("image", "")}
              >
                Usuń zdjęcie
              </button>
            </div>
          )}
          <div className="actions">
            <button className="button primary">Zapisz produkt</button>
            <button
              type="button"
              className="button secondary"
              onClick={() => setEditing(false)}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
      <div className="product-grid">
        {products
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          .map((p) => (
            <article className="panel product-card" key={p.id}>
              <div className="product-photo">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={600}
                    height={400}
                    unoptimized
                  />
                ) : (
                  <ImagePlus size={32} />
                )}
                <span className={`pill ${p.active ? "green" : ""}`}>
                  {p.active ? "Aktywny" : "Nieaktywny"}
                </span>
              </div>
              <div className="product-info">
                <span className="eyebrow">{p.category}</span>
                <h2>{p.name}</h2>
                <p>{p.description || "Brak opisu"}</p>
                {p.promotion && (
                  <span className="pill gold">{p.promotion}</span>
                )}
                <div className="product-footer">
                  <strong>
                    {p.price.toLocaleString("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    })}
                  </strong>
                  <div className="actions">
                    <button
                      className="icon-button"
                      aria-label={`Edytuj ${p.name}`}
                      onClick={() => {
                        setDraft(p);
                        setEditing(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="icon-button danger"
                      aria-label={`Usuń ${p.name}`}
                      onClick={() => {
                        if (confirm("Usunąć produkt?")) remove(p.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>
      {products.length === 0 && (
        <Empty text="Dodaj pierwszy produkt z rzeczywistego menu Nanami Sushi. Nie wpisaliśmy przykładowych cen ani składników." />
      )}
    </>
  );
}
export function Promotions({
  promotions,
  save,
  remove,
  notify,
}: {
  promotions: Promotion[];
  save: (p: Promotion) => boolean;
  remove: (id: string) => void;
  notify: (s: string) => void;
}) {
  const blank: Promotion = {
    id: "",
    name: "",
    day: "Czwartek",
    description: "",
  };
  const [draft, setDraft] = useState(blank);
  const [editing, setEditing] = useState(false);
  const update = (key: string, v: string) =>
    setDraft((d) => ({ ...d, [key]: v }));
  return (
    <>
      <div className="collection-toolbar">
        <p className="muted">Dobre okazje, które warto zaplanować.</p>
        <button
          className="button primary"
          onClick={() => {
            setDraft(blank);
            setEditing(true);
          }}
        >
          <Plus size={16} />
          Dodaj promocję
        </button>
      </div>
      {editing && (
        <form
          className="panel edit-panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim()) {
              notify("Podaj nazwę promocji.");
              return;
            }
            if (
              !save({
                ...draft,
                name: draft.name.trim(),
                id: draft.id || crypto.randomUUID(),
              })
            )
              return;
            setEditing(false);
            notify("Promocja zapisana.");
          }}
        >
          <h2>{draft.id ? "Edytuj promocję" : "Nowa promocja"}</h2>
          <div className="form-grid">
            <Field
              label="Nazwa promocji"
              value={draft.name}
              onChange={(v) => update("name", v)}
              required
            />
            <Field
              label="Dzień"
              value={draft.day}
              onChange={(v) => update("day", v)}
              options={[
                "Poniedziałek",
                "Wtorek",
                "Środa",
                "Czwartek",
                "Piątek",
                "Sobota",
                "Niedziela",
                "Codziennie",
              ]}
            />
            <Field
              label="Opis / warunki"
              value={draft.description}
              onChange={(v) => update("description", v)}
              type="textarea"
            />
          </div>
          <div className="actions">
            <button className="button primary">Zapisz promocję</button>
            <button
              type="button"
              className="button secondary"
              onClick={() => setEditing(false)}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
      <div className="promotion-grid">
        {promotions.map((p) => (
          <article className="panel promotion-card" key={p.id}>
            <div className="promotion-top">
              <div className="icon-tile">
                <Tag size={23} />
              </div>
              <span className="pill gold">{p.day}</span>
            </div>
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <div className="actions">
              <button
                className="button secondary small"
                onClick={() => {
                  setDraft(p);
                  setEditing(true);
                }}
              >
                <Pencil size={14} />
                Edytuj
              </button>
              <button
                className="icon-button danger"
                aria-label={`Usuń ${p.name}`}
                onClick={() => {
                  if (confirm("Usunąć promocję?")) remove(p.id);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {promotions.length === 0 && (
        <Empty text="Nie masz jeszcze promocji. Dodaj pierwszą." />
      )}
    </>
  );
}
export function BrandSettings({
  brand,
  save,
  notify,
  exportData,
}: {
  brand: Brand;
  save: (b: Brand) => boolean;
  notify: (s: string) => void;
  exportData: () => void;
}) {
  const [draft, setDraft] = useState(brand);
  return (
    <div className="brand-layout">
      <form
        className="panel edit-panel"
        onSubmit={(e) => {
          e.preventDefault();
          if (Object.values(draft).some((v) => !v.trim())) {
            notify("Uzupełnij wszystkie ustawienia marki.");
            return;
          }
          if (save(draft)) notify("Ustawienia marki zapisane.");
        }}
      >
        <div className="panel-heading">
          <div className="icon-tile">
            <MapPin size={20} />
          </div>
          <div>
            <h2>Tożsamość marki</h2>
            <p>Twój punkt wyjścia do każdej treści.</p>
          </div>
        </div>
        <div className="form-grid">
          {[
            ["name", "Nazwa restauracji"],
            ["city", "Miasto"],
            ["address", "Adres"],
            ["website", "Strona internetowa"],
            ["tone", "Styl komunikacji"],
          ].map(([k, l]) => (
            <Field
              key={k}
              label={l}
              value={draft[k as keyof Brand]}
              onChange={(v) => setDraft((b) => ({ ...b, [k]: v }))}
              type={k === "tone" ? "textarea" : "text"}
              required
            />
          ))}
        </div>
        <button className="button primary">
          <Save size={16} />
          Zapisz ustawienia
        </button>
      </form>
      <div>
        <section className="panel brand-rules">
          <span className="eyebrow">NANAMI STANDARD</span>
          <h2>Smak w każdym detalu.</h2>
          <p>
            Realistyczne jedzenie. Naturalne tekstury. Ciepłe boczne światło i
            eleganckie ciemne tło.
          </p>
          <ul>
            <li>Bez pary nad sushi</li>
            <li>Bez przypadkowych dłoni i pałeczek</li>
            <li>Bez dodatkowych składników</li>
            <li>Zawsze zachowaj podaną liczbę kawałków</li>
          </ul>
        </section>
        <section className="panel backup-panel">
          <h2>Twoje dane</h2>
          <p>
            Dane są zapisane lokalnie w tej przeglądarce. Nie są synchronizowane
            między urządzeniami. Eksportuj kopię przed wyczyszczeniem danych
            przeglądarki.
          </p>
          <button className="button secondary" onClick={exportData}>
            Eksportuj kopię JSON
          </button>
        </section>
      </div>
    </div>
  );
}
