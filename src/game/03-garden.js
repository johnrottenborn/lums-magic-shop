/* =====================================================================
   Lum's cottage: painted house + well from the concept art, a garden of
   lavender, herbs, roses and magic blossoms, a cobbled path that wanders
   into a dirt road heading south.
   ===================================================================== */
const HS=1.04;                       // concept-art px -> world units (matches the painted Lum's height)
const hx=sx=>(sx-662)*HS, hy=sy=>(sy-650)*HS;   // front door step at world (0,0)
const HOUSE={img:'cottage',x:hx(316),y:hy(68)};
const WELL={x:-560,y:44},WELL_S=1.45,WELL_TOP=116;
const CHIM={x:hx(742),y:hy(74)};
// cobbled path: door -> south, then the dirt road takes over
const COB=[[0,8],[4,40],[8,64],[8,134],[4,190],[-10,290],[8,400],[18,490],[8,570],[10,620]];
const PATH_A=[[682,-46],[640,8],[560,56],[400,80],[220,82],[90,70],[30,52],[0,44]],PATH_B=[[0,40],[0,1480]],PATH_C=[[958,46],[1012,62]];
const PATHS=[PATH_B];
function segDist(x,y,a,b){const vx=b[0]-a[0],vy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy)));return Math.hypot(x-(a[0]+vx*t),y-(a[1]+vy*t));}
function pathDist(x,y){let d=1e9;for(const P of PATHS)for(let i=0;i<P.length-1;i++)d=Math.min(d,segDist(x,y,P[i],P[i+1]));return d;}
function pathSamples(P,step){const out=[];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);const n=Math.max(1,Math.round(L/step));for(let k=0;k<n;k++){const t=k/n;out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,(b[0]-a[0])/L,(b[1]-a[1])/L]);}}out.push([P[P.length-1][0],P[P.length-1][1],0,1]);return out;}
const dX=y=>4*Math.sin(y/70);
function cobX(y){if(y<=COB[0][1])return COB[0][0];for(let i=0;i<COB.length-1;i++){const a=COB[i],b=COB[i+1];if(y<=b[1]){const t=(y-a[1])/(b[1]-a[1]),s=t*t*(3-2*t);return a[0]+(b[0]-a[0])*s;}}return dX(y);}
const pathX=y=>y<620?cobX(y):dX(y);
const pathW=y=>y<620?34:28+5*Math.sin(y/90);
const onPath=(x,y,m=0)=>pathDist(x,y)<36+m||(y>1400&&Math.abs(x-dX(y))<pathW(y)+m);
// garden rows run diagonally from the path down toward the brook
const ROWS=[];
const ROW_L=['lavender','rosemary','sage','mint','lavender','magic'],ROW_R=['magic','lavender','mint','sage','rosemary','lavender'];
function buildRows(){ROWS.length=0;for(let i=0;i<6;i++){const y=150+i*64;ROWS.push({ax:-80,ay:y,d:[-1,0],n:[0,1],L:250,kind:ROW_L[i]});ROWS.push({ax:80,ay:y,d:[1,0],n:[0,1],L:250,kind:ROW_R[i]});}}
function inGarden(x,y,m=0){for(const r of ROWS){const dx=x-r.ax,dy=y-r.ay;const along=dx*r.d[0]+dy*r.d[1],perp=dx*r.n[0]+dy*r.n[1];if(along>-20-m&&along<r.L+20+m&&Math.abs(perp)<26+m)return true;}return false;}
const inEstate=(x,y)=>x>-760&&x<880&&y>-560&&y<720;
/* the playable clearing: the painted forest closes in to the north and sides; you may step a little way behind the cottage */
const behindHouse=x=>x>hx(316)-30&&x<hx(1180)+30;
function inMap(x,y){if(NIGHT.cut&&Math.abs(x-20)<62&&y>1500&&y<1730)return true;if(x<-900||x>1005||y>1550)return false;if(onBridge(x,y))return true;return y>(x>560&&x<1005?-70:-50);}
const houseZone=(x,y)=>x>hx(316)-20&&x<hx(1180)+20&&y>hy(68)-30&&y<50;
const wellZone=(x,y)=>Math.hypot((x-WELL.x)/140,(y-WELL.y+40)/80)<1;
const keepClear=(x,y)=>houseZone(x,y)||wellZone(x,y)||onPath(x,y,22)||inGarden(x,y,6)||inPond(x,y,-20);

/* ---------- seeded helpers for painting plants ---------- */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function mixHex(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const r=((A>>16)*(1-t)+(B>>16)*t)|0,g=(((A>>8)&255)*(1-t)+((B>>8)&255)*t)|0,bl=((A&255)*(1-t)+(B&255)*t)|0;return `rgb(${r},${g},${bl})`;}
const PR=2;   // plant sprites are painted at 2x for crispness
function mk(w,h){const c=document.createElement('canvas');c.width=w*PR;c.height=h*PR;const g=c.getContext('2d');g.scale(PR,PR);g.lineCap='round';g.lineJoin='round';return {c,g};}
const INK='rgba(52,58,40,.55)';
function leaf(g,x,y,len,wid,ang,fill,ink=true,vein=null){g.save();g.translate(x,y);g.rotate(ang);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(len*.5,-wid,len,0);g.quadraticCurveTo(len*.5,wid,0,0);g.fillStyle=fill;g.fill();
  if(ink){g.strokeStyle=INK;g.lineWidth=.6;g.stroke();}if(vein){g.strokeStyle=vein;g.lineWidth=.5;g.beginPath();g.moveTo(len*.1,0);g.lineTo(len*.85,0);g.stroke();}g.restore();}
function grassBase(g,r,bx,by,n,cols,spread=1.4,len=10){for(let i=0;i<n;i++){const a=-Math.PI/2+(r()-.5)*spread,L=len*(.6+r()*.8);g.strokeStyle=cols[(r()*cols.length)|0];g.lineWidth=1.3;g.beginPath();const sx=bx+(r()-.5)*8;g.moveTo(sx,by);g.quadraticCurveTo(sx+Math.cos(a)*L*.5,by+Math.sin(a)*L*.6,sx+Math.cos(a)*L,by+Math.sin(a)*L);g.stroke();}}

function paintLavender(seed){const r=mulberry(seed),w=58,h=64,{c,g}=mk(w,h),bx=w/2,by=h-3;
  g.fillStyle='rgba(60,80,50,.18)';g.beginPath();g.ellipse(bx,by,18,4,0,0,TAU);g.fill();
  grassBase(g,r,bx,by,24,['#7d9a78','#93ad8a','#6b8a6a','#a9bf9c'],1.8,12);
  const n=10+(r()*6|0);
  for(let i=0;i<n;i++){const a=-Math.PI/2+(r()-.5)*1.15,L=30+r()*20,tx=bx+Math.cos(a)*L,ty=by+Math.sin(a)*L;
    g.strokeStyle=r()<.5?'#7f9a6c':'#90a77a';g.lineWidth=.9;g.beginPath();g.moveTo(bx+(r()-.5)*5,by-4);g.quadraticCurveTo(bx+Math.cos(a)*L*.35,by+Math.sin(a)*L*.6,tx,ty);g.stroke();
    const sl=11+r()*6;for(let k=0;k<8;k++){const t=k/7,fx=tx+Math.cos(a)*sl*t,fy=ty+Math.sin(a)*sl*t,s=2.3-t*1.1;
      g.fillStyle=mixHex('#56398a','#bba3e6',Math.min(1,t*.85+r()*.25));g.beginPath();g.ellipse(fx-1.1,fy,s,s*1.25,0,0,TAU);g.fill();g.beginPath();g.ellipse(fx+1.1,fy-.7,s,s*1.25,0,0,TAU);g.fill();}
    g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(tx+Math.cos(a)*sl*.7-.6,ty+Math.sin(a)*sl*.7,0.8,0,TAU);g.fill();}
  return {c,w,h};}
