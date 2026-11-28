/* ---------- Chapter 3: the Mountainside Trail, east of Amroth's home ----------
   A first layout pass (no sketch yet). The party set out on a trail they believe follows the river to the harbor town. It runs along
   the river's north bank up a valley under a grey mountain, then fades away and they are lost; they keep to the river, which ends at a
   waterfall pouring off the cliff into a pool. A ledge round the pool leads behind the falls, the way on (for now, to the goblin
   fortress: room 42 its yard, room 43 the first hall, the designer's paintings in the room engine, 26).
   Walkable: the valley floor on the river's north bank (`mtFree`), less the crags; the ledge round the pool. Foes: Jade Vipers,
   Forest Dryads and Tidegold Turtles. Built as another region of the Stranglethorn world, east of the Island Ruins. Placeholder lines. */
const MTX=ISX+3600,MTY=500,MTW=4000,MTH=1700,MTT={t:99},MTS={said:0};
const inMT=()=>lum.x>MTX-300;
const MTH_=(i,s)=>{const x=Math.sin(i*127.1+s*311.7)*43758.5453;return x-Math.floor(x);};
const MT_POOL={x:3450,y:830,rx:230,ry:130},MT_FALL={x:3450,top:250,w:170},MT_RW=72;   /* the pool under the falls; the falls; half the river's width */
const MRIV_L=[[-300,1360],[300,1390],[800,1310],[1300,1360],[1800,1270],[2300,1230],[2750,1130],[3100,1000],[3330,900],[3450,840]];
const MRIV=MRIV_L.map(([x,y])=>[x+MTX,y+MTY]),MRIV_PTS=splinePts(MRIV,18);
const MT_IN={x:150,y:1185},MT_DOOR={x:3450,y:672},MT_LOST=1900;   /* the way back to Amroth's home; behind the falls; where the trail gives out */
/* the old trail: along the bank, fading out round x 1600-1900 */
const MPATH_CTRL=[[-200,1170],[300,1200],[800,1130],[1300,1170],[1650,1090],[1950,1060]].map(([x,y])=>[x+MTX,y+MTY]);let MPATHP=null;
/* signed distance from the river's middle: negative on the north bank */
function mrivSide(x,y){let best=1e9,s=1;for(let i=0;i<MRIV_PTS.length-1;i++){const [ax,ay]=MRIV_PTS[i],[bx,by]=MRIV_PTS[i+1],dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1,t=clamp(((x-ax)*dx+(y-ay)*dy)/L2,0,1),px=ax+dx*t,py=ay+dy*t,d=Math.hypot(x-px,y-py);
  if(d<best){best=d;s=((x-ax)*dy-(y-ay)*dx)>0?-1:1;}}return best*s;}   /* the river runs west to east here, so left of it (north) is negative */
const MT_CRAGS=[];   /* crags on the valley floor past where the trail gives out, solid; [lx, ly, radius] */
{for(let i=0;i<34;i++){const lx=1700+MTH_(i,41)*1500,ly=650+MTH_(i,42)*800,x=lx+MTX,y=ly+MTY,s=mrivSide(x,y);if(s>-MT_RW-110||s<-360)continue;if(MT_CRAGS.some(([cx,cy])=>Math.hypot(cx-lx,cy-ly)<260))continue;MT_CRAGS.push([lx,ly,34+MTH_(i,43)*20]);}}
function mtPoolLedge(lx,ly){const e=(a,b)=>((lx-MT_POOL.x)/a)**2+((ly-MT_POOL.y)/b)**2;return ly<MT_POOL.y-20&&e(MT_POOL.rx+120,MT_POOL.ry+95)<1&&e(MT_POOL.rx+8,MT_POOL.ry+8)>1;}
function mtFree(x,y){const lx=x-MTX,ly=y-MTY;if(lx<60||lx>MTW-80||ly<MT_DOOR.y-12||ly>MTH-60)return false;
  if(Math.abs(lx-MT_DOOR.x)<60&&ly<MT_POOL.y-MT_POOL.ry)return true;   /* the ledge behind the falls */
  if(mtPoolLedge(lx,ly))return true;
  if(((lx-MT_POOL.x)/(MT_POOL.rx+8))**2+((ly-MT_POOL.y)/(MT_POOL.ry+8))**2<1)return false;
  if(lx>MT_POOL.x+80)return false;   /* nothing past the falls but the cliff */
  const s=mrivSide(x,y);if(s>-MT_RW-16||s<-380)return false;
  for(const [cx,cy,r] of MT_CRAGS)if(((lx-cx)/r)**2+((ly-cy)/(r*.5))**2<1)return false;
  return true;}
