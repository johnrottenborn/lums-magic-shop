/* ---------- Lum's battle kit: powders ---------- */
const POWDERS={frost:3,thorn:3,moon:3};
const POWDER_LIST=[['spark','Sparkdust','Damage · unlimited',null],['frost','Frostbloom Powder','Freezes · enemy may lose a turn','frost'],['thorn','Thornbane Powder','Weakens enemy attacks','thorn'],['moon','Moonmint Powder','Calms · strong vs undead','moon']];
const POWICON={spark:'icon4_sun_bottle',frost:'icon3_frost_bowl',thorn:'icon_pouch_rose',moon:'icon3_pastel_powders'};
function drawPowderIcon(c,id,x,y,z){const im=IMG[POWICON[id]];if(ready(im)){c.drawImage(im,x-z/2,y-z/2,z,z);return true;}return false;}
const PCOL={spark:'255,230,140',frost:'170,225,255',thorn:'170,220,120',moon:'200,170,255'};
const WEAKTO={rslime:'frost',rvixen:'thorn',bigspider:'thorn',slime:'frost',jelly:'frost',fslime:'frost',slug:'frost',slugking:'frost',wisp:'frost',flora:'frost',spider:'thorn',vixen:'thorn',bigvixen:'thorn',bat:'spark',mimic:'spark',rskel:'moon',reaper:'moon',skel:'moon'};
const weakKnown=(t,p)=>WEAKTO[t]===p&&C1.weak&&C1.weak[t];
function lumPowderHit(h,f,c){const B=BATTLE,S=bS(),st=heroStats(h.id),p=B.powder||'spark';let dmg=Math.max(1,st.atk+(c.nice?1:0)-f.def);const tp=foeCenter(f).top;const weak=WEAKTO[f.type]===p;
  if(h.chill){dmg=Math.max(1,dmg-1);h.chill=0;}
  if(p==='frost'){dmg=Math.max(1,dmg-1);if(c.nice||weak||Math.random()<.4){f.skip=1;f.frozen=1;f.thawT=0;f.frostT=0;pop(f.x+f.ox,tp-80*S,'Frozen!','nice');}}
  else if(p==='thorn'){dmg=1;f.weak=3;f.vineT=0;pop(f.x+f.ox,tp-80*S,'Weakened!','nice');}
  else if(p==='moon'){if(UNDEAD(f.type)){dmg=Math.round(dmg*1.8);if(f.charged){f.charged=0;pop(f.x+f.ox,tp-80*S,'Interrupted!','nice');}else pop(f.x+f.ox,tp-80*S,'Soothed!','info');}else if(c.nice){f.skip=1;f.drowsy=1;pop(f.x+f.ox,tp-80*S,'Drowsy…','nice');}}
  if(weak){if(!(p==='moon'&&UNDEAD(f.type)))dmg=Math.max(dmg+2,Math.ceil(dmg*1.6));(C1.weak=C1.weak||{})[f.type]=1;pop(f.x+f.ox+50*S,tp-45*S,'Weak!','weak');B.hitstop=Math.max(B.hitstop,.08);}
  if(p!=='spark')POWDERS[p]=Math.max(0,POWDERS[p]-1);
  if(c.nice){C1.combo=Math.min(COMBO_MAX,(C1.combo||0)+1);if(C1.combo===COMBO_MAX)setTimeout(()=>{if(BATTLE.on)pop(h.x,h.y-210*S,'Starfall ready!','nice');},500);}else C1.combo=0;
  spawnPowderFx(p,f);hurtFoe(f,dmg,c.nice);}


/* ---------- foe special moves ---------- */
const SLIMEY=t=>t==='slime'||t==='jelly'||t==='fslime'||t==='rslime';
function foeAbility(f,h,dmg,c){const B=BATTLE,S=bS(),t=f.type,fc=foeCenter(f),hx=h.x+h.ox,hy=h.y-90*S;
  if(t==='bat'&&dmg>0){const heal=Math.min(dmg,f.max-f.hp);f.hp+=heal;f.showHp=1;pop(fc.x,fc.top-50*S,'Life Leech!','info');if(heal>0)setTimeout(()=>{if(BATTLE.on)pop(fc.x+20*S,fc.y,'+'+heal,'heal');},350);
    for(let i=0;i<12;i++)B.fx.push({k:'drain',sx:hx+rnd(-14,14)*S,sy:hy+rnd(-30,30)*S,tx:fc.x,ty:fc.y,t:-i*.035,max:.6,a:rnd(-1,1)});}
  if(f.web){f.web=0;if(!c.guard&&!h.ko){h.stuck=1;pop(hx,h.y-230*S,'Webbed!','info');for(let i=0;i<10;i++)B.fx.push({k:'shard',x:hx,y:hy,vx:rnd(-120,120)*S,vy:rnd(-90,60)*S,rot:rnd(0,TAU),s:rnd(5,9)*S,t:0,max:rnd(.5,.8)});}}
  if((t==='spider'||t==='bigspider')&&dmg>0&&!c.guard){h.poison=3;pop(hx,h.y-200*S,'Poisoned!','info');for(let i=0;i<10;i++)B.fx.push({k:'bub',x:hx+rnd(-20,20)*S,y:hy+rnd(0,40)*S,vy:-rnd(40,90)*S,s:rnd(3,6)*S,t:-rnd(0,.3),max:rnd(.6,1)});}
  if(SLIMEY(t)&&dmg>=1&&!h.stuckImm){h.stuck=1;pop(hx,h.y-200*S,'Stuck!','info');for(let i=0;i<12;i++)B.fx.push({k:'goo',x:hx+rnd(-10,10)*S,y:h.y-60*S,vx:rnd(-120,120)*S,vy:-rnd(60,200)*S,s:rnd(3,7)*S,t:0,max:rnd(.5,.8)});}
  if((t==='vixen'||t==='bigvixen'||t==='rvixen')&&!c.guard){const have=ING_ORDER.filter(id=>(MATS[id]||0)>0);
    if(!have.length){pop(fc.x,fc.top-50*S,'Nothing to steal!','info');}
    else{const id=have[(Math.random()*have.length)|0];MATS[id]--;if(MATS[id]<=0){delete MATS[id];const j=BAG.indexOf(id);if(j>=0)BAG.splice(j,1);}(f.stolen=f.stolen||[]).push(id);
      pop(hx,h.y-200*S,'Stole '+((ITEMS[id]&&ITEMS[id].name)||id)+'!','info');B.fx.push({k:'steal',id,sx:hx,sy:hy,tx:fc.x,ty:fc.y,t:.05,max:.75});}}}
