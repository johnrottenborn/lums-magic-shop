from PIL import Image,ImageDraw
import numpy as np
from scipy import ndimage
from skimage.segmentation import watershed
a=np.array(Image.open('src.jpg').convert('RGB')).astype(np.float32);H,W=a.shape[:2];print(W,H)
mn=a.min(-1);sat=a.max(-1)-mn
bg=(mn>236)&(sat<16)
lab,n=ndimage.label(bg);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));bgm=np.isin(lab,[i+1 for i in range(n) if sz[i]>30]);fg=~bgm
d=Image.new('L',(W,H),0);dr=ImageDraw.Draw(d)
for (x,y),k in [((160,250),1),((160,600),1),((160,900),1),((465,150),2),((465,600),2),((465,900),2),((880,430),3),((690,450),3),((790,900),3),((760,700),3)]:dr.ellipse((x-14,y-14,x+14,y+14),fill=k)
seg=watershed(-ndimage.distance_transform_edt(fg),np.array(d).astype(np.int32),mask=fg)
al=np.clip((250-mn)/36,0,1);al=np.maximum(al,np.clip((sat-10)/28,0,1));near=ndimage.binary_dilation(bgm,iterations=3);al=np.where(near,al,1.0);al[bgm]=0
af=np.maximum(al,.25)[...,None];rgb=np.clip((a-255*(1-af))/af,0,255);rgb=np.where(al[...,None]>.25,rgb,a*.7)
yy=np.arange(H)[:,None]
for k,(nm,gy) in {1:('rose_bud',985),2:('rose_open',985),3:('rose_twin',1045)}.items():
    A=np.where(ndimage.binary_dilation(seg==k,iterations=3),al,0)*np.clip((gy-yy)/22,0,1)  # roots stay underground
    ys,xs=np.where(A>.03);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgbk=rgb.copy();L=rgbk.mean(-1);edge=(A<.98)&(A>0)&(L>110);rgbk[edge]=rgbk[edge]*.35+np.array([40,22,30])*.65
    o=Image.fromarray(np.dstack([rgbk,A*255])[y0:y1,x0:x1].clip(0,255).astype(np.uint8));o.save(f'/home/claude/lum/assets_hq/{nm}.png')
    o.thumbnail((400,400),Image.LANCZOS);o.save(f'/home/claude/lum/assets/{nm}.webp',quality=84,method=6,alpha_quality=90);print(nm,o.size)
ims=[Image.open(f'/home/claude/lum/assets/{n}.webp') for n in ['rose_bud','rose_open','rose_twin']]
bgc=Image.new('RGBA',(sum(i.width for i in ims)+40,max(i.height for i in ims)+20),(30,40,30,255));x=0
for im in ims:bgc.alpha_composite(im,(x,bgc.height-im.height-10));x+=im.width+20
bgc.convert('RGB').save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/roses.png')
