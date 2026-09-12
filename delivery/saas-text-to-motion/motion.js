const W=1080,H=1920,DURATION=16;
const stage=document.querySelector('#stage');
const camera=document.querySelector('#camera');
const debug=document.querySelector('#debug');
const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);stage.style.transform=`translate(-50%,-50%) scale(${s})`;};
addEventListener('resize',fit);fit();

// Split prompt into seek-safe characters.
const prompt=document.querySelector('#promptText');
const text=prompt.textContent;prompt.textContent='';
[...text].forEach(ch=>{const s=document.createElement('span');s.className='char';s.textContent=ch===' '?'\u00A0':ch;prompt.appendChild(s);});

const tl=gsap.timeline({paused:true,defaults:{overwrite:false}});
// 0–2.2: frame-one kinetic hook + camera push.
tl.set(camera,{x:0,y:0,scale:1,rotation:0});
tl.fromTo('.brand',{opacity:0,y:-24},{opacity:1,y:0,duration:.45,ease:'power3.out'},.10);
tl.fromTo('.hook',{opacity:0,scale:1.34,x:-95,y:80,rotation:-4},{opacity:1,scale:1,x:0,y:0,rotation:0,duration:.78,ease:'power4.out'},.18);
tl.fromTo('.hook .arrow',{x:-35,opacity:0,scale:.5},{x:0,opacity:1,scale:1,duration:.42,ease:'back.out(2)'},.58);
tl.fromTo('.hookSub',{opacity:0,y:24},{opacity:1,y:0,duration:.45,ease:'power3.out'},.92);
tl.to(camera,{scale:1.08,x:-30,y:-110,duration:.82,ease:'power2.inOut'},1.18);
tl.to('.hook',{scale:.7,x:-40,y:-115,opacity:.18,duration:.72,ease:'power3.inOut'},1.42);
tl.fromTo('.edgeWord',{opacity:0,x:80},{opacity:1,x:0,duration:.6,ease:'power3.out'},1.42);

// 1.65–4.5: chat emerges, prompt types.
tl.fromTo('#chat',{opacity:0,y:190,scale:.88,rotation:1.2},{opacity:1,y:0,scale:1,rotation:0,duration:.78,ease:'power4.out'},1.64);
tl.fromTo('#botRow',{opacity:0,x:-40},{opacity:1,x:0,duration:.44,ease:'power3.out'},2.18);
tl.fromTo('#promptBubble',{opacity:0,scale:.85,y:36},{opacity:1,scale:1,y:0,duration:.45,ease:'back.out(1.35)'},2.52);
tl.to('#promptText .char',{opacity:1,y:0,duration:.035,stagger:.026,ease:'none'},2.68);
tl.to(camera,{scale:1.13,x:-55,y:-250,duration:.85,ease:'power2.inOut'},3.18);

