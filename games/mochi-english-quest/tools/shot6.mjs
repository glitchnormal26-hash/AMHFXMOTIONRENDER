import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open(420,900,{touch:true,dsf:1});
await createChar(p,'p2','Dina');
await p.evaluate(async()=>{const M=__MQ,S=M.S(),w=ms=>new Promise(r=>setTimeout(r,ms));S.coins=99999;S.points=99999;
 document.querySelector('[data-tab="cast"]').click();await w(100);
 const buy=async(c,id)=>{document.querySelector('[data-wcat="'+c+'"]').click();await w(40);const e=document.querySelector('.wit[data-fit="'+id+'"]');e.click();await w(40);};
 await buy('costume','cos_emperor');await buy('wing','wg_gangel');await buy('aura','au_galaxy');await buy('acc','acc_royal');
 await buy('wall','rw_galaxy');await buy('floor','rf_marble');
 for(const id of ['fu_n_bed3','fu_n_sofa3','fu_n_lamp3','fu_n_rug3','fu_n_piano2','fu_n_plt2']){await buy('furn',id);}
 document.querySelector('[data-wcat="costume"]').click();await w(40);document.querySelector('[data-wr="5"]').click();await w(100);
});
await sleep(300);
await (await p.$('#wardrobe')).screenshot({path:'/home/user/tools/w1.png'});
await p.evaluate(async()=>{const S=__MQ.S();S.room={bed:'fu_n_bed3',sofa:'fu_n_sofa3',lamp:'fu_n_lamp3',rug:'fu_n_rug3',special:'fu_n_piano2',plant:'fu_n_plt2'};document.querySelector('[data-tab="room"]').click();await new Promise(r=>setTimeout(r,200));document.querySelector('[data-wgo]');});
await p.evaluate(()=>{const e=document.querySelector('#roomBag [data-fit]');if(e){e.click();e.click();}});
await sleep(300);
await (await p.$('#room')).screenshot({path:'/home/user/tools/w2.png'});
await b.close();
