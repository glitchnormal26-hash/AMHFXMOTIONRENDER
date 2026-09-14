import React, {useEffect, useMemo, useRef} from 'react';
import {
  AbsoluteFill,
  Composition,
  cancelRender,
  continueRender,
  delayRender,
  registerRoot,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const DEFAULT_TIMEOUT_MS = 30000;

const waitFor = async (predicate, timeoutMs, describe) => {
  const started = performance.now();
  while (!predicate()) {
    if (performance.now() - started > timeoutMs) {
      const detail = typeof describe === 'function' ? describe() : '';
      throw new Error(`Timed out waiting for OPENER after ${timeoutMs}ms${detail ? ` (${detail})` : ''}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};

const waitForPaint = (win) =>
  new Promise((resolve) => {
    win.requestAnimationFrame(() => win.requestAnimationFrame(resolve));
  });

const SceneBridge = ({sceneFile, sceneTimeoutMs}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iframeRef = useRef(null);
  const handle = useMemo(
    () => delayRender(`AMHFX OPENER frame ${frame}`),
    [frame],
  );
  const sceneUrl = useMemo(() => {
    const normalized = String(sceneFile || '').replace(/^\/+/, '');
    return `${window.location.origin}/${normalized}?clean=1`;
  }, [sceneFile]);

  useEffect(() => {
    let active = true;

    const renderFrame = async () => {
      const iframe = iframeRef.current;
      if (!iframe) throw new Error('AMHFX scene iframe is unavailable');
      const win = iframe.contentWindow;
      if (!win) throw new Error('AMHFX scene window is unavailable');

      await waitFor(
        () => win.OPENER?.ready === true && typeof win.OPENER?.seek === 'function',
        sceneTimeoutMs,
        () => {
          let readyState = 'unknown';
          let href = sceneUrl;
          try {
            readyState = win.document?.readyState || 'unknown';
            href = win.location?.href || sceneUrl;
          } catch {
            // Same-origin is required; the diagnostic falls back to the requested URL.
          }
          return `frame=${frame}, readyState=${readyState}, href=${href}, opener=${Boolean(win.OPENER)}, gsap=${Boolean(win.gsap)}`;
        },
      );

      await win.OPENER.seek(frame / fps);
      win.gsap?.ticker?.tick();
      await waitForPaint(win);

      if (active) continueRender(handle);
    };

    renderFrame().catch((error) => {
      if (active) cancelRender(error);
    });

    return () => {
      active = false;
      try {
        continueRender(handle);
      } catch {
        // The handle may already have been continued for the captured frame.
      }
    };
  }, [frame, fps, handle, sceneTimeoutMs, sceneUrl]);

  return React.createElement(
    AbsoluteFill,
    {style: {backgroundColor: '#000'}},
    React.createElement('iframe', {
      ref: iframeRef,
      src: sceneUrl,
      title: 'AMHFX scene',
      style: {
        width: '100%',
        height: '100%',
        border: 0,
        display: 'block',
        background: '#000',
      },
    }),
  );
};

const defaults = {
  sceneFile: 'amhfx-scene/index.html',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 270,
  sceneTimeoutMs: DEFAULT_TIMEOUT_MS,
};

const calculateMetadata = ({props}) => ({
  width: props.width,
  height: props.height,
  fps: props.fps,
  durationInFrames: props.durationInFrames,
  props,
  defaultCodec: 'h264',
  defaultPixelFormat: 'yuv420p',
});

const Root = () =>
  React.createElement(Composition, {
    id: 'AMHFXBridge',
    component: SceneBridge,
    width: defaults.width,
    height: defaults.height,
    fps: defaults.fps,
    durationInFrames: defaults.durationInFrames,
    defaultProps: defaults,
    calculateMetadata,
  });

registerRoot(Root);
