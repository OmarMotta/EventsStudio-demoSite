# Contattaci — verifiche e pubblicazione

## Architettura

Next.js App Router → `POST /api/contact` → Netlify Blobs per limiti/prenotazioni → firma HMAC → Edge Function `contact-ingress` → Netlify Forms → notifica configurata nel pannello.

Netlify Forms richiede la definizione statica `public/__forms.html`. Nessun attributo `data-netlify` è stato aggiunto al JSX, dove l’adattatore OpenNext non lo rileverebbe. Il campo `email` consente il Reply-To al visitatore.

L’Edge Function protegge tutti i POST con codifica form sui percorsi del sito: solo quelli firmati dal backend verso la definizione del modulo possono proseguire. Il backend Next.js riceve JSON. Verificare nel deploy reale che non ci siano altre integrazioni preesistenti che richiedono POST form-encoded: il repository attuale non ne contiene.

La chiave privata viene generata con 32 byte casuali e conservata atomicamente in Netlify Blobs, in `configuration/submission-signing-key`. Non va letta, copiata in chat o esposta nel browser. Il runtime Netlify fornisce al relativo SDK il contesto di accesso; nessun token amministratore Netlify o password email è richiesto dal sito. La chiave non è coinvolta nella pulizia delle guardie.

## Configurazione

- Gestore pacchetti: pnpm, versione dichiarata nel package.json. È stato mantenuto il solo pnpm-lock.yaml per evitare che due lockfile divergenti selezionino versioni diverse.
- Netlify: build `pnpm build`, pubblicazione `.next`, Node 22, adattatore OpenNext automatico. Non usare export statico: endpoint, Blobs e funzioni richiedono il runtime.
- Forms: rilevamento attivo, da eseguire nuovamente sul nuovo deploy; deve comparire `events-studio-contatti`.
- Notifica email: verificare il salvataggio della configurazione mostrata nel pannello dall’utente. Il codice non può confermarlo.
- La directory `netlify/edge-functions` deve produrre `contact-ingress`; `netlify/functions` deve produrre la funzione giornaliera `contact-cleanup`.
- Se cambiano dominio o sito di ricezione, impostare `CONTACT_SITE_ORIGIN` sull’origine HTTPS corretta, senza percorso, nello scope Functions. In assenza usa `URL` Netlify e poi l’attuale dominio `https://eventsstudio-demo.netlify.app`.
- `CONTACT_FORM_ENABLED=false` è l’interruttore d’emergenza. Il modulo mostra i recapiti diretti, senza segnalare invii riusciti.
- `SITE_URL` e `SITE_INDEXABLE` riguardano SEO. L’indicizzazione non è stata attivata da questo intervento.
- Non è necessario configurare `CONTACT_WEBHOOK_URL` o `CONTACT_WEBHOOK_TOKEN`: il vecchio inoltro webhook è sostituito da Netlify Forms.

Per evitare invii di prova al sito principale, il lavoro locale con `next start` non può inviare richieste reali: mancano il contesto Blobs e l’IP di ingresso Netlify. Deve rispondere 503. I Deploy Preview devono essere usati con attenzione: se puntano all’origine primaria, un invio reale può generare una notifica reale. Preferire il collaudo controllato della produzione o un sito Netlify di staging distinto.

## Verifiche automatiche locali

`pnpm test`: 17 test superati nella verifica finale locale di questa implementazione.

Copertura:

- campi obbligatori, tipo dei dati, spazi, limiti e caratteri di controllo;
- email, numero telefonico, enum evento, date impossibili e anno bisestile;
- origine, codifica del payload, JSON e limite reale dello stream;
- assenza configurazione, contesto/IP attendibile e archivio indisponibile;
- richiesta completa attraverso server, firma, ingresso e ricevitore simulato;
- whitelisting del payload, metadati privacy e riferimento;
- niente messaggio, email o IP in chiaro nel registro tecnico;
- richieste identiche e richieste concorrenti con una sola consegna;
- limite di frequenza e slot atomici concorrenti;
- timeout, errore del provider e rilevamento form inattivo senza falso successo;
- nessun reinvio automatico in caso di esito incerto;
- firma, alterazione del corpo e scadenza;
- invio diretto al servizio Forms e uso di URL alternativi bloccati;
- redirect esterni e redirect che ripeterebbero i dati bloccati;
- cancellazione delle sole guardie scadute, conservando la chiave privata;
- corrispondenza dei campi della definizione statica.

Il provider e Blobs sono sostituiti con dipendenze isolate durante questi test. Questi test **non sono una verifica end-to-end della registrazione su Netlify o della consegna email**.

La compilazione locale con `next build --webpack` è riuscita. Il build predefinito Turbopack ha incontrato un errore di permessi del processo locale (`binding to a port`, EPERM), anche nella prova con permessi estesi. Non è stato dichiarato un problema del codice né cambiato il build predefinito del progetto sulla base di questo solo limite locale.

## Checklist di collaudo dopo il deploy

