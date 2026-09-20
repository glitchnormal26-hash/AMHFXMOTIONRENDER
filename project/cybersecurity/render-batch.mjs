import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const names=['circuit-shield','biometric-scan','encrypted-vault','packet-firewall','cloud-lock','cryptographic-processor','zero-trust-network','secure-document','threat-scanner','hardware-key'];
const output=path.resolve('output/cybersecurity');fs.mkdirSync(output,{recursive:true});
const ids=process.argv.slice(2).map(Number);const queue=ids.length?ids:names.map((_,i)=>i+1);
async function worker(){while(queue.length){const id=queue.shift();const stem=String(id).padStart(2,'0')+'-'+names[id-1];
 const log=fs.openSync(path.join(output,stem+'.render.log'),'w');
 const env={...process.env,TMPDIR:path.resolve('tmp'),URL:pathToFileURL(path.resolve('project/cybersecurity/scene.html')).href+'?clip='+id,OUT_VIDEO:path.join(output,stem+'.mp4'),WIDTH:'3840',HEIGHT:'2160',FPS:'30',QUALITY:'fast',PRESET:'medium',VIDEO_BITRATE:'16M',VIDEO_MAXRATE:'20M',VIDEO_BUFSIZE:'32M',ENCODE_THREADS:'2'};
 console.log('START',id,new Date().toISOString());
 const code=await new Promise(resolve=>{const p=spawn(process.execPath,['--import','./project/cybersecurity/browser-setup.mjs','scripts/export-mp4.mjs'],{env,stdio:['ignore',log,log]});p.on('exit',resolve);});fs.closeSync(log);
 if(code!==0)throw Error('Render failed: '+stem+' code '+code);
 console.log('DONE',id,new Date().toISOString());
}}
await Promise.all([worker(),worker(),worker()]);
