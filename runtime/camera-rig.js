/**
 * Motion Designer v3.8 — deterministic DOM/2.5D camera-rig helpers.
 */

export function createWorldCamera(tl, rig, {
  homeX = 0,
  homeY = 0,
  homeScale = 1,
  homeRotate = 0
} = {}) {
  const camera = {
    homeX, homeY, homeScale, homeRotate,

    home(at, dur = 0.85, ease = "power3.out") {
      tl.to(rig, {
        x: homeX, y: homeY, scale: homeScale, rotation: homeRotate,
        duration: dur, ease
      }, at);
      return this;
    },

    look(at, x, y, scale = 1.25, dur = 0.7, {
      rotation = 0,
      origin = "50% 50%",
      ease = "power3.inOut"
    } = {}) {
      tl.set(rig, { transformOrigin: origin }, at);
      tl.to(rig, { x, y, scale, rotation, duration: dur, ease }, at);
      return this;
    },

    into(cutAt, {
      push = 2,
      inDur = 0.5,
      origin = "50% 50%",
      x = undefined,
      y = undefined,
      ease = "power2.in"
    } = {}) {
      tl.set(rig, { transformOrigin: origin }, cutAt - inDur);
      const vars = { scale: push, duration: inDur, ease };
      if (x !== undefined) vars.x = x;
      if (y !== undefined) vars.y = y;
      tl.to(rig, vars, cutAt - inDur);
      return this;
    },

    settle(cutAt, {
      from = 1.5,
      outDur = 0.95,
      origin = "50% 50%",
      x = homeX,
      y = homeY,
      rotation = homeRotate,
      ease = "power3.out"
    } = {}) {
      tl.set(rig, {
        transformOrigin: origin,
        scale: from,
        x, y, rotation
      }, cutAt);
      tl.to(rig, {
        scale: homeScale,
        x: homeX,
        y: homeY,
        rotation: homeRotate,
        duration: outDur,
        ease
      }, cutAt);
      return this;
    },

    pushThrough(cutAt, opts = {}) {
      this.into(cutAt, opts);
      this.settle(cutAt, opts);
      return this;
    },

    lock(at, { x = 0, y = 0, scale = 1, rotation = 0 } = {}) {
      tl.set(rig, { x, y, scale, rotation }, at);
      return this;
    }
  };
  return camera;
}

export function panSentence3D(tl, line, words, at, {
  width = 1920,
  duration = 2.9,
  fromXPercent = -6,
  toXPercent = -94,
  fromRotateY = 10,
  toRotateY = -10
} = {}) {
  tl.set(line, {
    x: width / 2,
    xPercent: fromXPercent,
    rotateY: fromRotateY,
    transformPerspective: 1400
  }, at);
  tl.to(line, {
    xPercent: toXPercent,
    duration,
    ease: "power1.inOut"
  }, at);
  tl.to(line, {
    rotateY: toRotateY,
    duration,
    ease: "power1.inOut"
  }, at);
  const n = Math.max(1, words.length - 1);
  tl.fromTo(words,
    { opacity: 0.2, yPercent: 16, scale: 0.96 },
    {
      opacity: 1,
      yPercent: 0,
      scale: 1,
      duration: 0.55,
      ease: "power2.out",
      stagger: duration / n * 0.95,
      immediateRender: false
    },
    at
  );
}
