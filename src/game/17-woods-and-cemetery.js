/* =====================================================================
   THE WOODS BEYOND THE GARDEN: a winding dirt road to a stone circle and a cemetery
   ===================================================================== */
/* soft, winding dirt paths: a Catmull-Rom spline with ragged edges, wheel ruts, stones and grass tufts */
function splinePts(P,step=24){const out=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];const n=Math.max(2,Math.round(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/step));
  for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([0,1].map(j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}out.push(P[P.length-1].slice());return out;}
function buildPath(P,w0,seed,taper){const pts=splinePts(P,18),L=[],R=[],ruts=[[],[]],cen=[];let s=0;
  for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],[x,y]=pts[i];let nx=-(b[1]-a[1]),ny=b[0]-a[0];const d=Math.hypot(nx,ny)||1;nx/=d;ny/=d;if(i)s+=Math.hypot(x-pts[i-1][0],y-pts[i-1][1]);
    const w=w0*(1+.16*Math.sin(s*.011+seed)+.08*Math.sin(s*.037+seed*2))*(taper?Math.min(1,.12+.88*(s/taper)**.7):1);const jl=(hash(i,1,seed)-.5)*w*.16,jr=(hash(i,2,seed)-.5)*w*.16;
    L.push([x+nx*(w/2+jl),y+ny*(w/2+jl)*.85]);R.push([x-nx*(w/2+jr),y-ny*(w/2+jr)*.85]);cen.push([x,y,nx,ny,w]);
    const wob=Math.sin(s*.02+seed)*4;ruts[0].push([x+nx*(w*.2+wob),y+ny*(w*.2+wob)*.85]);ruts[1].push([x-nx*(w*.2-wob),y-ny*(w*.2-wob)*.85]);}
  const stones=[],tufts=[];for(let i=0;i<cen.length;i+=1){const [x,y,nx,ny,w]=cen[i];
    if(hash(i,3,seed)<.55){const o=(hash(i,4,seed)-.5)*w*.85;stones.push([x+nx*o,y+ny*o*.85,1.5+hash(i,5,seed)*3.2,hash(i,6,seed)]);}
    for(const sd of [-1,1])if(hash(i,7+sd,seed)<.6){const o=sd*(w/2+(hash(i,9+sd,seed)-.6)*14);tufts.push([x+nx*o,y+ny*o*.85,6+hash(i,11+sd,seed)*8,hash(i,13+sd,seed)]);}}
  return {pts,L,R,ruts,stones,tufts};}
function polyPath(c,A,B){c.beginPath();A.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0],B[i][1]);c.closePath();}
/* dirt paths are painted from the designer's dirt art (dirt_patches: feathered pieces cut from it), baked once per path into an image:
   a soft worn edge, a feathered dirt base, then overlapping dirt pieces only where the base is (so the edges stay soft). Grass tufts are drawn live on top. */
function bakePath(P){const im=IMG.dirt_patches;if(!ready(im))return null;const SC=1.4,pad=60;let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;for(const [x,y] of P.L.concat(P.R)){bx0=Math.min(bx0,x);by0=Math.min(by0,y);bx1=Math.max(bx1,x);by1=Math.max(by1,y);}
  bx0-=pad;by0-=pad;bx1+=pad;by1+=pad;const cv_=document.createElement('canvas');cv_.width=Math.ceil((bx1-bx0)*SC);cv_.height=Math.ceil((by1-by0)*SC);const c=cv_.getContext('2d');c.setTransform(SC,0,0,SC,-bx0*SC,-by0*SC);
  c.save();c.filter='blur(12px)';polyPath(c,P.L,P.R);c.fillStyle='rgba(70,52,30,.32)';c.fill();c.restore();
  c.save();c.filter='blur(4px)';polyPath(c,P.L,P.R);c.fillStyle='#8a6a48';c.fill();c.restore();
  c.save();c.globalCompositeOperation='source-atop';const n=im.naturalWidth/im.naturalHeight|0,ps=im.naturalHeight,use=5;let acc=99,k=0;
  for(let i=1;i<P.pts.length;i++){acc+=Math.hypot(P.pts[i][0]-P.pts[i-1][0],P.pts[i][1]-P.pts[i-1][1]);if(acc<46)continue;acc=0;const [x,y]=P.pts[i],a=P.pts[Math.max(0,i-1)],b=P.pts[Math.min(P.pts.length-1,i+1)];
    let nx=-(b[1]-a[1]),ny=b[0]-a[0];const d=Math.hypot(nx,ny)||1;nx/=d;ny/=d;const w=Math.hypot(P.L[i][0]-P.R[i][0],P.L[i][1]-P.R[i][1]);
    for(const o of [-.28,0,.28]){k++;const j=Math.floor(hash(k,1,77)*use)%Math.max(1,Math.min(use,n)),sz=w*(.7+hash(k,2,77)*.35),px=x+nx*o*w+(hash(k,3,77)-.5)*14,py=y+ny*o*w*.85+(hash(k,4,77)-.5)*10;
      c.save();c.translate(px,py);c.rotate((hash(k,5,77)-.5)*.9);if(hash(k,6,77)<.5)c.scale(-1,1);c.drawImage(im,j*ps,0,ps,ps,-sz/2,-sz/2,sz,sz);c.restore();}}
  c.restore();return {c:cv_,x:bx0,y:by0,w:bx1-bx0,h:by1-by0};}
