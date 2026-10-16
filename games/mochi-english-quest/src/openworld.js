/* ============================================================
   OPEN WORLD 2.5D — jelajah bebas dunia isometrik
   (karakter berlapis, siang-malam, cuaca, desa, monster, peti, kristal kata)
   ============================================================ */
const SPR={};
const OWX={};   // cache gambar dunia
/* ---------- sprite berlapis: punggung / badan / kepala ---------- */
function sprImg(key,expr,layer){
  const id=key+'|'+expr+'|'+(layer||'all')+(key==='mochi'?'|'+lookSig():'');
  let sp=SPR[id];
  if(!sp){
    let svg=key.indexOf('pet:')===0?petSVG(key.slice(4),expr):art(key,expr,false,layer);
    const m=/viewBox="([^"]+)"/.exec(svg||'');
    sp={im:new Image(),cv:null,vb:m?m[1].split(' ').map(Number):[0,0,200,200]};
    if(m){svg=svg.replace('<svg ','<svg width="'+Math.round(sp.vb[2]*1.3)+'" height="'+Math.round(sp.vb[3]*1.3)+'" ');}
    sp.im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
    SPR[id]=sp;
  }
  if(!sp.cv&&sp.im.complete&&sp.im.naturalWidth){
    try{const c=document.createElement('canvas');c.width=sp.im.naturalWidth;c.height=sp.im.naturalHeight;c.getContext('2d').drawImage(sp.im,0,0);sp.cv=c;}catch(e){sp.cv=sp.im;}
  }
  return sp.cv?sp:null;
}
const isHuman=key=>{const s=CAST[key]||FOES[key];return !!(s&&s.k==='h');};
/* gambar satu karakter di titik kaki (x,y) setinggi h. o: {flip,turn,walk,moving,t,away,vx,seed,hop,tint} */
function drawChar(ctx,key,x,y,h,o){
  o=o||{};
  const t=o.t||0,seed=o.seed||0,mv=o.moving?1:0;
  const turn=o.turn==null?(o.flip?-1:1):o.turn;
  if(!isHuman(key)){
    const sp=sprImg(key,o.expr||'happy');
    if(!sp)return;
    const u=h/sp.vb[3],w=sp.vb[2]*u;
    const sq=1+Math.sin(t*5+seed)*.04*(mv?2:1),hop=mv?Math.abs(Math.sin(o.walk||t*6))*h*.08:Math.sin(t*2+seed)*h*.012;
    ctx.fillStyle='rgba(30,20,70,.24)';ctx.beginPath();ctx.ellipse(x,y,w*.3,h*.06,0,0,7);ctx.fill();
    ctx.save();ctx.translate(x,y-hop);ctx.scale(turn*(2-sq),sq);
    ctx.drawImage(sp.cv,-w/2,-h*0.97,w,h);
    ctx.restore();
    return;
  }
  const away=!!o.away,blink=((t+seed*1.7)%4.3)<.13;
  const sb=sprImg(key,'happy','back'),so=sprImg(key,'happy','body'),sh=sprImg(key,away?'away':(o.expr&&o.expr!=='happy'?o.expr:(blink?'blink':'happy')),'head');
  if(!sb||!so||!sh)return;
  const vb=so.vb,u=h/200,W=vb[2]*u,Hh=vb[3]*u;
  const ux=px=>(px-100)*u,uy=py=>(py-214)*u;
  const walk=o.walk||0,lean=(o.vx||0)*.07*(mv?1:0);
  const bounce=mv?Math.abs(Math.sin(walk))*h*.05:Math.sin(t*2+seed)*h*.008;
  const sway=mv?Math.sin(walk)*.05:Math.sin(t*1.7+seed)*.02;
  const hair=(mv?-lean*1.3:0)+Math.sin(t*2.3+seed)*.025;
  const headRot=Math.sin(t*1.4+seed)*.03+(mv?Math.sin(walk-.9)*.04:0)-lean*.4;
  const breathe=1+Math.sin(t*2.6+seed)*.014+(mv?Math.sin(walk*2)*.02:0);
  const hop=o.hop||0;
  ctx.fillStyle='rgba(30,20,70,.26)';ctx.beginPath();ctx.ellipse(x,y,h*.24*(1-hop*.002),h*.055,0,0,7);ctx.fill();
  ctx.save();
  ctx.translate(x,y-bounce-hop);
  ctx.scale(turn,1);
  ctx.rotate(lean+sway*.4);
  const layer=(sp,px,py,rot,sx,sy,dy)=>{
    ctx.save();ctx.translate(ux(px),uy(py)+(dy||0));ctx.rotate(rot||0);ctx.scale(sx||1,sy||1);ctx.translate(-ux(px),-uy(py));
    ctx.drawImage(sp.cv,ux(vb[0]),uy(vb[1]),W,Hh);
    ctx.restore();
  };
  if(!away)layer(sb,100,110,hair);
  layer(so,100,214,0,1/breathe,breathe);
  if(away)layer(sb,100,110,hair);
  layer(sh,100,152,headRot,1,1,-Math.abs(Math.sin(walk-.9))*h*.012*mv-Math.sin(t*2.6+seed)*h*.006);
  ctx.restore();
}
/* ---------- noise ---------- */
function mkRng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function h2(x,y,s){let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296;}
function vn(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=h2(xi,yi,s),b=h2(xi+1,yi,s),c=h2(xi,yi+1,s),d=h2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,y,s,o){let v=0,a=.5,f=1,n=0;for(let i=0;i<o;i++){v+=vn(x*f,y*f,s+i*17)*a;n+=a;a*=.5;f*=2;}return v/n;}

