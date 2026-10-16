import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open();
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1000);
const r=await p.evaluate(()=>{const M=__MQ,S=M.S();const o={};S.ow.miss={cat:2,dog:1};
 for(let i=0;i<200;i++){const q=M.owMakeQ0({onlyMiss:true});o[q.w.en]=(o[q.w.en]||0)+1;}
 const seen=new Set();const o2={};
 for(let i=0;i<200;i++){const sn=new Set();const q=M.owMakeQ({onlyMiss:true,seen:sn});o2[q.w.en]=(o2[q.w.en]||0)+1;}
 return {o,o2,miss:S.ow.miss};});
console.log(JSON.stringify(r));await b.close();
