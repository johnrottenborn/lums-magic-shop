/* ---------- the forest clearing: painted backdrop + a creek curling round the island ---------- */
const FK=1.6;const fxw=x=>(x-662)*FK,fyw=y=>(y-625)*FK;       // forest-painting px -> world
const BACK={x:fxw(0),y:fyw(0),w:1376*FK,h:768*FK};
const CREEK_CP=[[905,-260],[875,-150],[846,-60],[820,0],[795,80],[778,160],[752,240],[712,310],[700,400],[724,480],[700,580],[640,660],[612,760],[580,860],[520,960],[460,1060],[410,1120]];
const CK=[];const CSTEP=5;
(function buildCreekSamples(){const P=CREEK_CP;const pts=[];
  for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
    for(let t=0;t<1;t+=.02){const t2=t*t,t3=t2*t;const f=(a,b,c,d)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);pts.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1])]);}}
  pts.push(P[P.length-1]);let s=0,last=pts[0];CK.push({x:last[0],y:last[1],s:0});
  for(const p of pts){const d=Math.hypot(p[0]-last[0],p[1]-last[1]);if(d<CSTEP)continue;s+=d;CK.push({x:p[0],y:p[1],s});last=p;}
  for(let i=0;i<CK.length;i++){const a=CK[Math.max(0,i-1)],b=CK[Math.min(CK.length-1,i+1)];const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;CK[i].nx=-dy/l;CK[i].ny=dx/l;
    CK[i].w=27+5*Math.sin(CK[i].s/47)+3*Math.sin(CK[i].s/19+1);}})();
const CLEN=CK[CK.length-1].s;
for(const p of CK){const u=(p.s-(CLEN-110))/110;if(u>0)p.w*=1+.75*u*u;}
const CGRID=new Map();const CG=48;for(let i=0;i<CK.length;i++){const k=Math.floor(CK[i].x/CG)+','+Math.floor(CK[i].y/CG);if(!CGRID.has(k))CGRID.set(k,[]);CGRID.get(k).push(i);}
function creekNearest(x,y){const gx=Math.floor(x/CG),gy=Math.floor(y/CG);let bi=-1,bd=1e9;
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const l=CGRID.get((gx+a)+','+(gy+b));if(!l)continue;for(const i of l){const d=Math.hypot(CK[i].x-x,CK[i].y-y);if(d<bd){bd=d;bi=i;}}}
  return bi<0?null:{i:bi,d:bd,w:CK[bi].w};}
// the lantern bridge over the creek's east arm (bridge3 from the bridge sheet; walkway near end at sprite (350,222), far end (60,125))
const BRIDGE=(()=>{const sc=.95,C=[820,0],mx=205,my=173.5;return {sc,W:[C[0]+(60-mx)*sc,C[1]+(125-my)*sc],E:[C[0]+(350-mx)*sc,C[1]+(222-my)*sc],x0:C[0]-mx*sc,y0:C[1]-my*sc,hw:34,lanterns:[[25,82],[288,150],[400,118]]};})();
const onBridge=(x,y)=>false&&(()=>{const [ax,ay]=BRIDGE.W,[bx,by]=BRIDGE.E,vx=bx-ax,vy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*vx+(y-ay)*vy)/(vx*vx+vy*vy)));return Math.hypot(x-(ax+vx*t),y-(ay+vy*t))<BRIDGE.hw;})();
const POND={x:380,y:1130,rx:175,ry:96};
const pondR=th=>1+.1*Math.sin(3*th+.6)+.06*Math.sin(5*th+2)+.03*Math.sin(9*th);
function inPond(x,y,m=0){const dx=(x-POND.x)/POND.rx,dy=(y-POND.y)/POND.ry,th=Math.atan2(dy,dx);return Math.hypot(dx,dy)<pondR(th)-m/POND.ry;}
function creekNear(x,y,m=0){const n=creekNearest(x,y);return !!n&&n.d<n.w+m;}
const inStream=(x,y,m=0)=>{if(onBridge(x,y))return false;const n=creekNearest(x,y);return !!n&&n.d<n.w-m;};
let riverR=1,creekCv=null,creekBox=null;const riverCache={clear(){}};
function creekPoly(c,off,i0=0,i1=CK.length-1,step=1){c.beginPath();for(let i=i0;i<=i1;i+=step){const p=CK[i],o=(typeof off==='function'?off(p):off);c.lineTo(p.x+p.nx*(p.w+o),p.y+p.ny*(p.w+o));}
  for(let i=i1;i>=i0;i-=step){const p=CK[i],o=(typeof off==='function'?off(p):off);c.lineTo(p.x-p.nx*(p.w+o),p.y-p.ny*(p.w+o));}c.closePath();}
