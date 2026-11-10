import numpy as np,json,os
from PIL import Image
from scipy import ndimage as nd
rows=[('idle',8),('move',8),('spell',8),('hurt',6),('die',8)]
CW,CH=420,300;A=Image.new('RGBA',(CW*8,CH*5))
for r,(nm,n) in enumerate(rows):
  for i in range(n):
    f=f'{nm}{i}'
    if os.path.exists(f'sr_{f}.png'):im=Image.open(f'sr_{f}.png').convert('RGB')
    else:c=Image.open(f'c_{f}.png').convert('RGB');im=c.resize((c.width*4,c.height*4),Image.BICUBIC)
    a=np.array(im).astype(np.float32);v=a.max(2)
    dark=v<40;lab,k=nd.label(dark);border=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
    dsz=nd.sum(dark,lab,range(1,k+1));big=[j+1 for j,v in enumerate(dsz) if v>120];bg=np.isin(lab,list(border)+big);fg=~bg
    lab2,k2=nd.label(fg);sz=nd.sum(fg,lab2,range(1,k2+1))
    if k2:keep=np.zeros(k2+1,bool);keep[1:]=sz>max(60,sz.max()*.002);fg=keep[lab2]
    dist=nd.distance_transform_edt(fg);soft=np.clip((v-18)/50,0,1)
    al=np.where(dist>3,1.0,np.where(nd.binary_dilation(fg,iterations=2),np.maximum(soft,np.clip(dist/3,0,1)*soft),0)).astype(np.float32)
    if nm=='spell' and i==7:al=np.clip((v-14)/70,0,1)  # the sparkle burst stays wispy
    a3=al[...,None];rgb=np.clip(np.where(a3>.02,a/np.maximum(a3,1e-3),0),0,255)
    O=Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8),'RGBA')
    s=min(CW/O.width,CH/O.height);O=O.resize((round(O.width*s),round(O.height*s)),Image.LANCZOS)
    A.alpha_composite(O,(i*CW+(CW-O.width)//2,r*CH+CH-O.height))
A.save('../assets/slugking.webp',quality=90,method=6);A.save('atlas.png')
print('ok',sum(os.path.exists(f'sr_{n}{i}.png') for n,c in rows for i in range(c)))
