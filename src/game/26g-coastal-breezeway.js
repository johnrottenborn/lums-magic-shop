/* ---------- Chapter 2: the Coastal Breezeway, south of Evergreen Grove ----------
   Laid out from the designer's sketch (sketch px x1.8): a path winding along a cliff top, evergreens to the north, the ocean
   to the south (and in the two bays). Lum comes in from Evergreen Grove at the top of the middle hump; three ruined archways
   stand just above the path's west end (scenery only), and the path runs on off the west edge. Breezevale Cove is far east (map still to come). Lum can only walk on the path.
   Built as another region of the Stranglethorn world, east of the grove. */
const BWX=GROVEX+3000,BWY=500,BWW=4140,BWH=2880,BWT={t:99};
const bp=a=>a.map(([x,y])=>[x*1.8,y*1.8]);
const BPATH_L=bp([[-260,690],[20,690],[95,690],[300,700],[410,760],[435,950],[440,1180],[480,1360],[580,1430],[720,1410],[840,1290],[940,1150],[1010,1110],[1090,1130],[1200,1210],[1340,1300],[1500,1350],[1640,1350],[1730,1260],[1745,1080],[1700,920],[1600,760],[1500,600],[1480,500],[1550,455],[1750,455],[2000,460],[2330,440]]);
const BPATH_CTRL=BPATH_L.map(([x,y])=>[x+BWX,y+BWY]);
const BPATH_PTS=splinePts(BPATH_CTRL,16);let BPATHP=null,BSPURP=null;
/* the land: everything north of the path (the path itself runs along the cliff top) */
const BLAND=[...BPATH_PTS.map(([x,y])=>[x-BWX,y-BWY]),[BWW+300,-300],[BPATH_L[0][0]-200,-300],[BPATH_L[0][0]-200,BPATH_L[0][1]]];
const BENTRY={x:1010*1.8,y:1110*1.8},BEAST={x:BWW-60,y:0};
BEAST.y=(()=>{let b=null;for(const [x,y] of BPATH_PTS)if(!b||Math.abs(x-BWX-BEAST.x)<Math.abs(b[0]-BWX-BEAST.x))b=[x,y];return b[1]-BWY;})();
const BARCHES=[[135,250,false],[375,250,true],[615,250,false]],BARCH_X1=780;   /* x, width, flipped */
const BW_OFF=66,BSPUR=300;   /* a short side path north from the hump up to the door back to Evergreen Grove */
const bspurDist=(x,y)=>{const lx=x-BWX-BENTRY.x,ly=y-BWY;return Math.hypot(lx,ly<BENTRY.y-BSPUR?ly-(BENTRY.y-BSPUR):ly>BENTRY.y?ly-BENTRY.y:0);};
const bwClear=(lx,ly,m)=>Math.abs(lx-BENTRY.x)<m&&ly<BENTRY.y+30;   /* nothing grows on the way up to the grove (trees and flowers line its edges) */   /* path centre to the top of the cliff strip */
const inBW=()=>lum.x>BWX-300;
const BH_=(a,b)=>hash(a,b,5153);
function bpathDist(x,y){let best=1e9;for(let i=0;i<BPATH_PTS.length-1;i++){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);best=Math.min(best,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return best;}
/* the path only, from the west edge of the view to the east edge */
function bwFree(x,y){const lx=x-BWX;if(lx<24||lx>BWW-20)return false;return bpathDist(x,y)<78||bspurDist(x,y)<44;}
/* evergreens filling the land, hydrangeas along the path's north side, rocks along the path and sea stacks out in the water */
function bwProps(P){const X=x=>x+BWX,Y=y=>y+BWY;let k=0;
  for(let gy=-140;gy<BWH;gy+=92)for(let gx=-60;gx<BWW+80;gx+=100){k++;const lx=gx+(BH_(k,1)-.5)*56,ly=gy+(BH_(k,2)-.5)*44;
    if(!inPoly(lx,ly,BLAND)||BH_(k,3)<.2||bwClear(lx,ly,150))continue;let clear=true;for(let up=0;up<=380&&clear;up+=38)if(bpathDist(X(lx),Y(ly-up))<(up?150:190))clear=false;if(!clear)continue;   /* the path stays in view */
    const [img,w]=HTREES[Math.floor(BH_(k,4)*HTREES.length)];P.push({t:'tree',img,x:X(lx),y:Y(ly),w:w*(.72+BH_(k,5)*.32),flip:BH_(k,6)<.5,base:.95});}
  /* hydrangeas and boulders on the land side of the path */
  const HY=[['hydrsmall',120],['hydrmid',150],['hydrbig',175],['hydrtree',250]],RK=[['crockpile',110],['crockegg',70],['crockheap',120]];
  for(let i=6;i<BPATH_PTS.length-4;i+=7){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,d=Math.hypot(dx,dy)||1,nx=dy/d,ny=-dx/d;   /* the land side (left of the way east) */
    const r=BH_(i,11),off=120+BH_(i,12)*40,x=ax+nx*off,y=ay+ny*off;if(bpathDist(x,y)<112||!inPoly(x-BWX,y-BWY,BLAND)||x-BWX<BARCH_X1||bwClear(x-BWX,y-BWY,190))continue;   /* keep clear of the ruined archways */
    if(r<.62){const [img,w]=HY[Math.floor(BH_(i,13)*(r<.1?4:3))];P.push({t:'tree',img,x,y:y+8,w:w*(.85+BH_(i,14)*.3),flip:BH_(i,15)<.5,base:.97});}
    else if(r<.82){const [img,w]=RK[Math.floor(BH_(i,16)*RK.length)];P.push({t:'tree',img,x,y:y+6,w:w*(.85+BH_(i,17)*.3),flip:BH_(i,18)<.5,base:.95});}}
  /* small boulders along the sea edge of the path, always on the tight bends (where the cliff strip opens up) and here and there between */
  const SB=['crockegg','crockpile','crockheap'];for(let i=2;i<BPATH_PTS.length-3;i++){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],[cx,cy]=BPATH_PTS[i+2],dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,ox=-dy/L,oy=dx/L,turn=Math.abs(Math.atan2(dx*(cy-by)-dy*(cx-bx),dx*(cx-bx)+dy*(cy-by)));
    if(!(turn>.12&&i%4===0)&&!(i%10===0&&BH_(i,21)<.35))continue;const off=BW_OFF+4+BH_(i,22)*8,x=ax+ox*off,y=ay+oy*off;if(bpathDist(x,y)<BW_OFF+6||x-BWX<20)continue;
    P.push({t:'tree',img:SB[Math.floor(BH_(i,23)*SB.length)],x,y:y+4,w:38+BH_(i,24)*26,flip:BH_(i,25)<.5,base:.9});}
  /* hydrangeas and the odd small evergreen lining both edges of the side path up to the grove, all the way off the top of the map */
  for(let j=0,uy=BENTRY.y-70;uy>-220;uy-=92,j++)for(const sd of [-1,1]){const r=BH_(j*2+(sd>0),41),x=X(BENTRY.x+sd*(112+BH_(j*2+(sd>0),42)*24)),y=Y(uy+(BH_(j*2+(sd>0),43)-.5)*30);
    if(r<.78){const [img,w]=HY[Math.floor(BH_(j*2+(sd>0),44)*3)];P.push({t:'tree',img,x,y,w:w*(.5+BH_(j*2+(sd>0),45)*.2),flip:sd>0,base:.97});}
    else{const [img,w]=HTREES[Math.floor(BH_(j*2+(sd>0),46)*HTREES.length)];P.push({t:'tree',img,x:x+sd*40,y,w:w*.6,flip:sd<0,base:.95});}}
  /* sea stacks out in the bays and the open sea */
  for(const [sx,sy,img,w] of [[300,1900,'crockspire',300],[1150,2550,'crockheap',260],[2100,2700,'crockspire',340],[3350,2300,'crockheap',300],[3750,1500,'crockspire',280],[3200,1200,'crockpile',200],[700,2700,'crockpile',220],[2700,2550,'crockegg',150]].map(([a,b,c,d])=>[a,b,c,d]))
    if(!inPoly(sx,sy,BLAND)&&bpathDist(X(sx),Y(sy))>330)P.push({t:'tree',img,x:X(sx),y:Y(sy),w,flip:sx%2<1,base:.9});
  /* more boulders scattered through the water, clear of the surf line */
  const WR=[['crockegg',90],['crockpile',130],['crockheap',150],['crockspire',190]],placed=[];for(let k=0;k<160&&placed.length<34;k++){const sx=BH_(k,31)*BWW,sy=BH_(k,32)*BWH;
    if(inPoly(sx,sy,BLAND)||bpathDist(X(sx),Y(sy))<BW_OFF+380||placed.some(([a,b])=>Math.hypot(a-sx,b-sy)<260))continue;placed.push([sx,sy]);const [img,w]=WR[Math.floor(BH_(k,33)*WR.length)];
    P.push({t:'tree',img,x:X(sx),y:Y(sy),w:w*(.6+BH_(k,34)*.6),flip:BH_(k,35)<.5,base:.9});}
  /* three ruined archways in a line just above the west end of the path: scenery only, Lum can't reach them */
  const ay=Math.min(...BARCHES.map(([ax])=>{let y=BPATH_PTS.reduce((b,p)=>Math.abs(p[0]-X(ax))<Math.abs(b[0]-X(ax))?p:b)[1];while(bpathDist(X(ax),y)<88)y-=4;return y;}));   /* one shared line */
  for(const [ax,w,fl] of BARCHES)P.push({t:'tree',img:'ruins_arch',x:X(ax),y:ay,w,flip:fl,base:.97});}
