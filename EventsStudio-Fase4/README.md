# EVENTS STUDIO — Fase 4

Homepage: header desktop, menu fullscreen, hero, transizione editoriale, gallery con segnaposto, recensioni, posizione e chiusura con contatti. Next.js App Router, TypeScript, TailwindCSS 4, Motion (Framer Motion), Bodoni Moda e Manrope ospitati localmente.

## Avvio

Con Node.js 22 o successivo e pnpm 11.25.0:

```sh
pnpm install
pnpm dev
```

Verifica: `pnpm typecheck` e `pnpm build`. Avvio produzione: `pnpm start`.

## File principali

- `src/components/site-header.tsx`: navigazione, dialog nativo, tastiera, focus e avvisi delle pagine successive.
- `src/components/hero-section.tsx`: video, poster, autoplay e movimento ridotto.
- `src/components/brand-mark.tsx`: logo PNG originale, centrato e proporzionato.
- `src/lib/site.ts`: asset, destinazioni e stato delle pagine.
- `src/app/globals.css`: token e poche regole per proporzioni ottiche; layout in Tailwind.

## Asset e placeholder

Ricercare `<!-- [PLACEHOLDER:` nell'intero progetto. Nei file TSX il marcatore è racchiuso in un commento JSX valido, nei file TS/CSS in un commento del linguaggio.

Il PNG trasparente fornito è integrato in `public/assets/logo/events-studio.png`, senza modifiche a colori, proporzioni o pixel. Il file originale misura 472×423; una finestra CSS compensa esclusivamente i margini trasparenti, preservando tutto il marchio e centrandone la parte visibile nell'header.

Il colore dominante #DCB780 è campionato dal PNG trasparente fornito e centralizzato nel tema.

Il video attivo deriva dal nuovo MOV fornito (3108×2160, 60 fps, circa 28,3 secondi). Versione desktop 2560 pixel di larghezza, H.264 CRF 18; versione mobile 1280 pixel, CRF 19. Entrambe mantengono i 60 fps, senza audio, con fast start. Poster dedicato da 1920 pixel. Nei fotogrammi controllati il nuovo file mostra più definizione del precedente, ma restano scie nei movimenti: la risoluzione dichiarata non prova che il materiale sia una ripresa nativa in alta definizione.

Le pagine successive non esistono ancora: le voci aprono un avviso reale nell'anteprima anziché produrre errori 404. Quando una pagina è sviluppata, impostare `ready: true` nella relativa voce; sarà utilizzato Next Link con il suo URL definitivo.

La preview ha `noindex`. Nessun dominio, contatto, recensione o dato societario inventato. Nessuna pubblicazione del sito completo in questa fase.

## Accessibilità

Il menu usa un dialog modale nativo (focus confinato, Escape, ritorno al comando originario). I link hanno focus visibile. Un H1 semantico identifica la homepage; le iniziali decorative sono state rimosse su richiesta. Il video è silenzioso; con movimento ridotto è mostrato il poster. Scheda nascosta e autoplay rifiutato sono gestiti. Su richiesta, non sono presenti controlli pausa/riprendi né la fascia inferiore Party / Events / Tourism. Non viene intercettato lo scroll.

## Perimetro

La struttura di recensioni, posizione e contatti è predisposta: i dati ufficiali restano da fornire. Form, pagine interne e SEO definitiva appartengono alle fasi successive. Consultare CONTENUTI.md per aggiornare i dati e GALLERY.md per le fotografie. I font sono forniti dai pacchetti @fontsource-variable con le relative licenze incluse nelle dipendenze.

## Verifiche effettuate

- Build Next.js di produzione e TypeScript: superati.
- Chrome desktop con viewport 1440×900, 1024×768, 768×1024, 390×844, 320×568, 844×390: superati.
- Nessun overflow orizzontale o errore console nei test.
- Decodifica video, muted, loop e playsInline: verificati. I controlli manuali sono stati successivamente rimossi su richiesta.
- Menu fullscreen, avviso delle destinazioni, Tab, Escape, ripristino del focus e blocco dello scroll: verificati.
- Preferenza movimento ridotto: video fermo e poster visibile.
- Ispezione visiva delle schermate desktop, tablet, mobile e menu mobile: eseguita.

Si tratta di verifiche con viewport emulati in Chrome; Safari/iOS e dispositivi fisici restano da verificare nelle fasi successive. Il master video disponibile limita la definizione sui grandi schermi.

La hero mostra soltanto video e header: nessuna iniziale E / S, nessuna fascia inferiore o controllo di riproduzione.


File attivi: hero-v2-desktop.mp4 (49,8 MB), hero-v2-mobile.mp4 (14,8 MB), hero-v2-poster.webp. Le precedenti versioni sono conservate come riserva e non caricate dal sito.





