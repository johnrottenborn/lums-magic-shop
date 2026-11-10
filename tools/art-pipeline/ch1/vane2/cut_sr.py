from PIL import Image
import numpy as np, json, sys
from scipy import ndimage
SRC=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)
C=[61,223,386,549,712,876,1040,1208,1375];R=[0,192,384,575,768]
cells={'idle':[(C[i],C[i+1],0) for i in range(4)],'walk':[(C[i],C[i+1],1) for i in range(8)],'attack':[(C[i],C[i+1],2) for i in range(6)],
       'hold':[(C[i],C[i+1],3) for i in range(3)],'hurt':[(769,876,3),(876,1042,3),(1042,1208,3),(1208,1375,3)]}
def matte(c):
    mn=c.min(-1);mx=c.max(-1);w=(mn>232)&((mx-mn)<22)
    lab,n=ndimage.label(w);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    sizes=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));big={i+1 for i,z in enumerate(sizes) if z>60}
    bg=np.isin(lab,list(edge|big));near=ndimage.binary_dilation(bg,iterations=3)&~bg
    a=np.where(bg,0,255).astype(np.float32);soft=np.clip((238-mn)/45,0,1)*255;a=np.where(near,np.minimum(a,soft),a)
    lab2,n2=ndimage.label(a>40);s2=ndimage.sum(np.ones_like(lab2),lab2,range(1,n2+1));b1=int(np.argmax(s2))+1
    reg=ndimage.binary_dilation(lab2==b1,iterations=6);ids=[i for i in np.unique(lab2[reg]) if i>0];a=np.where(ndimage.binary_dilation(np.isin(lab2,ids),iterations=2),a,0)
    a=np.minimum(a,ndimage.grey_erosion(a,size=(3,3)).astype(np.float32)*1.0+0)
    return np.dstack([c,a])
CW,CH=360,392;S=1
cells={k:v for k,v in cells.items() if k in('idle','walk','hold')}
rows={};frames=[];hand=None
for k,lst in cells.items():
    rows[k]=[len(rows),len(lst)]
    row=[]
    for (x0,x1,r) in lst:
        idx=lst.index((x0,x1,r));sim=Image.open(f'sr/{k}{idx}.png').convert('RGB');sim=sim.resize(((x1-2-x0-3)*2,(R[r+1]-2-R[r]-3)*2),Image.LANCZOS)
        c=np.array(sim).astype(np.float32);m=matte(c);a=m[...,3]
        ys,xs=np.where(a>40);yb=ys.max();fx=xs[ys>yb-0.12*(yb-ys.min())].mean()
        out=np.zeros((CH,CW,4),np.float32);ox=int(round(CW/2-fx));oy=int(CH-8-yb)
        h,w=a.shape
        for yy in range(h):
            ty=yy+oy
            if 0<=ty<CH:
                sx0=max(0,-ox);sx1=min(w,CW-ox)
                out[ty,sx0+ox:sx1+ox]=m[yy,sx0:sx1]
        if k=='hold':
            aa=out[...,3];ys2,xs2=np.where(aa>60);top=ys2<CH*0.55;i=np.argmax(np.where(top,xs2,-1));hand=hand or []
            hand.append([float(xs2[i])/CW,float(ys2[i])/CH])
        row.append(out)
    frames.append(row)
cols=max(len(r) for r in frames)
atl=np.zeros((CH*len(frames),CW*cols,4),np.float32)
for j,row in enumerate(frames):
    for i,f in enumerate(row):atl[j*CH:(j+1)*CH,i*CW:(i+1)*CW]=f
img=Image.fromarray(atl.clip(0,255).astype(np.uint8))
img.save('/home/claude/lum/assets/vane.webp',quality=80,method=6,alpha_quality=85)
rows['lantern']=rows['hold']
info={'cw':CW*S,'ch':CH*S,'rows':rows,'hand':hand}
json.dump(info,open('vane_info_sr.json','w'));print(json.dumps(info))
