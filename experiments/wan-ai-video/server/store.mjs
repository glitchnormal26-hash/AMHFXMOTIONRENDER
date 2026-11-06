import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { config } from './config.mjs';

const MAX_JOBS = 200;

export class JobStore {
  constructor({ file = config.jobsFile, max = MAX_JOBS } = {}) {
    this.file = file;
    this.max = max;
    this.jobs = new Map();
    this.timer = null;
    this.ready = this.load();
  }

  async load() {
    try {
      const raw = await fs.readFile(this.file, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const job of parsed) {
          // Task yang masih jalan saat server mati tidak bisa dilanjutkan.
          if (job.state === 'queued' || job.state === 'running') {
            job.state = 'failed';
            job.error = job.error || 'Server restart saat task masih berjalan.';
          }
          this.jobs.set(job.id, job);
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`[store] gagal baca ${this.file}: ${error.message}`);
      }
    }
    return this;
  }

  async save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 250);
  }

  async flush() {
    const list = this.list();
    try {
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      await fs.writeFile(this.file, JSON.stringify(list, null, 2));
    } catch (error) {
      console.warn(`[store] gagal simpan ${this.file}: ${error.message}`);
    }
  }

  create(data) {
    const now = new Date().toISOString();
    const job = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      state: 'queued',
      progress: 3,
      provider: config.provider,
      model: config.model,
      prompt: '',
      negativePrompt: '',
      size: '832*480',
      duration: 5,
      seed: null,
      promptExtend: true,
      watermark: false,
      taskId: null,
      remoteUrl: null,
      videoUrl: null,
      fileName: null,
      bytes: null,
      error: null,
      demo: false,
      ...data,
    };
    this.jobs.set(job.id, job);
    this.trim();
    this.save();
    return job;
  }

  update(id, patch) {
    const job = this.jobs.get(id);
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    this.save();
    return job;
  }

  get(id) {
    return this.jobs.get(id) || null;
  }

  list() {
    return [...this.jobs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  remove(id) {
    const job = this.jobs.get(id);
    if (!job) return null;
    this.jobs.delete(id);
    this.save();
    return job;
  }

  trim() {
    const all = this.list();
    for (const job of all.slice(this.max)) {
      this.jobs.delete(job.id);
    }
  }
}
