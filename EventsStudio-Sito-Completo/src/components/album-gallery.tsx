'use client';
import { useState } from 'react';
import type { GalleryImage } from '@/lib/gallery';
import { GalleryLightbox } from './gallery-lightbox';
import { Reveal } from './reveal';
import { VisualSlot } from './visual-slot';

export function AlbumGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const available = images.filter(image => image.src);
  return <section aria-label={`Gallery ${title}`} className="px-6 py-20 md:px-10 md:py-36 xl:px-16">
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-7"><h2 className="font-display text-4xl md:text-6xl">Dentro l’evento.</h2>{!available.length && <p className="max-w-xs text-sm leading-relaxed text-white/60">La selezione fotografica sarà inserita qui. Solo immagini reali, fornite da Events Studio.</p>}</div>
    <div className="grid grid-cols-1 gap-x-[12%] gap-y-14 md:grid-cols-2 md:gap-y-24">{images.map((image, index) => <div key={image.id} className={image.layout === 'opening' || image.layout === 'closing' ? 'md:col-span-2' : image.layout === 'portrait-right' ? 'md:mt-40' : ''}>
      <Reveal><figure>{image.src ? <button type="button" className="group block w-full" aria-label={`Apri ${image.title}`} onClick={() => setSelected(available.findIndex(item => item.id === image.id))}><img src={image.src} srcSet={image.srcSet} sizes="(max-width: 767px) 100vw, 75vw" alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" style={{ objectPosition: image.position }} className="h-auto w-full transition-opacity hover:opacity-85" /></button> : <VisualSlot visual={image} label={`${title} / ${String(index + 1).padStart(2,'0')}`} className={image.layout.startsWith('portrait') ? 'aspect-[4/5]' : 'aspect-[16/10] md:aspect-[16/9]'} />}
      <figcaption className="mt-4 flex justify-between gap-4 text-xs text-white/60"><span>{String(index + 1).padStart(2,'0')}</span><span>{image.src ? image.title : 'Segnaposto fotografico'}</span></figcaption></figure></Reveal>
    </div>)}</div><GalleryLightbox images={available} index={selected} onIndexChange={setSelected} onClose={() => setSelected(null)} />
  </section>;
}