/* ground: the sea everywhere off the land, the cliff edge bent along the path's south side, then the path */
function drawBWGround(x0,y0,x1,y1){if(x1<BWX-300)return;if(!BPATHP)BPATHP=buildPath(BPATH_CTRL,162,5.3);
  ctx.save();ctx.translate(BWX,BWY);
  ctx.beginPath();ctx.rect(-400,-400,BWW+800,BWH+800);BLAND.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
  ctx.fillStyle=waterPattern(ctx,'water_tile',.6)||'#2f5f78';ctx.fill('evenodd');   /* the designer's water art */
  ctx.restore();
  ctx.save();ctx.strokeStyle='#5d4a35';ctx.lineWidth=2*(BW_OFF+14);ctx.lineJoin=ctx.lineCap='round';ctx.beginPath();BPATH_PTS.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();   /* earth under the path and the cliff's soft top edge, so no sea shows through */
  drawBWCliff(x0,y0,x1,y1);
  if(!BSPURP)BSPURP=buildPath([[BWX+BENTRY.x,BWY+BENTRY.y+50],[BWX+BENTRY.x+6,BWY+BENTRY.y-BSPUR*.5],[BWX+BENTRY.x-8,BWY+BENTRY.y-BSPUR-260],[BWX+BENTRY.x+4,BWY-400]],100,7.1);drawPath(BSPURP,x0,x1);
  drawPath(BPATHP,x0,x1);}