const cnz=(s,k)=>Math.sin(s/23+k)*.5+Math.sin(s/9.7+k*2)*.3+Math.sin(s/4.3+k*3)*.2;
function buildCreek(R){riverR=R;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of CK){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x);y1=Math.max(y1,p.y);}
  x0=Math.floor(x0-90);y0=Math.floor(y0-90);x1=Math.ceil(x1+90);y1=Math.ceil(y1+90);const w=x1-x0,h=y1-y0;creekBox={x0,y0,w,h};
  const c=document.createElement('canvas');c.width=Math.ceil(w*R);c.height=Math.ceil(h*R);const g=c.getContext('2d');g.setTransform(R,0,0,R,-x0*R,-y0*R);g.lineCap='round';g.lineJoin='round';
  const soft=(k,fn)=>{const s=document.createElement('canvas');s.width=Math.max(2,Math.ceil(w*R*k));s.height=Math.max(2,Math.ceil(h*R*k));const q=s.getContext('2d');q.setTransform(R*k,0,0,R*k,-x0*R*k,-y0*R*k);q.lineCap='round';fn(q);
    g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingQuality='high';g.drawImage(s,0,0,c.width,c.height);g.restore();};
  soft(.2,q=>{q.fillStyle='rgba(58,84,40,.5)';creekPoly(q,p=>15+cnz(p.s,1)*5,0,CK.length-1,2);q.fill();});
  g.fillStyle='#8a6a45';creekPoly(g,p=>4.2+cnz(p.s,3)*2.2);g.fill();
  g.fillStyle='rgba(178,142,94,.85)';creekPoly(g,p=>2+cnz(p.s,5)*1.1);g.fill();
  g.fillStyle='#a6d1ea';creekPoly(g,0);g.fill();
  g.save();creekPoly(g,0);g.clip();
  soft(.2,q=>{
    q.fillStyle='rgba(96,154,210,.72)';creekPoly(q,p=>-p.w*.42+Math.sin(p.s/60)*4,0,CK.length-1,2);q.fill();
    q.fillStyle='rgba(72,128,190,.4)';creekPoly(q,p=>-p.w*.7,0,CK.length-1,2);q.fill();
    q.lineWidth=12;q.strokeStyle='rgba(84,128,96,.42)';q.beginPath();for(const p of CK)q.lineTo(p.x+p.nx*(p.w-4),p.y+p.ny*(p.w-4));q.stroke();
    q.lineWidth=8;q.strokeStyle='rgba(96,140,104,.26)';q.beginPath();for(const p of CK)q.lineTo(p.x-p.nx*(p.w-3),p.y-p.ny*(p.w-3));q.stroke();
    for(let i=0;i<40;i++){const p=CK[(hash(i,1,701)*CK.length)|0],u=(hash(i,2,701)*2-1)*.8,r=8+hash(i,3,701)*18,light=hash(i,4,701)<.55;
      q.fillStyle=light?'rgba(218,240,250,.34)':'rgba(70,120,180,.17)';q.beginPath();q.ellipse(p.x+p.nx*p.w*u,p.y+p.ny*p.w*u,r,r*.7,Math.atan2(p.ny,p.nx)+Math.PI/2,0,TAU);q.fill();}});
  g.lineWidth=2.6;g.strokeStyle='rgba(228,245,252,.5)';g.beginPath();for(const p of CK)g.lineTo(p.x-p.nx*(p.w-5),p.y-p.ny*(p.w-5));g.stroke();
  for(let k=0;k<90;k++){const i0=(hash(k,1,711)*CK.length)|0,n=6+(hash(k,2,711)*14|0),u=(hash(k,3,711)*2-1)*.78,wd=.7+hash(k,4,711)*1.6,al=.16+hash(k,5,711)*.4,dark=hash(k,6,711)<.2;
    if(i0+n>=CK.length)continue;g.fillStyle=dark?`rgba(58,108,168,${(al*.55).toFixed(3)})`:`rgba(255,255,255,${al.toFixed(3)})`;g.beginPath();
    for(let j=0;j<=n;j++){const p=CK[i0+j],tp=Math.sin(Math.PI*j/n)*wd,uu=u+Math.sin(j*.5+k)*.03;g.lineTo(p.x+p.nx*(p.w*uu+tp),p.y+p.ny*(p.w*uu+tp));}
    for(let j=n;j>=0;j--){const p=CK[i0+j],tp=Math.sin(Math.PI*j/n)*wd*.4,uu=u+Math.sin(j*.5+k)*.03;g.lineTo(p.x+p.nx*(p.w*uu-tp),p.y+p.ny*(p.w*uu-tp));}g.closePath();g.fill();}
  // stones resting in the current, each with a soft foam collar
  for(let i=0;i<22;i++){const p=CK[(30+hash(i,1,991)*(CK.length-60))|0],u=(hash(i,2,991)*2-1)*.6,x=p.x+p.nx*p.w*u,y=p.y+p.ny*p.w*u,r=4+hash(i,3,991)*6;
    g.fillStyle='rgba(40,80,110,.25)';g.beginPath();g.ellipse(x+1.5,y+2.5,r*1.3,r*.65,0,0,TAU);g.fill();
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.3;g.beginPath();g.ellipse(x,y+1.5,r*1.35,r*.62,0,0,TAU);g.stroke();
    const gr=g.createLinearGradient(x-r,y-r,x+r,y+r);gr.addColorStop(0,'#d6d1c4');gr.addColorStop(1,'#8a8584');g.fillStyle=gr;g.beginPath();g.ellipse(x,y,r,r*.62,0,0,TAU);g.fill();
    if(hash(i,4,991)<.6){g.fillStyle='rgba(128,166,78,.9)';g.beginPath();g.ellipse(x-r*.2,y-r*.22,r*.55,r*.28,-.2,0,TAU);g.fill();}}
  g.restore();
  g.lineWidth=1.5;g.strokeStyle='rgba(78,58,38,.5)';g.beginPath();for(const p of CK)g.lineTo(p.x+p.nx*(p.w+.5),p.y+p.ny*(p.w+.5));g.stroke();
  g.lineWidth=1.2;g.strokeStyle='rgba(78,58,38,.35)';g.beginPath();for(const p of CK)g.lineTo(p.x-p.nx*(p.w+.5),p.y-p.ny*(p.w+.5));g.stroke();
  for(let i=0;i<90;i++){const p=CK[(hash(i,1,721)*CK.length)|0],side=hash(i,2,721)<.5?-1:1,o=p.w+hash(i,3,721)*7-1,x=p.x+p.nx*o*side,y=p.y+p.ny*o*side;
    if(hash(i,4,721)<.3){g.fillStyle='#e8c35e';g.beginPath();g.arc(x,y,1.5,0,TAU);g.fill();}
    else{g.fillStyle=hash(i,5,721)<.5?'#cdb898':'#a8998a';g.beginPath();g.ellipse(x,y,2.4+hash(i,6,721)*3,1.7+hash(i,7,721)*1.3,0,0,TAU);g.fill();}}
  // soften both ends so the creek flows into the painted forest
  g.save();g.globalCompositeOperation='destination-out';
  for(const [i0,dir] of [[0,1]])for(let j=0;j<22;j++){const p=CK[i0+dir*j];if(!p)break;g.fillStyle=`rgba(0,0,0,${(1-j/22)*.35})`;g.beginPath();g.arc(p.x,p.y,p.w+18,0,TAU);g.fill();}
  g.restore();creekCv=c;}
