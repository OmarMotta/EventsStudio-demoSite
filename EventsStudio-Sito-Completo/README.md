# EVENTS STUDIO — sito multipagina

Next.js App Router, TypeScript, TailwindCSS, Motion, Bodoni Moda e Manrope locali.

Tutte le pagine richieste sono implementate. I contenuti ufficiali mancanti restano segnaposto espliciti. Il sito è un’anteprima locale, non ancora pubblicata.

Leggere **GUIDA-SITO.md** per modificare pagine, album, servizi, contatti, integrazione form e SEO. **VERIFICHE.md** riporta controlli e limiti.

## Avvio

Con Node.js 22+ e pnpm 11.25.0:

```sh
pnpm install
pnpm dev
```

Per produzione: `pnpm build`, poi `pnpm start`. Verifica: `pnpm typecheck`. Test backend: `node --test --test-isolation=none tests/contact.test.cjs`.

Il logo PNG originale e il sabbia #DCB780 sono conservati. La hero usa hero-v2-desktop.mp4 (2560×1780, 60 fps) e hero-v2-mobile.mp4 (1280×890, 60 fps), derivati dal MOV fornito. Nessuna ulteriore compressione è stata applicata in questa fase. Le vecchie versioni sono riserve e non vengono caricate.

Il file del video viene scelto al caricamento della pagina; ridimensionare una scheda già aperta non forza il cambio di sorgente. Per confrontare desktop e mobile, ricaricare dopo aver cambiato la dimensione.

I font includono le licenze nei rispettivi pacchetti. Cercare `<!-- [PLACEHOLDER:` per i materiali da completare.