/* ---------- battle juice: white flashes, impact bursts, per-powder effects ---------- */
let FXC=null,BSX=0,BSY=0;const FSHAPE={};
function foeBob(f){const S=bS(),t=f.type;if(t==='wisp')return-(12*S+Math.sin(T*2.2+f.ph)*5*S);if(t==='rskel')return-(10*S+Math.sin(T*1.8+f.ph)*5*S);if(t==='bat')return-(70*S+Math.sin(T*3+f.ph)*8*S);if(t==='jelly'||t==='fslime')return-((22+Math.sin(f.ph*1.6)*7)*S+(f.z||0)*.5);if(t==='slime'||t==='slug'||t==='mimic')return-(f.z||0);return 0;}
function foeLayer(f){if(!FXC)FXC=document.createElement('canvas');if(FXC.width!==cv.width||FXC.height!==cv.height){FXC.width=cv.width;FXC.height=cv.height;}
  const c=FXC.getContext('2d');c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.filter='none';c.clearRect(0,0,FXC.width,FXC.height);c.setTransform(DPR,0,0,DPR,0,0);
  const old=ctx,hp=f.showHp;ctx=c;WHITEPASS=true;f.showHp=0;try{drawBattleFoe(f);}catch(e){}ctx=old;WHITEPASS=false;f.showHp=hp;return c;}
function foeTint(f,col,a){if(a<=.01)return;const c=foeLayer(f);c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-atop';c.fillStyle=col;c.fillRect(0,0,FXC.width,FXC.height);c.globalCompositeOperation='source-over';
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=Math.min(1,a);ctx.drawImage(FXC,Math.round(BSX*DPR),Math.round(BSY*DPR));ctx.restore();}
/* the foe's silhouette, measured once per kind: bounding box, a width profile and points on its outline */
function foeShape(f){const k=f.type+'|'+(f.s||1);if(FSHAPE[k])return FSHAPE[k];if(f.dead)return null;const c=foeLayer(f);let d;try{d=c.getImageData(0,0,FXC.width,FXC.height).data;}catch(e){return null;}
  const Wd=FXC.width,Hd=FXC.height,S=bS(),ox=f.x+f.ox,oy=f.y+f.oy+foeBob(f),A=(x,y)=>(x<0||y<0||x>=Wd||y>=Hd)?0:d[(y*Wd+x)*4+3];let x0=1e9,y0=1e9,x1=-1,y1=-1;
  for(let y=0;y<Hd;y+=2)for(let x=0;x<Wd;x+=2)if(A(x,y)>110){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<0)return null;const NB=14,prof=[];
  for(let b=0;b<NB;b++){const yy=Math.round(y0+(y1-y0)*(b+.5)/NB);let l=1e9,r=-1;for(let x=x0;x<=x1;x+=2)if(A(x,yy)>110){if(x<l)l=x;if(x>r)r=x;}prof.push(r<0?null:[(l/DPR-ox)/S,(r/DPR-ox)/S]);}
  const edge=[],o=Math.round(5*DPR);for(let i=0;i<9000&&edge.length<80;i++){const x=(x0+Math.random()*(x1-x0))|0,y=(y0+Math.random()*(y1-y0))|0;if(A(x,y)>170&&(A(x+o,y)<30||A(x-o,y)<30||A(x,y-o)<30))edge.push([(x/DPR-ox)/S,(y/DPR-oy)/S]);}
  const sh={x0:(x0/DPR-ox)/S,x1:(x1/DPR-ox)/S,y0:(y0/DPR-oy)/S,y1:(y1/DPR-oy)/S,prof,edge};if(edge.length<6)return null;return FSHAPE[k]=sh;}
function foeCenter(f){const S=bS(),sh=foeShape(f),bx=f.x+f.ox,by=f.y+f.oy+foeBob(f);if(!sh)return{x:bx,y:by-60*S,l:bx-50*S,r:bx+50*S,top:by-110*S,bot:by,sh:null,bx,by};
  return{x:bx+(sh.x0+sh.x1)/2*S,y:by+(sh.y0+sh.y1)/2*S,l:bx+sh.x0*S,r:bx+sh.x1*S,top:by+sh.y0*S,bot:by+sh.y1*S,sh,bx,by};}
