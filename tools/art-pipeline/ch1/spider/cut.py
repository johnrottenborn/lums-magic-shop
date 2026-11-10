from PIL import Image,ImageFilter
import numpy as np, json
from scipy import ndimage
SRC=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)
H,W_=SRC.shape[:2]
# find blobs per row band
bands={'idle':(30,185),'crawl':(210,360),'attack':(375,545),'jump':(560,745)}
def matte(c):
    mx=c.max(-1);a=np.clip((mx-22)/40,0,1)*255;return a
rows={};frames=[];CW,CH=360,220
for k,(y0,y1) in bands.items():
    band=SRC[y0:y1];a=matte(band)
    if k in('idle','crawl','attack','jump'):a[:, :110]*=np.array([[0]]) if False else 1
    lab,n=ndimage.label(ndimage.binary_dilation(a>30,iterations=14));objs=ndimage.find_objects(lab)
    sizes=ndimage.sum(a>30,lab,range(1,n+1))
    blobs=sorted([(o[1].start,o[1].stop,i+1) for i,o in enumerate(objs) if sizes[i]>2500])
    if k=='crawl':
        lab=np.zeros_like(lab);blobs=[]
        for j,(cx0,cx1) in enumerate([(5,288),(288,565),(565,845),(845,1118),(1118,1379)]):lab[:,cx0:cx1]=j+1;blobs.append((cx0,cx1,j+1))
    row=[]
    for x0,x1,li in blobs:
        sub=band[:,x0:x1];aa=np.where(lab[:,x0:x1]==li,a[:,x0:x1],0)
        # drop the text labels (IDLE/CRAWL...) in top-left
        if x0<120:aa[:45,:110-x0]=0
        rgb=np.clip(sub*1.25,0,255);m=np.dstack([rgb,aa])[:,::-1]
        cy,cx=ndimage.center_of_mass(m[...,3]);ys,xs=np.where(m[...,3]>60)
        out=np.zeros((CH,CW,4),np.float32);ox=int(CW/2-cx);oy=int(CH-8-ys.max()) if k!='jump' else int(CH/2-cy)
        h,w=aa.shape;ys0=max(0,-oy);ys1=min(h,CH-oy);xs0=max(0,-ox);xs1=min(w,CW-ox)
        out[ys0+oy:ys1+oy,xs0+ox:xs1+ox]=m[ys0:ys1,xs0:xs1];row.append(out)
    rows[k]=[len(rows),len(row)];frames.append(row)
cols=max(len(r) for r in frames);atl=np.zeros((CH*len(frames),CW*cols,4),np.float32)
for j,r in enumerate(frames):
    for i,f in enumerate(r):atl[j*CH:(j+1)*CH,i*CW:(i+1)*CW]=f
img=Image.fromarray(atl.clip(0,255).astype(np.uint8))
img.save('/home/claude/lum/assets/spider.webp',quality=74,method=6,alpha_quality=80)
json.dump({'cw':CW,'ch':CH,'rows':rows},open('spider_info.json','w'));print(rows,img.size)
bg=Image.new('RGBA',img.size,(70,80,60,255));bg.alpha_composite(img);bg.resize((img.width//2,img.height//2)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/spatl.png')
