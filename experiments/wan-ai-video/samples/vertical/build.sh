#!/usr/bin/env bash
# Versi 9:16 (1080x1920) dari pipeline yang sama: 4 still AI -> video 14,7 detik.
set -euo pipefail
cd "$(dirname "$0")"

FFMPEG="${FFMPEG_PATH:-ffmpeg}"
OUT="${1:-bali-sore-9x16.mp4}"
FONT="${FONT_FILE:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"

SHOT=4.2
FADE=0.7
STEP=$(python3 -c "print(round($SHOT-$FADE,3))")
TOTAL=$(python3 -c "print(round(4*$SHOT-3*$FADE,2))")

FILTER="$(mktemp)"
trap 'rm -f "$FILTER"' EXIT

cat > "$FILTER" <<EOF
[0:v]scale=2376:4224:flags=lanczos,setsar=1,zoompan=z='min(1.0+0.0020*on,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v0];
[1:v]scale=1188:2112:flags=lanczos,setsar=1,crop=1080:1920:x='(in_w-out_w)/2':y='(in_h-out_h)*(1-min(t/${SHOT},1))',fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v1];
[2:v]scale=2376:4224:flags=lanczos,setsar=1,zoompan=z='min(1.0+0.0024*on,1.22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v2];
[3:v]scale=2376:4224:flags=lanczos,setsar=1,zoompan=z='max(1.20-0.0018*on,1.02)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v3];
[v0][v1]xfade=transition=fade:duration=${FADE}:offset=$(python3 -c "print(round($STEP,3))")[x1];
[x1][v2]xfade=transition=fadeblack:duration=${FADE}:offset=$(python3 -c "print(round($STEP*2,3))")[x2];
[x2][v3]xfade=transition=fade:duration=${FADE}:offset=$(python3 -c "print(round($STEP*3,3))")[x3];
[x3]eq=contrast=1.06:saturation=1.10:gamma=0.98,vignette=angle=PI/5,noise=alls=3:allf=t,
drawtext=fontfile=${FONT}:text='SORE DI BALI':fontcolor=white:fontsize=78:x=(w-text_w)/2:y=h*0.30:borderw=2:bordercolor=black@0.4:alpha='if(lt(t,0.9),0,if(lt(t,1.8),(t-0.9)/0.9,if(lt(t,3.2),1,if(lt(t,4.0),(4.0-t)/0.8,0))))',
drawtext=fontfile=${FONT}:text='sawah  •  kabut  •  cahaya emas':fontcolor=white@0.88:fontsize=30:x=(w-text_w)/2:y=h*0.355:borderw=2:bordercolor=black@0.35:alpha='if(lt(t,1.5),0,if(lt(t,2.4),(t-1.5)/0.9,if(lt(t,3.6),1,if(lt(t,4.4),(4.4-t)/0.8,0))))',
drawtext=fontfile=${FONT}:text='wan-ai-video':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=h*0.455:borderw=2:bordercolor=black@0.45:alpha='if(lt(t,11.9),0,if(lt(t,12.7),(t-11.9)/0.8,if(lt(t,14.0),1,if(lt(t,${TOTAL}),((${TOTAL}-t)/0.7),0))))',
drawtext=fontfile=${FONT}:text='text  →  video':fontcolor=white@0.85:fontsize=28:x=(w-text_w)/2:y=h*0.505:borderw=2:bordercolor=black@0.45:alpha='if(lt(t,12.2),0,if(lt(t,13.0),(t-12.2)/0.8,if(lt(t,14.0),1,if(lt(t,${TOTAL}),((${TOTAL}-t)/0.7),0))))',
scale=in_range=full:out_range=limited,fade=t=in:st=0:d=0.7,fade=t=out:st=$(python3 -c "print(round($TOTAL-0.8,2))"):d=0.8,format=yuv420p[vout];
[4:a]highpass=f=520,lowpass=f=8200,volume=0.16,afade=t=in:st=0:d=1.4,afade=t=out:st=$(python3 -c "print(round($TOTAL-1.6,2))"):d=1.6[aout]
EOF

"$FFMPEG" -hide_banner -loglevel error -y \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-01.jpg \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-02.jpg \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-03.jpg \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-04.jpg \
  -f lavfi -t "$TOTAL" -i "anoisesrc=color=pink:amplitude=0.6:sample_rate=48000" \
  -filter_complex "$(cat "$FILTER")" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -r 24 \
  -c:a aac -b:a 128k -ar 48000 \
  -movflags +faststart -t "$TOTAL" \
  "$OUT"

echo "selesai: $(pwd)/$OUT"
"$FFMPEG" -hide_banner -i "$OUT" 2>&1 | grep -E "Duration|Stream" || true
