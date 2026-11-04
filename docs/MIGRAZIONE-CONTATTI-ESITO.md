# Esito locale — migrazione contatti, 29 ottobre 2026

Implementato: API Next.js Node, Resend HTTPS, Upstash Redis per quote e ricevute persistenti. Vecchie funzioni, definizione HTML, firma e dipendenza Netlify rimosse. Nessun CSS, font, immagine o animazione modificato.

## Test eseguiti

- npm run typecheck: passato.
- npm test: 11 gruppi di test passati (provider e archivio simulati).
- npm run build: passata, 19 pagine generate, API e pagina contatti dinamiche. Build standard configurata con Webpack dopo errore di permessi apertura porta interna di Turbopack nell’ambiente di esecuzione.
- npm run test:security su next start locale: 10 test HTTP passati. La prima esecuzione isolata non poteva aprire connessioni localhost; ripetuta con accesso locale autorizzato.
- Browser: preselezione Wedding e servizio DJ mantenuta, sei errori obbligatori con focus su Nome, invio valido senza credenziali restituisce errore senza svuotare campi o fingere successo.
- Layout verificato a 1280, 768 e 390 px: nessun overflow orizzontale; stili invariati.
- Anteprima next dev esistente su porta 3011 raggiungibile, modulo abilitato e interattivo.
- Ricerca finale in src/public/package.json/lockfile/config esempio: nessun riferimento Netlify attivo. La vecchia rotta __forms.html viene verificata come 404.

## Verifiche ancora necessarie

Account e dominio Resend, database Upstash reale, token, test di scadenza/ripartenza su servizio reale, consegna e Reply-To nella casella del proprietario, condizioni di conservazione e accordi dei fornitori. Hosting non acquistato: runtime Hostinger, DNS, HTTPS e deploy GitHub restano da configurare e collaudare. Nessun invio reale eseguito. Nessun deploy, commit, push o modifica DNS.

## Inventario dei file rispetto all’inizio

M = modificato, D = rimosso, ?? = creato. I sei documenti in archivio/pre-migrazione-hostinger sono copie storiche delle precedenti guide, marcate come superate. next-env.d.ts è aggiornato automaticamente da Next.js durante la build.

```text
 M .env.example
 M README.md
 M docs/COOKIE-POLICY.md
 M docs/COOKIE-VERIFICHE.md
 M docs/GESTIONE-CONTATTI.md
 M docs/GUIDA-SITO.md
 M docs/PRIVACY-MODULO.md
 M docs/SICUREZZA-SITO.md
 M docs/VERIFICHE-CONTATTI.md
 D netlify.toml
 D netlify/edge-functions/contact-ingress.ts
 D netlify/edge-functions/contact-rate-limit.ts
 D netlify/functions/contact-cleanup.ts
 M next-env.d.ts
 M package.json
 M pnpm-lock.yaml
 D public/__forms.html
 M src/app/api/contact/route.ts
 M src/app/contatti/page.tsx
 M src/components/contact-form.tsx
 M src/lib/contact-config.ts
 M src/lib/contact-delivery.ts
 M src/lib/contact-privacy.ts
 D src/lib/contact-signature.ts
 M src/lib/contact-store.ts
 M src/lib/contact.ts
 M src/lib/cookie-policy.ts
 M tests/contact-production.cjs
 M tests/contact.test.cjs
 M tests/security-http.cjs
?? docs/CONTATTI-HOSTINGER.md
?? docs/archivio/pre-migrazione-hostinger/
?? docs/MIGRAZIONE-CONTATTI-ESITO.md
```

Configurazione e gestione: [CONTATTI-HOSTINGER.md](CONTATTI-HOSTINGER.md).

## Collaudo con servizi reali — 31 ottobre 2026

Configurazione privata locale completata con mittente concordato richieste@eventsstudio.it e destinatario aziendale confermato. Segreto tecnico rigenerato dopo esposizione; il proprietario ha dichiarato sostituite le credenziali Resend e Upstash. Il file .env.local è escluso da Git e accessibile soltanto al proprietario sul filesystem. Nessun valore segreto è riportato qui.

- Upstash REST PING: HTTP 200, PONG, autenticazione riuscita.
- Avvio npm run dev: localhost:3000, ambiente .env.local caricato.
- Invio reale dal browser attraverso il modulo: conferma di accettazione Resend mostrata dal frontend e ricevuta tecnica accettata in Redis. Riferimento: 04515164-514c-4a42-a296-a4b0b545ab61.
- Ripetizione dello stesso payload all’API: HTTP 200, duplicate=true, stesso riferimento; nessun nuovo invio richiesto al provider.
- Conferma frontend e reset campi verificati anche a 390 px. Screenshot locale in qa/contatti-invio-reale-2026-10-31.png (escluso da Git).
- La ricezione in casella/spam e il comando Rispondi restano da confermare dal titolare. L’accettazione del provider non certifica la consegna in posta.
- Nessun deploy, commit, push o modifica DNS eseguito durante il collaudo. Verifica sul runtime Hostinger ancora necessaria dopo pubblicazione autorizzata.

Conferma del proprietario tramite utente: email di collaudo ricevuta nella cartella posta indesiderata. Consegna in casella confermata; collocamento in posta in arrivo non confermato. Reply-To ancora da verificare con un indirizzo cliente distinto. Da verificare dopo pubblicazione anche il recapito in produzione; nessuna garanzia di esclusione dai filtri antispam.

## Diagnosi recapito — Mail-Tester, 1 novembre 2026

Destinazione di test fornita dall’utente: test-cspbialeb@srv1.mail-tester.com. Invio autorizzato con soli dati fittizi, modello reale contactEmail/deliverContact e mittente richieste@eventsstudio.it; destinatario aziendale in .env.local mantenuto invariato. Questo test diretto del provider non ripete il flusso API/Redis.

- Resend HTTP 200. ID provider: 01a197e0-82ed-777a-b9e5-5c62ca6a83a4.
- Report letto nel browser: https://mail-tester.com/test-cspbialeb
- Punteggio: 10/10. SPF_PASS, DKIM_VALID e DKIM_VALID_AU; DMARC superato. Reverse DNS valido e nessuna presenza nelle blocklist controllate dal servizio.
- HTML 2 KB, versione testuale presente. Nessun errore di autenticazione rilevato nel messaggio ricevuto da Mail-Tester. Non è una certificazione della valutazione o della reputazione presso Microsoft.
- La classificazione spam nella casella Hotmail è stata riferita dall’utente anche per la seconda prova. La causa specifica resta da identificare tramite intestazioni ricevute da Outlook e/o supporto Resend. Nessuna modifica DNS o di contenuto introdotta senza evidenze.
