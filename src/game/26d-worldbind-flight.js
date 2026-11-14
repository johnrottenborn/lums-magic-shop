/* ---------- Worldbind room 5 (room 15 in code) onward: the mountain shakes, demons pour in behind, and the three green-flame torches ----------
   Room 5: the ceiling rumbles and sheds dust and pebbles. A third of the way in, Amroth says they can't fight them all; from then on a demon
   keeps coming from the top of the stairs (one at a time, replaced when beaten). Touching the lion torch lights it and brings a big brown demon
   in from the right: it hits twice and drops a healing potion. Lion, raven (room 7) and serpent (room 9) torches together will open a room in
   room 10 (WBT tracks them; the room itself is still to come). */
const WB5={said:0,chaser:null,respawn:0,trail:[],brown:null,brownLeft:0,fall:[],rumT:0,q:[0,0]};
const WBT={lion:0,raven:0,serpent:0,flare:{}};
/* the brown demons: the same art, tinted brown, cached once */
let DEMON_BROWN=null;
function demonArt(brown){const im=IMG.demon_imp;if(!brown||!ready(im))return im;if(DEMON_BROWN)return DEMON_BROWN;
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  x.globalCompositeOperation='multiply';x.fillStyle='#a8865a';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-in';x.drawImage(im,0,0);
  return DEMON_BROWN=c;}
function wb5Chaser(){const [sx,sy]=DUN.room===16?nearestFree(150,560):nearestFree(425,236);   /* from the room's entrance */
  WB5.chaser={kind:'demon',scene:'dun',x:sx,y:sy,face:1,s:1,pack:1,calm:0,a:0,ti:0,
  onWin:()=>{WB5.chaser=null;WB5.respawn=1.2;runLine();},onLose:()=>{boHeal();WB5.chaser=null;WB5.respawn=2.5;[lum.x,lum.y]=nearestFree(1000,620);lum.face=1;resetAmrFollow();}};}
function wb5Brown(){const [bx,by]=nearestFree(1215,540);WB5.brown={kind:'bdemon',scene:'dun',x:bx,y:by,face:-1,s:1,pack:1,calm:0,a:0,big:1,
  onWin:()=>{WB5.brown=null;WB5.brownLeft=0;setTimeout(()=>talk([['Amroth',"Keep running!"]]),900);},
  onLose:()=>{boHeal();WB5.brown.calm=3;[WB5.brown.x,WB5.brown.y]=nearestFree(1215,540);lum.x=640;lum.y=620;lum.face=1;resetAmrFollow();}};WB5.brownLeft=1;}
/* demons walk only where Lum can walk: a 20px grid of the room's walkable floor (dunFree), searched breadth-first toward their target */
const DGRID={room:-1,c:20,cols:0,rows:0,free:null};
function dgrid(){if(DGRID.room!==DUN.room){const c=DGRID.c;DGRID.cols=Math.ceil(1375/c);DGRID.rows=Math.ceil(768/c);DGRID.free=new Uint8Array(DGRID.cols*DGRID.rows);
    for(let r=0;r<DGRID.rows;r++)for(let q=0;q<DGRID.cols;q++)DGRID.free[r*DGRID.cols+q]=dunFree(q*c+c/2,r*c+c/2)?1:0;DGRID.room=DUN.room;}return DGRID;}