/* ---------- pembuatan dunia ---------- */
const OWN=80;
const T_DEEP=0,T_WATER=1,T_SAND=2,T_GRASS=3,T_FOREST=4,T_SNOW=5,T_DESERT=6,T_PATH=7,T_ROCK=8,T_COBBLE=9,T_SAKURA=10;
const BIOME_NAME={2:'Pantai',3:'Padang Hijau',4:'Hutan',5:'Salju',6:'Gurun',7:'Jalan',8:'Pegunungan',9:'Desa',10:'Taman Sakura',1:'Laut',0:'Laut'};
const VILLAGE_NAMES={3:['Desa Padang','Meadow Village'],4:['Dusun Rimba','Forest Hamlet'],5:['Dusun Salju','Snow Hamlet'],6:['Kota Oasis','Oasis Town'],2:['Pelabuhan','Harbor Town'],10:['Taman Sakura','Sakura Garden']};
const OW_NPC_KEYS=['kai','sari','luna','bima','pip','foxy','teo','nana','beni','cici','omba','dita','lia','uja'];
const OW_SIGNS=[['Welcome!','Selamat datang!'],['Good morning!','Selamat pagi!'],['Have a nice day!','Semoga harimu menyenangkan!'],['Be kind to everyone.','Berbuat baiklah pada semua orang.'],['Read a book today.','Bacalah buku hari ini.'],['Keep learning!','Terus belajar!']];
function owGen(seed){
  const N=OWN,c=N/2;
  const type=new Uint8Array(N*N),hl=new Uint8Array(N*N),B=new Uint8Array(N*N);
  const at=(x,y)=>y*N+x;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const nx=x/N*4.4,ny=y/N*4.4,d=Math.hypot((x-c)/c,(y-c)/c),ds=Math.hypot(x-c,y-c);
    let e=fbm(nx,ny,seed,4)*.64+(1-Math.pow(d,1.65))*.6-.04;
    if(ds<10)e=Math.max(e,.55);
    const mt=fbm(nx*1.7+9,ny*1.7+4,seed+7,3),tp=fbm(nx*.62+20,ny*.62+3,seed+5,2),ms=fbm(nx*.9+5,ny*.9+30,seed+11,2),sk=fbm(nx*.8+40,ny*.8+8,seed+13,2);
    let t;
    if(e<.30)t=T_DEEP;
    else if(e<.37)t=T_WATER;
    else if(e<.42)t=T_SAND;
    else if(e>.54&&mt>.64&&ds>15){t=T_ROCK;hl[at(x,y)]=Math.min(3,1+Math.floor((mt-.64)*10+(e-.54)*4));}
    else if(tp<.37&&ds>14)t=T_SNOW;
    else if(tp>.64&&ms<.55&&ds>14)t=T_DESERT;
    else if(sk>.64)t=T_SAKURA;
    else if(ms>.58)t=T_FOREST;
    else t=T_GRASS;
    type[at(x,y)]=t;
  }
  const walk=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&type[at(x,y)]>=T_SAND&&type[at(x,y)]!==T_ROCK;
  // jangkauan dari titik awal
  const reach=new Uint8Array(N*N),q=[at(c,c)];reach[q[0]]=1;
  for(let i=0;i<q.length;i++){const p=q[i],x=p%N,y=(p/N)|0;[[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{const nx=x+d[0],ny=y+d[1];if(walk(nx,ny)&&!reach[at(nx,ny)]){reach[at(nx,ny)]=1;q.push(at(nx,ny));}});}
  // pulau kecil tak terjangkau jadi pasir/dangkal biar rapi
  const rnd=mkRng(seed*7+3);
  const W={N,type,hl,B,reach,seed,villages:[],objs:[],objAt:new Map(),chests:[],crystals:[],mons:[],npcs:[],signs:[],lights:[],spawn:{x:c+.5,y:c+4.5},walk};
  // desa
  const cand=(x,y)=>{
    let ok=0,tot=0;
    for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){tot++;const xx=x+dx,yy=y+dy;if(walk(xx,yy)&&reach[at(xx,yy)])ok++;}
    return ok/tot>.97;
  };
  const sites=[{x:c,y:c}];
  let tries=0;
  while(sites.length<4&&tries++<3000){
    const x=8+Math.floor(rnd()*(N-16)),y=8+Math.floor(rnd()*(N-16));
    if(!cand(x,y))continue;
    if(sites.some(s=>Math.hypot(s.x-x,s.y-y)<(sites.length===1?18:20)))continue;
    sites.push({x,y});
  }
  const npcPool=shuffleSeed(OW_NPC_KEYS.slice(),rnd);
  sites.forEach((s,i)=>{
    const bt=type[at(s.x,s.y)];
    const nm=i===0?['Desa Mochi','Mochi Village']:(VILLAGE_NAMES[bt]||['Desa Baru','New Village']);
    const v={id:i,x:s.x+.5,y:s.y+.5,cx:s.x,cy:s.y,name:nm[0],en:nm[1],biome:bt,houses:[],npcKeys:[npcPool.pop(),npcPool.pop(),npcPool.pop()]};
    W.villages.push(v);
    for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
      if(Math.abs(dx)+Math.abs(dy)>5)continue;
      const k=at(s.x+dx,s.y+dy);if(type[k]!==T_ROCK&&type[k]>=T_SAND)type[k]=T_COBBLE;
    }
    const spots=[[-5,-4],[3,-5],[-5,3],[4,3]];
    spots.forEach((o,j)=>{
      const hx=s.x+o[0],hy=s.y+o[1];
      let free=true;for(let a=0;a<2;a++)for(let b=0;b<2;b++)if(!walk(hx+a,hy+b))free=false;
      if(!free)return;
      v.houses.push({x:hx,y:hy,v:(i+j)%5});
      for(let a=0;a<2;a++)for(let b=0;b<2;b++){B[at(hx+a,hy+b)]=1;if(type[at(hx+a,hy+b)]!==T_COBBLE)type[at(hx+a,hy+b)]=T_GRASS===bt?T_GRASS:type[at(hx+a,hy+b)];}
    });
    B[at(s.x,s.y)]=1; // air mancur
    W.lights.push({x:v.x,y:v.y,r:90,c:'255,230,150',n:0});
  });
  W.villages.forEach(v=>v.houses.forEach(h=>W.lights.push({x:h.x+1,y:h.y+1.6,r:70,c:'255,210,120',n:1})));
  // jalan antar desa (BFS)
  const bfsPath=(a,b)=>{
    const prev=new Int32Array(N*N).fill(-1),s0=at(a.cx,a.cy),qq=[s0];prev[s0]=s0;
    for(let i=0;i<qq.length;i++){const p=qq[i];if(p===at(b.cx,b.cy))break;const x=p%N,y=(p/N)|0;
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{const nx=x+d[0],ny=y+d[1];if(walk(nx,ny)&&!B[at(nx,ny)]&&prev[at(nx,ny)]<0){prev[at(nx,ny)]=p;qq.push(at(nx,ny));}});}
    const path=[];let p=at(b.cx,b.cy);if(prev[p]<0)return path;
    while(p!==s0){path.push(p);p=prev[p];}
    return path;
  };
  for(let i=1;i<W.villages.length;i++){
    bfsPath(W.villages[i-1],W.villages[i]).forEach(p=>{
      for(let dx=0;dx<2;dx++){const k=p+dx;if(type[k]>=T_SAND&&type[k]!==T_ROCK&&type[k]!==T_COBBLE&&!B[k])type[k]=T_PATH;}
    });
  }
  const nearVillage=(x,y,r)=>W.villages.some(v=>Math.hypot(v.x-x,v.y-y)<r);
  // objek dekorasi
  const add=(t,k,x,y,s,block)=>{
    const o={t,k,x,y,s:s||1,ph:rnd()*6.28,block:!!block};
    W.objs.push(o);const key=Math.floor(y)*N+Math.floor(x);
    if(!W.objAt.has(key))W.objAt.set(key,[]);W.objAt.get(key).push(o);
    if(block)B[key]=1;
    return o;
  };
  W.add=add;
  for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){
    const k=at(x,y),t=type[k];
    if(t<T_SAND||t===T_ROCK||t===T_PATH||t===T_COBBLE||B[k])continue;
    if(nearVillage(x+.5,y+.5,7.5))continue;
    const r=h2(x,y,seed+99),r2=h2(x,y,seed+123),px=x+.2+r2*.6,py=y+.2+h2(x,y,seed+5)*.6;
    if(t===T_GRASS){
      if(r<.05)add('tree',(r2*3)|0,px,py,.85+r2*.4,true);
      else if(r<.09)add('bush',(r2*3)|0,px,py,.8+r2*.5);
      else if(r<.22)add('flower',(r2*6)|0,px,py,.8+r2*.5);
      else if(r<.235)add('rock',(r2*2)|0,px,py,.8+r2*.4,true);
      else if(r<.245)add('mush',0,px,py,1);
    }else if(t===T_FOREST){
      if(r<.30)add('tree',3+((r2*3)|0),px,py,.95+r2*.5,true);
      else if(r<.37)add('bush',(r2*3)|0,px,py,.9);
      else if(r<.41)add('mush',0,px,py,1);
    }else if(t===T_SAKURA){
      if(r<.13)add('tree',6,px,py,.95+r2*.4,true);
      else if(r<.26)add('flower',(r2*6)|0,px,py,.8);
    }else if(t===T_SNOW){
      if(r<.14)add('pine',(r2*2)|0,px,py,.9+r2*.5,true);
      else if(r<.17)add('rock',2,px,py,.9,true);
    }else if(t===T_DESERT){
      if(r<.055)add('cactus',(r2*2)|0,px,py,.9+r2*.4,true);
      else if(r<.09)add('rock',3,px,py,.9,true);
      else if(r<.13)add('dead',0,px,py,1);
    }else if(t===T_SAND){
      if(r<.025)add('palm',(r2*2)|0,px,py,1+r2*.3,true);
      else if(r<.06)add('shell',(r2*2)|0,px,py,1);
    }
  }
  // peti, kristal, monster, bos
  const free=(x,y)=>walk(x,y)&&reach[at(x,y)]&&!B[at(x,y)]&&type[at(x,y)]!==T_COBBLE&&!nearVillage(x+.5,y+.5,9);
  const spotTry=(n,minD,list,fn)=>{let g=0;while(list.length<n&&g++<4000){const x=3+Math.floor(rnd()*(N-6)),y=3+Math.floor(rnd()*(N-6));if(!free(x,y))continue;if(list.some(o=>Math.hypot(o.x-x-.5,o.y-y-.5)<minD))continue;list.push(fn(x+.5,y+.5,list.length));}};
  spotTry(16,11,W.chests,(x,y,i)=>({id:'c'+i,x,y}));
  spotTry(80,4.2,W.crystals,(x,y,i)=>({id:'w'+i,x,y,w:ALLW[Math.floor(h2(i,7,seed)*ALLW.length)]}));
  // bos: jauh dari desa & satu sama lain
  const bossT=['king','gboo','drago','muddle'],bosses=[];
  let g=0;
  while(bosses.length<bossT.length&&g++<6000){
    const x=3+Math.floor(rnd()*(N-6)),y=3+Math.floor(rnd()*(N-6));
    if(!free(x,y))continue;
    if(Math.hypot(x-c,y-c)<22)continue;
    if(bosses.some(b=>Math.hypot(b.x-x,b.y-y)<18))continue;
    bosses.push({x:x+.5,y:y+.5});
  }
  bosses.forEach((b,i)=>W.mons.push({id:'b'+i,k:bossT[i],boss:true,hx:b.x,hy:b.y,x:b.x,y:b.y,hp:5,home:{x:b.x,y:b.y}}));
  const typeFor=t=>t===T_SNOW?['shade','inky']:t===T_DESERT?['dragonet','crab']:t===T_SAND?['crab','slime']:t===T_FOREST?['boo','inky','slime']:t===T_SAKURA?['boo','slime']:['slime','slime','inky'];
  let mi=0;g=0;
  while(mi<30&&g++<6000){
    const x=3+Math.floor(rnd()*(N-6)),y=3+Math.floor(rnd()*(N-6));
    if(!free(x,y))continue;
    if(W.mons.some(o=>Math.hypot(o.hx-x-.5,o.hy-y-.5)<6))continue;
    const ty=typeFor(type[at(x,y)]);
    W.mons.push({id:'m'+mi,k:ty[Math.floor(rnd()*ty.length)],boss:false,hx:x+.5,hy:y+.5,x:x+.5,y:y+.5,hp:3,home:{x:x+.5,y:y+.5}});
    mi++;
  }
  // papan nama di tiap desa
  W.villages.forEach((v,i)=>{
    const sg=OW_SIGNS[(seed+i*3)%OW_SIGNS.length];
    W.signs.push({x:v.x+3.6,y:v.y+4.4,en:sg[0],id:sg[1],village:i});
    add('sign',0,v.x+3.6,v.y+4.4,1,true);
  });
  // peta mini
  const mm=document.createElement('canvas');mm.width=N*2;mm.height=N*2;const mc=mm.getContext('2d');
  const MMC={0:'#2a6fa8',1:'#4aa7cf',2:'#f0dc9e',3:'#7fcf6a',4:'#4c9c5a',5:'#eef6ff',6:'#e8c677',7:'#c99b6a',8:'#8e8a9c',9:'#c4bfd2',10:'#f2a6c6'};
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){mc.fillStyle=MMC[type[at(x,y)]];mc.fillRect(x*2,y*2,2,2);}
  W.mm=mm;
  return W;
}
function shuffleSeed(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ---------- aset gambar dunia (digambar sekali, disimpan) ---------- */
const TW=64,TH=32;
function mkCv(w,h,ax,ay,fn){
  const c=document.createElement('canvas');c.width=w*2;c.height=h*2;
  const g=c.getContext('2d');g.scale(2,2);g.translate(ax,ay);fn(g);
  return {c,w,h,ax,ay};
}
const rgrad=(g,x,y,r,a,b,c3)=>{const q=g.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);q.addColorStop(0,a);q.addColorStop(.62,b);q.addColorStop(1,c3);return q;};
function tileImg(t,v){
  const id='t'+t+'_'+v;if(OWX[id])return OWX[id];
  const c=document.createElement('canvas');c.width=128;c.height=64;const g=c.getContext('2d');
  const BASE={2:['#f8e9b8','#ecd79a'],3:['#92e476','#6fcb5c'],4:['#62bd6a','#459a55'],5:['#fbfdff','#d7e6f5'],6:['#f5d98f','#e5bd6b'],7:['#dcae7c','#c5935e'],8:['#a9a4ba','#8b86a0'],9:['#d3cee3','#b4aecb'],10:['#fbcade','#f1a7c8'],1:['#93eaf6','#5ccbe8']}[t]||['#888','#666'];
  const dia=()=>{g.beginPath();g.moveTo(64,0);g.lineTo(128,32);g.lineTo(64,64);g.lineTo(0,32);g.closePath();};
  g.save();dia();g.clip();
  const gr=g.createLinearGradient(30,0,100,64);gr.addColorStop(0,BASE[0]);gr.addColorStop(1,BASE[1]);g.fillStyle=gr;g.fillRect(0,0,128,64);
  const r=mkRng(t*131+v*17+5);
  const rp=()=>({x:20+r()*88,y:8+r()*48});
  if(t===3||t===4){
    for(let i=0;i<46;i++){const p=rp();g.strokeStyle=r()<.5?'rgba(255,255,255,.25)':'rgba(30,110,50,.22)';g.lineWidth=1.5;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+(r()-.5)*3,p.y-3-r()*3);g.stroke();}
    if(t===4)for(let i=0;i<10;i++){const p=rp();g.fillStyle='rgba(20,70,40,.16)';g.beginPath();g.ellipse(p.x,p.y,7,3,0,0,7);g.fill();}
    if(v===3&&t===3)for(let i=0;i<4;i++){const p=rp();g.fillStyle=['#fff','#ffd24d','#ff9ec7','#c9b8ff'][i];g.beginPath();g.arc(p.x,p.y,2.2,0,7);g.fill();}
  }else if(t===2||t===6){
    for(let i=0;i<50;i++){const p=rp();g.fillStyle=r()<.5?'rgba(255,255,255,.35)':'rgba(150,100,40,.18)';g.fillRect(p.x,p.y,1.6,1.6);}
    if(t===6)for(let i=0;i<3;i++){g.strokeStyle='rgba(160,110,40,.22)';g.lineWidth=2;g.beginPath();const p=rp();g.moveTo(p.x-18,p.y);g.quadraticCurveTo(p.x,p.y-5,p.x+18,p.y);g.stroke();}
  }else if(t===5){
    for(let i=0;i<14;i++){const p=rp();g.fillStyle='rgba(120,160,220,.14)';g.beginPath();g.ellipse(p.x,p.y+3,10,3,0,0,7);g.fill();}
    for(let i=0;i<10;i++){const p=rp();g.fillStyle='#fff';g.fillRect(p.x,p.y,2,2);}
  }else if(t===7){
    for(let i=0;i<24;i++){const p=rp();g.fillStyle=r()<.5?'rgba(255,255,255,.2)':'rgba(90,50,20,.2)';g.beginPath();g.ellipse(p.x,p.y,2.4,1.4,0,0,7);g.fill();}
  }else if(t===9){
    g.strokeStyle='rgba(70,60,110,.28)';g.lineWidth=1.4;
    for(let i=-4;i<10;i++){g.beginPath();g.moveTo(64+i*16-64,0);g.lineTo(64+i*16+64,64);g.stroke();g.beginPath();g.moveTo(64+i*16+64,0);g.lineTo(64+i*16-64,64);g.stroke();}
  }else if(t===8){
    for(let i=0;i<22;i++){const p=rp();g.fillStyle=r()<.5?'rgba(255,255,255,.18)':'rgba(40,30,70,.2)';g.beginPath();g.ellipse(p.x,p.y,4,2,0,0,7);g.fill();}
  }else if(t===10){
    for(let i=0;i<26;i++){const p=rp();g.fillStyle=r()<.5?'rgba(255,255,255,.55)':'rgba(240,120,170,.4)';g.beginPath();g.ellipse(p.x,p.y,3,1.6,r()*3,0,7);g.fill();}
  }else if(t===1){
    for(let i=0;i<6;i++){const p=rp();g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1.6;g.beginPath();g.moveTo(p.x-9,p.y);g.quadraticCurveTo(p.x,p.y-4,p.x+9,p.y);g.stroke();}
  }
  g.restore();
  g.strokeStyle='rgba(30,20,70,.06)';g.lineWidth=2;dia();g.stroke();
  OWX[id]=c;return c;
}
const MOUNT_CACHE={};
function mountImg(hl,snow,v){
  const id='m'+hl+snow+v;if(MOUNT_CACHE[id])return MOUNT_CACHE[id];
  const ah=26+hl*30,r=mkRng(hl*31+v*7+snow);
  const o=mkCv(140,ah+44,70,ah+6,g=>{
    const A={x:(r()-.5)*14,y:-ah},L={x:-64,y:0},R={x:64,y:0},Bt={x:0,y:32},T={x:0,y:-32};
    g.fillStyle='rgba(20,20,50,.2)';g.beginPath();g.ellipse(6,18,66,26,0,0,7);g.fill();
    const face=(pts,c1,c2)=>{
      const gr=g.createLinearGradient(0,-ah,0,32);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;
      g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill();
    };
    // sisi kiri & kanan, bergerigi di punggung
    const ridge=[{x:A.x,y:A.y}];
    for(let i=1;i<4;i++){const t=i/4;ridge.push({x:A.x+(Bt.x-A.x)*t+(r()-.5)*14,y:A.y+(Bt.y-A.y)*t});}
    ridge.push(Bt);
    const lt=snow?'#d9d6ea':'#b9b3cc',rt=snow?'#a9a4c6':'#7f799c';
    face([A,L,Bt].concat(ridge.slice(1,4).reverse()),lt,'#8f89ac');
    face([A].concat(ridge.slice(1,4)).concat([Bt,R]),rt,'#4f4a72');
    // retakan
    g.strokeStyle='rgba(40,30,80,.28)';g.lineWidth=1.6;
    for(let i=0;i<4;i++){const t=.25+i*.18,x=A.x+(L.x-A.x)*t,y=A.y+(L.y-A.y)*t;g.beginPath();g.moveTo(x,y);g.lineTo(x+14*(r()+.3),y+18+r()*10);g.stroke();}
    g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=2;g.beginPath();g.moveTo(A.x,A.y);ridge.slice(1).forEach(p=>g.lineTo(p.x,p.y));g.stroke();
    // salju di puncak
    if(snow){
      const cap=.34+(hl>=4?.1:0);
      const lx=A.x+(L.x-A.x)*cap,ly=A.y+(L.y-A.y)*cap,rx=A.x+(R.x-A.x)*cap,ry=A.y+(R.y-A.y)*cap,bx=A.x+(Bt.x-A.x)*(cap+.08),by=A.y+(Bt.y-A.y)*(cap+.08);
      g.fillStyle='#fff';g.beginPath();g.moveTo(A.x,A.y);g.lineTo(lx,ly);g.lineTo(lx+8,ly-4);g.lineTo((lx+bx)/2-2,(ly+by)/2+5);g.lineTo(bx,by);g.lineTo((rx+bx)/2+2,(ry+by)/2+4);g.lineTo(rx-8,ry-3);g.lineTo(rx,ry);g.closePath();g.fill();
      g.fillStyle='rgba(120,130,200,.22)';g.beginPath();g.moveTo(A.x,A.y);g.lineTo(bx,by);g.lineTo((rx+bx)/2+2,(ry+by)/2+4);g.lineTo(rx,ry);g.closePath();g.fill();
    }
  });
  MOUNT_CACHE[id]=o;return o;
}
/* pohon, batu, bunga, rumah ... */
function objImg(t,k){
  const id=t+k;if(OWX[id])return OWX[id];
  let o;
  const sh=(g,rx,ry)=>{g.fillStyle='rgba(20,30,50,.2)';g.beginPath();g.ellipse(4,2,rx,ry,0,0,7);g.fill();};
  const trunk=(g,h,w,c1,c2)=>{const q=g.createLinearGradient(-w,0,w,0);q.addColorStop(0,c1);q.addColorStop(1,c2);g.fillStyle=q;g.beginPath();g.moveTo(-w,0);g.quadraticCurveTo(-w+1,-h/2,-w*.6,-h);g.lineTo(w*.6,-h);g.quadraticCurveTo(w-1,-h/2,w*1.1,0);g.closePath();g.fill();};
  if(t==='tree'){
    const PAL=[['#b8f27a','#6fcb4f','#3f9a45'],['#a6ec6c','#5fc04a','#37873f'],['#c9f58a','#7bd25a','#47a247'],['#8fd96a','#4aa650','#2b7a3d'],['#ffd98a','#f0a24b','#c46b2d'],['#7fd18a','#3f9b60','#27704a'],['#ffe1ee','#f9a9cb','#d9709f']][k];
    o=mkCv(96,104,48,96,g=>{
      sh(g,26,9);trunk(g,38,6,'#b0743f','#6d4325');
      [[-16,-48,19],[16,-48,19],[0,-66,24],[-8,-44,21],[12,-42,18]].forEach(b=>{g.fillStyle=rgrad(g,b[0],b[1],b[2],PAL[0],PAL[1],PAL[2]);g.beginPath();g.arc(b[0],b[1],b[2],0,7);g.fill();});
      g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.ellipse(-6,-76,11,5,-.4,0,7);g.fill();
      if(k===6){for(let i=0;i<10;i++){g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(-24+i*5.4,-40-((i*7)%26),2,0,7);g.fill();}}
    });
  }else if(t==='pine'){
    o=mkCv(80,110,40,102,g=>{
      sh(g,22,8);trunk(g,22,5,'#9a6a3e','#62401f');
      for(let i=0;i<3;i++){const y=-18-i*24,w=34-i*7;
        const q=g.createLinearGradient(-w,y,w,y);q.addColorStop(0,'#4fae7a');q.addColorStop(.5,'#2f8a5e');q.addColorStop(1,'#1f6a4a');g.fillStyle=q;
        g.beginPath();g.moveTo(0,y-34);g.lineTo(w,y);g.quadraticCurveTo(0,y+9,-w,y);g.closePath();g.fill();
        g.fillStyle='rgba(255,255,255,.92)';g.beginPath();g.moveTo(0,y-34);g.lineTo(w*.62,y-13);g.quadraticCurveTo(w*.3,y-8,0,y-14);g.quadraticCurveTo(-w*.3,y-8,-w*.62,y-13);g.closePath();g.fill();}
    });
  }else if(t==='palm'){
    o=mkCv(110,110,55,100,g=>{
      sh(g,22,8);g.strokeStyle='#a2723f';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(12,-34,6,-70);g.stroke();
      g.strokeStyle='#caa070';g.lineWidth=2;g.beginPath();g.moveTo(-1,-2);g.quadraticCurveTo(10,-34,4,-70);g.stroke();
      for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*.62;g.save();g.translate(6,-72);g.rotate(a);const q=g.createLinearGradient(0,0,40,0);q.addColorStop(0,'#5fc46a');q.addColorStop(1,'#2f8a4a');g.fillStyle=q;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(22,-14,46,6);g.quadraticCurveTo(22,-3,0,0);g.fill();g.restore();}
      g.fillStyle='#8a5a2a';g.beginPath();g.arc(4,-68,4,0,7);g.arc(10,-66,4,0,7);g.fill();
    });
  }else if(t==='cactus'){
    o=mkCv(60,80,30,74,g=>{
      sh(g,16,6);
      const cap=(x,y,w,h)=>{const q=g.createLinearGradient(x-w,0,x+w,0);q.addColorStop(0,'#7fd98a');q.addColorStop(.6,'#4cb06a');q.addColorStop(1,'#2f8a50');g.fillStyle=q;g.beginPath();g.roundRect(x-w,y-h,w*2,h,w);g.fill();};
      cap(-14,-26,6,24);cap(14,-34,6,28);g.fillStyle='#4cb06a';g.fillRect(-14,-22,12,6);g.fillRect(4,-26,12,6);cap(0,0,9,56);
      g.strokeStyle='rgba(20,70,40,.3)';g.lineWidth=1.2;[-3,3].forEach(x=>{g.beginPath();g.moveTo(x,-4);g.lineTo(x,-52);g.stroke();});
      g.fillStyle='#ff7bac';g.beginPath();g.arc(0,-57,4,0,7);g.fill();
    });
  }else if(t==='bush'){
    const P=[['#b8f27a','#5fc04a','#3a8a42'],['#9fe58a','#4aae5a','#2c7a45'],['#ffc1d6','#e87aa6','#b24d7c']][k%3];
    o=mkCv(56,40,28,34,g=>{sh(g,18,6);[[-10,-8,11],[10,-8,11],[0,-14,13]].forEach(b=>{g.fillStyle=rgrad(g,b[0],b[1],b[2],P[0],P[1],P[2]);g.beginPath();g.arc(b[0],b[1],b[2],0,7);g.fill();});if(k===2){g.fillStyle='#fff';[[-8,-12],[6,-8],[0,-20]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],2.2,0,7);g.fill();});}});
  }else if(t==='rock'){
    const P=[['#d6d3e0','#9a96b0','#6b6785'],['#e0dcc8','#aaa38a','#767058'],['#e8f0fa','#b4c4dc','#7d8fb0'],['#efd9b0','#c9a56c','#8f6e3a']][k];
    o=mkCv(60,46,30,40,g=>{sh(g,20,7);
      g.fillStyle=P[1];g.beginPath();g.moveTo(-20,0);g.lineTo(-16,-18);g.lineTo(-4,-28);g.lineTo(12,-22);g.lineTo(20,-6);g.lineTo(16,2);g.closePath();g.fill();
      g.fillStyle=P[0];g.beginPath();g.moveTo(-16,-18);g.lineTo(-4,-28);g.lineTo(12,-22);g.lineTo(0,-14);g.closePath();g.fill();
      g.fillStyle=P[2];g.beginPath();g.moveTo(0,-14);g.lineTo(12,-22);g.lineTo(20,-6);g.lineTo(16,2);g.lineTo(2,2);g.closePath();g.fill();
      g.strokeStyle='rgba(30,20,60,.25)';g.lineWidth=1.4;g.beginPath();g.moveTo(-20,0);g.lineTo(-16,-18);g.lineTo(-4,-28);g.lineTo(12,-22);g.lineTo(20,-6);g.lineTo(16,2);g.closePath();g.stroke();});
  }else if(t==='flower'){
    const C=['#ff7bac','#ffd24d','#ffffff','#c9b8ff','#ff9a5c','#7fd8ff'][k%6];
    o=mkCv(44,36,22,30,g=>{[[-9,-2],[6,-6],[-1,-10]].forEach((p,i)=>{g.strokeStyle='#3f9a45';g.lineWidth=2;g.beginPath();g.moveTo(p[0],p[1]+10);g.lineTo(p[0],p[1]);g.stroke();
      g.fillStyle=i===1?'#fff':C;for(let a=0;a<5;a++){g.beginPath();g.ellipse(p[0]+Math.cos(a*1.256)*3.4,p[1]+Math.sin(a*1.256)*3.4,2.8,2.8,0,0,7);g.fill();}g.fillStyle='#ffd24d';g.beginPath();g.arc(p[0],p[1],2,0,7);g.fill();});});
  }else if(t==='mush'){
    o=mkCv(36,36,18,30,g=>{sh(g,10,4);g.fillStyle='#fff3e0';g.fillRect(-3,-12,6,12);g.fillStyle=rgrad(g,0,-14,12,'#ff8a8a','#e83a4a','#a81f35');g.beginPath();g.ellipse(0,-14,12,9,0,Math.PI,0);g.fill();g.fillStyle='#fff';[[-5,-17],[3,-19],[6,-14]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],1.8,0,7);g.fill();});});
  }else if(t==='dead'){
    o=mkCv(50,40,25,34,g=>{g.strokeStyle='#9a7a4a';g.lineWidth=2.4;g.lineCap='round';[[-14,-22],[-4,-30],[10,-24],[16,-14]].forEach(p=>{g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(p[0]*.4,p[1]*.6,p[0],p[1]);g.stroke();});});
  }else if(t==='shell'){
    o=mkCv(30,24,15,20,g=>{g.fillStyle='#ffd0e0';g.beginPath();g.ellipse(0,-5,8,6,0,Math.PI,0);g.fill();g.strokeStyle='#e8809f';g.lineWidth=1.2;[-4,0,4].forEach(x=>{g.beginPath();g.moveTo(0,-1);g.lineTo(x*1.3,-10);g.stroke();});});
  }else if(t==='sign'){
    o=mkCv(60,70,30,62,g=>{sh(g,14,5);trunk(g,48,3,'#9a6a3e','#62401f');
      g.fillStyle='#e0a868';g.beginPath();g.roundRect(-24,-58,48,26,5);g.fill();g.strokeStyle='#8a5a2a';g.lineWidth=2;g.stroke();
      g.fillStyle='#fff6d9';g.beginPath();g.roundRect(-20,-54,40,18,3);g.fill();
      g.strokeStyle='#8a5a2a';g.lineWidth=1.6;[-48,-42].forEach(y=>{g.beginPath();g.moveTo(-14,y);g.lineTo(14,y);g.stroke();});});
  }else if(t==='house'){
    const ROOF=[['#ff8a7a','#d94b50'],['#7fc4ff','#3f86d8'],['#8be0a0','#3fa066'],['#ffcc66','#e0912f'],['#c9a6ff','#7e58d6']][k],WALL=['#fff1dc','#eaf6ff','#f1ffe9','#fff7d6','#f6ecff'][k];
    o=mkCv(150,150,75,98,g=>{
      const hw=54,hh=27,wh=46;
      g.fillStyle='rgba(20,30,50,.22)';g.beginPath();g.ellipse(8,8,hw+16,hh+8,0,0,7);g.fill();
      // dinding kiri
      g.save();g.translate(-hw,0);g.transform(1,hh/hw,0,1,0,0);
      let q=g.createLinearGradient(0,-wh,0,0);q.addColorStop(0,WALL);q.addColorStop(1,shadeC(WALL,.82));g.fillStyle=q;g.fillRect(0,-wh,hw,wh);
      g.fillStyle='#8fd6ff';g.strokeStyle='#8a6a4a';g.lineWidth=2;g.fillRect(12,-34,16,16);g.strokeRect(12,-34,16,16);g.beginPath();g.moveTo(20,-34);g.lineTo(20,-18);g.moveTo(12,-26);g.lineTo(28,-26);g.stroke();
      g.restore();
      // dinding kanan
      g.save();g.translate(0,hh);g.transform(1,-hh/hw,0,1,0,0);
      q=g.createLinearGradient(0,-wh,0,0);q.addColorStop(0,shadeC(WALL,.9));q.addColorStop(1,shadeC(WALL,.66));g.fillStyle=q;g.fillRect(0,-wh,hw,wh);
      g.fillStyle='#8a5a36';g.beginPath();g.roundRect(14,-30,16,30,[8,8,0,0]);g.fill();g.fillStyle='#ffd24d';g.beginPath();g.arc(26,-14,1.8,0,7);g.fill();
      g.fillStyle='#8fd6ff';g.strokeStyle='#8a6a4a';g.fillRect(36,-34,12,14);g.strokeRect(36,-34,12,14);
      g.restore();
      // atap
      const ow=hw+10,oh=hh+5,top=-wh,ap={x:0,y:top-44};
      g.fillStyle=ROOF[1];g.beginPath();g.moveTo(-ow,top+4);g.lineTo(0,top+oh+4);g.lineTo(ow,top+4);g.lineTo(ap.x,ap.y);g.closePath();g.fill();
      q=g.createLinearGradient(-ow,top,0,top+oh);q.addColorStop(0,ROOF[0]);q.addColorStop(1,ROOF[1]);
      g.fillStyle=q;g.beginPath();g.moveTo(-ow,top+4);g.lineTo(0,top+oh+4);g.lineTo(ap.x,ap.y);g.closePath();g.fill();
      g.fillStyle=shadeC(ROOF[1],.78);g.beginPath();g.moveTo(0,top+oh+4);g.lineTo(ow,top+4);g.lineTo(ap.x,ap.y);g.closePath();g.fill();
      g.strokeStyle='rgba(60,20,40,.35)';g.lineWidth=1.8;g.beginPath();g.moveTo(-ow,top+4);g.lineTo(0,top+oh+4);g.lineTo(ow,top+4);g.moveTo(0,top+oh+4);g.lineTo(ap.x,ap.y);g.stroke();
      g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=1.4;for(let i=1;i<4;i++){const t=i/4;g.beginPath();g.moveTo(-ow*(1-t)+ap.x*t,top+4+(ap.y-top-4)*t);g.lineTo(0*(1-t)+ap.x*t,top+oh+4+(ap.y-top-oh-4)*t);g.lineTo(ow*(1-t)+ap.x*t,top+4+(ap.y-top-4)*t);g.stroke();}
      g.fillStyle='#fff';g.beginPath();g.arc(ap.x,ap.y,2.6,0,7);g.fill();
    });
  }else if(t==='fountain'){
    o=mkCv(100,90,50,60,g=>{
      g.fillStyle='rgba(20,30,50,.2)';g.beginPath();g.ellipse(4,6,44,18,0,0,7);g.fill();
      g.fillStyle='#b8b2cf';g.beginPath();g.ellipse(0,0,38,19,0,0,7);g.fill();
      g.fillStyle='#d9d4ea';g.beginPath();g.ellipse(0,-8,38,19,0,0,7);g.fill();
      g.fillStyle='#4cc2e8';g.beginPath();g.ellipse(0,-9,30,14,0,0,7);g.fill();
      g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(-8,-12,10,3.5,-.2,0,7);g.fill();
      g.fillStyle='#c9c4dc';g.fillRect(-4,-34,8,26);g.beginPath();g.ellipse(0,-34,10,4,0,0,7);g.fill();
      g.fillStyle='#e6e2f2';g.beginPath();g.ellipse(0,-36,10,4,0,0,7);g.fill();
    });
  }else if(t==='chest'){
    o=mkCv(56,50,28,44,g=>{sh(g,20,7);
      const q=g.createLinearGradient(0,-26,0,0);q.addColorStop(0,'#c98a4a');q.addColorStop(1,'#8a5a2a');g.fillStyle=q;g.beginPath();g.roundRect(-18,-20,36,20,3);g.fill();
      g.fillStyle='#d69a58';g.beginPath();g.roundRect(-18,k?-40:-30,36,14,[8,8,0,0]);g.fill();
      if(k){g.fillStyle='#ffe27a';g.beginPath();g.ellipse(0,-24,15,6,0,0,7);g.fill();g.fillStyle='#fff7c8';[[-6,-26],[4,-27],[8,-23]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],2.6,0,7);g.fill();});}
      g.strokeStyle='#5a3a18';g.lineWidth=2;g.strokeRect(-18,-20,36,20);
      g.fillStyle='#ffd24d';g.fillRect(-4,-24,8,10);g.strokeRect(-4,-24,8,10);});
  }
  OWX[id]=o;return o;
}
function shadeC(hex,f){const n=parseInt(hex.slice(1),16),r=Math.round((n>>16)*f),g=Math.round(((n>>8)&255)*f),b=Math.round((n&255)*f);return 'rgb('+r+','+g+','+b+')';}

