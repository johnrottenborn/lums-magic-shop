/* ---------- Jak, the lost traveller, and the creatures of Stranglethorn ---------- */
const JAKDX=(.5-.4)*560/300;const JAKREST={x:1*TCW+TCW*.56,y:6*TCH+TCH*.7};
let JAKF=null;const JAKCRUMB=[];
const MATE='spar'; // Stranglethorn's companion (was Jak; Jak moves to Chapter 2). JAKF / jakInParty etc. now mean "the companion"
const jakInParty=()=>PARTY_ORDER.includes(MATE);
function resetJakFollow(){JAKF={x:lum.x-60*lum.face,y:lum.y+4,face:lum.face,moving:0,ph:0};JAKCRUMB.length=0;}
function updateJakFollow(dt){if(!jakInParty())return;if(!JAKF)resetJakFollow();const lc=JAKCRUMB[JAKCRUMB.length-1];
  if(!lc||Math.hypot(lc[0]-lum.x,lc[1]-lum.y)>6){JAKCRUMB.push([lum.x,lum.y]);if(JAKCRUMB.length>80)JAKCRUMB.shift();}
  let acc=0,tx=JAKF.x,ty=JAKF.y,px=lum.x,py=lum.y;for(let i=JAKCRUMB.length-1;i>=0;i--){const [cx,cy]=JAKCRUMB[i];acc+=Math.hypot(cx-px,cy-py);px=cx;py=cy;if(acc>=72){tx=cx;ty=cy;break;}}
  if(Math.hypot(lum.x-JAKF.x,lum.y-JAKF.y)>420){JAKF.x=lum.x-50*lum.face;JAKF.y=lum.y+4;JAKCRUMB.length=0;}
  if(acc<72){JAKF.mv=(JAKF.mv||0)*(1-Math.min(1,dt*10));JAKF.moving=JAKF.mv>.5?1:0;return;}
  const dx=tx-JAKF.x,dy=ty-JAKF.y,d=Math.hypot(dx,dy),sp=Math.min(d,RUN_SPEED*1.15*dt*(d>140?1.6:1));
  if(d>1){JAKF.x+=dx/d*sp;JAKF.y+=dy/d*sp;const vd=Math.abs(dy)>Math.abs(dx)*1.3?(dy<0?'up':'down'):Math.abs(dx)>Math.abs(dy)*.9?'side':JAKF.dir||'side';if(vd!==JAKF.dir){JAKF.dt2=(JAKF.dt2||0)+dt;if(JAKF.dt2>.12||!JAKF.dir){JAKF.dir=vd;JAKF.dt2=0;}}else JAKF.dt2=0;const want=dx<0?-1:1;if(Math.abs(dx)>d*.35&&want!==JAKF.face){JAKF.ft=(JAKF.ft||0)+dt;if(JAKF.ft>.18){JAKF.face=want;JAKF.ft=0;}}else JAKF.ft=0;}
  JAKF.mv=(JAKF.mv||0)+((sp>.4?1:0)-(JAKF.mv||0))*Math.min(1,dt*10);JAKF.moving=JAKF.mv>.5?1:0;JAKF.ph+=sp;}
function drawJakOW(){if(PC===MATE){if(PARTY_ORDER.includes('lum'))drawLumFollower(JAKF);return;}if(MATE==='spar'){drawSparOW(JAKF);return;}drawJakOW_();}
/* when Spar leads, Lum is the one following */
function drawLumFollower(F){if(!F||!ready(atlas))return;const a=F.dir==='up'?LUM_ANIM.walkUp:F.dir==='down'?LUM_ANIM.walkDown:LUM_ANIM.walk,mv=F.moving,fr=mv?a.frames[Math.floor((F.ph||0)/14)%a.frames.length]:(F.dir==='up'?22:37),flip=F.dir==='side'&&F.face!==a.native;
  ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(F.x,F.y+2,30,8,0,0,TAU);ctx.fill();ctx.save();ctx.translate(F.x,F.y+3);ctx.scale(LUMK,LUMK);if(flip)ctx.scale(-1,1);const dw=FW*SPR,dh=FH*SPR;ctx.drawImage(atlas,fr*FW,0,FW,FH,-dw/2,-dh*(274/280),dw,dh);ctx.restore();}
function drawJakOW_(){if(!JAKF||CAPTURE.on)return;const H_=192,vert=JAKF.dir==='up'||JAKF.dir==='down',flip=vert?false:JAKF.face<0;ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(JAKF.x,JAKF.y+2,34,8,0,0,TAU);ctx.fill();
  c1Frame(ctx,'jak',vert?JAKF.dir:JAKF.moving?'walk':'idle',vert?(JAKF.moving?Math.floor(JAKF.ph/16)%5:0):JAKF.moving?Math.floor(JAKF.ph/16)%8:0,JAKF.x+JAKDX*H_*(flip?-1:1),JAKF.y+3,H_,flip,1,0);}
/* Spar on the overworld: down / up / side walks (side faces right) */
/* during the Fokalur scene in the clearing, Lum and Spar stand facing him */
function fkFacing(){return SCENE==='thorn'&&typeof FKS!=='undefined'&&FKS.st>=1&&FKS.st<7&&!C1.fkDone&&lum.x>CLR.x0?{x:FKS.cx,y:FKS.cy}:null;}
/* the dirt path from the clearing's east side through the pines to the gatehouse: painted like the woods road */
function drawClrPath(x0,x1){if(!CPATHP)CPATHP=buildPath(CPATH_CTRL,150,5.3,320);drawPath(CPATHP,x0,x1);}
function drawSparOW(F,alpha){if(!F)return;if(F===JAKF&&fkFacing()&&!FKS.jakIn){F.dir='side';F.face=F.x<FKS.cx?1:-1;F.moving=0;}const vert=F.dir==='up'||F.dir==='down',an=vert?F.dir:'side',fi=F.moving?Math.floor((F.ph||0)/16)%5:0;
  ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(F.x,F.y+2,30,8,0,0,TAU);ctx.fill();c1Frame(ctx,'spar',an,fi,F.x,F.y+3,SPAR_H,!vert&&F.face<0,alpha??1,0);}