function paintRosemary(seed){const r=mulberry(seed),w=50,h=50,{c,g}=mk(w,h),bx=w/2,by=h-3;
  g.fillStyle='rgba(60,80,50,.18)';g.beginPath();g.ellipse(bx,by,17,4,0,0,TAU);g.fill();
  const n=12+(r()*5|0);
  for(let i=0;i<n;i++){const a=-Math.PI/2+(r()-.5)*1.5,L=22+r()*20,tx=bx+Math.cos(a)*L,ty=by+Math.sin(a)*L;
    g.strokeStyle='#5c6e44';g.lineWidth=1;g.beginPath();g.moveTo(bx+(r()-.5)*5,by);g.lineTo(tx,ty);g.stroke();
    for(let k=2;k<14;k++){const t=k/14,px=bx+(tx-bx)*t,py=by+(ty-by)*t,na=a+(k%2?1:-1)*(1.0+r()*.3);
      g.strokeStyle=r()<.5?'#3f6b44':'#5f8a58';g.lineWidth=1.1;g.beginPath();g.moveTo(px,py);g.lineTo(px+Math.cos(na)*4.5,py+Math.sin(na)*4.5);g.stroke();}
    if(r()<.25){g.fillStyle='#a9c2ef';g.beginPath();g.arc(tx,ty,1.6,0,TAU);g.fill();}}
  return {c,w,h};}
function paintSage(seed){const r=mulberry(seed),w=52,h=40,{c,g}=mk(w,h),bx=w/2,by=h-4;
  g.fillStyle='rgba(60,80,50,.2)';g.beginPath();g.ellipse(bx,by,20,4.5,0,0,TAU);g.fill();
  const n=16+(r()*6|0),cols=['#8fa98a','#a3b99a','#b6c8a9','#7f9a7b'];
  for(let i=0;i<n;i++){const t=i/n,a=Math.PI+t*Math.PI+(r()-.5)*.3,L=12+r()*8;leaf(g,bx+(r()-.5)*4,by-2-r()*6,L,4+r()*1.5,a,cols[(r()*4)|0],true,'rgba(240,248,230,.55)');}
  for(let i=0;i<6;i++){const a=-Math.PI/2+(r()-.5)*1.2;leaf(g,bx,by-6,10+r()*5,3.6,a,cols[(r()*4)|0],true,'rgba(240,248,230,.55)');}
  return {c,w,h};}
function paintMint(seed){const r=mulberry(seed),w=48,h=44,{c,g}=mk(w,h),bx=w/2,by=h-3;
  g.fillStyle='rgba(60,80,50,.2)';g.beginPath();g.ellipse(bx,by,18,4,0,0,TAU);g.fill();
  const cols=['#5f9e46','#76b553','#8cc864','#4f8a3e'];
  for(let s=0;s<6;s++){const a=-Math.PI/2+(s/5-.5)*1.3+(r()-.5)*.2,L=16+r()*12,tx=bx+Math.cos(a)*L,ty=by+Math.sin(a)*L;
    g.strokeStyle='#4f7a3c';g.lineWidth=1;g.beginPath();g.moveTo(bx,by);g.lineTo(tx,ty);g.stroke();
    for(let k=1;k<=3;k++){const t=k/3.2,px=bx+(tx-bx)*t,py=by+(ty-by)*t;leaf(g,px,py,7+r()*2,3.6,a-1.2,cols[(r()*4)|0],true,'rgba(30,70,30,.5)');leaf(g,px,py,7+r()*2,3.6,a+1.2,cols[(r()*4)|0],true,'rgba(30,70,30,.5)');}
    leaf(g,tx,ty,6,3.2,a,cols[2],true);}
  return {c,w,h};}
function paintRose(seed){const r=mulberry(seed),w=78,h=66,{c,g}=mk(w,h),bx=w/2,by=h-4;
  g.fillStyle='rgba(50,70,40,.24)';g.beginPath();g.ellipse(bx,by,30,6,0,0,TAU);g.fill();
  const cols=['#3f6b3c','#4f7f45','#5f9150','#365f36'];
  for(let i=0;i<150;i++){const a=r()*TAU,d=Math.sqrt(r()),x=bx+Math.cos(a)*d*30,y=by-24+Math.sin(a)*d*21;if(y>by-2)continue;
    const lit=(y<by-30&&x<bx+8);leaf(g,x,y,5+r()*3,2.5,r()*TAU,lit?'#79a65e':cols[(r()*4)|0],r()<.35);}
  const roses=[];const n=7+(r()*4|0);
  for(let i=0;i<n;i++){const a=r()*TAU,d=Math.sqrt(r())*.9,x=bx+Math.cos(a)*d*26,y=by-26+Math.sin(a)*d*17,s=3.2+r()*1.6;roses.push([x,y,s]);}
  roses.sort((p,q)=>p[1]-q[1]);
  for(const [x,y,s] of roses){g.fillStyle='#f3a3bf';g.beginPath();g.arc(x,y,s,0,TAU);g.fill();
    g.fillStyle='#fbd0de';g.beginPath();g.arc(x-s*.25,y-s*.3,s*.6,0,TAU);g.fill();
    g.strokeStyle='#d0688f';g.lineWidth=.8;g.beginPath();g.arc(x,y,s*.55,.4,4.4);g.stroke();g.beginPath();g.arc(x+.3,y+.2,s*.25,1,5.5);g.stroke();
    g.strokeStyle='rgba(120,40,70,.45)';g.lineWidth=.5;g.beginPath();g.arc(x,y,s,0,TAU);g.stroke();}
  for(let i=0;i<4;i++){const a=r()*TAU,x=bx+Math.cos(a)*24,y=by-26+Math.sin(a)*16;g.fillStyle='#e07a9e';g.beginPath();g.ellipse(x,y,1.6,2.4,a,0,TAU);g.fill();}
  return {c,w,h};}
// magic blossoms: tall arching stems hung with glowing bells; bells are glowed again at runtime
function paintMagic(seed,hue){const r=mulberry(seed),w=50,h=78,{c,g}=mk(w,h),bx=w/2,by=h-3;const bells=[];
  const col=hue===0?['#bff3ff','#6fd2f2']:hue===1?['#ecd9ff','#b58cf0']:['#ffe0f0','#f39ac4'];
  g.fillStyle='rgba(60,80,50,.2)';g.beginPath();g.ellipse(bx,by,15,4,0,0,TAU);g.fill();
  grassBase(g,r,bx,by,12,['#6b8f5a','#82a86b'],1.6,12);
  for(let s=0;s<3;s++){const a=-Math.PI/2+(s-1)*.38+(r()-.5)*.2,L=48+r()*20;const tx=bx+Math.cos(a)*L,ty=by+Math.sin(a)*L;
    g.strokeStyle='#5e8a52';g.lineWidth=1.2;g.beginPath();g.moveTo(bx,by);g.quadraticCurveTo(bx+Math.cos(a)*L*.5,by+Math.sin(a)*L*.7,tx,ty);g.stroke();
    leaf(g,bx+Math.cos(a)*L*.3,by+Math.sin(a)*L*.3,9,3,a+.9,'#78a462');
    for(let k=0;k<4;k++){const t=.55+k*.13,px=bx+(tx-bx)*t+(k%2?3:-3),py=by+(ty-by)*t;
      g.strokeStyle='#5e8a52';g.lineWidth=.6;g.beginPath();g.moveTo(px,py-1);g.lineTo(px,py+3);g.stroke();
      const grd=g.createRadialGradient(px-1,py+3,.5,px,py+5,4.5);grd.addColorStop(0,'#ffffff');grd.addColorStop(.4,col[0]);grd.addColorStop(1,col[1]);g.fillStyle=grd;
      g.beginPath();g.moveTo(px-3.4,py+7);g.quadraticCurveTo(px-3.6,py+2,px,py+2);g.quadraticCurveTo(px+3.6,py+2,px+3.4,py+7);g.quadraticCurveTo(px,py+6,px-3.4,py+7);g.fill();
      g.strokeStyle='rgba(60,60,90,.35)';g.lineWidth=.5;g.stroke();bells.push([px-bx,py+5-by]);}}
  return {c,w,h,bells,glow:hue===0?'170,235,255':hue===1?'215,190,255':'255,190,220'};}
