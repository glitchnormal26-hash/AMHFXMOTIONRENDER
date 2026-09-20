import {spawn} from 'node:child_process';
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const names=['instant-support','sales-qualification','internal-knowledge','unified-channels','human-handoff','chatbot-analytics','team-access','multilingual-support','automated-resolution','conversation-recap'];
const root=process.cwd();
const queue=names.map((name,i)=>({id:i+1,name:`${String(i+1).padStart(2,'0')}-${name}`}));
async function worker(){while(queue.length){const {id,name}=queue.shift();const file=`output/chatbot/${name}.mp4`;const log=fs.openSync(`output/chatbot/${name}.log`,'w');console.log('RENDER_START',name);await new Promise((res,rej)=>{const child=spawn(process.execPath,['projects/ai-chatbot-promo/host-render.mjs'],{env:{...process.env,TMPDIR:path.join(root,'.tmp'),URL:pathToFileURL(path.join(root,'projects/ai-chatbot-promo/scene.html')).href+`?concept=${id}`,OUT_VIDEO:file,WIDTH:'3840',HEIGHT:'2160',FPS:'30',QUALITY:'final',CRF:'18',PRESET:'medium',VIDEO_BITRATE:'12M',VIDEO_MAXRATE:'18M',VIDEO_BUFSIZE:'24M',ENCODE_THREADS:'2'},stdio:['ignore',log,log]});child.on('exit',code=>code===0?res():rej(new Error(`${name}: exit ${code}`)));});fs.closeSync(log);console.log('RENDER_DONE',name);}}
await Promise.all([worker(),worker()]);