function spawnPowderFx(p,f){const B=BATTLE,S=bS(),c=foeCenter(f),w=c.r-c.l;
  if(p==='spark'){for(let i=0;i<28;i++)B.fx.push({k:'star',x:rnd(c.l-15*S,c.r+15*S),y:c.top-rnd(0,110)*S,vx:rnd(-25,25)*S,vy:rnd(60,170)*S,rot:rnd(0,TAU),vr:rnd(-7,7),s:rnd(8,14)*S,t:-rnd(0,.3),max:rnd(.8,1.15),ph:rnd(0,TAU)});
    B.fx.push({k:'flash',x:c.x,y:c.y,r:Math.max(60*S,w*.8),col:'255,220,120',t:0,max:.4});}
  else if(p==='frost'){B.fx.push({k:'flash',x:c.x,y:c.y,r:Math.max(60*S,w*.8),col:'180,230,255',t:0,max:.45});
    for(let i=0;i<14;i++){const a=rnd(0,TAU);B.fx.push({k:'shard',x:c.x,y:c.y,vx:Math.cos(a)*rnd(80,220)*S,vy:Math.sin(a)*rnd(60,180)*S,rot:a,s:rnd(4,8)*S,t:0,max:rnd(.4,.7)});}
    if(!f.frozen&&c.sh)for(let i=0;i<8;i++){const e=c.sh.edge[(i*37)%c.sh.edge.length],px=c.bx+e[0]*S,py=c.by+e[1]*S;B.fx.push({k:'crys',x:px,y:py,rot:Math.atan2(py-c.y,px-c.x),s:rnd(9,14)*S,t:-i*.03,max:1.1});}}
  else if(p==='thorn'){for(let i=0;i<10;i++)B.fx.push({k:'leaf',x:c.x+rnd(-w*.4,w*.4),y:c.bot-rnd(0,30)*S,vx:rnd(-90,90)*S,vy:-rnd(80,200)*S,rot:rnd(0,TAU),vr:rnd(-8,8),s:rnd(4,7)*S,t:0,max:rnd(.7,1.1)});}
  else if(p==='moon'){B.fx.push({k:'flash',x:c.x,y:c.y,r:Math.max(70*S,w),col:'200,170,255',t:0,max:.9,soft:1});
    for(let i=0;i<18;i++){let px=rnd(c.l,c.r),py=rnd(c.top,c.bot);if(c.sh){const e=c.sh.edge[(i*29)%c.sh.edge.length];px=c.bx+e[0]*S+rnd(-14,14)*S;py=c.by+e[1]*S;}
      B.fx.push({k:'mote',x:px,y:py,vx:rnd(-12,12)*S,vy:-rnd(22,50)*S,s:rnd(7,12)*S,t:-rnd(0,.5),max:rnd(1.6,2.4),ph:rnd(0,TAU),rot:rnd(-.6,.6)});}}}
function updateBattleFx(dt){const B=BATTLE;for(let i=B.fx.length-1;i>=0;i--){const p=B.fx[i];p.t+=dt;if(p.t>p.max){B.fx.splice(i,1);continue;}if(p.t<0)continue;
    if(p.k==='star'){p.vy+=380*bS()*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;}else if(p.k==='shard'){p.vx*=1-dt*4;p.vy*=1-dt*4;p.vy+=60*bS()*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}
    else if(p.k==='leaf'){p.vy+=420*bS()*dt;p.vx*=1-dt*2;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;}else if(p.k==='mote'){p.x+=(p.vx+Math.sin(p.t*2.4+p.ph)*16*bS())*dt;p.y+=p.vy*dt;}else if(p.k==='bub'){p.y+=p.vy*dt;p.x+=Math.sin(p.t*8+p.s)*20*bS()*dt;}else if(p.k==='goo'){p.vy+=700*bS()*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}}
  for(const f of B.foes){if(f.type==='flora')f.bloomIn=(f.bloomIn||0)+dt;f.wfl=Math.max(0,(f.wfl||0)-dt);if(f.thawT>0){f.thawT-=dt;if(f.thawT<=0)f.frozen=0;}
    const k=Math.min(1,dt*7);f.frostA=(f.frostA||0)+(((f.frozen&&!f.dead)?1:0)-(f.frostA||0))*k;f.vineA=(f.vineA||0)+(((f.weak>0&&!f.dead)?1:0)-(f.vineA||0))*k;f.frostT=(f.frostT||0)+dt;f.vineT=(f.vineT||0)+dt;}}
function starPath(c,r){c.beginPath();for(let k=0;k<10;k++){const a=k/10*TAU-Math.PI/2,q=k%2?r*.45:r;c.lineTo(Math.cos(a)*q,Math.sin(a)*q);}c.closePath();}
function drawCrystal(c,x,y,s,rot,a){if(s<=.5||a<=.01)return;c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha=a;c.fillStyle='rgba(232,250,255,.92)';c.strokeStyle='rgba(96,170,230,.95)';c.lineWidth=1.1;
  for(const [ang,len] of [[0,1],[.62,.66],[-.62,.66],[0.0,-.38]]){c.save();c.rotate(ang);const L=s*len,Wd=s*.2;c.beginPath();c.moveTo(0,0);c.lineTo(L*.55,-Wd);c.lineTo(L,0);c.lineTo(L*.55,Wd);c.closePath();c.fill();c.stroke();c.restore();}
  c.restore();c.save();c.globalCompositeOperation='lighter';drawGlow(c,x,y,s*1.1,'190,235,255',.35*a);c.restore();}
