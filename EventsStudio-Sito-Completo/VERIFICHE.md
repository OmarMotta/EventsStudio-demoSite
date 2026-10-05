# Verifiche — sito multipagina

- Build di produzione e TypeScript: superati.
- Tutti gli URL richiesti caricati; titoli e descrizioni dedicati, un H1 per pagina.
- Controlli mobile a 390 px su tutte le nuove pagine: nessun overflow o immagine rotta rilevata.
- Album aziendali, Servizi e Contatti: controllati a 320, 768 e 1440 px senza overflow.
- Percorso Party → Feste private → Contatti: selezione del tipo di evento correttamente riportata nel modulo.
- Form non configurato: invio esplicitamente disattivato, nessuna falsa conferma.
- Cinque test backend: validazione, dati mancanti, origine esterna, payload eccessivi, configurazione assente, ricevitore riuscito, errore e timeout. Ricevitore simulato, nessun messaggio a terzi.
- Lightbox condiviso: navigazione tastiera e touch implementate; verificato nella fase gallery precedente. Album finali da verificare con le fotografie reali.
- Screenshot ispezionati per Party, album e Servizi; header, contatti e footer già verificati nella fase precedente.

Limiti: viewport emulati, nessun collaudo su dispositivi fisici Safari/iOS. Link social, WhatsApp, email, recensioni, mappa e invio reale non verificabili prima della consegna dei dati e configurazioni ufficiali. Sitemap e canonical si attivano con dominio reale e indicizzazione abilitata. Nessuna misurazione numerica Lighthouse dichiarata; le prestazioni finali andranno misurate con le foto definitive e sul server di produzione.

## Rifiniture del 1 ottobre 2026

Indicazione della sezione attiva nel menu; reveal visibili quando contengono il focus tastiera; icona browser con PNG originale; hero a piena altezza anche su schermi bassi; scorrimento dolce con rispetto del movimento ridotto; pagina di recupero dagli errori; form senza consenso selezionabile prima della disponibilità della policy e senza falso successo su risposta inattesa. Build e cinque test backend superati. Nel browser verificati icona, sezione attiva, stato privacy e assenza di overflow sulla pagina contatti.

## Fotografie reali — 1 ottobre 2026

Inseriti 27 scatti selezionati da 33 originali unici, dopo esclusione delle copie identiche. Varianti WebP: 16,8 MB complessivi, nessun asset mancante. Build superata; lightbox apertura, successiva ed Escape verificati con fotografie reali. Feste private a 390 px: nessun overflow o immagine rotta rilevata. Testo Chi siamo verificato esattamente come fornito. Mappatura completa in FOTO-INSERITE.md.

## Contatti e recensioni forniti dal cliente

Inseriti Carmine Delle Donne, telefono/WhatsApp, email, due profili Instagram e posizione Maps. Mappa incorporata dalle coordinate del link fornito, caricata solo su richiesta e verificata nel browser. Cinque recensioni complete riportate dal materiale del cliente, senza dedurre stelle o date dai caratteri copiati. Esclusi testi troncati con «Altro». Restano da fornire indirizzo scritto, collegamento diretto per scrivere una recensione, policy e dati societari. Il form richiede ancora la propria configurazione di invio: l’indirizzo email da solo non attiva il backend. Build superata.