function creekLivePath(){ctx.beginPath();for(let i=0;i<CK.length;i+=3){const p=CK[i];ctx.lineTo(p.x+p.nx*p.w,p.y+p.ny*p.w);}for(let i=CK.length-1;i>=0;i-=3){const p=CK[i];ctx.lineTo(p.x-p.nx*p.w,p.y-p.ny*p.w);}ctx.closePath();}
const atS=s=>CK[Math.max(0,Math.min(CK.length-1,Math.round(s/CLEN*(CK.length-1))))];
const FISH=[0,1,2,3,4,5,6].map(i=>({s:120+i*(CLEN-240)/6,u:(hash(i,1,861)*2-1)*.45,v:(hash(i,2,861)<.6?1:-1)*rnd(14,26),len:rnd(14,22),ph:rnd(0,TAU),dart:0}));
function updateFish(dt){for(const f of FISH){f.ph+=dt*(f.dart>0?14:6);if(f.dart>0)f.dart-=dt;else if(Math.random()<dt*.08){f.dart=rnd(.5,.9);const p=atS(f.s);PARTS.push({type:'ring',x:p.x+p.nx*p.w*f.u,y:p.y+p.ny*p.w*f.u,z:0,life:0,max:.9,s:.3});}
  if(Math.random()<dt*.05)f.v=-f.v;f.s+=f.v*(f.dart>0?3.4:1)*dt;f.u+=Math.sin(f.ph*.3)*.04*dt;f.u=clamp(f.u,-.6,.6);
  if(f.s<90){f.s=90;f.v=Math.abs(f.v);}if(f.s>CLEN-90){f.s=CLEN-90;f.v=-Math.abs(f.v);}}}
