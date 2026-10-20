# Cookie e servizi esterni — verifica del 20 ottobre 2026

## Scelta richiesta dal proprietario

Il proprietario ha richiesto espressamente di mantenere Google Maps sempre attiva, con caricamento automatico, e descriverlo nella cookie policy. Non è stata applicata la proposta alternativa di subordinare l’iframe al consenso.

La consegna comprende quindi l’informativa `/cookie-policy`, il collegamento nel footer e dalla pagina privacy. **Non comprende un sistema di raccolta o revoca del consenso ai contenuti Google, né certifica la conformità del caricamento automatico a tutti i requisiti applicabili.**

La sola informativa non sostituisce il consenso preventivo per eventuali cookie e strumenti non tecnici soggetti a tale obbligo. Un banner che dichiarasse di rifiutare Google senza bloccarne il caricamento sarebbe incoerente con il comportamento effettivo: non è stato introdotto.

## Riscontri sul repository

- Nessuna integrazione Google Analytics, Google Tag Manager o Meta Pixel trovata nel codice esaminato.
- Font forniti dai pacchetti locali Fontsource, video e immagini con percorsi locali al sito.
- Un iframe Google Maps nella pagina Contattaci, caricato immediatamente con `loading="eager"`.
- Social e WhatsApp sono collegamenti esterni, non widget incorporati.
- Il modulo non usa localStorage/sessionStorage per i dati dei visitatori e non installa una preferenza cookie fittizia.
- Il codice JSON-LD è dato strutturato per i motori di ricerca, non un tracker.

## Riscontri sul sito pubblico attuale

Esaminati la risposta HTTP e l’HTML della pagina `/contatti`:

- Nessuna intestazione Set-Cookie rilevata in quella risposta HTTP.
- Gli script applicativi rilevati provengono dal dominio del sito.
- Presente lo script aggiunto da Netlify `/.netlify/scripts/hud?variant=public`.
- Presente l’iframe Google Maps.

Lo script del badge Netlify è stato esaminato senza eseguirlo come codice sul computer dell’utente. Legge il localStorage con la chiave `nl-hud:public:v1` per le preferenze di interfaccia. L’eventuale stato di nascondimento pubblico usa una validità di sette giorni; la disponibilità dipende dal piano. Il badge non è stato rimosso o riconfigurato.

La documentazione Netlify specifica che il badge non esegue analisi della navigazione, non installa cookie né raccoglie dati; può ricordare preferenze tramite localStorage. Non è stato classificato come Google Analytics o come un pixel pubblicitario.

Esaminata anche la risposta pubblica all’URL dell’iframe Google:

- Nessuna intestazione Set-Cookie rilevata in quella singola verifica HTTP.
- Il contenuto carica ulteriori risorse Google Maps da maps.gstatic.com e maps.googleapis.com.

**Limite della verifica:** una richiesta HTTP non esegue il JavaScript Google, non riproduce tutte le impostazioni del browser o di un account Google e non dimostra l’assenza di cookie di terze parti. Non sono stati inventati nomi o durate di cookie Google non osservati. Per questa componente la policy rinvia alla documentazione ufficiale e dichiara esplicitamente il caricamento automatico.

## Riscontri nel pannello Netlify

Sono stati letti i Developer settings del progetto `eventsstudio-demo`:

- Repository GitHub collegato al sito, ramo di produzione `main`.
- Sezione Snippet injection senza snippet configurati mostrati, con il solo comando Add snippet.
- Badge Powered by Netlify attivo nella configurazione generale.
- Nessuna impostazione del progetto, integrazione, costo o piano è stata modificata durante l’ispezione.

Le metriche server della piattaforma non sono state confuse con un’installazione di Google Analytics nel browser. Il controllo non è una scansione continua: aggiungendo in futuro servizi di marketing, video esterni, widget, script o analytics occorre aggiornare informativa e gestione del consenso prima dell’attivazione.

## Cosa deve sapere il titolare

- La mappa continua a contattare Google automaticamente: il testo della policy non ne modifica il funzionamento.
- Non è disponibile un pulsante che blocchi o revochi preventivamente il caricamento Google.
- Le impostazioni del browser non sono un sostituto di una gestione del consenso eventualmente necessaria sul sito.
- Per rimuovere questo limite occorre rivalutare il caricamento su consenso, una soluzione locale appropriata o altro assetto verificato da chi segue la privacy dell’attività.
- Le informazioni societarie e il recapito privacy sono quelli già forniti e confermati per l’informativa del modulo.

## Verifiche e pubblicazione

L’informativa è una pagina server Next.js, nello stesso stile nero/oro e con struttura responsive della privacy. La mappa non è stata modificata e non sono stati aggiunti servizi a pagamento, tracker o cookie del sito.

La pubblicazione di produzione resta soggetta al blocco dei crediti Netlify già verificato. Le modifiche ai cookie possono essere raggruppate con il modulo Contattaci nella successiva pubblicazione, senza pubblicare ogni modifica separatamente.

Verifiche locali completate:

- Controllo TypeScript superato.
- Build di produzione con Webpack completata, inclusa la pagina statica `/cookie-policy`.
- Pagina controllata nel browser a larghezza mobile e desktop: contenuti leggibili e stile nero/oro conservato.
- Collegamento alla privacy aperto correttamente; collegamenti alla cookie policy presenti nella privacy e nel footer.
- Schermate conservate nella cartella `qa/` della radice (`cookie-policy-mobile.png` e `cookie-policy-desktop.png`).
- Controllo delle differenze senza errori di spaziatura.

Prima dell’accettazione in produzione restano da completare:

- verificare sul dominio definitivo eventuali script o cookie aggiunti dalla piattaforma;
- far verificare al titolare il trattamento della componente Google mantenuta automatica;
- non dichiarare che questa sola informativa realizzi un sistema di consenso o renda conforme ogni servizio esterno.

## Fonti ufficiali

- https://www.garanteprivacy.it/faq/Cookie
- https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- https://policies.google.com/technologies/cookies?hl=it
- https://policies.google.com/privacy?hl=it
- https://docs.netlify.com/manage/projects/powered-by-netlify-badge/
- https://docs.netlify.com/build/post-processing/snippet-injection/
