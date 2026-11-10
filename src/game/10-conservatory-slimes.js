/* =====================================================================
   SLIMES OF THE CONSERVATORY
   Stand-in combat until the real battle system exists: Cosmic's fizzled
   spell still stings, two stings pop a slime. defeatSlime() is the hook the
   battle system will call instead.
   ===================================================================== */
const WSLIMES=[];let slimeTalk=0;let slimesDone=0,slimesSpawned=false;
const WEVENT={on:false,t:0,stage:0};const QUAKE={t:0,dur:0,amp:0};const WDUST=[];
const GSLIMES=[];let gardenDone=0;
function gardenFree(x,y){const [sx,sy]=solveEstate(x,y);return Math.hypot(sx-x,sy-y)<.5&&!inStream(x,y,-28)&&!inPond(x,y,-36)&&!blockedByRock(x,y);}
function spawnGardenSlimes(){GSLIMES.length=0;const cols=[0,3,1,4,2];
  [[-320,430],[330,400],[-240,880],[420,800],[90,1180]].forEach(([x,y],i)=>{if(!gardenFree(x,y)){for(let k=0;k<40;k++){const nx=x+rnd(-140,140),ny=y+rnd(-120,120);if(gardenFree(nx,ny)){x=nx;y=ny;break;}}}
    GSLIMES.push({scene:'garden',x,y,hx:x,hy:y,s:[.85,.95,.8,1,.9][i],col:SLIME_COL[cols[i]],z:0,vz:0,hop:null,wait:rnd(.5,2),hp:2,hit:0,angry:0,ph:rnd(0,TAU),blink:rnd(1,4),dead:0,face:Math.random()<.5?-1:1});});}
const SLIME_COL=[['190,245,205','96,196,160','40,120,110'],['205,240,190','120,200,130','48,118,84'],['200,235,240','104,180,206','40,96,140'],['232,215,250','172,140,222','92,62,150'],['252,218,228','226,142,172','140,62,100']];
function spawnWellSlimes(){if(slimesSpawned)return;slimesSpawned=true;
  for(const [x,y,s,c] of [[560,692,1,0],[945,665,1.1,1],[600,535,.95,2]])WSLIMES.push({kind:'jelly',x,y,hx:x,hy:y,s,col:SLIME_COL[c],z:0,vz:0,hop:null,wait:rnd(.5,2),hp:2,hit:0,angry:0,ph:rnd(0,TAU),blink:rnd(1,4),dead:0,face:Math.random()<.5?-1:1});}
function slimeHopTo(g,tx,ty,free=wellFree){for(let k=0;k<8;k++){const x=k?g.x+rnd(-70,70):tx,y=k?g.y+rnd(-40,40):ty;if(free(x,y)&&Math.hypot(x-g.hx,y-g.hy)<220){g.hop={x0:g.x,y0:g.y,x1:x,y1:y,t:0,d:.55};g.face=x>g.x?1:-1;return;}}}
function updateWellSlimes(dt){updateSlimeList(WSLIMES,dt,wellFree);
  lum.bumpT=Math.max(0,(lum.bumpT||0)-dt);WELL_REST(dt);}
function updateSlimeList(LST,dt,free){
  for(let i=LST.length-1;i>=0;i--){const g=LST[i];g.ph+=dt;g.hit=Math.max(0,g.hit-dt);g.angry=Math.max(0,g.angry-dt);g.blink-=dt;if(g.blink<-.12)g.blink=rnd(1.5,4.5);
    if(g.dead){g.dead+=dt;if(g.dead>.6)LST.splice(i,1);continue;}
    if(BATTLE.pending||BATTLE.on)continue;g.calm=Math.max(0,(g.calm||0)-dt);g.alert=Math.max(0,(g.alert||0)-dt);
    if(!g.angry&&!g.calm&&!WEVENT.on&&PLAYER()&&!INTRO.on&&!DLG.active&&Math.hypot(g.x-lum.x,g.y-lum.y)<190){g.angry=6;g.alert=.9;g.wait=Math.min(g.wait,.5);sfxSlimeHop(.6);}
    if(g.hop){const h=g.hop;h.t+=dt/h.d;const u=Math.min(1,h.t);g.x=h.x0+(h.x1-h.x0)*u;g.y=h.y0+(h.y1-h.y0)*u;g.z=Math.sin(Math.PI*u)*(h.kb?16:26);
      if(u>=1){g.hop=null;g.z=0;g.land=.25;g.wait=g.angry?rnd(.25,.6):rnd(.9,2.4);if(Math.hypot(g.x-lum.x,g.y-lum.y)<500)sfxSlimeHop(g.s);}}
    else{g.land=Math.max(0,(g.land||0)-dt);g.wait-=dt;if(g.wait<=0&&!WEVENT.on&&!MENU.open){
      if(g.angry){const a=Math.atan2(lum.y-g.y,lum.x-g.x);slimeHopTo(g,g.x+Math.cos(a)*60,g.y+Math.sin(a)*40,free);}
      else slimeHopTo(g,g.x+rnd(-70,70),g.y+rnd(-40,40),free);}}
    // bumping into Cosmic
    if(!g.dead&&Math.hypot((g.x-lum.x),(g.y-lum.y)*1.8)<44*g.s&&lum.bumpT<=0&&!g.calm&&!WEVENT.on&&!MENU.open&&!DLG.active&&PLAYER()&&!INTRO.on)startEncounter(g,'ambush');}}
