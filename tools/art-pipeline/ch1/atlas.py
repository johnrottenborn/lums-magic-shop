import numpy as np,json,os,sys
from PIL import Image
from scipy import ndimage as nd
meta=json.load(open('meta.json'));K=2.0;info={}
for sh,anims in meta.items():
  if sh=="vane": continue  # vane now comes from vane2/cut.py (prop-free sheet)
  frames={};mw=mh=0
  for an,n in anims.items():
    for i in range(n):
      f=f'{sh}_{an}{i}';c=Image.open(f'c_{f}.png').convert('RGB')
      if os.path.exists(f'sr_{f}.png'):im=Image.open(f'sr_{f}.png').convert('RGB');im=im.crop((24,24,im.width-24,im.height-24))
      else:im=c.resize((c.width*4,c.height*4),Image.BICUBIC)
      a=np.array(im).astype(np.float32);s=765-a.sum(2)
      white=a.min(2)>232;lab,k=nd.label(white);sz=nd.sum(white,lab,range(1,k+1))
      border=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
      big=np.zeros(k+1,bool);big[list(border)]=True;big[1:]|=sz>900
      fg=~big[lab];lab2,k2=nd.label(fg);
      if k2:sz2=nd.sum(fg,lab2,range(1,k2+1));keep=np.zeros(k2+1,bool);keep[1:]=sz2>max(80,sz2.max()*.002);fg=keep[lab2]
      dist=nd.distance_transform_edt(fg);soft=np.clip((s-10)/70,0,1)
      al=np.where(dist>3,1.0,np.where(nd.binary_dilation(fg,iterations=2),soft*np.clip(dist/3+.35,0,1),0)).astype(np.float32)
      # glowy effects (magic, lantern halo) keep soft alpha
      al=np.maximum(al,np.clip((s-12)/90,0,1)*(dist>0))
      a3=al[...,None];rgb=np.clip(np.where(a3>.02,(a-(1-a3)*255)/np.maximum(a3,1e-3),0),0,255)
      O=Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8),'RGBA');bb=O.getbbox() or (0,0,1,1)
      # keep frame placement: crop bottom/sides by the original crop box so animation does not jitter
      tw,th=round(c.width*K),round(c.height*K);O=O.resize((tw,th),Image.LANCZOS)
      frames[(an,i)]=O;mw=max(mw,tw);mh=max(mh,th)
  cols=max(anims.values());rows=list(anims.keys());A=Image.new('RGBA',(mw*cols,mh*len(rows)))
  for r,an in enumerate(rows):
    for i in range(anims[an]):O=frames[(an,i)];A.alpha_composite(O,(i*mw+(mw-O.width)//2,r*mh+mh-O.height))
  A.save(f'../assets/{sh}.webp',quality=88,method=6);info[sh]={'cw':mw,'ch':mh,'rows':{an:[r,anims[an]] for r,an in enumerate(rows)}}
  print(sh,A.size)
json.dump(info,open('atlas_info.json','w'))

# --- post fixes: reaper label remnant + white haze around cast aura
def _reaper_fix():
    import numpy as np
    from PIL import Image
    p='/home/claude/lum/assets/reaper.webp';im=np.array(Image.open(p).convert('RGBA')).astype(np.float32)
    cw,ch=396,328
    im[0*ch+300:1*ch,0:cw,3]=0
    c=im[2*ch:3*ch,3*cw:4*cw];rgb=c[...,:3];mx=rgb.max(-1);mn=rgb.min(-1)
    m=(mn>150)&((mx-mn)<60);c[...,3]=np.where(m,c[...,3]*np.clip((255-mn)/105,0,1)*.5,c[...,3])
    Image.fromarray(im.clip(0,255).astype(np.uint8)).save(p,quality=88,method=6)
_reaper_fix()

# --- wisp: strip the white matting fringe and stray light flecks around the bramble ball
def _wisp_fix():
    import numpy as np
    from PIL import Image
    from scipy import ndimage
    p='/home/claude/lum/assets/wisp.webp';im=np.array(Image.open(p).convert('RGBA')).astype(np.float32)
    a=im[...,3];rgb=im[...,:3];mn=rgb.min(-1);mx=rgb.max(-1)
    light=(mn>120)&((mx-mn)<60)&(a>0)
    for _ in range(3):
        solid=a>200;band=ndimage.binary_dilation(~solid,iterations=6)
        kill=light&band;a=np.where(kill,0,a);light=light&~kill
    lab,n=ndimage.label(a>20);sizes=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
    a=np.where(np.isin(lab,[i+1 for i,z in enumerate(sizes) if z<120]),0,a)
    a=ndimage.grey_erosion(a,size=(2,2)).astype(np.float32)*.5+a*.5
    im[...,3]=a;Image.fromarray(im.clip(0,255).astype(np.uint8)).save(p,quality=88,method=6)
_wisp_fix()

# --- vane: remove the baked cream glow around the lantern (the game draws its own light)
def _vane_fix():
    import numpy as np, json
    from PIL import Image
    from scipy import ndimage
    A=json.load(open('/home/claude/lum/ch1/atlas_info.json'))['vane'];cw,ch=A['cw'],A['ch'];r=A['rows']['lantern'][0]
    p='/home/claude/lum/assets/vane.webp';im=np.array(Image.open(p).convert('RGBA')).astype(np.float32)
    for rr in (r,):
        c=im[rr*ch:(rr+1)*ch];rgb=c[...,:3];a=c[...,3];mn=rgb.min(-1);mx=rgb.max(-1)
        light=(a>10)&(mn>150)&((mx-mn)<90)
        xx=(np.arange(c.shape[1])%cw)[None,:].repeat(ch,0);light&=(xx>.66*cw)
        lab,n=ndimage.label(light);edge=ndimage.binary_dilation(a<30,iterations=2)
        ids=np.unique(lab[edge&light]);ids=ids[ids>0];glow=np.isin(lab,ids)
        soft=ndimage.binary_dilation(glow,iterations=2)&~glow&(mn>120)
        a=np.where(glow,0,a);a=np.where(soft,a*.35,a);c[...,3]=a
    Image.fromarray(im.clip(0,255).astype(np.uint8)).save(p,quality=88,method=6)
# _vane_fix() retired: vane atlas rebuilt from the prop-free sheet
