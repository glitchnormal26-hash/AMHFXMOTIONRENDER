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
if (!combined.includes("version: 3.9-modular.2-strict-antippt")) {
  throw new Error("Motion Skill v3.9 version marker is missing.");
}

for (const relative of [
  "SKILL.md",
  "references/anti-ppt.md",
  "references/architecture.md",
  "references/camera-motion.md",
  "references/explainer.md",
  "references/failure-gates.md",
  "references/full-runtime.md",
  "references/techniques.md",
  "scripts/export-mp4.mjs",
]) {
  if (!fs.existsSync(path.join(root, relative))) {
    throw new Error(`Required integration file missing: ${relative}`);
  }
}

console.log("Motion Designer v3.9.4 unified integration verified.");
