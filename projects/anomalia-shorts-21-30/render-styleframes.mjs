#!/usr/bin/env node
import fsp from 'node:fs/promises';
import path from 'node:path';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { stories } from './story-data.mjs';
import { createScene } from './scene.mjs';
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'output/anomalia-shorts-21-30/styleframes');for(const font of ['/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'])try{GlobalFonts.registerFromPath(font,'Arial');}catch{}
const cuts=[0,.115,.26,.415,.57,.725,.87,1];
for(const s of stories){const dir=path.join(out,String(s.id));await fsp.mkdir(dir,{recursive:true});const canvas=createCanvas(1080,1920),scene=await createScene(canvas,s.id);for(let i=0;i<7;i++){const u=(cuts[i]+cuts[i+1])/2;scene.draw(u*scene.duration);await fsp.writeFile(path.join(dir,`${i+1}.jpg`),canvas.toBuffer('image/jpeg',91));}console.log(`STYLEFRAMES ${s.id} 7/7`);}
