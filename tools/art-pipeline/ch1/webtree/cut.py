from PIL import Image,ImageDraw,ImageFilter
import numpy as np
from scipy import ndimage
Y0=716
im=Image.open('src.jpg').convert('RGB').crop((0,Y0,1206,1422));a=np.array(im).astype(np.float32);H,W=a.shape[:2]
L=a.mean(-1);sat=a.max(-1)-a.min(-1);b=a[...,2];g=a[...,1];r=a[...,0]
def poly(pts):
    m=Image.new('L',(W,H),0);ImageDraw.Draw(m).polygon([(x,y-Y0) for x,y in pts],fill=255);return np.array(m)>0
yy0=np.arange(H)[:,None]+np.zeros((1,W))
dark=((sat<42)&(L<150))|(L<75)
region=poly([(60,716),(1206,716),(1206,800),(1120,880),(1000,900),(900,1000),(800,1080),(780,1150),(820,1240),(900,1290),(860,1360),(700,1370),(560,1340),(430,1360),(280,1300),(400,1230),(440,1120),(330,1010),(260,940),(150,860),(60,780)])
m=dark&region
m=ndimage.binary_closing(m,iterations=2);m=ndimage.binary_fill_holes(m)
web=poly([(495,1000),(712,955),(712,1290),(508,1300)])
sky=(b>r+12)&(L>140)
grass=(((sat>48)&(g>r)&(L>105))|((g>r+10)&(g>b+6)))&(yy0>1190-Y0)
m&=~sky&~grass
m|=web
m=ndimage.binary_opening(m,iterations=2)
m=ndimage.binary_erosion(m,iterations=1)
lab,n=ndimage.label(m);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));m=np.isin(lab,[i+1 for i in range(n) if sz[i]>600])
al=ndimage.gaussian_filter(m.astype(np.float32),.9)
yy=np.arange(H)[:,None];al*=np.clip((yy-1)/14,0,1)*np.clip((1395-Y0-yy)/40,0,1)  # soften the cropped top
out=np.dstack([a,al*255]).astype(np.uint8)
ys,xs=np.where(al>.03);out=out[ys.min():ys.max()+1,xs.min():xs.max()+1]
o=Image.fromarray(out);o.save('/home/claude/lum/assets_hq/webtree.png');o.save('/home/claude/lum/assets/webtree.webp',quality=82,method=6,alpha_quality=90)
bg=Image.new('RGBA',o.size,(58,74,46,255));bg.alpha_composite(o);bg.convert('RGB').save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/wt_prev.png');print(o.size)
