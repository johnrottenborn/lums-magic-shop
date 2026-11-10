from PIL import Image;import numpy as np;from scipy import ndimage as nd
src=np.array(Image.open('sheet.jpg').convert('RGB')).astype(float)
s=765-src.sum(2);M=s>40
def seam(mask,x0,x1):
  # min-cost top-to-bottom path within columns [x0,x1)
  c=mask[:,x0:x1].astype(float)*10+ .01
  H,Wd=c.shape;D=c.copy();B=np.zeros((H,Wd),int)
  for y in range(1,H):
    for dx in (-1,0,1):pass
    prev=D[y-1];l=np.r_[np.inf,prev[:-1]];r=np.r_[prev[1:],np.inf]
    st=np.vstack([l,prev,r]);a=st.argmin(0);D[y]+=st.min(0);B[y]=a-1
  x=int(D[-1].argmin());path=np.zeros(H,int)
  for y in range(H-1,-1,-1):path[y]=x+x0;x=x+B[y,x]
  return path
bands={'top':(98,318),'mid':(318,552),'bot':(552,768)}
def comps(band):
  y0,y1=bands[band];lab,n=nd.label(M[y0:y1],structure=np.ones((3,3)));return lab
# frame spec: band, x-range for picking component (centroid x), optional seam splits (left seam range, right seam range)
spec={'idle':[('top',150,None,None),('top',300,None,None),('top',460,None,None),('top',580,None,None)],
 'walk':[('top',720,None,(760,830)),('top',860,(760,830),None),('top',1000,None,None),('top',1110,None,(1150,1210)),('top',1260,(1150,1210),None)],
 'attack':[('mid',180,None,None),('mid',560,(450,500),None),('mid',850,None,None),('mid',1200,None,None)],
 'hurt':[('bot',170,None,None),('bot',330,None,None),('bot',475,None,None)],
 'die':[('bot',715,None,None),('bot',870,None,None),('bot',1050,None,None),('bot',1250,None,None)]}
for k,fr in spec.items():
  for i,(band,cx,ls,rs) in enumerate(fr):
    y0,y1=bands[band];lab=comps(band);H=y1-y0
    # pick component that occupies column cx with most pixels
    colids=lab[:,cx-15:cx+15].ravel();colids=colids[colids>0];cid=np.bincount(colids).argmax()
    m=lab==cid
    xs=np.arange(src.shape[1])[None,:]
    if ls:p=seam(M[y0:y1],*ls);m&=xs>p[:,None]
    if rs:p=seam(M[y0:y1],*rs);m&=xs<p[:,None]
    mm=nd.binary_dilation(m,iterations=2)
    c=src[y0:y1];al=np.clip((s[y0:y1]-20)/90,0,1)*mm
    a3=al[...,None];rgb=np.clip(np.where(a3>.01,(c-(1-a3)*255)/np.maximum(a3,1e-3),0),0,255)
    im=Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8),'RGBA');bb=im.getbbox()
    im.crop(bb).save(f'f_{k}{i}.png');print(k,i,bb)
    import json;np.save(f'm_{k}{i}.npy',mm[bb[1]:bb[3],bb[0]:bb[2]]);json.dump([bb[0],bb[1]+y0,bb[2],bb[3]+y0],open(f'b_{k}{i}.json','w'))
