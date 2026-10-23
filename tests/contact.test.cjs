const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');

function load(file, imports = {}, extra = {}) {
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(js, {
    exports: module.exports, module, require: name => {
      if (name.startsWith('node:')) return require(name);
      if (!(name in imports)) throw new Error(name);
      return imports[name];
    },
    Response, Request, URL, URLSearchParams, Buffer, Uint8Array, TextEncoder, TextDecoder, AbortSignal,
    crypto: crypto.webcrypto, console: { error() {}, info() {} }, process: { env: {} }, ...extra,
  });
  return module.exports;
}
const contact = load('src/lib/contact.ts');
const signature = load('src/lib/contact-signature.ts');
const valid = { nome: 'Test', cognome: 'Tecnico', telefono: '+390000000000', email: 'test@example.invalid', tipologia: 'Wedding', data: '2027-06-18', location: 'Ambiente di test', messaggio: 'Verifica automatica: nessun invio reale.', privacy: true };
const html = text => new Response(text, { status: 200, headers: { 'Content-Type': 'text/html' } });
const request = (body = valid, headers = {}) => new Request('https://eventsstudio-demo.netlify.app/api/contact', {
  method: 'POST', headers: { origin: 'https://eventsstudio-demo.netlify.app', 'content-type': 'application/json', 'x-nf-client-connection-ip': '192.0.2.1', ...headers }, body: JSON.stringify(body),
});
function setup(options = {}) {
  const records = new Map();
  const metadata = new Map();
  const received = [];
  let deliveryCalls = 0;
  const store = {
    async get(key) { return records.has(key) ? JSON.parse(JSON.stringify(records.get(key))) : null; },
    async setJSON(key, data, condition = {}) {
      if (condition.onlyIfNew && records.has(key)) return { modified: false };
      records.set(key, JSON.parse(JSON.stringify(data)));
      metadata.set(key, condition.metadata ?? {});
      return { modified: true };
    },
    async getMetadata(key) { return records.has(key) ? { metadata: metadata.get(key), etag: 'test' } : null; },
    async delete(key) { records.delete(key); },
    async *list() { yield { blobs: [...records.keys()].map(key => ({ key })) }; },
  };
  const getStore = () => { if (options.storageDown) throw Error('storage down'); return store; };
  const guards = load('src/lib/contact-store.ts', { '@netlify/blobs': { getStore }, './contact-signature': signature });
  const ingress = load('netlify/edge-functions/contact-ingress.ts', { '@netlify/blobs': { getStore }, '../../src/lib/contact-signature.ts': signature }).default;
  const delivery = load('src/lib/contact-delivery.ts', { './contact': contact, './contact-signature': signature }, { fetch: async (url, init) => {
    deliveryCalls++;
    if (options.delivery) return options.delivery(url, init);
    const incoming = new Request(url, init);
    const blocked = await ingress(incoming);
    if (blocked) return blocked;
    received.push(Object.fromEntries(new URLSearchParams(init.body)));
    return html('<html><body>Thank you! Your submission has been received.</body></html>');
  } });
  const config = { enabled: true, origin: 'https://eventsstudio-demo.netlify.app', privacy: '/privacy', ...options.config };
  const post = load('src/app/api/contact/route.ts', {
    '@/lib/contact': contact, '@/lib/contact-config': { contactConfig: () => config }, '@/lib/contact-store': guards, '@/lib/contact-delivery': delivery,
  }).POST;
  const cleanup = load('netlify/functions/contact-cleanup.ts', { '@netlify/blobs': { getStore }, '../../src/lib/contact-store': guards }).default;
  return { post, records, metadata, received, ingress, guards, store, cleanup, delivery, calls: () => deliveryCalls };
}

