/* =====================================================================
   INSIDE THE GARDEN SHED (painting placed in the 1375x768 room frame)
   ===================================================================== */
const SHK=768/1086,SHO=342;const sp_=(x,y)=>[SHO+x*SHK,y*SHK];
const SHFLOOR=[[365,895],[380,862],[445,848],[510,862],[745,866],[800,868],[870,846],[885,838],[780,912],[655,1000],[580,1027],[420,988],[320,955],[240,932],[250,920],[330,916]].map(([x,y])=>sp_(x,y));
function shedFree(x,y){return inPoly(x,y,SHFLOOR);}
function solveShed(px,py,nx,ny){if(shedFree(nx,ny))return [nx,ny];if(shedFree(nx,py))return [nx,py];if(shedFree(px,ny))return [px,ny];return [px,py];}
const shedH=y=>163+(clamp(y,590,730)-608)*.21;
const SHINT=[],SHSLIMES=[];let shedChestOpen=false;let shedSpawned=false,shedVisited=false;
function setupShed(){SHINT.length=0;{const [x,y]=sp_(560,1010);SHINT.push({x,y,reach:60,onInteract:()=>goScene(()=>enterGardenFromShed())});}const L=(sx,sy,reach,lines)=>{const [x,y]=sp_(sx,sy);let i=0;SHINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  L(400,870,70,["Shelves and shelves of seedlings. Some of them are glowing! Master Lum, what are you growing in here?","This little one has blue sparkly leaves. I'm calling it Sprout. Hi, Sprout."]);
  {const [x,y]=sp_(290,930);SHINT.push({x,y,reach:70,grab:()=>!shedChestOpen&&BAG.includes('shedkey'),onInteract:()=>{if(shedChestOpen){say("Empty now. Just a little dust and the smell of mint.");return;}if(!BAG.includes('shedkey')){say("Locked");return;}
    shedChestOpen=true;BAG.splice(BAG.indexOf('shedkey'),1);delete MATS.shedkey;giveItem('gboots');}});}
  L(600,880,80,["A potting bench with a little brass scale, a trowel, and a seed packet that says 'DO NOT PLANT INDOORS'.","There's a spellbook on the bench, open to a page about growing moonmint. Someone's been taking notes in the margins."]);
  L(560,880,70,["A big sack of potting soil. It smells like rain and earthworms. Good earthworms."]);
  L(840,870,70,["Rakes, shovels, a little pitchfork… Master Lum keeps everything so tidy. Except me. I'm the untidy part."]);
  L(700,900,80,["Dried herbs hang from every beam: lavender, rosemary, bellflowers… It smells like Master Lum's tea in here.","Sunlight through the little window makes the whole shed glow gold."]);}
function spawnShedSlimes(){if(shedSpawned)return;shedSpawned=true;const [x,y]=sp_(690,945);SHSLIMES.push({kind:'jelly',scene:'shed',x,y,hx:x,hy:y,s:.9,col:SLIME_COL[2],z:0,vz:0,hop:null,wait:rnd(.5,2),hp:2,hit:0,angry:0,ph:rnd(0,TAU),blink:rnd(1,4),dead:0,face:-1,calm:2.5});}
let SHBG=null;
/* snapshot the garden around the shed, blurred, to sit behind the cutaway interior */
function captureShedSurroundings(){const sv={cx:cam.x,cy:cam.y,sc:SCENE};SCENE='garden';cam.x=SHED_POS.x+20;cam.y=SHED_POS.y-110;
  CAPTURE.on=true;BATTLE.capG=null;render();SHBG=BBG;BBG=null;CAPTURE.on=false;cam.x=sv.cx;cam.y=sv.cy;SCENE=sv.sc;}
function enterShed(){captureShedSurroundings();SCENE='shed';const [x,y]=sp_(520,935);lum.x=x;lum.y=y;lum.face=1;lum.vx=lum.vy=0;lum.state='idleUp';WCAM.x=x;WTITLE.t=0;setupShed();spawnShedSlimes();for(const g of SHSLIMES)g.calm=Math.max(g.calm||0,2.5);
  if(!shedVisited){shedVisited=true;setTimeout(()=>playerQuip("Whoa… it's way cozier in here than I thought!"),1000);}}
function enterGardenFromShed(){SCENE='garden';lum.x=SHED_POS.x-40;lum.y=SHED_POS.y+42;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x;cam.y=lum.y-50;}
const SHMOTES=[];for(let i=0;i<26;i++)SHMOTES.push({x:rnd(420,960),y:rnd(120,620),ph:rnd(0,TAU),sp:rnd(.2,.6)});
function drawShed(){const im=IMG.shedroom;if(!ready(im))return;const rz=H/768*ROOMZ;
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#6f8a58';ctx.fillRect(0,0,W,H);if(SHBG){const px=(WCAM.x-(SHO+345))*.12;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(SHBG,-20-px,-20,W+40,H+40);ctx.fillStyle='rgba(30,40,24,.18)';ctx.fillRect(0,0,W,H);}
  ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz),DPR*WOFF.y);ctx.drawImage(im,0,0,1375,768);
  ctx.save();ctx.globalCompositeOperation='lighter';
  {const [x,y]=sp_(665,470);const fl=.85+.15*Math.sin(T*.7);drawGlow(ctx,x,y,120*fl,'255,235,170',.28);
    const g=ctx.createLinearGradient(x,y,x-60,y+340);g.addColorStop(0,'rgba(255,240,190,.16)');g.addColorStop(1,'rgba(255,240,190,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-30,y-40);ctx.lineTo(x+40,y-40);ctx.lineTo(x+40,y+300);ctx.lineTo(x-170,y+300);ctx.closePath();ctx.fill();}
  for(const [sx,sy,c,s] of [[230,440,'255,235,140',0],[305,445,'140,235,255',1.3],[195,575,'255,170,240',2.1],[260,575,'150,220,255',3.4],[390,680,'150,230,255',4.2],[790,600,'170,220,255',5.1]]){const [x,y]=sp_(sx,sy);drawGlow(ctx,x,y,30+5*Math.sin(T*1.7+s),c,.35+.15*Math.sin(T*1.7+s));}
  for(const m of SHMOTES){const x=m.x+Math.sin(T*m.sp+m.ph)*14,y=m.y+Math.cos(T*m.sp*.7+m.ph)*10;const tw=.5+.5*Math.sin(T*2+m.ph*3);drawGlow(ctx,x,y,4*tw+2,'255,240,200',.32*tw);}
  ctx.restore();
  {const [ax,ay]=sp_(560,1012),d=Math.hypot(lum.x-ax,lum.y-ay);if(d<160){const a=Math.max(0,1-d/160)*(.55+.25*Math.sin(T*3));ctx.save();ctx.globalAlpha=a;ctx.translate(ax,ay+Math.sin(T*3)*3);ctx.rotate(Math.PI/2);ctx.fillStyle='rgba(150,120,70,.9)';for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(-i*14,0);ctx.lineTo(12-i*14,-9);ctx.lineTo(8-i*14,0);ctx.lineTo(12-i*14,9);ctx.closePath();ctx.fill();}ctx.restore();}}
  const L_=[[lum.y,()=>{const k=shedH(lum.y)/151;ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();}]];
  for(const g of SHSLIMES)L_.push([g.y,()=>drawWellSlime(g,shedH(g.y)/151)]);
  L_.sort((a,b)=>a[0]-b[0]);for(const [,f] of L_)f();
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k=shedH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k,k);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.35,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(60,40,20,0)');vg.addColorStop(1,'rgba(60,40,20,.25)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(NIGHT.on){drawNightShade(lum.x,lum.y,.74);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='lighter';drawGlow(ctx,W*.5,H*.18,W*.5,'120,140,210',.06);ctx.restore();}
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(40,28,14,.42)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#fff3dc';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText("Lum's Garden Shed",W/2,H*.3+10);ctx.restore();}}

