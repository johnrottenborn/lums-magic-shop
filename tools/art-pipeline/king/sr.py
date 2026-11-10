import sys,os,json,numpy as np
sys.path.insert(0,'/home/claude/lum/skel');os.chdir('/home/claude/lum/skel')
from esr import sr
from PIL import Image
os.chdir('/home/claude/lum/king')
for n in json.load(open('meta.json')):
  if os.path.exists(f'sr_{n}.png'):continue
  im=np.array(Image.open(f'c_{n}.png').convert('RGB')).astype(np.float32)/255
  o=sr(im);Image.fromarray((o*255+.5).astype(np.uint8)).save(f'sr_{n}.png');print(n,flush=True)
