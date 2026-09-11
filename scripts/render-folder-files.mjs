#!/usr/bin/env node

import puppeteer from "puppeteer";

// 25-second 4K motion graphic render preset for folder-files.html.
const defaults = {
  INDEX: "folder-files.html",
  OUT_VIDEO: "output/folder-files-25s-4k.mp4",
  QUALITY: "final",
  FPS: "24",
  WIDTH: "3840",
  HEIGHT: "2160",
  CRF: "16",
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
