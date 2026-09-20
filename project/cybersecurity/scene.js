/* Original vector artwork. Locked camera and internal motion are deliberate for chroma-key compositing. */
const id=Number(new URLSearchParams(location.search).get('clip')||1);
const NS='http://www.w3.org/2000/svg', stage=document.querySelector('#stage');
const C={ink:'#09152c',deep:'#101d3b',edge:'#3267a8',blue:'#5799ff',ice:'#b9dcff',white:'#e9f3ff',violet:'#ad96ff',amber:'#ffb96e'};
const defs=`<defs>
<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bddbff"/><stop offset=".19" stop-color="#466d9c"/><stop offset=".48" stop-color="#102340"/><stop offset=".8" stop-color="#6c98ce"/><stop offset="1" stop-color="#142945"/></linearGradient>
<linearGradient id="face" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#233d68"/><stop offset=".48" stop-color="#14294b"/><stop offset="1" stop-color="#080f23"/></linearGradient>
<linearGradient id="core" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#588bca"/><stop offset=".38" stop-color="#243d72"/><stop offset="1" stop-color="#101a38"/></linearGradient>
<linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f2f7ff"/><stop offset=".35" stop-color="#9fbddd"/><stop offset=".7" stop-color="#43658f"/><stop offset="1" stop-color="#c7e1ff"/></linearGradient>
<linearGradient id="scan" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#88b7ff" stop-opacity="0"/><stop offset="1" stop-color="#88b7ff" stop-opacity=".24"/></linearGradient>
</defs><rect width="1920" height="1080" fill="#00ff00"/><g id="camera"><g id="world"></g></g>`;
stage.innerHTML=defs;
const world=document.querySelector('#world'), actions=[];
const el=(tag,a={},parent=world)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))n.setAttribute(k,v);parent.append(n);return n};
const group=(a={},p=world)=>el('g',a,p);
const path=(d,stroke=C.edge,w=2,fill='none',p=world,extra={})=>el('path',{d,stroke,'stroke-width':w,fill,'stroke-linecap':'round','stroke-linejoin':'round',...extra},p);
const line=(x1,y1,x2,y2,c=C.edge,w=2,p=world)=>el('line',{x1,y1,x2,y2,stroke:c,'stroke-width':w,'stroke-linecap':'round'},p);
const circle=(x,y,r,fill=C.ink,stroke=C.edge,w=2,p=world)=>el('circle',{cx:x,cy:y,r,fill,stroke,'stroke-width':w},p);
const rect=(x,y,w,h,r=8,fill=C.deep,stroke=C.edge,sw=2,p=world)=>el('rect',{x,y,width:w,height:h,rx:r,fill,stroke,'stroke-width':sw},p);
const cyc=(t,period=10,phase=0)=>(1-Math.cos(2*Math.PI*(t/period+phase)))/2;
const pulse=(n,period=5,phase=0,lo=.35)=>actions.push(t=>n.setAttribute('opacity',lo+(1-lo)*cyc(t,period,phase)));
function chamfer(x,y,w,h,c=18){return `M${x+c},${y}H${x+w-c}L${x+w},${y+c}V${y+h-c}L${x+w-c},${y+h}H${x+c}L${x},${y+h-c}V${y+c}Z`}
function plate(d,p=world){path(d,'#07101d',7,'#07101d',p,{transform:'translate(8 11)'});path(d,'#9bbce6',1.4,'url(#metal)',p);path(d,C.edge,1.5,'url(#face)',p,{transform:'scale(.955)'});}
function bolt(x,y,p=world){circle(x,y,5,'#142441','#6c8bb6',1,p);line(x-2,y+1,x+2,y-1,'#c2d4ec',1,p)}
function diode(x,y,p=world,phase=0,col=C.ice){rect(x-9,y-3,18,6,3,'#1c3c6b','none',0,p);const n=rect(x-7,y-2,14,4,2,col,'none',0,p);pulse(n,5,phase,.22);}
function route(d,p=world,phase=0,col=C.ice){const base=path(d,'#355985',2,'none',p);const n=path(d,col,3,'none',p,{'stroke-dasharray':'15 900'});const len=base.getTotalLength();n.setAttribute('stroke-dasharray',`14 ${Math.max(1,len-14)}`);actions.push(t=>n.setAttribute('stroke-dashoffset',-(t/5+phase)*len));}
function keyhole(x,y,s=1,p=world){path(`M${x-8*s},${y+7*s}a${13*s},${13*s} 0 1 1 ${16*s},0l${5*s},${27*s}h-${26*s}Z`,C.ice,1.5,C.ink,p)}
function lock(x,y,s=1,p=world){const g=group({transform:`translate(${x} ${y}) scale(${s})`},p);path('M-44,-14V-48C-44,-105 44,-105 44,-48V-14',C.ink,25,'none',g);path('M-44,-14V-48C-44,-105 44,-105 44,-48V-14','url(#silver)',16,'none',g);path(chamfer(-66,-22,132,113,14),'#accbfa',2,'url(#core)',g);path('M-53,-9H53',C.white,2,'none',g);keyhole(0,20,.7,g);return g;}
function ticks(r,count=60,p=world){for(let i=0;i<count;i++){let a=i*2*Math.PI/count,r2=r+(i%5===0?12:5);line(Math.sin(a)*r,Math.cos(a)*r,Math.sin(a)*r2,Math.cos(a)*r2,i%5===0?'#81a9dc':'#3b608a',i%5===0?2:1,p)}}
function arcs(r,p=world,col=C.blue){for(let i=0;i<4;i++){const a=(i*90+12)*Math.PI/180,b=(i*90+71)*Math.PI/180;path(`M${Math.cos(a)*r},${Math.sin(a)*r}A${r},${r} 0 0 1 ${Math.cos(b)*r},${Math.sin(b)*r}`,col,5,'none',p)}}
const right=[2,4,6,8,10].includes(id);world.setAttribute('transform',`translate(${right?1350:570} 540)`);
const names=['Circuit shield','Biometric scan','Encrypted vault','Packet firewall','Cloud lock','Cryptographic processor','Zero trust network','Secure document','Threat scanner','Hardware key'];
window.CLIP={id,name:names[id-1],camera:'LOCKED_INTENTIONAL',copyspace:right?'left':'right'};
function shield(){
 const d='M0,-290C85,-240 163,-236 240,-231L236,-42C231,129 157,232 0,307C-157,232 -231,129 -236,-42L-240,-231C-163,-236 -85,-240 0,-290Z';plate(d);
 path('M0,-258C70,-219 153,-204 206,-204L202,-44C198,105 133,202 0,272C-133,202 -198,105 -202,-44L-206,-204C-153,-204 -70,-219 0,-258Z','#4e7aaf',2);
 for(let s of [-1,1])for(let i=0;i<5;i++){const y=-165+i*64;route(`M${s*175},${y}H${s*128}L${s*97},${y+28}H${s*72}`,world,i*.17);circle(s*175,y,4,C.ice,'none');}
 for(let i=0;i<7;i++)diode(-66+i*22,203,world,i*.1);
 lock(0,-10,1.32);path('M-37,118l28,26 55,-59',C.white,8);
 for(let x of [-174,174])bolt(x,-200);for(let x of [-108,108])bolt(x,173);
}
function biometric(){
 plate('M-222,-289H146L243,-192V225L184,286H-209L-253,242V-256Z');
 path('M-210,-247H124L203,-168V196L158,244H-173L-212,205Z','#4b72a5',2,C.ink);
 const print=group();
 for(let i=0;i<13;i++){const w=162-i*11,h=211-i*13;let d=`M${-w},${111-i*6}C${-w-8},${30-i*4} ${-w-15},${-h} 0,${-h}C${w+20},${-h} ${w+9},${-25+i*3} ${w-15},${104-i*4}`;path(d,i%3===0?C.ice:'#5c86c5',3.3,'none',print);}
 for(let i=0;i<6;i++)path(`M${-79+i*22},${95+i*8}Q${-28+i*11},${175+i*3} ${35+i*18},${167+i*4}`,'#5c86c5',3.3);
 const scanner=group();rect(-186,-32,373,57,0,'url(#scan)','none',0,scanner);line(-188,26,188,26,C.white,2,scanner);actions.push(t=>scanner.setAttribute('transform',`translate(0 ${-185+350*cyc(t,10)})`));
 for(let k=0;k<4;k++){const g=group({transform:`rotate(${k*90})`});path('M-196,-178V-210H-161',C.ice,4,'none',g)}
 diode(0,267,world,0);bolt(-226,-235);bolt(-226,229);bolt(210,190);
}
function vault(){
 plate('M-183,-268H176L266,-181V180L179,266H-180L-270,177V-179Z');
 path(chamfer(-225,-226,450,451,57),'#587aa5',2,'#0a152b');
 circle(0,0,197,'url(#metal)','#9fc3ed',2);circle(0,0,180,'url(#face)','#263f66',5);ticks(151,64);
 const rotor=group();arcs(128,rotor);circle(0,0,111,'url(#core)','#a5c9ff',2,rotor);
 for(let i=0;i<6;i++){const g=group({transform:`rotate(${i*60})`},rotor);path('M-13,-78L-11,-29Q0,-16 11,-29L13,-78',C.ice,5,'none',g)}
 circle(0,0,31,'url(#silver)','#eff7ff',2,rotor);circle(0,0,14,C.ink,C.edge,2,rotor);
 actions.push(t=>rotor.setAttribute('transform',`rotate(${12*Math.sin(2*Math.PI*t/10)})`));
 for(let k=0;k<4;k++){const g=group({transform:`rotate(${k*90})`});const b=path(chamfer(-33,-235,66,42,8),'#658bb8',2,'url(#metal)',g);actions.push(t=>b.setAttribute('transform',`translate(0 ${8*cyc(t,5,k*.15)})`));}
 for(let x of [-190,190])for(let y of [-190,190])bolt(x,y);
}
function firewall(){
 plate('M-275,-207L-226,-264H217L269,-212V215L221,264H-221L-275,211Z');
 for(let row=0;row<5;row++)for(let c=0;c<4;c++){const x=-228+c*116+(row%2?13:0),y=-205+row*83;const g=group();path(chamfer(x,y,100,66,10),'#537fb5',1.5,'url(#core)',g);line(x+12,y+12,x+81,y+12,'#739ed8',1,g);const n=path(chamfer(x+7,y+7,86,52,7),C.blue,2,'none',g);pulse(n,5,(row*4+c)/20,.08);}
 for(let i=0;i<6;i++){const y=-170+i*65;const n=path(`M-24,-6H17L24,0L17,6H-24Z`,C.ice,1,C.blue);actions.push(t=>{let q=(t/5+i/6)%1; n.setAttribute('transform',`translate(${-260+520*q} ${y})`);n.setAttribute('opacity',Math.sin(Math.PI*q)**2*.9);});}
 const g=group({transform:'translate(169 206) scale(.52)'});path('M0,-95L78,-65V2Q70,77 0,103Q-70,77 -78,2V-65Z',C.ice,3,'url(#face)',g);path('M-34,5L-7,32L42,-27',C.white,9,'none',g);
}
function cloud(){
 const d='M-183,172C-325,174 -339,10 -236,-39C-254,-175 -90,-227 -18,-146C52,-282 244,-214 226,-75C344,-72 359,155 205,171Z';plate(d);
 path('M-200,132C-291,119 -284,27 -211,1C-215,-105 -108,-170 -22,-100C34,-209 191,-178 190,-48C283,-41 296,125 191,132Z','#456b9a',2);
 for(let i=0;i<7;i++){let x=-177+i*57;route(`M${x},102V${-15-(i%3)*28}L${x+24},${-39-(i%3)*28}`,world,i/7)}
 lock(0,-9,1.04);for(let i=0;i<5;i++){const y=204+i*22;path(`M${-85+i*10},${y}H${85-i*10}`,'#1c2e51',8);const n=path(`M${-71+i*10},${y}H${71-i*10}`,C.blue,3);pulse(n,5,i*.12,.25);}
}
function processor(){
 for(let i=0;i<4;i++){const g=group({transform:`rotate(${i*90})`});for(let j=0;j<10;j++){const x=-174+j*38;path(chamfer(x,-291,18,79,5),'#577aa5',1,'url(#silver)',g);}}
 plate('M-199,-232H196L230,-197V194L196,230H-195L-232,193V-198Z');
 path(chamfer(-186,-187,372,374,20),'#547fb0',2,C.ink);
 for(let s of [-1,1])for(let j=0;j<5;j++)route(`M${s*176},${-132+j*65}H${s*142}L${s*109},${-99+j*49}H${s*83}`,world,j*.1+s*.2);
 path(chamfer(-86,-100,172,204,15),'#96bfff',2,'url(#core)');
 for(let row=0;row<5;row++)for(let col=0;col<4;col++){const n=rect(-57+col*32,-66+row*32,15,15,3,C.blue,'none',0);pulse(n,5,(row*4+col)/20,.25);}
 for(let x of [-211,211])for(let y of [-211,211])bolt(x,y);
}
function network(){
 const d='M-229,-245H223L275,-187V175L215,247H-219L-280,181V-185Z';plate(d);
 const coords=[[-171,-158],[168,-145],[-192,48],[190,65],[-110,178],[95,178]];
 coords.forEach(([x,y],i)=>{route(`M${x},${y}H${x*.47}L${x*.20},${y*.24}L0,0`,world,i/6);const g=group({transform:`translate(${x} ${y})`});path(chamfer(-37,-31,74,62,10),'#739ed8',2,'url(#core)',g);for(let k=0;k<3;k++)diode(-19+k*19,3,g,i*.17+k*.2);line(-21,-13,21,-13,C.ice,2,g);});
 path('M0,-107L82,-69V5Q77,70 0,111Q-77,70 -82,5V-69Z','#b5d6ff',3,'url(#face)');lock(0,-4,.53);
}
function documentSafe(){
 path('M-221,-237H-55L-20,-193H227L250,-166V237H-250V-207Z','#09152c',8,'#09152c',world,{transform:'translate(8 10)'});
 path('M-221,-237H-55L-20,-193H227L250,-166V237H-250V-207Z','#7a9fc7',2,'url(#metal)');
 path('M-171,-187H79L151,-116V177H-171Z','#9dbde8',2,'url(#core)');path('M79,-187V-116H151','#91b5e9',2,'url(#face)');
 for(let i=0;i<7;i++){const w=i%3===0?158:207;line(-129,-91+i*30,-129+w,-91+i*30,'#43618d',5);const p=path(`M-129,${-91+i*30}h${w}`,C.ice,3,'none',world,{'stroke-dasharray':`${w} ${w}`});actions.push(t=>p.setAttribute('stroke-dashoffset',w*(.2+.8*cyc(t,10,i*.07))));}
 path('M-253,-30H-98L-63,13H263L229,253H-239Z','#779ac5',2,'url(#face)');path('M-235,-13H-106L-69,32H242','#c0dbff',2);
 lock(25,100,.73);for(let i=0;i<4;i++)diode(-165+i*25,202,world,i*.17);
}
function scanner(){
 plate('M-162,-270H161L274,-157V161L161,273H-161L-274,160V-161Z');
 circle(0,0,224,C.ink,'#5278ac',2);for(let r of [64,121,179])circle(0,0,r,'none','#2b4267',1.5);ticks(204,72);
 for(let a=0;a<4;a++){const g=group({transform:`rotate(${a*90})`});line(0,0,0,-191,'#29466e',1,g);}
 const sweep=group();for(let i=0;i<32;i++){const a=(-i*.012)-Math.PI/2;line(0,0,Math.cos(a)*197,Math.sin(a)*197,`rgba(103,154,255,${.02+i*.004})`,4,sweep);}line(0,0,0,-198,C.ice,2,sweep);actions.push(t=>sweep.setAttribute('transform',`rotate(${t*36})`));
 [[-83,-97],[136,-59],[54,150],[-150,33]].forEach(([x,y],i)=>{const g=group({transform:`translate(${x} ${y})`});path('M-10,-15H8L15,-8V10L8,16H-9L-16,8V-9Z',C.blue,2,C.ink,g);const n=circle(0,0,4,C.white,'none',0,g);pulse(n,5,i*.2,.1);});
 circle(0,0,19,'url(#metal)',C.ice,1);circle(0,0,6,C.white,'none');
}
function hardwareKey(){
 const g=group({transform:'rotate(-30)'});
 const d='M-166,-109H-55L-14,-68V-31H232L261,-5V43L235,70H203V41H166V70H128V39H-14V73L-53,112H-166L-219,62V-57Z';
 path(d,C.ink,7,C.ink,g,{transform:'translate(7 10)'});path(d,'#bad6ff',2,'url(#metal)',g);path(d,'#466c9a',2,'url(#face)',g,{transform:'scale(.95)'});
 path('M-157,-68H-76L-50,-41V47L-79,75H-157L-181,48V-42Z','#98bdec',2,'url(#core)',g);
 path('M-143,-42H-94L-75,-23V27L-94,46H-143L-160,27V-22Z',C.ink,7,'#00ff00',g);
 for(let i=0;i<3;i++)route(`M-15,${-12+i*17}H215`,g,i*.2);for(let i=0;i<4;i++)diode(-116+i*20,93,g,i*.2);
 bolt(-196,0,g);bolt(235,19,g);
 for(let i=0;i<3;i++)diode(68+i*45,-20,g,i*.23);
}
[shield,biometric,vault,firewall,cloud,processor,network,documentSafe,scanner,hardwareKey][id-1]();
const clock={t:0};const tl=gsap.timeline({paused:true}).to(clock,{t:10,duration:10,ease:'none',onUpdate:()=>{for(const f of actions)f(clock.t)}});
window.OPENER={ready:true,DURATION:10,tl,seek(t){tl.time(Math.max(0,Math.min(10,t)),false);for(const f of actions)f(Math.max(0,Math.min(10,t)));}};
window.OPENER.seek(0);
