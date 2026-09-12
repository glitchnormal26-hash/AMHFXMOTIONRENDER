import json
import subprocess
import wave
from pathlib import Path
import numpy as np

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'audio'
SR=48000
DURATION=32
rng=np.random.default_rng(731)
mix=np.zeros((SR*DURATION,2),dtype=np.float64)
vo=np.zeros(SR*DURATION,dtype=np.float64)

def decode(path):
    b=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ac','1','-ar',str(SR),'-'])
    return np.frombuffer(b,dtype=np.float32).astype(np.float64)

def tighten(x):
    # Measure real speech and trim only long silent gaps. Do not speed up the voice.
    win=480
    energy=np.array([np.sqrt(np.mean(x[i:i+win]**2)) for i in range(0,len(x),win)])
    active=np.flatnonzero(energy>.00065)
    start=max(0,(active[0]-3)*win);end=min(len(x),(active[-1]+5)*win)
    x=x[start:end]
    energy=np.array([np.sqrt(np.mean(x[i:i+win]**2)) for i in range(0,len(x),win)])
    quiet=energy<.0005
    runs=[];s=None
    for i,q in enumerate(np.r_[quiet,False]):
        if q and s is None:s=i
        if not q and s is not None:
            if i-s>52:runs.append((s*win,i*win))
            s=None
    for a,b in reversed(runs):
        keep=int(.27*SR)
        x=np.concatenate([x[:a+keep//2],x[b-keep//2:]])
    fade=min(600,len(x)//10)
    x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
    return x

manifest=json.loads((OUT/'vo-timing.json').read_text())
for i,item in enumerate(manifest):
    x=tighten(decode(OUT/item['file']))
    x*=.69/max(.1,float(np.max(np.abs(x))))
    start=round(item['start']*SR);end=start+len(x)
    next_start=manifest[i+1]['start'] if i+1<len(manifest) else DURATION
    assert end/SR < next_start-.10, f'VO overlap at segment {i+1}: {end/SR} > {next_start}'
    vo[start:end]+=x
    item['edited_duration']=round(len(x)/SR,4)
    print(f"VO {i+1}: {len(x)/SR:.3f}s, ends {end/SR:.3f}")
(OUT/'mix-timing.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))

def put(x,at,gain=.25,pan=0):
    start=round(at*SR)
    n=min(len(x),len(mix)-start)
    if n<=0:return
    pan=np.clip(pan,-1,1)
    mix[start:start+n,0]+=x[:n]*gain*np.sqrt((1-pan)/2)
    mix[start:start+n,1]+=x[:n]*gain*np.sqrt((1+pan)/2)

def tick(at,freq=1600,gain=.07,pan=0):
    t=np.arange(int(.065*SR))/SR
    x=(np.sin(2*np.pi*freq*t)*.65+rng.normal(0,.17,len(t)))*np.exp(-t*95)
    put(x,at,gain,pan)

def contact(at,weight=.5):
    t=np.arange(int(.29*SR))/SR
    phase=2*np.pi*(100*t+230*.025*(1-np.exp(-t/.025)))
    x=np.sin(phase)*np.exp(-t*22)+rng.normal(0,.18,len(t))*np.exp(-t*65)
    put(x,at,weight)

def servo(at,dur=.65,gain=.18,pan=0):
    t=np.arange(int(dur*SR))/SR;p=t/dur
    noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(9)/9,'same')
    env=np.sin(np.pi*p)**1.8
    x=(noise*.65+np.sin(2*np.pi*(350*t+540*t*t/dur))*.15)*env
    put(x,at,gain,pan)

def confirm(at):
    t=np.arange(int(.33*SR))/SR
    x=(np.sin(2*np.pi*1700*t)+.15*np.sin(2*np.pi*3400*t))*np.exp(-t*18)
    put(x,at,.115,.2)

contact(.06,.38);contact(.5,.22)
for i in range(42):tick(.4+i*.075,1250+(i%7)*180,.038,((i%3)-1)*.3)
servo(3.03,.69,.13,-.2)
servo(5.72,.88,.24,-.25)
tick(7.4,910,.15,.45);contact(7.44,.19)
servo(7.89,1.58,.3,.25)
contact(9.63,.37);confirm(9.78)
tick(11.5,1200,.18,.4);servo(11.82,.58,.16)
confirm(12.35)
servo(13.64,1.16,.23)
contact(14.88,.32)
for i in range(12):tick(15.03+i*.073,1200+i*79,.06,(i%5-2)/3)
contact(16.13,.23);servo(16.4,.85,.17)
contact(17.03,.22);tick(17.21,900,.1)
servo(17.55,.8,.31);contact(18.26,.43)
for at in [19.3,21.46,23.65]:
    tick(at,1500,.11);confirm(at+.04)
for at in [19.02,20.37,21.72,23.08,24.35]:
    servo(at,.14,.16,-.35)
servo(24.51,.84,.31);contact(25.45,.30);contact(25.66,.23)
confirm(25.82);contact(27.35,.26);tick(29.7,1400,.11,.35)

# Very quiet non-tonal processing texture, localized to generation only.
a=int(12.45*SR);b=int(17.4*SR)
texture=rng.normal(0,.0018,b-a)
mix[a:b,0]+=texture;mix[a:b,1]+=texture
# Voice owns the mix; measured signal automatically ducks designed effects.
voice_env=np.convolve(np.abs(vo)[::480],np.ones(15)/15,'same')
env=np.interp(np.arange(len(vo))/480,np.arange(len(voice_env)),voice_env)
mix*=np.where(env[:,None]>.022,.52,1)
mix+=vo[:,None]*.83
mix*=np.minimum(1,np.arange(len(mix))[:,None]/int(.015*SR))
mix[-int(.6*SR):]*=np.linspace(1,0,int(.6*SR))[:,None]
peak=np.max(np.abs(mix));mix*=.87/max(.87,peak)
with wave.open(str(OUT/'premix.wav'),'wb') as f:
    f.setparams((2,2,SR,len(mix),'NONE','not compressed'))
    f.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/'premix.wav'),'-af','loudnorm=I=-15:TP=-1.2:LRA=8','-ar',str(SR),'-c:a','pcm_s24le',str(OUT/'final-mix.wav')],check=True)
print('32 s stereo narration + original electronic SFX. No BGM.')
