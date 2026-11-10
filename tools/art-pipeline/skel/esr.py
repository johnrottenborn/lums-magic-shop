import zipfile,pickle,numpy as np,sys,time
def load_pth(path):
    z=zipfile.ZipFile(path);names=z.namelist();root=names[0].split('/')[0]
    class Storage:
        def __init__(s,key,dtype):s.key=key;s.dtype=dtype
    class U(pickle.Unpickler):
        def find_class(s,mod,name):
            if name=='_rebuild_tensor_v2':
                def rb(st,off,size,stride,*a):
                    buf=np.frombuffer(z.read(f'{root}/data/{st.key}'),dtype=st.dtype)
                    n=int(np.prod(size)) if size else 1
                    arr=np.lib.stride_tricks.as_strided(buf[off:],shape=size,strides=[x*buf.itemsize for x in stride]) if size else buf[off:off+1]
                    return np.array(arr,dtype=np.float32)
                return rb
            if name in('FloatStorage','HalfStorage'):return {'FloatStorage':np.float32,'HalfStorage':np.float16}[name]
            if mod=='collections' and name=='OrderedDict':
                import collections;return collections.OrderedDict
            if name=='_rebuild_parameter':return lambda d,*a:d
            return super().find_class(mod,name)
        def persistent_load(s,pid):
            _,stype,key,loc,n=pid;return Storage(key,stype)
    return U(z.open(f'{root}/data.pkl')).load()
P=load_pth('anime6B.pth');P=P.get('params_ema',P)
def conv(x,name,act=False):
    W=P[name+'.weight'];b=P[name+'.bias'];co,ci,kh,kw=W.shape;C,H,Wd=x.shape
    xp=np.pad(x,((0,0),(1,1),(1,1)))
    cols=np.empty((ci*9,H*Wd),np.float32);k=0
    for dy in range(3):
        for dx in range(3):
            cols[k*ci:(k+1)*ci]=xp[:,dy:dy+H,dx:dx+Wd].reshape(ci,-1);k+=1
    Wm=W.transpose(0,2,3,1).reshape(co,9*ci)  # order: dy,dx,ci matching cols blocks
    out=(Wm@cols).reshape(co,H,Wd)+b[:,None,None]
    if act:np.maximum(out,out*0.2,out=out)
    return out
def rdb(x,p):
    x1=conv(x,p+'.conv1',1);x2=conv(np.concatenate([x,x1]),p+'.conv2',1);x3=conv(np.concatenate([x,x1,x2]),p+'.conv3',1)
    x4=conv(np.concatenate([x,x1,x2,x3]),p+'.conv4',1);x5=conv(np.concatenate([x,x1,x2,x3,x4]),p+'.conv5')
    return x5*0.2+x
def up(x):return x.repeat(2,1).repeat(2,2)
nb=len({k.split('.')[1] for k in P if k.startswith('body.')})
def sr(img):  # img float32 HxWx3 in [0,1]
    x=img.transpose(2,0,1).astype(np.float32)
    f=conv(x,'conv_first');b=f
    for i in range(nb):
        o=rdb(b,f'body.{i}.rdb1');o=rdb(o,f'body.{i}.rdb2');o=rdb(o,f'body.{i}.rdb3');b=o*0.2+b
    f=f+conv(b,'conv_body')
    f=conv(up(f),'conv_up1',1);f=conv(up(f),'conv_up2',1)
    out=conv(conv(f,'conv_hr',1),'conv_last')
    return np.clip(out.transpose(1,2,0),0,1)
if __name__=='__main__':
    from PIL import Image
    im=np.array(Image.open(sys.argv[2]).convert('RGB')).astype(np.float32)/255
    t=time.time();o=sr(im);print('t',time.time()-t,nb)
    Image.fromarray((o*255+.5).astype(np.uint8)).save(sys.argv[3])
