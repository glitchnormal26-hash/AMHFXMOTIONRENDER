/**
 * Motion Designer v3.8 — master-timeline audio synchronizer.
 * Designed for VO + hi-tech SFX + ambience, with no BGM by default.
 */

function safePlay(el) {
  const p = el?.play?.();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

export function createAudioRuntime({
  timeline,
  voiceover = null,
  sfx = [],
  ambience = [],
  driftTolerance = 0.075
} = {}) {
  const all = [voiceover, ...sfx, ...ambience].filter(Boolean);
  let unlocked = false;

  function setTime(t) {
    for (const el of all) {
      if (!Number.isFinite(el.duration) || el.duration === 0) continue;
      const target = Math.max(0, Math.min(el.duration, t));
      if (Math.abs(el.currentTime - target) > driftTolerance) {
        try { el.currentTime = target; } catch {}
      }
    }
  }

  function sync() {
    const t = timeline.time();
    setTime(t);
  }

  async function unlock() {
    unlocked = true;
    for (const el of all) {
      try {
        el.muted = true;
        safePlay(el);
        el.pause();
        el.currentTime = 0;
        el.muted = false;
      } catch {}
    }
  }

  function play() {
    sync();
    for (const el of all) safePlay(el);
    timeline.play();
  }

  function pause() {
    timeline.pause();
    for (const el of all) el.pause?.();
  }

  function seek(t) {
    timeline.pause();
    timeline.time(t, false);
    setTime(t);
  }

  function tick() {
    if (!unlocked || timeline.paused()) return;
    const t = timeline.time();
    for (const el of all) {
      if (el.paused) safePlay(el);
      if (Math.abs((el.currentTime || 0) - t) > driftTolerance) {
        try { el.currentTime = t; } catch {}
      }
    }
  }

  return { unlock, play, pause, seek, sync, tick, setTime, get unlocked(){ return unlocked; } };
}
