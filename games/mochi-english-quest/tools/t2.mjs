import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open();
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1200);
const R=await p.evaluate(async()=>{
  const M=__MQ,O=M.OW(),S=M.S(),out={};S.ow.assist=true;
  M.owQuiz({mode:'chat',foe:'mochi',rounds:9,title:'t',onEnd:()=>{}});
  for(let k=0;k<40&&!['id2en','listen'].includes(O.quiz.q.kind);k++){O.quiz.pick(O.quiz.q.opts.findIndex(o=>o.ok),true);await new Promise(r=>setTimeout(r,1500));if(!O.quiz)break;}
  const st=O.quiz;out.kind=st&&st.q.kind;
  if(st){const i=st.q.opts.findIndex(o=>!o.ok),n=st.n;st.pick(i);out.sel=st.sel;out.nAfter1=st.n-n;
   out.selClass=document.querySelectorAll('.owq-opt.sel').length;out.big=!!document.querySelector('.owq.big');
   st.pick(i);out.nAfter2=st.n-n;}
  // timer timeout
  S.ow.assist=false;M.owModalHide();S.diff=2;S.adv.party=['mochi','kai'];
  M.owBattle(O.W.mons.find(m=>!m.boss));
  const h0=O.p.hp;await new Promise(r=>setTimeout(r,12800));out.timeoutHp=[h0,O.p.hp,O.quiz&&O.quiz.n];
  // deliver/listen quests
  O.quiz=null;document.getElementById('owModal').hidden=true;O.modal=false;
  const seen={};let qq={};
  for(let i=0;i<200;i++){const n=O.npcs[i%O.npcs.length];const q=M.owNewQuest(n);seen[q.type]=(seen[q.type]||0)+1;qq[q.type]=qq[q.type]||q;}
  out.seen=seen;
  // deliver flow
  const g=O.npcs[0];let dq=null;for(let i=0;i<400&&!dq;i++){const q=M.owNewQuest(g);if(q.type==='deliver')dq=q;}
  S.ow.quest=dq;out.dtxt=M.owQText(dq);
  const t=O.npcs.find(n=>n.k===dq.to);O.p.x=t.x;O.p.y=t.y+1;
  const coins0=S.coins;out.c0=S.coins;M.owTalk(t);await new Promise(r=>setTimeout(r,100));
  out.dbtns=[...document.querySelectorAll('#owModal [data-a]')].map(x=>x.dataset.a).join(',');
  document.querySelector('#owModal [data-a="deliver"]').click();await new Promise(r=>setTimeout(r,200));
  out.c1=S.coins;out.afterDeliver=[S.ow.quest&&S.ow.quest.done,S.ow.quest&&S.ow.quest.from];
  out.btns2=[...document.querySelectorAll('#owModal [data-a]')].map(x=>x.dataset.a).join(',');
  // listen flow
  let lq=null;for(let i=0;i<400&&!lq;i++){O.p.x=40;O.p.y=40;const q=M.owNewQuest(g);if(q.type==='listen')lq=q;}
  document.getElementById('owModal').hidden=true;O.modal=false;
  S.ow.quest=lq;O.qSaid=null;M.owUpdate(.03);M.owRender();M.owHud();
  out.lhud=[document.getElementById('owQSpk').hidden,document.getElementById('owQTxt').textContent,document.getElementById('owQD').textContent];
  const cr=O.W.crystals.find(c=>c.id===lq.cid);O.p.x=cr.x;O.p.y=cr.y;
  M.owPickCrystal&&M.owPickCrystal(cr);await new Promise(r=>setTimeout(r,100));
  out.listenDone=S.ow.quest&&S.ow.quest.done;
  // farm link
  S.plots=[{s:'x',t:Date.now(),wt:false},{s:null,t:0,wt:false}];
  document.getElementById('owModal').hidden=true;O.modal=false;O.rainOn=true;O.rainT=9999;O.rain=1;
  for(let i=0;i<600;i++)M.owUpdate(.05);
  out.plots=S.plots.map(p=>p.wt);
  return out;
});
console.log(JSON.stringify(R,null,1));console.log('errs',errs);
await b.close();
