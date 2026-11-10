import sys,os,numpy as np
sys.path.insert(0,'/home/claude/lum/skel');cwd=os.getcwd();os.chdir('/home/claude/lum/skel')
from esr import sr
from PIL import Image
os.chdir(cwd)
src=open('cut.py').read();exec(src.split("def matte")[0])
SRC8=np.array(Image.open('sheet.jpg').convert('RGB'))
os.makedirs('sr',exist_ok=True)
for k,lst in cells.items():
  if k in('attack','hurt'):continue
  for i,(x0,x1,r) in enumerate(lst):
    p=f'sr/{k}{i}.png'
    if os.path.exists(p):continue
    im=SRC8[R[r]+3:R[r+1]-2,x0+3:x1-2].astype(np.float32)/255
    o=sr(im);Image.fromarray((o*255+.5).astype(np.uint8)).save(p);print(p,flush=True)
