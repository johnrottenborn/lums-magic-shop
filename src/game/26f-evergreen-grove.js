/* ---------- Chapter 2: Evergreen Grove, between Amroth's home (north) and the Coastal Path (south) ----------
   Laid out from the designer's sketch (paper coords x1.2): evergreen bands down the west and east sides, groves in the middle
   (a T-shaped one, a west blob, a middle-east blob, a strip off the east band), a lake in the south-west, a clump at the south.
   A faint, broken old path winds from the north entrance to the south exit. Berry bushes, Venomvine bushes, flowers.
   Built as another region of the Stranglethorn world, far east of Amroth's home. Foes still to come (listed for the designer first). */
const GROVEX=HOMEX+3000,GROVEY=500,GW=1820,GH=2120,GVT={t:99};
const gp=a=>a.map(([x,y])=>[x*1.2,y*1.2]);
const GTREES=[
  gp([[20,300],[120,160],[300,120],[560,140],[590,200],[560,260],[400,280],[230,330],[170,600],[150,1000],[140,1100],[40,1130],[10,1060],[20,700]]),   /* west band */
  gp([[800,140],[1000,130],[1240,200],[1360,420],[1420,900],[1410,1500],[1300,1530],[1200,1520],[1150,1300],[1150,900],[1130,560],[1000,280],[820,220]]),   /* east band */
  gp([[380,430],[480,360],[700,350],[900,390],[920,470],[780,520],[720,560],[710,720],[600,740],[580,600],[560,520],[400,500]]),   /* the T grove */
  gp([[270,690],[350,670],[400,720],[400,800],[600,860],[640,930],[540,930],[320,920],[260,820]]),   /* west blob */
  gp([[640,870],[820,850],[900,620],[1110,590],[1140,740],[1020,780],[1000,1000],[960,1220],[880,1200],[860,1000],[780,960],[640,950]]),   /* middle-east blob and strip */
  gp([[580,1500],[700,1450],[880,1480],[1020,1560],[1010,1700],[960,1720],[820,1620],[640,1560]]),   /* south clump */
];
const GLAKE=gp([[-200,1020],[60,1010],[220,1030],[340,1130],[500,1210],[640,1380],[700,1600],[690,1900],[300,1900],[-200,1900]]);   /* runs off the west and south edges of the map */
/* the old path: north entrance to south exit, around the groves (worn and broken in places) */
const GPATH_CTRL=gp([[650,-320],[650,60],[620,230],[470,300],[300,440],[245,640],[230,860],[300,990],[480,1050],[640,1180],[760,1330],[930,1400],[1060,1460],[1100,1600],[1040,1780]]).map(([x,y])=>[x+GROVEX,y+GROVEY]);
const GPATH_PTS=splinePts(GPATH_CTRL,20);let GPATHP=null;
const GENTRY={x:650*1.2,y:90*1.2},GEXIT={x:1040*1.2,y:1700*1.2};
const GH_=(a,b)=>hash(a,b,4417);
/* grassy clearings inside the bigger groves, left open to wander through */
const GCLEAR=[[780,610,190],[500,960,150],[1090,930,190],[1520,1000,210],[1480,520,170],[990,1880,150]];
/* the evergreens: worked out once (region coords) so the bushes can sit along the tree line and Lum walks between the trunks */
const GTRUNKS=[],GSPOTS=[];
{let k=0;for(let gy=60;gy<GH;gy+=95)for(let gx=20;gx<GW;gx+=105){k++;const lx=gx+(GH_(k,71)-.5)*60,ly=gy+(GH_(k,72)-.5)*50;
  if(!GTREES.some(T=>inPoly(lx,ly,T))||inPoly(lx,ly,GLAKE)||GH_(k,76)<.5||GCLEAR.some(([cx,cy,r])=>Math.hypot(lx-cx,(ly-cy)*1.2)<r))continue;   /* thinned out, with clearings */
  let clear=true;for(let up=0;up<=400&&clear;up+=40)if(gpathDist(lx+GROVEX,ly-up+GROVEY)<(up?110:150)||Math.hypot(lx-GENTRY.x,ly-up-GENTRY.y)<260)clear=false;if(!clear)continue;   /* the old path and the way in stay in view */
  const [img,w]=HTREES[Math.floor(GH_(k,73)*HTREES.length)];GTRUNKS.push([lx,ly]);GSPOTS.push({lx,ly,img,w:w*(.75+GH_(k,74)*.35),flip:GH_(k,75)<.5});}}
