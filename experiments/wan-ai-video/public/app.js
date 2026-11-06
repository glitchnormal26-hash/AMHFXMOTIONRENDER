const el = (id) => document.getElementById(id);

const state = {
  config: null,
  jobs: new Map(),
  pollTimer: null,
  busy: false,
};

const POLL_MS = 3000;

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.round(hours / 24)} hari lalu`;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

function setStatus(text, tone = '') {
  el('status-text').textContent = text;
  el('status-pill').className = `status ${tone}`;
}

async function loadConfig() {
  const cfg = await api('/api/config');
  state.config = cfg;

  el('model').innerHTML = cfg.models
    .map((m) => `<option value="${m.id}"${m.id === cfg.model ? ' selected' : ''}>${m.label}</option>`)
    .join('');

  el('size').innerHTML = cfg.resolutions
    .map((r) => `<option value="${r.id}">${r.label}</option>`)
    .join('');

  el('duration').innerHTML = cfg.durations.map((d) => `<option value="${d}">${d} detik</option>`).join('');

  if (cfg.provider === 'mock') {
    el('demo-banner').hidden = false;
    setStatus('mode demo', 'warn');
  } else if (!cfg.hasKey) {
    el('demo-banner').hidden = false;
    el('demo-banner').innerHTML =
      '<strong>API key kosong.</strong> Isi <code>DASHSCOPE_API_KEY</code> di <code>.env</code> lalu restart server.';
    setStatus('tanpa API key', 'warn');
  } else {
    el('demo-banner').hidden = true;
    setStatus(`Wan · ${cfg.model}`, 'ok');
  }
}

function jobCard(job) {
  const template = el('job-template').content.firstElementChild.cloneNode(true);
  template.dataset.id = job.id;
  template.querySelector('.delete').addEventListener('click', () => deleteJob(job.id, template));
  template.querySelector('.retry').addEventListener('click', () => retryJob(job.id));
  return template;
}

function updateCard(card, job) {
  const badge = card.querySelector('.badge');
  badge.textContent = job.state;
  badge.className = `badge ${job.state}`;

  const bits = [job.model, job.size.replace('*', '×'), `${job.duration}s`, timeAgo(job.createdAt)];
  if (job.demo) bits.push('demo');
  card.querySelector('.job-meta').textContent = bits.join(' · ');

  card.querySelector('.job-prompt').textContent = job.prompt;
  card.querySelector('.progress .bar').style.width = `${job.state === 'succeeded' ? 100 : job.progress || 0}%`;

  const error = card.querySelector('.job-error');
  error.hidden = !job.error;
  error.textContent = job.error || '';

  const media = card.querySelector('.job-media');
  const video = card.querySelector('video');
  const image = card.querySelector('img');

  if (job.state === 'succeeded' && job.videoUrl) {
    const isSvg = job.videoUrl.endsWith('.svg');
    if (isSvg) {
      video.hidden = true;
      image.hidden = false;
      if (image.getAttribute('src') !== job.videoUrl) image.src = job.videoUrl;
      image.alt = job.prompt;
    } else {
      image.hidden = true;
      video.hidden = false;
      if (video.getAttribute('src') !== job.videoUrl) {
        video.src = job.videoUrl;
        video.poster = '';
      }
    }
    media.hidden = false;
  } else {
    media.hidden = true;
  }

  const download = card.querySelector('.download');
  download.hidden = !(job.state === 'succeeded' && job.videoUrl);
  download.href = job.videoUrl || '#';
  download.setAttribute('download', job.fileName || `wan-${job.id}.mp4`);

  const remote = card.querySelector('.remote');
  remote.hidden = !job.remoteUrl;
  remote.href = job.remoteUrl || '#';

  card.querySelector('.retry').hidden = !(job.state === 'failed' && !job.taskId);
}

function renderJobs(list) {
  const container = el('jobs');
  const empty = el('empty-state');
  empty.hidden = list.length > 0;

  const seen = new Set();
  for (const job of list) {
    seen.add(job.id);
    let card = container.querySelector(`.job[data-id="${job.id}"]`);
    if (!card) {
      card = jobCard(job);
      container.prepend(card);
    }
    updateCard(card, job);
    state.jobs.set(job.id, job);
  }

  for (const card of [...container.querySelectorAll('.job')]) {
    if (!seen.has(card.dataset.id)) card.remove();
  }
}

async function refresh() {
  try {
    const { jobs } = await api('/api/jobs');
    renderJobs(jobs);
    const active = jobs.some((job) => job.state === 'queued' || job.state === 'running');
    if (active && !state.pollTimer) {
      state.pollTimer = setInterval(refresh, POLL_MS);
    } else if (!active && state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  } catch (error) {
    setStatus(`offline: ${error.message}`, 'warn');
  }
}

async function deleteJob(id, card) {
  if (!confirm('Hapus video ini dari riwayat?')) return;
  try {
    await api(`/api/jobs/${id}`, { method: 'DELETE' });
    card.remove();
    state.jobs.delete(id);
  } catch (error) {
    alert(error.message);
  }
}

async function retryJob(id) {
  try {
    await api(`/api/jobs/${id}/retry`, { method: 'POST' });
    refresh();
  } catch (error) {
    alert(error.message);
  }
}

async function submit(event) {
  event.preventDefault();
  if (state.busy) return;

  const prompt = el('prompt').value.trim();
  if (!prompt) return;

  const button = el('submit-btn');
  const hint = el('form-hint');
  state.busy = true;
  button.disabled = true;
  button.querySelector('.spinner').hidden = false;
  button.querySelector('.btn-label').textContent = 'Mengirim ke Wan…';
  hint.classList.remove('bad');
  hint.textContent = 'Mengirim task…';

  try {
    const payload = {
      prompt,
      negativePrompt: el('negativePrompt').value.trim(),
      model: el('model').value,
      size: el('size').value,
      duration: Number(el('duration').value),
      seed: el('seed').value ? Number(el('seed').value) : undefined,
      promptExtend: el('promptExtend').checked,
      watermark: el('watermark').checked,
    };
    const { job } = await api('/api/jobs', { method: 'POST', body: JSON.stringify(payload) });
    hint.textContent =
      state.config?.provider === 'mock'
        ? 'Mode demo: hasil muncul dalam beberapa detik.'
        : 'Task terkirim. Render Wan biasanya 1–5 menit — biarkan tab ini terbuka.';
    if (job) {
      renderJobs([job, ...state.jobs.values()]);
    }
    refresh();
  } catch (error) {
    hint.classList.add('bad');
    hint.textContent = error.message;
  } finally {
    state.busy = false;
    button.disabled = false;
    button.querySelector('.spinner').hidden = true;
    button.querySelector('.btn-label').textContent = 'Generate video';
  }
}

function init() {
  el('generate-form').addEventListener('submit', submit);
  el('refresh-btn').addEventListener('click', refresh);

  el('prompt').addEventListener('input', (event) => {
    el('prompt-count').textContent = `${event.target.value.length}/2000`;
  });

  el('chips').addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    el('prompt').value = chip.dataset.prompt;
    el('prompt').dispatchEvent(new Event('input'));
    el('prompt').focus();
  });

  loadConfig().catch((error) => setStatus(`gagal: ${error.message}`, 'warn'));
  refresh();
}

init();
