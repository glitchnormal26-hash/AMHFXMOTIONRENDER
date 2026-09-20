import './browser-setup.mjs';
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const out=path.resolve('output/cybersecurity/qa');await fs.mkdir(out,{recursive:true});
const browser=await puppeteer.launch();const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
for(let id=1;id<=10;id++){
 await page.goto(pathToFileURL(path.resolve('project/cybersecurity/scene.html')).href+'?clip='+id);
 await page.waitForFunction(()=>window.OPENER?.ready);
 for(const t of [0,2.5,5,7.5,9.967]){await page.evaluate(t=>window.OPENER.seek(t),t);await page.screenshot({path:`${out}/${String(id).padStart(2,'0')}-${t}.png`});}
 const loop=await page.evaluate(()=>{OPENER.seek(0);const a=document.querySelector('#stage').innerHTML;OPENER.seek(10);const b=document.querySelector('#stage').innerHTML;return {elements:document.querySelectorAll('svg *').length,clip:CLIP};});
 console.log(JSON.stringify(loop));
}
await browser.close();if(errors.length)throw Error(errors.join('\n'));
