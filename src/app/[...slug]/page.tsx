import { notFound } from 'next/navigation';
import { collections, routes } from '@/lib/collections';
import { AboutPage, CategoryIndex, CollectionPage, ServicesPage, TourismPage } from '@/components/interior';
import { featuredEventPages, pageMetadata } from '@/lib/seo';
const pages: Record<string, { title: string; description: string }> = {
  'chi-siamo': { title: 'Chi siamo', description: 'Events Studio nasce per offrire un servizio completo per le esigenze organizzative e rendere ogni evento indimenticabile.' },
  servizi: { title: 'DJ, musica e allestimenti per eventi a Potenza', description: 'Scopri i servizi di Events Studio: DJ, animazione, musica dal vivo, performer, effetti speciali e allestimenti personalizzati.' },
  party: { title: 'Party e diciottesimi a Potenza', description: 'Scopri le feste private e i diciottesimi di Events Studio, con musica e intrattenimento a Potenza e in Basilicata.' },
  events: { title: 'Servizi per eventi in Basilicata', description: 'Scopri i servizi di Events Studio per matrimoni, eventi aziendali, feste di piazza e spettacoli in Basilicata.' },
  tourism: { title: 'Tourism', description: 'Il mondo Tourism di Events Studio. Presentazione, esperienze e destinazioni in preparazione.' },
};
export function generateStaticParams() { return routes.filter(path=>path!=='/' && path!=='/contatti').map(path=>({ slug:path.slice(1).split('/') })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const path = (await params).slug.join('/');
  const url = `/${path}`;
  const featuredPages: Partial<Record<string, { title: string; description: string }>> = featuredEventPages;
  const info = featuredPages[url] ?? pages[path] ?? collections.find(item => `${item.group}/${item.slug}` === path);
  return info ? pageMetadata(info.title, info.description, url) : {};
}
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
