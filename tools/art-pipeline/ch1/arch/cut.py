from PIL import Image,ImageDraw,ImageFilter
import numpy as np
from scipy import ndimage
im=Image.open('src.jpg').convert('RGB');a=np.array(im).astype(np.float32);H,W=a.shape[:2]
r,g,b=a[...,0],a[...,1],a[...,2];L=a.mean(-1);mx=a.max(-1);mn=a.min(-1);sat=mx-mn
ed=np.array(im.convert('L').filter(ImageFilter.FIND_EDGES)).astype(np.float32)
ed=ndimage.maximum_filter(ed,3)
sky=(b>r+6)&(L>160)&(sat<90)
yy0=np.arange(H)[:,None]+np.zeros((1,W));xx0=np.arange(W)[None,:]+np.zeros((H,1))
hill=(L>165)&(sat<55)&(ed<40)
fg=((L<150)|(ed>55)|((sat>40)&(L<205)))&~sky
fg=ndimage.binary_closing(fg,iterations=2)
fg=ndimage.binary_fill_holes(fg)
fg=ndimage.binary_opening(fg,iterations=1)
def poly(pts):
    m=Image.new('L',(W,H),0);ImageDraw.Draw(m).polygon(pts,fill=255);return np.array(m)>0
# hard exclusions: sky/hills above the left skyline, the far tree & arch on the right, the opening of the front arch
excl=poly([(0,0),(470,0),(470,120),(455,230),(440,300),(420,298),(350,288),(300,283),(250,298),(160,308),(120,338),(60,330),(0,338)])
excl|=poly([(0,380),(26,380),(30,600),(0,600)])
excl|=poly([(1112,0),(W,0),(W,395),(1112,395)])|poly([(1030,0),(1112,0),(1112,112),(1060,118),(1035,95)])
inner=[(610,H),(612,640),(605,420),(612,320),(640,235),(695,182),(770,152),(860,160),(930,198),(972,258),(968,380),(952,520),(946,640),(948,H)]
inm=poly(inner)
core=ndimage.binary_erosion(inm,iterations=16)
band=ndimage.binary_dilation(inm,iterations=26)&~core
hazy=(L>118)&(sat<62)
excl|=core
excl_band=band&hazy
keysky=(sky&~(L<120))|((L>158)&(sat<70)&(((xx0>1005)&(yy0<230))|((xx0<505)&(xx0>420)&(yy0<440))))
haze_left=((L>148)&(sat<72)&(yy0<480)&(xx0<455))|((L>150)&(sat<70)&(yy0<330)&(xx0<505))
alpha=(fg&~excl&~excl_band&~keysky&~haze_left).astype(np.float32)
# keep everything solid deep in the hedge; soften edges
solid=poly([(0,470),(440,440),(505,430),(512,330),(600,330),(605,H),(0,H)])|poly([(950,420),(W,430),(W,H),(950,H)])
alpha=np.where(solid&~excl&~excl_band,1,alpha)
# fade out the hazy far arch behind the left hedge, following a wavy line
wav=440+12*np.sin(xx0/23)+8*np.sin(xx0/9)
wx=np.clip((xx0-195)/70,0,1)*np.clip((470-xx0)/30,0,1)
alpha*=1-wx*(1-np.clip((yy0-wav)/30,0,1))
# soften the right-hand cut where the far tree was
alpha*=np.where(xx0>1100,np.clip((yy0-395)/45,0,1),1)
alpha=ndimage.median_filter(alpha,3)
lab,n=ndimage.label(alpha>.3);sz=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
small=np.isin(lab,[i+1 for i in range(n) if sz[i]<900]);alpha[small]=0
alpha=ndimage.gaussian_filter(alpha,1.0)
# fade into the ground at the bottom
alpha*=np.where(xx0<60,np.clip((yy0-470)/60,0,1)*(1-np.clip(xx0/60,0,1))+np.clip(xx0/60,0,1),1)
yy=np.arange(H)[:,None];alpha*=np.clip((850-yy)/70,0,1)
out=np.dstack([a,alpha*255]).clip(0,255).astype(np.uint8)
Image.fromarray(out).save('wall_full.png')
def piece(x0,x1,name,fl=25,fr=25):
    p=out[:,x0:x1].astype(np.float32).copy();w=x1-x0;xx=np.arange(w)[None,:]
    p[...,3]*=np.clip(xx/fl,0,1)*np.clip((w-1-xx)/fr,0,1)
    m=p[...,3]>8;ys=np.where(m.any(1))[0];p=p[ys[0]:ys[-1]+1]
    Image.fromarray(p.astype(np.uint8)).save(name);return p.shape
print(piece(430,1120,'bramble_arch.png'),piece(0,448,'bramble_hedge.png',fl=30,fr=40))
# preview on dark grass
for n in ['wall_full.png','bramble_arch.png','bramble_hedge.png']:
    p=Image.open(n);bg=Image.new('RGBA',p.size,(52,70,44,255));bg.alpha_composite(p);bg.convert('RGB').save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/prev_'+n)
