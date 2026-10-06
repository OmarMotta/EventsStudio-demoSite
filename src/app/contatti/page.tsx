import { PageIntro, PageShell } from '@/components/interior';
import { ContactForm } from '@/components/contact-form';
import { LocationSection } from '@/components/location-section';
import { contactConfig } from '@/lib/contact-config';
import { pageMetadata } from '@/lib/seo';
import { services } from '@/lib/collections';
export const metadata=pageMetadata('Contatti','Racconta il tuo evento a Events Studio: richieste per Party, Events, Tourism e servizi.','/contatti');
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {const query=await searchParams;const config=contactConfig();return <PageShell><PageIntro title="Contattaci" eyebrow="Events Studio / Contatti" description="Un’idea, una data, un luogo. Da qui inizia il tuo evento." /><ContactForm enabled={config.enabled} privacyUrl={config.privacy} initialEvent={typeof query.evento==='string'?query.evento:''} initialService={typeof query.servizio==='string'&&services.some(s=>s.title===query.servizio)?query.servizio:''} /><LocationSection /></PageShell>;}
