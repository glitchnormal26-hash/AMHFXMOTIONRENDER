import {launch} from './launch.mjs';
export const URL='file:///home/user/AMHFXMOTIONRENDER/games/mochi-english-quest/index.html';
export async function open(w=420,h=900,opts={}){
  const b=await launch(w,h,opts.vp||{});const p=await b.newPage();
  if(opts.touch){await p.emulate({viewport:{width:w,height:h,isMobile:true,hasTouch:true,deviceScaleFactor:opts.dsf||2},userAgent:'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'});}
  const errs=[];
  p.on('pageerror',e=>{errs.push('PAGEERR '+e.message);console.log('PAGEERR',e.message,(e.stack||'').split('\n').slice(0,3).join(' | '));});
  p.on('console',m=>{if(m.type()==='error'&&!/ERR_|Failed to load/.test(m.text())){errs.push(m.text());console.log('CONSOLE',m.text());}});
  await p.goto(opts.url||URL);
  await new Promise(r=>setTimeout(r,500));
  return {b,p,errs};
}
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export async function createChar(p,preset='p1',name=''){
  await p.evaluate((preset,name)=>{
    if(name){const i=document.getElementById('cName');i.value=name;i.dispatchEvent(new Event('input',{bubbles:true}));}
    const b=document.querySelector('[data-preset="'+preset+'"]');if(b)b.click();
    document.getElementById('cStart').click();
  },preset,name);
  await sleep(500);
}
