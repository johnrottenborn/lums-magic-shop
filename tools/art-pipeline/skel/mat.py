import numpy as np,json,sys
from PIL import Image
from scipy import ndimage as nd
names=[f'idle{i}' for i in range(4)]+[f'walk{i}' for i in range(5)]+[f'attack{i}' for i in range(4)]+[f'hurt{i}' for i in range(3)]+[f'die{i}' for i in range(4)]
K=1.6;CW,CH=640,384;cols=5;AY=CH-8
A=Image.new('RGBA',(CW*cols,CH*4))
import os
only=sys.argv[1:]
for n,nm in enumerate(names):
    if not os.path.exists(f'sr_{nm}.png') or (only and nm not in only):continue
    S_=Image.open(f'sr_{nm}.png').convert('RGB');x0,y0,x1,y1=json.load(open(f'b_{nm}.json'))
    srcim=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)[y0:y1,x0:x1];m2=nd.binary_dilation(np.load(f'm_{nm}.npy'),iterations=3);srcim[~m2]=255
    srcim=np.pad(srcim,((8,8),(8,8),(0,0)),constant_values=255);SRC=Image.fromarray(srcim.astype(np.uint8)).resize(S_.size,Image.BICUBIC)
    from PIL import ImageEnhance
    im=np.array(ImageEnhance.Contrast(Image.blend(S_,SRC,.25)).enhance(1.12)).astype(np.float32)
    mk=np.load(f'mk_{nm}.npy');mk4=np.kron(mk,np.ones((4,4),bool))[:im.shape[0],:im.shape[1]];mk4=nd.binary_dilation(mk4,iterations=6)
    s=765-im.sum(2);white=(im.min(2)>236)
    lab,k=nd.label(white);sz=nd.sum(white,lab,range(1,k+1))
    border=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
    big=np.zeros(k+1,bool);big[list(border)]=True;big[1:]|=sz>260
    bg=big[lab]|~mk4
    fg=~bg;fg=nd.binary_opening(fg,iterations=1)
    lab2,k2=nd.label(fg);sz2=nd.sum(fg,lab2,range(1,k2+1));keep=np.zeros(k2+1,bool);keep[1:]=sz2>max(150,sz2.max()*.004);fg=keep[lab2]
    dist=nd.distance_transform_edt(fg);band=nd.binary_dilation(fg,iterations=2)
    soft=np.clip((s-12)/70,0,1)
    al=np.where(dist>2.5,1.0,np.where(band,soft*np.clip(dist/2.5+.35,0,1),0)).astype(np.float32)
    a3=al[...,None];rgb=np.clip(np.where(a3>.02,(im-(1-a3)*255)/np.maximum(a3,1e-3),0),0,255)
    O=Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8),'RGBA');bb=O.getbbox();O=O.crop(bb)
    tw=round(O.width*K/4);th=round(O.height*K/4)
    O=O.convert('RGBa').resize((tw,th),Image.LANCZOS).convert('RGBA')
    a=np.array(O)[...,3];ys,xs=np.nonzero(a[-int(28*K):]>80);fx=xs.mean() if len(xs) else tw/2
    if nm in('die2','die3'):fx=tw*.5
    px=round(CW/2-fx);py=AY-th;cx=(n%cols)*CW;cy=(n//cols)*CH
    A.alpha_composite(O.crop((max(0,-px),max(0,-py),min(tw,CW-px),th)),(cx+max(0,px),cy+max(0,py)))
    print(nm,tw,th,px,flush=True)
A.save('atlas_hd.png')
if not only:A.save('../assets/skel.webp',quality=90,method=6)
