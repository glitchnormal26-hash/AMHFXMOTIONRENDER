/**
 * Motion Designer v3.8 — continuous-world explainer choreography helpers.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

function pathLength(path) {
  try { return path.getTotalLength(); } catch { return 0; }
}

export function createExplainerHelpers(tl, camera = null) {
  const api = {
    say(el, at, {
      y = 34,
      duration = 0.62,
      ease = "power4.out",
      scale = 0.985
    } = {}) {
      tl.fromTo(el,
        { autoAlpha: 0, y, scale },
        { autoAlpha: 1, y: 0, scale: 1, duration, ease, immediateRender: false },
        at
      );
      return api;
    },

    unsay(el, at, {
      y = -26,
      duration = 0.34,
      ease = "power2.in"
    } = {}) {
      tl.to(el, { autoAlpha: 0, y, duration, ease }, at);
      return api;
    },

    draw(path, at, {
      duration = 0.7,
      ease = "power2.out",
      from = 0,
      to = 1
    } = {}) {
      const len = pathLength(path);
      if (!len) return api;
      const start = len * (1 - from);
      const end = len * (1 - to);
      tl.set(path, {
        strokeDasharray: `${len} ${len}`,
        strokeDashoffset: start,
        opacity: from > 0 ? 1 : 0
      }, at);
      tl.to(path, {
        strokeDashoffset: end,
        opacity: 1,
        duration,
        ease
      }, at);
      return api;
    },

    drawDash(el, at, {
      duration = 0.7,
      ease = "power2.out",
      direction = "left"
    } = {}) {
      const from = direction === "left"
        ? "inset(0 100% 0 0)"
        : "inset(0 0 0 100%)";
      tl.fromTo(el,
        { clipPath: from, opacity: 1 },
        { clipPath: "inset(0 0 0 0)", duration, ease, immediateRender: false },
        at
      );
      return api;
    },

    label(el, at, opts = {}) {
      return api.say(el, at, { duration: 0.45, y: 18, ...opts });
    },

    extract(el, at, {
      x = 0, y = 0, scale = 1.12, rotation = 0,
      duration = 0.55, ease = "power3.inOut"
    } = {}) {
      tl.to(el, { x, y, scale, rotation, duration, ease }, at);
      return api;
    },

    morphProxy(fromEl, toEl, at, {
      duration = 0.5,
      ease = "power3.inOut"
    } = {}) {
      const a = fromEl.getBoundingClientRect();
      const b = toEl.getBoundingClientRect();
      const dx = b.left + b.width/2 - (a.left + a.width/2);
      const dy = b.top + b.height/2 - (a.top + a.height/2);
      const sx = b.width / Math.max(1, a.width);
      const sy = b.height / Math.max(1, a.height);
      tl.to(fromEl, { x: `+=${dx}`, y: `+=${dy}`, scaleX: sx, scaleY: sy, duration, ease }, at);
      tl.set(toEl, { autoAlpha: 1 }, at + duration);
      tl.set(fromEl, { autoAlpha: 0 }, at + duration);
      return api;
    },

    look(at, x, y, scale, dur, opts) {
      camera?.look(at, x, y, scale, dur, opts);
      return api;
    },

    home(at, dur, ease) {
      camera?.home(at, dur, ease);
      return api;
    },

    into(at, opts) {
      camera?.into(at, opts);
      return api;
    },

    settle(at, opts) {
      camera?.settle(at, opts);
      return api;
    }
  };

  return api;
}

export function createSceneRegistry(tl) {
  const scenes = new Map();
  return {
    add(name, el) {
      scenes.set(name, el);
      return this;
    },
    show(name, at) {
      const el = scenes.get(name);
      if (el) tl.set(el, { autoAlpha: 1 }, at);
      return this;
    },
    hide(name, at) {
      const el = scenes.get(name);
      if (el) tl.set(el, { autoAlpha: 0 }, at);
      return this;
    },
    cut(fromName, toName, at) {
      this.hide(fromName, at);
      this.show(toName, at);
      return this;
    }
  };
}
