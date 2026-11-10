from PIL import Image;import numpy as np;from scipy import ndimage as nd
src=np.array(Image.open('sheet.jpg').convert('RGB')).astype(float)
F={'idle':[(36,218),(218,373),(373,517),(517,640)],
   'walk':[(662,790),(790,943),(943,1053),(1053,1166),(1166,1360)],
   'attack':[(90,262),(478,662),(690,1005),(1080,1345)],
   'hurt':[(80,258),(260,398),(400,545)],
   'die':[(636,788),(788,958),(958,1158),(1158,1360)]}
Y={'idle':(98,318),'walk':(98,318),'attack':(318,552),'hurt':(552,768),'die':(552,768)}
out={}
for k,fr in F.items():
  y0,y1=Y[k];out[k]=[]
  for i,(a,b) in enumerate(fr):
    c=src[y0:y1,a:b]
    s=765-c.sum(2)
    al=np.clip((s-25)/90,0,1)
    m=nd.binary_dilation(al>.15,iterations=3)
    lab,n=nd.label(m)
    if n>1:
      sz=nd.sum(m,lab,range(1,n+1));keep=np.zeros(n+1,bool)
      big=sz.max()
      for j,v in enumerate(sz):
        if v>big*.08:keep[j+1]=True
      # for idle/walk, drop small blobs touching left edge (neighbor scythe)
      mm=keep[lab]
      al=al*mm
    a3=al[...,None]
    rgb=np.where(a3>0.01,(c-(1-a3)*255)/np.maximum(a3,1e-3),0)
    rgb=np.clip(rgb,0,255)
    # darken lines slightly for night readability
    img=np.dstack([rgb,al*255]).astype(np.uint8)
    im=Image.fromarray(img,'RGBA');bb=im.getbbox();im=im.crop(bb)
    out[k].append((im,bb,a))
    im.save(f'f_{k}{i}.png')
print({k:[(o[0].size) for o in v] for k,v in out.items()})
