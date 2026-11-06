import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config, MODELS, RESOLUTIONS, DURATIONS, publicConfig } from './config.mjs';
import { JobStore } from './store.mjs';
import { submitTextToVideo, fetchTask, downloadVideo, WanError } from './wan.mjs';
import { startMockJob } from './mock.mjs';

const app = express();
const store = new JobStore();

app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));
app.use(express.static(config.publicDir, { extensions: ['html'] }));

async function ensureDirs() {
  await fs.mkdir(config.videoDir, { recursive: true });
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    provider: config.provider,
    model: config.model,
    hasKey: Boolean(config.apiKey),
    versions: process.version,
  });
});

app.get('/api/config', (req, res) => {
  res.json(publicConfig());
});

app.get('/api/jobs', (req, res) => {
  res.json({ jobs: store.list() });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = store.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job tidak ditemukan.' });
  res.json({ job });
});

app.post('/api/jobs', async (req, res) => {
  const body = req.body || {};
  const prompt = String(body.prompt || '').trim();

  if (!prompt) return res.status(400).json({ error: 'Prompt wajib diisi.' });
  if (prompt.length > 2000) return res.status(400).json({ error: 'Prompt maksimal 2000 karakter.' });

  const model = MODELS.some((m) => m.id === body.model) ? body.model : config.model;
  const size = RESOLUTIONS.some((r) => r.id === body.size) ? body.size : '832*480';
  const duration = DURATIONS.includes(Number(body.duration)) ? Number(body.duration) : 5;
  const seedValue = Number.parseInt(body.seed, 10);

  const job = store.create({
    prompt,
    negativePrompt: String(body.negativePrompt || '').trim(),
    model,
    size,
    duration,
    seed: Number.isFinite(seedValue) ? seedValue : null,
    promptExtend: body.promptExtend !== false,
    watermark: Boolean(body.watermark),
    provider: config.provider,
    progress: 5,
  });

  if (config.provider === 'mock') {
    startMockJob(store, job);
    return res.status(202).json({ job: store.get(job.id) });
  }

  try {
    const { taskId } = await submitTextToVideo({
      prompt: job.prompt,
      negativePrompt: job.negativePrompt,
      size: job.size,
      model: job.model,
      duration: job.duration,
      seed: job.seed,
      promptExtend: job.promptExtend,
      watermark: job.watermark,
    });
    const updated = store.update(job.id, { taskId, state: 'running', progress: 10 });
    res.status(202).json({ job: updated });
  } catch (error) {
    const message = error instanceof WanError ? error.message : `Gagal kirim task: ${error.message}`;
    const failed = store.update(job.id, { state: 'failed', progress: 0, error: message });
    res.status(error.status && error.status < 500 ? error.status : 502).json({ job: failed, error: message });
  }
});

app.post('/api/jobs/:id/retry', async (req, res) => {
  const job = store.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job tidak ditemukan.' });

  store.update(job.id, { state: 'queued', progress: 3, error: null, taskId: null, videoUrl: null, fileName: null });

  if (config.provider === 'mock') {
    startMockJob(store, store.get(job.id));
    return res.status(202).json({ job: store.get(job.id) });
  }

  try {
    const { taskId } = await submitTextToVideo({
      prompt: job.prompt,
      negativePrompt: job.negativePrompt,
      size: job.size,
      model: job.model,
      duration: job.duration,
      seed: job.seed,
      promptExtend: job.promptExtend,
      watermark: job.watermark,
    });
    res.status(202).json({ job: store.update(job.id, { taskId, state: 'running', progress: 10 }) });
  } catch (error) {
    res.status(502).json({ job: store.update(job.id, { state: 'failed', error: error.message }) });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  const job = store.remove(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job tidak ditemukan.' });
  if (job.fileName) {
    await fs.rm(path.join(config.videoDir, path.basename(job.fileName)), { force: true });
  }
  res.json({ ok: true });
});

app.use('/videos', express.static(config.videoDir, { maxAge: '1h', fallthrough: false }));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint tidak ada.' });
  res.sendFile(path.join(config.publicDir, 'index.html'));
});

app.use((error, req, res, next) => {
  console.error('[server]', error);
  if (res.headersSent) return next(error);
  res.status(500).json({ error: error.message || 'Internal error' });
});

/**
 * Poller: cek status task Wan yang masih jalan.
 */
async function pollJobs() {
  if (config.provider === 'mock') return;
  const active = store.list().filter((job) => job.taskId && (job.state === 'queued' || job.state === 'running'));
  if (!active.length) return;

  for (const job of active) {
    try {
      const result = await fetchTask(job.taskId);

      if (result.status === 'SUCCEEDED' && result.videoUrl) {
        let local = { fileName: null, bytes: null };
        if (config.downloadVideos) {
          try {
            local = await downloadVideo(result.videoUrl, job.id);
          } catch (error) {
            console.warn(`[poller] gagal unduh ${job.id}: ${error.message}`);
          }
        }
        store.update(job.id, {
          state: 'succeeded',
          progress: 100,
          remoteUrl: result.videoUrl,
          fileName: local.fileName,
          bytes: local.bytes,
          videoUrl: local.fileName ? `/videos/${local.fileName}` : result.videoUrl,
          usage: result.usage,
          error: null,
        });
        continue;
      }

      if (result.status === 'FAILED' || result.status === 'CANCELED' || result.status === 'UNKNOWN') {
        store.update(job.id, {
          state: 'failed',
          progress: 0,
          error: result.error || `Task ${result.status}`,
        });
        continue;
      }

      // Wan tidak memberi persentase; estimasi dari durasi berjalan, maksimal 92%.
      const elapsed = Date.now() - new Date(job.createdAt).getTime();
      const estimate = Math.min(92, Math.max(12, Math.round((elapsed / 90_000) * 92)));
      store.update(job.id, {
        state: 'running',
        progress: Math.max(job.progress || 0, estimate),
      });
    } catch (error) {
      const fatal = error instanceof WanError && error.status && error.status >= 400 && error.status < 500 && error.status !== 429;
      console.warn(`[poller] ${job.id}: ${error.message}`);
      if (fatal) {
        store.update(job.id, { state: 'failed', progress: 0, error: error.message });
      }
    }
  }
}

const server = app.listen(config.port, '0.0.0.0', async () => {
  await ensureDirs();
  await store.ready;
  const mode = config.provider === 'mock' ? 'MODE DEMO (tanpa API key)' : `Wan API → ${config.baseUrl}`;
  console.log(`wan-ai-video jalan di http://0.0.0.0:${config.port}  •  ${mode}  •  model: ${config.model}`);
  if (config.provider === 'dashscope' && !config.apiKey) {
    console.warn('DASHSCOPE_API_KEY kosong — permintaan akan gagal sampai key diisi di .env');
  }
});

const poller = setInterval(pollJobs, config.pollIntervalMs);

function shutdown(signal) {
  console.log(`\n[server] ${signal} diterima, menutup...`);
  clearInterval(poller);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export { app, server, store };
