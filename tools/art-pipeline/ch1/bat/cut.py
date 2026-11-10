from PIL import Image,ImageFilter
import numpy as np, json
from scipy import ndimage
SRC=np.array(Image.open('sheet.jpg').convert('RGB')).astype(np.float32)
cells={'fly':[(303,4,560,190),(565,4,833,190),(838,4,1108,190)],
 'glide':[(4,400,340,558),(342,400,692,558),(694,400,1056,558)],
 'swoop':[(1063,378,1376,558),(284,563,555,750),(560,563,832,750)],
 'recover':[(838,563,1108,750),(1113,563,1376,750)]}
flip={'swoop'}
def matte(c):
    mx=c.max(-1);a=np.clip((mx-14)/38,0,1)*255
    h,w=a.shape;a[int(h*.86):,:int(w*.32)]=0  # label corner
    h0,w0=a.shape;a[:,:3]=0;a[:,-3:]=0;a[:3,:]=0;a[-3:,:]=0
    for i,sl in enumerate(ndimage.find_objects(ndimage.label(a>20)[0])):
        pass
    L,_=ndimage.label(a>20)
    for i,sl in enumerate(ndimage.find_objects(L)):
        hh=sl[0].stop-sl[0].start;ww=sl[1].stop-sl[1].start
        if min(hh,ww)<=4 and max(hh,ww)>30:a[L==i+1]=0
    lab,n=ndimage.label(a>40);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1));big=int(np.argmax(sz))+1
    reg=ndimage.binary_dilation(lab==big,iterations=10);ids=[i for i in np.unique(lab[reg]) if i>0];keep=ndimage.binary_dilation(np.isin(lab,ids),iterations=2)
    a=np.where(keep,a,0)
    rgb=c/np.maximum(a[...,None]/255,1e-3);rgb=np.clip(rgb,0,255)  # un-premultiply off black
    return np.dstack([np.where(a[...,None]>0,rgb*.65+c*.35,c),a])
CW,CH=380,250;rows={};frames=[]
for k,lst in cells.items():
    rows[k]=[len(rows),len(lst)];row=[]
    for (x0,y0,x1,y1) in lst:
        m=matte(SRC[y0:y1,x0:x1]);a=m[...,3]
        if k in flip:m=m[:,::-1];a=m[...,3]
        cy,cx=ndimage.center_of_mass(a)
        out=np.zeros((CH,CW,4),np.float32);ox=int(CW/2-cx);oy=int(CH/2-cy)
        h,w=a.shape
        ys0=max(0,-oy);ys1=min(h,CH-oy);xs0=max(0,-ox);xs1=min(w,CW-ox)
        out[ys0+oy:ys1+oy,xs0+ox:xs1+ox]=m[ys0:ys1,xs0:xs1];row.append(out)
    frames.append(row)
cols=max(len(r) for r in frames);atl=np.zeros((CH*len(frames),CW*cols,4),np.float32)
for j,r in enumerate(frames):
    for i,f in enumerate(r):atl[j*CH:(j+1)*CH,i*CW:(i+1)*CW]=f
img=Image.fromarray(atl.clip(0,255).astype(np.uint8)).resize((CW*cols*2,CH*len(frames)*2),Image.LANCZOS)
img=Image.merge('RGBA',[*img.convert('RGB').filter(ImageFilter.UnsharpMask(2,60,2)).split(),img.split()[3]])
img.save('/home/claude/lum/assets/bat.webp',quality=82,method=6)
json.dump({'cw':CW*2,'ch':CH*2,'rows':rows},open('bat_info.json','w'));print(rows)
bg=Image.new('RGBA',img.size,(70,80,60,255));bg.alpha_composite(img);bg.resize((img.width//3,img.height//3)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/batatl.png')
