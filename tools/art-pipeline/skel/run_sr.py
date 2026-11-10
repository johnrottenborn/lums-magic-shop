import numpy as np,json,sys,os
from PIL import Image
from esr import sr
src=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)/255
names=sys.argv[1:]
for nm in names:
    if os.path.exists(f'sr_{nm}.png'):continue
    x0,y0,x1,y1=json.load(open(f'b_{nm}.json'));m=np.load(f'm_{nm}.npy')
    from scipy import ndimage as nd
    m2=nd.binary_dilation(m,iterations=3)
    crop=src[y0:y1,x0:x1].copy();crop[~m2]=1.0
    crop=np.pad(crop,((8,8),(8,8),(0,0)),constant_values=1.0)
    out=sr(crop);Image.fromarray((out*255+.5).astype(np.uint8)).save(f'sr_{nm}.png')
    np.save(f'mk_{nm}.npy',np.pad(m2,8));print(nm,flush=True)