/* ---------- keadaan Open World ---------- */
const OW={on:false,W:null,t:0,tod:9,rain:0,rainT:90,Z:1,zoom:1,w:0,h:0,dpr:1,keys:{},joy:{x:0,y:0},path:null,fol:[],npcs:[],parts:[],birds:[],flies:[],
  p:{x:0,y:0,turn:1,away:false,walk:0,moving:false,hp:5,inv:0,hop:0,sx:0,sy:1,trail:[],run:false},cam:{x:0,y:0},shake:0,flash:0,last:0,raf:0,act:null,
  banner:{t:0,txt:'',sub:''},saveT:0,modal:false,area:'',mmT:0,ox:0,oy:0,drag:null,nfish:0};
const owDark=()=>OW.tod;
const TOD_KEYS=[[0,[78,92,165]],[4.5,[88,100,170]],[6.2,[255,190,170]],[8,[255,255,255]],[16,[255,255,255]],[17.8,[255,196,140]],[19.2,[110,100,175]],[21,[78,92,165]],[24,[78,92,165]]];
function todColor(h){
  for(let i=1;i<TOD_KEYS.length;i++){
    const a=TOD_KEYS[i-1],b=TOD_KEYS[i];
    if(h<=b[0]){const f=(h-a[0])/(b[0]-a[0]);return a[1].map((v,j)=>Math.round(v+(b[1][j]-v)*f));}
  }
  return [255,255,255];
}
const owNight=()=>{const c=todColor(OW.tod);return clamp(1-(c[0]+c[1]+c[2])/765*1.0,0,1)*(1+(1-OW.rain*0)*0);};
const owS=(x,y)=>({sx:(x-y)*TW/2*OW.Z+OW.ox,sy:(x+y)*TH/2*OW.Z+OW.oy});
const owInv=(sx,sy)=>{const dx=(sx-OW.ox)/(TW/2*OW.Z),dy=(sy-OW.oy)/(TH/2*OW.Z);return{x:(dx+dy)/2,y:(dy-dx)/2};};
const owT=(x,y)=>{const W=OW.W;x=Math.floor(x);y=Math.floor(y);return(x<0||y<0||x>=W.N||y>=W.N)?0:W.type[y*W.N+x];};
const owSolid=(x,y)=>{const W=OW.W;x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=W.N||y>=W.N)return true;const k=y*W.N+x,t=W.type[k];return t<T_SAND||t===T_ROCK||!!W.B[k];};

