export function verifyMedia(meta, { width, height, fps, frameCount, hasAudio }) {
  const video = meta.streams?.find(s => s.codec_type === 'video');
  const audio = meta.streams?.find(s => s.codec_type === 'audio') || null;
  const [n, d] = (video?.avg_frame_rate || '').split('/').map(Number);
  if (video?.codec_name !== 'h264' || video.width !== width || video.height !== height ||
      video.pix_fmt !== 'yuv420p' || Math.abs(n / d - fps) > 0.001 || !Number.isFinite(n / d) ||
      Number(video.nb_read_frames) !== frameCount) {
    throw new Error('Encoded video does not match codec, dimensions, pixel format, FPS or frame count');
  }
  const duration = Number(meta.format?.duration);
  if (!Number.isFinite(duration) || Math.abs(duration - frameCount / fps) > Math.max(1 / fps, 0.1)) {
    throw new Error('Encoded duration does not match the captured timeline');
  }
  if (hasAudio ? audio?.codec_name !== 'aac' : audio !== null) {
    throw new Error('Encoded audio does not match the requested sources');
  }
  return { video, audio, duration };
}
