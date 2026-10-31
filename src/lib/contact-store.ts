import { createHmac, randomUUID } from 'node:crypto';
import type { Inquiry } from './contact';
import type { ContactConfig } from './contact-config';
export type Receipt = { id: string; state: 'processing' | 'accepted' | 'uncertain' };
export const RETENTION_SECONDS = 172800;
export function openContactStore(config: ContactConfig) {
  return async (command: (string | number)[]): Promise<unknown> => {
    const response = await fetch(config.redisUrl, { method: 'POST', headers: { Authorization: `Bearer ${config.redisToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Guard storage unavailable');
    const result = await response.json();
    if (result.error) throw new Error('Guard command failed');
    return result.result;
  };
}
type Store = ReturnType<typeof openContactStore>;
export const fingerprint = (secret: string, value: string) => createHmac('sha256', secret).update(value).digest('hex');
export const inquiryKey = (inquiry: Inquiry, config: ContactConfig, version: string) => `contact:${fingerprint(config.secret, JSON.stringify([config.origin, version, inquiry]))}`;
export async function readReceipt(store: Store, key: string): Promise<Receipt | null> {
  const value = await store(['GET', key]);
  return typeof value === 'string' ? JSON.parse(value) as Receipt : null;
}
export async function reserveReceipt(store: Store, key: string) {
  const receipt: Receipt = { id: randomUUID(), state: 'processing' };
  return await store(['SET', key, JSON.stringify(receipt), 'NX', 'EX', RETENTION_SECONDS]) === 'OK' ? receipt : null;
}
export async function finishReceipt(store: Store, key: string, receipt: Receipt, state: Receipt['state']) {
  // Preserve original expiration; do not renew retention on retries.
  if (await store(['SET', key, JSON.stringify({ ...receipt, state }), 'XX', 'KEEPTTL']) !== 'OK') throw new Error('Receipt missing');
}
export async function allowContact(store: Store, email: string, config: ContactConfig) {
  // Atomic global + per-address quota; does not trust spoofable forwarding headers.
  // Global cap bounds abuse even if attackers rotate addresses or IPs.
  const script = `local g=tonumber(redis.call('GET',KEYS[1]) or '0'); local e=tonumber(redis.call('GET',KEYS[2]) or '0'); if g>=30 or e>=5 then return 0 end; for i=1,2 do if redis.call('INCR',KEYS[i])==1 then redis.call('EXPIRE',KEYS[i],600) end end; return 1`;
  const scope = fingerprint(config.secret, config.origin || '');
  const allowed = await store(['EVAL', script, 2, `rate:${scope}:global`, `rate:${scope}:${fingerprint(config.secret, email.toLowerCase())}`]);
  return { allowed: allowed === 1, retryAfter: 600 };
}
