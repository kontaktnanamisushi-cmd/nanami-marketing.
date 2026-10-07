"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Instagram,
  Clapperboard,
  Camera,
  Megaphone,
  Quote,
  CalendarDays,
  Tag,
  MousePointer2,
  Package,
  Settings2,
  ArrowUpRight,
  Plus,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Clock3,
  Circle,
  ArrowRight,
  Leaf,
  Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Entry, Module, Store } from "@/lib/types";
import {
  ctas,
  hooks,
  hookCategories,
  initialStore,
  localDate,
} from "@/lib/data";
import { isStore, storageKey } from "@/lib/storage";
import Generator from "./generator";
import Calendar from "./calendar";
import { Products, Promotions, BrandSettings } from "./collections";
import { CopyButton, Empty } from "./ui";
const modules: {
  id: Module;
  label: string;
  icon: LucideIcon;
  group: string;
  description: string;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    group: "PRZEGLĄD",
    description: "Wszystko, czego potrzebujesz, aby Twoja marka rosła.",
  },
  {
    id: "posts",
    label: "Generator postów",
    icon: Instagram,
    group: "STUDIO KREATYWNE",
    description: "Treści, które zatrzymują uwagę i budują apetyt.",
  },
  {
    id: "reels",
    label: "Generator rolek",
    icon: Clapperboard,
    group: "STUDIO KREATYWNE",
    description: "Od pierwszego kadru do ostatniego kęsa. Format 9:16.",
  },
  {
    id: "photos",
    label: "Prompty fotograficzne",
    icon: Camera,
    group: "STUDIO KREATYWNE",
    description: "Twórz obrazy, które oddają charakter Nanami.",
  },
  {
    id: "ads",
    label: "Generator reklam",
    icon: Megaphone,
    group: "STUDIO KREATYWNE",
    description: "Dobry pomysł na reklamę zaczyna się tutaj.",
  },
  {
    id: "hooks",
    label: "Biblioteka hooków",
    icon: Quote,
    group: "PLANOWANIE I ZASOBY",
    description: "Pierwsze słowa, które robią różnicę.",
  },
  {
    id: "calendar",
    label: "Kalendarz treści",
    icon: CalendarDays,
    group: "PLANOWANIE I ZASOBY",
    description: "Nadaj swoim pomysłom miejsce w kalendarzu.",
  },
  {
    id: "promotions",
    label: "Promocje",
    icon: Tag,
    group: "PLANOWANIE I ZASOBY",
    description: "Okazje do dzielenia się dobrym smakiem.",
  },
  {
    id: "ctas",
    label: "Biblioteka CTA",
    icon: MousePointer2,
    group: "PLANOWANIE I ZASOBY",
    description: "Zamień zainteresowanie w kolejny krok.",
  },
  {
    id: "products",
    label: "Baza produktów",
    icon: Package,
    group: "PLANOWANIE I ZASOBY",
    description: "Twoje menu. Twoje źródło inspiracji.",
  },
  {
    id: "brand",
    label: "Ustawienia marki",
    icon: Settings2,
    group: "MARKA",
    description: "Spójny głos i charakter Nanami Sushi.",
  },
];
const titles: Partial<Record<Module, string>> = {
  dashboard: "Dobre pomysły. Jeszcze lepszy smak.",
  posts: "Generator postów Instagram",
  reels: "Generator rolek",
  photos: "Studio promptów fotograficznych",
  ads: "Generator reklam",
  hooks: "Biblioteka hooków",
  calendar: "Kalendarz treści",
  promotions: "Promocje Nanami Sushi",
  ctas: "Biblioteka CTA",
  products: "Baza produktów",
  brand: "Ustawienia marki",
};
export default function MarketingApp() {
  const [active, setActive] = useState<Module>("dashboard");
  const [mobile, setMobile] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [toast, setToast] = useState("");
  const [hookFilter, setHookFilter] = useState("Wszystkie");
  const [schedule, setSchedule] = useState<
    { topic: string; category: string } | undefined
  >();
  const [calendarKey, setCalendarKey] = useState(0);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!isStore(parsed)) throw new Error("Niepoprawne dane");
        setStore(parsed);
      } else setStore(initialStore());
    } catch {
      setBlocked(true);
      setStore(initialStore());
      setToast(
        "Nie można odczytać lokalnych danych. Zapis jest wstrzymany, aby nie nadpisać istniejącej kopii.",
      );
    }
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 6500);
    return () => clearTimeout(timer);
  }, [toast]);
  function commit(next: Store): boolean {
    if (blocked) {
      setToast(
        "Zapis zablokowany: najpierw odzyskaj lub zresetuj lokalne dane.",
      );
      return false;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStore(next);
      return true;
    } catch {
      setToast(
        "Nie zapisano zmian. Pamięć przeglądarki jest niedostępna lub pełna. Zmniejsz zdjęcia albo eksportuj dane.",
      );
      return false;
    }
  }
  function navigate(id: Module) {
    setActive(id);
    setMobile(false);
    if (id === "calendar") {
      setSchedule(undefined);
      setCalendarKey((k) => k + 1);
    }
  }
  function plan(topic: string, category: string) {
    setSchedule({ topic, category });
    setCalendarKey((k) => k + 1);
    setActive("calendar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function exportData() {
    if (!store) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(store, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `nanami-backup-${localDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const current = modules.find((m) => m.id === active)!;
  if (!store)
    return (
      <main className="loading">
        <Sparkles size={28} />
        <p>Przygotowujemy Twoje studio…</p>
      </main>
    );
  const today = localDate();
  const pending = store.entries.filter(
    (e) => e.date === today && e.status !== "Opublikowane",
  );
  const upcoming = store.entries
    .filter((e) => e.date >= today && e.status !== "Opublikowane")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const saveEntry = (e: Entry) =>
    commit({
      ...store,
      entries: store.entries.some((x) => x.id === e.id)
        ? store.entries.map((x) => (x.id === e.id ? e : x))
        : [...store.entries, e],
    });
  return (
    <div className="app-shell">
      <button
        className="mobile-nav-button icon-button"
        aria-label="Otwórz nawigację"
        onClick={() => setMobile(true)}
      >
        <Menu size={22} />
      </button>
      {mobile && (
        <button
          className="nav-overlay"
          aria-label="Zamknij nawigację"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
        <div className="brand-logo">
          <div className="brand-mark">
            N<span>●</span>
          </div>
          <div>
            <strong>NANAMI</strong>
            <small>MARKETING AI</small>
          </div>
          <button
            className="mobile-close icon-button"
            aria-label="Zamknij menu"
            onClick={() => setMobile(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Nawigacja główna">
          {["PRZEGLĄD", "STUDIO KREATYWNE", "PLANOWANIE I ZASOBY", "MARKA"].map(
            (group) => (
              <div className="nav-group" key={group}>
                <span className="nav-label">{group}</span>
                {modules
                  .filter((m) => m.group === group)
                  .map((m) => (
                    <button
                      key={m.id}
                      className={`nav-item ${active === m.id ? "active" : ""}`}
                      onClick={() => navigate(m.id)}
                      aria-current={active === m.id ? "page" : undefined}
                    >
                      <m.icon size={18} />
                      <span>{m.label}</span>
                      {m.id === "dashboard" && <span className="nav-dot" />}
                    </button>
                  ))}
              </div>
            ),
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-badge">
            <span />
            Twój lokalny obszar pracy
          </div>
          <div className="profile">
            <div className="profile-avatar">NS</div>
            <div>
              <strong>{store.brand.name}</strong>
              <small>{store.brand.city} · panel marketingowy</small>
            </div>
            <Settings2 size={16} />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            Przestrzeń <ChevronRight size={13} />
            <span>{current.label}</span>
          </div>
          <div className="topbar-right">
            <span className="mode-badge">
              <Sparkles size={13} />
              Tryb szablonowy
            </span>
            <span className="topbar-date">
              {new Date().toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="mini-avatar">N</div>
          </div>
        </header>
        <main className="main-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                {active === "dashboard"
                  ? "TWOJE STUDIO MARKETINGOWE"
                  : "NANAMI MARKETING AI"}
              </span>
              <h1>{titles[active]}</h1>
              <p>{current.description}</p>
            </div>
            {active === "dashboard" && (
              <button
                className="button primary"
                onClick={() => navigate("posts")}
              >
                <Plus size={17} />
                Stwórz materiał
              </button>
            )}
          </div>
          {blocked && (
            <div className="error" role="alert">
              Lokalne dane nie mogły zostać odczytane. Nowe zmiany nie są
              zapisywane.{" "}
              <button
                onClick={() => {
                  if (confirm("Usunąć lokalny zapis i zacząć od początku?")) {
                    try {
                      localStorage.removeItem(storageKey);
                      setBlocked(false);
                      setStore(initialStore());
                    } catch {
                      setToast("Pamięć przeglądarki pozostaje niedostępna.");
                    }
                  }
                }}
              >
                Zresetuj lokalny zapis
              </button>
            </div>
          )}
          {active === "dashboard" && (
            <>
              <section className="hero-card">
                <div className="hero-copy">
                  <span className="pill hero-pill">
                    <span />
                    KREATYWNOŚĆ W DOBRYM SMAKU
                  </span>
                  <h2>
                    Twoja marka.
                    <br />
                    Twoja historia.
                    <br />
                    <em>Nasza inspiracja.</em>
                  </h2>
                  <p>
                    Twórz treści, które budują apetyt.
                    <br />
                    Zaplanuj marketing Nanami w jednym miejscu.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => navigate("posts")}
                  >
                    Zacznij tworzyć <ArrowUpRight size={17} />
                  </button>
                  <div className="hero-signature">
                    <span>和</span> Japońska precyzja. Twoja kreatywność.
                  </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="art-ring ring-one" />
                  <div className="art-ring ring-two" />
                  <Image
                    src="/sushi-art.svg"
                    alt=""
                    width={650}
                    height={440}
                    priority
                  />
                  <div className="art-caption">
                    THE ART OF GOOD TASTE <span>ななみ</span>
                  </div>
                </div>
              </section>
              <div className="stats-grid">
                {[
                  {
                    label: "Dzisiejsze zadania",
                    value: pending.length,
                    caption: "Czas na dobry marketing",
                    icon: CheckCircle2,
                    color: "gold",
                  },
                  {
                    label: "Zaplanowane publikacje",
                    value: upcoming.length,
                    caption: "Pomysły gotowe do działania",
                    icon: CalendarDays,
                    color: "blue",
                  },
                  {
                    label: "Aktywne promocje",
                    value: store.promotions.length,
                    caption: "Okazje, które budują apetyt",
                    icon: Tag,
                    color: "green",
                  },
                  {
                    label: "Produkty w bazie",
                    value: store.products.filter((p) => p.active).length,
                    caption: "Inspiracja z Twojego menu",
                    icon: Package,
                    color: "purple",
                  },
                ].map((s) => (
                  <section className="panel stat-card" key={s.label}>
                    <div>
                      <span>{s.label}</span>
                      <strong>{String(s.value).padStart(2, "0")}</strong>
                      <small>{s.caption}</small>
                    </div>
                    <div className={`stat-icon ${s.color}`}>
                      <s.icon size={20} />
                    </div>
                  </section>
                ))}
              </div>
              <section className="quick-section">
                <div className="section-title">
                  <h2>Szybkie akcje</h2>
                  <span>Od pomysłu do publikacji</span>
                </div>
                <div className="quick-grid">
                  {[
                    {
                      id: "posts",
                      label: "Nowy post",
                      sub: "Słowa, które smakują",
                      icon: Instagram,
                    },
                    {
                      id: "reels",
                      label: "Nowa rolka",
                      sub: "Zatrzymaj uwagę",
                      icon: Clapperboard,
                    },
                    {
                      id: "ads",
                      label: "Nowa reklama",
                      sub: "Dotrzyj do nowych gości",
                      icon: Megaphone,
                    },
                    {
                      id: "photos",
                      label: "Nowy prompt",
                      sub: "Obraz wart apetytu",
                      icon: Camera,
                    },
                    {
                      id: "promotions",
                      label: "Dodaj promocję",
                      sub: "Stwórz dobrą okazję",
                      icon: Tag,
                    },
                  ].map((a) => (
                    <button
                      className="quick-card"
                      key={a.id}
                      onClick={() => navigate(a.id as Module)}
                    >
                      <div className="quick-icon">
                        <a.icon size={21} />
                        <ArrowUpRight size={15} />
                      </div>
                      <strong>{a.label}</strong>
                      <small>{a.sub}</small>
                    </button>
                  ))}
                </div>
              </section>
              <div className="dashboard-columns">
                <section className="panel dashboard-panel">
                  <div className="section-title">
                    <h2>
                      Na dziś{" "}
                      <span className="count-badge">{pending.length}</span>
                    </h2>
                    <button onClick={() => navigate("calendar")}>
                      Kalendarz <ArrowUpRight size={14} />
                    </button>
                  </div>
                  {pending.length === 0 ? (
                    <Empty text="Dzisiaj bez zaległości. Zaplanuj kolejną dobrą treść." />
                  ) : (
                    pending.map((e) => (
                      <div className="task-row" key={e.id}>
                        <button
                          className="task-check"
                          aria-label={`Oznacz jako gotowe: ${e.topic}`}
                          onClick={() =>
                            saveEntry({
                              ...e,
                              status:
                                e.status === "Gotowe"
                                  ? "Opublikowane"
                                  : "Gotowe",
                            })
                          }
                        >
                          {e.status === "Gotowe" ? (
                            <CheckCircle2 size={21} />
                          ) : (
                            <Circle size={21} />
                          )}
                        </button>
                        <div>
                          <strong>{e.topic}</strong>
                          <small>
                            {e.category} · {e.platform} · {e.time}
                          </small>
                        </div>
                        <span
                          className={`pill ${e.status === "Gotowe" ? "green" : ""}`}
                        >
                          {e.status}
                        </span>
                      </div>
                    ))
                  )}
                  <div className="section-bottom">
                    <Clock3 size={14} />
                    Małe kroki. Regularne efekty.
                  </div>
                </section>
                <section className="panel dashboard-panel">
                  <div className="section-title">
                    <h2>Najbliższe publikacje</h2>
                    <button onClick={() => navigate("calendar")}>
                      Zobacz wszystkie <ArrowUpRight size={14} />
                    </button>
                  </div>
                  {upcoming.slice(0, 3).map((e) => (
                    <button
                      className="publication-row"
                      key={e.id}
                      onClick={() => navigate("calendar")}
                    >
                      <div className="date-tile">
                        <strong>{Number(e.date.slice(-2))}</strong>
                        <small>
                          {new Date(`${e.date}T12:00:00`).toLocaleDateString(
                            "pl-PL",
                            { month: "short" },
                          )}
                        </small>
                      </div>
                      <div>
                        <strong>{e.topic}</strong>
                        <small>
                          {e.platform} · {e.time}
                        </small>
                      </div>
                      <span
                        className={`pill ${e.category === "Reel" ? "purple" : "blue"}`}
                      >
                        {e.category}
                      </span>
                    </button>
                  ))}
                  {upcoming.length === 0 && (
                    <Empty text="Twój kalendarz czeka na pierwszy pomysł." />
                  )}
                </section>
              </div>
              <div className="dashboard-columns bottom-columns">
                <section className="panel promo-feature">
                  <div className="section-title">
                    <h2>Najbliższe promocje</h2>
                    <Tag size={18} />
                  </div>
                  {store.promotions[0] ? (
                    <>
                      <span className="eyebrow">
                        {store.promotions[0].day.toUpperCase()} · NANAMI SUSHI
                      </span>
                      <h3>{store.promotions[0].name}</h3>
                      <p>
                        Dobry smak jest jeszcze lepszy, kiedy się nim dzielisz.
                      </p>
                      <button onClick={() => navigate("promotions")}>
                        Zobacz promocje <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <Empty text="Dodaj swoją pierwszą promocję." />
                  )}
                  <div className="promo-symbol" aria-hidden="true">
                    4<span>/3</span>
                  </div>
                </section>
                <section className="panel inspiration-panel">
                  <div className="section-title">
                    <h2>Pomysł na dziś</h2>
                    <Sparkles size={18} />
                  </div>
                  <span className="pill purple">PREMIUM CINEMATIC · REEL</span>
                  <h3>15 sekund, które rozbudzą apetyt.</h3>
                  <p>
                    Zbliżenie na teksturę sushi. Ciepłe światło. Powolny ruch
                    kamery. Niech produkt opowie swoją historię.
                  </p>
                  <button onClick={() => navigate("reels")}>
                    Przygotuj scenariusz <ArrowUpRight size={16} />
                  </button>
                </section>
              </div>
            </>
          )}
          {(["posts", "reels", "photos", "ads"] as Module[]).includes(
            active,
          ) && (
            <Generator
              key={active}
              kind={active as "posts" | "reels" | "photos" | "ads"}
              brand={store.brand}
              notify={setToast}
              schedule={plan}
            />
          )}
          {active === "hooks" && (
            <>
              <div className="filter-tabs">
                {["Wszystkie", ...hookCategories].map((c) => (
                  <button
                    key={c}
                    className={hookFilter === c ? "active" : ""}
                    onClick={() => setHookFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="library-grid">
                {Object.entries(hooks)
                  .filter(
                    ([c]) => hookFilter === "Wszystkie" || c === hookFilter,
                  )
                  .flatMap(([c, items]) =>
                    items.map((h, index) => (
                      <article className="panel hook-card" key={h}>
                        <div>
                          <span className="pill">{c}</span>
                          <span className="hook-number">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <Quote size={22} />
                        <h2>{h}</h2>
                        <CopyButton text={h} notify={setToast} />
                      </article>
                    )),
                  )}
              </div>
            </>
          )}
          {active === "ctas" && (
            <div className="library-grid">
              {ctas.map((cta, i) => (
                <article className="panel cta-card" key={cta}>
                  <div className="icon-tile">
                    <MousePointer2 size={22} />
                  </div>
                  <span className="eyebrow">
                    CTA {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2>{cta}</h2>
                  <CopyButton text={cta} notify={setToast} />
                </article>
              ))}
            </div>
          )}
          {active === "calendar" && (
            <Calendar
              key={calendarKey}
              entries={store.entries}
              save={saveEntry}
              remove={(id) =>
                commit({
                  ...store,
                  entries: store.entries.filter((e) => e.id !== id),
                })
              }
              notify={setToast}
              initial={schedule}
            />
          )}
          {active === "promotions" && (
            <Promotions
              promotions={store.promotions}
              save={(p) =>
                commit({
                  ...store,
                  promotions: store.promotions.some((x) => x.id === p.id)
                    ? store.promotions.map((x) => (x.id === p.id ? p : x))
                    : [...store.promotions, p],
                })
              }
              remove={(id) =>
                commit({
                  ...store,
                  promotions: store.promotions.filter((p) => p.id !== id),
                })
              }
              notify={setToast}
            />
          )}
          {active === "products" && (
            <Products
              products={store.products}
              save={(p) =>
                commit({
                  ...store,
                  products: store.products.some((x) => x.id === p.id)
                    ? store.products.map((x) => (x.id === p.id ? p : x))
                    : [...store.products, p],
                })
              }
              remove={(id) =>
                commit({
                  ...store,
                  products: store.products.filter((p) => p.id !== id),
                })
              }
              notify={setToast}
            />
          )}
          {active === "brand" && (
            <BrandSettings
              brand={store.brand}
              save={(brand) => commit({ ...store, brand })}
              notify={setToast}
              exportData={exportData}
            />
          )}
          <footer className="footer">
            <span>
              <Leaf size={13} />
              Stworzone dla dobrego smaku.
            </span>
            <span>
              Nanami Marketing AI <span className="footer-dot">·</span> Dane
              lokalne{" "}
              <button aria-label="Eksportuj dane" onClick={exportData}>
                <Download size={13} />
              </button>
            </span>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
          <button
            aria-label="Zamknij powiadomienie"
            onClick={() => setToast("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