function crescent(c,x,y,r,rot){c.save();c.translate(x,y);c.rotate(rot);c.beginPath();c.moveTo(0,-r);c.arc(0,0,r,-Math.PI/2,Math.PI/2,true);c.quadraticCurveTo(-r*.55,0,0,-r);c.closePath();c.fill();c.restore();}
function drawVines(f,c,a){const S=bS(),sh=c.sh;if(!sh)return;const g=Math.min(1,f.vineT/.7),ease=1-Math.pow(1-g,3),NB=sh.prof.length,top=.88;
  const at=s=>{const fb=(1-s*top)*(NB-1);const i=clamp(Math.round(fb),0,NB-1);let pr=sh.prof[i];if(!pr){for(let j=1;j<NB&&!pr;j++)pr=sh.prof[clamp(i+j,0,NB-1)]||sh.prof[clamp(i-j,0,NB-1)];}return pr||[sh.x0,sh.x1];};
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(let v=0;v<2;v++){const ph=v*Math.PI+.4,turns=1.6+v*.2,N=60,pts=[];for(let i=0;i<=N*ease;i++){const s=i/N,pr=at(s),cx=c.bx+(pr[0]+pr[1])/2*S,hw=Math.max(14*S,(pr[1]-pr[0])/2*S*.92),ang=s*turns*TAU+ph;
      pts.push([cx+Math.cos(ang)*hw,c.by+(sh.y1-(sh.y1-sh.y0)*s*top)*S+Math.sin(ang)*5*S,Math.sin(ang)]);}
    for(const pass of [0,1])for(let i=1;i<pts.length;i++){const p0=pts[i-1],p1=pts[i],front=p1[2]>0;if(pass===0&&front||pass===1&&!front)continue;
      ctx.globalAlpha=a*(front?1:.45);ctx.strokeStyle=front?'#33561f':'#2a4119';ctx.lineWidth=(front?4.2:2.6)*S*(1-i/pts.length*.35);ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();
      if(front){ctx.strokeStyle='rgba(150,200,100,.75)';ctx.lineWidth=1.2*S;ctx.beginPath();ctx.moveTo(p0[0],p0[1]-1.2*S);ctx.lineTo(p1[0],p1[1]-1.2*S);ctx.stroke();
        if(i%5===0){const dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,sg=i%10?1:-1,tl=5*S;ctx.fillStyle='#d9c58a';ctx.beginPath();ctx.moveTo(p1[0]-dx/l*2*S,p1[1]-dy/l*2*S);ctx.lineTo(p1[0]+nx*tl*sg,p1[1]+ny*tl*sg);ctx.lineTo(p1[0]+dx/l*2*S,p1[1]+dy/l*2*S);ctx.closePath();ctx.fill();}
        if(i%13===6){ctx.fillStyle='#5f9a3a';ctx.save();ctx.translate(p1[0],p1[1]);ctx.rotate(i*1.3);ctx.beginPath();ctx.ellipse(5*S,0,5*S,2.4*S,0,0,TAU);ctx.fill();ctx.restore();}}}}
  ctx.restore();ctx.globalAlpha=1;}
function drawFoeStatus(f){const S=bS();if(f.wfl>0&&f.wflMax)foeTint(f,'#ffffff',Math.min(1,f.wfl/f.wflMax*1.3));
  if(f.frostA>.01||f.vineA>.01){const c=foeCenter(f);
    if(f.frostA>.01){foeTint(f,'#cdeeff',.42*f.frostA);if(c.sh){const n=Math.min(11,c.sh.edge.length);for(let i=0;i<n;i++){const e=c.sh.edge[(i*13)%c.sh.edge.length],px=c.bx+e[0]*S,py=c.by+e[1]*S,gr=clamp((f.frostT-i*.05)/.35,0,1);
        drawCrystal(ctx,px,py,(8+hash(i,3,17)*8)*S*gr,Math.atan2(py-c.y,px-c.x)+(hash(i,4,17)-.5)*.6,f.frostA);}
      ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const tw=Math.max(0,Math.sin(T*3+i*2.1));const e=c.sh.edge[(i*31+7)%c.sh.edge.length];drawGlow(ctx,c.bx+e[0]*S,c.by+e[1]*S,10*S*tw,'235,250,255',.8*tw*f.frostA);}ctx.restore();}}
    if(f.vineA>.01)drawVines(f,c,f.vineA);}}
