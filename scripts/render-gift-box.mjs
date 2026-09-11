#!/usr/bin/env node

import puppeteer from "puppeteer";

// Deterministic 10-second 4K chroma-key render preset for the Y2K file→folder loop.
const defaults = {
  INDEX: "file-folder-y2k-v4.html",
  OUT_VIDEO: "output/file-folder-y2k-greenscreen-4k.mp4",
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