function drawFish(){for(const f of FISH){const p=atS(f.s),q=atS(f.s+(f.v>0?6:-6)),ang=Math.atan2(q.y-p.y,q.x-p.x),x=p.x+p.nx*p.w*f.u,y=p.y+p.ny*p.w*f.u,w=Math.sin(f.ph)*.35;
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(1,.7);ctx.fillStyle='rgba(28,62,78,.26)';
  ctx.beginPath();ctx.ellipse(0,0,f.len*.5,f.len*.18,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-f.len*.42,0);ctx.lineTo(-f.len*.72,-f.len*.2+w*6);ctx.lineTo(-f.len*.72,f.len*.2+w*6);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(f.len*.05,-f.len*.15,f.len*.12,f.len*.06,-.5+w*.4,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(f.len*.05,f.len*.15,f.len*.12,f.len*.06,.5-w*.4,0,TAU);ctx.fill();
  ctx.restore();}}
/* ---------- the koi pond, painted once in soft layers, with living koi, lily pads and reeds ---------- */
let pondCv=null,pondBox=null;
function pondPath(c,off,wob=0){c.beginPath();for(let i=0;i<=120;i++){const th=i/120*TAU,r=pondR(th);const o=typeof off==='function'?off(th):off;c.lineTo(POND.x+Math.cos(th)*(POND.rx*r+o),POND.y+Math.sin(th)*(POND.ry*r+o*.62));}c.closePath();}
function buildPond(R){const pad=70,x0=POND.x-POND.rx*1.25-pad,y0=POND.y-POND.ry*1.25-pad,w=POND.rx*2.5+pad*2,h=POND.ry*2.5+pad*2;pondBox={x0,y0,w,h};
  const c=document.createElement('canvas');c.width=Math.ceil(w*R);c.height=Math.ceil(h*R);const g=c.getContext('2d');g.setTransform(R,0,0,R,-x0*R,-y0*R);
  const soft=(k,fn)=>{const s_=document.createElement('canvas');s_.width=Math.ceil(w*R*k);s_.height=Math.ceil(h*R*k);const q=s_.getContext('2d');q.setTransform(R*k,0,0,R*k,-x0*R*k,-y0*R*k);fn(q);g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingQuality='high';g.drawImage(s_,0,0,c.width,c.height);g.restore();};
  soft(.2,q=>{q.fillStyle='rgba(58,84,40,.5)';pondPath(q,th=>18+cnz(th*60,1)*6);q.fill();});
  g.fillStyle='#8a6a45';pondPath(g,th=>5+cnz(th*80,3)*2.2);g.fill();
  g.save();g.globalCompositeOperation='destination-out';{const m=pondMouth();const gg=g.createRadialGradient(m.x,m.y,0,m.x,m.y,m.w*1.3);gg.addColorStop(0,'rgba(0,0,0,1)');gg.addColorStop(.7,'rgba(0,0,0,.8)');gg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gg;g.fillRect(m.x-m.w*2,m.y-m.w*2,m.w*4,m.w*4);}g.restore();
  g.fillStyle='rgba(178,142,94,.85)';pondPath(g,th=>2.4+cnz(th*80,5)*1.2);g.fill();
  g.fillStyle='#a6d1ea';pondPath(g,0);g.fill();
  g.save();pondPath(g,0);g.clip();
  soft(.2,q=>{q.fillStyle='rgba(96,154,210,.7)';pondPath(q,-POND.ry*.32);q.fill();q.fillStyle='rgba(66,120,184,.45)';pondPath(q,-POND.ry*.6);q.fill();
    q.lineWidth=16;q.strokeStyle='rgba(84,128,96,.4)';pondPath(q,-6);q.stroke();
    for(let i=0;i<14;i++){const th=hash(i,1,901)*TAU,d=hash(i,2,901)*.75,r=12+hash(i,3,901)*22;q.fillStyle=hash(i,4,901)<.55?'rgba(220,242,250,.34)':'rgba(70,120,180,.18)';q.beginPath();q.ellipse(POND.x+Math.cos(th)*POND.rx*d,POND.y+Math.sin(th)*POND.ry*d,r,r*.6,0,0,TAU);q.fill();}});
  g.lineCap='round';for(let i=0;i<26;i++){const th=hash(i,1,911)*TAU,d=.25+hash(i,2,911)*.6,L=20+hash(i,3,911)*40,x=POND.x+Math.cos(th)*POND.rx*d,y=POND.y+Math.sin(th)*POND.ry*d;
    g.strokeStyle=`rgba(255,255,255,${(.18+hash(i,4,911)*.3).toFixed(3)})`;g.lineWidth=1+hash(i,5,911)*1.4;g.beginPath();g.moveTo(x-L/2,y);g.quadraticCurveTo(x,y-3,x+L/2,y);g.stroke();}
  g.restore();
  g.lineWidth=1.5;g.strokeStyle='rgba(78,58,38,.5)';pondPath(g,.5);g.stroke();
  for(let i=0;i<70;i++){const th=hash(i,1,921)*TAU,o=hash(i,2,921)*8,x=POND.x+Math.cos(th)*(POND.rx*pondR(th)+o),y=POND.y+Math.sin(th)*(POND.ry*pondR(th)+o*.62);
    if(hash(i,3,921)<.25){g.fillStyle='#e8c35e';g.beginPath();g.arc(x,y,1.5,0,TAU);g.fill();}else{g.fillStyle=hash(i,4,921)<.5?'#cdb898':'#a8998a';g.beginPath();g.ellipse(x,y,2.6+hash(i,5,921)*3.4,1.8+hash(i,6,921)*1.4,0,0,TAU);g.fill();}}
  pondCv=c;}
const PADS=[0,1,2,3,4,5,6,7].map(i=>{const th=hash(i,1,931)*TAU,d=.3+hash(i,2,931)*.55;return {x:POND.x+Math.cos(th)*POND.rx*d,y:POND.y+Math.sin(th)*POND.ry*d,r:10+hash(i,3,931)*8,rot:hash(i,4,931)*TAU,fl:hash(i,5,931)<.45,ph:hash(i,6,931)*TAU};});
const KOI=[0,1,2,3].map(i=>({a:hash(i,1,941)*TAU,d:.35+hash(i,2,941)*.4,sp:(hash(i,3,941)<.5?1:-1)*(.18+hash(i,4,941)*.14),col:['#ff9a5c','#fff4ea','#ffb84a','#f26d5b'][i],ph:hash(i,5,941)*TAU}));
function pondPathNB(c,off){for(let i=0;i<=120;i++){const th=i/120*TAU,r=pondR(th);const x=POND.x+Math.cos(th)*(POND.rx*r+off),y=POND.y+Math.sin(th)*(POND.ry*r+off*.62);i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();}
let MOUTH=null;
function pondMouth(){if(MOUTH)return MOUTH;for(let i=CK.length-1;i>=0;i--){if(!inPond(CK[i].x,CK[i].y,-6)){const p=CK[i];MOUTH={x:p.x,y:p.y,w:p.w,a:Math.atan2(p.ny,p.nx),th:Math.atan2((p.y-POND.y)/POND.ry,(p.x-POND.x)/POND.rx)};return MOUTH;}}return MOUTH={x:POND.x,y:POND.y-POND.ry,w:30,a:0,th:-Math.PI/2};}
function drawPondMouth(){const m=pondMouth();
  // a soft wash of water where the two meet hides the seam
  ctx.save();ctx.beginPath();creekLivePath();pondPathNB(ctx,-1);ctx.clip();
  const g=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.w*1.7);g.addColorStop(0,'rgba(160,206,234,.85)');g.addColorStop(.55,'rgba(150,200,232,.45)');g.addColorStop(1,'rgba(150,200,232,0)');ctx.fillStyle=g;ctx.fillRect(m.x-m.w*2,m.y-m.w*2,m.w*4,m.w*4);
  // the current spreading into the pond in slow fanning ripples
  const dx=POND.x-m.x,dy=POND.y-m.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;ctx.lineCap='round';
  for(let k=0;k<5;k++){const t=(T*.28+k/5)%1,r=8+t*m.w*2.2,cx=m.x+ux*t*m.w*1.4,cy=m.y+uy*t*m.w*1.4,a=Math.sin(Math.PI*t)*.5;const ang=Math.atan2(uy,ux);
    ctx.strokeStyle=`rgba(240,250,255,${a.toFixed(3)})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(cx,cy,r,r*.5,ang,-1.1,1.1);ctx.stroke();}
  ctx.restore();
  // flat stones and moss at the lip of the inflow
  for(const sd of [-1,1]){const nx=Math.cos(m.a),ny=Math.sin(m.a),x=m.x+nx*(m.w+4)*sd,y=m.y+ny*(m.w+4)*sd*.7;
    ctx.fillStyle='rgba(50,48,36,.3)';ctx.beginPath();ctx.ellipse(x+1.5,y+2,10,5.5,0,0,TAU);ctx.fill();const gr=ctx.createLinearGradient(x-9,y-6,x+9,y+6);gr.addColorStop(0,'#d4cfc2');gr.addColorStop(1,'#8c8780');ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(x,y,9,5,0,0,TAU);ctx.fill();
    ctx.fillStyle='rgba(126,164,76,.9)';ctx.beginPath();ctx.ellipse(x-2,y-2,5,2.6,0,0,TAU);ctx.fill();}}
function drawPond(){if(!pondCv)return;ctx.drawImage(pondCv,pondBox.x0,pondBox.y0,pondBox.w,pondBox.h);
  ctx.save();pondPath(ctx,-1);ctx.clip();
  for(const k of KOI){k.a+=k.sp/60;const x=POND.x+Math.cos(k.a)*POND.rx*k.d,y=POND.y+Math.sin(k.a)*POND.ry*k.d,ang=k.a+(k.sp>0?Math.PI/2:-Math.PI/2),w=Math.sin(T*7+k.ph)*.4;
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(Math.sin(ang)*POND.ry,Math.cos(ang)*POND.rx));ctx.globalAlpha=.78;ctx.fillStyle=k.col;
    ctx.beginPath();ctx.ellipse(0,0,10,4.2,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-16,-4+w*5);ctx.lineTo(-16,4+w*5);ctx.closePath();ctx.fill();
    if(k.col==='#fff4ea'){ctx.fillStyle='#ff7a4a';ctx.beginPath();ctx.ellipse(3,-1,3.2,2,0,0,TAU);ctx.fill();}ctx.restore();}
  ctx.globalAlpha=1;
  for(let i=0;i<5;i++){const t=(T*.35+hash(i,1,951))%1,th=hash(i,2,951)*TAU,d=hash(i,3,951)*.7,x=POND.x+Math.cos(th)*POND.rx*d,y=POND.y+Math.sin(th)*POND.ry*d;ctx.strokeStyle=`rgba(235,248,255,${(.5*(1-t)).toFixed(3)})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x,y,6+t*26,(6+t*26)*.45,0,0,TAU);ctx.stroke();}
  ctx.restore();
  for(const p of PADS){const b=Math.sin(T*1.1+p.ph)*1.2;ctx.save();ctx.translate(p.x,p.y+b);ctx.scale(1,.6);ctx.rotate(p.rot+Math.sin(T*.4+p.ph)*.1);
    ctx.fillStyle='rgba(20,50,50,.25)';ctx.beginPath();ctx.arc(2,4,p.r,0,TAU);ctx.fill();const g2=ctx.createRadialGradient(-p.r*.3,-p.r*.3,1,0,0,p.r);g2.addColorStop(0,'#b7d98a');g2.addColorStop(1,'#5a9653');ctx.fillStyle=g2;
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,p.r,.28,TAU-.1);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(50,80,40,.5)';ctx.lineWidth=.8;ctx.stroke();ctx.restore();
    if(p.fl){ctx.fillStyle='#ffd6ec';for(let i=0;i<6;i++){const a=i/6*TAU+T*.08;ctx.beginPath();ctx.ellipse(p.x+Math.cos(a)*4,p.y+b-5+Math.sin(a)*2,4,2.2,a,0,TAU);ctx.fill();}ctx.fillStyle='#fff3a8';ctx.beginPath();ctx.arc(p.x,p.y+b-5,2.2,0,TAU);ctx.fill();drawGlow(ctx,p.x,p.y+b-5,12,'255,220,240',.25);}}}
