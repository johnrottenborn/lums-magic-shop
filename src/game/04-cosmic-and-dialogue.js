/* ---------- life ---------- */
/* ---------- Cosmic, the apprentice: wanders the garden looking for slime signs ---------- */
const catlas=new Image();catlas.src=COSMIC_SRC;
let catlasG=null;function greenAtlas(){if(catlasG||!ready(catlas))return catlasG;const w=catlas.naturalWidth,h=catlas.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(catlas,0,0);
  try{const im=x.getImageData(0,0,w,h),d=im.data;for(let y=223;y<h;y++)for(let i=y*w*4,e=(y+1)*w*4;i<e;i+=4){const r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];if(a<40)continue;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
    if(r>g&&g>=b-4&&r-b>14&&(mx-mn)/(mx+1)>.12&&mx<210){const L=r*.3+g*.55+b*.15;d[i]=L*.62;d[i+1]=Math.min(255,L*1.18);d[i+2]=L*.55;}}x.putImageData(im,0,0);catlasG=c;}catch(e){catlasG=catlas;}return catlasG;}
const cosSheet=()=>PARTY.cosmic&&PARTY.cosmic.boots==='gboots'?(greenAtlas()||catlas):catlas;
const CFW=240,CFH=270,CSPR=.56;
const CANIM={walk:{frames:[0,1,2,3,4,5,6,7],fps:9.5,native:1},walkUp:{frames:[8,9,10,11,12,13,14,15],fps:8.5,native:1},idle:{frames:[16],native:1},
  point:{frames:[17,18],native:1},fizzle:{frames:[19],native:1},sigh:{frames:[20],native:1},shy:{frames:[21],native:1}};
const cos={x:-200,y:520,face:1,state:'idle',t:0,ft:0,tx:0,ty:0,wait:1.5,seqT:0,talked:0,bubble:0,bubbleText:''};
const COS_SPOTS=[[-200,520],[200,520],[-380,600],[380,560],[-150,780],[150,820],[-450,960],[200,960],[-200,1200],[140,1320],[-560,560],[560,740]];
function cosPick(){const s=COS_SPOTS[(Math.random()*COS_SPOTS.length)|0];cos.tx=s[0]+rnd(-30,30);cos.ty=s[1]+rnd(-20,20);cos.state='walk';}
function cosQuip(t){cos.bubbleText=t;cos.bubble=2.4;}
function updateCosmic(dt){
  const dL=Math.hypot(lum.x-cos.x,lum.y-cos.y),chatting=DLG.active&&DLG.withCosmic;
  if(chatting){cos.state='idle';cos.face=lum.x<cos.x?-1:1;}
  cos.t+=dt;cos.bubble=Math.max(0,cos.bubble-dt);
  switch(cos.state){
    case 'idle':cos.wait-=dt;if(cos.wait<=0&&!chatting){const r=Math.random();if(r<.62)cosPick();else if(r<.84){cos.state='sigh';cos.seqT=1.6;if(Math.random()<.5)cosQuip(['Hmm… bite marks.','Slime trail!','Sticky…','Not here either.'][(Math.random()*4)|0]);}else{cos.state='point';cos.seqT=.7;}}break;
    case 'walk':{const dx=cos.tx-cos.x,dy=cos.ty-cos.y,d=Math.hypot(dx,dy);if(d<6){cos.state='idle';cos.wait=rnd(1.4,3.6);break;}
      const sp=cos.run?165:72;let nx=cos.x+dx/d*sp*dt,ny=cos.y+dy/d*sp*dt;[nx,ny]=solveEstate(nx,ny);if(inStream(nx,ny,-6)){cosPick();break;}
      cos.x=nx;cos.y=ny;if(Math.abs(dx)>8)cos.face=dx<0?-1:1;cos.up=dy/d<-.55;cos.ft+=dt*CANIM.walk.fps*(cos.run?1.8:1);break;}
    case 'point':cos.seqT-=dt;if(cos.seqT<=0){cos.state='fizzle';sfxFizzle(Math.hypot(cos.x-lum.x,cos.y-lum.y)<520);cos.seqT=.7;
      const hx_=cos.x+cos.face*44,hy_=cos.y;for(let i=0;i<14;i++)PARTS.push({type:'fiz',x:hx_,y:hy_,z:72,vx:cos.face*rnd(10,70),vy:rnd(-30,30),vz:rnd(-10,90),life:0,max:rnd(.4,.9),s:rnd(1.5,3)});
      PARTS.push({type:'puff',x:hx_,y:hy_,z:72,vx:0,vy:0,vz:12,life:0,max:.9,s:10});}break;
    case 'fizzle':cos.seqT-=dt;if(cos.seqT<=0){cos.state='sigh';cos.seqT=1.4;if(Math.random()<.7)cosQuip(['…aw.','Almost!','One day…','Fizzle again.'][(Math.random()*4)|0]);}break;
    case 'sigh':cos.seqT-=dt;if(cos.seqT<=0){cos.state='idle';cos.wait=rnd(1,2.5);}break;
  }
}
function drawCosmic(){
  let A,fr;if(cos.state==='walk'){A=cos.up?CANIM.walkUp:CANIM.walk;fr=A.frames[Math.floor(cos.ft)%A.frames.length];}
  else if(cos.state==='point'){A=CANIM.point;fr=A.frames[cos.seqT>.35?0:1];}else if(cos.state==='fizzle'){A=CANIM.fizzle;fr=19;}
  else if(cos.state==='sigh'){A=CANIM.sigh;fr=20;}else{A=CANIM.idle;fr=(DLG.active&&DLG.withCosmic)?21:16;}
  const ph=cos.state==='walk'?Math.cos(cos.ft/A.frames.length*TAU*2):0;
  ctx.fillStyle='rgba(40,62,30,.24)';ctx.beginPath();ctx.ellipse(cos.x,cos.y+2,30*(1+.05*ph),9,0,0,TAU);ctx.fill();
  if(!ready(catlas))return;ctx.save();ctx.translate(cos.x,cos.y+3);if(cos.face!==A.native&&!(cos.state==='walk'&&cos.up))ctx.scale(-1,1);
  if(cos.state==='idle'||cos.state==='sigh'){const b=Math.sin(T*2.6+1);ctx.scale(1-.004*b,1+.01*b);}
  const dw=CFW*CSPR,dh=CFH*CSPR;ctx.drawImage(catlas,fr*CFW,0,CFW,CFH,-dw/2,-dh*(264/270),dw,dh);ctx.restore();
  if(cos.state==='point'){const tip=[cos.x+cos.face*58,cos.y-112];drawGlow(ctx,tip[0],tip[1],14+Math.sin(T*30)*3,'190,230,255',.55);}
}

