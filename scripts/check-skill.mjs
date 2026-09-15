#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sources = [
  ["skill-source/part-01.md", "1545e682a980b0ed74dc5363ea2dddf2039efef0"],
  ["skill-source/part-02.md", "1132d7eaa60f69a9be5f85d1e795f7ab110ab205"],
];

const gitBlobSha = data => crypto
  .createHash("sha1")
  .update(`blob ${data.length}\0`)
  .update(data)
  .digest("hex");

const chunks = sources.map(([relative, expected]) => {
  const data = fs.readFileSync(path.join(root, relative));
  const actual = gitBlobSha(data);
  if (actual !== expected) {
    throw new Error(`Motion Skill source integrity failed for ${relative}: ${actual}`);
  }
  return data;
});

const combined = Buffer.concat(chunks).toString("utf8");
if (!combined.includes("version: 3.9.3-motion-depth-gates")) {
  throw new Error("Canonical Motion Skill source version marker is missing.");
}

const requiredFiles = [
  "SKILL.md",
  "references/anti-ppt.md",
  "references/architecture.md",
  "references/camera-motion.md",
  "references/camera-movement.md",
  "references/explainer.md",
  "references/failure-gates.md",
  "references/full-runtime.md",
  "references/production-verification.md",
  "references/production-manifest.example.json",
  "references/saas-motion-explainer-direction.md",
  "references/techniques.md",
  "references/visual-quality.md",
  "assets/starter-saas-explainer.html",
  "runtime/camera-rig.js",
  "runtime/explainer-helpers.js",
  "scripts/check-creative-gates.mjs",
  "scripts/finalize-verification.mjs",
  "scripts/render-production.mjs",
  "scripts/export-mp4.mjs",
];

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) {
    throw new Error(`Required integration file missing: ${relative}`);
  }
}

const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const skill = read("SKILL.md");
const saasDirection = read("references/saas-motion-explainer-direction.md");
const explainer = read("references/explainer.md");
const agentRules = read("AGENTS.md");
const starter = read("assets/starter-saas-explainer.html");
const productionVerification = read("references/production-verification.md");
const creativeChecker = read("scripts/check-creative-gates.mjs");
const productionRenderer = read("scripts/render-production.mjs");

for (const marker of [
  "references/saas-motion-explainer-direction.md",
  "references/visual-quality.md",
  "SAAS_DIRECTION_GATE=PASS|NOT_REQUIRED",
  "ANTI_PRIMITIVE_GATE=PASS",
  "PLAYBACK_GATE=PASS",
]) {
  if (!skill.includes(marker)) {
    throw new Error(`Active SKILL.md is missing required integration marker: ${marker}`);
  }
}

for (const marker of [
  "Midnight Violet",
  "Electric Teal",
  "Warm Neutral",
  "Indigo Cloud",
  "ONE_NAMED_PALETTE=PASS",
  "TYPE_FRAGMENT_GATE=PASS",
  "STAGGER_HOLD_GATE=PASS",
  "references/camera-movement.md",
]) {
  if (!saasDirection.includes(marker)) {
    throw new Error(`SaaS direction module is missing required marker: ${marker}`);
  }
}

for (const [relative, body, markers] of [
  ["references/explainer.md", explainer, ["starter-saas-explainer.html", "SAAS_DIRECTION_GATE"]],
  ["AGENTS.md", agentRules, ["saas-motion-explainer-direction.md", "SAAS_DIRECTION_GATE"]],
  ["references/production-verification.md", productionVerification, ["TECHNICAL_VERIFIED", "CREATIVE_VERIFIED", "FINAL_VERIFIED", "render:production", "production-manifest.example.json"]],
  ["scripts/check-creative-gates.mjs", creativeChecker, ["CREATIVE_VERIFIED", "CONTINUITY_MATERIAL_GATE", "STILL_FRAME_GATE", "ART_DIRECTION_GATE"]],
  ["scripts/render-production.mjs", productionRenderer, ["CREATIVE GATE", "TECHNICAL RENDER", "FINAL VERIFICATION", "technical_status"]],
]) {
  for (const marker of markers) {
    if (!body.includes(marker)) {
      throw new Error(`${relative} is missing required integration marker: ${marker}`);
    }
  }
}

for (const marker of [
  "--bg:#0B0D17",
  "--accent-1:#7C5CFF",
  "--accent-2:#38E1C6",
  "id=\"viewport-fit\"",
  "id=\"camera\"",
  "id=\"world\"",
  "power2.inOut",
  "back.out(1.4)",
  "window.OPENER",
]) {
  if (!starter.includes(marker)) {
    throw new Error(`SaaS starter is missing required direction/runtime marker: ${marker}`);
  }
}

if (starter.includes("Math.random(")) {
  throw new Error("SaaS starter must remain deterministic; unseeded Math.random() is forbidden.");
}

console.log("Motion Designer v3.9.4 integration, creative+technical verification, visual gates, camera module, and SaaS direction profile verified.");
