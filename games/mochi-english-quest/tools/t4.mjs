import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open();
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1200);
const r1=await p.evaluate(async()=>{
  const M=__MQ,O=M.OW(),S=M.S();
  const idA=localStorage.getItem(Object.keys(localStorage).find(k=>/act/i.test(k)));
  // stress state
  __MQ.ALLW().forEach(w=>{S.ow.dict[w.en]=3;});S.ow.miss={};__MQ.ALLW().slice(0,40).forEach(w=>S.ow.miss[w.en]=2);
  for(let i=0;i<80;i++){S.ow.col[i]=Date.now();}for(let i=0;i<16;i++)S.ow.chest[i]=Date.now();
  S.ow.stat.mons=50;
  M.owExit&&M.owExit();
  await new Promise(r=>setTimeout(r,200));
  const size=JSON.stringify(S).length;
  let total=0;for(const k of Object.keys(localStorage))total+=(k.length+localStorage.getItem(k).length)*2;
  return {words:__MQ.ALLW().length,size,total,idx:M.readIdx().length,dictN:Object.keys(S.ow.dict).length};
});
console.log(JSON.stringify(r1));
await p.reload();await sleep(800);
const r2=await p.evaluate(()=>{const S=__MQ.S();return {name:S.profile&&S.profile.name,dict:Object.keys(S.ow.dict).length,miss:Object.keys(S.ow.miss).length,mons:S.ow.stat.mons,screen:[...document.querySelectorAll('.screen')].filter(e=>!e.hidden&&getComputedStyle(e).display!=='none').map(e=>e.id)};});
console.log('after reload',JSON.stringify(r2));
// second slot
await p.evaluate(()=>{__MQ.startCreate('new')});await sleep(300);
await createChar(p,'p2','Budi');
const r3=await p.evaluate(()=>{const S=__MQ.S();return {name:S.profile.name,dict:S.ow&&S.ow.dict?Object.keys(S.ow.dict).length:"none",idx:__MQ.readIdx().map(x=>x.pname)};});
console.log('slot2',JSON.stringify(r3));
const r4=await p.evaluate(()=>{const id=__MQ.readIdx().find(x=>x.pname==='Rina').id;__MQ.loadSlot(id);const S=__MQ.S();return {name:S.profile.name,dict:Object.keys(S.ow.dict).length,miss:Object.keys(S.ow.miss).length};});
console.log('back',JSON.stringify(r4),errs);
await b.close();
