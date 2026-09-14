import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

const DURATION = 8;
const CHROMA = 0x00ff00;
const q = new URLSearchParams(location.search);
const sceneNumber = Math.max(1, Math.min(10, Number(q.get("scene") || 1)));
const clean = q.has("clean");
if (q.has("debug")) document.body.classList.add("debug");

const ICONS = [
  { slug:"heart", label:"Heart", primary:0xff356f, secondary:0xffb0c7, spin:1, sway:.65 },
  { slug:"bell", label:"Bell", primary:0xff9f1c, secondary:0xffd089, spin:-1, sway:.48 },
  { slug:"chat", label:"Chat", primary:0x5f5cff, secondary:0xbab9ff, spin:1, sway:.38 },
  { slug:"pin", label:"Location Pin", primary:0xff4d4d, secondary:0xffb0a9, spin:-1, sway:.55 },
  { slug:"camera", label:"Camera", primary:0x3b82f6, secondary:0xaacfff, spin:1, sway:.32 },
  { slug:"music", label:"Music Note", primary:0xa855f7, secondary:0xd9b0ff, spin:-1, sway:.72 },
  { slug:"rocket", label:"Rocket", primary:0xff5a36, secondary:0xffb39e, spin:1, sway:.82 },
  { slug:"bag", label:"Shopping Bag", primary:0x06b6d4, secondary:0x9be8f2, spin:-1, sway:.44 },
  { slug:"check", label:"Check Badge", primary:0x2563eb, secondary:0xa9c4ff, spin:1, sway:.36 },
  { slug:"bolt", label:"Lightning", primary:0xffc928, secondary:0xffe79a, spin:-1, sway:.76 },
];
const cfg = ICONS[sceneNumber - 1];

document.title = `AMHFX ${String(sceneNumber).padStart(2,"0")} ${cfg.label}`;
document.querySelector("#debug").textContent = `${String(sceneNumber).padStart(2,"0")} — ${cfg.label}`;

const canvas = document.querySelector("#gl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false, powerPreference:"high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.setClearColor(CHROMA, 1);
renderer.setPixelRatio(1);
renderer.setSize(innerWidth, innerHeight, false);

const scene = new THREE.Scene();
scene.background = new THREE.Color(CHROMA);
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, .1, 100);
scene.add(camera);

scene.add(new THREE.HemisphereLight(0xffffff, 0x39284f, 1.65));
const key = new THREE.DirectionalLight(0xffffff, 5.2); key.position.set(4, 6, 8); scene.add(key);
const rim = new THREE.DirectionalLight(cfg.secondary, 4.1); rim.position.set(-5, 2, 5); scene.add(rim);
const fill = new THREE.DirectionalLight(0x7a8cff, 2.4); fill.position.set(0, -6, 4); scene.add(fill);

const mats = {
  front: new THREE.MeshPhysicalMaterial({ color:cfg.primary, roughness:.25, metalness:.22, clearcoat:1, clearcoatRoughness:.13, emissive:cfg.primary, emissiveIntensity:.035 }),
  back: new THREE.MeshPhysicalMaterial({ color:0x221a35, roughness:.34, metalness:.5, clearcoat:.55 }),
  detail: new THREE.MeshPhysicalMaterial({ color:cfg.secondary, roughness:.2, metalness:.12, clearcoat:1, clearcoatRoughness:.08, emissive:cfg.secondary, emissiveIntensity:.03 }),
  dark: new THREE.MeshPhysicalMaterial({ color:0x171321, roughness:.32, metalness:.62, clearcoat:.48 }),
};

