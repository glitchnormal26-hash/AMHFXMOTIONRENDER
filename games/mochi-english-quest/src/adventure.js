/* ============================================================
   PETUALANGAN 2.0 — mode baru (Percakapan, Tangkap Kata), gelombang
   & boon, serangan kombo, pratinjau stage, efek arena
   ============================================================ */
const MODE_DESC={
  pic:'Lihat gambar, pilih kata bahasa Inggrisnya.',listen:'Dengar kata, pilih gambar yang cocok.',spell:'Susun huruf yang teracak menjadi kata.',
  match:'Pasangkan kata dengan artinya secepat mungkin.',grammar:'Lengkapi kalimat dengan kata yang tepat.',power:'Sinonim, antonim, dan kata yang tidak cocok.',
  order:'Urutkan kata menjadi kalimat yang benar.',read:'Baca teks pendek, lalu jawab pertanyaannya.',exam:'Soal campuran grammar dan kosakata.',
  talk:'Ngobrol dengan penduduk! Pilih balasan bahasa Inggris yang paling tepat.',catch:'Geser keranjang dan tangkap kata yang sesuai tema. Hindari kata yang salah!'
};
function advCount(st){
  if(st.m==='talk')return 5;
  if(st.m==='catch')return st.boss?14:10;
  if(st.m==='read')return 4;
  if(st.m==='exam')return 10;
  return MODES[st.m]?MODES[st.m].rounds:6;
}
function stagePreview(key){
  const p=key.split('-').map(Number),ci=p[0],si=p[1],ch=CHAPTERS[ci],st=ch.stages[si];
  if(!stageOpen(ci,si)){openStage(key);return;}
  sfx('tap');
  const f=FOES[st.foe],n=stars(ci,si),last=si===ch.stages.length-1;
  const dm=document.querySelector('.modal.stagemodal');if(dm)dm.remove();
  const wave=last?'3 fase boss':(advCount(st)>=6&&st.m!=='catch'&&st.m!=='match'?'Ada Gelombang 2 + pilih Boon':'');
  const m=document.createElement('div');
  m.className='modal stagemodal';
  m.innerHTML=`<div class="wcard stageprev" role="dialog" aria-modal="true" aria-label="Pratinjau stage">
    <div class="sp-top" style="--g1:${ch.bg[0]};--g2:${ch.bg[1]}">
      <div class="sp-foe${last?' boss':''}">${art(st.foe,last?'angry':'smirk')}</div>
      <div class="sp-txt"><span class="tag">Chapter ${ci+1} · Stage ${si+1}/${ch.stages.length}</span>
        <h2>${last?'👑 ':''}${MODE_ICON[st.m]} ${esc(MODE_NAME[st.m])}</h2><b>${esc(f.n)}</b><small>${esc(f.role)}</small></div>
    </div>
    <p class="sub">${esc(MODE_DESC[st.m]||'')}</p>
    <ul class="sp-goals">
      <li class="${n>=1?'on':''}">★ Selesaikan stage <small>${advCount(st)} ${st.m==='catch'?'tangkapan':st.m==='talk'?'balasan':'soal'}</small></li>
      <li class="${n>=2?'on':''}">★★ Akurasi minimal 60%</li>
      <li class="${n>=3?'on':''}">★★★ Akurasi minimal 85%</li>
      ${wave?`<li class="ev">⚡ ${wave}</li>`:''}
      <li class="ev">✨ Kombo 3 jawaban benar = Serangan Kombo</li>
    </ul>
    <div class="row"><button class="btn" data-sp="go">⚔️ ${n?'Main lagi':'Mulai'}</button><button class="btn soft" data-sp="close">Nanti</button></div>
  </div>`;
  document.body.appendChild(m);
  const go=m.querySelector('[data-sp="go"]');
  go.focus();
  m.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(e.target===m){m.remove();return;}
    if(!b)return;
    if(b.dataset.sp==='go'){m.remove();openStage(key);}
    else m.remove();
  });
  m.addEventListener('keydown',e=>{if(e.key==='Escape')m.remove();});
}

