# Skill, Cara Kerja, dan Optimasi Produksi Motion Graphic

Dokumen ini menjelaskan kemampuan, metode produksi, dan optimasi yang digunakan pada proyek **10 video cybersecurity greenscreen**. Dokumen juga dapat dipakai sebagai panduan untuk batch berikutnya. Keterangan hasil mengacu pada implementasi dan pemeriksaan proyek ini; bagian pengembangan berikutnya merupakan usulan.

- Repository: [AMHFXMOTIONRENDER](https://github.com/glitchnormal26-hash/AMHFXMOTIONRENDER).
- Branch proyek: `render/cybersecurity-greenscreen-10`.
- Folder source: `project/cybersecurity/`.
- Integrasi motion di repository: **Motion Designer v3.9.4**.

## 1. Skill yang digunakan

| Kemampuan | Cara penerapan | Hasil dalam proyek |
|---|---|---|
| Interpretasi brief | Mengubah kebutuhan visual menjadi batas teknis dan keputusan desain | 10 klip individual, greenscreen, tanpa branding, ruang kosong, gerakan internal |
| Art direction | Menetapkan siluet, material, warna, hirarki, serta penempatan objek | Permukaan navy berlapis, tepi bevel, detail biru-putih |
| Ilustrasi vektor | Membuat kontur dan detail SVG yang dapat dirasterisasi pada resolusi keluaran | Sepuluh motif dengan struktur visual berbeda |
| Motion design | Mengatur tempo, fase, easing, dan gerakan pendukung sesuai fungsi objek | Aliran data, pemindaian, indikator, serta mekanisme brankas |
| Animasi deterministik | Menghitung keadaan visual dari waktu eksplisit melalui GSAP dan fungsi periodik | Frame dapat direproduksi dengan `OPENER.seek(t)` |
| Integrasi renderer | Memakai pipeline browser → FFmpeg dari repository | MP4 H.264 pada 3840 × 2160 |
| QA visual dan teknis | Memeriksa frame contoh, metadata, decode, dan perubahan piksel | Bukti visual serta laporan pemeriksaan terpisah |
| Pengelolaan GitHub | Menyimpan source pada branch proyek dengan commit yang dapat ditinjau | Source, konfigurasi, dan dokumentasi dapat digunakan kembali |

Panduan ini mendeskripsikan workflow proyek. Menggunakannya untuk proyek lain tetap membutuhkan runtime, dependensi, aset, serta pemeriksaan hasil yang sesuai.

## 2. Spesifikasi produksi

| Parameter | Nilai |
|---|---|
| Jumlah video | 10 file individual |
| Durasi | 10 detik per file |
| Resolusi | 3840 × 2160, UHD 4K |
| Rasio | 16:9 |
| Frame rate | 30 fps |
| Jumlah frame | 300 per file; 3.000 frame seluruh batch |
| Container / codec | MP4 / H.264 `libx264` |
| Pixel format | `yuv420p` |
| Preset encoder | `medium` |
| Target bitrate | 16 Mbps VBR |
| Batas bitrate / buffer | 20 Mbps / 32 Mb |
| Latar source | Hijau rata `#00FF00` |
| Kamera | `LOCKED_INTENTIONAL` |
| Audio dan teks layar | Tidak digunakan |

**Target bitrate berbeda dari bitrate aktual.** Pada hasil batch ini, bitrate video aktual sekitar **0,41–3,95 Mbps**, karena sebagian besar gambar berupa latar seragam dengan perubahan kecil. Resolusi dan jumlah frame tetap sesuai spesifikasi. Preset `medium` mengatur kompromi kecepatan dan efisiensi encoder; preset tersebut tidak menetapkan bitrate.

MP4 ini menggunakan latar hijau untuk chroma key, tanpa kanal alpha. Konversi warna dan subsampling H.264 dapat membuat nilai RGB hasil decode sedikit berbeda dari warna hijau source.

## 3. Cara kerja

### A. Memeriksa brief dan lingkungan

1. Catat jumlah klip, durasi, resolusi, rasio, fps, kebutuhan audio, branding, serta format penyerahan.
2. Periksa repository, aturan proyek, entry point renderer, dan dependensi yang tersedia.
3. Siapkan branch khusus untuk source proyek.
4. Uji jalur render sebelum menghabiskan waktu pada ekspor seluruh batch.

Dalam proyek ini, unduhan browser bawaan gagal tersambung. Alternatif yang berhasil dipakai adalah paket `@sparticuz/chromium@153.0.0`, melalui adapter browser lokal.

### B. Menentukan bahasa visual dan variasi

Tetapkan satu keluarga material dan warna, lalu bedakan objek utama, siluet, susunan detail, serta perilaku animasi setiap klip. Perbedaan konsep harus terlihat saat gambar dibekukan.

| Klip | Objek utama | Gerakan internal |
|---|---|---|
| 01 | Circuit shield | Pulsa pada jalur sirkuit dan indikator |
| 02 | Biometric scan | Garis pemindai vertikal pada pola sidik jari |
| 03 | Encrypted vault | Putaran kecil mekanisme dan pergeseran baut |
| 04 | Packet firewall | Paket data melintasi sel perlindungan |
| 05 | Cloud lock | Aliran pada jalur data serta indikator bertahap |
| 06 | Cryptographic processor | Aktivasi sel dan pulsa rangkaian |
| 07 | Zero trust network | Aliran terminal menuju node terlindungi |
| 08 | Secure document | Perubahan panjang garis dokumen dan indikator |
| 09 | Threat scanner | Sapuan radar dan titik deteksi |
| 10 | Hardware key | Aliran data pada batang kunci |

### C. Menjaga ruang kosong dan greenscreen

- Tempatkan objek ke sisi kiri atau kanan sehingga sisi berlawanan dapat digunakan untuk komposit atau teks tambahan.
- Pertahankan latar rata; hindari gradasi atau tekstur pada bidang hijau.
- Gunakan warna objek yang terpisah dari warna key.
- Batasi blur, bloom, dan transparansi pada tepi luar agar pemisahan objek lebih mudah.
- Periksa detail kecil di luar kontur, margin, serta bagian objek yang berpotensi terpotong.

Kamera dikunci untuk memenuhi brief gerakan internal dan menjaga ruang komposit tetap stabil. Pilihan ini khusus untuk kebutuhan tersebut; proyek dengan perpindahan fokus atau penjelasan spasial dapat membutuhkan kamera aktif.

### D. Menghubungkan animasi ke waktu tunggal

Waktu frame ditentukan oleh:

```text
t = nomor_frame / fps
```

Pada 30 fps, renderer mengambil frame bernomor `0` sampai `299`, yaitu waktu `0` sampai sekitar `9,9667` detik. Seluruh stream memiliki durasi 10 detik.

Implementasi menggunakan timeline GSAP yang dipause dan digerakkan melalui `OPENER.seek(t)`. Gerakan periodik dihitung langsung dari waktu, bukan dari penambahan posisi setiap putaran render.

Contoh bentuk siklus halus:

```js
function cycle(t, period = 10, phase = 0) {
  return (1 - Math.cos(2 * Math.PI * (t / period + phase))) / 2;
}
```

Periode 5 atau 10 detik cocok dengan durasi klip. Fase berbeda membantu indikator terlihat saling terkait tanpa semuanya berubah bersamaan. Gerakan dengan kecepatan tetap digunakan untuk fungsi seperti aliran data dan sapuan radar.

### E. Meninjau gambar sebelum ekspor penuh

Ambil frame pada `0`, `2,5`, `5`, `7,5`, dan sekitar `9,967` detik. Periksa gambar penuh serta crop detail untuk menilai siluet, kontras, kepadatan detail, margin, dan perbedaan antarvideo.

Perbaikan nyata pada batch ini meliputi pemindahan baut yang keluar dari siluet dan penghapusan busur luar pada ilustrasi kunci.

### F. Mengekspor dan memeriksa file

Pipeline yang digunakan:

```text
GSAP seek → Chromium merender SVG → screenshot PNG
→ stream ke FFmpeg → MP4 H.264 → ffprobe dan pemeriksaan decode
```

PNG tiap frame langsung dikirim ke stdin FFmpeg. Urutan ribuan file PNG tidak perlu disimpan selama render normal. Frame contoh tetap disimpan untuk QA. Opsi MP4 `faststart` memindahkan metadata agar pemutaran progresif lebih praktis.

## 4. Optimasi yang sudah diterapkan

| Optimasi | Tujuan | Batas dan pertimbangan |
|---|---|---|
| SVG + GSAP | Menjaga garis tajam dan menyediakan kontrol waktu langsung | Sesuai untuk ilustrasi 2D pada brief ini |
| Geometri dan helper bersama | Memakai ulang konstruksi material, jalur, indikator, dan detail | Siluet dan komposisi setiap motif tetap dibuat berbeda |
| Source bebas aset jaringan saat render | Mengurangi ketergantungan unduhan selama pengambilan frame | Dependensi harus terpasang terlebih dahulu |
| Streaming PNG ke encoder | Mengurangi I/O dan kebutuhan ruang untuk frame sementara | Screenshot dan encoding tetap membutuhkan CPU serta memori |
| Tiga worker render | Memproses beberapa klip bersamaan | Belum dibandingkan dengan semua konfigurasi worker lain |
| Dua thread encoder per worker | Membatasi persaingan sumber daya antarproses FFmpeg | Chromium juga memakai sumber daya di luar thread encoder |
| Pemeriksaan frame sebelum render | Menemukan masalah komposisi lebih awal | Frame sampel tidak menggantikan tinjauan visual playback penuh |
| VBR dengan batas maksimum | Menyesuaikan data video dengan kompleksitas gambar | Target bitrate tidak menjamin bitrate rata-rata tertentu |
| Pemilihan ID klip | Memungkinkan render ulang hanya pada klip yang perlu diperbaiki | Batch belum menyediakan deteksi otomatis source yang berubah |
| MP4 di luar source Git | Menjaga repository tetap berisi source yang mudah ditinjau | Media perlu diserahkan dan disimpan secara terpisah |

Menurut log batch lokal, ekspor 10 klip berlangsung sekitar **8 menit 38 detik** dari start worker pertama hingga klip terakhir selesai. Angka tersebut tidak mencakup desain, instalasi, seluruh QA, atau penyerahan file, dan bukan jaminan kecepatan di komputer lain.

## 5. Struktur file penting

| File | Fungsi |
|---|---|
| `scene.html` | Stage SVG dan pemuatan GSAP |
| `scene.js` | Sepuluh ilustrasi, helper grafis, serta logika animasi |
| `browser-setup.mjs` | Adapter Chromium untuk lingkungan produksi ini |
| `inspect.mjs` | Pengambilan frame contoh untuk setiap klip |
| `render-batch.mjs` | Antrean render tiga worker dan konfigurasi ekspor |
| `verify.py` | Validasi file hasil encode |
| `delivery-manifest.json` | Spesifikasi, keputusan kamera, dan status pemeriksaan |
| `DIRECTION.md` | Arah visual, konsep, serta prinsip referensi |
| `../../scripts/export-mp4.mjs` | Renderer streaming utama repository |

## 6. Menjalankan ulang

Perintah berikut dijalankan dari root repository pada branch proyek. Dibutuhkan Node.js 22+, Python dengan Pillow dan NumPy untuk QA, serta `ffmpeg` dan `ffprobe` pada PATH.

```bash
git switch render/cybersecurity-greenscreen-10
npm ci
npm install --no-save --package-lock=false @sparticuz/chromium@153.0.0
mkdir -p tmp output/cybersecurity

npm run check
TMPDIR="$PWD/tmp" node project/cybersecurity/inspect.mjs
TMPDIR="$PWD/tmp" node project/cybersecurity/render-batch.mjs
python3 project/cybersecurity/verify.py
```

Untuk merender ulang klip tertentu:

```bash
TMPDIR="$PWD/tmp" node project/cybersecurity/render-batch.mjs 2 9
```

Pemeriksa `verify.py` mengharapkan seluruh 10 MP4 berada dalam folder output. Jalankan pemeriksa lengkap setelah semua hasil tersedia. Script render dapat menimpa file output dengan nama yang sama.

Pada lingkungan produksi ini, ekstraksi arsip Chromium sempat gagal karena operasi perubahan kepemilikan file tidak didukung. Arsip lokal kemudian diekstrak tanpa mengubah kepemilikan. Adapter yang disimpan tidak mengotomatiskan penanganan kasus tersebut; lingkungan dengan pembatasan serupa mungkin memerlukan penyesuaian instalasi browser.

### Parameter yang dapat disesuaikan

`render-batch.mjs` menetapkan parameter berikut secara eksplisit. Ubah nilainya di script jika menjalankan batch. Exporter utama juga menerima parameter tersebut melalui environment.

| Parameter | Nilai batch | Pengaruh |
|---|---|---|
| `WIDTH`, `HEIGHT` | `3840`, `2160` | Dimensi rasterisasi dan keluaran |
| `FPS` | `30` | Jumlah sampel animasi per detik |
| `PRESET` | `medium` | Kompromi waktu encode dan efisiensi kompresi |
| `VIDEO_BITRATE` | `16M` | Target bitrate video |
| `VIDEO_MAXRATE` | `20M` | Batas laju bitrate encoder |
| `VIDEO_BUFSIZE` | `32M` | Ukuran buffer pengendalian bitrate |
| `ENCODE_THREADS` | `2` | Thread FFmpeg per worker |

Label `QUALITY=fast` pada batch merupakan pilihan default exporter. Batch tetap menimpa fps dan preset secara eksplisit menjadi 30 fps dan `medium`.

## 7. Verifikasi dan batas hasil

Pemeriksaan yang sudah dilakukan:

- Sepuluh file memiliki resolusi 3840 × 2160, 30 fps, 300 frame, dan durasi 10,000 detik.
- Seluruh file berhasil didecode oleh FFmpeg tanpa error yang dilaporkan.
- Renderer tidak melaporkan page error atau request failure.
- Piksel pada frame awal dan 2,5 detik menunjukkan adanya perubahan animasi.
- Area hijau diuji pada frame sampel hasil encode. Proporsinya sekitar 85,7–96,8% dari seluruh frame; angka ini mencakup semua latar hijau, bukan hanya satu bidang copyspace.
- Hash setiap file berbeda. Perbedaan desain juga diperiksa secara visual, karena hash berbeda saja tidak membuktikan visual unik.
- Semua MP4 diputar otomatis sampai selesai pada playback rate 1 tanpa browser error.
- Pada pengujian sambungan loop brankas, raster pada waktu 0 dan 10 detik identik. Pengujian piksel tersebut tidak dijalankan untuk setiap motif.

**Status yang dicatat: `TECHNICAL_VERIFIED; STILL_FRAMES_REVIEWED`.**

Tinjauan visual berkelanjutan terhadap seluruh playback pada kecepatan normal belum dinyatakan selesai. Pemutaran otomatis, decode tanpa error, dan inspeksi frame merupakan bukti yang berbeda. Manifest tetap mencatat `normal_speed_visual_playback: NOT_VERIFIED`, sehingga dokumen ini tidak memberikan status kreatif `FINAL_VERIFIED`.

Validasi warna pada satu frame juga tidak membuktikan kebersihan matte pada semua frame atau semua aplikasi compositing. Uji key pada latar tujuan tetap berguna sebelum publikasi.

## 8. Optimasi untuk batch berikutnya

Usulan berikut **belum diterapkan atau dibenchmark** pada batch ini:

1. **Ukur kapasitas worker.** Bandingkan waktu dan pemakaian memori pada satu, dua, dan tiga worker untuk scene yang sama.
2. **Tambahkan resume per klip.** Lewati output hanya jika checksum source, konfigurasi, serta validasi file masih cocok.
3. **Pisahkan geometri statis dan atribut dinamis lebih jauh.** Ukur manfaatnya sebelum mengubah renderer.
4. **Buat matriks QA lintas waktu.** Periksa area hijau, bounding box, dan sambungan loop pada seluruh motif, lalu tinjau playback penuh.
5. **Sediakan preset delivery khusus.** Bedakan MP4 preview, MP4 distribusi, dan master compositing. Format dengan alpha atau chroma lebih tinggi dapat dipertimbangkan bila diperlukan.
6. **Gunakan konfigurasi batch terpusat.** Pindahkan parameter output dan daftar klip ke konfigurasi yang tervalidasi agar perubahan tidak tersebar di beberapa script.
7. **Benchmark encoder alternatif bila tersedia.** Ukur kualitas tepi, ukuran file, kompatibilitas, dan waktu render sebelum mengganti `libx264`.

Untuk produksi berikutnya, urutan praktisnya adalah: tetapkan brief, siapkan beberapa frame dan contoh gerakan, uji satu ekspor pendek, periksa hasil nyata, lalu jalankan batch dan validasi setiap file.