function ex(shape, material=mats.front, depth=.42, bevel=.12){
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled:true, bevelSegments:5, steps:1, bevelSize:bevel, bevelThickness:bevel, curveSegments:24 });
  g.computeBoundingBox();
  const b = g.boundingBox, cx=(b.max.x+b.min.x)/2, cy=(b.max.y+b.min.y)/2, cz=(b.max.z+b.min.z)/2;
  g.translate(-cx,-cy,-cz);
  g.computeVertexNormals();
  return new THREE.Mesh(g, material);
}
function roundedRect(w,h,r){
  const s=new THREE.Shape(), x=-w/2,y=-h/2;
  s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y); s.closePath(); return s;
}
function makeHeart(){
  const s=new THREE.Shape();
  s.moveTo(0,-2.15); s.bezierCurveTo(-.5,-1.65,-2.35,-.55,-2.35,.82); s.bezierCurveTo(-2.35,2.25,-.72,2.52,0,1.32);
  s.bezierCurveTo(.72,2.52,2.35,2.25,2.35,.82); s.bezierCurveTo(2.35,-.55,.5,-1.65,0,-2.15); return s;
}
function makeBell(){
  const s=new THREE.Shape();
  s.moveTo(-2.1,-1.15); s.bezierCurveTo(-1.42,-.68,-1.7,.22,-1.42,1.03); s.bezierCurveTo(-1.12,1.9,-.7,2.25,0,2.38);
  s.bezierCurveTo(.7,2.25,1.12,1.9,1.42,1.03); s.bezierCurveTo(1.7,.22,1.42,-.68,2.1,-1.15);
  s.bezierCurveTo(1.35,-1.65,.68,-1.78,0,-1.78); s.bezierCurveTo(-.68,-1.78,-1.35,-1.65,-2.1,-1.15); return s;
}
function makeChat(){
  const s=new THREE.Shape();
  s.moveTo(-1.45,-1.7); s.lineTo(-.82,-1.7); s.lineTo(-1.55,-2.42); s.lineTo(-1.34,-1.42);
  s.quadraticCurveTo(-2.3,-1.25,-2.3,-.52); s.lineTo(-2.3,.92); s.quadraticCurveTo(-2.3,1.78,-1.44,1.78);
  s.lineTo(1.44,1.78); s.quadraticCurveTo(2.3,1.78,2.3,.92); s.lineTo(2.3,-.84); s.quadraticCurveTo(2.3,-1.7,1.44,-1.7);
  s.lineTo(-1.45,-1.7); s.closePath(); return s;
}
function makePin(){
  const s=new THREE.Shape(); s.moveTo(0,-2.5); s.bezierCurveTo(-.34,-1.9,-2.05,-.18,-2.05,1.05); s.bezierCurveTo(-2.05,2.35,-1.1,3.1,0,3.1);
  s.bezierCurveTo(1.1,3.1,2.05,2.35,2.05,1.05); s.bezierCurveTo(2.05,-.18,.34,-1.9,0,-2.5);
  const h=new THREE.Path(); h.absellipse(0,1.05,.69,.76,0,Math.PI*2,false,0); s.holes.push(h); return s;
}
function makeCamera(){
  const s=roundedRect(4.8,3.35,.72);
  const bump=new THREE.Shape(); bump.moveTo(-1.35,1.67); bump.lineTo(-.72,2.35); bump.lineTo(.74,2.35); bump.lineTo(1.28,1.67); bump.closePath();
  // merge visual bump as a second shape in group instead of boolean union
  const lens=new THREE.Path(); lens.absellipse(.35,.02,.88,.82,0,Math.PI*2,false,0); s.holes.push(lens);
  return {body:s,bump};
}
function makeMusic(){
  const s=new THREE.Shape();
  s.moveTo(.2,-1.95); s.bezierCurveTo(-.1,-2.58,-1.35,-2.72,-1.88,-2.06); s.bezierCurveTo(-2.35,-1.48,-1.86,-.65,-1.05,-.55);
  s.bezierCurveTo(-.22,-.45,.32,-.85,.42,-1.35); s.lineTo(.92,1.45); s.lineTo(2.18,1.75); s.lineTo(2.34,.88); s.lineTo(.95,.54); s.lineTo(.6,-1.45);
  s.bezierCurveTo(.42,-2.03,.38,-2.04,.2,-1.95); return s;
}
function makeRocket(){
  const s=new THREE.Shape(); s.moveTo(0,2.8); s.bezierCurveTo(1.18,2.15,1.65,.9,1.35,-.65); s.lineTo(2.22,-1.48); s.lineTo(1.02,-1.45);
  s.bezierCurveTo(.68,-2.25,.32,-2.72,0,-3.05); s.bezierCurveTo(-.32,-2.72,-.68,-2.25,-1.02,-1.45); s.lineTo(-2.22,-1.48); s.lineTo(-1.35,-.65);
  s.bezierCurveTo(-1.65,.9,-1.18,2.15,0,2.8); const h=new THREE.Path(); h.absellipse(0,.72,.48,.55,0,Math.PI*2,false,0); s.holes.push(h); return s;
}
function makeBag(){ return roundedRect(4.25,4.15,.52); }
function makeBadge(){
  const s=new THREE.Shape(); const pts=[]; const n=12;
  for(let i=0;i<n;i++){ const a=Math.PI/2 + i*Math.PI*2/n; const r=i%2?2.15:2.52; pts.push([Math.cos(a)*r,Math.sin(a)*r]); }
  s.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++) s.lineTo(pts[i][0],pts[i][1]); s.closePath(); return s;
}
function makeCheck(){
  const s=new THREE.Shape(); s.moveTo(-1.62,.05); s.lineTo(-.62,-1.0); s.lineTo(1.68,1.28); s.lineTo(1.12,1.82); s.lineTo(-.6,.22); s.lineTo(-1.08,.72); s.closePath(); return s;
}
function makeBolt(){
  const s=new THREE.Shape(); s.moveTo(.55,2.85); s.lineTo(-1.55,.35); s.lineTo(-.38,.3); s.lineTo(-1.02,-2.82); s.lineTo(1.72,.45); s.lineTo(.44,.5); s.closePath(); return s;
}
function makeHandle(){
  const s=new THREE.Shape(); s.moveTo(-1.12,0); s.bezierCurveTo(-1.08,1.45,1.08,1.45,1.12,0); s.lineTo(.52,0); s.bezierCurveTo(.5,.76,-.5,.76,-.52,0); s.closePath(); return s;
}
function makeDotPill(w=1.1,h=.38){ return roundedRect(w,h,h/2); }

