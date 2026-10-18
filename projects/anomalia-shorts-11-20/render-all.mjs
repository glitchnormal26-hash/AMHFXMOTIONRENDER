#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { stories } from './story-data.mjs';

const root=path.resolve(import.meta.dirname,'../..'),outDir=path.join(root,'output/anomalia-shorts-11-20/videos'),audioDir=path.join(root,'output/anomalia-shorts-11-20/audio'),logsDir=path.join(root,'output/anomalia-shorts-11-20/logs');
const start=Math.max(11,Number(process.env.START_ID||11)),end=Math.min(20,Number(process.env.END_ID||20)),concurrency=Math.max(1,Number(process.env.RENDER_CONCURRENCY||2)),force=process.env.FORCE==='1',fps=Number(process.env.FPS||24);
await fsp.mkdir(outDir,{recursive:true});await fsp.mkdir(logsDir,{recursive:true});
const queue=stories.filter(s=>s.id>=start&&s.id<=end).filter(s=>force||!fs.existsSync(path.join(outDir,`${String(s.id).padStart(2,'0')}-${s.slug}.mp4`)));
console.log(`ANOMALIA FILE 011-020: ${queue.length} video(s), 7 story scenes, 1080x1920, ${fps}fps`);
async function render(s){const n=String(s.id).padStart(2,'0'),audio=path.join(audioDir,`${n}-${s.slug}.mp3`),output=path.join(outDir,`${n}-${s.slug}.mp4`),logPath=path.join(logsDir,`${n}-${s.slug}.log`);if(!fs.existsSync(audio))throw new Error(`Missing audio ${audio}`);console.log(`[${n}] START ${s.slug}`);const log=fs.createWriteStream(logPath,{flags:'w'}),child=spawn(process.execPath,[path.join(import.meta.dirname,'render-node.mjs')],{cwd:root,env:{...process.env,STORY_ID:String(s.id),VOICEOVER:audio,OUT_VIDEO:output,FPS:String(fps)},stdio:['ignore','pipe','pipe']});let tail='';child.stdout.on('data',c=>{log.write(c);tail=(tail+String(c)).slice(-8000);});child.stderr.on('data',c=>log.write(c));const[code,signal]=await once(child,'exit');log.end();if(code!==0)throw new Error(`[${n}] failed code=${code} signal=${signal||'none'}; see ${logPath}`);const found=tail.split(/\r?\n|\r/).find(x=>x.includes('TECHNICAL_VERIFIED'));if(found)console.log(`[${n}] ${found}`);console.log(`[${n}] DONE ${((await fsp.stat(output)).size/1048576).toFixed(1)} MB`);return output;}
const running=new Set(),done=[];for(const story of queue){const task=render(story).then(f=>done.push(f));running.add(task);task.then(()=>running.delete(task),()=>running.delete(task));if(running.size>=concurrency)await Promise.race(running);}await Promise.all(running);console.log(`BATCH_COMPLETE ${done.length}/${queue.length}`);
