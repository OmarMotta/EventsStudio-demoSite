import { validateInquiry } from '@/lib/contact';
import { contactConfig } from '@/lib/contact-config';
export const runtime = 'nodejs';
const reply=(error:string,status:number)=>Response.json({error},{status});
export async function POST(request:Request) {
  if(request.headers.get('origin')!==new URL(request.url).origin) return reply('Origine della richiesta non valida.',403);
  if(!request.headers.get('content-type')?.startsWith('application/json')) return reply('Formato non valido.',415);
  if(Number(request.headers.get('content-length')??0)>20000) return reply('Messaggio troppo lungo.',413);
  let raw: unknown;
  try {
    const reader=request.body?.getReader(); if(!reader) return reply('Richiesta vuota.',400);
    let length=0; const chunks:Uint8Array[]=[];
    while(true){const {done,value}=await reader.read(); if(done) break; length+=value.length; if(length>20000){await reader.cancel(); return reply('Messaggio troppo lungo.',413);} chunks.push(value);}
    raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return reply('Controlla i dati del modulo.',400); }
  const result=validateInquiry(raw); if(!result.data) return reply(result.error!,400);
  const config=contactConfig(); if(!config.enabled||!config.webhook) return reply('Il servizio di invio non è ancora attivo. Nessun messaggio è stato inviato.',503);
  try {
    const response=await fetch(config.webhook,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.CONTACT_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({source:'events-studio',...result.data,privacyUrl:config.privacy,receivedAt:new Date().toISOString()}),signal:AbortSignal.timeout(10000),redirect:'error'});
    if(!response.ok) return reply('L’invio non è riuscito. Riprova più tardi.',502);
    return Response.json({ok:true});
  } catch { return reply('Impossibile confermare la ricezione. Attendi prima di riprovare.',502); }
}
