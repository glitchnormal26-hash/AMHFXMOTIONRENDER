#!/usr/bin/env bash
# Merakit 5 still AI menjadi satu video sinematik 20 detik (1920x1080, 24 fps, H.264 + AAC).
# Ini pipeline lokal "text-to-video" tanpa API: still di-generate dari prompt,
# lalu diberi gerak kamera (push-in, pan, pull-out, tilt) + transisi + grade + ambience.
set -euo pipefail

cd "$(dirname "$0")"

FFMPEG="${FFMPEG_PATH:-ffmpeg}"
OUT="${1:-neon-jakarta.mp4}"
FONT="${FONT_FILE:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"

# 5 shot x 4.6s, overlap xfade 0.8s  ->  total 19.8s
SHOT=4.6
FADE=0.8
STEP=$(python3 -c "print($SHOT-$FADE)")

FILTER="$(mktemp)"
trap 'rm -f "$FILTER"' EXIT

cat > "$FILTER" <<EOF
[0:v]scale=2400:1350:flags=lanczos,setsar=1,zoompan=z='min(1.0+0.0017*on,1.20)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v0];
[1:v]scale=2112:1188:flags=lanczos,setsar=1,crop=1920:1080:x='(in_w-out_w)*min(t/${SHOT},1)':y='(in_h-out_h)/2',fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v1];
[2:v]scale=2400:1350:flags=lanczos,setsar=1,zoompan=z='min(1.0+0.0022*on,1.26)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+20*sin(on/24)':d=1:s=1920x1080:fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v2];
[3:v]scale=2400:1350:flags=lanczos,setsar=1,zoompan=z='max(1.22-0.0019*on,1.02)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v3];
[4:v]scale=2112:1188:flags=lanczos,setsar=1,crop=1920:1080:x='(in_w-out_w)/2':y='(in_h-out_h)*(1-min(t/${SHOT},1))',fps=24,trim=duration=${SHOT},setpts=PTS-STARTPTS[v4];
[v0][v1]xfade=transition=fade:duration=${FADE}:offset=$(python3 -c "print(round($STEP,3))")[x1];
[x1][v2]xfade=transition=fadeblack:duration=${FADE}:offset=$(python3 -c "print(round($STEP*2,3))")[x2];
[x2][v3]xfade=transition=fade:duration=${FADE}:offset=$(python3 -c "print(round($STEP*3,3))")[x3];
[x3][v4]xfade=transition=fadeblack:duration=${FADE}:offset=$(python3 -c "print(round($STEP*4,3))")[x4];
[x4]eq=contrast=1.06:saturation=1.08:gamma=0.98,vignette=angle=PI/5,noise=alls=3:allf=t,
drawtext=fontfile=${FONT}:text='NEON JAKARTA':fontcolor=white:fontsize=92:x=(w-text_w)/2:y=h*0.40:borderw=2:bordercolor=black@0.35:alpha='if(lt(t,1.0),0,if(lt(t,1.9),(t-1.0)/0.9,if(lt(t,3.4),1,if(lt(t,4.2),(4.2-t)/0.8,0))))',
drawtext=fontfile=${FONT}:text='hujan  •  kopi  •  cahaya':fontcolor=white@0.85:fontsize=34:x=(w-text_w)/2:y=h*0.575:alpha='if(lt(t,1.6),0,if(lt(t,2.5),(t-1.6)/0.9,if(lt(t,3.8),1,if(lt(t,4.6),(4.6-t)/0.8,0))))',
drawtext=fontfile=${FONT}:text='wan-ai-video':fontcolor=white:fontsize=54:x=(w-text_w)/2:y=h*0.455:borderw=2:bordercolor=black@0.45:alpha='if(lt(t,17.2),0,if(lt(t,18.0),(t-17.2)/0.8,if(lt(t,19.2),1,if(lt(t,19.8),(19.8-t)/0.6,0))))',
drawtext=fontfile=${FONT}:text='text  →  video':fontcolor=white@0.85:fontsize=30:x=(w-text_w)/2:y=h*0.545:borderw=2:bordercolor=black@0.45:alpha='if(lt(t,17.5),0,if(lt(t,18.3),(t-17.5)/0.8,if(lt(t,19.2),1,if(lt(t,19.8),(19.8-t)/0.6,0))))',
scale=in_range=full:out_range=limited,fade=t=in:st=0:d=0.8,fade=t=out:st=18.9:d=0.9,format=yuv420p[vout];
[5:a]highpass=f=520,lowpass=f=8200,volume=0.17,afade=t=in:st=0:d=1.5,afade=t=out:st=18.2:d=1.6[aout]
EOF

"$FFMPEG" -hide_banner -loglevel error -y \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-01.jpg \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-02.jpg \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-03.jpg \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-04.jpg \
  -loop 1 -framerate 24 -t "$SHOT" -i src/shot-05.jpg \
  -f lavfi -t 19.8 -i "anoisesrc=color=pink:amplitude=0.6:sample_rate=48000" \
  -filter_complex "$(cat "$FILTER")" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -r 24 \
  -c:a aac -b:a 128k -ar 48000 \
  -movflags +faststart -t 19.8 \
  "$OUT"

echo "selesai: $(pwd)/$OUT"
"$FFMPEG" -hide_banner -i "$OUT" 2>&1 | grep -E "Duration|Stream" || true
