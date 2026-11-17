/* ---------- Chapter 2: Amroth's home, beyond the Worldbind Passage ----------
   An outdoor area about the size of the clearing, built as a region of the Stranglethorn world (same draw/walk engine), far east of the clearing:
   north, a stone mountain face with a second gatehouse (the way back into the passage, room 20); a dirt path winds south through dense firs
   to a small cottage with a pond in front of it.
   Stand-in art until the designer's arrives: the mountain is 'worldbind_cliff', the gatehouse is 'outpost';
   the pond is painted in code and there is no fishing pier yet. */
const HOMEX=CPATH.xt+3300,HOMEY=500,HW=1900,HH=1700;
const HOME={t:99,pier:{x:1400,y:1330,w:300},arch:{x:523,y:470},gate:{x:300,y:1505},cot:{x:1457,y:940,w:460,door:-92},pond:{x:1580,y:1330,rx:300,ry:140},pond2:{x:1330,y:1285,rx:150,ry:82},yard:{x:1400,y:1130,rx:400,ry:270}};
const HPATH_CTRL=[[523,440],[540,620],[470,800],[420,980],[560,1150],[820,1235],[1080,1195],[1250,1080],[1335,1028],[1362,985],[1365,950],[1365,925]]   /* runs right up under the front step */.map(([x,y])=>[x+HOMEX,y+HOMEY]);
const HPATH_PTS=splinePts(HPATH_CTRL,20);let HPATHP=null;
/* a second path branches off and winds south-southwest to the far gatehouse (the way to the coast) */
const HPATH2_CTRL=[[455,880],[400,1010],[330,1150],[290,1260],[300,1360],[300,1480],[300,1600],[300,1760]]   /* on through the gatehouse arch and out the bottom of the map */.map(([x,y])=>[x+HOMEX,y+HOMEY]);
const HPATH2_PTS=splinePts(HPATH2_CTRL,20);let HPATH2P=null;
/* berry bushes to forage (like the woods by Lum's shop): duskberry, dewberry, emberberry */
const HFORAGE=[[600,700,6],[380,890,0],[620,1080,4],[230,1180,6],[1180,880,0],[1700,1180,4],[960,1290,6]].map(([x,y,k])=>({x:x+HOMEX,y:y+HOMEY,k,id:FORAGE_MAP[k],n:2,picked:0}));
const inHome=()=>lum.x>HOMEX-200&&lum.x<HOMEX+2700;   /* (Evergreen Grove lies further east) */
function hpathDist(x,y){let best=1e9;for(const PTS of [HPATH_PTS,HPATH2_PTS])for(let i=0;i<PTS.length-1;i++){const [ax,ay]=PTS[i],[bx,by]=PTS[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1),d=Math.hypot(x-ax-dx*t,y-ay-dy*t);if(d<best)best=d;}return best;}
/* berry bushes sit just beside the paths, never on them: each one is nudged to the nearest spot off the path, still within reach of it */
for(const f of HFORAGE){if(hpathDist(f.x,f.y)>=115)continue;let best=null;for(let r=10;r<260&&!best;r+=10)for(let a=0;a<TAU;a+=TAU/24){const x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r,lx=x-HOMEX,ly=y-HOMEY,d=hpathDist(x,y);
  if(d<115||d>150||((lx-HOME.pond.x)/(HOME.pond.rx+60))**2+((ly-HOME.pond.y)/(HOME.pond.ry+60))**2<1||(lx>HOME.cot.x-240&&lx<HOME.cot.x+250&&ly>HOME.cot.y-170&&ly<HOME.cot.y+40))continue;best=[x,y];break;}
  if(best)[f.x,f.y]=best;}
