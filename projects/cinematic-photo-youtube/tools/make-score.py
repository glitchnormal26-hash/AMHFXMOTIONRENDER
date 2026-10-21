#!/usr/bin/env python3
"""Original cinematic score bed for the 'Resep Foto Cinematic AI' YouTube film.

Composed procedurally (no sampled/third-party audio): warm detuned pad over an
Am-F-C/G progression, sub root, sparse pentatonic plucks, filtered rain-air,
transition risers + sub booms synced to the edit's whip moments, and automatic
ducking under the voiceover. Output: audio/final-mix.wav (48 kHz stereo),
loudness-normalized for YouTube (-16 LUFS, TP -1.5 dBTP).

Usage: python3 tools/make-score.py
"""
import subprocess
import wave
import numpy as np

SR = 48000
T = 225.0
N = int(SR * T)
rng = np.random.default_rng(7)
t = np.arange(N) / SR

# ---------- decode voiceover to mono float ----------
raw = subprocess.run(
    ["/home/user/bin/ffmpeg", "-v", "error", "-i", "audio/voiceover.mp3",
     "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
    capture_output=True, check=True).stdout
vo = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
if len(vo) < N:
    vo = np.concatenate([vo, np.zeros(N - len(vo))])
vo = vo[:N]

# ---------- harmony ----------
CHORDS = {
    "Am": [57, 60, 64], "F": [53, 57, 60], "C": [55, 60, 64], "G": [50, 55, 59],
}
PROG = ["Am", "F", "C", "G"]
CH_DUR = 15.0
PENT = [69, 72, 74, 76, 79, 81]  # A pentatonic


def midi_f(m):
    return 440.0 * (2 ** ((m - 69) / 12))


def env_seg(length, attack, release):
    n = int(length * SR)
    e = np.ones(n)
    a = int(attack * SR)
    r = int(release * SR)
    if a > 0:
        e[:a] = np.linspace(0, 1, a) ** 2
    if r > 0:
        e[-r:] = np.linspace(1, 0, r) ** 2
    return e


pad = np.zeros(N)
pad_r = np.zeros(N)
sub = np.zeros(N)
for ci in range(int(T / CH_DUR) + 1):
    start = ci * CH_DUR
    if start >= T:
        break
    name = PROG[ci % 4]
    notes = CHORDS[name]
    seg_len = min(CH_DUR + 4.0, T - start)
    n = int(seg_len * SR)
    ts = np.arange(n) / SR
    e = env_seg(seg_len, 3.0, 4.0)
    for m in notes:
        f = midi_f(m)
        for ch, det in ((pad, 0.6), (pad_r, -0.6)):
            w = (np.sin(2 * np.pi * (f + det) * ts)
                 + 0.35 * np.sin(4 * np.pi * (f + det) * ts)
                 + 0.12 * np.sin(6 * np.pi * (f + det) * ts))
            ch[int(start * SR):int(start * SR) + n] += 0.11 * w * e
    fsub = midi_f(notes[0] - 12)
    sub[int(start * SR):int(start * SR) + n] += 0.09 * np.sin(2 * np.pi * fsub * ts) * e

# ---------- sparse plucks ----------
pluck = np.zeros(N)
pluck_r = np.zeros(N)
tt = 2.0
i = 0
while tt < T - 6:
    m = PENT[int(rng.integers(0, len(PENT)))]
    f = midi_f(m)
    n = int(1.6 * SR)
    ts = np.arange(n) / SR
    w = (np.sin(2 * np.pi * f * ts) + 0.5 * np.sin(4 * np.pi * f * ts)) * np.exp(-ts / 0.45)
    w *= env_seg(1.6, 0.01, 0.5)
    g = 0.05 * (0.7 + 0.6 * rng.random())
    s0 = int(tt * SR)
    if i % 2 == 0:
        pluck[s0:s0 + n] += g * w
        pluck_r[s0:s0 + n] += 0.35 * g * w
    else:
        pluck_r[s0:s0 + n] += g * w
        pluck[s0:s0 + n] += 0.35 * g * w
    tt += 1.875 if rng.random() > 0.3 else 3.75
    i += 1

# ---------- rain air ----------
noise = rng.standard_normal(N)
air = np.zeros(N)
a = 0.06
acc = 0.0
for blk in range(0, N, 480000):
    seg = noise[blk:blk + 480000]
    out = np.empty_like(seg)
    for j in range(seg.shape[0]):
        acc += a * (seg[j] - acc)
        out[j] = acc
    air[blk:blk + 480000] = out
air *= 0.010 * (1 + 0.3 * np.sin(2 * np.pi * 0.05 * t))

# ---------- risers + booms at edit whips ----------
WHIPS = [16.6, 25.6, 37.0, 56.2, 113.2, 137.5, 150.2, 163.2, 177.3, 208.4]
fx = np.zeros(N)
for wtime in WHIPS:
    s0 = int((wtime - 0.9) * SR)
    n = int(0.9 * SR)
    if s0 < 0:
        continue
    ts = np.arange(n) / SR
    nz = rng.standard_normal(n)
    lp = np.zeros(n)
    acc = 0.0
    for j in range(n):
        aa = 0.02 + 0.45 * (j / n)
        acc += aa * (nz[j] - acc)
        lp[j] = acc
    lp *= np.linspace(0, 1, n) ** 2 * 0.06
    fx[s0:s0 + n] += lp
    nb = int(1.0 * SR)
    tb = np.arange(nb) / SR
    fsw = 60 * np.exp(-tb * 1.1) + 30
    ph = 2 * np.pi * np.cumsum(fsw) / SR
    boom = np.sin(ph) * np.exp(-tb * 4.5) * 0.16
    e0 = int(wtime * SR)
    fx[e0:e0 + nb] += boom

# ---------- assemble music, duck under VO ----------
music_l = pad + sub + pluck + air + fx
music_r = pad_r + sub + pluck_r + air + fx
peak = max(np.abs(music_l).max(), np.abs(music_r).max())
music_l *= 0.5 / peak
music_r *= 0.5 / peak

hop = 2048
frames = np.lib.stride_tricks.sliding_window_view(vo, hop)[::hop]
rms = np.sqrt((frames ** 2).mean(axis=1))
pres = np.clip((rms - 0.004) / 0.05, 0, 1)
pres = np.convolve(pres, np.ones(24) / 24, mode="same")  # ~0.5 s smooth
duck = 0.95 - 0.62 * pres
duck_sig = np.repeat(duck, hop)[:N]
if len(duck_sig) < N:
    duck_sig = np.concatenate([duck_sig, np.full(N - len(duck_sig), duck_sig[-1])])

fade_in = np.clip(t / 2.0, 0, 1)
fade_out = np.clip((T - t) / 5.0, 0, 1)
fade = fade_in * fade_out
mix_l = vo * 1.0 + music_l * duck_sig * fade
mix_r = vo * 1.0 + music_r * duck_sig * fade

# ---------- write pre-master ----------
stereo = np.stack([mix_l, mix_r], axis=1)
stereo = stereo / max(np.abs(stereo).max(), 1e-9) * 0.89
pcm = (stereo * 32767).astype("<i2")
with wave.open("audio/premix.wav", "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(pcm.tobytes())

# ---------- loudness normalize for YouTube ----------
subprocess.run(
    ["/home/user/bin/ffmpeg", "-y", "-v", "error", "-i", "audio/premix.wav",
     "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2",
     "audio/final-mix.wav"],
    check=True)
print("score + mix written: audio/final-mix.wav")
