import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open();
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1500);
console.log(await p.evaluate(()=>({on:__MQ.OW().on,p:[__MQ.OW().p.x,__MQ.OW().p.y]})),errs);
await b.close();
