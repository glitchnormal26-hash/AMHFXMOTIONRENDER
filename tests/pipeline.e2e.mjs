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
    // A short 4K clip catches memory/codec regressions without a full production render.
    const fourK = await run('scripts/export-mp4.mjs', { ...env, FPS: '30', WIDTH: '3840', HEIGHT: '2160',
      QUALITY: 'final', FRAMES_DIR: '', KEEP_FRAMES: '0', OUT_VIDEO: path.join(dir, '4k.mp4') });
    assert.equal(fourK.code, 0, fourK.log);
    const high = JSON.parse(await fs.readFile(path.join(dir, '4k.verify.json')));
    assert.equal(high.frame_count, 12);
    assert.equal(high.video.width, 3840);
    assert.equal(high.video.height, 2160);
    assert.equal(high.frames_directory, null);
    console.log(`4K smoke: ${high.elapsed_seconds.toFixed(2)}s for ${high.frame_count} frames`);

    // Silent PCM is a technical mux fixture, not a generated creative audio asset.
    const wav = Buffer.alloc(44 + 4800 * 2);
    wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(48000, 24); wav.writeUInt32LE(96000, 28);
    wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
    wav.write('data', 36); wav.writeUInt32LE(wav.length - 44, 40);
    const audio = path.join(dir, 'silence.wav');
    await fs.writeFile(audio, wav);
    // Exercise mixed tracks, explicit zero gain and padding a short source.
    const mixed = await run('scripts/export-frames.mjs', { ...env, ENCODE: '1',
      VOICEOVER: audio, SFX: audio, SFX_GAIN: '0', REQUIRE_AUDIO: '1', REQUIRE_VO: '1',
      OUT_VIDEO: path.join(dir, 'audio.mp4') });
    assert.equal(mixed.code, 0, mixed.log);
    const mux = JSON.parse(await fs.readFile(path.join(dir, 'audio.verify.json')));
    assert.equal(mux.audio.codec_name, 'aac');
    assert.equal(mux.frame_count, 4);
    assert.ok(Math.abs(mux.duration - 0.4) < 0.1);

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
