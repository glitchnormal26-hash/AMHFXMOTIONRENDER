import {open,sleep,createChar} from './lib.mjs';
const {b,p,errs}=await open();
await createChar(p,'p4','Rina');
await p.evaluate(()=>{document.querySelector('[data-tab="open"]').click();document.getElementById('owPlay').click()});
await sleep(1200);
const R=await p.evaluate(async()=>{
  const M=__MQ,O=M.OW(),S=M.S(),out={};
  // 1. OW questions: 90 consecutive across quizzes -> no duplicate id
  const ids=[];let dup=0;
  const id=q=>q.kind==='gram'?q.g.q:q.kind==='order'?q.it.s:q.w.en;
  for(let i=0;i<90;i++){const st={seen:new Set()};const q=M.owMakeQ({seen:st.seen});const k=id(q);if(ids.includes(k))dup++;ids.push(k);}
  out.owDup=dup;
  // within a single quiz run with real UI
  const seenInQuiz=[];
  M.owQuiz({mode:'chat',foe:'mochi',rounds:8,title:'t',onEnd:()=>{}});
  for(let k=0;k<8&&O.quiz;k++){seenInQuiz.push(id(O.quiz.q));O.quiz.pick(O.quiz.q.opts.findIndex(o=>o.ok),true);await new Promise(r=>setTimeout(r,1500));}
  out.quizUnique=new Set(seenInQuiz).size===seenInQuiz.length;out.n=seenInQuiz.length;
  M.owModalHide();
  // review with 2 miss words, rounds=2 distinct
  S.ow.miss={cat:2,dog:1};
  const rv=[];M.owReview();await new Promise(r=>setTimeout(r,300));
  for(let k=0;k<4&&O.quiz;k++){rv.push(id(O.quiz.q));O.quiz.pick(O.quiz.q.opts.findIndex(o=>o.ok),true);await new Promise(r=>setTimeout(r,1500));}
  out.review=rv;
  M.owModalHide();
  // 2. quests: 40 accepts in a row, no key repeats within 8
  const keys=[];let qdup=0,sameType=0,last='';
  const g=O.npcs[0];
  for(let i=0;i<40;i++){const q=M.owNewQuest(g);const h=S.ow.qhist||(S.ow.qhist=[]);const k=q.type+':'+(q.to||q.wid||q.vid||'');if(h.includes(k))qdup++;if(q.type===last)sameType++;last=q.type;h.push(k);while(h.length>8)h.shift();}
  out.qdup=qdup;out.sameType=sameType;
  return out;
});
console.log(JSON.stringify(R));
// classic modes: grammar 2 runs, compare
const run=async(mode)=>{await p.evaluate(m=>{document.querySelector('[data-tab="home"]')&&document.querySelector('[data-tab="home"]').click();},mode);
 return p.evaluate(m=>{const k=[];return null;},mode)};
console.log('errs',errs);
await b.close();