/* grey mountain stone: the coastal rocks washed to a warm grey, worked out once per image */
const MTTINT={};
function mtImg(src){if(MTTINT[src])return MTTINT[src];const im=IMG[src];if(!ready(im))return null;
  const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const L=.3*p[i]+.59*p[i+1]+.11*p[i+2];
    p[i]=(L*.85+p[i]*.15)*.84;p[i+1]=(L*.85+p[i+1]*.15)*.8;p[i+2]=(L*.85+p[i+2]*.15)*.74;}g.putImageData(d,0,0);}catch(e){}
  return MTTINT[src]=c;}
const MT_ROCKS=['crockspire','crockheap','crockpile','crockegg'],MT_TREES=[['pine_twist_a',230],['htwist',250],['pine_twist_b',220],['hfir',240]];
function mtProps(P){const X=x=>x+MTX,Y=y=>y+MTY;
  for(const [i,[lx,ly,r]] of MT_CRAGS.entries())P.push({t:'mt',img:MT_ROCKS[i%4],x:X(lx),y:Y(ly)+r*.3,w:r*4.4,flip:i%2===1,tint:1,solid:1});
  /* the valley's north side: crags and twisted firs climbing to the mountain face */
  for(let i=0;i<120;i++){const lx=-100+MTH_(i,51)*(MT_POOL.x),ly=380+MTH_(i,52)*900,x=X(lx),y=Y(ly),s=mrivSide(x,y);if(s>-420||s<-900)continue;
    if(MTH_(i,53)<.6)P.push({t:'mt',img:MT_ROCKS[Math.floor(MTH_(i,54)*4)],x,y,w:200+MTH_(i,55)*220,flip:MTH_(i,56)<.5,tint:1,solid:1});
    else{const [img,w]=MT_TREES[Math.floor(MTH_(i,57)*4)];P.push({t:'tree',img,x,y,w:w*(.85+MTH_(i,58)*.3),flip:MTH_(i,59)<.5,base:.95});}}
  /* the far bank: firs and rocks */
  for(let i=0;i<90;i++){const lx=-100+MTH_(i,61)*(MT_POOL.x+200),ly=900+MTH_(i,62)*900,x=X(lx),y=Y(ly),s=mrivSide(x,y);if(s<MT_RW+50||s>520||Math.hypot(lx-MT_POOL.x,ly-MT_POOL.y)<480)continue;   /* the pool and falls stay in view */
    if(MTH_(i,63)<.35)P.push({t:'mt',img:MT_ROCKS[Math.floor(MTH_(i,64)*4)],x,y,w:150+MTH_(i,65)*150,flip:MTH_(i,66)<.5,tint:1,solid:1});
    else{const [img,w]=MT_TREES[Math.floor(MTH_(i,67)*4)];P.push({t:'tree',img,x,y,w:w*(.85+MTH_(i,68)*.3),flip:MTH_(i,69)<.5,base:.95});}}
  for(let x=-400;x<MTW+600;x+=760)P.push({t:'mt',img:'worldbind_cliff',x:X(x),y:Y(x>2700?MT_DOOR.y-10:420),w:1180,flip:(x/760|0)%2===1,solid:1});   /* the mountain face along the top; it closes in round the falls */
  P.push({t:'mt',img:'worldbind_cliff',x:X(MT_POOL.x+620),y:Y(MT_POOL.y+260),w:1100,flip:true,solid:1});   /* and past them */
  P.push({t:'mtfall',x:X(MT_FALL.x),y:Y(MT_POOL.y-MT_POOL.ry+20),w:MT_FALL.w,solid:1});}   /* the falls, in front of anyone on the ledge behind them */
function drawMTProp(o,alpha){if(o.t==='mtfall'){drawMTFall(o);return;}const im=o.tint?mtImg(o.img):IMG[o.img];if(!ready(im))return;const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,w=o.w,h=w*ih/iw;
  ctx.save();ctx.globalAlpha=alpha??1;ctx.fillStyle='rgba(20,18,16,.22)';ctx.beginPath();ctx.ellipse(o.x,o.y-2,w*.42,w*.07,0,0,TAU);ctx.fill();
  ctx.translate(o.x,o.y);if(o.flip)ctx.scale(-1,1);ctx.drawImage(im,-w/2,-h*.97,w,h);ctx.restore();}
