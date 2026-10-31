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
const valid = { nome:'Mario', cognome:'Rossi', telefono:'+39 338 5733403', email:'visitor@example.org', tipologia:'Wedding', data:'2027-06-18', location:'Potenza', messaggio:'Vorrei informazioni sul servizio DJ.', privacy:true };
const config = { enabled:true, origin:'https://events.example.org', privacy:'/privacy', apiKey:'test-only', from:'sender@example.org', to:'owner@example.org', redisUrl:'https://redis.example.org', redisToken:'test-only', secret:'s'.repeat(40) };
const request = (body=valid, headers={}) => new Request(config.origin+'/api/contact',{method:'POST',headers:{Origin:config.origin,'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
function setup(options={}) {
 const records=new Map(), commands=[], emails=[];
 const guards=load('src/lib/contact-store.ts',{}, {fetch:async(url,init)=>{
  if(options.storageDown) throw Error('offline');
  const c=JSON.parse(init.body);commands.push(c);let result=null;
  if(c[0]==='GET') result=records.get(c[1])??null;
  if(c[0]==='SET') {if(c.includes('NX')&&records.has(c[1])) result=null;else {records.set(c[1],c[2]);result='OK';}}
  if(c[0]==='EVAL') {const g=Number(records.get(c[3])||0),e=Number(records.get(c[4])||0);result=g>=30||e>=5?0:1;if(result){records.set(c[3],g+1);records.set(c[4],e+1);}}
  return Response.json({result});
 }});
 const delivery=load('src/lib/contact-delivery.ts',{'./contact':contact},{fetch:async(url,init)=>{emails.push({url,...init,body:JSON.parse(init.body)});return options.provider ? options.provider() : Response.json({id:'provider-receipt'});}});
 const post=load('src/app/api/contact/route.ts',{'@/lib/contact':contact,'@/lib/contact-config':{contactConfig:()=>({...config,...options.config})},'@/lib/contact-store':guards,'@/lib/contact-delivery':delivery}).POST;
 return {post,records,commands,emails,guards,delivery};
}
test('validazione completa, campi obbligatori, consenso, enum, limiti e honeypot',()=>{
 assert.ok(contact.validateInquiry(valid).data);
 for(const key of Object.keys(valid).filter(k=>k!=='data')) {const x={...valid};delete x[key];assert.ok(contact.validateInquiry(x).error,key);}
 for(const patch of [{email:'a@b'},{email:'a@example.org\r\nBcc:x@y.org'},{privacy:'true'},{telefono:'abc'},{tipologia:'unknown'},{nome:'x'.repeat(201)},{messaggio:'x'.repeat(4001)},{website:'bot'},{data:'2027-02-30'}]) assert.ok(contact.validateInquiry({...valid,...patch}).error);
 assert.ok(contact.validateInquiry({...valid,data:''}).data);assert.ok(contact.validateInquiry({...valid,data:'2028-02-29'}).data);
});
test('normalizzazione e rimozione proprietà non previste',()=>{const r=contact.validateInquiry({...valid,nome:' Mario ',admin:true});assert.equal(r.data.nome,'Mario');assert.equal(r.data.admin,undefined);});
test('origine configurata, Host contraffatto e origine assente rifiutati',async()=>{
 const x=setup();assert.equal((await x.post(request(valid,{Origin:'https://attacker.org',Host:'attacker.org'}))).status,403);
 assert.equal((await x.post(request(valid,{Origin:'null'}))).status,403);
 assert.equal((await x.post(request(valid,{'Sec-Fetch-Site':'cross-site'}))).status,403);assert.equal(x.emails.length,0);
});
test('JSON, dimensione dichiarata/reale, formato e dati invalidi',async()=>{
 const x=setup();assert.equal((await x.post(request({}, {'Content-Type':'text/plain'}))).status,415);
 assert.equal((await x.post(request({}, {'Content-Length':'21000'}))).status,413);
 assert.equal((await x.post(request({messaggio:'x'.repeat(21000)}))).status,413);
 assert.equal((await x.post(request({}))).status,400);
 assert.equal((await x.post(new Request(config.origin+'/api/contact',{method:'POST',headers:{Origin:config.origin,'Content-Type':'application/json'},body:'{'}))).status,400);
});
test('configurazione mancante o archivio indisponibile: nessun invio',async()=>{
 for(const options of [{config:{enabled:false}},{storageDown:true}]) {const x=setup(options);assert.equal((await x.post(request())).status,503);assert.equal(x.emails.length,0);}
});
test('invio completo, HTML sicuro, Reply-To, consenso, testo e idempotenza provider',async()=>{
 const x=setup();const response=await x.post(request({...valid,messaggio:'<script>alert(1)</script> & dettagli'}));assert.equal(response.status,200);
 const receipt=await response.json(),mail=x.emails[0];assert.equal(mail.url,'https://api.resend.com/emails');assert.equal(mail.body.reply_to,valid.email);
 for(const key of ['nome','cognome','email','telefono','tipologia','data','location']) assert.ok(mail.body.text.includes(valid[key]));
 assert.ok(mail.body.text.includes(contact.PRIVACY_VERSION));assert.ok(mail.body.html.includes('&lt;script&gt;'));assert.ok(!mail.body.html.includes('<script>'));
 assert.equal(mail.headers['Idempotency-Key'],'events-contact/'+receipt.reference);
});
test('retry identici e invii concorrenti: una sola email',async()=>{
 const x=setup();const responses=await Promise.all(Array.from({length:6},()=>x.post(request())));assert.equal(x.emails.length,1);assert.ok(responses.some(r=>r.status===200));
 const result=await (await x.post(request())).json();assert.equal(result.ok,true);assert.equal(result.duplicate,true);
});
test('rifiuti, timeout, risposte malformate: nessun falso successo né reinvio',async()=>{
 for(const provider of [()=>Response.json({error:'secret provider detail'},{status:403}),()=>Response.json({},{status:429}),()=>Response.json({},{status:500}),()=>{throw Error('timeout');},()=>Response.json({}),()=>new Response('invalid')]) {
 const x=setup({provider});const r=await x.post(request());assert.equal(r.status,409);const body=await r.json();assert.equal(body.uncertain,true);assert.equal(body.ok,undefined);assert.ok(!JSON.stringify(body).includes('secret provider detail'));
 await x.post(request());assert.equal(x.emails.length,1);
 }
});
test('quota persistente per email e quota globale, anche con indirizzi diversi',async()=>{
 const x=setup();for(let i=0;i<5;i++) assert.equal((await x.post(request({...valid,messaggio:String(i)}))).status,200);
 assert.equal((await x.post(request({...valid,messaggio:'six'}))).status,429);
 const y=setup();for(let i=0;i<30;i++) assert.equal((await y.post(request({...valid,email:`a${i}@example.org`}))).status,200);
 assert.equal((await y.post(request({...valid,email:'extra@example.org'}))).status,429);
});
test('archivio contiene solo impronte, UUID e stati; TTL e comandi atomici',async()=>{
 const x=setup();await x.post(request());const serialized=JSON.stringify([...x.records]);for(const v of [valid.email,valid.nome,valid.messaggio,config.apiKey]) assert.ok(!serialized.includes(v));
 assert.ok(x.commands.some(c=>c[0]==='SET'&&c.includes('NX')&&c.includes(172800)));assert.ok(x.commands.some(c=>c.includes('KEEPTTL')));assert.ok(x.commands.some(c=>c[0]==='EVAL'&&c[1].includes('EXPIRE')));
});
test('configurazione sicura e locale supportata, nessun fallback hosting',()=>{
 const env={CONTACT_SITE_ORIGIN:'http://127.0.0.1:3000',RESEND_API_KEY:'test',CONTACT_TO_EMAIL:'owner@example.org',CONTACT_FROM_EMAIL:'sender@example.org',UPSTASH_REDIS_REST_URL:'https://redis.example.org',UPSTASH_REDIS_REST_TOKEN:'test',CONTACT_GUARD_SECRET:'s'.repeat(32)};
 const c=load('src/lib/contact-config.ts',{'./contact':contact},{process:{env}});assert.equal(c.contactConfig().enabled,true);
 env.CONTACT_SITE_ORIGIN='http://public.example.org';assert.equal(c.contactConfig().enabled,false);
 env.CONTACT_SITE_ORIGIN='https://public.example.org';env.CONTACT_FROM_EMAIL='bad\r\nfrom@example.org';assert.equal(c.contactConfig().enabled,false);
});
