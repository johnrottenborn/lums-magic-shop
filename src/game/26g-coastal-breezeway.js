/* ---------- Chapter 2: the Coastal Breezeway, south of Evergreen Grove ----------
   Laid out from the designer's sketch (sketch px x1.8): a path winding along a cliff top, evergreens to the north, the ocean
   to the south (and in the two bays). Lum comes in from Evergreen Grove at the top of the middle hump; three ruined archways
   stand just above the path's west end (scenery only), and the path runs on off the west edge. Breezevale Cove is far east (map still to come). Lum can only walk on the path.
   Built as another region of the Stranglethorn world, east of the grove. */
const BWX=GROVEX+3000,BWY=500,BWW=4140,BWH=2880,BWT={t:99};
const bp=a=>a.map(([x,y])=>[x*1.8,y*1.8]);
const BPATH_L=bp([[-260,690],[20,690],[95,690],[300,700],[410,760],[435,950],[440,1180],[480,1360],[580,1430],[720,1410],[840,1290],[940,1150],[1010,1110],[1090,1130],[1200,1210],[1340,1300],[1500,1350],[1640,1350],[1730,1260],[1745,1080],[1700,920],[1600,760],[1500,600],[1480,500],[1550,455],[1750,455],[2000,460],[2330,440]]);
const BPATH_CTRL=BPATH_L.map(([x,y])=>[x+BWX,y+BWY]);
const BPATH_PTS=splinePts(BPATH_CTRL,16);let BPATHP=null;
/* the land: everything north of the path (the path itself runs along the cliff top) */
const BLAND=[...BPATH_PTS.map(([x,y])=>[x-BWX,y-BWY]),[BWW+300,-300],[BPATH_L[0][0]-200,-300],[BPATH_L[0][0]-200,BPATH_L[0][1]]];
const BENTRY={x:1010*1.8,y:1110*1.8},BEAST={x:BWW-60,y:0};
BEAST.y=(()=>{let b=null;for(const [x,y] of BPATH_PTS)if(!b||Math.abs(x-BWX-BEAST.x)<Math.abs(b[0]-BWX-BEAST.x))b=[x,y];return b[1]-BWY;})();
const BARCHES=[[135,250,false],[375,250,true],[615,250,false]],BARCH_X1=780;   /* x, width, flipped */
const inBW=()=>lum.x>BWX-300;
const BH_=(a,b)=>hash(a,b,5153);
function bpathDist(x,y){let best=1e9;for(let i=0;i<BPATH_PTS.length-1;i++){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);best=Math.min(best,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return best;}
/* the path only, from the west edge of the view to the east edge */
function bwFree(x,y){const lx=x-BWX;if(lx<24||lx>BWW-20)return false;return bpathDist(x,y)<56;}
/* evergreens filling the land, hydrangeas along the path's north side, rocks along the path and sea stacks out in the water */
function bwProps(P){const X=x=>x+BWX,Y=y=>y+BWY;let k=0;
  for(let gy=-140;gy<BWH;gy+=92)for(let gx=-60;gx<BWW+80;gx+=100){k++;const lx=gx+(BH_(k,1)-.5)*56,ly=gy+(BH_(k,2)-.5)*44;
    if(!inPoly(lx,ly,BLAND)||BH_(k,3)<.2)continue;let clear=true;for(let up=0;up<=380&&clear;up+=38)if(bpathDist(X(lx),Y(ly-up))<(up?115:150))clear=false;if(!clear)continue;   /* the path stays in view */
    const [img,w]=HTREES[Math.floor(BH_(k,4)*HTREES.length)];P.push({t:'tree',img,x:X(lx),y:Y(ly),w:w*(.72+BH_(k,5)*.32),flip:BH_(k,6)<.5,base:.95});}
  /* hydrangeas and boulders on the land side of the path */
  const HY=[['hydrsmall',120],['hydrmid',150],['hydrbig',175],['hydrtree',250]],RK=[['crockpile',110],['crockegg',70],['crockheap',120]];
  for(let i=6;i<BPATH_PTS.length-4;i+=7){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,d=Math.hypot(dx,dy)||1,nx=dy/d,ny=-dx/d;   /* the land side (left of the way east) */
    const r=BH_(i,11),off=92+BH_(i,12)*40,x=ax+nx*off,y=ay+ny*off;if(bpathDist(x,y)<85||!inPoly(x-BWX,y-BWY,BLAND)||x-BWX<BARCH_X1)continue;   /* keep clear of the ruined archways */
    if(r<.62){const [img,w]=HY[Math.floor(BH_(i,13)*(r<.1?4:3))];P.push({t:'tree',img,x,y:y+8,w:w*(.85+BH_(i,14)*.3),flip:BH_(i,15)<.5,base:.97});}
    else if(r<.82){const [img,w]=RK[Math.floor(BH_(i,16)*RK.length)];P.push({t:'tree',img,x,y:y+6,w:w*(.85+BH_(i,17)*.3),flip:BH_(i,18)<.5,base:.95});}}
  /* sea stacks out in the bays and the open sea */
  for(const [sx,sy,img,w] of [[300,1900,'crockspire',300],[1150,2550,'crockheap',260],[2100,2700,'crockspire',340],[3350,2300,'crockheap',300],[3750,1500,'crockspire',280],[3200,1200,'crockpile',200],[700,2700,'crockpile',220],[2700,2550,'crockegg',150]].map(([a,b,c,d])=>[a,b,c,d]))
    if(!inPoly(sx,sy,BLAND)&&bpathDist(X(sx),Y(sy))>330)P.push({t:'tree',img,x:X(sx),y:Y(sy),w,flip:sx%2<1,base:.9});
  /* three ruined archways in a line just above the west end of the path: scenery only, Lum can't reach them */
  const ay=Math.min(...BARCHES.map(([ax])=>{let y=BPATH_PTS.reduce((b,p)=>Math.abs(p[0]-X(ax))<Math.abs(b[0]-X(ax))?p:b)[1];while(bpathDist(X(ax),y)<60)y-=4;return y;}));   /* one shared line */
  for(const [ax,w,fl] of BARCHES)P.push({t:'tree',img:'ruins_arch',x:X(ax),y:ay,w,flip:fl,base:.97});}
/* ground: the sea everywhere off the land, the cliff edge bent along the path's south side, then the path */
function drawBWGround(x0,y0,x1,y1){if(x1<BWX-300)return;if(!BPATHP)BPATHP=buildPath(BPATH_CTRL,108,5.3);
  ctx.save();ctx.translate(BWX,BWY);
  ctx.beginPath();ctx.rect(-400,-400,BWW+800,BWH+800);BLAND.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
  ctx.fillStyle=waterPattern(ctx,'water_tile',.6)||'#2f5f78';ctx.fill('evenodd');   /* the designer's water art */
  ctx.restore();
  drawBWCliff(x0,y0,x1,y1);
  drawPath(BPATHP,x0,x1);}
/* the designer's cliff strip, laid slice by slice along the outer edge of the path (grass on the path side, surf on the sea side) */
function drawBWCliff(x0,y0,x1,y1){const im=IMG.cliff_edge;if(!ready(im))return;const BAND=300,k=BAND/im.naturalHeight,iw=im.naturalWidth,OFF=44;let u=0;
  for(let i=0;i<BPATH_PTS.length-1;i++){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,ox=-dy/L,oy=dx/L;   /* outward, toward the sea */
    if(Math.max(ax,bx)+BAND<x0||Math.min(ax,bx)-BAND>x1||Math.max(ay,by)+BAND<y0||Math.min(ay,by)-BAND>y1){u=(u+L/k)%iw;continue;}
    const nx2=i+2<BPATH_PTS.length?BPATH_PTS[i+2][0]-bx:dx,ny2=i+2<BPATH_PTS.length?BPATH_PTS[i+2][1]-by:dy,turn=Math.abs(Math.atan2(dx*ny2-dy*nx2,dx*nx2+dy*ny2)),ext=3+BAND*turn*1.1;   /* the strip fans out round bends: overlap the slices so no gaps open */
    let left=(L+ext)/k,du=-ext/2/k;u=(u-ext/2/k+iw*4)%iw;ctx.save();ctx.translate(ax+ox*OFF,ay+oy*OFF);ctx.transform(dx/L,dy/L,ox,oy,0,0);
    while(left>0){const sw=Math.min(left,iw-u);ctx.drawImage(im,u,0,sw,im.naturalHeight,du*k,0,sw*k,BAND);du+=sw;left-=sw;u=(u+sw)%iw;}
    u=(u-ext/2/k+iw*4)%iw;ctx.restore();}}
function enterBreezeway(){SCENE='thorn';lum.x=BWX+BENTRY.x;lum.y=BWY+BENTRY.y-10;{let b=null;for(const p of BPATH_PTS)if(!b||Math.hypot(p[0]-lum.x,p[1]-lum.y)<Math.hypot(b[0]-lum.x,b[1]-lum.y))b=p;lum.x=b[0];lum.y=b[1];}
  lum.face=1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BWT.t=0;}
function drawBWTitle(){if(!inBW()||BWT.t>=4.5||SCENE!=='thorn')return;BWT.t+=1/60;const a=Math.min(1,BWT.t*1.5,(4.5-BWT.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(20,16,12,.55)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f6ecd8';ctx.font=`600 ${Math.round(Math.min(30,W/13))}px Georgia,serif`;ctx.fillText('Coastal Breezeway',W/2,H*.3+10);ctx.restore();}
/* the way back up to Evergreen Grove and the road on to Breezevale Cove (east; map still to come). The archways are scenery only */
THINT.push({get x(){return BWX+BENTRY.x;},get y(){return BWY+BENTRY.y-62;},get reach(){return inBW()?80:-1;},door:true,onInteract:()=>enterGrove(true)},
  {get x(){return BWX+BWW-70;},get y(){return BWY+BEAST.y;},get reach(){return inBW()?80:-1;},door:true,onInteract:()=>say("Breezevale Cove lies ahead.")});
/* the same foes as Evergreen Grove, out along the path */
function addBWFoes(){if(THFOES.some(g=>g.bw))return;let id=5200;const dead=new Set(C1.thDead||[]),n=BPATH_PTS.length;
  for(const [f,kind,pack] of [[.07,'gwisp',1],[.16,'ffox',1],[.27,'nymph',1],[.36,'ffox',2],[.47,'gwisp',2],[.58,'ffox',1],[.67,'nymph',1],[.76,'gwisp',1],[.86,'ffox',2],[.94,'gwisp',1]]){
    const [x,y]=BPATH_PTS[Math.floor(f*n)],myid=id++;if(dead.has(myid)||Math.hypot(x-BWX-BENTRY.x,y-BWY-BENTRY.y)<400)continue;
    THFOES.push({kind,bw:1,scene:'thorn',x,y,hx:x,hy:y,tx:x,ty:y,cx:x-TCW/2,cy:y-TCH/2,s:1,pack,calm:1,dead:0,t:rnd(0,4),ph:rnd(0,TAU),face:-1,id:myid,bl:0});}}
