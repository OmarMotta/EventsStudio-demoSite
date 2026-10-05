import type { Metadata, Viewport } from "next";
import "./globals.css";
import { pageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

const baseMetadata: Metadata = {
  title: "Events Studio — Party, Events, Tourism",
  description: "Events Studio. Party, Events e Tourism: scopri i tre mondi dello studio.",
  // Preview only. Enable indexing and canonical once the official domain is supplied.
  // <!-- [PLACEHOLDER: Dominio ufficiale per canonical, sitemap e URL Open Graph] -->
  robots: { index: false, follow: false },
  openGraph: { title: "Events Studio — Party, Events, Tourism", description: "Party. Events. Tourism.", locale: "it_IT", type: "website" },
  // Marchio originale anche come icona del browser, senza alterare il PNG.
  icons: { icon: { url: "/assets/logo/events-studio.png", type: "image/png" } },
};
export const metadata: Metadata = { ...baseMetadata, ...pageMetadata('Party, Events, Tourism', 'Events Studio: Party, Events, Tourism e servizi per eventi. Potenza, Basilicata.', '/') };

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080808" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body className="antialiased"><StructuredData />{children}</body></html>;
}

