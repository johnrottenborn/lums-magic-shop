from PIL import Image
import numpy as np, pickle, os
from scipy import ndimage
exec(open('cells.py').read())
a=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)
mn=a.min(-1);sat=a.max(-1)-mn
light=(mn>140)&(mn<240)&(sat<30)
lines=ndimage.binary_opening(light,structure=np.ones((1,80)))|ndimage.binary_opening(light,structure=np.ones((80,1)))
lines=ndimage.binary_dilation(lines,iterations=1)&(mn>120)
clean=a.copy();clean[lines]=255
fg=((mn<236)|(sat>28))&~lines
lab,n=ndimage.label(ndimage.binary_dilation(fg,iterations=2));sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));com=ndimage.center_of_mass(fg,lab,range(1,n+1))
assign={}
for i in range(n):
    if sz[i]<40:continue
    cy,cx=com[i]
    for k,lst in cells.items():
        for j,(x0,y0,x1,y1) in enumerate(lst):
            if x0<=cx<x1 and y0<=cy<y1:assign.setdefault((k,j),[]).append(i+1)
os.makedirs('crops',exist_ok=True);info={}
for (k,j),ids in assign.items():
    m=np.isin(lab,ids);ys,xs=np.where(m);y0,y1,x0,x1=max(0,ys.min()-4),ys.max()+5,max(0,xs.min()-4),xs.max()+5
    c=clean[y0:y1,x0:x1].copy();mm=ndimage.binary_dilation(m[y0:y1,x0:x1],iterations=3);c[~mm]=255
    Image.fromarray(c.astype(np.uint8)).save(f'crops/{k}{j}.png');info[f'{k}{j}']=(x0,y0,x1,y1)
pickle.dump(info,open('info.pkl','wb'));print(len(info))
