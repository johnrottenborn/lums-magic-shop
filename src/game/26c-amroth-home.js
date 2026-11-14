/* ---------- Chapter 2: Amroth's home, beyond the Worldbind Passage ----------
   An outdoor area about the size of the clearing, built as a region of the Stranglethorn world (same draw/walk engine), far east of the clearing:
   north, a stone mountain face with a second gatehouse (the way back into the passage, room 20); a dirt path winds south through dense firs
   to a small cottage with a pond in front of it.
   Stand-in art until the designer's arrives: the mountain is 'worldbind_cliff', the gatehouse is 'outpost';
   the pond is painted in code and there is no fishing pier yet. */
const HOMEX=CPATH.xt+3300,HOMEY=500,HW=1900,HH=1700;
const HOME={t:99,arch:{x:523,y:470},cot:{x:1457,y:940,w:460,door:-92},pond:{x:1520,y:1290,rx:230,ry:105},yard:{x:1400,y:1130,rx:400,ry:270}};
const HPATH_CTRL=[[523,440],[540,620],[470,800],[420,980],[560,1150],[820,1235],[1080,1195],[1250,1080],[1335,1028],[1365,990],[1365,962]].map(([x,y])=>[x+HOMEX,y+HOMEY]);
const HPATH_PTS=splinePts(HPATH_CTRL,20);let HPATHP=null;
const inHome=()=>lum.x>HOMEX-200;
function hpathDist(x,y){let best=1e9;for(let i=0;i<HPATH_PTS.length-1;i++){const [ax,ay]=HPATH_PTS[i],[bx,by]=HPATH_PTS[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1),d=Math.hypot(x-ax-dx*t,y-ay-dy*t);if(d<best)best=d;}return best;}
const inEll=(lx,ly,e,k=1)=>((lx-e.x)/(e.rx*k))**2+((ly-e.y)/(e.ry*k))**2<1;
function homeFree(x,y){const lx=x-HOMEX,ly=y-HOMEY;if(lx<30||lx>HW-30||ly<400||ly>HH-40)return false;
  if(inEll(lx,ly,HOME.pond,1.05))return false;
  if(lx>HOME.cot.x-215&&lx<HOME.cot.x+225&&ly>HOME.cot.y-160&&ly<HOME.cot.y-6)return false;
  return hpathDist(x,y)<62||inEll(lx,ly,{x:HOME.arch.x,y:HOME.arch.y+70,rx:150,ry:90})||inEll(lx,ly,HOME.yard);}
/* the region's scenery, added to Stranglethorn's prop list (21) */
function homeProps(P,PN){const X=x=>x+HOMEX,Y=y=>y+HOMEY,H_=(a,b)=>hash(a,b,971);
  P.push({t:'tree',img:'worldbind_cliff',x:X(620),y:Y(440),w:2500,flip:false,solid:1},{t:'tree',img:'worldbind_cliff',x:X(1480),y:Y(420),w:2400,flip:true,solid:1});
  P.push({t:'tree',img:'outpost',x:X(HOME.arch.x+52),y:Y(HOME.arch.y+8),sy:Y(HOME.arch.y-40),w:430,flip:false,solid:1});
  P.push({t:'tree',img:'amroth_cottage',x:X(HOME.cot.x),y:Y(HOME.cot.y),w:HOME.cot.w,flip:false,solid:1});   /* the designer's thatched cottage; its door is left of centre */
  // dense firs everywhere the path, the yard and the gatehouse apron are not
  let k=0;for(let gy=470;gy<HH+160;gy+=125)for(let gx=-40;gx<HW+80;gx+=140){k++;const lx=gx+(H_(k,1)-.5)*90,ly=gy+(H_(k,2)-.5)*70,x=X(lx),y=Y(ly);
    // a tree's crown rises well above its roots, so keep the whole column above it clear of the path, the yard and the gatehouse
    let hit=false;for(let up=0;up<=460&&!hit;up+=40){const yy=ly-up;if((up<=230&&hpathDist(x,Y(yy))<(up?95:150))||inEll(lx,yy,HOME.yard,up?1:1.12)||inEll(lx,yy,HOME.pond,1.25)||inEll(lx,yy,{x:HOME.arch.x,y:HOME.arch.y,rx:280,ry:150}))hit=true;}if(hit)continue;
    const [img,w]=PN[Math.floor(H_(k,3)*PN.length)];P.push({t:'tree',img,x,y,w:w*(.8+H_(k,4)*.3),flip:H_(k,5)<.5,base:.95});}
  // flowers from Lum's garden (the painted lavender, roses, delphiniums and magic blooms): beds along the cottage front and sides,
  // and drifts around the roots of the firs nearest the cottage so no bare roots show
  const C=HOME.cot,KINDS=['lavender','rose','delph','magic','lavender','rose','mint'],fl=[];let q=0;
  const bloom=(lx,ly,s=1)=>{q++;if(hpathDist(X(lx),Y(ly))<48||inEll(lx,ly,HOME.pond,1.1))return;if(lx>C.x+C.door-48&&lx<C.x+C.door+48&&ly>C.y-30)return;   /* keep the step clear */
    fl.push({t:'plant',w:70,kind:KINDS[Math.floor(H_(q,21)*KINDS.length)],i:Math.floor(H_(q,22)*4),x:X(lx),y:Y(ly),s:s*(.8+H_(q,23)*.45),flip:H_(q,24)<.5,ph:H_(q,25)*TAU});};
  for(let lx=C.x-240;lx<=C.x+240;lx+=26){bloom(lx+(H_(lx,26)-.5)*10,C.y+6+H_(lx,27)*10);bloom(lx+13,C.y+30+H_(lx,28)*14,.9);}   /* beds along the front */
  for(let i=0;i<46;i++){const r=H_(i,31),a=H_(i,32);bloom(C.x+215+r*150,C.y-170+a*240,1.05);}   /* the right side, thick with flowers */
  for(let i=0;i<26;i++){const r=H_(i,33),a=H_(i,34);bloom(C.x-230-r*110,C.y-150+a*200);}   /* the left side */
  for(const t of P){if(t.t!=='tree'||!/pine|spruce|twist|sapling/.test(t.img)||Math.hypot(t.x-X(C.x),t.y-Y(C.y))>900)continue;   /* drifts over the fir roots */
    const rx=t.w*.36;for(let j=0;j<16;j++){const a=H_(j,t.x|0)*Math.PI*1.15-.08,rr=.35+H_(j+40,t.y|0)*.75;bloom(t.x-X(0)+Math.cos(a)*rx*rr,t.y-Y(0)+Math.sin(a)*rx*.34*rr+4,1.1);}}
  P.push(...fl);
  // a few stones along the path
  for(let i=0;i<9;i++){const p=HPATH_PTS[Math.floor(i/9*HPATH_PTS.length)],sd=i%2?1:-1;P.push({t:'tree',img:'rock'+(1+i%4),x:p[0]+sd*(95+H_(i,7)*30),y:p[1]+H_(i,8)*20,w:70+H_(i,9)*40,flip:H_(i,10)<.5});}}
