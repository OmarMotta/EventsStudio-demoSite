# Contenuti ufficiali — Fase 4

Il file `src/lib/official-content.ts` raccoglie i dati da completare. Cercare i marcatori `<!-- [PLACEHOLDER:`. Sostituire `null` solo con dati ufficiali, racchiusi tra virgolette.

- `phone`, `whatsapp`: numeri con prefisso internazionale.
- `email`: indirizzo ufficiale.
- `instagram`, `instagramWedding`: URL HTTPS completi dei due profili.
- `address`: indirizzo reale; `mapsUrl`: collegamento Google Maps della sede.
- `mapsEmbedUrl`: URL HTTPS di incorporamento fornito da Google Maps, con percorso `/maps/embed`. La mappa si carica solo dopo il clic del visitatore.
- `reviewsUrl`, `writeReviewUrl`: collegamenti ufficiali per leggere e scrivere recensioni.
- `companyDetails`: dati societari approvati.
- `privacyUrl`, `cookiesUrl`: pagine legali approvate, URL HTTPS oppure percorsi interni esistenti.

`officialReviews` accoglie le recensioni reali: ogni elemento contiene `id`, `author`, `text`, `sourceUrl` e, se verificata, `dateLabel`. Non inserire testi dimostrativi, rating o nomi inventati. In assenza di recensioni viene mostrato un avviso esplicito.

Finché mancano i dati, i contatti e i collegamenti sono testi segnaposto, senza destinazioni fittizie. Inserendo dati validi diventano link. La voce Contattaci apre `/contatti`, con modulo e backend già implementati. Consultare GUIDA-SITO.md per attivare la ricezione e completare la privacy.

## Verifiche prima della pubblicazione

Controllare le destinazioni reali dei link, la posizione della mappa, i testi delle recensioni e le policy. Nessuno di questi dati è stato fornito o inventato in questa fase. L'anteprima mantiene `noindex`.

