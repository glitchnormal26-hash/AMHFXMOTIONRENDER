import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

export function captureOptions(env = process.env, defaultFps = 60) {
  const fps = Number(env.FPS ?? defaultFps);
  const width = Number(env.WIDTH ?? 1920);
  const height = Number(env.HEIGHT ?? 1080);
  if (!Number.isFinite(fps) || fps <= 0) throw new Error('FPS must be positive and finite');
  if (![width, height].every(n => Number.isSafeInteger(n) && n > 0)) {
    throw new Error('WIDTH/HEIGHT must be positive integers');
  }
  return { fps, width, height, url: env.URL ||
    `${pathToFileURL(path.resolve(env.INDEX || 'index.html')).href}?clean=1` };
}

// One browser lifecycle and seek contract for snapshots, PNGs and MP4.
export async function withCapture(options, run) {
  const { width, height, url } = options;
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: [
    '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist'
    ] });
  } catch (cause) {
    throw new Error(
      'Chromium could not start. Install the locked browser with npx puppeteer browsers install chrome, ' +
      'or set PUPPETEER_EXECUTABLE_PATH to an installed compatible Chrome binary. ' +
      'Ensure TMPDIR and PUPPETEER_CACHE_DIR are writable and the host supports the Chromium sandbox. ' +
      'On Linux, check required browser system libraries. No frames were captured.',
      { cause }
    );
  }
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => {
      if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
    });
    const checkErrors = () => {
      if (errors.length) throw new Error(`Scene failed: ${errors.join('\n')}`);
    };
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
    checkErrors();
    await page.waitForFunction(() => window.OPENER?.ready === true, { timeout: 120000 });
    await page.evaluate(async () => {
      await document.fonts?.ready;
      await Promise.all([...document.images].map(img => img.decode()));
      window.OPENER.tl?.pause();
    });
    const duration = await page.evaluate(() => Number(window.OPENER.DURATION));
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('Invalid OPENER.DURATION');
    await run({ duration, async frame(time) {
      await page.evaluate(async t => {
        if (typeof window.OPENER.seek === 'function') await window.OPENER.seek(t);
        else window.OPENER.tl.pause().time(t, false);
        window.gsap?.ticker?.tick();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, time);
      checkErrors();
      return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width, height }, optimizeForSpeed: true });
    } });
    checkErrors();
  } finally {
    await browser.close();
  }
}
