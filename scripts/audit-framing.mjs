#!/usr/bin/env node
/**
 * Deterministic camera/frame-safety audit for browser-authored Motion Designer scenes.
 *
 * Scene contract:
 *   window.OPENER.ready === true
 *   window.OPENER.seek(time)
 *   window.OPENER.FRAME_AUDIT = [
 *     {
 *       time: 0.65,
 *       selectors: ['#hook'],
 *       safe: {left: 76, right: 76, top: 96, bottom: 154},
 *       cover: ['#world']
 *     }
 *   ]
 *
 * Optional camera-overlap contract:
 *   window.OPENER.CAMERA_AUDIT = {
 *     moves: [{start: 0.75, end: 1.25, label: 'hook push'}],
 *     cuts: [{time: 7.14, label: 'preview hard cut'}]
 *   }
 *
 * Environment:
 *   INDEX=assets/scene.html WIDTH=1080 HEIGHT=1920 node scripts/audit-framing.mjs
 */

import path from 'node:path';
import {pathToFileURL} from 'node:url';
import puppeteer from 'puppeteer';

const width = Number(process.env.WIDTH || 1080);
const height = Number(process.env.HEIGHT || 1920);
const indexFile = path.resolve(process.env.INDEX || 'index.html');
const defaultSafe = {
  left: Math.round(width * 0.07),
  right: Math.round(width * 0.07),
  top: Math.round(height * 0.05),
  bottom: Math.round(height * 0.08),
};

const url = process.env.URL || `${pathToFileURL(indexFile).href}?clean=1`;

const finite = (v) => Number.isFinite(Number(v));
const normalizeSafe = (safe = {}) => ({
  left: finite(safe.left) ? Number(safe.left) : defaultSafe.left,
  right: finite(safe.right) ? Number(safe.right) : defaultSafe.right,
  top: finite(safe.top) ? Number(safe.top) : defaultSafe.top,
  bottom: finite(safe.bottom) ? Number(safe.bottom) : defaultSafe.bottom,
});

