#!/usr/bin/env node
import fs from "node:fs";

const args = process.argv.slice(2);
const readArg = name => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const hasFlag = name => args.includes(`--${name}`);

const brief = readArg("brief") || args.filter(x => !x.startsWith("--"))[0];
if (!brief) {
  console.error('Usage: npm run clip:plan -- --brief "SaaS launch with browser UI" [--format 16:9] [--duration 7] [--json] [--write clip-plan.json]');
  process.exit(1);
}

const format = readArg("format") || "16:9";
const duration = Number(readArg("duration") || 7);
if (!Number.isFinite(duration) || duration <= 0) {
  console.error("--duration must be a positive number of seconds.");
  process.exit(1);
}

const normalized = `${brief} ${readArg("style") || ""}`.toLowerCase();
const catalog = [
  {
    id: "full-runtime",
    path: "assets/starter-full-runtime.html",
    label: "Product / SaaS / UI showcase",
    keywords: ["saas", "app", "ui", "interface", "dashboard", "browser", "product", "launch", "screen", "mockup", "software", "website", "web"],
    modules: ["references/full-runtime.md", "references/camera-motion.md", "runtime/camera-rig.js"],
    camera: "TRACKING with 2–4s reframes; follow the active UI/hero object during transfers",
  },
  {
    id: "journalism",
    path: "assets/starter-explainer-jurnalisme.html",
    label: "Journalism / documentary / evidence explainer",
    keywords: ["news", "documentary", "report", "journalism", "historical", "evidence", "case", "investigation", "timeline", "headline"],
    modules: ["references/explainer.md", "references/camera-motion.md"],
    camera: "REFRAME between evidence beats; use LOCKED_INTENTIONAL only for short comprehension holds",
  },
  {
    id: "catalog",
    path: "assets/starter-explainer-katalog.html",
    label: "Catalog / feature / comparison showcase",
    keywords: ["catalog", "product", "feature", "comparison", "lineup", "ecommerce", "price", "collection", "spec", "benefit"],
    modules: ["references/architecture.md", "references/camera-motion.md"],
    camera: "MOVING product traversal with push-through or handoff between feature owners",
  },
  {
    id: "cartoon",
    path: "assets/starter-explainer-kartun.html",
    label: "Character / playful explainer",
    keywords: ["cartoon", "character", "playful", "friendly", "mascot", "fun", "kid", "cute"],
    modules: ["references/explainer.md", "references/techniques.md", "references/camera-motion.md"],
    camera: "TRACKING or follow behavior on the character/attention owner",
  },
  {
    id: "sketch",
    path: "assets/starter-explainer-sketsa.html",
    label: "Sketch / concept / diagram explainer",
    keywords: ["sketch", "storyboard", "concept", "hand-drawn", "handdrawn", "diagram", "wireframe", "idea"],
    modules: ["references/explainer.md", "references/techniques.md"],
    camera: "REFRAME around each drawn idea; avoid a permanently fixed wide shot",
  },
  {
    id: "explainer",
    path: "assets/starter-explainer.html",
    label: "Continuous-action explainer",
    keywords: ["explain", "explainer", "educational", "process", "story", "data", "stat", "how", "why", "journey"],
    modules: ["references/explainer.md", "references/camera-motion.md"],
    camera: "MOVING world with authored speed ramps and semantic reframes",
  },
  {
    id: "opener",
    path: "assets/starter.html",
    label: "Neutral opener / title reveal",
    keywords: ["logo", "opener", "title", "reveal", "bumper", "intro", "hook", "brand"],
    modules: ["references/techniques.md", "references/architecture.md"],
    camera: "Short MOVING opener; settle intentionally on the final title frame",
  },
];

for (const item of catalog) {
  item.score = item.keywords.reduce((score, keyword) => score + (normalized.includes(keyword) ? 2 : 0), 0);
}
const ranked = [...catalog].sort((a, b) => b.score - a.score);
const selected = ranked[0].score > 0 ? ranked[0] : catalog.find(x => x.id === "opener");
const alternates = ranked.filter(x => x.id !== selected.id).slice(0, 2);

const cleanHeadline = brief.replace(/\s+/g, " ").trim().slice(0, 72);
const plan = {
  version: 1,
  source: "AMHFXMOTIONRENDER local clip workflow",
  brief,
  format,
  durationSeconds: duration,
  selection: {
    id: selected.id,
    label: selected.label,
    starter: selected.path,
    score: selected.score,
    alternatives: alternates.map(({ id, label, path, score }) => ({ id, label, starter: path, score })),
  },
  customization: {
    text: {
      headline: cleanHeadline,
      subline: "Replace with one concise supporting line",
      eyebrow: "Optional category / chapter label",
    },
    palette: {
      background: "author in scene",
      foreground: "author in scene",
      accent: "author in scene",
    },
    media: [],
    note: "Treat these as authored edit targets. Do not claim a field is runtime-wired unless the selected scene exposes it.",
  },
  motion: {
    cameraIntent: selected.camera,
    speedRamp: duration >= 6 ? "ACTIVE when it improves traversal; preserve deterministic seeking" : "NOT_REQUIRED unless justified",
    typography: "Protect camera-space safe lanes and inspect the fastest midpoint plus landing frame",
  },
  audio: {
    default: "VOICEOVER + purposeful SFX + controlled ambience + silence; NO BGM unless requested",
  },
  modules: selected.modules,
  handoff: {
    prepare: `cp ${selected.path} motra-output/index.html`,
    preview: "QUALITY=fast npm run render:motra",
    final: "npm run render:motra",
    verify: "npm run check, then visually inspect opening, fastest move, landing, and final framing",
  },
};

const output = JSON.stringify(plan, null, 2);
const write = readArg("write");
if (write) fs.writeFileSync(write, `${output}\n`);

if (hasFlag("json") || write) {
  console.log(output);
} else {
  console.log(`Selected: ${plan.selection.label}`);
  console.log(`Starter:  ${plan.selection.starter}`);
  console.log(`Camera:   ${plan.motion.cameraIntent}`);
  console.log(`Preview:  ${plan.handoff.preview}`);
  console.log(`Final:    ${plan.handoff.final}`);
  if (alternates.length) console.log(`Alternates: ${alternates.map(x => x.label).join(" | ")}`);
}
