import { getStore } from '@netlify/blobs';
import { CONTACT_SIGNING_KEY, SIGNATURE_HEADER, TIMESTAMP_HEADER, verifySubmission } from '../../src/lib/contact-signature.ts';

// Every static URL can otherwise be used as a Netlify Forms submission target.
// Guard all form-encoded POSTs, while leaving Next.js JSON requests untouched.
export default async function contactIngress(request: Request) {
  if (request.method !== 'POST') return;
  const path = new URL(request.url).pathname;
  const type = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  const isForm = type === 'application/x-www-form-urlencoded' || type === 'multipart/form-data';
  if (!isForm && path !== '/__forms.html' && path !== '/__forms') return;
  const deny = (status = 403) => new Response('Richiesta non autorizzata.', { status, headers: { 'Cache-Control': 'no-store' } });
  if (type !== 'application/x-www-form-urlencoded' || !['/__forms.html', '/__forms'].includes(path)) return deny();
  const timestamp = request.headers.get(TIMESTAMP_HEADER) ?? '';
  const signature = request.headers.get(SIGNATURE_HEADER) ?? '';
  if (!/^\d{13}$/.test(timestamp) || !/^[a-f0-9]{64}$/.test(signature)) return deny();
  if (Number(request.headers.get('content-length') ?? 0) > 80000) return deny(413);
  try {
    const reader = request.clone().body?.getReader();
    if (!reader) return deny();
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 80000) { await reader.cancel(); return deny(413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const body = new TextDecoder().decode(bytes);
    const store = getStore({ name: 'events-studio-contact-guards', consistency: 'strong' });
    const secret = await store.get(CONTACT_SIGNING_KEY, { type: 'json' });
    if (typeof secret !== 'string' || !await verifySubmission(secret, timestamp, body, signature)) return deny();
    // Let Netlify process the original, unconsumed request with its Forms service.
  } catch { return deny(503); }
}
export const config = { path: '/*' };
