import { officialContent as content, httpsUrl, policyUrl } from "@/lib/official-content";
import { BrandMark } from "./brand-mark";
import { Reveal } from "./reveal";

const phoneHref = (phone: string | null) => phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : null;

export function SiteFooter() {
  const channels = [
    { label: "Telefono", value: content.phone, href: phoneHref(content.phone), external: false },
    { label: "WhatsApp", value: content.whatsapp, href: content.whatsapp ? `https://wa.me/${content.whatsapp.replace(/\D/g, "")}` : null, external: true },
    { label: "Email", value: content.email, href: content.email ? `mailto:${content.email}` : null, external: false },
    { label: "Indirizzo / Maps", value: content.address, href: httpsUrl(content.mapsUrl), external: true },
  ];
  const socials = [
    { label: "Instagram — Events Studio", href: httpsUrl(content.instagram) },
    { label: "Instagram — Events Studio Wedding", href: httpsUrl(content.instagramWedding) },
  ];
  const policies = [
    { label: "Privacy policy", href: policyUrl(content.privacyUrl) },
    { label: "Cookie policy", href: policyUrl(content.cookiesUrl) },
  ];

  return <footer id="contatti" aria-labelledby="contact-heading" className="scroll-mt-8 bg-ink px-6 pb-8 pt-8 md:px-10 md:pb-12 xl:px-16">
    <div className="mx-auto max-w-448 border-t border-sand/40 pt-8 md:pt-12">
      <Reveal>
        <p className="mb-12 text-xs uppercase tracking-[.2em] text-sand md:mb-20 md:text-sm">04 / Contattaci</p>
        <h2 id="contact-heading" className="font-display text-[clamp(3.1rem,9vw,10rem)] leading-[1.02] tracking-[-.035em]">Raccontaci<br /><span className="text-sand">il tuo evento.</span></h2>
        <div className="mb-14 mt-8 max-w-lg md:mb-20 md:mt-12">
          {channels.every(channel => !channel.href) && <p className="text-sm leading-relaxed text-white/55">I recapiti ufficiali saranno disponibili qui. Il modulo per raccontarci il tuo evento verrà aggiunto nella prossima fase dedicata ai contatti.</p>}
        </div>
      </Reveal>

      <Reveal>
        <div className="grid border-t border-white/15 md:grid-cols-2 md:gap-x-16 xl:gap-x-28">
          {channels.map(channel => <div key={channel.label} className="min-w-0 border-b border-white/15 py-7 md:py-9">
            <p className="mb-3 text-xs uppercase tracking-[.15em] text-sand">{channel.label}</p>
            {channel.href ? <a href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined} className="inline-flex min-h-11 items-center break-all text-lg leading-relaxed text-white transition-colors hover:text-sand md:text-xl">{channel.value ?? "Apri Google Maps"}</a> : <p className="text-base text-white/55">{channel.value ?? "Da fornire"}</p>}
          </div>)}
        </div>
        <div className="flex flex-col gap-7 border-b border-white/15 py-9 md:flex-row md:gap-16 md:py-12">
          {socials.map(social => <div key={social.label} className="min-w-0">
            {social.href ? <a href={social.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-white transition-colors hover:text-sand">{social.label}</a> : <><p className="text-sm leading-relaxed text-white/65">{social.label}</p><p className="mt-2 text-xs text-white/55">Profilo ufficiale da fornire</p></>}
          </div>)}
        </div>
        <div className="flex flex-col justify-between gap-10 py-10 md:flex-row md:items-start md:py-14">
          <div className="max-w-xl text-sm leading-relaxed text-white/55">
            <p className="mb-3 text-white">EVENTS STUDIO</p>
            {content.companyDetails ? <p className="whitespace-pre-line">{content.companyDetails}</p> : <p>Dati societari da fornire.</p>}
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
              {policies.map(policy => policy.href ? <a key={policy.label} href={policy.href} className="inline-flex min-h-11 items-center text-xs underline underline-offset-4 hover:text-sand">{policy.label}</a> : <p key={policy.label} className="text-xs leading-relaxed">{policy.label}<span className="mt-1 block text-white/55">Testo ufficiale da fornire</span></p>)}
            </div>
          </div>
          <BrandMark />
        </div>
        <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-5 text-xs text-white/55">
          <span>© Events Studio</span>
          <a href="#contenuto" className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-sand">Torna all’inizio</a>
        </div>
      </Reveal>
    </div>
  </footer>;
}