function drawBattleFx(){const B=BATTLE,S=bS();ctx.save();
  for(const p of B.fx){if(p.t<0)continue;const u=p.t/p.max;
    if(p.k==='burst'){const big=p.big,R=(big?70:46)*S*(1-Math.pow(1-u,2.4));ctx.globalCompositeOperation='lighter';drawGlow(ctx,p.x,p.y,(big?70:44)*S*(1-u*.4),p.col,(big?.9:.6)*(1-u));
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1-u;ctx.strokeStyle=`rgb(${p.col})`;ctx.lineWidth=(big?5:3)*S*(1-u)+.5;ctx.beginPath();ctx.arc(p.x,p.y,R,0,TAU);ctx.stroke();
      ctx.strokeStyle='#fffaf0';ctx.lineWidth=(big?3.4:2.2)*S;ctx.lineCap='round';const n=big?10:7;for(let k=0;k<n;k++){const a=k/n*TAU+hash(k,p.x|0,3),r0=R*.55,r1=R*(1.05+.35*hash(k,2,9));ctx.beginPath();ctx.moveTo(p.x+Math.cos(a)*r0,p.y+Math.sin(a)*r0);ctx.lineTo(p.x+Math.cos(a)*r1,p.y+Math.sin(a)*r1);ctx.stroke();}ctx.globalAlpha=1;}
    else if(p.k==='flash'){ctx.globalCompositeOperation='lighter';drawGlow(ctx,p.x,p.y,p.r*(p.soft?1+u*.3:1-u*.3),p.col,(p.soft?.45:.75)*(p.soft?Math.sin(Math.PI*u):1-u));}
    else if(p.k==='star'){const a=Math.min(1,(1-u)*3)*(.75+.25*Math.sin(p.t*18+p.ph));ctx.globalCompositeOperation='lighter';drawGlow(ctx,p.x,p.y,p.s*2.6,'255,214,110',.55*a);ctx.globalCompositeOperation='source-over';
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=a;ctx.fillStyle='#ffe58a';ctx.strokeStyle='rgba(170,110,20,.8)';ctx.lineWidth=1;starPath(ctx,p.s);ctx.fill();ctx.stroke();ctx.fillStyle='#fffbe6';starPath(ctx,p.s*.42);ctx.fill();ctx.restore();}
    else if(p.k==='shard'){ctx.globalCompositeOperation='source-over';ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=1-u;ctx.fillStyle='#eafaff';ctx.strokeStyle='#7fbfec';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-p.s,0);ctx.lineTo(0,-p.s*.3);ctx.lineTo(p.s,0);ctx.lineTo(0,p.s*.3);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    else if(p.k==='crys'){ctx.globalCompositeOperation='source-over';const gr=Math.min(1,p.t/.3),fade=u>.6?1-(u-.6)/.4:1;drawCrystal(ctx,p.x,p.y,p.s*gr,p.rot,fade);}
    else if(p.k==='leaf'){ctx.globalCompositeOperation='source-over';ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=1-u;ctx.fillStyle=u<.5?'#6ea544':'#4f7f30';ctx.beginPath();ctx.ellipse(0,0,p.s,p.s*.45,0,0,TAU);ctx.fill();ctx.restore();}
    else if(p.k==='bolt'){const e=Math.min(1,p.t/.22),fa=p.t<.35?1:Math.max(0,1-(p.t-.35)/.35),ex=p.sx+(p.tx-p.sx)*e,ey=p.sy+(p.ty-p.sy)*e;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=fa;ctx.strokeStyle='rgba(170,215,255,.9)';ctx.lineWidth=5*S;ctx.lineCap='round';
      for(let pass=0;pass<2;pass++){ctx.beginPath();ctx.moveTo(p.sx,p.sy);const n=9;for(let i=1;i<=n;i++){const u=i/n*e,jx=(hash(p.seed|0,i+pass*20,7)-.5)*26*S*(i<n?1:0),jy=(hash(p.seed|0,i+pass*20,9)-.5)*26*S*(i<n?1:0);ctx.lineTo(p.sx+(p.tx-p.sx)*u+jx,p.sy+(p.ty-p.sy)*u+jy);}ctx.stroke();ctx.lineWidth=2*S;ctx.strokeStyle='rgba(240,250,255,.95)';}
      drawGlow(ctx,ex,ey,46*S,'150,200,255',.8*fa);drawGlow(ctx,p.sx,p.sy,30*S,'200,230,255',.6*fa);ctx.globalAlpha=1;}
    else if(p.k==='drain'){const e=u*u*(3-2*u),x=p.sx+(p.tx-p.sx)*e,y=p.sy+(p.ty-p.sy)*e-Math.sin(Math.PI*e)*(40+30*p.a)*S;ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y,9*S,'255,70,90',.9*(1-u*.5));drawGlow(ctx,x,y,4*S,'255,200,200',.9);}
    else if(p.k==='bub'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1-u;ctx.strokeStyle='#a6e070';ctx.fillStyle='rgba(140,210,90,.35)';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,TAU);ctx.fill();ctx.stroke();ctx.globalAlpha=1;}
    else if(p.k==='goo'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1-u;ctx.fillStyle='rgba(130,210,120,.85)';ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,TAU);ctx.fill();ctx.globalAlpha=1;}
    else if(p.k==='steal'){const e=Math.min(1,u*1.15),x=p.sx+(p.tx-p.sx)*e,y=p.sy+(p.ty-p.sy)*e-Math.sin(Math.PI*e)*70*S;ctx.globalCompositeOperation='source-over';ctx.globalAlpha=u>.85?(1-u)/.15:1;drawIcon(ctx,p.id,x,y,30*S);ctx.globalAlpha=1;}
    else if(p.k==='mote'){const a=Math.sin(Math.PI*Math.min(1,u))*.95;ctx.globalCompositeOperation='lighter';drawGlow(ctx,p.x,p.y,p.s*3.2,'196,168,255',.5*a);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;ctx.fillStyle='#e6d9ff';crescent(ctx,p.x,p.y,p.s,p.rot+Math.sin(p.t*1.5+p.ph)*.25);ctx.globalAlpha=1;}}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.restore();}
