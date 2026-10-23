# Sicurezza del sito e del modulo — 22 ottobre 2026

## Limite di ingresso Netlify — 23 ottobre 2026

`netlify/edge-functions/contact-rate-limit.ts` dichiara una regola nativa Netlify per `/api/contact*`: 20 chiamate ogni 60 secondi per coppia IP/dominio, su tutti i metodi. Le altre pagine e gli asset non sono interessati. La funzione lascia proseguire le richieste ammesse senza accessi a Blobs o chiamate esterne. La piattaforma applica il blocco 429 prima delle funzioni; resta separato il limite applicativo di 5 nuove richieste ogni 10 minuti.

Il client riconosce anche le risposte 429 HTML/testo della piattaforma, mantiene i campi e attende Retry-After (massimo 10 minuti), oppure 60 secondi se assente. Un precedente esito incerto resta incerto.

La regola va verificata nei log del deploy, fase post-processing: la sola pubblicazione riuscita non certifica che Netlify l'abbia acquisita. Non viene eseguito uno stress test in produzione. Il conteggio Netlify può richiedere fino a 10 secondi per applicare il blocco; IP condivisi condividono la quota e molti IP diversi possono aggirare il singolo limite. Non è un limite globale del traffico né una garanzia di consumo massimo. Fonte: https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/

## Errore riscontrato nell’anteprima locale

`next start` fuori da Netlify non dispone del contesto Netlify Blobs e dell’indirizzo IP attendibile aggiunto dalla piattaforma. Il backend rifiuta gli invii con 503: non è una conferma di ricezione e non va aggirata aggiungendo credenziali al browser o simulando un successo.

La pagina Contattaci riconosce localhost/127.0.0.1/[::1] dall’Host e mostra una nota locale. Il pulsante «Verifica i campi» controlla dati obbligatori e formati senza inviare la richiesta. Sul dominio pubblicato rimane «Invia richiesta». I controlli server non sono stati indeboliti. Questo intervento chiarisce e corregge il comportamento dell’anteprima: non dimostra ancora il funzionamento della consegna Netlify in produzione.

## Interventi applicati

- Next.js aggiornato da 16.3.7 a 16.4.2.
- Dipendenza transitiva `source-map-js` aggiornata alla serie corretta >=1.2.2, tramite override mirato in `pnpm-workspace.yaml`, con lockfile aggiornato.
- Audit completo delle dipendenze di produzione e sviluppo: nessuna vulnerabilità nota segnalata al controllo del 22/10/2026. Non è una garanzia di assenza di vulnerabilità sconosciute.
- Intestazioni in Next.js e Netlify: CSP, divieto di incorporare il sito in iframe, protezione MIME sniffing, nessun referrer, disabilitazione delle API camera/microfono/geolocalizzazione/pagamenti/USB, HSTS per HTTPS e disabilitazione del DNS prefetch.
- CSP limita le connessioni del documento e gli invii al dominio del sito, consente iframe solo ai domini Google Maps previsti, blocca oggetti/plugin e gestori di eventi HTML inline; non permette `eval` in produzione.
- Il browser invia il modulo solo alla stessa origine, senza cookie, senza cache e senza seguire redirect. Per questa singola richiesta la policy referrer è `strict-origin`: trasmette solo l’origine, senza percorso, query o campi, evitando che `same-origin` insieme a `no-referrer` produca `Origin: null`. La policy generale delle pagine resta `no-referrer`. Nessun token amministrativo o password email nel client.
- Dopo una conferma positiva i campi vengono ripuliti e il riferimento alla richiesta nel componente viene eliminato. Non viene salvato il contenuto del modulo in localStorage/sessionStorage. L’autocompletamento del browser e la sicurezza del dispositivo dipendono anche dalle impostazioni dell’utente.

### Limite intenzionale della CSP

Le pagine Next.js statiche contengono script inline necessari all’idratazione. Per preservare le pagine statiche e il comportamento esistente, `script-src` contiene ancora `'unsafe-inline'`; anche gli stili inline sono ammessi per Motion. È una CSP di contenimento, non una strict CSP con nonce. Non si dichiara una protezione completa contro ogni possibile XSS. Il markup dei visitatori non viene renderizzato; l’unico HTML esplicito è JSON-LD generato dal sito con escaping di `<`. Una futura strict CSP richiede nonces e rendering dinamico o una pipeline di hash verificata, con collaudo dell’adattatore Netlify.

## Protezioni già presenti e conservate

Validazione server e frontend, campi ammessi espliciti e limiti di lunghezza, richiesta JSON <=20 KB, origine controllata, honeypot, limiti distribuiti di cinque nuove richieste per IP ogni dieci minuti, prenotazioni atomiche contro duplicati, firma HMAC tra server e ingresso Netlify, scadenza delle firme e blocco degli invii diretti non firmati tramite Edge Function. Nessun contenuto del messaggio o IP in chiaro nei registri tecnici. Pulizia automatica dei registri tecnici, conservazione dei contatti secondo l’informativa.

