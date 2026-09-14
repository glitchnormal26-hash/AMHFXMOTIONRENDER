import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('optional Remotion engine stays isolated and version-pinned', async () => {
  const root = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const remotion = JSON.parse(await fs.readFile('remotion/package.json', 'utf8'));

  assert.equal(root.dependencies.remotion, undefined);
  assert.equal(root.dependencies['@remotion/renderer'], undefined);
  assert.equal(root.scripts['render:remotion'], 'node scripts/export-remotion.mjs');
  assert.equal(root.scripts['render:ffmpeg'], 'node scripts/export-mp4.mjs');

  const expected = '4.0.524';
  assert.equal(remotion.dependencies.remotion, expected);
  assert.equal(remotion.dependencies['@remotion/renderer'], expected);
  assert.equal(remotion.dependencies['@remotion/bundler'], expected);
});

test('auto dispatcher rejects unknown engines before doing render work', async () => {
  const source = await fs.readFile('scripts/export.mjs', 'utf8');
  assert.match(source, /RENDER_ENGINE must be auto, remotion, or ffmpeg/);
  assert.match(source, /remotionReady \? 'remotion' : 'ffmpeg'/);
});

test('Remotion bridge embeds local OPENER HTML same-origin and rewrites vendor paths', async () => {
  const bridge = await fs.readFile('remotion/src/index.js', 'utf8');
  const exporter = await fs.readFile('scripts/export-remotion.mjs', 'utf8');
  assert.match(bridge, /srcDoc/);
  assert.match(bridge, /injectBaseHref/);
  assert.doesNotMatch(bridge, /src:\s*`\$\{staticFile/);
  assert.match(exporter, /amhfx-vendor\/gsap/);
  assert.match(exporter, /publicPath:\s*'\/'/);
  assert.match(exporter, /timeoutInMilliseconds:\s*remotionTimeoutMs/);
});
