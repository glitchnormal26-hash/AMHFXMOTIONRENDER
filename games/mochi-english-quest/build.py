#!/usr/bin/env python3
"""Gabungkan src/index.template.html + src/openworld.js (+ src/openworld.css) menjadi index.html (satu berkas)."""
import os
d=os.path.dirname(os.path.abspath(__file__))
t=open(d+'/src/index.template.html').read()
js=open(d+'/src/openworld.js').read()
assert '/*__OW_JS__*/' in t
open(d+'/index.html','w').write(t.replace('/*__OW_JS__*/',js.rstrip('\n')))
print('index.html dibuat',len(t)+len(js),'byte')
