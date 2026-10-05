import type { Metadata } from 'next';
// <!-- [PLACEHOLDER: Dominio ufficiale in SITE_URL; attivare SITE_INDEXABLE dopo il completamento dei contenuti] -->
export function siteOrigin() {
  try { const url = new URL(process.env.SITE_URL ?? ''); return url.protocol === 'https:' ? url.origin : null; } catch { return null; }
}
export const indexable = () => Boolean(siteOrigin() && process.env.SITE_INDEXABLE === 'true');
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const origin = siteOrigin();
  return { title: `${title} — Events Studio`, description, robots: { index: indexable(), follow: indexable() }, alternates: origin ? { canonical: `${origin}${path}` } : undefined, openGraph: { title: `${title} — Events Studio`, description, locale: 'it_IT', type: 'website', ...(origin ? { url: `${origin}${path}`, images: [{ url: `${origin}/assets/logo/events-studio.png`, width: 472, height: 423, alt: 'Events Studio' }] } : {}) } };
}
