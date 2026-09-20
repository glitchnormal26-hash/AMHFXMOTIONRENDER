(() => {
  const wm = new WeakMap();
  const allTargets = new Set();
  const defaults = {x:0,y:0,scale:1,scaleX:1,rotation:0,rotateY:0,autoAlpha:null,width:null,transformOrigin:null};
  const animKeys = new Set(['x','y','scale','scaleX','rotation','rotateY','autoAlpha','width']);
  function arr(target){
    if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
    if (target == null) return [];
    if (Array.isArray(target)) return target.flatMap(arr);
    if (target instanceof NodeList || target instanceof HTMLCollection) return Array.from(target);
    return [target];
  }
  function init(el){
    if (!wm.has(el)) {
      let opacity = 1;
      let width = null;
      if (el instanceof Element) {
        const cs = getComputedStyle(el);
        opacity = Number(cs.opacity || 1);
        const iw = el.style.width || '';
        width = iw || (cs.width === '0px' ? '0px' : null);
      }
      wm.set(el,{base:{...defaults,autoAlpha:opacity,width},tracks:{}});
      allTargets.add(el);
    }
    return wm.get(el);
  }
  function parseVal(v){
    if (typeof v === 'number') return {n:v,u:''};
    const m = String(v).trim().match(/^(-?\d*\.?\d+)\s*(%|px|deg)?$/);
    return m ? {n:+m[1],u:m[2]||''} : {n:0,u:''};
  }
  function ease(name,p){
    p=Math.max(0,Math.min(1,p)); name=String(name||'power1.inOut');
    if(name.startsWith('back.out')){const s=1.70158; p-=1; return 1+p*p*((s+1)*p+s);}
    if(name==='sine.inOut') return -(Math.cos(Math.PI*p)-1)/2;
    if(name==='expo.inOut') { if(p===0||p===1) return p; return p<.5?Math.pow(2,20*p-10)/2:(2-Math.pow(2,-20*p+10))/2; }
    const m=name.match(/power(\d)\.(in|out|inOut)/); const pow=m?Math.max(1,+m[1]+0):2; const mode=m?m[2]:'inOut';
    if(mode==='in') return Math.pow(p,pow);
    if(mode==='out') return 1-Math.pow(1-p,pow);
    return p<.5 ? Math.pow(2*p,pow)/2 : 1-Math.pow(2*(1-p),pow)/2;
  }
  function interp(a,b,p){
    const A=parseVal(a), B=parseVal(b); const u=B.u||A.u;
    const n=A.n+(B.n-A.n)*p;
    return u ? `${n}${u}` : n;
  }
  function evalProp(el,prop,t){
    const st=init(el); const segs=(st.tracks[prop]||[]).slice().sort((a,b)=>a.s-b.s);
    let v=st.base[prop];
    for(const seg of segs){
      if(t < seg.s) break;
      if(t >= seg.e){ v=seg.to; continue; }
      const p=ease(seg.ease,(t-seg.s)/(seg.e-seg.s||1));
      v=interp(seg.from,seg.to,p); break;
    }
    return v;
  }
  function apply(el,t){
    init(el);
    if (!(el instanceof Element)) return;
    const v={}; for(const k of animKeys) v[k]=evalProp(el,k,t);
    el.style.opacity = v.autoAlpha == null ? '' : String(v.autoAlpha);
    el.style.visibility = Number(v.autoAlpha) <= 0.001 ? 'hidden':'visible';
    if(v.width != null) el.style.width = typeof v.width==='number' ? `${v.width}px` : String(v.width);
    const tx=+parseVal(v.x).n||0, ty=+parseVal(v.y).n||0, sc=+parseVal(v.scale).n||1, sx=+parseVal(v.scaleX).n||1, rot=+parseVal(v.rotation).n||0, ry=+parseVal(v.rotateY).n||0;
    el.style.transform = `translate(${tx}px,${ty}px) rotate(${rot}deg) rotateY(${ry}deg) scale(${sc*sx},${sc})`;
  }
  function setProps(el,props){
    const st=init(el);
    for(const [k,v] of Object.entries(props||{})){
      if(k==='transformOrigin'){ if(el instanceof Element) el.style.transformOrigin=v; st.base[k]=v; continue; }
      if(animKeys.has(k)) st.base[k]=v;
    }
    apply(el,0);
  }
  class Timeline{
    constructor(){this.lastStart=0;this.lastEnd=0;this._time=0;}
    _pos(p){
      if(typeof p==='number') return p;
      if(typeof p==='string' && p.startsWith('<')) { const m=p.match(/^<\+?(-?\d*\.?\d+)?$/); return this.lastStart+(m&&m[1]?+m[1]:0); }
      return this.lastEnd;
    }
    _add(target,toProps,pos,fromProps){
      const baseStart=this._pos(pos); const dur=Number(toProps.duration||0); const stagger=Number(toProps.stagger||0); const easeName=toProps.ease||'power1.inOut';
      const els=arr(target);
      els.forEach((el,i)=>{
        const s=baseStart+i*stagger,e=s+dur; const st=init(el);
        for(const k of animKeys){ if(!(k in toProps)) continue; if(!st.tracks[k])st.tracks[k]=[];
          let from;
          if(fromProps && k in fromProps){ from=fromProps[k]; if(st.tracks[k].length===0) st.base[k]=from; }
          else from=evalProp(el,k,s);
          st.tracks[k].push({s,e,from,to:toProps[k],ease:easeName});
        }
        if(toProps.transformOrigin && el instanceof Element) el.style.transformOrigin=toProps.transformOrigin;
      });
      this.lastStart=baseStart; this.lastEnd=Math.max(this.lastEnd, baseStart+dur+Math.max(0,els.length-1)*stagger); return this;
    }
    to(target,props,pos){return this._add(target,props,pos,null)}
    fromTo(target,from,to,pos){return this._add(target,to,pos,from)}
    addLabel(){return this}
    pause(){return this}
    play(){return this}
    time(t){this._time=Number(t)||0; for(const el of allTargets) apply(el,this._time); return this}
  }
  window.gsap={
    set(target,props){arr(target).forEach(el=>setProps(el,props));},
    timeline(){return new Timeline();},
    ticker:{add(){},tick(){}},
  };
})();