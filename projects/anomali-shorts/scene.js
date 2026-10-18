const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d', { alpha: false });
const W = 1080;
const H = 1920;
const params = new URLSearchParams(location.search);
const requestedId = Math.max(1, Math.min(10, Number(params.get('id') || 1)));

const stories = [
  {
    id: 1,
    slug: 'cctv-0313',
    title: 'LORONG 03:13',
    hook: 'LORONGNYA\nYANG MENDEKAT.',
    audioDuration: 38.688,
    accent: '#ff3b30',
    captions: [
      'FILE ANOMALI 001', 'Pukul 03:13', 'kamera kos merekam', 'lorong yang KOSONG.',
      'Pintu kamar tujuh', 'terbuka SENDIRI.', 'Kamar itu disegel', 'sejak dua tahun lalu.',
      'Lihat bayangannya.', 'Ia tidak mendekat.', 'LORONGNYA yang memendek.', 'Monitor mati 11 detik.',
      'Saat menyala lagi…', 'bayangan itu sudah', 'di belakang SATPAM.', 'Kalau jam menunjukkan 03:13…',
      'JANGAN LIHAT BELAKANG.'
    ]
  },
  {
    id: 2,
    slug: 'lantai-nol',
    title: 'TOMBOL LANTAI 0',
    hook: 'GEDUNG INI\nTAK PUNYA LANTAI 0.',
    audioDuration: 44.976,
    accent: '#f6c453',
    captions: [
      'FILE ANOMALI 002', 'Lift ini punya 12 lantai.', 'Tapi Kamis dini hari…', 'tombol NOL muncul',
      'selama delapan detik.', 'Seseorang menekannya.', 'Pintu terbuka ke', 'koridor yang sama.',
      'Semua jam berjalan MUNDUR.', 'Di ujung lorong…', 'dirinya sendiri menunggu.', 'Ia menutup pintu.',
      'Sejak malam itu', 'pantulannya selalu terlambat.', 'Jika tombol nol muncul…', 'JANGAN DITEKAN.',
      'Itu mungkin SALINAN.'
    ]
  },
  {
    id: 3,
    slug: 'voice-note-besok',
    title: 'VOICE NOTE DARI BESOK',
    hook: 'PENGIRIMNYA:\nNOMORNYA SENDIRI.',
    audioDuration: 40.824,
    accent: '#65f3d3',
    captions: [
      'FILE ANOMALI 003', 'Jam sebelas malam…', 'Raka menerima voice note', 'dari NOMORNYA SENDIRI.',
      'Durasi 31 detik.', '“Jangan naik motor besok.”', 'Pagi berikutnya…', 'voice note kedua masuk.',
      'Rem. Benturan.', 'Seseorang menyebut namanya.', 'Raka tinggal di rumah.', 'Tepat pukul sebelas…',
      'ponselnya merekam SENDIRI.', 'Di layar tertulis:', 'MENGIRIM KE KEMARIN.', 'Siapa pengirim pertama?'
    ]
  },
  {
    id: 4,
    slug: 'frekuensi-merah',
    title: 'FREKUENSI MERAH',
    hook: 'RADIO INI\nMENYEBUT NAMA WARGA.',
    audioDuration: 42.168,
    accent: '#ff4057',
    captions: [
      'FILE ANOMALI 004', 'Setelah tengah malam…', 'radio tua menangkap', 'SATU SIARAN.',
      'Suara perempuan membaca', 'nama warga satu per satu.', 'Setiap nama disebut…', 'lampu rumahnya PADAM.',
      'Malam ketiga,', 'nama pemilik radio disebut.', 'Kabelnya dicabut.', 'Suaranya tetap keluar.',
      '“Kami tidak memakai listrik.”', 'Pagi berikutnya…', 'warung itu HILANG', 'dari pantulan kaca.'
    ]
  },
  {
    id: 5,
    slug: 'bayangan-delay',
    title: 'BAYANGAN TERLAMBAT',
    hook: 'BAYANGANNYA\nPUNYA WAKTU SENDIRI.',
    audioDuration: 45.768,
    accent: '#bd7cff',
    captions: [
      'FILE ANOMALI 005', 'Awalnya gangguan kecil.', 'Bayangan Sinta bergerak', 'DUA DETIK TERLAMBAT.',
      'Saat ia berhenti…', 'bayangannya masih berjalan.', 'Saat ia melambaikan tangan…', 'bayangannya DIAM.',
      'Video terakhir:', 'Sinta tidur di kasur.', 'Bayangannya berdiri', 'menghadap KAMERA.',
      'Pukul dua belas…', 'bayangan keluar dari bingkai.', 'Sinta menghilang.', 'Tersisa siluet baru.',
      'Kini bergerak LEBIH DULU.'
    ]
  },
  {
    id: 6,
    slug: 'kamar-404',
    title: 'KAMAR 404',
    hook: 'KAMAR INI\nTAK ADA DI DENAH.',
    audioDuration: 46.896,
    accent: '#ffbf4a',
    captions: [
      'FILE ANOMALI 006', 'Hotel ini tak punya', 'kamar empat nol empat.', 'Denah melompat ke 405.',
      'Seorang tamu mendapat', 'kartu bertuliskan 404.', 'Pintunya ada di antara', 'dua dinding rapat.',
      'Di dalam, televisi', 'menayangkan lobi hotel…', 'TIGA MENIT KE DEPAN.', 'Ia melihat dirinya sendiri.',
      '“Jangan biarkan aku masuk.”', 'Saat menoleh…', 'pintunya HILANG.', 'Hitung mundur: 10 detik.'
    ]
  },
  {
    id: 7,
    slug: 'stasiun-terakhir',
    title: 'STASIUN TANPA NAMA',
    hook: 'STASIUN INI\nTAK ADA DI PETA.',
    audioDuration: 42.408,
    accent: '#5ee7ff',
    captions: [
      'FILE ANOMALI 007', 'Kereta terakhir berhenti', 'di stasiun tanpa nama.', 'Semua jam berbeda.',
      'Penumpang di peron', 'membelakangi REL.', 'Seorang mahasiswa turun.', 'Pintu langsung tertutup.',
      'Semua penumpang berbalik', 'secara BERSAMAAN.', 'Wajah mereka sama.', 'Sama persis dengannya.',
      'Enam menit kemudian…', 'peron itu kosong.', 'Pengumuman terakhir:', 'JANGAN IKUTI SUARAMU.'
    ]
  },
  {
    id: 8,
    slug: 'bulan-berkedip',
    title: 'BULAN BERKEDIP',
    hook: 'BULAN HILANG\nSELAMA SATU DETIK.',
    audioDuration: 44.136,
    accent: '#ff536b',
    captions: [
      'FILE ANOMALI 008', 'Ratusan orang merekam', 'bulan PADAM satu detik.', 'Bukan tertutup awan.',
      'Bulan benar-benar hilang.', 'Lalu kembali…', 'sedikit LEBIH DEKAT.', 'Semua rekaman kehilangan',
      'satu detik yang sama.', 'Malam berikutnya…', 'bulan padam dua detik.', 'Ada bentuk seperti PUPIL.',
      'Pesan darurat masuk:', '“Jangan menatap langit.”', 'Kamera depan aktif sendiri.', 'Sesuatu sedang MENGHITUNG.'
    ]
  },
  {
    id: 9,
    slug: 'foto-kontak',
    title: 'FOTO KONTAK IBU',
    hook: 'FOTONYA BERUBAH\nSETIAP MALAM.',
    audioDuration: 47.736,
    accent: '#ff5c8a',
    captions: [
      'FILE ANOMALI 009', 'Foto kontak ibu', 'berubah setiap malam.', 'Hari pertama: tersenyum.',
      'Hari kedua:', 'terlihat semakin jauh.', 'Hari ketiga:', 'ada sosok di belakangnya.',
      'Nomornya sudah tidak aktif', 'sejak tiga tahun lalu.', 'Tengah malam…', 'foto berubah lagi.',
      'Sosok itu sendirian.', 'Sangat dekat ke kamera.', 'Pesan masuk dari IBU:', '“JANGAN BUKA PINTU.”',
      'Di CCTV… Dimas di luar.'
    ]
  },
  {
    id: 10,
    slug: 'sudah-dilihat',
    title: 'KAMU SUDAH DILIHAT',
    hook: 'SEMUA PONSEL\nMENERIMA PESAN YANG SAMA.',
    audioDuration: 48.168,
    accent: '#ff342d',
    captions: [
      'FILE ANOMALI 010', 'Semua warga menerima', 'notifikasi yang sama:', 'KAMU SUDAH DILIHAT.',
      'Tidak ada nama aplikasi.', 'Tak bisa dihapus.', 'Kamera depan menyala.', 'Wajah ditandai kotak merah.',
      'Status: TERVERIFIKASI.', 'Ponsel dimatikan.', 'Baterai dicabut.', 'Penghitung tetap naik.',
      'Satu juta. Dua juta.', 'Tiga juta WAJAH.', '“PENCADANGAN SELESAI.”', 'Kini cermin tak memantulkan manusia.',
      'Hanya kotak merah.'
    ]
  }
];

