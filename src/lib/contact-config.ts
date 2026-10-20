import { officialContent, policyUrl } from './official-content';

export function contactConfig() {
  // URL is Netlify's primary site URL. Never derive a delivery target from user input.
  const value = process.env.CONTACT_SITE_ORIGIN || process.env.URL || 'https://eventsstudio-demo.netlify.app';
  let origin: string | null = null;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash) origin = url.origin;
  } catch {}
  const privacy = policyUrl(officialContent.privacyUrl);
  return { origin, privacy, enabled: Boolean(origin && privacy && process.env.CONTACT_FORM_ENABLED !== 'false') };
}
