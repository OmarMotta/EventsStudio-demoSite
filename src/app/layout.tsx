import type { Metadata, Viewport } from "next";
import "./globals.css";
import { homeSearchTitle, pageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

export const metadata: Metadata = {
  ...pageMetadata(homeSearchTitle, 'Events Studio cura musica, intrattenimento e allestimenti per matrimoni, eventi aziendali e feste private a Potenza e in Basilicata.', '/'),
  icons: { icon: { url: "/assets/logo/events-studio.svg", type: "image/svg+xml" } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080808" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body className="antialiased"><StructuredData />{children}</body></html>;
}