function paintDelphinium(seed){const r=mulberry(seed),w=40,h=92,{c,g}=mk(w,h),bx=w/2,by=h-3;const bells=[];
  grassBase(g,r,bx,by,14,['#6b8f5a','#82a86b','#5a7f4c'],1.4,14);
  for(let s=0;s<2;s++){const ox=(s?5:-4),L=70+r()*16;g.strokeStyle='#5e8a52';g.lineWidth=1.3;g.beginPath();g.moveTo(bx+ox*.3,by);g.lineTo(bx+ox,by-L);g.stroke();
    for(let k=0;k<12;k++){const t=k/11,y=by-L*.35-L*.62*t,x=bx+ox+(k%2?2.5:-2.5)*(1-t*.6),sz=3.4-t*1.8;g.fillStyle=mixHex('#4f6fd0','#b9cdfa',t*.7+r()*.2);
      for(let p=0;p<5;p++){const a=p/5*TAU;g.beginPath();g.arc(x+Math.cos(a)*sz*.6,y+Math.sin(a)*sz*.6,sz*.55,0,TAU);g.fill();}
      g.fillStyle='#fff6c8';g.beginPath();g.arc(x,y,.7,0,TAU);g.fill();if(k%3===0)bells.push([x-bx,y-by]);}}
  return {c,w,h,bells,glow:'180,200,255'};}
const PLANTS={};
function paintPlants(){
  PLANTS.lavender=[1,2,3,4].map(paintLavender);PLANTS.rosemary=[5,6,7].map(paintRosemary);PLANTS.sage=[8,9,10].map(paintSage);
  PLANTS.mint=[11,12,13].map(paintMint);PLANTS.rose=[14,15,16,17].map(paintRose);
  PLANTS.magic=[paintMagic(21,0),paintMagic(22,1),paintMagic(23,2),paintMagic(24,0)];PLANTS.delph=[paintDelphinium(31),paintDelphinium(32)];}

/* ---------- estate objects (y-sorted with everything else) ---------- */
const ESTATE=[];const OBST=[];
function placeEstate(){
  ESTATE.length=0;OBST.length=0;buildRows();paintPlants();
  // the cottage, drawn in four depth slices so Lum tucks behind the right part of it
  for(const [sa,sb,front] of [[316,548,645],[548,770,652],[770,925,648],[925,1180,666]]){ESTATE.push({t:'hslice',a:sa,b:sb,x:hx((sa+sb)/2),y:hy(front)-5});
    OBST.push({k:'rect',x0:hx(sa)-(sa===316?14:12),x1:hx(Math.min(sb,1172))+12,y0:hy(360),y1:hy(front)});}
  ESTATE.push({t:'img',img:'well2',x:WELL.x,y:WELL.y,ax:.5,ay:.982,s:WELL_S});
  OBST.push({k:'rect',x0:WELL.x-94,x1:WELL.x+94,y0:WELL.y-74,y1:WELL.y+6});OBST.push({k:'ell',x:WELL.x,y:WELL.y-34,rx:104,ry:44});
  const tree=(t,x,y,s_,flip,img)=>{if(t==='birch'){const es=s_*(img==='birch1'?1:1.3);ESTATE.push({t,img,x,y,s:es,flip,ph:hash(x|0,y|0,821)*TAU});OBST.push({k:'ell',x,y:y-8*es,rx:70*es,ry:26*es});}
    else{ESTATE.push({t,x,y,s:s_,flip,ph:hash(x|0,y|0,831)*TAU});OBST.push({k:'ell',x,y:y-10*s_,rx:80*s_,ry:30*s_});}};
  const shrub=(x,y,i,sc=1,talk=true)=>{const sh=SHR[i];ESTATE.push({t:'shrub',k:i,x,y,s:sh.s*sc,flip:hash(x|0,y|0,841)<.5,ph:hash(x|0,y|0,842)*TAU});
    const im=IMG['shrub'+i],w=(ready(im)?im.naturalWidth:260)*sh.s*sc;OBST.push({k:'ell',x,y:y-4,rx:Math.max(18,w*.17),ry:Math.max(8,w*.07)});if(talk)INTERACTABLES.push({x,y,reach:72,onInteract:()=>say(sh.l)});};
  const rock=(img,x,y,s_)=>{ESTATE.push({t:'img',img,x,y,ax:.5,ay:.72,s:s_,shadow:1,flip:hash(x|0,y|0,861)<.5});const w=(IMG[img]&&IMG[img].naturalWidth||150)*s_;OBST.push({k:'ell',x,y:y-4,rx:w*.36,ry:w*.15});};
  INTERACTABLES.length=0;
  // trees ring the cottage and frame the clearing
  tree('willow',-800,30,.74,0);tree('birch',-400,-80,.8,1,'birch3');tree('birch',600,-95,.85,0,'birch2');tree('willow',990,-40,.66,1);tree('willow',660,-40,.6,0);tree('birch',940,120,.7,1,'birch3');tree('birch',980,260,.48,0,'birch1');
  tree('birch',-830,330,.52,0,'birch1');tree('willow',-820,640,.7,1);tree('birch',-800,930,.88,0,'birch2');tree('birch',-840,1200,.5,1,'birch1');tree('willow',-790,1460,.68,0);
  tree('birch',920,330,.86,1,'birch3');tree('willow',930,640,.68,0);tree('birch',880,950,.5,1,'birch1');tree('birch',850,1260,.86,0,'birch2');tree('willow',760,1460,.62,1);
  tree('birch',560,330,.7,0,'birch2');tree('birch',740,1330,.48,0,'birch1');tree('willow',-430,1480,.56,1);tree('birch',-180,1390,.78,1,'birch3');
  // hedges of potion shrubs close the west, east and south edges
  {let k=0;const RK=['rock1','rock2','rock3','rock4'];const hedge=(x,y)=>{k++;if(hash(k,9,811)<.22){const img=RK[(hash(k,10,811)*4)|0];ESTATE.push({t:'img',img,x:x+(hash(k,2,811)-.5)*30,y:y+20,ax:.5,ay:.72,s:.8+hash(k,4,811)*.4,shadow:1,flip:hash(k,5,811)<.5});return;}const i=(hash(k,7,811)*SHR.length)|0;ESTATE.push({t:'shrub',k:i,x:x+(hash(k,2,811)-.5)*36,y:y+(hash(k,3,811)-.5)*24,s:SHR[i].s*(1.15+hash(k,4,811)*.3),flip:hash(k,5,811)<.5,ph:hash(k,8,811)*TAU});};
    for(let y=120;y<=1560;y+=70){hedge(-960,y);hedge(-1030,y+35);hedge(1070,y);hedge(1140,y+35);}
    for(let x=-1000;x<=1160;x+=80){if(Math.abs(x)>60){hedge(x,1600);}hedge(x+40,1660);}
    // a big bush right across the path south; the blade cuts it away with the hedge
    ESTATE.push({t:'shrub',k:1,x:20,y:1612,s:SHR[1].s*1.35,flip:false,ph:1.3});
    for(let x=-1000;x<=-700;x+=60){hedge(x,-60);}}
  // herb beds either side of the path, with a potion shrub at the end of each row
  let seed=100;
  for(const r of ROWS){const step=r.kind==='lavender'?30:r.kind==='magic'?36:32;
    for(let L=8;L<r.L;L+=step){seed++;const j=hash(seed,1,7),x=r.ax+r.d[0]*L+(hash(seed,2,7)-.5)*6,y=r.ay+(hash(seed,3,7)-.5)*6;
      const set=PLANTS[r.kind];ESTATE.push({t:'plant',kind:r.kind,spr:set[(j*set.length)|0],x,y,ph:hash(seed,4,7)*TAU,flip:hash(seed,5,7)<.5,s:.9+hash(seed,6,7)*.25});}
    OBST.push({k:'rect',x0:Math.min(r.ax,r.ax+r.d[0]*r.L)-4,x1:Math.max(r.ax,r.ax+r.d[0]*r.L)+4,y0:r.ay-20,y1:r.ay+8});}
  ROWS.forEach((r,i)=>shrub(r.ax+r.d[0]*(r.L+48),r.ay+6,[3,0,5,11,4,2,6,7,8,9,10,1][i],.9));
  const HERB={lavender:"Lavender. Master Lum puts it in my pillow so I stop talking in my sleep.",rosemary:"Rosemary, for remembering. She sneaks it into my tea before lessons. I can tell.",sage:"Silver sage. It smells like rain and old books.",mint:"Moonmint. The tips are all nibbled… the slimes were definitely here!",magic:"Bellglow blossoms. Master says if you pick them, the light goes out. So no picking."};
  ROWS.forEach(r=>INTERACTABLES.push({x:r.ax+r.d[0]*20,y:r.ay+4,reach:58,onInteract:()=>say(HERB[r.kind])}));
  // roses line the path south, the shop sign greets visitors
  for(let y=540;y<=1420;y+=96)for(const sd of [-1,1]){const x=sd*70+(hash(y,sd+2,881)-.5)*8;if(inPond(x,y,-30))continue;ESTATE.push({t:'plant',kind:'rose',spr:PLANTS.rose[((y/96)|0)%4],x,y,ph:y*.01,flip:sd>0,s:.95});}
  // a few potion shrubs, flowers and rocks through the meadow and by the water
  for(const [x,y,i] of [[-300,560,10],[300,580,7],[-180,700,4],[200,760,11],[-420,820,6],[460,860,0],[-250,1150,8],[140,1230,3],[560,1300,5],[-620,1060,2]])shrub(x,y,i);
  const side=[[640,330,'magic'],[680,250,'delph'],[250,700,'magic'],[-640,120,'delph'],[-470,60,'magic'],[-680,200,'magic'],[480,70,'delph'],[540,110,'magic'],[640,180,'delph'],[220,1050,'magic'],[560,1060,'delph'],[600,1180,'magic'],[200,1180,'delph']];
  side.forEach(([x,y,k],i)=>{if(onPath(x,y,26)||inPond(x,y,-14))return;const set=PLANTS[k];ESTATE.push({t:'plant',kind:k,spr:set[i%set.length],x,y,ph:i*2.3,flip:i%2===0,s:1});});
  rock('rock2',-700,420,.8);rock('rock3',735,108,.6);rock('rock1',880,30,.55);shrub(600,70,5,.9);shrub(900,190,9,.95,false);rock('rock1',160,1120,.55);rock('rock4',560,1150,.7);rock('rock3',-600,1420,.75);rock('rock1',700,600,.5);shrub(330,600,2,.85);
  // Lum's little garden shed, tucked between the herb beds and the creek
  ESTATE.push({t:'img',img:'shed',x:530,y:560,ax:.5,ay:.912,s:0.7,shadow:1});
  OBST.push({k:'rect',x0:530-108,x1:530+152,y0:560-125,y1:560+18});OBST.push({k:'ell',x:530-150,y:560-6,rx:22,ry:10});OBST.push({k:'ell',x:530+140,y:560-8,rx:26,ry:12});
  INTERACTABLES.push({x:530-40,y:560+36,reach:70,onInteract:()=>goScene(()=>enterShed())});
  // drained shrubs: a few clues that the slimes have been feeding
  DRAINED.length=0;
  for(const [x,y,i,s_,line] of [[-440,500,1,.5,"This one's gone all pale and papery… like the magic got drunk right out of it. Slimes!"],
      [180,650,4,.48,"Fresh slime on the branches! Still sticky. And a shiny trail heading toward the pond…"],
      [-300,900,0,.5,"It's still humming, really faintly. There's a little magic left in the roots. Hang in there!"],
      [600,980,3,.48,"No berries, no color, nothing. Poor thing. I'll find whoever did this."],
      [-640,1300,9,.5,"Another one. They've been feeding all around the garden. This is a lot of slimes…"]]){
    const o={t:'shrub',img:'drained'+i,ax:DRN[i].ax,drips:DRN[i].d,x,y,s:s_,flip:hash(x|0,y|0,851)<.5,ph:hash(x|0,y|0,852)*TAU,drained:1,soaked:0};ESTATE.push(o);DRAINED.push(o);
    OBST.push({k:'ell',x,y:y-4,rx:34,ry:13});INTERACTABLES.push({x,y,reach:72,onInteract:()=>say(line)});}
  // the road south, and a marker where it meets the hedge
  INTERACTABLES.push({x:0,y:14,reach:95,onInteract:()=>tryEnterShop({x:0,y:52})});
  INTERACTABLES.push({x:hx(1040),y:14,reach:80,door:true,onInteract:()=>say("This door is shut by a powerful magic.")});
  INTERACTABLES.push({x:WELL.x,y:WELL.y-10,reach:130,onInteract:wellInteract});
  INTERACTABLES.push({x:20,y:1528,reach:95,hedge:1,onInteract:()=>{if(NIGHT.cut)return;
    if(!NIGHT.on){say("The road ends in a wall of thick hedges. Beyond them is the dark forest. Master Lum says the garden ends here for a reason.");return;}
    if(PARTY[HERO].main!=='blade'){say("The hedge is too thick to push through… The blade could cut it. I'd have to be holding it.");return;}
    cutHedge();}});
  INTERACTABLES.push({x:720,y:40,reach:90,onInteract:()=>say(["The stream comes all the way from the Whispering Wood. The water tastes a little like mint.","Master says never to follow the stream into the woods alone. So I won't. Probably."][(sayCount++)%2])});
  for(const a of [0,.8,1.6,2.4,3.2,4.0,4.71,5.5]){const x=POND.x+Math.cos(a)*(POND.rx*pondR(a)+26),y=POND.y+Math.sin(a)*(POND.ry*pondR(a)+22);INTERACTABLES.push({x,y,reach:84,onInteract:()=>pondInteract(x,y)});}
}
let sayCount=0,wishCount=0,wellMagic=0;
/* Lum's potion shrubs: name, how she uses it, trunk anchor and a scale that sets their height in the world */
const DRN=[{ax:.511,d:[[234,193],[230,183]]},{ax:.591,d:[[166,273],[42,213],[78,60],[288,54]]},{ax:.511,d:[]},{ax:.428,d:[[282,141],[278,116]]},{ax:.544,d:[[368,230],[92,226],[13,145]]},
  {ax:.476,d:[]},{ax:.447,d:[]},{ax:.636,d:[]},{ax:.471,d:[]},{ax:.486,d:[]}];