function drawPath(P,x0,x1){const c=ctx;
  if(P.bake===undefined||P.bake===null)P.bake=bakePath(P);
  if(P.bake){const B=P.bake;c.drawImage(B.c,B.x,B.y,B.w,B.h);
    c.save();c.strokeStyle='rgba(70,110,50,.9)';c.lineWidth=1.6;c.lineCap='round';for(const [x,y,h,v] of P.tufts){if(x<x0-20||x>x1+20)continue;const sw=Math.sin(T*1.5+x*.02)*1.5;c.beginPath();for(let k=-2;k<=2;k++){c.moveTo(x+k*2.2,y);c.quadraticCurveTo(x+k*3+sw,y-h*.6,x+k*4.5+sw*1.5,y-h*(1-Math.abs(k)*.15));}c.stroke();}c.restore();return;}
  // worn grass halo, then the dirt itself in two washes
  c.save();c.lineJoin='round';c.lineCap='round';
  polyPath(c,P.L,P.R);c.strokeStyle='rgba(78,64,40,.32)';c.lineWidth=26;c.stroke();c.fillStyle='#86684a';c.fill();
  c.clip();c.fillStyle='rgba(168,136,96,.35)';for(let i=0;i<P.pts.length;i+=3){const [x,y]=P.pts[i];if(x<x0-120||x>x1+120)continue;c.beginPath();c.ellipse(x+(hash(i,20,5)-.5)*30,y+(hash(i,21,5)-.5)*16,30+hash(i,22,5)*40,10+hash(i,23,5)*10,0,0,TAU);c.fill();}
  for(const r of P.ruts){c.strokeStyle='rgba(70,52,34,.42)';c.lineWidth=7;c.beginPath();r.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='rgba(190,160,120,.18)';c.lineWidth=2;c.stroke();}
  c.restore();
  // ink edge, broken up so it reads hand-drawn
  c.save();c.strokeStyle='rgba(50,38,24,.55)';c.lineWidth=1.6;for(const E of [P.L,P.R]){for(let i=0;i<E.length-1;i++){if(hash(i,30,E===P.L?1:2)<.28)continue;const [ax,ay]=E[i],[bx,by]=E[i+1];if(ax<x0-60||ax>x1+60)continue;c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();}}c.restore();
  for(const [x,y,r,h_] of P.stones){if(x<x0-20||x>x1+20)continue;c.fillStyle=h_<.5?'rgba(150,140,120,.85)':'rgba(110,96,76,.8)';c.beginPath();c.ellipse(x,y,r*1.3,r,0,0,TAU);c.fill();c.strokeStyle='rgba(40,30,20,.5)';c.lineWidth=.8;c.stroke();}
  c.strokeStyle='rgba(70,110,50,.9)';c.lineWidth=1.6;c.lineCap='round';for(const [x,y,h,v] of P.tufts){if(x<x0-20||x>x1+20)continue;const sw=Math.sin(T*1.5+x*.02)*1.5;c.beginPath();for(let k=-2;k<=2;k++){c.moveTo(x+k*2.2,y);c.quadraticCurveTo(x+k*3+sw,y-h*.6,x+k*4.5+sw*1.5,y-h*(1-Math.abs(k)*.15));}c.stroke();}}