function owRender(){
  const W=OW.W,ctx=OW.ctx,w=OW.w,h=OW.h,Z=OW.Z,t=OW.t,N=W.N;
  ctx.setTransform(OW.dpr,0,0,OW.dpr,0,0);
  // kamera
  let shx=0,shy=0;if(OW.shake>0){shx=(Math.random()-.5)*OW.shake*10;shy=(Math.random()-.5)*OW.shake*10;}
  const cs=((OW.cam.x-OW.cam.y)*TW/2*Z),cy2=((OW.cam.x+OW.cam.y)*TH/2*Z);
  OW.ox=w/2-cs+shx;OW.oy=h*0.54-cy2+shy;
  // air
  const wg=ctx.createLinearGradient(0,0,0,h);wg.addColorStop(0,'#5fc9ea');wg.addColorStop(1,'#2a8fcb');ctx.fillStyle=wg;ctx.fillRect(0,0,w,h);
  // batas ubin terlihat
  const c4=[owInv(0,-120*Z),owInv(w,-120*Z),owInv(0,h+60*Z),owInv(w,h+60*Z)];
  const minX=Math.max(0,Math.floor(Math.min(c4[0].x,c4[1].x,c4[2].x,c4[3].x))-2),maxX=Math.min(N-1,Math.ceil(Math.max(c4[0].x,c4[1].x,c4[2].x,c4[3].x))+2);
  const minY=Math.max(0,Math.floor(Math.min(c4[0].y,c4[1].y,c4[2].y,c4[3].y))-2),maxY=Math.min(N-1,Math.ceil(Math.max(c4[0].y,c4[1].y,c4[2].y,c4[3].y))+2);
  // gelombang
  ctx.lineWidth=1.6*Z;ctx.lineCap='round';
  for(let y=minY-4;y<=maxY+4;y+=2)for(let x=minX-4;x<=maxX+4;x+=2){
    if(x>=0&&y>=0&&x<N&&y<N&&W.type[y*N+x]>=T_SAND)continue;
    const r=h2(x,y,3);if(r<.45)continue;
    const ph=(Math.sin(t*1.3+r*20)+1)/2;
    const sx=(x-y)*TW/2*Z+OW.ox+(r-.5)*30*Z,sy=(x+y)*TH/2*Z+OW.oy;
    if(sx<-40||sx>w+40||sy<-20||sy>h+20)continue;
    ctx.strokeStyle='rgba(255,255,255,'+(.08+ph*.22)+')';
    ctx.beginPath();ctx.moveTo(sx-9*Z,sy);ctx.quadraticCurveTo(sx,sy-3*Z*ph-1,sx+9*Z,sy);ctx.stroke();
  }
  // ---- tanah
  const dl=[];
  const tw=TW*Z,th=TH*Z,side=15*Z;
  const lipC={2:'#f1dc9a',3:'#6fcb5c',4:'#459a55',5:'#f2f8ff',6:'#e8c677',7:'#c5935e',8:'#8b86a0',9:'#b4aecb',10:'#f1a7c8'};
  const lnd=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&W.type[y*N+x]>=T_SAND;
  for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
    const k=y*N+x,ty=W.type[k];if(ty===T_DEEP)continue;
    const sx=(x-y)*TW/2*Z+OW.ox,sy=(x+y)*TH/2*Z+OW.oy;
    if(sx<-tw||sx>w+tw||sy<-th*3||sy>h+th*3)continue;
    const v=(h2(x,y,1)*4)|0;
    ctx.drawImage(tileImg(ty,v),sx-tw/2-.5,sy-th/2-.5,tw+1,th+1);
    if(ty===T_WATER){
      // busa pantai
      const a=.2+.2*Math.sin(t*2+x+y);
      ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.lineWidth=2*Z;
      if(lnd(x,y-1)){ctx.beginPath();ctx.moveTo(sx-tw/2,sy);ctx.lineTo(sx,sy-th/2);ctx.stroke();}
      if(lnd(x-1,y)){ctx.beginPath();ctx.moveTo(sx,sy-th/2);ctx.lineTo(sx+tw/2,sy);ctx.stroke();}
      continue;
    }
    // sisi pulau
    const sl=!lnd(x,y+1),sr=!lnd(x+1,y);
    if(sl||sr){
      const lc=lipC[ty]||'#6fcb5c';
      if(sl){ctx.fillStyle='#a8764a';ctx.beginPath();ctx.moveTo(sx-tw/2,sy);ctx.lineTo(sx,sy+th/2);ctx.lineTo(sx,sy+th/2+side);ctx.lineTo(sx-tw/2,sy+side);ctx.fill();
        ctx.fillStyle=lc;ctx.beginPath();ctx.moveTo(sx-tw/2,sy);ctx.lineTo(sx,sy+th/2);ctx.lineTo(sx,sy+th/2+side*.3);ctx.lineTo(sx-tw/2,sy+side*.3);ctx.fill();
        ctx.fillStyle='rgba(60,30,10,.18)';ctx.beginPath();ctx.moveTo(sx-tw/2,sy+side*.55);ctx.lineTo(sx,sy+th/2+side*.55);ctx.lineTo(sx,sy+th/2+side);ctx.lineTo(sx-tw/2,sy+side);ctx.fill();}
      if(sr){ctx.fillStyle='#855a38';ctx.beginPath();ctx.moveTo(sx+tw/2,sy);ctx.lineTo(sx,sy+th/2);ctx.lineTo(sx,sy+th/2+side);ctx.lineTo(sx+tw/2,sy+side);ctx.fill();
        ctx.fillStyle=shadeC(lc.length===7?lc:'#6fcb5c',.8);ctx.beginPath();ctx.moveTo(sx+tw/2,sy);ctx.lineTo(sx,sy+th/2);ctx.lineTo(sx,sy+th/2+side*.3);ctx.lineTo(sx+tw/2,sy+side*.3);ctx.fill();
        ctx.fillStyle='rgba(40,20,10,.22)';ctx.beginPath();ctx.moveTo(sx+tw/2,sy+side*.55);ctx.lineTo(sx,sy+th/2+side*.55);ctx.lineTo(sx,sy+th/2+side);ctx.lineTo(sx+tw/2,sy+side);ctx.fill();}
      const a=.35+.3*Math.sin(t*2.4+x*.7+y);
      ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.lineWidth=2.4*Z;ctx.beginPath();
      if(sl){ctx.moveTo(sx-tw/2,sy+side);ctx.lineTo(sx,sy+th/2+side);}
      if(sr){ctx.moveTo(sx,sy+th/2+side);ctx.lineTo(sx+tw/2,sy+side);}
      ctx.stroke();
    }
  }
  // bayangan awan
  ctx.fillStyle='rgba(20,40,90,.11)';
  for(let i=0;i<7;i++){
    const cx=((i*17.3+t*.35*(0.6+i%3*.2))%(N+30))-15,cy=(i*29.7%N);
    const s=owS(cx,cy);
    ctx.beginPath();ctx.ellipse(s.sx,s.sy,(110+i%3*40)*Z,(46+i%2*18)*Z,0,0,7);ctx.fill();
  }
  // ---- objek berurutan
  const p=OW.p,psx=owS(p.x,p.y);
  const push=(d,k,o)=>dl.push({d,k,o});
  for(let y=minY;y<=Math.min(N-1,maxY+3);y++)for(let x=minX;x<=maxX;x++){
    const key=y*N+x,ty=W.type[key];
    if(ty===T_ROCK){const hl=W.hl[key];push(x+y+1,'m',{x,y,hl,snow:(hl>=3&&h2(x,y,9)<.6)?1:0,v:(h2(x,y,4)*3)|0});}
    const l=W.objAt.get(key);if(l)for(const o of l)push(o.x+o.y,'o',o);
  }
  W.villages.forEach(v=>{
    v.houses.forEach(hh=>{if(hh.x+2>=minX&&hh.x<=maxX&&hh.y+2>=minY&&hh.y<=maxY+3)push(hh.x+hh.y+2,'h',hh);});
    if(Math.abs(v.x-OW.cam.x)<30&&Math.abs(v.y-OW.cam.y)<30)push(v.x+v.y,'f',v);
  });
  W.chests.forEach(c=>{if(c.x>=minX&&c.x<=maxX&&c.y>=minY&&c.y<=maxY+3)push(c.x+c.y,'c',c);});
  W.crystals.forEach(c=>{if(!c.got&&c.x>=minX&&c.x<=maxX&&c.y>=minY&&c.y<=maxY+3)push(c.x+c.y,'k',c);});
  OW.npcs.forEach(n=>push(n.x+n.y,'n',n));
  W.mons.forEach(m=>{if(!m.dead&&Math.abs(m.x-OW.cam.x)<34&&Math.abs(m.y-OW.cam.y)<34)push(m.x+m.y,'e',m);});
  OW.fol.forEach(f=>push(f.x+f.y,'q',f));
  push(p.x+p.y+.02,'p',p);
  OW.flies.forEach(f=>push(f.x+f.y,'b',f));
  dl.sort((a,b)=>a.d-b.d);
  const tall=(sx,sy,ww,hh,d)=>d>p.x+p.y&&Math.abs(sx-psx.sx)<ww*.5*Z&&sy-psx.sy>0&&sy-psx.sy<hh*Z?.42:1;
  for(const e of dl){
    const o=e.o,k=e.k;
    if(k==='m'){
      const s=owS(o.x+.5,o.y+.5),im=mountImg(o.hl,o.snow,o.v);
      if(s.sx<-100*Z||s.sx>w+100*Z||s.sy<-200*Z||s.sy>h+80*Z)continue;
      const al=tall(s.sx,s.sy,120,(im.ay)*1,e.d);
      if(al<1)ctx.globalAlpha=al;
      ctx.drawImage(im.c,s.sx-im.ax*Z,s.sy-im.ay*Z,im.w*Z,im.h*Z);ctx.globalAlpha=1;
    }else if(k==='o'){
      const s=owS(o.x,o.y);
      if(s.sx<-80*Z||s.sx>w+80*Z||s.sy<-120*Z||s.sy>h+60*Z)continue;
      const im=objImg(o.t,o.k),sc=o.s*Z;
      const swy=(o.t==='tree'||o.t==='pine'||o.t==='palm'||o.t==='bush'||o.t==='flower'||o.t==='cactus')?Math.sin(t*1.6+o.ph)*.035+(OW.rain>.3?Math.sin(t*5+o.ph)*.012:0):0;
      const al=(o.t==='tree'||o.t==='pine'||o.t==='palm'||o.t==='cactus')?tall(s.sx,s.sy,im.w*o.s,im.ay*o.s,e.d):1;
      if(al<1)ctx.globalAlpha=al;
      if(swy){ctx.save();ctx.translate(s.sx,s.sy);ctx.transform(1,0,swy,1,0,0);ctx.drawImage(im.c,-im.ax*sc,-im.ay*sc,im.w*sc,im.h*sc);ctx.restore();}
      else ctx.drawImage(im.c,s.sx-im.ax*sc,s.sy-im.ay*sc,im.w*sc,im.h*sc);
      ctx.globalAlpha=1;
    }else if(k==='h'){
      const s=owS(o.x+1,o.y+1),im=objImg('house',o.v);
      const al=tall(s.sx,s.sy,150,130,e.d);
      if(al<1)ctx.globalAlpha=al;
      ctx.drawImage(im.c,s.sx-im.ax*Z,s.sy-im.ay*Z,im.w*Z,im.h*Z);ctx.globalAlpha=1;
    }else if(k==='f'){
      const s=owS(o.x,o.y),im=objImg('fountain',0);
      ctx.drawImage(im.c,s.sx-im.ax*Z,s.sy-im.ay*Z,im.w*Z,im.h*Z);
      ctx.strokeStyle='rgba(190,240,255,.85)';ctx.lineWidth=2*Z;
      for(let i=0;i<6;i++){const a=t*2.2+i*1.05,f=(a%2)/2;ctx.beginPath();const ang=i*1.05;const dx=Math.cos(ang)*26*f*Z,fy=-(34+Math.sin(f*3.14)*18)*Z+f*f*30*Z;ctx.arc(s.sx+dx,s.sy+fy,1.8*Z,0,7);ctx.stroke();}
      ctx.fillStyle='rgba(190,240,255,.7)';ctx.beginPath();ctx.ellipse(s.sx,s.sy-44*Z,3*Z,9*Z,0,0,7);ctx.fill();
    }else if(k==='c'){
      const s=owS(o.x,o.y),op=!!o.open,im=objImg('chest',op?1:0);
      ctx.drawImage(im.c,s.sx-im.ax*Z,s.sy-im.ay*Z,im.w*Z,im.h*Z);
      if(!op){const f=.5+.5*Math.sin(t*3+o.x);ctx.fillStyle='rgba(255,240,150,'+(f*.8)+')';ctx.beginPath();ctx.arc(s.sx+12*Z,s.sy-32*Z-f*3,2.4*Z,0,7);ctx.fill();}
    }else if(k==='k'){
      const s=owS(o.x,o.y),bob=Math.sin(t*2.4+o.x*3)*5*Z,sc=Z;
      ctx.fillStyle='rgba(20,30,60,.22)';ctx.beginPath();ctx.ellipse(s.sx,s.sy,12*sc,5*sc,0,0,7);ctx.fill();
      const cy=s.sy-30*sc+bob,gl=ctx.createRadialGradient(s.sx,cy,2,s.sx,cy,30*sc);gl.addColorStop(0,'rgba(190,255,255,.7)');gl.addColorStop(1,'rgba(190,255,255,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(s.sx,cy,30*sc,0,7);ctx.fill();
      ctx.save();ctx.translate(s.sx,cy);ctx.scale(Math.cos(t*1.6+o.x)*.4+.75,1);
      const g2=ctx.createLinearGradient(-10*sc,-16*sc,10*sc,16*sc);g2.addColorStop(0,'#e8ffff');g2.addColorStop(.5,'#7fe3ff');g2.addColorStop(1,'#5a8cff');
      ctx.fillStyle=g2;ctx.strokeStyle='rgba(30,40,100,.6)';ctx.lineWidth=1.6*sc;ctx.beginPath();ctx.moveTo(0,-17*sc);ctx.lineTo(11*sc,-3*sc);ctx.lineTo(0,17*sc);ctx.lineTo(-11*sc,-3*sc);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.moveTo(-3*sc,-12*sc);ctx.lineTo(0,-3*sc);ctx.lineTo(-7*sc,-3*sc);ctx.closePath();ctx.fill();
      ctx.restore();
      const wd=ALLW.find(x=>x.en===o.w.en);
      if(wd&&wd.pic){ctx.font=(15*sc)+'px "Segoe UI Emoji","Noto Color Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(wd.pic,s.sx,cy-27*sc);}
      if(OW.quest&&OW.quest.type==='find'&&OW.quest.cid===o.id){ctx.fillStyle='#ffd24d';ctx.font='900 '+(18*sc)+'px Nunito,sans-serif';ctx.textAlign='center';ctx.fillText('★',s.sx,cy-46*sc+Math.sin(t*5)*3);}
    }else if(k==='n'){
      const s=owS(o.x,o.y),hh=84*Z;
      drawChar(ctx,o.k,s.sx,s.sy,hh,{t:t,turn:o.turn,walk:o.walk,moving:o.moving,vx:o.vx,away:o.away,seed:o.seed});
      owTag(s.sx,s.sy-hh-8*Z,o);
    }else if(k==='e'){
      const s=owS(o.x,o.y),hh=(o.boss?112:68)*Z;
      if(o.boss){const gg=ctx.createLinearGradient(0,s.sy-380*Z,0,s.sy);gg.addColorStop(0,'rgba(255,220,120,0)');gg.addColorStop(1,'rgba(255,200,90,.38)');ctx.fillStyle=gg;ctx.fillRect(s.sx-14*Z,s.sy-380*Z,28*Z,380*Z);}
      if(o.stun>0)ctx.globalAlpha=.6+.4*Math.sin(t*30);
      drawChar(ctx,o.k,s.sx,s.sy,hh,{t:t,turn:o.turn,walk:o.walk,moving:true,vx:o.vx,seed:o.x,expr:o.chase?'angry':'happy',away:false});
      ctx.globalAlpha=1;
      if(o.chase){ctx.fillStyle='#ff4a5a';ctx.font='900 '+(22*Z)+'px Nunito,sans-serif';ctx.textAlign='center';ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.strokeText('!',s.sx,s.sy-hh-4*Z+Math.sin(t*14)*2);ctx.fillText('!',s.sx,s.sy-hh-4*Z+Math.sin(t*14)*2);}
      if(o.boss){ctx.fillStyle='#fff';ctx.strokeStyle='#3a2a5c';ctx.lineWidth=3;ctx.font='900 '+(12*Z)+'px Nunito,sans-serif';ctx.textAlign='center';const nm=FOES[o.k].n;ctx.strokeText('👑 '+nm,s.sx,s.sy-hh-12*Z);ctx.fillText('👑 '+nm,s.sx,s.sy-hh-12*Z);}
    }else if(k==='q'){
      const s=owS(o.x,o.y);
      drawChar(ctx,o.key,s.sx,s.sy,o.pet?34*Z:72*Z,{t:t,turn:o.turn,walk:o.walk,moving:o.moving,vx:o.vx,away:o.away,seed:o.seed,expr:'happy'});
    }else if(k==='p'){
      const s=owS(o.x,o.y);
      if(o.inv>0&&Math.floor(t*14)%2)ctx.globalAlpha=.45;
      drawChar(ctx,'mochi',s.sx,s.sy,86*Z,{t:t,turn:o.turn,walk:o.walk,moving:o.moving,vx:o.sx,away:o.away,seed:0,hop:o.hop*Z,expr:o.expr});
      ctx.globalAlpha=1;
    }else if(k==='b'){
      const s=owS(o.x,o.y),a=Math.sin(t*18+o.ph)*.8,z=18*Z+Math.sin(t*2+o.ph)*5*Z;
      ctx.fillStyle=o.c;ctx.save();ctx.translate(s.sx,s.sy-z);
      ctx.beginPath();ctx.ellipse(-3*Z*Math.abs(Math.cos(a)),0,3.4*Z*Math.abs(Math.cos(a))+.4,4*Z,-.5,0,7);ctx.ellipse(3*Z*Math.abs(Math.cos(a)),0,3.4*Z*Math.abs(Math.cos(a))+.4,4*Z,.5,0,7);ctx.fill();ctx.restore();
    }
  }
  // partikel
  for(const q of OW.parts){
    const s=owS(q.x,q.y),f=q.life/q.max;
    const sy=s.sy-q.z*Z;
    if(q.k==='bird'){continue;}
    ctx.globalAlpha=Math.max(0,q.k==='snow'||q.k==='petal'?Math.min(1,f*3):f);
    if(q.k==='fish'){ctx.fillStyle='#ffb45e';ctx.beginPath();ctx.ellipse(s.sx,sy,6*Z,3*Z,-Math.atan2(-q.vz,2)*.6,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.sx+3*Z,sy-1,1,0,7);ctx.fill();}
    else if(q.k==='splash'){ctx.strokeStyle='#fff';ctx.lineWidth=2*Z;ctx.beginPath();ctx.ellipse(s.sx,sy,(1-f)*16*Z+3,(1-f)*8*Z+1.5,0,0,7);ctx.stroke();}
    else if(q.k==='spark'){ctx.fillStyle=q.c;ctx.beginPath();const r=q.s*Z*(.4+f);ctx.moveTo(s.sx,sy-r);ctx.lineTo(s.sx+r*.35,sy);ctx.lineTo(s.sx,sy+r);ctx.lineTo(s.sx-r*.35,sy);ctx.fill();ctx.beginPath();ctx.moveTo(s.sx-r,sy);ctx.lineTo(s.sx,sy+r*.35);ctx.lineTo(s.sx+r,sy);ctx.lineTo(s.sx,sy-r*.35);ctx.fill();}
    else if(q.k==='dust'){ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.arc(s.sx,sy,(1.8+(1-f)*5)*Z,0,7);ctx.fill();}
    else if(q.k==='petal'){ctx.fillStyle=q.c;ctx.beginPath();ctx.ellipse(s.sx,sy,3.4*Z,2*Z,q.x*2+OW.t*3,0,7);ctx.fill();}
    else if(q.k==='snow'){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.sx,sy,2*Z,0,7);ctx.fill();}
    else if(q.k==='fly'){ctx.fillStyle='rgba(255,245,150,'+(.5+.5*Math.sin(OW.t*6+q.x*9))+')';ctx.beginPath();ctx.arc(s.sx,sy,2*Z,0,7);ctx.fill();}
    else if(q.k==='txt'){ctx.fillStyle=q.c;ctx.strokeStyle='#3a2a5c';ctx.lineWidth=3;ctx.font='900 '+(15*Z)+'px Nunito,sans-serif';ctx.textAlign='center';ctx.strokeText(q.t,s.sx,sy);ctx.fillText(q.t,s.sx,sy);}
    ctx.globalAlpha=1;
  }
  // burung terbang + bayangan
  for(const b of OW.birds){
    const s=owS(b.x,b.y),a=Math.sin(t*10+b.ph)*5*Z;
    ctx.fillStyle='rgba(20,40,80,.16)';ctx.beginPath();ctx.ellipse(s.sx,s.sy,7*Z,3*Z,0,0,7);ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=2.4*Z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(s.sx-9*Z,s.sy-70*Z-a);ctx.quadraticCurveTo(s.sx-4*Z,s.sy-76*Z,s.sx,s.sy-70*Z);ctx.quadraticCurveTo(s.sx+4*Z,s.sy-76*Z,s.sx+9*Z,s.sy-70*Z-a);ctx.stroke();
  }
  // ---- cahaya hari
  const tc=todColor(OW.tod),rn=OW.rain;
  const mr=Math.round(tc[0]*(1-rn*.28)),mg=Math.round(tc[1]*(1-rn*.22)),mb=Math.round(tc[2]*(1-rn*.12));
  if(mr<250||mg<250||mb<250){ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb('+mr+','+mg+','+mb+')';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';}
  const nt=clamp(1-(tc[0]+tc[1]+tc[2])/700,0,1);
  if(nt>.12){
    ctx.globalCompositeOperation='lighter';
    const glow=(sx,sy,r,c,a)=>{if(sx<-r||sx>w+r||sy<-r||sy>h+r)return;const g=ctx.createRadialGradient(sx,sy,2,sx,sy,r);g.addColorStop(0,'rgba('+c+','+a+')');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,r,0,7);ctx.fill();};
    W.lights.forEach(l=>{const s=owS(l.x,l.y);glow(s.sx,s.sy-24*Z,l.r*Z*(l.n?1:1.5),l.c,.42*nt*(.9+.1*Math.sin(t*3+l.x)));});
    W.crystals.forEach(c=>{if(c.got)return;const s=owS(c.x,c.y);glow(s.sx,s.sy-30*Z,46*Z,'120,230,255',.55*nt);});
    W.mons.forEach(m=>{if(m.boss&&!m.dead){const s=owS(m.x,m.y);glow(s.sx,s.sy-50*Z,120*Z,'255,210,110',.4*nt);}});
    const ps=owS(p.x,p.y);glow(ps.sx,ps.sy-30*Z,150*Z,'255,225,160',.4*nt);
    ctx.globalCompositeOperation='source-over';
  }
  // hujan
  if(rn>.05){
    ctx.strokeStyle='rgba(215,235,255,'+(.45*rn)+')';ctx.lineWidth=1.4;ctx.beginPath();
    const cnt=Math.round(140*rn*(w*h/400000+.4));
    for(let i=0;i<cnt;i++){const r1=h2(i,1,5),r2=h2(i,2,5),sp=.8+r1*.6,yy=((t*sp*1.6+r2)%1)*(h+60)-30,xx=((r1*w*1.4+yy*.18-30)%(w+60));ctx.moveTo(xx,yy);ctx.lineTo(xx-3,yy+13);}
    ctx.stroke();
    ctx.fillStyle='rgba(120,150,190,'+(.1*rn)+')';ctx.fillRect(0,0,w,h);
  }
  // vinyet lembut
  const vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.5,w/2,h/2,Math.max(w,h)*.85);vg.addColorStop(0,'rgba(30,20,70,0)');vg.addColorStop(1,'rgba(30,20,70,.28)');ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
  if(OW.flash>0){ctx.fillStyle='rgba(255,255,255,'+OW.flash+')';ctx.fillRect(0,0,w,h);}
}
function owTag(sx,sy,n){
  const ctx=OW.ctx,d=Math.hypot(n.x-OW.p.x,n.y-OW.p.y),Z=OW.Z;
  if(d<4.2){
    const nm=CAST[n.k].n;ctx.font='900 '+(12*Z)+'px Nunito,sans-serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';
    const tw=ctx.measureText(nm).width+14*Z;
    ctx.fillStyle='rgba(255,255,255,.92)';ctx.strokeStyle='#3a2a5c';ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(sx-tw/2,sy-14*Z,tw,18*Z,9*Z);ctx.fill();ctx.stroke();
    ctx.fillStyle='#3a2a5c';ctx.fillText(nm,sx,sy-1*Z);
  }
  const q=OW.quest;let mark='';
  if(q&&q.from===n.k)mark=q.done?'?':'…';else if(!q)mark='!';
  if(mark&&mark!=='…'){const by=sy-(d<4.2?22:6)*Z+Math.sin(OW.t*4+n.seed)*3;ctx.fillStyle=mark==='!'?'#ffd24d':'#6dd6ff';ctx.strokeStyle='#3a2a5c';ctx.lineWidth=3.5;ctx.font='900 '+(24*Z)+'px Nunito,sans-serif';ctx.textAlign='center';ctx.strokeText(mark,sx,by);ctx.fillText(mark,sx,by);}
}

