export type OfficialReview = {
  id: string;
  author: string;
  text: string;
  sourceUrl: string;
  dateLabel?: string;
};

// <!-- [PLACEHOLDER: Recensioni reali selezionate, con autore, testo e fonte verificabile] -->
export const officialReviews: OfficialReview[] = [];

export const officialContent = {
  // <!-- [PLACEHOLDER: URL Google ufficiale per leggere tutte le recensioni] -->
  reviewsUrl: null as string | null,
  // <!-- [PLACEHOLDER: URL Google ufficiale per lasciare una recensione] -->
  writeReviewUrl: null as string | null,
  // <!-- [PLACEHOLDER: Telefono ufficiale con prefisso internazionale] -->
  phone: null as string | null,
  // <!-- [PLACEHOLDER: Numero WhatsApp ufficiale con prefisso internazionale] -->
  whatsapp: null as string | null,
  // <!-- [PLACEHOLDER: Email ufficiale EVENTS STUDIO] -->
  email: null as string | null,
  // <!-- [PLACEHOLDER: URL ufficiale Instagram EVENTS STUDIO] -->
  instagram: null as string | null,
  // <!-- [PLACEHOLDER: URL ufficiale Instagram EVENTS STUDIO WEDDING] -->
  instagramWedding: null as string | null,
  // <!-- [PLACEHOLDER: Indirizzo completo e verificato della sede] -->
  address: null as string | null,
  // <!-- [PLACEHOLDER: Link Google Maps ufficiale della posizione corretta] -->
  mapsUrl: null as string | null,
  // <!-- [PLACEHOLDER: URL di incorporamento Google Maps della posizione ufficiale] -->
  mapsEmbedUrl: null as string | null,
  // <!-- [PLACEHOLDER: Ragione sociale e dati societari ufficiali] -->
  companyDetails: null as string | null,
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
