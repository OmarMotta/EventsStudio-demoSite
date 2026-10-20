import Link from 'next/link';
import { PageIntro, PageShell } from '@/components/interior';
import { cookiePolicy } from '@/lib/cookie-policy';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Cookie policy', 'Cookie, tecnologie simili e servizi esterni presenti nel sito Events Studio.', '/cookie-policy');

export default function CookiePolicyPage() {
  return <PageShell>
    <PageIntro title="Cookie policy" eyebrow="Events Studio / Informativa" description="Cookie, archiviazione locale e servizi esterni del sito." />
    <article aria-label="Informativa sui cookie e sulle tecnologie simili" className="px-6 pb-28 md:px-10 xl:px-16">
      <div className="grid gap-10 border-t border-white/20 pt-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="text-sm leading-relaxed text-white/60">Ultimo aggiornamento<br /><time dateTime={cookiePolicy.version} className="text-sand">{cookiePolicy.updated}</time></p>
          <Link href="/privacy" className="mt-6 inline-flex min-h-11 items-center text-sm text-sand underline underline-offset-4">Informativa privacy</Link>
        </div>
        <div className="min-w-0 max-w-3xl space-y-10">
          {cookiePolicy.sections.map((section, index) => <section key={section.title} aria-labelledby={`cookie-section-${index}`}>
            <h2 id={`cookie-section-${index}`} className="font-display text-3xl leading-tight md:text-4xl">{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-5 text-base leading-relaxed text-white/75">{paragraph}</p>)}
            {'links' in section && <ul className="mt-4 space-y-2">{section.links?.map(link => <li key={link.href}><a href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} className="inline-flex min-h-11 items-center text-sm text-sand underline underline-offset-4">{link.label}{link.external && <span className="sr-only"> (si apre in una nuova scheda)</span>}</a></li>)}</ul>}
          </section>)}
        </div>
      </div>
    </article>
  </PageShell>;
}
