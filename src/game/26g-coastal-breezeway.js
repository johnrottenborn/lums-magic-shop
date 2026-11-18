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
const BARCHES=[[135,250,false,'crown'],[375,250,true,'pillars'],[615,250,false,'left']],BARCH_X1=780;   /* x, width, flipped, how it has crumbled */
/* the secret way to the old ruins: once Jak has shown Lum (C2.ruinWay), she can walk straight north through the first archway's opening to a sunken entrance hidden in the trees */
const BRUIN={x:151,ay:0,ey:0};
/* the ruined archways: each is the designer's arch art clipped to what still stands (u,v across the image, 0..1), with fallen chunks of it lying about */
const RUIN_CUT={crown:[[0,1],[0,0],[.44,0],[.48,.1],[.53,.16],[.57,.24],[.63,.2],[.67,.29],[.73,.22],[.79,.33],[.86,.27],[.92,.36],[1,.33],[1,1]],
  pillars:[[0,1],[0,.47],[.07,.42],[.12,.35],[.19,.38],[.25,.31],[.31,.36],[.36,.44],[.39,.52],[.42,1],[.6,1],[.62,.6],[.66,.52],[.72,.47],[.78,.5],[.84,.42],[.9,.46],[.95,.4],[1,.47],[1,1]],
  left:[[0,1],[0,.55],[.06,.5],[.11,.43],[.17,.46],[.22,.38],[.29,.41],[.34,.48],[.39,.56],[.42,1]]};
/* fallen chunks: [source u0,v0,u1,v1, x offset and y offset (fractions of the arch width), turn, size] */
const RUIN_RUBBLE={crown:[[.6,.05,.8,.22,.55,.06,.4,.55],[.82,.12,.96,.3,.72,.1,-.9,.45]],
  pillars:[[.3,.04,.58,.2,.05,.1,.25,.6],[.62,.08,.8,.26,-.42,.14,-1.2,.42],[.78,.2,.95,.4,.5,.12,1.4,.42]],
  left:[[.62,.3,.95,.55,.42,.08,1.5,.6],[.5,.05,.75,.22,.78,.14,-.5,.48],[.75,.55,.95,.75,.25,.16,.9,.36]]};