// 4.45–6.45: cursor pickup + tracked speed-ramped drag into composer.
tl.fromTo('#skillCard',{opacity:0,scale:.75,rotation:7,y:70},{opacity:1,scale:1,rotation:0,y:0,duration:.45,ease:'back.out(1.6)'},4.12);
tl.fromTo('#cursor',{opacity:0,x:90,y:80,scale:.7},{opacity:1,x:0,y:0,scale:1,duration:.35,ease:'power3.out'},4.25);
tl.to('.cursorHalo',{opacity:.8,scale:1,duration:.20,ease:'power2.out'},4.55);
tl.to('.cursorHalo',{opacity:0,scale:1.45,duration:.28,ease:'power2.in'},4.73);
tl.to('#skillCard',{scale:.94,rotation:-3,duration:.18,ease:'power2.out'},4.60);
tl.to('#cursor',{x:-72,y:75,duration:.18,ease:'power2.in'},4.74);
tl.to('#skillCard',{x:-72,y:75,duration:.18,ease:'power2.in'},4.74);
tl.to('.speedLines',{opacity:.78,duration:.12},4.90);
// attack -> travel -> settle (authored speed ramp)
tl.to('#cursor',{x:-330,y:20,rotation:-7,duration:.28,ease:'power4.in'},4.92);
tl.to('#skillCard',{x:-330,y:20,rotation:-7,duration:.28,ease:'power4.in'},4.92);
tl.to(camera,{x:135,y:-180,scale:1.22,rotation:.45,duration:.34,ease:'power4.in'},4.90);
tl.to('#cursor',{x:-535,y:-270,rotation:-10,duration:.38,ease:'none'},5.20);
tl.to('#skillCard',{x:-535,y:-270,rotation:-10,duration:.38,ease:'none'},5.20);
tl.to(camera,{x:235,y:35,scale:1.29,rotation:.75,duration:.38,ease:'none'},5.20);
tl.to('#cursor',{x:-584,y:-385,rotation:0,duration:.42,ease:'power4.out'},5.58);
tl.to('#skillCard',{x:-584,y:-385,rotation:0,scale:.77,duration:.42,ease:'power4.out'},5.58);
tl.to(camera,{x:145,y:115,scale:1.18,rotation:0,duration:.46,ease:'power4.out'},5.58);
tl.to('.speedLines',{opacity:0,duration:.2},5.78);
tl.to('#skillCard',{opacity:0,duration:.12},6.00);
tl.fromTo('#docked',{opacity:0,scale:.72},{opacity:1,scale:1,duration:.30,ease:'back.out(1.8)'},6.00);
tl.to('#cursor',{x:-520,y:-395,scale:.86,duration:.25,ease:'power2.out'},6.05);

// 6.3–9: send -> prompt transforms into generated motion system.
tl.to('#cursor',{x:-285,y:-385,duration:.35,ease:'power3.inOut'},6.32);
tl.to('#send',{scale:.78,rotation:-8,duration:.09,ease:'power2.in'},6.66);
tl.to('#send',{scale:1,rotation:0,duration:.18,ease:'back.out(2)'},6.75);
tl.to('.flash',{opacity:.72,duration:.06},6.76).to('.flash',{opacity:0,duration:.24},6.82);
tl.fromTo('#resultWrap',{opacity:0,scale:.72,y:-35},{opacity:1,scale:1,y:0,duration:.54,ease:'power4.out'},6.88);
tl.to(camera,{x:72,y:-355,scale:1.35,duration:.75,ease:'power3.inOut'},6.90);
tl.fromTo('#ll1,#ll2,#ll3',{opacity:0,x:-24},{opacity:1,x:0,duration:.25,stagger:.12,ease:'power2.out'},7.26);
tl.to('#ll1',{background:'linear-gradient(90deg,#7c4dff,#3cf3ff,#d9ff3f)',duration:.32,ease:'power2.out'},7.35);
tl.fromTo('#sr1,#sr2,#sr3',{opacity:0,x:-18},{opacity:1,x:0,duration:.25,stagger:.18,ease:'power2.out'},7.58);
tl.to('#loader .loaderLine',{boxShadow:'0 0 20px rgba(124,77,255,.18)',duration:.35},8.05);
tl.to('#resultStatus',{color:'#d9ff3f',duration:.1,onStart:()=>{document.querySelector('#resultStatus').textContent='RENDERING';}},8.15);
tl.to('#loader',{opacity:0,duration:.32,ease:'power2.in'},8.40);
tl.fromTo('#game',{opacity:0,scale:1.08},{opacity:1,scale:1,duration:.38,ease:'power3.out'},8.48);
tl.to('#resultStatus',{duration:.01,onStart:()=>{document.querySelector('#resultStatus').textContent='LIVE';}},8.55);