const DRAINED=[];let slugTalk=0;
const SLUG_LINES=["A slug! Ew… no, wait. It's kind of sparkly. Shoo! Leave Master's lettuce alone!","It pulled its eyes in. Are you sulking? You can't sulk, you're the one eating everything!","So shimmery… Are slugs supposed to glow? Something's strange about this garden.","Mister Slug, have you seen any slimes? …He's not talking.","Look at that trail. It goes right past the moonmint. Suspicious."];
const SHR=[
 {n:'Dewleaf',l:"Dewleaf. The blue berries are always wet with dew, even at noon. Is that magic? It has to be magic.",ax:.494,s:.6},
 {n:'Sighbush',l:"Sighbush. If you listen close, it sighs when the wind blows. Hello, bush.",ax:.477,s:.62},
 {n:'Cloudtier',l:"Cloudtier. Master dries the blossoms into a powder lighter than air. I sneezed once and it went everywhere.",ax:.488,s:.58},
 {n:'Silvermint',l:"Silvermint. One leaf in the kettle and the whole shop smells like spring.",ax:.525,s:.58},
 {n:'Emberberry',l:"Emberberries! Warm to the touch. I burned my tongue on one last week. Never again. …Maybe once more.",ax:.482,s:.56},
 {n:'Heartvine',l:"Heartvine. The little heart leaves go into friendship charms. I should make one for Master Lum.",ax:.447,s:.68},
 {n:'Duskberry',l:"Duskberries only ripen at twilight. Somebody ate half of them. Somebody slimy.",ax:.521,s:.56},
 {n:'Starjuniper',l:"Starjuniper. Blue berries for seeing in the dark, red ones for courage. I could use a red one right now.",ax:.503,s:.66},
 {n:'Sugarplum spruce',l:"Sugarplum spruce. The pink berries taste like candy. I'm not supposed to eat them. I've eaten some.",ax:.483,s:.56},
 {n:'Lanternpine',l:"Lanternpine. At night the berries glow like tiny lanterns. It's my favorite.",ax:.494,s:.66},
 {n:'Whisperbranch',l:"Whisperbranch. Master says these twigs make the best wands. For when I'm ready. Someday.",ax:.483,s:.56},
 {n:'Rubyclover',l:"Rubyclover. Crushed, it makes the reddest ink in the world. I stained my sleeve with it. Twice.",ax:.53,s:.62}];

