/* =====================================================================
   CHAPTER 1: Lum wakes to find Cosmic gone
   ===================================================================== */
const VANE_HAND=[[0.8416666666666667, 0.1989795918367347], [0.8472222222222222, 0.18622448979591838], [0.8416666666666667, 0.1556122448979592]];
const C1ATL={"jak": {"cw": 560, "ch": 300, "rows": {"idle": [0, 5], "walk": [1, 8], "run": [2, 5], "chop": [3, 5], "swing": [4, 5], "cast": [5, 8], "hurt": [6, 4], "ko": [7, 4], "down": [8, 5], "up": [9, 5]}}, "flora": {"cw": 236, "ch": 242, "rows": {"idle": [0, 6], "bloom": [1, 8], "attack": [2, 7], "shot": [3, 1], "hurt": [4, 4]}}, "rskel": {"cw": 330, "ch": 384, "rows": {"idle": [0, 4], "move": [1, 4], "hover": [2, 3], "cast": [3, 4], "hurt": [4, 4], "die": [5, 4]}}, "wisp": {"cw": 444, "ch": 394, "rows": {"idle": [0, 4], "roll": [1, 8], "spin": [2, 4], "thorn": [3, 4], "hurt": [4, 3], "taunt": [5, 4], "die": [6, 4]}}, "vane": {"cw": 360, "ch": 392, "rows": {"idle": [0, 4], "walk": [1, 8], "hold": [2, 3], "lantern": [2, 3]}}, "reaper": {"cw": 396, "ch": 328, "rows": {"idle": [0, 6], "walk": [1, 8], "cast": [2, 7], "strike": [3, 5], "hurt": [4, 3]}}, "bat": {"cw": 608, "ch": 400, "rows": {"fly": [0, 3], "glide": [1, 3], "swoop": [2, 3], "recover": [3, 2]}}, "fox": {"cw": 315, "ch": 285, "rows": {"run": [0, 12], "jump": [1, 9], "attack": [2, 8], "jattack": [3, 1], "hurt": [4, 1]}}, "spider": {"cw": 360, "ch": 220, "rows": {"idle": [0, 4], "crawl": [1, 5], "attack": [2, 3], "jump": [3, 4]}}};
const C1={hedgeSeen:0,tracksSeen:0,cemSeen:0,reaper:0,vane:0,endSeen:0,woodsSeen:0};
const WFOES=[];let REAPER=null,VANE=null;
C1ATL.fox_red=C1ATL.fox;C1ATL.spider_dark=C1ATL.spider;
C1ATL.amroth={"cw":230,"ch":256,"rows":{"down":[0,1],"up":[1,2],"side":[2,6],"run":[3,6],"bidle":[4,2],"bslash":[5,3]}}; // Amroth: visor always closed. down (1 frame), up, side walk + run (face right), battle guard, sword slash (faces right)
const AMR_H=150,AMR_BH=178;
C1ATL.alma={"cw":200,"ch":250,"rows":{"down":[0,6],"up":[1,5],"side":[2,6]}}; // Alma (Amroth's wife): down/up/side walks (side faces right). Not placed in the game yet
C1ATL.spar={"cw": 261, "ch": 306, "rows": {"down": [0, 5], "up": [1, 5], "side": [2, 5], "bidle": [3, 4], "brun": [4, 5]}}; // Spar: down/up/side walks (side faces right), battle idle + run with his sword (run faces left)
const SPAR_H=139,SPAR_BH=164; // overworld / battle draw heights (a head taller than Lum)
function c1Frame(c,sh,anim,i,x,y,h,flip,alpha,flash){const im=IMG[sh],A=C1ATL[sh];if(!ready(im)||!A.rows[anim])return;const [r,n]=A.rows[anim];i=clamp(i|0,0,n-1);const k=h/A.ch;
  c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.globalAlpha*=alpha;if(flash>0)c.filter='brightness(1.8)';c.drawImage(im,i*A.cw,r*A.ch,A.cw,A.ch,-A.cw*k/2,-A.ch*k*.985,A.cw*k,A.ch*k);c.filter='none';c.restore();}
