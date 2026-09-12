#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {spawn, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const loopbackHosts = new Set(['127.0.0.1', 'localhost', '::1']);
const writeEnabled = loopbackHosts.has(host) || process.env.ALLOW_REMOTE_WRITE === '1';
const scenePath = path.join(root, 'motra-output', 'index.html');
const jobs = new Map();
let activeJobId = null;

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'], ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'], ['.json', 'application/json; charset=utf-8'], ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.webp', 'image/webp'], ['.mp4', 'video/mp4'],
  ['.wav', 'audio/wav'], ['.mp3', 'audio/mpeg'], ['.woff2', 'font/woff2']
]);

function commandExists(cmd) {
  const r = spawnSync(cmd, ['-version'], {stdio: 'ignore'});
  return r.status === 0;
}

function engineStatus() {
  const ffmpeg = commandExists('ffmpeg');
  const ffprobe = commandExists('ffprobe');
  const gsap = fs.existsSync(path.join(root, 'node_modules', 'gsap', 'dist', 'gsap.min.js'));
  const puppeteer = fs.existsSync(path.join(root, 'node_modules', 'puppeteer'));
  return {
    ready: ffmpeg && ffprobe && gsap && puppeteer,
    ffmpeg, ffprobe, gsap, puppeteer,
    writeEnabled,
    host,
    version: 'motra-studio-web/1'
  };
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function fail(res, status, message) { json(res, status, {error: message}); }

async function readJson(req, limit = 2_500_000) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('Request body too large');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function validateScene(html) {
  if (typeof html !== 'string' || html.length < 200) return 'Scene HTML is empty or too small';
  if (html.length > 2_000_000) return 'Scene HTML exceeds 2 MB';
  if (!html.includes('window.OPENER')) return 'Scene must expose window.OPENER';
  if (!html.includes('DURATION')) return 'Scene must define DURATION';
  return null;
}

function dimensions(format) {
  if (format === '9:16') return {width: 1080, height: 1920};
  if (format === '1:1') return {width: 1080, height: 1080};
  return {width: 1920, height: 1080};
}

function appendLog(job, chunk) {
  const text = String(chunk).replace(/\r/g, '\n');
  for (const line of text.split('\n')) if (line.trim()) job.logs.push(line.trimEnd());
  if (job.logs.length > 180) job.logs.splice(0, job.logs.length - 180);
}

async function startRender({quality, format}) {
  if (activeJobId) throw new Error('A render is already running');
  if (!fs.existsSync(scenePath)) throw new Error('No saved scene. Save the scene first.');
  const normalizedQuality = quality === 'final' ? 'final' : 'fast';
  const {width, height} = dimensions(format);
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const fileName = `motra-${id}-${normalizedQuality}.mp4`;
  const outPath = path.join(root, 'motra-output', fileName);
  const job = {id, status: 'running', quality: normalizedQuality, format: format || '16:9', logs: [], url: null, startedAt: new Date().toISOString(), finishedAt: null};
  jobs.set(id, job);
  activeJobId = id;

  const child = spawn(process.execPath, ['scripts/export-mp4.mjs'], {
    cwd: root,
    env: {
      ...process.env,
      INDEX: scenePath,
      OUT_VIDEO: outPath,
      QUALITY: normalizedQuality,
      WIDTH: String(width),
      HEIGHT: String(height)
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', chunk => appendLog(job, chunk));
  child.stderr.on('data', chunk => appendLog(job, chunk));
  child.on('error', error => {
    appendLog(job, error.stack || error.message);
    job.status = 'error';
    job.finishedAt = new Date().toISOString();
    activeJobId = null;
  });
  child.on('close', code => {
    if (job.status === 'error') return;
    job.finishedAt = new Date().toISOString();
    if (code === 0 && fs.existsSync(outPath)) {
      job.status = 'done';
      job.url = `/motra-output/${encodeURIComponent(fileName)}`;
      appendLog(job, `Render complete: motra-output/${fileName}`);
    } else {
      job.status = 'error';
      appendLog(job, `Renderer exited with code ${code}`);
    }
    activeJobId = null;
  });
  return job;
}

async function sendFile(req, res, target) {
  const stat = await fsp.stat(target);
  if (stat.isDirectory()) return sendFile(req, res, path.join(target, 'index.html'));
  const type = mime.get(path.extname(target).toLowerCase()) || 'application/octet-stream';
  const range = req.headers.range;
  if (range && type === 'video/mp4') {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (Number.isFinite(start) && Number.isFinite(end) && start <= end && end < stat.size) {
        res.writeHead(206, {
          'Content-Type': type,
          'Content-Length': end - start + 1,
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-store'
        });
        fs.createReadStream(target, {start, end}).pipe(res);
        return;
      }
    }
  }
  res.writeHead(200, {'Content-Type': type, 'Content-Length': stat.size, 'Cache-Control': 'no-store'});
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === '/api/status' && req.method === 'GET') return json(res, 200, engineStatus());

    if (pathname === '/api/scene' && req.method === 'POST') {
      if (!writeEnabled) return fail(res, 403, 'Remote write/render is disabled. Bind to localhost or set ALLOW_REMOTE_WRITE=1 behind your own authentication.');
      const body = await readJson(req);
      const error = validateScene(body.html);
      if (error) return fail(res, 400, error);
      await fsp.mkdir(path.dirname(scenePath), {recursive: true});
      await fsp.writeFile(scenePath, body.html, 'utf8');
      return json(res, 200, {ok: true, path: 'motra-output/index.html'});
    }

    if (pathname === '/api/render' && req.method === 'POST') {
      if (!writeEnabled) return fail(res, 403, 'Remote rendering is disabled.');
      const status = engineStatus();
      if (!status.ready) return fail(res, 503, 'Renderer dependencies are not ready. Run npm ci and install ffmpeg/ffprobe.');
      const body = await readJson(req, 100_000);
      try {
        const job = await startRender({quality: body.quality, format: body.format});
        return json(res, 202, {id: job.id, status: job.status});
      } catch (error) {
        return fail(res, error.message.includes('already running') ? 409 : 400, error.message);
      }
    }

    const jobMatch = /^\/api\/render\/([a-z0-9-]+)$/i.exec(pathname);
    if (jobMatch && req.method === 'GET') {
      const job = jobs.get(jobMatch[1]);
      if (!job) return fail(res, 404, 'Unknown render job');
      return json(res, 200, job);
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') return fail(res, 405, 'Method not allowed');
    if (pathname === '/') {
      res.writeHead(302, {Location: '/studio/'});
      return res.end();
    }

    const relative = pathname.replace(/^\/+/, '');
    let target = path.resolve(root, relative);
    if (!(target === root || target.startsWith(root + path.sep))) return fail(res, 403, 'Forbidden');
    if (!fs.existsSync(target)) return fail(res, 404, 'Not found');
    if (req.method === 'HEAD') {
      const stat = await fsp.stat(target);
      res.writeHead(200, {'Content-Length': stat.size, 'Cache-Control': 'no-store'});
      return res.end();
    }
    return sendFile(req, res, target);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) return fail(res, 500, error.message || 'Internal server error');
    res.end();
  }
});

server.listen(port, host, () => {
  const status = engineStatus();
  console.log(`Motra Studio: http://${host}:${port}/studio/`);
  console.log(`Renderer ready: ${status.ready ? 'yes' : 'no'} (ffmpeg=${status.ffmpeg}, ffprobe=${status.ffprobe}, gsap=${status.gsap}, puppeteer=${status.puppeteer})`);
  if (!writeEnabled) console.warn('Write/render APIs are disabled for non-loopback hosting. Set ALLOW_REMOTE_WRITE=1 only behind authentication and isolation.');
});