/* ---------- collisions for the cottage grounds ---------- */
function solveEstate(x,y){for(const o of OBST){
    if(o.k==='rect'){if(x>o.x0&&x<o.x1&&y>o.y0&&y<o.y1){const d=[x-o.x0,o.x1-x,y-o.y0,o.y1-y],m=Math.min(...d);if(m===d[0])x=o.x0;else if(m===d[1])x=o.x1;else if(m===d[2])y=o.y0;else y=o.y1;}}
    else{const dx=(x-o.x)/o.rx,dy=(y-o.y)/o.ry,d=Math.hypot(dx,dy);if(d<1&&d>0){x=o.x+dx/d*o.rx;y=o.y+dy/d*o.ry;}}}
  return [x,y];}

/* ---------- painted ground: cobbles, garden soil, side stepping stones ---------- */
const EST={x0:-470,y0:-90,x1:1035,y1:1565};let estCv=null,estR=0;
function buildEstateGround(R){estR=R;const w=EST.x1-EST.x0,h=EST.y1-EST.y0;const c=document.createElement('canvas');c.width=Math.ceil(w*R);c.height=Math.ceil(h*R);const g=c.getContext('2d');
  g.setTransform(R,0,0,R,-EST.x0*R,-EST.y0*R);g.lineCap='round';g.lineJoin='round';const r=mulberry(77);
  const soft=(k,fn)=>{const s=document.createElement('canvas');s.width=Math.ceil(w*R*k);s.height=Math.ceil(h*R*k);const q=s.getContext('2d');q.setTransform(R*k,0,0,R*k,-EST.x0*R*k,-EST.y0*R*k);fn(q);g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingQuality='high';g.drawImage(s,0,0,c.width,c.height);g.restore();};
  // garden soil beds, each a soft earthy furrow
  soft(.25,q=>{for(const row of ROWS){q.strokeStyle='rgba(96,78,48,.55)';q.lineWidth=46;q.beginPath();q.moveTo(row.ax,row.ay);q.lineTo(row.ax+row.d[0]*row.L,row.ay+row.d[1]*row.L);q.stroke();}
    });
  for(const row of ROWS){const n=Math.ceil(row.L/6);
    for(const [wd,col] of [[30,'#7d6142'],[22,'#94744e'],[8,'#6a5036']]){g.fillStyle=col;g.beginPath();
      for(let k=0;k<=n;k++){const L=k*6,x=row.ax+row.d[0]*L,y=row.ay+row.d[1]*L,ww=wd/2*(1+.18*Math.sin(L*.13+row.ay)+.1*(r()-.5));g.lineTo(x+row.n[0]*ww,y+row.n[1]*ww);}
      for(let k=n;k>=0;k--){const L=k*6,x=row.ax+row.d[0]*L,y=row.ay+row.d[1]*L,ww=wd/2*(1+.18*Math.sin(L*.11+row.ax)+.1*(r()-.5));g.lineTo(x-row.n[0]*ww,y-row.n[1]*ww);}
      g.closePath();g.fill();}
    for(let k=0;k<row.L/4;k++){const L=r()*row.L,s=(r()-.5)*24,x=row.ax+row.d[0]*L+row.n[0]*s,y=row.ay+row.d[1]*L+row.n[1]*s;g.fillStyle=r()<.5?'rgba(170,140,100,.6)':'rgba(70,52,34,.5)';g.beginPath();g.ellipse(x,y,1+r()*1.6,.8+r(),0,0,TAU);g.fill();}
    // grass creeping over the bed edges
    for(let k=0;k<row.L/3;k++){const L=r()*row.L,side=r()<.5?-1:1,s=side*(13+r()*5),x=row.ax+row.d[0]*L+row.n[0]*s,y=row.ay+row.d[1]*L+row.n[1]*s,a=-Math.PI/2+(r()-.5)*1.2,len=4+r()*7;
      g.strokeStyle=r()<.5?'#6f9a4f':'#9cc070';g.lineWidth=1.2;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+Math.cos(a)*len*.5,y+Math.sin(a)*len*.6,x+Math.cos(a)*len,y+Math.sin(a)*len);g.stroke();}}
  // cobbled path: a mossy bed with stones laid along each stretch, thinning out where the dirt road begins
  soft(.25,q=>{q.strokeStyle='rgba(84,92,58,.45)';q.lineCap='round';q.lineJoin='round';q.lineWidth=72;for(const P of PATHS){q.beginPath();P.forEach(([x,y],i)=>i?q.lineTo(x,y):q.moveTo(x,y));q.stroke();}
    q.fillStyle='rgba(84,92,58,.4)';q.beginPath();q.ellipse(0,22,96,30,0,0,TAU);q.fill();});
  // the mossy rune cobblestones, laid as a continuous strip along each stretch of path
  const cob=IMG.cobble_strip;EST_COBBLE=ready(cob);
  if(EST_COBBLE)for(const P of PATHS){const sm=COB_SMP[PATHS.indexOf(P)];drawStrip(g,cob,sm,true);}
  // a little round landing of stones at the doorstep
  const stones=[];for(let i=0;i<40;i++){const a_=r()*TAU,d=Math.sqrt(r());stones.push([Math.cos(a_)*d*66,20+Math.sin(a_)*d*18,5.5+r()*2.5]);}
  stones.sort((p,q)=>p[1]-q[1]);
  soft(.3,q=>{q.fillStyle='rgba(98,128,70,.85)';q.beginPath();q.ellipse(0,22,82,28,0,0,TAU);q.fill();});
  for(const [x,y,s_] of stones){const rx=s_*(1+(r()-.5)*.35),ry=s_*.68*(1+(r()-.5)*.3),rot=(r()-.5)*.8;
    g.fillStyle='rgba(50,48,36,.35)';g.beginPath();g.ellipse(x+.8,y+1.4,rx,ry,rot,0,TAU);g.fill();
    g.fillStyle=['#cfccc4','#bdbab4','#d8d5cc','#aaa8a2'][(r()*4)|0];g.beginPath();g.ellipse(x,y,rx,ry,rot,0,TAU);g.fill();
    g.strokeStyle='rgba(60,60,56,.6)';g.lineWidth=.8;g.beginPath();g.ellipse(x,y,rx,ry,rot,0,TAU);g.stroke();}
  soft(.35,q=>{q.fillStyle='rgba(40,60,30,.38)';q.beginPath();q.ellipse(530+25,560-22,165,42,0,0,TAU);q.fill();
    q.fillStyle='rgba(150,128,88,.35)';q.beginPath();q.ellipse(530-50,560+22,60,20,0,0,TAU);q.fill();});
  for(const [x,y,s_] of [[530-62,560+42,9],[530-96,560+64,8],[530-140,560+80,8.5],[530-186,560+92,7.5],[530-232,560+98,8]]){const rx=s_*1.5,ry=s_*.85,rot=(r()-.5)*.6;
    g.fillStyle='rgba(50,48,36,.35)';g.beginPath();g.ellipse(x+1,y+1.6,rx,ry,rot,0,TAU);g.fill();g.fillStyle=['#cfccc4','#bdbab4','#d8d5cc'][(r()*3)|0];g.beginPath();g.ellipse(x,y,rx,ry,rot,0,TAU);g.fill();
    g.strokeStyle='rgba(60,60,56,.6)';g.lineWidth=.8;g.stroke();g.fillStyle='rgba(110,150,70,.5)';g.beginPath();g.ellipse(x-rx*.5,y+ry*.4,rx*.35,ry*.3,0,0,TAU);g.fill();}
  // glistening slime trails winding through the beds: the culprits have been here
  for(const [sx0,sy0,len,seedA] of [[-380,500,150,1],[180,540,140,2],[-250,640,130,3],[300,640,120,4]]){const rs=mulberry(seedA*99);let x=sx0,y=sy0,a=rs()*TAU;
    for(let k=0;k<len;k+=3){a+=(rs()-.5)*.5;x+=Math.cos(a)*3;y+=Math.sin(a)*2;const wd=4+Math.sin(k*.08)*1.5;
      g.fillStyle='rgba(120,210,170,.22)';g.beginPath();g.ellipse(x,y,wd,wd*.55,a,0,TAU);g.fill();
      if(k%9===0){g.fillStyle='rgba(235,255,245,.55)';g.beginPath();g.ellipse(x-1,y-1,1.4,.8,a,0,TAU);g.fill();}
      if(rs()<.04){g.fillStyle='rgba(150,230,190,.35)';g.beginPath();g.arc(x+(rs()-.5)*8,y+(rs()-.5)*5,1.8,0,TAU);g.fill();}}}
  // tiny flowers and clover tucked between the stones
  for(let i=0;i<70;i++){const P=PATHS[i%PATHS.length],sm=pathSamples(P,10),pt=sm[(r()*sm.length)|0],x=pt[0]+(r()-.5)*50,y=pt[1]+(r()-.5)*20;g.fillStyle=r()<.5?'#fff6dc':r()<.5?'#9ab8ee':'#f6d266';g.beginPath();g.arc(x,y,1.1,0,TAU);g.fill();}
  estCv=c;}

