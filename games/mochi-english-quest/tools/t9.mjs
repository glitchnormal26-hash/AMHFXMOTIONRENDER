import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open(390,860);
await createChar(p,'p2','Dina');
const R=await p.evaluate(async()=>{
  const M=__MQ,S=M.S(),out={},w=ms=>new Promise(r=>setTimeout(r,ms));
  S.diff=0;S.adv.party=['mochi','kai','sari','luna','bima','foxy','pip'];
  for(let c=0;c<6;c++){S.adv.seen['i'+c]=1;for(let s=0;s<8;s++)S.adv.seen['s'+c+'-'+s]=1;}
  for(let s=0;s<7;s++)S.adv.stars['0-'+s]=1;
  document.querySelector('[data-tab="adv"]').click();await w(100);
  document.querySelector('[data-st="0-3"]').click();await w(100);
  document.querySelector('[data-sp="go"]').click();await w(500);
  const G=()=>M.G();out.mode=G().mode;out.total=G().total;
  const cv=document.getElementById('catchCv');out.cv=!!cv&&cv.width>0;
  const t0=performance.now();let wrongHit=0;
  while(!G().done&&performance.now()-t0<60000){
    const ct=G().ct;
    // pilih target: kata benar terendah; hindari salah
    const gs=ct.items.filter(i=>i.good&&!i.dead).sort((a,b)=>b.y-a.y);
    if(gs[0])ct.tx=Math.max(ct.bw/2,Math.min(ct.W-ct.bw/2,gs[0].x));
    await w(30);
  }
  out.done=G().done;out.progress=G().progress;out.wrong=G().wrong;out.topic=G().ct.tp;
  out.ms=Math.round(performance.now()-t0);
  return out;
});
console.log(JSON.stringify(R));
await p.screenshot({path:'/home/user/tools/c1.png'});
// salah: biarkan tidak menggerakkan keranjang → game over atau habis?
const R2=await p.evaluate(async()=>{
  const M=__MQ,S=M.S(),out={},w=ms=>new Promise(r=>setTimeout(r,ms));
  document.querySelector('[data-act="menu"],[data-act="map"]')?.click();await w(300);
  document.querySelector('[data-tab="adv"]').click();await w(100);
  document.querySelector('[data-st="0-3"]').click();await w(100);
  document.querySelector('[data-sp="go"]').click();await w(500);
  const G=()=>M.G();const t0=performance.now();
  while(!G().done&&performance.now()-t0<40000){
    const ct=G().ct;
    // sengaja tangkap yang salah
    const bs=ct.items.filter(i=>!i.good&&!i.dead).sort((a,b)=>b.y-a.y);
    if(bs[0])ct.tx=Math.max(ct.bw/2,Math.min(ct.W-ct.bw/2,bs[0].x));
    await w(30);
  }
  out.done=G().done;out.hearts=G().hearts;out.wrong=G().wrong;
  return out;
});
console.log(JSON.stringify(R2));
console.log('errs',JSON.stringify(errs));
await b.close();
