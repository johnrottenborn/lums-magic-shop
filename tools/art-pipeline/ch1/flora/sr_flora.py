import sys,os,numpy as np,time
sys.path.insert(0,'/home/claude/lum/skel');cwd=os.getcwd();os.chdir('/home/claude/lum/skel')
from esr import sr
from PIL import Image
os.chdir(cwd)
exec(open('cells.py').read())
SRC8=np.array(Image.open('sheet.jpg').convert('RGB'))
os.makedirs('sr',exist_ok=True)
for k,lst in cells.items():
  for i,(x0,y0,x1,y1) in enumerate(lst):
    p=f'sr/{k}{i}.png'
    if os.path.exists(p):continue
    t=time.time();im=SRC8[y0:y1,x0:x1].astype(np.float32)/255
    o=sr(im);Image.fromarray((o*255+.5).clip(0,255).astype(np.uint8)).save(p);print(p,round(time.time()-t,1),flush=True)
