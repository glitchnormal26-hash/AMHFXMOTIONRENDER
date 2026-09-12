import puppeteer from 'puppeteer';
const launch=puppeteer.launch.bind(puppeteer);
puppeteer.launch=(opts={})=>launch({...opts,args:[...(opts.args||[]),'--no-sandbox','--disable-dev-shm-usage']});
