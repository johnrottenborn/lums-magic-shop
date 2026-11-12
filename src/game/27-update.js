/* ---------- update ---------- */
let T=0;const cam={x:0,y:0};
function blockedByRock(x,y){const c0=Math.floor(x/BIG),r0=Math.floor(y/BIG);
  for(let cy=r0-1;cy<=r0+1;cy++)for(let cx=c0-1;cx<=c0+1;cx++){const o=objAt(cx,cy);if(!o||o.kind!=='rock')continue;const im=IMG[o.img];const rw=(ready(im)?im.naturalWidth:150)*o.s*.36,rh=rw*.42;
    const dx=(x-o.x)/rw,dy=(y-(o.y-4))/rh,d=Math.hypot(dx,dy);if(d<1&&d>0)return {o,dx,dy,d,rw,rh};}
  return null;}
function update(dt){
  T+=dt;if(PC==='cosmic'){const want=PARTY[HERO].main==='blade'?COS_BLADE:COS_ANIM;if(ANIM!==want){ANIM=want;lum.ft=0;lum.fi=0;if(!ANIM[lum.state])lum.state='idle';}}
  const [ix,iy,im]=inputVec();
  lum.cool=Math.max(0,lum.cool-dt);lum.bubble=Math.max(0,lum.bubble-dt);battleFlash=Math.max(0,battleFlash-dt*1.5);
  lum.wet=SCENE==='garden'&&inStream(lum.x,lum.y,4)&&!inPond(lum.x,lum.y,-4);
  const maxS=RUN_SPEED*(lum.wet?.62:1)*(SCENE==='woods'||SCENE==='thorn'?.82:SCENE==='thgate'?.32*Math.min(H*.25,W*.525)*1000/(143*.62*W):SCENE!=='garden'?roomH(lum.y)/175:1);
  const tvx=busy()?0:ix*maxS*im,tvy=busy()?0:iy*maxS*im,driving=im>0&&!busy();
  const kk=1-Math.exp(-dt*(driving?ACCEL:DECEL));lum.vx+=(tvx-lum.vx)*kk;lum.vy+=(tvy-lum.vy)*kk;
  let spd=Math.hypot(lum.vx,lum.vy);if(!driving&&spd<6){lum.vx=lum.vy=0;spd=0;}
  const wat=(x,y)=>inPond(x,y,-12);
  {const tx=lum.vx*dt,ty=lum.vy*dt,steps=Math.max(1,Math.ceil(Math.hypot(tx,ty)/3));
   for(let k=0;k<steps;k++){let nx=lum.x+tx/steps,ny=lum.y+ty/steps;
    if(SCENE==='well'){[nx,ny]=solveWell(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='study'){[nx,ny]=solveStudy(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='woods'){[nx,ny]=solveWoods(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='shed'){[nx,ny]=solveShed(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='pond'){[nx,ny]=solvePond(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='shop'){[nx,ny]=solveShop(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='bed'){[nx,ny]=solveBed(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='vhut'){[nx,ny]=solveVHut(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='dun'){[nx,ny]=solveDun(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='thorn'){[nx,ny]=solveThorn(lum.x,lum.y,nx,ny);lum.x=nx;lum.y=ny;continue;}if(SCENE==='thgate'){lum.x=clamp(nx,20,1000);lum.y=600;continue;}
    [nx,ny]=solveEstate(nx,ny);
    if(wat(nx,ny)){if(!wat(lum.x,ny))nx=lum.x;else if(!wat(nx,lum.y))ny=lum.y;else{nx=lum.x;ny=lum.y;}}
    if(!inMap(nx,ny)){if(inMap(lum.x,ny))nx=lum.x;else if(inMap(nx,lum.y))ny=lum.y;else{nx=lum.x;ny=lum.y;}}
    lum.x=nx;lum.y=ny;}}
  {const behind=false;HOUSE.fade=(HOUSE.fade??1)+((OCC|=behind,behind?1:1)-(HOUSE.fade??1))*Math.min(1,dt*8);}
  if(driving){lum.aimx=ix;lum.aimy=iy;if(Math.abs(ix)>.28&&Math.sign(ix)!==lum.face)lum.face=Math.sign(ix);}
  if(lum.state==='cast'&&PC==='cosmic'){
    lum.at+=dt;const at=lum.at;lum.fi=at<.25?0:at<.55?1:at<.9?2:3;
    if(at>=.55&&!lum.fizzed){lum.fizzed=1;const hx_=lum.x+lum.face*44,hy_=lum.y;for(let i=0;i<16;i++)PARTS.push({type:'fiz',x:hx_,y:hy_,z:72,vx:lum.face*rnd(10,80),vy:rnd(-30,30),vz:rnd(-10,100),life:0,max:rnd(.4,.9),s:rnd(1.5,3)});
      PARTS.push({type:'puff',x:hx_,y:hy_,z:72,vx:0,vy:0,vz:12,life:0,max:.9,s:10});sfxFizzle(true);casts++;hitSlimes(hx_,hy_);
      if(!BATTLE.pending)for(const g of SLUGS)if(Math.hypot(g.x-hx_,g.y-hy_)<160){g.flee=2.5;g.shy=0;g.state='crawl';const a=Math.atan2(g.y-hy_,g.x-hx_);g.tx=g.x+Math.cos(a)*150;g.ty=g.y+Math.sin(a)*100;}}
    if(at>=.9&&!lum.quipped){lum.quipped=1;if(Math.random()<.6)playerQuip(['…aw.','Almost!','One day…','Fizzle again.','I felt something that time!','Come on, come on…'][(Math.random()*6)|0]);}
    if(at>=1.4){lum.state='idle';lum.ft=0;}
  }else if(lum.state==='cast'&&CH>0){
    lum.at+=dt;const at=lum.at;lum.fi=at<.22?0:1;
    if(at>=.22&&!lum.fizzed){lum.fizzed=1;const hx_=lum.x+lum.face*44*LUMK,hy_=lum.y;for(let i=0;i<26;i++)PARTS.push({type:'fiz',col:'255,214,110',x:hx_,y:hy_,z:84*LUMK,vx:lum.face*rnd(20,120),vy:rnd(-40,40),vz:rnd(-10,110),life:0,max:rnd(.4,.9),s:rnd(1.5,3.2)});for(let i=0;i<16;i++)PARTS.push({type:'fiz',col:'255,214,110',star:1,rot:rnd(0,TAU),x:hx_,y:hy_,z:84*LUMK,vx:lum.face*rnd(60,190),vy:rnd(-50,50),vz:rnd(40,170),life:0,max:rnd(.6,1),s:rnd(4.5,7)});PARTS.push({type:'puff',x:hx_,y:hy_,z:84*LUMK,vx:0,vy:0,vz:12,life:0,max:.9,s:12});sfxFizzle(true);hitSlimes(hx_,hy_);}
    if(at>=.75){lum.state='idle';lum.ft=0;}
  }else if(lum.state==='cast'){
    lum.at+=dt;lum.fi=lum.at<CAST_T[0]?0:1;
    const s0=CAST_T[0];if(lum.at>s0&&lum.at<s0+SPRAY_T){if(lum.at-dt<=s0){shake=2;sfxSplash();}const k=1-(lum.at-s0)/SPRAY_T;lum.sprayAcc+=dt*420*(.35+.65*k);const n=lum.sprayAcc|0;lum.sprayAcc-=n;if(n)emitSpray(n);}
    if(lum.at>=CAST_T[1]){lum.state='idle';lum.ft=0;}
  }else if(lum.state==='interact'){
    lum.at+=dt;lum.fi=0;if(lum.at>=INTERACT_T){lum.state='idle';lum.ft=0;}
  }else if(driving||spd>45){
    // hysteresis: switch to the back run past 30° upward, back to the side run only below 18°
    const dy=driving?iy:lum.vy/(spd||1);let st=lum.state==='walkUp'?(dy<-.3?'walkUp':'walk'):(dy<-.5?'walkUp':'walk');if(ANIM.walkDown&&st==='walk'&&(lum.state==='walkDown'?dy>.3:dy>.5))st='walkDown';
    if(lum.state!==st){const prog=(lum.state==='walk'||lum.state==='walkUp'||lum.state==='walkDown')?(lum.ft%ANIM[lum.state].frames.length)/ANIM[lum.state].frames.length:0;lum.state=st;lum.ft=prog*ANIM[st].frames.length;}
    const A_=ANIM[st],nF=A_.frames.length;
    lum.ft+=dt*A_.fps*(spd/RUN_SPEED)*(lum.wet?1.25:1);const f=Math.floor(lum.ft)%nF;
    const contact=f===0||f===Math.floor(nF/2);
    if(contact&&lum.stepF!==f){lum.plant=1;STATS.steps++;if(lum.wet)sfxWade();else sfxStep(SCENE!=='garden'&&SCENE!=='woods'&&SCENE!=='thorn'||(SCENE==='garden'&&onPath(lum.x,lum.y,-4)));
      if(lum.wet){PARTS.push({type:'ring',x:lum.x,y:lum.y,z:0,life:0,max:.8,s:.45});puff(lum.x-lum.face*8,lum.y,6,'drop',{sp:60,vz:150,z:4,life:.6,size:2});}
      else puff(lum.x-lum.face*10,lum.y,3,'dust',{sp:22,life:.55,size:7});}
    lum.stepF=f;lum.fi=f;
  }else if(lum.state==='walkUp'||lum.state==='idleUp'){
    if(lum.state==='walkUp'){lum.state='idleUp';lum.at=0;}lum.at+=dt;lum.fi=0;if(lum.at>.9){lum.state='idle';lum.ft=0;}
  }else{if(lum.state!=='idle'){lum.state='idle';lum.ft=0;lum.blinkT=Math.min(lum.blinkT,rnd(.6,1.6));}
    lum.ft+=dt*ANIM.idle.fps;lum.fi=Math.floor(lum.ft)%ANIM.idle.frames.length;
    lum.blinkT-=dt;if(lum.blinkT<=0){lum.blink=.12;lum.blinkT=Math.random()<.2?.28:rnd(2.2,5.5);}}
  lum.blink=Math.max(0,lum.blink-dt);lum.plant=Math.max(0,(lum.plant||0)-dt*5);wellMagic=Math.max(0,wellMagic-dt);
  if(Math.random()<dt*9)PARTS.push({type:'msmoke',x:CHIM.x+rnd(-12,12),y:CHIM.y,z:0,vx:0,vy:-rnd(24,34),vz:0,life:0,max:rnd(4.5,6.5),s:rnd(7,10),seed:rnd(0,TAU)});
  if(Math.random()<dt*1.6)PARTS.push({type:'mstar',x:CHIM.x+rnd(-30,30),y:CHIM.y-rnd(10,60),z:0,vx:rnd(-6,6),vy:-rnd(12,22),vz:0,life:0,max:rnd(2,3.5),s:rnd(2.5,4.5)});
  for(const [px,py] of [[480,266],[536,330],[1125,312]])if(Math.random()<dt*.9)PARTS.push({type:'smoke',x:hx(px)+rnd(-4,4),y:hy(py),z:0,vx:rnd(-3,3),vy:-rnd(12,18),vz:0,life:0,max:rnd(3,4.5),s:rnd(4,6)});
  if(!cos.hidden&&!(INTRO.on&&INTRO.cosHere))updateCosmic(dt);lum.quipT=Math.max(0,(lum.quipT||0)-dt);TOAST.t+=dt;if(SCENE==='garden'&&NIGHT.on&&!NIGHT.cut&&!NIGHT.nudged&&!DLG.active&&!WEVENT.on&&!FADE.dir&&!MENU.open&&!CHOICE.on){NIGHT.outT=(NIGHT.outT||0)+dt;if(NIGHT.outT>45){NIGHT.nudged=1;sfxEerie();talk([['???',"Hurry! Wield my blade and slice through the overgrown path…"]]);}}if(SCENE==='woods'){if(CH===1){updateWoodsC1();updateWFoes(dt);}else{updateWoods(dt);updateSkels(dt);updateFokalur(dt);}}if(SCENE==='dun')updateDFoes(dt);autosave(dt);updateStorm(dt);NIGHT.slash=Math.max(0,(NIGHT.slash||0)-dt*2);{const ok=!DLG.active&&!MENU.open&&!INTRO.on&&!FADE.dir&&!BATTLE.pending&&!WEVENT.on;const n=ok?nearInteract():null;if(n)NEAR=n;nearA=clamp(nearA+(n?dt*6:-dt*6),0,1);if(!n&&nearA<=0)NEAR=null;}TUT.t+=dt;updateHints(dt);updateSlugs(dt);if(SCENE==='garden'){updateSlimeList(GSLIMES,dt,gardenFree);lum.bumpT=Math.max(0,(lum.bumpT||0)-dt);}updateFairies(dt);updateWisps(dt);if(SCENE==='garden')updateGusts(dt);updateBirds(dt);updateFish(dt);
  if(!EST_COBBLE&&ready(IMG.cobble_strip)&&estR)buildEstateGround(estR);
  if(DLG.active){DLG.t+=dt;const L=DLG.lines[DLG.i][1].length;if(DLG.t>3.4+L*.04)dlgNext();}
  {const rate=wellMagic>0?30:1.6;let n=dt*rate;while(n>0){if(Math.random()<n)PARTS.push({type:'wsp',x:WELL.x+rnd(-26,26),y:WELL.y-WELL_TOP+rnd(-4,6),z:0,vx:rnd(-8,8),vy:-rnd(14,wellMagic>0?60:26),vz:0,life:0,max:rnd(1.4,2.6),s:wellMagic>0?rnd(2,3.6):rnd(1.2,2.2)});n-=1;}}
  for(const b of BUGS){b.ph+=dt;if(Math.hypot(b.tx-b.x,b.ty-b.y)<14||Math.random()<dt*.2){b.tx=b.hx+rnd(-160,160);b.ty=b.hy+rnd(-110,110);}
    const d=Math.hypot(lum.x-b.x,lum.y-b.y),fl=d<70?2:1,a=Math.atan2(b.ty-b.y,b.tx-b.x);b.x+=Math.cos(a)*42*fl*dt+Math.sin(T*3+b.ph)*10*dt;b.y+=Math.sin(a)*34*fl*dt;b.z=34+Math.sin(T*2+b.ph)*10;}
  if(lum.wet&&Math.random()<dt*1.5)PARTS.push({type:'ring',x:lum.x+rnd(-8,8),y:lum.y+rnd(-3,3),z:0,life:0,max:1.1,s:.35});
  for(let i=PUDDLES.length-1;i>=0;i--){PUDDLES[i].t+=dt;if(PUDDLES[i].t>3.5)PUDDLES.splice(i,1);}
  for(let i=PARTS.length-1;i>=0;i--){const p=PARTS[i];p.life+=dt;if(p.life>p.max){PARTS.splice(i,1);continue;}
    switch(p.type){
      case 'spray':p.vx*=1-1.1*dt;p.vy*=1-1.1*dt;p.vz-=640*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
        if(p.z<=0){landSpray(p);PARTS.splice(i,1);}break;
      case 'mist':p.vx*=1-3.2*dt;p.vy*=1-3.2*dt;p.vz-=30*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z=Math.max(4,p.z+p.vz*dt);p.s+=dt*26;break;
      case 'glint':p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;break;
      case 'msmoke':p.x+=(Math.sin(T*1.1+p.seed+p.life*1.4)*16+wind(T,p.x,p.y)*10)*dt;p.y+=p.vy*dt;p.s+=dt*3.2;break;
      case 'mstar':p.x+=p.vx*dt+Math.sin(T*2+p.life*3)*6*dt;p.y+=p.vy*dt;break;
      case 'fiz':p.vz-=300*dt;p.z+=p.vz*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.z<=0)p.life=p.max;break;
      case 'puff':p.z+=p.vz*dt;p.s+=dt*14;break;
      case 'fdust':p.x+=p.vx*dt;p.y+=p.vy*dt;p.z=Math.max(0,p.z+p.vz*dt);break;
      case 'gpetal':{const w_=wind(T,p.x,p.y);p.x+=(p.vx+w_*40)*dt;p.y+=(p.vy+Math.sin(T*2+p.rot)*14)*dt;p.z=Math.max(4,p.z+Math.sin(T*3+p.rot*2)*18*dt-4*dt);p.rot+=p.vr*dt;if(p.x>cam.x+W/zoom/2+60)p.life=p.max;break;}
      case 'bpetal':if(p.z>0){p.z=Math.max(0,p.z+p.vz*dt);p.y+=(p.leaf&&p.vy?p.vy:0)*dt;p.x+=(p.vx+wind(T,p.x,p.y)*16+Math.sin(T*2.2+p.rot)*10)*dt;p.rot+=p.vr*dt;}else if(p.life<p.max-3)p.life=p.max-3;break;
      case 'sdrip':if(p.z>0){p.vz-=200*dt;p.z=Math.max(0,p.z+p.vz*dt);}else if(p.life<p.max-1.2)p.life=p.max-1.2;break;
      case 'smoke':p.x+=(p.vx+wind(T,p.x,p.y)*14)*dt;p.y+=p.vy*dt;p.s+=dt*5.5;p.vx+=Math.sin(T+p.life*2)*3*dt;break;
      case 'wsp':p.x+=p.vx*dt+Math.sin(T*3+p.life*5)*6*dt;p.y+=p.vy*dt;break;
      case 'dust':p.x+=p.vx*dt*.5;p.y+=p.vy*dt*.4;p.s+=dt*10;break;
      case 'goo':if(p.z>0||p.vz>0){p.vz-=620*dt;p.z=Math.max(0,p.z+p.vz*dt);p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.z<=0){p.vz=0;p.vx=p.vy=0;}}break;
      case 'drop':p.vz-=520*dt;p.z+=p.vz*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.z<=0)p.life=p.max;break;
    }}
  for(const m of MOTES){m.ph+=dt*m.sp;m.x+=Math.sin(m.ph*.7)*12*dt+wind(T,m.x,m.y)*6*dt;m.y+=Math.cos(m.ph*.5)*8*dt-4*dt;
    const vw=W/zoom/2+80,vh=H/zoom/2+120;if(m.x<cam.x-vw)m.x+=vw*2;if(m.x>cam.x+vw)m.x-=vw*2;if(m.y<cam.y-vh)m.y+=vh*2;if(m.y>cam.y+vh)m.y-=vh*2;}
  for(const k in BTN){BTN[k].pulse=Math.max(0,BTN[k].pulse-dt*4);BTN[k].shake=Math.max(0,BTN[k].shake-dt);}
  shake=Math.max(0,shake-dt*30);
  if(SCENE==='thorn'){updateThorn(dt);}else
  if(SCENE==='woods'){const k=Math.min(1,dt*4.5);cam.x+=(lum.x+60-cam.x)*k;cam.y+=(lum.y-(WEV.foka?250:50)-cam.y)*k;const vw=W/zoom,vh=H/zoom;cam.x=clamp(cam.x,vw/2,WOODS_W-vw/2);cam.y=clamp(cam.y,WTOP+vh/2,WOODS_H-vh/2);WTITLE.t+=dt;}else
  if(SCENE!=='garden'){const rz=roomView()[0],vw=W/rz;WCAM.x+=(lum.x-WCAM.x)*Math.min(1,dt*4);WCAM.x=SCENE==='shed'?(vw>=690?SHO+345:clamp(WCAM.x,SHO+vw/2,SHO+690-vw/2)):SCENE==='vhut'?(vw>=VHW?VHW/2:clamp(WCAM.x,vw/2,VHW-vw/2)):vw>=1375?687:clamp(WCAM.x,vw/2,1375-vw/2);WTITLE.t+=dt;if(SCENE==='shed')updateSlimeList(SHSLIMES,dt,shedFree);if(SCENE==='shop')updateShopLum(dt);if(SCENE==='pond'){updateSlimeList(PSLIMES,dt,pondFree);if(QUAKE.t<QUAKE.dur)QUAKE.t+=dt;}if(SCENE==='well')updateWellSlimes(dt);if(SCENE==='study')updateSlimeList(SSLIMES,dt,studyFree);updateRoomDoors();}else{
  const k=Math.min(1,dt*4.5);cam.x+=(lum.x-cam.x)*k;cam.y+=(lum.y-50-cam.y)*k;
  {const vw=W/zoom,vh=H/zoom;cam.x=clamp(cam.x,Math.max(BACK.x,-990)+vw/2,Math.min(BACK.x+BACK.w,1110)-vw/2);cam.y=clamp(cam.y,BACK.y+vh/2,1700-vh/2);}}
  audioUpdate(dt);updateFade(dt);
  if(INTRO.on)updateIntro(dt);
  if(DLG.active&&DLG.withCosmic&&!cos.hidden){const s_=Math.sign(cos.x-lum.x)||1;if(lum.state==='idle'||lum.state==='idleUp'){lum.face=s_;if(lum.state==='idleUp')lum.state='idle';}if(cos.state==='idle')cos.face=-s_;}else INTRO.ui=Math.min(1,INTRO.ui+dt*1.5);
  if(SCENE!==c1LastScene){if(SCENE==='garden'&&CH===1&&!C1I.on)resetForage();if(SCENE==='woods')for(const f of WFORAGE)f.picked=0;c1LastScene=SCENE;}
  {const fk=fkFacing(),P=fk?fk:CH>0&&DLG.active?(SCENE==='vhut'?VHVANE:SCENE==='woods'&&VANE?VANE:null):null;lum.talkSide=!!P&&(lum.state==='idle'||lum.state==='idleUp');if(lum.talkSide){lum.face=P.x<lum.x?-1:1;lum.state='idle';}}
  if(C1I.on)updateC1Intro(dt);if(C2.on)updateC2(dt);updateAmrFollow(dt);
}
let c1LastScene='';

