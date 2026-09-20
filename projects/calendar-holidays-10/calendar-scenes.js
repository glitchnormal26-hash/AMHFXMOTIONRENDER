(() => {
const W=1920,H=1080,DURATION=10;
const q=new URLSearchParams(location.search);
const id=Math.max(1,Math.min(10,Number(q.get('concept')||1)));
const world=document.querySelector('#world');
const camera=document.querySelector('#camera');
const stage=document.querySelector('#stage');
const debug=document.querySelector('#debug');

const concepts=[
{n:1,slug:'midnight-flip',date:'01',month:'JAN',dow:'THURSDAY',title:'New Year',kicker:'Fresh start · 2026',palette:['#06101d','#102d45','#6ee7ff','#8b5cf6']},
{n:2,slug:'ribbon-heart',date:'14',month:'FEB',dow:'SATURDAY',title:"Valentine's Day",kicker:'A date to remember',palette:['#2b0b1d','#5d1736','#ff6b9a','#b91c58']},
{n:3,slug:'eco-orbit',date:'22',month:'APR',dow:'WEDNESDAY',title:'Earth Day',kicker:'Care for our shared home',palette:['#0d2a24','#214e3f','#b6d77c','#5ea177']},
{n:4,slug:'kinetic-grid',date:'01',month:'MAY',dow:'FRIDAY',title:'Labour Day',kicker:'Work · craft · momentum',palette:['#171514','#2a211c','#ff5a2d','#f6aa1c']},
{n:5,slug:'glass-terrarium',date:'05',month:'JUN',dow:'FRIDAY',title:'Environment Day',kicker:'Grow the future',palette:['#092521','#143f38','#55e6bc','#67a7ff']},
{n:6,slug:'ribbon-flag',date:'17',month:'AUG',dow:'MONDAY',title:'Independence Day',kicker:'Indonesia · 2026',palette:['#25080f','#4a0c17','#ef233c','#ffffff']},
{n:7,slug:'pattern-bloom',date:'02',month:'OCT',dow:'FRIDAY',title:'Batik Day',kicker:'Pattern · heritage · rhythm',palette:['#14100d','#282017','#d5b56f','#6f5228']},
{n:8,slug:'light-monument',date:'10',month:'NOV',dow:'TUESDAY',title:"Heroes' Day",kicker:'Courage remembered',palette:['#0d0b0a','#211b16','#e7ad52','#ffd18c']},
{n:9,slug:'floral-cut-paper',date:'22',month:'DEC',dow:'TUESDAY',title:"Mother's Day",kicker:'Warmth in every detail',palette:['#25111f','#4a203a','#da7fa7','#f3bfd3']},
{n:10,slug:'winter-fold',date:'25',month:'DEC',dow:'FRIDAY',title:'Christmas Day',kicker:'Light · warmth · together',palette:['#081d18','#12392d','#d5b76d','#f4ead2']}
];
const c=concepts[id-1];
document.body.className='c'+id;
const [bg,bg2,accent,accent2]=c.palette;
document.documentElement.style.setProperty('--bg',bg);
document.documentElement.style.setProperty('--bg2',bg2);
document.documentElement.style.setProperty('--accent',accent);
document.documentElement.style.setProperty('--accent2',accent2);

function fit(){const s=Math.min(innerWidth/W,innerHeight/H);stage.style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit);fit();
if(q.has('debug'))debug.classList.add('on');

function grid(active){
  const nums=[]; for(let i=1;i<=31;i++) nums.push(`<span class="${i===active?'hot':''}">${String(i).padStart(2,'0')}</span>`);
  return nums.join('');
}
function infoBlock(extra=''){
 return `<div class="kicker">${c.kicker}</div><div class="event-title" style="margin-top:20px">${c.title}</div><div class="meta" style="margin-top:24px">${c.dow} · ${c.month} · 2026</div>${extra}`;
}
function calendarCard(active,extra=''){
 return `<div class="calendar paper">
   <div class="mini-label">${c.month} · 2026</div>
   <div class="date-number" style="margin-top:30px">${c.date}</div>
   <div class="rule" style="margin:26px 0 24px;background:linear-gradient(90deg,transparent,rgba(0,0,0,.18),transparent)"></div>
   <div class="month-grid">${grid(active)}</div>${extra}
 </div>`;
}
function svgPaths(content,view='0 0 1000 1000',cls=''){return `<svg class="${cls}" viewBox="${view}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;}

function scene1(){
 let ticks='';for(let i=0;i<20;i++){ticks+=`<i class="tick" style="right:405px;top:130px;transform:rotate(${i*18}deg)"></i>`;}
 world.innerHTML=`<div class="scene">
   <div class="depth-bg" style="inset:0;background:radial-gradient(circle at 80% 45%,rgba(110,231,255,.12),transparent 34%)"></div>
   <div class="calendar"><div class="flip-cap"><div class="mini-label">CALENDAR / 2026</div></div>
     <div class="flip-page paper"><div class="mini-label">${c.month}</div><div class="date-number">${c.date}</div><div class="meta" style="color:#5d6675">${c.dow}</div></div>
   </div>
   <div class="copy">${infoBlock('<div class="rule" style="margin-top:36px"></div>')}</div>
   <div class="count-ring">${svgPaths('<path class="orbit" d="M500 110C760 250 800 620 590 850C370 1090 70 800 110 490C145 220 285 40 500 110Z"/><path class="draw glow" pathLength="1" d="M500 110C760 250 800 620 590 850C370 1090 70 800 110 490C145 220 285 40 500 110Z" stroke="var(--accent)" stroke-width="8"/>')}</div>
   ${ticks}<div class="micro-line" style="left:980px;top:760px;width:620px"></div>
 </div>`;
}
function scene2(){
 world.innerHTML=`<div class="scene">
   <div class="ribbon-wrap">${svgPaths('<defs><linearGradient id="r" x1="0" x2="1"><stop stop-color="#ffb1ca"/><stop offset=".45" stop-color="#ff5a8c"/><stop offset="1" stop-color="#8f164b"/></linearGradient></defs><path class="ribbon-main" d="M520 820C155 590 80 385 235 238C385 96 552 222 560 390C570 215 762 90 906 244C1070 420 934 651 520 820Z" fill="none" stroke="url(#r)" stroke-width="92" stroke-linecap="round"/><path class="draw" pathLength="1" d="M515 820C365 710 265 630 205 535" fill="none" stroke="#ffd4e2" stroke-width="8" stroke-linecap="round"/>'0 0 1000 1000','ribbon-svg')}</div>
   ${calendarCard(14)}
   <div class="ribbon-copy">${infoBlock()}</div>
   <div class="petal p1" style="left:1110px;top:130px;transform:rotate(-26deg)"></div><div class="petal p2" style="left:1600px;top:740px;transform:rotate(34deg) scale(.75)"></div>
   <div class="petal p3" style="left:960px;top:825px;transform:rotate(68deg) scale(.55)"></div>
 </div>`;
}
function scene3(){
 world.innerHTML=`<div class="scene">
   <div class="eco-blob">${svgPaths('<defs><linearGradient id="eco" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#b9dc80"/><stop offset=".52" stop-color="#5d9f77"/><stop offset="1" stop-color="#1d5d4c"/></linearGradient></defs><path class="blob" d="M520 72C740 56 926 180 930 402C934 611 846 840 620 914C398 986 153 857 84 639C17 429 121 184 332 111C390 91 449 78 520 72Z" fill="url(#eco)"/><path class="draw" pathLength="1" d="M170 602C365 438 492 401 762 202M251 744C407 568 579 515 837 402" fill="none" stroke="#e5f4cb" stroke-width="11" stroke-linecap="round"/><path d="M420 566C339 476 342 368 448 309C522 409 510 508 420 566ZM602 464C570 334 628 244 747 246C748 370 703 441 602 464Z" fill="#dff0b8"/>'0 0 1000 1000','eco-svg')}</div>
   ${calendarCard(22)}
   <div class="copy">${infoBlock()}</div>
   <div class="leaf l1 depth-fg" style="left:1010px;top:95px;width:110px;height:210px;background:linear-gradient(155deg,#d9eab2,#4e8c68);border-radius:75% 25% 68% 32% / 68% 35% 65% 32%;transform:rotate(24deg)"></div>
   <div class="leaf l2 depth-fg" style="left:1730px;top:770px;width:94px;height:170px;background:linear-gradient(155deg,#88b978,#315d49);border-radius:68% 32% 73% 27%;transform:rotate(-35deg)"></div>
 </div>`;
}
function scene4(){
 world.innerHTML=`<div class="scene">
   <div class="industrial-grid"></div><div class="slash"></div>
   ${calendarCard(1)}
   <div class="copy">${infoBlock('<div class="meta" style="margin-top:36px;max-width:500px">Honouring effort, skill, and the people behind every day.</div>')}</div>
   <div class="slot s1" style="left:1140px;top:620px">SHIFT A</div><div class="slot s2" style="left:1360px;top:700px">08:00</div><div class="slot s3" style="left:1570px;top:585px">ON</div>
 </div>`;
}
function scene5(){
 world.innerHTML=`<div class="scene">
   <div class="glass-shell glass"></div>
   ${calendarCard(5,'<div class="micro-line" style="left:70px;right:70px;bottom:42px"></div>')}
   <div class="copy">${infoBlock('<div class="meta" style="margin-top:28px">A shared reminder to protect the places we call home.</div>')}</div>
   <svg style="position:absolute;left:820px;top:100px;width:860px;height:900px" viewBox="0 0 860 900">
     <path class="vine draw" pathLength="1" d="M105 785C206 694 170 567 296 510C438 446 375 290 520 229C603 194 689 210 765 118" stroke="#77e5c7" stroke-width="14"/>
     <path class="leaf v1" d="M273 544C221 462 242 392 322 357C361 441 347 501 273 544Z" fill="#8be6bb"/>
     <path class="leaf v2" d="M492 259C432 204 439 137 515 102C557 172 551 225 492 259Z" fill="#6fd4b5"/>
     <path class="leaf v3" d="M565 211C604 132 675 115 730 164C681 232 624 247 565 211Z" fill="#b3f3d9"/>
   </svg>
   <div class="soft" style="position:absolute;right:90px;bottom:40px;width:660px;height:240px;background:#57b5ff44;border-radius:45% 55% 70% 30%"></div>
 </div>`;
}
function scene6(){
 world.innerHTML=`<div class="scene">
   <div class="flag-ribbon red"></div><div class="flag-ribbon white"></div>
   ${calendarCard(17)}
   <div class="copy">${infoBlock('<div class="meta" style="margin-top:32px;color:#f3dce1">A day of freedom, unity, and shared memory.</div>')}</div>
   <svg style="position:absolute;right:80px;top:90px;width:740px;height:850px" viewBox="0 0 740 850"><path class="draw" pathLength="1" d="M75 666C211 595 224 473 358 420C488 370 510 257 675 174" fill="none" stroke="#ffced6" stroke-width="9" stroke-linecap="round"/></svg>
 </div>`;
}
function scene7(){
 world.innerHTML=`<div class="scene">
   <svg class="batik-field" viewBox="0 0 1920 1080">
     <defs><pattern id="p" width="240" height="240" patternUnits="userSpaceOnUse">
       <path class="motif" d="M120 24C176 62 191 112 158 148C127 183 84 180 54 146C24 111 42 59 120 24ZM120 76C101 91 98 115 114 129C132 145 157 134 164 111C157 92 144 80 120 76Z" fill="none" stroke="#d8b972" stroke-width="8"/>
       <path d="M14 192C72 132 165 132 226 194" fill="none" stroke="#75582d" stroke-width="11" stroke-linecap="round"/>
     </pattern></defs><rect width="1920" height="1080" fill="url(#p)"/>
   </svg>
   ${calendarCard(2)}
   <div class="copy">${infoBlock()}</div>
   <div class="side-copy"><div class="meta">A living textile tradition carried through generations.</div></div>
 </div>`;
}
function scene8(){
 world.innerHTML=`<div class="scene">
   <div class="beam"></div>
   ${calendarCard(10)}
   <div class="monument">
    <svg viewBox="0 0 380 780"><defs><linearGradient id="m" x1="0" x2="1"><stop stop-color="#17110c"/><stop offset=".5" stop-color="#5d4125"/><stop offset="1" stop-color="#21150d"/></linearGradient></defs>
      <path class="mon-body" d="M176 34L233 42L224 283L291 369L279 719L108 719L95 367L160 283Z" fill="url(#m)"/>
      <path d="M144 719H245L268 758H119Z" fill="#0b0907"/><path class="draw" pathLength="1" d="M190 72V275M136 410H252" fill="none" stroke="#efbd70" stroke-width="7"/>
    </svg>
   </div>
   <div class="copy">${infoBlock('<div class="meta" style="margin-top:30px">Remembering courage, service, and sacrifice.</div>')}</div>
 </div>`;
}
function scene9(){
 let petals='';
 const specs=[[360,150,280,410,-58,'#9c3f70'],[500,110,320,470,-24,'#d06e9e'],[610,210,300,430,12,'#ed9fbd'],[490,360,300,440,42,'#b45584'],[275,360,310,460,78,'#71304f'],[655,410,260,390,92,'#d986aa']];
 specs.forEach((p,i)=>petals+=`<div class="petal-big pb${i+1}" style="left:${p[0]}px;top:${p[1]}px;width:${p[2]}px;height:${p[3]}px;transform:rotate(${p[4]}deg);background:linear-gradient(160deg,${p[5]},#f3bfd3)"></div>`);
 world.innerHTML=`<div class="scene">
   ${calendarCard(22)}
   <div class="flower-stage">${petals}<div class="soft" style="position:absolute;left:410px;top:400px;width:270px;height:270px;background:#f9dbe7;border-radius:57% 43% 65% 35%"></div></div>
   <div class="copy">${infoBlock('<div class="meta" style="margin-top:30px">For every lesson, embrace, and quiet act of care.</div>')}</div>
 </div>`;
}
function scene10(){
 world.innerHTML=`<div class="scene">
   ${calendarCard(25)}
   <div class="folded-star">
    <svg viewBox="0 0 800 800"><defs><linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f4e7b7"/><stop offset=".5" stop-color="#c9a657"/><stop offset="1" stop-color="#7c5f24"/></linearGradient></defs>
      <path class="star" d="M402 54L486 287L739 300L538 455L602 700L402 558L201 700L267 455L64 300L318 287Z" fill="url(#gold)"/>
      <path class="fold" d="M402 54L402 558L318 287ZM402 558L739 300L486 287ZM402 558L201 700L267 455Z" fill="#fff" opacity=".22"/>
      <path class="draw" pathLength="1" d="M402 54L486 287L739 300L538 455L602 700" fill="none" stroke="#fff4cf" stroke-width="7"/>
    </svg>
   </div>
   <div class="copy">${infoBlock('<div class="meta" style="margin-top:26px">A season of light, warmth, and togetherness.</div>')}</div>
   <div class="sprig sp1" style="left:1020px;top:170px;transform:rotate(-42deg)"></div><div class="sprig sp2" style="left:1660px;top:610px;transform:rotate(38deg)"></div>
 </div>`;
}
[scene1,scene2,scene3,scene4,scene5,scene6,scene7,scene8,scene9,scene10][id-1]();

const tl=gsap.timeline({paused:true});
function baseIntro(){
  tl.from('.calendar',{opacity:0,y:92,scale:.92,rotation:id%2?-.8:.8,duration:.9,ease:'power4.out'},.18)
    .from('.kicker',{opacity:0,y:30,duration:.5,ease:'power3.out'},.45)
    .from('.event-title',{opacity:0,y:72,scale:.97,duration:.8,ease:'power4.out'},.56)
    .from('.meta',{opacity:0,y:24,duration:.55,ease:'power3.out'},.82);
}
baseIntro();

const animations={
1(){
 tl.from('.flip-page',{rotationX:-74,y:-28,opacity:0,duration:1.1,ease:'expo.out',transformPerspective:1200},.5)
   .to('.draw',{strokeDashoffset:0,duration:1.25,ease:'power2.inOut'},1.0)
   .from('.tick',{opacity:0,scaleY:.2,stagger:.035,duration:.3,ease:'power2.out'},1.1)
   .to('.tick',{rotation:'+=18',stagger:{each:.025,from:'end'},duration:.7,ease:'power3.inOut'},3.0)
   .to(camera,{scale:1.12,x:-130,y:35,duration:1.1,ease:'power2.inOut'},3.4)
   .to('.flip-page',{rotationX:7,duration:.2,ease:'power2.in'},4.65).to('.flip-page',{rotationX:0,duration:.55,ease:'back.out(1.5)'},4.85)
   .to('.count-ring',{rotation:11,scale:1.045,duration:2.0,ease:'sine.inOut',yoyo:true,repeat:1},5.15)
   .to(camera,{scale:1,x:0,y:0,duration:1.1,ease:'power3.out'},7.55)
   .to('.micro-line',{scaleX:.55,opacity:.28,duration:.55,ease:'power2.inOut'},8.7);
},
2(){
 tl.from('.ribbon-main',{strokeDasharray:2200,strokeDashoffset:2200,duration:1.65,ease:'power3.out'},.25)
   .to('.draw',{strokeDashoffset:0,duration:1.0,ease:'power2.inOut'},1.2)
   .from('.petal',{opacity:0,y:60,rotation:'-=35',stagger:.12,duration:.7,ease:'back.out(1.6)'},1.25)
   .to(camera,{scale:1.12,x:95,y:-35,duration:1.25,ease:'power2.inOut'},3.0)
   .to('.ribbon-main',{strokeWidth:108,duration:.8,ease:'sine.inOut',yoyo:true,repeat:1},4.5)
   .to('.p1',{x:36,y:-32,rotation:'+=18',duration:1.8,ease:'sine.inOut',yoyo:true,repeat:1},4.1)
   .to('.p2',{x:-54,y:28,rotation:'-=24',duration:2.1,ease:'sine.inOut',yoyo:true,repeat:1},4.1)
   .to(camera,{scale:1,x:0,y:0,duration:1.15,ease:'power3.out'},7.7);
},
3(){
 tl.from('.blob',{opacity:0,scale:.72,rotation:-6,transformOrigin:'50% 50%',duration:1.1,ease:'back.out(1.25)'},.2)
   .to('.draw',{strokeDashoffset:0,duration:1.4,ease:'power2.inOut'},.9)
   .from('.eco-svg path:not(.blob):not(.draw)',{opacity:0,scale:.4,transformOrigin:'50% 50%',stagger:.16,duration:.7,ease:'back.out(1.5)'},1.25)
   .to(camera,{scale:1.1,x:-90,y:20,duration:1.2,ease:'power2.inOut'},3.15)
   .to('.l1',{rotation:'+=12',x:22,y:-24,duration:1.8,ease:'sine.inOut',yoyo:true,repeat:1},4.25)
   .to('.l2',{rotation:'-=14',x:-18,y:18,duration:2.0,ease:'sine.inOut',yoyo:true,repeat:1},4.25)
   .to('.eco-svg',{rotation:2,scale:1.018,transformOrigin:'50% 50%',duration:2.0,ease:'sine.inOut',yoyo:true,repeat:1},4.15)
   .to(camera,{scale:1,x:0,y:0,duration:1.2,ease:'power3.out'},7.55);
},
4(){
 tl.from('.slash',{x:-2200,duration:.8,ease:'expo.out'},.1)
   .from('.industrial-grid',{opacity:0,scale:1.08,duration:.8,ease:'power2.out'},.35)
   .from('.slot',{opacity:0,x:110,stagger:.13,duration:.55,ease:'power4.out'},1.15)
   .to(camera,{scale:1.15,x:-120,y:10,rotation:.4,duration:1.05,ease:'power3.inOut'},2.9)
   .to('.s1',{x:180,duration:.42,ease:'power3.in'}).to('.s1',{x:0,duration:.65,ease:'back.out(1.4)'})
   .to('.s2',{y:-92,duration:.45,ease:'power3.inOut'},4.55).to('.s2',{y:0,duration:.65,ease:'power3.out'})
   .to('.slash',{skewY:-3,scaleX:1.04,duration:1.2,ease:'sine.inOut',yoyo:true,repeat:1},5.3)
   .to(camera,{scale:1,x:0,y:0,rotation:0,duration:1.15,ease:'power3.out'},7.65);
},
5(){
 tl.from('.glass-shell',{opacity:0,scale:.94,duration:.9,ease:'power3.out'},.2)
   .to('.draw',{strokeDashoffset:0,duration:1.6,ease:'power2.inOut'},.85)
   .from('.leaf',{opacity:0,scale:.25,transformOrigin:'50% 80%',stagger:.18,duration:.7,ease:'back.out(1.4)'},1.4)
   .to(camera,{scale:1.13,x:-70,y:30,duration:1.1,ease:'power2.inOut'},3.2)
   .to('.v1',{rotation:7,transformOrigin:'60% 90%',duration:1.6,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.v2',{rotation:-8,transformOrigin:'60% 90%',duration:1.8,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.v3',{rotation:6,transformOrigin:'40% 90%',duration:2.0,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.soft',{x:-80,scaleX:1.16,opacity:.55,duration:2.1,ease:'sine.inOut',yoyo:true,repeat:1},4.0)
   .to(camera,{scale:1,x:0,y:0,duration:1.15,ease:'power3.out'},7.7);
},
6(){
 tl.from('.flag-ribbon.red',{x:-2250,duration:.9,ease:'expo.out'},.12)
   .from('.flag-ribbon.white',{x:2250,duration:.95,ease:'expo.out'},.24)
   .to('.draw',{strokeDashoffset:0,duration:1.3,ease:'power2.inOut'},1.0)
   .to(camera,{scale:1.14,x:-100,y:0,duration:1.05,ease:'power3.inOut'},3.1)
   .to('.flag-ribbon.red',{y:-26,skewY:-3,duration:1.4,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.flag-ribbon.white',{y:24,skewY:-8,duration:1.6,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to(camera,{scale:1,x:0,y:0,duration:1.2,ease:'power3.out'},7.55);
},
7(){
 tl.from('.motif',{opacity:0,strokeDasharray:500,strokeDashoffset:500,duration:1.25,ease:'power2.out'},.2)
   .from('.calendar',{rotation:-3,duration:.95,ease:'back.out(1.3)'},.18)
   .to(camera,{scale:1.16,x:0,y:-45,duration:1.2,ease:'power2.inOut'},2.9)
   .to('.batik-field',{x:-120,y:55,duration:2.2,ease:'sine.inOut',yoyo:true,repeat:1},4.05)
   .to('.calendar',{borderRadius:'30px 170px 30px 170px',duration:1.2,ease:'power2.inOut',yoyo:true,repeat:1},4.55)
   .to(camera,{scale:1,x:0,y:0,duration:1.2,ease:'power3.out'},7.6);
},
8(){
 tl.from('.beam',{opacity:0,scaleY:.5,transformOrigin:'50% 100%',duration:1.0,ease:'power2.out'},.2)
   .from('.mon-body',{opacity:0,y:140,duration:.95,ease:'power4.out'},.65)
   .to('.draw',{strokeDashoffset:0,duration:1.25,ease:'power2.inOut'},1.1)
   .to(camera,{scale:1.13,x:-70,y:-28,duration:1.1,ease:'power2.inOut'},3.0)
   .to('.beam',{x:42,opacity:.78,duration:1.8,ease:'sine.inOut',yoyo:true,repeat:1},4.0)
   .to('.monument',{y:-24,scale:1.025,transformOrigin:'50% 100%',duration:1.6,ease:'sine.inOut',yoyo:true,repeat:1},4.4)
   .to(camera,{scale:1,x:0,y:0,duration:1.15,ease:'power3.out'},7.6);
},
9(){
 tl.from('.petal-big',{opacity:0,scale:.18,rotation:'-=28',stagger:.1,duration:.85,ease:'back.out(1.45)',transformOrigin:'30% 76%'},.5)
   .to(camera,{scale:1.12,x:-65,y:20,duration:1.1,ease:'power2.inOut'},3.1)
   .to('.pb1',{rotation:'-=8',duration:1.5,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.pb2',{rotation:'+=9',duration:1.7,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.pb3',{rotation:'-=7',duration:1.9,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.pb4',{rotation:'+=8',duration:1.8,ease:'sine.inOut',yoyo:true,repeat:1},4.2)
   .to('.soft',{scale:1.08,opacity:.72,duration:2.0,ease:'sine.inOut',yoyo:true,repeat:1},4.0)
   .to(camera,{scale:1,x:0,y:0,duration:1.1,ease:'power3.out'},7.7);
},
10(){
 tl.from('.star',{opacity:0,scale:.45,rotation:-24,transformOrigin:'50% 50%',duration:1.0,ease:'back.out(1.35)'},.45)
   .from('.fold',{opacity:0,duration:.7,ease:'power2.out'},1.05)
   .to('.draw',{strokeDashoffset:0,duration:1.35,ease:'power2.inOut'},1.0)
   .from('.sprig',{opacity:0,y:80,rotation:'-=20',stagger:.16,duration:.75,ease:'power3.out'},1.35)
   .to(camera,{scale:1.14,x:-90,y:-20,duration:1.15,ease:'power2.inOut'},3.05)
   .to('.folded-star',{rotation:7,scale:1.035,transformOrigin:'50% 50%',duration:1.8,ease:'sine.inOut',yoyo:true,repeat:1},4.25)
   .to('.sp1',{rotation:'-=9',duration:1.65,ease:'sine.inOut',yoyo:true,repeat:1},4.4)
   .to('.sp2',{rotation:'+=10',duration:1.85,ease:'sine.inOut',yoyo:true,repeat:1},4.4)
   .to(camera,{scale:1,x:0,y:0,duration:1.15,ease:'power3.out'},7.65);
}
};
animations[id]();
tl.to({}, {duration:.01}, 9.99);

gsap.ticker.add(()=>{debug.textContent=`concept ${id} · ${tl.time().toFixed(2)}s`;});
window.OPENER={W,H,DURATION,tl,ready:false,concept:c,seek(t){tl.pause();tl.time(Math.max(0,Math.min(DURATION,t)),false);},play(){tl.play();}};
Promise.resolve(document.fonts?.ready).then(()=>{window.OPENER.ready=true;if(!q.has('clean'))tl.play(0);});
tl.eventCallback('onComplete',()=>{if(!q.has('clean'))tl.play(0);});
})();