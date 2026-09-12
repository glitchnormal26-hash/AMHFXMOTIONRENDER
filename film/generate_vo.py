import asyncio
import importlib
import json
import subprocess
from pathlib import Path

import edge_tts

# Retain TLS verification while using the execution environment's trusted CA bundle.
importlib.import_module('edge_tts.communicate')._SSL_CTX.load_verify_locations('/etc/ssl/certs/ca-certificates.crt')
ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'audio'
OUT.mkdir(exist_ok=True)
SEGMENTS = [
    (0.30, 'Satu chat. Jadi animasi.'),
    (3.10, 'Tulis idenya. Buatkan animasi Flappy Bird.'),
    (7.40, 'Tarik skill dari GitHub. Jatuhkan ke chat.'),
    (11.75, 'Kirim. Lihat idemu mulai bergerak.'),
    (16.00, 'Karakter terbentuk. Dunia tersusun.'),
    (20.20, 'Gerak, ritme, dan detail. Semua jadi satu.'),
    (25.60, 'Dari teks, jadi motion.'),
    (29.10, 'Sekarang, giliran idemu.'),
]

async def synth(text, voice, path):
    for attempt in range(3):
        try:
            await asyncio.wait_for(edge_tts.Communicate(text, voice, rate='+4%').save(str(path)), timeout=45)
            return
        except Exception:
            if attempt == 2:
                raise

async def main():
    sample = 'Satu chat. Jadi animasi. Tulis idenya. Buatkan animasi Flappy Bird. Tarik skill dari GitHub, lalu jatuhkan ke chat.'
    for name in ['Ardi', 'Gadis']:
        p = OUT / f'audition-{name.lower()}.mp3'
        if not p.exists() or p.stat().st_size < 1000:
            await synth(sample, f'id-ID-{name}Neural', p)
            print('Audition ready:', name, flush=True)
    manifest = []
    for i, (start, text) in enumerate(SEGMENTS):
        p = OUT / f'vo-{i+1:02d}.mp3'
        if not p.exists() or p.stat().st_size < 1000:
            await synth(text, 'id-ID-ArdiNeural', p)
        duration = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
        manifest.append({'start':start,'duration':duration,'text':text,'file':p.name,'voice':'id-ID-ArdiNeural'})
        print(f'{i+1}: {duration:.3f}s at {start:.2f}s — {text}', flush=True)
    (OUT / 'vo-timing.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False))

asyncio.run(main())
