/**
 * Smoke test tanpa API key: jalankan server dalam mode mock, buat job,
 * tunggu sampai sukses, cek file hasilnya ada.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'wan-smoke-'));
process.env.WAN_PROVIDER = 'mock';
process.env.DATA_DIR = tmp;
process.env.PORT = '0';
process.env.MOCK_DURATION_MS = '600';

const { server, store } = await import('../server/index.mjs');
await store.ready;
await new Promise((resolve) => (server.listening ? resolve() : server.once('listening', resolve)));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

const fail = async (message) => {
  console.error(`✗ ${message}`);
  server.close();
  process.exit(1);
};

const health = await fetch(`${base}/api/health`).then((r) => r.json());
if (health.provider !== 'mock') await fail(`provider harus mock, dapat ${health.provider}`);

const created = await fetch(`${base}/api/jobs`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Uji coba text to video: ombak di pantai saat matahari terbenam.', size: '832*480', duration: 5 }),
}).then((r) => r.json());

if (!created?.job?.id) await fail(`gagal membuat job: ${JSON.stringify(created)}`);

let job = created.job;
const deadline = Date.now() + 30_000;
while (job.state !== 'succeeded' && job.state !== 'failed' && Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 400));
  job = (await fetch(`${base}/api/jobs/${job.id}`).then((r) => r.json())).job;
}

if (job.state !== 'succeeded') await fail(`job berakhir dengan state ${job.state}: ${job.error || ''}`);
if (!job.videoUrl) await fail('job sukses tapi tanpa videoUrl');

const file = path.join(tmp, 'videos', job.fileName);
const stat = await fs.stat(file).catch(() => null);
if (!stat || stat.size === 0) await fail(`file hasil tidak ada / kosong: ${file}`);

const list = await fetch(`${base}/api/jobs`).then((r) => r.json());
if (!list.jobs.some((item) => item.id === job.id)) await fail('job tidak muncul di daftar');

console.log(`✓ smoke ok — ${path.basename(file)} (${stat.size} bytes, demo=${Boolean(job.demo)})`);

server.close();
await fs.rm(tmp, { recursive: true, force: true });
process.exit(0);
