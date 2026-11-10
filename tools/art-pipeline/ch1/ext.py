import numpy as np,json,sys
from PIL import Image
from scipy import ndimage as nd
def extract(name,grid=False,thr=50,minsz=3000,merge=4):
  src=np.array(Image.open(name+'.jpg').convert('RGB')).astype(np.float32);s=765-src.sum(2);dark=s>thr
  if grid:
    lines=nd.binary_opening(s>80,structure=np.ones((1,140)))|nd.binary_opening(s>80,structure=np.ones((140,1)))
    lines=nd.binary_dilation(lines,iterations=3);dark&=~lines
  m=nd.binary_dilation(dark,iterations=merge);lab,n=nd.label(m);objs=nd.find_objects(lab);sz=nd.sum(dark,lab,range(1,n+1))
  fr=[]
  for i,(o,v) in enumerate(zip(objs,sz)):
    if v<minsz:continue
    fr.append(dict(y0=o[0].start,x0=o[1].start,y1=o[0].stop,x1=o[1].stop,id=i+1,sz=int(v)))
  # group rows by vertical centre
  fr.sort(key=lambda f:(f['y0']+f['y1'])/2);rows=[]
  for f in fr:
    cy=(f['y0']+f['y1'])/2
    if rows and abs(cy-rows[-1][0])<60:rows[-1][1].append(f)
    else:rows.append([cy,[f]])
  out=[]
  for cy,r in rows:
    r.sort(key=lambda f:f['x0']);out.append(r)
  return src,s,lab,out
if __name__=='__main__':
  for nm,g in [('rskel',0),('wisp',1),('vane',1),('reaper',0)]:
    src,s,lab,rows=extract(nm,g)
    print(nm,[len(r) for r in rows])
    for r in rows:print('   ',[(f['x0'],f['y0'],f['x1']-f['x0'],f['y1']-f['y0']) for f in r])
