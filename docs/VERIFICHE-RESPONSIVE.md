# Verifica telefono e tablet — 20 ottobre 2026

Verificata l’anteprima locale di produzione con browser a larghezze di 320, 390, 768, 1024 e 1366 pixel: 15 pagine per formato, 75 controlli complessivi. Pagine: homepage, Chi siamo, Servizi, Contatti, Party, Events, Tourism, i sei album, Privacy e Cookie policy.

- Nessun allargamento orizzontale della pagina o elemento di testo/campo fuori dai bordi nei controlli eseguiti.
- Nessuna immagine caricata con errore rilevata. Le immagini lazy non ancora richieste non equivalgono a immagini verificate.
- Nessuna freccia decorativa visibile nei cinque formati dopo la correzione del link alle recensioni. La regola esistente copre larghezze fino a 1366 px e dispositivi con puntatore touch.
- Menu mobile aperto e richiuso a 320 px, con tutte le sei destinazioni disponibili.
- Galleria aperta a 320 px, foto successiva e chiusura funzionanti; comandi testuali mantenuti.
- Modulo vuoto: errori sui campi obbligatori, focus al primo campo, nessun invio reale effettuato.
- Pagina Servizi controllata visivamente anche a 768 px; recensioni con selettori a segmenti conservati.
- Build di produzione con Webpack e controllo TypeScript superati.

Esito dettagliato delle misure in `qa/responsive-2026-10-20.json` nella radice, escluso da Git. Verifica responsive nel browser, non collaudo su dispositivi fisici. Autoplay in risparmio energetico, tastiere virtuali e gesti touch richiedono ancora una prova su telefoni/tablet reali. Le modifiche sono locali e necessitano di deploy Netlify; la ricezione reale del modulo resta da verificare dopo il deploy.

## Aggiornamenti del 22 ottobre 2026

- Rimosse dal markup le frecce decorative accanto ai link anche per PC; controllati homepage, Servizi, Party, Wedding e pagina 404 a 390, 768 e 1440 px.
- Denominazione aggiornata a «Show Production» nel titolo del servizio e nei metadati.
- Aggiunti hostess e accoglienza, allestimenti e scenografie personalizzate alle descrizioni degli eventi aziendali e della pagina Servizi; il testo aziendale è condiviso anche con la pagina dell’album.
- Copertina Diciottesimi a dimensioni proporzionali, senza ritaglio, per conservare l’intera foto originale anche su PC.
- Sostituita la seconda testimonianza con un breve estratto della recensione positiva di Antonio, pubblicata il 20/08/2026 sulla scheda della stessa attività: https://www.matrimonio.com/musica-matrimonio/events-studio-wedding--e360460/opinioni. Fonte verificata il 22/10/2026; estratto identificato nel sito e collegato al portale, senza attribuirlo a Google o modificare le parole citate.
