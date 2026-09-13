#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "assets", "sfx", "index.json");
const sfxRoot = path.resolve(root, "assets", "sfx") + path.sep;

function fail(message) {
  console.error(`SFX CHECK FAILED: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) fail("missing assets/sfx/index.json");

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}

if (manifest.version !== 1) fail(`unsupported manifest version: ${manifest.version}`);
if (!Array.isArray(manifest.items) || manifest.items.length === 0) fail("items must be a non-empty array");

const ids = new Set();
const paths = new Set();

for (const [index, item] of manifest.items.entries()) {
  const label = `items[${index}]`;

  if (!item || typeof item !== "object") fail(`${label} must be an object`);
  if (typeof item.id !== "string" || !item.id.trim()) fail(`${label}.id is required`);
  if (ids.has(item.id)) fail(`duplicate id: ${item.id}`);
  ids.add(item.id);

  if (typeof item.path !== "string" || !item.path.startsWith("assets/sfx/")) {
    fail(`${item.id}.path must stay under assets/sfx/`);
  }
  if (item.path.includes("\\") || path.posix.normalize(item.path) !== item.path || item.path.includes("..")) {
    fail(`${item.id}.path is not normalized: ${item.path}`);
  }
  if (paths.has(item.path)) fail(`duplicate path: ${item.path}`);
  paths.add(item.path);

  const absolute = path.resolve(root, item.path);
  if (!absolute.startsWith(sfxRoot)) fail(`${item.id}.path escapes the SFX root`);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) fail(`${item.id} file missing: ${item.path}`);
  if (fs.statSync(absolute).size <= 0) fail(`${item.id} file is empty`);
  if (path.extname(item.path).toLowerCase() !== ".mp3") fail(`${item.id} must use the normalized .mp3 format`);

  if (!Number.isFinite(item.duration) || item.duration <= 0 || item.duration > 30) {
    fail(`${item.id}.duration must be > 0 and <= 30 seconds`);
  }
  if (!Array.isArray(item.tags) || item.tags.length === 0 || item.tags.some(tag => typeof tag !== "string" || !tag.trim())) {
    fail(`${item.id}.tags must be a non-empty string array`);
  }
  if (typeof item.source_name !== "string" || !item.source_name.trim()) {
    fail(`${item.id}.source_name is required for provenance`);
  }
}

console.log(`SFX manifest verified: ${manifest.items.length} items.`);
