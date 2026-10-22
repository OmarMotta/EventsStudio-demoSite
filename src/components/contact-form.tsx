'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { eventTypes, validateInquiry, type FieldErrors, type Inquiry, type InquiryField } from '@/lib/contact';

type Props = { localPreview?: boolean; enabled: boolean; privacyUrl: string | null; email: string | null; phone: string | null; initialEvent?: string; initialService?: string };
type Outcome = { kind: 'idle' | 'error' | 'success' | 'uncertain'; message: string; reference?: string };
const textInputs = [
  { name: 'nome', label: 'Nome', auto: 'given-name', type: 'text', max: 200 },
  { name: 'cognome', label: 'Cognome', auto: 'family-name', type: 'text', max: 200 },
  { name: 'telefono', label: 'Telefono', auto: 'tel', type: 'tel', max: 30 },
  { name: 'email', label: 'Email', auto: 'email', type: 'email', max: 254 },
] as const;

export function ContactForm({ localPreview = false, enabled, privacyUrl, email, phone, initialEvent = '', initialService = '' }: Props) {
  const [outcome, setOutcome] = useState<Outcome>({ kind: 'idle', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [retryAt, setRetryAt] = useState(0);
  const sending = useRef(false);
  const payload = useRef<Inquiry | null>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const sent = outcome.kind === 'success';
  const uncertain = outcome.kind === 'uncertain';
  const field = 'mt-3 min-h-12 w-full rounded-none border-b border-white/30 bg-transparent py-3 text-base text-white focus:border-sand focus:outline-none aria-[invalid=true]:border-red-300 disabled:opacity-70';

  useEffect(() => {
    if (!retryAt) return;
    const timer = window.setTimeout(() => setRetryAt(0), Math.max(0, retryAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [retryAt]);

  function fieldProps(name: InquiryField) {
    return { id: `contact-${name}`, name, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `error-${name}` : undefined };
  }
  function fieldError(name: InquiryField) {
    return errors[name] ? <span id={`error-${name}`} className="mt-2 block text-sm leading-relaxed text-red-200">{errors[name]}</span> : null;
  }
  function announce(next: Outcome) {
    setOutcome(next);
    requestAnimationFrame(() => feedback.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || sending.current || sent || retryAt) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const validation = validateInquiry(uncertain && payload.current ? payload.current : {
      ...Object.fromEntries(formData), privacy: formData.get('privacy') === 'on',
    });
    if (!validation.data) {
      setErrors(validation.fields ?? {});
      setOutcome({ kind: 'error', message: validation.error });
      const first = Object.keys(validation.fields ?? {})[0];
      requestAnimationFrame(() => {
        if (first) document.getElementById(`contact-${first}`)?.focus();
        else feedback.current?.focus();
      });
      return;
    }
    setErrors({});
    if (localPreview) {
      announce({ kind: 'idle', message: 'I dati sono validi. Per inviare la richiesta usa il sito pubblicato: questa anteprima locale non è collegata al servizio di ricezione.' });
      return;
    }
    if (!navigator.onLine) {
      announce({ kind: uncertain ? 'uncertain' : 'error', message: 'La connessione sembra assente. I dati restano nel modulo: riconnettiti prima di riprovare.' });
      return;
    }
    payload.current = validation.data;
    sending.current = true;
    setBusy(true);
    setErrors({});
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        mode: 'same-origin', credentials: 'omit', redirect: 'error', cache: 'no-store', referrerPolicy: 'no-referrer',
        body: JSON.stringify(validation.data), signal: controller.signal,
      });
      const result = await response.json();
      if (response.ok && result.ok === true && typeof result.reference === 'string') {
        form.reset();
        payload.current = null;
        announce({ kind: 'success', message: 'Richiesta inviata. Grazie per averci raccontato il tuo evento: ti risponderemo ai recapiti indicati.', reference: result.reference });
      } else {
        if (result.fields) setErrors(result.fields);
        if (response.status === 429) {
          const delay = Number(response.headers.get('Retry-After'));
          setRetryAt(Date.now() + (Number.isFinite(delay) && delay > 0 ? Math.min(delay, 600) : 60) * 1000);
        }
        announce({ kind: result.uncertain === true ? 'uncertain' : 'error', message: typeof result.error === 'string' ? result.error : 'L’invio non è riuscito. I dati restano nel modulo: riprova più tardi.', reference: result.reference });
      }
    } catch {
      announce({ kind: 'uncertain', message: 'La connessione si è interrotta prima della conferma. I dati restano nel modulo. Puoi verificare l’esito con il pulsante qui sotto oppure contattarci direttamente.' });
    } finally {
      window.clearTimeout(timeout);
      sending.current = false;
      setBusy(false);
    }
  }

  return <section className="px-6 pb-28 md:px-10 xl:px-16" aria-labelledby="form-title">
    <div className="grid gap-12 border-t border-white/20 pt-10 lg:grid-cols-[.7fr_1.3fr]">
      <div>
        <h2 id="form-title" className="font-display text-4xl leading-tight md:text-6xl">Contatti<span className="text-sand">.</span></h2>
        {localPreview && <p role="note" className="mb-6 max-w-sm border-l border-sand pl-5 text-sm leading-relaxed text-white/70">Anteprima locale: puoi controllare i campi, ma l’invio e la registrazione delle richieste sono disponibili sul sito pubblicato.</p>}
        <p id="form-help" className="mt-6 max-w-sm text-base leading-relaxed text-white/60">Partiamo dalla tua idea. I campi contrassegnati con * sono obbligatori.</p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">Preferisci parlarne direttamente?</p>
        <div className="mt-2 flex flex-col items-start gap-1 text-sm text-sand">
          {phone && <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>}
          {email && <a className="inline-flex min-h-11 max-w-full items-center break-all underline-offset-4 hover:underline" href={`mailto:${email}`}>{email}</a>}
        </div>
      </div>
      <form method="post" action="/api/contact" noValidate aria-busy={busy} aria-describedby="form-help" onSubmit={submit} className="min-w-0">
        <fieldset disabled={busy || sent || uncertain || !enabled} className="min-w-0 border-0 p-0">
          <legend className="sr-only">Raccontaci il tuo evento</legend>
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {textInputs.map(input => <div key={input.name}>
              <label htmlFor={`contact-${input.name}`} className="text-sm text-white/75">{input.label} *</label>
              <input {...fieldProps(input.name)} required maxLength={input.max} autoComplete={input.auto} type={input.type} className={field} />
              {fieldError(input.name)}
            </div>)}
            <div>
              <label htmlFor="contact-tipologia" className="text-sm text-white/75">Tipologia evento *</label>
              <select {...fieldProps('tipologia')} required defaultValue={eventTypes.includes(initialEvent) ? initialEvent : ''} className={field}>
                <option value="" disabled>Seleziona</option>
                {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              {fieldError('tipologia')}
            </div>
            <div>
              <label htmlFor="contact-data" className="text-sm text-white/75">Data evento <span className="text-white/55">(facoltativa)</span></label>
              <input {...fieldProps('data')} type="date" className={`${field} min-w-0`} />
              {fieldError('data')}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-location" className="text-sm text-white/75">Città / Location *</label>
              <input {...fieldProps('location')} required maxLength={200} autoComplete="address-level2" className={field} />
              {fieldError('location')}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-messaggio" className="text-sm text-white/75">Messaggio *</label>
              <textarea {...fieldProps('messaggio')} required rows={5} maxLength={4000} defaultValue={initialService ? `Vorrei informazioni sul servizio ${initialService}.` : ''} className={`${field} resize-y`} />
              {fieldError('messaggio')}
              <p className="mt-2 text-xs leading-relaxed text-white/55">Non inserire dati sanitari, documenti o altre informazioni sensibili.</p>
            </div>
          </div>
          <div hidden aria-hidden="true"><label>Sito web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="mt-8">
            <div className="flex min-h-11 items-start gap-4 text-sm leading-relaxed text-white/70">
              <input {...fieldProps('privacy')} type="checkbox" required className="mt-1 size-5 shrink-0 accent-sand" />
              <label htmlFor="contact-privacy">Ho letto {privacyUrl ? <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-sand">l’informativa privacy<span className="sr-only"> (si apre in una nuova scheda)</span></a> : 'l’informativa privacy'}. *</label>
            </div>
            {fieldError('privacy')}
          </div>
        </fieldset>
        {!enabled && <p role="status" className="mt-6 border-l border-sand pl-5 text-sm leading-relaxed text-white/70">Il servizio di invio non è disponibile. Contattaci direttamente via email o telefono.</p>}
        <div ref={feedback} tabIndex={-1} className="mt-5 scroll-mt-8 focus:outline-none" role="status" aria-live="polite" aria-atomic="true">
          <p className={`text-base leading-relaxed ${outcome.kind === 'error' ? 'text-red-200' : 'text-sand'}`}>{busy ? 'Invio in corso. Attendi la conferma.' : outcome.message}</p>
          {outcome.reference && <p className="mt-2 break-all text-xs leading-relaxed text-white/60">Riferimento: {outcome.reference}</p>}
        </div>
        <button type="submit" disabled={!enabled || busy || sent || Boolean(retryAt)} className="mt-6 min-h-14 border border-sand px-8 py-4 text-sm uppercase tracking-widest text-sand transition-colors hover:bg-sand hover:text-ink disabled:border-white/25 disabled:text-white/55 disabled:hover:bg-transparent">
          {busy ? 'Invio in corso…' : sent ? 'Richiesta inviata' : retryAt ? 'Attendi prima di riprovare' : uncertain ? 'Verifica esito' : localPreview ? 'Verifica i campi' : 'Invia richiesta'}
        </button>
        <noscript><p className="mt-5 text-sm leading-relaxed text-white/70">Per inviare il modulo attiva JavaScript oppure utilizza i recapiti email e telefono.</p></noscript>
      </form>
    </div>
  </section>;
}
