# Contatti — migrazione Hostinger / Resend

## Stato e analisi

Next.js 16.4.2, React 19, TypeScript 5.9, App Router. Nessun `output: export`; `/api/contact` e `/contatti` sono dinamici. Le altre pagine conservano la generazione statica e la grafica originale.
Un solo modulo in `src/components/contact-form.tsx`: nome, cognome, telefono, email, tipologia, data facoltativa, location, messaggio, privacy, honeypot. I parametri `evento` e `servizio` preselezionano tipologia e testo; il servizio è verificato contro l’elenco reale. Non ci sono altri step, campi condizionali o selezioni multiple da migrare.

Il frontend usa la stessa validazione del server. POST JSON → controllo origine e payload (20 KB) → validazione → guardie persistenti Upstash → Resend via HTTPS. Email HTML nero/oro e versione testuale, Reply-To validato, tutti i campi compresi consenso e riferimento. Nessuna conferma automatica al mittente, non richiesta in questa migrazione.
Successo significa accettazione di Resend con ID valido, NON consegna verificata alla casella. Nessun archivio locale delle richieste. Il destinatario legge e gestisce le email, anche da Outlook su telefono.

## Configurazione locale

1. Installare Node 22 o 24. Eseguire `pnpm install --frozen-lockfile`.
2. Copiare `.env.example` in `.env.local` e compilare i valori solo nel proprio ambiente.
3. Impostare `CONTACT_SITE_ORIGIN=http://127.0.0.1:3000` e usare proprio quell’indirizzo. Per `npm run dev -- --port 3011` impostare invece porta 3011. L’origine include protocollo e porta: localhost e 127.0.0.1 sono diversi.
4. `npm run dev`. Senza credenziali sito e validazione funzionano; un invio valido riceve errore 503, mai una conferma fittizia. Con credenziali l’invio locale è REALE.
5. Dopo modifiche alle variabili riavviare il processo.

| Variabile | Contenuto |
|---|---|
| RESEND_API_KEY | Chiave privata con permesso di invio del dominio scelto |
| CONTACT_TO_EMAIL | Casella reale dell’attività: il proprietario ha confermato events_studiopz@hotmail.com |
| CONTACT_FROM_EMAIL | Solo indirizzo email del dominio proprio verificato su Resend; non usare Hotmail come mittente |
| CONTACT_SITE_ORIGIN | Origine esatta del sito, HTTPS in produzione, senza percorso |
| UPSTASH_REDIS_REST_URL | Endpoint HTTPS del database Redis dedicato |
| UPSTASH_REDIS_REST_TOKEN | Token privato con scrittura, non read-only |
| CONTACT_GUARD_SECRET | Segreto casuale stabile di almeno 32 caratteri |
| CONTACT_FORM_ENABLED | true; false per sospendere gli invii |
| SITE_URL | Dominio pubblico per canonical e sitemap |
| SITE_INDEXABLE | false fino al collaudo, poi true per indicizzare |

