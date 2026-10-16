import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open();
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1000);
const R1=await p.evaluate(()=>{const M=__MQ,S=M.S(),O=M.OW();O.on=false;const id=q=>q.kind==='gram'?q.g.q:q.kind==='order'?q.it.s:q.w.en;
 const cap=M.ALLW().length;const ids=[];let dup=0;for(let i=0;i<40;i++){const q=M.owMakeQ({seen:new Set()});const k=id(q);if(ids.includes(k))dup++;ids.push(k);}
 return {dup40:dup,recent:S.ow.recent.length};});
console.log(JSON.stringify(R1));
await p.evaluate(()=>{__MQ.owExit();});await sleep(300);
const out={};
for(const mode of ['grammar','power','order','spell','pic','listen','match','exam','read']){
  const runs=[];
  for(let r=0;r<3;r++){
    await p.evaluate(()=>{const b=document.querySelector('[data-tab="home"]');b&&b.click();});await sleep(150);
    await p.evaluate(m=>{const b=document.querySelector('[data-mode="'+m+'"]');b&&b.click();},mode);await sleep(300);
    runs.push(await p.evaluate(()=>{const G=__MQ.G();return G&&G.items?G.items.map(x=>x.q||x.s||x.en||(x.qs&&x.qs[0].q)||JSON.stringify(x)):null;}));
  }
  const ov=(a,b)=>a&&b?a.filter(x=>b.includes(x)).length:-1;
  out[mode]={n:runs.map(r=>r&&r.length),ov01:ov(runs[0],runs[1]),ov12:ov(runs[1],runs[2]),ov02:ov(runs[0],runs[2])};
}
console.log(JSON.stringify(out));console.log(errs);await b.close();
