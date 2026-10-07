import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Nanami Marketing AI",
  description: "Studio marketingowe Nanami Sushi · Poznań",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
