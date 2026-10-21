#!/usr/bin/env python3
"""make-caps3.py — bangun cue caption karaoke dari teks VO + timing3.json.
Output: audio/caps3.js  (baris JS: const CAPS=[ [t0,t1,"teks",idxKataKunci], ... ])
Frase dibagi per kalimat lalu di-chunk 4-7 kata; durasi frase proporsional jumlah karakter.
"""
import json, re, pathlib
P = pathlib.Path(__file__).resolve().parent.parent / "projects" / "chrome-y2k-poster"
t = json.load(open(P / "audio" / "timing3.json"))
KEYWORDS = {"chrome","liquid","silver","lavender","gothic","portrait","tipografi","typography",
            "material","lighting","pencahayaan","komposisi","composition","prompt","hierarki",
            "hierarchy","masthead","inset","ornamen","ornaments","grading","bevel","refleksi",
            "reflection","kontras","contrast","highlight","identity","visual","editorial","y2k",
            "subscribe","original","wireframe","moodboard"}
cues = []
for i, (st, du) in enumerate(zip(t["starts"], t["durations"]), 1):
    txt = (P / "audio" / "vo3-text" / f"s{i:02d}.txt").read_text().strip()
    sents = [s.strip() for s in re.split(r"(?<=[.?])\s+", txt) if s.strip()]
    phrases = []
    for s in sents:
        words = s.split()
        cur = []
        for w in words:
            cur.append(w)
            if len(cur) >= 6 and (w.endswith((",", ".")) or len(cur) >= 8):
                phrases.append(" ".join(cur)); cur = []
        if cur:
            phrases.append(" ".join(cur))
    tot = sum(len(p) for p in phrases) or 1
    ct = st
    for p in phrases:
        fd = du * len(p) / tot
        kw = -1
        for j, w in enumerate(re.findall(r"[A-Za-z0-9×'-]+", p)):
            if w.strip("',.-").lower() in KEYWORDS:
                kw = j; break
        cues.append([round(ct, 2), round(ct + fd - 0.06, 2), p, kw])
        ct += fd
lines = ",\n".join(f'  [{a},{b},{json.dumps(c, ensure_ascii=False)},{k}]' for a, b, c, k in cues)
(P / "audio" / "caps3.js").write_text("const CAPS=[\n" + lines + "\n];\n")
print("CUES:", len(cues), "| span", cues[0][0], "->", cues[-1][1])
