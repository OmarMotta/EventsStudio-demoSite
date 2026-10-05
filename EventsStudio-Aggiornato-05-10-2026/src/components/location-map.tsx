export function LocationMap({ embedUrl }: { embedUrl: string | null }) {
  let source: string | null = null;
  try {
    const url = new URL(embedUrl ?? '');
    if (url.protocol === 'https:' && ['www.google.com', 'maps.google.com'].includes(url.hostname) && (url.pathname.startsWith('/maps/embed') || (url.pathname === '/maps' && url.searchParams.get('output') === 'embed'))) source = url.href;
  } catch {}
  return <div className="relative min-h-80 w-full min-w-0 border border-white/10 bg-surface md:aspect-[6/5]">
    {source ? <iframe title="Posizione ufficiale di Events Studio su Google Maps" src={source} loading="eager" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 size-full border-0" /> : <p className="p-8 text-white/70">Posizione da inserire.</p>}
  </div>;
}
