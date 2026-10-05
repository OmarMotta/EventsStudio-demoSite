"use client";

import { useState } from "react";
import { homeGallery } from "@/lib/gallery";
import { GalleryLightbox } from "./gallery-lightbox";
import { Reveal } from "./reveal";

const layouts = {
  opening: "col-span-12 md:col-span-10 md:col-start-2",
  "portrait-left": "col-span-12 sm:col-span-5 md:col-span-4 md:col-start-2",
  "portrait-right": "col-span-12 sm:col-span-6 sm:col-start-7 sm:mt-28 md:col-span-5 md:col-start-8 md:mt-52",
  closing: "col-span-12",
};

const ratios = {
  opening: "aspect-[4/3] md:aspect-[16/9]",
  "portrait-left": "aspect-[4/5]",
  "portrait-right": "aspect-[4/5]",
  closing: "aspect-[4/3] md:aspect-[2/1]",
};

export function EditorialGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const availableImages = homeGallery.filter(photo => photo.src !== null);
  const hasPlaceholders = homeGallery.some(photo => photo.src === null);

  return <section id="selezione" aria-labelledby="gallery-heading" className="relative bg-ink pb-20 md:pb-36">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-28 h-28 bg-linear-to-b from-transparent to-ink" />
    <div className="mx-auto max-w-480 px-6 pt-20 md:px-10 md:pt-32 xl:px-16">
      <Reveal>
        <div className="mb-12 flex items-center justify-between gap-6 border-t border-sand/30 pt-5 md:mb-20">
          <p className="text-xs uppercase tracking-[.2em] text-sand md:text-sm">01 / In scena</p>
          <p className="text-xs uppercase tracking-[.16em] text-white/55">Events Studio</p>
        </div>
        {/* <!-- [PLACEHOLDER: Testo editoriale proposto; sostituire con il claim ufficiale se fornito] --> */}
        <h2 id="gallery-heading" className="max-w-6xl font-display text-[clamp(3rem,8vw,8.5rem)] leading-[1.04] tracking-[-.035em]">
          Ci sono momenti<br /><span className="text-sand">che restano.</span>
        </h2>
        <div className="mb-16 mt-8 flex justify-end md:mb-28 md:mt-12">
          <div className="max-w-sm border-l border-sand/45 pl-5">
            <p className="text-base leading-relaxed text-white/75 md:text-lg">La musica, la luce, le persone.<br />Uno sguardo dentro l’evento.</p>
            {hasPlaceholders && <p className="mt-4 text-sm leading-relaxed text-white/55">La selezione fotografica sarà inserita qui. Gli spazi sottostanti sono segnaposto.</p>}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-12 items-start gap-x-6 gap-y-16 md:gap-x-8 md:gap-y-32">
        {homeGallery.map((photo, index) => <Reveal key={photo.id} className={layouts[photo.layout]}>
          <figure>
            {photo.src ? <button type="button" onClick={() => setActiveIndex(availableImages.findIndex(image => image.id === photo.id))} aria-label={`Apri immagine: ${photo.title}`} aria-haspopup="dialog" className={`group relative block w-full overflow-hidden bg-surface ${ratios[photo.layout]}`}>
              <img src={photo.src} srcSet={photo.srcSet} sizes={photo.layout.startsWith("portrait") ? "(min-width: 768px) 42vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 768px) 85vw, 100vw"} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" style={{ objectPosition: photo.position }} className="size-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.025] motion-reduce:transform-none" />
              <span aria-hidden="true" className="absolute bottom-4 right-4 flex size-11 items-center justify-center bg-ink/75 text-2xl font-light text-white backdrop-blur-sm transition-colors group-hover:text-sand md:bottom-6 md:right-6">+</span>
            </button> : <div role="img" aria-label={`Segnaposto fotografico: ${photo.title}. Immagine da fornire.`} className={`relative flex w-full flex-col items-center justify-center gap-5 border border-white/10 bg-surface ${ratios[photo.layout]}`}>
              <span aria-hidden="true" className="absolute left-5 top-5 text-xs tracking-[.16em] text-sand/75 md:left-8 md:top-8">0{index + 1}</span>
              <span aria-hidden="true" className="h-12 w-px bg-sand/35" />
              <span className="px-5 text-center text-xs uppercase leading-relaxed tracking-[.2em] text-white/55">Fotografia da fornire</span>
              <span className="text-xs text-white/40">{photo.layout.startsWith("portrait") ? "Verticale" : photo.layout === "closing" ? "Panoramica" : "Orizzontale"}</span>
            </div>}
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-white/15 pt-4">
              <span className="flex items-baseline gap-4"><span className="text-xs text-sand">0{index + 1}</span><span className="font-display text-2xl md:text-3xl">{photo.title}</span></span>
              <span className="text-xs text-white/50">{photo.src ? "Events Studio" : "Segnaposto"}</span>
            </figcaption>
          </figure>
        </Reveal>)}
      </div>
    </div>
    <GalleryLightbox images={availableImages} index={activeIndex} onIndexChange={setActiveIndex} onClose={() => setActiveIndex(null)} />
  </section>;
}
