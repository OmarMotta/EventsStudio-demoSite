import { PRIVACY_VERSION, validateInquiry } from '@/lib/contact';
import { contactConfig } from '@/lib/contact-config';
import { deliverContact } from '@/lib/contact-delivery';
import { allowContact, finishReceipt, inquiryKey, openContactStore, readReceipt, reserveReceipt } from '@/lib/contact-store';

export const runtime = 'nodejs';
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra },
});
const unavailable = () => json({ error: 'Il servizio non è disponibile. Riprova più tardi oppure contattaci via email o telefono.' }, 503);
const uncertain = (id: string) => json({ error: 'Non possiamo confermare la ricezione. Per evitare duplicati non reinviamo automaticamente: contattaci via email o telefono indicando questo riferimento.', reference: id, uncertain: true }, 409);

export async function POST(request: Request) {
  const config = contactConfig();
  if (!config.origin) return unavailable();
  const origin = request.headers.get('origin');
  const allowedOrigins = new Set([config.origin]);
  if (!origin || !allowedOrigins.has(origin) || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'Origine della richiesta non valida.' }, 403);
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json({ error: 'Formato non valido.' }, 415);
  if (Number(request.headers.get('content-length') ?? 0) > 20000) return json({ error: 'Messaggio troppo lungo.' }, 413);
  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'Richiesta vuota.' }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 20000) { await reader.cancel(); return json({ error: 'Messaggio troppo lungo.' }, 413); }
      chunks.push(value);
    }
    raw = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return json({ error: 'Controlla i dati del modulo.' }, 400); }
  const result = validateInquiry(raw);
  if (!result.data) return json({ error: result.error, fields: result.fields }, 400);
  if (!config.enabled || !config.origin || !config.privacy) return unavailable();
  try {
    const store = openContactStore(config);
    const key = inquiryKey(result.data, config, PRIVACY_VERSION);
    const existing = await readReceipt(store, key);
    if (existing) return existing.state === 'accepted'
      ? json({ ok: true, reference: existing.id, duplicate: true }) : uncertain(existing.id);
    const rate = await allowContact(store, result.data.email, config);
    if (!rate.allowed) return json({ error: 'Hai effettuato diversi tentativi. Attendi qualche minuto prima di riprovare.' }, 429, { 'Retry-After': String(rate.retryAfter) });
    const receipt = await reserveReceipt(store, key);
    if (!receipt) {
      const concurrent = await readReceipt(store, key);
      if (concurrent?.state === 'accepted') return json({ ok: true, reference: concurrent.id, duplicate: true });
      return concurrent ? uncertain(concurrent.id) : unavailable();
    }
    try {
      await deliverContact(config, result.data, receipt.id);
      await finishReceipt(store, key, receipt, 'accepted');
      return json({ ok: true, reference: receipt.id });
    } catch {
      // A timeout does not prove rejection. Keep the reservation to avoid double sends.
      await finishReceipt(store, key, receipt, 'uncertain').catch(() => undefined);
      console.error('contact_delivery_unconfirmed', { reference: receipt.id });
      return uncertain(receipt.id);
    }
  } catch {
    console.error('contact_storage_unavailable');
    return unavailable();
  }
}
