export type NavigationItem = {
  label: string;
  href: string;
  ready: boolean;
};

// Tutte le destinazioni hanno una pagina dedicata.
export const navigation: NavigationItem[] = [
  { label: "Chi siamo", href: "/chi-siamo", ready: true },
  { label: "Servizi", href: "/servizi", ready: true },
  // Pagina dedicata con modulo e integrazione lato server.
  { label: "Contattaci", href: "/contatti", ready: true },
  { label: "Party", href: "/party", ready: true },
  { label: "Events", href: "/events", ready: true },
  { label: "Tourism", href: "/tourism", ready: true },
];

export const brand = {
  // PNG originale trasparente fornito dal cliente; nessuna modifica ai pixel.
  logo: "/assets/logo/events-studio.png",
  // Sabbia dominante #DCB780 campionato dal PNG trasparente; token in globals.css.
  name: "Events Studio",
};

export const heroMedia = {
  // Derivato dal MOV fornito, senza alterazioni creative o interpolazione.
  video: "/assets/video/hero-v2-desktop.mp4",
  poster: "/assets/video/hero-v2-poster.webp",
  // Versione leggera dello stesso montaggio, senza ritagli o interpolazione.
  mobileVideo: "/assets/video/hero-v2-mobile.mp4",
};


