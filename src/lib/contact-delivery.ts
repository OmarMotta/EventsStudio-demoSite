import { PRIVACY_VERSION, type Inquiry } from './contact';
import type { ContactConfig } from './contact-config';
export const escapeHtml = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function contactEmail(config: ContactConfig, inquiry: Inquiry, id: string) {
  const rows = [
    ['Nome', inquiry.nome], ['Cognome', inquiry.cognome], ['Email', inquiry.email], ['Telefono', inquiry.telefono],
    ['Tipologia evento', inquiry.tipologia], ['Data evento', inquiry.data || 'Non indicata'], ['Città / Location', inquiry.location],
    ['Messaggio', inquiry.messaggio], ['Informativa privacy', `Letta — versione ${PRIVACY_VERSION}`], ['Riferimento', id],
  ];
  return {
    from: `Events Studio <${config.from}>`, to: [config.to], reply_to: inquiry.email,
    subject: 'Events Studio | Nuova richiesta',
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n\n'),
    html: `<!doctype html><html lang="it"><body style="margin:0;background:#101010;color:#eeeeee;font-family:Arial,sans-serif"><table role="presentation" style="width:100%;max-width:640px;margin:auto;padding:32px 24px"><tr><td><p style="color:#dcb780;letter-spacing:3px">EVENTS STUDIO</p><h1 style="font-family:Georgia,serif;font-size:32px">Nuova richiesta dal sito</h1>${rows.map(([label, value]) => `<div style="border-top:1px solid #454036;padding:16px 0"><p style="margin:0 0 8px;color:#dcb780;font-size:13px">${escapeHtml(label)}</p><div style="white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6">${escapeHtml(value)}</div></div>`).join('')}<p style="font-size:13px;color:#cccccc">Usa Rispondi per contattare il cliente.</p></td></tr></table></body></html>`,
  };
}
export async function deliverContact(config: ContactConfig, inquiry: Inquiry, id: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `events-contact/${id}` },
    body: JSON.stringify(contactEmail(config, inquiry, id)), cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('Email provider did not accept submission');
  const result = await response.json();
  if (typeof result.id !== 'string' || !result.id) throw new Error('Missing provider receipt');
  return result.id as string;
}