function drawPowderPuff(){const B=BATTLE,P=B.puff;if(!P)return;P.t+=1/60;if(P.t>.9){B.puff=null;return;}const S=bS(),col=PCOL[P.p];ctx.save();ctx.globalCompositeOperation='lighter';
  for(let k=0;k<14;k++){const a=k/14*TAU+P.t*2,r=P.t*120*S*(.6+hash(k,1,5)*.6);drawGlow(ctx,P.x+Math.cos(a)*r,P.y+Math.sin(a)*r*.7,(9-P.t*6)*S,col,.9*(1-P.t));}drawGlow(ctx,P.x,P.y,50*S*(1-P.t*.5),col,.5*(1-P.t));ctx.restore();}
function drawPowderMenu(){const B=BATTLE;if(B.phase!=='powders')return;B.itemHits=[];const w=Math.min(W-40,330),x=(W-w)/2,y=H*.52,h_=POWDER_LIST.length*48+64;
  ctx.save();ctx.fillStyle='rgba(20,10,10,.3)';rr(x+2,y+4,w,h_,14);ctx.fill();ctx.fillStyle='#f6ecd2';rr(x,y,w,h_,14);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#6a4a28';ctx.font='700 14px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText("Lum's Powders",W/2,y+24);
  POWDER_LIST.forEach(([id,name,short,key],i)=>{const yy=y+36+i*48,n=key?POWDERS[key]:Infinity,dis=n<=0;ctx.globalAlpha=dis?.45:1;ctx.fillStyle='rgba(120,86,40,.12)';rr(x+12,yy,w-24,42,10);ctx.fill();
    if(!TOUCHUI()&&i===(B.itemSel||0)){ctx.strokeStyle='#e0a83a';ctx.lineWidth=2;ctx.stroke();}
    if(!drawPowderIcon(ctx,id,x+34,yy+21,36)){drawGlow(ctx,x+34,yy+21,16,PCOL[id],.7);ctx.fillStyle=`rgb(${PCOL[id]})`;ctx.beginPath();ctx.arc(x+34,yy+21,7,0,TAU);ctx.fill();}
    ctx.fillStyle='#4a3420';ctx.textAlign='left';ctx.font='700 14px "Alegreya SC", Georgia, serif';ctx.fillText(name,x+54,yy+18);ctx.font='italic 12px Alegreya, Georgia, serif';ctx.fillStyle='#7a6040';ctx.fillText(short,x+54,yy+34);
    ctx.textAlign='right';ctx.font='700 13px "Alegreya SC", Georgia, serif';ctx.fillStyle='#6a4a28';ctx.fillText(key?'×'+n:'∞',x+w-24,yy+26);if(aliveFoes().some(f=>weakKnown(f.type,id))){ctx.fillStyle='#c8442e';ctx.font='700 11px "Alegreya SC", Georgia, serif';ctx.fillText('WEAK!',x+w-24,yy+12);}ctx.globalAlpha=1;
    if(!dis)B.itemHits.push({x:x+12,y:yy,w:w-24,h:42,act:()=>{B.powder=id;sfxPage(.5);if(aliveFoes().length>1){B.phase='target';B.target=B.foes.indexOf(aliveFoes()[0]);}else{B.target=B.foes.indexOf(aliveFoes()[0]);startBonk();}}});});
  ctx.font='italic 12px Alegreya, Georgia, serif';ctx.fillStyle='#8a7050';ctx.textAlign='center';ctx.fillText(tw('tap outside to go back','click outside or press Esc to go back'),W/2,y+h_-10);ctx.restore();}
/* ---------- drawing Lum and the new foes in battle ---------- */
function drawBattleLum(h){const S=bS(),sp=.6*S,x=h.x+h.ox,y=h.y+h.oy,B=BATTLE,me=B.heroes[B.cur]===h,ph=B.phase;if(!ready(atlas))return;
  let fr=29;if(me&&(ph==='bonkRun'||ph==='bonkBack'||ph==='run'||ph==='fled'))fr=27+(Math.floor(B.t*10)%4);else if(me&&ph==='bonkWind')fr=32;else if(me&&ph==='bonkHit')fr=35;
  ctx.save();ctx.translate(x,y+3);if(h.ko){const u=Math.min(1,B.t/.5);ctx.rotate(-u*1.2);}if(h.hurt>0)ctx.translate(Math.sin(h.hurt*60)*4,0);if(h.face<0)ctx.scale(-1,1);if(fr===29){const b=Math.sin(T*2.3);ctx.scale(1-.004*b,1+.009*b);}
  const dw=FW*sp,dh=FH*sp;ctx.drawImage(atlas,fr*FW,0,FW,FH,-dw/2,-dh*(274/280),dw,dh);ctx.restore();
  if(h.chill){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y-80*S,50*S,'160,210,255',.25+.1*Math.sin(T*4));ctx.restore();}
  if(me&&ph==='bonkWind'){const p=B.powder||'spark';ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x+40*S,y-90*S,22*S,PCOL[p],.7);ctx.restore();}
  drawHeroStatus(h);}
