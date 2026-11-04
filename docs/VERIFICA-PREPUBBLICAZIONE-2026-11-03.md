# Verifica locale prima della presentazione — 3 novembre 2026

## Controlli effettivamente eseguiti

- TypeScript: superato.
- Test del modulo: 11/11 superati (provider/Redis simulati nei test automatici).
- Build di produzione: completata, 19 pagine generate; backend Next.js disponibile.
- Test HTTP sulla build locale: 10/10 superati. Verificati header di sicurezza, blocco origine esterna, formati e payload non validi, limite dimensione, assenza di endpoint GET per le richieste e indisponibilità via HTTP dei file privati controllati.
- Audit pnpm delle dipendenze di produzione: zero vulnerabilità note segnalate dal registro al momento del controllo. Non equivale ad assenza assoluta di vulnerabilità.
- 15 pagine principali: risposta HTTP 200.
- 39 risorse immagine/video richiamate tramite src/poster nelle pagine controllate: presenti sul disco. Non è una verifica visuale di ogni immagine o srcset.
- Ricerca delle credenziali attuali nei file JS/JSON/HTML di .next/static: zero corrispondenze; .env.local escluso da Git e permessi 600.
- Home locale: noindex attivo, da modificare intenzionalmente nella configurazione di produzione dopo approvazione.
- Nessuna email inviata durante questo controllo. Nessun deploy, commit, push o modifica DNS.

## Sicurezza: protezioni e limiti

Le richieste viaggiano frontend → endpoint server → Resend; Upstash conserva impronte HMAC e ricevute tecniche, non il testo o i recapiti in chiaro. Non esiste un elenco pubblico delle richieste. Ispezionare il sito permette di vedere il codice pubblico e i dati inseriti dal visitatore stesso, non le email degli altri clienti attraverso il flusso attuale.

Sono presenti validazione frontend/backend, controllo origine, honeypot, escaping HTML, quote persistenti, prenotazione atomica contro duplicati, timeout, risposte senza dettagli privati e header di protezione. I log applicativi del modulo contengono eventi generici e riferimenti.

Il controllo Origin e il campo honeypot non autenticano un bot: un client diretto può costruire richieste. Le quote sono 5 nuove richieste per indirizzo email e 30 complessive per origine ogni 10 minuti. Un attaccante può consumare la quota globale e impedire temporaneamente invii legittimi. Servono protezioni di ingresso dell'hosting e monitoraggio: il rate limit applicativo non è una difesa DDoS di rete.

La CSP consente script inline per compatibilità con le pagine statiche Next.js: non è una CSP basata su nonce. Le verifiche svolte non costituiscono penetration test completo, certificazione legale o garanzia di inviolabilità. Account, fornitori e configurazione di produzione restano parte della sicurezza.

## Da completare prima della pubblicazione

1. Wedding: ricevere e approvare le fotografie definitive dal titolare.
2. Tourism: attualmente mostra «Immagine ufficiale da fornire»; mancano contenuti definitivi. Completare oppure concordare una gestione senza segnaposto pubblici.
3. Email: il titolare segnala ancora arrivo in spam; ticket Resend inviato dall'utente. Il precedente Mail-Tester 10/10 non garantisce la cartella In arrivo di Hotmail. Acquisire risposta assistenza/intestazioni, poi fare un solo nuovo collaudo concordato. Non cambiare DNS senza diagnosi.
4. Hostinger: configurare app Node.js, variabili private, dominio canonico, HTTPS e redirect; verificare protezioni DDoS disponibili, accessi/2FA, quote e rinnovi. Non eseguito qui.
5. Impostare SITE_URL e CONTACT_SITE_ORIGIN all'origine HTTPS reale; abilitare SITE_INDEXABLE solo al rilascio approvato. Non copiare l'origine localhost in produzione.
6. Collaudare su Hostinger navigazione, form reale, tutti i campi, Reply-To, duplicati e ricezione. Controllare layout con browser su desktop/tablet/mobile; questo controllo ha verificato HTTP e build, non ripetuto la verifica visuale responsive.
7. Il titolare deve confermare testi, recapiti, utilizzo delle fotografie/recensioni e gestione privacy: accessi ai servizi e cancellazione delle richieste senza seguito dopo 12 mesi, secondo l'informativa. Le ricevute Upstash non sono un archivio delle richieste.

## Presentazione al cliente

Mostrare home, servizi, eventi, gallery, Chi siamo e Contattaci. Dichiarare apertamente che mancano le foto Wedding definitive, la decisione sui contenuti Tourism e la chiusura del collaudo email/hosting. Evitare invii dimostrativi ripetuti finché il problema spam è in diagnosi. Raccogliere in un'unica lista le ultime approvazioni su contenuti e immagini.