Non esiste un endpoint pubblico che elenchi o restituisca le richieste: GET /api/contact restituisce 405. Le richieste effettive sono gestite dall’archivio Netlify Forms e dalla casella del destinatario. L’archivio tecnico Blobs è accessibile tramite credenziali del runtime; non è un bucket pubblico.

## Chi può accedere ai dati

I visitatori non devono poter leggere richieste altrui. Sono però autorizzati il titolare, gli utenti a cui vengono concessi accessi a Netlify o alla casella email e i fornitori nei termini applicabili. HTTPS protegge il trasporto, ma questa architettura non è una cifratura end-to-end con dati leggibili esclusivamente dal titolare. La notifica email contiene i dati della richiesta: proteggere anche Outlook/Hotmail, non solo il sito.

## Controlli del proprietario ancora necessari

1. Autenticazione a due fattori su Netlify, GitHub, account del dominio e casella aziendale; password uniche, codici di recupero custoditi e nessuna password condivisa.
2. Verificare utenti e collaboratori, rimuovere accessi non necessari, limitare token e permessi, proteggere il ramo di pubblicazione GitHub con revisioni/check quando supportato dal piano. Queste impostazioni non sono state modificate né verificate nell’account durante questo intervento.
3. Controllare forwarding, regole e dispositivi collegati alla casella aziendale.
4. Dominio HTTPS corretto, rinnovi attivi, configurazioni Netlify e chiavi solo lato server. Non inserire segreti nel repository.
5. Aggiornamenti regolari delle dipendenze, revisione dei log senza dati personali, controllo quote e disponibilità del servizio, procedura di ripristino dai commit.
6. Gestione dei contatti scaduti sia su Netlify sia nella posta, come spiegato in GESTIONE-CONTATTI.md.

Il sito non espone un editor amministrativo pubblico. Le modifiche esterne passano dagli accessi a GitHub/Netlify e dal dominio: la protezione di quegli account è essenziale e non può essere garantita dal solo codice frontend.

## Verifica e limiti della consegna

Test unitari del modulo, test HTTP reali contro il server locale (intestazioni, file privati, origine, formati, dimensioni, lettura pubblica e query HTML), build di produzione e controllo del modulo nel browser. I test HTTP sono limitati a host loopback e non inviano contatti reali. Comandi: `pnpm test`, poi con il server avviato `pnpm test:security`. L’audit si ripete con `pnpm audit`.

Dopo il deploy rimangono obbligatori il test reale Forms → archivio → email del titolare, il controllo delle intestazioni sul dominio HTTPS e il collaudo dell’Edge Function e della pulizia pianificata. Anche il limite privacy relativo alla mappa sempre attiva rimane quello documentato nella cookie policy: non viene risolto da queste intestazioni.

Nessuna garanzia di invulnerabilità assoluta, nessun penetration test indipendente completo e nessuna attestazione di conformità automatica.

## Fonti ufficiali

- https://docs.netlify.com/manage/forms/submissions/
- https://docs.netlify.com/manage/security/overview/
- https://nextjs.org/docs/app/guides/content-security-policy
- https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
- https://github.com/vercel/next.js/security/advisories

### Esiti registrati

- 17/17 test del modulo superati dopo l’aggiornamento delle dipendenze.
- 10/10 test HTTP superati sul server di produzione locale, incluso il confronto tra Host loopback e Host pubblico simulato senza collegarsi alla produzione.
- Audit completo: 0 advisory, su 151 dipendenze totali nel rapporto del 22 ottobre 2026.
- Build Next.js 16.4.2 con Webpack superata, con controllo TypeScript.
- Prova browser: campi vuoti evidenziati e focus al primo errore; dati sintetici validi riconosciuti localmente senza invio, con rimozione degli errori precedenti. Modulo lasciato vuoto dopo la prova.
- Schermate in `qa/contatti-sicurezza-anteprima.png` e `qa/contatti-sicurezza-verifica-locale.png`.


### Correzione dell’origine — 23 ottobre 2026

Il controllo server continua a respingere origini assenti, `null` e siti esterni. È stata corretta la combinazione delle opzioni del fetch del client (`mode: same-origin` + `referrerPolicy: no-referrer`), che secondo Fetch può serializzare l’origine del POST come `null`. La richiesta del modulo usa ora `strict-origin`, mantenendo destinazione stessa origine, nessun cookie e nessun redirect. Il controllo delle sole richieste locali non dimostra la registrazione o l’arrivo dell’email su Netlify: questi esiti richiedono una verifica in produzione dopo il deploy.

Riferimento: https://fetch.spec.whatwg.org/#append-a-request-origin-header
