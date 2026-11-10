from PIL import Image;import numpy as np;from scipy import ndimage as nd
src=np.array(Image.open('sheet.jpg').convert('RGB')).astype(float)
s=765-src.sum(2);M=s>40;M[:,:660]=False;M[:119,:720]=False
y0,y1=98,318
heads=[(786,831),(906,951),(1044,1088),(1175,1215),(1300,1350)]
cx=[720,860,1000,1110,1260]
own=np.zeros(M.shape,int)-1
Hm=np.zeros(M.shape,bool)
for i,(a,b) in enumerate(heads):
  r=np.zeros(M.shape,bool);r[155:233,a:b]=True;r&=M;own[r]=i;Hm|=r
B=M.copy();B[Hm]=False
lab,n=nd.label(B[y0:y1],structure=np.ones((3,3)));lab2=np.zeros(M.shape,int);lab2[y0:y1]=lab
for c in range(1,n+1):
  ys,xs=np.nonzero(lab2==c)
  if len(xs)<1500:
    # small piece: nearest head rect centre
    mx,my=xs.mean(),ys.mean();d=[abs(mx-(a+b)/2)+abs(my-200)*.5 for a,b in heads];i=int(np.argmin(d))
  else:i=int(np.argmin([abs(xs.mean()-c_) for c_ in cx]))
  own[ys,xs]=i
for i in range(5):
  m=own==i;m[:y0]=False;m[y1:]=False
  L,nn=nd.label(nd.binary_dilation(m,iterations=2));sz=nd.sum(m,L,range(1,nn+1));a,b=heads[i]
  keep=[j+1 for j,v in enumerate(sz) if v>sz.max()*.15 or (L[155:233,a:b]==j+1).sum()>80]
  m&=np.isin(L,keep)
  mm=nd.binary_dilation(m,iterations=2)&~((own>=0)&(own!=i))
  al=np.clip((s-20)/90,0,1)*mm;a3=al[...,None]
  rgb=np.clip(np.where(a3>.01,(src-(1-a3)*255)/np.maximum(a3,1e-3),0),0,255)
  im=Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8),'RGBA');bb=im.getbbox();im.crop(bb).save(f'f_walk{i}.png');print(i,bb)
  import json;np.save(f'm_walk{i}.npy',mm[bb[1]:bb[3],bb[0]:bb[2]]);json.dump(list(bb),open(f'b_walk{i}.json','w'))
