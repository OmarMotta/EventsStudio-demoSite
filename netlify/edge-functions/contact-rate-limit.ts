// Netlify enforces this rule before invoking Edge Functions or the Next.js
// backend. Do not add storage, fetches, or in-memory counters here.
export default async function contactRateLimit() {
  // Continue to the existing ingress checks and Next.js route below the limit.
}

export const config = {
  // Include trailing slashes and suffixes before downstream URL normalization.
  path: '/api/contact*',
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};
