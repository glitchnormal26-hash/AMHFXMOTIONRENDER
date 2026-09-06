#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const src = path.join(root, "skill-source");
const outDir = path.join(root, "dist");
fs.mkdirSync(outDir, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(path.join(src, "manifest.json"), "utf8"));
const files = manifest.parts.map(p => path.join(root, p.path));
const content = files.map(f => fs.readFileSync(f, "utf8")).join("");
const hash = crypto.createHash("sha256").update(content).digest("hex");
if (hash !== manifest.reassembled_sha256) {
  console.error("SKILL integrity check failed.");
  console.error("expected", manifest.reassembled_sha256);
  console.error("actual  ", hash);
  process.exit(2);
}
const out = path.join(outDir, "SKILL.md");
fs.writeFileSync(out, content);
console.log(`built ${out}`);
console.log(`sha256 ${hash}`);