const ROAD_CTRL=[[-80,640],[260,602],[540,668],[830,612],[1090,572],[1400,636],[1720,590],[2020,606],[2350,642],[2780,612]];
const ROAD=splinePts(ROAD_CTRL,30);
const GATE={x:2050,y:790,k:.5};const HUT={x:2050-280,y:790+215,k:.44};
const SPUR_CTRL=[[1996,612],[1984,676],[2026,738],[2040,800],[2046,862]];const SPUR=splinePts(SPUR_CTRL,16);
const WTOP=-520;const HOLLOW={x:1930,y:-190,s:.8,ix:330,iy:470};const CLEAR={x:1960,y:-110,rx:220,ry:95};
const CIRCLE={x:1400,y:630,r:250},CEM={x0:GATE.x-460,x1:GATE.x+460,y0:GATE.y+28,y1:GATE.y+490},WOODS_W=2700,WOODS_H=1580;
let ROADP=null,SPURP=null;
const WOBJ=[],WSTONES=[],WGRAVES=[],WINTS=[];let woodsBuilt=false;
const WEV={mid:0,circle:0,cem:0,back:0,end:0};
function roadDist(x,y){let best=1e9;for(let i=0;i<ROAD.length-1;i++){const [ax,ay]=ROAD[i],[bx,by]=ROAD[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1),d=Math.hypot(x-ax-dx*t,y-ay-dy*t);if(d<best)best=d;}return best;}
function spurDist(x,y){let best=1e9;for(let i=0;i<SPUR.length-1;i++){const [ax,ay]=SPUR[i],[bx,by]=SPUR[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1),d=Math.hypot(x-ax-dx*t,y-ay-dy*t);if(d<best)best=d;}return best;}
const hollowPathX=y=>1990+Math.sin((y-CLEAR.y)/(640-CLEAR.y)*Math.PI*2.2)*60;
function nearHollow(x,y){return (x>1700&&x<2320&&y>CLEAR.y-60&&y<560)||((x-CLEAR.x)/250)**2+((y-CLEAR.y)/120)**2<1||false&&(((x-CLEAR.x)/(CLEAR.rx+260))**2+((y-CLEAR.y-80)/(CLEAR.ry+190))**2<1)||(y>CLEAR.y&&y<560&&Math.abs(x-hollowPathX(y))<270);}
function woodsOpen(x,y){return roadDist(x,y)<88||(((x-CLEAR.x)/CLEAR.rx)**2+((y-CLEAR.y)/CLEAR.ry)**2<1&&y>HOLLOW.y+12)||(x>1720&&x<2300&&y>HOLLOW.y+12&&y<640)||spurDist(x,y)<44||(Math.abs(x-GATE.x+4)<52&&y>GATE.y-70&&y<CEM.y0+20)||(x>CEM.x0&&x<CEM.x1&&y>CEM.y0&&y<CEM.y1);}
const WDOBST=[];
function woodsFree(x,y){if(x<20||x>WOODS_W-30||y<WTOP+60||y>WOODS_H-60)return false;if(!woodsOpen(x,y))return false;for(const o of WDOBST)if(((x-o.x)/o.rx)**2+((y-o.y)/o.ry)**2<1)return false;if(x>HUT.x-235&&x<HUT.x+210&&y>HUT.y-330&&y<HUT.y+16)return false;return true;}
function solveWoods(px,py,nx,ny){if(woodsFree(nx,ny))return [nx,ny];if(woodsFree(nx,py))return [nx,py];if(woodsFree(px,ny))return [px,ny];return [px,py];}
function buildWoods(){if(woodsBuilt)return;woodsBuilt=true;let k=0;const h=(a,b)=>hash(a,b,4421);
  const BIRCH=['birch1','birch2','birch3'];
  // trees on a loose grid: behind the road (north) they stand thick; in front (south) only low shrubs and rocks, with a last row of trees at the very bottom edge so nothing hides the path
  const roadY=x=>{for(let i=0;i<ROAD.length-1;i++){const [ax,ay]=ROAD[i],[bx,by]=ROAD[i+1];if(x>=ax&&x<=bx)return ay+(by-ay)*(x-ax)/(bx-ax);}return 620;};
  for(let gy=WTOP-60;gy<WOODS_H+160;gy+=150)for(let gx=-120;gx<WOODS_W+160;gx+=190){k++;const x=gx+(h(k,1)-.5)*110+((gy/150)%2)*90,y=gy+(h(k,2)-.5)*70;
    if(woodsOpen(x,y)||(Math.abs(x-GATE.x)<250&&Math.abs(y-GATE.y)<80)||nearHollow(x,y))continue;const r=h(k,3),dy=y-roadY(x),inCem=x>CEM.x0-160&&x<CEM.x1+160&&dy>60,inCirc=false;
    const tall=dy<-110||(dy>720&&!(x>CEM.x0-140&&x<CEM.x1+140));
    if(tall&&!(inCirc&&dy>-200)){
      if(inCem&&r<.6)WOBJ.push({t:'willow',x,y,s:.5+h(k,9)*.15,flip:h(k,6)<.5,ph:h(k,7)*TAU,dead:1});
      else if(r<.6){const img=BIRCH[(h(k,8)*3)|0],es=(.5+h(k,9)*.3)*(img==='birch1'?1:1.3);WOBJ.push({t:'birch',img,x,y,s:es,flip:h(k,6)<.5,ph:h(k,7)*TAU});}
      else WOBJ.push({t:'willow',x,y,s:.48+h(k,9)*.2,flip:h(k,6)<.5,ph:h(k,7)*TAU});
    }else{
      if(inCem&&r<.5){const i=(h(k,4)*10)|0;WOBJ.push({t:'shrub',img:'drained'+i,ax:DRN[i].ax,drips:[],x,y,s:.42+h(k,5)*.15,flip:h(k,6)<.5,ph:h(k,7)*TAU,drained:1,soaked:0});}
      else if(r<.55&&!(inCirc&&dy>0)){const i=(h(k,4)*SHR.length)|0;WOBJ.push({t:'shrub',k:i,x,y,s:SHR[i].s*(dy>0?.5+h(k,5)*.15:.75+h(k,5)*.3),flip:h(k,6)<.5,ph:h(k,7)*TAU});}
      else WOBJ.push({t:'img',img:['rock1','rock2','rock3','rock4'][(h(k,8)*4)|0],x,y,ax:.5,ay:.72,s:.5+h(k,9)*.4,shadow:1,flip:h(k,6)<.5});}
    // a second, smaller shrub tucked between grid cells keeps the undergrowth full
    const x2=x+95,y2=y+70;if(!woodsOpen(x2,y2)&&!nearHollow(x2,y2)&&!(Math.abs(x2-GATE.x)<250&&Math.abs(y2-GATE.y)<80)&&h(k,11)<.55&&!(inCem&&x2>CEM.x0)&&!(inCirc&&y2>CIRCLE.y)){const i=(h(k,12)*SHR.length)|0;WOBJ.push({t:'shrub',k:i,x:x2,y:y2,s:SHR[i].s*(y2>roadY(x2)?.45+h(k,13)*.15:.6+h(k,13)*.25),flip:h(k,14)<.5,ph:h(k,15)*TAU});}}
  // a few shrubs and rocks right at the road's edge, so the path feels overgrown
  for(let i=0;i<ROAD.length-1;i+=3){const [ax,ay]=ROAD[i];k++;if(h(k,6)<.35)continue;const sd=h(k,1)<.5?-1:1,x=ax+(h(k,7)-.5)*40,y=ay+sd*(98+h(k,2)*22);if(Math.abs(x-GATE.x)<120||spurDist(x,y)<60)continue;
    const j=(h(k,3)*SHR.length)|0;WOBJ.push({t:'shrub',k:j,x,y,s:SHR[j].s*(sd>0?.5:.8),flip:h(k,4)<.5,ph:h(k,5)*TAU});}
  // the cemetery: rows of graves, each with a little mound
  // headstones in staggered rows; only the three graves the dead climb out of have open earth
  const OPEN=[1,6,8];let gi=0;
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){const x=CEM.x0+390+col*128+(row%2)*40,y=CEM.y0+90+row*140;const o={t:'grave',img:'grave10',x,y,s:.4,mound:OPEN.includes(gi)};gi++;WGRAVES.push(o);WOBJ.push(o);WDOBST.push({x,y:y-6,rx:32,ry:12});}
  // two towering obelisks keep watch over the graves
  for(const [x,y,sc] of [[HUT.x-480,HUT.y-55,1.8]]){const o={t:'grave',img:'grave6',x,y,s:sc,big:1};WOBJ.push(o);WDOBST.push({x,y:y-8,rx:44*sc/1.05,ry:18*sc/1.05});}
  // dead trees around the graveyard
  // the graveyard's edge: the gate in the middle, a line of drained shrubs and old stones either side
  WOBJ.push({t:'gate',x:GATE.x,y:GATE.y});
  // the gravekeeper's hut, tucked in the west corner
  {let q=0;for(let y=-170;y<=500;y+=95)for(const [x0,sd] of [[1560,-1],[2470,1]]){q++;const x=x0+sd*(h(q,31)*40),r=h(q,32)*.7;
    if(r<.55){const img=BIRCH[(h(q,33)*3)|0],es=(.6+h(q,34)*.3)*(img==='birch1'?1:1.3);WOBJ.push({t:'birch',img,x,y:y+h(q,35)*30,s:es,flip:sd>0,ph:h(q,36)*TAU});}
    else WOBJ.push({t:'willow',x,y:y+h(q,35)*30,s:.5+h(q,34)*.18,flip:sd<0,ph:h(q,36)*TAU});
    const i=(h(q,37)*SHR.length)|0;WOBJ.push({t:'shrub',k:i,x:x-sd*120,y:y+50,s:SHR[i].s*.7,flip:h(q,38)<.5,ph:h(q,39)*TAU});}}
  WFORAGE.length=0;for(const [x,y,i] of [[1930,300,6],[2120,60,0],[2190,430,4]]){WOBJ.push({t:'shrub',k:i,x,y,s:SHR[i].s*.85,flip:x>2000,ph:x*.01});WDOBST.push({x,y:y-4,rx:34,ry:12});WFORAGE.push({x,y,id:FORAGE_MAP[i],n:2,picked:0});}
  WOBJ.push({t:'hollow',x:HOLLOW.x,y:HOLLOW.y});WDOBST.push({x:HOLLOW.x+10,y:HOLLOW.y,rx:170,ry:26});
  WOBJ.push({t:'hut',x:HUT.x,y:HUT.y});WDOBST.push({x:HUT.x-20,y:HUT.y-34,rx:190,ry:52});for(const [dx,rx] of [[-78,16],[70,18],[-150,70],[140,70]])WDOBST.push({x:GATE.x+dx,y:GATE.y-(dx>0?8:0),rx,ry:14});
  for(let x=CEM.x0-60;x<=CEM.x1+60;x+=52){if(Math.abs(x-GATE.x)<235)continue;k++;const y=GATE.y+4+(h(k,1)-.5)*16;if(h(k,2)<.55){const i=(h(k,3)*10)|0;WOBJ.push({t:'shrub',img:'drained'+i,ax:DRN[i].ax,drips:[],x,y,s:.4+h(k,4)*.12,flip:h(k,5)<.5,ph:h(k,6)*TAU,drained:1,soaked:0});}else WOBJ.push({t:'img',img:['rock1','rock2','rock3','rock4'][(h(k,3)*4)|0],x,y,ax:.5,ay:.72,s:.45+h(k,4)*.3,shadow:1,flip:h(k,5)<.5});}
  for(const [x,y] of [[CEM.x0-90,CEM.y1+130],[CEM.x1+80,CEM.y1+110]]){k++;WOBJ.push({t:'willow',x,y,s:.6,flip:h(k,1)<.5,ph:h(k,2)*TAU,dead:1});}
  WINTS.length=0;
  WINTS.push({x:HOLLOW.x,y:HOLLOW.y+28,reach:62,door:true,onInteract:hollowInteract});
  for(const f of WFORAGE)WINTS.push({x:f.x,y:f.y,reach:76,lum:true,forage:f,onInteract:()=>{if(CH>0)pickForage(f);else say("Berries! Master Lum would love these… but not tonight.");}});
  WINTS.push({x:HUT.x-(359-429)*HUT.k,y:HUT.y+18,reach:70,door:true,onInteract:()=>CH===1?hutDoorC1():say(["The gravekeeper's hut. The door's locked tight, and there's a rune glowing on it.","A lantern's still burning in there… but nobody answers when I knock."][(sayCount++)%2])});
  for(const g of WGRAVES)WINTS.push({x:g.x,y:g.y+18,reach:55,onInteract:()=>{if(CH===1&&C1.reaper!==1&&Math.random()<1/3){graveRise(g);return;}say(["The names on this grave are worn away. Just a little carved star, and the date… it's so old.","Someone left a dried flower here. A long, long time ago."][(sayCount++)%2]);}});}
