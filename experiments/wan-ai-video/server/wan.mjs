import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.mjs';

const TASK_PATH = '/tasks/';
const SUBMIT_PATH = '/services/aigc/video-generation/video-synthesis';

class WanError extends Error {
  constructor(message, { status, code, body } = {}) {
    super(message);
    this.name = 'WanError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

async function request(url, { method = 'GET', body, apiKey = config.apiKey } = {}) {
  if (!apiKey) {
    throw new WanError('DASHSCOPE_API_KEY belum di-set. Isi di .env atau jalankan dengan WAN_PROVIDER=mock.', {
      status: 401,
      code: 'MissingApiKey',
    });
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60_000),
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = { raw };
  }

  if (!response.ok) {
    const message = data?.message || data?.code || `HTTP ${response.status} dari Wan API`;
    throw new WanError(message, { status: response.status, code: data?.code, body: data });
  }
  return data;
}

/**
 * Buat task text-to-video. Return { taskId }.
 */
export async function submitTextToVideo({
  prompt,
  negativePrompt = '',
  size = '832*480',
  model = config.model,
  duration,
  seed,
  promptExtend = true,
  watermark = false,
  apiKey,
  baseUrl = config.baseUrl,
}) {
  const parameters = { size, prompt_extend: Boolean(promptExtend), watermark: Boolean(watermark) };
  if (Number.isFinite(duration)) parameters.duration = duration;
  if (Number.isFinite(seed)) parameters.seed = seed;

  const input = { prompt };
  if (negativePrompt) input.negative_prompt = negativePrompt;

  const data = await request(`${baseUrl}${SUBMIT_PATH}`, {
    method: 'POST',
    apiKey,
    body: { model, input, parameters },
  });

  const taskId = data?.output?.task_id;
  if (!taskId) {
    throw new WanError('Wan API tidak mengembalikan task_id.', { body: data });
  }
  return { taskId, requestId: data?.request_id, model };
}

/**
 * Cek status task. Return { status, videoUrl, error, raw }.
 * status: PENDING | RUNNING | SUCCEEDED | FAILED | CANCELED | UNKNOWN
 */
export async function fetchTask(taskId, { apiKey, baseUrl = config.baseUrl } = {}) {
  const data = await request(`${baseUrl}${TASK_PATH}${encodeURIComponent(taskId)}`, { apiKey });
  const output = data?.output || {};
  const status = String(output.task_status || 'UNKNOWN').toUpperCase();

  let error = null;
  if (status === 'FAILED' || status === 'CANCELED' || data?.code) {
    error = output.message || data?.message || `Task ${status}`;
  }

  return {
    status,
    videoUrl: output.video_url || null,
    error,
    usage: output.usage || data?.usage || null,
    raw: data,
  };
}

/**
 * Unduh hasil video ke data/videos (URL Wan hanya valid 24 jam).
 */
export async function downloadVideo(videoUrl, destWithoutExt) {
  const response = await fetch(videoUrl, { signal: AbortSignal.timeout(180_000) });
  if (!response.ok) {
    throw new WanError(`Gagal mengunduh video hasil (HTTP ${response.status}).`, { status: response.status });
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const fileName = `${path.basename(destWithoutExt)}.mp4`;
  const dest = path.join(config.videoDir, fileName);
  await fs.mkdir(config.videoDir, { recursive: true });
  await fs.writeFile(dest, buffer);
  return { fileName, bytes: buffer.length };
}

export { WanError };
