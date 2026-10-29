import { OfficialLink } from './official-link';

export function LocationCard({ address, mapsUrl }: { address: string | null; mapsUrl: string | null }) {
  return <div className="relative isolate aspect-[4/5] w-full min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-surface">
    <img src="/assets/events-studio-sede.webp" alt="Ingresso della sede Events Studio con l’insegna illuminata" width={1400} height={1867} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover object-center" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 to-transparent" />
    <div className="absolute inset-x-4 bottom-4 rounded-xl border border-sand/25 bg-ink/95 p-5 sm:inset-x-6 sm:bottom-6 sm:p-7">
      <h3 className="font-display text-3xl leading-tight text-white sm:text-4xl">Come arrivare</h3>
      {address && <address className="mt-3 text-sm not-italic leading-relaxed text-white/75 sm:text-base">{address}</address>}
      <div className="mt-2"><OfficialLink href={mapsUrl}>Apri le indicazioni su Google Maps</OfficialLink></div>
    </div>
  </div>;
}
