#!/usr/bin/env bash
# Jalankan studio dalam mode demo (tanpa API key).
# Butuh ffmpeg di PATH agar placeholder berupa MP4; kalau tidak ada, otomatis SVG storyboard.
cd "$(dirname "$0")" || exit 1
export WAN_PROVIDER="${WAN_PROVIDER:-mock}"
export FFMPEG_PATH="${FFMPEG_PATH:-$HOME/.local/bin/ffmpeg}"
exec node --env-file-if-exists=.env server/index.mjs