/* the south end: thick woods either side of the old path down to the exit, the path itself left clear */
const GSHRUBS=[],SWOODS=[];
{let k=0;for(let ly=1560;ly<GH+120;ly+=72)for(let lx=40;lx<GW-20;lx+=80){k++;const jx=lx+(GH_(k,151)-.5)*44,jy=ly+(GH_(k,152)-.5)*34;
  if(inPoly(jx,jy,GLAKE)||inPoly(jx,jy+40,GLAKE))continue;const d=gpathDist(jx+GROVEX,jy+GROVEY);if(d<150)continue;
  let clear=true;for(let up=40;up<=360&&clear;up+=40)if(gpathDist(jx+GROVEX,jy-up+GROVEY)<105)clear=false;
  SWOODS.push([jx,jy]);
  if(clear&&GH_(k,153)<.5&&d>130){const [img,w]=HTREES[Math.floor(GH_(k,154)*HTREES.length)];GTRUNKS.push([jx,jy]);GSPOTS.push({lx:jx,ly:jy,img,w:w*(.7+GH_(k,155)*.3),flip:GH_(k,156)<.5});}
  else GSHRUBS.push({lx:jx,ly:jy,k:[1,3,10,5][Math.floor(GH_(k,157)*4)],s:.75+GH_(k,158)*.3,flip:GH_(k,159)<.5});}}
const nearTree=(lx,ly)=>{let b=1e9;for(const [tx,ty] of GTRUNKS)b=Math.min(b,Math.hypot(lx-tx,(ly-ty)*1.4));return b;};
/* berry bushes and the new Venomvine (a dark, thorny vine bush) to forage */
const GFORAGE=[[320,560,6],[380,1000,0],[700,1250,4],[1050,1380,6],[480,330,0],[760,780,4],[1080,1100,0],[300,1000,'venom'],[880,1300,'venom'],[560,300,'venom']]
  .map(([x,y,k])=>({x:x*1.2+GROVEX,y:y*1.2+GROVEY,k:k==='venom'?11:k,venom:k==='venom',id:k==='venom'?'venomvine':FORAGE_MAP[k],n:2,picked:0}));
for(const f of GFORAGE){let best=null;for(let r=0;r<420&&!best;r+=12)for(let a=0;a<TAU;a+=TAU/24){const x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r,lx=x-GROVEX,ly=y-GROVEY,d=gpathDist(x,y),nt=nearTree(lx,ly);if(d<100||nt<60||nt>125||inPoly(lx,ly,GLAKE)||lx<60||lx>GW-60||ly<170||ly>GH-170)continue;best=[x,y];break;}if(best)[f.x,f.y]=best;}   /* along the tree line, never on the path */
const inGrove=()=>lum.x>GROVEX-300;