function drawRuinArch(o){const im=IMG.ruins_arch;if(!ready(im))return;const w=o.w,h=w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.translate(o.x,o.y);if(o.flip)ctx.scale(-1,1);
  const P=RUIN_CUT[o.cut];if(P){ctx.beginPath();P.forEach(([u,v],i)=>{const x=-w/2+u*w,y=-h*.97+v*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.clip();}
  ctx.drawImage(im,-w/2,-h*.97,w,h);ctx.restore();}
function drawRuinRubble(o){const im=IMG.ruins_arch;if(!ready(im))return;const [u0,v0,u1,v1]=o.src,iw=im.naturalWidth,ih=im.naturalHeight,sw=(u1-u0)*iw,sh=(v1-v0)*ih,k=o.w/sw;
  ctx.save();ctx.translate(o.x,o.y);ctx.fillStyle='rgba(20,30,15,.28)';ctx.beginPath();ctx.ellipse(0,0,o.w*.55,o.w*.16,0,0,TAU);ctx.fill();ctx.rotate(o.rot);if(o.flip)ctx.scale(-1,1);ctx.drawImage(im,u0*iw,v0*ih,sw,sh,-sw*k/2,-sh*k*.8,sw*k,sh*k);ctx.restore();}
const BW_OFF=66,BSPUR=300;   /* a short side path north from the hump up to the door back to Evergreen Grove */
const bspurDist=(x,y)=>{const lx=x-BWX-BENTRY.x,ly=y-BWY;return Math.hypot(lx,ly<BENTRY.y-BSPUR?ly-(BENTRY.y-BSPUR):ly>BENTRY.y?ly-BENTRY.y:0);};
const bwClear=(lx,ly,m)=>Math.abs(lx-BENTRY.x)<m&&ly<BENTRY.y+30;   /* nothing grows on the way up to the grove (trees and flowers line its edges) */   /* path centre to the top of the cliff strip */
const inBW=()=>lum.x>BWX-300&&lum.x<BWX+5000;   /* (Breezevale Cove lies further east) */
/* sharp bends in the path: the cliff strip fans out or folds there and leaves a seam, so a big rock formation covers each one */
const BBENDS=[];{const P=BPATH_PTS,n=P.length,c=[];for(let i=10;i<n-10;i++){const [ax,ay]=P[i-10],[bx,by]=P[i],[cx,cy]=P[i+10];let t=Math.atan2(cy-by,cx-bx)-Math.atan2(by-ay,bx-ax);while(t>Math.PI)t-=TAU;while(t<-Math.PI)t+=TAU;if(Math.abs(t)>.38)c.push([Math.abs(t),i]);}
  c.sort((a,b)=>b[0]-a[0]);for(const [,i] of c){const [bx,by]=P[i],[ax,ay]=P[i-4],[cx,cy]=P[i+4],dx=cx-ax,dy=cy-ay,L=Math.hypot(dx,dy)||1;if(bx-BWX<120||BBENDS.some(q=>Math.hypot(q[0]-bx,q[1]-by)<330))continue;BBENDS.push([bx,by,-dy/L,dx/L,BBENDS.length]);}}
const BH_=(a,b)=>hash(a,b,5153);
function bpathDist(x,y){let best=1e9;for(let i=0;i<BPATH_PTS.length-1;i++){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);best=Math.min(best,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return best;}
/* the path only, from the west edge of the view to the east edge */
function bwFree(x,y){const lx=x-BWX;if(lx<24||lx>BWW-20)return false;return bpathDist(x,y)<78||bspurDist(x,y)<44||(typeof C2!=='undefined'&&C2.ruinWay&&Math.abs(lx-BRUIN.x)<26&&y-BWY>BRUIN.ey+8&&y-BWY<BRUIN.ay+40);}
function bwRuinY(){if(BRUIN.ay)return;BRUIN.ay=Math.min(...BARCHES.map(([ax])=>{let y=BPATH_PTS.reduce((b,p)=>Math.abs(p[0]-BWX-ax)<Math.abs(b[0]-BWX-ax)?p:b)[1];while(bpathDist(BWX+ax,y)<88)y-=4;return y-BWY;}));BRUIN.ey=BRUIN.ay-560;}
/* evergreens filling the land, hydrangeas along the path's north side, rocks along the path and sea stacks out in the water */
function bwProps(P){const X=x=>x+BWX,Y=y=>y+BWY;let k=0;bwRuinY();
  P.push({t:'tree',img:'ruins_entrance',x:X(BRUIN.x+76),y:Y(BRUIN.ey),w:420,flip:true,base:.95});
  for(let r=0;r<6;r++)for(let c=0;c<9;c++){const k=r*9+c,x=BRUIN.x-170+c*58+(BH_(k,80)-.5)*30,y=BRUIN.ey-230+r*52+(BH_(k,81)-.5)*20,lane=Math.abs(x-BRUIN.x)<70&&r>=2;   /* grass and shrubs hiding the sunken entrance; the ones in the secret lane part once Jak shows it */
    P.push({t:'tree',img:'shrub'+Math.floor(BH_(k,82)*12),x:X(x),y:Y(y),w:120+BH_(k,83)*70,flip:BH_(k,84)<.5,base:.92,hideOpen:lane?1:0,sy:Y(BRUIN.ey)+2+r*52});
    if(BH_(k,85)<.7)P.push({t:'tuft',w:40,x:X(x+(BH_(k,86)-.5)*40),y:Y(y+18),n:6+Math.floor(BH_(k,87)*4),h:30+BH_(k,88)*20,hue:.35,hideOpen:lane?1:0,sy:Y(BRUIN.ey)+3+r*52});}   /* the designer's sunken entrance (mirrored so it stays on the map), its tunnel mouth at the top of the secret way */
  for(let gy=-140;gy<BWH;gy+=92)for(let gx=-60;gx<BWW+80;gx+=100){k++;const lx=gx+(BH_(k,1)-.5)*56,ly=gy+(BH_(k,2)-.5)*44;
    if(!inPoly(lx,ly,BLAND)||BH_(k,3)<.2||bwClear(lx,ly,150)||(Math.abs(lx-BRUIN.x)<105&&ly<BRUIN.ay&&ly>BRUIN.ey-40)||(Math.abs(lx-BRUIN.x-76)<250&&ly>BRUIN.ey-120&&ly<BRUIN.ey+300))continue;let clear=true;for(let up=0;up<=380&&clear;up+=38)if(bpathDist(X(lx),Y(ly-up))<(up?150:190))clear=false;if(!clear)continue;   /* the path stays in view */
    const [img,w]=HTREES[Math.floor(BH_(k,4)*HTREES.length)];P.push({t:'tree',img,x:X(lx),y:Y(ly),w:w*(.72+BH_(k,5)*.32),flip:BH_(k,6)<.5,base:.95});}
  /* hydrangeas and boulders on the land side of the path */
  const HY=[['hydrsmall',120],['hydrmid',150],['hydrbig',175],['hydrtree',250]],RK=[['crockpile',110],['crockegg',70],['crockheap',120]];
  for(let i=6;i<BPATH_PTS.length-4;i+=7){const [ax,ay]=BPATH_PTS[i],[bx,by]=BPATH_PTS[i+1],dx=bx-ax,dy=by-ay,d=Math.hypot(dx,dy)||1,nx=dy/d,ny=-dx/d;   /* the land side (left of the way east) */
    const r=BH_(i,11),off=120+BH_(i,12)*40,x=ax+nx*off,y=ay+ny*off;if(bpathDist(x,y)<112||!inPoly(x-BWX,y-BWY,BLAND)||x-BWX<BARCH_X1||bwClear(x-BWX,y-BWY,190))continue;   /* keep clear of the ruined archways */
    if(r<.62){const [img,w]=HY[Math.floor(BH_(i,13)*(r<.1?4:3))];P.push({t:'tree',img,x,y:y+8,w:w*(.85+BH_(i,14)*.3),flip:BH_(i,15)<.5,base:.97});}
    else if(r<.82){const [img,w]=RK[Math.floor(BH_(i,16)*RK.length)];P.push({t:'tree',img,x,y:y+6,w:w*(.85+BH_(i,17)*.3),flip:BH_(i,18)<.5,base:.95});}}
  /* big rock formations over the cliff at the sharp bends (one over the cliff face, one down in the surf); Lum walks behind them */
  const offPath=(x,y,w)=>{for(let k=0;k<120;k++){let near=null,nd=1e9;for(const fx of [-.42,-.2,0,.2,.42])for(const fy of [0,.28,.5,.72,.9]){const px=x+fx*w*(1-fy*.5),py=y-fy*w;for(const [ax,ay] of BPATH_PTS){const d=Math.hypot(ax-px,ay-py);if(d<nd){nd=d;near=[ax,ay,px,py];}}}   /* its base and lower body, across its width */
      if(nd>BW_OFF+30)break;const dx=near[2]-near[0],dy=near[3]-near[1],L=Math.hypot(dx,dy)||1;x+=dx/L*14;y+=dy/L*14;}return [x,y];};   /* nudge a rock's base off the path so it never blocks the way */
  /* the first bend: a heap of boulders down the cliff face between the path and its big formation, hiding the strip's seam */
  {const [bx,by]=BBENDS[0],RK=['crockpile','crockheap','crockegg','crockpile'];let q=0;for(let i=2;i<BPATH_PTS.length-2;i+=3){const [ax,ay]=BPATH_PTS[i];if(Math.hypot(ax-bx,ay-by)>480)continue;const [cx,cy]=BPATH_PTS[i+1],dx=cx-ax,dy=cy-ay,L=Math.hypot(dx,dy)||1,ox=-dy/L,oy=dx/L;
    for(const off of [BW_OFF+62,BW_OFF+150]){q++;const x=ax+ox*off+(BH_(q,51)-.5)*30,y=ay+oy*off+(BH_(q,52)-.5)*20,w=(off<BW_OFF+100?95:140)*(.85+BH_(q,53)*.35);if(bpathDist(x,y)<BW_OFF+30||bpathDist(x,y-w*.35)<BW_OFF+10)continue;
      P.push({t:'tree',img:RK[q%4],x,y,w,flip:BH_(q,54)<.5,base:.9,solid:1});}}}
  for(const [x,y,ox,oy,i] of BBENDS){const w=[330,320,280][i%3]*(.95+BH_(i,31)*.25),o1=BW_OFF+150,o2=BW_OFF+290;
    {const sx=i===0?230:0;const [px,py]=offPath(x+ox*o1+sx,y+oy*o1+110,w*1.35);   /* the first bend's big formation sits further right, clear of the path that wraps round it */P.push({t:'tree',img:['crockspire','crockheap','crockpile'][i%3],x:px,y:py,w:w*1.35,flip:BH_(i,32)<.5,base:.9,solid:1});}
    {const [px,py]=offPath(x+ox*o2+(BH_(i,33)-.5)*60+(i===0?200:0),y+oy*o2+150,w*.95);P.push({t:'tree',img:['crockheap','crockpile','crockspire'][i%3],x:px,y:py,w:w*.95,flip:BH_(i,34)<.5,base:.9,solid:1});}}
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
  for(const [ax,w,fl,cut] of BARCHES){P.push({t:'ruin',x:X(ax),y:ay,w,flip:fl,cut});
    for(const [u0,v0,u1,v1,dx,dy,rot,sz] of RUIN_RUBBLE[cut]||[])P.push({t:'rubble',src:[u0,v0,u1,v1],x:X(ax)+dx*w*(fl?-1:1),y:ay-8+dy*w*.3,w:w*sz*.55,rot,flip:fl});}}
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
  {get x(){return BWX+BWW-70;},get y(){return BWY+BEAST.y;},get reach(){return inBW()?80:-1;},door:true,onInteract:()=>goScene(enterBreezevale)});
/* the west end of the path leads out to the Ruins Overlook (room 24) and back */
const bwWestY=()=>BPATH_PTS.reduce((b,p)=>Math.abs(p[0]-BWX-50)<Math.abs(b[0]-BWX-50)?p:b)[1];
THINT.push({get x(){return BWX+46;},get y(){return bwWestY()-20;},get reach(){return inBW()&&lum.x<BWX+220?80:-1;},door:true,onInteract:()=>dunGo(24,806,705,1)});
function leaveOverlook(){SCENE='thorn';lum.x=BWX+150;lum.y=bwWestY();lum.face=1;lum.dir='side';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BWT.t=99;}
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
function drawBWFx(){if(!inBW()||SCENE!=='thorn')return;bwRuinY();if(typeof jak2In==='function'&&jak2In()&&!C2.ruinWay&&!DLG.active&&!FADE.dir&&!WEVENT.on&&Math.abs(lum.x-BWX-BRUIN.x)<70&&lum.y-BWY>BRUIN.ay){C2.ruinWay=1;lum.vx=lum.vy=0;lum.state='idle';talk([['Jak',"As promised… the secret way is through that old stone archway."]],false,()=>hsGoal('Take the secret way north through the old stone archway'));}   /* Jak stops Lum by the first archway */const dt=1/60,vw=W/zoom,vh=H/zoom,x0=cam.x-vw/2-40,x1=cam.x+vw/2+40,y0=cam.y-vh/2-40,y1=cam.y+vh/2+40;
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

/* the Ruins Overlook (room 24): drifting sea mist, gulls wheeling over the water, and its own eerie music (05-audio) */
const OVL={gulls:[],cry:4};
function drawOverlookMist(front){const dt=1/60;ctx.save();
  if(!front){
    for(let i=0;i<9;i++){const sp=6+hash(i,1,611)*10,x=((hash(i,2,611)*1700+T*sp)%1900)-260,y=330+hash(i,3,611)*230,r=150+hash(i,4,611)*170;   /* banks rolling slowly across the sea */
      ctx.globalAlpha=.32+.14*Math.sin(T*.3+i);drawGlow(ctx,x,y,r,'232,236,240',.55);drawGlow(ctx,x+r*.6,y+12,r*.7,'226,232,238',.45);}
    /* gulls, white against the mist, wheeling slowly and crying now and then */
    if(!OVL.gulls.length)for(let i=0;i<4;i++)OVL.gulls.push({cx:200+i*320,cy:230+hash(i,5,611)*140,rx:120+hash(i,6,611)*160,ry:28+hash(i,7,611)*30,w:.18+hash(i,8,611)*.16,ph:hash(i,9,611)*TAU,s:.32+hash(i,10,611)*.14,spr:BIRD_SPR[i%BIRD_SPR.length],flap:0});
    for(const g of OVL.gulls){g.ph+=g.w*dt;g.flap+=dt*(Math.sin(g.ph*3)>0?7:1.5);const x=g.cx+Math.cos(g.ph)*g.rx,y=g.cy+Math.sin(g.ph)*g.ry,dir=-Math.sin(g.ph)>0?1:-1,[idx,native]=g.spr,im=seabirdImg(idx);if(!im)continue;
      const w=im.width*g.s,h=im.height*g.s,beat=Math.sin(g.flap);ctx.save();ctx.globalAlpha=.9;ctx.translate(x,y+beat);ctx.rotate(Math.sin(g.ph)*.18*dir);if(dir!==native)ctx.scale(-1,1);ctx.scale(1,.85+.15*beat);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
    OVL.cry-=dt;if(OVL.cry<=0){OVL.cry=5+Math.random()*9;try{sfxGull();}catch(e){}}}
  else for(let i=0;i<6;i++){const sp=10+hash(i,11,611)*14,x=((hash(i,12,611)*1600+T*sp)%1800)-200,y=560+hash(i,13,611)*200,r=110+hash(i,14,611)*120;   /* thin wisps drifting over the lookout, in front of Lum */
    ctx.globalAlpha=.16+.08*Math.sin(T*.4+i*2);drawGlow(ctx,x,y,r,'236,240,244',.5);}
  ctx.restore();}

THINT.push({get x(){return BWX+BRUIN.x;},get y(){return BWY+BRUIN.ey+12;},get reach(){return inBW()&&typeof C2!=='undefined'&&C2.ruinWay?75:-1;},door:true,onInteract:()=>dunGo(32,340,590,1)});   /* the way down into the underground ruins */
function leaveRuins(){SCENE='thorn';lum.x=BWX+BRUIN.x;lum.y=BWY+BRUIN.ey+34;lum.face=1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BWT.t=99;}   /* back up the steps to the sunken entrance */

/* underground ruins room 6: the old explorer's skeleton holds the Serpentskin Pouch; trying to leave wakes the Wraith Lord */
const RL6={t:-1,x:735,y:640};
/* the old explorer's skeleton: touching it wakes the Wraith Lord over the pool; beat it to take the Serpentskin Pouch; lose and Lum wakes at the room's way in */
function ruinsSkeleton(){if(C2.serpentPouch){say("An old explorer… they never made it out.");return;}
  if(C2.wraithBeat){C2.serpentPouch=1;sfxPage&&sfxPage(.8);giveItem('serpentpouch');return;}
  if(RL6.t>=0)return;RL6.t=0;WEVENT.on=true;lum.vx=lum.vy=0;lum.state='idle';try{sfxGhost();sfxEerie&&sfxEerie();}catch(e){}
  setTimeout(()=>talk([['???',"Leaving so soon…?"]],false,()=>{WEVENT.on=false;startEncounter({kind:'glord',scene:'dun',x:RL6.x,y:RL6.y,face:-1,s:1,pack:1,calm:0,boss:1,noFlee:1,
    onWin:()=>{C2.wraithBeat=1;RL6.t=-1;setTimeout(()=>talk([['Lum',"It's gone… The air feels lighter already."]],false,()=>{C2.serpentPouch=1;sfxPage&&sfxPage(.8);giveItem('serpentpouch');}),900);},
    onLose:()=>{RL6.t=-1;ch2Respawn();}},'normal');}),1500);}
function ruinsLeave6(){dunGo(36,690,532,1);}   /* the only way out */
function drawRL6(){if(RL6.t<0||SCENE!=='dun'||DUN.room!==37||(BATTLE.on&&!CAPTURE.on))return;RL6.t+=1/60;const im=IMG.ghost_lord;if(!ready(im))return;const u=Math.min(1,RL6.t/1.4),h=470,w=h*im.width/im.height,y=RL6.y+Math.sin(RL6.t*1.3)*8;   /* it materialises out of the dark over the pool */
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,RL6.x,y-h*.5,h*.55,'190,200,255',.18*u);ctx.restore();ctx.save();ctx.globalAlpha=.72*u*u;ctx.drawImage(im,RL6.x-w*.55,y-h,w,h);ctx.restore();}