/* ---------- Efek arena ---------- */
function arenaFloat(txt,cls,x,y){
  const fx=$('arenaFx');if(!fx)return;
  const s=document.createElement('span');
  s.className='afloat '+(cls||'');s.textContent=txt;
  s.style.left=(x==null?62:x)+'%';s.style.top=(y==null?30:y)+'%';
  fx.appendChild(s);setTimeout(()=>s.remove(),1300);
}
function arenaBanner(txt,sub){
  const fx=$('arenaFx');if(!fx)return;
  const b=document.createElement('div');
  b.className='abanner';b.innerHTML='<b>'+esc(txt)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'');
  fx.appendChild(b);setTimeout(()=>b.remove(),1700);
}
function heroReact(cls,expr){
  const h=$('heroBox');if(!h||!G||!G.adv)return;
  h.innerHTML=art('mochi',expr||'happy');
  h.classList.remove('lunge','hurt');void h.offsetWidth;h.classList.add(cls);
  const my=G;setTimeout(()=>{if(G===my&&!G.done)h.innerHTML=art('mochi','happy');},700);
}
function advOnGood(){
  heroReact('lunge','cheer');
  arenaFloat('-1','dmg',72,26);
  if(G.combo>=3&&G.combo%3===0){
    const bonus=Math.round(12*(MULT[S.diff]||1));
    G.score+=bonus;
    arenaBanner('✨ Serangan Kombo!','+'+bonus+' skor');
    const a=$('arena');a.classList.remove('special');void a.offsetWidth;a.classList.add('special');
    arenaFloat('+'+bonus,'bonus',50,45);
    sfx('win');updateHud();
  }
}
function advOnBad(){heroReact('hurt','sad');arenaFloat('💔','dmg',16,28);const a=$('arena');a.classList.remove('shake');void a.offsetWidth;a.classList.add('shake');}

/* ---------- Gelombang & boon ---------- */
const BOONS=[
  {k:'heart',ico:'❤️',n:'Nyawa +1',d:'Tambah satu nyawa.',ok:()=>G.hearts<(G.heartsMax||3)+1},
  {k:'shield',ico:'🛡️',n:'Perisai',d:'Satu kesalahan berikutnya aman.',ok:()=>!G.shield},
  {k:'lucky',ico:'⭐',n:'Skor Ganda',d:'Skor 3 jawaban benar berikutnya dobel.',ok:()=>true},
  {k:'refill',ico:'🔄',n:'Isi Ulang Skill',d:'Kemampuan teman bisa dipakai lagi.',ok:()=>Object.keys(G.used).length>0},
  {k:'coins',ico:'🪙',n:'Kantong Koin',d:'Dapat 25 koin langsung.',ok:()=>true}
];
function advWave(){
  if(!G||!G.adv||G.mode==='catch'||G.mode==='match')return false;
  const t=G.total,p=G.progress;let ph=0;
  if(G.adv.boss&&t>=9){if(p===Math.round(t/3)&&!G.wv.a)ph=1;else if(p===Math.round(t*2/3)&&!G.wv.b)ph=2;}
  else if(t>=6&&p===Math.ceil(t/2)&&!G.wv.a)ph=1;
  if(!ph)return false;
  G.wv[ph===1?'a':'b']=true;
  G.locked=true;clearTimer();
  const boss=G.adv.boss,f=FOES[G.foe];
  const title=boss?(ph===1?'Fase 2!':'Fase 3: Mengamuk!'):'Gelombang 2!';
  if(boss&&ph===2){const fb=$('foeBox');if(fb)fb.classList.add('rage');}
  foeAtk();
  arenaBanner(title,f.n+(boss?' makin garang!':' memanggil bala bantuan!'));
  sfx('hit');
  const my=G;
  setTimeout(()=>{if(G===my&&!G.done)showBoon(title);},900);
  return true;
}
function showBoon(title){
  const my=G;
  const opts=shuffle(BOONS.filter(b=>b.ok())).slice(0,3);
  const m=document.createElement('div');
  m.className='modal boonmodal';
  m.innerHTML=`<div class="wcard" role="dialog" aria-modal="true" aria-label="Pilih Boon">
    <h2>${esc(title)}</h2><p class="sub">Istirahat sebentar! Pilih satu bantuan untuk pertarungan berikutnya.</p>
    <div class="boons">${opts.map(b=>`<button class="boon" data-boon="${b.k}"><span class="bi">${b.ico}</span><b>${b.n}</b><small>${b.d}</small></button>`).join('')}</div>
  </div>`;
  document.body.appendChild(m);
  const f=m.querySelector('button');if(f)f.focus();
  m.addEventListener('click',e=>{
    const b=e.target.closest('button[data-boon]');
    if(!b)return;
    const k=b.dataset.boon;
    if(G===my&&!G.done){
      if(k==='heart'){G.heartsMax=Math.max(G.heartsMax||3,G.hearts+1);G.hearts++;}
      else if(k==='shield')G.shield=true;
      else if(k==='lucky')G.luckyN=3;
      else if(k==='refill'){G.used={};}
      else if(k==='coins')addCoins(25,true);
      sfx('win');burst(12);
      updateHud();drawSkills();
      toast('Boon: '+BOONS.find(x=>x.k===k).n,BOONS.find(x=>x.k===k).ico,'win');
    }
    m.remove();
    if(G===my&&!G.done){G.locked=false;nextRound();}
  });
}

