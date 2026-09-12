#!/usr/bin/env node
import puppeteer from 'puppeteer';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const index = path.resolve('delivery/chat-to-motion-camera-v2/index.html');
const url = pathToFileURL(index).href + '?clean=1';
const checkpoints = [1.5,2.7,3.35,3.9,4.5,5.15,6.3,6.9,8.6,9.15,9.8,10.8,12.1,13.1,14.8,17.4];
const collisionTimes = [6.9,8.6,9.15,14.8,15.6,17.4];

const browser = await puppeteer.launch({
  headless:'new',
  args:['--no-sandbox','--disable-setuid-sandbox','--allow-file-access-from-files','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
});
const page = await browser.newPage();
await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
await page.goto(url,{waitUntil:'networkidle0',timeout:120000});
await page.waitForFunction(()=>window.OPENER?.ready===true,{timeout:120000});

async function seek(t){
  await page.evaluate(async time=>{window.OPENER.seek(time);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},t);
}
async function cameraAt(t){await seek(t);return page.evaluate(()=>window.OPENER.cameraState());}

const camera=[];
for(const t of checkpoints) camera.push({t,...await cameraAt(t)});
const significant=[];
for(let i=1;i<camera.length;i++){
  const a=camera[i-1],b=camera[i];
  const d=Math.hypot(b.x-a.x,b.y-a.y),ds=Math.abs(b.s-a.s),dr=Math.abs((b.r||0)-(a.r||0));
  significant.push({from:a.t,to:b.t,screenTravel:+d.toFixed(1),zoomDelta:+ds.toFixed(3),rotationDelta:+dr.toFixed(3),active:d>70||ds>.07||dr>.25});
}
const activeCount=significant.filter(x=>x.active).length;

const rampTimes=[3.12,3.42,3.72,4.02,4.32,4.62];
const ramp=[];
for(const t of rampTimes) ramp.push({t,...await cameraAt(t)});
const rampVel=[];
for(let i=1;i<ramp.length;i++) rampVel.push(Math.hypot(ramp[i].x-ramp[i-1].x,ramp[i].y-ramp[i-1].y));
const rampRatio=Math.max(...rampVel)/Math.max(1,Math.min(...rampVel));

const collisions=[];
for(const t of collisionTimes){
  await seek(t);
  const hits=await page.evaluate(()=>{
    const visible=el=>{let o=1,n=el;while(n&&n.nodeType===1){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')return 0;o*=Number(s.opacity||1);n=n.parentElement;}return o;};
    const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height};};
    const area=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y));
    const out=[];
    for(const te of document.querySelectorAll('.safeText')){
      if(visible(te)<.12)continue;const tr=rect(te);if(tr.w<2||tr.h<2)continue;
      for(const oe of document.querySelectorAll('.collisionObject')){
        if(visible(oe)<.12)continue;const or=rect(oe);if(or.w<2||or.h<2)continue;const a=area(tr,or);if(a>80)out.push({text:te.id||te.className,object:oe.id||oe.className,area:a,textRect:tr,objectRect:or});
      }
    }
    return out;
  });
  if(hits.length)collisions.push({t,hits});
}

await seek(3.9);
const drag=await page.evaluate(()=>({skillOpacity:Number(getComputedStyle(document.querySelector('#skillCard')).opacity),cursorOpacity:Number(getComputedStyle(document.querySelector('#cursor')).opacity),camera:window.OPENER.cameraState()}));
await seek(10.8);
const follow=await page.evaluate(()=>({birdOpacity:Number(getComputedStyle(document.querySelector('#bird')).opacity),camera:window.OPENER.cameraState()}));

await browser.close();
const errors=[];
if(activeCount<9)errors.push(`insufficient camera activity: ${activeCount}/${significant.length}`);
if(rampRatio<1.35)errors.push(`speed ramp not visibly non-uniform: ratio=${rampRatio.toFixed(2)}`);
if(collisions.length)errors.push(`typography collisions at ${collisions.map(x=>x.t).join(', ')}`);
if(drag.skillOpacity<.8||drag.cursorOpacity<.8||drag.camera.mode!=='TRACKING')errors.push('drag follow state failed');
if(follow.birdOpacity<.8||follow.camera.mode!=='TRACKING')errors.push('bird camera follow state failed');
if(errors.length){console.error(JSON.stringify({status:'QA_FAILED',errors,activeCount,rampRatio,significant,rampVel,collisions,drag,follow},null,2));process.exit(2)}
console.log(JSON.stringify({status:'CAMERA_GATE_PASS',cameraActivity:'ACTIVE_DEFAULT',speedRamp:'ACTIVE',cameraFollow:'USED',typography:'CLEAR',activeCount,rampRatio:+rampRatio.toFixed(2),significant,rampVel:rampVel.map(v=>+v.toFixed(1)),drag,follow},null,2));
