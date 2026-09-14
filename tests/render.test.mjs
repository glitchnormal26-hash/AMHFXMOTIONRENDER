import test from 'node:test';
import assert from 'node:assert/strict';
import { captureOptions } from '../scripts/lib/capture.mjs';
import { verifyMedia } from '../scripts/lib/verify.mjs';

const expected = { width: 1280, height: 720, fps: 30, frameCount: 270, hasAudio: false };
const fixture = () => ({ format: { duration: '9' }, streams: [{ codec_type: 'video', codec_name: 'h264',
  width: 1280, height: 720, pix_fmt: 'yuv420p', avg_frame_rate: '30/1', nb_read_frames: '270' }] });
test('validates fractional FPS and rejects malformed capture dimensions', () => {
  assert.equal(captureOptions({ FPS: '29.97' }).fps, 29.97);
  for (const env of [{ FPS: 'NaN' }, { FPS: '0' }, { WIDTH: '1.5' }, { HEIGHT: '-2' }]) {
    assert.throws(() => captureOptions(env));
  }
});
test('valid stream metadata passes; incomplete or mismatched renders fail', () => {
  assert.equal(verifyMedia(fixture(), expected).duration, 9);
  for (const patch of [{ width: 1920 }, { height: 1080 }, { codec_name: 'vp9' },
    { pix_fmt: 'yuv444p' }, { avg_frame_rate: '0/0' }, { avg_frame_rate: '60/1' },
    { nb_read_frames: '269' }, { nb_read_frames: undefined }]) {
    const meta = fixture(); Object.assign(meta.streams[0], patch);
    assert.throws(() => verifyMedia(meta, expected));
  }
  for (const duration of ['NaN', '0', '8.5']) {
    const meta = fixture(); meta.format.duration = duration;
    assert.throws(() => verifyMedia(meta, expected));
  }
});
test('audio is verified whenever supplied, even without a require flag', () => {
  assert.throws(() => verifyMedia(fixture(), { ...expected, hasAudio: true }));
  const meta = fixture(); meta.streams.push({ codec_type: 'audio', codec_name: 'aac' });
  assert.equal(verifyMedia(meta, { ...expected, hasAudio: true }).audio.codec_name, 'aac');
  assert.throws(() => verifyMedia(meta, expected));
});
