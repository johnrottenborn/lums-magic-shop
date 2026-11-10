from PIL import Image
import numpy as np
from scipy import ndimage
rng=np.random.default_rng(7)
im=np.array(Image.open('src.jpg').convert('RGB')).astype(np.float32);H,W=im.shape[:2]
blur=ndimage.gaussian_filter(im,(50,50,0));mean=im[100:600,300:1100].reshape(-1,3).mean(0)
im=np.clip(im/np.maximum(blur,1)*mean,0,255)
r,g,b=im[...,0],im[...,1],im[...,2]
green=(g>r+6)&(g>b+4)
ok=ndimage.uniform_filter(green.astype(np.float32),31)
P,O=112,36;S=P-O;TW,TH=768,512
src_region=np.zeros((H,W),bool);src_region[60:600,230:1180]=1
cands=[(y,x) for y in range(60,600-P,6) for x in range(230,1180-P,6) if ok[y+P//2,x+P//2]>.975]
print(len(cands))
out=np.zeros((TH+P,TW+P,3),np.float32)
def mincut(err):  # err h x w, vertical cut along columns
    h,w=err.shape;E=err.copy()
    for i in range(1,h):
        m=np.minimum(np.minimum(np.r_[np.inf,E[i-1,:-1]],E[i-1]),np.r_[E[i-1,1:],np.inf]);E[i]+=m
    path=np.zeros(h,int);path[-1]=np.argmin(E[-1])
    for i in range(h-2,-1,-1):
        j=path[i+1];lo=max(0,j-1);hi=min(w,j+2);path[i]=lo+np.argmin(E[i,lo:hi])
    return path
for yi in range((TH+P)//S):
    for xi in range((TW+P)//S):
        y,x=yi*S,xi*S
        if y+P>out.shape[0] or x+P>out.shape[1]:continue
        best=None
        for k in rng.choice(len(cands),160,replace=False):
            sy,sx=cands[k];p=im[sy:sy+P,sx:sx+P];e=0
            if xi:e+=((p[:,:O]-out[y:y+P,x:x+O])**2).sum()
            if yi:e+=((p[:O]-out[y:y+O,x:x+P])**2).sum()
            if best is None or e<best[0]:best=(e,p)
        p=best[1].copy();mask=np.ones((P,P),bool)
        if xi:
            err=((p[:,:O]-out[y:y+P,x:x+O])**2).sum(-1);pth=mincut(err)
            for i in range(P):mask[i,:pth[i]]=0
        if yi:
            err=((p[:O]-out[y:y+O,x:x+P])**2).sum(-1).T;pth=mincut(err)
            for j in range(P):mask[:pth[j],j]=0
        m=ndimage.gaussian_filter(mask.astype(np.float32),1.5)[...,None]
        if not xi and not yi:m[:]=1
        out[y:y+P,x:x+P]=out[y:y+P,x:x+P]*(1-m)+p*m
c=out[:TH+O,:TW+O]
# wrap seams
r_=np.linspace(0,1,O)[None,:,None];r_=r_*r_*(3-2*r_)
t=c[:, :TW].copy();t[:, :O]=c[:, TW:TW+O]*(1-r_)+c[:, :O]*r_
r_=np.linspace(0,1,O)[:,None,None];r_=r_*r_*(3-2*r_)
t2=t[:TH].copy();t2[:O]=t[TH:TH+O]*(1-r_)+t[:O]*r_
tile=t2
def st(x):
    gg=x.mean(-1,keepdims=True);x=gg+(x-gg)*.9;x=x*np.array([.5,.6,.54]);return np.clip(x,0,255)
for n,t_ in [('floor_base',tile),('floor_st',st(tile))]:
    Image.fromarray(t_.astype(np.uint8)).save('/home/claude/lum/assets_hq/'+n+'.png');Image.fromarray(t_.astype(np.uint8)).save('/home/claude/lum/assets/'+n+'.webp',quality=80,method=6)
    big=np.tile(t_.astype(np.uint8),(2,3,1));Image.fromarray(big).resize((big.shape[1]//2,big.shape[0]//2)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/'+n+'_rep.png')