Object.defineProperty(OW,'quest',{get:()=>S.ow&&S.ow.quest||null});

/* ---------- logika Open World ---------- */
const OW_TTL={w:480,c:1200,m:240,b:1500};
const owNow=()=>Date.now()/1000;
const rn=n=>Math.floor(Math.random()*n);
function owMaxHp(){return 5+Math.min(2,Math.max(0,S.adv.party.length-1))+(petFx('heart')?1:0);}
function owState(){
  if(!S.ow||typeof S.ow!=='object')S.ow={};
  const o=S.ow;
  ['dict','col','chest','kills','vis','boss','stat'].forEach(k=>{if(!o[k]||typeof o[k]!=='object'||Array.isArray(o[k]))o[k]={};});
  ['words','mons','chests','quests'].forEach(k=>{o.stat[k]=Number(o.stat[k])||0;});
  if(!(o.seed>0))o.seed=1+rn(99998);
  if(typeof o.tod!=='number'||!isFinite(o.tod))o.tod=9;
  o.play=Number(o.play)||0;
  if(o.quest&&typeof o.quest!=='object')o.quest=null;
  return o;
}
function owRestoreFlags(){
  const W=OW.W,o=S.ow,now=owNow();
  W.crystals.forEach(c=>{c.got=!!(o.col[c.id]&&now-o.col[c.id]<OW_TTL.w);});
  W.chests.forEach(c=>{c.open=!!(o.chest[c.id]&&now-o.chest[c.id]<OW_TTL.c);});
  W.mons.forEach(m=>{
    const ts=o.kills[m.id];
    const was=m.dead;m.dead=!!(ts&&now-ts<(m.boss?OW_TTL.b:OW_TTL.m));
    if(was&&!m.dead){m.x=m.hx;m.y=m.hy;m.hp=m.boss?5:3;m.stun=0;m.chase=false;}
  });
}
function owInitWorld(){
  const W=OW.W;
  OW.npcs=[];
  W.villages.forEach(v=>{
    const offs=[[-2.2,1.9],[2.4,-1.8],[.6,3.3]];
    v.npcKeys.forEach((k,i)=>{
      const hx=v.x+offs[i][0],hy=v.y+offs[i][1];
      OW.npcs.push({k,vi:v.id,hx,hy,x:hx,y:hy,tx:null,ty:null,wait:Math.random()*3,turn:i%2?-1:1,walk:0,moving:false,vx:0,away:false,seed:i*1.3+v.id});
    });
  });
  W.mons.forEach(m=>{m.stun=0;m.chase=false;m.wt=Math.random()*3;m.tx=null;m.turn=1;m.walk=0;m.vx=0;m.dead=false;m.hp=m.boss?5:3;});
}
function owMkFollowers(){
  OW.fol=[];
  S.adv.party.filter(k=>k!=='mochi'&&CAST[k]).slice(0,3).forEach((k,i)=>OW.fol.push({key:k,pet:false,x:OW.p.x,y:OW.p.y,turn:1,walk:0,moving:false,vx:0,away:false,seed:i+2,idx:(i+1)*6}));
  if(S.pet&&PET_MAP[S.pet])OW.fol.push({key:'pet:'+S.pet,pet:true,x:OW.p.x,y:OW.p.y,turn:1,walk:0,moving:false,vx:0,away:false,seed:9,idx:3});
}
function owFreeNear(x,y){
  if(!owSolid(x,y))return{x:Math.floor(x)+.5,y:Math.floor(y)+.5};
  for(let r=1;r<8;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(!owSolid(x+dx,y+dy))return{x:Math.floor(x+dx)+.5,y:Math.floor(y+dy)+.5};}
  return{x:OW.W.spawn.x,y:OW.W.spawn.y};
}
function owPath(x0,y0,x1,y1){
  const W=OW.W,N=W.N,sx=Math.floor(x0),sy=Math.floor(y0);
  let g=owFreeNear(x1,y1);const tx=Math.floor(g.x),ty=Math.floor(g.y);
  if(sx===tx&&sy===ty)return[{x:g.x,y:g.y}];
  const prev=new Int32Array(N*N).fill(-1),q=[sy*N+sx];prev[q[0]]=q[0];
  const D=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  let found=false;
  for(let i=0;i<q.length&&i<5000;i++){
    const c=q[i],cx=c%N,cy=(c/N)|0;
    if(cx===tx&&cy===ty){found=true;break;}
    for(const d of D){
      const nx=cx+d[0],ny=cy+d[1];if(owSolid(nx,ny)||prev[ny*N+nx]>=0)continue;
      if(d[0]&&d[1]&&(owSolid(cx+d[0],cy)||owSolid(cx,cy+d[1])))continue;
      prev[ny*N+nx]=c;q.push(ny*N+nx);
    }
  }
  if(!found)return null;
  const out=[];let c=ty*N+tx;
  while(c!==sy*N+sx){out.push({x:c%N+.5,y:((c/N)|0)+.5});c=prev[c];}
  out.reverse();out[out.length-1]={x:g.x,y:g.y};
  return out;
}
function owMove(e,dx,dy,r){
  r=r||.26;
  const hit=(x,y)=>owSolid(x-r,y-r)||owSolid(x+r,y-r)||owSolid(x-r,y+r)||owSolid(x+r,y+r);
  if(!hit(e.x+dx,e.y))e.x+=dx;
  if(!hit(e.x,e.y+dy))e.y+=dy;
}
function owPart(k,x,y,z,vx,vy,vz,life,o){
  if(OW.parts.length>260)return;
  OW.parts.push(Object.assign({k,x,y,z,vx,vy,vz,life,max:life,c:'#fff',s:6},o||{}));
}
function owBurst(x,y,z,n,cols){
  for(let i=0;i<n;i++){const a=Math.random()*6.28,s=.8+Math.random()*1.6;owPart('spark',x,y,z,Math.cos(a)*s*.5,Math.sin(a)*s*.5,40+Math.random()*80,.5+Math.random()*.5,{c:cols[rn(cols.length)],s:4+Math.random()*5,g:-220});}
}
function owFloat(x,y,txt,c){owPart('txt',x,y,60,0,0,38,1.3,{t:txt,c:c||'#fff'});}
function owBanner(t,s){OW.banner={t:3.2,txt:t,sub:s||''};const b=$('owBanner');b.innerHTML='<b>'+esc(t)+'</b>'+(s?'<small>'+esc(s)+'</small>':'');b.classList.remove('show');void b.offsetWidth;b.classList.add('show');}
function owInVillage(x,y,r){const W=OW.W;let b=null,bd=r||9;W.villages.forEach(v=>{const d=Math.hypot(v.x-x,v.y-y);if(d<bd){bd=d;b=v;}});return b;}

