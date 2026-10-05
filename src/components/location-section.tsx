import { officialContent, httpsUrl } from "@/lib/official-content";
import { LocationMap } from "./location-map";
import { OfficialLink } from "./official-link";
import { Reveal } from "./reveal";

export function LocationSection() {
  return <section id="dove-trovarci" aria-labelledby="location-heading" className="bg-ink px-6 py-20 md:px-10 md:py-36 xl:px-16">
    <div className="mx-auto grid max-w-448 items-center gap-12 md:grid-cols-[.9fr_1.1fr] md:gap-16 lg:gap-28">
      <Reveal>
        <p className="mb-10 text-xs uppercase tracking-[.2em] text-sand md:mb-16 md:text-sm">03 / Vieni a trovarci</p>
        <h2 id="location-heading" className="font-display text-[clamp(3.25rem,7vw,7.5rem)] leading-[1.02] tracking-[-.035em]">Dove<br /><span className="text-sand">trovarci.</span></h2>
        <div className="mt-10 border-t border-white/15 pt-6 md:mt-14">
          <p className="mb-3 text-xs uppercase tracking-[.16em] text-white/50">La sede</p>
          {officialContent.address ? <address className="max-w-sm whitespace-pre-line text-lg not-italic leading-relaxed">{officialContent.address}</address> : <p className="text-base text-white/60">La posizione dello studio è disponibile su Google Maps.</p>}
          <div className="mt-5"><OfficialLink href={httpsUrl(officialContent.mapsUrl)}>Ottieni indicazioni</OfficialLink></div>
        </div>
      </Reveal>
      <Reveal delay={.1}><LocationMap embedUrl={officialContent.mapsEmbedUrl} /></Reveal>
    </div>
  </section>;
}