function makeIcon(index){
  const g=new THREE.Group(); let main;
  if(index===1) main=ex(makeHeart());
  if(index===2){ main=ex(makeBell()); const cl=ex(roundedRect(.85,.5,.23),mats.detail,.34,.08); cl.position.set(0,-2.04,.15); g.add(cl); }
  if(index===3){ main=ex(makeChat()); for(let i=-1;i<=1;i++){ const d=ex(makeDotPill(.52,.24),mats.detail,.3,.06); d.position.set(i*.86,.15,.33); g.add(d); } }
  if(index===4) main=ex(makePin());
  if(index===5){ const parts=makeCamera(); main=ex(parts.body); const bump=ex(parts.bump,mats.detail,.38,.09); bump.position.set(0,1.75,.05); g.add(bump); }
  if(index===6) main=ex(makeMusic());
  if(index===7) main=ex(makeRocket());
  if(index===8){ main=ex(makeBag()); const h=ex(makeHandle(),mats.detail,.34,.08); h.position.set(0,2.04,.08); g.add(h); }
  if(index===9){ main=ex(makeBadge()); const c=ex(makeCheck(),mats.detail,.32,.08); c.scale.setScalar(.78); c.position.z=.35; g.add(c); }
  if(index===10) main=ex(makeBolt());
  g.add(main);
  const back=main.clone(); back.material=mats.back; back.position.z=-.34; back.scale.set(1.045,1.045,1); g.add(back); g.remove(main); g.add(main); // keep front last
  return g;
}

const heroModel = makeIcon(sceneNumber);
const modelBox=new THREE.Box3().setFromObject(heroModel), modelSize=new THREE.Vector3(), modelCenter=new THREE.Vector3();
modelBox.getSize(modelSize); modelBox.getCenter(modelCenter);
const maxDim=Math.max(modelSize.x,modelSize.y,modelSize.z);
heroModel.position.copy(modelCenter).multiplyScalar(-1);
heroModel.scale.setScalar(4.7/maxDim);
const hero=new THREE.Group(); hero.add(heroModel); scene.add(hero);

function makeShard(i){
  const s=new THREE.Shape(); const w=.54 + (i%3)*.12, h=1.25 + (i%2)*.34;
  s.moveTo(-w*.48,-h*.5); s.quadraticCurveTo(-w*.72,0,-w*.24,h*.5); s.lineTo(w*.38,h*.33); s.quadraticCurveTo(w*.58,0,w*.31,-h*.42); s.closePath();
  const m=mats.detail.clone(); m.transparent=true; m.opacity=.78;
  const mesh=ex(s,m,.16,.05); mesh.scale.setScalar(.5 + (i%4)*.07); return mesh;
}
const shards=new THREE.Group();
for(let i=0;i<8;i++){ const s=makeShard(i); shards.add(s); }
scene.add(shards);

function clamp01(v){return Math.max(0,Math.min(1,v));}
function sm(v){v=clamp01(v); return v*v*(3-2*v);}
function powOut(v,p=3){v=clamp01(v); return 1-Math.pow(1-v,p);}
function backOut(v){v=clamp01(v); const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(v-1,3)+c1*Math.pow(v-1,2);}
function mix(a,b,t){return a+(b-a)*t;}
function seg(t,a,b,e=sm){return e((t-a)/(b-a));}

