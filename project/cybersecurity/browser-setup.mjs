import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
const launch=puppeteer.launch.bind(puppeteer);
const executablePath=await chromium.executablePath();
puppeteer.launch=async(options={})=>launch({...options,executablePath,headless:true,args:[...chromium.args,...(options.args||[]),'--no-sandbox','--disable-dev-shm-usage']});
