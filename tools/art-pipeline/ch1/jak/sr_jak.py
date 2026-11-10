import sys,os,numpy as np,time,glob
sys.path.insert(0,'/home/claude/lum/skel');cwd=os.getcwd();os.chdir('/home/claude/lum/skel')
from esr import sr
from PIL import Image
os.chdir(cwd);os.makedirs('sr',exist_ok=True)
for p in sorted(glob.glob('crops/*.png')):
    o='sr/'+os.path.basename(p)
    if os.path.exists(o):continue
    t=time.time();im=np.array(Image.open(p).convert('RGB')).astype(np.float32)/255
    r=sr(im);Image.fromarray((r*255+.5).clip(0,255).astype(np.uint8)).save(o);print(o,round(time.time()-t,1),flush=True)
