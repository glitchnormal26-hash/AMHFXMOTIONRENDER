import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const bool = (value, fallback = true) => {
  if (value === undefined) return fallback;
  return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase());
};

const apiKey = process.env.DASHSCOPE_API_KEY || '';
const requestedProvider = (process.env.WAN_PROVIDER || '').toLowerCase();

const provider = requestedProvider || (apiKey ? 'dashscope' : 'mock');

export const config = {
  root,
  port: Number(process.env.PORT || 3000),
  provider,
  apiKey,
  baseUrl: (process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com/api/v1').replace(/\/+$/, ''),
  model: process.env.WAN_MODEL || 'wan2.2-t2v-plus',
  downloadVideos: bool(process.env.DOWNLOAD_VIDEOS, true),
  pollIntervalMs: Math.max(2000, Number(process.env.POLL_INTERVAL_MS || 5000)),
  dataDir: process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(root, 'data'),
  videoDir: null,
  publicDir: path.join(root, 'public'),
};

config.videoDir = path.join(config.dataDir, 'videos');
config.jobsFile = path.join(config.dataDir, 'jobs.json');

/** Model yang punya endpoint text-to-video di Model Studio. Bisa diubah bebas. */
export const MODELS = [
  { id: 'wan2.2-t2v-plus', label: 'Wan 2.2 T2V Plus (default, 480P/1080P)' },
  { id: 'wan2.2-t2v-flash', label: 'Wan 2.2 T2V Flash (cepat & murah)' },
  { id: 'wan2.1-t2v-plus', label: 'Wan 2.1 T2V Plus (720P)' },
  { id: 'wan2.1-t2v-turbo', label: 'Wan 2.1 T2V Turbo (720P, tercepat)' },
];

/** Ukuran yang didukung Wan. value dikirim apa adanya ke parameter `size`. */
export const RESOLUTIONS = [
  { id: '832*480', label: '480P Landscape 16:9', width: 832, height: 480 },
  { id: '480*832', label: '480P Portrait 9:16', width: 480, height: 832 },
  { id: '624*624', label: '480P Square 1:1', width: 624, height: 624 },
  { id: '1280*720', label: '720P Landscape 16:9', width: 1280, height: 720 },
  { id: '720*1280', label: '720P Portrait 9:16', width: 720, height: 1280 },
  { id: '960*960', label: '720P Square 1:1', width: 960, height: 960 },
  { id: '1920*1080', label: '1080P Landscape 16:9', width: 1920, height: 1080 },
  { id: '1080*1920', label: '1080P Portrait 9:16', width: 1080, height: 1920 },
];

export const DURATIONS = [5, 10];

export function publicConfig() {
  return {
    provider: config.provider,
    model: config.model,
    models: MODELS,
    resolutions: RESOLUTIONS,
    durations: DURATIONS,
    hasKey: Boolean(config.apiKey),
    downloadVideos: config.downloadVideos,
    baseUrl: config.baseUrl,
  };
}
