"""Validate actual deliverables, decode samples and report objective evidence."""
import hashlib,json,subprocess
from pathlib import Path
import numpy as np
from PIL import Image

out=Path('output/cybersecurity'); results=[]
for p in sorted(out.glob('*.mp4')):
    meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(p)]))
    v=next(s for s in meta['streams'] if s['codec_type']=='video')
    assert (v['width'],v['height'])==(3840,2160),p
    assert v['r_frame_rate']=='30/1' and v['nb_read_frames']=='300',p
    assert abs(float(meta['format']['duration'])-10)<.001,p
    assert v['codec_name']=='h264',p
    # Every frame must decode without errors.
    check=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True)
    assert check.returncode==0 and not check.stderr,(p,check.stderr)
    sample=out/'qa'/(p.stem+'-encoded.png')
    subprocess.run(['ffmpeg','-v','error','-y','-ss','2.5','-i',str(p),'-frames:v','1',str(sample)],check=True)
    a=np.asarray(Image.open(sample).convert('RGB'))
    bg=a[20:180,20:180].mean((0,1))
    assert bg[1]>245 and bg[0]<8 and bg[2]<8,(p,bg)
    green=(a[:,:,1]>245)&(a[:,:,0]<8)&(a[:,:,2]<8)
    assert green.mean()>.7,(p,green.mean())
    results.append({'file':p.name,'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'frames':int(v['nb_read_frames']),'seconds':float(meta['format']['duration']),'codec':v['codec_name'],'bitrate':int(v['bit_rate']),'bytes':p.stat().st_size,'green_fraction':round(float(green.mean()),4),'decode':'PASS','sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
assert len(results)==10,len(results)
assert len({r['sha256'] for r in results})==10
(out/'verification.json').write_text(json.dumps({'technical_status':'TECHNICAL_VERIFIED','normal_speed_visual_playback':'NOT_VERIFIED','clips':results},indent=2)+'\n')
print(json.dumps(results,indent=2))
