from PIL import Image,ImageFilter
import numpy as np, json
from scipy import ndimage
SRC=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)
R1=(4,118);R2=(145,258);RJ=(286,446);RA=(471,602);RL=(628,745)
cx=[8,200,396,590,786,981]
run=[(cx[i],R1[0],cx[i]+190,R1[1]) for i in range(6)]+[(8,R2[0],198,R2[1])]+[(x,R2[0],x+190,R2[1]) for x in [396,590,786,981,1176]]
jump=[(8,RJ[0],178,RJ[1]),(182,RJ[0],350,RJ[1]),(354,RJ[0],476,RJ[1]),(480,RJ[0],610,RJ[1]),(614,RJ[0],776,RJ[1]),(780,RJ[0],910,RJ[1]),(914,RJ[0],1020,RJ[1]),(1024,RJ[0],1193,RJ[1]),(1197,RJ[0],1368,RJ[1])]
ab=[6,182,354,522,690,857,1024,1197,1370]
attack=[(ab[i]+2,RA[0],ab[i+1]-2,RA[1]) for i in range(8)]
cells={'run':run,'jump':jump,'attack':attack,'jattack':[(8,RL[0],158,RL[1])],'hurt':[(162,RL[0],318,RL[1])]}
def matte(c):
    mx=c.max(-1);a=np.clip((mx-16)/36,0,1)*255;a[:,:3]=0;a[:,-3:]=0;a[:3,:]=0;a[-3:,:]=0
    L,_=ndimage.label(a>20)
    for i,sl in enumerate(ndimage.find_objects(L)):
        hh=sl[0].stop-sl[0].start;ww=sl[1].stop-sl[1].start
        if min(hh,ww)<=6 and max(hh,ww)>35:a[L==i+1]=0
    lab,n=ndimage.label(a>40);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));big=int(np.argmax(sz))+1
    reg=ndimage.binary_dilation(lab==big,iterations=18);ids=[i for i in np.unique(lab[reg]) if i>0];keep=ndimage.binary_dilation(np.isin(lab,ids),iterations=2)
    a=np.where(keep,a,0);return np.dstack([c,a])
CW,CH=315,285;rows={};frames=[];foot={}
for k,lst in cells.items():
    rows[k]=[len(rows),len(lst)];row=[]
    for (x0,y0,x1,y1) in lst:
        im=Image.open(f'sr/{k}{lst.index((x0,y0,x1,y1))}.png').convert('RGB');im=im.resize((round((x1-x0)*1.5),round((y1-y0)*1.5)),Image.LANCZOS)
        m=matte(np.array(im).astype(np.float32))[:,::-1];a=m[...,3]
        ys,xs=np.where(a>60);cy,cxm=ndimage.center_of_mass(a)
        ox=int(CW/2-cxm);oy=int(CH/2-cy) if k=='jump' else int(CH-6-ys.max())
        out=np.zeros((CH,CW,4),np.float32);h,w=a.shape
        ys0=max(0,-oy);ys1=min(h,CH-oy);xs0=max(0,-ox);xs1=min(w,CW-ox)
        out[ys0+oy:ys1+oy,xs0+ox:xs1+ox]=m[ys0:ys1,xs0:xs1];row.append(out)
    frames.append(row)
cols=max(len(r) for r in frames);atl=np.zeros((CH*len(frames),CW*cols,4),np.float32)
for j,r in enumerate(frames):
    for i,f in enumerate(r):atl[j*CH:(j+1)*CH,i*CW:(i+1)*CW]=f
img=Image.fromarray(atl.clip(0,255).astype(np.uint8))
img.save('/home/claude/lum/assets/fox.webp',quality=76,method=6)
json.dump({"cw":CW,"ch":CH,'rows':rows},open('fox_info.json','w'));print(rows,img.size)
bg=Image.new('RGBA',img.size,(70,80,60,255));bg.alpha_composite(img);bg.resize((img.width//4,img.height//4)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/foxatl.png')