function renderAt(rawT){
  const t=Math.max(0,Math.min(DURATION,rawT));
  const intro=seg(t,0,1.25,backOut), inspect=seg(t,1.15,3.05,powOut), sweep=seg(t,3.05,4.85,sm), lock=seg(t,4.85,5.6,sm), payoff=seg(t,5.6,8,powOut);
  const spin=cfg.spin;

  const baseScale=.03 + 1.01*intro;
  hero.scale.setScalar(baseScale*(1 + .018*Math.sin(t*2.8 + sceneNumber)));
  hero.rotation.x = mix(-.48*spin,.16*spin,intro) + .12*Math.sin(t*.78+sceneNumber);
  hero.rotation.y = mix(-1.0*spin,.25*spin,intro) + inspect*spin*.72 - sweep*spin*1.02 + payoff*spin*.22;
  hero.rotation.z = mix(.22*spin,-.05*spin,intro) + Math.sin(t*.95+sceneNumber*.7)*.045*cfg.sway;
  hero.position.x = mix(-.72*spin,0,intro) + Math.sin(t*.68+sceneNumber)*.12*(1-payoff);
  hero.position.y = mix(-.38,.05,intro) + Math.cos(t*.72+sceneNumber*.3)*.08;
  hero.position.z = mix(-1.4,0,intro);

  // Shards provide foreground/midground depth and inherit the icon palette.
  shards.children.forEach((s,i)=>{
    const a=i/8*Math.PI*2 + sceneNumber*.31;
    const orbit=2.9 + (i%3)*.34 + .28*Math.sin(t*.7+i);
    const reveal=clamp01((t-.55-i*.045)/.65) * (1-clamp01((t-7.35)/.5)*.45);
    s.visible=reveal>.005; s.material.opacity=.72*reveal;
    s.position.set(Math.cos(a+t*.18*spin)*orbit, Math.sin(a+t*.23*spin)*orbit*.72, (i%2?1.0:-1.15)+Math.sin(t*.52+i)*.26);
    s.rotation.set(.28*Math.sin(t+i), a+t*.31*spin, a*.4-t*.2*spin);
    s.scale.setScalar((.47+(i%4)*.065)*(1+.12*Math.sin(t*1.4+i)));
  });

  // Camera signatures: attack/push -> tracking arc -> pullback reveal -> intentional lock -> payoff reframe.
  let cx,cy,cz,fov;
  if(t<1.55){ const p=seg(t,0,1.55,powOut); cx=mix(-1.9*spin,-.55*spin,p); cy=mix(.72,.14,p); cz=mix(10.7,7.15,p); fov=mix(39,31,p); }
  else if(t<3.55){ const p=seg(t,1.55,3.55,sm); cx=mix(-.55*spin,1.35*spin,p); cy=mix(.14,-.28,p); cz=mix(7.15,6.45,p); fov=mix(31,33,p); }
  else if(t<5.0){ const p=seg(t,3.55,5.0,powOut); cx=mix(1.35*spin,-1.05*spin,p); cy=mix(-.28,.48,p); cz=mix(6.45,8.15,p); fov=mix(33,37,p); }
  else if(t<5.75){ cx=-1.05*spin; cy=.48; cz=8.15; fov=37; }
  else { const p=seg(t,5.75,8,powOut); cx=mix(-1.05*spin,.16*spin,p); cy=mix(.48,.03,p); cz=mix(8.15,6.75,p); fov=mix(37,32,p); }

  camera.position.set(cx,cy,cz);
  camera.fov=fov; camera.updateProjectionMatrix();
  const target=new THREE.Vector3(hero.position.x*.18, hero.position.y*.12, 0);
  camera.lookAt(target);

  mats.front.emissiveIntensity=.025 + .06*Math.max(intro*.55, payoff*.72) + .025*Math.sin(t*2.2+sceneNumber);
  mats.detail.emissiveIntensity=.02 + .045*sweep;
  renderer.render(scene,camera);
}

function resize(){ renderer.setSize(innerWidth,innerHeight,false); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderAt(window.OPENER?.time || 0); }
addEventListener("resize",resize);

let previewStart=0, playing=false;
function preview(now){ if(!playing) return; if(!previewStart) previewStart=now; const t=((now-previewStart)/1000)%DURATION; window.OPENER.time=t; renderAt(t); requestAnimationFrame(preview); }

window.OPENER={
  W:1920,H:1080,DURATION,ready:true,time:0,scene:sceneNumber,label:cfg.label,
  seek(t){ const x=Math.max(0,Math.min(DURATION,Number(t)||0)); this.time=x; renderAt(x); },
  play(){ playing=true; previewStart=0; requestAnimationFrame(preview); },
  pause(){ playing=false; }
};
renderAt(0);
if(!clean) window.OPENER.play();
