#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sources = [
  ["skill-source/part-01.md", "04b0902dfaa531a6d902e0452c4dd4ade763f8d1"],
  ["skill-source/part-02.md", "25fcacce3028c55d923862ed46361611a229e46d"],
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
  "references/explainer.md",
  "references/full-runtime.md",
  "references/techniques.md",
  "scripts/export-mp4.mjs",
]) {
  if (!fs.existsSync(path.join(root, relative))) {
    throw new Error(`Required integration file missing: ${relative}`);
  }
}

console.log("Motion Designer v3.9 unified integration verified.");
