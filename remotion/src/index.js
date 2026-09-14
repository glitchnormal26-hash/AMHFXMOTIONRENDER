import React, {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
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

const bootScene = async (iframe, preparedHtml) => {
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
    await new Promise((resolve, reject) => {
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
    });
  }
};

const SceneBridge = ({sceneHtml, sceneBase, sceneTimeoutMs}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iframeRef = useRef(null);
  const bootPromiseRef = useRef(null);
  const handle = useMemo(
    () => delayRender(`AMHFX OPENER frame ${frame}`),
    [frame],
  );
  const preparedHtml = useMemo(() => {
    const baseHref = sceneBase
      ? `${window.location.origin}/${String(sceneBase).replace(/^\/+/, '')}`
      : `${window.location.origin}/`;
    return injectBaseHref(sceneHtml, baseHref);
  }, [sceneBase, sceneHtml]);

  useLayoutEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    bootPromiseRef.current = bootScene(iframe, preparedHtml);
  }, [preparedHtml]);

  useEffect(() => {
    let active = true;

    const renderFrame = async () => {
      await bootPromiseRef.current;
      const iframe = iframeRef.current;
      if (!iframe) throw new Error('AMHFX scene iframe is unavailable');
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
  }, [frame, fps, handle, sceneTimeoutMs]);

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