/* ---------- Mode Percakapan ---------- */
function talkItems(){
  const sc=(G&&G.adv&&G.adv.sc&&SCEN.find(s=>s.q===G.adv.sc))||freshOne(SCEN);
  G.sc=sc;G.talk={log:[]};
  const nm=pname();
  return sc.turns.map(t=>({q:t.q,id:t.id,o:t.o.map(x=>x.replace('$NAME',nm)),a:0,w:t.w,k:sc.n}));
}
function renderTalk(){
  if(G.talk.pending){G.talk.log.push({t:G.talk.pending.npc},{t:G.talk.pending.me,me:1});G.talk.pending=null;}
  const it=G.items[G.progress],sc=G.sc,ans=it.o[0],opts=shuffle(it.o.slice());
  const log=G.talk.log.map(l=>`<div class="cb ${l.me?'me':'npc'}">${esc(l.t)}</div>`).join('');
  $('board').innerHTML=`<div class="talk">
    <div class="talk-head"><span class="tav">${avatar(sc.who||'kai')}</span><div><b>${esc(sc.n)}</b><small>Percakapan ${G.progress+1}/${G.total}</small></div></div>
    <div class="chat" id="chat">${log}<div class="cb npc live"><span>${esc(it.q)}</span> <button class="spk" data-say="${esc(it.q)}" aria-label="Dengarkan">🔊</button>${S.diff===2?'':`<small>${esc(it.id)}</small>`}</div></div>
    <div class="opts one">${opts.map(t=>`<button class="opt txt" data-k="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    <div id="whyBox"></div></div>`;
  const ch=$('chat');if(ch)ch.scrollTop=ch.scrollHeight;
  G.cur={ans:ans,teach:true,info:it.w||'',wrong:'Balasan terbaik: '+ans,say:ans};
  G.talk.pending={npc:it.q,me:ans};
  speak(it.q);
  mochi('think','Balasan apa yang paling tepat?');
  startTimer(S.diff===2?25:30);
}
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('#board .spk');
  if(b){speak(b.dataset.say);e.stopPropagation();}
},true);