const POND_REEDS=[];for(let i=0;i<34;i++){const th=hash(i,1,961)*TAU,o=4+hash(i,2,961)*10;if(Math.sin(th)<-.2&&hash(i,3,961)<.5)continue;{const x_=POND.x+Math.cos(th)*(POND.rx*pondR(th)+o),y_=POND.y+Math.sin(th)*(POND.ry*pondR(th)+o*.62);if(creekNear(x_,y_,6))continue;}POND_REEDS.push({x:POND.x+Math.cos(th)*(POND.rx*pondR(th)+o),y:POND.y+Math.sin(th)*(POND.ry*pondR(th)+o*.62),n:5+(hash(i,4,961)*5|0),h:20+hash(i,5,961)*20,hue:hash(i,6,961),lean:0});}
function drawStream(){
  if(creekCv)ctx.drawImage(creekCv,creekBox.x0,creekBox.y0,creekBox.w,creekBox.h);
  ctx.save();creekLivePath();ctx.clip();ctx.lineCap='round';
  drawFish();
  for(let k=0;k<26;k++){const ph=(T*.2+hash(k,1,731))%1,a=Math.sin(Math.PI*ph)*(.22+hash(k,2,731)*.3);if(a<.02)continue;
    const s0=(hash(k,3,731)*CLEN+T*15)%CLEN,u=(hash(k,4,731)*2-1)*.7,L=24+hash(k,5,731)*34;ctx.strokeStyle=`rgba(255,255,255,${a.toFixed(3)})`;ctx.lineWidth=1.1+hash(k,6,731)*1.1;ctx.beginPath();
    for(let j=0;j<=6;j++){const p=atS((s0+L*j/6)%CLEN);ctx.lineTo(p.x+p.nx*p.w*(u+Math.sin(j*.7+T*.6+k)*.02),p.y+p.ny*p.w*(u+Math.sin(j*.7+T*.6+k)*.02));}ctx.stroke();}
  for(let k=0;k<9;k++){const s=(hash(k,1,741)*CLEN+T*12)%CLEN,p=atS(s),u=(hash(k,2,741)*2-1)*.5+Math.sin(T*.5+k)*.05,x=p.x+p.nx*p.w*u,y=p.y+p.ny*p.w*u,kind=hash(k,3,741);
    const fade=Math.min(1,s/80,(CLEN-s)/80);ctx.globalAlpha=Math.max(0,fade);
    ctx.save();ctx.translate(x,y);ctx.rotate(T*.25*(k%2?1:-1)+k);ctx.fillStyle='rgba(40,80,90,.18)';ctx.beginPath();ctx.ellipse(1.5,2.5,5,2.6,0,0,TAU);ctx.fill();
    if(kind<.55){ctx.fillStyle='#7d9fe0';ctx.beginPath();ctx.ellipse(0,0,4.6,2.6,0,0,TAU);ctx.fill();}else if(kind<.8){ctx.fillStyle='#d6d66a';ctx.beginPath();ctx.ellipse(0,0,6,2.2,0,0,TAU);ctx.fill();}
    else{ctx.fillStyle='#f7c6d8';ctx.beginPath();ctx.ellipse(0,0,4,2.4,0,0,TAU);ctx.fill();}ctx.restore();ctx.globalAlpha=1;}
  ctx.restore();
  for(let k=0;k<14;k++){const tw=Math.sin(T*1.6+k*1.7);if(tw<.7)continue;const p=CK[(hash(k,1,751)*CK.length)|0],u=(hash(k,2,751)*2-1)*.6;drawGlow(ctx,p.x+p.nx*p.w*u,p.y+p.ny*p.w*u,6,'255,255,255',(tw-.7)*2.2);}
}
function drawBridge(){const im=IMG.bridge3;if(!ready(im))return;const b=BRIDGE,w=im.naturalWidth*b.sc,h=im.naturalHeight*b.sc;
  ctx.globalAlpha=.3;ctx.drawImage(glowCanvas('30,50,40'),b.x0+w*.05,b.y0+h*.55,w*.95,h*.5);ctx.globalAlpha=1;
  ctx.drawImage(im,b.x0,b.y0,w,h);
  ctx.save();ctx.globalCompositeOperation='lighter';b.lanterns.forEach(([lx,ly],i)=>{const f=.75+.25*Math.sin(T*2.3+i*1.9)*Math.sin(T*3.7+i);drawGlow(ctx,b.x0+lx*b.sc,b.y0+ly*b.sc,26*f,'255,205,140',.32*f);});ctx.restore();}
