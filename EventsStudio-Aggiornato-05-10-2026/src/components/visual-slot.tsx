'use client';
import { useReducedMotion } from 'motion/react';
import type { Visual } from '@/lib/collections';

export function VisualSlot({ visual, label, className = '', priority = false }: { visual: Visual; label: string; className?: string; priority?: boolean }) {
  const reduced = useReducedMotion();
  return <div className={`relative isolate overflow-hidden bg-surface ${className}`}>
    {visual.src ? <img src={visual.src} srcSet={visual.srcSet} sizes="(max-width: 767px) 100vw, 75vw" alt={visual.alt} width={visual.width} height={visual.height} loading={priority ? 'eager' : 'lazy'} decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-1000 group-hover:scale-[1.025] motion-reduce:transform-none" /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 border border-white/10 px-6 text-center"><span aria-hidden="true" className="h-12 w-px bg-sand/40" /><span className="text-xs uppercase tracking-[.18em] text-white/60">{label}</span><span className="text-xs text-white/55">Immagine ufficiale da fornire</span></div>}
    {visual.video && reduced === false && <video key={visual.video} autoPlay muted loop playsInline preload="none" poster={visual.src ?? undefined} aria-hidden="true" className="absolute inset-0 size-full object-cover"><source src={visual.video} type="video/mp4" /></video>}
  </div>;
}