let browser;
try {
  browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--allow-file-access-from-files',
      '--autoplay-policy=no-user-gesture-required',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({width, height, deviceScaleFactor: 1});
  await page.goto(url, {waitUntil: 'networkidle0', timeout: 120000});
  await page.waitForFunction(() => window.OPENER?.ready === true, {timeout: 120000});
  await page.evaluate(() => document.fonts?.ready);

  const audit = await page.evaluate(() => window.OPENER?.FRAME_AUDIT || []);
  const cameraAudit = await page.evaluate(() => window.OPENER?.CAMERA_AUDIT || null);
  if (!Array.isArray(audit) || audit.length === 0) {
    throw new Error('FRAME_AUDIT is missing or empty. Scene must expose deterministic framing checks.');
  }

  const frameFailures = [];
  const overlapFailures = [];
  console.log(`FRAME_AUDIT_START ${width}x${height} checks=${audit.length}`);

  for (let i = 0; i < audit.length; i++) {
    const check = audit[i] || {};
    const time = Number(check.time);
    if (!Number.isFinite(time) || time < 0) {
      frameFailures.push(`check[${i}] invalid time=${check.time}`);
      continue;
    }

    await page.evaluate(async (t) => {
      window.OPENER.seek(t);
      if (window.gsap?.ticker?.tick) window.gsap.ticker.tick();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }, time);

    const safe = normalizeSafe(check.safe);
    const selectors = Array.isArray(check.selectors) ? check.selectors : [];
    const cover = Array.isArray(check.cover) ? check.cover : [];

    const result = await page.evaluate(({selectors, cover}) => {
      const rectFor = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return {selector, missing: true};
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          selector,
          missing: false,
          left: r.left,
          top: r.top,
          right: r.right,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
          opacity: Number(cs.opacity || 1),
          visibility: cs.visibility,
          display: cs.display,
        };
      };
      return {
        targets: selectors.map(rectFor),
        coverage: cover.map(rectFor),
      };
    }, {selectors, cover});

    console.log(`FRAME_AUDIT_CHECK index=${i} time=${time.toFixed(3)} safe=${JSON.stringify(safe)}`);

    for (const r of result.targets) {
      if (r.missing) {
        frameFailures.push(`t=${time.toFixed(3)} ${r.selector} missing`);
        continue;
      }
      if (r.display === 'none' || r.visibility === 'hidden' || r.opacity <= 0.01) {
        frameFailures.push(`t=${time.toFixed(3)} ${r.selector} not visibly present`);
        continue;
      }
      const ok =
        r.left >= safe.left - 0.5 &&
        r.right <= width - safe.right + 0.5 &&
        r.top >= safe.top - 0.5 &&
        r.bottom <= height - safe.bottom + 0.5;
      console.log(
        `  target ${r.selector} rect=${r.left.toFixed(1)},${r.top.toFixed(1)},${r.right.toFixed(1)},${r.bottom.toFixed(1)} ${ok ? 'PASS' : 'FAIL'}`
      );
      if (!ok) {
        frameFailures.push(
          `t=${time.toFixed(3)} ${r.selector} outside safe frame: ` +
          `rect=[${r.left.toFixed(1)},${r.top.toFixed(1)},${r.right.toFixed(1)},${r.bottom.toFixed(1)}] ` +
          `safe=[${safe.left},${safe.top},${width - safe.right},${height - safe.bottom}]`
        );
      }
    }

    for (const r of result.coverage) {
      if (r.missing) {
        frameFailures.push(`t=${time.toFixed(3)} coverage ${r.selector} missing`);
        continue;
      }
      const ok = r.left <= 0.5 && r.top <= 0.5 && r.right >= width - 0.5 && r.bottom >= height - 0.5;
      console.log(
        `  cover  ${r.selector} rect=${r.left.toFixed(1)},${r.top.toFixed(1)},${r.right.toFixed(1)},${r.bottom.toFixed(1)} ${ok ? 'PASS' : 'FAIL'}`
      );
      if (!ok) {
        frameFailures.push(
          `t=${time.toFixed(3)} ${r.selector} does not cover viewport: ` +
          `rect=[${r.left.toFixed(1)},${r.top.toFixed(1)},${r.right.toFixed(1)},${r.bottom.toFixed(1)}]`
        );
      }
    }
  }

  if (cameraAudit) {
    const moves = Array.isArray(cameraAudit.moves) ? cameraAudit.moves : [];
    const cuts = Array.isArray(cameraAudit.cuts) ? cameraAudit.cuts : [];
    const eps = 1e-6;
    console.log(`CAMERA_OVERLAP_AUDIT moves=${moves.length} cuts=${cuts.length}`);

    for (const cut of cuts) {
      const t = Number(cut?.time);
      if (!Number.isFinite(t)) {
        overlapFailures.push(`invalid cut time=${cut?.time}`);
        continue;
      }
      for (const move of moves) {
        const start = Number(move?.start);
        const end = Number(move?.end);
        if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
          overlapFailures.push(`invalid move interval ${JSON.stringify(move)}`);
          continue;
        }
        if (start + eps < t && t < end - eps) {
          overlapFailures.push(
            `${cut.label || 'cut'} at ${t.toFixed(3)} overlaps ${move.label || 'camera move'} ` +
            `[${start.toFixed(3)}, ${end.toFixed(3)}]`
          );
        }
      }
    }
  }

  if (frameFailures.length) {
    console.error('CAMERA_FRAME_GATE=FAIL');
    for (const f of frameFailures) console.error(` - ${f}`);
  } else {
    console.log('CAMERA_FRAME_GATE=PASS');
  }

  if (overlapFailures.length) {
    console.error('CAMERA_OVERLAP_GATE=FAIL');
    for (const f of overlapFailures) console.error(` - ${f}`);
  } else {
    console.log('CAMERA_OVERLAP_GATE=PASS');
  }

  if (frameFailures.length || overlapFailures.length) process.exitCode = 2;
} finally {
  if (browser) await browser.close();
}