function rrw(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
// grassy overhang along the creek, y-sorted with everything else
const CREEK_TUFTS=[];for(let i=0;i<CK.length;i+=4)for(const side of [-1,1]){if(hash(i,side+5,771)<.35)continue;const p=CK[i],o=p.w+2+hash(i,side+5,772)*7,reed=Math.sin(i*.09+side)>.55||p.s>CLEN-140;
  if(inPond(p.x+p.nx*o*side,p.y+p.ny*o*side,-14))continue;CREEK_TUFTS.push({x:p.x+p.nx*o*side,y:p.y+p.ny*o*side,n:(reed?7:5)+(hash(i,side,773)*5|0),h:(reed?30:14)+hash(i,side,774)*(reed?18:14),hue:hash(i,side,775),lean:0});}

/* ---------- willow curtains: living strands hung in front of the painted willows ---------- */
const STRANDS=[];
(function(){const groups=[[350,515,230,390,470],[655,870,70,190,280],[935,1075,130,360,455],[985,1045,290,420,470]];let k=0;
  for(const [xa,xb,ytop,ytip0,ytip1] of groups)for(let x=xa;x<xb;x+=8){k++;const top=ytop+hash(k,1,781)*50,tip=ytip0+hash(k,2,781)*(ytip1-ytip0);if(tip-top<40)continue;
    STRANDS.push({x:fxw(x+hash(k,3,781)*5),y0:fyw(top),y1:fyw(tip),ph:hash(k,4,781)*TAU,c:hash(k,5,781)});}})();
function drawStrands(x0,x1,y0,y1){ctx.globalAlpha=.5;drawStrands_(x0,x1,y0,y1);ctx.globalAlpha=1;}
function drawStrands_(x0,x1,y0,y1){const cols=['#c4cb62','#b0bb4f','#d8db80','#97a543'];
  for(const s of STRANDS){if(s.x<x0-40||s.x>x1+40||s.y1<y0||s.y0>y1)continue;const L=s.y1-s.y0,sw=(Math.sin(T*.9+s.ph+s.x*.004)*8+wind(T,s.x,s.y1)*16);
    const tx=s.x+sw,mx=s.x+sw*.3,my=s.y0+L*.6;
    // a frond: overlapping slender leaves along a gently swinging stem, densest toward the tip
    for(let t=.18;t<=1;t+=.055){const u=1-t,px=u*u*s.x+2*u*t*mx+t*t*tx,py=u*u*s.y0+2*u*t*my+t*t*s.y1,side=((t*40)|0)%2?1:-1,ang=Math.PI/2+side*.5+sw*.01;
      ctx.fillStyle='rgba(70,82,34,.5)';ctx.beginPath();ctx.ellipse(px+side*2.6+.8,py+1.2,2.2,6.2,ang-Math.PI/2,0,TAU);ctx.fill();
      ctx.fillStyle=cols[((s.c*4)|0+((t*10)|0))%4];ctx.beginPath();ctx.ellipse(px+side*2.6,py,2,6,ang-Math.PI/2,0,TAU);ctx.fill();}}}

/* ---------- sunbeams and forest mist ---------- */
const BEAMS=[[560,0,420,560,60],[640,0,560,600,40],[700,0,640,560,30]].map(([xa,ya,xb,yb,w])=>({x0:fxw(xa),y0:fyw(ya),x1:fxw(xb),y1:fyw(yb),w:w*FK}));
function drawBeams(){ctx.save();ctx.globalCompositeOperation='lighter';
  BEAMS.forEach((b,i)=>{const a=.07+.035*Math.sin(T*.5+i*2);const g=ctx.createLinearGradient(b.x0,b.y0,b.x1,b.y1);g.addColorStop(0,`rgba(255,248,210,${a*1.4})`);g.addColorStop(.7,`rgba(255,244,200,${a*.6})`);g.addColorStop(1,'rgba(255,244,200,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(b.x0-b.w*.3,b.y0);ctx.lineTo(b.x0+b.w*.3,b.y0);ctx.lineTo(b.x1+b.w*.6,b.y1);ctx.lineTo(b.x1-b.w*.6,b.y1);ctx.closePath();ctx.fill();
    for(let k=0;k<8;k++){const t=(hash(i,k,791)+T*.03*(1+hash(i,k,792)))%1,px=b.x0+(b.x1-b.x0)*t+Math.sin(T*.7+k)*b.w*.3,py=b.y0+(b.y1-b.y0)*t;drawGlow(ctx,px,py,5,'255,250,220',.5*Math.sin(Math.PI*t));}});
  ctx.restore();}
const MISTS=[];for(let i=0;i<12;i++)MISTS.push({x:fxw(150+i*95+hash(i,1,801)*60),y:fyw(560+hash(i,2,801)*45),r:110+hash(i,3,801)*90,ph:hash(i,4,801)*TAU});
const EDGE_MIST=[];for(let y=300;y<=1650;y+=120){EDGE_MIST.push({x:-1010,y,r:170,ph:y*.01});EDGE_MIST.push({x:1190,y,r:170,ph:y*.013});}for(let x=-950;x<=1150;x+=140)EDGE_MIST.push({x,y:1660,r:180,ph:x*.01});
function drawMist(){for(const m of EDGE_MIST){ctx.save();ctx.globalAlpha=.2+.06*Math.sin(T*.25+m.ph);ctx.drawImage(glowCanvas('230,242,232'),m.x-m.r*1.2,m.y-m.r*.8,m.r*2.4,m.r*1.6);ctx.restore();}for(const m of MISTS){const x=m.x+Math.sin(T*.12+m.ph)*30;ctx.save();ctx.globalAlpha=.16+.06*Math.sin(T*.3+m.ph);ctx.drawImage(glowCanvas('235,245,240'),x-m.r*1.4,m.y-m.r*.45,m.r*2.8,m.r*.9);ctx.restore();}}

/* ---------- bluebirds from the painting, flapping between two wing poses ---------- */
const BIRD_SPR=[[0,1],[2,1],[3,1],[4,1],[6,1],[9,-1],[12,-1]];const BIRDS=[];
for(let i=0;i<5;i++)BIRDS.push({x:0,y:0,vx:0,vy:0,t:-rnd(0,6),spr:BIRD_SPR[i%BIRD_SPR.length],s:rnd(.3,.4),ph:rnd(0,TAU),alive:false,flap:0,bank:0});
function spawnBird(b){const left=Math.random()<.5,vw=W/zoom,vh=H/zoom;b.x=cam.x+(left?-1:1)*(vw/2+60);b.y=cam.y-vh*.45+Math.random()*vh*.6;b.vx=(left?1:-1)*rnd(95,135);b.vy=0;b.alive=true;b.t=0;b.spr=BIRD_SPR[(Math.random()*BIRD_SPR.length)|0];}
function updateBirds(dt){for(const b of BIRDS){if(!b.alive){b.t+=dt;if(b.t>0)spawnBird(b);continue;}b.t+=dt;
  // gentle undulating flight: flap while climbing, glide while dipping
  const climb=Math.sin(b.t*1.4+b.ph);b.vy=-climb*16;b.x+=b.vx*dt;b.y+=b.vy*dt;b.flap+=dt*(climb>-.2?9:2.2);b.bank+=((-b.vy/b.vx)*(b.vx>0?1:-1)*.9-b.bank)*Math.min(1,dt*3);
  if(Math.abs(b.x-cam.x)>W/zoom/2+160){b.alive=false;b.t=-rnd(2,8);}}}
function drawBirds(){for(const b of BIRDS){if(!b.alive)continue;const [idx,native]=b.spr,im=IMG['bird'+idx];if(!ready(im))continue;
  const w=im.naturalWidth*b.s,h=im.naturalHeight*b.s,beat=Math.sin(b.flap),dir=b.vx>0?1:-1;
  ctx.save();ctx.translate(b.x,b.y+beat*1.5);ctx.rotate(b.bank*.25*dir);if(dir!==native)ctx.scale(-1,1);ctx.scale(1,.86+.14*beat);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();
  ctx.fillStyle='rgba(30,50,30,.07)';ctx.beginPath();ctx.ellipse(b.x,b.y+90,w*.3,w*.1,0,0,TAU);ctx.fill();}}


/* ---------- placed scenery (deterministic, infinite) ---------- */
const GS=.72;               // painted ground scale (texture px -> world units)
const BIG=255;              // scenery cell size
const MOUNDS=['mound1','mound2','mound3','mound4','mound5','mound6'],ROCKS=['rock1','rock2','rock3','rock4'];
const objCache=new Map();
const isMoundSide=(cx,cy)=>hash(cx,cy,14)>=.3;
function objAt(cx,cy){return null;const key=cx+','+cy;if(objCache.has(key))return objCache.get(key);let o=null;
  if(hash(cx,cy,11)<.62){const x=(cx+.15+hash(cx,cy,12)*.7)*BIG,y=(cy+.15+hash(cx,cy,13)*.7)*BIG;
    const nearRoad=y>560&&Math.abs(x-dX(y))<140;
    if(y>760&&inMap(x,y)&&x>-820&&x<1000&&!nearRoad){const isRock=hash(cx,cy,14)<.3;
      if(isRock){const k=ROCKS[(hash(cx,cy,15)*ROCKS.length)|0];o={kind:'rock',img:k,x,y,s:.6+hash(cx,cy,16)*.25};}
      else{const k=MOUNDS[(hash(cx,cy,15)*MOUNDS.length)|0];o={kind:'mound',img:k,x,y,s:.8+hash(cx,cy,16)*.22,flip:hash(cx,cy,17)<.5,ph:hash(cx,cy,18)*TAU};}}}
  objCache.set(key,o);if(objCache.size>4000)objCache.clear();return o;}
// (creek stones are painted into the creek)

/* flower clusters: forget-me-nots and buttercups */
const FCELL=150;
function flowersAt(cx,cy){if(hash(cx,cy,31)>.3)return null;const out=[];const bx=(cx+.5)*FCELL+(hash(cx,cy,32)-.5)*80,by=(cy+.5)*FCELL+(hash(cx,cy,33)-.5)*80;
  const yellow=hash(cx,cy,34)<.3,n=3+(hash(cx,cy,35)*6|0);
  for(let i=0;i<n;i++){const x=bx+(hash(cx,cy,40+i)-.5)*70,y=by+(hash(cx,cy,60+i)-.5)*40;if(y<-40||!inMap(x,y)||inStream(x,y,-14)||keepClear(x,y)||(y>560&&Math.abs(x-dX(y))<40))continue;
    out.push({x,y,h:9+hash(cx,cy,80+i)*9,yellow,ph:hash(cx,cy,100+i)*TAU,s:.8+hash(cx,cy,120+i)*.5});}
  return out;}

/* procedural grass clumps (sway, bend around Lum) */
const CELL=52;
function tuftAt(cx,cy){if(hash(cx,cy)>.72)return null;const x=cx*CELL+hash(cx,cy,1)*CELL,y=cy*CELL+hash(cx,cy,2)*CELL;if(y<-40||!inMap(x,y)||inStream(x,y,-10)||keepClear(x,y)||(y>560&&Math.abs(x-dX(y))<36))return null;
  return {x,y,n:5+(hash(cx,cy,3)*6|0),h:16+hash(cx,cy,4)*20,hue:hash(cx,cy,5)};}

