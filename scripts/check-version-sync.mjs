#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));
const skill = read("SKILL.md");
const readme = read("README.md");

const match = skill.match(/Motion Designer v(\d+\.\d+\.\d+)/);
if (!match) {
  throw new Error("Could not determine Motion Designer version from SKILL.md.");
}

const expected = match[1];
const checks = [
  ["package.json version", pkg.version],
  ["package-lock.json version", lock.version],
  ["package-lock root package version", lock.packages?.[""]?.version],
];

for (const [label, actual] of checks) {
  if (actual !== expected) {
    throw new Error(`${label} is ${actual ?? "missing"}; expected ${expected} from SKILL.md.`);
  }
}

if (!readme.includes(`Motion Designer v${expected}`)) {
  throw new Error(`README.md does not identify Motion Designer v${expected}.`);
}

const lockDeps = lock.packages?.[""]?.dependencies ?? {};
for (const [name, range] of Object.entries(pkg.dependencies ?? {})) {
  if (lockDeps[name] !== range) {
    throw new Error(
      `Dependency declaration drift for ${name}: package.json=${range}, package-lock.json=${lockDeps[name] ?? "missing"}.`,
    );
  }
}

console.log(`Version metadata synchronized: Motion Designer v${expected}.`);
