#!/usr/bin/env node

import puppeteer from "puppeteer";

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

// GitHub-hosted Ubuntu runners disable the Chrome sandbox mechanism Puppeteer
// tries to use. Patch launch options only in CI so local rendering keeps the
// normal sandbox behavior.
if (process.env.CI) {
  const launch = puppeteer.launch.bind(puppeteer);
  puppeteer.launch = (options = {}) => launch({
    ...options,
    args: [
      ...(options.args || []),
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });
}

await import("./export-mp4.mjs");
