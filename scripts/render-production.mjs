#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifestArg = process.argv[2] || process.env.MANIFEST;
if (!manifestArg) {
  console.error("Production render requires a creative manifest.");
  console.error("Usage: MANIFEST=path/to/production-manifest.json npm run render:production");
  process.exit(2);
}

const manifestPath = path.resolve(manifestArg);
if (!fs.existsSync(manifestPath)) {
  console.error(`Creative manifest not found: ${manifestPath}`);
  process.exit(2);
}

const outVideo = path.resolve(process.env.OUT_VIDEO || "output/final.mp4");
const legacyVerifyPath = outVideo.replace(/\.mp4$/i, ".verify.json");
const creativeReport = path.resolve(
  process.env.CREATIVE_REPORT || manifestPath.replace(/\.json$/i, ".creative.verify.json")
);
const finalReport = path.resolve(
  process.env.FINAL_REPORT || outVideo.replace(/\.mp4$/i, ".final.verify.json")
);

function run(label, args, env = {}) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(process.execPath, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env }
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Creative verification is deliberately first. Expensive frame rendering must never
// start when the production plan/styleframe/proof-of-motion gates are unresolved.
run("CREATIVE GATE", ["scripts/check-creative-gates.mjs", manifestPath], {
  CREATIVE_REPORT: creativeReport
});

run("TECHNICAL RENDER", ["scripts/export-mp4.mjs"]);

if (!fs.existsSync(legacyVerifyPath)) {
  console.error(`Technical renderer did not create verification report: ${legacyVerifyPath}`);
  process.exit(3);
}

// export-mp4.mjs historically emitted FINAL_VERIFIED for stream correctness alone.
// In the production path we immediately normalize that legacy report: stream/codec/
// duration success is TECHNICAL_VERIFIED and remains DRAFT until creative verification
// is combined below.
const technical = JSON.parse(await fsp.readFile(legacyVerifyPath, "utf8"));
technical.status = "DRAFT";
technical.technical_status = "TECHNICAL_VERIFIED";
technical.creative_status = "NOT_COMBINED";
technical.verification_model = "creative+technical-v1";
technical.note = "Technical render passed. FINAL_VERIFIED requires the separate creative report and final combiner.";
await fsp.writeFile(legacyVerifyPath, JSON.stringify(technical, null, 2));

run("FINAL VERIFICATION", ["scripts/finalize-verification.mjs", legacyVerifyPath, creativeReport], {
  FINAL_REPORT: finalReport
});

console.log("\nFINAL_VERIFIED");
console.log(`MP4: ${outVideo}`);
console.log(`technical: ${legacyVerifyPath}`);
console.log(`creative: ${creativeReport}`);
console.log(`final: ${finalReport}`);