function owUpdate(dt){
  const W=OW.W,p=OW.p,o=S.ow;
  OW.t+=dt;
  if(!OW.modal){OW.tod=(OW.tod+dt*.05)%24;o.play+=dt;}
  OW.rainT-=dt;
  if(OW.rainT<=0){OW.rainOn=!OW.rainOn;OW.rainT=OW.rainOn?(35+Math.random()*45):(90+Math.random()*170);}
  OW.rain+=((OW.rainOn?1:0)-OW.rain)*Math.min(1,dt*.5);
  if(OW.shake>0)OW.shake=Math.max(0,OW.shake-dt*2.5);
  if(OW.flash>0)OW.flash=Math.max(0,OW.flash-dt*2);
  OW.tick=(OW.tick||0)+dt;
  if(OW.tick>1){OW.tick=0;owRestoreFlags();}
  // ---- masukan
  let ix=0,iy=0;const K=OW.keys;
  if(!OW.modal){
    ix=(K.right?1:0)-(K.left?1:0);iy=(K.down?1:0)-(K.up?1:0);
    ix+=OW.joy.x+(OW.steer?OW.steer.x:0);iy+=OW.joy.y+(OW.steer?OW.steer.y:0);
  }
  let mag=Math.hypot(ix,iy);if(mag>1){ix/=mag;iy/=mag;mag=1;}
  let usePath=false;
  if(mag>.08){OW.path=null;OW.pend=null;}
  else if(OW.path&&OW.path.length&&!OW.modal){
    const wp=OW.path[0],dx=wp.x-p.x,dy=wp.y-p.y;
    if(Math.hypot(dx,dy)<.18){OW.path.shift();if(!OW.path.length){OW.path=null;}}
    if(OW.path&&OW.path.length){const w2=OW.path[0],sdx=((w2.x-p.x)-(w2.y-p.y))*32,sdy=((w2.x-p.x)+(w2.y-p.y))*16,l=Math.hypot(sdx,sdy)||1;ix=sdx/l;iy=sdy/l;mag=1;usePath=true;}
  }
  p.moving=mag>.08;
  if(p.moving){
    let vx=(ix/32+iy/16)/2,vy=(iy/16-ix/32)/2;const l=Math.hypot(vx,vy)||1;vx/=l;vy/=l;
    const run=(K.run||OW.runBtn||OW.joyRun)&&!usePath;p.run=run;
    const sp=(run?5.8:3.6)*Math.min(1,mag);
    const ox=p.x,oy=p.y;
    owMove(p,vx*sp*dt,vy*sp*dt);
    if(Math.hypot(p.x-ox,p.y-oy)<sp*dt*.2&&usePath){OW.pstuck=(OW.pstuck||0)+dt;if(OW.pstuck>.4){OW.path=null;OW.pstuck=0;}}else OW.pstuck=0;
    const sl=Math.hypot(ix,iy)||1;p.sx=ix/sl;p.sy=iy/sl;
    p.walk+=sp*dt*2.3;
    p.away=p.sy<-.38;
    if(Math.abs(p.sx)>.2)p.tt=p.sx>0?1:-1;
    if(run&&Math.random()<dt*9)owPart('dust',p.x,p.y,2,-vx*.5,-vy*.5,10,.5);
  }
  p.turn+=((p.tt||1)-p.turn)*Math.min(1,dt*16);
  if(p.hv!=null){p.hop+=p.hv*dt;p.hv-=620*dt;if(p.hop<=0){p.hop=0;p.hv=null;}}
  if(p.inv>0)p.inv-=dt;
  // jejak pengikut
  const lt=p.trail[0];
  if(!lt||Math.hypot(lt.x-p.x,lt.y-p.y)>.16){p.trail.unshift({x:p.x,y:p.y});if(p.trail.length>80)p.trail.length=80;}
  OW.fol.forEach(f=>{
    const tg=p.trail[Math.min(p.trail.length-1,f.idx)];if(!tg)return;
    const dx=tg.x-f.x,dy=tg.y-f.y,d=Math.hypot(dx,dy);
    f.moving=d>.06;
    if(f.moving){const k=Math.min(1,dt*7);f.x+=dx*k;f.y+=dy*k;f.walk+=Math.min(d*3,7)*dt*2.3;
      const sdx=(dx-dy)*32,sdy=(dx+dy)*16,l=Math.hypot(sdx,sdy)||1;f.vx=sdx/l;f.away=sdy/l<-.4;if(Math.abs(sdx/l)>.2)f.tt=sdx>0?1:-1;}
    f.turn+=((f.tt||1)-f.turn)*Math.min(1,dt*14);
    if(f.pet&&!f.moving&&Math.random()<dt*.15)f.hop=1;
  });
  // ---- kamera
  const la=OW.cam;
  const tx=p.x+(p.moving?(((p.sx+p.sy*.5)/2)):0)*.0,ty=p.y;
  const k=1-Math.exp(-dt*(OW.first?20:5));OW.first=false;
  la.x+=(tx-la.x)*k;la.y+=(ty-la.y)*k;
  // ---- NPC
  OW.npcs.forEach(n=>{
    if(OW.modal&&OW.talking===n){n.moving=false;return;}
    n.wait-=dt;
    if(n.tx==null&&n.wait<=0){const gx=n.hx+(Math.random()-.5)*4.4,gy=n.hy+(Math.random()-.5)*4.4;if(!owSolid(gx,gy)&&owT(gx,gy)===T_COBBLE||(!owSolid(gx,gy)&&Math.hypot(gx-n.hx,gy-n.hy)<2)){n.tx=gx;n.ty=gy;}else n.wait=.5;}
    const dp=Math.hypot(n.x-p.x,n.y-p.y);
    if(n.tx!=null&&dp>1.2){
      const dx=n.tx-n.x,dy=n.ty-n.y,d=Math.hypot(dx,dy);
      if(d<.12){n.tx=null;n.wait=1.5+Math.random()*4;n.moving=false;}
      else{const sp=1.15*dt;owMove(n,dx/d*sp,dy/d*sp,.22);n.moving=true;n.walk+=sp*2.6*2.3;
        const sdx=(dx-dy)*32,sdy=(dx+dy)*16,l=Math.hypot(sdx,sdy)||1;n.vx=sdx/l;n.away=sdy/l<-.45;if(Math.abs(sdx/l)>.25)n.tt=sdx>0?1:-1;}
    }else{n.moving=false;
      if(dp<3.2){const dx=p.x-n.x,dy=p.y-n.y,sdx=(dx-dy);if(Math.abs(sdx)>.1)n.tt=sdx>0?1:-1;n.away=false;}}
    n.turn+=((n.tt||1)-n.turn)*Math.min(1,dt*12);
  });
  // ---- monster
  const night=owNight();
  W.mons.forEach(m=>{
    if(m.dead)return;
    const dxp=p.x-m.x,dyp=p.y-m.y,d=Math.hypot(dxp,dyp);
    if(d>40)return;
    if(m.stun>0)m.stun-=dt;
    const safe=!!owInVillage(m.x,m.y,8.5)||!!owInVillage(p.x,p.y,7.5);
    const aggro=(m.boss?6.5:4.8)*(1+night*.25);
    if(OW.modal||m.stun>0||p.inv>0||safe||p.hpDead){m.chase=false;}
    else if(!m.chase&&d<aggro)m.chase=true;
    else if(m.chase&&d>aggro+3.5)m.chase=false;
    let tx,ty,sp;
    if(m.chase){tx=p.x;ty=p.y;sp=m.boss?2.3:2.9;}
    else{
      m.wt-=dt;
      if(m.tx==null&&m.wt<=0){const a=Math.random()*6.28,r=Math.random()*3;m.tx=m.hx+Math.cos(a)*r;m.ty=m.hy+Math.sin(a)*r;m.wt=1+Math.random()*3;}
      tx=m.tx;ty=m.ty;sp=1;
      if(Math.hypot(m.x-m.hx,m.y-m.hy)>7){tx=m.hx;ty=m.hy;sp=1.6;}
    }
    if(tx!=null&&!OW.modal&&m.stun<=0){
      const dx=tx-m.x,dy=ty-m.y,dd=Math.hypot(dx,dy);
      if(dd>.15){owMove(m,dx/dd*sp*dt,dy/dd*sp*dt,.3);m.walk+=sp*dt*2.5*2.3;const sdx=(dx-dy);if(Math.abs(sdx)>.2)m.tt=sdx>0?1:-1;m.vx=sdx;}
      else m.tx=null;
    }
    m.turn+=((m.tt||1)-m.turn)*Math.min(1,dt*10);
    if(m.chase&&d<.8&&!OW.modal)owBattle(m);
  });
  // ---- kristal
  for(const c of W.crystals){if(!c.got&&Math.abs(c.x-p.x)<1&&Math.abs(c.y-p.y)<1&&Math.hypot(c.x-p.x,c.y-p.y)<.9&&!OW.modal)owPickCrystal(c);}
  // ---- area & desa
  const v=owInVillage(p.x,p.y,7.5);
  const area=v?'v'+v.id:'b'+owT(p.x,p.y);
  if(area!==OW.area){
    OW.area=area;
    if(v){owBanner(v.name,v.en);if(!o.vis[v.id]){o.vis[v.id]=1;S.points+=10;addCoins(10,true);toast('Desa baru ditemukan! +10 poin','🏘️','win');save();}}
    else if(OW.areaSet)owBanner(BIOME_NAME[owT(p.x,p.y)]||'');
    OW.areaSet=true;
  }
  OW.inV=!!v;
  p.regen=(p.regen||0)+dt*(v?.5:.14);
  if(p.regen>=1){p.regen=0;if(p.hp<owMaxHp()){p.hp++;owFloat(p.x,p.y,'+❤','#ff7b9c');}}
  // ---- misi
  owQuestTick();
  // ---- interaksi
  owFindAct();
  if(OW.pend&&!OW.modal){const r=OW.pend;if(Math.hypot(r.x-p.x,r.y-p.y)<(r.rng||1.6)){OW.pend=null;OW.path=null;owAct(r);}}
  // ---- ambient
  owAmbient(dt);
  for(let i=OW.parts.length-1;i>=0;i--){
    const q=OW.parts[i];q.life-=dt;
    q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;
    if(q.k==='fish'){q.vz-=430*dt;if(q.z<0&&q.vz<0){owPart('splash',q.x,q.y,0,0,0,0,.6);q.life=0;}}
    else if(q.g)q.vz+=q.g*dt;
    else if(q.k==='fly'){q.x+=Math.sin(OW.t*1.3+q.s)*dt*.6;q.y+=Math.cos(OW.t*1.1+q.s)*dt*.6;q.z=18+Math.sin(OW.t*2+q.s)*8;}
    if(q.k==='snow'||q.k==='petal'){q.x+=Math.sin(OW.t+q.s)*dt*.5;if(q.z<0)q.life=0;}
    if(q.life<=0)OW.parts.splice(i,1);
  }
  // autosimpan
  OW.saveT+=dt;if(OW.saveT>5){OW.saveT=0;owSave();}
}
function owAmbient(dt){
  const p=OW.p,W=OW.W,cx=OW.cam.x,cy=OW.cam.y,bt=owT(cx,cy),night=owNight();
  const R=()=>({x:cx+(Math.random()-.5)*22,y:cy+(Math.random()-.5)*22});
  OW.acc=(OW.acc||0)+dt;
  if(bt===T_SAKURA&&Math.random()<dt*7){const r=R();owPart('petal',r.x,r.y,110+Math.random()*30,.9,.5,-26,5,{c:Math.random()<.5?'#ffd0e2':'#ff9ec4',s:Math.random()*6});}
  if(bt===T_SNOW&&Math.random()<dt*16){const r=R();owPart('snow',r.x,r.y,130,.3,.3,-34,4.5,{s:Math.random()*6});}
  if(OW.rain>.3&&Math.random()<dt*10){const r=R();if(owT(r.x,r.y)>=T_SAND)owPart('splash',r.x,r.y,0,0,0,0,.35);}
  if(night>.35&&(bt===T_GRASS||bt===T_FOREST||bt===T_SAKURA)&&Math.random()<dt*4){const r=R();owPart('fly',r.x,r.y,20,0,0,0,6,{s:Math.random()*9});}
  // ikan melompat
  OW.nfish=(OW.nfish||0)-dt;
  if(OW.nfish<=0){OW.nfish=2+Math.random()*3;for(let i=0;i<10;i++){const r=R();if(owT(r.x,r.y)===T_DEEP&&Math.hypot(r.x-p.x,r.y-p.y)>3){owPart('splash',r.x,r.y,0,0,0,0,.6);owPart('fish',r.x,r.y,0,0,0,170,3);break;}}}
  // burung
  while(OW.birds.length<3)OW.birds.push({x:cx-14+Math.random()*10,y:cy-10+Math.random()*20,vx:1.8+Math.random(),vy:-.7+Math.random()*.4,ph:Math.random()*6});
  OW.birds.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;if(Math.hypot(b.x-cx,b.y-cy)>22){b.x=cx-18+Math.random()*4;b.y=cy-8+Math.random()*16;}});
  // kupu-kupu
  const day=night<.25&&OW.rain<.4&&(bt===T_GRASS||bt===T_FOREST||bt===T_SAKURA);
  if(day&&OW.flies.length<6&&Math.random()<dt*2){const r=R();OW.flies.push({x:r.x,y:r.y,ph:Math.random()*6,c:['#ff9ec7','#ffd24d','#9be8ff','#c9b8ff'][rn(4)],vx:0,vy:0,t:0});}
  OW.flies.forEach((f,i)=>{f.t+=dt;f.vx+=(Math.random()-.5)*dt*4;f.vy+=(Math.random()-.5)*dt*4;f.vx=clamp(f.vx,-1,1);f.vy=clamp(f.vy,-1,1);f.x+=f.vx*dt;f.y+=f.vy*dt;});
  OW.flies=OW.flies.filter(f=>Math.hypot(f.x-cx,f.y-cy)<16&&(day||f.t<4));
}
function owFindAct(){
  const W=OW.W,p=OW.p;let best=null,bd=99;
  const cand=(type,ref,x,y,rng,label,ico)=>{const d=Math.hypot(x-p.x,y-p.y);if(d<rng&&d<bd){bd=d;best={type,ref,x,y,label,ico,rng:rng};}};
  OW.npcs.forEach(n=>cand('npc',n,n.x,n.y,1.9,'Bicara','💬'));
  W.chests.forEach(c=>{if(!c.open)cand('chest',c,c.x,c.y,1.6,'Buka','📦');});
  W.signs.forEach(s=>cand('sign',s,s.x,s.y,1.9,'Baca','📖'));
  W.villages.forEach(v=>cand('fountain',v,v.x,v.y,2.5,'Istirahat','⛲'));
  const key=best?best.type+(best.ref.id||best.ref.k||''):'';
  if(key!==OW.actKey){OW.actKey=key;const b=$('owAct');if(best){b.innerHTML='<span>'+best.ico+'</span><small>'+best.label+'</small>';b.classList.add('on');}else{b.innerHTML='<span>✋</span><small>—</small>';b.classList.remove('on');}}
  OW.act=best;
}
function owAct(a){
  a=a||OW.act;if(!a||OW.modal)return;
  if(a.type==='npc')owTalk(a.ref);
  else if(a.type==='chest')owChest(a.ref);
  else if(a.type==='sign')owSign(a.ref);
  else if(a.type==='fountain')owFountain(a.ref);
}
function owHop(){const p=OW.p;if(p.hv==null&&!OW.modal){p.hv=240;p.hop=1;sfx('tap');}}
function owSave(){
  const o=S.ow,p=OW.p;if(!OW.W)return;
  o.x=+p.x.toFixed(2);o.y=+p.y.toFixed(2);o.tod=+OW.tod.toFixed(2);o.hp=p.hp;o.rain=OW.rainOn?1:0;
  save();
}
/* ---------- kristal kata ---------- */
function owPickCrystal(c){
  const o=S.ow;o.col[c.id]=owNow();c.got=true;
  const first=!o.dict[c.w.en];o.dict[c.w.en]=(o.dict[c.w.en]||0)+1;
  if(first)o.stat.words++;
  speak(c.w.en);sfx('pick');
  S.points+=first?3:1;statAdd('word',1);
  owBurst(c.x,c.y,26,14,['#7fe3ff','#fff','#c9b8ff','#ffd24d']);
  owFloat(c.x,c.y,c.w.en,'#c9f6ff');
  toast((c.w.pic||'')+' '+c.w.en+' = '+c.w.id,'💎','win');
  const q=o.quest;
  if(q&&!q.done){
    if(q.type==='collect'){q.prog=Math.min(q.need,q.prog+1);if(q.prog>=q.need)owQuestDone();}
    else if(q.type==='find'&&q.cid===c.id)owQuestDone();
  }
  save();
}
/* ---------- misi ---------- */
function owQText(q){
  if(q.type==='collect')return 'Kumpulkan '+q.need+' kristal kata ('+q.prog+'/'+q.need+')';
  if(q.type==='slay')return 'Kalahkan '+q.need+' monster ('+q.prog+'/'+q.need+')';
  if(q.type==='find')return 'Temukan kristal “'+q.w+'” '+(q.pic||'')+' ('+q.wid+')';
  if(q.type==='visit')return 'Kunjungi '+(OW.W.villages[q.vid]?OW.W.villages[q.vid].name:'desa');
  return '';
}
function owNewQuest(n){
  const W=OW.W,p=OW.p,r=Math.random();let q=null;
  if(r<.45&&false){}
  if(r<.28)q={type:'collect',need:3+rn(3),prog:0};
  else if(r<.55)q={type:'slay',need:2+rn(2),prog:0};
  else if(r<.82){
    const cs=W.crystals.filter(c=>!c.got&&Math.hypot(c.x-p.x,c.y-p.y)>8&&Math.hypot(c.x-p.x,c.y-p.y)<34);
    if(cs.length){const c=cs[rn(cs.length)],wd=ALLW.find(x=>x.en===c.w.en)||{};q={type:'find',cid:c.id,w:c.w.en,wid:c.w.id,pic:wd.pic||'',x:c.x,y:c.y};}
  }
  if(!q){
    const vs=W.villages.filter(v=>Math.hypot(v.x-p.x,v.y-p.y)>14);
    if(vs.length)q={type:'visit',vid:vs[rn(vs.length)].id};
    else q={type:'collect',need:4,prog:0};
  }
  q.from=n.k;q.done=false;q.coin=40+rn(30)+(q.need||3)*8;
  return q;
}
function owQuestDone(){
  const q=S.ow.quest;if(!q||q.done)return;
  q.done=true;sfx('win');
  toast('Misi selesai! Temui '+CAST[q.from].n+' 🎉','✅','win');
  owBurst(OW.p.x,OW.p.y,40,20,['#ffd24d','#fff','#ff7bac']);
}
function owQuestTick(){
  const q=S.ow.quest,p=OW.p;if(!q||q.done)return;
  if(q.type==='visit'){const v=OW.W.villages[q.vid];if(v&&Math.hypot(v.x-p.x,v.y-p.y)<6)owQuestDone();}
}
function owQuestTarget(){
  const q=S.ow.quest,W=OW.W;if(!q)return null;
  if(q.done){const n=OW.npcs.find(n=>n.k===q.from);return n?{x:n.x,y:n.y,ico:'❓'}:null;}
  if(q.type==='find'){const c=W.crystals.find(c=>c.id===q.cid);return c&&!c.got?{x:c.x,y:c.y,ico:'⭐'}:null;}
  if(q.type==='visit'){const v=W.villages[q.vid];return v?{x:v.x,y:v.y,ico:'🏘️'}:null;}
  if(q.type==='slay'){let b=null,bd=99;W.mons.forEach(m=>{if(m.boss||m.dead)return;const d=Math.hypot(m.x-OW.p.x,m.y-OW.p.y);if(d<bd){bd=d;b=m;}});return b?{x:b.x,y:b.y,ico:'⚔️',near:true}:null;}
  if(q.type==='collect'){let b=null,bd=99;W.crystals.forEach(m=>{if(m.got)return;const d=Math.hypot(m.x-OW.p.x,m.y-OW.p.y);if(d<bd){bd=d;b=m;}});return b?{x:b.x,y:b.y,ico:'💎',near:true}:null;}
  return null;
}

