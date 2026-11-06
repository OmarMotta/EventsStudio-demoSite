import type { GalleryImage } from "./gallery";

export const newPhotos: Record<string, GalleryImage> = {
  "weddingCake": {
    "id": "weddingCake",
    "title": "Taglio della torta",
    "alt": "Gli sposi tagliano la torta accanto alla piscina tra fontane luminose",
    "src": "/assets/images/events/wedding/weddingCake-2400.webp",
    "srcSet": "/assets/images/events/wedding/weddingCake-960.webp 785w, /assets/images/events/wedding/weddingCake-2400.webp 1179w",
    "width": 1179,
    "height": 1442,
    "position": "50% 50%",
    "layout": "portrait-left"
  },
  "partyDanceOne": {
    "id": "partyDanceOne",
    "title": "Insieme sulla pista",
    "alt": "Invitati che ballano durante una festa privata",
    "src": "/assets/images/party/feste-private/partyDanceOne-2400.webp",
    "srcSet": "/assets/images/party/feste-private/partyDanceOne-960.webp 960w, /assets/images/party/feste-private/partyDanceOne-2400.webp 2400w",
    "width": 2400,
    "height": 1600,
    "position": "50% 50%",
    "layout": "opening"
  },
  "partyDanceTwo": {
    "id": "partyDanceTwo",
    "title": "La festa continua",
    "alt": "Ospiti sorridenti sulla pista durante una festa",
    "src": "/assets/images/party/feste-private/partyDanceTwo-2400.webp",
    "srcSet": "/assets/images/party/feste-private/partyDanceTwo-960.webp 960w, /assets/images/party/feste-private/partyDanceTwo-2400.webp 2400w",
    "width": 2400,
    "height": 1600,
    "position": "50% 50%",
    "layout": "opening"
  },
  "townSquare": {
    "id": "townSquare",
    "title": "La piazza in festa",
    "alt": "Animatori e pubblico con le mani alzate durante una festa di piazza",
    "src": "/assets/images/events/feste-di-piazza/piazza-aggiornata.jpg",
    "width": 1728,
    "height": 970,
    "position": "50% 50%",
    "layout": "opening"
  },
  "corporateScreen": {
    "id": "corporateScreen",
    "title": "Evento aziendale",
    "alt": "Sala allestita per un evento aziendale con schermo e tavoli",
    "src": "/assets/images/events/eventi-aziendali/corporateScreen-2400.webp",
    "srcSet": "/assets/images/events/eventi-aziendali/corporateScreen-960.webp 720w, /assets/images/events/eventi-aziendali/corporateScreen-2400.webp 1800w",
    "width": 1800,
    "height": 2400,
    "position": "50% 50%",
    "layout": "portrait-left"
  },
  "liveBand": {
    "id": "liveBand",
    "title": "Live band",
    "alt": "Gruppo musicale con voci, sassofono, chitarra e basso",
    "src": "/assets/images/services/live-band/liveBand-2400.webp",
    "srcSet": "/assets/images/services/live-band/liveBand-960.webp 960w, /assets/images/services/live-band/liveBand-2400.webp 2048w",
    "width": 2048,
    "height": 1086,
    "position": "50% 50%",
    "layout": "opening"
  },
  "hostPortrait": {
    "id": "hostPortrait",
    "title": "Animatore",
    "alt": "Animatore con microfono tra le luci di scena",
    "src": "/assets/images/services/animatore/animatore-evento-2400.webp",
    "srcSet": "/assets/images/services/animatore/animatore-evento-960.webp 960w, /assets/images/services/animatore/animatore-evento-2400.webp 2400w",
    "width": 2400,
    "height": 1600,
    "position": "50% 50%",
    "layout": "opening"
  }
};

export const eighteenthGalleryPhotos: GalleryImage[] = [
  { id: 'festeggiato-in-volo', title: 'Il festeggiato in volo', alt: 'Gli amici sollevano il festeggiato sulla pista da ballo' },
  { id: 'torta-diciottesimo', title: 'La torta dei diciotto anni', alt: 'Il festeggiato davanti alla torta a più piani tra palloncini neri e oro' },
  { id: 'luci-ed-effetti', title: 'Luci ed effetti', alt: 'Il festeggiato sulla pedana tra luci viola e fumo colorato' },
  { id: 'ballo-in-coppia', title: 'Un ballo insieme', alt: 'Due ragazzi ballano abbracciati davanti agli invitati' },
  { id: 'foto-di-gruppo', title: 'La foto di gruppo', alt: 'Gli invitati posano con le mani alzate durante la festa' },
].map(({ id, title, alt }) => {
  const imagePath = `/assets/images/party/diciottesimi/${id}`;
  return {
    id,
    title,
    alt,
    src: `${imagePath}-2400.webp`,
    srcSet: `${imagePath}-960.webp 960w, ${imagePath}-2400.webp 2400w`,
    width: 2400,
    height: 1600,
    position: '50% 50%',
    layout: 'opening',
  };
});