const UNDEAD=t=>t==='rskel'||t==='reaper'||t==='skel';
/* ---------- starting the chapter ---------- */
function c1Reset(){ZOOMK=1;if(typeof FKS!=='undefined'){FKS.st=0;FKS.chaos=0;FKS.fire=null;}dfoesBuilt=false;DFOES.length=0;CH=1;HERO='lum';PARTY_ORDER.length=1;PARTY_ORDER[0]='lum';HEROES.jak.hp=5;HEROES.spar.hp=HEROES.spar.maxHp;C1.comboS=0;thFoesBuilt=false;THFOES.length=0;JAKF=null;PC='lum';ANIM=LUM_ANIM;
  Object.assign(PARTY.lum,{main:'lumpouch',off:null,head:null,chest:'lumrobe',boots:null,charm:null});Object.assign(PARTY.jak,{main:'jakaxe',off:'jakstick',head:null,chest:'jakcoat',boots:null,charm:null});equipStartingKeepsake();
  HEROES.lum.hp=HEROES.lum.maxHp;syncMaxHp();HEROES.lum.hp=HEROES.lum.maxHp;
  BAG.length=0;BAG.push('potion','potion','potion');for(const k in MATS)delete MATS[k];Object.assign(POWDERS,{frost:3,thorn:3,moon:3});
  for(const k in C1)C1[k]=0;
  // the garden is quiet now: no slugs, no slimes anywhere, the hedge already cut
  SLUGS.length=0;kingState=2;gardenDone=5;WSLIMES.length=0;SSLIMES.length=0;SHSLIMES.length=0;PSLIMES.length=0;slimesSpawned=sslimesSpawned=shedSpawned=pondSlimesSpawned=true;
  shedChestOpen=true;bucketTaken=true;wellVisited=studyVisited=shedVisited=pondVisited=true;mimicState=2;restTalk=true;
  NIGHT.on=false;NIGHT.rain=false;NIGHT.cut=true;removeHedge();addHedgeDoor();if(NIGHT.rainSrc){try{NIGHT.rainSrc.stop();}catch(e){}NIGHT.rainSrc=null;}
  BED.night=0;BED.sleeping=false;BED.slept=true;
  WEV.mid=WEV.circle=1;WEV.cem=1;WEV.entered=1;WEV.end=0;WEV.fk=0;WEV.seal=0;WEV.foka=0;WEV.quake=0;WSKELS.length=0;
  WFOES.length=0;REAPER=null;VANE=null;woodsC1Built=false;
  for(const k in STATS)if(typeof STATS[k]==='number')STATS[k]=0;STATS.found={};
  INTRO.on=false;INTRO.waiting=false;INTRO.fade=0;INTRO.ui=1;INTRO.lumShown=true;cos.hidden=true;HINT.on=false;HINT.goalT=99;TUT.stage=0;}
