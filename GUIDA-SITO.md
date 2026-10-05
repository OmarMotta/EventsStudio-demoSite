# EVENTS STUDIO — gestione del sito

## Avvio e modifica

Il progetto usa Next.js: non esiste un unico index.html da modificare. La homepage è in `src/app/page.tsx`; lo stile generale in `src/app/globals.css`. Con Node.js 22+ e pnpm, eseguire `pnpm install`, poi `pnpm dev`. Aprire http://127.0.0.1:3000. Per produzione: `pnpm build` e `pnpm start` su un server Node.js.

## Pagine e contenuti

Sono implementati tutti i 13 URL richiesti: homepage, chi-siamo, servizi, contatti, party, i due album Party, events, i quattro album Events, tourism. Le pagine interne sono generate da `src/app/[...slug]/page.tsx`; la pagina contatti ha un proprio file.

- `src/lib/collections.ts`: copertine, foto di ogni album, servizi, storia e Tourism.
- `src/lib/gallery.ts`: fotografie homepage.
- `src/lib/official-content.ts`: recensioni, contatti, mappe, profili e policy.
- `src/lib/site.ts`: logo, video homepage e navigazione.

Ogni foto va nella cartella corrispondente sotto `public/assets/images/`. Nel contenuto usare un percorso pubblico `/assets/images/...`, non `public/...`. Compilare `src`, `alt`, `width`, `height` e, se disponibili, le varianti in `srcSet`. La presenza di file nella cartella non li pubblica automaticamente: l’elenco editoriale determina ordine e testi. È possibile aggiungere immagini agli array senza cambiare i componenti. Non inserire fotografie stock o generate come portfolio.

Le copertine supportano anche `video`: MP4 web, silenzioso, con `src` come poster. La preferenza di movimento ridotto mostra il poster. Le gallery riutilizzano il lightbox con frecce, Escape, focus confinato e swipe. Finché gli asset sono null vengono mostrati segnaposto non cliccabili.

## Invio del modulo

È implementato un backend reale in `src/app/api/contact/route.ts`, con validazione lato server, limite di dimensione, controllo dell’origine e campo antispam. Non salva dati personali nei file del sito e non simula invii riusciti.

1. Inserire la privacy approvata in `officialContent.privacyUrl`.
2. Copiare `.env.example` in `.env.local`.
3. Impostare `CONTACT_WEBHOOK_URL` sull’endpoint HTTPS autorizzato del proprio servizio di ricezione (CRM, automazione o backend email).
4. Se richiesto, impostare `CONTACT_WEBHOOK_TOKEN`: viene usato solo lato server come Bearer token.
5. Riavviare e provare l’invio con dati di test concordati con il responsabile del servizio.

Il ricevitore accetta POST JSON con nome, cognome, telefono, email, tipologia, data, location, messaggio, privacy, privacyUrl, receivedAt e source. Deve rispondere 2xx soltanto dopo la presa in carico durevole della richiesta. Un errore o timeout produce un messaggio esplicito nel form. Configurare limiti di frequenza nel servizio o nel proxy di produzione; il campo antispam non sostituisce la protezione del ricevitore. Nessun endpoint è stato inventato o contattato durante i test: è stata usata una simulazione isolata.

## SEO e pubblicazione

Ogni pagina ha titolo, descrizione, H1 e Open Graph. Per attivare URL assoluti, canonical, sitemap e dati strutturati, compilare `SITE_URL` con il dominio HTTPS ufficiale. Solo dopo avere completato e verificato contenuti, policy e integrazioni impostare `SITE_INDEXABLE=true` e ricostruire il sito. La sitemap è intenzionalmente vuota e robots blocca l’indicizzazione finché l’anteprima non è pronta. I dati strutturati menzionano Potenza e Basilicata come area, senza inventare un indirizzo o recensioni.

## Stato rispetto al brief

| Punti | Stato |
| --- | --- |
| 1–9 | Identità e header implementati; E/S e controlli video rimossi su richiesta successiva. Logo originale e video approvato conservati. |
| 10–11 | Transizione e gallery homepage predisposte; foto definitive mancanti. |
| 12–19 | Party, Events e sei album implementati, con segnaposto. |
| 20–22 | Tourism, sei servizi e Chi siamo implementati; storia e materiale Tourism da fornire. |
| 23–24 | Pagina contatti, modulo e backend implementati; invio da attivare con endpoint e privacy. |
| 25–28 | Recensioni, posizione, social, contatti e footer predisposti; dati ufficiali mancanti. |
| 29–30 | Reveal e transizioni di ingresso leggere; navigazione Next Link senza ricaricamenti completi. Movimento ridotto rispettato. |
| 31–35 | Asset organizzati, lazy loading, font locali, responsive, SEO e sitemap predisposti. |
| 36–40 | Nessun dato ufficiale inventato; CTA verso contatti e portfolio reali. |
| 41–44 | Build e verifiche documentate in VERIFICHE.md. La richiesta successiva ha autorizzato il completamento delle pagine in questa fase. |

Prima della pubblicazione servono ancora foto, testi ufficiali, recapiti, recensioni e link, posizione, policy, dati societari, dominio e configurazione dell’invio. Il completamento tecnico delle strutture non equivale a un sito ufficiale pronto al pubblico.
