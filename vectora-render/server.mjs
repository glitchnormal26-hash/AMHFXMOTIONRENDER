import express from 'express';
import { createRequire } from 'node:module';
import { mkdir, stat, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 10000);
app.use(express.json({ limit: '8mb' }));
app.use(express.static('public'));

const VTRACER_DIR = '/tmp/vtracer-1.0.0-alpha.3';
const VTRACER_CDNS = [
  'https://cdn.jsdelivr.net/npm/@visioncortex/vtracer@1.0.0-alpha.3',
  'https://unpkg.com/@visioncortex/vtracer@1.0.0-alpha.3'
];
const VTRACER_FILES = [
  ['index.js', 500],
  ['pkg/vtracer_wasm.js', 5000],
  ['pkg/vtracer_wasm_bg.wasm', 500000]
];
const runtimeRequire = createRequire(`${process.cwd()}/package.json`);
let vtracerPromise = null;

async function ensureRuntimeFile(file, minBytes) {
  const target = join(VTRACER_DIR, file);
  try { if ((await stat(target)).size >= minBytes) return; } catch {}
  for (const base of VTRACER_CDNS) {
    try {
      const response = await fetch(`${base}/${file}`);
      if (!response.ok) continue;
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength < minBytes) continue;
      await writeFile(target, bytes);
      return;
    } catch {}
  }
  throw new Error(`VTracer runtime download failed: ${file}`);
}

async function loadVTracer() {
  if (!vtracerPromise) {
    vtracerPromise = (async () => {
      await mkdir(join(VTRACER_DIR, 'pkg'), { recursive: true });
      for (const [file, minBytes] of VTRACER_FILES) await ensureRuntimeFile(file, minBytes);
      const loaded = runtimeRequire(join(VTRACER_DIR, 'index.js'));
      const candidate = loaded.default ?? loaded;
      if (typeof candidate.convertBuffer !== 'function') throw new Error('VTracer API unavailable');
      return candidate;
    })().catch(async (err) => {
      vtracerPromise = null;
      await rm(VTRACER_DIR, { recursive: true, force: true }).catch(() => {});
      throw err;
    });
  }
  return vtracerPromise;
}

function safeText(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function gridBrief(count) {
  if (count === 4) return '2 by 2';
  if (count === 6) return '3 by 2';
  if (count === 8) return '4 by 2';
  if (count === 9) return '3 by 3';
  if (count === 12) return '4 by 3';
  return '4 by 4';
}

function buildPrompt(input) {
  const theme = safeText(input.theme, 180);
  const mode = input.mode === 'illustration' ? 'illustration' : 'icon';
  const style = safeText(input.style, 100) || 'Flat Style';
  const extra = safeText(input.extra, 500);
  const iconCount = [4,6,8,9,12,16].includes(Number(input.iconCount)) ? Number(input.iconCount) : 9;
  const base = mode === 'icon'
    ? `Create one professional vector-style icon set about ${theme}. EXACTLY ${iconCount} distinct icons in a ${gridBrief(iconCount)} grid. Every icon must clearly belong to the theme. No words, letters, numbers, labels, logos, trademarks or watermark.`
    : `Create one professional vector-style illustration about ${theme}. Make the main subject and supporting objects unmistakably relevant to the theme. No text, logos, trademarks or watermark.`;
  return `${base} Exact style: ${style}. White background for tracing. Solid flat colors only, no gradients, no shadows, no glow, no blur, no texture, no grain. Crisp smooth edges, clean geometric shapes, strong silhouettes, consistent visual language, limited controlled palette, generous spacing, stock-ready composition, easy raster-to-vector tracing. ${extra}`.slice(0, 2048);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, fluxConfigured: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) });
});

app.get('/api/status', (_req, res) => {
  res.json({
    fluxConfigured: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN),
    fluxModel: '@cf/black-forest-labs/flux-1-schnell',
    renderer: 'VTracer 1.0.0-alpha.3'
  });
});

app.post('/api/generate', async (req, res) => {
  const theme = safeText(req.body?.theme, 180);
  if (!theme) return res.status(400).json({ error: 'Theme is required' });
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return res.status(412).json({ error: 'Cloudflare FLUX credentials are not configured' });
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId.trim())}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: buildPrompt(req.body || {}), steps: 4, seed: Math.floor(Math.random() * 2147483647) })
    });
    const payload = await response.json();
    const image = payload?.result?.image;
    if (!response.ok || payload?.success === false || !image) {
      return res.status(response.status || 502).json({ error: payload?.errors?.[0]?.message || 'FLUX request failed' });
    }
    res.json({ image, mimeType: 'image/jpeg', engine: 'FLUX.1 Schnell' });
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : 'FLUX request failed' });
  }
});

app.post('/api/trace', async (req, res) => {
  const imageBase64 = safeText(req.body?.imageBase64, 7_000_000);
  if (!imageBase64) return res.status(400).json({ error: 'Image data is required' });
  try {
    const bytes = Buffer.from(imageBase64, 'base64');
    if (bytes.byteLength > 5_000_000) return res.status(413).json({ error: 'Image is too large' });
    const tracer = await loadVTracer();
    const style = safeText(req.body?.style, 80).toLowerCase();
    const mode = req.body?.mode === 'illustration' ? 'illustration' : 'icon';
    const blackWhite = style.includes('black') || style.includes('outline') || style.includes('monoline');
    const svg = tracer.convertBuffer(new Uint8Array(bytes), blackWhite ? {
      preset: 'bw', clustering: 'bw', mode: 'spline', filterSpeckle: 16, simplify: 1.25, optimize: 1, binaryThreshold: 176, maxColors: 2
    } : {
      preset: 'poster', clustering: 'color-cluster', hierarchical: 'cutout', mode: 'spline', filterSpeckle: mode === 'icon' ? 18 : 12, simplify: mode === 'icon' ? 1.45 : 1.15, pathPrecision: 2, optimize: 1, maxColors: mode === 'icon' ? 12 : 18
    });
    if (!/<svg\b/i.test(svg) || !/<path\b/i.test(svg)) throw new Error('VTracer returned invalid SVG');
    res.json({ svg, engine: 'VTracer 1.0.0-alpha.3' });
  } catch (err) {
    res.status(503).json({ error: err instanceof Error ? err.message : 'Tracing failed' });
  }
});

app.use((_req, res) => res.sendFile(join(process.cwd(), 'public', 'index.html')));
app.listen(PORT, '0.0.0.0', () => console.log(`Vectora running on ${PORT}`));