/* ---------- UI Open World: kuis, dialog, menu ---------- */
function owModalShow(html){OW.modal=true;const m=$('owModal');m.innerHTML=html;m.hidden=false;}
function owModalHide(){OW.modal=false;OW.talking=null;const m=$('owModal');m.hidden=true;m.innerHTML='';OW.quiz=null;try{speechSynthesis.cancel();}catch(e){}}
function owMakeQ(){
  const pl=poolAll(),dk=Object.keys(S.ow.dict);let w=null;
  if(dk.length>=4&&Math.random()<.4)w=ALLW.find(x=>x.en===dk[rn(dk.length)]);
  if(!w)w=pl[rn(pl.length)];
  const kinds=w.pic?['pic','id2en','en2id','listen']:['id2en','en2id','listen'];
  const kind=kinds[rn(kinds.length)],forEn=kind!=='en2id';
  const same=shuffle(pl.filter(x=>x.en!==w.en&&x.id!==w.id&&x.t===w.t)),rest=shuffle(pl.filter(x=>x.en!==w.en&&x.id!==w.id&&x.t!==w.t));
  const ds=[];same.concat(rest).forEach(x=>{if(ds.length<3&&!ds.some(d=>d.en===x.en||d.id===x.id))ds.push(x);});
  const opts=shuffle([w].concat(ds)).map(x=>({t:forEn?x.en:x.id,ok:x===w}));
  return{kind,w,opts};
}
function owQPrompt(q){
  const w=q.w;
  if(q.kind==='pic')return `<div class="owq-pic">${w.pic}</div><p>Apa bahasa Inggrisnya?</p>`;
  if(q.kind==='id2en')return `<p>Apa bahasa Inggris dari</p><div class="owq-word">${esc(w.id)}</div>`;
  if(q.kind==='en2id')return `<p>Apa arti kata ini?</p><div class="owq-word">${esc(w.en)} <button class="owq-spk" data-a="spk" aria-label="Dengarkan">🔊</button></div>`;
  return `<p>Dengarkan, lalu pilih kata yang benar</p><button class="owq-spk big" data-a="spk" aria-label="Dengarkan">🔊</button>`;
}
/* cfg:{mode:'battle'|'chat', foe:key, foeHp, rounds, title, onEnd(res)} */
function owQuiz(cfg){
  const st={cfg,fhp:cfg.foeHp||0,fmax:cfg.foeHp||0,ok:0,bad:0,n:0,busy:false,q:null,hit:'',words:[]};
  OW.quiz=st;
  const p=OW.p;
  const fin=r=>{OW.quiz=null;cfg.onEnd(r);};
  const draw=()=>{
    const q=st.q,hearts='❤️'.repeat(Math.max(0,p.hp))+'🖤'.repeat(Math.max(0,owMaxHp()-p.hp));
    const pct=st.fmax?Math.round(st.fhp/st.fmax*100):Math.round(st.n/cfg.rounds*100);
    owModalShow(`<div class="wcard owq">
      <div class="owq-top">
        <div class="owq-side ${st.hit==='hero'?'hurt':''} ${st.hit==='heroWin'?'jump':''}"><span class="owq-av">${avatar('mochi',st.hit==='hero'?'sad':'happy')}</span>${cfg.mode==='battle'?`<small class="owq-hearts">${hearts}</small>`:''}</div>
        <div class="owq-vs">${cfg.mode==='battle'?'⚔️':'💬'}</div>
        <div class="owq-side ${st.hit==='foe'?'hurt':''}"><span class="owq-av">${avatar(cfg.foe,st.hit==='foe'?'sad':(cfg.mode==='battle'?'angry':'happy'))}</span><span class="owq-hp"><i style="width:${pct}%"></i></span><small>${esc(cfg.title)}</small></div>
      </div>
      <div class="owq-card" id="owqCard">${owQPrompt(q)}</div>
      <div class="owq-opts">${q.opts.map((o,i)=>`<button class="owq-opt" data-i="${i}"><i>${i+1}</i>${esc(o.t)}</button>`).join('')}</div>
      <div class="wfb" id="owqF" aria-live="polite"></div>
      ${cfg.mode==='battle'?'<button class="btn soft owq-flee" data-a="flee">🏃 Kabur</button>':''}
    </div>`);
    if(q.kind==='listen'||(q.kind==='pic'&&false))setTimeout(()=>speak(q.w.en),250);
  };
  const next=()=>{st.q=owMakeQ();st.busy=false;st.hit='';draw();};
  st.pick=i=>{
    if(st.busy||!OW.quiz||OW.quiz!==st)return;
    const q=st.q,o=q.opts[i];if(!o)return;
    st.busy=true;st.n++;
    const btns=document.querySelectorAll('.owq-opt');
    btns.forEach((b,j)=>{b.disabled=true;if(q.opts[j].ok)b.classList.add('good');});
    const fb=$('owqF');
    if(o.ok){
      st.ok++;btns[i].classList.add('good');sfx('ok');speak(q.w.en);
      S.ow.dict[q.w.en]=(S.ow.dict[q.w.en]||0)+1;
      statAdd('correct',1);S.points+=1;
      if(cfg.mode==='battle'){st.fhp--;st.hit='foe';OW.shake=.25;}
      fb.textContent='✅ '+pickOne(PRAISE)+' '+q.w.en+' = '+q.w.id;
    }else{
      st.bad++;btns[i].classList.add('bad');sfx('no');
      if(cfg.mode==='battle'){p.hp--;st.hit='hero';OW.shake=.4;}
      fb.textContent='❌ Jawaban benar: '+(q.kind==='en2id'?q.w.id:q.w.en)+' ('+(q.kind==='en2id'?q.w.en:q.w.id)+')';
    }
    const card=$('owqCard');
    const hp=document.querySelector('.owq-hp i');if(hp&&st.fmax)hp.style.width=Math.max(0,Math.round(st.fhp/st.fmax*100))+'%';
    const hs=document.querySelector('.owq-hearts');if(hs)hs.textContent='❤️'.repeat(Math.max(0,p.hp))+'🖤'.repeat(Math.max(0,owMaxHp()-p.hp));
    const sides=document.querySelectorAll('.owq-side');
    if(st.hit==='foe'&&sides[1])sides[1].classList.add('hurt');
    if(st.hit==='hero'&&sides[0])sides[0].classList.add('hurt');
    setTimeout(()=>{
      if(OW.quiz!==st)return;
      if(cfg.mode==='battle'){
        if(st.fhp<=0)return fin({win:true,st});
        if(p.hp<=0)return fin({win:false,st});
      }else if(st.n>=cfg.rounds)return fin({win:true,st});
      next();
    },o.ok?1050:1700);
  };
  st.flee=()=>{if(OW.quiz===st)fin({flee:true,st});};
  next();
}
function owDelegate(e){
  const t=e.target.closest('[data-a],[data-i]');if(!t)return;
  const st=OW.quiz;
  if(t.dataset.i!=null&&st){st.pick(+t.dataset.i);return;}
  const a=t.dataset.a;
  if(a==='spk'&&st&&st.q){speak(st.q.w.en);return;}
  if(a==='flee'&&st){st.flee();return;}
  const f=OW.acts&&OW.acts[a];if(f){sfx('tap');f(t);}
}
function owCard(who,title,body,btns){
  return `<div class="wcard"><div class="who-row"><div class="npc-av">${who}</div><div><b>${esc(title)}</b><p>${body}</p></div></div><div class="owbtns2">${btns||''}</div></div>`;
}
const owBtn=(a,txt,cls)=>`<button class="btn ${cls||''}" data-a="${a}">${txt}</button>`;
/* ---------- dialog NPC ---------- */
function owTalk(n){
  OW.talking=n;sfx('tap');
  const c=CAST[n.k],q=S.ow.quest;
  const hello=pickOne(['Hello!','Hi there!','Good day!','Nice to see you!']);
  let msg,btns;
  if(q&&q.from===n.k&&q.done){
    msg=`<b>${hello}</b> Kamu berhasil! Terima kasih banyak, ini hadiah untukmu.`;btns=owBtn('turnin','🎁 Ambil hadiah');
  }else if(q&&q.from===n.k){
    msg=`Bagaimana misinya?<br><small>🎯 ${esc(owQText(q))}</small>`;btns=owBtn('quiz','💬 Ngobrol (kuis)','alt')+owBtn('close','Lanjut','soft');
  }else if(!q){
    msg=`<b>${hello}</b> Aku ${esc(c.n)}, ${esc((c.role||'').toLowerCase())}. Mau membantuku? Ada misi kecil untukmu!`;btns=owBtn('accept','🎯 Terima misi')+owBtn('quiz','💬 Kuis cepat','alt')+owBtn('close','Nanti','soft');
  }else{
    msg=`<b>${hello}</b> Kamu sudah punya misi dari ${esc(CAST[q.from].n)}. Mau kuis cepat bersamaku?`;btns=owBtn('quiz','💬 Kuis cepat','alt')+owBtn('close','Tutup','soft');
  }
  OW.acts={
    close:()=>owModalHide(),
    accept:()=>{S.ow.quest=owNewQuest(n);save();owModalHide();toast('Misi baru: '+owQText(S.ow.quest),'🎯');owBanner('Misi baru!',owQText(S.ow.quest));},
    turnin:()=>{
      const q2=S.ow.quest;if(!q2||!q2.done)return owModalHide();
      let it=null;if(Math.random()<.3){it=rollReward(1);if(it)ownItem(it.id);}
      S.points+=15;S.ow.stat.quests++;S.ow.quest=null;statAdd('npc',1);addCoins(q2.coin,true);save();
      sfx('win');owBurst(OW.p.x,OW.p.y,40,24,['#ffd24d','#fff','#ff7bac']);
      owModalShow(owCard(avatar(n.k,'cheer'),c.n,`Hadiah: 🪙 +${q2.coin} koin, ⭐ +15 poin${it?`<br>🎁 Barang baru: <b>${esc(it.n)}</b>`:''}`,owBtn('close','Terima kasih!')));
    },
    quiz:()=>owQuiz({mode:'chat',foe:n.k,rounds:3,title:c.n,onEnd:r=>{
      const ok=r.st.ok;addCoins(ok*4,true);S.points+=ok*2;statAdd('npc',1);save();
      sfx(ok>=2?'win':'ok');
      owModalShow(owCard(avatar(n.k,ok>=2?'cheer':'happy'),c.n,`${ok>=3?'Sempurna!':ok>=2?'Bagus sekali!':'Terus berlatih, ya!'}<br>Benar ${ok}/3 · 🪙 +${ok*4} koin`,owBtn('close','Oke')));
    }})
  };
  owModalShow(owCard(avatar(n.k,'happy'),c.n,msg,btns));
}
/* ---------- pertempuran monster ---------- */
function owBattle(m){
  const p=OW.p;if(OW.modal)return;
  m.chase=false;OW.battleMon=m;sfx('hit');OW.flash=.5;
  try{bgmPlay(m.boss?'boss':'battle',0);}catch(e){}
  const f=FOES[m.k];
  owQuiz({mode:'battle',foe:m.k,foeHp:m.boss?5:3,title:(m.boss?'👑 ':'')+f.n,onEnd:r=>{
    try{bgmScreen('open');}catch(e){}
    const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy)||1;
    if(r.flee){
      m.stun=4;p.inv=3;owMove(p,dx/d*2,dy/d*2);owModalHide();toast('Kamu kabur dengan selamat!','🏃');return;
    }
    if(r.win){
      m.dead=true;S.ow.kills[m.id]=owNow();p.inv=2;
      const coins=m.boss?70+rn(30):8+rn(7);
      let it=null;
      if(m.boss){it=rollReward(3);if(it)ownItem(it.id);S.ow.boss[m.id]=1;}
      else if(Math.random()<.12){it=rollReward(1);if(it)ownItem(it.id);}
      S.points+=m.boss?30:6;S.ow.stat.mons++;statAdd('monster',1);addCoins(coins,true);save();
      const q=S.ow.quest;if(q&&!q.done&&q.type==='slay'&&!m.boss){q.prog=Math.min(q.need,q.prog+1);if(q.prog>=q.need)owQuestDone();}
      sfx('win');owBurst(m.x,m.y,30,26,['#ffd24d','#fff','#7fe3ff','#ff7bac']);
      const all=OW.W.mons.filter(x=>x.boss).every(x=>S.ow.boss[x.id]);
      let extra='';
      if(m.boss&&all&&!S.ow.master){S.ow.master=1;addCoins(200,true);S.points+=100;extra='<br>🏆 <b>Master Penjelajah!</b> Semua penjaga sudah kalah. Bonus 🪙 +200!';}
      owModalShow(owCard(avatar('mochi','cheer'),m.boss?'Penjaga kalah!':'Menang!',`${esc(f.n)} kalah!<br>🪙 +${coins} koin · ⭐ +${m.boss?30:6} poin${it?`<br>🎁 Barang baru: <b>${esc(it.n)}</b>`:''}${extra}`,owBtn('close','Lanjut petualangan!')));
    }else{
      // pingsan -> bangun di desa terdekat (tanpa hukuman)
      const v=owInVillage(p.x,p.y,999)||OW.W.villages[0];
      p.hp=owMaxHp();m.stun=4;p.inv=3;p.x=v.x;p.y=v.y+2.6;p.trail=[];OW.cam.x=p.x;OW.cam.y=p.y;sfx('lose');
      owModalShow(owCard(avatar('mochi','sad'),'Kamu pingsan…',`Penduduk ${esc(v.name)} merawatmu sampai sehat lagi. Tidak ada koin yang hilang. Coba lagi, ya!`,owBtn('close','Bangun')));
    }
    OW.acts={close:()=>owModalHide()};
  }});
}
/* ---------- peti, papan, air mancur ---------- */
function owChest(c){
  c.open=true;S.ow.chest[c.id]=owNow();S.ow.stat.chests++;
  const coins=15+rn(26);let it=null;
  if(Math.random()<.34){it=rollReward(2);if(it)ownItem(it.id);}
  addCoins(coins,true);S.points+=4;save();sfx('win');owBurst(c.x,c.y,26,20,['#ffd24d','#fff7c8','#ffb45e']);
  OW.acts={close:()=>owModalHide()};
  owModalShow(`<div class="wcard"><b style="font-size:1.2rem">📦 Peti Harta!</b>${it?`<div class="res-foe" style="margin:0 auto;width:110px">${previewSVG(it)}</div><p><b>${esc(it.n)}</b></p>`:'<div style="font-size:3.4rem;text-align:center">🪙</div>'}<p>🪙 +${coins} koin · ⭐ +4 poin</p>${owBtn('close','Asyik!')}</div>`);
}
function owSign(s){
  const first=!S.ow.vis['s'+s.village];if(first){S.ow.vis['s'+s.village]=1;S.points+=2;save();}
  speak(s.en);
  OW.acts={close:()=>owModalHide(),spk:()=>speak(s.en)};
  owModalShow(`<div class="wcard" style="text-align:center"><div style="font-size:2.4rem">🪧</div><b style="font-size:1.5rem;font-family:var(--font-display)">${esc(s.en)}</b><p>${esc(s.id)}</p>${first?'<small>⭐ +2 poin</small>':''}<div class="owbtns2">${owBtn('spk','🔊 Dengarkan','alt')}${owBtn('close','Tutup','soft')}</div></div>`);
}
function owFountain(v){
  const max=owMaxHp(),p=OW.p;let msg;
  if(p.hp<max){p.hp=max;msg='❤️ Nyawamu pulih penuh!';sfx('win');owBurst(v.x,v.y,30,20,['#9be8ff','#fff']);}else msg='Kamu sudah segar bugar!';
  toast(msg,'⛲');
}
/* ---------- menu, kamus, peta ---------- */
function owMenu(){
  if(OW.modal)return;
  const o=S.ow;
  OW.acts={
    close:()=>owModalHide(),
    dict:()=>owDict(),quest:()=>owQuestView(),map:()=>owMap(),
    exit:()=>{owModalHide();owExit();},
    newworld:()=>{owModalShow(`<div class="wcard"><b>Buat dunia baru?</b><p>Dunia baru punya peta lain. Kamus kata, statistik, dan koinmu tetap aman.</p><div class="owbtns2">${owBtn('newok','🌱 Ya, buat baru')}${owBtn('menu','Batal','soft')}</div></div>`);},
    newok:()=>{owNewWorld();},
    menu:()=>{owModalHide();owMenu();}
  };
  owModalShow(`<div class="wcard"><b style="font-size:1.25rem">🧭 Menu Open World</b>
    <div class="owmenu">
      ${owBtn('dict','📖 Kamus Kata <small>'+Object.keys(o.dict).length+' kata</small>','alt')}
      ${owBtn('quest','🎯 Misi','alt')}${owBtn('map','🗺️ Peta &amp; Perjalanan Cepat','alt')}
      ${owBtn('close','▶️ Lanjut Menjelajah')}${owBtn('newworld','🌱 Dunia Baru','soft')}${owBtn('exit','🏠 Keluar ke Beranda','soft')}
    </div></div>`);
}
function owDict(){
  const o=S.ow,ws=Object.keys(o.dict).map(en=>ALLW.find(x=>x.en===en)).filter(Boolean);
  OW.acts={back:()=>{owModalHide();owMenu();},spk:t=>speak(t.dataset.w)};
  owModalShow(`<div class="wcard"><b style="font-size:1.2rem">📖 Kamus Kata (${ws.length}/${OW.W.crystals.length} di peta ini)</b>
    <div class="owdict">${ws.length?ws.map(w=>`<button class="owdw" data-a="spk" data-w="${esc(w.en)}"><span>${w.pic||'🔤'}</span><b>${esc(w.en)}</b><small>${esc(w.id)}</small></button>`).join(''):'<p>Belum ada kata. Ambil kristal bercahaya 💎 di dunia atau jawab kuis!</p>'}</div>
    ${owBtn('back','‹ Kembali','soft')}</div>`);
}
function owQuestView(){
  const q=S.ow.quest,o=S.ow,bs=OW.W.mons.filter(m=>m.boss);
  OW.acts={back:()=>{owModalHide();owMenu();},cancel:()=>{S.ow.quest=null;save();owQuestView();}};
  owModalShow(`<div class="wcard"><b style="font-size:1.2rem">🎯 Misi</b>
    <p>${q?`${q.done?'✅ ':''}${esc(owQText(q))}<br><small>Dari ${esc(CAST[q.from].n)} · hadiah 🪙 ${q.coin}</small>`:'Belum ada misi. Bicaralah dengan penduduk yang punya tanda ❗.'}</p>
    <b>👑 Penjaga Pulau (${bs.filter(m=>o.boss[m.id]).length}/${bs.length})</b>
    <div class="owboss">${bs.map(m=>`<span class="${o.boss[m.id]?'ok':''}"><i>${avatar(m.k)}</i>${esc(FOES[m.k].n)}</span>`).join('')}</div>
    <small>Desa: ${Object.keys(o.vis).filter(k=>!String(k).startsWith('s')).length}/${OW.W.villages.length} · Peti: ${o.stat.chests} · Monster: ${o.stat.mons}</small>
    <div class="owbtns2">${q&&!q.done?owBtn('cancel','Batalkan misi','soft'):''}${owBtn('back','‹ Kembali','soft')}</div></div>`);
}
function owMap(){
  const W=OW.W,o=S.ow;
  OW.acts={back:()=>{owModalHide();owMenu();}};
  owModalShow(`<div class="wcard" style="align-items:center"><b style="font-size:1.2rem">🗺️ Peta</b><canvas id="owBig" width="320" height="320" class="owbig"></canvas><small>Ketuk desa yang sudah dikunjungi untuk pergi ke sana.</small>${owBtn('back','‹ Kembali','soft')}</div>`);
  const cv=$('owBig'),c=cv.getContext('2d'),sc=320/W.N;
  c.imageSmoothingEnabled=false;c.drawImage(W.mm,0,0,320,320);
  const pins=[];
  W.villages.forEach(v=>{const vis=!!o.vis[v.id];pins.push({x:v.x*sc,y:v.y*sc,v});c.fillStyle=vis?'#ffd24d':'#fff';c.strokeStyle='#3a2a5c';c.lineWidth=3;c.beginPath();c.rect(v.x*sc-7,v.y*sc-7,14,14);c.fill();c.stroke();c.fillStyle='#3a2a5c';c.font='900 11px Nunito,sans-serif';c.textAlign='center';c.fillText(vis?'⌂':'?',v.x*sc,v.y*sc+4);});
  W.mons.forEach(m=>{if(m.boss&&!o.boss[m.id]){c.font='16px sans-serif';c.textAlign='center';c.fillText('👑',m.hx*sc,m.hy*sc+5);}});
  const tg=owQuestTarget();if(tg){c.font='16px sans-serif';c.fillText(tg.ico,tg.x*sc,tg.y*sc+5);}
  c.fillStyle='#ff4a7a';c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(OW.p.x*sc,OW.p.y*sc,6,0,7);c.fill();c.stroke();
  cv.onclick=e=>{
    const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*320,y=(e.clientY-r.top)/r.height*320;
    const hit=pins.find(p=>Math.hypot(p.x-x,p.y-y)<16);
    if(!hit)return;
    if(!o.vis[hit.v.id]){toast('Desa ini belum kamu kunjungi','❓');return;}
    owTravel(hit.v);
  };
}
function owTravel(v){
  const p=OW.p;p.x=v.x;p.y=v.y+2.8;p.trail=[];OW.cam.x=p.x;OW.cam.y=p.y;OW.path=null;OW.flash=.9;sfx('win');
  owMkFollowers();owModalHide();owSave();
}
function owNewWorld(){
  const o=S.ow;
  o.seed=1+rn(99998);o.col={};o.chest={};o.kills={};o.vis={};o.boss={};o.quest=null;delete o.x;delete o.y;delete o.master;
  owModalHide();save();
  OW.W=owGen(o.seed);owInitWorld();
  owEnterPlace();
  owBanner('Dunia Baru!','Selamat menjelajah');
}
/* ---------- masuk / keluar / loop ---------- */
function owEnterPlace(){
  const o=S.ow,W=OW.W,p=OW.p;
  owRestoreFlags();
  const sp=(typeof o.x==='number'&&typeof o.y==='number'&&!owSolid(o.x,o.y))?{x:o.x,y:o.y}:owFreeNear(W.spawn.x,W.spawn.y);
  p.x=sp.x;p.y=sp.y;p.trail=[];p.inv=1.5;p.hop=0;p.hv=null;p.hp=clamp(Math.round(o.hp)||owMaxHp(),1,owMaxHp());
  OW.tod=o.tod;OW.rainOn=!!o.rain;OW.rain=OW.rainOn?.8:0;OW.rainT=60+Math.random()*80;
  owMkFollowers();OW.cam.x=p.x;OW.cam.y=p.y;OW.first=true;OW.area='';OW.areaSet=false;OW.path=null;OW.pend=null;OW.parts=[];OW.flies=[];
}
function owEnter(){
  const o=owState();
  if(!OW.cv){OW.cv=$('owc');OW.ctx=OW.cv.getContext('2d');}
  showScreen('open');
  $('owBanner').innerHTML='<b>Memuat dunia…</b>';$('owBanner').classList.add('show');
  setTimeout(()=>{
    try{
      if(!OW.W||OW.W.seed!==o.seed){OW.W=owGen(o.seed);owInitWorld();}
      owEnterPlace();
    }catch(err){console.error(err);toast('Open World gagal dimuat','⚠️');owExit(true);return;}
    OW.on=true;OW.modal=false;owModalHide();
    owResize();OW.last=performance.now();cancelAnimationFrame(OW.raf);OW.raf=requestAnimationFrame(owFrame);
    const sg=owInVillage(OW.p.x,OW.p.y,9);
    owBanner(sg?sg.name:'Open World',sg?sg.en:'Jelajahi dunia, kumpulkan kata!');
  },30);
}
function owExit(quiet){
  OW.on=false;cancelAnimationFrame(OW.raf);
  if(OW.W&&!quiet)owSave();
  OW.keys={};OW.joy={x:0,y:0};OW.steer=null;
  TAB='open';
  goHome(quiet?undefined:'Kembali dari petualangan! Kata apa saja yang kamu temukan?');
}
function owFrame(ts){
  if(!OW.on)return;
  const dt=Math.min(.05,Math.max(0.001,(ts-OW.last)/1000||.016));OW.last=ts;
  try{owUpdate(dt);owRender();OW.err=0;}catch(e){OW.err=(OW.err||0)+1;if(OW.err<4)console.error('OW',e);if(OW.err>30){OW.on=false;toast('Terjadi kesalahan di Open World','⚠️');owExit(true);return;}}
  OW.hudT=(OW.hudT||0)+dt;if(OW.hudT>.2){OW.hudT=0;try{owHud();}catch(e){console.error('HUD',e);}}
  OW.raf=requestAnimationFrame(owFrame);
}
function owResize(){
  const cv=OW.cv;if(!cv)return;
  const r=cv.getBoundingClientRect();if(!r.width)return;
  OW.dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.round(r.width*OW.dpr);cv.height=Math.round(r.height*OW.dpr);
  OW.w=r.width;OW.h=r.height;
  OW.Z=clamp(Math.min(OW.w/700,OW.h/520),.75,1.4)*OW.zoom;
}
function owHud(){
  const p=OW.p,o=S.ow;
  const hs='❤️'.repeat(Math.max(0,p.hp))+'🖤'.repeat(Math.max(0,owMaxHp()-p.hp));
  if($('owHearts').textContent!==hs)$('owHearts').textContent=hs;
  const hh=Math.floor(OW.tod),mm=Math.floor((OW.tod-hh)*60);
  const ico=OW.rain>.5?'🌧️':(OW.tod>=6.5&&OW.tod<17.5?'☀️':(OW.tod>=17.5&&OW.tod<19.5)||(OW.tod>=5&&OW.tod<6.5)?'🌇':'🌙');
  $('owClock').textContent=ico+' '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');
  $('owWords').textContent='💎 '+Object.keys(o.dict).length;
  // misi
  const q=o.quest,qb=$('owQuest'),tg=owQuestTarget();
  if(q){
    qb.hidden=false;
    $('owQTxt').textContent=(q.done?'✅ Kembali ke '+CAST[q.from].n:'🎯 '+owQText(q));
    const ar=$('owQArr');
    if(tg){const dx=tg.x-p.x,dy=tg.y-p.y,sdx=(dx-dy),sdy=(dx+dy)*.5,ang=Math.atan2(sdy,sdx)*180/Math.PI;ar.style.display='';ar.style.transform='rotate('+ang+'deg)';$('owQD').textContent=Math.round(Math.hypot(dx,dy))+' langkah';}
    else{ar.style.display='none';$('owQD').textContent='';}
  }else{qb.hidden=true;}
  // peta mini
  const mc=$('owMini'),c=mc.getContext('2d'),W=OW.W,s=2.5;
  c.clearRect(0,0,100,100);
  c.save();c.beginPath();c.arc(50,50,48,0,7);c.clip();
  c.fillStyle='#2a6fa8';c.fillRect(0,0,100,100);
  c.translate(50,50);c.rotate(Math.PI/4);c.translate(-p.x*s,-p.y*s);
  c.imageSmoothingEnabled=false;c.drawImage(W.mm,0,0,W.N*s,W.N*s);
  W.villages.forEach(v=>{c.fillStyle='#ffd24d';c.strokeStyle='#3a2a5c';c.lineWidth=1.5;c.fillRect(v.x*s-3,v.y*s-3,6,6);c.strokeRect(v.x*s-3,v.y*s-3,6,6);});
  W.mons.forEach(m=>{if(m.boss&&!m.dead){c.fillStyle='#ff4a5a';c.beginPath();c.arc(m.x*s,m.y*s,3,0,7);c.fill();}});
  if(tg){c.fillStyle='#fff';c.strokeStyle='#ff4a7a';c.lineWidth=2;c.beginPath();c.arc(tg.x*s,tg.y*s,4,0,7);c.fill();c.stroke();}
  c.restore();
  c.fillStyle='#ff4a7a';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(50,43);c.lineTo(55,55);c.lineTo(50,52);c.lineTo(45,55);c.closePath();c.fill();c.stroke();
  c.strokeStyle='#3a2a5c';c.lineWidth=3;c.beginPath();c.arc(50,50,48,0,7);c.stroke();
}
/* ---------- panel di beranda ---------- */
function renderOpen(){
  const el=$('owPanel');if(!el)return;
  const o=owState(),vs=Object.keys(o.vis).filter(k=>!String(k).startsWith('s')).length,bs=Object.keys(o.boss).length;
  const has=typeof o.x==='number';
  el.innerHTML=`<div class="owhero"><div class="owhero-art" aria-hidden="true">${art('mochi','cheer')}</div>
    <div><h2>🧭 Open World</h2><p>Jelajahi pulau luas bergaya 2.5D: desa, hutan, gurun, salju, dan gunung. Kumpulkan kristal kata, bantu penduduk, buka peta harta, lalu kalahkan 4 penjaga pulau dengan kuis bahasa Inggris!</p></div></div>
    <div class="owstats"><span><b>${Object.keys(o.dict).length}</b>kata</span><span><b>${o.stat.mons}</b>monster</span><span><b>${vs}</b>desa</span><span><b>${bs}/4</b>penjaga</span><span><b>${Math.round(o.play/60)}</b>menit</span></div>
    <button class="btn" id="owPlay">${has?'▶️ Lanjutkan Menjelajah':'🌍 Mulai Menjelajah'}</button>
    <p class="note">Kontrol: tombol panah/WASD atau joystick di layar. Ketuk peta untuk berjalan otomatis. E = bicara/buka, Spasi = lompat, Shift = lari, Esc = menu.</p>`;
  $('owPlay').onclick=()=>{sfx('tap');owEnter();};
}
/* ---------- input ---------- */
(function owInput(){
  const KM={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ShiftLeft:'run',ShiftRight:'run'};
  addEventListener('keydown',e=>{
    if(!OW.on)return;
    if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))return;
    if(OW.modal){
      if(e.key==='Escape'&&!OW.quiz){const m=$('owModal');const b=m.querySelector('[data-a="close"],[data-a="back"],[data-a="menu"]');if(b)b.click();else owModalHide();}
      if(OW.quiz&&/^[1-4]$/.test(e.key))OW.quiz.pick(+e.key-1);
      return;
    }
    const k=KM[e.code];
    if(k){OW.keys[k]=true;e.preventDefault();return;}
    if(e.code==='KeyE'||e.code==='Enter'){owAct();e.preventDefault();}
    else if(e.code==='Space'){owHop();e.preventDefault();}
    else if(e.code==='Escape'||e.code==='KeyM'){owMenu();}
    else if(e.key==='+'||e.key==='=')owZoom(1.15);
    else if(e.key==='-')owZoom(1/1.15);
  });
  addEventListener('keyup',e=>{const k=KM[e.code];if(k)OW.keys[k]=false;});
  addEventListener('blur',()=>{OW.keys={};});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&OW.on)owSave();});
  addEventListener('pagehide',()=>{if(OW.on)owSave();});
  addEventListener('resize',()=>{if(OW.on)owResize();});
})();
function owZoom(f){OW.zoom=clamp(OW.zoom*f,.7,1.7);owResize();}
function owBindUI(){
  const st=$('owStick'),kn=$('owKnob');let jid=null;
  const upd=e=>{
    const r=st.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,R=r.width/2;
    let dx=(e.clientX-cx)/R,dy=(e.clientY-cy)/R;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m;}
    kn.style.transform='translate('+dx*R*.55+'px,'+dy*R*.55+'px)';
    const mg=Math.min(1,m);OW.joy=mg<.18?{x:0,y:0}:{x:dx,y:dy};OW.joyRun=mg>.97;
  };
  st.addEventListener('pointerdown',e=>{jid=e.pointerId;st.setPointerCapture(jid);upd(e);e.preventDefault();});
  st.addEventListener('pointermove',e=>{if(e.pointerId===jid)upd(e);});
  const end=e=>{if(e.pointerId!==jid)return;jid=null;OW.joy={x:0,y:0};OW.joyRun=false;kn.style.transform='';};
  st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
  $('owAct').addEventListener('click',()=>{if(OW.act)owAct();else owHop();});
  $('owHop').addEventListener('click',owHop);
  $('owRun').addEventListener('click',()=>{OW.runBtn=!OW.runBtn;$('owRun').classList.toggle('on',OW.runBtn);});
  $('owMenuBtn').addEventListener('click',owMenu);
  $('owZi').addEventListener('click',()=>owZoom(1.2));$('owZo').addEventListener('click',()=>owZoom(1/1.2));
  $('owModal').addEventListener('click',owDelegate);
  $('owQuest').addEventListener('click',()=>owMenu());
  // ketuk / seret di kanvas
  const cv=$('owc');
  cv.addEventListener('pointerdown',e=>{OW.drag={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),moved:false};try{cv.setPointerCapture(e.pointerId);}catch(_){}});
  cv.addEventListener('pointermove',e=>{
    const d=OW.drag;if(!d||d.id!==e.pointerId)return;
    const dx=e.clientX-d.x,dy=e.clientY-d.y;
    if(Math.hypot(dx,dy)>16)d.moved=true;
    if(d.moved&&e.pointerType!=='mouse'||(d.moved&&e.buttons)){
      const r=cv.getBoundingClientRect(),ps=owS(OW.p.x,OW.p.y),vx=e.clientX-r.left-ps.sx,vy=e.clientY-r.top-(ps.sy-40*OW.Z),m=Math.hypot(vx,vy);
      OW.steer=m>20?{x:vx/m*Math.min(1,m/90),y:vy/m*Math.min(1,m/90)}:null;
    }
  });
  const up=e=>{
    const d=OW.drag;if(!d||d.id!==e.pointerId)return;OW.drag=null;OW.steer=null;
    if(d.moved||OW.modal)return;
    const r=cv.getBoundingClientRect(),w=owInv(e.clientX-r.left,e.clientY-r.top);
    owTapWorld(w.x,w.y);
  };
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',()=>{OW.drag=null;OW.steer=null;});
  cv.addEventListener('wheel',e=>{if(OW.on){owZoom(e.deltaY<0?1.1:1/1.1);e.preventDefault();}},{passive:false});
}
function owTapWorld(x,y){
  const W=OW.W;let best=null,bd=1.3;
  const cand=(type,ref,rx,ry)=>{const d=Math.hypot(rx-x,ry-y);if(d<bd){bd=d;best={type,ref,x:rx,y:ry,rng:1.6};}};
  OW.npcs.forEach(n=>cand('npc',n,n.x,n.y-.4));
  W.chests.forEach(c=>{if(!c.open)cand('chest',c,c.x,c.y);});
  W.signs.forEach(s=>cand('sign',s,s.x,s.y));
  W.villages.forEach(v=>cand('fountain',v,v.x,v.y));
  const pt=owPath(OW.p.x,OW.p.y,best?best.x:x,best?best.y:y);
  if(!pt){toast('Tidak bisa ke sana','🚫');return;}
  OW.path=pt;OW.pend=best;
  owPart('splash',x,y,0,0,0,0,.6);
}

owBindUI();
window.__MQ={G:()=>G,OW:()=>OW,S:()=>S,owEnter,owExit,owMenu,owGen,owUpdate,owRender,owQuiz,owBattle,owTalk,owPickCrystal,owChest,owDict,owMap,owQuestView,owAct,owTapWorld,owPath,owNewQuest,owTravel,owNewWorld};