/* the fishing pier (the designer's art, 455x343) reaches from the pond's west bank out over the water; its deck is walkable */
const PIERIMG=[455,343];
function pierPt(ix,iy){const P=HOME.pier,k=P.w/PIERIMG[0];return [P.x-P.w/2+ix*k,P.y-PIERIMG[1]*k+iy*k];}
const PIERDECK=[[8,168],[165,200],[440,100],[290,66]].map(([x,y])=>pierPt(x,y));
const HTRUNKS=[];   /* tree roots (region coords): the grass is walkable, the trunks are not */
const inEll=(lx,ly,e,k=1)=>((lx-e.x)/(e.rx*k))**2+((ly-e.y)/(e.ry*k))**2<1;
function homeFree(x,y){const lx=x-HOMEX,ly=y-HOMEY;if(lx<30||lx>HW-30||ly<400||ly>HH-10)return false;
  {const G=HOME.gate;if(lx>G.x-165&&lx<G.x+265&&ly>G.y-130&&ly<G.y+6&&(Math.abs(lx-G.x)>44||(HST.st<4&&ly>G.y-70)))return false;}   /* the far gatehouse: through the arch only, once the gate is up */
  if(ly>HOME.gate.y-60&&Math.abs(lx-HOME.gate.x)>(ly>HOME.gate.y+40?75:44)&&!(lx>HOME.gate.x+215&&hpathDist(x,y)<62))return false;   /* the woods either side of the far gatehouse can't be walked through */
  if(ly>HH-120&&Math.abs(lx-HOME.gate.x)<70)return true;   /* the path runs on to the south edge */
  if(inPoly(lx,ly,PIERDECK))return true;   /* out on the pier */
  if(inEll(lx,ly,HOME.pond,1.05)||inEll(lx,ly,HOME.pond2,1.05))return false;
  if(lx>HOME.pond2.x-HOME.pond2.rx-70&&ly>HOME.pond.y+HOME.pond.ry*.55)return false;   /* the willow wood below the pond */
  if(lx>HOME.cot.x-215&&lx<HOME.cot.x+225&&ly>HOME.cot.y-160&&ly<HOME.cot.y-6)return false;
  if(hpathDist(x,y)<62)return true;
  if(inEll(lx,ly,{x:HOME.arch.x,y:HOME.arch.y+70,rx:150,ry:90}))return true;
  if(ly<HOME.arch.y+40)return false;   /* the mountain face */
  for(const [tx,ty] of HTRUNKS)if(Math.abs(lx-tx)<34&&ly-ty<14&&ty-ly<22)return false;   /* walk among the trees, not through their trunks */
  return true;}