function graveRise(g){WEVENT.on=true;shake=5;sfxRumble&&sfxRumble(1.2,.5);
  for(let i=0;i<16;i++)PARTS.push({type:'dust',x:g.x+rnd(-30,30),y:g.y+20,z:rnd(0,20),vx:rnd(-40,40),vy:rnd(-10,10),vz:rnd(40,120),life:0,max:rnd(.6,1.2),s:rnd(3,6)});
  const sk={kind:'rskel',scene:'woods',x:g.x+40,y:g.y+40,hx:g.x+40,hy:g.y+40,tx:g.x+40,ty:g.y+40,s:1,pack:1,calm:0,dead:0,t:0,ph:0,face:lum.x<g.x?-1:1,id:900+Math.floor(Math.random()*1e5),risen:1};WFOES.push(sk);
  talk([['Lum',"The ground is shifting… something's clawing its way out!"]],false,()=>{WEVENT.on=false;startEncounter(sk,'ambush');});}
function enterWoods(){buildWoods();SCENE='woods';lum.x=70;lum.y=630;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x+120;cam.y=lum.y-50;WTITLE.t=0;
  if(!WEV.entered){WEV.entered=1;setTimeout(()=>talk([['Cosmic',"It's so dark out here… I can't even see Lum's Magic Shop anymore."],['Cosmic',"I've never been past the hedge before. Not once."]]),4700);}}
function updateWoods(dt){if(DLG.active||WEVENT.on||FADE.dir)return;
  if(lum.x<60&&!WEV.back){WEV.back=1;say("No… I can't go back now.");setTimeout(()=>WEV.back=0,4000);}
  if(lum.x>700&&!WEV.mid){WEV.mid=1;sfxEerie();talk([['???',"Keep moving, child. Don't look back."]]);}
  
  if(lum.y>GATE.y+40&&!WEV.cem){WEV.cem=1;WEVENT.on=true;sfxEerie();talk([['Cosmic',"I should turn back…"],['???',"Step forward, child. This is where you prove your worth to me."],['???',"Destroy everything."]],false,()=>{WEVENT.on=false;spawnSkels();setTimeout(()=>talk([['Cosmic',"The graves are opening… Skeletons!"],['Cosmic',"You have the blade. You can do this."]]),2600);});}}