/* the walkable cell nearest a point (for spawn points and targets) */
function nearestFree(x,y){const G=dgrid(),c=G.c;let best=null,bd=1e9;for(let r=0;r<G.rows;r++)for(let q=0;q<G.cols;q++)if(G.free[r*G.cols+q]){const px=q*c+c/2,py=r*c+c/2,d=(px-x)**2+(py-y)**2;if(d<bd){bd=d;best=[px,py];}}return best||[x,y];}
function dcell(x,y){const G=dgrid();return [clamp(Math.floor(x/G.c),0,G.cols-1),clamp(Math.floor(y/G.c),0,G.rows-1)];}
function lineFree(x0,y0,x1,y1){const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/8);for(let i=1;i<=n;i++){const t=i/n;if(!dunFree(x0+(x1-x0)*t,y0+(y1-y0)*t))return false;}return true;}
function dpath(g,tx,ty){const G=dgrid(),W_=G.cols,[sq,sr]=dcell(g.x,g.y);let [eq,er]=dcell(tx,ty);if(!G.free[er*W_+eq]){const n=nearestFree(tx,ty);[eq,er]=dcell(n[0],n[1]);}
  const prev=new Int32Array(W_*G.rows).fill(-1),start=sr*W_+sq,goal=er*W_+eq,Q=[start];prev[start]=start;
  for(let h=0;h<Q.length;h++){const u=Q[h];if(u===goal)break;const uq=u%W_,ur=(u/W_)|0;for(const [dq,dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const q=uq+dq,r=ur+dr;if(q<0||r<0||q>=W_||r>=G.rows)continue;const v=r*W_+q;if(prev[v]>=0||!G.free[v])continue;if(dq&&dr&&(!G.free[ur*W_+q]||!G.free[r*W_+uq]))continue;prev[v]=u;Q.push(v);}}
  if(prev[goal]<0)return null;const pts=[];for(let v=goal;v!==start;v=prev[v])pts.push([(v%W_)*G.c+G.c/2,((v/W_)|0)*G.c+G.c/2]);return pts.reverse();}
/* step a demon toward (tx,ty) along walkable floor; returns the distance left */
function demonStep(g,tx,ty,sp,dt){const d0=Math.hypot(tx-g.x,ty-g.y);if(d0<3){g.mv=0;return d0;}
  if(!dunFree(g.x,g.y)){const n=nearestFree(g.x,g.y);g.x=n[0];g.y=n[1];}   /* never left standing in a wall */
  let wx=tx,wy=ty;if(!lineFree(g.x,g.y,tx,ty)){g.repath=(g.repath||0)-dt;if(g.repath<=0||!g.path||!g.path.length){g.path=dpath(g,tx,ty);g.repath=.35;}
    const P_=g.path;if(P_&&P_.length){while(P_.length>1&&lineFree(g.x,g.y,P_[1][0],P_[1][1]))P_.shift();if(Math.hypot(P_[0][0]-g.x,P_[0][1]-g.y)<6&&P_.length>1)P_.shift();[wx,wy]=P_[0];}else{g.mv=0;return d0;}}
  const dx=wx-g.x,dy=wy-g.y,d=Math.hypot(dx,dy)||1,m=Math.min(d,sp*dt),nx=g.x+dx/d*m,ny=g.y+dy/d*m;
  if(dunFree(nx,ny)){g.x=nx;g.y=ny;}else if(dunFree(nx,g.y))g.x=nx;else if(dunFree(g.x,ny))g.y=ny;
  g.mv=1;if(Math.abs(tx-g.x)>3)g.face=tx>g.x?1:-1;return d0-m;}
/* rooms 5 to 10 (15-20 in code) all shake, until the archway in room 10 caves in */
const wbQuaking=()=>SCENE==='dun'&&DUN.room>=15&&DUN.room<=20&&!(DUN.room===20&&WB10.st);
function updateWorldbind5(dt){
  if(!wbQuaking()){WB5.fall.length=0;WB5.q=[0,0];}else{if(WB5.qRoom!==DUN.room){WB5.qRoom=DUN.room;WB5.fall.length=0;}wbQuake(dt);}
  if(SCENE!=='dun'||(DUN.room!==15&&DUN.room!==16)){WB5.chaser=null;WB5.trail.length=0;if(WB5.brown){WB5.brown=null;}WB5.room=0;return;}
  if(WB5.room!==DUN.room){WB5.room=DUN.room;WB5.chaser=null;WB5.brown=null;WB5.respawn=.8;}   /* a new room: its demons come from its own entrance */
  updateWB5Room(dt);}
/* the line after beating one of the endless demons (rooms 4, 5, 6): Lum and Amroth take turns */
let RUNLINE=0;
function runLine(){RUNLINE++;setTimeout(()=>talk([RUNLINE%2?['Lum',"There’s too many! We need to run…"]:['Amroth',"Let’s move quickly!"]]),700);}
function wbQuake(dt){
  /* the mountain shakes: a constant tremor with heavier jolts, a low rumble, dust and pebbles from the ceiling */
  WB5.rumT-=dt;if(WB5.rumT<=0){WB5.rumT=rnd(3.5,5.5);WB5.jolt=.6;try{sfxRumble(1.8,.45);}catch(e){}}WB5.jolt=Math.max(0,(WB5.jolt||0)-dt);
  const amp=1.2+WB5.jolt*7;WB5.q=[rnd(-amp,amp),rnd(-amp,amp)*.7];
  if(Math.random()<dt*(WB5.jolt>0?28:9))WB5.fall.push({x:rnd(180,1250),y:rnd(-20,140),vy:rnd(40,90),g:rnd(500,700),ground:rnd(430,760),rock:Math.random()<.35,s:rnd(2,5),t:0,land:0,rot:rnd(0,TAU)});
  for(const p of WB5.fall){if(p.land){p.land+=dt;continue;}p.vy+=p.g*dt*(p.rock?1:.25);p.y+=p.vy*dt;p.rot+=dt*4;if(p.y>=p.ground){p.y=p.ground;p.land=.001;}}
  for(let i=WB5.fall.length-1;i>=0;i--)if(WB5.fall[i].land>(WB5.fall[i].rock?1.6:.5))WB5.fall.splice(i,1);}
function updateWB5Room(dt){
  /* Lum's path through the room, for the demons to follow down the stairs */
  const tr=WB5.trail,lt=tr[tr.length-1];if(!lt||Math.hypot(lum.x-lt[0],lum.y-lt[1])>14)tr.push([lum.x,lum.y]);
  /* a third of the way in (down the stairs, ~880 long in all): Amroth's warning, then the demons start coming */
  const r6=DUN.room===16,on=r6?WB5.said6:WB5.said;
  if(!on&&C2.joined&&!FADE.dir&&!DLG.active&&(r6?lum.x>687:Math.hypot(lum.x-425,lum.y-230)>=290)){WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;
    if(r6){WB5.said6=1;try{sfxBabyCry(.8);}catch(e){}   /* room 6, halfway across: the baby cries */
      setTimeout(()=>talk([['Amroth',"Are the demons coming after this baby?"]],false,()=>{WEVENT.on=false;WB5.respawn=.6;}),1100);}
    else{WB5.said=1;talk([['Amroth',"More demons… we cannot face them all."]],false,()=>{WEVENT.on=false;WB5.respawn=.6;});}}
  if(BATTLE.on||BATTLE.pending||WIPE.dir||FADE.dir)return;
  if((r6?WB5.said6:WB5.said)&&!WB5.chaser){WB5.respawn-=dt;if(WB5.respawn<=0&&!WEVENT.on)wb5Chaser();}
  if(!r6&&WB5.brownLeft&&!WB5.brown)wb5Brown();
  for(const g of [WB5.chaser,WB5.brown]){if(!g)continue;g.a=Math.min(1,g.a+dt*2);if(g.calm>0){g.calm-=dt;g.mv=0;continue;}if(WEVENT.on||DLG.active){g.mv=0;continue;}
    const d=Math.hypot(lum.x-g.x,lum.y-g.y);
    if(g===WB5.chaser)demonStep(g,lum.x,lum.y,118,dt);
    else demonStep(g,lum.x,lum.y,100,dt);
    if(d<(g.big?80:62)&&lum.bumpT<=0){startEncounter(g,'ambush');break;}}}
/* the green-flame torches: touch to light them brighter (the lion's also wakes the brown demon) */
function touchWBTorch(k,lines){if(WBT[k]){say(lines[0]);return;}WBT[k]=1;WBT.flare[k]=1;try{sfxIgnite();}catch(e){}
  if(k==='lion')setTimeout(()=>{if(SCENE==='dun'&&DUN.room===15)wb5Brown();},900);}
function wbTorchGlow(room,px,py,rz){const k=room===15?'lion':room===17?'raven':'serpent';if(!WBT[k])return;const f=WBT.flare[k]||0;if(f>0)WBT.flare[k]=Math.max(0,f-1/60);
  drawGlow(ctx,px,py,(230+12*Math.sin(T*6))*rz,'110,255,200',.3);drawGlow(ctx,px,py,70*rz,'210,255,235',.45);if(f>0)drawGlow(ctx,px,py,300*rz,'200,255,230',f*.8);}
/* dust streams and pebbles falling in room 5, drawn in room coordinates */
function drawWB5Fall(){ctx.save();for(const p of WB5.fall){const fade=p.land?Math.max(0,1-p.land/(p.rock?1.6:.5)):1;
  if(p.rock){ctx.globalAlpha=fade;ctx.fillStyle='#3b3f47';ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.beginPath();ctx.moveTo(-p.s,-p.s*.6);ctx.lineTo(p.s*.8,-p.s);ctx.lineTo(p.s,p.s*.5);ctx.lineTo(-p.s*.4,p.s);ctx.closePath();ctx.fill();ctx.restore();
    if(p.land&&p.land<.4){ctx.globalAlpha=(.4-p.land)*1.2;ctx.fillStyle='rgba(170,175,185,.6)';ctx.beginPath();ctx.ellipse(p.x,p.y,8+p.land*40,3+p.land*10,0,0,TAU);ctx.fill();}}
  else{ctx.globalAlpha=.35*fade;ctx.fillStyle='rgba(185,190,200,1)';ctx.fillRect(p.x-1,p.y-24,2,24);ctx.globalAlpha=.2*fade;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,TAU);ctx.fill();}}ctx.restore();}
