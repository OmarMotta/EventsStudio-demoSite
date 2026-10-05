import { notFound } from 'next/navigation';
import { collections, routes } from '@/lib/collections';
import { AboutPage, CategoryIndex, CollectionPage, ServicesPage, TourismPage } from '@/components/interior';
import { pageMetadata } from '@/lib/seo';
const pages: Record<string, { title: string; description: string }> = {
  'chi-siamo': { title: 'Chi siamo', description: 'Events Studio nasce per offrire un servizio completo per le esigenze organizzative e rendere ogni evento indimenticabile.' },
  servizi: { title: 'Servizi', description: 'DJ, animazione, live band, musicisti, performer, show production, allestimenti ed effetti speciali per gli eventi.' },
  party: { title: 'Party', description: 'Feste private e diciottesimi: esplora i due mondi Party di Events Studio.' },
  events: { title: 'Events', description: 'Wedding, eventi aziendali, feste di piazza e spettacoli: gli eventi di Events Studio.' },
  tourism: { title: 'Tourism', description: 'Il mondo Tourism di Events Studio. Presentazione, esperienze e destinazioni in preparazione.' },
};
export function generateStaticParams() { return routes.filter(path=>path!=='/' && path!=='/contatti').map(path=>({ slug:path.slice(1).split('/') })); }
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}) { const path=(await params).slug.join('/'); const item=collections.find(c=>`${c.group}/${c.slug}`===path); const info=pages[path] ?? item; return info ? pageMetadata(info.title, info.description, `/${path}`) : {}; }
export default async function Page({params}:{params:Promise<{slug:string[]}>}) {
  const path=(await params).slug.join('/');
  if(path==='party'||path==='events') return <CategoryIndex group={path} />;
  if(path==='servizi') return <ServicesPage />;
  if(path==='chi-siamo') return <AboutPage />;
  if(path==='tourism') return <TourismPage />;
  const item=collections.find(c=>`${c.group}/${c.slug}`===path);
  if(!item) notFound();
  return <CollectionPage item={item} />;
}
