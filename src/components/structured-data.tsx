import { siteOrigin, indexable } from '@/lib/seo';
import { officialContent as content, httpsUrl } from '@/lib/official-content';
export function StructuredData() {
  const origin=siteOrigin();
  if(!origin||!indexable())return null;
  const data={'@context':'https://schema.org','@type':'Organization',name:'Events Studio',url:origin,logo:`${origin}/assets/logo/events-studio.png`,areaServed:[{'@type':'City',name:'Potenza'},{'@type':'AdministrativeArea',name:'Basilicata'}],...(content.phone?{telephone:content.phone}:{}),...(content.email?{email:content.email}:{}),sameAs:[httpsUrl(content.instagram),httpsUrl(content.instagramWedding)].filter(Boolean)};
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}} />;
}