/* ---------- Worldbind room 10 (room 20 in code): at the bottom of the stairs the archway caves in behind Lum ----------
   The rubble is cut from the mountain-face art (worldbind_cliff), clipped to the arch and darkened; the way back up is closed for good. */
const WB10={st:0,t:0,fill:0,q:[0,0],rocks:[]};
const ARCH={cx:857,cy:305,r:93,x0:764,x1:950,y1:600};
function archPath(c,pad=0){c.beginPath();c.moveTo(ARCH.x0-pad,ARCH.y1+pad);c.lineTo(ARCH.x0-pad,ARCH.cy);c.arc(ARCH.cx,ARCH.cy,ARCH.r+pad,Math.PI,0);c.lineTo(ARCH.x1+pad,ARCH.y1+pad);c.closePath();}
function updateWorldbind10(dt){if(SCENE!=='dun'||DUN.room!==20){WB10.q=[0,0];return;}
  if(!WB10.st&&C2.joined&&lum.y>=598&&!FADE.dir&&!DLG.active){WB10.st=1;WB10.t=0;WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;lum.face=1;if(lum.y<618)lum.y=618;resetAmrFollow();setupDun();try{sfxRumble(2.6,1);}catch(e){}}
  if(WB10.st===1){WB10.t+=dt;const t=WB10.t,amp=t<1.8?9*(1-t/2):0;WB10.q=[rnd(-amp,amp),rnd(-amp,amp)*.7];
    if(t<1.4&&Math.random()<dt*40)WB10.rocks.push({x:rnd(ARCH.x0+10,ARCH.x1-10),y:rnd(200,260),vy:rnd(0,80),ground:rnd(560,620),s:rnd(9,22),rot:rnd(0,TAU),spin:rnd(-5,5),cell:Math.floor(rnd(0,7)),land:0});
    if(t>.35)WB10.fill=Math.min(1,WB10.fill+dt*.9);
    if(t>2.4){WB10.st=2;WB10.q=[0,0];WEVENT.on=false;}}
  for(const p of WB10.rocks){if(p.land){p.land+=dt;continue;}p.vy+=900*dt;p.y+=p.vy*dt;p.rot+=dt*p.spin;if(p.y>=p.ground){p.y=p.ground;p.land=.001;}}
  for(let i=WB10.rocks.length-1;i>=0;i--)if(WB10.rocks[i].land>(WB10.fill>=1?.3:1.2))WB10.rocks.splice(i,1);}
