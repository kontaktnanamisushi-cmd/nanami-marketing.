import type { Store } from "./types";
export const storageKey = "nanami-marketing-v1";
export function isStore(value: unknown): value is Store {
  if (!value || typeof value !== "object") return false;
  const s = value as Store;
  const strings = (x: unknown, keys: string[]) =>
    !!x &&
    typeof x === "object" &&
    keys.every((k) => typeof (x as Record<string, unknown>)[k] === "string");
  return (
    strings(s.brand, ["name", "city", "address", "website", "tone"]) &&
    Array.isArray(s.entries) &&
    s.entries.every((e) =>
      strings(e, [
        "id",
        "date",
        "time",
        "platform",
        "topic",
        "category",
        "status",
        "cta",
      ]),
    ) &&
    Array.isArray(s.promotions) &&
    s.promotions.every((p) =>
      strings(p, ["id", "name", "day", "description"]),
    ) &&
    Array.isArray(s.products) &&
    s.products.every(
      (p) =>
        strings(p, [
          "id",
          "name",
          "category",
          "description",
          "promotion",
          "image",
        ]) &&
        typeof p.price === "number" &&
        Number.isFinite(p.price) &&
        typeof p.active === "boolean",
    )
  );
}
