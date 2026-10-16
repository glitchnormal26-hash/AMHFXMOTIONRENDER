import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open(390,860,{touch:true,dsf:1});
await createChar(p,'p2','Dina');
await p.evaluate(()=>{const M=__MQ,S=M.S();S.adv.party=['mochi','kai','sari','luna','bima','foxy','pip'];
 for(let c=0;c<6;c++){S.adv.seen['i'+c]=1;for(let s=0;s<8;s++)S.adv.seen['s'+c+'-'+s]=1;}
 for(let s=0;s<5;s++)S.adv.stars['0-'+s]=s%3+1;document.querySelector('[data-tab="adv"]').click();});
await sleep(400);
await p.screenshot({path:'/home/user/tools/a1.png'});
await p.evaluate(()=>{document.querySelector('[data-st="0-5"]').click();});await sleep(400);
await p.screenshot({path:'/home/user/tools/a2.png'});
await p.evaluate(()=>{document.querySelector('[data-sp="go"]').click();});await sleep(800);
await p.evaluate(()=>{const g=__MQ.G();document.querySelector('#board .opt[data-k="'+g.cur.ans.replace(/"/g,'\\"')+'"]').click();});await sleep(600);
await p.evaluate(()=>{document.getElementById('nextBtn').click();});await sleep(600);
await p.screenshot({path:'/home/user/tools/a3.png'});
await b.close();