/* the blocked archway, drawn over the room image (under the characters) */
function drawWB10Rubble(){if(WB10.fill<=0)return;const im=IMG.worldbind_cliff;ctx.save();ctx.globalAlpha=WB10.fill;
  /* the passage beyond goes dark */
  archPath(ctx);ctx.fillStyle='#04070c';ctx.fill();
  /* rubble rises from the floor as it piles up */
  const top=ARCH.y1-(ARCH.y1-ARCH.cy+ARCH.r+10)*Math.min(1,WB10.fill*1.15);
  ctx.save();archPath(ctx,4);ctx.clip();ctx.beginPath();ctx.moveTo(ARCH.x0-10,ARCH.y1+30);
  for(let x=ARCH.x0-10;x<=ARCH.x1+10;x+=12)ctx.lineTo(x,top+Math.sin(x*.37)*9+Math.sin(x*.11)*14);ctx.lineTo(ARCH.x1+10,ARCH.y1+30);ctx.closePath();ctx.clip();
  if(ready(im))ctx.drawImage(im,330,40,300,330,ARCH.x0-12,ARCH.cy-ARCH.r-14,ARCH.x1-ARCH.x0+24,ARCH.y1-ARCH.cy+ARCH.r+44);
  ctx.fillStyle='rgba(10,30,48,.32)';ctx.fillRect(ARCH.x0-20,ARCH.cy-ARCH.r-20,ARCH.x1-ARCH.x0+40,ARCH.y1-ARCH.cy+ARCH.r+60);
  const g=ctx.createLinearGradient(0,ARCH.cy-ARCH.r,0,ARCH.y1);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(.6,'rgba(0,0,0,.2)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(ARCH.x0-20,ARCH.cy-ARCH.r-20,ARCH.x1-ARCH.x0+40,ARCH.y1-ARCH.cy+ARCH.r+60);ctx.restore();
  /* a few boulders spilling onto the floor at the foot of the arch */
  for(const [bx,by,br,cl,fl] of [[788,606,30,1,0],[842,616,24,2,1],[896,610,36,7,0],[936,602,20,4,1]]){ctx.save();ctx.translate(bx,by-br*.25);if(fl)ctx.scale(-1,1);drawStone(cl,br*2.6);ctx.restore();}
  ctx.restore();
  /* falling stones (cut from the designer's rock tile, cooled to the passage's blue light) and dust while it comes down */
  ctx.save();for(const p of WB10.rocks){const a=p.land?Math.max(0,1-p.land/1.2):1;ctx.globalAlpha=a;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);drawStone(p.cell,p.s*2.4);ctx.restore();}
ctx.restore();if(WB10.st===1){const a=Math.max(0,.55-WB10.t*.2);for(let i=0;i<5;i++)drawGlow(ctx,ARCH.cx+(i-2)*55,ARCH.y1-30-i%2*40,(90+WB10.t*50)*(1+i%3*.2),'175,185,195',a);}}   /* a soft dust cloud */
/* one stone from the rubble sheet (128px cells), tinted once to match the cool, dim passage */
let STONES_COOL=null;
function drawStone(i,size){const im=IMG.rubble_stones;if(!ready(im))return;if(!STONES_COOL){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
    x.globalCompositeOperation='multiply';x.fillStyle='#6f8796';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-in';x.drawImage(im,0,0);STONES_COOL=c;}
  ctx.drawImage(STONES_COOL,i*128,0,128,128,-size/2,-size/2,size,size);}
