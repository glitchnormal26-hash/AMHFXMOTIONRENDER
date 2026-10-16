import puppeteer from 'puppeteer-core';
export async function launch(w=420,h=900,extra={}){
  return puppeteer.launch({
    executablePath:'/tmp/chromium',
    headless:'shell',
    defaultViewport:{width:w,height:h,deviceScaleFactor:1,...extra},
    env:{...process.env,LD_LIBRARY_PATH:'/tmp/al2023x/lib',HOME:'/tmp'},
    args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files','--no-zygote','--single-process']
  });
}
