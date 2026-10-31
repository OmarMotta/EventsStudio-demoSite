import { isEmail } from './contact';

export function contactConfig() {
  let origin: string | null = null;
  try {
    const u = new URL(process.env.CONTACT_SITE_ORIGIN || '');
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
    if ((u.protocol === 'https:' || (local && u.protocol === 'http:')) && !u.username && !u.password && u.pathname === '/' && !u.search && !u.hash) origin = u.origin;
  } catch {}
  const apiKey = process.env.RESEND_API_KEY || '';
  const to = process.env.CONTACT_TO_EMAIL || '';
  const from = process.env.CONTACT_FROM_EMAIL || '';
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';
  const secret = process.env.CONTACT_GUARD_SECRET || '';
  let validRedis = false;
  try { const u = new URL(redisUrl); validRedis = u.protocol === 'https:' && !u.username && !u.password && u.pathname === '/' && !u.search && !u.hash; } catch {}
  return { origin, privacy: '/privacy', apiKey, to, from, redisUrl, redisToken, secret,
    enabled: Boolean(origin && apiKey && isEmail(to) && isEmail(from) && validRedis && redisToken && secret.length >= 32 && process.env.CONTACT_FORM_ENABLED !== 'false') };
}
export type ContactConfig = ReturnType<typeof contactConfig>;
