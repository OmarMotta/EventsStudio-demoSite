# Events Studio

Sito Next.js App Router, TypeScript e Tailwind CSS, con font locali e hosting Netlify. Il progetto usa pnpm; conservare `pnpm-lock.yaml`.

## Stato attuale — 20 ottobre 2026

Modulo Contattaci con integrazione Netlify Forms, protezioni lato server e test; pagina privacy e cookie policy presenti nel codice. La cookie policy mantiene Google Maps con caricamento automatico su richiesta del proprietario: non implementa una raccolta del consenso e non certifica la conformità di eventuali tracciamenti Google.

Il sito pubblico esiste già, ma le nuove funzionalità non sono ancora verificate in produzione: le pubblicazioni Netlify sono bloccate dai crediti dell’account. Registrazione reale dei contatti e ricezione delle notifiche email restano da collaudare dopo un deploy riuscito.

## Cartelle e file

- `src/`: pagine, stile, componenti, dati e backend del modulo.
- `public/`: logo, fotografie, video effettivamente usati dalla hero e definizione statica per Netlify Forms.
- `netlify/`: protezione dell’ingresso al modulo e pulizia dei registri tecnici.
- `tests/`: test del modulo e verifica esplicita in produzione.
- `docs/`: istruzioni, policy e resoconti delle verifiche.
- `docs/archivio/`: appunti storici, conservati come riferimento e non come istruzioni attuali.
- `qa/`: schermate delle verifiche locali, escluse da Git.
- `netlify.toml`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `next-env.d.ts`: configurazione necessaria.
- `.env.example`: esempio delle impostazioni; non inserire segreti nei file pubblici o in Git.
- `AGENTS.md`, `CLAUDE.md`: istruzioni per gli assistenti di sviluppo.

`node_modules/` contiene le dipendenze installate e `.next/` la compilazione locale. Sono rigenerabili ed esclusi da Git; vengono mantenuti per non interrompere l’anteprima e non richiedere una reinstallazione.

## Guide

- [Sicurezza del sito e configurazioni degli account](docs/SICUREZZA-SITO.md)

- [Modificare il sito](docs/GUIDA-SITO.md)
- [Leggere e gestire i contatti, anche da mobile](docs/GESTIONE-CONTATTI.md)
- [Verifiche del modulo e configurazione di produzione](docs/VERIFICHE-CONTATTI.md)
- [Informativa del modulo](docs/PRIVACY-MODULO.md)
- [Cookie policy](docs/COOKIE-POLICY.md)
- [Verifiche cookie e limite della mappa automatica](docs/COOKIE-VERIFICHE.md)
- [Gallerie](docs/GALLERY.md) e [fotografie inserite](docs/FOTO-INSERITE.md)

## Avvio e verifiche

Con Node.js 22.12+ e pnpm 11.25.0:

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

In questo ambiente locale la compilazione è stata verificata anche con `pnpm exec next build --webpack`. I test di produzione richiedono configurazione esplicita e inviano una richiesta reale: consultare la guida delle verifiche prima di eseguirli.

## Video

La homepage usa `hero-v2-desktop.mp4`, `hero-v2-mobile.mp4` e `hero-v2-poster.webp`. Le cinque versioni precedenti inutilizzate sono state tolte dalla cartella pubblica; rimangono recuperabili dalla cronologia Git. Nessuna compressione o modifica dei video attuali.

La sorgente video dipende dalla larghezza iniziale: ricaricare la pagina dopo aver cambiato la dimensione per confrontare desktop e mobile.
