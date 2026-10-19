#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { once } from 'node:events';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { createScene } from './scene.mjs';

const require=createRequire(import.meta.url);
const ffmpeg=require('@ffmpeg-installer/ffmpeg').path;
const ffprobe=require('@ffprobe-installer/ffprobe').path;
const id=Math.max(21,Math.min(30,Number(process.env.STORY_ID||21)));
const fps=Number(process.env.FPS||24),width=1080,height=1920,quality=Number(process.env.CAPTURE_QUALITY||94);
const audio=path.resolve(process.env.VOICEOVER||'');
const output=path.resolve(process.env.OUT_VIDEO||`output/anomalia-shorts-21-30/videos/${String(id).padStart(2,'0')}.mp4`);
if(!fs.existsSync(audio))throw new Error(`Missing VOICEOVER: ${audio}`);
await fsp.mkdir(path.dirname(output),{recursive:true});
for(const font of ['/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'])if(fs.existsSync(font))GlobalFonts.registerFromPath(font,'Arial');
const canvas=createCanvas(width,height),scene=await createScene(canvas,id),duration=scene.duration,frameCount=Math.ceil(duration*fps);
const args=['-y','-f','image2pipe','-framerate',String(fps),'-vcodec','mjpeg','-i','pipe:0','-i',audio,'-filter_complex','[1:a]volume=1,apad[vo];[vo]amix=inputs=1:duration=longest:dropout_transition=0,alimiter=limit=0.95[aout]','-map','0:v:0','-map','[aout]','-c:v','libx264','-preset',process.env.PRESET||'veryfast','-crf',process.env.CRF||'18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t',String(duration),'-movflags','+faststart',output];
const child=spawn(ffmpeg,args,{stdio:['pipe','ignore','pipe']});let stderr='';child.stderr.on('data',c=>{stderr=(stderr+String(c)).slice(-24000);});const exitPromise=once(child,'exit');
async function write(chunk){if(!child.stdin.write(chunk))await once(child.stdin,'drain');}
console.log(`ANOMALIA_RENDER story=${id} frames=${frameCount} duration=${duration.toFixed(3)}s`);const started=Date.now();
for(let f=0;f<frameCount;f++){scene.draw(f/fps);await write(canvas.toBuffer('image/jpeg',quality));if(f%fps===0)process.stdout.write(`\r${String(id).padStart(2,'0')} ${f}/${frameCount}`);}
child.stdin.end();const [code,signal]=await exitPromise;process.stdout.write('\n');if(code!==0)throw new Error(`FFmpeg failed code=${code} signal=${signal||'none'}\n${stderr}`);
const probe=spawnSync(ffprobe,['-v','error','-show_entries','format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate','-of','json',output],{encoding:'utf8'});if(probe.status!==0)throw new Error(`ffprobe failed: ${probe.stderr}`);const meta=JSON.parse(probe.stdout),video=meta.streams?.find(s=>s.codec_type==='video'),audioStream=meta.streams?.find(s=>s.codec_type==='audio');if(!video||!audioStream||video.width!==width||video.height!==height)throw new Error('Encoded stream verification failed');
const report={status:'TECHNICAL_VERIFIED',technical_status:'TECHNICAL_VERIFIED',version:'ANOMALIA_FILES_021_030',renderer:'generative raster + scripted @napi-rs/canvas image2pipe',story_id:id,output,requested:{width,height,fps},duration:Number(meta.format?.duration||0),video,audio:audioStream,voiceover:audio,render_seconds:Number(((Date.now()-started)/1000).toFixed(3))};await fsp.writeFile(output.replace(/\.mp4$/i,'.verify.json'),JSON.stringify(report,null,2));console.log(`TECHNICAL_VERIFIED ${path.basename(output)} in ${report.render_seconds}s`);
