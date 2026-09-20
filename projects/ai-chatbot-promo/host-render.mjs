// Host adapter: reuse the repository's canonical streaming exporter.
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
const launch=puppeteer.launch.bind(puppeteer);
puppeteer.launch=async options=>launch({...options,executablePath:await chromium.executablePath(),args:[...chromium.args,...(options.args||[])]});
await import('../../scripts/export-mp4.mjs');