function drawHollow(o){const im=IMG.hollow;if(!ready(im))return;const k=HOLLOW.s;
  ctx.drawImage(im,o.x-HOLLOW.ix*k,o.y-HOLLOW.iy*k,im.naturalWidth*k,im.naturalHeight*k);
  // cold air breathing out of the hollow
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,o.x,o.y-50,40,'150,180,220',.08+.05*Math.sin(T*1.3));ctx.restore();}
function hollowInteract(){if(PC==='cosmic'){say("A hollow in the old oak. Cold air is breathing out of it… nope. Not tonight.");return;}
  if(!C1.hollowSeen){C1.hollowSeen=1;talk([['Lum',"A hollow in the old oak… and it goes deep down…"],['Lum',"Cosmic? Are you down there?"]],false,()=>goScene(()=>enterDun(1,560,650,1)));return;}
  goScene(()=>enterDun(1,560,650,1));}
function drawHut(o){const im=IMG.hut;if(!ready(im))return;const k=HUT.k,w=im.naturalWidth*k,h=im.naturalHeight*k,x=o.x-429*k,y=o.y-880*k;ctx.save();ctx.translate(o.x,0);ctx.scale(-1,1);ctx.translate(-o.x,0);ctx.drawImage(im,x,y,w,h);
  ctx.save();ctx.globalCompositeOperation='lighter';const f=.8+.12*Math.sin(T*6)+.08*Math.sin(T*11);drawGlow(ctx,x+134*k,y+560*k,40,'255,190,110',.5*f);drawGlow(ctx,x+134*k,y+560*k,10,'255,230,170',.8*f);drawGlow(ctx,x+690*k,y+560*k,26,'255,200,120',.18*f);
  drawGlow(ctx,x+359*k,y+590*k,12,'170,140,255',.35+.2*Math.sin(T*2));ctx.restore();ctx.restore();}
function drawGate(o){const im=IMG.gate;if(!ready(im))return;const k=GATE.k,w=im.naturalWidth*k,h=im.naturalHeight*k,x=o.x-480*k,y=o.y-569*k;
  ctx.fillStyle='rgba(15,15,20,.35)';ctx.beginPath();ctx.ellipse(o.x-20,o.y+4,w*.48,16,0,0,TAU);ctx.fill();ctx.drawImage(im,x,y,w,h);
  ctx.save();ctx.globalCompositeOperation='lighter';for(const [lx,ly,ph] of [[185,298,0],[720,262,1.7]]){const f=.75+.15*Math.sin(T*7+ph)+.1*Math.sin(T*13+ph*2);drawGlow(ctx,x+lx*k,y+ly*k,46,'255,190,110',.5*f);drawGlow(ctx,x+lx*k,y+ly*k,12,'255,230,170',.8*f);}ctx.restore();}
function drawStandingStone(o){const glow=.25+.5*clamp(1-Math.abs(lum.x-CIRCLE.x)/700,0,1);ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.lean);
  ctx.fillStyle='rgba(20,25,20,.35)';ctx.beginPath();ctx.ellipse(0,2,o.w*1.1,9,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(-o.w/2,0,o.w/2,0);g.addColorStop(0,'#8a8f88');g.addColorStop(.5,'#b5b8ae');g.addColorStop(1,'#6f746c');ctx.fillStyle=g;ctx.strokeStyle='#2c2f2a';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-o.w/2,0);ctx.lineTo(-o.w*.45,-o.h*.85);ctx.quadraticCurveTo(0,-o.h*1.08,o.w*.42,-o.h*.88);ctx.lineTo(o.w/2,0);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(90,130,70,.55)';ctx.beginPath();ctx.ellipse(-o.w*.2,-6,o.w*.4,7,0,0,TAU);ctx.fill();
  ctx.save();ctx.globalCompositeOperation='lighter';const a=glow*(.7+.3*Math.sin(T*2+o.ph));ctx.strokeStyle=`rgba(190,150,255,${a.toFixed(3)})`;ctx.lineWidth=1.8;
  ctx.beginPath();ctx.moveTo(-6,-o.h*.6);ctx.lineTo(0,-o.h*.7);ctx.lineTo(6,-o.h*.6);ctx.moveTo(0,-o.h*.7);ctx.lineTo(0,-o.h*.4);ctx.moveTo(-5,-o.h*.48);ctx.lineTo(5,-o.h*.48);ctx.stroke();drawGlow(ctx,0,-o.h*.55,26,'180,140,255',a*.6);ctx.restore();ctx.restore();}
