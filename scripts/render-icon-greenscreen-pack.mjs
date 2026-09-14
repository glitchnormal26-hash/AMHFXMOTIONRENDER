#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const cwd=process.cwd();
const source=path.resolve(cwd,"assets/icon-greenscreen.html");
const exporter=path.resolve(cwd,"scripts/export-mp4.mjs");
const fps=Number(process.env.FPS||30);
const sceneNames=["heart","bell","chat","pin","camera","music","rocket","bag","check","bolt"];
const requestedScenes=(process.env.SCENES||"").trim();
const scenes=requestedScenes ? requestedScenes.split(",").map(Number).filter(n=>n>=1&&n<=10) : sceneNames.map((_,i)=>i+1);
const allRes={"1080p":[1920,1080],"4k":[3840,2160]};
const only=(process.env.RESOLUTION||"").toLowerCase();
const resolutions=only ? {[only]:allRes[only]} : allRes;
if(only && !allRes[only]) throw new Error(`Unknown RESOLUTION=${only}; use 1080p or 4k`);
if(!fs.existsSync(source)) throw new Error(`Missing ${source}`);

const manifest=[];
for(const [label,[width,height]] of Object.entries(resolutions)){
  const dir=path.resolve(cwd,"output/icon-greenscreen",label);
  await fsp.mkdir(dir,{recursive:true});
  for(const n of scenes){
    const slug=sceneNames[n-1];
    const url=new URL(pathToFileURL(source));
    url.searchParams.set("clean","1");
    url.searchParams.set("scene",String(n));
    const out=path.join(dir,`${String(n).padStart(2,"0")}-${slug}.mp4`);
    console.log(`\n=== ${label} scene ${String(n).padStart(2,"0")} ${slug} ===`);
    const run=spawnSync(process.execPath,[exporter],{
      cwd,
      stdio:"inherit",
      env:{...process.env,QUALITY:"final",FPS:String(fps),WIDTH:String(width),HEIGHT:String(height),CRF:process.env.CRF||"16",PRESET:process.env.PRESET||"medium",URL:url.href,OUT_VIDEO:out,REQUIRE_AUDIO:"0",REQUIRE_VO:"0"}
    });
    if(run.status!==0) process.exit(run.status??1);
    manifest.push({scene:n,slug,resolution:label,width,height,fps,output:path.relative(cwd,out)});
  }
}
const manifestPath=path.resolve(cwd,"output/icon-greenscreen/manifest.json");
await fsp.mkdir(path.dirname(manifestPath),{recursive:true});
await fsp.writeFile(manifestPath,JSON.stringify({status:"EXPORTED",duration:8,greenscreen:"#00FF00",items:manifest},null,2));
console.log(`\nManifest: ${manifestPath}`);
