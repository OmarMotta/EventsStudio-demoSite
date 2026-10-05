import { HeroSection } from "@/components/hero-section";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return <>
    <a href="#contenuto" className="fixed left-6 top-4 z-50 -translate-y-32 bg-sand px-5 py-3 text-ink focus:translate-y-0">Vai al contenuto</a>
    <SiteHeader />
    <main id="contenuto" tabIndex={-1}><HeroSection /></main>
  </>;
}