/* ---------- conversations: B advances, lines auto-advance after a while ---------- */
const DLG={active:false,lines:[],i:0,t:0,withCosmic:false};
function talk(lines,withCosmic=false,onEnd=null){DLG.onEnd=onEnd;DLG.active=true;DLG.lines=lines;DLG.i=0;DLG.t=0;sfxBlip(lines[0][0]);DLG.withCosmic=withCosmic;lum.bubble=0;}
function dlgNext(){if(DLG.active&&DLG.lines[DLG.i]&&(DLG.lines[DLG.i][0]==='???'||DLG.lines[DLG.i][0]==='Fokalur')&&DLG.t*22<DLG.lines[DLG.i][1].length+6)return;DLG.i++;DLG.t=0;if(DLG.i>=DLG.lines.length&&typeof SAVEC!=='undefined')SAVEC.t=99;if(DLG.i>=DLG.lines.length&&DLG.onEnd){const cb=DLG.onEnd;DLG.onEnd=null;setTimeout(cb,0);}if(DLG.i<DLG.lines.length)sfxBlip(DLG.lines[DLG.i][0]);if(DLG.i>=DLG.lines.length){DLG.active=false;DLG.withCosmic=false;}}
function say(t){if(typeof t!=='string'||!t)return;talk([[PC==='cosmic'?'Cosmic':'Lum',t]]);}
function playerQuip(t){if(typeof t!=="string"||!t)return;lum.quip=t;lum.quipT=2.4;}
function talkCosmic(){
  if(!cos.talked){cos.talked=1;talk([
    ['Cosmic',"Master Lum! Something nibbled the moonmint again. There are tiny bite marks everywhere!"],
    ['Lum',"Slimes. They can't resist magic shrubs. Search the gardens around the shop and tell me what you find."],
    ['Cosmic',"Yes, Master! …Could you teach me one tiny spell first? Just a small one?"],
    ['Lum',"Not yet. A good apprentice learns to look before he learns to cast."],
    ['Cosmic',"Right. Looking. I'm very good at looking."]],true);return;}
  const lines=["I found a shiny trail by the lavender. Slimes, definitely slimes!","I tried a spark spell again. Nothing happened. Well… a very small fizzle.","Do slimes like roses? I really hope they don't like roses.","I'll check behind the herb rows next, Master!","When you teach me magic, can my first spell be a big one?","The magic blossoms by the brook look half eaten. Poor things."];
  talk([['Cosmic',lines[(cos.talked++ -1)%lines.length]]],true);}

