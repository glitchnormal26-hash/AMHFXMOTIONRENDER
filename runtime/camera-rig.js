/**
 * Motion Designer v3.9.2 — deterministic DOM/2.5D camera-rig helpers.
 *
 * Camera motion is authored on the master timeline. Viewport fitting must live on
 * a separate parent wrapper so this rig can own narrative x/y/scale/rotation.
 */

const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const mix = (a, b, p) => a + (b - a) * p;

function normalizeState(base, next = {}) {
  return {
    x: next.x ?? base.x,
    y: next.y ?? base.y,
    scale: next.scale ?? base.scale,
    rotation: next.rotation ?? base.rotation
  };
}

function normalizedRampParts(attack, travel, settle) {
  const a = Math.max(0.001, Number(attack) || 0.18);
  const b = Math.max(0.001, Number(travel) || 0.55);
  const c = Math.max(0.001, Number(settle) || 0.27);
  const total = a + b + c;
  return [a / total, b / total, c / total];
}

export function createWorldCamera(tl, rig, {
  homeX = 0,
  homeY = 0,
  homeScale = 1,
  homeRotate = 0,
  stageWidth = 1920,
  stageHeight = 1080
} = {}) {
  const state = {
    x: homeX,
    y: homeY,
    scale: homeScale,
    rotation: homeRotate
  };

  const remember = (next) => {
    Object.assign(state, normalizeState(state, next));
  };

  const camera = {
    homeX, homeY, homeScale, homeRotate, stageWidth, stageHeight,

    state() {
      return { ...state };
    },

    home(at, dur = 0.85, ease = "power3.out") {
      const next = {
        x: homeX,
        y: homeY,
        scale: homeScale,
        rotation: homeRotate
      };
      tl.to(rig, { ...next, duration: dur, ease }, at);
      remember(next);
      return this;
    },

    look(at, x, y, scale = 1.25, dur = 0.7, {
      rotation = 0,
      origin = "50% 50%",
      ease = "power3.inOut"
    } = {}) {
      tl.set(rig, { transformOrigin: origin }, at);
      const next = { x, y, scale, rotation };
      tl.to(rig, { ...next, duration: dur, ease }, at);
      remember(next);
      return this;
    },

    /**
     * Center a known world-space point in the frame. This is the preferred helper
     * for cursor/object follow when the target point is deterministic.
     *
     * The rig uses a top-left transform origin so x/y can be derived directly from
     * world coordinates. offsetX/offsetY can create lead framing.
     */
    trackPoint(at, worldX, worldY, scale = 1.2, dur = 0.65, {
      offsetX = 0,
      offsetY = 0,
      rotation = 0,
      ease = "power3.inOut"
    } = {}) {
      const x = stageWidth * 0.5 + offsetX - worldX * scale;
      const y = stageHeight * 0.5 + offsetY - worldY * scale;
      tl.set(rig, { transformOrigin: "0 0" }, at);
      const next = { x, y, scale, rotation };
      tl.to(rig, { ...next, duration: dur, ease }, at);
      remember(next);
      return this;
    },

    /**
     * Deterministic subject follow / lead across multiple authored world points.
     * Each point may define x, y, scale, rotation, duration, offsetX, offsetY,
     * ease, and ramp=true. `ramp=true` uses the speed-ramp grammar below.
     */
    followPoints(at, points = [], {
      defaultDuration = 0.55,
      defaultScale = state.scale,
      gap = 0
    } = {}) {
      let cursorAt = at;
      for (const point of points) {
        const duration = point.duration ?? defaultDuration;
        const scale = point.scale ?? defaultScale;
        const x = stageWidth * 0.5 + (point.offsetX ?? 0) - point.x * scale;
        const y = stageHeight * 0.5 + (point.offsetY ?? 0) - point.y * scale;
        const next = {
          x,
          y,
          scale,
          rotation: point.rotation ?? state.rotation
        };
        tl.set(rig, { transformOrigin: "0 0" }, cursorAt);
        if (point.ramp) {
          this.speedRampTo(cursorAt, next, duration, point.rampOptions ?? {});
        } else {
          tl.to(rig, {
            ...next,
            duration,
            ease: point.ease ?? "power2.inOut"
          }, cursorAt);
          remember(next);
        }
        cursorAt += duration + gap;
      }
      return this;
    },

    /**
     * Three-phase deterministic speed ramp: attack → fast travel → settle.
     * Output FPS never changes; only authored camera velocity changes.
     *
     * The helper remembers the last authored camera state, so use camera helpers
     * consistently when chaining ramps.
     */
    speedRampTo(at, target = {}, dur = 0.9, {
      attack = 0.18,
      travel = 0.55,
      settle = 0.27,
      attackDistance = 0.1,
      overshoot = 0.035,
      attackEase = "power2.in",
      travelEase = "power1.in",
      settleEase = "power3.out",
      origin = null
    } = {}) {
      const start = { ...state };
      const end = normalizeState(start, target);
      const [a, b, c] = normalizedRampParts(attack, travel, settle);
      const attackP = clamp01(attackDistance);
      const over = Math.max(0, Number(overshoot) || 0);

      const attackState = {
        x: mix(start.x, end.x, attackP),
        y: mix(start.y, end.y, attackP),
        scale: mix(start.scale, end.scale, attackP),
        rotation: mix(start.rotation, end.rotation, attackP)
      };

      const travelState = {
        x: start.x + (end.x - start.x) * (1 + over),
        y: start.y + (end.y - start.y) * (1 + over),
        scale: start.scale + (end.scale - start.scale) * (1 + over),
        rotation: start.rotation + (end.rotation - start.rotation) * (1 + over)
      };

      if (origin) tl.set(rig, { transformOrigin: origin }, at);
      tl.to(rig, {
        ...attackState,
        duration: dur * a,
        ease: attackEase
      }, at);
      tl.to(rig, {
        ...travelState,
        duration: dur * b,
        ease: travelEase
      }, at + dur * a);
      tl.to(rig, {
        ...end,
        duration: dur * c,
        ease: settleEase
      }, at + dur * (a + b));

      remember(end);
      return this;
    },

    /**
     * Follow a world point with a speed-ramped landing. Useful for pickup → chase
     * → drop, kinetic type → product, and hero-object handoffs.
     */
    rampToPoint(at, worldX, worldY, scale = 1.2, dur = 0.9, {
      offsetX = 0,
      offsetY = 0,
      rotation = 0,
      ...rampOptions
    } = {}) {
      const next = {
        x: stageWidth * 0.5 + offsetX - worldX * scale,
        y: stageHeight * 0.5 + offsetY - worldY * scale,
        scale,
        rotation
      };
      tl.set(rig, { transformOrigin: "0 0" }, at);
      return this.speedRampTo(at, next, dur, rampOptions);
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
      const next = {
        x: x ?? state.x,
        y: y ?? state.y,
        scale: push,
        rotation: state.rotation
      };
      tl.to(rig, { ...next, duration: inDur, ease }, cutAt - inDur);
      remember(next);
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
      const next = {
        scale: homeScale,
        x: homeX,
        y: homeY,
        rotation: homeRotate
      };
      tl.to(rig, {
        ...next,
        duration: outDur,
        ease
      }, cutAt);
      remember(next);
      return this;
    },

    pushThrough(cutAt, opts = {}) {
      this.into(cutAt, opts);
      this.settle(cutAt, opts);
      return this;
    },

    lock(at, { x = 0, y = 0, scale = 1, rotation = 0 } = {}) {
      const next = { x, y, scale, rotation };
      tl.set(rig, next, at);
      remember(next);
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
