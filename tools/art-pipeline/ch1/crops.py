import numpy as np,json
from PIL import Image
from scipy import ndimage as nd
def cells_from(bounds,y0,y1):return [(bounds[i],y0,bounds[i+1],y1) for i in range(len(bounds)-1)]
G=[0,172,344,516,688,860,1032,1204,1376]
V=[60,224,388,550,714,878,1042,1206,1376]
SHEETS={
 'rskel':{'idle':cells_from([45,205,350,512,676],18,270),'move':cells_from([676,850,1000,1148,1332],18,270),
   'hover':cells_from([38,210,397,582],270,526),'cast':cells_from([645,766,928,1148,1316],270,526),
   'hurt':cells_from([28,202,350,500,640],516,762),'die':cells_from([678,814,940,1160,1350],516,762)},
 'wisp':{'idle':cells_from(G[:5],0,178),'roll':cells_from(G[4:],0,178)+cells_from(G[:5],178,383),'spin':cells_from(G[4:],178,383),
   'thorn':cells_from(G[:5],383,575),'hurt':cells_from([688,918,1146,1376],383,575),'taunt':cells_from(G[:5],575,768),'die':cells_from(G[4:],575,768)},
 'vane':{'idle':cells_from(V[:5],0,192),'walk':cells_from(V,192,385),'lantern':cells_from(V[:4],577,768),'hurt':cells_from([772,880,1045,1210,1376],577,768)},
 'reaper':{'idle':cells_from([150,286,420,552,690,830,960],66,214),'walk':cells_from([28,190,365,525,680,835,1000,1190,1340],229,352),
   'cast':cells_from([200,360,520,690,850,1048,1200,1345],352,516),'strike':cells_from([195,360,530,700,850,990],500,636),'hurt':cells_from([190,360,530,670],640,768)},
}
meta={}
for sh,anims in SHEETS.items():
  src=np.array(Image.open(sh+'.jpg').convert('RGB')).astype(np.float32);s=765-src.sum(2)
  meta[sh]={}
  for an,cells in anims.items():
    meta[sh][an]=len(cells)
    for i,(x0,y0,x1,y1) in enumerate(cells):
      pad=4 if sh in('wisp','vane') else 0
      top=(46 if an=='taunt' and i==0 else 20 if an=='idle' else 28) if (sh=='wisp' and (an in('thorn','hurt','taunt','die') or (an=='idle' and i==0))) else 0
      c=src[y0+pad+top:y1-pad,x0+pad:x1-pad].copy();cs=s[y0+pad+top:y1-pad,x0+pad:x1-pad]
      m=cs>40;mm=nd.binary_dilation(m,iterations=3);lab,n=nd.label(mm);sz=nd.sum(m,lab,range(1,n+1))
      if n:
        keep=np.zeros(n+1,bool);big=sz.max();keep[1:]=sz>big*.1;
        # drop text-like blobs hugging the cell top-left
        for j in range(1,n+1):
          ys,xs=np.nonzero(lab==j)
          if keep[j] and sz[j-1]<big*.5 and ys.max()<c.shape[0]*.3:keep[j]=False
        mk=keep[lab]
      else:mk=mm
      c[~nd.binary_dilation(mk,iterations=2)]=255
      Image.fromarray(c.astype(np.uint8)).save(f'c_{sh}_{an}{i}.png')
json.dump(meta,open('meta.json','w'));print(meta)
