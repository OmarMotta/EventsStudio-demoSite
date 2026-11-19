import { siteOrigin, indexable } from '@/lib/seo';
import { officialContent as content, httpsUrl, studioAddress } from '@/lib/official-content';

export function StructuredData() {
  const origin = siteOrigin();
  if (!origin || !indexable()) return null;

  const mapsUrl = httpsUrl(content.mapsUrl);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${origin}/#events-studio`,
    name: 'Events Studio',
    url: origin,
    logo: `${origin}/assets/logo/events-studio.png`,
    image: `${origin}/assets/events-studio-sede.webp`,
    address: { '@type': 'PostalAddress', ...studioAddress },
    areaServed: [
      { '@type': 'City', name: 'Potenza' },
      { '@type': 'AdministrativeArea', name: 'Basilicata' },
    ],
    ...(content.phone ? { telephone: content.phone } : {}),
    ...(content.email ? { email: content.email } : {}),
    ...(mapsUrl ? { hasMap: mapsUrl } : {}),
    sameAs: [content.instagram, content.instagramWedding, content.facebook].map(httpsUrl).filter(Boolean),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}} />;
}
