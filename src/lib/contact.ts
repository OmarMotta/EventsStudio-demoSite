export const eventTypes = ['Feste private', 'Diciottesimi', 'Wedding', 'Eventi aziendali', 'Feste di piazza', 'Spettacoli', 'Tourism'];
export const CONTACT_FORM_NAME = 'events-studio-contatti';
export const CONTACT_DEFINITION_PATH = '/__forms.html';
export const PRIVACY_VERSION = '2026-10-29';

export type Inquiry = {
  nome: string; cognome: string; telefono: string; email: string;
  tipologia: string; data: string; location: string; messaggio: string; privacy: true;
};
export type InquiryField = keyof Inquiry;
export type FieldErrors = Partial<Record<InquiryField, string>>;
type Validation = { data: Inquiry; error?: never; fields?: never } | { data?: never; error: string; fields?: FieldErrors };

export function validateInquiry(value: unknown): Validation {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Controlla i dati del modulo.' };
  const raw = value as Record<string, unknown>;
  if (raw.website !== undefined && raw.website !== '') return { error: 'Impossibile elaborare questa richiesta.' };
  const fields: FieldErrors = {};
  const values: Record<string, string> = {};
  const required = ['nome', 'cognome', 'telefono', 'email', 'tipologia', 'location', 'messaggio'] as const;
  for (const key of required) {
    const input = raw[key];
    const max = key === 'messaggio' ? 4000 : key === 'telefono' ? 30 : key === 'email' ? 254 : 200;
    if (typeof input !== 'string' || !input.trim()) fields[key] = 'Compila questo campo.';
    else if (input.length > max) fields[key] = `Usa al massimo ${max} caratteri.`;
    else if ((key === 'messaggio' ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(input)) fields[key] = 'Rimuovi i caratteri non validi.';
    else values[key] = input.trim();
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) fields.email = 'Inserisci un indirizzo email valido.';
  if (values.telefono && (!/^\+?[\d\s().-]+$/.test(values.telefono) || !/^\d{6,15}$/.test(values.telefono.replace(/\D/g, '')))) fields.telefono = 'Inserisci un numero di telefono valido, anche con prefisso internazionale.';
  if (values.tipologia && !eventTypes.includes(values.tipologia)) fields.tipologia = 'Seleziona una tipologia di evento.';
  const date = raw.data ?? '';
  if (typeof date !== 'string' || (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date))) fields.data = 'Inserisci una data valida oppure lascia vuoto il campo.';
  if (raw.privacy !== true) fields.privacy = 'Conferma di aver letto l’informativa privacy.';
  if (Object.keys(fields).length) return { error: 'Controlla i campi evidenziati.', fields };
  return { data: {
    nome: values.nome, cognome: values.cognome, telefono: values.telefono, email: values.email,
    tipologia: values.tipologia, data: date as string, location: values.location, messaggio: values.messaggio, privacy: true,
  } };
}
