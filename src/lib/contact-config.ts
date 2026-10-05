import { officialContent, policyUrl } from './official-content';
export function contactConfig() {
  let webhook: string | null = null;
  try { const url = new URL(process.env.CONTACT_WEBHOOK_URL ?? ''); if(url.protocol==='https:') webhook=url.href; } catch {}
  const privacy=policyUrl(officialContent.privacyUrl);
  return { webhook, privacy, enabled: Boolean(webhook && privacy) };
}
