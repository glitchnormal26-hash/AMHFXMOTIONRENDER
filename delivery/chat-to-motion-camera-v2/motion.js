(()=>{
const DURATION=18,prompt='Buatkan animasi Flappy Bird menggunakan skill AMHFXMOTIONRENDER.',$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,p)=>a+(b-a)*p,seg=(t,a,b)=>clamp((t-a)/(b-a)),smooth=p=>{p=clamp(p);return p*p*(3-2*p)},out3=p=>1-Math.pow(1-clamp(p),3),in3=p=>Math.pow(clamp(p),3),pop=p=>{p=clamp(p);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2)},speedRamp=p=>{p=clamp(p);if(p<.18){const u=p/.18;return .12*in3(u)}if(p<.72){const u=(p-.18)/.54;return .12+.76*u}const u=(p-.72)/.28;return .88+.12*out3(u)},show=(el,o)=>el.style.opacity=String(clamp(o)),tf=(el,x=0,y=0,s=1,r=0)=>el.style.transform=`translate3d(${x}px,${y}px,0) scale(${s}) rotate(${r}deg)`;
const viewport=$('#viewport'),camera=$('#camera'),chat=$('#chat'),skill=$('#skillCard'),cursor=$('#cursor'),engine=$('#engine'),heroA=$('#heroA'),heroB=$('#heroB'),final=$('#final'),scrim=$('#scrim'),flash=$('#flash'),scan=$('#scan'),route=$('#route'),bird=$('#bird'),wing=$('.wing'),meters=$$('.meter i'),tokens=$$('.token'),pulse=$('#pulseRing');
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);viewport.style.transform=`translate(-50%,-50%) scale(${s})`}addEventListener('resize',fit);fit();if(new URLSearchParams(location.search).has('debug'))document.body.classList.add('debug');
function lerpState(a,b,p){p=clamp(p);return {tx:mix(a.tx,b.tx,p),ty:mix(a.ty,b.ty,p),s:mix(a.s,b.s,p),r:mix(a.r||0,b.r||0,p),mode:b.mode||a.mode,ramp:b.ramp||a.ramp||'OFF'}}
function birdY(t){return 226+Math.sin(Math.max(0,t-9.25)*6.5)*55}
function camBeat(t){let st={tx:960,ty:540,s:1,r:0,mode:'LOCKED_INTENTIONAL',ramp:'OFF'};
  if(t<2.25)return st;
  if(t<3.08){const p=speedRamp(seg(t,2.25,3.08));return lerpState(st,{tx:1580,ty:820,s:1.18,r:.45,mode:'REFRAME',ramp:'ACTIVE'},p)}
  if(t<4.68){const p=speedRamp(seg(t,3.08,4.68)),ax=mix(1580,560,p);return {tx:ax,ty:810,s:mix(1.18,1.34,p),r:mix(.45,-.35,p),mode:'TRACKING',ramp:'ACTIVE'}}
  if(t<5.38){const p=speedRamp(seg(t,4.68,5.38));return lerpState({tx:560,ty:810,s:1.34,r:-.35,mode:'TRACKING',ramp:'ACTIVE'},{tx:520,ty:805,s:1.76,r:0,mode:'REFRAME',ramp:'ACTIVE'},p)}
  if(t<5.94){const p=in3(seg(t,5.38,5.94));return lerpState({tx:520,ty:805,s:1.76,r:0,mode:'MOVING',ramp:'ACTIVE'},{tx:520,ty:805,s:2.28,r:0,mode:'MOVING',ramp:'ACTIVE'},p)}
  if(t<6.62){const p=speedRamp(seg(t,5.94,6.62));return lerpState({tx:520,ty:805,s:2.28,r:0,mode:'MOVING',ramp:'ACTIVE'},{tx:1280,ty:520,s:1.04,r:-.45,mode:'REFRAME',ramp:'ACTIVE'},p)}
  if(t<8.75){const p=smooth(seg(t,6.62,8.75));return lerpState({tx:1280,ty:520,s:1.04,r:-.45,mode:'REFRAME',ramp:'OFF'},{tx:1380,ty:505,s:1.22,r:.35,mode:'REFRAME',ramp:'OFF'},p)}
  if(t<9.48){const p=speedRamp(seg(t,8.75,9.48));return lerpState({tx:1380,ty:505,s:1.22,r:.35,mode:'REFRAME',ramp:'ACTIVE'},{tx:1740,ty:530,s:1.88,r:0,mode:'MOVING',ramp:'ACTIVE'},p)}
  if(t<12.55){const lagT=Math.max(9.25,t-.11),by=birdY(lagT),lead=54;return {tx:1634,ty:155+108+by+28,s:1.9+Math.sin((t-9.48)*1.4)*.025,r:Math.sin((t-9.48)*1.15)*.3,mode:'TRACKING',ramp:'OFF'}}
  if(t<13.62){const p=speedRamp(seg(t,12.55,13.62));return lerpState({tx:1634,ty:155+108+birdY(12.44)+28,s:1.9,r:0,mode:'TRACKING',ramp:'ACTIVE'},{tx:1350,ty:535,s:.93,r:-.35,mode:'MOVING',ramp:'ACTIVE'},p)}
  if(t<15.25){const p=smooth(seg(t,13.62,15.25));return lerpState({tx:1350,ty:535,s:.93,r:-.35,mode:'REFRAME',ramp:'OFF'},{tx:850,ty:520,s:.86,r:0,mode:'REFRAME',ramp:'OFF'},p)}
  const p=out3(seg(t,15.25,18));return lerpState({tx:850,ty:520,s:.86,r:0,mode:'LOCKED_INTENTIONAL',ramp:'OFF'},{tx:830,ty:515,s:.92,r:0,mode:'REFRAME',ramp:'OFF'},p)
}
function applyCamera(st){const x=960-st.tx*st.s,y=540-st.ty*st.s;camera.style.transform=`translate3d(${x}px,${y}px,0) scale(${st.s}) rotate(${st.r}deg)`;window.__CAMERA_STATE={...st,x,y};$('#debug').textContent=`${st.mode}  x:${x.toFixed(0)} y:${y.toFixed(0)} z:${st.s.toFixed(2)}  ramp:${st.ramp}`}
function reset(){[chat,skill,cursor,engine,heroA,heroB,final,scrim,route,pulse].forEach(el=>show(el,0));show(flash,0);show(scan,0);show($('#botBubble'),0);show($('#dropHint'),0);tokens.forEach(x=>show(x,0));meters.forEach(x=>x.style.transform='scaleX(0)');$('#composer').style.borderColor='#343e49';$('#composer').style.boxShadow='none';$('.composer .placeholder').style.opacity='1';engine.style.transform='';skill.style.transform='';cursor.style.transform='';bird.style.opacity='0';bird.style.transform='';$('#pipeTop').style.transform='';$('#pipeBottom').style.transform='';$('#buildState').textContent='WAITING'}
function seek(t){t=clamp(t,0,DURATION);reset();applyCamera(camBeat(t));
  const ci=out3(seg(t,0,.55));show(chat,ci);tf(chat,mix(-70,0,ci),mix(20,0,ci),mix(.97,1,ci),0);
  const typed=seg(t,.55,2.55),n=Math.floor(prompt.length*typed);$('#typingText').textContent=prompt.slice(0,n);$('#caret').style.opacity=t<2.75&&Math.floor(t*4)%2===0?'1':'0';
  const si=pop(seg(t,2.15,2.62));show(skill,seg(t,2.08,2.42));tf(skill,0,mix(55,0,si),mix(.9,1,si),0);show(cursor,out3(seg(t,.25,.55)));
  let cx=790,cy=760;if(t<2.85){const p=out3(seg(t,.45,2.85));cx=mix(820,1625,p);cy=mix(760,830,p)}else if(t<4.68){const p=speedRamp(seg(t,3.08,4.68));cx=mix(1625,540,p);cy=mix(830,812,p);tf(skill,mix(0,-1000,p),mix(0,10,p),1+Math.sin(p*Math.PI)*.025,mix(0,-2,p));show(route,out3(seg(t,2.9,3.28))*(1-smooth(seg(t,4.45,4.92))))}else{cx=540;cy=812;tf(skill,-1000,10,.88,0);show(skill,1-seg(t,4.68,5.04))}
  tf(cursor,cx,cy,1,t>3.08&&t<4.68?-8:0);const over=t>=4.08&&t<5.05;$('.composer .placeholder').style.opacity=over?'0':'1';show($('#dropHint'),over?1:0);if(over){$('#composer').style.borderColor='#d8ff45';$('#composer').style.boxShadow='0 0 0 2px rgba(216,255,69,.14),0 0 34px rgba(216,255,69,.12)'}
  const dropHit=1-Math.abs(seg(t,4.68,4.98)*2-1);show(pulse,dropHit);tf(pulse,mix(-20,40,dropHit),0,mix(.2,1.45,dropHit),0);show(flash,dropHit*.32);show($('#botBubble'),out3(seg(t,4.92,5.32)));
  const chatOut=smooth(seg(t,5.45,6.18));show(chat,1-chatOut);show(skill,0);show(cursor,1-smooth(seg(t,5.08,5.5)));
  const tokenStarts=[[575,360],[600,420],[530,480],[650,540]],tokenEnds=[[1230,300],[1420,310],[1240,375],[1430,385]];tokens.forEach((tok,i)=>{const p=speedRamp(seg(t,5.15+i*.08,6.42+i*.05)),q=1-seg(t,7.25,7.65);show(tok,p*q);tf(tok,mix(tokenStarts[i][0],tokenEnds[i][0],p)-parseFloat(getComputedStyle(tok).left),mix(tokenStarts[i][1],tokenEnds[i][1],p)-parseFloat(getComputedStyle(tok).top),mix(.86,1,p),mix(-5,0,p))});
  const ei=out3(seg(t,6.0,6.62));show(engine,ei);tf(engine,mix(130,0,ei),0,mix(.96,1,ei),0);show(scrim,out3(seg(t,6.25,6.62))*(1-smooth(seg(t,9.0,9.35))));const hA=out3(seg(t,6.38,6.88))*(1-smooth(seg(t,8.15,8.65)));show(heroA,hA);tf(heroA,0,mix(28,0,out3(seg(t,6.38,6.88))),1,0);
  meters.forEach((m,i)=>m.style.transform=`scaleX(${out3(seg(t,6.4+i*.36,7.45+i*.36))})`);if(t>6.35)$('#buildState').textContent='BUILDING';
  const bIn=pop(seg(t,7.35,7.92));show(bird,bIn);tf(bird,mix(42,0,bIn),mix(24,0,bIn),mix(.2,1,bIn),mix(-18,0,bIn));$('#pipeTop').style.transform=`translateX(${mix(175,0,out3(seg(t,7.55,8.22)))}px)`;$('#pipeBottom').style.transform=`translateX(${mix(175,0,out3(seg(t,7.68,8.34)))}px)`;
  const hB=out3(seg(t,8.35,8.78))*(1-smooth(seg(t,9.25,9.58)));show(heroB,hB);tf(heroB,0,mix(32,0,out3(seg(t,8.35,8.78))),1,0);
  if(t>=9.25){const gt=t-9.25,by=birdY(t),br=Math.cos(gt*6.5)*8;tf(bird,0,by-226,1,br);wing.style.transform=`rotate(${Math.sin(gt*18)*24-12}deg)`;const px=430-((gt*200)%720);$('#pipeTop').style.left=px+'px';$('#pipeBottom').style.left=px+'px';$('#score').textContent=String(Math.max(0,Math.floor(gt/1.0))).padStart(2,'0');$('#buildState').textContent='READY'}
  const scanP=seg(t,12.45,13.1);show(scan,scanP*(1-scanP)*4);scan.style.top=mix(150,930,scanP)+'px';
  const engOut=smooth(seg(t,13.2,14.35));show(engine,(t<6?0:1)*(1-engOut));const fIn=out3(seg(t,14.15,14.72));show(final,fIn);tf(final,0,mix(40,0,fIn),1,0);scrim.style.opacity=String(clamp(out3(seg(t,13.8,14.3))));
}
window.OPENER={ready:true,DURATION,seek,cameraState:()=>window.__CAMERA_STATE};seek(Number(new URLSearchParams(location.search).get('t')||0));
})();