Da completare sul progetto effettivo, senza presentare come eseguite le verifiche ancora mancanti:

- [ ] Build Netlify riuscita e nuovo deploy effettivamente pubblicato.
- [ ] `/contatti` contiene tutti i campi e nessun avviso di anteprima.
- [ ] `/privacy` è raggiungibile sia dal modulo sia dal footer.
- [ ] Controllo di modulo, errore e successo a desktop, tablet e telefono.
- [ ] Navigazione tastiera: focus, checkbox, link privacy e stato dell’invio.
- [ ] Netlify rileva `events-studio-contatti`.
- [ ] Edge Function `contact-ingress` e funzione pianificata `contact-cleanup` presenti e senza errori.
- [ ] Blobs disponibile al runtime Next.js e a quello Edge, senza credenziali pubbliche.
- [ ] Invio reale concordato, con email raggiungibile e dati minimali chiaramente riconoscibili come prova.
- [ ] Messaggio effettivamente registrato in Forms; controllare anche la sezione spam.
- [ ] Email ricevuta dal titolare e Reply-To corretto; conferma del titolare necessaria se non si ha accesso alla sua posta.
- [ ] Secondo tentativo identico: stesso riferimento, nessuna seconda registrazione o notifica.
- [ ] POST diretto senza firma a `__forms.html`, `__forms` e altro asset statico bloccato.
- [ ] Prova di quota su staging, senza invii ripetuti alla casella del cliente.
- [ ] Esito della pulizia giornaliera verificato dopo l’esecuzione pianificata.
- [ ] Verifica di contratto, piano, quote, accessi e gestione conservazione da parte del titolare.

## Limiti dichiarati

La conferma significa che Netlify ha risposto alla consegna della richiesta; non è una ricevuta di avvenuta lettura o di consegna SMTP. L’antispam di Netlify può filtrare una richiesta: per questo occorre controllare anche lo spam in Forms. L’inoltro server può modificare i segnali di rete visti dai filtri del provider: verificare il collaudo reale prima dell’accettazione.

Il registro tecnico riconosce i payload normalizzati identici per il periodo di conservazione delle guardie. Una modifica del messaggio, o un nuovo tentativo dopo la loro scadenza, è una nuova richiesta. Se si interrompe una consegna dopo la prenotazione, il sistema mantiene l’esito incerto, evitando una seconda consegna automatica; può essere necessaria una verifica del titolare con il riferimento.

Non è implementata un’email automatica al visitatore: l’attuale flusso concordato usa la notifica all’azienda e la risposta personale. La cancellazione a 12 mesi dell’archivio contatti e delle email è manuale. I controlli non garantiscono l’assenza assoluta di spam, guasti o ritardi. L’informativa non certifica la conformità generale dell’intera attività o del sistema cookie del sito.

## Riferimenti tecnici ufficiali

- https://opennext.js.org/netlify/forms
- https://docs.netlify.com/manage/forms/notifications/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- https://docs.netlify.com/build/functions/scheduled-functions/
- https://docs.netlify.com/build/edge-functions/declarations/

## Prova reale su produzione

Il comando `pnpm test:production` registra una richiesta reale e controlla l’esito dell’API e del retry identico. È escluso da `pnpm test`. Richiede `CONTACT_E2E_BASE_URL` con l’origine HTTPS e `CONTACT_E2E_EMAIL` con una casella raggiungibile e autorizzata. Non legge la posta del cliente: la presenza in Forms e la ricezione della notifica vanno riscontrate separatamente.

Nel browser locale sono stati verificati campi obbligatori, focus sul primo errore, selezione evento, checkbox privacy e mantenimento dei dati dopo la risposta 503 prevista fuori da Netlify. Il controllo visivo è stato eseguito nelle viewport stretta e desktop del browser integrato, con layout rispettivamente a una e due colonne; i dispositivi fisici restano nella checklist del collaudo.

## Stato della consegna — 20 ottobre 2026

- Implementazione inviata al ramo `main` di GitHub con commit `c9ceada`.
- Verificati nel pannello Netlify: rilevamento Forms attivo e notifica salvata verso `events_studiopz@hotmail.com` per qualsiasi nuovo modulo.
- Il pannello del team segnala l’uso dei soli **operational credits**: i siti già pubblicati restano online, ma i deploy di produzione sono sospesi fino al successivo ciclo di fatturazione o a un cambio di piano.
- La nuova pagina `/privacy` sul dominio pubblico risponde ancora 404: l’aggiornamento non è pubblicato. Non sono stati dichiarati invii reali, registrazioni reali o ricezioni email verificate.
- Non sono stati acquistati crediti, cambiati piani o accettati nuovi impegni economici. La scelta compete al proprietario dell’account.
- Dopo lo sblocco: pubblicare il commit aggiornato, verificare la build e completare la checklist di collaudo e il test di produzione. Non inviare dati reali prima che il nuovo modulo e l’informativa siano effettivamente disponibili.
