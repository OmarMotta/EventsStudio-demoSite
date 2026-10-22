"use client";

import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { officialContent, officialReviews, httpsUrl } from "@/lib/official-content";
import { Reveal } from "./reveal";

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = officialReviews.length;
  const reviewsUrl = httpsUrl(officialContent.reviewsUrl);
  const activeReview = officialReviews[activeIndex];
  const move = (direction: number) => setActiveIndex(index => (index + direction + count) % count);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (count < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches.length === 1 ? event.touches[0] : undefined;
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch || event.touches.length > 0 || count < 2) return;
    const horizontal = touch.clientX - start.x;
    const vertical = touch.clientY - start.y;
    if (Math.abs(horizontal) >= 48 && Math.abs(horizontal) > Math.abs(vertical) * 1.5) {
      move(horizontal < 0 ? 1 : -1);
    }
  }

  if (!activeReview) return null;

  return <section id="recensioni" aria-labelledby="reviews-heading" className="bg-surface px-6 py-20 md:px-10 md:py-28 xl:px-16">
    <div className="mx-auto max-w-448">
      <Reveal>
        <p className="mb-10 text-xs uppercase tracking-[.2em] text-sand md:mb-14 md:text-sm">02 / Le vostre parole</p>
        <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-20 xl:gap-28">
          <div>
            <h2 id="reviews-heading" className="font-display text-[clamp(2.75rem,4.8vw,5rem)] leading-[1.07] tracking-[-.03em]">Chi ci ha scelto,<br /><span className="text-sand">lo racconta.</span></h2>
            {reviewsUrl && <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-sand/40 py-2 text-sm leading-relaxed text-white/70 transition-colors hover:text-sand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand md:mt-10">
              Leggi le recensioni su Google<span className="sr-only"> (si apre in una nuova scheda)</span>
            </a>}
          </div>
          <div role="region" aria-label="Recensioni dei clienti" aria-roledescription="carosello" onKeyDown={handleKeyDown} className="min-w-0 border-t border-sand/35 pt-7 md:pt-9">
            <div id="review-slides" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null; }} className="grid touch-pan-y">
              {officialReviews.map((review, index) => <figure key={review.id} role="group" aria-roledescription="testimonianza" aria-label={`${index + 1} di ${count}`} aria-hidden={index !== activeIndex} inert={index !== activeIndex} className={`col-start-1 row-start-1 flex min-w-0 flex-col transition-opacity duration-500 ease-out motion-reduce:transition-none ${index !== activeIndex ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                <span aria-hidden="true" className="mb-2 block h-10 font-display text-6xl leading-none text-sand/70">“</span>
                <blockquote className="font-display text-[clamp(1.5rem,2.15vw,2rem)] leading-[1.5] tracking-[-.015em] text-white/90"><p className="wrap-break-word">{review.text}</p></blockquote>
                <figcaption className="mt-7 pb-2 text-sm leading-relaxed md:mt-8">
                  <p className="text-white">{review.author}</p>
                  <p className="mt-1 text-xs tracking-[.06em] text-white/50">
                    {review.sourceLabel && httpsUrl(review.sourceUrl) ? <a href={httpsUrl(review.sourceUrl)!} target="_blank" rel="noopener noreferrer" className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-sand">Recensione su {review.sourceLabel}<span className="sr-only"> (si apre in una nuova scheda)</span></a> : "Recensione su Google"}{review.excerpt ? " · Estratto" : ""}{review.dateLabel ? ` · ${review.dateLabel}` : ""}
                  </p>
                </figcaption>
              </figure>)}
            </div>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
              <p role="status" aria-live="polite" aria-atomic="true" className="text-xs tabular-nums tracking-[.16em] text-white/60">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span><span aria-hidden="true" className="mx-3 text-white/30">/</span><span className="sr-only"> di </span><span>{String(count).padStart(2, "0")}</span><span className="sr-only">: {activeReview.author}</span>
              </p>
              {count > 1 && <div role="group" aria-label="Scegli una recensione" className="flex shrink-0">
                {officialReviews.map((review, index) => <button key={review.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Mostra recensione ${index + 1} di ${count}: ${review.author}`} aria-current={index === activeIndex ? "true" : undefined} aria-controls="review-slides" className="group flex h-11 w-9 items-center justify-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sand sm:w-11">
                  <span aria-hidden="true" className={`block h-px w-6 origin-center transition-[background-color,transform] duration-500 motion-reduce:transition-none sm:w-8 ${index === activeIndex ? "scale-y-200 bg-sand" : "bg-white/25 group-hover:bg-sand/65 group-focus-visible:bg-sand/65"}`} />
                </button>)}
              </div>}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>;
}