/* strip mapping: the straightened walkway texture follows the path's curve */
let EST_COBBLE=false;const COB_W=78,COB_PX=240/COB_W;
function smoothPath(P){let pts=P.map(p=>[p[0],p[1]]);for(let it=0;it<4;it++){const n=[pts[0]];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];n.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}n.push(pts[pts.length-1]);pts=n;}
  const out=[];let s=0;for(let i=0;i<pts.length;i++){if(i)s+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;out.push({x:pts[i][0],y:pts[i][1],s,tx:(b[0]-a[0])/l,ty:(b[1]-a[1])/l});}
  const res=[];const step=3;let j=0;for(let d=0;d<=s;d+=step){while(j<out.length-2&&out[j+1].s<d)j++;const A=out[j],B=out[j+1],t=(d-A.s)/((B.s-A.s)||1);res.push({x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t,s:d,tx:A.tx+(B.tx-A.tx)*t,ty:A.ty+(B.ty-A.ty)*t});}return res;}
const COB_SMP=PATHS.map(smoothPath);
function drawStrip(g,img,sm,fadeEnd){const TH=img.naturalHeight,L=sm[sm.length-1].s;
  for(let i=0;i<sm.length-1;i++){const p=sm[i],q=sm[i+1],seg=q.s-p.s;let v=(p.s*COB_PX)%TH,hpx=Math.max(1,seg*COB_PX)+1.5;if(v+hpx>TH)v=TH-hpx;
    const a=fadeEnd?Math.max(0,Math.min(1,(L-p.s)/110)):1;if(a<=0)continue;g.save();g.globalAlpha=a;g.translate(p.x,p.y);g.rotate(Math.atan2(p.ty,p.tx)-Math.PI/2);
    g.drawImage(img,0,v,img.naturalWidth,hpx,-COB_W/2,0,COB_W,hpx/COB_PX+.4);g.restore();}}
/* the runes wake as Lum walks over them */
function drawRuneGlow(){const im=IMG.cobble_runes;if(!ready(im))return;const TH=im.naturalHeight;ctx.save();ctx.globalCompositeOperation='lighter';
  for(let k=0;k<COB_SMP.length;k++){const sm=COB_SMP[k],L=sm[sm.length-1].s;for(let i=0;i<sm.length-1;i+=1){const p=sm[i];const d=Math.hypot(p.x-lum.x,p.y-lum.y);if(d>150)continue;
    const q=sm[i+1],seg=q.s-p.s;let v=(p.s*COB_PX)%TH,hpx=Math.max(1,seg*COB_PX)+1.5;if(v+hpx>TH)v=TH-hpx;const fade=Math.max(0,Math.min(1,(L-p.s)/110));
    ctx.globalAlpha=Math.min(1,Math.pow(1-d/150,1.2)*(1+.35*Math.sin(T*2.2+p.s*.03))*fade);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.ty,p.tx)-Math.PI/2);
    ctx.drawImage(im,0,v,im.naturalWidth,hpx,-COB_W/2,0,COB_W,hpx/COB_PX+.4);ctx.restore();}}
  ctx.restore();}
/* ---------- the dirt road south, painted in chunks ---------- */
const DCH=480,DPAD=60;const dirtCache=new Map();
function buildDirtChunk(ci){const ya=ci*DCH-DPAD,yb=(ci+1)*DCH+DPAD;let mn=1e9,mx=-1e9;for(let y=ya;y<=yb;y+=8){mn=Math.min(mn,dX(y));mx=Math.max(mx,dX(y));}
  const x0=Math.floor(mn-80),w=Math.ceil(mx+80)-x0,h=yb-ya,R=riverR;const c=document.createElement('canvas');c.width=Math.ceil(w*R);c.height=Math.ceil(h*R);const g=c.getContext('2d');
  g.setTransform(R,0,0,R,-x0*R,-ya*R);g.lineCap='round';const r=mulberry(ci*31+7);
  const fadeIn=y=>Math.min(1,Math.max(0,(y-1410)/90));
  const edge=(y,s)=>dX(y)+s*(28+5*Math.sin(y/90)+4*Math.sin(y/23+s)+2*Math.sin(y/7.3+s*2));
  const s0=document.createElement('canvas');s0.width=Math.ceil(w*R*.25);s0.height=Math.ceil(h*R*.25);const q=s0.getContext('2d');q.setTransform(R*.25,0,0,R*.25,-x0*R*.25,-ya*R*.25);
  const qs=Math.max(ya,1400);if(qs<yb){const gr=q.createLinearGradient(0,qs,0,qs+140);gr.addColorStop(0,'rgba(92,86,54,0)');gr.addColorStop(1,'rgba(92,86,54,.4)');q.fillStyle=gr;q.beginPath();for(let y=qs;y<=yb;y+=8)q.lineTo(edge(y,-1)-10,y);for(let y=yb;y>=qs;y-=8)q.lineTo(edge(y,1)+10,y);q.closePath();q.fill();}
  g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingQuality='high';g.drawImage(s0,0,0,c.width,c.height);g.restore();
  g.globalAlpha=1;
  for(let y=ya;y<yb;y+=4){const a=fadeIn(y);if(a<=0)continue;g.globalAlpha=a;
    g.fillStyle='#a88d63';g.fillRect(edge(y,-1),y,edge(y,1)-edge(y,-1),4.5);}
  for(let y=ya;y<yb;y+=4){const a=fadeIn(y);if(a<=0)continue;g.globalAlpha=a*.55;g.fillStyle='#c2a87c';const m=dX(y);g.fillRect(m-14+Math.sin(y/40)*3,y,8,4.5);g.fillRect(m+6+Math.sin(y/37)*3,y,8,4.5);}
  g.globalAlpha=1;
  for(let i=0;i<220;i++){const y=ya+r()*h,a=fadeIn(y);if(a<=0)continue;const x=dX(y)+(r()-.5)*54;g.globalAlpha=a;g.fillStyle=r()<.5?'rgba(120,96,64,.6)':'rgba(214,196,160,.6)';g.beginPath();g.ellipse(x,y,1+r()*2.2,.8+r()*1.2,0,0,TAU);g.fill();}
  for(let i=0;i<260;i++){const y=ya+r()*h,a=fadeIn(y);if(a<=0)continue;const s=r()<.5?-1:1,x=edge(y,s)-s*r()*6,ang=-Math.PI/2+(r()-.5)*1.2,len=4+r()*8;g.globalAlpha=a;
    g.strokeStyle=r()<.5?'#6f9a4f':'#9cc070';g.lineWidth=1.2;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+Math.cos(ang)*len*.5,y+Math.sin(ang)*len*.6,x+Math.cos(ang)*len,y+Math.sin(ang)*len);g.stroke();}
  g.globalAlpha=1;return {cv:c,x0,w};}
