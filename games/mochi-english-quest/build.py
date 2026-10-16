#!/usr/bin/env python3
"""Gabungkan src/index.template.html + src/*.js menjadi index.html (satu berkas)."""
import os
d=os.path.dirname(os.path.abspath(__file__))
t=open(d+'/src/index.template.html').read()
parts={'/*__ADV_DATA__*/':'adv_data.js','/*__CAT_JS__*/':'catalog.js','/*__ADV_JS__*/':'adventure.js','/*__OW_JS__*/':'openworld.js'}
for ph,fn in parts.items():
    assert ph in t,ph
    p=d+'/src/'+fn
    js=open(p).read().rstrip('\n') if os.path.exists(p) else ''
    t=t.replace(ph,js)
open(d+'/index.html','w').write(t)
print('index.html dibuat',len(t),'byte')
