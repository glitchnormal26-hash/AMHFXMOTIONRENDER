import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open(420,900);
await createChar(p,'p4','Rina');
const R=await p.evaluate(async()=>{
  const M=__MQ,S=M.S(),out={},w=ms=>new Promise(r=>setTimeout(r,ms));
  S.diff=1;S.adv.party=['mochi','kai','sari','luna','bima','foxy','pip'];
  for(let c=0;c<6;c++){S.adv.seen['i'+c]=1;for(let s=0;s<8;s++)S.adv.seen['s'+c+'-'+s]=1;}
  document.querySelector('[data-tab="adv"]').click();await w(200);
  out.nrow=document.querySelectorAll('.nrow').length;out.nodes=document.querySelectorAll('.node').length;out.prog=document.querySelectorAll('.chap-prog').length;
  // open all of ch0 except boss
  for(let s=0;s<7;s++)S.adv.stars['0-'+s]=1;
  document.querySelector('[data-tab="adv"]').click();await w(100);
  // preview of locked stage
  document.querySelector('[data-st="1-0"]').click();await w(100);out.lockedModal=!!document.querySelector('.stagemodal');
  document.querySelector('[data-st="0-5"]').click();await w(100);out.prev=!!document.querySelector('.stagemodal');
  out.goals=document.querySelectorAll('.sp-goals li').length;
  document.querySelector('[data-sp="go"]').click();await w(400);
  const G=()=>M.G();
  out.mode5=G().mode;out.total5=G().total;out.hero=!!document.querySelector('#heroBox svg');
  // talk: answer correctly with checks
  let turns=[];
  for(let i=0;i<5;i++){
    const g=G();const q=g.items[g.progress];
    const btn=[...document.querySelectorAll('#board .opt')].find(x=>x.dataset.k===g.cur.ans);
    if(!btn){out.nobtn=i;break;}
    turns.push(q.q.slice(0,30));
    btn.click();await w(300);document.getElementById('nextBtn')?.click();await w(300);
  }
  out.talkDone=G().done||!!document.getElementById('result')&&!document.getElementById('result').hidden;
  out.turns=turns;out.hasName=turns.some(t=>t.includes('$NAME'));
  await w(500);
  out.stars=S.adv.stars['0-5'];
  // back to map and try grammar wave (ch0 stage 6 pic is 8 rounds)
  document.querySelector('[data-act="map"],[data-act="menu"]')?.click();await w(300);
  return out;
});
console.log(JSON.stringify(R));
// wave test via direct state
const R2=await p.evaluate(async()=>{
  const M=__MQ,S=M.S(),out={},w=ms=>new Promise(r=>setTimeout(r,ms));
  document.querySelector('[data-tab="adv"]').click();await w(100);
  document.querySelector('[data-st="0-6"]').click();await w(100);
  document.querySelector('[data-sp="go"]').click();await w(400);
  const G=()=>M.G();out.mode=G().mode;out.total=G().total;
  let boon=0;
  for(let i=0;i<G().total+2;i++){
    if(G().done)break;
    const bo=document.querySelector('.boonmodal [data-boon]');
    if(bo){boon++;bo.click();await w(300);}
    const g=G();if(g.done)break;
    const btn=[...document.querySelectorAll('#board .opt')].find(x=>x.dataset.k===g.cur.ans)||document.querySelector('#board .opt');
    if(!btn)break;btn.click();await w(300);document.getElementById('nextBtn')?.click();await w(1400);
  }
  out.boon=boon;out.done=G().done;
  return out;
});
console.log(JSON.stringify(R2));
console.log('errs',JSON.stringify(errs));
await b.close();