/* ---------- garden fairies: tiny glowing sprites that flit between the flowers ---------- */
const FAIRIES=[0,1,2,3,4,5].map(i=>({x:rnd(-300,400),y:rnd(0,500),z:40,vx:0,vy:0,tx:0,ty:0,hover:0,ph:i*1.3,col:['255,190,230','190,240,255','255,240,170','210,200,255','200,255,210','255,210,190'][i]}));
function fairyTarget(f){const pool=ESTATE.filter(o=>o.t==='plant'&&Math.abs(o.x-cam.x)<380&&Math.abs(o.y-cam.y)<560);
  if(pool.length&&Math.random()<.8){const o=pool[(Math.random()*pool.length)|0];f.tx=o.x+rnd(-14,14);f.ty=o.y+rnd(-6,6);}else{f.tx=cam.x+rnd(-260,260);f.ty=cam.y+rnd(-420,420);}}
function updateFairies(dt){for(const f of FAIRIES){
  if(Math.hypot(f.x-cam.x,f.y-cam.y)>900){f.x=cam.x+rnd(-300,300);f.y=cam.y+rnd(-500,500);fairyTarget(f);}
  const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy);
  if(d<10){f.hover-=dt;if(f.hover<=0){fairyTarget(f);f.hover=rnd(.8,2.6);}}
  else{f.vx+=dx/d*260*dt;f.vy+=dy/d*260*dt;}
  const dl=Math.hypot(f.x-lum.x,f.y-lum.y);if(dl<60&&dl>0){f.vx+=(f.x-lum.x)/dl*500*dt;f.vy+=(f.y-lum.y)/dl*500*dt;}
  f.vx*=1-2.6*dt;f.vy*=1-2.6*dt;f.x+=f.vx*dt+Math.sin(T*5+f.ph)*8*dt;f.y+=f.vy*dt;f.z=32+Math.sin(T*3+f.ph)*8+(d<10?6:0);
  if(Math.random()<dt*6)PARTS.push({type:'fdust',x:f.x,y:f.y,z:f.z,vx:rnd(-6,6),vy:rnd(-3,3),vz:-rnd(4,14),life:0,max:rnd(.6,1.2),s:rnd(.8,1.6),col:f.col});}}
function drawFairies(){for(const f of FAIRIES){const x=f.x,y=f.y-f.z,fl=Math.abs(Math.sin(T*38+f.ph));
  drawGlow(ctx,x,y,14,f.col,.5);ctx.fillStyle='rgba(255,255,255,.55)';
  for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(x+s*4,y-2,4.6,1.4+2.6*fl,s*-.6,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(x+s*3,y+2,3,1+1.6*fl,s*.6,0,TAU);ctx.fill();}
  ctx.fillStyle='#fffdf4';ctx.beginPath();ctx.arc(x,y,1.8,0,TAU);ctx.fill();
  ctx.fillStyle='rgba(40,60,30,.10)';ctx.beginPath();ctx.ellipse(f.x,f.y,3,1.2,0,0,TAU);ctx.fill();}}

/* ---------- wisps: slow drifting lights with soft trailing tails ---------- */
const WISPS=[0,1,2,3,4,5,6].map(i=>({x:rnd(-300,300),y:rnd(-300,500),z:rnd(40,110),a:rnd(0,TAU),ph:rnd(0,TAU),trail:[],col:['200,245,255','215,255,220','255,240,200','225,215,255'][i%4],tt:0}));
function updateWisps(dt){for(const w of WISPS){w.a+=Math.sin(T*.4+w.ph)*.9*dt;w.x+=Math.cos(w.a)*16*dt;w.y+=Math.sin(w.a)*12*dt;w.z=70+Math.sin(T*.7+w.ph)*30;
  const vw=W/zoom/2+120,vh=H/zoom/2+160;if(w.x<cam.x-vw)w.x+=vw*2;if(w.x>cam.x+vw)w.x-=vw*2;if(w.y<cam.y-vh)w.y+=vh*2;if(w.y>cam.y+vh)w.y-=vh*2;
  w.tt+=dt;if(w.tt>.07){w.tt=0;w.trail.unshift([w.x,w.y-w.z]);if(w.trail.length>12)w.trail.pop();}}}