function drawDirt(y0,y1){y0=Math.max(y0,1380);if(y1<y0)return;for(let ci=Math.floor(y0/DCH);ci<=Math.floor(y1/DCH);ci++){let c=dirtCache.get(ci);if(!c){c=buildDirtChunk(ci);dirtCache.set(ci,c);if(dirtCache.size>8)dirtCache.delete(dirtCache.keys().next().value);}
  ctx.drawImage(c.cv,0,DPAD*riverR,c.cv.width,DCH*riverR,c.x0,ci*DCH,c.w,DCH);}}

/* ---------- drawing estate pieces ---------- */
function drawHouse(o){const im=IMG.cottage;if(!ready(im))return;const sw=im.naturalWidth,sh=im.naturalHeight;
  const a=o.a-316,b=o.b-316,pad=o.a===316?0:.6;const dx=HOUSE.x+a*HS-pad,dw=(b-a)*HS+pad*2;
  ctx.globalAlpha=HOUSE.fade;ctx.drawImage(im,a-pad/HS,0,(b-a)+pad*2/HS,sh,dx,HOUSE.y,dw,sh*HS);
  ctx.globalCompositeOperation='lighter';
  if(ready(IMG.cottage_win)){ctx.globalAlpha=HOUSE.fade*(.32+.1*Math.sin(T*2.7)*Math.sin(T*1.3+1));ctx.drawImage(IMG.cottage_win,a,0,b-a,sh,HOUSE.x+a*HS,HOUSE.y,(b-a)*HS,sh*HS);}
  if(ready(IMG.cottage_runes)){ctx.globalAlpha=HOUSE.fade*(.45+.35*Math.sin(T*1.4));ctx.drawImage(IMG.cottage_runes,a,0,b-a,sh,HOUSE.x+a*HS,HOUSE.y,(b-a)*HS,sh*HS);}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;}
/* birches come alive: the crown bends from the roots up, glints twinkle, petals drift down */
const BIRCH_VAR={birch2:{ax:.53,gl:[[106,77],[251,79],[256,102],[180,200],[213,216],[188,10],[49,224],[262,86],[188,39],[285,130],[210,228],[175,186],[211,239],[74,153],[8,176],[103,168],[318,196],[196,142],[97,85],[301,70],[166,63],[282,122],[252,127],[62,126],[109,195],[92,257],[121,43]]},birch3:{ax:.524,gl:[[274,70],[250,72],[216,88],[265,181],[58,199],[243,26],[274,206],[71,78],[302,40],[31,114],[183,211],[356,166],[331,221],[101,131],[259,154],[243,5],[23,145],[330,177],[244,123],[289,64],[101,59],[180,105],[236,110],[341,108],[231,176],[191,242],[184,113],[135,43]]}};
const BIRCH_GLINTS=[[868,444],[612,316],[385,355],[530,388],[480,283],[853,307],[248,625],[244,157],[37,420],[445,108],[744,102],[185,601],[241,219],[846,240],[280,398],[298,183],[230,161],[343,538],[460,299],[580,72],[821,596],[92,401],[282,124],[323,138],[353,156],[284,465],[402,113],[703,224],[437,315],[230,318],[787,446],[449,23],[151,354],[609,330],[908,485],[246,295],[472,538],[355,471],[420,147],[428,78]],BIRCH_AX=.535;
function birchSway(o,t){return (wind(T,o.x,o.y)*22+Math.sin(T*.75+o.ph)*7+Math.sin(T*1.9+o.ph*2)*2)*(o.s/.5)*Math.pow(t,1.6);}
function drawBirch(o){const V=BIRCH_VAR[o.img]||{ax:BIRCH_AX,gl:BIRCH_GLINTS},BG=V.gl,AX=V.ax;const im=IMG[o.img||'birch1'];if(!ready(im))return;const iw=im.naturalWidth,ih=im.naturalHeight,s=o.s,w=iw*s,h=ih*s;
  const behind=lum.y<o.y-6&&lum.y>o.y-h*.92&&Math.abs(lum.x-o.x)<w*.42;o.fade=(o.fade??1)+((OCC|=behind,behind?1:1)-(o.fade??1))*.12;
  ctx.globalAlpha=.36;ctx.drawImage(glowCanvas('38,64,30'),o.x-w*.42,o.y-h*.06,w*.84,h*.13);
  ctx.save();ctx.globalAlpha=o.fade;ctx.translate(o.x,o.y);if(o.flip)ctx.scale(-1,1);
  const N=22;for(let i=0;i<N;i++){const sy=ih*i/N,sh=ih/N,t=1-(sy+sh/2)/ih,off=birchSway(o,t)*(o.flip?-1:1);
    ctx.drawImage(im,0,sy,iw,sh+1,-w*AX+off,-h+sy*s,w,sh*s+.8);}
  ctx.globalAlpha=o.fade;
  for(let i=0;i<BG.length;i++){const tw=Math.pow(Math.max(0,Math.sin(T*1.7+i*2.3+o.ph)),8);if(tw<.05)continue;const [gx,gy]=BG[i],t=1-gy/ih;
    const px=-w*AX+gx*s+birchSway(o,t)*(o.flip?-1:1),py=-h+gy*s;drawGlow(ctx,px,py,9,i%3?'255,235,250':'215,245,255',.7*tw);
    ctx.fillStyle=`rgba(255,255,255,${(.9*tw).toFixed(3)})`;ctx.beginPath();for(let k=0;k<8;k++){const a=k/8*TAU,r=k%2?.9:3.6*tw+1;ctx.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r);}ctx.closePath();ctx.fill();}
  ctx.restore();ctx.globalAlpha=1;
  if(Math.random()<.016&&Math.abs(o.x-cam.x)<W/zoom/2+200){const [gx,gy]=BG[(Math.random()*BG.length)|0];const px=o.x+(o.flip?-1:1)*(-w*AX+gx*s),pz=h-gy*s;
    PARTS.push({type:'bpetal',x:px,y:o.y+rnd(-20,30),z:pz,vx:rnd(-6,6),vy:0,vz:-rnd(10,18),life:0,max:14,s:rnd(2.4,3.6),rot:rnd(0,TAU),vr:rnd(-2.5,2.5),col:['#f6c6e6','#d9c4f7','#c6ecf2','#fbe3c4','#f3d0f0'][(Math.random()*5)|0]});}}
/* willows: the tree bends from the roots, and a slow wave rolls down the hanging curtains */
const WILLOW_GLINTS=[[462,45],[137,100],[271,453],[368,118],[596,387],[614,520],[259,501],[594,504],[700,306],[280,257],[426,76],[76,414],[206,226],[166,203],[183,135],[481,89],[605,214],[529,43],[416,309],[534,104],[687,312],[104,355],[505,82],[165,172],[273,48],[85,189],[586,389],[360,51],[424,168],[431,287],[571,383],[223,178],[427,132],[100,299],[261,305]],WILLOW_AX=.53;
function willowOff(o,t,yy){const sm=Math.min(1,Math.max(0,(t-.3)/.35));const sc=o.s/.6;
  return (wind(T,o.x,o.y)*18+Math.sin(T*.6+o.ph)*5)*sc*Math.pow(t,1.5)+Math.sin(T*1.25+o.ph-yy*.018)*4.2*sc*sm*sm;}
