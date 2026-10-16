import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open();
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1200);
const R=await p.evaluate(async()=>{
  const M=__MQ,O=M.OW(),S=M.S(),out={};
  O.rain=0;
  // 1. question kinds
  const kinds={};for(let i=0;i<300;i++){const q=M.owMakeQ({});kinds[q.kind]=(kinds[q.kind]||0)+1;if(!q.opts||q.opts.length<2||q.opts.filter(o=>o.ok).length!==1)out.badq=(out.badq||0)+1;
    if(new Set(q.opts.map(o=>o.t)).size!==q.opts.length)out.dup=(out.dup||0)+1;}
  out.kinds=kinds;
  // 2. battle w/ skills, play quiz fully
  S.diff=2;S.adv=S.adv||{};S.adv.party=['mochi','kai','sari','luna','bima','foxy','pip'];
  const mon=O.W.mons.find(m=>!m.boss);
  M.owBattle(mon);await new Promise(r=>setTimeout(r,200));
  out.sk=document.querySelectorAll('.owq-skb').length;out.timer=!!document.querySelector('.owq-time');
  document.querySelector('[data-k="sari"]').click();await new Promise(r=>setTimeout(r,100));
  document.querySelector('[data-k="kai"]').click();await new Promise(r=>setTimeout(r,100));
  out.opts_after_kai=[...document.querySelectorAll('.owq-opt')].filter(b=>!b.disabled&&b.style.visibility!=='hidden'&&!b.hidden&&!b.classList.contains('gone')).length;
  // answer using correct
  let guard=0;while(O.quiz&&guard++<12){const st=O.quiz;const i=st.q.opts.findIndex(o=>o.ok);st.pick(i,true);await new Promise(r=>setTimeout(r,1500));}
  out.after=!O.quiz;
  // 3. assist
  S.ow.assist=true;S.ow.miss={};
  M.owQuiz({mode:'chat',foe:'mochi',rounds:2,title:'t',onEnd:r=>{out.assistEnd=r.st.ok;}});
  await new Promise(r=>setTimeout(r,200));
  const st=O.quiz;const q=st.q;const i=q.opts.findIndex(o=>o.ok);
  st.pick(i);out.sel1=st.sel;out.n1=st.n;
  st.pick(i);out.n2=st.n;
  await new Promise(r=>setTimeout(r,1500));
  O.quiz&&O.quiz.pick(O.quiz.q.opts.findIndex(o=>o.ok),true);await new Promise(r=>setTimeout(r,1800));
  out.assistDone=out.assistEnd;
  S.ow.assist=false;
  // 4. miss tracking + review
  const wrong=()=>{const st=O.quiz;const i=st.q.opts.findIndex(o=>!o.ok);st.pick(i,true);};
  M.owQuiz({mode:'chat',foe:'mochi',rounds:3,title:'t',onEnd:()=>{}});
  for(let k=0;k<3;k++){await new Promise(r=>setTimeout(r,200));if(O.quiz){wrong();await new Promise(r=>setTimeout(r,1800));}}
  out.miss=Object.keys(S.ow.miss).length;out.topics=JSON.stringify(S.ow.topic).slice(0,200);
  document.getElementById('owModal').hidden||M.owMakeQ;
  O.quiz=null;
  M.owReview();await new Promise(r=>setTimeout(r,300));
  out.reviewOpen=!!document.querySelector('.owq');
  let g=0;while(O.quiz&&g++<8){O.quiz.pick(O.quiz.q.opts.findIndex(o=>o.ok),true);await new Promise(r=>setTimeout(r,1500));}
  out.missAfter=Object.keys(S.ow.miss).length;
  // 5. report
  M.owReport();await new Promise(r=>setTimeout(r,100));
  out.report=document.getElementById('owModal').innerText.slice(0,260);
  out.text=M.owReportText();
  out.role=document.getElementById('owModal').getAttribute('role');out.focus=document.activeElement&&document.activeElement.tagName;
  document.querySelector('#owModal [data-a="back"]').click();await new Promise(r=>setTimeout(r,100));
  out.menuBtns=[...document.querySelectorAll('#owModal [data-a]')].map(x=>x.dataset.a).join(',');
  document.querySelector('#owModal [data-a="assist"]').click();await new Promise(r=>setTimeout(r,100));out.assistOn=S.ow.assist;
  S.ow.assist=false;document.querySelector('#owModal [data-a="close"]')&&document.querySelector('#owModal [data-a="close"]').click();
  return out;
});
console.log(JSON.stringify(R,null,1));console.log('errs',errs);
await b.close();
