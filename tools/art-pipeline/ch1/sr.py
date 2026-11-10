import sys,os,json,numpy as np
sys.path.insert(0,'/home/claude/lum/skel');cwd=os.getcwd();os.chdir('/home/claude/lum/skel')
from esr import sr
from PIL import Image
os.chdir(cwd)
meta=json.load(open('meta.json'))
order=['wisp','reaper','rskel','vane']
for sh in order:
  for an,n in meta[sh].items():
    for i in range(n):
      f=f'{sh}_{an}{i}'
      if os.path.exists(f'sr_{f}.png'):continue
      im=np.array(Image.open(f'c_{f}.png').convert('RGB')).astype(np.float32)/255
      im=np.pad(im,((6,6),(6,6),(0,0)),constant_values=1)
      o=sr(im);Image.fromarray((o*255+.5).astype(np.uint8)).save(f'sr_{f}.png');print(f,flush=True)