/* the designer's cliff strip, laid slice by slice along the outer edge of the path (grass on the path side, surf on the sea side) */
function drawBWCliff(x0,y0,x1,y1){const im=IMG.cliff_edge;if(!ready(im))return;const BAND=300,k=BAND/im.naturalHeight,iw=im.naturalWidth,OFF=BW_OFF;let u=0;
  for(let i=0;i<BPATH_PTS.length-1;i++){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,ox=-dy/L,oy=dx/L;   /* outward, toward the sea */
    if(Math.max(ax,bx)+BAND<x0||Math.min(ax,bx)-BAND>x1||Math.max(ay,by)+BAND<y0||Math.min(ay,by)-BAND>y1){u=(u+L/k)%iw;continue;}
    const nx2=i+2<BPATH_PTS.length?BPATH_PTS[i+2][0]-bx:dx,ny2=i+2<BPATH_PTS.length?BPATH_PTS[i+2][1]-by:dy,turn=Math.abs(Math.atan2(dx*ny2-dy*nx2,dx*nx2+dy*ny2)),ext=3+BAND*turn*1.1;   /* the strip fans out round bends: overlap the slices so no gaps open */
    let left=(L+ext)/k,du=-ext/2/k;u=(u-ext/2/k+iw*4)%iw;ctx.save();ctx.translate(ax+ox*OFF,ay+oy*OFF);ctx.transform(dx/L,dy/L,ox,oy,0,0);
    while(left>0){const sw=Math.min(left,iw-u);ctx.drawImage(im,u,0,sw,im.naturalHeight,du*k,0,sw*k,BAND);du+=sw;left-=sw;u=(u+sw)%iw;}
    u=(u-ext/2/k+iw*4)%iw;ctx.restore();}}
