import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs/promises';
import path from 'node:path';
const executablePath=await chromium.executablePath();
console.log('Browser:',executablePath);
const b=await puppeteer.launch({executablePath,args:chromium.args,headless:true});
const page=await b.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
page.on('pageerror',e=>console.error('PAGE ERROR',e));
await fs.mkdir('output/chatbot/qa',{recursive:true});
for(let id=1;id<=10;id++){
 await page.goto(`file:///workspace/scratch/742d29401e46/amhfxmotionrender/projects/ai-chatbot-promo/scene.html?concept=${id}`,{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>window.OPENER?.ready);
 for(const t of [0.5,3.2,5.5,8,11.5]){
  await page.evaluate(t=>window.OPENER.seek(t),t);
  await page.screenshot({path:`output/chatbot/qa/${id}-${t}.png`});
 }
 console.log('snapshots',id);
}
await b.close();
