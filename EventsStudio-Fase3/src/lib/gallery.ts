export type GalleryImage = {
  id: string;
  title: string;
  alt: string;
  src: string | null;
  srcSet?: string;
  width: number;
  height: number;
  position: string;
  layout: "opening" | "portrait-left" | "portrait-right" | "closing";
};

// Nessun fotogramma, immagine stock o foto generata: scelta esplicita del cliente.
// Per ogni foto ufficiale inserire src, srcSet opzionale, dimensioni, alt e punto focale.
// Le immagini vanno in public/assets/images/home; src usa /assets/images/home/...
export const homeGallery: GalleryImage[] = [
  // <!-- [PLACEHOLDER: Fotografia orizzontale di apertura — atmosfera dell’evento e alt descrittivo] -->
  { id: "atmosfera", title: "L’atmosfera", alt: "", src: null, width: 1920, height: 1080, position: "50% 50%", layout: "opening" },
  // <!-- [PLACEHOLDER: Fotografia verticale — musica e alt descrittivo] -->
  { id: "musica", title: "Il ritmo", alt: "", src: null, width: 1200, height: 1500, position: "50% 50%", layout: "portrait-left" },
  // <!-- [PLACEHOLDER: Fotografia verticale — spettacolo e alt descrittivo] -->
  { id: "luce", title: "La meraviglia", alt: "", src: null, width: 1200, height: 1500, position: "50% 50%", layout: "portrait-right" },
  // <!-- [PLACEHOLDER: Fotografia panoramica di chiusura — persone e alt descrittivo] -->
  { id: "insieme", title: "Le persone", alt: "", src: null, width: 1920, height: 960, position: "50% 50%", layout: "closing" },
];
