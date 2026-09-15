#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const manifestArg = process.argv[2] || process.env.MANIFEST;
if (!manifestArg) {
  console.error("Usage: node scripts/check-creative-gates.mjs <production-manifest.json>");
  console.error("Or set MANIFEST=/path/to/production-manifest.json");
  process.exit(2);
}

const manifestPath = path.resolve(manifestArg);
if (!fs.existsSync(manifestPath)) {
  console.error(`Creative manifest not found: ${manifestPath}`);
  process.exit(2);
}

const manifest = JSON.parse(await fsp.readFile(manifestPath, "utf8"));
const failures = [];
const warnings = [];
const pass = (condition, message) => { if (!condition) failures.push(message); };
const text = value => typeof value === "string" && value.trim().length >= 3;
const oneOf = (value, values) => values.includes(value);

pass(manifest.schema_version === 1, "schema_version must be 1");
pass(text(manifest.project), "project is required");
pass(text(manifest.visual_language), "visual_language is required");
pass(text(manifest.continuity_carrier), "continuity_carrier is required and must describe the visible material that persists/transforms");
pass(text(manifest.creative_intent), "creative_intent is required");

const styleframes = Array.isArray(manifest.styleframes) ? manifest.styleframes : [];
pass(styleframes.length >= 5, "at least 5 representative styleframes are required before final render");
for (const [i, frame] of styleframes.entries()) {
  pass(text(frame?.beat), `styleframes[${i}].beat is required`);
  pass(text(frame?.hero), `styleframes[${i}].hero is required`);
  pass(text(frame?.composition), `styleframes[${i}].composition is required`);
  pass(text(frame?.quality_note), `styleframes[${i}].quality_note is required`);
}

const proof = manifest.proof_of_motion || {};
pass(oneOf(proof.status, ["PASS"]), "proof_of_motion.status must be PASS");
pass(Number.isFinite(Number(proof.duration_seconds)) && Number(proof.duration_seconds) >= 8,
  "proof_of_motion.duration_seconds must be at least 8 seconds");
pass(text(proof.scope), "proof_of_motion.scope must identify the difficult transition/camera section tested");
pass(text(proof.playback_note), "proof_of_motion.playback_note is required");

const allowedCameraModes = ["MOVING", "TRACKING", "REFRAME", "LOCKED_INTENTIONAL"];
const scenes = Array.isArray(manifest.scenes) ? manifest.scenes : [];
pass(scenes.length >= 2, "at least 2 semantic scenes/beats are required");
for (const [i, scene] of scenes.entries()) {
  pass(text(scene?.id), `scenes[${i}].id is required`);
  pass(text(scene?.purpose), `scenes[${i}].purpose is required`);
  pass(text(scene?.hero), `scenes[${i}].hero is required`);
  pass(oneOf(scene?.camera_mode, allowedCameraModes),
    `scenes[${i}].camera_mode must be ${allowedCameraModes.join(" | ")}`);
  pass(text(scene?.depth_plan), `scenes[${i}].depth_plan is required`);
  pass(text(scene?.type_role), `scenes[${i}].type_role is required`);

  if (i < scenes.length - 1) {
    const tr = scene?.transition_to_next || {};
    pass(text(tr.cause), `scenes[${i}].transition_to_next.cause is required`);
    pass(text(tr.action), `scenes[${i}].transition_to_next.action is required`);
    pass(text(tr.result), `scenes[${i}].transition_to_next.result is required`);
    pass(text(tr.continuity), `scenes[${i}].transition_to_next.continuity must name what visibly survives/transforms`);
  }
}

const requiredPassGates = [
  "SKILL_USAGE_GATE",
  "PLAYBACK_GATE",
  "CAMERA_GATE",
  "CAMERA_ENERGY_GATE",
  "HERO_AUTHORITY_GATE",
  "COMPOSITION_GATE",
  "KINETIC_GATE",
  "KINETIC_CAUSALITY_GATE",
  "ANTI_PPT_GATE",
  "CONTINUITY_MATERIAL_GATE",
  "SCREEN_SWAP_GATE",
  "PAYOFF_GATE",
  "ANTI_PRIMITIVE_GATE",
  "STILL_FRAME_GATE",
  "HERO_VISUAL_GATE",
  "MATERIAL_GATE",
  "DEPTH_GATE",
  "ART_DIRECTION_GATE",
  "THUMBNAIL_GATE"
];
const gates = manifest.gates || {};
for (const gate of requiredPassGates) {
  pass(gates[gate] === "PASS", `${gate} must be PASS`);
}
pass(oneOf(gates.COPYSPACE_GATE, ["PASS", "NOT_REQUIRED"]), "COPYSPACE_GATE must be PASS or NOT_REQUIRED");
pass(oneOf(gates.SPEED_RAMP, ["ACTIVE", "NOT_REQUIRED"]), "SPEED_RAMP must be ACTIVE or NOT_REQUIRED");
pass(oneOf(gates.CAMERA_FOLLOW, ["USED", "NOT_REQUIRED"]), "CAMERA_FOLLOW must be USED or NOT_REQUIRED");
pass(oneOf(gates.SFX_MODE, ["ASSET_ONLY", "NONE"]), "SFX_MODE must be ASSET_ONLY or NONE");
pass(oneOf(gates.AUDIO_MIX_GATE, ["PASS", "NOT_REQUIRED"]), "AUDIO_MIX_GATE must be PASS or NOT_REQUIRED");
pass(oneOf(gates.SAAS_DIRECTION_GATE, ["PASS", "NOT_REQUIRED"]), "SAAS_DIRECTION_GATE must be PASS or NOT_REQUIRED");

const forbidden = ["todo", "tbd", "placeholder", "generic", "later", "n/a"];
const serialized = JSON.stringify(manifest).toLowerCase();
for (const token of forbidden) {
  if (serialized.includes(`\"${token}\"`)) failures.push(`manifest contains unresolved placeholder token: ${token}`);
}

if (!manifest.review || !text(manifest.review.summary)) {
  failures.push("review.summary is required and must explain why the piece is ready for final render");
}
if (!Array.isArray(manifest.review?.rejected_shortcuts) || manifest.review.rejected_shortcuts.length < 2) {
  failures.push("review.rejected_shortcuts must list at least 2 shortcuts/templates deliberately rejected during art direction");
}
if (!Array.isArray(manifest.review?.representative_frames) || manifest.review.representative_frames.length < 5) {
  failures.push("review.representative_frames must list at least 5 inspected frame times/labels");
}

const report = {
  status: failures.length ? "CREATIVE_FAILED" : "CREATIVE_VERIFIED",
  manifest: path.relative(cwd, manifestPath),
  project: manifest.project || null,
  checked_at: new Date().toISOString(),
  failures,
  warnings,
  gates
};

const outPath = path.resolve(
  process.env.CREATIVE_REPORT || manifestPath.replace(/\.json$/i, ".creative.verify.json")
);
await fsp.mkdir(path.dirname(outPath), { recursive: true });
await fsp.writeFile(outPath, JSON.stringify(report, null, 2));

if (failures.length) {
  console.error("CREATIVE_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(`report: ${outPath}`);
  process.exit(1);
}

console.log("CREATIVE_VERIFIED");
console.log(`manifest: ${manifestPath}`);
console.log(`report: ${outPath}`);