/* the region's scenery, added to Stranglethorn's prop list (21) */
/* the designer's lush green evergreens for Amroth's home: a slim fir, a great tall one, a twisted little one */
const HTREES=[['hfir',240],['hbig',400],['hfir',260],['htwist',250],['hfir',230],['hbig',380],['htwist',240]];
function homeProps(P,PN){const X=x=>x+HOMEX,Y=y=>y+HOMEY,H_=(a,b)=>hash(a,b,971);
  P.push({t:'tree',img:'worldbind_cliff',x:X(620),y:Y(440),w:2500,flip:false,solid:1},{t:'tree',img:'worldbind_cliff',x:X(1480),y:Y(420),w:2400,flip:true,solid:1});
  P.push({t:'tree',img:'outpost_open',x:X(HOME.gate.x+52),y:Y(HOME.gate.y+8),sy:Y(HOME.gate.y-40),w:430,flip:false,solid:1});   /* the far gatehouse, bottom left (stand-in art) */
  P.push({t:'tree',img:'pier',x:X(HOME.pier.x),y:Y(HOME.pier.y),sy:Y(HOME.pier.y-190),w:HOME.pier.w,flip:false,solid:1});   /* drawn before anyone standing on its deck */
  for(let i=0;i<22;i++){const lx=(i%2?520:20)+H_(i,61)*(i%2?320:170),ly=1330+H_(i,62)*400;if(hpathDist(X(lx),Y(ly))<300||hpathDist(X(lx),Y(ly-200))<180||(Math.abs(lx-HOME.gate.x)<240&&ly>HOME.gate.y-280)||inEll(lx,ly,HOME.yard,1.05)||inEll(lx,ly,HOME.pond,1.3))continue;   /* thicker woods right of the far gatehouse */
    const [img,w]=HTREES[Math.floor(H_(i,63)*HTREES.length)];HTRUNKS.push([lx,ly]);P.push({t:'tree',img,x:X(lx),y:Y(ly),w:w*(.8+H_(i,64)*.3),flip:H_(i,65)<.5,base:.95});}
  /* willows and long grass around the pond, softening its edge */
  {const p=HOME.pond,q=HOME.pond2;for(const [wx,wy,s_,f] of [[p.x+p.rx+10,p.y+p.ry*.55,.4,1],[q.x-q.rx-40,q.y+q.ry+120,.38,0],[p.x+p.rx+20,p.y-p.ry-30,.34,1]])P.push({t:'willow',w:340,x:X(wx),y:Y(wy),s:s_,flip:!!f,ph:wx*.01});
    for(let i=0,wx=1150;wx<HW+120;wx+=210,i++)for(const r of [0,1]){const yy=HH+95+r*100+(H_(i+r*9,141)-.5)*40,xx=wx+r*105+(H_(i+r*9,142)-.5)*50;P.push({t:'willow',w:460,x:X(xx),y:Y(yy),s:.52+H_(i+r*9,143)*.1,flip:H_(i+r*9,144)<.5,ph:xx*.013});}   /* big willows filling the ground south of the pond */
    for(let i=0;i<70;i++){const e=i<14?HOME.pond2:p,a=H_(i,91)*TAU,r=1.02+H_(i,92)*.14,gx=e.x+Math.cos(a)*e.rx*r,gy=e.y+Math.sin(a)*e.ry*r;if(inEll(gx,gy,p,.99)||inEll(gx,gy,HOME.pond2,.99)||inPoly(gx,gy,PIERDECK)||hpathDist(X(gx),Y(gy))<60)continue;
      P.push({t:'tuft',w:40,x:X(gx),y:Y(gy),n:5+Math.floor(H_(i,93)*4),h:26+H_(i,94)*22,hue:H_(i,95)});}}
  /* a dense wall of firs and shrubs either side of the far gatehouse, so the only way south is through its arch */
  {const G=HOME.gate;let k=0;
    for(let ly=G.y-70;ly<HH+140;ly+=70)for(let lx=G.x+215;lx<1060;lx+=78){k++;const jx=lx+(H_(k,121)-.5)*40,jy=ly+(H_(k,122)-.5)*30;
      let clear=true;for(let up=0;up<=420&&clear;up+=35)if(hpathDist(X(jx),Y(jy-up))<(up<120?110:90))clear=false;
      if(clear&&H_(k,123)<.55){const [img,w]=HTREES[Math.floor(H_(k,124)*HTREES.length)];HTRUNKS.push([jx,jy]);P.push({t:'tree',img,x:X(jx),y:Y(jy),w:w*(.7+H_(k,125)*.3),flip:H_(k,126)<.5,base:.95});}
      else if(hpathDist(X(jx),Y(jy))>85){const kk=[1,3,10,5][Math.floor(H_(k,127)*4)];P.push({t:'shrub',k:kk,x:X(jx),y:Y(jy),s:SHR[kk].s*(.75+H_(k,128)*.3),flip:H_(k,129)<.5,ph:jx*.01});}}
    for(let ly=G.y-60;ly<HH+140;ly+=75){k++;for(const lx of [40,120]){const jx=lx+(H_(k,131)-.5)*30;P.push({t:'shrub',k:[1,3,10][k%3],x:X(jx),y:Y(ly),s:SHR[1].s*.85,flip:k%2<1,ph:jx*.01});}}}
  for(const f of HFORAGE)P.push({t:'shrub',k:f.k,x:f.x,y:f.y,s:SHR[f.k].s*.85,flip:f.x%2<1,ph:f.x*.01});
  P.push({t:'gatebars',x:X(HOME.gate.x),y:Y(HOME.gate.y+9),w:120});
  P.push({t:'tree',img:'outpost',x:X(HOME.arch.x+52),y:Y(HOME.arch.y+8),sy:Y(HOME.arch.y-40),w:430,flip:false,solid:1});
  P.push({t:'tree',img:'amroth_cottage',x:X(HOME.cot.x),y:Y(HOME.cot.y),w:HOME.cot.w,flip:false,solid:1});   /* the designer's thatched cottage; its door is left of centre */
  // dense firs everywhere the path, the yard and the gatehouse apron are not
  let k=0;for(let gy=470;gy<HH+160;gy+=125)for(let gx=-40;gx<HW+80;gx+=140){k++;const lx=gx+(H_(k,1)-.5)*90,ly=gy+(H_(k,2)-.5)*70,x=X(lx),y=Y(ly);
    // a tree's crown rises well above its roots, so keep the whole column above it clear of the path, the yard and the gatehouse
    let hit=false;for(let up=0;up<=460&&!hit;up+=40){const yy=ly-up;if(hpathDist(x,Y(yy))<(up?(up<=230?95:120):150)||inEll(lx,yy,HOME.yard,up?1:1.12)||inEll(lx,yy,HOME.pond,1.25)||inEll(lx,yy,{x:HOME.arch.x,y:HOME.arch.y,rx:280,ry:150})||inEll(lx,yy,{x:HOME.gate.x,y:HOME.gate.y,rx:280,ry:150}))hit=true;}if(hit)continue;
    const [img,w]=HTREES[Math.floor(H_(k,3)*HTREES.length)];HTRUNKS.push([lx,ly]);P.push({t:'tree',img,x,y,w:w*(.8+H_(k,4)*.3),flip:H_(k,5)<.5,base:.95});}
  // flowers from Lum's garden (the painted lavender, roses, delphiniums and magic blooms): beds along the cottage front and sides,
  // and drifts around the roots of the firs nearest the cottage so no bare roots show
  const C=HOME.cot,KINDS=['lavender','rose','delph','magic','lavender','rose','mint'],fl=[];let q=0;
  const bloom=(lx,ly,s=1)=>{q++;if(hpathDist(X(lx),Y(ly))<48||inEll(lx,ly,HOME.pond,1.1))return;if(lx>C.x+C.door-48&&lx<C.x+C.door+48&&ly>C.y-30)return;   /* keep the step clear */
    fl.push({t:'plant',w:70,kind:KINDS[Math.floor(H_(q,21)*KINDS.length)],i:Math.floor(H_(q,22)*4),x:X(lx),y:Y(ly),s:s*(.8+H_(q,23)*.45),flip:H_(q,24)<.5,ph:H_(q,25)*TAU});};
  for(let lx=C.x-240;lx<=C.x+240;lx+=26){bloom(lx+(H_(lx,26)-.5)*10,C.y+6+H_(lx,27)*10);bloom(lx+13,C.y+30+H_(lx,28)*14,.9);}   /* beds along the front */
  for(let i=0;i<46;i++){const r=H_(i,31),a=H_(i,32);bloom(C.x+215+r*150,C.y-170+a*240,1.05);}   /* the right side, thick with flowers */
  for(let i=0;i<26;i++){const r=H_(i,33),a=H_(i,34);bloom(C.x-230-r*110,C.y-150+a*200);}   /* the left side */
  for(const t of P){if(t.t!=='tree'||!/pine|spruce|twist|sapling|hfir|hbig/.test(t.img)||Math.hypot(t.x-X(C.x),t.y-Y(C.y))>900)continue;   /* drifts over the fir roots */
    const rx=t.w*.36;for(let j=0;j<16;j++){const a=H_(j,t.x|0)*Math.PI*1.15-.08,rr=.35+H_(j+40,t.y|0)*.75;bloom(t.x-X(0)+Math.cos(a)*rx*rr,t.y-Y(0)+Math.sin(a)*rx*.34*rr+4,1.1);}}
  P.push(...fl);
  // a few stones along the path
  for(let i=0;i<9;i++){const p=HPATH_PTS[Math.floor(i/9*HPATH_PTS.length)],sd=i%2?1:-1;P.push({t:'tree',img:'rock'+(1+i%4),x:p[0]+sd*(95+H_(i,7)*30),y:p[1]+H_(i,8)*20,w:70+H_(i,9)*40,flip:H_(i,10)<.5});}}
