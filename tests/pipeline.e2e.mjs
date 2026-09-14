import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

function run(script, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], { env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let log = '';
    child.stdout.on('data', b => log += b);
    child.stderr.on('data', b => log += b);
    child.on('error', reject);
    child.on('close', code => resolve({ code, log }));
  });
}
test('real browser/FFmpeg pipeline: streaming, frames, snapshots, failure cleanup', { timeout: 120000 }, async () => {
  await fs.mkdir('output', { recursive: true });
  const dir = await fs.mkdtemp(path.resolve('output/pipeline-test-'));
  try {
    const scene = path.join(dir, 'scene.html');
    await fs.writeFile(scene, `<!doctype html><style>body{margin:0;background:black}</style><script>
      window.OPENER={ready:true,DURATION:0.4,async seek(t){await Promise.resolve();document.body.style.background=t<0.2?'red':'blue'}};
    </script>`);
    const env = { INDEX: scene, URL: '', FPS: '10', WIDTH: '320', HEIGHT: '180',
      OUT_VIDEO: path.join(dir, 'clip.mp4'), FRAMES_DIR: path.join(dir, 'frames'),
      AUDIO: '', VOICEOVER: '', SFX: '', AMBIENCE: '', REQUIRE_AUDIO: '0', REQUIRE_VO: '0' };
    const encoded = await run('scripts/export-mp4.mjs', env);
    assert.equal(encoded.code, 0, encoded.log);
    const report = JSON.parse(await fs.readFile(path.join(dir, 'clip.verify.json')));
    assert.equal(report.frame_count, 4);
    assert.equal(report.status, 'TECHNICALLY_VERIFIED');
    assert.equal(report.playback_review, 'PENDING');
    assert.equal((await fs.readdir(report.frames_directory)).filter(f => f.endsWith('.png')).length, 4);
    const frames = await run('scripts/export-frames.mjs', { ...env, ENCODE: '0' });
    assert.equal(frames.code, 0, frames.log);
    assert.equal((await fs.readdir(env.FRAMES_DIR)).length, 2);
    const snap = await run('scripts/snap.mjs', { ...env, TIMES: '0.2', OUT: path.join(dir, 'snap') });
    assert.equal(snap.code, 0, snap.log);
    assert.deepEqual(await fs.readFile(path.join(dir, 'snap/t-0_2.png')),
      await fs.readFile(path.join(report.frames_directory, 'f000002.png')));
    const original = await fs.readFile(env.OUT_VIDEO);
    await fs.writeFile(scene, '<script>throw new Error("fixture failure")</script>');
    const failed = await run('scripts/export-mp4.mjs', { ...env, FRAMES_DIR: '', KEEP_FRAMES: '0' });
    assert.notEqual(failed.code, 0);
    assert.match(failed.log, /fixture failure/);
    assert.deepEqual(await fs.readFile(env.OUT_VIDEO), original);
    assert.equal((await fs.readdir(dir)).some(f => f.startsWith('.render-')), false);
    const missingAudio = await run('scripts/export-mp4.mjs', { ...env, AUDIO: path.join(dir, 'missing.wav') });
    assert.notEqual(missingAudio.code, 0);
    assert.match(missingAudio.log, /AUDIO file not found/);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