function c1Bedroom(){const door=BEDINT[0];BEDINT.length=0;BEDINT.push(door);const L=(x,y,reach,lines)=>{let i=0;BEDINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  L(900,740,130,["Cosmic's bed. The blankets are thrown back… he must have slipped out sometime in the night.","His pillow's gone cold. Wherever he went, he left a long while ago."]);
  L(540,640,95,["No time to rest. Not until I know where he's gone."]);
  L(205,680,100,["His treasure chest. A frog-shaped rock, three marbles, and a feather he's saving for a hat."]);
  L(790,640,90,["My reading glasses, and 'Quiet Magic for Loud Apprentices.' I bought it as a joke. He didn't laugh."]);
  L(140,640,90,["The birches look dull this morning. Something has drained the glow right out of them."]);}
function applySaveC1(d){c1Reset();Object.assign(C1,d.c1||{});if(C1.jak){PARTY_ORDER.length=1;PARTY_ORDER.push(MATE);HEROES[MATE].hp=clamp(C1.jakHp||5,1,HEROES[MATE].maxHp);}C1.endCard=0;C1.title=0;Object.assign(POWDERS,d.powders||{});if(d.stats)Object.assign(STATS,d.stats,{found:Object.assign({},d.stats.found||{})});
  BAG.length=0;BAG.push(...(d.bag||[]));for(const k in MATS)delete MATS[k];Object.assign(MATS,d.mats||{});if(d.party&&d.party.lum)Object.assign(PARTY.lum,d.party.lum);if(d.party&&d.party.jak)Object.assign(PARTY.jak,d.party.jak);if(d.party&&d.party.spar)Object.assign(PARTY.spar,d.party.spar);syncMaxHp();HEROES.lum.hp=clamp(d.hp||HEROES.lum.maxHp,1,HEROES.lum.maxHp);
  if(C1.reaper===1)C1.reaper=0;if(C1.vane===1)C1.vane=0;
  if(d.c1built||d.scene==='woods'){buildWoods();buildWoodsC1();if(d.wf){const keep=new Set(d.wf);for(let i=WFOES.length-1;i>=0;i--)if(!keep.has(WFOES[i].id))WFOES.splice(i,1);}}
  const sc=d.scene||'garden';if(sc==='woods'){buildWoods();buildWoodsC1();SCENE='woods';}else if(sc==='shop')enterShop();else if(sc==='bed'){enterBedroom();}else if(sc==='shed')enterShed();else if(sc==='vhut'){C1.hutSeen=1;enterVHut();}else if(sc==='dun'){enterDun(d.dunRoom||1,d.x,d.y,d.face);}else if(sc==='thorn'){enterThorn();}else SCENE='garden';
  lum.x=d.x;lum.y=d.y;lum.face=d.face||1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x+(sc==='woods'?60:0);cam.y=lum.y-50;WCAM.x=lum.x;
  GOAL.tag='TASK';GOAL.text=(d.goal&&d.goal.text)||GOAL.text;HINT.goalT=0;}
function startChapter1(){SAVEC.finished=0;audioInit();c1Reset();FADE.a=1;FADE.dir=-1;c1IntroStart();}
function removeHedge(){for(let i=ESTATE.length-1;i>=0;i--){const o=ESTATE[i];if((o.t==='shrub'||o.t==='img')&&Math.abs(o.x-20)<135&&o.y>1575&&o.y<1720)ESTATE.splice(i,1);}}
/* ---------- the woods, the morning after ---------- */
let woodsC1Built=false;
function buildWoodsC1(){if(woodsC1Built)return;woodsC1Built=true;WFOES.length=0;
  if(!WINTS.some(o=>o.c1east))WINTS.push({x:2660,y:628,reach:58,door:true,c1east:1,onInteract:()=>{if(!BAG.includes('lantern')){goScene(enterThornGate);return;}C1.endSeen=1;goScene(enterThorn);}});
  if(!WINTS.some(o=>o.c1west))WINTS.push({x:40,y:630,reach:70,door:true,c1west:1,onInteract:()=>goScene(()=>{enterGarden();lum.x=20;lum.y=1620;lum.face=-1;cam.x=lum.x;cam.y=lum.y-50;})});
  let nid=1;const add=(kind,x,y)=>WFOES.push({kind,scene:'woods',x,y,hx:x,hy:y,tx:x,ty:y,s:1,pack:1,calm:1.5,dead:0,t:rnd(0,4),ph:rnd(0,TAU),face:-1,id:nid++});
  add('wisp',760,670);add('fslime',980,590);add('wisp',1260,570);add('fslime',1520,630);add('wisp',1780,600);
}
function updateWFoes(dt){if(SCENE!=='woods'||CH!==1)return;updateJakFollow(dt);const ok=!DLG.active&&!WEVENT.on&&!MENU.open&&!FADE.dir&&!BATTLE.on&&!BATTLE.pending&&!CHOICE.on;
  for(const g of WFOES){g.t+=dt;g.ph+=dt;g.calm=Math.max(0,g.calm-dt);g.hit=Math.max(0,(g.hit||0)-dt);
    const dx=lum.x-g.x,dy=lum.y-g.y,d=Math.hypot(dx,dy);let sp=g.kind==='fslime'?40:g.kind==='wisp'?62:46,tx=g.tx,ty=g.ty;
    g.chase=ok&&!g.calm&&d<190;
    if(g.chase){tx=lum.x;ty=lum.y;if(d<54&&lum.bumpT<=0){startEncounter(g,'ambush');continue;}}
    else if(Math.hypot(g.tx-g.x,g.ty-g.y)<8||g.t>5){g.t=0;const a=rnd(0,TAU);g.tx=g.hx+Math.cos(a)*rnd(20,90);g.ty=g.hy+Math.sin(a)*rnd(10,45);sp*=.5;}else sp*=.45;
    const ddx=tx-g.x,ddy=ty-g.y,dd=Math.hypot(ddx,ddy)||1;g.faceT=Math.max(0,(g.faceT||0)-dt);if(dd>3&&ok){const ox=g.x,oy=g.y,nx=g.x+ddx/dd*sp*dt,ny=g.y+ddy/dd*sp*dt;if(woodsFree(nx,ny)){g.x=nx;g.y=ny;}else if(woodsFree(nx,g.y))g.x=nx;else if(woodsFree(g.x,ny))g.y=ny;
      const mvx=g.x-ox,mv=Math.hypot(mvx,g.y-oy);g.stuck=mv<sp*dt*.25?(g.stuck||0)+dt:0;if(g.stuck>.4){g.stuck=0;g.calm=Math.max(g.calm,1.6);const a_=rnd(0,TAU);g.tx=g.hx+Math.cos(a_)*60;g.ty=g.hy+Math.sin(a_)*30;}
      if(Math.abs(mvx)>sp*dt*.3&&!g.faceT){const nf=mvx<0?-1:1;if(nf!==g.face){g.face=nf;g.faceT=.4;}}g.moving=mv>.05?1:0;}else g.moving=0;}
  // the Grave Reaper's charge at the hut door
  if(REAPER&&REAPER.scene){const R=REAPER;R.t+=dt;if(R.st==='rise'){R.rise=Math.min(1,(R.rise||0)+dt/1.4);if(R.rise>=1){R.st='walk';}}
    else if(R.st==='walk'){const tx=HUTDOOR.x+40,ty=HUTDOOR.y+18,dx=tx-R.x,dy=ty-R.y,d=Math.hypot(dx,dy);R.face=dx<0?-1:1;if(d<6){R.st='pound';R.t=0;}else{R.x+=dx/d*70*dt;R.y+=dy/d*70*dt;}}
    else if(R.st==='pound'){if(((R.t*2.2)|0)!==((R.t*2.2-dt*2.2)|0)){shake=6;noiseHit&&SND.ready&&noiseHit(SND.ctx.currentTime,.12,'lowpass',300,1,.35,SND.sfx,90);}R.face=-1;if(R.t>2.4){R.st='turn';R.t=0;R.st='chase';R.t=0;R.calm=0;}}
    else if(R.st==='chase'){R.calm=Math.max(0,(R.calm||0)-dt);const dx=lum.x-R.x,dy=lum.y-R.y,d=Math.hypot(dx,dy);R.face=dx<0?-1:1;
      if(!DLG.active&&!MENU.open&&!FADE.dir&&!BATTLE.on&&!BATTLE.pending&&!WIPE.dir&&!R.calm){const sp=RUN_SPEED*1.35;if(d<62){R.st='fight';startEncounter(R,'ambush');}else{R.x+=dx/d*sp*dt;R.y+=dy/d*sp*dt;}}}}
  if(VANE){const V=VANE;V.t+=dt;if(V.st!=='walk'&&!V.cb)V.face=lum.x<V.x?-1:1;if(V.step){const sx=V.step.x-lum.x,sy=V.step.y-lum.y,sd=Math.hypot(sx,sy);if(sd>3){const m=Math.min(sd,90*dt);lum.x+=sx/sd*m;lum.y+=sy/sd*m;lum.state='walk';lum.face=sx<0?-1:1;}else{lum.state='idle';lum.face=-1;V.step=null;}}if(V.st==='walk'){const dx=V.tx-V.x,dy=V.ty-V.y,d=Math.hypot(dx,dy);if(d<4){V.st='idle';V.cb&&V.cb();V.cb=null;}else{V.x+=dx/d*42*dt;V.y+=dy/d*42*dt;V.face=dx<0?-1:1;}}}}
function drawWFoe(g){if(CAPTURE.on&&g===BATTLE.capG)return;const fl=g.face>0;
  if(g.kind==='fslime'){ctx.fillStyle='rgba(20,40,30,.22)';ctx.beginPath();ctx.ellipse(g.x,g.y+2,34,8,0,0,TAU);ctx.fill();const im=IMG.jelly_idle_moss,w=100,h=w*(ready(im)?im.naturalHeight/im.naturalWidth:.7),hov=12+Math.sin(g.ph*1.6)*4;drawGlow(ctx,g.x,g.y-hov-h*.55,w*.7,'170,240,190',.25);drawJellySprite(im,g.x,g.y-hov,w,h,g.ph,g.hit||0,1);return;}
  if(g.kind==='wisp'){ctx.fillStyle='rgba(20,20,10,.25)';ctx.beginPath();ctx.ellipse(g.x,g.y+2,30,7,0,0,TAU);ctx.fill();const bob=Math.sin(g.ph*2.2)*5;c1Frame(ctx,'wisp',g.moving?'roll':'idle',Math.floor(g.ph*(g.moving?12:5)),g.x,g.y-6+bob,78,false,1,g.hit||0);return;}
  if(g.kind==='rskel'){ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(g.x,g.y+2,28,7,0,0,TAU);ctx.fill();const bob=Math.sin(g.ph*1.8)*4;c1Frame(ctx,'rskel',g.moving?'move':'idle',Math.floor(g.ph*6),g.x,g.y-8+bob,150,!fl,1,g.hit||0);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x,g.y-120+bob,22,'180,170,255',.2);ctx.restore();return;}}
