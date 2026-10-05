import { photos } from "./photo-assets";
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

// Selezione dalle fotografie reali fornite dal cliente.
export const homeGallery: GalleryImage[] = [
  { ...photos.p8, title: 'L’atmosfera', layout: 'opening' },
  { ...photos.p13, title: 'Il ritmo', layout: 'portrait-left', position: '40% 50%' },
  { ...photos.p22, title: 'La meraviglia', layout: 'portrait-right' },
  { ...photos.p3, title: 'Le persone', layout: 'closing' },
];
