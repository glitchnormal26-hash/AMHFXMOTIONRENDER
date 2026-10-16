import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open(420,900);
await createChar(p,'p4','Rina');
const R=await p.evaluate(async()=>{
  const M=__MQ,S=M.S(),out={},w=ms=>new Promise(r=>setTimeout(r,ms));
  S.coins=100000;S.points=0;
  document.querySelector('[data-tab="cast"]').click();await w(200);
  const cats=[...document.querySelectorAll('[data-wcat]')].map(b=>b.dataset.wcat);out.cats=cats.join(',');
  out.chips=[...document.querySelectorAll('.wchip[data-wcat]')].map(b=>b.textContent.trim()).join(' | ');
  // gate: level 1 -> r4 locked
  document.querySelector('[data-wcat="costume"]').click();await w(100);
  const locked=document.querySelectorAll('.wit.gate').length;out.gateLockedLv1=locked;
  const g=document.querySelector('.wit.gate');g.click();await w(100);out.stillLocked=!!document.querySelector('.wit.gate [class]')&&document.querySelectorAll('.wit.gate').length===locked;
  // semua kategori: filter rarity + render
  const per={};
  for(const c of cats){
    document.querySelector('[data-wcat="'+c+'"]').click();await w(60);
    per[c]=document.querySelectorAll('.wit').length;
    for(let r=1;r<=5;r++){document.querySelector('[data-wr="'+r+'"]').click();await w(30);}
    document.querySelector('[data-wr="0"]').click();await w(30);
    const bad=[...document.querySelectorAll('.wit .wprev')].filter(e=>e.innerHTML.length<30).length;
    if(bad)out['emptyprev_'+c]=bad;
  }
  out.per=per;
  // level tinggi, beli & pakai semua
  S.points=100000;
  let n=0;
  for(const c of cats){
    document.querySelector('[data-wcat="'+c+'"]').click();await w(60);
    const ids=[...document.querySelectorAll('.wit')].map(e=>e.dataset.fit);
    for(const id of ids){
      const el=document.querySelector('.wit[data-fit="'+id+'"]');if(!el)continue;
      el.click();await w(15);n++;
      const el2=document.querySelector('.wit[data-fit="'+id+'"]');if(el2)el2.click();await w(15); // pakai (toggle)
    }
  }
  out.clicks=n;out.own=Object.keys(S.own).length;
  // pakai aura+dinding+lantai lalu cek
  document.querySelector('[data-wcat="aura"]').click();await w(50);
  document.querySelector('.wit[data-fit="au_galaxy"]').click();await w(100);
  out.aura=S.look.aura;out.auraSvg=document.querySelector('#mochi svg .aura')?1:0;
  document.querySelector('[data-wcat="wall"]').click();await w(50);
  document.querySelector('.wit[data-fit="rw_palace"]').click();await w(100);
  document.querySelector('[data-wcat="floor"]').click();await w(50);
  document.querySelector('.wit[data-fit="rf_stars"]').click();await w(100);
  document.querySelector('[data-tab="room"]').click();await w(200);
  out.wallBg=document.querySelector('.rwall').style.background.slice(0,40);out.floorBg=!!document.querySelector('.rfloor').style.background;
  out.wgoBtn=!!document.querySelector('[data-wgo]');
  document.querySelector('[data-wgo]').click();await w(200);out.wgoWent=document.querySelector('.wchip[data-wcat="wall"]').getAttribute('aria-pressed');
  // reward roll distribution
  return out;
});
console.log(JSON.stringify(R,null,1));
console.log('errs',JSON.stringify(errs));
await b.close();
