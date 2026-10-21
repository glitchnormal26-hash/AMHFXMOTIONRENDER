# Catatan Belajar — "Prompt Motion Graphic Universal" × skill `amhfxmotionrender`

Dipelajari 2026-10-21 dari `docs/prompt-motion-universal.pdf` (10 hlm; teks lengkap:
`docs/prompt-motion-universal.md`). Dokumen ini = sistem prompt netral-model (bisa ditempel
ke AI coding mana pun) yang disintesis dari pola 235 prompt prompt-motion.com.

## 1. Isi dokumen (inventaris)

| Prompt | Untuk | Panjang/format default |
|---|---|---|
| 1 MASTER | semua jenis video (default bila ragu) | 15 s @ 120 BPM, 1920×1080 |
| 2 SHOWREEL | pamer kemampuan motion design | 15 s, 5 teknik @ 1 bar |
| 3 LAUNCH/PROMO | video produk, layar/aksi asli | 15 s, landscape/vertikal |
| 4 EXPLAINER | mengajar topik/proses | 30 s, ±5 s per ide |
| 5 MORPHING UI LOOP | satu bentuk → 8–12 state UI | 1440×1440, 7 bar, loop |
| 6 VIDEO 3D | Three.js, film-camera moves | 20 s, shot ±3 s |
| 7 FALLBACK | AI chat tanpa eksekusi kode | 1 file HTML + langkah render manual |

Plus: 4 opsi renderer (A HTML polos+Playwright, B Remotion, C HyperFrames, D Three.js),
**Banned List Universal**, dan **Checklist QC 9 butir**.

## 2. Yang SUDAH selaras dengan skill repo ini

- **Renderer A ≡ arsitektur repo ini**: satu HTML self-contained, semua gaya dihitung dari
  waktu (`seek(t)`), capture headless-Chrome per frame, mux ffmpeg → MP4. Persis alur
  `scripts/export-mp4.mjs` (INDEX/VOICEOVER/AUDIO/OUT_VIDEO/QUALITY/FPS) yang dipakai
  project `cinematic-photo-youtube`.
- Frame = fungsi murni waktu, tanpa CSS transition/timer, random harus ber-seed, spring
  closed-form (nilai yang di-retarget berkali-kali = jumlah satu spring per retarget) —
  sama dengan aturan runtime skill (`references/full-runtime.md`, bagian warp/seek kita).
- Review stills sebelum render penuh: dokumen minta "satu still per beat"; kita sudah
  melakukan padanannya lewat `scripts/snap.mjs` + contact sheet (qa4/qa4b/qc5).
- Anti-template / anti-kaku: larangan hold >0,5 s, gerakan linear, dan "slideshow feel"
  sejalan dengan `references/anti-ppt.md` dan failure-gates repo.

## 3. Hal BARU yang layak diadopsi untuk project berikutnya

1. **Beat grid BPM**: tentukan BPM di awal; "sesuatu berubah di SETIAP beat"; hit dimulai
   di downbeat; musik/whip disinkronkan ke grid beat yang terukur — bukan timing manual
   bebas. (v2 kita pakai WHIPS hasil warp; berikutnya kuantisasi WHIPS ke grid BPM sejak
   `tools/make-score.py`.)
2. **Seamless loop** untuk Shorts/Reels/loop sosial: frame terakhir = frame pertama,
   termasuk posisi kursor/elemen. Tambahkan cek loop di QC bila outputnya loop.
3. **Concept-first**: satu kalimat ide pemersatu ("one shape that becomes everything")
   + storyboard beat-by-beat disampaikan SEBELUM koding; setiap shot tumbuh dari shot
   sebelumnya lewat transformasi (morph/match-move/shared element), bukan cut acak.
4. **Daftar `<inputs>` kickoff** (tanya user di awal, seperti pola ask_user kita):
   subject + one-line promise; 3–5 momen wajib (urut); 1 warna aksen hex (palet ≤3 warna
   + hitam-putih); 1 typeface; format/rasio; musik (±120 BPM / none).
5. **Explainer: akurasi dulu** — riset sebelum mendesain, jangan mengarang angka/kutipan,
   dan serahkan daftar fakta + sumbernya bersama MP4. Baris audiens & format eksplisit
   sejak awal (celah yang ditemukan di 27 prompt explainer aslinya).
