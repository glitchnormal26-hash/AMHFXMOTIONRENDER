#!/usr/bin/env node
import fsp from "node:fs/promises";
import path from "node:path";

const technicalArg = process.argv[2] || process.env.TECHNICAL_REPORT;
const creativeArg = process.argv[3] || process.env.CREATIVE_REPORT;

if (!technicalArg || !creativeArg) {
  console.error("Usage: node scripts/finalize-verification.mjs <technical.verify.json> <creative.verify.json>");
  console.error("Or set TECHNICAL_REPORT and CREATIVE_REPORT.");
  process.exit(2);
}

const technicalPath = path.resolve(technicalArg);
const creativePath = path.resolve(creativeArg);
const technical = JSON.parse(await fsp.readFile(technicalPath, "utf8"));
const creative = JSON.parse(await fsp.readFile(creativePath, "utf8"));

const technicalPass = technical.technical_status === "TECHNICAL_VERIFIED" || technical.status === "TECHNICAL_VERIFIED";
const creativePass = creative.status === "CREATIVE_VERIFIED";
const status = technicalPass && creativePass ? "FINAL_VERIFIED" : "DRAFT";

const report = {
  status,
  technical_status: technicalPass ? "TECHNICAL_VERIFIED" : "TECHNICAL_FAILED",
  creative_status: creativePass ? "CREATIVE_VERIFIED" : "CREATIVE_FAILED",
  output: technical.output || null,
  technical_report: technicalPath,
  creative_report: creativePath,
  duration: technical.duration ?? null,
  video: technical.video ?? null,
  audio: technical.audio ?? null,
  creative: {
    project: creative.project ?? null,
    manifest: creative.manifest ?? null,
    gates: creative.gates ?? null,
    failures: creative.failures ?? []
  }
};

const outputArg = process.env.FINAL_REPORT;
const outPath = path.resolve(outputArg || technicalPath.replace(/\.technical\.verify\.json$/i, ".final.verify.json"));
await fsp.mkdir(path.dirname(outPath), { recursive: true });
await fsp.writeFile(outPath, JSON.stringify(report, null, 2));

console.log(status);
console.log(`technical=${report.technical_status}`);
console.log(`creative=${report.creative_status}`);
console.log(`report=${outPath}`);

if (status !== "FINAL_VERIFIED") process.exit(1);
