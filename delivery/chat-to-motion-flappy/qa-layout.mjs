#!/usr/bin/env node
import puppeteer from 'puppeteer';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const index = path.resolve('delivery/chat-to-motion-flappy/final.html');
const url = pathToFileURL(index).href + '?clean=1';
const checkpoints = [6.7, 7.8, 9.7, 10.6, 11.8, 13.8, 15.4, 16.5];
const textSelectors = ['#heroA .heroBig','#heroA .heroSub','#heroB .word','.finalKicker','.finalTitle','.finalFooter','.finalBadge'];
const objectSelectors = ['#engine','#miniGame','#asset','#cursor'];

const browser = await puppeteer.launch({
  headless:'new',
  args:[
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--allow-file-access-from-files',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist'
  ]
});
const page = await browser.newPage();
await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
await page.goto(url,{waitUntil:'networkidle0',timeout:120000});
await page.waitForFunction(()=>window.OPENER?.ready===true,{timeout:120000});

const violations=[];
for (const t of checkpoints){
  await page.evaluate(async time=>{window.OPENER.seek(time);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},t);
  const hits=await page.evaluate(({textSelectors,objectSelectors})=>{
    const doc = document.querySelector('#motion')?.contentDocument || document;
    const view = doc.defaultView || window;
    const opacity = el => {
      let o=1,n=el;
      while(n && n.nodeType===1){const s=view.getComputedStyle(n);o*=Number(s.opacity||1);if(s.display==='none'||s.visibility==='hidden') return 0;n=n.parentElement;}
      return o;
    };
    const rect = el => {const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    const intersect=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y));
    const out=[];
    for(const ts of textSelectors){for(const te of doc.querySelectorAll(ts)){if(opacity(te)<.12)continue;const tr=rect(te);if(tr.w<2||tr.h<2)continue;for(const os of objectSelectors){for(const oe of doc.querySelectorAll(os)){if(opacity(oe)<.12)continue;const or=rect(oe);if(or.w<2||or.h<2)continue;const area=intersect(tr,or);if(area>24)out.push({text:ts,object:os,area,te:tr,oe:or});}}}}
    return out;
  },{textSelectors,objectSelectors});
  if(hits.length) violations.push({t,hits});
}
await browser.close();
if(violations.length){console.error(JSON.stringify({status:'TYPOGRAPHY_COLLISION',violations},null,2));process.exit(2);}
console.log(JSON.stringify({status:'TYPOGRAPHY_CLEAR',checkpoints},null,2));