function drawHeroStatus(h){const S=bS(),x=h.x+h.ox,y=h.y+h.oy;
  if(h.poison>0&&!h.ko){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y-80*S,55*S,'140,230,80',.3+.08*Math.sin(T*5));ctx.restore();ctx.save();ctx.strokeStyle='#5f9e34';ctx.fillStyle='rgba(150,225,95,.55)';ctx.lineWidth=1.5;for(let k=0;k<6;k++){const u=(T*.55+k/6)%1;ctx.globalAlpha=1-u;ctx.beginPath();ctx.arc(x+Math.sin(k*2.3+T*1.3)*24*S,y-50*S-u*110*S,(4.5+k%2*2.5)*S,0,TAU);ctx.fill();ctx.stroke();}ctx.restore();}
  if(h.stuck&&!h.ko){ctx.save();ctx.fillStyle='rgba(120,200,110,.72)';ctx.strokeStyle='rgba(60,120,60,.6)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x,y,38*S,10*S,0,0,TAU);ctx.fill();ctx.stroke();for(let k=0;k<5;k++){const bx=x+(k-2)*13*S,bh=(10+hash(k,7,3)*16)*S*(.9+.1*Math.sin(T*3+k));ctx.beginPath();ctx.ellipse(bx,y-bh/2,5*S,bh/2+3*S,0,0,TAU);ctx.fill();}ctx.globalCompositeOperation='lighter';drawGlow(ctx,x-10*S,y-12*S,8*S,'230,255,220',.5);ctx.restore();}
}
function c1FoeFrame(f){const B=BATTLE,me=B.foes[B.foeI]===f,ph=B.phase,t=B.t;
  if(f.type==='spider'||f.type==='bigspider'){if(f.dead||f.hit>0)return['jump',3];if(me&&ph==='foeWind')return['attack',Math.min(1,Math.floor(t*5))];if(me&&ph==='foeLeap')return B.t/B.leapD<.5?['jump',1]:['attack',2];if(me&&ph==='foeBack')return['crawl',Math.floor(t*12)%5];return['idle',Math.floor(T*4+f.ph)%4];}
  if(f.type==='vixen'||f.type==='bigvixen'||f.type==='rvixen'){if(f.dead)return['hurt',0];if(f.hit>0)return['hurt',0];if(me&&ph==='foeWind')return['attack',Math.min(3,Math.floor(t*8))];if(me&&ph==='foeLeap')return f.type==='bigvixen'?['attack',4+Math.min(3,Math.floor(B.t/B.leapD*4))]:['jattack',0];if(me&&ph==='foeBack')return['run',Math.floor(t*14)%12];return['run',0];}
  if(f.type==='bat'){if(f.dead)return['recover',1];if(f.hit>0)return['recover',0];if(me&&ph==='foeWind')return['fly',Math.floor(t*12)%3];if(me&&ph==='foeLeap')return['swoop',Math.min(2,Math.floor(B.t/B.leapD*3))];if(me&&ph==='foeBack')return['recover',Math.floor(t*6)%2];return['fly',Math.floor(T*9+f.ph)%3];}
  if(f.type==='wisp'){if(f.dead)return['die',Math.floor(f.dead/.15)];if(f.hit>0)return['hurt',Math.floor((.4-f.hit)/.14)];if(me&&ph==='foeWind')return['spin',Math.floor(t*14)];if(me&&ph==='foeLeap')return B.t/B.leapD>.7?['thorn',2]:['roll',Math.floor(t*20)];if(me&&ph==='foeBack')return['thorn',3];if(me&&ph==='foeJiggle')return['taunt',Math.floor(t*6)];return['idle',Math.floor(T*5+f.ph)];}
  if(f.type==='rskel'){if(f.dead)return['die',Math.floor(f.dead/.18)];if(f.hit>0)return['hurt',1+Math.floor((.4-f.hit)/.14)];if(me&&ph==='foeWind')return['cast',Math.min(1,Math.floor(f.wind*2))];if(me&&ph==='foeLeap')return['cast',2];if(me&&ph==='foeBack')return['cast',3];if(me&&ph==='foeJiggle')return['hover',Math.floor(t*6)];return['idle',Math.floor(T*5+f.ph)];}
  if(f.type==='flora'){if(f.dead)return['bloom',Math.max(0,7-Math.floor(f.dead/.12))];if(f.hit>0)return['hurt',Math.min(3,Math.floor((.4-f.hit)/.1))];if(me&&ph==='foeRegrow'){const k=t<.6?7-t/.6*5:t<1.2?2+(t-.6)/.6*5:7;return['bloom',Math.round(k)];}if(me&&ph==='foeWind')return['attack',Math.min(5,Math.floor(f.wind*6))];if(me&&ph==='foeLeap')return['attack',6];if(me&&ph==='foeBack')return['attack',6];if(f.bloomIn<.9)return['bloom',Math.min(7,Math.floor((f.bloomIn||0)/.9*8))];return['idle',Math.floor(T*6+f.ph*3)%6];}
  if(f.type==='reaper'){if(f.dead)return['hurt',2];if(f.hit>0)return['hurt',Math.floor((.4-f.hit)/.14)];
    if(me&&f.heavyNow&&ph==='foeWind')return['cast',3+Math.min(1,Math.floor(f.wind*2))];if(me&&f.heavyNow&&ph==='foeLeap')return['cast',5];if(me&&ph==='foeCharge')return['cast',Math.min(2,Math.floor(t*3))];
    if(me&&ph==='foeWind')return['strike',0];if(me&&ph==='foeLeap')return['strike',1+Math.min(2,Math.floor(B.t/B.leapD*3))];if(me&&ph==='foeBack')return['strike',4];if(f.charged)return['cast',2];return['idle',Math.floor(T*5+f.ph)];}
  return['idle',0];}
