import fs from 'node:fs';
import path from 'node:path';
import { loadImage } from '@napi-rs/canvas';
import { storyById } from './story-data.mjs';

const W = 1080;
const H = 1920;
const SHOTS = [0, .11, .27, .43, .61, .81, 1];

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, v) => clamp((v - a) / (b - a));
const ease = t => { t = clamp(t); return t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; };
const out = t => 1 - Math.pow(1-clamp(t), 4);
const rgba = (hex, a) => {
  const c = hex.replace('#','');
  const n = parseInt(c.length === 3 ? c.split('').map(x=>x+x).join('') : c, 16);
  return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;
};
function hash(n, seed=1){ const x=Math.sin(n*127.1+seed*311.7)*43758.5453; return x-Math.floor(x); }
function jitter(t,n,a=1){ return (Math.sin(t*31.1+n*7.7)*.57+Math.sin(t*67.4+n*2.1)*.43)*a; }
function rounded(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
function txt(ctx,s,x,y,size,color='#fff',align='left',weight=800,alpha=1,font='Arial'){
  ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.font=`${weight} ${size}px ${font}, sans-serif`;ctx.fillText(s,x,y);ctx.restore();
}
function fit(ctx,s,max,start,weight=900){let z=start;while(z>24){ctx.font=`${weight} ${z}px Arial, sans-serif`;if(ctx.measureText(s).width<=max)return z;z-=2;}return z;}
function wrap(ctx,s,max,size,weight=900){ctx.font=`${weight} ${size}px Arial, sans-serif`;const lines=[];let line='';for(const word of s.split(/\s+/)){const next=line?`${line} ${word}`:word;if(line&&ctx.measureText(next).width>max){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
function line(ctx,pts,color,width=3,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();ctx.restore();}
function blob(ctx,cx,cy,rx,ry,seed,fill,stroke=null,width=2){
  ctx.beginPath();for(let i=0;i<44;i++){const a=i/44*Math.PI*2,n=1+(hash(i+seed,seed)-.5)*.1;const x=cx+Math.cos(a)*rx*n,y=cy+Math.sin(a)*ry*n;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
}
function person(ctx,x,y,s,color,alpha=1,tall=false){
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-18,4);ctx.bezierCurveTo(-24,-16,-21,-45,-8,-57);ctx.bezierCurveTo(-3,-63,8,-64,14,-55);ctx.bezierCurveTo(25,-38,20,-13,16,4);ctx.bezierCurveTo(30,18,31,48,25,78);ctx.lineTo(17,tall?182:135);ctx.bezierCurveTo(9,144,2,143,-3,tall?179:135);ctx.lineTo(-10,74);ctx.lineTo(-19,tall?178:136);ctx.bezierCurveTo(-30,146,-34,139,-30,126);ctx.lineTo(-27,72);ctx.bezierCurveTo(-39,42,-36,17,-18,4);ctx.closePath();ctx.fill();ctx.restore();
}
function shotState(u){
  let index=SHOTS.length-2;for(let i=0;i<SHOTS.length-1;i++){if(u>=SHOTS[i]&&u<SHOTS[i+1]){index=i;break;}}
  return {index, local:inv(SHOTS[index],SHOTS[index+1],u)};
}
function captionWeight(s){let w=Math.max(8,s.replace(/[^a-zA-Z0-9]/g,'').length);if(/[.!?…:]$/.test(s))w+=8;if(/[A-Z0-9]{3,}/.test(s))w+=3;return w;}
function captionAt(story,t){
  const tt=clamp((t-.1)/(story.audioDuration-.25));const weights=story.captions.map(captionWeight),total=weights.reduce((a,b)=>a+b,0);let c=0;
  for(let i=0;i<weights.length;i++){const n=c+weights[i]/total;if(tt<=n||i===weights.length-1)return {line:story.captions[i],local:clamp((tt-c)/(n-c)),index:i};c=n;}
}

async function loadAssets(story){
  const dir=path.join(import.meta.dirname,'assets',String(story.id).padStart(2,'0'));
  const establish=await loadImage(path.join(dir,'establish.jpg'));
  const evidencePath=path.join(dir,'evidence.jpg');
  const evidence=fs.existsSync(evidencePath)?await loadImage(evidencePath):establish;
  return {establish,evidence,hasEvidence:evidence!==establish};
}

function drawRaster(ctx,img,focus,local,story,shot){
  const [fx,fy,baseZoom]=focus;
  const base=Math.max(W/img.width,H/img.height);
  const z=baseZoom*(1+local*(shot%2?.045:.075));
  const swayX=jitter(local*2.5,story.id+shot,shot===0?2.5:6);
  const swayY=jitter(local*2.2,story.id+shot+9,shot===0?2:4);
  const w=img.width*base*z,h=img.height*base*z;
  const cx=W/2+(0.5-fx)*W*(z-.72)+swayX;
  const cy=H/2+(0.5-fy)*H*(z-.72)+swayY;
  ctx.drawImage(img,cx-w/2,cy-h/2,w,h);
  const grade=ctx.createLinearGradient(0,0,W,H);
  grade.addColorStop(0,rgba(story.accent,shot===4?.16:.055));grade.addColorStop(.55,'rgba(2,4,8,.03)');grade.addColorStop(1,'rgba(0,0,0,.38)');ctx.fillStyle=grade;ctx.fillRect(0,0,W,H);
  if(shot===2){ctx.fillStyle='rgba(0,15,18,.12)';ctx.fillRect(0,0,W,H);}
  if(shot===3){ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(12,3,13,.32)';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';}
  if(shot===5){ctx.fillStyle='rgba(2,3,5,.24)';ctx.fillRect(0,0,W,H);}
}

function drawTransition(ctx,u,story){
  for(let i=1;i<SHOTS.length-1;i++){
    const d=Math.abs(u-SHOTS[i]);
    if(d<.012){
      const p=1-d/.012;
      if(i===1){ctx.fillStyle=`rgba(0,0,0,${p*.8})`;ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W*(1-p*.85),0);ctx.lineTo(W,0);ctx.lineTo(W,H);ctx.fill();}
      else if(i===2||i===4){ctx.fillStyle=rgba(i===2?'#ffffff':story.accent,p*(i===2?.4:.28));ctx.fillRect(0,0,W,H);}
      else {for(let s=0;s<9;s++){const y=hash(s,story.id)*H;ctx.fillStyle=rgba(story.accent,p*.2);ctx.fillRect(jitter(u*50,s,60),y,W,4+hash(s+4)*32);}}
    }
  }
}

function drawWave(ctx,x,y,w,h,t,color,progress=1){ctx.save();ctx.beginPath();ctx.rect(x,y,w*clamp(progress),h);ctx.clip();ctx.strokeStyle=color;ctx.lineWidth=6;ctx.beginPath();for(let i=0;i<=80;i++){const p=i/80,xx=x+p*w,amp=(.15+hash(i,5)*.85)*h*.45,yy=y+h/2+Math.sin(i*1.33+t*5)*amp*Math.sin(Math.PI*p);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();ctx.restore();}
function detectionBox(ctx,x,y,w,h,color,label,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=6;const l=35;line(ctx,[[x+l,y],[x,y],[x,y+l]],color,6,alpha);line(ctx,[[x+w-l,y],[x+w,y],[x+w,y+l]],color,6,alpha);line(ctx,[[x,y+h-l],[x,y+h],[x+l,y+h]],color,6,alpha);line(ctx,[[x+w-l,y+h],[x+w,y+h],[x+w,y+h-l]],color,6,alpha);txt(ctx,label,x,y-15,22,color,'left',900,alpha,'monospace');ctx.restore();}

function overlay03(ctx,shot,t,u,l,s){
  if(shot===1){txt(ctx,'11:00 PM',82,360,46,s.accent,'left',900,.9,'monospace');}
  if(shot===2||shot===3){rounded(ctx,110,550,860,330,42);ctx.fillStyle='rgba(3,10,12,.82)';ctx.fill();ctx.strokeStyle=rgba(s.accent,.65);ctx.lineWidth=4;ctx.stroke();blob(ctx,220,715,58,55,3,s.accent);ctx.fillStyle='#061012';ctx.beginPath();ctx.moveTo(205,681);ctx.lineTo(205,749);ctx.lineTo(254,715);ctx.fill();drawWave(ctx,315,640,560,130,t,s.accent,shot===2?l:1);txt(ctx,shot===2?'0:31':'REKAMAN OTOMATIS',850,835,29,'#dceae6','right',800,1,'monospace');}
  if(shot>=3){const a=out(l);rounded(ctx,145,980,790,190,30);ctx.fillStyle='rgba(24,2,8,.88)';ctx.fill();ctx.strokeStyle='#ff4057';ctx.lineWidth=4;ctx.stroke();txt(ctx,'MENGIRIM KE KEMARIN',540,1098,43,'#ff7182','center',900,a);}
  if(shot===4){ctx.strokeStyle=rgba(s.accent,.72);ctx.lineWidth=10;ctx.setLineDash([18,24]);ctx.beginPath();ctx.arc(540,850,260,-.4,Math.PI*1.75);ctx.stroke();ctx.setLineDash([]);txt(ctx,'11:00',540,900,140,s.accent,'center',900,1,'monospace');txt(ctx,'BESOK  →  SEKARANG  →  KEMARIN',540,1005,27,'#fff','center',800);}
}
function overlay04(ctx,shot,t,u,l,s){
  if(shot===1||shot===2){rounded(ctx,80,1110,920,160,24);ctx.fillStyle='rgba(4,5,7,.82)';ctx.fill();drawWave(ctx,125,1150,830,85,t,s.accent,1);txt(ctx,'88.7 — FREKUENSI TIDAK TERDAFTAR',540,1320,27,s.accent,'center',900);}
  if(shot===3){const names=['SARI','RUDI','MAYA','…','PEMILIK RADIO'];names.forEach((n,i)=>txt(ctx,n,540,520+i*125,48,i===4?s.accent:'#e9e3d8','center',900,clamp(l*2-i*.15)));}
  if(shot===4){
    ctx.fillStyle=`rgba(0,0,0,${.18+out(l)*.28})`;ctx.fillRect(0,0,W,H);
    for(let i=0;i<7;i++){const x=120+i*135,y=560+(i%3)*95,on=l<i*.095;ctx.save();ctx.globalAlpha=on?.85:.08;ctx.shadowColor='#ffc45f';ctx.shadowBlur=on?32:0;rounded(ctx,x,y,38,58,5);ctx.fillStyle=on?'#ffc45f':'#09090b';ctx.fill();ctx.restore();}
    txt(ctx,'SEMUA LAMPU PADAM',540,1080,54,s.accent,'center',900);
  }
}
function overlay05(ctx,shot,t,u,l,s){
  if(shot===1){txt(ctx,'MOTION TEST  /  Δt +2.00s',74,360,31,s.accent,'left',900,1,'monospace');}
  if(shot===2||shot===3){const d=shot===3?out(l):.35;person(ctx,450,870,2.25,'rgba(232,224,229,.68)',1);person(ctx,lerp(575,820,d),lerp(870,690,d),lerp(2.55,3.25,d),'rgba(2,1,5,.92)',1,true);line(ctx,[[480,760],[760,570]],s.accent,8,.8);txt(ctx,'-2.00s',780,535,44,s.accent,'center',900,1,'monospace');}
  if(shot===4){ctx.fillStyle='rgba(4,1,8,.6)';ctx.fillRect(0,0,W,H);person(ctx,540,1010,6.4,'#020105',1,true);txt(ctx,'SUBJEK: TIDAK DITEMUKAN',540,1250,37,s.accent,'center',900);}
}
function overlay06(ctx,shot,t,u,l,s){
  if(shot===1){txt(ctx,'403',260,670,86,'#d9c9ab','center',900);txt(ctx,'405',820,670,86,'#d9c9ab','center',900);txt(ctx,'404',540,815,105,s.accent,'center',900,Math.sin(t*8)>.15?1:.15);}
  if(shot===2||shot===3){rounded(ctx,105,500,870,620,34);ctx.fillStyle='rgba(3,7,8,.84)';ctx.fill();ctx.strokeStyle='#676b70';ctx.lineWidth=15;ctx.stroke();txt(ctx,'LIVE  +03:00',155,580,32,s.accent,'left',900,1,'monospace');for(let i=0;i<5;i++)person(ctx,250+i*145,940,.9,i===3?s.accent:'#74787e',.9);txt(ctx,'00:00:10',540,1065,85,'#f3ede1','center',900,1,'monospace');}
  if(shot===4){const n=Math.max(0,10-Math.floor(l*10));txt(ctx,String(n).padStart(2,'0'),540,1000,350,s.accent,'center',900,1,'monospace');txt(ctx,'PINTU TIDAK TERDETEKSI',540,1140,42,'#fff','center',900);}
}
function overlay07(ctx,shot,t,u,l,s){
  if(shot===1){txt(ctx,'23:71',150,420,52,s.accent,'left',900,1,'monospace');txt(ctx,'04:92',930,420,52,s.accent,'right',900,1,'monospace');}
  if(shot===2||shot===3){for(let i=0;i<8;i++){const x=95+i*128,y=920+(i%2)*45;person(ctx,x,y,1.35,'rgba(7,11,14,.88)',1,true);if(shot===3){blob(ctx,x,y-70,27,36,20+i,'#071014',s.accent,3);line(ctx,[[x-12,y-70],[x+14,y-70]],s.accent,3);}}}
  if(shot===4){ctx.fillStyle='rgba(2,7,10,.7)';ctx.fillRect(0,0,W,H);txt(ctx,'PENUMPANG YANG TERTINGGAL',540,760,40,'#fff','center',900);txt(ctx,'JANGAN IKUTI SUARAMU',540,860,58,s.accent,'center',900);}
}
function overlay08(ctx,shot,t,u,l,s){
  if(shot===2){const blink=l>.35&&l<.63;ctx.fillStyle=`rgba(0,0,0,${blink?.94:.15})`;ctx.fillRect(0,0,W,H);if(blink)txt(ctx,'SIGNAL LOST  00:00:01',540,1000,42,s.accent,'center',900,1,'monospace');}
  if(shot===3||shot===4){
    const x=550,y=575,e=shot===4?out(l):.25;
    const halo=ctx.createRadialGradient(x,y,10,x,y,250);halo.addColorStop(0,'rgba(0,0,0,.62)');halo.addColorStop(.48,'rgba(0,0,0,.24)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(x-270,y-270,540,540);
    ctx.save();ctx.shadowColor=rgba(s.accent,.55);ctx.shadowBlur=42;ctx.beginPath();ctx.ellipse(x,y,70+80*e,145+135*e,0,0,Math.PI*2);ctx.fillStyle='rgba(2,2,6,.96)';ctx.fill();ctx.strokeStyle=s.accent;ctx.lineWidth=5;ctx.stroke();ctx.shadowBlur=18;ctx.beginPath();ctx.ellipse(x,y,18+26*e,68+62*e,0,0,Math.PI*2);ctx.fillStyle=s.accent;ctx.fill();ctx.restore();
  }
  if(shot===4){rounded(ctx,90,1160,900,145,24);ctx.fillStyle=rgba(s.accent,.17);ctx.fill();ctx.strokeStyle=s.accent;ctx.lineWidth=4;ctx.stroke();txt(ctx,'DARURAT: JANGAN MENATAP LANGIT',540,1250,37,'#fff','center',900);}
}
function overlay09(ctx,shot,t,u,l,s){
  if(shot===1||shot===2){rounded(ctx,220,470,640,760,42);ctx.fillStyle='rgba(7,7,11,.78)';ctx.fill();ctx.strokeStyle=rgba(s.accent,.55);ctx.lineWidth=5;ctx.stroke();person(ctx,500,935,2,'rgba(221,208,211,.8)',1);if(shot===2)person(ctx,650,920,3.1,'rgba(2,1,4,.96)',out(l),true);txt(ctx,'IBU',540,1105,66,'#fff','center',900);txt(ctx,'nomor tidak aktif • 3 tahun',540,1150,26,'rgba(255,255,255,.55)','center',700);}
  if(shot===3){rounded(ctx,125,720,830,190,35);ctx.fillStyle=rgba(s.accent,.16);ctx.fill();ctx.strokeStyle=s.accent;ctx.lineWidth=4;ctx.stroke();txt(ctx,'IBU',175,780,25,s.accent,'left',900);txt(ctx,'JANGAN BUKA PINTU.',540,855,49,'#fff','center',900);}
  if(shot===4){rounded(ctx,110,480,860,660,30);ctx.fillStyle='rgba(3,6,8,.78)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=4;ctx.stroke();txt(ctx,'CCTV / DEPAN RUMAH',155,550,28,s.accent,'left',900,1,'monospace');person(ctx,540,1030,2.5,'#020306',1,true);txt(ctx,'DIMAS TERDETEKSI DI LUAR',540,1195,39,'#fff','center',900);}
}
function overlay10(ctx,shot,t,u,l,s){
  if(shot===1){rounded(ctx,95,420,890,250,38);ctx.fillStyle='rgba(5,7,10,.88)';ctx.fill();ctx.strokeStyle=s.accent;ctx.lineWidth=4;ctx.stroke();blob(ctx,190,545,54,50,2,s.accent);txt(ctx,'!',190,568,66,'#060608','center',900);txt(ctx,'KAMU SUDAH DILIHAT',270,565,54,'#fff','left',900);}
  if(shot>=2){const pts=[[150,670],[480,640],[820,710],[290,1050],[690,1080]];pts.forEach((p,i)=>detectionBox(ctx,p[0]-80,p[1]-105,160,210,s.accent,'VERIFIED',clamp(l*2-i*.08)));}
  if(shot===3||shot===4){const count=Math.floor(lerp(1,3000000,shot===4?out(l):.42));rounded(ctx,155,1250,770,170,25);ctx.fillStyle='rgba(3,4,6,.86)';ctx.fill();ctx.strokeStyle=rgba(s.accent,.55);ctx.lineWidth=4;ctx.stroke();txt(ctx,count.toLocaleString('id-ID'),540,1360,84,s.accent,'center',900,1,'monospace');}
  if(shot===4)txt(ctx,'PENCADANGAN • SELESAI',540,1190,32,s.accent,'center',900);
}
const overlays={3:overlay03,4:overlay04,5:overlay05,6:overlay06,7:overlay07,8:overlay08,9:overlay09,10:overlay10};

function drawHook(ctx,story,local){
  const a=out(inv(0,.22,local))*(1-inv(.78,1,local));ctx.save();ctx.globalAlpha=a;const y=920;story.hook.forEach((s,i)=>{const size=fit(ctx,s,930,i?100:82);ctx.font=`900 ${size}px Arial, sans-serif`;ctx.textAlign='center';ctx.lineJoin='round';ctx.strokeStyle='rgba(0,0,0,.9)';ctx.lineWidth=24;ctx.strokeText(s,W/2,y+i*115);ctx.fillStyle=i?story.accent:'#f5f0e5';ctx.fillText(s,W/2,y+i*115);});line(ctx,[[160,1175],[920,1175]],story.accent,9,a);ctx.restore();
}
function drawCaption(ctx,story,t){if(t<.15||t>story.audioDuration+.1)return;const cap=captionAt(story,t),a=out(cap.local/.2),size=fit(ctx,cap.line,910,70);const lines=wrap(ctx,cap.line,910,size).slice(0,2);ctx.save();ctx.translate(W/2,1510-lines.length*size*.5);ctx.scale(.94+a*.06,.94+a*.06);lines.forEach((s,i)=>{ctx.font=`900 ${size}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.strokeStyle='rgba(0,0,0,.96)';ctx.lineWidth=16;ctx.strokeText(s,0,i*size*1.12);ctx.fillStyle=/[A-Z0-9]{2,}|404/.test(s)?story.accent:'#f5f0e5';ctx.fillText(s,0,i*size*1.12);});ctx.restore();}
function drawIdentity(ctx,story,t,u,shot){
  const g=ctx.createLinearGradient(0,0,0,300);g.addColorStop(0,'rgba(0,0,0,.72)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,320);
  txt(ctx,'ANOMALIA',62,92,42,'#fff','left',900);txt(ctx,`FILE ${String(story.id).padStart(3,'0')}  /  CAM 0${shot+1}`,62,137,23,story.accent,'left',800,1,'monospace');
  rounded(ctx,695,55,320,56,15);ctx.fillStyle='rgba(3,5,8,.72)';ctx.fill();ctx.strokeStyle=rgba(story.accent,.55);ctx.lineWidth=2;ctx.stroke();txt(ctx,'FIKSI • ANALOG HORROR',855,93,20,'#fff','center',900);
  txt(ctx,'@ANOMALIA',58,1770,25,'rgba(255,255,255,.58)','left',800);ctx.fillStyle='rgba(255,255,255,.18)';rounded(ctx,58,1802,820,9,5);ctx.fill();rounded(ctx,58,1802,820*clamp(t/story.audioDuration),9,5);ctx.fillStyle=story.accent;ctx.fill();txt(ctx,`${Math.max(0,Math.ceil(story.audioDuration-t))}s`,970,1816,24,'rgba(255,255,255,.6)','right',700,1,'monospace');
}
function drawTexture(ctx,story,t,shot){
  for(let y=0;y<H;y+=8){ctx.fillStyle='rgba(255,255,255,.011)';ctx.fillRect(0,y, W,1);}for(let i=0;i<90;i++){const x=hash(i+500,story.id)*W,y=(hash(i+630,story.id)*H+t*(18+hash(i,story.id)*36))%H;ctx.fillStyle=i%9? 'rgba(255,255,255,.024)':rgba(story.accent,.045);ctx.fillRect(x,y,1+hash(i,2)*2,1+hash(i,5)*5);}
  if(shot===2||shot===3){const y=(t*97%H);ctx.fillStyle=rgba(story.accent,.065);ctx.fillRect(0,y,W,5);}
  const v=ctx.createRadialGradient(W/2,H*.48,420,W/2,H*.48,1170);v.addColorStop(.55,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.72)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
function drawFinalCTA(ctx,story,t){if(t<story.audioDuration-2.4)return;const a=out(inv(story.audioDuration-2.4,story.audioDuration-1.3,t));ctx.save();ctx.globalAlpha=a;rounded(ctx,130,1260,820,120,28);ctx.fillStyle='rgba(2,3,5,.9)';ctx.fill();ctx.strokeStyle=story.accent;ctx.lineWidth=4;ctx.stroke();txt(ctx,story.id===10?'FILE 011?  TULIS “LANJUT”':'FOLLOW ANOMALIA UNTUK FILE BERIKUTNYA',540,1335,34,'#fff','center',900);ctx.restore();}

export async function createScene(canvas,id){
  const ctx=canvas.getContext('2d');const story=storyById(id);const assets=await loadAssets(story);const duration=story.audioDuration+1.15;
  return {story,duration,draw(time){
    const t=clamp(time,0,duration),u=clamp(t/duration),state=shotState(u),shot=state.index,local=state.local;
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#030406';ctx.fillRect(0,0,W,H);
    const img=(shot===2||shot===3)&&assets.hasEvidence?assets.evidence:assets.establish;
    drawRaster(ctx,img,story.focus[shot],local,story,shot);
    overlays[story.id](ctx,shot,t,u,local,story);
    drawTexture(ctx,story,t,shot);
    if(shot===0)drawHook(ctx,story,local);
    drawTransition(ctx,u,story);
    drawIdentity(ctx,story,t,u,shot);
    drawCaption(ctx,story,t);
    drawFinalCTA(ctx,story,t);
  }};
}
