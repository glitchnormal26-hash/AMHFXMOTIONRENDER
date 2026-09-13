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
    id: "saas-glass",
    path: "assets/starter-saas-glass.html",
    label: "SaaS launch / glass dashboard showcase",
    keywords: ["saas", "dashboard", "software", "app", "launch", "workspace", "analytics", "glass", "frosted", "gradient", "aurora", "liquid logo", "chrome logo"],
    modules: ["references/full-runtime.md", "references/camera-motion.md", "references/external-visuals.md", "runtime/camera-rig.js"],
    camera: "TRACKING product journey: brand formation -> push-through -> cursor-led dashboard reframe -> intentional CTA settle",
  },
  {
    id: "full-runtime",
    path: "assets/starter-full-runtime.html",
    label: "Product / UI showcase",
    keywords: ["ui", "interface", "browser", "product", "screen", "mockup", "website", "web", "spatial", "runtime"],
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

const effectCatalog = [
  {
    id: "shadergradient",
    label: "Animated shader gradient",
    repo: "https://github.com/ruucm/shadergradient",
    integrationMode: "optional-package",
    license: "MIT (published shadergradient package)",
    keywords: ["gradient", "mesh gradient", "aurora", "shader gradient", "iridescent", "color field", "fluid color", "animated background"],
    guidance: "Use as a bounded/background visual layer. Keep AMHFX as timeline authority and provide a deterministic or local fallback.",
  },
  {
    id: "liquid-glass-js",
    label: "Frosted / refractive liquid glass",
    repo: "https://github.com/dashersw/liquid-glass-js",
    integrationMode: "optional-package",
    license: "MIT",
    keywords: ["glass", "frosted", "frosted glass", "liquid glass", "refractive", "refraction", "translucent", "glassmorphism", "glass card"],
    guidance: "Use for selected hero/UI surfaces. Capture-test WebGL in the Puppeteer path and keep a CSS fallback.",
  },
  {
    id: "liquid-logo",
    label: "Liquid-metal logo reference",
    repo: "https://github.com/paper-design/liquid-logo",
    integrationMode: "reference-only",
    license: "PolyForm Shield 1.0.0",
    keywords: ["liquid logo", "liquid metal", "molten logo", "molten chrome", "chrome logo", "fluid emblem", "metallic logo"],
    guidance: "Do not vendor or auto-install by default. Author an original local AMHFX treatment unless the project separately approves the upstream license.",
  },
];

for (const item of catalog) {
  item.score = item.keywords.reduce((score, keyword) => score + (normalized.includes(keyword) ? 2 : 0), 0);
}
const ranked = [...catalog].sort((a, b) => b.score - a.score);
const selected = ranked[0].score > 0 ? ranked[0] : catalog.find(x => x.id === "opener");
const alternates = ranked.filter(x => x.id !== selected.id).slice(0, 2);

const visualEffects = effectCatalog
  .map(effect => ({
    ...effect,
    score: effect.keywords.reduce((score, keyword) => score + (normalized.includes(keyword) ? 1 : 0), 0),
  }))
  .filter(effect => effect.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(({ keywords, ...effect }) => effect);

const cleanHeadline = brief.replace(/\s+/g, " ").trim().slice(0, 72);
const plan = {
  version: 3,
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
  visualEffects,
  visualEffectsPolicy: visualEffects.length
    ? "Load references/external-visuals.md. Optional effects enhance the scene but do not replace AMHFX camera/timeline authority."
    : "No external visual module required by this brief.",
  motion: {
    cameraIntent: selected.camera,
    speedRamp: duration >= 6 ? "ACTIVE when it improves traversal; preserve deterministic seeking" : "NOT_REQUIRED unless justified",
    typography: "Protect camera-space safe lanes and inspect the fastest midpoint plus landing frame",
  },
  audio: {
    default: "VOICEOVER + purposeful SFX + controlled ambience + silence; NO BGM unless requested",
  },
  modules: visualEffects.length ? [...new Set([...selected.modules, "references/external-visuals.md"])] : selected.modules,
  handoff: {
    prepare: `cp ${selected.path} motra-output/index.html`,
    preview: "QUALITY=fast npm run render:motra",
    final: "npm run render:motra",
    verify: "npm run check, then visually inspect opening, fastest move, landing, final framing, and any optional WebGL effect in the capture path",
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
  if (visualEffects.length) {
    console.log(`Effects:  ${visualEffects.map(x => `${x.label} [${x.integrationMode}]`).join(" | ")}`);
  }
  console.log(`Preview:  ${plan.handoff.preview}`);
  console.log(`Final:    ${plan.handoff.final}`);
  if (alternates.length) console.log(`Alternates: ${alternates.map(x => x.label).join(" | ")}`);
}
