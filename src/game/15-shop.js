/* =====================================================================
   INSIDE LUM'S MAGIC SHOP
   ===================================================================== */
const SHOPFLOOR=[[40,668],[338,658],[338,545],[625,505],[1090,500],[1200,545],[1295,548],[1300,600],[1218,622],[1218,750],[40,750]];
const SHOPOBST=[{x0:648,x1:1088,y0:430,y1:702},{x0:628,x1:648,y0:430,y1:600},{x0:340,x1:600,y0:670,y1:800},{x0:414,x1:480,y0:490,y1:566},{x0:428,x1:558,y0:470,y1:530},{x0:1100,x1:1212,y0:530,y1:610}];
function shopFree(x,y){if(!inPoly(x,y,SHOPFLOOR))return false;for(const o of SHOPOBST)if(x>o.x0&&x<o.x1&&y>o.y0&&y<o.y1)return false;return true;}
function solveShop(px,py,nx,ny){if(shopFree(nx,ny))return [nx,ny];if(shopFree(nx,py))return [nx,py];if(shopFree(px,ny))return [px,ny];return [px,py];}
const shopH=y=>192+(clamp(y,460,768)-500)*.3;
const SHOPCOUNTER=[[626,482],[650,468],[800,470],[860,464],[905,469],[1000,468],[1086,470],[1102,500],[1092,704],[648,704],[630,560]];
const SHOPOCC=[{base:9999,x0:345,poly:[[338,768],[338,702],[392,668],[428,630],[500,617],[560,638],[612,645],[662,660],[718,684],[800,690],[915,690],[920,768]]}];
const SHOPINT=[];let shopTalk=0,restTalk=false,shopDoor={x:0,y:52};
const SHOPLUM={x:885,y:520,face:1,walking:false,ft:0,wait:3,tgt:null,talkFace:false};
const SHOPSPOTS=[[720,468],[880,468],[1035,468]];
const SHOPFX=[];
const healRoll=it=>Array.isArray(it.heal)?it.heal[0]+Math.floor(Math.random()*(it.heal[1]-it.heal[0]+1)):it.heal;
function lumTalk(){if(CH===1){say(["The shop feels so quiet without Cosmic chattering away.","His apron is still hanging by the counter. He never once remembered to wear it.","The jars are all where they should be. Everything is, except him."][(shopTalk++)%3]);return;}if(NIGHT.on){say("The counter's empty. Master Lum is still asleep… I need to be quiet.");return;}SHOPLUM.walking=false;SHOPLUM.tgt=null;
  if(BAG.includes('blade')&&!restTalk){talk([['Lum',"Welcome back, Cosmic. So… how did it go with the slimes and slugs?"],
      ['Cosmic',"I've been chasing slimes and slugs all day, Master! Through the garden, under the well… places I never even knew were here!"],
      ['Cosmic',"And you know what? This is the first time chores have ever felt like an adventure."],
      ['Cosmic',"I want to be a real adventurer someday. A powerful one!"],
      ['Lum',"An adventurer, hm? …Every great journey starts with muddy boots and a few sticky slimes."],
      ['Lum',"If that's the road you want, then I'll help you walk it. One step at a time."],
      ['Lum',"You worked hard today, Cosmic. You deserve a good rest."]],false,()=>{restTalk=true;GOAL.tag='TASK';GOAL.text='You\'ve earned a good rest';HINT.goalT=0;});return;}
  if(!BAG.includes('potion')){const n=1+(Math.random()<.5?1:0);
    talk([['Lum',"No healing potion in that satchel of yours? Here, take "+(n>1?"a couple of these.":"one of these.")],['Lum',"Healing Potion, brewed fresh this morning. Drink one whenever you're hurt…"],['Lum',"It'll mend five to seven hearts' worth. Sip it, don't gulp it. I'm looking at you."]],false,()=>{for(let i=0;i<n;i++)giveItem('potion');});return;}
  if(!BAG.includes('blade')&&PARTY.cosmic.main!=='blade'){talk([['Lum',"Still hunting, Cosmic? Don't give up just yet."],['Lum',"Use your imagination! Slimes could be hiding anywhere."],['Lum',"Some of them tuck themselves away in the hardest places to find. Peek into the corners nobody else bothers with."],['Cosmic',"Hard-to-find places… got it, Master! I'll keep searching!"]]);return;}
  if(restTalk&&!NIGHT.on){talk([['Lum',["Still up? Big days call for big rests, little adventurer.","Your bed's been made since this morning. It looks awfully cozy.","Even heroes in storybooks sleep, you know. Usually right before the exciting part.","Go on, put your feet up. You've more than earned it."][(shopTalk++)%4]]]);return;}
  talk([['Lum',["Please don't lean on the counter. It remembers.","The jars on the top shelf are not for touching. Or looking at too long.","If the still starts humming a tune, that's normal. If it starts singing words, come get me.","Did you wipe your boots? The floor sulks when it's muddy."][(shopTalk++)%4]]]);}
