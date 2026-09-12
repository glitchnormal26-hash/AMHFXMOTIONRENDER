/**
 * Motion Designer v3.9.3 — deterministic camera framing helpers.
 *
 * These helpers are pure math. They do not depend on GSAP and are safe to use in
 * authored browser timelines, render QA, tests, or higher-level camera rigs.
 */

export const DEFAULT_SAFE_RATIOS = Object.freeze({
  left: 0.07,
  right: 0.07,
  top: 0.05,
  bottom: 0.08,
});

const n = (value, fallback = 0) => {
  const v = Number(value);
  return Number.isFinite(v) ? v : fallback;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function resolveSafeMargins(stageWidth, stageHeight, safe = {}) {
  const w = Math.max(1, n(stageWidth, 1920));
  const h = Math.max(1, n(stageHeight, 1080));
  const ratio = safe.ratio === true;

  const left = ratio
    ? w * n(safe.left, DEFAULT_SAFE_RATIOS.left)
    : n(safe.left, w * DEFAULT_SAFE_RATIOS.left);
  const right = ratio
    ? w * n(safe.right, DEFAULT_SAFE_RATIOS.right)
    : n(safe.right, w * DEFAULT_SAFE_RATIOS.right);
  const top = ratio
    ? h * n(safe.top, DEFAULT_SAFE_RATIOS.top)
    : n(safe.top, h * DEFAULT_SAFE_RATIOS.top);
  const bottom = ratio
    ? h * n(safe.bottom, DEFAULT_SAFE_RATIOS.bottom)
    : n(safe.bottom, h * DEFAULT_SAFE_RATIOS.bottom);

  if (left + right >= w || top + bottom >= h) {
    throw new Error('Safe margins consume the entire stage.');
  }

  return {left, right, top, bottom};
}

export function safeFrameRect(stageWidth, stageHeight, safe = {}) {
  const w = Math.max(1, n(stageWidth, 1920));
  const h = Math.max(1, n(stageHeight, 1080));
  const m = resolveSafeMargins(w, h, safe);
  return {
    x: m.left,
    y: m.top,
    width: w - m.left - m.right,
    height: h - m.top - m.bottom,
    left: m.left,
    top: m.top,
    right: w - m.right,
    bottom: h - m.bottom,
    centerX: m.left + (w - m.left - m.right) * 0.5,
    centerY: m.top + (h - m.top - m.bottom) * 0.5,
    margins: m,
  };
}

/**
 * Return a top-left-origin camera state that fits a world-space rectangle inside the
 * stage safe frame.
 *
 * Camera model:
 *   screenX = worldX * scale + cameraX
 *   screenY = worldY * scale + cameraY
 */
export function frameRectState(rect, {
  stageWidth = 1920,
  stageHeight = 1080,
  safe = {},
  minScale = 0.01,
  maxScale = Infinity,
  padding = 0,
  offsetX = 0,
  offsetY = 0,
  rotation = 0,
} = {}) {
  if (!rect) throw new Error('frameRectState() requires a target rect.');

  const x = n(rect.x, n(rect.left, 0));
  const y = n(rect.y, n(rect.top, 0));
  const width = Math.max(0.001, n(rect.width, n(rect.right, 0) - x));
  const height = Math.max(0.001, n(rect.height, n(rect.bottom, 0) - y));
  const pad = Math.max(0, n(padding, 0));

  const target = {
    x: x - pad,
    y: y - pad,
    width: width + pad * 2,
    height: height + pad * 2,
  };

  const safeRect = safeFrameRect(stageWidth, stageHeight, safe);
  const fitScale = Math.min(
    safeRect.width / target.width,
    safeRect.height / target.height,
  );
  const scale = clamp(fitScale, n(minScale, 0.01), n(maxScale, fitScale));

  const targetCenterX = target.x + target.width * 0.5;
  const targetCenterY = target.y + target.height * 0.5;
  const xOut = safeRect.centerX + n(offsetX, 0) - targetCenterX * scale;
  const yOut = safeRect.centerY + n(offsetY, 0) - targetCenterY * scale;

  return {
    x: xOut,
    y: yOut,
    scale,
    rotation: n(rotation, 0),
    fitScale,
    safeRect,
    targetRect: target,
  };
}

export function rectInsideSafeFrame(rect, {
  stageWidth = 1920,
  stageHeight = 1080,
  safe = {},
  epsilon = 0.5,
} = {}) {
  if (!rect) return false;
  const r = {
    left: n(rect.left, n(rect.x, 0)),
    top: n(rect.top, n(rect.y, 0)),
    right: n(rect.right, n(rect.x, 0) + n(rect.width, 0)),
    bottom: n(rect.bottom, n(rect.y, 0) + n(rect.height, 0)),
  };
  const s = safeFrameRect(stageWidth, stageHeight, safe);
  const e = Math.max(0, n(epsilon, 0.5));
  return r.left >= s.left - e &&
    r.top >= s.top - e &&
    r.right <= s.right + e &&
    r.bottom <= s.bottom + e;
}

/**
 * Small scheduling guard for hard camera cuts. Register each camera move interval and
 * ask for a cut only after the previous move has ended. This catches the GSAP pattern
 * where `.set()` overlaps a still-running x/y/scale tween.
 */
export function createCameraCutGuard({epsilon = 1e-6} = {}) {
  let busyUntil = -Infinity;
  let lastLabel = null;

  return {
    registerMove(at, duration, label = 'camera move') {
      const start = n(at, 0);
      const dur = Math.max(0, n(duration, 0));
      busyUntil = Math.max(busyUntil, start + dur);
      lastLabel = label;
      return busyUntil;
    },

    assertCut(at, label = 'camera cut') {
      const t = n(at, 0);
      if (t < busyUntil - Math.max(0, n(epsilon, 1e-6))) {
        throw new Error(
          `${label} at ${t.toFixed(3)} overlaps ${lastLabel || 'camera move'} ` +
          `ending at ${busyUntil.toFixed(3)}`
        );
      }
      return true;
    },

    cutAt(at, label = 'camera cut') {
      this.assertCut(at, label);
      busyUntil = n(at, 0);
      lastLabel = label;
      return busyUntil;
    },

    state() {
      return {busyUntil, lastLabel};
    },

    reset(at = -Infinity) {
      busyUntil = Number(at);
      lastLabel = null;
    },
  };
}
