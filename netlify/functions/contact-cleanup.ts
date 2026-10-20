import { getStore } from '@netlify/blobs';
import { CONTACT_STORE_NAME, GUARD_RETENTION_MS } from '../../src/lib/contact-store';

export default async () => {
  const store = getStore({ name: CONTACT_STORE_NAME, consistency: 'strong' });
  const cutoff = Date.now() - GUARD_RETENTION_MS;
  let removed = 0;
  for await (const page of store.list({ paginate: true })) {
    for (const blob of page.blobs) {
      if (!blob.key.startsWith('requests/') && !blob.key.startsWith('rate/')) continue;
      const entry = await store.getMetadata(blob.key);
      const createdAt = entry?.metadata.createdAt;
      if (typeof createdAt === 'number' && createdAt < cutoff) {
        await store.delete(blob.key);
        removed++;
      }
    }
  }
  // Operational counters only. No contact information or payloads in logs.
  console.info('contact_guard_cleanup', { removed });
};
export const config = { schedule: '0 3 * * *' };