/* ---------- Mode Tangkap Kata ---------- */
function catchItems(){
  const n=(G&&G.adv&&G.adv.boss)?14:10;
  return new Array(n).fill(0).map((_,i)=>({i:i}));
}
function catchTopic(){
  const all=poolAll(),cnt={};
  all.forEach(w=>{cnt[w.t]=(cnt[w.t]||0)+1;});
  const ok=Object.keys(cnt).filter(k=>cnt[k]>=6);
  const pref=(G.topic&&G.topic!=='all'&&cnt[G.topic]>=6)?G.topic:null;
  const tp=pref||ok[Math.floor(Math.random()*ok.length)]||'animals';
  return tp;
}
function renderCatch(){
  clearTimer();
  const tp=catchTopic(),tn=(TOPICS.find(t=>t.k===tp)||{n:tp}).n;
  const all=poolAll(),gwords=all.filter(w=>w.t===tp&&w.pic),bwords=all.filter(w=>w.t!==tp&&w.pic);
  $('board').innerHTML=`<div class="catchwrap">
    <div class="catchhint"><b>🧺 Tangkap kata bertema: ${esc(tn.toUpperCase())}</b><small>Geser atau ketuk untuk menggerakkan keranjang. Panah kiri/kanan juga bisa.</small></div>
    <canvas id="catchCv" class="catchcv" aria-label="Permainan tangkap kata" tabindex="0"></canvas></div>`;
  const cv=$('catchCv'),ctx=cv.getContext('2d');
  const dpr=Math.min(2,window.devicePixelRatio||1);
  const rect=cv.getBoundingClientRect();
  const W=Math.max(260,Math.round(rect.width||320)),H=Math.max(300,Math.min(440,Math.round(W*1.08)));
  cv.style.height=H+'px';cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
  const ch=G.adv?CHAPTERS[G.adv.ci]:{bg:['#d9f7c4','#8fdca6'],ground:'#6fcf86'};
  const ct=G.ct={tp,tn,W,H,x:W/2,tx:W/2,bw:Math.min(120,W*.34),items:[],fx:[],t:0,spawn:.6,left:0,right:0,my:G,fall:0,
                 gwords,bwords,shake:0,keys:{},lastGood:0,spawned:0};
  const heroImg=new Image();
  try{heroImg.src='data:image/svg+xml;utf8,'+encodeURIComponent(art('mochi','cheer',true).replace('<svg ','<svg width="160" height="156" '));}catch(e){}
  const moveTo=ev=>{const r=cv.getBoundingClientRect();ct.tx=Math.max(ct.bw/2,Math.min(W-ct.bw/2,(ev.clientX-r.left)/r.width*W));};
  cv.addEventListener('pointerdown',ev=>{cv.setPointerCapture&&cv.setPointerCapture(ev.pointerId);moveTo(ev);ev.preventDefault();});
  cv.addEventListener('pointermove',ev=>{if(ev.buttons||ev.pointerType==='touch'||ev.pointerType==='pen'||ev.pointerType==='mouse')moveTo(ev);});
  cv.addEventListener('keydown',ev=>{if(ev.key==='ArrowLeft'||ev.key==='ArrowRight'){ct.keys[ev.key]=1;ev.preventDefault();}});
  cv.addEventListener('keyup',ev=>{delete ct.keys[ev.key];});
  const onKey=ev=>{if(!G||G.ct!==ct)return;if(ev.key==='ArrowLeft'||ev.key==='ArrowRight'){ct.keys[ev.key]=ev.type==='keydown'?1:0;ev.preventDefault();}};
  window.addEventListener('keydown',onKey);window.addEventListener('keyup',onKey);
  const pickWord=(isGood)=>{
    const pl=isGood?ct.gwords:ct.bwords;
    // hindari kata yang sama berurutan
    for(let i=0;i<8;i++){const w=pl[Math.floor(Math.random()*pl.length)];if(!ct.last||ct.last!==w.en||pl.length<2){ct.last=w.en;return w;}}
    return pl[0];
  };
  const spawn=()=>{
    const needGood=G.total-G.progress;
    const onGood=ct.items.filter(i=>i.good&&!i.dead).length;
    let isGood=Math.random()<.62;
    if(onGood<1&&ct.spawned%3===2)isGood=true;       // pastikan selalu ada yang bisa ditangkap
    if(onGood>=needGood)isGood=false;
    const w=pickWord(isGood),sz=Math.min(78,W*.22);
    ct.items.push({w,good:isGood,x:sz/2+Math.random()*(W-sz),y:-sz,sz,vy:0,rot:(Math.random()-.5)*.4,ph:Math.random()*6});
    ct.spawned++;
  };
  const burst=(x,y,col,n)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=60+Math.random()*120;ct.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-50,l:.7,c:col});}};
  const rr=(x,y,w,h,r)=>{ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();};
  let last=performance.now();
  const frame=now=>{
    if(!G||G.ct!==ct||G.done||!document.body.contains(cv)){window.removeEventListener('keydown',onKey);window.removeEventListener('keyup',onKey);return;}
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(!G.locked){
      ct.t+=dt;
      const kx=(ct.keys.ArrowRight?1:0)-(ct.keys.ArrowLeft?1:0);
      if(kx)ct.tx=Math.max(ct.bw/2,Math.min(W-ct.bw/2,ct.tx+kx*W*1.1*dt));
      ct.x+=(ct.tx-ct.x)*Math.min(1,dt*14);
      ct.spawn-=dt;
      const prog=G.progress/G.total,rate=Math.max(.5,1.05-prog*.45-(S.diff*.1));
      if(ct.spawn<=0){spawn();ct.spawn=rate*(.75+Math.random()*.5);}
      const g=H*(.42+prog*.22+S.diff*.07);
      const by=H-62;
      ct.items.forEach(it=>{
        if(it.dead)return;
        it.vy=Math.min(g,it.vy+g*1.3*dt);it.y+=it.vy*dt;
        const catchY=by-4,hit=it.y+it.sz*.5>=catchY&&it.y<=by+30&&Math.abs(it.x-ct.x)<ct.bw/2+it.sz*.25;
        if(hit){
          it.dead=true;
          if(it.good){
            burst(it.x,by,'#ffd24d',14);
            ct.fx.push({txt:'+',x:it.x,y:by-10,vy:-60,l:.8,c:'#2e9e5b',big:1});
            good();G.progress++;updateHud();speak(it.w.en);
            if(G.progress>=G.total){setTimeout(()=>{if(G&&G.ct===ct&&!G.done)endGame(true);},650);}
          }else{
            burst(it.x,by,'#ff6b6b',12);ct.shake=.3;
            const dead=bad('Oops! "'+it.w.en+'" bukan tema '+tn+'.');
            if(dead){setTimeout(()=>{if(G&&G.ct===ct&&!G.done)endGame(false);},650);}
          }
        }else if(it.y>H+it.sz){it.dead=true;}
      });
      ct.items=ct.items.filter(i=>!i.dead||i.y<=H+i.sz);
    }
    // gambar
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const sx=ct.shake>0?(Math.random()-.5)*8:0;ct.shake=Math.max(0,ct.shake-dt);
    ctx.save();ctx.translate(sx,0);
    const gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,ch.bg[0]);gr.addColorStop(1,ch.bg[1]);
    ctx.fillStyle=gr;ctx.fillRect(-10,0,W+20,H);
    ctx.fillStyle='rgba(255,255,255,.55)';
    for(let i=0;i<4;i++){const cx=((i*97+ct.t*14)%(W+120))-60,cy=24+i*36;ctx.beginPath();ctx.ellipse(cx,cy,34,13,0,0,7);ctx.ellipse(cx+22,cy+4,24,10,0,0,7);ctx.fill();}
    ctx.fillStyle=ch.ground;ctx.fillRect(-10,H-34,W+20,40);
    ctx.fillStyle='rgba(58,42,92,.18)';ctx.fillRect(-10,H-34,W+20,4);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ct.items.forEach(it=>{
      if(it.dead&&it.y>H)return;
      ctx.save();ctx.translate(it.x,it.y);ctx.rotate(it.rot+Math.sin(ct.t*3+it.ph)*.06);
      const s=it.sz;
      ctx.fillStyle='#fff';ctx.strokeStyle='#3a2a5c';ctx.lineWidth=3;
      rr(-s*.6,-s*.5,s*1.2,s*1.0,14);ctx.fill();ctx.stroke();
      ctx.font=Math.round(s*.46)+'px serif';ctx.fillStyle='#000';ctx.fillText(it.w.pic,0,-s*.12);
      ctx.font='800 '+Math.max(11,Math.round(s*.2))+'px system-ui,sans-serif';ctx.fillStyle='#3a2a5c';
      ctx.fillText(it.w.en.length>11?it.w.en.slice(0,10)+'.':it.w.en,0,s*.32);
      ctx.restore();
    });
    // keranjang + pahlawan
    const bx=ct.x,by2=H-62;
    if(heroImg.complete&&heroImg.naturalWidth){ctx.drawImage(heroImg,bx-26,by2-48,52,50);}
    ctx.fillStyle='#d9a066';ctx.strokeStyle='#3a2a5c';ctx.lineWidth=3.5;
    ctx.beginPath();ctx.moveTo(bx-ct.bw/2,by2);ctx.lineTo(bx+ct.bw/2,by2);ctx.lineTo(bx+ct.bw/2-12,by2+34);ctx.lineTo(bx-ct.bw/2+12,by2+34);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(58,42,92,.35)';ctx.lineWidth=2;
    for(let i=1;i<5;i++){const xx=bx-ct.bw/2+ct.bw*i/5;ctx.beginPath();ctx.moveTo(xx,by2+2);ctx.lineTo(xx+(xx<bx?2:-2),by2+32);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(bx-ct.bw/2+8,by2+17);ctx.lineTo(bx+ct.bw/2-8,by2+17);ctx.stroke();
    ct.fx.forEach(p=>{p.l-=dt;p.x+=(p.vx||0)*dt;p.y+=(p.vy||0)*dt;if(p.vx!==undefined)p.vy+=300*dt;
      ctx.globalAlpha=Math.max(0,p.l*1.4);
      if(p.txt){ctx.font='800 26px system-ui,sans-serif';ctx.fillStyle=p.c;ctx.fillText(p.txt,p.x,p.y);}
      else{ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,7);ctx.fill();}});
    ctx.globalAlpha=1;ct.fx=ct.fx.filter(p=>p.l>0);
    ctx.restore();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  mochi('think','Tangkap kata tema '+tn+'!');
}
