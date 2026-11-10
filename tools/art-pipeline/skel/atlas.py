from PIL import Image;import numpy as np
names=[f'idle{i}' for i in range(4)]+[f'walk{i}' for i in range(5)]+[f'attack{i}' for i in range(4)]+[f'hurt{i}' for i in range(3)]+[f'die{i}' for i in range(4)]
K=.75;CW,CH=300,180;cols=5
A=Image.new('RGBA',(CW*cols,CH*4));info=[]
for n,nm in enumerate(names):
  im=Image.open(f'f_{nm}.png');a=np.array(im)[...,3]
  h=a.shape[0];bot=a[h-28:]  # feet region
  ys,xs=np.nonzero(bot>80)
  fx=xs.mean() if len(xs) else im.width/2
  if nm.startswith('die') and int(nm[-1])>=2: fx=im.width*.5
  im=im.resize((round(im.width*K),round(im.height*K)),Image.LANCZOS);fx*=K
  cx=(n%cols)*CW;cy=(n//cols)*CH
  px=round(CW/2-fx);py=CH-4-im.height
  # clip if too wide
  A.alpha_composite(im.crop((max(0,-px),max(0,-py),min(im.width,CW-px),im.height)),(cx+max(0,px),cy+max(0,py)))
  info.append((nm,px,im.width))
A.save('../assets/skel.webp',quality=90);A.save('atlas.png')
for i in info:print(i)
