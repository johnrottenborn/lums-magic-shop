import sys;sys.path.insert(0,'/home/claude/lum/ch1/icons')
from PIL import Image,ImageDraw
import numpy as np
from scipy import ndimage
im=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)
def matte(c,holes,top=1.0):
    mn=c.min(-1);mx=c.max(-1);whiteish=(mn>226)&((mx-mn)<24)
    lab,n=ndimage.label(whiteish);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    big=set()
    if holes:
        sizes=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));cms=ndimage.center_of_mass(whiteish,lab,range(1,n+1));big={i+1 for i,z in enumerate(sizes) if z>80 and cms[i][0]<top*c.shape[0]}
    bg=np.isin(lab,list(edge|big));near=ndimage.binary_dilation(bg,iterations=3)&~bg
    alpha=np.where(bg,0,255).astype(np.float32);soft=np.clip((250-mn)/55,0,1)*255;alpha=np.where(near,np.minimum(alpha,soft),alpha)
    return np.dstack([c,alpha]).astype(np.uint8)
def save(rgba,name,size=180,pad=.06):
    a=rgba[...,3];lab,n=ndimage.label(a>30);sizes=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
    big1=int(np.argmax(sizes))+1;reg=ndimage.binary_dilation(lab==big1,iterations=14);ids=[i for i in np.unique(lab[reg]) if i>0 and sizes[i-1]>40];keep=np.isin(lab,ids);rgba[...,3]=np.where(ndimage.binary_dilation(keep,iterations=3),a,0)
    ys,xs=np.where(rgba[...,3]>20);cr=Image.fromarray(rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]);w,h=cr.size;s=max(w,h);S=int(s*(1+pad*2))
    out=Image.new('RGBA',(S,S),(0,0,0,0));out.paste(cr,((S-w)//2,(S-h)//2),cr);out=out.resize((size,size),Image.LANCZOS);out.save(f'/home/claude/lum/assets/{name}.webp',quality=90);return out
xs=[25,235,435,615,795,1010];rows=[(40,470),(560,990)]
names=[['lantern_copper','cross_pastel','key_gold','key_ornate','sack_burlap'],['lantern_hex','cross_wood','key_iron','key_jewel','sack_leather']]
holes={'lantern_copper','lantern_hex','cross_pastel','key_gold','key_ornate','cross_wood','key_iron','key_jewel','sack_burlap'}
outs={}
for r,(y0,y1) in enumerate(rows):
    for c in range(5):
        n=names[r][c];outs[n]=save(matte(im[y0:y1,xs[c]:xs[c+1]],n in holes,{'lantern_copper':.36,'lantern_hex':.2}.get(n,1.0)),'icon2_'+n)
m=Image.new('RGB',(5*190,2*210),(90,110,80));d=ImageDraw.Draw(m)
for i,n in enumerate(outs):x=(i%5)*190;y=(i//5)*210;m.paste(outs[n],(x+5,y+22),outs[n]);d.text((x+4,y+4),n,fill=(255,255,0))
m.save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/icons3.png')
