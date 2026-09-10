#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

// Branch-specific deterministic render preset for the 30s vertical kinetic piece.
// The legacy output filename is kept because the existing GitHub Actions workflow
// uploads that exact path as an artifact.
const defaults = {
  INDEX: "index.html",
  OUT_VIDEO: "output/gift-box-greenscreen-4k.mp4",
  QUALITY: "final",
  FPS: "30",
  WIDTH: "1080",
  HEIGHT: "1920",
  CRF: "16",
  PRESET: "medium",
  REQUIRE_AUDIO: "1",
  REQUIRE_VO: "0",
  SFX: "audio/sfx-mix.wav",
};
for (const [key,value] of Object.entries(defaults)) if (!process.env[key]) process.env[key]=value;

function writeWav(file, left, right, sampleRate=48000){
  const n=Math.min(left.length,right.length);
  const dataBytes=n*4;
  const buf=Buffer.alloc(44+dataBytes);
  buf.write('RIFF',0);buf.writeUInt32LE(36+dataBytes,4);buf.write('WAVE',8);
  buf.write('fmt ',12);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);
  buf.writeUInt32LE(sampleRate,24);buf.writeUInt32LE(sampleRate*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);
  buf.write('data',36);buf.writeUInt32LE(dataBytes,40);
  let o=44;
  for(let i=0;i<n;i++){
    const l=Math.max(-1,Math.min(1,left[i]));
    const r=Math.max(-1,Math.min(1,right[i]));
    buf.writeInt16LE(Math.round(l*32767),o);o+=2;buf.writeInt16LE(Math.round(r*32767),o);o+=2;
  }
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,buf);
}

function buildSfx(file){
  const sr=48000,dur=30,n=sr*dur;
  const L=new Float32Array(n),R=new Float32Array(n);
  let seed=0x4d534658;
  const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296*2-1};
  for(let i=0;i<n;i++){
    const t=i/sr;
    // controlled machine-room ambience: low, non-musical and intentionally quiet.
    const breath=(Math.sin(2*Math.PI*47*t)+0.45*Math.sin(2*Math.PI*93*t))*0.0055;
    const noise=rnd()*0.0022;
    L[i]=breath+noise;R[i]=breath-noise*0.7;
  }
  const add=(time,duration,pan,fn)=>{
    const a=Math.max(0,Math.floor(time*sr)),b=Math.min(n,Math.ceil((time+duration)*sr));
    const lg=Math.sqrt((1-pan)*0.5),rg=Math.sqrt((1+pan)*0.5);
    for(let i=a;i<b;i++){
      const x=(i-a)/sr, v=fn(x,duration);
      L[i]+=v*lg;R[i]+=v*rg;
    }
  };
  const tick=(time,amp=.15,pan=0)=>add(time,.11,pan,(x,d)=>{
    const e=Math.exp(-x*34);return amp*e*(Math.sin(2*Math.PI*1850*x)+0.35*Math.sin(2*Math.PI*3200*x));
  });
  const impact=(time,amp=.22,f=95,pan=0)=>add(time,.55,pan,(x,d)=>{
    const body=Math.sin(2*Math.PI*(f*x+18*x*x))*Math.exp(-x*8.5);
    const snap=Math.sin(2*Math.PI*920*x)*Math.exp(-x*31);
    return amp*(body*.82+snap*.18);
  });
  const sweep=(time,duration=.5,amp=.11,f0=180,f1=2400,pan=0)=>add(time,duration,pan,(x,d)=>{
    const k=(f1-f0)/d;const phase=2*Math.PI*(f0*x+.5*k*x*x);const w=Math.sin(Math.PI*Math.min(1,x/d));
    return amp*Math.sin(phase)*w*w;
  });
  const pulse=(time,amp=.11,pan=0)=>add(time,.28,pan,(x,d)=>{
    const e=Math.exp(-x*13);return amp*e*(Math.sin(2*Math.PI*420*x)+.38*Math.sin(2*Math.PI*840*x));
  });

  impact(.08,.27,82,0); sweep(.55,.28,.08,340,2600,-.4); tick(.78,.13,.45); impact(1.58,.18,120,.1);
  sweep(2.28,.42,.13,190,3200,.3); tick(3.12,.18,-.45); tick(3.48,.14,.3); tick(4.18,.16,.55); tick(4.72,.13,-.25); impact(5.72,.16,110,0);
  sweep(6.02,.55,.13,160,2500,-.3); pulse(6.9,.11,-.45); pulse(7.45,.12,.15); sweep(7.85,.32,.12,2300,240,-.2); pulse(8.55,.11,.4);
  impact(9.55,.22,92,0); tick(10.3,.12,.15); sweep(12.18,.5,.09,1400,260,.2);
  pulse(13.0,.12,-.3); pulse(14.68,.13,.35); sweep(16.33,.42,.11,1800,260,-.4);
  tick(17.02,.15,-.45); tick(17.28,.13,0); tick(17.55,.13,.5); sweep(18.3,.62,.09,280,2100,.15); impact(20.86,.16,105,-.1);
  sweep(21.24,.68,.15,180,3100,.25); tick(22.3,.13,-.35); pulse(23.0,.11,.3); sweep(24.52,.45,.11,2200,220,-.25);
  impact(25.02,.18,90,0); tick(26.28,.16,.35); tick(26.55,.12,-.2); impact(27.78,.26,78,0); tick(28.02,.13,-.35); tick(28.16,.13,.35); pulse(28.56,.11,0);

  // short precision tail at the final lock, no loop or musical bed.
  add(28.58,1.15,0,(x,d)=>0.065*Math.sin(2*Math.PI*210*x)*Math.exp(-x*3.8));
  let peak=0;for(let i=0;i<n;i++)peak=Math.max(peak,Math.abs(L[i]),Math.abs(R[i]));
  const gain=peak>0.92?0.92/peak:1;for(let i=0;i<n;i++){L[i]*=gain;R[i]*=gain}
  writeWav(file,L,R,sr);
  console.log(`built deterministic SFX: ${file} (${dur}s, ${sr}Hz stereo)`);
}

buildSfx(path.resolve(process.env.SFX));

// GitHub-hosted Ubuntu runners disable the Chrome sandbox mechanism Puppeteer
// tries to use. Patch launch options only in CI.
if (process.env.CI) {
  const launch=puppeteer.launch.bind(puppeteer);
  puppeteer.launch=(options={})=>launch({...options,args:[...(options.args||[]),'--no-sandbox','--disable-setuid-sandbox']});
}

await import('./export-mp4.mjs');
