import { newPhotos } from "./new-photos";
import { photos } from "./photo-assets";
import type { GalleryImage } from './gallery';

export type Visual = { src: string | null; alt: string; width: number; height: number; srcSet?: string; video?: string | null };
export type Collection = { slug: string; title: string; group: 'party' | 'events'; description: string; cover: Visual; images: GalleryImage[] };
export const emptyVisual = (): Visual => ({ src: null, alt: '', width: 1920, height: 1280 });
const album = (): GalleryImage[] => ['opening', 'portrait-left', 'portrait-right', 'closing'].map((layout, index) => ({ id: `foto-${index + 1}`, title: `Fotografia ${index + 1}`, alt: '', src: null, width: index === 1 || index === 2 ? 1200 : 1920, height: index === 1 || index === 2 ? 1500 : 1080, position: '50% 50%', layout: layout as GalleryImage['layout'] }));

// <!-- [PLACEHOLDER: Foto originali, alt e copertine per ciascuna categoria; testi brevi da approvare] -->
export const collections: Collection[] = [
  { slug: 'feste-private', title: 'Feste private', group: 'party', description: 'La tua occasione, il tuo modo di festeggiare.', cover: emptyVisual(), images: album() },
  { slug: 'diciottesimi', title: 'Diciottesimi', group: 'party', description: 'Un nuovo capitolo. Una serata da ricordare.', cover: emptyVisual(), images: album() },
  { slug: 'wedding', title: 'Wedding', group: 'events', description: 'La musica, i dettagli, le emozioni del vostro giorno.', cover: emptyVisual(), images: album() },
  { slug: 'eventi-aziendali', title: 'Eventi aziendali', group: 'events', description: 'Convention, congressi e meeting. Uno spazio per incontrarsi e condividere.', cover: emptyVisual(), images: album() },
  { slug: 'feste-di-piazza', title: 'Feste di piazza', group: 'events', description: 'Il palco, la musica, il pubblico. L’energia di un evento collettivo.', cover: emptyVisual(), images: album() },
  { slug: 'spettacoli', title: 'Spettacoli', group: 'events', description: 'Performance, effetti e intrattenimento prendono scena.', cover: emptyVisual(), images: album() },
];

// <!-- [PLACEHOLDER: Foto o video originali dei sei servizi e testi da approvare] -->
export const services = [
  { slug: 'dj', title: 'DJ', description: 'La selezione musicale che accompagna il ritmo dell’evento.', visual: emptyVisual() },
  { slug: 'animatore', title: 'Animatore', description: 'Coinvolgimento e conduzione, in dialogo con gli ospiti.', visual: emptyVisual() },
  { slug: 'live-band', title: 'Live band', description: 'L’energia della musica dal vivo, sul palco e tra le persone.', visual: emptyVisual() },
  { slug: 'musicisti-performer', title: 'Musicisti e performer', description: 'Suoni e performance per dare carattere a ogni momento.', visual: emptyVisual() },
  { slug: 'show-production', title: 'Spettacoli e show production', description: 'Lo spettacolo come parte del racconto dell’evento.', visual: emptyVisual() },
  { slug: 'allestimenti-effetti', title: 'Allestimenti personalizzati ed effetti speciali', description: 'Spazi, dettagli ed effetti pensati per la scena.', visual: emptyVisual() },
];

// <!-- [PLACEHOLDER: Hero specifiche Party, Events, Tourism, Servizi e Chi siamo] -->
export const pageVisuals: Record<string, Visual> = Object.fromEntries(['party','events','tourism','servizi','chi-siamo'].map(key => [key, emptyVisual()]));
// <!-- [PLACEHOLDER: Storia ufficiale, timeline, citazioni e numeri verificati] -->
export const studio = { story: "L'agenzia nasce con l'intento di fornire un servizio completo che possa venire incontro a tutte le esigenze organizzative e dare quel tocco in più per farlo diventare un evento indimenticabile.", timeline: [] as { year: string; text: string }[], quote: null as string | null, facts: [] as { value: string; label: string }[] };
// <!-- [PLACEHOLDER: Presentazione, esperienze, destinazioni e gallery ufficiali Tourism] -->
export const tourism = { introduction: null as string | null, experiences: [] as { title: string; description: string; visual: Visual }[], destinations: [] as { title: string; description: string; visual: Visual }[], images: album() };
export const routes = ['/', '/chi-siamo', '/servizi', '/contatti', '/party', '/events', '/tourism', ...collections.map(c => `/${c.group}/${c.slug}`)];

// Selezione editoriale dalle fotografie consegnate il 1 ottobre 2026.
const selected = (keys: (keyof typeof photos)[]): GalleryImage[] => keys.map((key,index) => ({...photos[key], layout: photos[key].height > photos[key].width ? (index % 2 ? 'portrait-left' : 'portrait-right') : 'opening'}));
const wedding = collections.find(item => item.slug === 'wedding')!;
wedding.cover = photos.p8;
wedding.images = selected(['p1','p0','p7','p9','p13','p15','p17','p20','p27','p28','p29','p18','p21','p5','p3','p4']);
const privateParties = collections.find(item => item.slug === 'feste-private')!;
privateParties.cover = photos.p31;
privateParties.images = selected(['p31','p23','p24','p25']);
const shows = collections.find(item => item.slug === 'spettacoli')!;
shows.cover = photos.p22;
shows.images = selected(['p19','p22','p12']);
services.find(item => item.slug === 'dj')!.visual = photos.p16;
services.find(item => item.slug === 'animatore')!.visual = photos.p11;
services.find(item => item.slug === 'musicisti-performer')!.visual = photos.p13;
services.find(item => item.slug === 'show-production')!.visual = photos.p22;
services.find(item => item.slug === 'allestimenti-effetti')!.visual = photos.p26;
pageVisuals.party = photos.p25;
pageVisuals.events = photos.p8;
pageVisuals['chi-siamo'] = photos.p24;

// Photographs supplied on 7 October 2026.
wedding.images.push(newPhotos.weddingCake);
const townSquare = collections.find(item => item.slug === 'feste-di-piazza')!;
townSquare.cover = newPhotos.townSquare;
townSquare.images = [newPhotos.townSquare];
const corporate = collections.find(item => item.slug === 'eventi-aziendali')!;
corporate.cover = newPhotos.corporateScreen;
corporate.images = [newPhotos.corporateScreen];
services.find(item => item.slug === 'live-band')!.visual = newPhotos.liveBand;
services.find(item => item.slug === 'animatore')!.visual = newPhotos.hostPortrait;

privateParties.cover = newPhotos.partyDanceOne;
pageVisuals.party = newPhotos.partyDanceTwo;
privateParties.images = [newPhotos.partyDanceOne, newPhotos.partyDanceTwo, ...privateParties.images];

// Foto Diciottesimi fornita dal cliente.
const eighteenth = collections.find(item => item.slug === "diciottesimi")!;
const eighteenthPhoto: GalleryImage = {"id": "diciottesimi-fontane", "title": "Una serata da ricordare", "alt": "La festeggiata tra fontane luminose durante il diciottesimo", "src": "/assets/images/party/diciottesimi/festeggiata-fontane.png", "width": 1440, "height": 960, "position": "50% 50%", "layout": "opening"};
eighteenth.cover = eighteenthPhoto;
eighteenth.images = [eighteenthPhoto, ...eighteenth.images.filter(image => image.src)];
