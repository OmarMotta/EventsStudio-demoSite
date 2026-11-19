import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { SiteHeader } from "@/components/site-header";
import { EditorialGallery } from "@/components/editorial-gallery";
import { ReviewsSection } from "@/components/reviews-section";
import { LocationSection } from "@/components/location-section";
import { SiteFooter } from "@/components/site-footer";
import { featuredEventPages, homeSearchTitle } from "@/lib/seo";

export default function HomePage() {
  return <>
    <a href="#contenuto" className="fixed left-6 top-4 z-50 -translate-y-32 bg-sand px-5 py-3 text-ink focus:translate-y-0">Vai al contenuto</a>
    <SiteHeader />
    <main id="contenuto" tabIndex={-1}>
      <HeroSection />
      <section aria-labelledby="studio-services" className="relative z-10 mx-auto max-w-480 px-6 pb-4 pt-16 md:px-10 md:pt-24 xl:px-16">
        <h1 id="studio-services" className="font-display text-4xl leading-tight text-white md:text-6xl">{homeSearchTitle}</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          Events Studio cura musica, intrattenimento e allestimenti per ricevimenti di nozze, incontri aziendali e feste private a Potenza e in Basilicata.
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-7">
          {Object.entries(featuredEventPages).map(([href, page]) => (
            <li key={href}>
              <Link href={href} className="inline-flex min-h-11 items-center text-sand underline underline-offset-4">{page.label}</Link>
            </li>
          ))}
        </ul>
      </section>
      <EditorialGallery />
      <ReviewsSection />
      <LocationSection />
    </main>
    <SiteFooter />
  </>;
}
