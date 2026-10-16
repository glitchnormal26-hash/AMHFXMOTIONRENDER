import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open(844,390,{touch:true,dsf:2});
await createChar(p,'p4','Rina');
const cdp=await p.target().createCDPSession();
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1500);
// touch: tap to move
const before=await p.evaluate(()=>[__MQ.OW().p.x,__MQ.OW().p.y]);
await p.touchscreen.tap(560,200);await sleep(1800);
const after=await p.evaluate(()=>[__MQ.OW().p.x,__MQ.OW().p.y]);
// joystick drag
const st=await p.$('#owStick');const bb=await st.boundingBox();
await p.touchscreen.touchStart(bb.x+bb.width/2,bb.y+bb.height/2);
await p.touchscreen.touchMove(bb.x+bb.width/2+30,bb.y+bb.height/2-5);
await sleep(1500);const mid=await p.evaluate(()=>[__MQ.OW().p.x,__MQ.OW().p.y]);
await p.touchscreen.touchEnd();
// frame timing under 4x throttle
const m=await p.evaluate(()=>new Promise(res=>{const a=[];let l=performance.now(),n=0;function f(t){a.push(t-l);l=t;if(++n<150)requestAnimationFrame(f);else{a.sort((x,y)=>x-y);res({med:a[75],p95:a[142],q:__MQ.OW().q,dpr:__MQ.OW().dpr})}}requestAnimationFrame(f);}));
await sleep(4000);
const m2=await p.evaluate(()=>new Promise(res=>{const a=[];let l=performance.now(),n=0;function f(t){a.push(t-l);l=t;if(++n<100)requestAnimationFrame(f);else{a.sort((x,y)=>x-y);res({med:a[50],p95:a[95],q:__MQ.OW().q,dpr:__MQ.OW().dpr})}}requestAnimationFrame(f);}));
const ui=await p.evaluate(()=>{const r=id=>{const b=document.getElementById(id).getBoundingClientRect();return [Math.round(b.width),Math.round(b.height)]};return {zi:r('owZi'),act:r('owAct'),menu:r('owMenuBtn'),hop:r('owHop'),spk:r('owQSpk')}});
console.log(JSON.stringify({before,after,mid,m,m2,ui}));await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
// open battle on touch
await p.evaluate(()=>{const M=__MQ,O=M.OW();M.owBattle(O.W.mons.find(m=>!m.boss));});
await sleep(300);

const fit=await p.evaluate(()=>{const c=document.querySelector('.owq').getBoundingClientRect(),m=document.getElementById('owModal');return {top:c.top,bottom:c.bottom,vh:innerHeight,scroll:m.scrollHeight>m.clientHeight,ch:m.clientHeight,sh:m.scrollHeight}});
console.log(JSON.stringify({before,after,mid,m,m2,ui,fit}),errs);
await b.close();