function WELL_REST(dt){
  for(let i=WDUST.length-1;i>=0;i--){const d=WDUST[i];d.vy+=dt*(d.rock?600:40);d.y+=d.vy*dt;d.x+=Math.sin(T*3+d.ph)*8*dt;d.life+=dt;if(d.y>d.floor||d.life>4)WDUST.splice(i,1);}
  if(QUAKE.t<QUAKE.dur){QUAKE.t+=dt;if(Math.random()<dt*28)WDUST.push({x:rnd(150,1250),y:rnd(60,240),vy:rnd(10,40),ph:rnd(0,TAU),rock:Math.random()<.25,s:rnd(1.5,4),floor:rnd(520,760),life:0});}
  if(WEVENT.on){WEVENT.t+=dt;
    if(WEVENT.stage===0&&WEVENT.t>1.1){WEVENT.stage=1;WEVENT.t=0;QUAKE.t=0;QUAKE.dur=3.2;QUAKE.amp=9;sfxRumble();}
    if(WEVENT.stage===1&&WEVENT.t>2.6){WEVENT.stage=2;WEVENT.t=0;sfxEerie();
      talk([['???',"Bravo, young one. You're much stronger than you know…"]],false,()=>{WEVENT.stage=3;WEVENT.t=0;
        setTimeout(()=>talk([['Cosmic',"W-who said that?!"],['Cosmic',"…Master Lum? Is that you? This isn't funny!"]],false,()=>{WEVENT.on=false;GOAL.tag='NEW TASK';GOAL.text='Find the voice in the dark';HINT.goalT=0;}),700);});}}}
function hitSlimes(hx,hy){for(const g of (SCENE==='garden'?SLUGS:roomSlimes())){if(g.dead||g.calm>0)continue;if(Math.hypot(g.x-hx,(g.y-hy)*1.6)<110){startEncounter(g,'first');return true;}}return false;}
function hitSlimesOld(hx,hy){let any=false;for(const g of WSLIMES){if(g.dead)continue;if(Math.hypot(g.x-hx,(g.y-hy)*1.6)<95){any=true;g.hp--;g.hit=.35;g.angry=4;const a=Math.atan2(g.y-lum.y,g.x-lum.x);
  const kx=g.x+Math.cos(a)*70,ky=g.y+Math.sin(a)*40;g.hop={x0:g.x,y0:g.y,x1:wellFree(kx,ky)?kx:g.x,y1:wellFree(kx,ky)?ky:g.y,t:0,d:.4,kb:1};
  for(let i=0;i<8;i++)PARTS.push({type:'fiz',x:g.x,y:g.y,z:24,vx:rnd(-80,80),vy:rnd(-30,30),vz:rnd(40,140),life:0,max:rnd(.4,.8),s:rnd(1.5,3)});
  if(g.hp<=0)defeatSlime(g);else{sfxSlimeHit(1);if(!lum.saidSting){lum.saidSting=1;setTimeout(()=>playerQuip("Ha! Even my fizzles sting!"),500);}}}}return any;}