function drawReaperOW(R){if(CAPTURE.on&&R===BATTLE.capG)return;const h=215,e=R.st==='rise'?1-Math.pow(1-(R.rise||0),2):1;ctx.fillStyle='rgba(10,10,20,.3)';ctx.beginPath();ctx.ellipse(R.x,R.y+2,40*e,9*e,0,0,TAU);ctx.fill();
  ctx.save();ctx.beginPath();ctx.rect(R.x-200,R.y-300,400,304);ctx.clip();const an=R.st==='walk'?'walk':R.st==='pound'?'strike':'idle',fi=R.st==='pound'?Math.floor(R.t*8)%5:Math.floor(R.t*(R.st==='walk'?9:6));
  c1Frame(ctx,'reaper',an,fi,R.x,R.y+(1-e)*h,h,R.face<0,1,0);ctx.restore();ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,R.x+(R.face<0?-26:26),R.y-h*.82,24,'200,240,200',.35+.15*Math.sin(T*5));ctx.restore();}
function drawVaneOW(V){const an=V.st==='walk'?'walk':V.lantern?'lantern':'idle',fi=V.lantern?Math.min(2,Math.floor((T-V.lt)*4)):Math.floor(T*(V.st==='walk'?8:3)),H_=165;ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(V.x,V.y+2,32,7,0,0,TAU);ctx.fill();
  const flip=an==='idle'?V.face>0:V.face<0;c1Frame(ctx,'vane',an,fi,V.x,V.y+2,H_,flip,1,0);if(V.lantern)drawVaneLantern(V.x,V.y+2,H_,flip,fi);}