function drawGrave(o){const im=IMG[o.img];if(!ready(im))return;const w=im.naturalWidth*o.s,h=im.naturalHeight*o.s;
  // the grave mound in front (only on the open graves)
  if(o.mound){ctx.fillStyle='rgba(20,18,14,.35)';ctx.beginPath();ctx.ellipse(o.x,o.y+30,w*.45+10,16,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(0,o.y+10,0,o.y+44);g.addColorStop(0,'#6b5a42');g.addColorStop(1,'#4a3c2a');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(o.x,o.y+26,w*.42+8,14,0,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(30,22,14,.7)';ctx.lineWidth=1.4;ctx.stroke();ctx.fillStyle='rgba(110,140,80,.5)';for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(o.x-w*.35+i*w*.18,o.y+22+(i%2)*6,4,2,0,0,TAU);ctx.fill();}}
  if(!o.big){ctx.fillStyle='rgba(20,25,20,.35)';ctx.beginPath();ctx.ellipse(o.x,o.y+2,w*.5,8,0,0,TAU);ctx.fill();}
  ctx.drawImage(im,o.x-w/2,o.y-h,w,h);}
const WMIST=[];for(let i=0;i<26;i++)WMIST.push({x:rnd(0,WOODS_W),y:rnd(300,1100),sp:rnd(6,14),r:rnd(80,160),ph:rnd(0,TAU)});
function drawWoods(){const vw=W/zoom,vh=H/zoom,x0=cam.x-vw/2-40,y0=cam.y-vh/2-40,x1=cam.x+vw/2+40,y1=cam.y+vh/2+120;
  const shk=woodsShake(),shx=(Math.random()-.5)*shk,shy=(Math.random()-.5)*shk;ctx.setTransform(DPR*zoom,0,0,DPR*zoom,DPR*(W/2-cam.x*zoom+shx),DPR*(H/2-cam.y*zoom+shy));
  drawGround(x0,y0,x1,y1);
  // the dirt road: a soft worn band with a darker rut down the middle and scattered pebbles
  if(!ROADP){ROADP=buildPath(ROAD_CTRL,150,3.1);SPURP=buildPath(SPUR_CTRL,78,7.7);}
  // the graveyard ground goes down first so the little path can run onto it
  {ctx.save();ctx.fillStyle='rgba(58,56,42,.5)';ctx.beginPath();const cx_=(CEM.x0+CEM.x1)/2,cy_=(CEM.y0+CEM.y1)/2+10;for(let i=0;i<=48;i++){const a=i/48*TAU,rj=1+(hash(i,1,91)-.5)*.12;ctx.lineTo(cx_+Math.cos(a)*(CEM.x1-CEM.x0)*.6*rj,cy_+Math.sin(a)*(CEM.y1-CEM.y0)*.62*rj);}ctx.fill();ctx.restore();}
  drawPath(SPURP,x0,x1);drawPath(ROADP,x0,x1);if(CH===1)drawBoots(x0,x1);
  // the clearing and the graveyard ground
  
  const L=[];for(const s_ of WSKELS)L.push([s_.y,{t:'skel',ref:s_}]);if(CH===1){for(const g_ of WFOES)L.push([g_.y,{t:'wfoe',ref:g_}]);if(REAPER)L.push([REAPER.y,{t:'reaperow',ref:REAPER}]);if(VANE)L.push([VANE.y,{t:'vane',ref:VANE}]);if(JAKF&&jakInParty())L.push([JAKF.y,{t:'jakow'}]);}for(const o of WOBJ)if(o.t==="hollow"||(o.x>x0-300&&o.x<x1+300&&o.y>y0-40&&o.y<y1+600))L.push([o.y,o]);L.push([lum.y,null]);L.sort((a,b)=>a[0]-b[0]);
  drawSealFx();let past=false;for(const [,o] of L){if(!o){if(WEV.foka)drawFokalur();else drawLum();past=true;continue;}if(o.t==='skel'){drawWoodsSkel(o.ref);continue;}if(o.t==='wfoe'){drawWFoe(o.ref);continue;}if(o.t==='reaperow'){drawReaperOW(o.ref);continue;}if(o.t==='vane'){drawVaneOW(o.ref);continue;}if(o.t==='jakow'){drawJakOW();continue;}const fade=past&&Math.abs(o.x-lum.x)<130&&o.y-lum.y<260;if(fade){ctx.save();ctx.globalAlpha=.45;}if(o.t==='stone')drawStandingStone(o);else if(o.t==='gate')drawGate(o);else if(o.t==='hut')drawHut(o);else if(o.t==='hollow')drawHollow(o);else if(o.t==='grave')drawGrave(o);else drawEstateObj(o);if(fade)ctx.restore();}
  drawSkDust();
  // drifting ground mist
  ctx.save();ctx.globalCompositeOperation='lighter';for(const m of WMIST){const x=m.x+Math.sin(T*.1*m.sp/10+m.ph)*60;drawGlow(ctx,x,m.y,m.r,'150,160,190',.08+.04*Math.sin(T*.5+m.ph));}ctx.restore();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(CH===1){drawForage(WFORAGE);if(!CAPTURE.on)drawNightShade(lum.x,lum.y,.2);drawC1EndCard();}else{drawNightShade(lum.x,lum.y,.74);drawRain(1/60);drawStorm();}
  const vg=ctx.createRadialGradient(W/2,H*.45,Math.min(W,H)*.3,W/2,H*.45,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(5,6,18,0)');vg.addColorStop(1,'rgba(5,6,18,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(WEV.flash>0){ctx.fillStyle=`rgba(255,235,240,${Math.min(1,WEV.flash).toFixed(3)})`;ctx.fillRect(0,0,W,H);}
  if(WEV.quake){ctx.fillStyle=`rgba(120,10,30,${(.12+.08*Math.sin(T*6)).toFixed(3)})`;ctx.fillRect(0,0,W,H);}
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(5,8,20,.45)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#e4e2f0';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('The Whispering Wood',W/2,H*.3+10);ctx.restore();}
  if(WEV.end){WEV.end+=1/60;const a=Math.min(1,WEV.end/2);ctx.save();ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(0,0,W,H);if(WEV.end>6.5){ctx.restore();drawResults(WEV.end-6.5);}else{ctx.globalAlpha=Math.max(0,Math.min(1,(WEV.end-2)/1.5,(6.5-WEV.end)/.8));ctx.textAlign='center';ctx.fillStyle='#e8e2f2';ctx.font='italic 20px Alegreya, Georgia, serif';ctx.fillText('And the world began to tremble…',W/2,H*.45);ctx.font='700 22px "Alegreya SC", Georgia, serif';ctx.fillStyle='rgba(232,226,242,.85)';ctx.fillText('End of Prologue',W/2,H*.45+40);ctx.restore();}}}

/* ---------- the restless dead of the old graveyard ---------- */
const WSKELS=[],SKDUST=[];let skelDone=0;const SKCW=640,SKCH=384,FKCW=260,FKCH=250;
function drawSkelFrame(c,n,x,y,h,flip,alpha,flash){const im=IMG.skel;if(!ready(im))return;const k=h/SKCH,sx=(n%5)*SKCW,sy=((n/5)|0)*SKCH;c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.globalAlpha=alpha;if(flash>0)c.filter='brightness(1.8)';c.drawImage(im,sx,sy,SKCW,SKCH,-320*k,-376*k,SKCW*k,SKCH*k);c.filter='none';c.restore();}
/* Fokalur, painted: one large cut-out, brought to life in code. h is the full image height; feet sit at y.
   Frames 4–7 (the old sheet's casting/transforming rows) mean "casting": the staff orb flares. */
const FOKA_W=975/576,FOKA_ORB=[300/975,112/576],FOKA_BODY=.512;
function drawFokFrame(c,n,x,y,h,flip,alpha){if(ready(IMG.fokalur_hd))drawFokHD(c,n,x,y,h,flip,alpha);}
function drawFokHD(c,n,x,y,h,flip,alpha){const im=IMG.fokalur_hd,w=h*FOKA_W,cast=n>=4,bob=Math.sin(T*1.5)*h*.012,br=Math.sin(T*1.5+1);
  c.save();c.translate(x,y+bob);if(flip)c.scale(-1,1);c.globalAlpha=alpha;
  // dark mist pooling at his feet and around him
  c.save();c.globalCompositeOperation='source-over';for(let i=0;i<4;i++){const mx=(Math.sin(T*.6+i*1.7)*.18)*w,my=-h*(.08+.06*i);drawGlow(c,mx,my,h*.28,'40,10,40',.22*alpha);}c.restore();
  c.save();c.translate(0,-h);c.scale(1+.018*br,1-.006*br);c.drawImage(im,-w*FOKA_BODY,0,w,h);c.restore();
  // the staff orb: a slow pulse, flaring when he casts
  const ox=(FOKA_ORB[0]-FOKA_BODY)*w,oy=-h+FOKA_ORB[1]*h;c.save();c.globalCompositeOperation='lighter';
  drawGlow(c,ox,oy,h*(cast?.16:.07),'255,40,60',(cast?.85:.45+.15*Math.sin(T*3))*alpha);
  if(cast){drawGlow(c,ox,oy,h*.4,'200,30,90',.25*alpha);for(let i=0;i<6;i++){const a=T*2+i*1.05,r=h*(.05+.03*Math.sin(T*5+i));drawGlow(c,ox+Math.cos(a)*r,oy+Math.sin(a)*r,h*.02,'255,120,160',.7*alpha);}}
  // the eyes
  drawGlow(c,0,-h+.245*h,h*.022,'255,220,120',(.5+.2*Math.sin(T*2.3))*alpha);
  c.restore();c.restore();}
function sfxBones(v=1){if(!SND.ready)return;const t=SND.ctx.currentTime;for(let i=0;i<7;i++)noiseHit(t+i*.045+Math.random()*.02,.035,'bandpass',1800+Math.random()*1600,6,.09*v,SND.sfx);}
function sfxRumble(dur=3,v=1){if(!SND.ready)return;const c=SND.ctx,t=c.currentTime;noiseHit(t,dur,'lowpass',140,1,.5*v,SND.sfx,60);const o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(42,t);o.frequency.linearRampToValueAtTime(30,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*v,t+.3);g.gain.linearRampToValueAtTime(0,t+dur);const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=180;o.connect(f);f.connect(g);g.connect(SND.sfx);o.start(t);o.stop(t+dur+.1);}
function spawnSkels(){const picks=WGRAVES.filter(g=>g.mound).map(g=>[WGRAVES.indexOf(g),0]);picks.forEach(([gi,dx],i)=>{const gr=WGRAVES[gi];WSKELS.push({kind:'skel',scene:'woods',x:gr.x+dx,y:gr.y+34,s:1,pack:1,calm:2.6+i*.5,dead:0,rise:-i*.5,ft:rnd(0,4),face:lum.x<gr.x?-1:1,col:['235,228,210','190,180,160','90,80,70']});});
  GOAL.tag='NEW TASK';GOAL.text='Slay the risen dead (0 of 3)';HINT.goalT=0;sfxRumble(2.2,.6);}
function updateSkels(dt){for(const s of WSKELS){if(s.rise<1){const was=s.rise;s.rise+=dt/1.7;if(was<0&&s.rise>=0)sfxBones(1.2);if(s.rise>0&&Math.random()<dt*30)SKDUST.push({x:s.x+rnd(-30,30),y:s.y-rnd(0,8),vx:rnd(-40,40),vy:rnd(-90,-30),t:0,max:rnd(.5,1)});continue;}
    s.calm=Math.max(0,s.calm-dt);const dx=lum.x-s.x,dy=lum.y-s.y,d=Math.hypot(dx,dy);
    if(s.calm<=0&&d<560&&!busy()&&!WEV.fk){const v=40*dt;s.x+=dx/d*v;s.y+=dy/d*v*.8;s.face=dx<0?-1:1;s.ft+=dt*7;s.walk=1;if(d<62&&!BATTLE.on&&!BATTLE.pending)startEncounter(s,'ambush');}
    else{s.ft+=dt*4.5;s.walk=0;}}
  for(let i=SKDUST.length-1;i>=0;i--){const p=SKDUST[i];p.t+=dt;p.vy+=160*dt;p.x+=p.vx*dt;p.y+=p.vy*dt*.3;if(p.t>p.max)SKDUST.splice(i,1);}}
function drawWoodsSkel(s){if(CAPTURE.on&&s===BATTLE.capG)return;const h=160;if(s.rise<=0)return;
  if(s.rise<1){const e=1-Math.pow(1-s.rise,2);ctx.save();ctx.beginPath();ctx.rect(s.x-200,s.y-400,400,400);ctx.clip();drawSkelFrame(ctx,13+((T*6)|0)%3,s.x,s.y+(1-e)*h*.95,h,s.face<0,1,0);ctx.restore();
    ctx.fillStyle='rgba(50,38,26,.7)';ctx.beginPath();ctx.ellipse(s.x,s.y,40,10,0,0,TAU);ctx.fill();return;}
  ctx.fillStyle='rgba(10,10,20,.35)';ctx.beginPath();ctx.ellipse(s.x,s.y,34,9,0,0,TAU);ctx.fill();
  const n=s.walk?4+((s.ft|0)%5):((s.ft|0)%4);drawSkelFrame(ctx,n,s.x,s.y+4,h,s.face<0,1,0);
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,s.x+(s.face<0?-6:6),s.y-h*.82,10,'200,120,255',.35+.15*Math.sin(T*4+s.ft));ctx.restore();}
function drawSkDust(){ctx.fillStyle='rgba(70,54,36,.8)';for(const p of SKDUST){ctx.globalAlpha=1-p.t/p.max;ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,TAU);ctx.fill();}ctx.globalAlpha=1;}
function skelFrameFor(f){const B=BATTLE,me=B.foes[B.foeI]===f,ph=B.phase;
  if(f.dead)return 16+Math.min(3,Math.floor(f.dead/.2));if(f.hit>0)return 13+Math.min(2,Math.floor((.4-f.hit)/.14));
  if(me&&ph==='foeWind')return 9;if(me&&ph==='foeLeap'){const u=B.t/B.leapD;return u<.62?4+(Math.floor(B.t*14)%5):u<.85?10:11;}if(me&&ph==='foeBack')return B.t<.15?12:4+(Math.floor(B.t*14)%5);
  if(me&&ph==='foeJiggle')return Math.floor(B.t*10)%4;return Math.floor(T*4.5+f.ph)%4;}
function drawBattleSkel(f){const S=bS(),h=250*S*f.s,x=f.x+f.ox,y=f.y+f.oy;if(f.dead>2.4)return;const fr=skelFrameFor(f),al=f.dead>1.6?Math.max(0,1-(f.dead-1.6)/.8):1;
  bshadow(x,y-4,h*.2,h*.04,.35*al);
  drawSkelFrame(ctx,fr,x+(f.hit>0?Math.sin(f.hit*50)*4:0),y,h,true,al,f.hit);
  if(!f.dead){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x-6*S,y-h*.83,12*S,'200,120,255',.3+.15*Math.sin(T*4+f.ph));ctx.restore();}
  if(f.showHp>0&&!f.dead){const bw=60*S,bx=x-bw/2,by=y+16*S;ctx.save();ctx.globalAlpha=Math.min(1,f.showHp*3);ctx.fillStyle='rgba(20,20,30,.55)';rr(bx-2,by-2,bw+4,10,5);ctx.fill();ctx.fillStyle='#7ee08a';rr(bx,by,bw*f.hp/f.max,6,3);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(`${f.hp}/${f.max}`,bx+bw/2,by+20);ctx.restore();}
  if(BATTLE.phase==='target'&&BATTLE.foes[BATTLE.target]===f)tutArrow(ctx,f.x,f.y-h*.95,1);}
/* the seal breaks */
function fokalurEvent(){WEV.fk=1;WEVENT.on=true;sfxEerie();
  talk([['???',"Yes… YES! Do you feel it, child? This is what real power feels like."],['Cosmic',"I… I did it. But my hands won't stop shaking…"],['???',"I command you to awaken me!"],['Cosmic',"Who are you?"],['???',"Awaken me now!"],['Cosmic',"I…"],['???',"Aaaah… the magic seal is weakening…"],['Cosmic',"What…? My arm… the blade won't let go of me…!"],['Cosmic',"Lum… I'm sorry!"]],false,()=>{WEV.seal=.001;sfxRumble(3,.7);});}
function updateFokalur(dt){if(WEV.seal){const t0=WEV.seal;WEV.seal+=dt;const t=WEV.seal;
    if(t0<2.6&&t>=2.6){WEV.flash=1;WEV.foka=.001;sfxRumble(2,1);if(SND.ready){const n=SND.ctx.currentTime;[38,45,50].forEach((m,i)=>bell(n+i*.05,NOTE(m),.15,3,SND.sfx,0));}}
    if(t0<5.4&&t>=5.4)talk([['Fokalur',"Ahh… free at last after a thousand years."],['Fokalur',"Thank you, foolish apprentice. Your body will serve as a suitable vessel."],['Fokalur',"This world will soon be in ruin."]],false,()=>{WEV.quake=.001;sfxRumble(5,1.2);setTimeout(()=>sfxRumble(4,1),1800);});}
  if(WEV.foka)WEV.foka+=dt;WEV.flash=Math.max(0,(WEV.flash||0)-dt*.7);
  if(WEV.quake){WEV.quake+=dt;for(const o of WSTONES)o.lean+=(o.ph>3?1:-1)*dt*.05*Math.min(1,WEV.quake/2);if(Math.random()<dt*40)SKDUST.push({x:lum.x+rnd(-400,400),y:lum.y+rnd(-400,300),vx:rnd(-20,20),vy:rnd(-60,0),t:0,max:rnd(.6,1.2)});if(WEV.quake>5.5&&!WEV.end)WEV.end=.001;}}
function woodsShake(){let s=0;if(WEV.seal&&WEV.seal<2.6)s=WEV.seal*1.6;if(WEV.foka&&WEV.foka<.8)s=8*(1-WEV.foka/.8);if(WEV.quake)s=Math.min(14,4+WEV.quake*3);return s;}
function drawSealFx(){if(!WEV.seal)return;const t=WEV.seal,x=lum.x,y=lum.y;ctx.save();ctx.globalCompositeOperation='lighter';
  if(t<2.6){const a=Math.min(1,t/2);drawGlow(ctx,x,y-60,60+t*40,'255,40,50',.25*a+.1*Math.sin(T*20));
    ctx.strokeStyle=`rgba(255,70,60,${(.7*a).toFixed(3)})`;ctx.lineWidth=2.5;for(let i=0;i<9;i++){const an=i/9*TAU+.3,len=t*90*(0.7+hash(i,3,9)*.6);ctx.beginPath();ctx.moveTo(x,y);let px=x,py=y;for(let k=1;k<=5;k++){px=x+Math.cos(an+(hash(i,k,7)-.5)*.5)*len*k/5;py=y+Math.sin(an+(hash(i,k,8)-.5)*.5)*len*k/5*.5;ctx.lineTo(px,py);}ctx.stroke();}}
  else{const a=Math.max(0,1-(t-2.6)/4);drawGlow(ctx,x,y-120,220,'170,40,90',.35*a+.12);}
  ctx.restore();}
function drawFokalur(){const t=WEV.foka,h=520;let n=Math.floor(T*4)%4;if(t<.5)n=4;else if(t<2.2)n=5;else if(WEV.quake)n=6+(Math.floor(T*3)%2?0:0);else if(t<3)n=7;
  ctx.fillStyle='rgba(10,0,10,.45)';ctx.beginPath();ctx.ellipse(lum.x,lum.y,140,28,0,0,TAU);ctx.fill();
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,lum.x,lum.y-280,300,'160,30,80',.22+.08*Math.sin(T*3));ctx.restore();
  drawFokFrame(ctx,n,lum.x,lum.y+4,h,false,Math.min(1,t*3));}

