from PIL import Image
import numpy as np, json
from scipy import ndimage
exec(open('cells.py').read())
K=1.6
def matte(c,arcs=False):
    mn=c.min(-1);sat=c.max(-1)-mn
    a=np.clip(np.maximum((236-mn)/34,(sat-18)/30),0,1)
    bgm=(mn>238)&(sat<14);lab,n=ndimage.label(bgm);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));bg=np.isin(lab,[i+1 for i in range(n) if sz[i]>60])
    near=ndimage.binary_dilation(bg,iterations=3);a=np.where(near,a,1.0);a[bg]=0
    wh=(mn>205)&(sat<26)&(not arcs);wh=ndimage.binary_dilation(wh,iterations=1)&(mn>170)&(sat<32);a[wh]=0
    lb,nn=ndimage.label(a>.2);s2=ndimage.sum(np.ones_like(lb),lb,range(1,nn+1))
    if nn:
        big=int(np.argmax(s2))+1;reg=ndimage.binary_dilation(lb==big,iterations=14);ids=[i for i in np.unique(lb[reg]) if i>0 and s2[i-1]>40]
        keep=ndimage.binary_dilation(np.isin(lb,ids),iterations=2);a=np.where(keep,a,0)
    a=np.minimum(a,ndimage.minimum_filter(a,size=3));a=ndimage.gaussian_filter(a,.5)
    af=np.maximum(a,.25)[...,None];rgb=np.clip((c-255*(1-af))/af,0,255);rgb=np.where(a[...,None]>.25,rgb,c*.6)
    L=rgb.mean(-1);edge=(a<.98)&(a>0)&(L>95);rgb[edge]=rgb[edge]*.25+np.array([28,22,20])*.75
    return np.dstack([rgb,a*255])
CW,CH=560,300;rows={};out=[]
for k,lst in cells.items():
    row=[]
    for j,(x0,y0,x1,y1) in enumerate(lst):
        im=Image.open(f'sr/{k}{j}.png').convert('RGB').resize((round((x1-x0)*K),round((y1-y0)*K)),Image.LANCZOS)
        m=matte(np.array(im).astype(np.float32),arcs=(k=='swing'))
        if k=='idle':m=m[:,::-1]
        a=m[...,3];ys,xs=np.where(a>80);yb=ys.max();y0_=ys.min();hh=yb-y0_
        if k=='ko':cx=np.median(xs)
        else:band=(ys>y0_+hh*.3)&(ys<y0_+hh*.55);cx=np.median(xs[band])
        o=np.zeros((CH,CW,4),np.float32);ox=int(CW*.4-cx);oy=int(CH-6-yb);h,w=a.shape
        ys0=max(0,-oy);ys1=min(h,CH-oy);xs0=max(0,-ox);xs1=min(w,CW-ox);o[ys0+oy:ys1+oy,xs0+ox:xs1+ox]=m[ys0:ys1,xs0:xs1];row.append(o)
    rows[k]=[len(rows),len(lst)];out.append(row)
cols=max(len(r) for r in out);atl=np.zeros((CH*len(out),CW*cols,4),np.float32)
for r,row in enumerate(out):
    for i,f in enumerate(row):atl[r*CH:(r+1)*CH,i*CW:(i+1)*CW]=f
img=Image.fromarray(atl.clip(0,255).astype(np.uint8));img.save('/home/claude/lum/assets_hq/jak.png');img.save('/home/claude/lum/assets/jak.webp',quality=80,method=6,alpha_quality=88)
json.dump({'cw':CW,'ch':CH,'rows':rows},open('jak_info.json','w'));print(rows,img.size)
bg=Image.new('RGBA',img.size,(60,64,58,255));bg.alpha_composite(img);bg.convert('RGB').resize((img.width//5,img.height//5)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/jak2atl.png')