/* the waterfall: the designer's water art, scrolling down, with white streaks, foam and spray */
function drawMTFall(o){const top=MTY+MT_FALL.top,bot=o.y,w=o.w,x0=o.x-w/2;ctx.save();
  ctx.beginPath();ctx.moveTo(x0+8,top);ctx.lineTo(x0+w-8,top);ctx.quadraticCurveTo(x0+w+6,(top+bot)/2,x0+w+14,bot);ctx.lineTo(x0-14,bot);ctx.quadraticCurveTo(x0-6,(top+bot)/2,x0+8,top);ctx.closePath();
  const pat=waterPattern(ctx,'water_tile',.6);if(pat){try{pat.setTransform(new DOMMatrix().translateSelf(0,(T*260)%2000).scaleSelf(.6,1.8));}catch(e){}}
  ctx.globalAlpha=lum.y<o.y&&Math.abs(lum.x-o.x)<o.w?.5:.72;ctx.fillStyle=pat||'#5f8fa0';ctx.fill();ctx.save();ctx.clip();ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(240,248,252,.55)';ctx.lineCap='round';for(let i=0;i<14;i++){const sx=x0+8+MTH_(i,71)*(w-16),len=60+MTH_(i,72)*120,y=top+((T*(300+MTH_(i,73)*120)+MTH_(i,74)*900)%(bot-top+len))-len;ctx.lineWidth=2+MTH_(i,75)*4;ctx.beginPath();ctx.moveTo(sx,y);ctx.lineTo(sx+(sx-o.x)*.05,y+len);ctx.stroke();}
  const sh=ctx.createLinearGradient(x0,0,x0+w,0);sh.addColorStop(0,'rgba(20,40,50,.25)');sh.addColorStop(.5,'rgba(255,255,255,.06)');sh.addColorStop(1,'rgba(20,40,50,.25)');ctx.fillStyle=sh;ctx.fillRect(x0-20,top,w+40,bot-top);ctx.restore();
  ctx.fillStyle='rgba(245,250,252,.75)';for(let i=0;i<18;i++){const a=MTH_(i,81)*TAU,q=(T*.9+MTH_(i,82))%1,r=10+MTH_(i,83)*18;ctx.globalAlpha=(1-q)*.8;ctx.beginPath();ctx.ellipse(o.x+(MTH_(i,84)-.5)*(w+60),bot-4-q*26,r*(1+q),r*.45*(1+q),0,0,TAU);ctx.fill();}   /* foam where it hits the pool */
  ctx.globalAlpha=1;const mg=ctx.createRadialGradient(o.x,bot-30,10,o.x,bot-30,w*1.4);mg.addColorStop(0,'rgba(240,246,250,.35)');mg.addColorStop(1,'rgba(240,246,250,0)');ctx.fillStyle=mg;ctx.fillRect(o.x-w*1.5,bot-w*1.5,w*3,w*2);ctx.restore();}   /* spray */