6. **Banned list universal** (tempel ke prompt apa pun): particle bursts, glow/neon, lens
   flare, shockwave, RGB split, camera shake, crossfade/blur-in, bouncy-cartoon easing,
   generic gradient, grid floor, stock footage/UI kit, corner-label & HUD-style text,
   hold panjang, unseeded randomness, tampilan template.
   ⚠️ Catatan konteks: untuk **long-form naratif** kita (contoh: cinematic-photo-youtube)
   caption TikTok di HUD bawah + vignette sengaja dipakai atas persetujuan user — banned
   list diterapkan ketat untuk **short promo/reel/loop**, sedangkan untuk explainer
   panjang teks-on-screen yang terbaca tetap menang.
7. **Checklist QC 9 butir** (dijalankan SEBELUM menerima render): hook 1 detik; perubahan
   tiap beat & tak ada freeze >0,5 s; transisi tumbuh dari elemen sebelumnya; gerakan
   pegas-hidup; teks tak tumpang tindih/blur saat kamera gerak; aksen & font konsisten,
   tak ada efek terlarang menyelip; frame akhir = frame awal (bila loop); fakta benar;
   format/rasio benar sejak frame pertama.
8. **Gap teknis vs repo**: dokumen menyarankan motion blur via 3 subframe/frame +
   `ffmpeg tmix`; `export-mp4.mjs` saat ini capture 1 frame per tick (blur ditangani di
   level komposisi/CSS). Untuk shot cepat berikutnya: pertimbangkan opsi subframe+tmix,
   atau tetap andalkan motion blur artistik di dalam comp (lebih murah secara render).

## 4. Playbook project berikutnya (resep cepat)

1. Kickoff: kumpulkan `<inputs>` (subject, momen wajib, aksen hex, font, format, musik)
   — pakai ask_user bila ada yang kosong; "just decide" → pilih & laporkan pilihan.
2. Tulis satu kalimat konsep + storyboard beat-by-beat (grid BPM), tunjukkan ke user.
3. Pilih prompt dasar: promo produk → #3; explainer → #4 (+ ekstensi long-form ala project v2:
   chapter, VO TTS, caption karaoke); reel/loop → #2/#5; 3D → #6; tanpa eksekusi → #7.
4. Build dengan Renderer A = repo ini: `projects/<nama>/index.html` (seek-deterministic,
   spring closed-form, banned list ditempel), skor musik `tools/make-score.py` terkuantisasi
   beat, VO via audio project (skill melarang TTS di dalam skill — jalur kita: generate
   terpisah → `AUDIO=` mix final, seperti v2).
5. QA: `scripts/snap.mjs` satu still per beat → contact sheet → baca → perbaiki; baru
   render penuh `scripts/export-mp4.mjs` (REQUIRE_AUDIO=1) → cek `verify.json` +
   loudness ebur128 (target −16 LUFS untuk YouTube) + Checklist QC 9 butir di atas.
6. Deliver: MP4 (master CRF18 lokal; salinan Drive <100 MB CRF20), source file, daftar
   fakta+sumber (explainer), commit ke branch project.

## 5. Pemetaan cepat prompt → deliverable

- **#1 Master** → template default semua job baru di repo ini.
- **#3 Launch** → pakai layar/konten produk ASLI; jangan mengarang fitur/harga/klaim.
- **#4 Explainer** → pola cinematic-photo-youtube adalah perpanjangannya ke long-form
  (±4 mnt, chapter YouTube, VO + caption karaoke); untuk 30 s pakai utuh.
- **#5 Morphing UI** → gotcha penting: jangan `will-change` pada elemen yang di-scale
  kamera (teks blur); teks yang berganti di dalam container morph butuh timing
  enter/exit terpisah; dua tepi indikator tab menaiki spring berbeda (leading edge
  melar duluan); drag = direct manipulation + spring-back saat rilis.
- **#6 Three.js** → MeshPhysicalMaterial + PMREM (RoomEnvironment), ACES tone mapping,
  key/fill/rim + soft shadow, fog; kamera = satu named move per shot, tak pernah
  menembus geometri; `?render` mode deterministik; shadow bias + near/far ketat.
- **#7 Fallback** → kontrak teknis file HTML tunggal (`window.seek(t)` global, autoplay
  off, ukuran pixel tepat, tanpa scrollbar) + seksi "How to render" manual.