function drawVaneLantern(x,y,h,flip,fi){const A=C1ATL.vane,k=h/A.ch,hd=VANE_HAND[clamp(fi|0,0,VANE_HAND.length-1)];const hx=x+(hd[0]-.5)*A.cw*k*(flip?-1:1),hy=y-A.ch*k*.985+hd[1]*A.ch*k;
  const im=IMG.tool_lantern,lh=h*.3;ctx.save();ctx.globalCompositeOperation='lighter';const f=.85+.1*Math.sin(T*7);drawGlow(ctx,hx,hy+lh*.55,lh*1.1*f,'255,200,120',.45);drawGlow(ctx,hx,hy+lh*.55,lh*.3,'255,235,180',.6);ctx.restore();
  if(ready(im)){const sw=Math.sin(T*2.2)*.06;ctx.save();ctx.translate(hx,hy-lh*.06);ctx.rotate(sw);ctx.drawImage(im,-lh/2,0,lh,lh);ctx.restore();}}
/* muddy boot prints along the road and down to the graveyard gate */
let BOOTS=null;
function buildBoots(){BOOTS=[];const P=[...ROAD.filter(p=>p[0]<2000),...SPUR,[2046,900],[2010,980]];let acc=0,side=1;for(let i=1;i<P.length;i++){const [ax,ay]=P[i-1],[bx,by]=P[i],d=Math.hypot(bx-ax,by-ay),a=Math.atan2(by-ay,bx-ax);for(let s=0;s<d;s+=34){acc++;side=-side;const t=s/d,x=ax+(bx-ax)*t-Math.sin(a)*side*7,y=ay+(by-ay)*t+Math.cos(a)*side*5;if(x<40)continue;BOOTS.push([x,y,a,acc]);}}}
function drawBoots(x0,x1){if(!BOOTS)buildBoots();ctx.fillStyle='rgba(70,48,28,.55)';for(const [x,y,a,k] of BOOTS){if(x<x0-20||x>x1+20)continue;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,0,6.5,3.2,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(-7,0,3,2.6,0,0,TAU);ctx.fill();ctx.restore();}}
const HUTDOOR={get x(){return HUT.x-(359-429)*HUT.k},get y(){return HUT.y+18}};
function enterWoodsC1(){buildWoods();buildWoodsC1();SCENE='woods';lum.x=70;lum.y=630;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x+120;cam.y=lum.y-50;WTITLE.t=0;
  if(!C1.woodsSeen){C1.woodsSeen=1;setTimeout(()=>talk([['Lum',"I haven't set foot out here in aeons…"]]),4700);}}
function updateWoodsC1(){if(DLG.active||WEVENT.on||FADE.dir||BATTLE.on)return;
  if(!C1.tracksSeen&&lum.x>230){C1.tracksSeen=1;talk([['Lum',"Muddy tracks…"],['Lum',"What were you doing all the way out here, Cosmic?"]]);GOAL.tag='TASK';GOAL.text="Follow Cosmic's tracks";HINT.goalT=0;}
  if(!C1.cemSeen&&lum.y>GATE.y+40){C1.cemSeen=1;talk([['Lum',"The tracks lead right here…"],['Lum',"What happened here last night?"]]);GOAL.tag='TASK';GOAL.text='Search the graveyard';HINT.goalT=0;}

}
