import Link from 'next/link';
import { PageIntro, PageShell } from '@/components/interior';
import { contactPrivacy } from '@/lib/contact-privacy';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Informativa privacy', 'Informativa sul trattamento dei dati delle richieste inviate a Events Studio.', '/privacy');

export default function PrivacyPage() {
  return <PageShell>
    <PageIntro title="Privacy" eyebrow="Events Studio / Informativa" description="Come trattiamo i dati che ci affidi quando ci contatti." />
    <article aria-label="Informativa sul trattamento dei dati personali" className="px-6 pb-28 md:px-10 xl:px-16">
      <div className="grid gap-10 border-t border-white/20 pt-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="text-sm leading-relaxed text-white/60">Ultimo aggiornamento<br /><time dateTime={contactPrivacy.version} className="text-sand">{contactPrivacy.updated}</time></p>
          <Link href="/contatti" className="mt-6 inline-flex min-h-11 items-center text-sm text-sand underline underline-offset-4">Torna al modulo Contattaci</Link>
          <Link href="/cookie-policy" className="mt-3 flex min-h-11 items-center text-sm text-sand underline underline-offset-4">Cookie policy</Link>
        </div>
        <div className="min-w-0 max-w-3xl space-y-10">
          {contactPrivacy.sections.map((section, index) => <section key={section.title} aria-labelledby={`privacy-section-${index}`}>
            <h2 id={`privacy-section-${index}`} className="font-display text-3xl leading-tight md:text-4xl">{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-5 text-base leading-relaxed text-white/75">{paragraph}</p>)}
            {'links' in section && <ul className="mt-4 space-y-2">{section.links?.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-sand underline underline-offset-4">{link.label}<span className="sr-only"> (si apre in una nuova scheda)</span></a></li>)}</ul>}
          </section>)}
        </div>
      </div>
    </article>
  </PageShell>;
}