function drawWisps(){for(const w of WISPS){const tw=.7+.3*Math.sin(T*1.8+w.ph);
  for(let i=w.trail.length-1;i>=1;i--){const [x,y]=w.trail[i],k=1-i/w.trail.length;if(Math.abs(x-w.x)>60)continue;drawGlow(ctx,x,y,9*k+2,w.col,.18*k*tw);}
  drawGlow(ctx,w.x,w.y-w.z,24*tw,w.col,.32*tw);ctx.fillStyle=`rgba(255,255,255,${(.8*tw).toFixed(3)})`;ctx.beginPath();ctx.arc(w.x,w.y-w.z,2.2,0,TAU);ctx.fill();}}

/* ---------- gusts: when the breeze swells, petals and leaves blow across ---------- */
function updateGusts(dt){const g=Math.pow(Math.max(0,Math.sin(T*.35-cam.x*.0015)),4);
  const rate=2+g*26;if(Math.random()<dt*rate){const x=cam.x-W/zoom/2-20,y=cam.y+rnd(-H/zoom/2,H/zoom/2);
    const k=Math.random();PARTS.push({type:'gpetal',x,y,z:rnd(20,120),vx:rnd(60,120)*(.5+g),vy:rnd(-10,14),vz:0,life:0,max:rnd(5,9),s:rnd(2.4,4),rot:rnd(0,TAU),vr:rnd(-4,4),col:k<.45?'#f7c6d8':k<.7?'#fff4e6':k<.88?'#b7d38a':'#cbb8f0'});}}


/* ---------- opening scene ---------- */
const INTRO={on:true,t:0,lumShown:false,cosRun:false,talking:false,ui:0,fade:1};
const INTRO_LINE="At the edge of the world sits a tiny magic shop, where a hermit seeking peace finds herself sharing a quiet life with an unexpected apprentice.";
const INTRO_TALK=[
  ['Lum',"Good morning, Cosmic."],
  ['Cosmic',"Master Lum! Something's been eating all the moonmint!"],
  ['Lum',"Hmm. Shiny trails everywhere, and half the duskberries gone… slimes!"],
  ['Lum',"If the slimes are not stopped, there won't be a single leaf for us to make powders or potions…"],
  ['Cosmic',"Let me take care of it! I can do it. I promise!"],
  ['Lum',"Very well, Cosmic. Search the garden and keep your eyes open. Even slimes can be dangerous…"],
  ['Cosmic',"I won't let you down."]];
const ease=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
function beginIntro(){audioInit();INTRO.waiting=false;}
function introStart(){INTRO.on=true;INTRO.t=0;INTRO.lumShown=false;lum.x=0;lum.y=4;lum.face=1;cos.x=6;cos.y=560;cos.state='idle';cos.wait=999;cos.run=false;
  for(let i=0;i<3;i++){const b=BIRDS[i];spawnBird(b);b.y=BACK.y+H/zoom*(.3+i*.12);b.x=cam.x+(b.vx>0?-1:1)*(W/zoom/2+40+i*90);}}
/* make Spar the one the player walks as (Lum may be absent or follow); his battles use PARTY_ORDER, leader first */
function becomeSpar(x,y,face,solo){PC='spar';lum.x=x;lum.y=y;lum.face=face;lum.state='idle';lum.ft=0;lum.fi=0;lum.vx=lum.vy=0;lum.alpha=1;INTRO.lumShown=true;HERO='spar';
  PARTY_ORDER.length=0;PARTY_ORDER.push('spar');if(!solo)PARTY_ORDER.push('lum');}
function becomeCosmic(x,y,face){PC='cosmic';ANIM=COS_ANIM;lum.x=x;lum.y=y;lum.face=face;lum.state='idle';lum.ft=0;lum.fi=0;lum.vx=lum.vy=0;lum.alpha=1;lum.cool=0;
  cos.hidden=true;cos.talked=1;INTRO.lumShown=true;HINT.on=true;HINT.t=0;HINT.goalT=0;}