Generare il segreto in locale con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` e custodirlo nel gestore di segreti. Non usare il prefisso NEXT_PUBLIC_ per queste credenziali. Non pubblicare .env.local né screenshot contenenti chiavi.

## Servizi da attivare manualmente

### Resend

Creare un account dell’attività, aggiungere il dominio o sottodominio di invio posseduto e copiare nel gestore DNS SOLO i record mostrati da Resend (DKIM e record richiesti per SPF/Return-Path). Verificare lo stato Verified. Coordinare DMARC con la posta esistente, senza sostituire MX o aggiungere SPF duplicati alla cieca. Non sono stati modificati DNS in questo intervento.
Creare una chiave limitata all’invio e al dominio; scegliere il mittente effettivo e compilare CONTACT_FROM_EMAIL. Tenere disattivato il tracking di aperture/click. Verificare regione, DPA, conservazione dei contenuti, quote e notifiche di mancata consegna nel proprio account.

### Upstash Redis

Serve per protezioni condivise fra processi, riavvii e deploy: non è un archivio dei messaggi. Creare database dedicato, preferibilmente regione UE, copiare REST URL e token. Non attivare eviction delle chiavi né svuotare il database per sbloccare richieste: si perderebbe la memoria dei duplicati. Verificare costi/quote e disponibilità. Nessun database è stato creato automaticamente.

## Hostinger (solo quando acquistato)

Documentazione consultata: Business/Unlimited supporta Next.js full-stack e Node 22/24. Selezionare una **Node.js web app**, non semplice hosting di file statici.
Collegare GitHub soltanto quando autorizzato alla pubblicazione. Root del repository, framework Next.js, Node 22, package manager pnpm, build `pnpm build` (equivalente `npm run build`), start `npm start` se richiesto dalla configurazione. Il runtime ascolta su 0.0.0.0 e usa PORT fornita dall’hosting; output Next `.next`, mai `out`.
Inserire le variabili nella sezione Environment Variables dell’app Node.js prima della build/avvio. Impostare SITE_URL e CONTACT_SITE_ORIGIN al dominio reale e assicurare HTTPS e redirect coerenti tra www e dominio principale.
Collaudare nel processo reale di Hostinger la disponibilità delle variabili, le connessioni HTTPS verso Resend/Upstash, l’avvio e il mantenimento delle ricevute dopo riavvio/deploy. Configurare protezioni di ingresso/DDoS offerte dall’hosting e autenticazione a due fattori. Il rate limit applicativo non sostituisce la protezione di rete.

## Sicurezza e duplicati

- Origine esplicita configurata; Host/X-Forwarded-For del visitatore non autorizzano richieste o aggirano quote. L’origine è una protezione browser, non autenticazione dei bot.
- Honeypot, enum, limiti, privacy obbligatoria, escaping HTML, richieste <=20 KB, timeout e redirect esterni vietati.
- Limiti atomici Redis: 5 nuove richieste per email in 10 minuti e 30 complessive per origine in 10 minuti. Sono quote conservative, condivise; un attaccante può consumarle e negare temporaneamente invii legittimi. Per traffico maggiore rivedere soglie e protezioni edge con dati reali.
- Redis conserva HMAC non reversibili senza segreto, UUID e stato. Quote scadono dopo 10 minuti, ricevute dopo 48 ore. Non salva messaggi o indirizzi in chiaro. Sono dati tecnici pseudonimizzati, non una promessa di anonimato assoluto.
- Prenotazione atomica prima dell’invio; secondo invio identico restituisce la ricevuta, oppure esito incerto se il primo è ancora in corso. Resend riceve anche una chiave di idempotenza (conservata dal provider per 24 ore).
- In caso di timeout, rifiuto provider o mancato salvataggio della conferma non c’è reinvio automatico; la richiesta resta incerta fino alla scadenza della guardia (48 ore). Il pulsante Verifica esito legge lo stato, non forza un altro invio. Contattare l’attività con il riferimento e controllare Resend prima di qualsiasi reinvio.
- Nessun endpoint pubblico elenca le richieste: GET /api/contact è 405. I log applicativi contengono solo eventi generici/riferimento, mai corpo, token o recapiti.
- Senza Redis o configurazione valida l’invio si ferma. Nessun fallback in memoria o su servizio fittizio.

## Gestione e diagnosi

Il proprietario apre le email nell’app di posta, usa Rispondi (Reply-To cliente), controlla anche spam e gli stati di consegna Resend. Non c’è più una dashboard Forms per le nuove richieste. Un test HTTP non dimostra la consegna nella posta. Proteggere account, quote e rinnovi dei servizi.
503: variabili mancanti/errate, archivio irraggiungibile o invii sospesi. 403: origine diversa (porta, protocollo, www). 400: campi non validi. 429: quota raggiunta, attendere Retry-After. 409: accettazione non confermata, controllare dominio/chiave/quote Resend e casella prima di ripetere. Nessun dettaglio privato del provider viene esposto al visitatore.
Conservazione richieste senza seguito: 12 mesi dall’ultimo contatto, cancellazione manuale in casella e copie operative; verificare separatamente la conservazione Resend. Il testo pubblico descrive i nuovi fornitori: confermare contratti, regioni e condizioni reali prima della pubblicazione.
I vecchi contatti presenti nel precedente hosting non vengono trasferiti o cancellati da questo codice: il titolare deve gestirli secondo la conservazione stabilita. Vecchi rapporti tecnici restano in docs/archivio, nessuna vecchia integrazione è eseguibile.

## Collaudo

`npm run typecheck`, `npm test`, `npm run build`. La build usa il compilatore Webpack supportato da Next.js: Turbopack ha incontrato un limite di apertura porte nei processi del compilatore nell’ambiente locale di verifica. Lo sviluppo conserva `npm run dev`.
`CONTACT_SITE_ORIGIN=http://127.0.0.1:3021 npm start -- --port 3021`, poi `SECURITY_TEST_BASE_URL=http://127.0.0.1:3021 npm run test:security` per controlli HTTP locali senza invii.
Test automatici con mock verificano dati, injection, HTML, provider errori/timeout, concorrenza, duplicati e quote; non certificano Redis reale o consegna email.
Dopo credenziali: inviare una richiesta reale concordata dal browser, controllare tutti i campi in Resend e nella casella, Reply-To, spam e assenza duplicati. Provare desktop/tablet/telefono e assenza connessione. Ripetere dopo il deploy Hostinger, verificando riavvio e origini pubbliche.
Il comando `CONTACT_E2E_BASE_URL=https://DOMINIO_REALE CONTACT_E2E_EMAIL=EMAIL_DI_TEST npm run test:production` invia DAVVERO un’email e ripete il POST identico per controllare deduplicazione. Eseguirlo solo con autorizzazione e credenziali; non viene eseguito automaticamente.

## Fonti ufficiali

- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/domains/introduction
- https://resend.com/changelog/idempotency-keys
- https://upstash.com/docs/redis/features/restapi
