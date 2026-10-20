// Web Crypto works in both the Next.js Node runtime and Netlify's edge runtime.
export const CONTACT_SIGNING_KEY = 'configuration/submission-signing-key';
export const SIGNATURE_HEADER = 'x-events-contact-signature';
export const TIMESTAMP_HEADER = 'x-events-contact-timestamp';
const encoder = new TextEncoder();

async function keyFor(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
export async function signSubmission(secret: string, timestamp: string, body: string) {
  const signature = await crypto.subtle.sign('HMAC', await keyFor(secret), encoder.encode(`${timestamp}.${body}`));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('');
}
export async function verifySubmission(secret: string, timestamp: string, body: string, signature: string, now = Date.now()) {
  if (!/^\d{13}$/.test(timestamp) || Math.abs(now - Number(timestamp)) > 60000 || !/^[a-f0-9]{64}$/.test(signature)) return false;
  const bytes = Uint8Array.from(signature.match(/../g)!, value => parseInt(value, 16));
  return crypto.subtle.verify('HMAC', await keyFor(secret), bytes, encoder.encode(`${timestamp}.${body}`));
}