function drawWillow(o){const im=IMG.willow1;if(!ready(im))return;const iw=im.naturalWidth,ih=im.naturalHeight,s=o.s,w=iw*s,h=ih*s;
  const behind=lum.y<o.y-6&&lum.y>o.y-h*.95&&Math.abs(lum.x-o.x)<w*.45;o.fade=(o.fade??1)+((OCC|=behind,behind?1:1)-(o.fade??1))*.12;
  ctx.globalAlpha=.36;ctx.drawImage(glowCanvas('38,64,30'),o.x-w*.46,o.y-h*.1,w*.92,h*.2);
  ctx.save();ctx.globalAlpha=o.fade;ctx.translate(o.x,o.y);if(o.flip)ctx.scale(-1,1);const dir=o.flip?-1:1;
  const N=34;for(let i=0;i<N;i++){const sy=ih*i/N,sh=ih/N,t=1-(sy+sh/2)/ih,off=willowOff(o,t,sy)*dir;
    ctx.drawImage(im,0,sy,iw,sh+1,-w*WILLOW_AX+off,-h+sy*s,w,sh*s+.8);}
  for(let i=0;i<WILLOW_GLINTS.length;i++){const tw=Math.pow(Math.max(0,Math.sin(T*1.5+i*2.1+o.ph)),8);if(tw<.05)continue;const [gx,gy]=WILLOW_GLINTS[i],t=1-gy/ih;
    const px=-w*WILLOW_AX+gx*s+willowOff(o,t,gy)*dir,py=-h+gy*s;drawGlow(ctx,px,py,9,i%2?'225,255,235':'235,225,255',.65*tw);
    ctx.fillStyle=`rgba(255,255,255,${(.9*tw).toFixed(3)})`;ctx.beginPath();for(let k=0;k<8;k++){const a=k/8*TAU,r=k%2?.9:3.4*tw+1;ctx.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r);}ctx.closePath();ctx.fill();}
  ctx.restore();ctx.globalAlpha=1;
  if(Math.random()<.02&&Math.abs(o.x-cam.x)<W/zoom/2+220){const [gx,gy]=WILLOW_GLINTS[(Math.random()*WILLOW_GLINTS.length)|0];const px=o.x+(o.flip?-1:1)*(-w*WILLOW_AX+gx*s),pz=h-gy*s;
    PARTS.push({type:'bpetal',x:px,y:o.y+rnd(-30,30),z:pz*.7,vx:rnd(-6,6),vy:0,vz:-rnd(9,15),life:0,max:14,s:rnd(3.4,4.6),rot:rnd(0,TAU),vr:rnd(-2,2),col:['#cfe3b0','#b9d39a','#dfe8c8','#d8d0ec'][(Math.random()*4)|0],leaf:1});}}
/* shrubs bend from the base with the breeze and lean away as Lum brushes past */
function drawShrub(o){const im=IMG[o.img||('shrub'+o.k)];if(!ready(im))return;const iw=im.naturalWidth,ih=im.naturalHeight,s=o.s,w=iw*s,h=ih*s,ax=o.ax??SHR[o.k].ax;
  const dx=o.x-lum.x,dy=(o.y-lum.y)*1.5,d=Math.hypot(dx,dy),push=d<60?(1-d/60)*Math.sign(dx||1)*9:0;
  ctx.globalAlpha=.34;ctx.drawImage(glowCanvas('38,64,30'),o.x-w*.42,o.y-h*.1,w*.84,h*.2);ctx.globalAlpha=1;
  {const behind=lum.y<o.y-2&&lum.y>o.y-h+30&&Math.abs(lum.x-o.x)<w*.42;o.fade=(o.fade??1)+((OCC|=behind,behind?1:1)-(o.fade??1))*.18;}
  ctx.save();ctx.globalAlpha=o.fade;ctx.translate(o.x,o.y);if(o.flip)ctx.scale(-1,1);const dir=o.flip?-1:1;
  const N=12;for(let i=0;i<N;i++){const sy=ih*i/N,sh=ih/N,t=1-(sy+sh/2)/ih,off=((wind(T,o.x,o.y)*9+Math.sin(T*1.3+o.ph)*2.4)*(h/130)*Math.pow(t,1.4)+push*Math.pow(t,1.2))*dir;
    ctx.drawImage(im,0,sy,iw,sh+1,-w*ax+off,-h+sy*s,w,sh*s+.8);}
  ctx.restore();
  if(o.drained){
    if(o.soaked>0){o.soaked-=1/60;drawGlow(ctx,o.x,o.y-h*.5,h*.6,'200,240,255',.25*Math.min(1,o.soaked));}
    if(o.drips.length&&Math.random()<.012){const [dx_,dy_]=o.drips[(Math.random()*o.drips.length)|0];PARTS.push({type:'sdrip',x:o.x+(o.flip?-1:1)*(-w*ax+dx_*s),y:o.y+2,z:h-dy_*s,vx:0,vy:0,vz:-2,life:0,max:4,s:rnd(1.6,2.4)});}}}
function drawTree(o){const im=IMG.runetree;if(!ready(im))return;const w=im.naturalWidth*o.s,h=im.naturalHeight*o.s;
  const behind=lum.y<o.y-4&&lum.y>o.y-h*.95&&Math.abs(lum.x-o.x)<w*.5;o.fade=(o.fade??1)+((OCC|=behind,behind?1:1)-(o.fade??1))*.12;
  ctx.globalAlpha=.42;ctx.drawImage(glowCanvas('38,64,30'),o.x-w*.5,o.y-h*.1,w,h*.2);
  const sk=wind(T,o.x,o.y)*.022+Math.sin(T*.8+o.x)*.008;
  ctx.save();ctx.globalAlpha=o.fade;ctx.translate(o.x,o.y);ctx.transform(1,0,sk,1,0,0);if(o.flip)ctx.scale(-1,1);
  ctx.drawImage(im,-w*.553,-h*.972,w,h);
  if(ready(IMG.runetree_runes)){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=o.fade*(.4+.35*Math.sin(T*1.1+o.x));ctx.drawImage(IMG.runetree_runes,-w*.553,-h*.972,w,h);ctx.globalCompositeOperation='source-over';}
  ctx.restore();ctx.globalAlpha=1;}
function drawEstateObj(o){
  if(o.t==='hslice'){drawHouse(o);return;}
  if(o.t==='tree'){drawTree(o);return;}
  if(o.t==='birch'){drawBirch(o);return;}
  if(o.t==='willow'){drawWillow(o);return;}
  if(o.t==='shrub'){drawShrub(o);return;}
  if(o.t==='img'){const im=IMG[o.img];if(!ready(im))return;const w=im.naturalWidth*o.s,h=im.naturalHeight*o.s;
    if(o.shadow){ctx.globalAlpha=.4;ctx.drawImage(glowCanvas('38,64,30'),o.x-w*.44,o.y-h*.16,w*.88,h*.36);ctx.globalAlpha=1;}
    else{ctx.globalAlpha=.32;ctx.drawImage(glowCanvas('38,64,30'),o.x-w*.36,o.y-h*.07,w*.72,h*.16);ctx.globalAlpha=1;}
    const sk=o.sway?(wind(T,o.x,o.y)*.05+Math.sin(T*1.1+o.x)*.016)*o.sway:0;
    const cx=o.x+(o.flip?-1:1)*w*(.5-o.ax),behind=lum.y<o.y-2&&lum.y>o.y-h*o.ay+20&&Math.abs(lum.x-cx)<w*.4;o.fade=(o.fade??1)+((OCC|=behind,behind?1:1)-(o.fade??1))*.18;
    ctx.save();ctx.globalAlpha=o.fade;ctx.translate(o.x,o.y);if(sk)ctx.transform(1,0,sk,1,0,0);if(o.flip)ctx.scale(-1,1);ctx.drawImage(im,-w*o.ax,-h*o.ay,w,h);ctx.restore();ctx.globalAlpha=1;return;}
  if(o.t==='plant'){const sp=o.spr,s=o.s,w=sp.w*s,h=sp.h*s;
    const dx=o.x-lum.x,dy=(o.y-lum.y)*1.5,d=Math.hypot(dx,dy),push=d<46?(1-d/46)*Math.sign(dx||1)*.35:0;
    const sk=wind(T,o.x,o.y)*.1+Math.sin(T*1.6+o.ph)*.04+push;
    ctx.save();ctx.translate(o.x,o.y);ctx.transform(1,0,sk,1,0,0);if(o.flip)ctx.scale(-1,1);ctx.drawImage(sp.c,-w/2,-h,w,h);ctx.restore();
    if(sp.bells){for(let i=0;i<sp.bells.length;i++){const [bx,by]=sp.bells[i],px=o.x+(o.flip?-bx:bx)*s-sk*by*s,py=o.y+by*s;const tw=.6+.4*Math.sin(T*2+o.ph+i*1.3);drawGlow(ctx,px,py,9*tw+3,sp.glow,.35*tw);}}}
}