/* ground: a dusty grey cast, the fading trail, the river and the pool */
function mtRibbon(off){const L=[],R=[];for(let i=0;i<MRIV_PTS.length;i++){const a=MRIV_PTS[Math.max(0,i-1)],b=MRIV_PTS[Math.min(MRIV_PTS.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,[x,y]=MRIV_PTS[i];L.push([x+nx*off,y+ny*off]);R.push([x-nx*off,y-ny*off]);}
  ctx.beginPath();ctx.moveTo(...L[0]);for(const p of L)ctx.lineTo(...p);for(let i=R.length-1;i>=0;i--)ctx.lineTo(...R[i]);ctx.closePath();}
function drawMTGround(x0,y0,x1,y1){if(x1<MTX-300)return;if(!MPATHP)MPATHP=buildPath(MPATH_CTRL,120,13.1);const gx=Math.max(x0,MTX-300);
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb(176,172,160)';ctx.fillRect(gx,y0,x1-gx,y1-y0);ctx.restore();
  ctx.save();ctx.globalAlpha=.3;ctx.fillStyle='rgb(190,186,172)';ctx.fillRect(gx,y0,x1-gx,y1-y0);ctx.restore();   /* paler, dustier stone */
  {ctx.save();const fx=MTX+1550,fe=MTX+MT_LOST,gr=ctx.createLinearGradient(fx,0,fe,0);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');   /* the trail fades out: drawn through a mask */
    ctx.beginPath();ctx.rect(gx,y0,Math.min(x1,fx)-gx,y1-y0);ctx.clip();ctx.globalAlpha=.85;drawPath(MPATHP,x0,x1);ctx.restore();
    if(x1>fx){ctx.save();ctx.beginPath();ctx.rect(fx,y0,fe-fx,y1-y0);ctx.clip();for(let i=0;i<8;i++){ctx.save();ctx.beginPath();ctx.rect(fx+i*(fe-fx)/8,y0,(fe-fx)/8+1,y1-y0);ctx.clip();ctx.globalAlpha=.85*(1-(i+.5)/8);drawPath(MPATHP,x0,x1);ctx.restore();}ctx.restore();}}
  ctx.save();mtRibbon(MT_RW+22);ctx.fillStyle='rgba(84,74,58,.5)';ctx.fill();mtRibbon(MT_RW+9);ctx.fillStyle='rgba(140,124,96,.55)';ctx.fill();   /* muddy, stony banks */
  mtRibbon(MT_RW);ctx.fillStyle=waterPattern(ctx,'water_rocks',.55)||'#4d7b86';ctx.fill();ctx.strokeStyle='rgba(40,32,22,.5)';ctx.lineWidth=2;ctx.stroke();
  ctx.save();mtRibbon(MT_RW);ctx.clip();ctx.strokeStyle='rgba(230,244,248,.3)';ctx.lineWidth=1.5;for(let i=0;i<40;i++){const j=Math.floor(MTH_(i,91)*(MRIV_PTS.length-2)),[px,py]=MRIV_PTS[j],q=(T*.5+MTH_(i,92))%1;ctx.globalAlpha=1-q;ctx.beginPath();ctx.moveTo(px-20-q*30,py+(MTH_(i,93)-.5)*90);ctx.lineTo(px+10-q*30,py+(MTH_(i,93)-.5)*90);ctx.stroke();}ctx.restore();   /* ripples running downstream (west) */
  const P=MT_POOL,px=MTX+P.x,py=MTY+P.y;const pool=o=>{ctx.beginPath();ctx.ellipse(px,py,P.rx+o,P.ry+o,0,0,TAU);};
  pool(24);ctx.fillStyle='rgba(84,74,58,.5)';ctx.fill();pool(10);ctx.fillStyle='rgba(140,124,96,.55)';ctx.fill();pool(0);ctx.fillStyle=waterPattern(ctx,'water_tile',.6)||'#3c6a78';ctx.fill();
  ctx.save();pool(0);ctx.clip();ctx.strokeStyle='rgba(235,246,250,.4)';ctx.lineWidth=1.6;for(let i=0;i<10;i++){const q=(T*.6+i/10)%1;ctx.globalAlpha=1-q;ctx.beginPath();ctx.ellipse(px,py-P.ry+30,40+q*200,14+q*70,0,0,TAU);ctx.stroke();}ctx.restore();   /* rings spreading from the falls */
  pool(0);ctx.strokeStyle='rgba(40,32,22,.5)';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
/* thin cloud drifting over the valley */
function drawMTFx(){if(!inMT()||SCENE!=='thorn')return;ctx.save();
  for(let i=0;i<16;i++){const sp=10+MTH_(i,30)*16,x=MTX+((MTH_(i,31)*MTW+T*sp)%(MTW+1200))-600,y=MTY+400+MTH_(i,32)*1200+Math.sin(T*.25+i)*30,r=260+MTH_(i,33)*240;
    ctx.save();ctx.translate(x,y);ctx.scale(1,.35);const gr=ctx.createRadialGradient(0,0,0,0,0,r);gr.addColorStop(0,'rgba(236,238,242,.14)');gr.addColorStop(.6,'rgba(236,238,242,.05)');gr.addColorStop(1,'rgba(236,238,242,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}
function drawMTTitle(){if(!inMT()||MTT.t>=4.5||SCENE!=='thorn')return;MTT.t+=1/60;const a=Math.min(1,MTT.t*1.5,(4.5-MTT.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(20,16,12,.55)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f6ecd8';ctx.font=`600 ${Math.round(Math.min(30,W/13))}px Georgia,serif`;ctx.fillText('Mountainside Trail',W/2,H*.3+10);ctx.restore();}
/* the story on the trail (placeholder lines): setting out along the river; the trail gives out and they are lost; the waterfall */
function updateMT(dt){if(inMT())MTS.t=(MTS.t||0)+(dt||0);if(!inMT()||SCENE!=='thorn'||CH<3||DLG.active||FADE.dir||BATTLE.on||BATTLE.pending||WEVENT.on||MENU.open)return;const lx=lum.x-MTX,ly=lum.y-MTY;
  if(!C3.mtIn&&MTS.t>1.8){C3.mtIn=1;talk([['Amroth',"There's the river. This trail follows it all the way down to the harbor town."],['Alma',"Then we'll be there in no time."],['Sariel',"Race you!"]],false,()=>hsGoal('Follow the river trail to the harbor town'));return;}
  if(!C3.mtLost&&lx>MT_LOST-60){C3.mtLost=1;talk([['Lum',"The trail… it just stops."],['Amroth',"It was right here. I was sure of it."],['Alma',"Are we lost?"],['Amroth',"…We're not lost. We're exploring."],['Alma',"Then let's keep to the river. It has to lead somewhere."]],false,()=>hsGoal('Follow the river'));return;}
  if(!C3.mtFalls&&lx>MT_POOL.x-650){C3.mtFalls=1;talk([['Sariel',"Whoa! Look at that!"],['Amroth',"A waterfall. This river doesn't run to the harbor at all… it runs down from the mountain."],['Lum',"Look, there's a ledge going behind the water!"],['Alma',"Careful, everyone. The rocks will be slippery."]],false,()=>hsGoal('Find out what lies behind the waterfall'));}}
function enterMT(fromFalls){SCENE='thorn';if(fromFalls){lum.x=MTX+MT_DOOR.x-40;lum.y=MTY+MT_DOOR.y+40;lum.dir='down';lum.face=-1;}else{lum.x=MTX+MT_IN.x+80;lum.y=MTY+MT_IN.y;lum.dir='side';lum.face=1;}lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-50;THORN.t=99;MTT.t=fromFalls?99:0;MTS.t=0;}
function enterHomeFromMT(){SCENE='thorn';lum.x=HOMEX+C3EAST[0]-80;lum.y=HOMEY+C3EAST[1];lum.face=-1;lum.dir='side';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-50;THORN.t=99;}
function leaveFortressYard(){enterMT(true);}
THINT.push({get x(){return MTX+MT_IN.x;},get y(){return MTY+MT_IN.y-20;},get reach(){return inMT()?80:-1;},door:true,onInteract:()=>goScene(enterHomeFromMT)},
  {get x(){return MTX+MT_DOOR.x;},get y(){return MTY+MT_DOOR.y;},get reach(){return inMT()?80:-1;},door:true,onInteract:()=>dunGo(42,590,735,1)});   /* behind the falls: for now, on to the goblin fortress */
/* roaming foes in the valley (ids 5600+, kept dead in C1.thDead) */
const MT_FOES=[[700,-200,'viper'],[1200,-230,'turtle'],[1650,-180,'dryad'],[2150,-230,'viper'],[2500,-200,'turtle'],[2850,-210,'dryad'],[3150,-160,'viper']];
function addMTFoes(){if(CH<3||typeof MTX==='undefined'||THFOES.some(g=>g.mt))return;let id=5600;const dead=new Set(C1.thDead||[]);
  for(const [lx,off,kind] of MT_FOES){const myid=id++;let best=null;for(let i=0;i<MRIV_PTS.length;i++)if(Math.abs(MRIV_PTS[i][0]-MTX-lx)<20){best=MRIV_PTS[i];break;}if(!best)continue;
    let x=best[0],y=best[1]+off;for(let k=0;k<20&&!mtFree(x,y);k++)y-=12;if(dead.has(myid)||!mtFree(x,y))continue;
    THFOES.push({kind,mt:1,scene:'thorn',x,y,hx:x,hy:y,tx:x,ty:y,cx:x-TCW/2,cy:y-TCH/2,s:1,pack:1,calm:1,dead:0,t:rnd(0,4),ph:rnd(0,TAU),face:-1,id:myid,bl:0});}}
function drawMTFoe(g){if(g.kind==='viper'){const h=120;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.6,h*.08,0,0,TAU);ctx.fill();c1Frame(ctx,'viper','slide',Math.floor(g.ph*(g.moving?8:2))%4,g.x,g.y,h,g.face>0,1,0);return true;}   /* the slide row faces left */
  if(g.kind==='turtle'){const h=130;ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.45,h*.09,0,0,TAU);ctx.fill();c1Frame(ctx,'turtle','walk',g.moving?Math.floor(g.ph*7)%6:0,g.x,g.y,h,g.face<0,1,0);return true;}   /* faces right */
  if(g.kind==='dryad'){const h=150*196/178;ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(g.x,g.y,30,7,0,0,TAU);ctx.fill();if(g.moving)c1Frame(ctx,'dryad','walk',Math.floor(g.ph*8)%9,g.x,g.y,h,g.face<0,1,0);else c1Frame(ctx,'dryad','idle',Math.floor(g.ph*6)%9,g.x,g.y,h,false,1,0);return true;}
  return false;}
