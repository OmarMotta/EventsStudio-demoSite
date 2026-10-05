"use client";

import { useState } from "react";

export function LocationMap({ embedUrl }: { embedUrl: string | null }) {
  const [loaded, setLoaded] = useState(false);
  let source: string | null = null;
  try {
    if (embedUrl) {
      const url = new URL(embedUrl);
      if (url.protocol === "https:" && ["www.google.com", "maps.google.com"].includes(url.hostname) && (url.pathname.startsWith("/maps/embed") || (url.pathname === "/maps" && url.searchParams.get("output") === "embed"))) source = url.href;
    }
  } catch { /* Keep an honest placeholder for missing or invalid URLs. */ }

  return <div className="relative flex w-full min-w-0 min-h-72 items-center justify-center border border-white/10 bg-surface md:aspect-[6/5]">
    {source && loaded ? <iframe title="Posizione ufficiale di Events Studio su Google Maps" src={source} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 size-full border-0" /> : <div className="max-w-xs px-7 py-12 text-center">
      <span aria-hidden="true" className="mx-auto mb-7 block h-12 w-px bg-sand/45" />
      {source ? <>
        <button type="button" onClick={() => setLoaded(true)} className="min-h-11 border-b border-sand py-3 text-base text-white transition-colors hover:text-sand">Mostra la mappa</button>
        <p className="mt-4 text-xs leading-relaxed text-white/55">La mappa di Google viene caricata solo su richiesta.</p>
      </> : <>
        {/* <!-- [PLACEHOLDER: Mappa della sede reale, senza localitÃ  o coordinate inventate] --> */}
        <p className="text-sm uppercase tracking-[.15em] text-white/70">Posizione da inserire</p>
        <p className="mt-4 text-sm leading-relaxed text-white/55">La mappa sarÃ  disponibile con lâ€™indirizzo e il collegamento ufficiali.</p>
      </>}
    </div>}
  </div>;
}