/* Fokalur in battle: the prologue's Demon God art, large */
function drawBattleFok(f){const S=bS(),B=BATTLE,x=f.x+f.ox,y=f.y+f.oy,h=Math.min(430*S,W*.95/FOKA_W)*(f.s||1),me=B.foes[B.foeI]===f,ph=B.phase;let n=Math.floor(T*4)%4;if(me&&ph==='foeWind')n=6;else if(me&&(ph==='foeLeap'||ph==='foeBack'))n=7;
  bshadow(x,y,h*.28,h*.05,.4);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y-h*.5,h*.6,'160,30,80',.2+.06*Math.sin(T*3));ctx.restore();
  drawFokFrame(ctx,n,x+(f.hit>0?Math.sin(f.hit*50)*5:0),y,h,false,1);}
function drawBattleC1Foe(f){const S=bS(),B=BATTLE,x=f.x+f.ox,y=f.y+f.oy,sh=f.type,H_={wisp:120,rskel:205,reaper:200,bat:150,vixen:150,bigvixen:185,spider:120,flora:175,rvixen:150,bigspider:250}[sh]*S*f.s;const __s=sh==='vixen'||sh==='bigvixen'?'fox':sh==='rvixen'?'fox_red':sh==='bigspider'?'spider_dark':sh;
  let al=1;if(f.dead){const lim=sh==='reaper'?1.4:1.1;if(f.dead>lim)al=Math.max(0,1-(f.dead-lim)/.6);if(al<=0)return;}
  bshadow(x,y-2,H_*(sh==='wisp'?.32:sh==='bat'?.16:.22),H_*.05,(sh==='bat'?.22:.32)*al);
  const [an,fi]=c1FoeFrame(f);let yy=y;if(sh==='wisp')yy-=12*S+Math.sin(T*2.2+f.ph)*5*S;if(sh==='rskel')yy-=10*S+Math.sin(T*1.8+f.ph)*5*S;if(sh==='bat'){yy-=70*S+Math.sin(T*3+f.ph)*8*S;if(f.dead)yy+=Math.min(1,f.dead/.8)*70*S;}
  ctx.save();if(sh==='reaper'&&f.dead){const u=Math.min(1,f.dead/1.4);ctx.translate(0,u*30*S);ctx.globalAlpha=1-u*.6;}
  c1Frame(ctx,__s,an,fi,x+(f.hit>0?Math.sin(f.hit*50)*4:0),yy,H_,sh==='wisp'||((sh==='spider'||sh==='bigspider')&&an==='idle')||((sh==='rskel'||sh==='reaper')&&(an==='cast'||an==='strike'||an==='hover')),al,f.hit);ctx.restore();
  if(sh==='reaper'&&f.dead){ctx.save();ctx.globalCompositeOperation='lighter';for(let k=0;k<10;k++){const u=(f.dead*.8+k*.1)%1;drawGlow(ctx,x+Math.sin(k*2.1+f.dead*3)*40*S,y-u*180*S,(10-u*8)*S,'190,140,255',.6*(1-u)*al);}ctx.restore();}
  if(sh==='reaper'&&!f.dead){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x-30*S,y-H_*.82,(f.charged?40:20)*S,f.charged?'190,120,255':'210,240,210',.35+.15*Math.sin(T*5));ctx.restore();}
  // ranged spells fly from caster to hero
  const me=B.foes[B.foeI]===f;if(me&&B.phase==='foeLeap'&&B.t>=0&&f.tgt&&sh==='flora'){const u=Math.min(1,B.t/B.leapD),sx=x-H_*.15,sy=y-H_*.72,tx=f.tgt.x+f.tgt.ox,ty=f.tgt.y-85*S,px=sx+(tx-sx)*u,py=sy+(ty-sy)*u-Math.sin(Math.PI*u)*40*S;ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,px,py,40*S,'255,120,110',.45);ctx.restore();ctx.save();ctx.translate(px,py);ctx.rotate(Math.atan2(ty-sy,tx-sx)-Math.PI+Math.cos(Math.PI*u)*.4);c1Frame(ctx,'flora','shot',0,0,30*S,90*S,true,1,0);ctx.restore();}
  if(me&&B.phase==='foeLeap'&&B.t>=0&&f.tgt&&(sh==='rskel'||(sh==='reaper'&&f.heavyNow))){const u=Math.min(1,B.t/B.leapD),sx=x-H_*.25,sy=y-H_*.55,tx=f.tgt.x+f.tgt.ox,ty=f.tgt.y-80*S,px=sx+(tx-sx)*u,py=sy+(ty-sy)*u-Math.sin(Math.PI*u)*30*S,col=sh==='rskel'?'170,160,255':'160,240,170';
    ctx.save();ctx.globalCompositeOperation='lighter';for(let k=0;k<6;k++){const v=u-k*.05;if(v<0)continue;drawGlow(ctx,sx+(tx-sx)*v,sy+(ty-sy)*v-Math.sin(Math.PI*v)*30*S,(18-k*2.5)*S,col,.7-k*.1);}drawGlow(ctx,px,py,(sh==='reaper'?34:24)*S,'235,235,255',.9);ctx.restore();}
  if(f.showHp>0&&!f.dead){const bw=(sh==='reaper'?80:56)*S,bx=x-bw/2,by=y+16*S;ctx.save();ctx.globalAlpha=Math.min(1,f.showHp*3);ctx.fillStyle='rgba(20,20,30,.55)';rr(bx-2,by-2,bw+4,10,5);ctx.fill();ctx.fillStyle='#7ee08a';rr(bx,by,bw*f.hp/f.max,6,3);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(`${f.hp}/${f.max}`,bx+bw/2,by+20);ctx.restore();}
  if(B.phase==='target'&&B.foes[B.target]===f)tutArrow(ctx,f.x,f.y-H_*.95,1);}

