#!/usr/bin/env python3
"""make-score3.py — score prosedural dark-electronic ~100 BPM untuk chrome-y2k-poster.
Env: T (durasi detik), OUT (path wav). Layer: sub-pulse per beat, pad lavender detuned,
hat offbeat (bab berenergi), shimmer metalik jarang, whip/impact di awal bab, riser pra-bab.
"""
import numpy as np, os, wave, json, pathlib
T = float(os.environ.get("T", 718.58))
OUT = os.environ.get("OUT", "score3.wav")
P = pathlib.Path(__file__).resolve().parent.parent / "projects" / "chrome-y2k-poster"
tim = json.load(open(P / "audio" / "timing3.json"))
SR = 48000
N = int(T * SR)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
mix = np.zeros(N)
BPM = 100.0; BEAT = 60.0 / BPM
bars = int(T / (BEAT * 4)) + 1
# ---- pad lavender (detuned saw thru lowpass sederhana) ----
def saw(f, ph=0.0):
    x = (t * f + ph) % 1.0
    return 2 * x - 1
pad = np.zeros(N)
chord_roots = [55.0, 49.0, 65.41, 58.27]  # A1 G1 C2 Bb1 rotasi per 4 bar
for b in range(bars):
    f0 = chord_roots[(b // 4) % 4]
    s0, s1 = int(b * 4 * BEAT * SR), int(min((b + 1) * 4 * BEAT, T) * SR)
    if s0 >= N: break
    tt = t[s0:s1]
    seg = 0.0
    for mult, det in ((2, 0.0), (3, 0.7), (2, -0.6), (4, 0.3)):
        ph = rng.uniform()
        seg += np.sin(2 * np.pi * (f0 * mult + det) * tt + ph) * (0.5 / mult)
    env = np.minimum(1, (tt - tt[0]) / 1.2) * np.minimum(1, (tt[-1] - tt) / 1.2 + 0.001)
    pad[s0:s1] += seg * env.clip(0, 1)
mix += pad * 0.16
# ---- sub pulse tiap beat (bab tertentu lebih kuat) ----
pulse = np.zeros(N)
nb = int(T / BEAT)
for k in range(nb):
    s = int(k * BEAT * SR)
    L = int(0.22 * SR)
    if s + L > N: break
    tt = np.arange(L) / SR
    f = 52.0 if (k % 8) < 4 else 49.0
    pulse[s:s + L] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 14) * (0.9 if k % 4 == 0 else 0.55)
mix += pulse * 0.20
# ---- hat offbeat (energi per bab) ----
energy = [1, .8, .6, .7, .9, .8, .7, .8, .9, .6]
hat = np.zeros(N)
for k in range(nb):
    ch = min(int(k * BEAT / (BEAT * 4) * 0.999 + (k * BEAT) // (tim["starts"][-1] or 1) * 0), 9)
    # tentukan bab dari waktu
    w = k * BEAT
    ch = max(i for i in range(10) if tim["starts"][i] <= w) if w >= tim["starts"][0] else 0
    e = energy[ch]
    if e < 0.65: continue
    s = int((k + 0.5) * BEAT * SR)
    L = int(0.06 * SR)
    if s + L > N: break
    tt = np.arange(L) / SR
    nz = rng.standard_normal(L)
    nz = np.convolve(nz, np.ones(3) / 3, "same")
    hat[s:s + L] += nz * np.exp(-tt * 90) * 0.5 * e
mix += hat * 0.10
# ---- shimmer metalik jarang ----
for k in range(0, nb, 7):
    s = int(k * BEAT * SR)
    L = int(1.1 * SR)
    if s + L > N: break
    tt = np.arange(L) / SR
    f = rng.choice([1567.98, 1760.0, 2093.0])
    mix[s:s + L] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 5) * 0.05
    mix[s:s + L] += np.sin(2 * np.pi * f * 1.5 * tt + 0.4) * np.exp(-tt * 7) * 0.03
# ---- whip/impact awal bab + riser 1.2s sebelumnya ----
for st in tim["starts"][1:]:
    s = int(st * SR)
    Lr = int(1.2 * SR)
    if s - Lr > 0:
        tt = np.arange(Lr) / SR
        nz = rng.standard_normal(Lr)
        mix[s - Lr:s] += nz * (tt / 1.2) ** 2 * 0.16
    L = int(0.5 * SR)
    if s + L < N:
        tt = np.arange(L) / SR
        mix[s:s + L] += np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 10) * 0.5
        nz = rng.standard_normal(L)
        mix[s:s + L] += nz * np.exp(-tt * 30) * 0.22
# ---- normalisasi score ke ~ -24 LUFS kasar (peak-based) ----
mix /= max(1e-9, np.max(np.abs(mix)))
mix *= 0.28
# fade in/out global
fi = int(2.0 * SR); fo = int(4.0 * SR)
mix[:fi] *= np.linspace(0, 1, fi)
mix[-fo:] *= np.linspace(1, 0, fo)
# ---- ducking envelope terhadap jendela VO ----
env = np.full(N, 0.85)
for st, du in zip(tim["starts"], tim["durations"]):
    a = max(0, int((st - 0.15) * SR)); b = min(N, int((st + du + 0.35) * SR))
    env[a:b] = 0.30
r = int(0.4 * SR)
env = np.convolve(env, np.ones(r) / r, "same")
mix *= env
data = (mix * 32767).astype("<i2")
with wave.open(OUT, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(data.tobytes())
print("SCORE OK", OUT, round(N / SR, 2), "s")
