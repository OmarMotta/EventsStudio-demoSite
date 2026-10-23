"use client";
import { brand } from "@/lib/site";

export function BrandMark({ backToTop = false }: { backToTop?: boolean }) {
  return (
    <a onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (backToTop) {
        event.preventDefault();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
        const content = document.getElementById('contenuto');
        if (content) {
          content.setAttribute('tabindex', '-1');
          content.focus({ preventScroll: true });
          content.addEventListener('blur', () => content.removeAttribute('tabindex'), { once: true });
        }
        return;
      }
      if (window.location.pathname === '/') {
        event.preventDefault();
        window.dispatchEvent(new Event('events-studio:restart-hero'));
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }} href={backToTop ? '#contenuto' : '/'} aria-label={backToTop ? 'Events Studio — torna all’inizio della pagina' : 'Events Studio — homepage'} className="inline-flex min-h-14 w-32 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-sand md:w-24 lg:w-36">
        <img src={brand.logo} alt="Events Studio" width={397} height={175} fetchPriority="high" className="block h-auto w-full" />
    </a>
  );
}
