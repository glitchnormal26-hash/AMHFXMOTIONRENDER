# Adelian Althania English Adventure

Game belajar bahasa Inggris (kelas 4) dalam satu berkas: `index.html`. Buka langsung di browser.

## Yang baru
- **Karakter 2.5D dinamis**: karakter berlapis (punggung/badan/kepala) dengan napas, kedip, ayunan rambut, kepala menoleh, dan kemiringan paralaks mengikuti kursor/gyro. Monster & pet ikut beranimasi.
- **Tema 2.5D**: kartu & tombol berkedalaman, latar paralaks.
- **Open World** (tab 🧭): pulau isometrik acak (seed) dengan desa, hutan, gurun, salju, sakura, gunung; siang-malam, hujan, kristal kata, peti, monster & 4 penjaga (kuis bahasa Inggris), misi NPC, kamus, peta & perjalanan cepat, simpan otomatis.
  Kontrol: panah/WASD/joystick, ketuk untuk jalan otomatis, E = aksi, Spasi = lompat, Shift = lari, Esc = menu.
- Perbaikan bug: normalisasi data simpanan, pembuatan karakter, validasi nama, rambut preset, heal Luna, toast panen, statistik jual, tombol kembali di layar buat karakter, dll.

## Pembaruan Open World (tahap 2)
- **Kuis lebih variatif**: gambar→Inggris, Indonesia↔Inggris, dengar-pilih, **grammar**, dan **susun kalimat**. Pertarungan bisa memakai **kemampuan teman** (Coret 2, Arti, Sembuh, Perisai, Beruntung, Lewati; 1× per pertarungan). Level ★★★ punya **timer 12 detik**.
- **Mode Bantuan Suara** (menu ☰): ketuk pilihan sekali untuk mendengarnya, ketuk lagi untuk memilih; tombol lebih besar.
- **Latih Kata Sulit**: kata yang sering salah dikumpulkan dan bisa diulang.
- **Laporan Belajar** (guru/orang tua): kata dikuasai (benar ≥3×), akurasi per topik, kata lemah, waktu main; bisa disalin.
- **Misi baru**: antar surat ke desa lain ✉️ dan "dengar lalu cari kristal" 🔊 (petunjuk panas/dingin).
- **Hujan di Open World menyiram kebun** (tanaman yang sedang tumbuh jadi lebih cepat).
- Visual: cerobong + asap, kilau air, paralaks di adegan; **kualitas grafis adaptif** (turun otomatis jika lambat) dan menghormati `prefers-reduced-motion`.
- Aksesibilitas: dialog ber-`role`, fokus keyboard, pengumuman layar pembaca, tombol ≥44px.

## Pembaruan Petualangan & Koleksi (tahap 3)
- **Petualangan 2.0**: tiap chapter kini 8 stage (sebelumnya 4); boss di stage terakhir. Peta berbentuk ular dengan penanda posisi pemain dan bar bintang per chapter. Simpanan lama dimigrasi otomatis.
- **Mode baru**: 💬 *Percakapan* (8 skenario obrolan, balasan bahasa Inggris) dan 🧺 *Tangkap Kata* (arkade kata jatuh sesuai tema). Keduanya juga ada di tab Latihan.
- **Lebih interaktif**: pratinjau stage (tujuan bintang), Gelombang 2 + pilih *Boon* di tengah stage, boss 3 fase (mengamuk di fase 3), Serangan Kombo tiap 3 jawaban benar, pahlawan di arena dengan animasi serang/terluka.
- **Kelas kelangkaan 5 tingkat**: Umum ★, Langka ★★, Epik ★★★, Legendaris ★★★★, Mitos ★★★★★. Kelas 4 butuh Level 4, kelas 5 butuh Level 7 untuk dibeli. Filter kelas & urutan di lemari.
- **Koleksi jauh lebih banyak**: rambut (29), kostum (30), sayap (19), fashion (19), aksesori (26), pet (21), furnitur (59), plus kategori baru **Aura** (10), **Dinding** (12) dan **Lantai** (9) untuk kamar.

## Pengembangan
Sunting `src/index.template.html`, `src/openworld.js`, `src/adv_data.js`, `src/adventure.js` dan `src/catalog.js`, lalu jalankan `python3 build.py` untuk menghasilkan `index.html`.
`tools/` berisi skrip uji headless (puppeteer-core + Chromium) yang dipakai untuk verifikasi.
