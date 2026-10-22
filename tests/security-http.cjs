// Integration checks against the running local server; never submits a real inquiry.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const base = new URL(process.env.SECURITY_TEST_BASE_URL || 'http://127.0.0.1:3011');
if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) throw Error('Run these probes only against a local preview.');
const post = (body, headers = {}) => fetch(new URL('/api/contact', base), {
  method: 'POST', headers: { Origin: base.origin, 'Content-Type': 'application/json', ...headers }, body,
});

test('security headers protect pages and static form definition', async () => {
  for (const path of ['/', '/contatti', '/privacy', '/__forms.html']) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
    assert.match(response.headers.get('strict-transport-security'), /max-age=31536000/);
    assert.match(response.headers.get('permissions-policy'), /camera=\(\)/);
    const csp = response.headers.get('content-security-policy');
    for (const directive of ["connect-src 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'", "script-src-attr 'none'"]) assert.ok(csp.includes(directive), directive);
    assert.ok(!csp.includes("'unsafe-eval'"), 'production does not allow eval');
    assert.equal(response.headers.get('x-powered-by'), null);
    await response.body?.cancel();
  }
});
test('contact records have no public GET endpoint', async () => {
  const response = await fetch(new URL('/api/contact?all=true', base));
  assert.equal(response.status, 405);
});
test('files outside public cannot be downloaded as web assets', async () => {
  for (const path of ['/.env', '/.git/config', '/src/lib/contact-store.ts', '/netlify.toml']) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 404, path);
    await response.body?.cancel();
  }
});
test('cross-site submissions rejected without reflecting personal data', async () => {
  const response = await post('{}', { Origin: 'https://attacker.invalid', 'Sec-Fetch-Site': 'cross-site' });
  assert.equal(response.status, 403);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(response.headers.get('access-control-allow-origin'), null);
});
test('missing origin rejected', async () => {
  const response = await fetch(new URL('/api/contact', base), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(response.status, 403);
});
test('unexpected content type rejected', async () => {
  assert.equal((await post('name=value', { 'Content-Type': 'text/plain' })).status, 415);
});
test('invalid JSON and missing fields rejected', async () => {
  assert.equal((await post('{')).status, 400);
  const response = await post('{}');
  assert.equal(response.status, 400);
  const result = await response.json();
  assert.ok(result.fields.email && result.fields.privacy);
  assert.ok(!('stack' in result));
});
test('oversized request rejected', async () => {
  assert.equal((await post(JSON.stringify({ messaggio: 'x'.repeat(21000) }))).status, 413);
});
test('unapproved service query does not become executable HTML', async () => {
  const url = new URL('/contatti', base);
  const payload = '<img src=x onerror=alert(1)>';
  url.searchParams.set('servizio', payload);
  const response = await fetch(url);
  assert.equal(response.status, 200);
  assert.ok(!(await response.text()).includes(payload));
});


test('local validation notice is restricted to loopback hosts', async () => {
  const local = await fetch(new URL('/contatti', base));
  assert.ok((await local.text()).includes('Anteprima locale: puoi controllare i campi'));
  // Node fetch derives Host from the URL; use HTTP directly to emulate
  // the reverse proxy's actual public Host without connecting to production.
  const html = await new Promise((resolve, reject) => {
    require('node:http').get(new URL('/contatti', base), { headers: { Host: 'eventsstudio-demo.netlify.app' } }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
  assert.ok(!html.includes('Anteprima locale: puoi controllare i campi'));
  assert.ok(html.includes('Invia richiesta'));
});
