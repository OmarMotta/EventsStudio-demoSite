# Events Studio

Sito Next.js 16 App Router, React 19, TypeScript e Tailwind. Font e media locali.

## Avvio locale

Node.js 22 o 24. `pnpm install --frozen-lockfile`, quindi `npm run dev` (http://127.0.0.1:3000).
Il lockfile autorevole è pnpm-lock.yaml. Gli script sono eseguibili anche con npm; evitare un secondo lockfile.
`npm run typecheck`, `npm test`, `npm run build`, `npm start`.

Il sito funziona anche senza credenziali. Per inviare realmente dal modulo copiare .env.example in .env.local e seguire [la guida contatti](docs/CONTATTI-HOSTINGER.md).
Il backend non simula successi quando i servizi non sono configurati.

## Struttura

- src/app: pagine App Router e POST /api/contact.
- src/components: interfaccia, incluso il modulo contatti esistente.
- src/lib/contact*: validazione, configurazione server, invio Resend e guardie Redis.
- public: media pubblici; nessuna definizione Forms o richiesta cliente.
- tests: unità con mock, sicurezza HTTP locale, collaudo reale esplicito.
- docs: guida attuale; archivio conserva i vecchi rapporti, non più applicabili.

Nessuna esportazione statica: serve un hosting Next.js con runtime Node.js. Migrazione predisposta per Hostinger Business/Unlimited; nessun deploy o account esterno configurato da questa modifica.
