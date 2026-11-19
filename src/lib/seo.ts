import type { Metadata } from 'next';

export const homeSearchTitle = 'Matrimoni ed eventi a Potenza';

export const featuredEventPages = {
  '/events/wedding': {
    label: 'Matrimoni',
    title: 'Musica e intrattenimento per matrimoni in Basilicata',
    description: 'DJ, musica dal vivo e allestimenti per matrimoni a Potenza e in Basilicata. Scopri come accompagnare il ricevimento, il primo ballo e la festa.',
  },
  '/events/eventi-aziendali': {
    label: 'Eventi aziendali',
    title: 'Organizzazione eventi aziendali a Potenza',
    description: 'Servizi per convention, congressi, meeting e feste aziendali a Potenza e in Basilicata, con hostess, accoglienza e allestimenti personalizzati.',
  },
  '/party/feste-private': {
    label: 'Feste private',
    title: 'Feste private a Potenza',
    description: 'DJ, animazione e allestimenti per feste private a Potenza e in Basilicata. Scopri la gallery e raccontaci come vuoi festeggiare.',
  },
} satisfies Record<string, { label: string; title: string; description: string }>;

export function siteOrigin() {
  try { const url = new URL(process.env.SITE_URL ?? ''); return url.protocol === 'https:' ? url.origin : null; } catch { return null; }
}
export const indexable = () => Boolean(siteOrigin() && process.env.SITE_INDEXABLE === 'true');
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const origin = siteOrigin();
  return { title: `${title} — Events Studio`, description, robots: { index: indexable(), follow: indexable() }, alternates: origin ? { canonical: `${origin}${path}` } : undefined, openGraph: { title: `${title} — Events Studio`, description, locale: 'it_IT', type: 'website', ...(origin ? { url: `${origin}${path}`, images: [{ url: `${origin}/assets/logo/events-studio.png`, width: 2400, height: 1058, alt: 'Events Studio' }] } : {}) } };
}
