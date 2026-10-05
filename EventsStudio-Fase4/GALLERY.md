# Gallery — Fase 3

La homepage prosegue sotto il video con una transizione verso il nero, un titolo editoriale proposto e quattro spazi fotografici asimmetrici. Per scelta del cliente si usano esclusivamente segnaposto: nessun fotogramma, nessuna immagine stock o generata nella gallery.

- `src/components/editorial-gallery.tsx`: composizione e segnaposto.
- `src/components/reveal.tsx`: apparizioni leggere, senza blocco dello scroll; supporto movimento ridotto.
- `src/components/gallery-lightbox.tsx`: apertura a schermo intero, precedente/successiva, tastiera, Escape, focus e swipe.
- `src/lib/gallery.ts`: catalogo fotografico centralizzato.
- `public/assets/images/home/`: cartella delle fotografie definitive.

## Inserire le fotografie

Copiare la foto nella cartella e valorizzare `src` con `/assets/images/home/nome-foto.webp`. Indicare le dimensioni reali e scrivere un `alt` descrittivo. `srcSet` è facoltativo e può elencare le versioni responsive. Aggiornare titolo e punto focale `position`.

La lightbox si attiva soltanto per gli elementi con `src` valorizzato; i segnaposto non sono pulsanti. Quando tutte le foto sono presenti scompare automaticamente l'avviso dei segnaposto.

Il titolo “Ci sono momenti che restano” è una proposta editoriale, non un claim ufficiale attribuito al marchio. Il relativo commento PLACEHOLDER consente di trovarlo e sostituirlo.

## Verifiche

Sei viewport in Chrome, assenza di overflow e di immagini fotografiche nella gallery, ingrandimento al 200%, TypeScript e build di produzione. La lightbox è stata testata con rettangoli tecnici in una pagina isolata temporanea, poi rimossa: tastiera, navigazione, swipe touch, blocco dello scroll, chiusura e ripristino del focus superati. Nessuna pagina di prova è inclusa nella consegna.