test('validazione: campi obbligatori, whitespace, limiti, enum, telefono e consenso', () => {
  assert.ok(contact.validateInquiry(valid).data);
  for (const change of [{ nome: '' }, { nome: '   ' }, { privacy: false }, { privacy: 'true' }, { email: 'bad' }, { email: 'a\r\n@bad.it' }, { telefono: '+...---' }, { telefono: '12345' }, { telefono: '1'.repeat(16) }, { tipologia: 'Inventata' }, { website: 'spam' }, { website: false }, { messaggio: 'a'.repeat(4001) }, { nome: 'a'.repeat(201) }, { location: {} }]) assert.ok(contact.validateInquiry({ ...valid, ...change }).error, JSON.stringify(change));
  for (const bad of [null, [], 0, 'test']) assert.ok(contact.validateInquiry(bad).error);
});
test('data realmente facoltativa e verifica calendario, inclusi anni bisestili', () => {
  for (const data of ['', undefined, '2028-02-29']) assert.ok(contact.validateInquiry({ ...valid, data }).data);
  for (const data of ['2027-02-29', '2027-02-30', '2027-13-01', '27/02/2027', {}, null]) {
    if (data === null) continue;
    assert.ok(contact.validateInquiry({ ...valid, data }).error);
  }
});
test('normalizza e non inoltra proprietà estranee', () => {
  const value = contact.validateInquiry({ ...valid, nome: '  Test  ', extra: 'non inoltrare' }).data;
  assert.equal(value.nome, 'Test'); assert.equal(value.extra, undefined);
});
test('backend: origine, formato, JSON malformato e dimensione reale dello stream', async () => {
  const { post, calls } = setup();
  assert.equal((await post(request(valid, { origin: 'https://external.invalid' }))).status, 403);
  assert.equal((await post(request(valid, { 'sec-fetch-site': 'cross-site' }))).status, 403);
  assert.equal((await post(request(valid, { origin: 'null' }))).status, 403);
  assert.equal((await post(request(valid, { 'content-type': 'application/json-malformed' }))).status, 415);
  assert.equal((await post(request({ ...valid, email: 'bad' }))).status, 400);
  assert.equal((await post(request({ ...valid, messaggio: 'a'.repeat(21000) }))).status, 413);
  const malformed = request(); await malformed.text();
  assert.equal((await post(malformed)).status, 400);
  assert.equal(calls(), 0);
});
test('nessun invio senza configurazione, IP attendibile o archivio disponibile', async () => {
  for (const options of [{ config: { enabled: false } }, { config: { privacy: null } }, { storageDown: true }]) {
    const ctx = setup(options); assert.equal((await ctx.post(request())).status, 503); assert.equal(ctx.calls(), 0);
  }
  const ctx = setup();
  assert.equal((await ctx.post(request(valid, { 'x-nf-client-connection-ip': '', 'x-forwarded-for': '192.0.2.1' }))).status, 503);
});
test('origine corretta dietro normalizzazione localhost di Next.js e HTTPS del proxy', async () => {
  const ctx = setup({ config: { enabled: false } });
  const proxyRequest = (origin, host, forwardedProto) => new Request('http://localhost:3011/api/contact', {
    method: 'POST', headers: { origin, host, 'content-type': 'application/json', ...(forwardedProto ? { 'x-forwarded-proto': forwardedProto } : {}) }, body: JSON.stringify(valid),
  });
  assert.equal((await ctx.post(proxyRequest('http://127.0.0.1:3011', '127.0.0.1:3011'))).status, 503);
  assert.equal((await ctx.post(proxyRequest('https://example.org', 'example.org', 'https'))).status, 503);
  assert.equal((await ctx.post(proxyRequest('https://external.invalid', 'example.org', 'https'))).status, 403);
});
test('flusso server → firma → protezione ingresso → ricevitore simulato: payload minimizzato e ricevuta', async () => {
  const ctx = setup(); const response = await ctx.post(request({ ...valid, extra: 'non inoltrare' }));
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  const result = await response.json(); assert.equal(result.ok, true); assert.match(result.reference, /^[a-f0-9-]{36}$/);
  assert.equal(ctx.received.length, 1); const saved = ctx.received[0];
  assert.equal(saved['form-name'], contact.CONTACT_FORM_NAME); assert.equal(saved.email, valid.email);
  assert.equal(saved.privacy, 'true'); assert.equal(saved.informativa, '/privacy');
  assert.equal(saved.versioneInformativa, contact.PRIVACY_VERSION); assert.equal(saved.richiesta, result.reference); assert.equal(saved.extra, undefined);
  assert.equal(JSON.stringify([...ctx.records]).includes(valid.messaggio), false);
  assert.equal(JSON.stringify([...ctx.records]).includes(valid.email), false);
  assert.equal(JSON.stringify([...ctx.records]).includes('192.0.2.1'), false);
});
test('duplicato dopo conferma: stessa ricevuta, un solo invio', async () => {
  const ctx = setup(); const first = await (await ctx.post(request())).json();
  const second = await (await ctx.post(request())).json();
  assert.equal(second.ok, true); assert.equal(second.duplicate, true); assert.equal(first.reference, second.reference); assert.equal(ctx.calls(), 1);
});
test('invii simultanei identici: prenotazione atomica impedisce doppia notifica', async () => {
  const ctx = setup(); const responses = await Promise.all(Array.from({ length: 12 }, () => ctx.post(request())));
  assert.equal(ctx.calls(), 1); assert.ok(responses.some(res => res.status === 200));
  assert.ok(responses.every(res => [200, 409, 429].includes(res.status)));
});
test('limite distribuito: cinque nuove richieste ogni dieci minuti per IP, con Retry-After', async () => {
  const ctx = setup();
  for (let i = 0; i < 5; i++) assert.equal((await ctx.post(request({ ...valid, messaggio: `Richiesta distinta ${i}` }))).status, 200);
  const denied = await ctx.post(request({ ...valid, messaggio: 'Sesta richiesta' }));
  assert.equal(denied.status, 429); assert.ok(Number(denied.headers.get('retry-after')) > 0); assert.equal(ctx.calls(), 5);
  assert.equal((await ctx.post(request({ ...valid, messaggio: 'Altro indirizzo' }, { 'x-nf-client-connection-ip': '192.0.2.2' }))).status, 200);
});
test('slot antispam concorrenti: la quota non viene superata', async () => {
  const ctx = setup(); const results = await Promise.all(Array.from({ length: 20 }, () => ctx.guards.allowContact(ctx.store, '192.0.2.1', 1800000)));
  assert.equal(results.filter(result => result.allowed).length, 5);
});
test('timeout, errori e form non rilevato: esito incerto, nessun falso successo e nessun reinvio', async () => {
  for (const delivery of [async () => { throw Error('timeout'); }, async () => new Response('error', { status: 500 }), async () => html(fs.readFileSync('public/__forms.html', 'utf8')), async () => new Response('{}', { headers: { 'Content-Type': 'application/json' } }), async () => html('')]) {
    const ctx = setup({ delivery });
    const first = await ctx.post(request()); assert.equal(first.status, 409); assert.equal((await first.json()).uncertain, true);
    assert.equal((await ctx.post(request())).status, 409); assert.equal(ctx.calls(), 1);
  }
});
test('firma: valida corpo e timestamp e rifiuta modifica, scadenza e formato errato', async () => {
  const now = Date.now(); const secret = 'private-server-key'; const timestamp = String(now); const body = 'form-name=test';
  const signed = await signature.signSubmission(secret, timestamp, body);
  assert.equal(await signature.verifySubmission(secret, timestamp, body, signed, now), true);
  assert.equal(await signature.verifySubmission(secret, timestamp, body + 'x', signed, now), false);
  assert.equal(await signature.verifySubmission(secret, timestamp, body, signed, now + 61000), false);
  assert.equal(await signature.verifySubmission(secret, timestamp, body, 'bad', now), false);
});
test('ingresso Netlify: blocca invio diretto e percorsi alternativi; lascia passare JSON applicativo', async () => {
  const ctx = setup();
  const direct = path => new Request(`https://eventsstudio-demo.netlify.app${path}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'form-name=events-studio-contatti&email=spam%40example.invalid' });
  for (const path of ['/__forms.html', '/__forms', '/', '/assets/logo.png']) assert.equal((await ctx.ingress(direct(path))).status, 403);
  assert.equal(await ctx.ingress(request()), undefined);
  assert.equal(await ctx.ingress(new Request('https://eventsstudio-demo.netlify.app/__forms.html')), undefined);
});
test('redirect: non inoltra dati a domini esterni e non segue redirect che ripetono POST', async () => {
  for (const status of [302, 303, 307, 308]) {
    const ctx = setup({ delivery: async () => new Response('', { status, headers: { Location: 'https://external.invalid' } }) });
    assert.equal((await ctx.post(request())).status, 409); assert.equal(ctx.calls(), 1);
  }
});
test('pulizia giornaliera: elimina solo guardie scadute, conserva chiave privata e dati recenti', async () => {
  const ctx = setup(); const old = Date.now() - 49 * 3600 * 1000;
  await ctx.store.setJSON('requests/old', {}, { metadata: { createdAt: old } });
  await ctx.store.setJSON('rate/old', {}, { metadata: { createdAt: old } });
  await ctx.store.setJSON('requests/new', {}, { metadata: { createdAt: Date.now() } });
  await ctx.store.setJSON(signature.CONTACT_SIGNING_KEY, 'private-key', { metadata: { createdAt: old } });
  await ctx.cleanup();
  assert.equal(ctx.records.has('requests/old'), false); assert.equal(ctx.records.has('rate/old'), false);
  assert.equal(ctx.records.has('requests/new'), true); assert.equal(ctx.records.has(signature.CONTACT_SIGNING_KEY), true);
});
test('definizione statica Netlify contiene tutti i campi del payload', () => {
  const definition = fs.readFileSync('public/__forms.html', 'utf8');
  assert.ok(definition.includes(`name="${contact.CONTACT_FORM_NAME}"`));
  for (const name of [...Object.keys(valid), 'website', 'richiesta', 'informativa', 'versioneInformativa', 'ricevutaIl']) assert.ok(definition.includes(`name="${name}"`), name);
});