/* ground pass: the winding path and the pond */
function drawHomeGround(x0,y0,x1,y1){if(x1<HOMEX-300)return;if(!HPATHP)HPATHP=buildPath(HPATH_CTRL,125,8.2);drawPath(HPATHP,x0,x1);
  const p=HOME.pond,cx=p.x+HOMEX,cy=p.y+HOMEY;ctx.save();
  ctx.fillStyle='rgba(58,44,30,.55)';ctx.beginPath();ctx.ellipse(cx,cy+6,p.rx+22,p.ry+16,0,0,TAU);ctx.fill();
  const g=ctx.createRadialGradient(cx-p.rx*.2,cy-p.ry*.3,10,cx,cy,p.rx*1.05);g.addColorStop(0,'#5d8c98');g.addColorStop(.6,'#3c6a78');g.addColorStop(1,'#26474f');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cy,p.rx,p.ry,0,0,TAU);ctx.fill();
  ctx.clip();ctx.strokeStyle='rgba(220,240,245,.35)';ctx.lineWidth=1.4;for(let i=0;i<14;i++){const q=(T*.5+hash(i,1,973))%1,rx=cx+(hash(i,2,973)-.5)*p.rx*1.6,ry=cy+(hash(i,3,973)-.5)*p.ry*1.5,r=4+q*22;ctx.globalAlpha=1-q;ctx.beginPath();ctx.ellipse(rx,ry,r,r*.4,0,0,TAU);ctx.stroke();}
  ctx.globalAlpha=1;ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.ellipse(cx-p.rx*.3,cy-p.ry*.4,p.rx*.35,p.ry*.18,-.1,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.strokeStyle='rgba(40,30,20,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy,p.rx,p.ry,0,0,TAU);ctx.stroke();ctx.restore();}
/* interactions: the gatehouse arch back into the passage, the cottage door, the pond */
function homeInts(){const X=x=>x+HOMEX,Y=y=>y+HOMEY;return [
  {x:X(HOME.arch.x),y:Y(HOME.arch.y+30),get reach(){return inHome()?85:0},door:true,onInteract:()=>dunGo(20,900,690,1)},
  {x:X(HOME.cot.x+HOME.cot.door),y:Y(HOME.cot.y+15),get reach(){return inHome()?85:0},door:true,onInteract:()=>enterDun(21,650,636,-1)},
  {x:X(HOME.pond.x-HOME.pond.rx+20),y:Y(HOME.pond.y),get reach(){return inHome()?110:0},onInteract:()=>say("A quiet pond. Rain dimples the water.")}];}
/* out of the cottage's front door, onto the step */
function leaveCottage(){SCENE='thorn';lum.x=HOMEX+HOME.cot.x+HOME.cot.door;lum.y=HOMEY+HOME.cot.y+30;lum.face=1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y+200;THORN.t=99;HOME.t=99;}
function enterHome(){SCENE='thorn';lum.x=HOMEX+HOME.arch.x;lum.y=HOMEY+HOME.arch.y+60;lum.face=1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y+200;THORN.t=99;HOME.t=0;if(/Amroth’s home/.test(GOAL.text)){GOAL.tag='';GOAL.text='';}}
function drawHomeTitle(){if(!inHome()||HOME.t>=4.5||SCENE!=='thorn')return;HOME.t+=1/60;const a=Math.min(1,HOME.t*1.5,(4.5-HOME.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(10,8,14,.5)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#e8eef6';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText("Amroth's Home",W/2,H*.3+10);ctx.restore();}
THINT.push(...homeInts());
/* a garden plant (painted in 03-garden) standing in the Stranglethorn world, swaying like it does at Lum's shop */
function drawHomePlant(o){if(!PLANTS.lavender)paintPlants();const set=PLANTS[o.kind];if(!set)return;const sp=set[o.i%set.length],w=sp.w*o.s,h=sp.h*o.s;
  const dx=o.x-lum.x,dy=(o.y-lum.y)*1.5,d=Math.hypot(dx,dy),push=d<46?(1-d/46)*Math.sign(dx||1)*.35:0,sk=Math.sin(T*1.6+o.ph)*.05+push;
  ctx.save();ctx.translate(o.x,o.y);ctx.transform(1,0,sk,1,0,0);if(o.flip)ctx.scale(-1,1);ctx.drawImage(sp.c,-w/2,-h,w,h);ctx.restore();}
