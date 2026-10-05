'use client';
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <main className="flex min-h-dvh flex-col items-center justify-center gap-7 px-6 text-center"><p className="text-sm uppercase tracking-widest text-sand">Events Studio</p><h1 className="font-display text-4xl md:text-6xl">Un momento, per favore.</h1><p className="max-w-md text-base leading-relaxed text-white/70">Non siamo riusciti a caricare questa pagina. Puoi riprovare oppure tornare alla homepage.</p><button type="button" onClick={retry} className="min-h-12 border border-sand px-8 py-3 text-sand">Riprova</button><a href="/" className="min-h-11 py-3 underline underline-offset-4">Torna alla homepage</a></main>;
}
