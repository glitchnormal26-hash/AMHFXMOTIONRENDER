#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "skill-source");
const outDir = path.join(root, "dist");

const manifest = JSON.parse(fs.readFileSync(path.join(src, "manifest.json"), "utf8"));
const digest = data => crypto.createHash("sha256").update(data).digest("hex");
const declared = manifest.parts.map(p => path.basename(p.path));
const actual = fs.readdirSync(src).filter(p => /^part-\d+\.md$/.test(p)).sort();
if (JSON.stringify(declared) !== JSON.stringify(actual)) {
  throw new Error("SKILL source inventory must include every part once, in order.");
}
const chunks = manifest.parts.map(part => {
  if (!/^skill-source\/part-\d+\.md$/.test(part.path)) {
    throw new Error(`Invalid source path: ${part.path}`);
  }
  const data = fs.readFileSync(path.join(root, part.path));
  if (data.length !== part.bytes || digest(data) !== part.sha256) {
    throw new Error(`SKILL part integrity check failed: ${part.path}`);
  }
  return data;
});
const content = Buffer.concat(chunks);
const hash = crypto.createHash("sha256").update(content).digest("hex");
if (hash !== manifest.reassembled_sha256 || content.length !== manifest.reassembled_bytes) {
  console.error("SKILL integrity check failed.");
  console.error("expected", manifest.reassembled_sha256);
  console.error("actual  ", hash);
  process.exit(2);
}
const out = path.join(outDir, "SKILL.md");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, content);
console.log(`built ${out}`);
console.log(`sha256 ${hash}`);
