import { officialContent, officialReviews, httpsUrl } from "@/lib/official-content";
import { OfficialLink } from "./official-link";
import { Reveal } from "./reveal";

export function ReviewsSection() {
  return <section id="recensioni" aria-labelledby="reviews-heading" className="bg-surface px-6 py-20 md:px-10 md:py-32 xl:px-16">
    <div className="mx-auto max-w-448">
      <Reveal>
        <p className="mb-10 text-xs uppercase tracking-[.2em] text-sand md:mb-16 md:text-sm">02 / Le vostre parole</p>
        <div className="grid items-end gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <h2 id="reviews-heading" className="font-display text-[clamp(2.75rem,6.3vw,6.5rem)] leading-[1.07] tracking-[-.03em]">Chi ci ha scelto,<br /><span className="text-sand">lo racconta.</span></h2>
          {officialReviews.length === 0 && <div className="max-w-sm border-l border-sand/40 pl-6">
            {/* <!-- [PLACEHOLDER: Inserire soltanto recensioni autentiche fornite dal cliente] --> */}
            <p className="text-base leading-relaxed text-white/70">Questo spazio accoglierà le recensioni verificate di chi ha scelto Events Studio.</p>
            <p className="mt-4 text-sm text-white/55">Testimonianze in attesa dei contenuti ufficiali.</p>
          </div>}
        </div>
      </Reveal>
      {officialReviews.length > 0 && <div className="mt-14 divide-y divide-white/15 md:mt-20">
        {officialReviews.map(review => <Reveal key={review.id}>
          <figure className="grid gap-7 py-10 md:grid-cols-[1fr_3fr] md:gap-14 md:py-14">
            <figcaption className="order-2 text-sm leading-relaxed text-white/60 md:order-1">
              <p className="text-white">{review.author}</p>
              {review.dateLabel && <p className="mt-2">{review.dateLabel}</p>}
              {httpsUrl(review.sourceUrl) && <a href={httpsUrl(review.sourceUrl)!} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sand underline underline-offset-4">Leggi la fonte</a>}
            </figcaption>
            <blockquote className="order-1 max-w-4xl font-display text-[clamp(1.75rem,3vw,3rem)] leading-snug md:order-2"><p>{review.text}</p></blockquote>
          </figure>
        </Reveal>)}
      </div>}
      <Reveal className="mt-12 flex flex-wrap gap-x-12 gap-y-3 border-t border-white/15 pt-5 md:mt-20">
        <OfficialLink href={httpsUrl(officialContent.reviewsUrl)}>Leggi tutte le recensioni</OfficialLink>
        <OfficialLink href={httpsUrl(officialContent.writeReviewUrl)}>Lascia una recensione</OfficialLink>
      </Reveal>
    </div>
  </section>;
}