/* ground pass: the winding path and the pond */
function drawHomeGround(x0,y0,x1,y1){if(x1<HOMEX-300)return;if(!HPATHP)HPATHP=buildPath(HPATH_CTRL,125,8.2);if(!HPATH2P)HPATH2P=buildPath(HPATH2_CTRL,110,8.2);drawPath(HPATH2P,x0,x1);drawPath(HPATHP,x0,x1);
  const p=HOME.pond,cx=p.x+HOMEX,cy=p.y+HOMEY,q=HOME.pond2,qx=q.x+HOMEX,qy=q.y+HOMEY;
  const both=(grow=0,dy=0)=>{ctx.beginPath();ctx.ellipse(cx,cy+dy,p.rx+grow,p.ry+grow*.75,0,0,TAU);ctx.moveTo(qx+q.rx+grow,qy+dy);ctx.ellipse(qx,qy+dy,q.rx+grow,q.ry+grow*.75,0,0,TAU);};
  ctx.save();ctx.fillStyle='rgba(58,44,30,.55)';both(22,6);ctx.fill('nonzero');
  ctx.strokeStyle='rgba(40,30,20,.6)';ctx.lineWidth=4;both();ctx.stroke();   /* the shore line; the water below covers its inner half and the seam */
  ctx.fillStyle=waterPattern(ctx,'water_tile',.5)||'#3c6a78';both();ctx.fill('nonzero');   /* the designer's water art */
  both();ctx.clip('nonzero');
  {const g=ctx.createRadialGradient(cx-80,cy-10,p.rx*.35,cx-80,cy-10,p.rx*1.25);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,30,40,.35)');ctx.fillStyle=g;ctx.fillRect(qx-q.rx-20,cy-p.ry-40,p.rx*2+400,p.ry*2+80);}
  ctx.strokeStyle='rgba(220,240,245,.35)';ctx.lineWidth=1.4;for(let i=0;i<18;i++){const t_=(T*.5+hash(i,1,973))%1,rx=cx-120+(hash(i,2,973)-.5)*p.rx*2,ry=cy+(hash(i,3,973)-.5)*p.ry*1.5,r=4+t_*22;ctx.globalAlpha=1-t_;ctx.beginPath();ctx.ellipse(rx,ry,r,r*.4,0,0,TAU);ctx.stroke();}
  ctx.globalAlpha=1;ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.ellipse(cx-p.rx*.1,cy-p.ry*.45,p.rx*.35,p.ry*.16,-.1,0,TAU);ctx.fill();ctx.restore();}