function setupShop(){SHOPINT.length=0;
  SHOPINT.push({x:857,y:560,reach:270,lum:1,onInteract:lumTalk});
  SHOPINT.push({x:205,y:740,reach:62,onInteract:()=>goScene(()=>enterGardenFromShop())});
  SHOPINT.push({x:1252,y:578,reach:70,onInteract:()=>{if(!restTalk){say("That's my bedroom. I'm not even a little bit sleepy! I should check in with Master Lum first.");return;}
    goScene(()=>enterBedroom());}});
  const L=(x,y,reach,lines)=>{let i=0;SHOPINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  L(380,560,85,["Master Lum's grinder. The green powder smells like a thunderstorm in a meadow.","Every powder in this shop starts right here, one slow turn at a time."]);
  if(canLumMix())SHOPINT.push({x:470,y:545,reach:70,fire:true,onInteract:fireInteract});else L(470,545,70,["The little stove never goes out. Master says the fire is older than me. It purrs if you're nice to it."]);
  L(560,520,70,["The big brass still is bubbling away. Every so often it hiccups a tiny cloud shaped like a rabbit."]);
  L(1150,560,70,["A globe of the whole world. Our shop is a teeny dot right at the very edge. Past it, the map just says… 'Here be quiet.'"]);
  L(1250,700,80,["A clockwork owl on the desk. It blinks when nobody's watching. I'm sure of it."]);
  L(260,700,70,["Sacks and sacks of powders: sleep dust, glow dust, sneeze dust… I learned the hard way which is which."]);}
function enterShop(door){SCENE='shop';shopDoor=door||shopDoor;lum.x=300;lum.y=700;lum.face=1;lum.vx=lum.vy=0;lum.state='idleUp';WCAM.x=500;WTITLE.t=0;setupShop();
  SHOPLUM.x=885;SHOPLUM.y=520;SHOPLUM.walking=false;SHOPLUM.wait=2;}
function enterGardenFromShop(){SCENE='garden';lum.x=shopDoor.x;lum.y=shopDoor.y;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x;cam.y=lum.y-50;}
function tryEnterShop(door){if(PARTY[HERO].main==='blade'){talk([['Cosmic',"Wait! I can't let Master Lum see this sword…"],['Cosmic',"I'd better tuck it away in my satchel before I go inside."]]);return;}goScene(()=>{enterShop(door);if(door&&door.x!==0){lum.x=1150;lum.y=640;lum.face=-1;lum.state='idle';}});}
function updateShopLum(dt){const L=SHOPLUM;const talking=DLG.active&&DLG.lines.some(l=>l[0]==='Lum');L.walking=false;
  if(talking){L.back=0;return;}
  L.wait-=dt;if(L.wait<=0){if(L.back){L.back=0;L.wait=rnd(3,6);}else{L.back=1;L.wait=rnd(1.6,2.6);
    for(let i=0;i<12;i++)SHOPFX.push({x:L.x+rnd(-70,70),y:rnd(250,420),vy:-rnd(8,20),t:0,max:rnd(1,2),c:Math.random()<.5?'255,230,160':'200,180,255'});}}
  for(let i=SHOPFX.length-1;i>=0;i--){const f=SHOPFX[i];f.t+=dt;f.y+=f.vy*dt;if(f.t>f.max)SHOPFX.splice(i,1);}}
function drawShopLum(){const L=SHOPLUM;if(!ready(atlas))return;const k=shopH(L.y)/151,fr=L.back?22:37,dw=FW*SPR*k,dh=FH*SPR*k;
  ctx.save();ctx.translate(L.x,L.y+3);if(L.walking&&L.face<0)ctx.scale(-1,1);if(!L.walking){const b=Math.sin(T*2.3);ctx.scale(1-.004*b,1+.009*b);}
  ctx.drawImage(atlas,fr*FW,0,FW,FH,-dw/2,-dh*(274/280),dw,dh);ctx.restore();
  const im=IMG.shoproom;ctx.save();ctx.beginPath();SHOPCOUNTER.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();ctx.drawImage(im,0,0,1375,768);ctx.restore();}
const SHOPMOTES=[];for(let i=0;i<40;i++)SHOPMOTES.push({x:rnd(380,900),y:rnd(60,600),ph:rnd(0,TAU),sp:rnd(.2,.5)});
function drawShop(){const im=IMG.shoproom;if(!ready(im))return;const [rz,oy]=roomView();
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#2a2018';ctx.fillRect(0,0,W,H);
  {const top=oy+2;if(top>0){const hh=Math.min(768,top/rz+4);ctx.save();ctx.translate(W/2-WCAM.x*rz,top);ctx.scale(rz,-rz);ctx.drawImage(im,0,0,1375,hh,0,0,1375,hh);ctx.restore();const g=ctx.createLinearGradient(0,0,0,top);g.addColorStop(0,'rgba(24,16,10,.94)');g.addColorStop(1,'rgba(24,16,10,.35)');ctx.fillStyle=g;ctx.fillRect(0,0,W,top);}}
  ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz),DPR*(oy+WOFF.y));ctx.drawImage(im,0,0,1375,768);
  ctx.save();ctx.globalCompositeOperation='lighter';
  // the sunbeam through the tall window, breathing slowly
  {const a=.07+.03*Math.sin(T*.5);const g=ctx.createLinearGradient(420,40,760,600);g.addColorStop(0,`rgba(255,236,180,${a*2})`);g.addColorStop(1,'rgba(255,236,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(390,30);ctx.lineTo(560,20);ctx.lineTo(920,600);ctx.lineTo(640,640);ctx.closePath();ctx.fill();}
  for(const m of SHOPMOTES){const x=m.x+Math.sin(T*m.sp+m.ph)*16,y=m.y+Math.cos(T*m.sp*.7+m.ph)*10;const tw=.5+.5*Math.sin(T*2+m.ph*3);drawGlow(ctx,x,y,4*tw+2,'255,238,190',.35*tw);}
  // stove fire flickers, the still glows, crystal jars and potions shimmer
  const fl=s=>.75+.15*Math.sin(T*9+s)+.1*Math.sin(T*23+s*3);
  drawGlow(ctx,505,400,60*fl(0),'255,150,60',.4);drawGlow(ctx,505,410,30,'255,210,120',.35*fl(1));
  drawGlow(ctx,355,320,90,'255,200,120',.12+.05*Math.sin(T*1.3));
  for(const [x,y,c,s] of [[1035,315,'200,150,255',0],[1092,318,'140,230,255',1.3],[800,320,'150,255,190',2.1],[930,235,'230,160,255',3.2],[1060,232,'255,170,210',4.1],[780,235,'170,220,255',5],[985,225,'190,255,170',6.2],[860,232,'255,210,140',7.1]]){drawGlow(ctx,x,y,24+4*Math.sin(T*1.8+s),c,.28+.14*Math.sin(T*1.8+s));}
  for(let i=0;i<8;i++){const tw=Math.pow(Math.max(0,Math.sin(T*1.5+i*2.7)),8);if(tw>.05)drawGlow(ctx,700+((i*173)%420),150+((i*91)%280),9,'255,255,255',tw);}
  // grinder powder sparkles, bubbles in the still
  for(let i=0;i<4;i++){const t=(T*.6+i/4)%1;drawGlow(ctx,165+Math.sin(i*2+T)*14,438-t*40,5,'180,255,170',(1-t)*.7);}
  ctx.restore();
  // little steam puffs from the stove pot and the still
  for(let i=0;i<6;i++){const t=(T*.25+i/6)%1,x=(i%2?530:432)+Math.sin(T+i)*8+t*10,y=(i%2?330:205)-t*90;drawGlow(ctx,x,y,10+t*22,'240,238,232',(1-t)*Math.min(1,t*4)*.3);}
  for(const f of SHOPFX){const a=Math.sin(Math.PI*f.t/f.max);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,f.x,f.y,7,f.c,a*.8);ctx.restore();}
  // exit arrow at the front of the shop
  {const d=Math.hypot(lum.x-205,lum.y-740);if(d<170){const a=Math.max(0,1-d/170)*(.55+.25*Math.sin(T*3));ctx.save();ctx.globalAlpha=a;ctx.translate(205,752+Math.sin(T*3)*3);ctx.rotate(Math.PI/2);ctx.fillStyle='rgba(255,226,160,.9)';for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(-i*14,0);ctx.lineTo(12-i*14,-9);ctx.lineTo(8-i*14,0);ctx.lineTo(12-i*14,9);ctx.closePath();ctx.fill();}ctx.restore();}}
  const L_=[[lum.y,()=>{const k=shopH(lum.y)/151;ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();}],[SHOPLUM.y,()=>{if(!NIGHT.on&&CH===0)drawShopLum();}]];
  for(const o of SHOPOCC){const ys=[lum.y,SHOPLUM.y];if(!ys.some(v=>v<o.base))continue;L_.push([o.x0!==undefined&&lum.x<o.x0?lum.y-1:o.base,()=>{ctx.save();ctx.beginPath();if(o.r)ctx.rect(...o.r);else{o.poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}ctx.clip();ctx.drawImage(im,0,0,1375,768);ctx.restore();}]);}
  L_.sort((a,b)=>a[0]-b[0]);for(const [,f] of L_)f();
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k=shopH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k,k);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  {const g=ctx.createLinearGradient(0,oy-4,0,oy+34);g.addColorStop(0,'rgba(24,16,10,.55)');g.addColorStop(1,'rgba(24,16,10,0)');ctx.fillStyle=g;ctx.fillRect(0,oy-4,W,38);}
  if(NIGHT.on)drawNightShade(lum.x,lum.y,.62);
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.35,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(50,30,15,0)');vg.addColorStop(1,'rgba(50,30,15,.3)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(40,26,12,.42)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#fff3dc';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText("Lum's Magic Shop",W/2,H*.3+10);ctx.restore();}}

