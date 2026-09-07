#!/usr/bin/env node

// Deterministic 10-second 4K chroma-key render preset for index.html.
// Defaults can still be overridden by explicitly setting environment variables.
const defaults = {
  INDEX: "index.html",
  OUT_VIDEO: "output/gift-box-greenscreen-4k.mp4",
  QUALITY: "final",
  FPS: "30",
  WIDTH: "3840",
  HEIGHT: "2160",
  CRF: "14",
  PRESET: "medium",
  REQUIRE_AUDIO: "0",
  REQUIRE_VO: "0",
};

for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]) process.env[key] = value;
}

await import("./export-mp4.mjs");
