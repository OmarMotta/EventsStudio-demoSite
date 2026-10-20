import { CONTACT_DEFINITION_PATH, CONTACT_FORM_NAME, PRIVACY_VERSION, type Inquiry } from './contact';
import { SIGNATURE_HEADER, TIMESTAMP_HEADER, signSubmission } from './contact-signature';

export async function deliverContact(origin: string, inquiry: Inquiry, receiptId: string, privacyUrl: string, signingKey: string) {
  const body = new URLSearchParams({
    'form-name': CONTACT_FORM_NAME,
    ...Object.fromEntries(Object.entries(inquiry).map(([key, value]) => [key, String(value)])),
    website: '', richiesta: receiptId, informativa: privacyUrl,
    versioneInformativa: PRIVACY_VERSION, ricevutaIl: new Date().toISOString(),
  });
  const signal = AbortSignal.timeout(12000);
  const encodedBody = body.toString();
  const timestamp = String(Date.now());
  const signature = await signSubmission(signingKey, timestamp, encodedBody);
  let response = await fetch(new URL(CONTACT_DEFINITION_PATH, origin), {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html', [SIGNATURE_HEADER]: signature, [TIMESTAMP_HEADER]: timestamp },
    body: encodedBody, redirect: 'manual', cache: 'no-store', signal,
  });
  // Only same-origin PRG redirects; never re-post personal data after a redirect.
  if (response.status === 302 || response.status === 303) {
    const location = response.headers.get('location');
    if (!location) throw new Error('Missing form redirect');
    const target = new URL(location, origin);
    if (target.origin !== origin) throw new Error('Unexpected form redirect');
    response = await fetch(target, { redirect: 'error', cache: 'no-store', signal });
  }
  if (!response.ok) throw new Error(`Form reception failed: ${response.status}`);
  const html = await response.text();
  // A plain static response means form detection did not process this POST.
  if (!response.headers.get('content-type')?.includes('text/html') || !html.trim() || html.includes('events-studio-form-definition')) {
    throw new Error('Form submission was not acknowledged');
  }
}
