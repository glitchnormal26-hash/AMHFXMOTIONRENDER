import {open,sleep,createChar} from './lib.mjs';
const [,, name='a', mode='village', w='900', h='520']=process.argv;
const {b,p,errs}=await open(+w,+h);
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1200);
await p.evaluate((mode)=>{const M=__MQ,O=M.OW();O.on=false;O.tod=11;O.rainOn=false;O.rain=0;
 if(mode==='edge'){O.p.x=3;O.p.y=40;O.cam.x=3;O.cam.y=40;}
 if(mode==='mount'){const r=O.W.villages[1]||O.W.villages[0];O.p.x=r.x;O.p.y=r.y-14;O.cam.x=r.x;O.cam.y=r.y-14;}
 if(mode==='house'){const v=O.W.villages[0];O.p.x=v.x;O.p.y=v.y+4;O.cam.x=v.x;O.cam.y=v.y;}
 for(let i=0;i<5;i++){M.owUpdate(.03);}M.owRender();},mode);
await sleep(200);
await p.screenshot({path:'/home/user/tools/'+name+'.png'});
console.log(errs);await b.close();
