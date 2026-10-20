import { getStore } from '@netlify/blobs';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Inquiry } from './contact';
import { CONTACT_SIGNING_KEY } from './contact-signature';

export const CONTACT_STORE_NAME = 'events-studio-contact-guards';
export const GUARD_RETENTION_MS = 48 * 60 * 60 * 1000;
const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_LIMIT = 5;

type Receipt = { id: string; state: 'processing' | 'accepted' | 'uncertain'; createdAt: number };
type Store = ReturnType<typeof getStore>;
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export const openContactStore = () => getStore({ name: CONTACT_STORE_NAME, consistency: 'strong' });
export const inquiryKey = (inquiry: Inquiry, privacyVersion: string) => `requests/${hash(JSON.stringify([privacyVersion, inquiry]))}`;

export async function contactSigningKey(store: Store) {
  const existing = await store.get(CONTACT_SIGNING_KEY, { type: 'json' });
  if (typeof existing === 'string') return existing;
  const candidate = randomBytes(32).toString('base64url');
  await store.setJSON(CONTACT_SIGNING_KEY, candidate, { onlyIfNew: true });
  const stored = await store.get(CONTACT_SIGNING_KEY, { type: 'json' });
  if (typeof stored !== 'string') throw new Error('Signing key unavailable');
  return stored;
}

export async function readReceipt(store: Store, key: string): Promise<Receipt | null> {
  // Only the retention job expires keys. Deleting here would race active retries.
  return store.get(key, { type: 'json' }) as Promise<Receipt | null>;
}

export async function reserveReceipt(store: Store, key: string) {
  const receipt: Receipt = { id: randomUUID(), state: 'processing', createdAt: Date.now() };
  const result = await store.setJSON(key, receipt, { onlyIfNew: true, metadata: { createdAt: receipt.createdAt } });
  return result.modified ? receipt : null;
}

export async function finishReceipt(store: Store, key: string, receipt: Receipt, state: 'accepted' | 'uncertain') {
  await store.setJSON(key, { ...receipt, state }, { metadata: { createdAt: receipt.createdAt } });
}

export async function allowContact(store: Store, ip: string, now = Date.now()) {
  const window = Math.floor(now / WINDOW_MS);
  // Atomic fixed slots, rather than a read/modify/write counter across instances.
  // No raw IP address or message body is stored in this technical registry.
  const prefix = `rate/${window}/${hash(`${window}:${ip}`)}`;
  for (let slot = 0; slot < WINDOW_LIMIT; slot++) {
    const { modified } = await store.setJSON(`${prefix}/${slot}`, { createdAt: now }, { onlyIfNew: true, metadata: { createdAt: now } });
    if (modified) return { allowed: true, retryAfter: 0 };
  }
  return { allowed: false, retryAfter: Math.ceil(((window + 1) * WINDOW_MS - now) / 1000) };
}