const story = stories[requestedId - 1];
const DURATION = story.audioDuration + 1.15;
let currentTime = 0;

const C = {
  ink: '#050609',
  charcoal: '#0c0f14',
  paper: '#f4efe3',
  muted: '#9b9ca3',
  cyan: '#5ee7ff',
  red: '#ff3b30'
};

function clamp(v, a = 0, b = 1) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function invlerp(a, b, v) { return clamp((v - a) / (b - a)); }
function ease(t) { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function out(t) { return 1 - Math.pow(1 - clamp(t), 4); }
function inExpo(t) { return t <= 0 ? 0 : Math.pow(2, 10 * t - 10); }
function pulse(t, a, b, feather = .04) {
  return clamp((t - a) / feather) * clamp((b - t) / feather);
}
function hash(n) {
  const x = Math.sin(n * 127.1 + story.id * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function jitter(t, n, amp = 1) {
  return (Math.sin(t * 31.1 + n * 7.7) * .55 + Math.sin(t * 73.7 + n * 2.3) * .45) * amp;
}
function rgba(hex, a) {
  const c = hex.replace('#', '');
  const n = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
function pathRoundRect(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}
function strokeLine(points, color, width = 2, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
  ctx.stroke();
  ctx.restore();
}
function polygon(points, fill, stroke = null, width = 1) {
  ctx.beginPath();
  points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function text(txt, x, y, size, fill = C.paper, align = 'left', weight = 800, alpha = 1, font = 'Arial') {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${weight} ${size}px ${font}, sans-serif`;
  ctx.fillText(txt, x, y);
  ctx.restore();
}
function fitText(txt, maxWidth, startSize, weight = 900) {
  let size = startSize;
  while (size > 24) {
    ctx.font = `${weight} ${size}px Arial Black, Arial, sans-serif`;
    if (ctx.measureText(txt).width <= maxWidth) return size;
    size -= 2;
  }
  return size;
}
function wrapWords(txt, maxWidth, size, weight = 900) {
  ctx.font = `${weight} ${size}px Arial Black, Arial, sans-serif`;
  const words = txt.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
function organicBlob(cx, cy, rx, ry, seed, fill, stroke = null, width = 1, phase = 0) {
  const pts = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const n = 1 + (hash(seed + i * 1.91) - .5) * .10 + Math.sin(a * 3 + phase) * .018;
    pts.push([cx + Math.cos(a) * rx * n, cy + Math.sin(a) * ry * n]);
  }
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}

function background(t, accent) {
  const g = ctx.createLinearGradient(0, -300, W, H + 300);
  g.addColorStop(0, '#050609');
  g.addColorStop(.45, '#0d1017');
  g.addColorStop(1, '#030406');
  ctx.fillStyle = g;
  ctx.fillRect(-500, -500, W + 1000, H + 1000);

  const glow = ctx.createRadialGradient(
    160 + Math.sin(t * .17) * 90, 560 + Math.cos(t * .13) * 120, 0,
    160, 560, 980
  );
  glow.addColorStop(0, rgba(accent, .15));
  glow.addColorStop(.38, rgba(accent, .045));
  glow.addColorStop(1, rgba(accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(-500, -500, W + 1000, H + 1000);

  // Authored, irregular paper/film bands — deterministic, not per-frame random.
  for (let i = 0; i < 34; i++) {
    const y = hash(i + 20) * (H + 600) - 300;
    ctx.fillStyle = i % 3 ? 'rgba(255,255,255,.012)' : rgba(accent, .012);
    ctx.fillRect(-300, y + Math.sin(t * .09 + i) * 8, W + 600, 1 + hash(i + 44) * 3);
  }
}

const cameraPlans = [
  [{u:0,x:30,y:-20,s:1.04,r:-.005},{u:.25,x:-55,y:20,s:1.13,r:.004},{u:.55,x:30,y:-80,s:1.32,r:-.008},{u:.78,x:-20,y:-190,s:1.62,r:.006},{u:1,x:0,y:-40,s:1.18,r:0}],
  [{u:0,x:-30,y:20,s:1.06,r:.004},{u:.28,x:40,y:-10,s:1.17,r:-.006},{u:.58,x:-85,y:-70,s:1.4,r:.008},{u:.82,x:70,y:-130,s:1.58,r:-.004},{u:1,x:0,y:0,s:1.17,r:0}],
  [{u:0,x:42,y:-10,s:1.1,r:-.004},{u:.3,x:-48,y:-20,s:1.22,r:.006},{u:.6,x:50,y:-140,s:1.47,r:-.008},{u:.83,x:-70,y:-110,s:1.65,r:.004},{u:1,x:0,y:0,s:1.16,r:0}],
  [{u:0,x:-30,y:0,s:1.07,r:.003},{u:.3,x:70,y:-40,s:1.2,r:-.005},{u:.58,x:-60,y:-90,s:1.36,r:.007},{u:.8,x:50,y:-180,s:1.6,r:-.006},{u:1,x:0,y:0,s:1.18,r:0}],
  [{u:0,x:15,y:15,s:1.05,r:-.004},{u:.26,x:-65,y:-20,s:1.18,r:.005},{u:.52,x:55,y:-65,s:1.38,r:-.006},{u:.78,x:-45,y:-145,s:1.62,r:.008},{u:1,x:0,y:-10,s:1.2,r:0}],
  [{u:0,x:-40,y:10,s:1.08,r:.005},{u:.3,x:45,y:-30,s:1.2,r:-.005},{u:.55,x:-70,y:-110,s:1.44,r:.007},{u:.82,x:80,y:-160,s:1.66,r:-.006},{u:1,x:0,y:0,s:1.18,r:0}],
  [{u:0,x:35,y:10,s:1.04,r:-.003},{u:.27,x:-70,y:-30,s:1.19,r:.004},{u:.55,x:65,y:-100,s:1.38,r:-.006},{u:.8,x:-75,y:-175,s:1.58,r:.006},{u:1,x:0,y:0,s:1.17,r:0}],
  [{u:0,x:-30,y:30,s:1.03,r:.003},{u:.25,x:60,y:-30,s:1.18,r:-.004},{u:.5,x:-50,y:-130,s:1.42,r:.006},{u:.78,x:40,y:-210,s:1.7,r:-.005},{u:1,x:0,y:-20,s:1.2,r:0}],
  [{u:0,x:40,y:10,s:1.07,r:-.004},{u:.29,x:-55,y:-25,s:1.2,r:.006},{u:.57,x:65,y:-100,s:1.43,r:-.006},{u:.82,x:-80,y:-175,s:1.64,r:.006},{u:1,x:0,y:0,s:1.18,r:0}],
  [{u:0,x:-35,y:15,s:1.05,r:.004},{u:.25,x:60,y:-15,s:1.19,r:-.005},{u:.53,x:-70,y:-110,s:1.42,r:.006},{u:.79,x:75,y:-170,s:1.62,r:-.006},{u:1,x:0,y:0,s:1.18,r:0}]
];
function sampleCamera(u) {
  const plan = cameraPlans[story.id - 1];
  let a = plan[0], b = plan[plan.length - 1];
  for (let i = 0; i < plan.length - 1; i++) {
    if (u >= plan[i].u && u <= plan[i + 1].u) { a = plan[i]; b = plan[i + 1]; break; }
  }
  const p = ease(invlerp(a.u, b.u, u));
  return {
    x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), s: lerp(a.s, b.s, p), r: lerp(a.r, b.r, p)
  };
}
function beginCamera(u, t) {
  const c = sampleCamera(u);
  const micro = u > .15 && u < .92 ? Math.sin(t * .8) * 2.2 : 0;
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(c.r);
  ctx.scale(c.s, c.s);
  ctx.translate(-W / 2 + c.x + micro, -H / 2 + c.y + Math.cos(t * .65) * 2);
}
function endCamera() { ctx.restore(); }

function drawPerson(x, y, scale, color, facing = 1, alpha = 1, tall = false) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(scale * facing, scale);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-18, 4);
  ctx.bezierCurveTo(-24, -16, -21, -45, -8, -57);
  ctx.bezierCurveTo(-3, -63, 8, -64, 14, -55);
  ctx.bezierCurveTo(25, -38, 20, -13, 16, 4);
  ctx.bezierCurveTo(30, 18, 31, 48, 25, 78);
  ctx.lineTo(17, tall ? 178 : 135);
  ctx.bezierCurveTo(9, 144, 2, 143, -3, tall ? 175 : 135);
  ctx.lineTo(-10, 74);
  ctx.lineTo(-19, tall ? 174 : 136);
  ctx.bezierCurveTo(-30, 146, -34, 139, -30, 126);
  ctx.lineTo(-27, 72);
  ctx.bezierCurveTo(-39, 42, -36, 17, -18, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawFace(x, y, s, stroke, strange = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-29,-8); ctx.bezierCurveTo(-26,-43,-13,-58,3,-59);
  ctx.bezierCurveTo(26,-58,36,-35,31,-6);
  ctx.bezierCurveTo(28,24,15,42,-1,45);
  ctx.bezierCurveTo(-17,39,-29,22,-29,-8); ctx.stroke();
  if (strange) {
    strokeLine([[-17,-11],[18,-11]], stroke, 5);
    strokeLine([[-9,19],[11,19]], stroke, 2);
  } else {
    organicBlob(-11,-10,4,2,2,stroke);
    organicBlob(12,-10,4,2,3,stroke);
    ctx.beginPath(); ctx.arc(0,18,11,.1,Math.PI-.1); ctx.stroke();
  }
  ctx.restore();
}
function drawDetailedPhone(x, y, w, h, accent, tilt = 0, screen = '#11141a') {
  ctx.save();
  ctx.translate(x + w/2, y + h/2);
  ctx.rotate(tilt);
  ctx.translate(-w/2, -h/2);
  ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 45; ctx.shadowOffsetY = 28;
  const shell = ctx.createLinearGradient(0,0,w,h);
  shell.addColorStop(0,'#4a4e58'); shell.addColorStop(.2,'#171a20'); shell.addColorStop(.8,'#050608'); shell.addColorStop(1,'#444852');
  pathRoundRect(ctx,0,0,w,h,54); ctx.fillStyle = shell; ctx.fill();
  ctx.shadowColor = 'transparent';
  pathRoundRect(ctx,12,14,w-24,h-28,44); ctx.fillStyle = screen; ctx.fill();
  ctx.strokeStyle = rgba('#ffffff',.18); ctx.lineWidth=3; ctx.stroke();
  pathRoundRect(ctx,w*.35,22,w*.30,30,16); ctx.fillStyle='#020305'; ctx.fill();
  organicBlob(w*.43,37,5,4,120,'#1f2735');
  organicBlob(w*.57,37,4,4,121,rgba(accent,.5));
  ctx.fillStyle=rgba('#ffffff',.06); polygon([[22,80],[w*.23,42],[w*.65,42],[22,h*.72]], ctx.fillStyle);
  ctx.fillStyle=rgba(accent,.75); ctx.fillRect(w-4,h*.25,5,h*.11);
  ctx.fillStyle='#0a0c10'; pathRoundRect(ctx,w*.36,h-7,w*.28,4,2); ctx.fill();
  ctx.restore();
}
function drawWave(x, y, w, h, t, accent, progress = 1) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x,y,w*clamp(progress),h);
  ctx.clip();
  ctx.strokeStyle=accent; ctx.lineWidth=5; ctx.lineJoin='round';
  ctx.beginPath();
  for(let i=0;i<=90;i++){
    const p=i/90, xx=x+p*w;
    const amp=(.15+hash(i+30)*.85)*h*.47;
    const yy=y+h/2+Math.sin(i*1.31+t*5)*amp*Math.sin(Math.PI*p);
    i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);
  }
  ctx.stroke(); ctx.restore();
}
function drawDigitalClock(x,y,label,accent,scale=1){
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  pathRoundRect(ctx,-86,-35,172,70,10); ctx.fillStyle='rgba(2,4,6,.82)';ctx.fill();
  ctx.strokeStyle=rgba(accent,.5);ctx.lineWidth=2;ctx.stroke();
  text(label,0,19,42,accent,'center',800,1,'monospace');
  ctx.restore();
}

function scene01(t,u,a){
  const shorten=out(invlerp(.42,.84,u));
  const vx=540, vy=510+shorten*280;
  polygon([[-250,-300],[W+250,-300],[760,vy],[320,vy]],'#0b0e13');
  polygon([[-250,-300],[320,vy],[320,H+400],[-250,H+400]],'#11151b');
  polygon([[W+250,-300],[760,vy],[760,H+400],[W+250,H+400]],'#0a0c10');
  polygon([[320,vy],[760,vy],[W+250,H+400],[-250,H+400]],'#07090c');
  for(let i=0;i<9;i++){
    const p=i/9, y=lerp(vy,H+260,Math.pow(p,1.6));
    strokeLine([[-120,y],[W+120,y]],rgba('#ffffff',.055),2);
  }
  // Detailed door and jamb
  const doorY=590-shorten*90, doorX=660, doorW=250, doorH=590;
  const dg=ctx.createLinearGradient(doorX,doorY,doorX+doorW,doorY);
  dg.addColorStop(0,'#15191e');dg.addColorStop(.52,'#080a0d');dg.addColorStop(1,'#242931');
  pathRoundRect(ctx,doorX-18,doorY-24,doorW+36,doorH+48,9);ctx.fillStyle='#272b31';ctx.fill();
  const open=out(invlerp(.24,.48,u));
  polygon([[doorX,doorY],[doorX+doorW*(1-open*.72),doorY+28*open],[doorX+doorW*(1-open*.72),doorY+doorH-28*open],[doorX,doorY+doorH]],dg,'#555b62',3);
  ctx.fillStyle='#050507';ctx.fillRect(doorX+doorW*(1-open*.72),doorY+20,doorW*open*.72,doorH-40);
  text('07',doorX+doorW/2,doorY+95,66,'#b6b1a5','center',900,.9,'Arial Black');
  organicBlob(doorX+doorW*(1-open*.72)-15,doorY+doorH*.54,10,9,1,'#b8954d','#2c2414',2);
  // ominous figure: stays fixed while corridor/camera approaches
  const figA=clamp(invlerp(.42,.59,u));
  drawPerson(vx,vy+70,lerp(.45,1.7,shorten),'#020204',1,figA,true);
  if(u>.72){
    const flash=.5+.5*Math.sin(t*38);
    ctx.fillStyle=rgba(a,.08*flash);ctx.fillRect(-200,-200,W+400,H+400);
  }
}

function scene02(t,u,a){
  const open=out(invlerp(.20,.45,u));
  const shut=out(invlerp(.63,.77,u));
  const gap=Math.max(0,open-shut)*360;
  const metal=ctx.createLinearGradient(0,0,W,0);
  metal.addColorStop(0,'#181b1e');metal.addColorStop(.3,'#565a5c');metal.addColorStop(.52,'#151719');metal.addColorStop(.8,'#666a69');metal.addColorStop(1,'#17191c');
  // other corridor glimpsed through door
  ctx.fillStyle='#07080a';ctx.fillRect(100,260,880,1320);
  for(let i=0;i<7;i++){
    const yy=420+i*160;
    strokeLine([[220,yy],[860,yy]],rgba(a,.1),3);
    drawDigitalClock(i%2?300:780,yy-30,`${String((12-i+12)%12).padStart(2,'0')}:${String(i*7).padStart(2,'0')}`,a,.55);
  }
  drawPerson(540,1040,1.6,'#040507',-1,clamp(invlerp(.42,.58,u)),true);
  polygon([[-100,100],[540-gap/2,100],[540-gap/2,H+200],[-100,H+200]],metal,'#8b8c86',2);
  polygon([[540+gap/2,100],[W+100,100],[W+100,H+200],[540+gap/2,H+200]],metal,'#8b8c86',2);
  // brushed-metal imperfections
  for(let i=0;i<42;i++){
    const y=150+hash(i+80)*1600;
    strokeLine([[-100,y],[W+100,y+jitter(t,i,1)]],i%4?rgba('#ffffff',.035):rgba('#000000',.12),1+hash(i)*2);
  }
  // control panel
  const px=820,py=500;
  pathRoundRect(ctx,px,py,145,620,24);ctx.fillStyle='rgba(8,9,10,.72)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=3;ctx.stroke();
  for(let i=0;i<12;i++){
    const yy=py+55+(i%6)*88, xx=px+43+Math.floor(i/6)*61;
    organicBlob(xx,yy,24,22,120+i,'#262a2e','#818581',2);
    text(String(i+1),xx,yy+9,24,'#d8d2c6','center',800);
  }
  const zeroA=pulse(u,.08,.34,.05)+pulse(u,.65,.83,.05);
  organicBlob(px+72,py+586,31,27,199,rgba(a,.2+zeroA*.55),a,4);
  text('0',px+72,py+596,33,a,'center',900,zeroA);
  text('PANTULAN: -02 dtk',108,1435,30,rgba(a,.9),'left',800,clamp(invlerp(.55,.7,u)),'monospace');
  if(u>.68){
    ctx.save();ctx.globalAlpha=.22;ctx.translate(-18,0);drawPerson(560,1110,2.05,a,-1,1,true);ctx.restore();
  }
}

function scene03(t,u,a){
  const tilt=Math.sin(t*.45)*.025;
  drawDetailedPhone(210,330,660,1180,a,tilt,'#0c1114');
  // messaging header
  organicBlob(315,450,43,40,3,'#1a2025',a,2);
  drawFace(315,473,.58,a,true);
  text('Raka',385,452,40,C.paper,'left',800);
  text('online besok',385,492,25,rgba(a,.7),'left',600);
  // first voice note
  pathRoundRect(ctx,285,610,510,175,34);ctx.fillStyle='rgba(94,231,255,.10)';ctx.fill();ctx.strokeStyle=rgba(a,.26);ctx.lineWidth=2;ctx.stroke();
  organicBlob(340,697,34,31,4,a);polygon([[329,678],[329,716],[357,697]],'#071015');
  drawWave(395,660,330,74,t,a,clamp(invlerp(.08,.42,u)));
  text('0:31',690,755,24,rgba(C.paper,.6),'right',600,1,'monospace');
  // self-recording second card
  const second=out(invlerp(.48,.67,u));
  ctx.save();ctx.globalAlpha=second;
  pathRoundRect(ctx,285,855,510,188,34);ctx.fillStyle=rgba(a,.14);ctx.fill();ctx.strokeStyle=a;ctx.lineWidth=3;ctx.stroke();
  organicBlob(340,944,34,31,8,'#ff4057');
  drawWave(395,900,330,82,t+2,'#ff4057',clamp(invlerp(.5,.82,u)));
  text('MENGIRIM KE KEMARIN',540,1015,25,'#ff8693','center',900);
  ctx.restore();
  // time loop route becomes transition material
  ctx.strokeStyle=rgba(a,.5);ctx.lineWidth=7;ctx.setLineDash([14,18]);ctx.beginPath();ctx.arc(540,1260,150,-.3,Math.PI*1.7*clamp(invlerp(.67,.9,u)));ctx.stroke();ctx.setLineDash([]);
  text('11:00',540,1290,88,a,'center',900,clamp(invlerp(.65,.78,u)),'monospace');
  if(u>.82){ text('KEMARIN  ←  SEKARANG  ←  BESOK',540,1420,25,rgba(C.paper,.65),'center',700); }
}

function scene04(t,u,a){
  // radio with custom chamfered silhouette
  ctx.save();ctx.translate(120,570);
  const body=ctx.createLinearGradient(0,0,840,650);body.addColorStop(0,'#3b2e27');body.addColorStop(.5,'#171415');body.addColorStop(1,'#4c3528');
  ctx.beginPath();ctx.moveTo(45,30);ctx.quadraticCurveTo(60,0,98,0);ctx.lineTo(765,18);ctx.quadraticCurveTo(820,20,830,72);ctx.lineTo(812,580);ctx.quadraticCurveTo(808,635,752,642);ctx.lineTo(78,626);ctx.quadraticCurveTo(18,620,20,560);ctx.closePath();ctx.fillStyle=body;ctx.fill();ctx.strokeStyle='#7f6755';ctx.lineWidth=5;ctx.stroke();
  // antenna
  strokeLine([[700,22],[835,-250]],'#8b8d8f',8);strokeLine([[830,-248],[905,-296]],'#d4d1c8',4);
  // speaker grille
  pathRoundRect(ctx,70,120,420,390,22);ctx.fillStyle='#0a0909';ctx.fill();ctx.strokeStyle='#6a5749';ctx.lineWidth=4;ctx.stroke();
  for(let yy=0;yy<17;yy++) for(let xx=0;xx<18;xx++){
    if(hash(xx+yy*20)>0.12) organicBlob(88+xx*22,140+yy*21,3.2,2.5,xx+yy*22,'#5e5147');
  }
  // tuner glass
  pathRoundRect(ctx,535,92,225,180,14);ctx.fillStyle='#d5b987';ctx.fill();ctx.strokeStyle='#241e1b';ctx.lineWidth=7;ctx.stroke();
  for(let i=0;i<11;i++){const xx=555+i*18;text(String(5+i),xx,150,15,'#382e27','center',700);strokeLine([[xx,160],[xx,212]],'#4a3c31',2);}
  const needle=560+Math.sin(t*2.4)*80+clamp(invlerp(.35,.65,u))*120;strokeLine([[needle,115],[needle,245]],a,4);
  // tactile dials
  for(const [x,y,r] of [[580,390,56],[720,390,42]]){
    organicBlob(x,y,r,r*.92,x+y,'#17191a','#9a8068',5,t*.05);
    for(let i=0;i<18;i++){const an=i/18*Math.PI*2;strokeLine([[x+Math.cos(an)*r*.72,y+Math.sin(an)*r*.72],[x+Math.cos(an)*r*.96,y+Math.sin(an)*r*.96]],'#5c5148',3);}
  }
  text('FREKUENSI MERAH',630,525,25,a,'center',900,clamp(invlerp(.26,.48,u)));
  drawWave(525,555,260,52,t,a,1);
  ctx.restore();
  // dark homes and disappearing reflection
  for(let i=0;i<6;i++){
    const x=90+i*175, off=i%2*55;
    polygon([[x,1510-off],[x+70,1450-off],[x+148,1510-off],[x+142,1710],[x+8,1710]],'#090b0e',rgba(a,.08),2);
    const on=u < .16+i*.075;
    ctx.fillStyle=on?'#f3bb67':'#060708';ctx.fillRect(x+38,1550-off,36,55);ctx.fillRect(x+89,1550-off,30,55);
  }
  if(u>.75){
    const fade=1-clamp(invlerp(.75,.92,u));
    ctx.save();ctx.globalAlpha=fade*.35;ctx.scale(1,-.3);ctx.translate(0,-6300);text('WARUNG',540,1530,150,a,'center',900);ctx.restore();
  }
}

function scene05(t,u,a){
  // plaster wall with irregular moisture marks
  const wall=ctx.createLinearGradient(0,0,0,H);wall.addColorStop(0,'#1a1820');wall.addColorStop(.55,'#26202b');wall.addColorStop(1,'#0a090c');ctx.fillStyle=wall;ctx.fillRect(-200,-200,W+400,H+400);
  for(let i=0;i<18;i++) organicBlob(hash(i)*1100,250+hash(i+44)*1200,70+hash(i+9)*150,40+hash(i+2)*130,i,rgba('#000000',.06));
  strokeLine([[-100,1370],[W+100,1370]],rgba('#ffffff',.16),5);
  // bed, layered blanket contour
  ctx.beginPath();ctx.moveTo(120,1220);ctx.bezierCurveTo(250,1150,520,1190,720,1160);ctx.bezierCurveTo(870,1180,920,1270,900,1445);ctx.lineTo(150,1455);ctx.closePath();ctx.fillStyle='#17131c';ctx.fill();ctx.strokeStyle='#51425a';ctx.lineWidth=5;ctx.stroke();
  for(let i=0;i<8;i++) strokeLine([[190+i*90,1240+jitter(t,i,3)],[160+i*95,1415]],rgba(a,.08),3);
  const personX=370+Math.sin(t*.35)*9;
  drawPerson(personX,1120,1.75,'#d2c9cf',1,1,false);
  // Delayed shadow progressively detaches from owner
  const detach=out(invlerp(.34,.77,u));
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.83;
  ctx.transform(1,.08,-.26,1,0,0);
  drawPerson(personX+lerp(120,500,detach),1110-lerp(50,330,detach),lerp(2.4,3.2,detach),'#050407',-1,1,true);
  ctx.restore();
  // red motion-difference vectors
  if(u>.5){
    strokeLine([[560,940],[790,760]],rgba(a,.7),6,clamp(invlerp(.5,.67,u)));
    polygon([[790,760],[760,778],[780,802]],rgba(a,.8));
    text('Δt = -2.00s',700,720,34,a,'center',900,1,'monospace');
  }
  pathRoundRect(ctx,82,235,916,1190,24);ctx.strokeStyle=rgba('#ffffff',.18);ctx.lineWidth=3;ctx.stroke();
  text('MOTION DIFFERENCE',110,295,27,rgba(C.paper,.65),'left',800);
  text(u>.75?'SUBJEK: TIDAK DITEMUKAN':'SUBJEK: SINTA',110,340,25,u>.75?a:rgba(C.paper,.55),'left',900);
}

function scene06(t,u,a){
  // hotel corridor, richly layered
  polygon([[-250,-200],[W+250,-200],[770,610],[310,610]],'#111014');
  polygon([[-250,-200],[310,610],[310,H+300],[-250,H+300]],'#1d1720');
  polygon([[W+250,-200],[770,610],[770,H+300],[W+250,H+300]],'#140f15');
  polygon([[310,610],[770,610],[W+250,H+300],[-250,H+300]],'#09080b');
  for(let i=0;i<11;i++){
    const p=i/11,y=lerp(630,H+180,p*p);strokeLine([[-100,y],[W+100,y]],rgba('#f2d08d',.08),3);
  }
  const visible=out(invlerp(.14,.35,u));
  // door appears between seams
  ctx.save();ctx.globalAlpha=visible;
  pathRoundRect(ctx,360,520,360,850,15);ctx.fillStyle='#0b090c';ctx.fill();ctx.strokeStyle='#6f5337';ctx.lineWidth=20;ctx.stroke();
  const wood=ctx.createLinearGradient(380,0,700,0);wood.addColorStop(0,'#3b2722');wood.addColorStop(.4,'#151014');wood.addColorStop(1,'#56372a');ctx.fillStyle=wood;ctx.fillRect(390,545,300,800);
  text('404',540,720,105,a,'center',900,1,'Arial Black');
  organicBlob(650,955,13,12,4,'#c59a4f','#382814',3);
  ctx.restore();
  // TV in room grows from the door's black center
  const tv=out(invlerp(.43,.66,u));
  ctx.save();ctx.globalAlpha=tv;ctx.translate(540,970);ctx.scale(.45+tv*.7,.45+tv*.7);ctx.translate(-540,-970);
  pathRoundRect(ctx,170,650,740,540,28);ctx.fillStyle='#111318';ctx.fill();ctx.strokeStyle='#4b4f56';ctx.lineWidth=16;ctx.stroke();
  pathRoundRect(ctx,205,688,670,435,10);ctx.fillStyle='#080c0e';ctx.fill();ctx.strokeStyle=rgba(a,.35);ctx.lineWidth=3;ctx.stroke();
  // lobby inside TV
  strokeLine([[235,1020],[845,1020]],rgba(C.paper,.3),4);
  for(let i=0;i<4;i++) drawPerson(330+i*140,1005,.7,i===2?a:'#787b83',i===2?-1:1,.85,false);
  text('LIVE +03:00',250,745,28,a,'left',900,1,'monospace');
  text(`00:00:${String(Math.max(0,10-Math.floor(invlerp(.72,1,u)*10))).padStart(2,'0')}`,540,1090,55,u>.72?a:C.paper,'center',900,1,'monospace');
  ctx.restore();
  if(u>.76){text('PINTU: TIDAK TERDETEKSI',540,1435,34,a,'center',900);}
}

function scene07(t,u,a){
  // tunnel and tracks
  const vx=540,vy=480;
  polygon([[-300,200],[W+300,200],[760,vy],[320,vy]],'#11151a');
  polygon([[320,vy],[760,vy],[W+300,H+300],[-300,H+300]],'#080a0d');
  strokeLine([[390,vy],[120,H+250]],'#b8bbc0',13);strokeLine([[690,vy],[960,H+250]],'#b8bbc0',13);
  for(let i=0;i<20;i++){
    const p=i/20, y=lerp(vy,H+180,Math.pow(p,1.7));
    const half=lerp(150,520,Math.pow(p,1.35));
    strokeLine([[540-half,y],[540+half,y]],i%2?'#332d2a':'#58443a',10+18*p);
  }
  // platform canopy and blank name
  polygon([[-100,260],[430,430],[310,570],[-200,470]],'#191b1e');
  polygon([[650,430],[W+100,260],[W+200,470],[770,570]],'#141619');
  pathRoundRect(ctx,150,260,780,190,16);ctx.fillStyle='#0d1014';ctx.fill();ctx.strokeStyle='#4b5258';ctx.lineWidth=8;ctx.stroke();
  text(u>.7?'_ _ _ _ _':'STASIUN',540,385,72,u>.7?a:rgba(C.paper,.5),'center',900);
  // clocks disagree
  drawDigitalClock(260,570,'23:71',a,.65);drawDigitalClock(820,570,'04:92',a,.65);
  // rows of figures, identical faces on reveal
  const turn=out(invlerp(.47,.68,u));
  for(let i=0;i<9;i++){
    const x=110+i*108,y=1140+(i%2)*40,s=.85+(i%3)*.08;
    drawPerson(x,y,s,'#15181d',turn>.5?-1:1,.95,false);
    if(turn>.35) drawFace(x,y-55*s,s*.38,a,true);
  }
  // train window/lens occluder sweeps as transition carrier
  const sweep=clamp(invlerp(.28,.43,u));
  ctx.fillStyle='rgba(3,4,6,.86)';ctx.fillRect(-W+sweep*W*2,660,420,H);
  if(u>.72){
    pathRoundRect(ctx,120,1340,840,160,26);ctx.fillStyle='rgba(5,8,10,.82)';ctx.fill();ctx.strokeStyle=rgba(a,.6);ctx.lineWidth=3;ctx.stroke();
    text('JANGAN IKUTI SUARAMU SENDIRI',540,1435,36,a,'center',900);
  }
}

function moonPath(cx,cy,r,t,fill,stroke){
  ctx.beginPath();
  for(let i=0;i<96;i++){
    const an=i/96*Math.PI*2,n=1+(hash(i+220)-.5)*.025+Math.sin(an*5+t*.03)*.006;
    const x=cx+Math.cos(an)*r*n,y=cy+Math.sin(an)*r*n;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke();}
}
function scene08(t,u,a){
  // layered night clouds
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#03040a');sky.addColorStop(.6,'#0d1222');sky.addColorStop(1,'#050509');ctx.fillStyle=sky;ctx.fillRect(-300,-300,W+600,H+600);
  for(let i=0;i<90;i++){const x=hash(i)*1400-160,y=hash(i+90)*1350;organicBlob(x,y,2+hash(i+3)*4,1+hash(i)*3,i,'rgba(255,255,255,.34)');}
  const close=out(invlerp(.25,.78,u));
  const r=lerp(255,440,close),mx=540+Math.sin(t*.15)*10,my=690+lerp(0,110,close);
  const blink1=pulse(u,.16,.20,.018),blink2=pulse(u,.50,.57,.018);
  const visible=1-clamp(blink1+blink2);
  ctx.save();ctx.globalAlpha=visible;
  ctx.shadowColor=rgba('#dbe5ff',.42);ctx.shadowBlur=90;
  moonPath(mx,my,r,t,'#d8d6cc','#777b89');ctx.shadowColor='transparent';
  for(let i=0;i<34;i++){
    const an=hash(i+20)*Math.PI*2,rr=Math.sqrt(hash(i+70))*r*.78,cr=(.018+hash(i+8)*.055)*r;
    organicBlob(mx+Math.cos(an)*rr,my+Math.sin(an)*rr,cr,cr*(.65+hash(i)*.3),i,rgba(i%3?'#65656b':'#ffffff',i%3?.19:.09));
  }
  // pupil emerges from crater and becomes camera target
  const eye=out(invlerp(.58,.77,u));
  organicBlob(mx+30,my+15,r*.23*eye,r*.36*eye,400,'#05050a',rgba(a,.65),5,t*.04);
  organicBlob(mx+30+Math.sin(t*.7)*r*.05,my+15,r*.075*eye,r*.18*eye,401,a);
  organicBlob(mx+30,my+15,r*.025*eye,r*.07*eye,402,'#ffffff');
  ctx.restore();
  // cloud ribbons occlude foreground
  for(let i=0;i<5;i++){
    const y=420+i*240+Math.sin(t*.12+i)*30;ctx.beginPath();ctx.moveTo(-220,y);
    for(let x=-220;x<W+240;x+=80)ctx.quadraticCurveTo(x+40,y-40+Math.sin(x*.01+i)*28,x+80,y);
    ctx.lineTo(W+240,y+100);ctx.lineTo(-220,y+130);ctx.closePath();ctx.fillStyle=`rgba(8,10,18,${.17+i*.03})`;ctx.fill();
  }
  if(u>.72){pathRoundRect(ctx,110,1320,860,145,20);ctx.fillStyle=rgba(a,.14);ctx.fill();ctx.strokeStyle=a;ctx.lineWidth=4;ctx.stroke();text('DARURAT: JANGAN MENATAP LANGIT',540,1408,37,a,'center',900);}
}

function scene09(t,u,a){
  drawDetailedPhone(180,300,720,1260,a,Math.sin(t*.3)*.018,'#0c0e14');
  text('Kontak',540,430,31,rgba(C.paper,.55),'center',700);
  // portrait card that evolves
  const stage=u<.24?0:u<.43?1:u<.64?2:3;
  pathRoundRect(ctx,290,505,500,600,36);ctx.fillStyle='#17141a';ctx.fill();ctx.strokeStyle=rgba(a,.35);ctx.lineWidth=4;ctx.stroke();
  const py=880+stage*28, ps=stage===3?.75:1.25-stage*.12;
  drawPerson(540,py,ps,'#bdb1b4',1,1,false);
  if(stage>=2){
    const sx=stage===3?540:660,sy=stage===3?930:850,ss=stage===3?2.7:1.7;
    drawPerson(sx,sy,ss,'#040407',-1,1,true);
    if(stage===3) drawFace(sx,sy-145,ss*.36,a,true);
  }
  text('IBU',540,1185,55,C.paper,'center',900);
  text('nomor tidak aktif • 3 tahun',540,1230,24,rgba(C.paper,.45),'center',600);
  // incoming message
  const msg=out(invlerp(.67,.80,u));ctx.save();ctx.globalAlpha=msg;
  pathRoundRect(ctx,260,1165,560,170,32);ctx.fillStyle=rgba(a,.17);ctx.fill();ctx.strokeStyle=a;ctx.lineWidth=3;ctx.stroke();
  text('IBU',305,1220,24,rgba(a,.8),'left',800,msg);text('JANGAN BUKA PINTU.',540,1290,39,C.paper,'center',900,msg);ctx.restore();
  // CCTV mini window replaces the lower contact area before the subtitle safe lane.
  if(u>.79){
    pathRoundRect(ctx,250,1310,580,145,22);ctx.fillStyle='#080a0d';ctx.fill();ctx.strokeStyle=rgba('#ffffff',.2);ctx.lineWidth=3;ctx.stroke();
    text('CCTV • DEPAN',280,1350,20,a,'left',900,1,'monospace');
    drawPerson(650,1435,.72,'#08090c',-1,1,false);drawFace(650,1393,.28,a,true);
  }
}

function scene10(t,u,a){
  // city canyons with irregular roofs and windows
  for(let i=0;i<13;i++){
    const x=-100+i*105,w=125+hash(i)*80,h=380+hash(i+13)*850,y=1700-h;
    const pts=[[x,1700],[x,y+40],[x+18,y+20],[x+w*.4,y+30],[x+w*.55,y],[x+w,y+25],[x+w,1700]];
    polygon(pts,i%2?'#0d1116':'#15171c',rgba('#ffffff',.035),2);
    for(let yy=y+85;yy<1640;yy+=72) for(let xx=x+28;xx<x+w-12;xx+=46){
      const alive=hash(xx+yy+i)>.62;ctx.fillStyle=alive?rgba(a,.22):'rgba(255,255,255,.025)';ctx.fillRect(xx,yy,15,25);
    }
  }
  // floating phone notification owns frame then transforms into detection array
  const cardY=lerp(440,260,out(invlerp(.35,.62,u)));
  pathRoundRect(ctx,105,cardY,870,230,38);ctx.fillStyle='rgba(12,15,20,.93)';ctx.fill();ctx.strokeStyle=rgba(a,.65);ctx.lineWidth=4;ctx.stroke();
  organicBlob(190,cardY+115,50,47,10,a);text('!',190,cardY+134,60,'#050609','center',900);
  text('SISTEM',270,cardY+82,27,rgba(C.paper,.55),'left',800);text('KAMU SUDAH DILIHAT',270,cardY+155,50,C.paper,'left',900);
  // custom faces and tracking boxes
  const detect=out(invlerp(.25,.48,u));
  const faces=[[220,920,1.15],[540,930,1.35],[850,900,1.05],[360,1280,.9],[710,1260,1.0]];
  faces.forEach((f,i)=>{
    drawPerson(f[0],f[1]+120,f[2],'#1c2027',i%2?1:-1,.95,false);
    drawFace(f[0],f[1],f[2]*.72,rgba(C.paper,.55),true);
    if(detect>.1){
      const s=170*f[2],x=f[0]-s/2,y=f[1]-s*.62;
      ctx.strokeStyle=rgba(a,detect);ctx.lineWidth=5;
      const l=30;strokeLine([[x+l,y],[x,y],[x,y+l]],a,5,detect);strokeLine([[x+s-l,y],[x+s,y],[x+s,y+l]],a,5,detect);strokeLine([[x,y+s-l],[x,y+s],[x+l,y+s]],a,5,detect);strokeLine([[x+s-l,y+s],[x+s,y+s],[x+s,y+s-l]],a,5,detect);
      text('VERIFIED',x,y-20,18,a,'left',900,detect,'monospace');
    }
  });
  const count=Math.floor(lerp(1,3000000,out(invlerp(.5,.78,u))));
  pathRoundRect(ctx,180,1490,720,150,24);ctx.fillStyle='rgba(4,6,8,.85)';ctx.fill();ctx.strokeStyle=rgba(a,.38);ctx.lineWidth=3;ctx.stroke();
  text(count.toLocaleString('id-ID'),540,1585,74,a,'center',900,1,'monospace');
  if(u>.78){
    text('PENCADANGAN SELESAI',540,1710,33,a,'center',900);
    // mirror glare removes faces, leaves boxes
    ctx.fillStyle=`rgba(220,230,238,${clamp(invlerp(.78,.94,u))*.12})`;ctx.fillRect(80,700,920,970);
  }
}

const sceneDrawers=[scene01,scene02,scene03,scene04,scene05,scene06,scene07,scene08,scene09,scene10];

function drawSceneLensUI(t,u){
  if(story.id!==1) return;
  ctx.save();
  ctx.strokeStyle=rgba(story.accent,.72);ctx.lineWidth=3;ctx.strokeRect(66,238,948,1320);
  text('REC',114,312,38,story.accent,'left',900,1,'Arial Black');
  organicBlob(88,300,11,10,2,story.accent);
  drawDigitalClock(825,304,u>.74?'03:13:11':'03:13:00',story.accent,.82);
  ctx.restore();
}

function drawTopUI(t,u){
  // top safe-area identity with asymmetric dossier treatment
  ctx.save();
  ctx.fillStyle='rgba(4,5,8,.72)';
  pathRoundRect(ctx,56,62,968,152,28);ctx.fill();
  ctx.strokeStyle=rgba(story.accent,.38);ctx.lineWidth=3;ctx.stroke();
  pathRoundRect(ctx,78,86,315,55,16);ctx.fillStyle=story.accent;ctx.fill();
  text('FIKSI • ANALOG HORROR',235,126,24,C.ink,'center',900);
  text(`FILE ${String(story.id).padStart(3,'0')}`,966,126,30,C.paper,'right',900,1,'monospace');
  text(story.title,78,184,32,rgba(C.paper,.86),'left',900);
  const rec=.55+.45*Math.sin(t*5.2);
  organicBlob(972,172,8,8,77,story.accent,null,0,t*.1);ctx.globalAlpha=rec;
  ctx.restore();
}

function drawHook(t,u){
  const show=1-clamp(invlerp(.055,.085,u));
  if(show<=0) return;
  const attack=out(invlerp(.006,.055,u));
  const lines=story.hook.split('\n');
  ctx.save();
  ctx.globalAlpha=show;
  ctx.translate(540,870);
  ctx.scale(.82+attack*.18,.82+attack*.18);
  ctx.rotate(lerp(-.025,0,attack));
  // text as foreground transition plane
  lines.forEach((line,i)=>{
    const size=fitText(line,900,114,900);
    ctx.font=`900 ${size}px Arial Black, Arial, sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    ctx.strokeStyle='rgba(0,0,0,.85)';ctx.lineWidth=26;ctx.strokeText(line,0,i*126-64);
    ctx.fillStyle=i===lines.length-1?story.accent:C.paper;ctx.fillText(line,0,i*126-64);
  });
  strokeLine([[-390,140],[390*attack,140]],story.accent,8,show);
  ctx.restore();
}

function captionWeight(s){
  let w=Math.max(8,s.replace(/[^a-zA-Z0-9]/g,'').length);
  if(/[.!?…:]$/.test(s))w+=8;
  if(/[A-Z0-9]{3,}/.test(s))w+=3;
  return w;
}
function getCaption(t){
  const start=.12,end=story.audioDuration-.15,tt=clamp((t-start)/(end-start));
  const weights=story.captions.map(captionWeight),total=weights.reduce((a,b)=>a+b,0);
  let cursor=0;
  for(let i=0;i<weights.length;i++){
    const next=cursor+weights[i]/total;
    if(tt<=next||i===weights.length-1){return {line:story.captions[i],local:clamp((tt-cursor)/(next-cursor)),index:i};}
    cursor=next;
  }
  return {line:story.captions.at(-1),local:1,index:story.captions.length-1};
}
function drawCaption(t){
  if(t<.18||t>story.audioDuration+.1)return;
  const cap=getCaption(t);
  const appear=out(clamp(cap.local/.18));
  const y=cap.index%3===0?1455:1475;
  const size=fitText(cap.line,900,72,900);
  const lines=wrapWords(cap.line,900,size,900).slice(0,2);
  const totalH=lines.length*size*1.12;
  ctx.save();ctx.translate(540,y-totalH/2);ctx.scale(.94+appear*.06,.94+appear*.06);
  lines.forEach((line,i)=>{
    const yy=i*size*1.12;
    ctx.font=`900 ${size}px Arial Black, Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    ctx.strokeStyle='rgba(0,0,0,.95)';ctx.lineWidth=Math.max(14,size*.22);ctx.strokeText(line,0,yy);
    const emph=/[A-Z0-9]{2,}|03:13|404/.test(line);
    ctx.fillStyle=emph?story.accent:C.paper;ctx.fillText(line,0,yy);
  });
  ctx.restore();
}
function drawBottomUI(t,u){
  const p=clamp(t/story.audioDuration);
  ctx.fillStyle='rgba(255,255,255,.12)';pathRoundRect(ctx,72,1770,820,9,5);ctx.fill();
  if(p>0){pathRoundRect(ctx,72,1770,820*p,9,5);ctx.fillStyle=story.accent;ctx.fill();}
  text('@ANOMALI.FILES',72,1742,26,rgba(C.paper,.55),'left',800);
  text(`${Math.max(0,Math.ceil(story.audioDuration-t))}s`,970,1782,26,rgba(C.paper,.55),'right',700,1,'monospace');
  if(t>story.audioDuration-2.4){
    const q=out(invlerp(story.audioDuration-2.4,story.audioDuration-1.4,t));
    ctx.save();ctx.globalAlpha=q;
    pathRoundRect(ctx,126,1260,828,118,26);ctx.fillStyle='rgba(5,6,9,.90)';ctx.fill();ctx.strokeStyle=story.accent;ctx.lineWidth=4;ctx.stroke();
    text(story.id===10?'FILE 011? TULIS “LANJUT”':'FOLLOW UNTUK FILE BERIKUTNYA',540,1333,38,C.paper,'center',900);
    ctx.restore();
  }
}
function drawTexture(t){
  // scanlines + time-dependent gate weave. Deterministic at arbitrary seek times.
  ctx.save();
  ctx.globalCompositeOperation='screen';
  for(let y=0;y<H;y+=9){ctx.fillStyle='rgba(255,255,255,.012)';ctx.fillRect(0,y+jitter(t,y,.4),W,1);}
  for(let i=0;i<115;i++){
    const x=hash(i+500)*W,y=(hash(i+630)*H+t*(18+hash(i)*42))%H;
    ctx.fillStyle=i%7===0?rgba(story.accent,.045):'rgba(255,255,255,.026)';ctx.fillRect(x,y,1+hash(i)*2,1+hash(i+2)*5);
  }
  ctx.globalCompositeOperation='source-over';
  const vign=ctx.createRadialGradient(W/2,H*.47,400,W/2,H*.47,1180);vign.addColorStop(.52,'rgba(0,0,0,0)');vign.addColorStop(1,'rgba(0,0,0,.68)');ctx.fillStyle=vign;ctx.fillRect(0,0,W,H);
  // occasional authored glitch, never long enough to obscure captions
  const g=(Math.sin(t*9.7+story.id*2.1)+Math.sin(t*23.3))>1.78;
  if(g){
    const yy=330+hash(Math.floor(t*12))*1100;ctx.fillStyle=rgba(story.accent,.13);ctx.fillRect(0,yy,W,8+hash(2+t)*28);
    ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(0,yy+34,W,3);
  }
  ctx.restore();
}

function draw(time){
  currentTime=clamp(time,0,DURATION);
  const u=clamp(currentTime/DURATION);
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  background(currentTime,story.accent);
  beginCamera(u,currentTime);
  sceneDrawers[story.id-1](currentTime,u,story.accent);
  endCamera();
  drawTexture(currentTime);
  drawSceneLensUI(currentTime,u);
  drawTopUI(currentTime,u);
  drawHook(currentTime,u);
  drawCaption(currentTime);
  drawBottomUI(currentTime,u);
}

window.OPENER={
  ready:true,
  DURATION,
  seek(time){draw(Number(time)||0);},
  story:{id:story.id,title:story.title,slug:story.slug}
};

draw(0);
