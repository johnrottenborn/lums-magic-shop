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
function wb5Chaser(){WB5.chaser={kind:'demon',scene:'dun',x:425,y:236,face:1,s:1,pack:1,calm:0,a:0,ti:0,
  onWin:()=>{WB5.chaser=null;WB5.respawn=1.2;},onLose:()=>{boHeal();WB5.chaser=null;WB5.respawn=2.5;lum.x=1000;lum.y=600;lum.face=1;resetAmrFollow();}};}
function wb5Brown(){WB5.brown={kind:'bdemon',scene:'dun',x:1215,y:540,face:-1,s:1,pack:1,calm:0,a:0,big:1,
  onWin:()=>{WB5.brown=null;WB5.brownLeft=0;setTimeout(()=>talk([['Amroth',"Keep running!"]]),900);},
  onLose:()=>{boHeal();WB5.brown.calm=3;WB5.brown.x=1215;WB5.brown.y=540;lum.x=640;lum.y=620;lum.face=1;resetAmrFollow();}};WB5.brownLeft=1;}
/* step a roaming demon toward a point, sliding along walls; returns the distance left */
function demonStep(g,tx,ty,sp,dt,ghost){const dx=tx-g.x,dy=ty-g.y,d=Math.hypot(dx,dy);if(d<2){g.mv=0;return d;}const m=Math.min(d,sp*dt),nx=g.x+dx/d*m,ny=g.y+dy/d*m;
  if(ghost||dunFree(nx,ny)){g.x=nx;g.y=ny;}else if(dunFree(nx,g.y))g.x=nx;else if(dunFree(g.x,ny))g.y=ny;else{g.x=nx;g.y=ny;}g.mv=1;if(Math.abs(dx)>3)g.face=dx>0?1:-1;return d-m;}
function updateWorldbind5(dt){
  if(SCENE!=='dun'||DUN.room!==15){WB5.chaser=null;WB5.trail.length=0;if(WB5.brown){WB5.brown=null;}WB5.fall.length=0;return;}
  /* the mountain shakes: a constant tremor with heavier jolts, a low rumble, dust and pebbles from the ceiling */
  WB5.rumT-=dt;if(WB5.rumT<=0){WB5.rumT=rnd(3.5,5.5);WB5.jolt=.6;try{sfxRumble(1.8,.45);}catch(e){}}WB5.jolt=Math.max(0,(WB5.jolt||0)-dt);
  const amp=1.2+WB5.jolt*7;WB5.q=[rnd(-amp,amp),rnd(-amp,amp)*.7];
  if(Math.random()<dt*(WB5.jolt>0?28:9))WB5.fall.push({x:rnd(180,1250),y:rnd(-20,140),vy:rnd(40,90),g:rnd(500,700),ground:rnd(430,760),rock:Math.random()<.35,s:rnd(2,5),t:0,land:0,rot:rnd(0,TAU)});
  for(const p of WB5.fall){if(p.land){p.land+=dt;continue;}p.vy+=p.g*dt*(p.rock?1:.25);p.y+=p.vy*dt;p.rot+=dt*4;if(p.y>=p.ground){p.y=p.ground;p.land=.001;}}
  for(let i=WB5.fall.length-1;i>=0;i--)if(WB5.fall[i].land>(WB5.fall[i].rock?1.6:.5))WB5.fall.splice(i,1);
  /* Lum's path through the room, for the demons to follow down the stairs */
  const tr=WB5.trail,lt=tr[tr.length-1];if(!lt||Math.hypot(lum.x-lt[0],lum.y-lt[1])>14)tr.push([lum.x,lum.y]);
  /* a third of the way in (down the stairs, ~880 long in all): Amroth's warning, then the demons start coming */
  if(!WB5.said&&C2.joined&&!FADE.dir&&!DLG.active&&Math.hypot(lum.x-425,lum.y-230)>=290){WB5.said=1;WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;
    talk([['Amroth',"More demons… we cannot face them all."]],false,()=>{WEVENT.on=false;WB5.respawn=.6;});}
  if(BATTLE.on||BATTLE.pending||WIPE.dir||FADE.dir)return;
  if(WB5.said&&!WB5.chaser){WB5.respawn-=dt;if(WB5.respawn<=0&&!WEVENT.on)wb5Chaser();}
  if(WB5.brownLeft&&!WB5.brown)wb5Brown();
  for(const g of [WB5.chaser,WB5.brown]){if(!g)continue;g.a=Math.min(1,g.a+dt*2);if(g.calm>0){g.calm-=dt;g.mv=0;continue;}if(WEVENT.on||DLG.active){g.mv=0;continue;}
    const d=Math.hypot(lum.x-g.x,lum.y-g.y);
    if(g===WB5.chaser){/* walk Lum's trail; cut straight to her once close */if(d<160)demonStep(g,lum.x,lum.y,118,dt);else{while(g.ti<tr.length-1&&Math.hypot(tr[g.ti][0]-g.x,tr[g.ti][1]-g.y)<10)g.ti++;const p=tr[Math.min(g.ti,tr.length-1)];demonStep(g,p[0],p[1],118,dt,true);}}
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
