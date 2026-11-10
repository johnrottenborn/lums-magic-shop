/* =====================================================================
   VANE'S HUT (inside) + MIXING AT THE FIRE (Lum only)
   ===================================================================== */
const VHW=657,VHH=768;   // world size: the painting scaled to the room height
const VHFLOOR=[[440,492],[545,492],[548,515],[495,525],[495,585],[532,605],[530,768],[262,768],[285,700],[330,630],[395,565]];
const VHVANE={x:330,y:665};
function vhutFree(x,y){return inPoly(x,y,VHFLOOR)&&Math.hypot((x-VHVANE.x)/1.6,y-VHVANE.y)>22;}
function solveVHut(px,py,nx,ny){if(vhutFree(nx,ny))return [nx,ny];if(vhutFree(nx,py))return [nx,py];if(vhutFree(px,ny))return [px,ny];return [px,py];}
const vhutH=y=>158+(clamp(y,480,768)-495)*.17;
const VHINT=[];const VHEMB=[];
function setupVHut(){VHINT.length=0;
  VHINT.push({x:400,y:768,reach:62,door:true,onInteract:()=>goScene(()=>{buildWoods();buildWoodsC1();SCENE='woods';lum.x=HUTDOOR.x+30;lum.y=HUTDOOR.y+46;lum.face=1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x+60;cam.y=lum.y-50;WTITLE.t=99;})});
  VHINT.push({x:468,y:505,reach:80,fire:true,onInteract:fireInteract});
  VHINT.push({x:VHVANE.x,y:VHVANE.y,reach:72,onInteract:()=>{if(BAG.includes('lantern')&&!C1.vaneStory){C1.vaneStory=1;talk([['Vane',"You know, there's another old story I remember. Travellers who crossed Stranglethorn followed flowers through the maze."],['Vane',"Which flowers, and where they led… that part I never heard. Not much help, I'm afraid."],['Vane',"I'll keep a lookout for the boy. If he passes this way, I'll know it."]]);return;}if(C1.charmQ===1&&(PARTY.lum.charm==='vanecharm'||BAG.includes('vanecharm'))){vaneNotice();return;}if(C1.charmQ===1){talk([['Vane',"Any sign of my lucky cross? That's what I get for feeding wildlife! Heh. They love the oak tree north of the road."]]);return;}const L=[
    [['Vane',"The fire's yours whenever you need it. Grind away."]],
    [['Vane',"Slime, bone, bramble… you'd be amazed what this graveyard coughs up after a storm."]],
    [['Vane',"Bring the boy home safe, Lum. And mind the shadows."]]];talk(L[(C1.vtalk=(C1.vtalk||0)+1)%L.length]);}});
  const L=(x,y,reach,lines)=>{let i=0;VHINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  L(330,560,70,["A ledger of every grave, with little notes. \"Liked tulips.\" \"Still owes me a coin.\"","Jars of dried herbs and grave-moss… a few of these would make lovely powders."]);
  L(288,700,64,["A wreath of garlic on the wall."]);}
function enterVHut(){SCENE='vhut';lum.x=400;lum.y=735;lum.face=1;lum.vx=lum.vy=0;lum.state='idleUp';WCAM.x=400;WTITLE.t=0;setupVHut();
  if(!C1.hutSeen){C1.hutSeen=1;setTimeout(()=>talk([['Vane',"Come in, come in."],['Vane',"Make yourself at home. The hearth's always lit. If you've got powders to grind, use the fire."],['Lum',"A warm fire and a good mortar… I could mix a few powders and potions here."]],false,()=>{GOAL.tag='TIP';GOAL.text='Mix powders & potions at a fire';HINT.goalT=0;}),900);}}
function drawVHut(){const im=IMG.vanehut;if(!ready(im))return;const [rz]=roomView();
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#1c1612';ctx.fillRect(0,0,W,H);
  ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz),0);ctx.drawImage(im,0,0,VHW,VHH);
  // hearth: a living glow, flickering light on the floor, rising embers
  ctx.save();ctx.globalCompositeOperation='lighter';const fl=.85+.1*Math.sin(T*9)+.07*Math.sin(T*23);
  drawGlow(ctx,468,440,120*fl,'255,170,80',.32);drawGlow(ctx,468,452,34*fl,'255,220,140',.55);drawGlow(ctx,470,560,150*fl,'255,170,90',.12);
  if(Math.random()<.25)VHEMB.push({x:rnd(448,490),y:452,vy:rnd(-40,-22),vx:rnd(-6,6),t:0,m:rnd(.8,1.6)});
  for(let i=VHEMB.length-1;i>=0;i--){const e=VHEMB[i];e.t+=1/60;if(e.t>e.m){VHEMB.splice(i,1);continue;}e.x+=e.vx/60+Math.sin(T*3+i)*.2;e.y+=e.vy/60;drawGlow(ctx,e.x,e.y,3,'255,190,90',.8*(1-e.t/e.m));}
  ctx.restore();
  // Vane and Lum, sorted by depth
  const k=vhutH(lum.y)/151,kv=vhutH(VHVANE.y)/151;
  const dv=()=>{ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(VHVANE.x,VHVANE.y+2,36*kv,8*kv,0,0,TAU);ctx.fill();c1Frame(ctx,'vane','idle',Math.floor(T*3),VHVANE.x,VHVANE.y+2,200*kv,lum.x>VHVANE.x,1,0);};
  const dl=()=>{ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();};
  if(lum.y<VHVANE.y){dl();dv();}else{dv();dl();}
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k2=vhutH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k2,k2);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.35,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(30,18,10,0)');vg.addColorStop(1,'rgba(20,12,24,.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(40,26,12,.42)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#fff3dc';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText("The Gravekeeper's Hut",W/2,H*.3+10);ctx.restore();}}

/* ---------- mixing ---------- */
const RECIPES=[
  {id:'potion',name:'Healing Potion',out:1,desc:'Restores 5–7 HP',need:{duskberry:2}},
  {id:'frost',name:'Frostbloom Powder',out:2,desc:'Freezes · enemy may lose a turn',need:{dewberry:1,slimeparts:1}},
  {id:'thorn',name:'Thornbane Powder',out:2,desc:'Weakens enemy attacks',need:{emberberry:1,thornsprig:1}},
  {id:'moon',name:'Moonmint Powder',out:2,desc:'Calms · strong vs undead',need:{moonleaf:2,boneparts:1}}];
const MIX={on:false,sel:0,hits:[],flash:0,msg:'',msgT:0};
function canLumMix(){return HERO==='lum'&&CH>0;}
function fireInteract(){if(!canLumMix()){say("The fire crackles happily.");return;}askChoice("Mix?",[["Yes",openMix],["No",()=>{}]]);}
function openMix(){MIX.on=true;MIX.sel=0;MIX.msg='';MIX.msgT=0;sfxPage&&sfxPage(.7);}
function closeMix(){MIX.on=false;CHOICE.until=performance.now()+300;sfxPage&&sfxPage(.5);}
const haveMat=id=>MATS[id]||0;
const haveOut=r=>r.id==='potion'?BAG.filter(b=>b==='potion').length:POWDERS[r.id]||0;
const mixOk=r=>Object.entries(r.need).every(([k,n])=>haveMat(k)>=n);
function doMix(i){const r=RECIPES[i];if(!r)return;if(!mixOk(r)){MIX.msg="Not enough ingredients.";MIX.msgT=2;MIX.bad=1;sfxPage&&sfxPage(.3);return;}
  for(const [k,n] of Object.entries(r.need)){MATS[k]-=n;if(MATS[k]<=0){delete MATS[k];const j=BAG.indexOf(k);if(j>=0)BAG.splice(j,1);}}
  if(r.id==='potion'){for(let q=0;q<r.out;q++)BAG.push('potion');}else POWDERS[r.id]=(POWDERS[r.id]||0)+r.out;
  STATS.mixed=(STATS.mixed||0)+r.out;MIX.flash=1;MIX.fx=i;MIX.msg=`Mixed ${r.out>1?r.out+'× ':''}${r.name}!`;MIX.msgT=2.2;MIX.bad=0;if(typeof SAVEC!=='undefined')SAVEC.t=99;
  if(SND.ready){const t=SND.ctx.currentTime;noiseHit(t,.18,'bandpass',900,2,.25,SND.sfx);noiseHit(t+.12,.18,'bandpass',1300,2,.2,SND.sfx);noiseHit(t+.24,.25,'highpass',3000,1,.18,SND.sfx);}sfxItem&&setTimeout(()=>sfxItem(),280);}
function mixKey(c){const n=RECIPES.length;if(c==='ArrowUp'||c==='KeyW')MIX.sel=(MIX.sel+n)%(n+1);else if(c==='ArrowDown'||c==='KeyS')MIX.sel=(MIX.sel+1)%(n+1);
  else if(c==='Enter'||c==='Space'||c==='KeyE'||c==='KeyK'){if(MIX.sel===n)closeMix();else doMix(MIX.sel);}else if(c==='Escape'||c==='KeyI'||c==='Tab')closeMix();}
function mixTap(x,y){for(const h of MIX.hits)if(x>h.x&&x<h.x+h.w&&y>h.y&&y<h.y+h.h){h.act();return;}}
const MATNAME={slimeparts:'Slime',boneparts:'Bone',thornsprig:'Thorn',duskberry:'Dusk',dewberry:'Dew',emberberry:'Ember',moonleaf:'Moonmint'};
function drawMortar(c,x,y,s){{const im=IMG.icon3_mortar_clay;if(ready(im)){const z=26*s;c.drawImage(im,x-z/2,y-z/2-1,z,z);return;}}c.save();c.translate(x,y);c.scale(s,s);c.lineJoin='round';c.lineCap='round';
  c.strokeStyle='#6a4a2a';c.lineWidth=2.4;c.beginPath();c.moveTo(1,-1);c.lineTo(9,-12);c.stroke();c.fillStyle='#b08a5a';c.beginPath();c.arc(9.5,-12.5,2.6,0,TAU);c.fill();c.stroke();
  c.fillStyle='#8f9aa8';c.strokeStyle='#3e4450';c.lineWidth=1.6;c.beginPath();c.moveTo(-9,-2);c.lineTo(9,-2);c.quadraticCurveTo(8,8,0,8);c.quadraticCurveTo(-8,8,-9,-2);c.closePath();c.fill();c.stroke();
  c.fillStyle='#5e6876';c.beginPath();c.ellipse(0,-2,9,2.4,0,0,TAU);c.fill();c.stroke();c.fillStyle='#a7d690';c.beginPath();c.ellipse(0,-2.2,6,1.4,0,0,TAU);c.fill();
  c.fillStyle='#3e4450';c.fillRect(-4,7.5,8,2.2);c.restore();}
function drawResultIcon(r,x,y){if(r.id==='potion'){drawIcon(ctx,'potion',x,y,30);return;}if(drawPowderIcon(ctx,r.id,x,y,36))return;ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y,16,PCOL[r.id],.7);ctx.restore();ctx.fillStyle=`rgb(${PCOL[r.id]})`;ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();}
function drawMix(){if(!MIX.on)return;MIX.hits=[];const dt=1/60;MIX.flash=Math.max(0,MIX.flash-dt*2);MIX.msgT=Math.max(0,MIX.msgT-dt);
  ctx.save();ctx.fillStyle='rgba(10,8,6,.5)';ctx.fillRect(0,0,W,H);
  const n=RECIPES.length,rh=62,w=Math.min(W-28,370),h=86+n*(rh+8)+58,x=(W-w)/2,y=Math.max(14,(H-h)/2);
  ctx.fillStyle='rgba(20,10,10,.3)';rr(x+2,y+4,w,h,16);ctx.fill();ctx.fillStyle='#f6ecd2';rr(x,y,w,h,16);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.5;ctx.stroke();
  drawMortar(ctx,x+30,y+34,1.25);ctx.fillStyle='#4a3420';ctx.textAlign='left';ctx.font='700 19px "Alegreya SC", Georgia, serif';ctx.fillText('Mixing',x+50,y+32);
  ctx.font='italic 12px Alegreya, Georgia, serif';ctx.fillStyle='#7a6040';ctx.fillText('Grind parts into powders and potions',x+50,y+49);
  RECIPES.forEach((r,i)=>{const yy=y+70+i*(rh+8),ok=mixOk(r),sel=!TOUCHUI()&&MIX.sel===i;
    ctx.fillStyle=MIX.fx===i&&MIX.flash>0?`rgba(240,200,110,${(.25+.4*MIX.flash).toFixed(3)})`:'rgba(120,86,40,.12)';rr(x+12,yy,w-24,rh,11);ctx.fill();if(sel){ctx.strokeStyle='#e0a83a';ctx.lineWidth=2;ctx.stroke();}
    drawResultIcon(r,x+36,yy+rh/2);ctx.textAlign='left';ctx.fillStyle='#4a3420';ctx.font='700 14px "Alegreya SC", Georgia, serif';ctx.fillText(r.name+(r.out>1?' ×'+r.out:''),x+60,yy+20);
    ctx.font='italic 11.5px Alegreya, Georgia, serif';ctx.fillStyle='#7a6040';ctx.fillText(r.desc,x+60,yy+35);
    let ix=x+60;ctx.font='700 11px "Alegreya SC", Georgia, serif';for(const [k,q] of Object.entries(r.need)){const has=haveMat(k);drawIcon(ctx,k,ix+7,yy+49,15);ctx.fillStyle=has>=q?'#4f7a3a':'#b04a3a';const t=`${MATNAME[k]} ${Math.min(has,q)}/${q}`;ctx.fillText(t,ix+17,yy+53);ix+=ctx.measureText(t).width+30;}
    const bw=58,bh=30,bx=x+w-24-bw,by=yy+(rh-bh)/2;ctx.globalAlpha=ok?1:.4;const g=ctx.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,'#e8b85a');g.addColorStop(1,'#b07a2a');ctx.fillStyle=g;rr(bx,by,bw,bh,10);ctx.fill();ctx.strokeStyle='#5a3a14';ctx.lineWidth=1.3;ctx.stroke();
    ctx.fillStyle='#fffaf0';ctx.textAlign='center';ctx.font='700 14px "Alegreya SC", Georgia, serif';ctx.fillText('MIX',bx+bw/2,by+20);ctx.globalAlpha=1;
    ctx.textAlign='right';ctx.fillStyle='#8a6a42';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.fillText('HAVE ×'+haveOut(r),bx-8,yy+20);
    MIX.hits.push({x:x+12,y:yy,w:w-24,h:rh,act:()=>{MIX.sel=i;doMix(i);}});});
  const dy=y+h-46,dw=120,dx=(W-dw)/2,dsel=!TOUCHUI()&&MIX.sel===n;const g=ctx.createLinearGradient(0,dy,0,dy+34);g.addColorStop(0,'#b8a68a');g.addColorStop(1,'#8a7a62');ctx.fillStyle=g;rr(dx,dy,dw,34,11);ctx.fill();ctx.strokeStyle=dsel?'#fff4d0':'#5a3a14';ctx.lineWidth=dsel?2.5:1.3;ctx.stroke();
  ctx.fillStyle='#fffaf0';ctx.textAlign='center';ctx.font='700 15px "Alegreya SC", Georgia, serif';ctx.fillText('Done',W/2,dy+22);MIX.hits.push({x:dx,y:dy,w:dw,h:34,act:closeMix});
  if(MIX.msgT>0){ctx.globalAlpha=Math.min(1,MIX.msgT*2);ctx.font='italic 600 13px Alegreya, Georgia, serif';ctx.fillStyle=MIX.bad?'#b04a3a':'#4f7a3a';ctx.fillText(MIX.msg,W/2,dy-9);ctx.globalAlpha=1;}
  if(!TOUCHUI()){ctx.font='10px Alegreya, Georgia, serif';ctx.fillStyle='rgba(255,243,220,.75)';ctx.fillText('↑↓ choose · Enter mix · Esc close',W/2,y+h+18);}
  ctx.restore();}

