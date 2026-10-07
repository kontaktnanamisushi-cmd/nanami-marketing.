"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Pencil } from "lucide-react";
import { ctas, localDate } from "@/lib/data";
import type { Entry } from "@/lib/types";
import { Field, Empty } from "./ui";
export const statuses = [
  "Pomysł",
  "Do przygotowania",
  "Gotowe",
  "Opublikowane",
];
const blankEntry = (): Omit<Entry, "id"> => ({
  date: localDate(),
  time: "18:00",
  platform: "Instagram",
  topic: "",
  category: "Post",
  status: "Pomysł",
  cta: ctas[0],
});
export default function Calendar({
  entries,
  save,
  remove,
  notify,
  initial,
}: {
  entries: Entry[];
  save: (e: Entry) => boolean;
  remove: (id: string) => void;
  notify: (s: string) => void;
  initial?: { topic: string; category: string };
}) {
  const [view, setView] = useState("Miesiąc");
  const [cursor, setCursor] = useState(new Date());
  const [editing, setEditing] = useState(!!initial);
  const [draft, setDraft] = useState<Omit<Entry, "id"> & { id?: string }>({
    ...blankEntry(),
    ...initial,
  });
  const start = new Date(
    cursor.getFullYear(),
    cursor.getMonth(),
    view === "Miesiąc" ? 1 : cursor.getDate(),
  );
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const days = Array.from({ length: view === "Miesiąc" ? 42 : 7 }, (_, idx) => {
    const day = new Date(start);
    day.setDate(start.getDate() + idx);
    return day;
  });
  function move(dir: number) {
    const d = new Date(cursor);
    if (view === "Miesiąc") {
      d.setDate(1);
      d.setMonth(d.getMonth() + dir);
    } else d.setDate(d.getDate() + 7 * dir);
    setCursor(d);
  }
  function update(k: string, v: string) {
    setDraft((old) => ({ ...old, [k]: v }));
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.topic.trim()) {
      notify("Podaj temat publikacji.");
      return;
    }
    if (
      !save({
        ...draft,
        topic: draft.topic.trim(),
        id: draft.id || crypto.randomUUID(),
      })
    )
      return;
    setEditing(false);
    setDraft(blankEntry());
    notify("Publikacja zapisana.");
  }
  return (
    <>
      <div className="calendar-toolbar">
        <div className="calendar-month">
          <button
            className="icon-button"
            aria-label="Poprzedni okres"
            onClick={() => move(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <h2>
            {cursor.toLocaleDateString("pl-PL", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            className="icon-button"
            aria-label="Następny okres"
            onClick={() => move(1)}
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="button secondary small"
            onClick={() => setCursor(new Date())}
          >
            Dzisiaj
          </button>
        </div>
        <div className="actions">
          <div className="segmented">
            {["Tydzień", "Miesiąc"].map((v) => (
              <button
                className={view === v ? "active" : ""}
                key={v}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            className="button primary"
            onClick={() => {
              setDraft(blankEntry());
              setEditing(true);
            }}
          >
            <Plus size={16} />
            Dodaj wpis
          </button>
        </div>
      </div>
      {editing && (
        <form className="panel edit-panel" onSubmit={submit}>
          <h2>{draft.id ? "Edytuj publikację" : "Nowa publikacja"}</h2>
          <div className="form-grid">
            {[
              ["topic", "Temat", "text"],
              ["date", "Data", "date"],
              ["time", "Godzina", "time"],
            ].map(([k, l, t]) => (
              <Field
                key={k}
                label={l}
                value={draft[k as keyof typeof draft] || ""}
                onChange={(v) => update(k, v)}
                type={t}
                required
              />
            ))}
            <Field
              label="Platforma"
              value={draft.platform}
              onChange={(v) => update("platform", v)}
              options={["Instagram", "Facebook", "Meta Ads"]}
            />
            <Field
              label="Kategoria"
              value={draft.category}
              onChange={(v) => update("category", v)}
              options={["Post", "Reel", "Stories", "Reklama", "Promocja"]}
            />
            <Field
              label="Status"
              value={draft.status}
              onChange={(v) => update("status", v)}
              options={statuses}
            />
            <Field
              label="CTA"
              value={draft.cta}
              onChange={(v) => update("cta", v)}
              options={ctas}
            />
          </div>
          <div className="actions">
            <button className="button primary">Zapisz wpis</button>
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
      <div className="calendar-scroll">
        <div className="calendar-grid">
          {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"].map((d) => (
            <div className="weekday" key={d}>
              {d}
            </div>
          ))}
          {days.map((day) => (
            <div
              key={localDate(day)}
              className={`calendar-day ${day.getMonth() !== cursor.getMonth() ? "muted-day" : ""} ${localDate(day) === localDate() ? "today" : ""}`}
            >
              <button
                className="day-number"
                onClick={() => {
                  setDraft({ ...blankEntry(), date: localDate(day) });
                  setEditing(true);
                }}
                aria-label={`Dodaj publikację ${localDate(day)}`}
              >
                {day.getDate()}
              </button>
              {entries
                .filter((e) => e.date === localDate(day))
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((e) => (
                  <button
                    className={`calendar-event event-${e.category.toLowerCase()}`}
                    key={e.id}
                    onClick={() => {
                      setDraft(e);
                      setEditing(true);
                    }}
                  >
                    <small>
                      {e.time} · {e.category}
                    </small>
                    <strong>{e.topic}</strong>
                    <small>{e.status}</small>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="panel planned-list">
        <div className="panel-heading">
          <h2>Publikacje w tym okresie</h2>
          <span className="muted">Kliknij wpis, aby zmienić jego status.</span>
        </div>
        {entries.filter(
          (e) =>
            e.date >= localDate(days[0]) &&
            e.date <= localDate(days[days.length - 1]),
        ).length === 0 ? (
          <Empty text="Brak publikacji. Dodaj pierwszy wpis do kalendarza." />
        ) : (
          entries
            .filter(
              (e) =>
                e.date >= localDate(days[0]) &&
                e.date <= localDate(days[days.length - 1]),
            )
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
            .map((e) => (
              <div className="list-row" key={e.id}>
                <div className="row-main">
                  <strong>{e.topic}</strong>
                  <small>
                    {e.date} · {e.time} · {e.platform} · {e.cta}
                  </small>
                </div>
                <span className="pill">{e.status}</span>
                <button
                  className="icon-button"
                  aria-label={`Edytuj ${e.topic}`}
                  onClick={() => {
                    setDraft(e);
                    setEditing(true);
                  }}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="icon-button danger"
                  aria-label={`Usuń ${e.topic}`}
                  onClick={() => {
                    if (confirm("Usunąć tę publikację?")) remove(e.id);
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
        )}
      </div>
    </>
  );
}
