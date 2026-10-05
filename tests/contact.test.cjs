const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file,imports={},extra={}) {
  const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const module={exports:{}};
  vm.runInNewContext(js,{exports:module.exports,module,require:name=>{if(!(name in imports))throw new Error(name);return imports[name]},Response,URL,Buffer,AbortSignal,process:{env:{}},...extra});
  return module.exports;
}
const contact=load('src/lib/contact.ts');
const valid={nome:'Test',cognome:'Tecnico',telefono:'+390000000000',email:'test@example.invalid',tipologia:'Wedding',data:'2027-06-18',location:'Ambiente di test',messaggio:'Verifica automatica: nessun invio reale.',privacy:true};
const request=(body=valid,origin='http://localhost:3000')=>new Request('http://localhost:3000/api/contact',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
const handler=(config,fetch)=>load('src/app/api/contact/route.ts',{'@/lib/contact':contact,'@/lib/contact-config':{contactConfig:()=>config}},{fetch}).POST;
test('validazione: campi, consenso, data, email, categoria, honeypot e limiti',()=>{
 assert.ok(contact.validateInquiry(valid).data);
 for(const change of [{nome:''},{privacy:false},{data:'2027-02-30'},{email:'non-valida'},{tipologia:'Inventata'},{website:'spam'},{messaggio:'a'.repeat(4001)}]) assert.ok(contact.validateInquiry({...valid,...change}).error);
});
test('nessun falso successo senza configurazione',async()=>{const res=await handler({enabled:false},()=>{throw Error('No external call expected')})(request());assert.equal(res.status,503)});
test('blocca origine esterna, dati malformati e payload troppo grandi',async()=>{const post=handler({enabled:false});assert.equal((await post(request(valid,'https://external.invalid'))).status,403);assert.equal((await post(request({...valid,email:'bad'}))).status,400);assert.equal((await post(request({...valid,messaggio:'a'.repeat(21000)}))).status,413)});
test('successo soltanto dopo conferma del ricevitore, payload minimizzato',async()=>{let payload;const post=handler({enabled:true,webhook:'https://receiver.invalid',privacy:'/privacy'},async(url,options)=>{payload=JSON.parse(options.body);return new Response('{}',{status:200})});assert.equal((await post(request({...valid,extra:'do not forward'}))).status,200);assert.equal(payload.extra,undefined);assert.equal(payload.privacy,true);assert.equal(payload.privacyUrl,'/privacy')});
test('errore e timeout del ricevitore non producono conferme false',async()=>{for(const fetch of [async()=>new Response('',{status:500}),async()=>{throw Error('timeout')}])assert.equal((await handler({enabled:true,webhook:'https://receiver.invalid',privacy:'/privacy'},fetch)(request())).status,502)});
