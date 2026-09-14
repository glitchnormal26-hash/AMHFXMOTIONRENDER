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

test('Remotion bridge boots OPENER with srcDoc and an absolute same-origin base', async () => {
  const bridge = await fs.readFile('remotion/src/index.js', 'utf8');
  const exporter = await fs.readFile('scripts/export-remotion.mjs', 'utf8');

  assert.match(bridge, /srcDoc:\s*preparedHtml/);
  assert.match(bridge, /injectBaseHref/);
  assert.match(bridge, /window\.location\.origin/);
  assert.doesNotMatch(bridge, /history\.replaceState/);
  assert.doesNotMatch(bridge, /doc\.open\(\)/);
  assert.doesNotMatch(bridge, /src:\s*sceneUrl/);
  assert.match(bridge, /readyState=.*opener=.*gsap=/s);

  assert.match(exporter, /sceneHtml,\n\s*sceneBase,\n\s*width/);
  assert.match(exporter, /amhfx-scene\/index\.html/);
  assert.match(exporter, /timeoutInMilliseconds:\s*remotionTimeoutMs/);
});

test('Remotion resolves async Puppeteer executable paths before renderer startup', async () => {
  const exporter = await fs.readFile('scripts/export-remotion.mjs', 'utf8');
  assert.match(exporter, /await Promise\.resolve\(puppeteer\.executablePath\(\)\)/);
  assert.match(exporter, /Puppeteer browser executable not found/);
  assert.match(exporter, /fs\.existsSync\(browserExecutable\)/);
});

test('Remotion bundle cache is source-keyed and scene assets are materialized after bundling', async () => {
  const exporter = await fs.readFile('scripts/export-remotion.mjs', 'utf8');
  const gitignore = await fs.readFile('.gitignore', 'utf8');

  assert.match(exporter, /function bundleKey\(\)/);
  assert.match(exporter, /Remotion bundle cache hit/);
  assert.match(exporter, /materializeServeDir/);
  assert.match(exporter, /await fsp\.writeFile\(isolatedPath, isolatedHtml\)/);
  assert.match(exporter, /scene_path:\s*scenePath/);
  assert.doesNotMatch(exporter, /\bpublicDir,\n\s*outDir:/);
  assert.match(gitignore, /^remotion\/\.cache\/$/m);
});
