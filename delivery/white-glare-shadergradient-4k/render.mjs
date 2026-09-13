import { mkdir, writeFile, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import process from 'node:process'
import puppeteer from 'puppeteer-core'

const WIDTH = 3840
const HEIGHT = 2160
const PORT = 4173
const BASE_URL = `http://127.0.0.1:${PORT}`
const OUT_DIR = new URL('./output/', import.meta.url)

const PRESET_NAMES = [
  '01-center-soft-bloom',
  '02-diagonal-sweep',
  '03-horizontal-anamorphic',
  '04-top-left-flare',
  '05-top-edge-glow',
  '06-bottom-right-glow',
  '07-vertical-light-leak',
  '08-crossed-double-streak',
  '09-halo-ring',
  '10-wide-haze-wash',
]

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)
  return candidates[0]
}

async function waitForServer(url, timeoutMs = 30000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Preview server did not become ready: ${url}`)
}

await mkdir(OUT_DIR, { recursive: true })

const preview = spawn('npm', ['run', 'preview'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
})
preview.stdout.on('data', (data) => process.stdout.write(`[preview] ${data}`))
preview.stderr.on('data', (data) => process.stderr.write(`[preview] ${data}`))

let browser
try {
  await waitForServer(BASE_URL)

  browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--ignore-gpu-blocklist',
      '--enable-webgl',
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      `--window-size=${WIDTH},${HEIGHT}`,
    ],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 })

  const manifest = {
    generator: '@shadergradient/react@2.4.20',
    format: 'JPEG',
    width: WIDTH,
    height: HEIGHT,
    aspectRatio: '16:9',
    blendRecommendation: 'Screen or Add over footage',
    background: '#000000',
    presets: [],
  }

  for (let index = 0; index < PRESET_NAMES.length; index += 1) {
    const expectedName = PRESET_NAMES[index]
    const url = `${BASE_URL}/?preset=${index}`
    console.log(`Rendering ${expectedName} ...`)

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    await page.waitForFunction(() => window.__RENDER_READY__ === true, { timeout: 30000 })
    await new Promise((resolve) => setTimeout(resolve, 600))

    const diagnostics = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')
      const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl')
      return {
        title: document.title,
        presetName: window.__PRESET_NAME__,
        canvasWidth: canvas?.width || 0,
        canvasHeight: canvas?.height || 0,
        cssWidth: canvas?.getBoundingClientRect().width || 0,
        cssHeight: canvas?.getBoundingClientRect().height || 0,
        webgl: Boolean(gl),
      }
    })

    if (!diagnostics.webgl) throw new Error(`WebGL unavailable for ${expectedName}`)
    if (diagnostics.presetName !== expectedName) {
      throw new Error(`Preset mismatch: expected ${expectedName}, got ${diagnostics.presetName}`)
    }

    const fileUrl = new URL(`${expectedName}.jpg`, OUT_DIR)
    await page.screenshot({
      path: fileUrl,
      type: 'jpeg',
      quality: 96,
      fullPage: false,
      captureBeyondViewport: false,
      optimizeForSpeed: false,
    })

    const info = await stat(fileUrl)
    if (info.size < 30000) throw new Error(`Suspiciously small render: ${expectedName} (${info.size} bytes)`)

    manifest.presets.push({
      index,
      name: expectedName,
      file: `${expectedName}.jpg`,
      bytes: info.size,
      diagnostics,
    })
    console.log(`Rendered ${expectedName}: ${info.size} bytes`)
  }

  await writeFile(new URL('manifest.json', OUT_DIR), JSON.stringify(manifest, null, 2))
  console.log(`Done: ${PRESET_NAMES.length} JPG files at ${WIDTH}x${HEIGHT}`)
} finally {
  if (browser) await browser.close().catch(() => {})
  preview.kill('SIGTERM')
}
