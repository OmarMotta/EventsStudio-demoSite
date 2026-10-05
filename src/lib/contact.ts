export const eventTypes = ['Feste private','Diciottesimi','Wedding','Eventi aziendali','Feste di piazza','Spettacoli','Tourism'];
export type Inquiry = { nome: string; cognome: string; telefono: string; email: string; tipologia: string; data: string; location: string; messaggio: string; privacy: boolean; website?: string };
export function validateInquiry(value: unknown): { data?: Inquiry; error?: string } {
  if(!value || typeof value!=='object') return {error:'Controlla i campi del modulo.'};
  const raw=value as Record<string, unknown>;
  const required=['nome','cognome','telefono','email','tipologia','location','messaggio'];
  if(required.some(key=>typeof raw[key]!=='string'||!(raw[key] as string).trim())) return {error:'Compila tutti i campi obbligatori.'};
  if(required.some(key=>(raw[key] as string).length>(key==='messaggio'?4000:200))) return {error:'Uno dei campi supera la lunghezza consentita.'};
  if(typeof raw.data!=='string'||(raw.data && (!/^\d{4}-\d{2}-\d{2}$/.test(raw.data)||Number.isNaN(Date.parse(raw.data))||new Date(raw.data).toISOString().slice(0,10)!==raw.data))) return {error:'Controlla la data dell’evento.'};
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((raw.email as string).trim())||!/^\+?[\d\s().-]{6,30}$/.test((raw.telefono as string).trim())) return {error:'Controlla email e telefono.'};
  if(!eventTypes.includes(raw.tipologia as string)) return {error:'Seleziona la tipologia di evento.'};
  if(raw.privacy!==true) return {error:'È necessario accettare l’informativa privacy.'};
  if(raw.website) return {error:'Impossibile elaborare questa richiesta.'};
  return {data:{nome:(raw.nome as string).trim(),cognome:(raw.cognome as string).trim(),telefono:(raw.telefono as string).trim(),email:(raw.email as string).trim(),tipologia:raw.tipologia as string,data:raw.data,location:(raw.location as string).trim(),messaggio:(raw.messaggio as string).trim(),privacy:true}};
}
