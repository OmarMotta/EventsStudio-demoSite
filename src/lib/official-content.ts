export type OfficialReview = {
  id: string;
  author: string;
  text: string;
  sourceUrl: string;
  dateLabel?: string;
};

// Testi completi trascritti dal materiale fornito dal cliente. Nessuna data relativa o valutazione dedotta dai simboli copiati.
export const officialReviews: OfficialReview[] = [
  {
    "id": "review-1",
    "author": "nicola",
    "text": "Non ci sono parole per ringraziare Carmine e tutto il suo staff. Hanno fatto del mio matrimonio una festa speciale. Professionalità, disponibilità top. Se li scegliete per il vostro evento sarà sicuramente speciale.",
    "sourceUrl": "https://www.google.com/maps/place/Events+Studio/@40.6458396,15.797421,17z/data=!3m1!4b1!4m6!3m5!1s0x49edd57705ee34d9:0x7951493e04a1c2b3!8m2!3d40.6458356!4d15.7999959!16s%2Fg%2F11jykb8x9b"
  },
  {
    "id": "review-2",
    "author": "Valentina Lucia",
    "text": "Ho scelto event studio per il mio 18 esimo e non me ne sono pentita. È stata una festa fantastica e mi sono divertita tantissimo. Grazie ancora",
    "sourceUrl": "https://www.google.com/maps/place/Events+Studio/@40.6458396,15.797421,17z/data=!3m1!4b1!4m6!3m5!1s0x49edd57705ee34d9:0x7951493e04a1c2b3!8m2!3d40.6458356!4d15.7999959!16s%2Fg%2F11jykb8x9b"
  },
  {
    "id": "review-3",
    "author": "vitina colucci",
    "text": "Events Studio Magnifici.....il mio 50esimo Compleanno è stato animato da Carmine e i suoi collaboratori.....con loro la noia non esiste..... divertimento a 360° dai piccoli ai più grandi nessuno è rimasto seduto....i sorrisi è la felicità dei miei invitati è stato il regalo più bello.",
    "sourceUrl": "https://www.google.com/maps/place/Events+Studio/@40.6458396,15.797421,17z/data=!3m1!4b1!4m6!3m5!1s0x49edd57705ee34d9:0x7951493e04a1c2b3!8m2!3d40.6458356!4d15.7999959!16s%2Fg%2F11jykb8x9b"
  },
  {
    "id": "review-4",
    "author": "valentina santarsiero",
    "text": "Ho avuto il piacere di averli accanto nel giorno della mia laurea, la loro presenza ha contribuito a rendere più speciale quel momento! Grazie ❤️",
    "sourceUrl": "https://www.google.com/maps/place/Events+Studio/@40.6458396,15.797421,17z/data=!3m1!4b1!4m6!3m5!1s0x49edd57705ee34d9:0x7951493e04a1c2b3!8m2!3d40.6458356!4d15.7999959!16s%2Fg%2F11jykb8x9b"
  },
  {
    "id": "review-5",
    "author": "Antonella",
    "text": "Professionalità, cura dei particolari e divertimento assicurato.\nSuper consigliato",
    "sourceUrl": "https://www.google.com/maps/place/Events+Studio/@40.6458396,15.797421,17z/data=!3m1!4b1!4m6!3m5!1s0x49edd57705ee34d9:0x7951493e04a1c2b3!8m2!3d40.6458356!4d15.7999959!16s%2Fg%2F11jykb8x9b"
  }
];

export const officialContent = {
  contactPerson: "Carmine Delle Donne",
  reviewsUrl: "https://www.google.com/maps/place/Events+Studio/@40.6458396,15.797421,17z/data=!3m1!4b1!4m6!3m5!1s0x49edd57705ee34d9:0x7951493e04a1c2b3!8m2!3d40.6458356!4d15.7999959!16s%2Fg%2F11jykb8x9b" as string | null,
  // <!-- [PLACEHOLDER: URL Google ufficiale per lasciare una recensione] -->
  writeReviewUrl: null as string | null,
  phone: "+39 338 573 3403" as string | null,
  whatsapp: "+39 338 573 3403" as string | null,
  email: "events_studiopz@hotmail.com" as string | null,
  instagram: "https://www.instagram.com/events_studio_/" as string | null,
  instagramWedding: "https://www.instagram.com/events_studio_wedding/" as string | null,
  facebook: "https://www.facebook.com/eventstudiopotenza/" as string | null,
  matrimonio: "https://www.matrimonio.com/musica-matrimonio/events-studio-wedding--e360460" as string | null,
  address: "Via Angilla Vecchia, 6, 85100 Potenza PZ, Italia" as string | null,
  mapsUrl: "https://www.google.com/maps/place/Events+Studio/@40.6458396,15.797421,17z/data=!3m1!4b1!4m6!3m5!1s0x49edd57705ee34d9:0x7951493e04a1c2b3!8m2!3d40.6458356!4d15.7999959!16s%2Fg%2F11jykb8x9b" as string | null,
  mapsEmbedUrl: "https://www.google.com/maps?cid=8741848882417353395&z=17&output=embed" as string | null,
  companyDetails: "P.IVA: 02157470762\nVia Genova, 3 — 85100 Potenza (PZ) — IT\nTelefono: 338 5733403\nevents_studiopz@hotmail.com" as string | null,
  // <!-- [PLACEHOLDER: URL della privacy policy approvata] -->
  privacyUrl: null as string | null,
  // <!-- [PLACEHOLDER: URL della cookie policy approvata] -->
  cookiesUrl: null as string | null,
};

export function httpsUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch { return null; }
}

export function policyUrl(value: string | null) {
  if (value?.startsWith("/") && !value.startsWith("//")) return value;
  return httpsUrl(value);
}