function defeatSlime(g){if(g.dead)return;g.dead=.001;g.hop=null;sfxSlimePop();slimesDone++;
  for(let i=0;i<22;i++)PARTS.push({type:'goo',x:g.x,y:g.y,z:20,vx:rnd(-120,120),vy:rnd(-50,50),vz:rnd(60,240),life:0,max:rnd(.6,1.1),s:rnd(3,7)*g.s,col:g.col[1]});
  for(let i=0;i<10;i++)PARTS.push({type:'fiz',x:g.x,y:g.y,z:30,vx:rnd(-60,60),vy:rnd(-20,20),vz:rnd(80,200),life:0,max:rnd(.6,1.2),s:rnd(2,3.5)});
  GOAL.tag=slimesDone>=3?'ALL SLIMES DEFEATED':'SLIMES DEFEATED';GOAL.text=`${slimesDone} of 3`;HINT.goalT=0;
  if(slimesDone>=3){WEVENT.on=true;WEVENT.t=0;WEVENT.stage=0;}}
/* the shimmer slime: a drifting jelly whose tentacles sway, drawn in thin strips */
function drawJellySprite(im,x,y,w,h,t,flash,alpha){if(!ready(im))return;const N=40,iw=im.naturalWidth,ih=im.naturalHeight;ctx.save();ctx.globalAlpha=alpha;if(flash>0)ctx.filter='brightness(2.2)';
  for(let j=0;j<N;j++){const f=j/N,sw=1+.05*Math.sin(t*1.7)*(1-f)-.02*Math.sin(t*1.7)*f,off=Math.sin(t*2.1-f*5.5)*w*.045*Math.pow(f,1.4);
    ctx.drawImage(im,0,f*ih,iw,ih/N+1,x-w*sw/2+off,y-h+f*h,w*sw,h/N+.8);}
  ctx.filter='none';ctx.restore();}
function drawJelly(g,k){const s=g.s*k,w=145*s,im=IMG.jelly_idle,h=w*(ready(im)?im.naturalHeight/im.naturalWidth:.7);const hov=(16+Math.sin(g.ph*1.6)*5)*s+(g.z||0)*k,dying=g.dead?Math.min(1,g.dead/.4):0;
  ctx.fillStyle=`rgba(20,40,50,${(.22-.1*Math.min(1,hov/40)).toFixed(3)})`;ctx.beginPath();ctx.ellipse(g.x,g.y+2,w*.3,w*.07,0,0,TAU);ctx.fill();
  drawGlow(ctx,g.x,g.y-hov-h*.55,w*.75,'170,230,255',.3+.08*Math.sin(g.ph*2));
  drawJellySprite(im,g.x,g.y-hov,w*(1+dying*.4),h*(1-dying*.3),g.ph,g.hit||0,1-dying);
  if(g.alert>0){const a=Math.min(1,g.alert*4);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='700 30px "Alegreya SC", Georgia, serif';ctx.lineWidth=4;ctx.strokeStyle='#3a2a1a';ctx.fillStyle='#ffe27a';const yy=g.y-hov-h-10-(1-a)*8;ctx.strokeText('!',g.x,yy);ctx.fillText('!',g.x,yy);ctx.restore();}}
