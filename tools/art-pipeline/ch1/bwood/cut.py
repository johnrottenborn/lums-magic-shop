from PIL import Image,ImageDraw
import numpy as np
from scipy import ndimage
from skimage.segmentation import watershed
a=np.array(Image.open('src.jpg').convert('RGB')).astype(np.float32);H,W=a.shape[:2]
mn=a.min(-1);sat=a.max(-1)-mn
bg=(mn>238)&(sat<14)
lab,n=ndimage.label(bg);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
bgm=np.isin(lab,[i+1 for i in range(n) if sz[i]>30])
fg=~bgm
mk=np.zeros((H,W),np.int32);d=Image.fromarray(mk.astype(np.uint8));dr=ImageDraw.Draw(d)
for (x,y),k in [((480,250),1),((520,800),1),((520,1050),1),((210,780),2),((225,1020),2),((770,770),3),((790,1010),3),((700,1000),3),((860,1000),3)]:dr.ellipse((x-18,y-18,x+18,y+18),fill=k)
mk=np.array(d).astype(np.int32)
dist=ndimage.distance_transform_edt(fg)
seg=watershed(-dist,mk,mask=fg)
al=np.clip((250-mn)/36,0,1);al=np.maximum(al,np.clip((sat-10)/28,0,1))
near=ndimage.binary_dilation(bgm,iterations=3);al=np.where(near,al,1.0);al[bgm]=0
af=np.maximum(al,.25)[...,None];rgb=np.clip((a-255*(1-af))/af,0,255);rgb=np.where(al[...,None]>.25,rgb,a*.7)
names={1:'bwood_big',2:'bwood_small_a',3:'bwood_small_b'}
import colorsys
def recolor(rgbf,alpha):
    # foliage: pastel purples/blues/pinks -> deep crimson & wine; bark: pale birch -> weathered grey-brown
    x=rgbf/255.;mx=x.max(-1);mnn=x.min(-1);v=mx;s=np.where(mx>0,(mx-mnn)/np.maximum(mx,1e-6),0)
    r,g,b=x[...,0],x[...,1],x[...,2]
    h=np.zeros_like(v);dlt=np.maximum(mx-mnn,1e-6)
    h=np.where(mx==r,((g-b)/dlt)%6,np.where(mx==g,(b-r)/dlt+2,(r-g)/dlt+4))/6
    fol0=(s>.12)&((h>.5)|(h<.04))  # blue-purple-pink
    cand=(~fol0)&(v>.35)&(alpha>.5)
    lb,nn=ndimage.label(cand);sz=ndimage.sum(np.ones_like(lb),lb,range(1,nn+1))
    keep=[i+1 for i in range(nn) if sz[i]>2500]
    bark=np.isin(lb,keep)
    dt=ndimage.distance_transform_edt(bark)
    trunk=np.zeros_like(bark);trunk[360:,440:610]=1;trunk[780:,185:265]=1;trunk[800:,715:870]=1
    seeds=(dt>8.5)&~trunk
    blob=ndimage.binary_dilation(seeds,iterations=10)&bark&~trunk
    bark&=~blob
    fol=~bark
    nh=np.where(fol,(0.985+(h-0.75)*0.12)%1.0,0.07)
    ns=np.where(fol,np.clip(s*1.6+.3,0,.82),np.clip(s*.6+.10,0,.35))
    nv=np.where(fol,v*.5,v*.52)
    nv=np.where(v<.25,v,nv)  # keep ink lines
    i=np.floor(nh*6)%6;f=nh*6-np.floor(nh*6);p=nv*(1-ns);q=nv*(1-f*ns);t=nv*(1-(1-f)*ns)
    R=np.choose(i.astype(int),[nv,q,p,p,t,nv]);G=np.choose(i.astype(int),[t,nv,nv,q,p,p]);B=np.choose(i.astype(int),[p,p,t,nv,nv,q])
    return np.dstack([R,G,B])*255
for k,nm in names.items():
    m=(seg==k);m=ndimage.binary_dilation(m,iterations=2)&~bgm|(m)
    A=np.where(ndimage.binary_dilation(seg==k,iterations=3),al,0)
    ys,xs=np.where(A>.03);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    for tag,col in [('',rgb)]:
        o=np.dstack([col,A*255])[y0:y1,x0:x1].clip(0,255).astype(np.uint8);im=Image.fromarray(o)
        im.save(f'/home/claude/lum/assets_hq/{nm}{tag}.png');im.save(f'/home/claude/lum/assets/{nm}{tag}.webp',quality=80,method=6,alpha_quality=90)
    print(nm,(x1-x0,y1-y0))
