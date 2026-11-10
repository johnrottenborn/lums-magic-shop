from PIL import Image
import numpy as np
from scipy import ndimage
im=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)
def matte(c,holes=True):
    mn=c.min(-1);mx=c.max(-1)
    whiteish=(mn>222)&((mx-mn)<28)
    lab,n=ndimage.label(whiteish)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    sizes=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
    big={i+1 for i,z in enumerate(sizes) if z>60} if holes else set()
    bg=np.isin(lab,list(edge|big))
    # soft alpha: distance-to-white for pixels near bg
    near=ndimage.binary_dilation(bg,iterations=3)&~bg
    alpha=np.where(bg,0,255).astype(np.float32)
    soft=np.clip((250-mn)/55,0,1)*255
    alpha=np.where(near,np.minimum(alpha,soft),alpha)
    return np.dstack([c,alpha]).astype(np.uint8)
def save(rgba,name,size=160,pad=.08):
    a=rgba[...,3];ys,xs=np.where(a>20);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    cr=Image.fromarray(rgba[y0:y1,x0:x1]);w,h=cr.size;s=max(w,h);S=int(s*(1+pad*2))
    out=Image.new('RGBA',(S,S),(0,0,0,0));out.paste(cr,((S-w)//2,(S-h)//2),cr);out=out.resize((size,size),Image.LANCZOS);out.save(f'/home/claude/lum/assets/{name}.webp',quality=90);return out
P={'dewberry':(347,56,526,266),'duskberry':(347,287,527,494),'emberberry':(347,529,526,736),'plumberry':(347,755,526,969),
   'twig':(547,56,756,494),'branch':(547,529,756,969),'bones':(769,56,967,267),'slime':(769,287,967,494),'skull':(769,529,968,736),'spirit':(768,755,968,969),
   'leavesA':(57,56,335,494),'leavesB':(56,528,335,969)}
outs={}
for k,(x0,y0,x1,y1) in P.items():
    c=im[y0+8:y1-8,x0+8:x1-8]
    r=matte(c,k not in ('bones','skull','spirit','slime'))
    if k.startswith('leaves'):
        lab,n=ndimage.label(r[...,3]>20);objs=ndimage.find_objects(lab)
        big=[(i+1,o) for i,o in enumerate(objs) if (o[0].stop-o[0].start)*(o[1].stop-o[1].start)>2500]
        big.sort(key=lambda t:(t[1][0].start//70,t[1][1].start))
        for j,(li,o) in enumerate(big):
            sub=r[o].copy();sub[...,3]=np.where(lab[o]==li,sub[...,3],0);outs[f'{k}{j}']=save(sub,f'ing_{k}{j}')
    else: outs[k]=save(r,'ing_'+k)
names=list(outs);cols=8
m=Image.new('RGB',(cols*170,((len(names)+cols-1)//cols)*190),(90,110,80))
from PIL import ImageDraw;d=ImageDraw.Draw(m)
for i,n in enumerate(names):x=(i%cols)*170;y=(i//cols)*190;m.paste(outs[n],(x+5,y+18),outs[n]);d.text((x+4,y+2),n,fill=(255,255,0))
m.save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/icons.png');print(names)
