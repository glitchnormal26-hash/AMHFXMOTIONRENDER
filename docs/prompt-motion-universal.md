# Prompt Motion Graphic Universal — untuk AI Coding Apa Pun

> Sumber: `docs/prompt-motion-universal.pdf` (10 halaman), disintesis dari pola 235 prompt di prompt-motion.com.
> Versi teks ini diekstrak otomatis agar bisa dibaca/di-grep oleh agent tanpa parser PDF.

Prompt Motion Graphic Universal — untuk AI
Coding Apa Pun
Apa ini: versi universal dari pola prompt motion graphic di prompt-motion.com, ditulis ulang
dari nol agar netral model — bisa ditempel ke AI coding mana pun (keluarga Claude, GPT,
Gemini, model open-source, atau Muse di sini) tanpa sisa referensi ke satu merek/model
tertentu. Bahasa: penjelasan dalam Bahasa Indonesia; teks prompt siap tempel dalam Bahasa
Inggris (bahasa yang dipakai hampir semua prompt di galeri aslinya, dan umumnya dipatuhi
paling konsisten oleh model coding). Pendamping: ringkasan lengkap 235 prompt aslinya ada
di ringkasan-semua-prompt-prompt-motion.md .
Apa yang diubah dari versi aslinya
1. Semua nama model/merek dibuang. Tidak ada lagi "Opus 5.5", "Claude", atau format
Skill khas satu platform. Peran ditulis netral: "You are an expert motion designer and front-
end developer."
2. Konteks dibuat eksplisit. Prompt asli yang bergantung riwayat chat ("lanjutkan yang
tadi") diganti placeholder [...]  yang wajib diisi — AI lain tidak punya konteks sesi kamu.
3. Renderer dibuat pilihan, bukan bawaan. Setiap prompt menyediakan blok renderer
yang bisa diganti: HTML polos + Playwright (bawaan, paling sederhana), Remotion,
HyperFrames, atau Three.js untuk 3D.
4. Ada jalur fallback. Bila AI tujuan tidak bisa menjalankan kode (chat biasa), pakai Prompt 7
— AI hanya mengeluarkan satu ﬁle HTML utuh + langkah render manual.
5. Celah galeri ditutup. Analisis situsnya sendiri menemukan 0 dari 27 prompt explainer
yang meminta cek fakta, dan hampir semua prompt lupa menyebut audiens & format. Versi
universal memasukkan baris cek fakta, audiens, dan rasio/ukuran sejak awal.
6. Anti-kaku diperkeras. Standar gerakan ditulis eksplisit: spring ﬁsika, overshoot kecil, blur
mengikuti kecepatan, tidak ada gerakan linear dan tidak ada frame membeku — gerakan
harus luwes dan hidup, bukan kaku seperti slideshow.
Cara pakai
1. Pilih satu prompt di bawah sesuai jenis video (master bila ragu).
2. Isi semua placeholder [...] ; hapus baris yang tidak relevan.
3. Pilih SATU blok renderer, hapus sisanya.
4. Tempel sebagai pesan pertama ke AI coding tujuan. Jawab pertanyaan <inputs>  bila AI
menanyakannya, lalu biarkan ia memaparkan storyboard sebelum membangun — itu bagian
dari desain prompt-nya.
5. Sesudah render pertama, pakai Checklist QC di akhir dokumen ini untuk memberi revisi yang
spesiﬁk.
Penyesuaian per jenis AI
Jenis AI tujuan Cara tempel Yang perlu diperhatikan
AI coding agentik (bisa
menulis ﬁle, menjalankan
perintah, melihat hasil
render)
Tempel utuh sebagai
tugas pertama
Ini kondisi ideal galeri aslinya. Pastikan ia
benar-benar merender dan memeriksa
frame, bukan cuma menulis kode
AI chat dengan sandbox
kode terbatas
Tempel utuh,
renderer = HTML
polos
Minta ia menjalankan render di sandbox-nya;
bila ﬀmpeg/Playwright tidak tersedia,
turunkan ke Prompt 7
AI chat tanpa eksekusi kode Pakai Prompt 7
(fallback)
Hasilnya kode HTML; render dilakukan
sendiri mengikuti langkah di prompt itu
Model open-source / lokal Pakai Prompt 7 atau
Master versi pendek
(hapus blok gotchas)
Model lebih kecil lebih patuh pada prompt
yang lebih pendek dan konkret; pertahankan
banned list dan struktur scene apa adanya
AI generator video murni
(bukan coding)
Jangan pakai
dokumen ini
Ambil hanya brief kreatifnya: konsep, daftar
scene, timing, dan banned list gaya —
metode build tidak berlaku
Prompt 1 — MASTER (semua jenis video)
<role>
You are an expert motion designer and front-end developer. You design motion
graphics at award-winning studio level and you build them yourself in code.
</role>
<inputs>
Before writing any code, ask me for anything you still need from this list:
1. Subject: [product / topic / brand name] and its one-line promise: [what it
   does, for whom]
2. The 3-5 moments that MUST appear, in order: [screens, actions, or scenes]
3. One accent color (hex): [#......]. Palette: at most 3 colors plus black
   and white.
4. One typeface: [font name, or "choose a clean geometric sans"]
5. Format: [1920x1080 landscape / 1080x1920 vertical / 1080x1080 square]
6. Music: [a royalty-free track around 120 BPM / none - design silent]
If I answer "just decide", proceed with your best choices and tell me what
you picked.
</inputs>
<direction>
Concept: commit to ONE unifying idea and name it in one line before you
start, e.g. "one shape that becomes everything" or "a dot that travels
through every scene". Every shot must grow out of the previous one through
transformation (morph, match-move, shared element), never through cuts to
unrelated scenes or crossfades.
Design rules:
- One typeface, one accent color, one consistent camera language.
- Motion must feel physical and alive: closed-form springs with a tiny
  overshoot at most, exponential ease-outs, blur that follows speed and
  direction. No linear tweens. Nothing may freeze: no holds longer than
  0.5s unless the viewer must read something.
- BANNED: particle bursts, glows, lens flares, camera shake, RGB split,
  crossfades, generic gradients, bouncy cartoon easing, corner labels or
  HUD-style text, stock-looking icons, anything that looks like a template.
</direction>
<structure>
Length: [15] seconds at [120] BPM: something visible changes on EVERY beat.
- First beat: a hook that makes the idea clear within 1 second.
- Middle: one scene per idea/moment from the inputs, in order, each flowing
  out of the last.
- Second-to-last beat: the strongest moment.
- Final half-beat: end card with [logo / name / URL / one line of copy].
- The last frame must equal the first frame (element positions included)
  so the video loops seamlessly.
</structure>
<build>
Renderer: [KEEP ONE of the renderer blocks from the Renderer Options
section below - the default is Plain HTML].
Universal build rules, whichever renderer you use:
1. Every frame is a pure function of time: seek(t). No CSS transitions, no
   timers, no state carried between frames, no unseeded randomness - the
   same t must always draw the same frame.
2. Springs are closed-form step responses. A value retargeted many times is
   the sum of one spring per retarget.
3. Text that swaps inside a moving/morphing container gets its own enter
   and exit timing so letters never overlap.
4. Render a soundtrack only if music was requested; sync every hit and cut
   to the measured beat grid.
</build>
<review>
Before the full render: render one still frame per beat and inspect them.
Fix anything cluttered, off-beat, overlapping, blurry, or hard to read.
Then render the full video and re-check the first, middle, and last frames.
</review>
<start>
Reply with: (1) the concept in one line, (2) a beat-by-beat storyboard.
Then build everything without asking me anything else, and deliver the
final MP4 plus the source file.
</start>
Opsi renderer (pilih satu, tempel ke blok <build> )
A. HTML polos + Playwright (bawaan, paling sederhana)
Renderer: ONE self-contained HTML file at the requested size. All styling
is computed from time inside seek(t). Capture with Playwright at 60fps,
3 subframes per frame blended with ffmpeg tmix for motion blur, then mux
audio with ffmpeg into the final MP4.
B. Remotion (bila produknya berbasis React)
Renderer: a Remotion project. Each scene is a React component driven only
by the current frame number (useCurrentFrame); no CSS animations or
timers. Reuse the product's real components and styles where they exist.
Render the composition to MP4 at 60fps.
C. HyperFrames
Renderer: one HTML file written for HyperFrames (timing via data
attributes, GSAP allowed for easing curves as long as every frame stays a
deterministic function of time). Render to MP4 with the HyperFrames CLI.
D. Three.js (untuk 3D sungguhan)
Renderer: ONE self-contained HTML page using Three.js from a CDN, no build
step, everything modeled in code (no downloaded models). Materials:
MeshPhysicalMaterial with varied roughness, PMREM environment lighting,
soft shadows, ACES tone mapping. Camera behaves like a film camera: every
shot is one named move (dolly, crane, orbit, push-in, rack focus), eased
in and out, and never passes through geometry. Provide a ?render mode in
which every frame is a deterministic function of time (seeded randomness
only), capturable with Playwright at 1920x1080. Watch out: set shadow bias,
keep near/far planes tight.
Prompt 2 — SHOWREEL (pamer kemampuan motion design)
Make a dynamic [15]-second motion graphics showreel that proves you are a
world-class motion designer, like a reel you would send with a resume.
First, pick ONE concept and name it in one line (for example: "ink becomes
type becomes architecture"). Commit to it for the whole video: every shot
is made out of the previous one - shapes, type, and color transform into
the next scene instead of cutting or fading.
Show this range, each with an equal share of time: kinetic type, shape
morphing, one 2D-to-3D moment, one data-or-UI moment, and an end title.
One typeface, at most 3 colors plus black and white, one camera language.
Timing: [120] BPM, something happens on every beat. First bar = hook, then
one technique per bar, strongest moment in the last full bar, end title in
the final half bar. Last frame matches the first so it loops.
BANNED: particle bursts, glows, lens flares, camera shake, RGB split,
crossfades, generic gradients, bouncy easing, holds over 0.5s, anything
template-looking. Motion is spring-based with tiny overshoot at most and
must feel smooth and physical, never stiff.
Build: one HTML file, [1920x1080], every frame a pure function of time via
seek(t) (no CSS animations, timers, or unseeded randomness). Optional
soundtrack written in code with Web Audio API: kick on every beat, a riser
into the last bar, a hit on each scene change, rendered to WAV. Render
with Playwright at 60fps, 3 subframes per frame blended with ffmpeg tmix
for motion blur, then mux the audio. Before the full render, render one
frame per beat, inspect them, and fix anything cluttered or off-beat.
Start by telling me the concept and a beat-by-beat storyboard, then build
it without asking anything else and give me the final MP4.
Prompt 3 — LAUNCH / PROMO PRODUK
Make a [15]-second launch video for [PRODUCT NAME] - [one-line promise:
what it does and for whom]. Website/reference: [URL or "none"].
If I have not given you the following, ask before building: the 3-5 real
moments to show (actual screens or actions, in order), one accent color
(hex), light or dark look, and the exact end-card text. Use real product
screens/content - never invent features, prices, or claims.
Look: brand colors [hex codes], one typeface [name], [light/dark] mode.
Study the reference first and match its typographic style and spacing,
but design the video as your own work.
Structure: hook on the promise within the first second -> the 3-5 moments
in order, each introduced by a real interaction (a cursor click, a drag, a
toggle) -> end card: logo + [URL / one line of copy]. Format: [1920x1080 /
1080x1920 vertical - design the layout for this format from frame one].
Timing: [120] BPM, a visual change on every beat; no dead time.
BANNED: glows, particle bursts, crossfades, stock-looking icons, generic
gradients, bouncy easing, corner labels, anything that looks like a
template.
Build and review: [use the <build> and <review> rules from the Master
prompt - one file, seek(t), spring motion, stills-per-beat check before
the full render]. Deliver the final MP4 and the source file.
Prompt 4 — EXPLAINER (mengajarkan topik/proses)
Make a [30]-second animated explainer about [TOPIC], for [AUDIENCE - who
they are and what they already know]. 
Accuracy first: research the topic before designing anything. Every fact,
number, name, and date on screen must be correct - never invent numbers,
quotes, or examples. If you are unsure about a fact, leave it out.
Give the video a sequence with a visible beginning, middle, and end:
[the steps / stages / scenes in order - or: "propose the sequence and
show it to me before building"]. About 5 seconds per idea. Labels appear
exactly when the thing they describe appears.
Style: [diagram / whiteboard / hand-drawn / flat 2D / 3D], palette
[colors]. Sound: [narration with TTS in (language) / music only / silent -
then every idea must be readable on screen].
End with one line that summarizes the whole explanation.
Build and review: [Master prompt <build>/<review> rules]. Deliver the
final MP4, the source file, and a short list of the facts you used with
their sources.
Prompt 5 — MORPHING UI LOOP (satu bentuk menjadi banyak
komponen)
Ask me first for: (1) 8-12 UI states the shape should become - e.g. button,
loader, checkmark, dynamic island, music player, progress bar, volume
slider, toggle, tabs, chart, command palette, toast; (2) pure black &
white or ONE accent color (hex); (3) a royalty-free track around 120 BPM
or "no music".
Direction: top-tier UI motion design. ONE shape, never cut: every state is
the same element morphing its size, radius, and color while its content
swaps with a short blur. A cursor drives every change with real clicks and
drags; drags are direct manipulation (while held, the value follows the
cursor; on release it springs back from where it was). Light warm-gray
canvas, one clean UI font, springs everywhere with a tiny overshoot at
most. The camera zooms so each state fills the frame. The last frame is
the first frame - it loops.
BANNED: bouncy easing, particle bursts, glows, gradients on UI chrome,
mismatched icon stroke widths, dead time, anything template-looking.
Structure: [120] BPM, [7] bars, something happens on every beat. Order:
[button -> loader -> check -> dynamic island -> music player (play/pause
morph) -> scrub progress bar -> becomes volume slider that stretches when
dragged past max -> toggle flips on the beat -> knob becomes a liquid tab
indicator -> tabs open into a self-drawing chart with hover tooltip ->
collapses into a command palette -> type to filter -> enter -> toast ->
back to the button]. Adapt this chain to the states I gave you.
Build: one HTML file, square [1440x1440]. Every style computed from time
inside seek(t); springs are closed-form; a twice-retargeted value is the
sum of one spring per retarget; the tab indicator's two edges ride
different springs so the leading edge stretches ahead. Analyze the track
for its beat grid and start on a downbeat. Render with Playwright, 4
subframes per frame blended with ffmpeg tmix, 60fps.
Gotchas: never put will-change on anything the camera scales (text goes
blurry); text swapping inside a morphing container needs separate enter/
exit timing; match the final frame to the first exactly, cursor included,
or the loop stutters.
Start: ask me for the inputs, then show me the state list mapped onto the
beat grid before writing any code.
Prompt 6 — VIDEO 3D (Three.js)
Build [SUBJECT/SCENE] as a real-time 3D motion piece: one self-contained
HTML page with Three.js, plus a [20]-second MP4 captured from it.
Signature shot: [describe the one shot everything builds toward, e.g.
"the pull-back that reveals the whole structure from above"]. Tell me the
signature shot and the shot list in a few lines before you build.
Shots: about 3 seconds each, one idea per shot: [shot 1 - close/macro
detail] -> [shot 2 - reveal of scale] -> [shot 3 - camera move over/around]
-> [shot 4 - one object breaks away and performs] -> [signature shot] ->
[wordmark / end card].
Camera: a film camera, not orbit controls. Each shot uses ONE named move
(dolly, crane, orbit, push-in, rack focus), eased in and out; the camera
never passes through geometry and never drifts without purpose.
Light & materials: key + fill + rim lights with soft shadows, an
environment map for reflections, fog for depth, physically based
materials with varied roughness, ACES tone mapping. Nothing may look like
a default material or a tech demo.
Motion: objects react to each other (what is hit moves, what is near
lights up), driven by springs or simple physics - never linear tweens,
never a slowly spinning object as the whole idea.
BANNED: default materials and lighting, floating text labels, glows on
everything, unseeded randomness.
Build: Three.js from a CDN, no build step, everything modeled in code.
MeshPhysicalMaterial, PMREM environment (RoomEnvironment), antialiasing,
depth of field only where a shot needs it. Hold 60fps on a laptop. Add a
?render mode: every frame a deterministic function of time, capturable
with Playwright at 1920x1080. Set shadow bias; keep near/far planes
tight; seed every random number. Capture one frame per shot, inspect,
and fix anything flat, aliased, clipping, or hard to read before the
full render.
Prompt 7 — FALLBACK: AI TANPA EKSEKUSI KODE (chat biasa)
Pakai bila AI tujuan hanya bisa menjawab teks/kode dan tidak bisa menjalankan apa pun.
Prompt-nya meminta satu ﬁle HTML utuh yang bisa dirender sendiri.
You are an expert motion designer. I will render your output myself, so
give me ONE complete, self-contained HTML file and nothing that requires
a build step.
The video: [subject/product and one-line promise]. Length [15] seconds,
[120] BPM feel (a visual change roughly every 0.5s), format [1920x1080],
palette [colors], one typeface from Google Fonts.
Concept: [one unifying idea]. Scenes in order: [list them, one line
each]. End card: [text]. Last frame = first frame (seamless loop).
Technical contract for the file:
- All animation is driven by a single function seek(t) that sets every
  element's state from time t in seconds. No CSS animations/transitions,
  no setInterval-driven state, no randomness without a fixed seed: the
  same t must always produce the identical frame.
- Motion: implement closed-form spring easing in plain JavaScript;
  overshoot stays tiny; no linear motion; nothing freezes for over 0.5s.
- Expose window.seek(t) globally, pause any autoplay, and make the page
  exactly the requested pixel size with no scrollbars.
- No external assets except Google Fonts and CDN libraries you name.
BANNED: particle bursts, glows, lens flares, RGB split, crossfades,
generic gradients, bouncy easing, corner/HUD text, template look.
After the code, add a short "How to render" section: the exact Playwright
or headless-Chrome + ffmpeg commands to capture 60fps frames (3 subframes
per frame, ffmpeg tmix for motion blur) and mux the final MP4.
Do not explain the design at length - code first, instructions second.
Cara render hasil Prompt 7 secara manual (ringkas): simpan ﬁle sebagai index.html  →
buka dengan Playwright/headless Chrome → untuk tiap frame, panggil seek(t) , screenshot →
gabung dengan ﬀmpeg (ffmpeg -framerate 60 -i frame-%05d.png -c:v libx264 -pix_fmt
yuv420p out.mp4 ). Untuk motion blur, tangkap 3 subframe per frame dan rata-ratakan dengan
ﬁlter tmix .
Banned List Universal (tempel ke prompt apa pun)
BANNED: particle bursts, glows and neon, lens flares, shockwave rings,
RGB split, camera shake, crossfades and blur-ins, bouncy/cartoon easing,
generic gradients, grid floors, flashing backgrounds, stock footage or
stock UI kits, corner labels and HUD-style text, long holds and dead
time, unseeded randomness, and anything that looks like a template.
Instead: every transition grows out of an element already on screen;
motion is connected, spring-based, and purposeful.
Checklist QC (pakai sesudah render pertama)
Periksa frame demi frame sebelum menerima hasil AI mana pun:
[ ] Beat pertama sudah menjelaskan ide video dalam 1 detik pertama?
[ ] Ada perubahan visual di setiap beat? Ada frame membeku >0,5 detik tanpa alasan baca?
[ ] Semua transisi tumbuh dari elemen sebelumnya (bukan crossfade/cut acak)?
[ ] Gerakan terasa pegas & hidup — tidak linear, tidak kaku, overshoot tidak berlebihan?
[ ] Teks tidak pernah tumpang tindih, tidak blur saat kamera bergerak, terbaca pada ukuran
ﬁnal?
[ ] Warna aksen & font konsisten di semua scene? Tidak ada glow/partikel/efek terlarang
yang menyelip?
[ ] Frame terakhir persis sama dengan frame pertama (termasuk posisi kursor/elemen) —
loop mulus?
[ ] Fakta/angka/klaim di layar benar dan tidak dikarang (khusus explainer & launch)?
[ ] Format & ukuran sesuai tujuan (mis. 9:16 untuk feed ponsel) sejak frame pertama?
Dokumen ini adalah komposisi orisinal yang mensintesis pola dari 235 prompt di prompt-
motion.com (lihat dokumen pendamping untuk ringkasan tiap prompt beserta URL aslinya).
Tidak ada teks prompt situs yang disalin utuh di sini.