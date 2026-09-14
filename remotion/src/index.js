import React, {useLayoutEffect, useMemo, useRef} from 'react';
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

const withTimeout = async (promise, timeoutMs, label) => {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Timed out during ${label} after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};

const waitForPaint = (win) =>
  new Promise((resolve) => {
    win.requestAnimationFrame(() => win.requestAnimationFrame(resolve));
  });

const escapeAttribute = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');

const injectBaseHref = (html, baseHref) => {
  const tag = `<base href="${escapeAttribute(baseHref)}">`;
  if (/<base\b[^>]*>/i.test(html)) return html.replace(/<base\b[^>]*>/i, tag);
  const head = /<head(?:\s[^>]*)?>/i;
  if (head.test(html)) return html.replace(head, (match) => `${match}${tag}`);
  return `${tag}${html}`;
};

const isExecutableScript = (type) => {
  const normalized = String(type || '').trim().toLowerCase();
  return !normalized || normalized === 'text/javascript' || normalized === 'application/javascript' || normalized === 'module';
};

const bootScene = async (iframe, preparedHtml, timeoutMs) => {
  const win = iframe.contentWindow;
  if (!win) throw new Error('AMHFX scene window is unavailable');
  const doc = win.document;
  const parsed = new DOMParser().parseFromString(preparedHtml, 'text/html');
  const scripts = [];

  for (const node of [...parsed.querySelectorAll('script')]) {
    if (!isExecutableScript(node.getAttribute('type'))) continue;
    scripts.push({
      attrs: [...node.attributes].map((attr) => [attr.name, attr.value]),
      text: node.textContent || '',
    });
    node.remove();
  }

  doc.open();
  doc.write(`<!doctype html>${parsed.documentElement.outerHTML}`);
  doc.close();

  for (const descriptor of scripts) {
    await withTimeout(new Promise((resolve, reject) => {
      const script = doc.createElement('script');
      for (const [name, value] of descriptor.attrs) script.setAttribute(name, value);
      const src = script.getAttribute('src');
      const type = (script.getAttribute('type') || '').toLowerCase();

      if (src || type === 'module') {
        script.addEventListener('load', resolve, {once: true});
        script.addEventListener('error', () => reject(new Error(`Failed to load scene script: ${src || '[inline module]'}`)), {once: true});
      }
      if (!src) script.textContent = descriptor.text;
      (doc.body || doc.head || doc.documentElement).appendChild(script);
      if (!src && type !== 'module') resolve();
    }), timeoutMs, `scene script ${descriptor.attrs.find(([name]) => name === 'src')?.[1] || '[inline]'}`);
  }
};

const SceneBridge = ({sceneHtml, sceneBase, sceneTimeoutMs}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iframeRef = useRef(null);
  const preparedHtml = useMemo(() => {
    const baseHref = sceneBase
      ? `${window.location.origin}/${String(sceneBase).replace(/^\/+/, '')}`
      : `${window.location.origin}/`;
    return injectBaseHref(sceneHtml, baseHref);
  }, [sceneBase, sceneHtml]);

  useLayoutEffect(() => {
    let active = true;
    let cleared = false;
    const handle = delayRender(`AMHFX OPENER frame ${frame}`);
    const clearHandle = () => {
      if (cleared) return;
      cleared = true;
      try {
        continueRender(handle);
      } catch {
        // A cancelled render or renderer teardown may invalidate the handle.
      }
    };

    const renderFrame = async () => {
      const iframe = iframeRef.current;
      if (!iframe) throw new Error('AMHFX scene iframe is unavailable');
      await bootScene(iframe, preparedHtml, sceneTimeoutMs);
      if (!active) return;

      const win = iframe.contentWindow;
      if (!win) throw new Error('AMHFX scene window is unavailable');
      await waitFor(
        () => win.OPENER?.ready === true && typeof win.OPENER?.seek === 'function',
        sceneTimeoutMs,
        () => {
          let readyState = 'unknown';
          let href = 'unknown';
          try {
            readyState = win.document?.readyState || 'unknown';
            href = win.location?.href || 'unknown';
          } catch {
            // Same-origin iframe diagnostics remain best effort.
          }
          return `frame=${frame}, readyState=${readyState}, href=${href}, opener=${Boolean(win.OPENER)}, gsap=${Boolean(win.gsap)}`;
        },
      );

      await win.OPENER.seek(frame / fps);
      win.gsap?.ticker?.tick();
      await waitForPaint(win);
      if (active) clearHandle();
    };

    renderFrame().catch((error) => {
      if (!active) return;
      cleared = true;
      cancelRender(error);
    });

    return () => {
      active = false;
      clearHandle();
    };
  }, [frame, fps, preparedHtml, sceneTimeoutMs]);

  return React.createElement(
    AbsoluteFill,
    {style: {backgroundColor: '#000'}},
    React.createElement('iframe', {
      ref: iframeRef,
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
  sceneHtml: '<!doctype html><html><head></head><body></body></html>',
  sceneBase: '',
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