// 8.6–12.9: generated Flappy Bird motion; camera actively follows the result canvas.
tl.fromTo('#bird',{x:-80,y:70,rotation:18,scale:.6},{x:0,y:0,rotation:-8,scale:1,duration:.44,ease:'back.out(1.7)'},8.62);
tl.to('#bird',{y:-78,rotation:-18,duration:.42,ease:'power2.out'},9.10);
tl.to('#bird',{y:35,rotation:20,duration:.52,ease:'power2.in'},9.52);
tl.to('#bird',{y:-58,rotation:-16,duration:.40,ease:'power2.out'},10.04);
tl.to('#bird',{y:18,rotation:11,duration:.48,ease:'power2.inOut'},10.44);
tl.to('#bird',{y:-72,rotation:-20,duration:.42,ease:'power2.out'},10.92);
tl.to('#bird',{y:30,rotation:16,duration:.52,ease:'power2.in'},11.34);
tl.to('#bird',{y:-42,rotation:-12,duration:.48,ease:'power2.out'},11.86);
tl.to('#bird .birdWing',{rotation:-34,duration:.13,yoyo:true,repeat:15,ease:'power1.inOut'},8.68);
tl.to('#p1',{x:-1010,duration:3.6,ease:'none'},8.72);
tl.to('#p2',{x:-1190,duration:4.1,ease:'none'},8.72);
tl.to('#p3',{x:-1390,duration:4.5,ease:'none'},8.72);
tl.to(camera,{x:-15,y:-440,scale:1.52,duration:.52,ease:'power3.in'},8.70);
tl.to(camera,{x:82,y:-500,scale:1.58,duration:1.15,ease:'none'},9.22);
tl.to(camera,{x:30,y:-460,scale:1.46,duration:.55,ease:'power4.out'},10.37);
tl.to(camera,{x:95,y:-520,scale:1.60,duration:.78,ease:'power2.inOut'},10.96);
tl.to(camera,{x:10,y:-430,scale:1.43,duration:.72,ease:'power3.out'},11.74);
tl.to('#score',{duration:.01,onStart:()=>document.querySelector('#score').textContent='01'},9.62);
tl.to('#score',{duration:.01,onStart:()=>document.querySelector('#score').textContent='02'},10.82);
tl.to('#score',{duration:.01,onStart:()=>document.querySelector('#score').textContent='03'},12.00);

// 12.8–16: pull back reveal, keep product world visible, payoff lands.
tl.to(camera,{x:-38,y:-160,scale:1.04,rotation:-.25,duration:.94,ease:'power4.inOut'},12.72);
tl.to('#chat',{scale:.91,x:-105,y:-55,rotation:-1.2,duration:.72,ease:'power3.inOut'},13.02);
tl.to('.hook',{opacity:.08,scale:.62,x:-75,y:-155,duration:.45},13.12);
tl.fromTo('#payoff',{opacity:0,y:110,scale:.88},{opacity:1,y:0,scale:1,duration:.68,ease:'power4.out'},13.30);
tl.fromTo('#payoff .lime',{filter:'blur(10px)',textShadow:'0 0 0 rgba(217,255,63,0)'},{filter:'blur(0px)',textShadow:'0 0 44px rgba(217,255,63,.22)',duration:.52,ease:'power2.out'},13.68);
tl.to(camera,{x:-10,y:-85,scale:1.01,duration:.58,ease:'power2.out'},14.22);
tl.fromTo('.cta',{scale:.88,y:18},{scale:1,y:0,duration:.42,ease:'back.out(1.7)'},14.45);
tl.to('.brand',{color:'#d9ff3f',duration:.25},14.72);
tl.to('.edgeWord',{x:-45,opacity:.24,duration:.52,ease:'power2.out'},14.78);
tl.to({},{duration:.01},15.99);

const q=new URLSearchParams(location.search);
if(q.has('debug'))debug.classList.add('on');
gsap.ticker.add(()=>{debug.textContent=tl.time().toFixed(2)+'s';});
window.OPENER={W,H,DURATION,tl,ready:false,seek(t){tl.pause();tl.time(Math.max(0,Math.min(DURATION,t)),false);},play(){tl.play();}};
Promise.resolve(document.fonts?.ready).then(()=>{window.OPENER.ready=true;if(!q.has('clean'))tl.play(0);});
tl.eventCallback('onComplete',()=>{if(!q.has('clean'))tl.play(0);});
