from PIL import Image
import numpy as np
from scipy import ndimage
im=np.array(Image.open('src.jpg').convert('RGB')).astype(np.float32);blur=ndimage.gaussian_filter(im,(50,50,0));mean=im[100:600,300:1100].reshape(-1,3).mean(0);im=np.clip(im/np.maximum(blur,1)*mean,0,255)
def st(x):
    gg=x.mean(-1,keepdims=True);x=gg+(x-gg)*.9;w=np.clip((x.mean(-1,keepdims=True)-150)/60,0,1);x=x*np.array([.56,.66,.6])*(1-w)+x*np.array([.8,.84,.86])*w;return np.clip(x,0,255)
D={'thdec_stickweb':(700,18,1255,395),'thdec_mushweb':(262,190,478,325),'thdec_litterweb':(165,305,415,470),'thdec_fernweb':(0,0,340,235),'thdec_smallweb':(1075,262,1245,362),'thdec_log':(540,462,1095,700)}
rng=np.random.default_rng(3)
out=[]
for n,(x0,y0,x1,y1) in D.items():
    c=im[y0:y1,x0:x1];h,w=c.shape[:2]
    yy,xx=np.mgrid[0:h,0:w];u=(xx+.5)/w*2-1;v=(yy+.5)/h*2-1
    ang=np.arctan2(v,u);wob=1+.08*np.sin(ang*5+rng.uniform(0,6))+.05*np.sin(ang*9+rng.uniform(0,6))
    r=np.sqrt(u**2+v**2)/wob
    a=np.clip((1-r)/.32,0,1);a=a*a*(3-2*a)
    o=np.dstack([st(c),a*255]).astype(np.uint8);Image.fromarray(o).save(f'/home/claude/lum/assets/{n}.webp',quality=82,method=6,alpha_quality=85);Image.fromarray(o).save(f'/home/claude/lum/assets_hq/{n}.png')
    out.append(Image.fromarray(o))
W=sum(i.width for i in out)//2+60;bg=Image.new('RGBA',(1400,760),(30,44,30,255));x=10;y=10;rowh=0
for i in out:
    if x+i.width>1400:x=10;y+=rowh+10;rowh=0
    bg.alpha_composite(i,(x,y));x+=i.width+10;rowh=max(rowh,i.height)
bg.convert('RGB').resize((700,380)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/decals.png')