function drawWellSlime(g,kO){if(CAPTURE.on&&g===BATTLE.capG)return;if(g.kind==='jelly'||g.type==='jelly'){drawJelly(g,kO??wellH(g.y)/151);return;}const k=kO??wellH(g.y)/151,s=g.s*k;const r=34*s;
  const dying=g.dead?Math.min(1,g.dead/.25):0;
  // squash & stretch: wobble at rest, stretch in the air, splat on landing, swell when popping
  let sx=1+.05*Math.sin(g.ph*3.2),sy=1-.05*Math.sin(g.ph*3.2);
  if(g.hop){const u=g.hop.t;sy=u<.15?.8:1.15-.15*u;sx=2-sy;}if(g.land>0){const q=g.land/.25;sy=1-.22*q;sx=1+.25*q;}
  if(g.hit>0){const q=g.hit/.35;sx+=.18*q*Math.sin(q*20);sy-=.12*q;}
  if(dying){sx*=1+dying*.5;sy*=1-dying*.4;}
  const x=g.x,y=g.y,z=g.z*k,[cL,cM,cD]=g.col;
  ctx.save();ctx.globalAlpha=1-(g.dead?Math.min(1,g.dead/.35):0);
  ctx.fillStyle=`rgba(20,40,40,${(.32-.15*Math.min(1,z/26)).toFixed(3)})`;ctx.beginPath();ctx.ellipse(x,y+2,r*1.05*sx,r*.3,0,0,TAU);ctx.fill();
  drawGlow(ctx,x,y-z-r*.4,r*2.2,cL,.28+.08*Math.sin(g.ph*2));
  ctx.globalAlpha*=1;ctx.translate(x,y-z);ctx.scale(sx,sy);
  const body=()=>{ctx.beginPath();ctx.moveTo(-r*1.05,0);ctx.bezierCurveTo(-r*1.15,-r*.55,-r*.7,-r*1.35,-r*.05,-r*1.38);ctx.bezierCurveTo(r*.25,-r*1.62,r*.35,-r*1.3,r*.2,-r*1.38);
    ctx.bezierCurveTo(r*.85,-r*1.25,r*1.15,-r*.55,r*1.05,0);ctx.quadraticCurveTo(0,r*.22,-r*1.05,0);ctx.closePath();};
  const gr=ctx.createRadialGradient(-r*.3,-r*1,r*.1,0,-r*.5,r*1.4);gr.addColorStop(0,`rgba(${cL},.95)`);gr.addColorStop(.55,`rgba(${cM},.88)`);gr.addColorStop(1,`rgba(${cD},.92)`);
  body();ctx.fillStyle=gr;ctx.fill();
  ctx.save();body();ctx.clip();
  ctx.fillStyle=`rgba(${cD},.35)`;ctx.beginPath();ctx.ellipse(0,r*.05,r*1.1,r*.32,0,0,TAU);ctx.fill();
  for(let i=0;i<5;i++){const bx=Math.sin(i*2.1+g.ph*.4)*r*.6,by=-r*.25-((g.ph*6*(.5+i*.15)+i*20)%(r*1.1));ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(bx,by,1.5+i%3,0,TAU);ctx.stroke();}
  // a nibbled magic leaf, still glowing inside its tummy
  ctx.save();ctx.translate(r*.35,-r*.42);ctx.rotate(.6+Math.sin(g.ph)*.15);ctx.fillStyle='rgba(120,90,190,.5)';ctx.beginPath();ctx.ellipse(0,0,r*.2,r*.09,0,0,TAU);ctx.fill();ctx.restore();
  ctx.restore();
  body();ctx.strokeStyle=`rgba(${cD},.85)`;ctx.lineWidth=1.8;ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.ellipse(-r*.5,-r*.95,r*.2,r*.1,-.7,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(-r*.22,-r*1.12,r*.05,0,TAU);ctx.fill();
  if(g.hit>0){ctx.globalAlpha*=g.hit/.35*.7;body();ctx.fillStyle='#fff';ctx.fill();ctx.globalAlpha=1;}
  // face
  ctx.scale(g.face,1);const ex=r*.32,ey=-r*.62,blink=g.blink<0;
  for(const s_ of [-1,1]){ctx.fillStyle='#1d2b33';ctx.beginPath();if(blink||dying)ctx.ellipse(ex*s_+r*.1,ey,r*.11,r*.025,0,0,TAU);else ctx.ellipse(ex*s_+r*.1,ey,r*.1,r*.15,0,0,TAU);ctx.fill();
    if(!blink&&!dying){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex*s_+r*.13,ey-r*.06,r*.04,0,TAU);ctx.fill();}
    if(g.angry>0){ctx.strokeStyle='#1d2b33';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ex*s_+r*.1-s_*r*.13,ey-r*.25);ctx.lineTo(ex*s_+r*.1+s_*r*.05,ey-r*.17);ctx.stroke();}}
  ctx.strokeStyle='#1d2b33';ctx.lineWidth=1.6;ctx.beginPath();if(g.angry>0)ctx.arc(r*.1,ey+r*.32,r*.09,Math.PI*1.15,Math.PI*1.85);else ctx.arc(r*.1,ey+r*.2,r*.08,.2,Math.PI-.2);ctx.stroke();
  if(!g.angry){ctx.fillStyle='rgba(255,140,170,.35)';for(const s_ of [-1,1]){ctx.beginPath();ctx.ellipse(ex*s_*1.45+r*.1,ey+r*.15,r*.09,r*.05,0,0,TAU);ctx.fill();}}
  ctx.restore();
  if(g.alert>0){const a=Math.min(1,g.alert*4);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='700 30px "Alegreya SC", Georgia, serif';ctx.lineWidth=4;ctx.strokeStyle='#3a2a1a';ctx.fillStyle='#ffe27a';const yy=y-z-r*1.9-(1-a)*8;ctx.strokeText('!',x,yy);ctx.fillText('!',x,yy);ctx.restore();}}
