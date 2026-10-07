export type Module =
  | "dashboard"
  | "posts"
  | "reels"
  | "photos"
  | "ads"
  | "hooks"
  | "calendar"
  | "promotions"
  | "ctas"
  | "products"
  | "brand";
export type Brand = {
  name: string;
  city: string;
  address: string;
  website: string;
  tone: string;
};
export type Entry = {
  id: string;
  date: string;
  time: string;
  platform: string;
  topic: string;
  category: string;
  status: string;
  cta: string;
};
export type Promotion = {
  id: string;
  name: string;
  day: string;
  description: string;
};
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  promotion: string;
  image: string;
  active: boolean;
};
export type Store = {
  brand: Brand;
  entries: Entry[];
  promotions: Promotion[];
  products: Product[];
};
export type Generated = {
  title: string;
  sections: { label: string; text: string }[];
};
export type GeneratorInput = Record<string, string>;
