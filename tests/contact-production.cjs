// Explicit live test: actually registers one inquiry and triggers the configured
// company notification. Never included in the ordinary `pnpm test` command.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

const baseValue = process.env.CONTACT_E2E_BASE_URL;
const email = process.env.CONTACT_E2E_EMAIL;
if (!baseValue || !email) throw new Error('Impostare CONTACT_E2E_BASE_URL e CONTACT_E2E_EMAIL: il test registra una richiesta reale e notifica l’azienda.');
const base = new URL(baseValue);
if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || base.search || base.hash) throw new Error('Usare l’origine HTTPS del sito, senza percorso o credenziali.');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Usare un indirizzo di prova raggiungibile e autorizzato.');

const payload = {
  nome: 'Verifica', cognome: 'Tecnica', telefono: '+39 338 573 3403', email,
  tipologia: 'Eventi aziendali', data: '', location: 'Collaudo del modulo del sito',
  messaggio: `COLLAUDO TECNICO ${randomUUID()}. Verifica concordata del modulo Contattaci, non è una richiesta commerciale. Controllare registrazione in Netlify Forms, ricezione della notifica e indirizzo di risposta.`, privacy: true,
};
const post = () => fetch(new URL('/api/contact', base), {
  method: 'POST', headers: { Origin: base.origin, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload), signal: AbortSignal.timeout(30000),
});

test('produzione: pagine reali, registrazione tramite API e retry identico senza nuova consegna', async () => {
  const [page, privacy] = await Promise.all([
    fetch(new URL('/contatti', base)), fetch(new URL('/privacy', base)),
  ]);
  assert.equal(page.status, 200); assert.equal(privacy.status, 200);
  const pageText = await page.text(); const privacyText = await privacy.text();
  assert.ok(pageText.includes('contact-nome') && pageText.includes('/privacy'));
  assert.ok(!pageText.includes('Il modulo è in anteprima'));
  assert.ok(privacyText.includes('12 mesi') && privacyText.includes('Carmine Delle Donne'));
  const firstResponse = await post(); const first = await firstResponse.json();
  assert.equal(firstResponse.status, 200, JSON.stringify(first));
  assert.equal(first.ok, true); assert.match(first.reference, /^[a-f0-9-]{36}$/);
  const retryResponse = await post(); const retry = await retryResponse.json();
  assert.equal(retryResponse.status, 200); assert.equal(retry.reference, first.reference); assert.equal(retry.duplicate, true);
  console.info(`Richiesta di collaudo: ${first.reference}. Verificare ora la presenza in Netlify Forms e chiedere al titolare conferma di ricezione e Reply-To. Questo test HTTP non legge la casella email e non certifica la consegna SMTP.`);
});
