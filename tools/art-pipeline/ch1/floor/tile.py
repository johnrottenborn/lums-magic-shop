from PIL import Image
import numpy as np
from scipy import ndimage
im=np.array(Image.open('src.jpg').convert('RGB')).astype(np.float32);print(im.shape)
X0,Y0,X1,Y1=250,40,1150,500
c=im[Y0:Y1,X0:X1]
# even out the painted light (sunbeam top-right, darker edges) so repeats don't show a pattern of bright/dark
blur=ndimage.gaussian_filter(c,(60,60,0));mean=c.reshape(-1,3).mean(0)
c=np.clip(c/np.maximum(blur,1)*mean,0,255)
O=140;h,w=c.shape[:2];tw,th=w-O,h-O
# horizontal wrap: blend the last O columns over the first O
r=np.linspace(0,1,O)[None,:,None];r=r*r*(3-2*r)
t=c[:, :tw].copy();t[:, :O]=c[:, tw:tw+O]*(1-r)+c[:, :O]*r
c2=np.concatenate([t,c[:,tw:tw+O]*0],1)[:, :tw]
# vertical wrap
r=np.linspace(0,1,O)[:,None,None];r=r*r*(3-2*r)
t2=c2[:th].copy();t2[:O]=c2[th:th+O]*(1-r)+c2[:O]*r
tile=t2
Image.fromarray(tile.astype(np.uint8)).save('floor_base.png')
def st(x):  # Stranglethorn: darker, cooler, a little desaturated with a dusky red cast
    g=x.mean(-1,keepdims=True);x=g+(x-g)*.72;x=x*np.array([.62,.58,.6]);x[...,0]+=6;return np.clip(x,0,255)
Image.fromarray(st(tile).astype(np.uint8)).save('floor_st.png')
for n in ['floor_base','floor_st']:
    t=Image.open(n+'.png');t.save('/home/claude/lum/assets/'+n+'.webp',quality=80,method=6);t.save('/home/claude/lum/assets_hq/'+n+'.png')
    a=np.array(t);big=np.tile(a,(3,3,1));Image.fromarray(big).resize((big.shape[1]//2,big.shape[0]//2)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/'+n+'_3x3.png')
print(tile.shape)
