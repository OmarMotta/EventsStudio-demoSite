import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Events Studio — Party, Events, Tourism",
  description: "Events Studio. Party, Events e Tourism: scopri i tre mondi dello studio.",
  // Preview only. Enable indexing and canonical once the official domain is supplied.
  // <!-- [PLACEHOLDER: Dominio ufficiale per canonical, sitemap e URL Open Graph] -->
  robots: { index: false, follow: false },
  openGraph: { title: "Events Studio — Party, Events, Tourism", description: "Party. Events. Tourism.", locale: "it_IT", type: "website" },
  // <!-- [PLACEHOLDER: Favicon ufficiale derivata da un asset approvato del marchio] -->
  icons: { icon: "data:," },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080808" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body className="antialiased">{children}</body></html>;
}
