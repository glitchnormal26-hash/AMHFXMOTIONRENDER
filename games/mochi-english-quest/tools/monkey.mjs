import {open,sleep,createChar} from './lib.mjs';
const seed=+process.argv[2]||1;let s=seed*9301+49297;const R=()=>{s=(s*9301+49297)%233280;return s/233280;};
const {b,p,errs}=await open(480,820);
await createChar(p,'p'+(1+seed%5),'Mon'+seed);
// tabs smoke
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[data-tab]')].map(b=>b.dataset.tab));
for(const t of tabs){await p.evaluate(t=>document.querySelector('[data-tab="'+t+'"]').click(),t);await sleep(250);}
// modes smoke
await p.evaluate(()=>document.querySelector('[data-tab="home"]')&&document.querySelector('[data-tab="home"]').click());
const modes=await p.evaluate(()=>[...document.querySelectorAll('[data-mode]')].map(b=>b.dataset.mode));
console.log('tabs',tabs.join(','),'modes',modes.join(','));
for(const m of modes){await p.evaluate(m=>{const b=document.querySelector('[data-mode="'+m+'"]');b&&b.click();},m);await sleep(300);
  for(let i=0;i<4;i++){await p.evaluate(()=>{const o=[...document.querySelectorAll('#game .opt, .opt, #gOpts button')].filter(x=>!x.disabled);if(o.length)o[Math.floor(Math.random()*o.length)].click();});await sleep(120);}
  await p.evaluate(()=>{const b=document.querySelector('[data-tab="home"]');b&&b.click();});await sleep(100);}
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1200);
const keys=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space','KeyE','Enter','Digit1','Digit2','Digit3','Digit4','Escape','KeyM','Equal','Minus'];
const t0=Date.now();let n=0;
while(Date.now()-t0<45000){
  const k=keys[Math.floor(R()*keys.length)];
  await p.keyboard.down(k);await sleep(60+R()*400);await p.keyboard.up(k);
  n++;
  if(n%15===0)await p.evaluate(()=>{const M=__MQ,O=M.OW();O.modal||(O.p.hp=Math.max(O.p.hp,3));
     const g=O.W.mons.filter(m=>!m.dead&&!m.boss)[0];if(Math.random()<.3&&g&&!O.modal){O.p.x=g.x;O.p.y=g.y+1.2;}
     const bt=[...document.querySelectorAll('#owModal button')];if(bt.length&&Math.random()<.5)bt[Math.floor(Math.random()*bt.length)].click();});
}
console.log('keys',n,'on',await p.evaluate(()=>__MQ.OW().on),'errs',errs.length,errs.slice(0,3));
await b.close();
