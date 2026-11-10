from PIL import Image,ImageFilter
import numpy as np, json
from scipy import ndimage
exec(open('cells.py').read())
CW,CH=380,390;K=2.0
def matte(c):
    mn=c.min(-1);sat=c.max(-1)-mn
    a=np.clip(np.maximum((246-mn)/42,(sat-10)/34),0,1)
    a[a<.07]=0
    # drop isolated faint specks but keep paint splashes near the plant
    lab,n=ndimage.label(a>.12);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
    if n:
        big=int(np.argmax(sz))+1;reg=ndimage.binary_dilation(lab==big,iterations=40)
        ids=[i for i in np.unique(lab[reg]) if i>0];keep=ndimage.binary_dilation(np.isin(lab,ids),iterations=3);a=np.where(keep,a,0)
    af=np.maximum(a,.3)[...,None];rgb=np.clip((c-255*(1-af))/af,0,255)
    rgb=np.where(a[...,None]>.3,rgb,c*.85)
    return np.dstack([rgb,a*255])
rows={};frames=[]
for k,lst in cells.items():
    rows[k]=[len(rows),len(lst)];row=[]
    for i,(x0,y0,x1,y1) in enumerate(lst):
        im=Image.open(f'sr/{k}{i}.png').convert('RGB').resize((round((x1-x0)*K),round((y1-y0)*K)),Image.LANCZOS)
        m=matte(np.array(im).astype(np.float32));a=m[...,3]
        ys,xs=np.where(a>90)
        out=np.zeros((CH,CW,4),np.float32);h,w=a.shape
        if k=='shot':cy,cx=ndimage.center_of_mass(a);ox=int(CW/2-cx);oy=int(CH/2-cy)
        else:
            yb=ys.max();base=xs[ys>yb-16];ox=int(CW/2-base.mean());oy=int(CH-6-yb)
        ys0=max(0,-oy);ys1=min(h,CH-oy);xs0=max(0,-ox);xs1=min(w,CW-ox)
        out[ys0+oy:ys1+oy,xs0+ox:xs1+ox]=m[ys0:ys1,xs0:xs1];row.append(out)
    frames.append(row)
cols=max(len(r) for r in frames);atl=np.zeros((CH*len(frames),CW*cols,4),np.float32)
for j,r in enumerate(frames):
    for i,f in enumerate(r):atl[j*CH:(j+1)*CH,i*CW:(i+1)*CW]=f
img=Image.fromarray(atl.clip(0,255).astype(np.uint8))
img.save('/home/claude/lum/assets_hq/flora.png')
img.save('/home/claude/lum/assets/flora.webp',quality=74,method=6,alpha_quality=80)
json.dump({'cw':CW,'ch':CH,'rows':rows},open('flora_info.json','w'));print(rows,img.size)
bg=Image.new('RGBA',img.size,(70,80,60,255));bg.alpha_composite(img);bg.resize((img.width//4,img.height//4)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/floraatl.png')
