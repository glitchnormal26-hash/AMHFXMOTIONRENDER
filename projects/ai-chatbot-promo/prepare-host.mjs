// Extract serverless Chromium without archive ownership changes (restricted hosts).
import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import {spawnSync} from 'node:child_process';
const temp=path.resolve('.tmp');fs.mkdirSync(temp,{recursive:true});
const bin=path.resolve('node_modules/@sparticuz/chromium/bin');
for(const name of ['chromium','fonts.tar','swiftshader.tar'])fs.writeFileSync(path.join(temp,name),zlib.brotliDecompressSync(fs.readFileSync(path.join(bin,name+'.br'))));
fs.chmodSync(path.join(temp,'chromium'),0o755);
const r=spawnSync('python',['-c',`import tarfile,os\nfor name in ['fonts','swiftshader']:\n with tarfile.open(os.path.join(${JSON.stringify(temp)},name+'.tar')) as f:f.extractall(os.path.join(${JSON.stringify(temp)},'fonts' if name=='fonts' else ''),filter='data')`],{stdio:'inherit'});
if(r.status!==0)throw new Error('Chromium asset extraction failed');
console.log('Host browser prepared. Use TMPDIR="'+temp+'" for render commands.');
