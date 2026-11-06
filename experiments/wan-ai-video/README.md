# Wan AI Video

Studio **text-to-video** minimalis: tulis prompt → video MP4, ditenagai model **Wan** (Alibaba Model Studio / DashScope).

- Tanpa database, tanpa build step — Node + Express + HTML/CSS/JS vanilla.
- Mode **dashscope**: panggil API Wan asli (async task + polling + auto-download).
- Mode **mock**: jalan tanpa API key, menghasilkan placeholder untuk nguji UI/flow.
- Riwayat job tersimpan di `data/jobs.json`, video di `data/videos/`.
- Config lengkap lewat `.env`, tidak ada key yang di-hardcode.

## Quick start

```bash
git clone https://github.com/glitchnormal26-hash/wan-ai-video.git
cd wan-ai-video
npm install
cp .env.example .env      # isi DASHSCOPE_API_KEY
npm start                 # http://localhost:3000
```

Tanpa API key, jalankan mode demo:

```bash
WAN_PROVIDER=mock npm start
```

## Ambil API key Wan

1. Daftar/masuk [Alibaba Cloud Model Studio](https://modelstudio.console.alibabacloud.com/).
2. Aktifkan layanan **Wan / Video Generation** di region **Singapore** (internasional) agar endpoint `dashscope-intl` bisa dipakai.
3. Buat **API key**, salin ke `.env`:

```env
DASHSCOPE_API_KEY=sk-xxxxxxxx
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/api/v1
WAN_MODEL=wan2.2-t2v-plus
```

> Catatan: Wan berbayar per detik video yang dihasilkan. Cek harga di console sebelum render 1080P.

## Cara kerja

```text
Browser ──POST /api/jobs──▶ Express ──submit task──▶ DashScope
                                │                      │
                                │◀── task_id ──────────┘
                                │
                     poller tiap POLL_INTERVAL_MS
                                │
                     GET /api/v1/tasks/{id}
                                │
                     SUCCEEDED → unduh video_url → data/videos/*.mp4
```

`video_url` dari Wan hanya valid **24 jam**, jadi server otomatis mengunduhnya (`DOWNLOAD_VIDEOS=1`, default) dan menyajikan lewat `/videos/<file>.mp4`.

## API

| Method | Path | Keterangan |
| --- | --- | --- |
| `GET` | `/api/health` | status provider, model, ada/tidaknya key |
| `GET` | `/api/config` | daftar model, resolusi, durasi |
| `GET` | `/api/jobs` | semua job (terbaru dulu) |
| `POST` | `/api/jobs` | buat job baru |
| `GET` | `/api/jobs/:id` | detail + status satu job |
| `POST` | `/api/jobs/:id/retry` | kirim ulang job yang gagal |
| `DELETE` | `/api/jobs/:id` | hapus job + file video |

Contoh:

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": "Low angle, neon warung kopi di gang basah, hujan rintik, kamera dolly-in pelan, grain 35mm",
    "negativePrompt": "watermark, teks, distorsi",
    "model": "wan2.2-t2v-plus",
    "size": "1280*720",
    "duration": 5
  }'
```

## Konfigurasi `.env`

| Variabel | Default | Fungsi |
| --- | --- | --- |
| `DASHSCOPE_API_KEY` | – | API key Model Studio (wajib untuk mode asli) |
| `DASHSCOPE_BASE_URL` | `https://dashscope-intl.aliyuncs.com/api/v1` | endpoint region (intl / Beijing) |
| `WAN_MODEL` | `wan2.2-t2v-plus` | model default |
| `WAN_PROVIDER` | otomatis | `dashscope` / `mock` |
| `PORT` | `3000` | port HTTP |
| `POLL_INTERVAL_MS` | `5000` | interval cek status task (min 2000) |
| `DOWNLOAD_VIDEOS` | `1` | `0` = jangan unduh, pakai URL Wan (expired 24 jam) |
| `DATA_DIR` | `./data` | lokasi job + video |
| `FFMPEG_PATH` | `ffmpeg` | ffmpeg untuk placeholder mode mock |

## Model & resolusi

| Model | Catatan |
| --- | --- |
| `wan2.2-t2v-plus` | default, kualitas terbaik, 480P–1080P |
| `wan2.2-t2v-flash` | lebih cepat/murah |
| `wan2.1-t2v-plus` | 720P |
| `wan2.1-t2v-turbo` | tercepat untuk iterasi prompt |

Resolusi: 480P / 720P / 1080P dalam 16:9, 9:16, dan 1:1 (lihat `server/config.mjs`).

## Nambah model baru

Edit `MODELS` di `server/config.mjs` — selama endpoint-nya masih `video-synthesis` milik Model Studio, tidak perlu ubah kode lain.

## Self-host Wan (tanpa cloud)

Repo ini klien API. Kalau mau render lokal (butuh GPU), jalankan [Wan2.2](https://github.com/Wan-Video/Wan2.2) atau ComfyUI dengan workflow Wan, lalu ganti lapisan `server/wan.mjs` menjadi adapter ke endpoint lokal (ComfyUI `/prompt` + `/history`). Struktur job/queue/UI bisa dipakai apa adanya.

## Contoh hasil (sample)

`samples/neon-jakarta.mp4` — 19,8 detik, 1920×1080, 24 fps, H.264 + AAC (~8 MB).

Prompt yang dipakai:

> Neon Jakarta, hujan sore di gang sempit. Warung kopi dengan lampu neon hangat, pantulan di genangan air, aspal basah, kabel listrik bersilangan. Sinematik, teal-orange grade, anamorphic flare, grain 35mm.

Cara bikinnya (tanpa API Wan, murni lokal):

```bash
cd samples
FFMPEG_PATH=ffmpeg ./build.sh          # -> samples/neon-jakarta.mp4
```

`build.sh` merakit 5 still (`samples/src/shot-0*.jpg`, digenerate dari prompt) menjadi satu video: gerak kamera push-in / pan / pull-out / tilt, transisi `xfade`, grade + vignette + grain, title card, dan ambience hujan. Ini pipeline alternatif yang bisa dipakai saat tidak mau bayar per-detik ke API; kalau `DASHSCOPE_API_KEY` tersedia, jalur `npm start` akan memanggil Wan asli.

## Development

```bash
npm run dev     # watch mode
npm run check   # syntax check semua file
npm test        # smoke test mode mock (tanpa API key)
```

## Lisensi

MIT — lihat [LICENSE](LICENSE). Penggunaan model Wan tunduk pada syarat Alibaba Model Studio.