function drawJakResting(){if(MATE==='spar'){drawSparResting();return;}drawJakResting_();}
function drawSparResting(){if(C1.jak)return;const x=JAKREST.x,y=JAKREST.y,b=Math.sin(T*1.4);ctx.fillStyle='rgba(10,10,20,.3)';ctx.beginPath();ctx.ellipse(x-6,y-110,34,9,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(x-6,y-112);ctx.rotate(-.1);ctx.scale(1,1+.01*b);c1Frame(ctx,'spar','down',0,0,0,SPAR_H*.9,false,1,0);ctx.filter='none';ctx.restore();}
function drawJakResting_(){if(C1.jak)return;const x=JAKREST.x,y=JAKREST.y,H_=192,b=Math.sin(T*1.4);ctx.fillStyle='rgba(10,10,20,.3)';ctx.beginPath();ctx.ellipse(x,y+2,36,8,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(x,y);ctx.scale(1,.985+.008*b);ctx.translate(-x,-y);ctx.filter='brightness(.62) saturate(.7)';c1Frame(ctx,'jak','hurt',3,x-JAKDX*H_,y+3,H_,true,1,0);ctx.filter='none';ctx.restore();}
function jakPos(){if(JAKF&&(SCENE==='thorn'||SCENE==='woods')&&jakInParty())return JAKF;if(SCENE==='thorn'&&!C1.jak)return {x:JAKREST.x-6,y:JAKREST.y-110};return {x:lum.x-50,y:lum.y};}
function jakJoin(){if(!jakInParty()){PARTY_ORDER.length=1;PARTY_ORDER.push(MATE);}C1.jak=1;HEROES[MATE].hp=Math.round(HEROES[MATE].maxHp*.3);resetJakFollow();JAKF.x=JAKREST.x-6;JAKF.y=JAKREST.y-110;JAKF.face=1;JAKF.dir='down';
  GOAL.tag='SPAR JOINED THE PARTY';GOAL.text='Follow the red roses through Stranglethorn and find Cosmic';HINT.goalT=0;sfxNice&&sfxNice();if(typeof SAVEC!=='undefined')SAVEC.t=99;}
function jakWake(item){const i=BAG.indexOf(item);if(i>=0)BAG.splice(i,1);sfxItem&&sfxItem();
  for(let k=0;k<16;k++)PARTS.push({type:'fdust',x:JAKREST.x+rnd(-30,30),y:JAKREST.y,z:rnd(20,140),vx:rnd(-8,8),vy:rnd(-4,4),vz:rnd(10,40),life:0,max:rnd(.6,1.2),s:rnd(1,2),col:'255,210,220'});
  C1.jakAwake=1;
  setTimeout(()=>talk([['Lum',"Hold still. This will help."],
    ['Spar',"…Ngh…"],
    ['Lum',"My name is Lum. You were barely breathing."],
    ['Spar',"I’m Spar. Thank you."],
    ['Spar',"I've been lost in the dark, every path looks the same."],
    ['Lum',"This forest is a maze."],
    ['Spar',"Long ago, travelers who crossed Stranglethorn dropped seeds as they walked, so the rest could find the way."],
    ['Spar',"Not many have dared these woods lately, though. The roses are all that's left of them."],
    ['Lum',"I’m searching for my apprentice, Cosmic."],
    ['Spar',"Follow the red flowers to find your way through these woods. If you don't see any, you're off the path."],
    ['Spar',"You have a light. Let me walk with you. I’ll protect you until we're out of these woods."]],false,jakJoin),700);}
function jakInteract(){if(C1.jak)return;
  const hasP=BAG.includes('potion');
  if(!hasP){talk([['Lum',"He's breathing, but only just. I need something to heal him… a healing potion."]]);return;}
  const opts=[];if(hasP)opts.push(["Healing Potion",()=>jakWake('potion')]);if(opts.length<2)opts.push(["Not yet",()=>{}]);
  talk([['Lum',"A man, slumped against the roots. He's alive…"]],false,()=>askChoice("Use on the stranger?",opts));}
/* the Thornroot Cellar's entrance: the designer's old overgrown well, feathered into the forest floor, with a few cobwebs */
const CMOUTH={rx:92,ry:58};
function drawCellarMouth(){drawThornWell(CELLAR_DOOR.x,CELLAR_DOOR.y);drawThornWell(SPRING_DOOR.x,SPRING_DOOR.y);drawThornWell(WEBWELL_DOOR.x,WEBWELL_DOOR.y);}
function drawThornWell(x,y){const im=IMG.thorn_well;if(!ready(im))return;const w=205,h=w*im.naturalHeight/im.naturalWidth;
  ctx.drawImage(im,x-w*.4946,y-h*.462,w,h);
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y+5,54,'200,60,50',.1+.05*Math.sin(T*1.6));ctx.restore();
  for(const [n,dx,dy,ww,f] of [['thdec_smallweb',-92,34,85,false],['thdec_smallweb',94,-20,76,true]]){const wi=IMG[n];if(!ready(wi))continue;const wh=ww*wi.naturalHeight/wi.naturalWidth;ctx.save();ctx.globalAlpha=.85;ctx.translate(x+dx,y+dy);if(f)ctx.scale(-1,1);ctx.drawImage(wi,-ww/2,-wh/2,ww,wh);ctx.restore();}}
const THINT=[{x:JAKREST.x-6,y:JAKREST.y-100,reach:100,onInteract:()=>jakInteract()},{x:30,y:TMZ.start*TCH+TCH/2+10,reach:60,door:true,onInteract:()=>goScene(()=>{buildWoods();buildWoodsC1();SCENE='woods';lum.x=2610;lum.y=628;lum.face=-1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x+60;cam.y=lum.y-50;resetJakFollow();})},
  // the top dead end: an underground passage down to the Hidden Spring
  {x:5*TCW+TCW/2,y:150,reach:100,door:true,onInteract:()=>{const go=()=>dunGo(6,935,590,-1);if(C1.springSeen){go();return;}
    talk([['Lum',"Wait… the roots here dip down into the ground. There's an underground passage!"]],false,()=>{C1.springSeen=1;go();});}},
  // the small pocket near the bottom right: stairs down to the Thornroot Cellar
  {x:11*TCW+TCW/2,y:10*TCH+66,reach:100,door:true,onInteract:()=>dunGo(7,560,620,1)},
  // under the spider web in the middle of the maze: a third well, down to the Ember Hollow
  {x:5*TCW+TCW/2,y:4*TCH+58,reach:100,door:true,onInteract:()=>dunGo(9,370,650,1)},
  // the maze's exit, once the Broodmother is gone: on to the clearing
  {x:TW_,y:TMZ.finish*TCH+TCH/2+10,reach:165,door:true,onInteract:()=>goScene(enterClearing)},
  // and back again, before Lum reaches Cosmic
  // Chapter 2: the gatehouse's dark archway leads into the Worldbind Passage (the passage itself is still to be built)
  {x:CPATH.xt+3,y:CPATH.ytop+30,get reach(){return CH>=2?90:0},dynDoor:true,get door(){return CH>=2},onInteract:()=>{if(CH<2)return;if(typeof enterWorldbind==='function')goScene(enterWorldbind);}},
  // (in Chapter 2 the hellfire still burns across this entrance: no door, no way back into Stranglethorn)
  {x:TW_+260+95,y:TMZ.finish*TCH+TCH/2+10,get reach(){return CH>=2?0:80},dynDoor:true,get door(){return CH<2},onInteract:()=>{if(FKS.st||CH>=2)return;goScene(()=>{lum.x=TW_-120;lum.y=TMZ.finish*TCH+TCH/2+10;lum.face=-1;cam.x=lum.x;cam.y=lum.y-50;resetJakFollow();});}}];

// roaming creatures: spiders, Flora, red slimes and red foxes
const THFOES=[];let thFoesBuilt=false;const THBOSS={kind:'bigspider',scene:'thorn',x:12*TCW+TCW/2,y:2*TCH+190,s:1,pack:1,calm:0,dead:0,ph:0,face:-1,boss:1};
function buildThornFoes(){if(thFoesBuilt)return;thFoesBuilt=true;THFOES.length=0;const dead=new Set(C1.thDead||[]);const H_=(a,b,s)=>hash(a,b,s);
  const skip=new Set(['6,0','5,0','4,0','4,1','5,1','6,1','2,12','2,13','2,14','3,12']);let id=0;
  for(let r=0;r<TMZ.R;r++)for(let c=0;c<TMZ.C;c++){const k=r+','+c;if(skip.has(k)||THORN.pockets.some(([pr,pc])=>pr===r&&pc===c))continue;if(H_(r,c,201)>.3){continue;}
    const roll=H_(r,c,203),kind=roll<.32?'spider':roll<.55?'flora':roll<.78?'rslime':'rvixen',x=c*TCW+TCW/2+(H_(r,c,205)-.5)*120,y=r*TCH+TCH/2+20+(H_(r,c,207)-.5)*60,myid=1000+id++;
    if(dead.has(myid))continue;THFOES.push({kind,scene:'thorn',x,y,hx:x,hy:y,tx:x,ty:y,cx:c*TCW,cy:r*TCH,s:1,pack:kind==='flora'?1:(H_(r,c,209)<.4?2:1),calm:1,dead:0,t:rnd(0,4),ph:rnd(0,TAU),face:-1,id:myid,bl:0});}}
function updateThornFoes(dt){const ok=!DLG.active&&!WEVENT.on&&!MENU.open&&!FADE.dir&&!BATTLE.on&&!BATTLE.pending&&!CHOICE.on;
  for(const g of THFOES){g.t+=dt;g.ph+=dt;g.calm=Math.max(0,g.calm-dt);const dx=lum.x-g.x,dy=lum.y-g.y,d=Math.hypot(dx,dy);
    if(g.kind==='flora'){g.bl=clamp(g.bl+(d<230?dt*1.4:-dt*.6),0,1);if(ok&&!g.calm&&d<72&&lum.bumpT<=0)startEncounter(g,'ambush');continue;}
    let sp=g.kind==='rslime'?40:g.kind==='spider'?58:72,tx=g.tx,ty=g.ty;g.chase=ok&&!g.calm&&d<190;
    if(g.chase){tx=lum.x;ty=lum.y;if(d<56&&lum.bumpT<=0){startEncounter(g,'ambush');continue;}}
    else if(Math.hypot(g.tx-g.x,g.ty-g.y)<8||g.t>5){g.t=0;const a=rnd(0,TAU);g.tx=clamp(g.hx+Math.cos(a)*rnd(20,90),g.cx+50,g.cx+TCW-50);g.ty=clamp(g.hy+Math.sin(a)*rnd(10,45),g.cy+40,g.cy+TCH-30);sp*=.5;}else sp*=.45;
    const ddx=tx-g.x,ddy=ty-g.y,dd=Math.hypot(ddx,ddy)||1;g.faceT=Math.max(0,(g.faceT||0)-dt);
    if(dd>3&&ok){const ox=g.x,nx=g.x+ddx/dd*sp*dt,ny=g.y+ddy/dd*sp*dt;if(thornFree(nx,ny)){g.x=nx;g.y=ny;}else if(thornFree(nx,g.y))g.x=nx;else if(thornFree(g.x,ny))g.y=ny;
      const mvx=g.x-ox;if(Math.abs(mvx)>sp*dt*.3&&!g.faceT){const nf=mvx<0?-1:1;if(nf!==g.face){g.face=nf;g.faceT=.4;}}g.moving=1;}else g.moving=0;}
  // the Broodmother waits beneath her web
  if(!C1.thornBoss){const B_=THBOSS;B_.ph+=dt;B_.calm=Math.max(0,B_.calm-dt);const d=Math.hypot(lum.x-B_.x,lum.y-B_.y);
    if(ok&&!C1.bossSeen&&d<420&&Math.floor(lum.y/TCH)===TMZ.finish){C1.bossSeen=1;talk(jakInParty()?[['Spar',"Be wary of the webs…"]]:[['Lum',"Something big lives here…"]]);}
    else if(ok&&!B_.calm&&d<125&&lum.bumpT<=0)startEncounter(B_,'ambush');}}
function drawThornFoe(g){if(CAPTURE.on&&g===BATTLE.capG)return;
  if(g.kind==='spider'){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,32,7,0,0,TAU);ctx.fill();c1Frame(ctx,'spider',g.moving?'crawl':'idle',Math.floor(g.ph*(g.moving?12:4))%(g.moving?5:4),g.x,g.y,96,g.moving?g.face>0:g.face<0,1,0);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x+(g.face<0?-14:14),g.y-34,7,'255,60,60',.5);ctx.restore();return;}
  if(g.kind==='flora'){const fi=g.bl<1?Math.min(7,Math.floor(g.bl*8)):0;ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(g.x,g.y,30,7,0,0,TAU);ctx.fill();c1Frame(ctx,'flora',g.bl<1?'bloom':'idle',g.bl<1?fi:Math.floor(T*6+g.ph*3)%6,g.x,g.y+2,118,g.x<lum.x,1,0);
    if(g.bl>.5){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x,g.y-80,40,'255,90,100',.18*g.bl);ctx.restore();}return;}
  if(g.kind==='rslime'){ctx.fillStyle='rgba(20,10,10,.25)';ctx.beginPath();ctx.ellipse(g.x,g.y+2,34,8,0,0,TAU);ctx.fill();const im=IMG.jelly_idle_red,w=104,h=w*(ready(im)?im.naturalHeight/im.naturalWidth:.7),hov=12+Math.sin(g.ph*1.6)*4;drawGlow(ctx,g.x,g.y-hov-h*.55,w*.7,'255,120,130',.22);drawJellySprite(im,g.x,g.y-hov,w,h,g.ph,0,1);return;}
  if(g.kind==='rvixen'){const h=118;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.42,h*.07,0,0,TAU);ctx.fill();c1Frame(ctx,'fox_red','run',g.moving?Math.floor(g.ph*14)%12:0,g.x,g.y,h,g.face>0,1,0);return;}}
