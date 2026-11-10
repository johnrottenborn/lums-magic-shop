from PIL import Image,ImageDraw
import numpy as np, json,sys
from collections import deque
im=np.array(Image.open('maze.jpg').convert('L')).astype(int);dark=im<110
X0,X1,Y0,Y1=60,1040,88,1111;C,R=15,12;cw=(X1-X0)/C;ch=(Y1-Y0)/R
vw=lambda xl,yc:bool(dark[int(yc)-12:int(yc)+13,int(xl)-6:int(xl)+7].any(1).mean()>.8)
hw=lambda xc,yl:bool(dark[int(yl)-6:int(yl)+7,int(xc)-12:int(xc)+13].any(0).mean()>.8)
right=[[vw(X0+(c+1)*cw,Y0+(r+.5)*ch) for c in range(C)] for r in range(R)]
down=[[hw(X0+(c+.5)*cw,Y0+(r+1)*ch) for c in range(C)] for r in range(R)]
def nb(r,c):
    o=[]
    if c<C-1 and not right[r][c]:o.append((r,c+1))
    if c>0 and not right[r][c-1]:o.append((r,c-1))
    if r<R-1 and not down[r][c]:o.append((r+1,c))
    if r>0 and not down[r-1][c]:o.append((r-1,c))
    return o
S=(6,0);F=(2,C-1)
prev={S:None};q=deque([S])
while q:
    u=q.popleft()
    for v in nb(*u):
        if v not in prev:prev[v]=u;q.append(v)
unreach=[(r,c) for r in range(R) for c in range(C) if (r,c) not in prev]
print('unreachable',unreach)
path=[];u=F
while u:path.append(u);u=prev[u]
path=path[::-1];onp=set(path)
dead=[(r,c) for r in range(R) for c in range(C) if len(nb(r,c))==1 and (r,c) in prev and (r,c) not in (S,F)]
info=[]
for dd in dead:
    seen={dd};q=deque([(dd,0)]);dist=None
    while q:
        u,k=q.popleft()
        if u in onp:dist=k;break
        for v in nb(*u):
            if v not in seen:seen.add(v);q.append((v,k+1))
    info.append((dd,dist))
print('path',len(path));print('dead',sorted(info,key=lambda x:-x[1]))
json.dump({'C':C,'R':R,'right':right,'down':down,'path':path,'start':S,'finish':F,'dead':info},open('maze.json','w'))
img=Image.open('maze.jpg').convert('RGB');d=ImageDraw.Draw(img)
pts=[(X0+(c+.5)*cw,Y0+(r+.5)*ch) for r,c in path];d.line(pts,fill=(220,40,40),width=10)
for (r,c),k in info:
    x,y=X0+(c+.5)*cw,Y0+(r+.5)*ch;d.ellipse((x-14,y-14,x+14,y+14),fill=(60,120,220));d.text((x-5,y-6),str(k),fill='white')
for r,c in unreach:
    x,y=X0+(c+.5)*cw,Y0+(r+.5)*ch;d.rectangle((x-10,y-10,x+10,y+10),fill=(240,170,0))
img.resize((550,603)).save('/tmp/claude-0/-home-claude/364fb8d8-b65a-52af-b850-8b48813f9581/scratchpad/maze_sol.png')