function enterBreezeway(){SCENE='thorn';lum.x=BWX+BENTRY.x;lum.y=BWY+BENTRY.y-BSPUR+50;   /* at the top of the side path, just below the door */
  lum.face=1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BWT.t=0;}
function drawBWTitle(){if(!inBW()||BWT.t>=4.5||SCENE!=='thorn')return;BWT.t+=1/60;const a=Math.min(1,BWT.t*1.5,(4.5-BWT.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(20,16,12,.55)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f6ecd8';ctx.font=`600 ${Math.round(Math.min(30,W/13))}px Georgia,serif`;ctx.fillText('Coastal Breezeway',W/2,H*.3+10);ctx.restore();}
/* the way back up to Evergreen Grove and the road on to Breezevale Cove (east; map still to come). The archways are scenery only */
THINT.push({get x(){return BWX+BENTRY.x;},get y(){return BWY+BENTRY.y-BSPUR;},get reach(){return inBW()?80:-1;},door:true,onInteract:()=>goScene(()=>enterGrove(true))},
  {get x(){return BWX+BWW-70;},get y(){return BWY+BEAST.y;},get reach(){return inBW()?80:-1;},door:true,onInteract:()=>say("Breezevale Cove lies ahead.")});
/* the same foes as Evergreen Grove, out along the path */
function addBWFoes(){if(THFOES.some(g=>g.bw))return;let id=5200;const dead=new Set(C1.thDead||[]),n=BPATH_PTS.length;
  for(const [f,kind,pack] of [[.07,'gwisp',1],[.16,'ffox',1],[.27,'nymph',1],[.36,'ffox',2],[.47,'gwisp',2],[.58,'ffox',1],[.67,'nymph',1],[.76,'gwisp',1],[.86,'ffox',2],[.94,'gwisp',1]]){
    const [x,y]=BPATH_PTS[Math.floor(f*n)],myid=id++;if(dead.has(myid)||Math.hypot(x-BWX-BENTRY.x,y-BWY-BENTRY.y)<400)continue;
    THFOES.push({kind,bw:1,scene:'thorn',x,y,hx:x,hy:y,tx:x,ty:y,cx:x-TCW/2,cy:y-TCH/2,s:1,pack,calm:1,dead:0,t:rnd(0,4),ph:rnd(0,TAU),face:-1,id:myid,bl:0});}}
/* splashes where the sea meets the white surf at the foot of the cliff, and white seabirds (the prologue's bluebirds, whitened) */
let BWSURF=null;const BWSPL=[],SEAB=[],SEAB_IMG={};
function bwSurfPts(){const out=[],D=BW_OFF+276;for(let i=0;i<BPATH_PTS.length-1;i+=2){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,x=ax-dy/L*D,y=ay+dx/L*D;
  if(bpathDist(x,y)>D-12&&!inPoly(x-BWX,y-BWY,BLAND))out.push([x,y]);}return out;}
function seabirdImg(idx){if(SEAB_IMG[idx])return SEAB_IMG[idx];const im=IMG['bird'+idx];if(!ready(im))return null;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){const v=(p[i]*.3+p[i+1]*.59+p[i+2]*.11)/255,o=255-(1-v)*150;p[i]=o-6;p[i+1]=o-2;p[i+2]=o;}g.putImageData(d,0,0);}catch(e){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(248,250,252,.8)';g.fillRect(0,0,c.width,c.height);}
  return SEAB_IMG[idx]=c;}
function drawBWFx(){if(!inBW()||SCENE!=='thorn')return;const dt=1/60,vw=W/zoom,vh=H/zoom,x0=cam.x-vw/2-40,x1=cam.x+vw/2+40,y0=cam.y-vh/2-40,y1=cam.y+vh/2+40;
  if(!BWSURF)BWSURF=bwSurfPts();
  for(const [x,y] of BWSURF){if(x<x0||x>x1||y<y0||y>y1||Math.random()>.01)continue;const sx=x+rnd(-14,14),sy=y+rnd(-6,6),n=3+(Math.random()*4|0);   /* a little burst of spray and a foam ring */
    BWSPL.push({k:'ring',x:sx,y:sy,t:0,life:1.1});for(let j=0;j<n;j++)BWSPL.push({k:'drop',x:sx+rnd(-6,6),y:sy,z:0,vx:rnd(-55,55),vz:rnd(130,210),t:0,life:rnd(.7,1.05),r:rnd(3.2,5.4)});}
  ctx.save();for(let i=BWSPL.length-1;i>=0;i--){const p=BWSPL[i];p.t+=dt;if(p.t>=p.life){BWSPL.splice(i,1);continue;}const q=p.t/p.life;
    if(p.k==='ring'){drawGlow(ctx,p.x,p.y-10,40+30*q,'235,245,250',.45*(1-q));ctx.strokeStyle=`rgba(240,248,252,${(.7*(1-q)).toFixed(3)})`;ctx.lineWidth=3.4;ctx.beginPath();ctx.ellipse(p.x,p.y,16+40*q,(16+40*q)*.38,0,0,TAU);ctx.stroke();}
    else{p.x+=p.vx*dt;p.vz-=330*dt;p.z+=p.vz*dt;if(p.z<0)p.z=0;ctx.fillStyle=`rgba(245,250,255,${(.85*(1-q*q)).toFixed(3)})`;ctx.beginPath();ctx.arc(p.x,p.y-p.z,p.r,0,TAU);ctx.fill();}}ctx.restore();
  /* a few white seabirds drifting over the coast */
  if(!SEAB.length)for(let i=0;i<3;i++)SEAB.push({alive:false,t:-rnd(0,5),s:rnd(.46,.56),ph:rnd(0,TAU),flap:0,bank:0});
  for(const b of SEAB){if(!b.alive){b.t+=dt;if(b.t>0){const left=Math.random()<.5;b.x=cam.x+(left?-1:1)*(vw/2+60);b.y=cam.y-vh*.45+Math.random()*vh*.7;b.vx=(left?1:-1)*rnd(85,125);b.alive=true;b.t=0;b.spr=BIRD_SPR[(Math.random()*BIRD_SPR.length)|0];}continue;}
    b.t+=dt;const climb=Math.sin(b.t*1.3+b.ph);b.vy=-climb*14;b.x+=b.vx*dt;b.y+=b.vy*dt;b.flap+=dt*(climb>-.2?8:2);b.bank+=((-b.vy/b.vx)*(b.vx>0?1:-1)*.9-b.bank)*Math.min(1,dt*3);
    if(Math.abs(b.x-cam.x)>vw/2+160){b.alive=false;b.t=-rnd(3,9);continue;}
    const [idx,native]=b.spr,im=seabirdImg(idx);if(!im)continue;const w=im.width*b.s,h=im.height*b.s,beat=Math.sin(b.flap),dir=b.vx>0?1:-1;
    ctx.save();ctx.translate(b.x,b.y+beat*1.5);ctx.rotate(b.bank*.25*dir);if(dir!==native)ctx.scale(-1,1);ctx.scale(1,.86+.14*beat);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();
    ctx.fillStyle='rgba(20,40,50,.08)';ctx.beginPath();ctx.ellipse(b.x,b.y+110,w*.3,w*.1,0,0,TAU);ctx.fill();}}
