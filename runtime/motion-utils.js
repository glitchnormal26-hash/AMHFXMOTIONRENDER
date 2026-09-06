/**
 * Motion Designer v3.8 — reusable deterministic motion utilities.
 * Architecture utilities, not a visual style.
 */

let filterCounter = 0;

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export function seededWave(t, seed = 0, freq = 1, amp = 1) {
  return Math.sin(t * freq + seed) * amp;
}

export function splitChars(el, {
  wordClass = "wd",
  charClass = "ch",
  preserveSpaces = true
} = {}) {
  const words = (el.textContent || "").split(" ");
  el.textContent = "";
  const chars = [];
  words.forEach((word, wi) => {
    const wrap = document.createElement("span");
    wrap.className = wordClass;
    for (const c of word) {
      const span = document.createElement("span");
      span.className = charClass;
      span.textContent = c;
      wrap.appendChild(span);
      chars.push(span);
    }
    el.appendChild(wrap);
    if (wi < words.length - 1 && preserveSpaces) {
      const space = document.createElement("span");
      space.className = charClass;
      space.innerHTML = "&nbsp;";
      el.appendChild(space);
      chars.push(space);
    }
  });
  return chars;
}

export function splitWords(el, { className = "word" } = {}) {
  const text = el.textContent || "";
  el.textContent = "";
  const words = [];
  text.split(/(\s+)/).forEach(part => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part));
      return;
    }
    const span = document.createElement("span");
    span.className = className;
    span.textContent = part;
    el.appendChild(span);
    words.push(span);
  });
  return words;
}

function ensureFilterDefs() {
  let svg = document.querySelector("#motion-filters");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "motion-filters";
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.cssText = "position:fixed;width:0;height:0;opacity:0;pointer-events:none";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);
    document.body.prepend(svg);
  }
  return svg.querySelector("defs");
}

export function makeDirectionalBlur() {
  const NS = "http://www.w3.org/2000/svg";
  const id = `md-blur-${filterCounter++}`;
  const defs = ensureFilterDefs();
  const filter = document.createElementNS(NS, "filter");
  filter.id = id;
  filter.setAttribute("x", "-70%");
  filter.setAttribute("y", "-70%");
  filter.setAttribute("width", "240%");
  filter.setAttribute("height", "240%");
  const gaussian = document.createElementNS(NS, "feGaussianBlur");
  gaussian.setAttribute("stdDeviation", "0 0");
  filter.appendChild(gaussian);
  defs.appendChild(filter);
  return { url: `url(#${id})`, node: gaussian, filter };
}

export function blurTween(tl, targets, at, from, to, dur, {
  ease = "power3.out",
  ax = 1,
  ay = 0.08,
  remove = true
} = {}) {
  const blur = makeDirectionalBlur();
  const state = { v: from };
  tl.set(targets, { filter: blur.url }, at);
  tl.to(state, {
    v: to,
    duration: dur,
    ease,
    onUpdate() {
      blur.node.setAttribute(
        "stdDeviation",
        `${(state.v * ax).toFixed(2)} ${(state.v * ay).toFixed(2)}`
      );
    }
  }, at);
  if (remove) {
    tl.set(targets, { filter: "none" }, at + dur);
  }
  return blur;
}

export const BLUR_VERTICAL = { ax: 0.1, ay: 1 };
export const BLUR_HORIZONTAL = { ax: 1, ay: 0.08 };

export function createTextMotion(tl) {
  return {
    inUp(chars, el, at, { dur = 0.8, st = 0.024 } = {}) {
      tl.fromTo(
        chars,
        { opacity: 0, yPercent: 60, scaleY: 1.45 },
        { opacity: 1, yPercent: 0, scaleY: 1, duration: dur, ease: "power4.out", stagger: st, immediateRender: false },
        at
      );
      blurTween(tl, el, at, 30, 0, dur, BLUR_VERTICAL);
    },
    inLeft(chars, el, at, { dur = 0.75, st = 0.02 } = {}) {
      tl.fromTo(
        chars,
        { opacity: 0, xPercent: -45 },
        { opacity: 1, xPercent: 0, duration: dur, ease: "power4.out", stagger: st, immediateRender: false },
        at
      );
      blurTween(tl, el, at, 50, 0, dur, BLUR_HORIZONTAL);
    },
    outUp(chars, el, at, { dur = 0.4, st = 0.01 } = {}) {
      tl.to(chars, { opacity: 0, yPercent: -70, duration: dur, ease: "power2.in", stagger: st }, at);
      blurTween(tl, el, at, 0, 45, dur + 0.1, { ease: "power2.in", ...BLUR_VERTICAL });
    },
    outLeft(chars, el, at, { dur = 0.4, st = 0.01 } = {}) {
      tl.to(chars, { opacity: 0, xPercent: -60, duration: dur, ease: "power2.in", stagger: st }, at);
      blurTween(tl, el, at, 0, 55, dur + 0.1, { ease: "power2.in", ...BLUR_HORIZONTAL });
    }
  };
}

export function markHighlight(tl, hl, at, {
  fillDuration = 0.5,
  textDuration = 0.7,
  ornamentDelay = 0.22
} = {}) {
  const field = hl.querySelector("i");
  const text = hl.querySelector(".hl-t");
  const ornament = hl.querySelector(".hl-orn");
  if (field) {
    tl.fromTo(field, { scaleX: 0 }, {
      scaleX: 1,
      duration: fillDuration,
      ease: "power3.out",
      immediateRender: false
    }, at);
  }
  if (text) {
    tl.fromTo(text, { opacity: 0, yPercent: 60 }, {
      opacity: 1,
      yPercent: 0,
      duration: textDuration,
      ease: "power4.out",
      immediateRender: false
    }, at);
  }
  if (ornament) {
    tl.fromTo(ornament, { opacity: 0, scale: 0.2, rotate: -40 }, {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.5,
      ease: "back.out(2)",
      immediateRender: false
    }, at + ornamentDelay);
  }
}

export function popPunctuation(tl, el, at) {
  return tl.fromTo(el, { opacity: 0, yPercent: 60 }, {
    opacity: 1,
    yPercent: 0,
    duration: 0.5,
    ease: "power4.out",
    immediateRender: false
  }, at);
}

export function deterministicType(tl, el, text, at, {
  duration = 1,
  ease = "none",
  cursor = ""
} = {}) {
  const state = { i: 0 };
  return tl.to(state, {
    i: text.length,
    duration,
    ease,
    onUpdate() {
      el.textContent = text.slice(0, Math.round(state.i)) + cursor;
    }
  }, at);
}

export function deterministicCounter(tl, el, from, to, at, {
  duration = 1,
  decimals = 0,
  prefix = "",
  suffix = "",
  ease = "power2.out"
} = {}) {
  const state = { v: from };
  return tl.to(state, {
    v: to,
    duration,
    ease,
    onUpdate() {
      el.textContent = `${prefix}${state.v.toFixed(decimals)}${suffix}`;
    }
  }, at);
}

export function fitFixedStage(stage, width = 1920, height = 1080) {
  function fit() {
    const scale = Math.min(innerWidth / width, innerHeight / height);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
    return scale;
  }
  addEventListener("resize", fit);
  fit();
  return fit;
}