function introFinish(){INTRO.on=false;INTRO.fade=0;DLG.active=false;DLG.withCosmic=false;const here=INTRO.cosHere;becomeCosmic(here?cos.x:62,here?cos.y:150,here?cos.face:-1);}
function introSkip(){if(INTRO.talking&&DLG.active){dlgNext();if(!DLG.active)INTRO.exitT=INTRO.exitT||0.001;}}
function updateIntro(dt){if(INTRO.waiting)return;const t=(INTRO.t+=dt),vw=W/zoom,vh=H/zoom;
  INTRO.fade=1-ease(t/1.8);
  const top=BACK.y+vh/2,end=clamp(64-50,top,1700-vh/2),k=ease((t-9.2)/6);cam.x=40;cam.y=top+(end-top)*k;
  if(t>=15.2&&!INTRO.lumShown){INTRO.lumShown=true;lum.x=0;lum.y=4;}
  if(INTRO.lumShown&&t<16.2){const u=ease((t-15.2)/1);lum.y=4+60*u;lum.state=u<1?'walk':'idle';lum.ft+=dt*9;lum.fi=Math.floor(lum.ft)%ANIM.walk.frames.length;
    if(Math.random()<dt*14)PARTS.push({type:'fdust',x:lum.x+rnd(-30,30),y:lum.y,z:rnd(20,120),vx:rnd(-6,6),vy:rnd(-3,3),vz:-rnd(4,14),life:0,max:rnd(.6,1.2),s:rnd(1,1.8),col:'255,240,200'});}
  if(t>=16.6&&!INTRO.cosRun){INTRO.cosRun=true;cos.run=true;cos.tx=62;cos.ty=150;cos.state='walk';}
  if(INTRO.cosRun&&!INTRO.talking&&cos.state!=='walk'&&t>17){INTRO.talking=true;INTRO.cosHere=true;cos.face=-1;lum.face=1;talk(INTRO_TALK.slice(),true);}
  if(INTRO.talking&&!DLG.active&&!INTRO.exitT)INTRO.exitT=0.001;
  if(INTRO.exitT){INTRO.exitT+=dt;const u=INTRO.exitT;cos.face=-1;cos.state='idle';
    if(u<1.3){lum.state='walkUp';lum.face=-1;lum.y=64-60*ease(u/1.3);lum.x=0;lum.ft+=dt*9;lum.fi=Math.floor(lum.ft)%ANIM.walkUp.frames.length;lum.alpha=1;}
    else{if(!INTRO.doorFx){INTRO.doorFx=1;for(let i=0;i<14;i++)PARTS.push({type:'fdust',x:rnd(-22,22),y:2,z:rnd(10,110),vx:rnd(-8,8),vy:rnd(-4,2),vz:-rnd(4,16),life:0,max:rnd(.6,1.3),s:rnd(1,2),col:'255,226,170'});}lum.y=2;lum.alpha=Math.max(0,1-(u-1.3)/.5);if(u>1.9)introFinish();}}}
function drawIntroOverlay(){
  if(INTRO.fade>0){ctx.fillStyle=`rgba(10,12,20,${INTRO.fade.toFixed(3)})`;ctx.fillRect(0,0,W,H);}
  if(!INTRO.on)return;const t=INTRO.t;
  if(INTRO.waiting&&CHSEL.on){drawChapterSelect();return;}
  if(INTRO.waiting){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,W,H);ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#2f2a3a';ctx.font='700 32px "Alegreya SC", "Palatino Linotype", Georgia, serif';ctx.fillText("Lum's Magic Shop",W/2,H*.44);
    ctx.restore();drawTitleMenu();return;}
  {const blk=1-ease((t-.4)/2.4);if(blk>0){ctx.fillStyle=`rgba(0,0,0,${blk.toFixed(3)})`;ctx.fillRect(0,0,W,H);}}
  const a=Math.min(ease((t-1.3)/1.4),1-ease((t-11.6)/1.3));
  if(a>0){const maxW=Math.min(W-72,360);ctx.save();ctx.font='italic 500 19px Alegreya, "Palatino Linotype", Georgia, serif';
    const words=INTRO_LINE.split(' '),lines=[];let cur='';for(const w_ of words){const tt=cur?cur+' '+w_:w_;if(ctx.measureText(tt).width>maxW&&cur){lines.push(cur);cur=w_;}else cur=tt;}lines.push(cur);
    const lh=29,bh=lines.length*lh,cy=H*.4;const g=ctx.createLinearGradient(0,cy-bh/2-70,0,cy+bh/2+70);g.addColorStop(0,'rgba(20,24,30,0)');g.addColorStop(.5,'rgba(20,24,30,.42)');g.addColorStop(1,'rgba(20,24,30,0)');
    ctx.globalAlpha=a;ctx.fillStyle=g;ctx.fillRect(0,cy-bh/2-70,W,bh+140);ctx.textAlign='center';ctx.textBaseline='middle';
    lines.forEach((l,i)=>{const y=cy-bh/2+lh*(i+.5);ctx.fillStyle='rgba(10,14,20,.5)';ctx.fillText(l,W/2+1,y+2);ctx.fillStyle='#fdf8ec';ctx.fillText(l,W/2,y);});
    ctx.fillStyle='rgba(253,248,236,.8)';ctx.font='15px Alegreya, Georgia, serif';ctx.fillText('✦',W/2,cy+bh/2+26);ctx.restore();}
}