function gpathDist(x,y){let best=1e9;for(let i=0;i<GPATH_PTS.length-1;i++){const [ax,ay]=GPATH_PTS[i],[bx,by]=GPATH_PTS[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);best=Math.min(best,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return best;}
function groveFree(x,y){const lx=x-GROVEX,ly=y-GROVEY;
  if(ly<120&&Math.abs(lx-GENTRY.x)<70&&ly>40)return true;   /* the north entrance */
  if(ly>GH-160&&Math.abs(lx-GEXIT.x)<70&&ly<GH-20)return true;   /* the south exit */
  if(lx<30||lx>GW-30||ly<120||ly>GH-150)return false;
  if(inPoly(lx,ly,GLAKE))return false;
  if(gpathDist(x,y)<55)return true;   /* the old path runs through the groves */
  if(ly>1500)for(const [wx,wy] of SWOODS)if(((lx-wx)/62)**2+((ly-wy)/54)**2<1)return false;   /* the thick south woods; the open grass beside the path stays walkable */
  for(const [tx,ty] of GTRUNKS)if(Math.abs(lx-tx)<34&&ly-ty<14&&ty-ly<22)return false;   /* the grass is open; only the trunks are solid */
  return true;}
/* evergreens filling every grove, flowers on the open ground, stones along the old path */
function groveProps(P){const X=x=>x+GROVEX,Y=y=>y+GROVEY;let k=0;
  for(const h of GSHRUBS)P.push({t:'shrub',k:h.k,x:X(h.lx),y:Y(h.ly),s:SHR[h.k].s*h.s,flip:h.flip,ph:h.lx*.01});
  for(const t of GSPOTS)P.push({t:'tree',img:t.img,x:X(t.lx),y:Y(t.ly),w:t.w,flip:t.flip,base:.95});
  /* trees beyond the map edge so it never looks bare */
  for(let gy=0;gy<GH+200;gy+=160){if(!inPoly(-60,gy,GLAKE))P.push({t:'tree',img:'hfir',x:X(-60),y:Y(gy),w:260,flip:false,base:.95});P.push({t:'tree',img:'hbig',x:X(GW+70),y:Y(gy),w:380,flip:true,base:.95});}
  const KINDS=['lavender','rose','delph','magic','mint'];let q=0;
  for(let i=0;i<260;i++){const lx=60+GH_(i,81)*(GW-120),ly=160+GH_(i,82)*(GH-360);if(!groveFree(X(lx),Y(ly))||gpathDist(X(lx),Y(ly))<90||nearTree(lx,ly)>140)continue;q++;   /* along the tree line; the open grass stays clear */
    const n=1+Math.floor(GH_(i,83)*3);for(let j=0;j<n;j++)P.push({t:'plant',w:70,kind:KINDS[Math.floor(GH_(i,84)*KINDS.length)],i:Math.floor(GH_(i+j,85)*4),x:X(lx+j*22-20),y:Y(ly+(j%2)*10),s:.8+GH_(i+j,86)*.4,flip:GH_(i+j,87)<.5,ph:GH_(i+j,88)*TAU});}
  for(const f of GFORAGE)P.push({t:'shrub',k:f.k,x:f.x,y:f.y,s:SHR[f.k].s*.85,flip:f.x%2<1,ph:f.x*.01,venom:f.venom});}
/* ground: the worn path, broken into patches, and the lake */
function drawGroveGround(x0,y0,x1,y1){if(x1<GROVEX-300)return;if(!GPATHP)GPATHP=buildPath(GPATH_CTRL,100,9.7);
  ctx.save();ctx.globalAlpha=.55;drawPath(GPATHP,x0,x1);ctx.restore();   /* faint: hardly anyone walks it any more */
  ctx.save();ctx.globalCompositeOperation='destination-over';ctx.restore();
  ctx.save();ctx.translate(GROVEX,GROVEY);
  const lake=(off=0)=>{const P_=GLAKE,n=P_.length,cx=P_.reduce((a,p)=>a+p[0],0)/n,cy=P_.reduce((a,p)=>a+p[1],0)/n,pt=i=>{const [x,y]=P_[(i+n)%n],dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)||1;return [x+dx/d*off,y+dy/d*off];};
    ctx.beginPath();let [ax,ay]=pt(0),[bx,by]=pt(1);ctx.moveTo((ax+bx)/2,(ay+by)/2);for(let i=1;i<=n;i++){const [x,y]=pt(i),[x2,y2]=pt(i+1);ctx.quadraticCurveTo(x,y,(x+x2)/2,(y+y2)/2);}ctx.closePath();};   /* rounded shoreline */
  lake(26);ctx.fillStyle='rgba(70,60,40,.28)';ctx.fill();lake(12);ctx.fillStyle='rgba(150,128,92,.5)';ctx.fill();   /* muddy, sandy shore */
  lake(0);ctx.fillStyle=waterPattern(ctx,'water_tile',.7)||'#3c6a78';ctx.fill();
  ctx.save();ctx.clip();lake(-30);ctx.lineWidth=60;ctx.strokeStyle='rgba(190,230,235,.18)';ctx.stroke();
  ctx.strokeStyle='rgba(225,242,248,.35)';ctx.lineWidth=1.4;for(let i=0;i<20;i++){const q=(T*.4+hash(i,1,983))%1,rx=150+hash(i,2,983)*500,ry=1320+hash(i,3,983)*480,r=4+q*24;ctx.globalAlpha=1-q;ctx.beginPath();ctx.ellipse(rx,ry,r,r*.4,0,0,TAU);ctx.stroke();}ctx.restore();
  lake(0);
  ctx.strokeStyle='rgba(40,30,20,.55)';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
function enterGrove(fromSouth){SCENE='thorn';const p=fromSouth?GEXIT:GENTRY;lum.x=GROVEX+p.x;lum.y=GROVEY+p.y+(fromSouth?-70:70);   /* just inside the way in from Amroth's home */lum.face=1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;GVT.t=0;}
function drawGroveTitle(){if(!inGrove()||GVT.t>=4.5||SCENE!=='thorn')return;GVT.t+=1/60;const a=Math.min(1,GVT.t*1.5,(4.5-GVT.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(20,16,12,.55)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f6ecd8';ctx.font=`600 ${Math.round(Math.min(30,W/13))}px Georgia,serif`;ctx.fillText('Evergreen Grove',W/2,H*.3+10);ctx.restore();}
/* the north entrance (back to Amroth's home) and the south exit (the Coastal Path, map still to come) */
THINT.push({get x(){return GROVEX+GENTRY.x;},get y(){return GROVEY+GENTRY.y-30;},get reach(){return inGrove()?80:0;},door:true,onInteract:()=>enterHomeFromGrove()},
  {get x(){return GROVEX+GEXIT.x;},get y(){return GROVEY+GEXIT.y+20;},get reach(){return inGrove()?80:0;},door:true,onInteract:()=>say("The Coastal Path lies ahead.")});
for(const f of GFORAGE)THINT.push({x:f.x,y:f.y,get reach(){return inGrove()?76:0},forage:f,onInteract:()=>pickForage(f)});
function enterHomeFromGrove(){SCENE='thorn';lum.x=HOMEX+HOME.gate.x;lum.y=HOMEY+HH-70;lum.face=1;lum.dir='up';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-200;THORN.t=99;}