function drawWellDust(){for(const d of WDUST){const a=Math.min(1,d.life*3)*(d.rock?.9:.5);if(d.rock){ctx.fillStyle=`rgba(110,104,96,${a})`;ctx.beginPath();ctx.ellipse(d.x,d.y,d.s,d.s*.8,0,0,TAU);ctx.fill();}else drawGlow(ctx,d.x,d.y,d.s*3,'210,200,180',a*.5);}}
function drawGooPart(p){const q=p.life/p.max;ctx.fillStyle=`rgba(${p.col},${(.85*(1-q*q)).toFixed(3)})`;ctx.beginPath();ctx.arc(p.x,p.y-p.z,p.s*(1-q*.4),0,TAU);ctx.fill();ctx.fillStyle=`rgba(255,255,255,${(.6*(1-q)).toFixed(3)})`;ctx.beginPath();ctx.arc(p.x-p.s*.3,p.y-p.z-p.s*.3,p.s*.25,0,TAU);ctx.fill();}
function drawEerie(text,t){const n=Math.min(text.length,Math.floor(t*22));ctx.save();ctx.textAlign='center';ctx.font='italic 20px Alegreya, Georgia, serif';
  const words=wrapText(ctx,text,Math.min(320,W-50));const y0=H*.24;
  ctx.fillStyle=`rgba(20,8,36,${Math.min(.55,t*.8).toFixed(3)})`;ctx.fillRect(0,y0-46,W,words.length*28+70);
  let c=0;words.forEach((l,li)=>{const w=ctx.measureText(l).width;let x=W/2-w/2;for(const ch of l){const show=c<n;c++;const cw=ctx.measureText(ch).width;if(show){const age=(n-c)/22;ctx.globalAlpha=Math.min(1,age*3+.2);const dy=Math.sin(T*3+c*.6)*2;
    ctx.shadowColor='rgba(190,140,255,.9)';ctx.shadowBlur=14;ctx.fillStyle='#efe2ff';ctx.textAlign='left';ctx.fillText(ch,x,y0+li*28+dy);}x+=cw;}c++;});
  ctx.restore();}
/* sounds */
function sfxSlimeHop(s=1){if(!SND.ready)return;const t=SND.ctx.currentTime;pluck(t,NOTE(50-s*4+Math.random()*3),.05,.18,SND.sfx,0,.2);noiseHit(t,.08,'lowpass',500,1,.05,SND.sfx);}
function sfxSlimeHit(v=1){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.18,'bandpass',600,2,.16*v,SND.sfx,200);pluck(t,NOTE(55),.12*v,.3,SND.sfx,0,.25);pluck(t+.06,NOTE(48),.1*v,.3,SND.sfx,0,.25);}
function sfxSlimePop(){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.25,'bandpass',900,1.5,.25,SND.sfx,2400);pluck(t,NOTE(67),.15,.2,SND.sfx,0,.5);[84,88,91].forEach((n,i)=>bell(t+.1+i*.06,NOTE(n),.05,.9,SND.sfx,(i-1)*.3));}
function sfxRumble(){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,3.2,'lowpass',140,.7,.55,SND.sfx,60);noiseHit(t+.3,2.2,'lowpass',260,.8,.25,SND.sfx,90);for(let i=0;i<6;i++)noiseHit(t+.2+i*.45+Math.random()*.2,.4,'lowpass',120,1,.3,SND.sfx);}
function sfxEerie(){if(!SND.ready)return;const c=SND.ctx,t=c.currentTime;for(const [f,p] of [[73.4,-.4],[74.2,.4],[110,0],[146.8,.2]]){const o=c.createOscillator(),g=c.createGain(),pn=panNode(p);o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f*.97,t+4.5);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07,t+1.2);g.gain.linearRampToValueAtTime(0,t+5);o.connect(g);g.connect(pn);pn.connect(SND.sfxVerb||SND.sfx);o.start(t);o.stop(t+5.1);}
  noiseHit(t+.2,3.5,'bandpass',1400,6,.07,SND.sfxVerb||SND.sfx,500);[79,78,74].forEach((n,i)=>bell(t+.5+i*.9,NOTE(n),.025,3,SND.sfxVerb||SND.sfx,(i-1)*.5));}