/* interactions: the gatehouse arch back into the passage, the cottage door, the pond */
function homeInts(){const X=x=>x+HOMEX,Y=y=>y+HOMEY;return [
  {x:X(HOME.arch.x),y:Y(HOME.arch.y+30),get reach(){return inHome()?85:0},door:true,onInteract:()=>dunGo(20,900,690,1)},
  {x:X(HOME.cot.x+HOME.cot.door),y:Y(HOME.cot.y+15),get reach(){return inHome()?85:0},door:true,onInteract:()=>dunGo(21,566,618,1)}   /* just inside, on the floor beside the door */,
  {x:X(HOME.gate.x),y:Y(HOME.gate.y-110),get reach(){return inHome()&&HST.st<4?85:0},onInteract:()=>say("The gate is down. It won't budge.")},
  {x:X(HOME.gate.x),y:Y(HH-40),get reach(){return inHome()&&HST.st>=4?80:0},door:true,onInteract:()=>goScene(()=>enterGrove(false))},   /* the coastal path map comes next */
  {x:X(HOME.pond.x-HOME.pond.rx+20),y:Y(HOME.pond.y),get reach(){return inHome()?110:0},onInteract:()=>say("A quiet pond. Rain dimples the water.")}];}
/* out of the cottage's front door, onto the step */
function leaveCottage(){SCENE='thorn';lum.x=HOMEX+HOME.cot.x+HOME.cot.door;lum.y=HOMEY+HOME.cot.y+30;lum.face=1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y+200;THORN.t=99;HOME.t=99;}
function enterHome(){SCENE='thorn';lum.x=HOMEX+HOME.arch.x;lum.y=HOMEY+HOME.arch.y+60;lum.face=1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y+200;THORN.t=99;HOME.t=0;if(/Amroth’s home/.test(GOAL.text)){GOAL.tag='';GOAL.text='';}}
function drawHomeTitle(){if(!inHome()||HOME.t>=4.5||SCENE!=='thorn')return;HOME.t+=1/60;const a=Math.min(1,HOME.t*1.5,(4.5-HOME.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(10,8,14,.5)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#e8eef6';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText("Amroth's Home",W/2,H*.3+10);ctx.restore();}
THINT.push(...homeInts());
for(const f of HFORAGE)THINT.push({x:f.x,y:f.y,get reach(){return inHome()?76:0},forage:f,onInteract:()=>pickForage(f)});
/* a garden plant (painted in 03-garden) standing in the Stranglethorn world, swaying like it does at Lum's shop */
function drawHomePlant(o){if(!PLANTS.lavender)paintPlants();const set=PLANTS[o.kind];if(!set)return;const sp=set[o.i%set.length],w=sp.w*o.s,h=sp.h*o.s;
  const dx=o.x-lum.x,dy=(o.y-lum.y)*1.5,d=Math.hypot(dx,dy),push=d<46?(1-d/46)*Math.sign(dx||1)*.35:0,sk=Math.sin(T*1.6+o.ph)*.05+push;
  ctx.save();ctx.translate(o.x,o.y);ctx.transform(1,0,sk,1,0,0);if(o.flip)ctx.scale(-1,1);ctx.drawImage(sp.c,-w/2,-h,w,h);ctx.restore();}
/* the far gatehouse's portcullis: down until Lum has slept at the cottage */
function drawHomeGate(){if(!inHome()||HST.st>=4)return;const gx=HOMEX+HOME.gate.x,gy=HOMEY+HOME.gate.y;ctx.save();  ctx.strokeStyle='#3a3530';ctx.lineWidth=6;for(let x=gx-44;x<=gx+44;x+=16){ctx.beginPath();ctx.moveTo(x,gy-170);ctx.lineTo(x,gy-28);ctx.stroke();}
  ctx.lineWidth=5;for(let y=gy-150;y<=gy-34;y+=28){ctx.beginPath();ctx.moveTo(gx-50,y);ctx.lineTo(gx+50,y);ctx.stroke();}
  ctx.fillStyle='#4a443d';for(let x=gx-44;x<=gx+44;x+=16){ctx.beginPath();ctx.moveTo(x-4,gy-30);ctx.lineTo(x+4,gy-30);ctx.lineTo(x,gy-20);ctx.fill();}ctx.restore();}