function drawThornBoss(){if(C1.thornBoss||(CAPTURE.on&&THBOSS===BATTLE.capG))return;const B_=THBOSS,h=190;ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(B_.x,B_.y,h*.45,h*.09,0,0,TAU);ctx.fill();
  c1Frame(ctx,'spider_dark','idle',Math.floor(T*3)%4,B_.x,B_.y,h,true,1,0);ctx.save();ctx.globalCompositeOperation='lighter';for(const [ex,ey] of [[-.1,-.42],[-.03,-.44]])drawGlow(ctx,B_.x+ex*h,B_.y+ey*h,10,'255,40,40',.55+.2*Math.sin(T*3));ctx.restore();}
function drawThorn(){const vw=W/zoom,vh=H/zoom,x0=cam.x-vw/2-60,y0=cam.y-vh/2-60,x1=cam.x+vw/2+60,y1=cam.y+vh/2+400;
  ctx.setTransform(DPR*zoom,0,0,DPR*zoom,DPR*(W/2-cam.x*zoom),DPR*(H/2-cam.y*zoom));
  ctx.fillStyle='#1d2a1a';ctx.fillRect(x0,y0,x1-x0,y1-y0);
  const fl=IMG.floor_st;if(ready(fl)){if(!THORN.pat)THORN.pat=ctx.createPattern(fl,'repeat');const sc=.8;ctx.save();ctx.scale(sc,sc);ctx.fillStyle=THORN.pat;ctx.fillRect(x0/sc,y0/sc,(x1-x0)/sc,(y1-y0)/sc);ctx.restore();}
  // fallen petals and a darker rim outside the maze
  ctx.fillStyle='rgba(10,8,12,.55)';if(x0<0)ctx.fillRect(x0,y0,-x0,y1-y0);if(x1>TW_)ctx.fillRect(TW_,y0,x1-TW_,y1-y0);if(y0<0)ctx.fillRect(x0,y0,x1-x0,-y0);
  for(const d of THORN.decals||[]){const im=IMG[d.n];if(!ready(im))continue;const h=d.w*im.naturalHeight/im.naturalWidth;if(d.x+d.w/2<x0||d.x-d.w/2>x1||d.y+h/2<y0||d.y-h/2>y1)continue;ctx.save();ctx.translate(d.x,d.y);if(d.flip)ctx.scale(-1,1);ctx.drawImage(im,-d.w/2,-h/2,d.w,h);ctx.restore();}
  drawClrPath(x0,x1);
  drawCellarMouth();
  for(const f of THORN.flowers)if(f.x>x0-30&&f.x<x1+30&&f.y>y0-30&&f.y<y1)drawRedFlowers(f.x,f.y,f.s,f.seed);
  const L=[];for(const o of THORN.props)if(o.x>x0-o.w/2-40&&o.x<x1+o.w/2+40&&o.y>y0-20&&o.y<y1+o.w*1.4)L.push([o.y,o]);L.push([lum.y,null]);L.sort((a,b)=>a[0]-b[0]);
  for(const g of THFOES)if(g.x>x0-150&&g.x<x1+150&&g.y>y0-60&&g.y<y1+260)L.push([g.y,{t:'thfoe',ref:g}]);if(!C1.thornBoss)L.push([THBOSS.y,{t:'boss'}]);for(const s_ of COSSEE)if(s_.st===1||s_.st===2)L.push([s_.y,{t:'cosghost',ref:s_}]);if(!C1.fkDone&&lum.x>TW_)L.push([FKS.cy,{t:'fks'}]);if(FKS.fire)L.push([FKS.fire.y,{t:'fkfire'}]);if(!C1.jak)L.push([JAKREST.y-110,{t:'jakrest'}]);else if(JAKF&&jakInParty()&&!FKS.fire)L.push([JAKF.y,{t:'jak'}]);L.sort((a,b)=>a[0]-b[0]);
  THORN.blooms=[];let past=false;for(const [,o] of L){if(!o){drawLum();past=true;continue;}if(o.t==='thfoe'){drawThornFoe(o.ref);continue;}if(o.t==='boss'){drawThornBoss();continue;}if(o.t==='cosghost'){drawCosGhost(o.ref);continue;}if(o.t==='fks'){drawFKS();continue;}if(o.t==='fkfire'){drawFlames(ctx,FKS.fire.x,FKS.fire.y,260,1);continue;}if(o.t==='jakrest'){drawJakResting();continue;}if(o.t==='jak'){drawJakOW();continue;}let fa=1;if(past){const kx=clamp(1-(Math.abs(o.x-lum.x)-o.w*.2)/(o.w*.3),0,1),ky=clamp(1-(o.y-lum.y-o.w*.7)/(o.w*.35),0,1);fa=1-kx*ky*(o.t==='arch'?.4:.58);}drawThornProp(o,fa);}
  drawForage(THORN.forage||[]);drawThornCritters(x0,y0,x1,y1);drawThornWebs(x0,y0,x1,y1);
  drawThornMotes();
  ctx.save();ctx.globalCompositeOperation='lighter';for(const m of THORN.mist){if(m.x<x0-m.r||m.x>x1+m.r||m.y<y0-m.r||m.y>y1+m.r)continue;drawGlow(ctx,m.x+Math.sin(T*.08+m.ph)*50,m.y,m.r,'150,90,110',.05+.025*Math.sin(T*.4+m.ph));}ctx.restore();
  /* Chapter 2: flames from the hellfire block the way back into Stranglethorn */
  if(CH>=2){for(let k=0;k<7;k++){const fy=CLR.cy-150+k*50,fx=CLR.x0+70+Math.sin(k*2.1)*22;ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,fx,fy-40,110,'255,120,40',.22+.06*Math.sin(T*3+k));ctx.restore();drawFlames(ctx,fx,fy,150+30*Math.sin(k*1.7),1);}}
  /* Chapter 1 never shows the clearing's east side (the outpost and mountain belong to Chapter 2's opening): it stays in darkness */
  if(CH===1){const g=ctx.createLinearGradient(CLR.x1+30,0,CLR.x1+190,0);g.addColorStop(0,'rgba(6,5,10,0)');g.addColorStop(1,'rgba(6,5,10,.98)');ctx.fillStyle=g;ctx.fillRect(CLR.x1+30,y0-200,160,y1-y0+600);ctx.fillStyle='rgba(6,5,10,.98)';ctx.fillRect(CLR.x1+189,y0-200,x1-CLR.x1+800,y1-y0+600);}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  // cold, washed-out grade
  ctx.save();ctx.globalCompositeOperation='saturation';ctx.fillStyle='rgba(128,128,128,.32)';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb(190,192,214)';ctx.fillRect(0,0,W,H);ctx.restore();
  drawThornFog(0);
  // darkness, held back by Vane's lantern
  const sx=(lum.x-cam.x)*zoom+W/2,sy=(lum.y-70-cam.y)*zoom+H/2,R=Math.min(W,H)*.5*(1+.025*Math.sin(T*7)+.018*Math.sin(T*17.3)+.01*Math.sin(T*31));const g=ctx.createRadialGradient(sx,sy,R*.12,sx,sy,R);
  g.addColorStop(0,'rgba(8,4,14,0)');g.addColorStop(.4,'rgba(8,4,14,.26)');g.addColorStop(.8,'rgba(6,3,12,.66)');g.addColorStop(1,'rgba(5,2,10,.8)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,sx+lum.face*14*zoom,sy+10*zoom,90*zoom,'255,190,110',.16+.03*Math.sin(T*9));ctx.restore();
  if(FKS.fa>0&&!C1.fkDone){ctx.save();ctx.setTransform(DPR*zoom,0,0,DPR*zoom,DPR*(W/2-cam.x*zoom),DPR*(H/2-cam.y*zoom));ctx.globalCompositeOperation='lighter';drawGlow(ctx,FKS.cx,FKS.cy-280,320,'170,40,90',.28*FKS.fa);ctx.globalCompositeOperation='source-over';drawFokFrame(ctx,FKS.st===2?(FKS.t<1.4?4:5):Math.floor(T*4)%4,FKS.cx,FKS.cy+4,520,false,.88*FKS.fa);ctx.globalAlpha=1;drawLum();if(jakInParty()&&JAKF&&!FKS.fire)drawJakOW();ctx.restore();}
  if(FKS.fire){ctx.save();ctx.setTransform(DPR*zoom,0,0,DPR*zoom,DPR*(W/2-cam.x*zoom),DPR*(H/2-cam.y*zoom));drawFlames(ctx,FKS.fire.x,FKS.fire.y,260,1);ctx.restore();}
  drawThornFog(1);
  if(FKS.flash>0){ctx.fillStyle=`rgba(255,240,250,${Math.min(1,FKS.flash).toFixed(3)})`;ctx.fillRect(0,0,W,H);}
  // the guiding roses keep a faint warm glow so they read through the fog
  ctx.save();ctx.globalCompositeOperation='lighter';for(const [bx,by] of THORN.blooms||[]){const px=(bx-cam.x)*zoom+W/2,py=(by-cam.y)*zoom+H/2;drawGlow(ctx,px,py,26*zoom,'235,40,60',.32+.06*Math.sin(T*2+bx));}ctx.restore();
  {const vg=ctx.createRadialGradient(W/2,H*.48,Math.min(W,H)*.32,W/2,H*.48,Math.max(W,H)*.78);vg.addColorStop(0,'rgba(4,3,10,0)');vg.addColorStop(1,'rgba(4,3,10,.6)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);}
  drawC1EndCard();drawC1Results();
  if(THORN.t<4.5){const a=Math.min(1,THORN.t*1.5,(4.5-THORN.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(20,5,10,.45)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#f0dede';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('Stranglethorn Forest',W/2,H*.3+10);ctx.restore();}}
function hutDoorC1(){if(C1.vane>=2){if(VANE)return;goScene(enterVHut);return;}
  if(C1.reaper===0){C1.reaper=1;talk([['Lum',"Locked…"]],false,()=>{sfxRumble&&sfxRumble(1.6,.6);shake=6;REAPER={kind:'reaper',scene:'woods',x:HUTDOOR.x+230,y:HUTDOOR.y+70,s:1,pack:1,calm:0,dead:0,face:-1,t:0,st:'rise',rise:0};setTimeout(()=>talk([['Lum',"Aaah!"]]),900);});return;}
  if(C1.reaper===1){say("Something is pounding on the door!");return;}
  // the Grave Reaper is gone: knock again and the gravekeeper finally answers
  C1.vane=1;WEVENT.on=true;
  talk([['Voice',"Is it gone?"],['Lum',"I believe so. I'm Lum and I'm searching for my apprentice. Have you seen a blue-haired boy?"]],false,()=>{
    sfxPage&&sfxPage(1);VANE={step:{x:HUTDOOR.x+140,y:HUTDOOR.y+84},x:HUTDOOR.x,y:HUTDOOR.y+4,tx:HUTDOOR.x+62,ty:HUTDOOR.y+66,face:1,st:'walk',t:0,cb:()=>{VANE.face=lum.x<VANE.x?-1:1;lum.face=VANE.x<lum.x?-1:1;vaneScene();}};});}
function vaneScene(){talk([
  ["Vane","Lum\u2026? Lum from the Magic Shop?"],
  ["Vane","I thought you were just part of some old story\u2026 never could find my way to your shop!"],
  ["Vane","Anyways! Name's Vane and I'm the gravekeeper. This place has been dead for ages. Heh."],
  ["Vane","You must have heard that storm last night? Thunder shaking, wind howling…"],
  ["Vane","I locked the door and kept my trusty lantern burning till dawn."],
  ["Vane","And now a most unlikely visitor from the edge of the world, knocking on my door. Something is stirring\u2026 I can feel it in my bones."],
  ["Vane","But a blue-haired boy\u2026 aye. I saw him. Through the window, standing among the graves\u2026 and he had a red sword."],
  ["Vane","There was a terrifying flash of light, and I had to turn away. When I looked back\u2026 he was gone."],
  ["Vane","I told myself it was all a bad dream."],
  ["Lum","\u2026Cosmic!"],
  ["Vane","Quite possible\u2026 you're going after him, aren't you?"],
  ["Vane","We're mostly cut off from the rest of the world. There are dark places ahead and you won't make it through without light."]],false,()=>{
    C1.vane=2;C1.charmQ=1;if(PARTY.lum.charm==='vanecharm'||BAG.includes('vanecharm')){vaneNotice(vaneWalkIn);return;}
    talk([["Vane","Maybe we can help each other out. I seem to have lost my necklace."],["Vane","If I had to guess, I dropped it on the ground and my furry little friend scurried away with it\u2026"],["Vane","It's an heirloom, and all I got for protection around here! Please bring it back to me, and my lantern is yours."],["Lum","I'll keep an eye out."]],false,()=>{GOAL.tag='NEW TASK';GOAL.text="Find Vane's lost necklace";HINT.goalT=0;vaneWalkIn();});});}
function vaneWalkIn(){WEVENT.on=false;if(!VANE)return;VANE.st='walk';VANE.tx=HUTDOOR.x;VANE.ty=HUTDOOR.y+4;VANE.cb=()=>{VANE=null;sfxPage&&sfxPage(.6);};}
function vaneNotice(after){talk([['Vane',"Wait… that's the cross! My lucky cross!"]],false,()=>
  askChoice("Return Vane's lucky cross?",[["Yes",()=>vaneTrade(after)],["No",()=>talk([['Vane',"…Ah. Well. If you change your mind, you know where to find me."]],false,()=>{GOAL.tag='TASK';GOAL.text="Return Vane's lucky cross";HINT.goalT=0;after&&after();})]]));}
function vaneTrade(after){
  /* hand back only the cross: whatever else Lum wears (e.g. the Moon Charm) stays on */
  if(PARTY.lum.charm==='vanecharm')PARTY.lum.charm=null;else{const i=BAG.indexOf('vanecharm');if(i>=0)BAG.splice(i,1);}syncMaxHp&&syncMaxHp();C1.charmQ=2;
  talk([['Vane',"Thank you, Lum. You don't know what this means to an old man."],['Vane',"In exchange… Here, take my lantern."]],false,()=>{giveItem('lantern');if(!C1.vanePotions){C1.vanePotions=1;setTimeout(()=>talk([['Vane',"And these. Two healing potions I've been saving for a rainy day. Seems the rain has come."]],false,()=>{BAG.push('potion','potion');TOAST.t=0;TOAST.name=ITEMS.potion.name+' ×2';TOAST.id='potion';MENU.newItems++;sfxItem&&sfxItem();setTimeout(vaneTradeRest,900);}),900);return;}vaneTradeRest();function vaneTradeRest(){
    setTimeout(()=>talk([['Vane',"The paths ahead twist and tangle, and some places are darker than night."],['Lum',"Thank you, Vane."],['Vane',"Bring the boy home safe. And… mind the shadows."]],false,()=>{GOAL.tag='NEW TASK';GOAL.text='Head east toward Stranglethorn Forest';HINT.goalT=0;after&&after();}),900);}});}
function drawC1EndCard(){if(!C1.endCard)return;C1.endCard+=1/60;const t=C1.endCard,a=Math.min(1,t*1.5,(6-t)*1.2);if(t>6){C1.endCard=0;if(C1.chEnd)backToTitle();return;}ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=Math.max(0,a);ctx.fillStyle='rgba(10,8,20,.6)';ctx.fillRect(0,H*.36-50,W,108);
  ctx.textAlign='center';ctx.fillStyle='#efe6ff';ctx.font='700 22px "Alegreya SC", Georgia, serif';ctx.fillText(C1.chEnd?'End of Chapter 1':'Stranglethorn Forest',W/2,H*.36);ctx.font='italic 15px Alegreya, Georgia, serif';ctx.fillStyle='rgba(239,230,255,.8)';ctx.fillText(C1.chEnd?'To be continued…':'The playtest ends here — this path is still being written.',W/2,H*.36+30);ctx.restore();}
function drawC1Title(){if(!C1.title)return;C1.title+=1/60;const t=C1.title;if(t>5){C1.title=0;return;}const a=Math.min(1,t*1.2,(5-t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.fillStyle='rgba(20,14,30,.55)';ctx.fillRect(0,H*.3-46,W,92);ctx.textAlign='center';
  ctx.fillStyle='#fdf6e4';ctx.font='700 24px "Alegreya SC", Georgia, serif';ctx.fillText('Chapter 1',W/2,H*.3);ctx.restore();}

/* ---------- the clearing past Stranglethorn: Cosmic waits, and Fokalur wakes ----------
   st: 0 waiting · 1 talking · 2 transforming · 3 Fokalur speaks · 4 battle · 5 after the battle · 6 Fokalur fades · 7 farewell */
const FKS={st:0,t:0,cx:CLR.x0+640,cy:CLR.cy,fa:0,ca:1,flash:0};
function enterClearing(){SCENE='thorn';lum.x=CLR.x0+190;lum.y=CLR.cy;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x+120;cam.y=lum.y-50;resetJakFollow();
  if(!FKS.st){GOAL.tag='TASK';GOAL.text='Reach Cosmic';HINT.goalT=0;}}
function updateClearing(dt){if(C1.fkDone)return;FKS.t+=dt;FKS.flash=Math.max(0,FKS.flash-dt*.8);
  if(FKS.st===0&&!DLG.active&&!FADE.dir&&!BATTLE.on&&lum.x>CLR.x0&&Math.hypot(lum.x-FKS.cx,(lum.y-FKS.cy)*1.2)<215){FKS.st=1;fkMeet();}
  if(FKS.st===2){if(FKS.t>.6&&!FKS.flashed){FKS.flashed=1;FKS.flash=1;sfxRumble(2,1);}FKS.ca=Math.max(0,1-FKS.t/.8);FKS.fa=clamp((FKS.t-.6)/.8,0,1);if(FKS.t>2.4){FKS.st=3;fkReveal();}}
  if(FKS.jakIn&&JAKF){const J_=FKS.jakIn,dx=J_.tx-JAKF.x,step=300*dt;JAKF.y=J_.ty;JAKF.dir='side';JAKF.face=1;
    if(Math.abs(dx)<=step){JAKF.x=J_.tx;JAKF.moving=0;JAKF.mv=0;FKS.jakIn=null;talk([['Spar',"Lum!"]],false,fkStand);}else{JAKF.x+=Math.sign(dx)*step;JAKF.moving=1;JAKF.mv=1;JAKF.ph+=step;}}
  if(FKS.st===8){ZOOMK=1-.22*easeIO(Math.min(1,FKS.t/4));if(FKS.t>2.6&&!FKS.ended){FKS.ended=1;C1.fkDone=1;C1.chEnd=1;finishChapter('ch1');startCh1Results();}}
  if(FKS.st===6){FKS.fa=Math.max(0,FKS.fa-dt*.7);if(FKS.fa<=0){FKS.st=7;fkFarewell();}}}
const fkJak=()=>jakInParty();
/* ZOOMK: the slow pull-back at the end of the clearing (1 = normal view) */
let ZOOMK=1,ZOOM0=1;const easeIO=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function fkMeet(){WEVENT.on=true;lum.vx=lum.vy=0;lum.state='idle';lum.face=1;
  const L=[['Lum',"Cosmic! I’ve found you!"]];
  if(fkJak())L.push(['Spar',"Lum, wait. Something is wrong…"]);
  L.push(['Cosmic',"Master Lum… why didn’t you protect me!"],['Lum',"Let’s get you home, Cosmic!"],['Cosmic',"…get you home… Cosmic…"],['Cosmic',"That poor child can't hear you anymore, little witch!"],['Lum',"Cosmic, what has happened to you?"]);
  talk(L,false,()=>{FKS.st=2;FKS.t=0;sfxEerie();});}
function fkReveal(){const L=[['Fokalur',"One thousand years… trapped in darkness."],['Fokalur',"Bound by ancient magic, forgotten by the world, condemned to listen as centuries passed above me."],['Fokalur',"And then… a child."],
    ['Fokalur',"So eager to explore, so desperate to understand things they cannot possibly comprehend."],['Fokalur',"No fear of the unknown. No suspicion of a friendly voice whispering from afar…"],
    ['Fokalur',"I did not need strength to break my chains. I needed only a little curiosity. A child’s hand reaching where it should never have reached."],['Fokalur',"And now, little one… look what you've done."],
    ['Fokalur',"One thousand years of patience… rewarded by the innocence of a child."],['Fokalur',"How delightfully easy it is to open a door when someone else turns the key."],['Fokalur',"I am Demon God, Fokalur."],['Lum',"…"]];
  if(fkJak())L.push(['Spar',"Fokalur!?"]);
  talk(L,false,()=>{if(fkJak())fkStand();else fkJakArrives();});}
/* Lum came alone: Jak runs into the clearing to stand with her */
function fkJakArrives(){if(!jakInParty()){PARTY_ORDER.length=1;PARTY_ORDER.push(MATE);}C1.jak=1;HEROES[MATE].hp=HEROES[MATE].maxHp;
  JAKF={x:lum.x-390,y:lum.y+4,face:1,moving:1,ph:0,dir:'side',mv:1};JAKCRUMB.length=0;FKS.jakIn={tx:lum.x-70,ty:lum.y+4};}
function fkStand(){const L=[['Spar',"I do not fear death."],['Fokalur',"A shop owner and a broken warrior… prepare to die!"]];
  talk(L,false,()=>{FKS.st=4;WEVENT.on=false;lum.bumpT=0;startEncounter({kind:'fokalur',scene:'thorn',x:FKS.cx,y:FKS.cy,s:1,pack:1,calm:0,dead:0,scripted:true,boss:1,onLose:fkAfterLoss},'normal');});}
function fkAfterLoss(){for(const id of PARTY_ORDER)HEROES[id].hp=Math.max(1,Math.round(HEROES[id].maxHp*.25));
  SCENE='thorn';lum.x=FKS.cx-240;lum.y=FKS.cy;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x+120;cam.y=lum.y-50;resetJakFollow();LUMSTONE=1;FKS.fire={x:lum.x+120,y:lum.y+6};FKS.st=5;FKS.fa=1;FKS.ca=0;WEVENT.on=true;
  const fade=()=>{FKS.st=6;FKS.flash=.8;sfxRumble(3,.9);};
  setTimeout(()=>{const L=[['Fokalur',"My reign of terror has only just begun."]];if(fkJak())L.push(['Fokalur',"Ha! A stone witch watches as her protector burns in hellfire!"]);L.push(['Fokalur',"Let every living soul learn the true meaning of suffering."]);talk(L,false,fade);},900);}
function fkFarewell(){const L=[['Lum',"…"]];
  talk(L,false,()=>{FKS.st=8;FKS.t=0;});}
function drawFKS(){const x=FKS.cx,y=FKS.cy;
  if(FKS.ca>0&&ready(catlas)){const A=COS_BLADE.idle,dw=CFW*CSPR,dh=CFH*CSPR;ctx.save();ctx.globalAlpha=FKS.ca;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+2,26,7,0,0,TAU);ctx.fill();
    ctx.translate(x,y+3);if(-1!==A.native)ctx.scale(-1,1);ctx.drawImage(catlas,A.frames[0]*CFW,0,CFW,CFH,-dw/2,-dh*(264/270),dw,dh);ctx.restore();
    if(FKS.st>=1){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y-70,70,'170,40,90',.18*FKS.ca+.1*Math.sin(T*4)*FKS.ca);ctx.restore();}}
  if(FKS.fa>0){const h=520,n=FKS.st===2?(FKS.t<1.4?4:5):Math.floor(T*4)%4;ctx.save();ctx.globalAlpha=FKS.fa;ctx.fillStyle='rgba(10,0,10,.45)';ctx.beginPath();ctx.ellipse(x,y,140,28,0,0,TAU);ctx.fill();ctx.restore();
    ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y-280,300,'160,30,80',(.22+.08*Math.sin(T*3))*FKS.fa);ctx.restore();drawFokFrame(ctx,n,x,y+4,h,false,FKS.fa);}}

/* Chapter 1's results: fade to black, a closing line, then the same results card as the prologue */
const C1RES={t:0};
function startCh1Results(){RESULTS.ch='ch1';RESULTS.r=null;RESULTS.sealT=0;RESULTS.msgT=0;C1RES.t=.001;C1RES.t0=performance.now();WEVENT.on=true;}
function drawC1Results(){if(!C1RES.t)return;C1RES.t=Math.max(.001,(performance.now()-C1RES.t0)/1000);const t=C1RES.t;if(t>2)ZOOMK=1;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle=`rgba(0,0,0,${Math.min(1,t/2)})`;ctx.fillRect(0,0,W,H);
  if(t>6.5){ctx.restore();ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);drawResults(t-6.5);ctx.restore();return;}
  ctx.globalAlpha=Math.max(0,Math.min(1,(t-2)/1.5,(6.5-t)/.8));ctx.textAlign='center';
  ctx.font='700 22px "Alegreya SC", Georgia, serif';ctx.fillStyle='rgba(232,226,242,.85)';ctx.fillText('End of Chapter 1',W/2,H*.47);ctx.restore();}
