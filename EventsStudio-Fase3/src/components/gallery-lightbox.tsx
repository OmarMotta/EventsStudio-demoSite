"use client";

import { useEffect, useRef } from "react";
import type { GalleryImage } from "@/lib/gallery";

type Props = {
  images: GalleryImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function GalleryLightbox({ images, index, onIndexChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerOrigin = useRef<{ x: number; y: number } | null>(null);
  const isOpen = index !== null;
  const selected = index === null ? null : images[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function move(direction: number) {
    if (index !== null) onIndexChange((index + direction + images.length) % images.length);
  }

  return <dialog ref={dialogRef} aria-labelledby="gallery-lightbox-title" aria-describedby="gallery-lightbox-caption" onCancel={event => { event.preventDefault(); onClose(); }} onClose={onClose}
    onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "Home") { event.preventDefault(); onIndexChange(0); }
      if (event.key === "End") { event.preventDefault(); onIndexChange(images.length - 1); }
      if (event.key === "Tab") {
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-white">
    {selected && <div className="flex h-full min-h-80 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] md:px-10">
      <div className="flex shrink-0 items-center justify-between gap-4 pb-3 md:pb-5">
        <h2 id="gallery-lightbox-title" className="text-xs uppercase tracking-[.16em] text-sand md:text-sm">Events Studio / Immagini</h2>
        <button autoFocus type="button" onClick={onClose} aria-label="Chiudi galleria" className="flex min-h-11 min-w-11 items-center justify-end gap-3 text-sm hover:text-sand">
          <span>Chiudi</span><span aria-hidden="true" className="text-2xl font-light">×</span>
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center" onPointerDown={event => {
        if (event.pointerType !== "mouse") pointerOrigin.current = { x: event.clientX, y: event.clientY };
      }} onPointerUp={event => {
        const start = pointerOrigin.current;
        pointerOrigin.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
      }} onPointerCancel={() => { pointerOrigin.current = null; }}>
        <img key={selected.id} src={selected.src ?? undefined} alt={selected.alt} width={selected.width} height={selected.height} draggable={false} className="max-h-full w-full object-contain" />
      </div>
      <div className="mt-4 grid shrink-0 grid-cols-[1fr_auto] items-end gap-x-4 gap-y-4 border-t border-white/20 pt-4 md:grid-cols-[1fr_auto_1fr]">
        <div id="gallery-lightbox-caption" aria-live="polite" aria-atomic="true">
          <p className="text-base md:text-lg">{selected.title}</p>
          <p className="mt-1 text-xs text-white/55">{String((index ?? 0) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>
        </div>
        <p className="hidden text-xs text-white/50 md:block">Tasti direzionali per sfogliare</p>
        <div className="flex items-center justify-end gap-4 md:gap-8">
          <button type="button" onClick={() => move(-1)} aria-label="Immagine precedente" className="min-h-11 px-1 text-sm transition-colors hover:text-sand">Precedente</button>
          <button type="button" onClick={() => move(1)} aria-label="Immagine successiva" className="min-h-11 px-1 text-sm transition-colors hover:text-sand">Successiva</button>
        </div>
      </div>
    </div>}
  </dialog>;
}
