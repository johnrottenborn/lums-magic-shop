/* =====================================================================
   CHAPTER 1 OPENING: the morning after, in the garden (mini cutscene)
   ===================================================================== */
const C1I={on:false,t:0,st:0,w:0,evil:0,leafT:0,skipHit:null};
function c1Talk(lines,next){talk(lines,false,()=>{C1I.st=next;C1I.w=0;});C1I.st=-1;}
function c1IntroStart(){C1I.on=true;C1I.titled=0;C1I.t=0;C1I.st=0;C1I.w=0;C1I.evil=0;C1I.leafT=0;WEVENT.on=true;SCENE='garden';
  lum.x=0;lum.y=4;lum.face=1;lum.state='idle';lum.vx=lum.vy=0;lum.alpha=0;INTRO.ui=0;HINT.goalT=99;GOAL.tag='';GOAL.text='';
  const vh=H/zoom;cam.x=20;cam.y=1700-vh/2;resetForage();}
function c1Walk(tx,ty,sp,dt){const dx=tx-lum.x,dy=ty-lum.y,d=Math.hypot(dx,dy);if(d<3){lum.x=tx;lum.y=ty;return true;}const m=Math.min(d,sp*dt);lum.x+=dx/d*m;lum.y+=dy/d*m;
  lum.state=dy>Math.abs(dx)?'walkDown':'walk';if(Math.abs(dx)>4)lum.face=dx<0?-1:1;const a=ANIM[lum.state];C1I.ft=(C1I.ft||0)+dt*a.fps*(sp/95);lum.fi=Math.floor(C1I.ft)%a.frames.length;return false;}
function c1Idle(){lum.state='idle';lum.fi=0;}
function c1Leaves(n){for(let i=0;i<n;i++)PARTS.push({type:'bpetal',x:lum.x+rnd(-260,260),y:lum.y+rnd(-520,-80),z:rnd(30,110),vx:rnd(-25,25),vy:rnd(150,240),vz:-rnd(6,12),life:0,max:rnd(3,4.5),s:rnd(3.4,5.4),rot:rnd(0,TAU),vr:rnd(-7,7),col:['#9a7448','#b08a52','#7d5c38','#c2a066','#8e6a3c'][(Math.random()*5)|0],leaf:1});}
function sfxGust(){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,2.8,'bandpass',380,.7,.32,SND.sfx,1300);noiseHit(t+.4,2.2,'bandpass',900,1.2,.16,SND.sfx,420);}
function updateC1Intro(dt){C1I.t+=dt;C1I.w+=dt;INTRO.ui=0;C1I.evil=Math.max(0,C1I.evil-dt*.45);const vh=H/zoom,top=BACK.y+vh/2;
  if(C1I.leafT>0){C1I.leafT-=dt;if(Math.random()<dt*22)c1Leaves(1);}
  switch(C1I.st){
    case 0:{// the camera climbs the path to the shop
      const bot=1700-vh/2,end=clamp(14,top,1700-vh/2),k=ease((C1I.t-.8)/6.2);cam.x=20;cam.y=bot+(end-bot)*k;
      if(C1I.t>1&&!C1I.titled){C1I.titled=1;C1.title=.001;}
      if(C1I.t>7.4){C1I.st=1;C1I.w=0;sfxPage&&sfxPage(.8);for(let i=0;i<14;i++)PARTS.push({type:'fdust',x:rnd(-22,22),y:6,z:rnd(10,110),vx:rnd(-8,8),vy:rnd(-2,4),vz:-rnd(4,16),life:0,max:rnd(.6,1.3),s:rnd(1,2),col:'255,226,170'});}break;}
    case 1:{lum.alpha=Math.min(1,C1I.w*3);if(c1Walk(0,70,70,dt)){c1Idle();lum.face=1;c1Talk([['Lum',"Good morning, Cosmic!"]],2);}break;}
    case 2:{c1Idle();if(C1I.w>1.6){C1I.st=3;C1I.w=0;}break;}
    case 3:{if(c1Walk(10,520,95,dt)){c1Idle();c1Talk([['Lum',"Cosmic! Your breakfast is getting cold!"]],4);}break;}
    case 4:{c1Idle();if(C1I.w>1.3)c1Talk([['Lum',"Cosmic!"]],5);break;}
    case 5:{c1Idle();lum.face=C1I.w<.5?-1:1;if(C1I.w>1.1)c1Talk([['Lum',"Cosmic?"]],6);break;}
    case 6:{if(c1Walk(12,880,70,dt)){c1Idle();c1Talk([['Lum',"I wonder if he's on another adventure…"]],7);}break;}
    case 7:{c1Idle();if(C1I.w<dt*1.5){sfxGust();C1I.leafT=3.2;c1Leaves(10);}if(C1I.w>1.7){C1I.st=8;C1I.w=0;}break;}
    case 8:{if(c1Walk(14,1450,205,dt)){c1Idle();lum.face=1;C1I.st=9;C1I.w=0;C1I.evil=1;sfxEerie&&sfxEerie();shake=3;}break;}
    case 9:{c1Idle();if(C1I.w>1)c1Talk([['Lum',"My hedges… what could have done this?"]],10);break;}
    case 10:{c1Idle();if(C1I.w>.6)c1Talk([['Lum',"COSMIC!"]],11);break;}
    case 11:{c1Idle();if(C1I.w>2.6){C1I.st=12;}break;}
    case 12:{c1IntroEnd();break;}}}
function c1IntroEnd(){C1I.on=false;C1I.st=99;WEVENT.on=false;lum.alpha=1;C1.hedgeSeen=1;C1.introDone=1;GOAL.tag='NEW TASK';GOAL.text='Search for your missing apprentice, Cosmic';HINT.goalT=0;if(typeof SAVEC!=='undefined')SAVEC.t=99;}
function skipC1Intro(){if(!C1I.on)return;DLG.active=false;DLG.onEnd=null;DLG.withCosmic=false;C1.title=0;lum.x=14;lum.y=1450;lum.face=1;c1Idle();const vh=H/zoom;cam.x=lum.x;cam.y=clamp(lum.y-50,BACK.y+vh/2,1700-vh/2);c1IntroEnd();}
function drawC1IntroUI(){if(C1I.evil>0){const a=C1I.evil;ctx.save();const g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.25,W/2,H/2,Math.max(W,H)*.7);g.addColorStop(0,'rgba(60,0,10,0)');g.addColorStop(1,`rgba(70,4,18,${(.55*a).toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
  if(!C1I.on){C1I.skipHit=null;return;}const x=W-16,y=58;ctx.save();ctx.font='700 13px "Alegreya SC", Georgia, serif';ctx.textAlign='right';const t=TOUCHUI()?'Skip ›':'Skip ›  (Esc)',w=ctx.measureText(t).width+20;
  ctx.fillStyle='rgba(20,16,30,.35)';rr(x-w,y-15,w,26,13);ctx.fill();ctx.fillStyle='rgba(255,250,235,.9)';ctx.fillText(t,x-10,y+3);ctx.restore();C1I.skipHit={x:x-w,y:y-15,w,h:26};}

/* ---------- foraging in Lum's garden ---------- */
const FORAGE_MAP={6:'duskberry',0:'dewberry',4:'emberberry'};
const FORAGE=[],WFORAGE=[];let forageBuilt=false;
const LUMSHR=["Dewleaf. Its berries hold the morning's chill.","Sighbush. Cosmic swears it says hello to him. It's never said a word to me.","Cloudtier blossoms. Dried, they make a powder lighter than air.","Silvermint. One leaf in the kettle and the whole shop smells like spring.","Emberberries, warm as a hearth.","Heartvine. Cosmic keeps trying to make me a friendship charm from it.","Duskberries. They ripen best after a stormy night.","Starjuniper. Blue berries for seeing in the dark, red ones for courage.","Sugarplum spruce. Someone's been nibbling the pink berries again. I know who.","Lanternpine. Cosmic's favorite. He says the berries glow like tiny lanterns.","Whisperbranch. I promised Cosmic a wand from these twigs someday.","Rubyclover. It stains everything. Especially apprentices' sleeves."];
const LUMHERB={lavender:"Lavender, for calm sleep. I could use some after last night.",rosemary:"Rosemary, for remembering. If only it helped me remember why that cut felt so familiar.",sage:"Silver sage. It smells like rain and old books.",mint:"Moonmint.",magic:"Bellglow blossoms. Pick one and its light goes out, so I never do."};
function buildForage(){if(forageBuilt)return;forageBuilt=true;
  for(const o of ESTATE){if(o.t!=='shrub'||Math.abs(o.x)>930||o.y>1540)continue;const id=FORAGE_MAP[o.k];if(id)FORAGE.push({x:o.x,y:o.y,id,n:2,picked:0});}
  for(const r of ROWS)if(r.kind==='mint')FORAGE.push({x:r.ax+r.d[0]*r.L*.5,y:r.ay+4,id:'moonleaf',n:2,picked:0,herb:1});
  // give Lum her own words for the garden (the prologue keeps Cosmic's)
  for(const o of INTERACTABLES){if(o.door||o.hedgeDoor||o.c1)continue;const sh=ESTATE.find(e=>e.t==='shrub'&&Math.abs(e.x-o.x)<1&&Math.abs(e.y-o.y)<1);
    const row=!sh&&ROWS.find(r=>Math.abs(r.ax+r.d[0]*20-o.x)<1&&Math.abs(r.ay+4-o.y)<1);if(!sh&&!row)continue;const orig=o.onInteract,line=sh?(sh.drained?"The slimes drained this one of its magic. With a little time and care, it'll bloom again.":LUMSHR[sh.k]):LUMHERB[row.kind];if(!line)continue;o.onInteract=()=>{if(CH>0)say(line);else orig();};}
  for(const f of FORAGE)INTERACTABLES.push({x:f.x,y:f.y,reach:f.herb?62:76,lum:true,c1:1,forage:f,onInteract:()=>{if(CH>0)pickForage(f);else{const o=INTERACTABLES.find(q=>q!==this&&!q.c1&&Math.hypot(q.x-f.x,q.y-f.y)<2);o&&o.onInteract();}}});}
function resetForage(){buildForage();for(const f of FORAGE)f.picked=0;}
const FORAGE_LINE={duskberry:"Plump duskberries.",dewberry:"Dewberries, still cold with morning dew.",emberberry:"Emberberries, warm as a little hearth.",moonleaf:"Fresh moonmint leaves."};
function pickForage(f){if(f.picked){say(["I've picked this one clean. More will grow soon.","Nothing left to pick here for now."][(sayCount++)%2]);return;}
  f.picked=1;MATS[f.id]=(MATS[f.id]||0)+f.n;if(!BAG.includes(f.id))BAG.push(f.id);TOAST.t=0;TOAST.name=`${ITEMS[f.id].name} ×${f.n}`;TOAST.id=f.id;MENU.newItems++;sfxItem&&sfxItem();if(typeof SAVEC!=='undefined')SAVEC.t=99;
  for(let i=0;i<10;i++)PARTS.push({type:'fdust',x:f.x+rnd(-24,24),y:f.y,z:rnd(20,70),vx:rnd(-10,10),vy:rnd(-4,4),vz:rnd(10,30),life:0,max:rnd(.5,1),s:rnd(1,2),col:'255,240,190'});
  C1.forageTip=1;}
function drawForage(list=FORAGE){if(CH<1||C1I.on)return;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const f of list){if(f.picked)continue;if(Math.abs(f.x-cam.x)>W/zoom/2+60||Math.abs(f.y-cam.y)>H/zoom/2+120)continue;
    for(let i=0;i<3;i++){const ph=T*1.6+i*2.1+f.x*.01,a=Math.max(0,Math.sin(ph));const gx=f.x+Math.cos(i*2.3+f.y)*(f.herb?26:22),gy=f.y-(f.herb?10:30)-Math.sin(i*1.7+f.x)*14;drawGlow(ctx,gx,gy,16,'255,226,140',.8*a);ctx.save();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;ctx.fillStyle='#fffbe6';const r=7*a+2;ctx.beginPath();ctx.moveTo(gx,gy-r);ctx.quadraticCurveTo(gx,gy,gx+r,gy);ctx.quadraticCurveTo(gx,gy,gx,gy+r);ctx.quadraticCurveTo(gx,gy,gx-r,gy);ctx.quadraticCurveTo(gx,gy,gx,gy-r);ctx.fill();ctx.restore();}}
  ctx.restore();}

/* ---------- ingredient icons (drawn in code) ---------- */
const FORAGE_IC={duskberry:['92,52,120','150,104,190'],dewberry:['70,120,190','150,200,240'],emberberry:['200,70,40','255,160,90'],moonleaf:1};
function drawForageIcon(c,id,x,y,s){c.save();c.translate(x,y);c.lineJoin='round';
  if(id==='moonleaf'){for(const [a,l] of [[-.5,.42],[.15,.46],[.75,.38]]){c.save();c.rotate(a);c.beginPath();c.moveTo(0,s*.18);c.quadraticCurveTo(s*.2,-s*l*.4,0,-s*l);c.quadraticCurveTo(-s*.2,-s*l*.4,0,s*.18);c.closePath();
      const g=c.createLinearGradient(0,-s*l,0,s*.18);g.addColorStop(0,'#c8ecc4');g.addColorStop(1,'#5f9a6a');c.fillStyle=g;c.fill();c.strokeStyle='#355c40';c.lineWidth=Math.max(1,s*.03);c.stroke();
      c.strokeStyle='rgba(53,92,64,.6)';c.beginPath();c.moveTo(0,s*.12);c.lineTo(0,-s*l*.8);c.stroke();c.restore();}
    c.fillStyle='rgba(235,245,255,.9)';c.beginPath();c.arc(s*.2,-s*.22,s*.05,0,TAU);c.fill();c.restore();return;}
  const [d,l]=FORAGE_IC[id];c.strokeStyle='#4a6a34';c.lineWidth=Math.max(1,s*.04);c.beginPath();c.moveTo(0,-s*.12);c.quadraticCurveTo(s*.05,-s*.32,s*.16,-s*.4);c.stroke();
  c.fillStyle='#6f9a4a';c.beginPath();c.ellipse(s*.2,-s*.38,s*.13,s*.06,-.5,0,TAU);c.fill();
  for(const [bx,by,r] of [[-s*.16,s*.06,.17],[s*.15,s*.08,.16],[0,-s*.08,.17],[0,s*.2,.15]]){const g=c.createRadialGradient(bx-s*.05,by-s*.05,1,bx,by,s*r);g.addColorStop(0,`rgb(${l})`);g.addColorStop(1,`rgb(${d})`);c.fillStyle=g;c.beginPath();c.arc(bx,by,s*r,0,TAU);c.fill();
    c.strokeStyle='rgba(30,20,30,.45)';c.lineWidth=Math.max(.8,s*.025);c.stroke();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.arc(bx-s*.05,by-s*.05,s*.035,0,TAU);c.fill();}
  if(id==='dewberry'){c.fillStyle='rgba(220,240,255,.9)';c.beginPath();c.moveTo(s*.3,-s*.12);c.quadraticCurveTo(s*.38,0,s*.3,s*.04);c.quadraticCurveTo(s*.22,0,s*.3,-s*.12);c.fill();}
  c.restore();}

/* ---------- satchel: ingredients list ---------- */
const ING_ORDER=['duskberry','dewberry','emberberry','moonleaf','slimeparts','thornsprig','boneparts'];
function ingUse(id){const r=RECIPES.filter(r=>r.need[id]);return r.length?'for '+r.map(r=>r.name.replace(' Powder','')).join(', '):'';}
function drawIngTab(c,px,pw,y0,y1){const x=px+18,w=pw-36;
  // the one rule of Lum's Magic Mixing
  c.fillStyle='rgba(120,86,40,.12)';rr(x,y0,w,56,10);c.fill();drawMortar(c,x+24,y0+30,1.15);
  c.textAlign='left';c.fillStyle='#4a3420';c.font='700 14px "Alegreya SC", Georgia, serif';c.fillText("Lum's Magic Mixing",x+46,y0+24);
  c.font='italic 12.5px Alegreya, Georgia, serif';c.fillStyle='#6a5030';c.fillText('Stand by any fire or heat source.',x+46,y0+42);
  const top=y0+66,cw=(w-8)/2,rh=Math.min(46,(y1-top)/4);
  ING_ORDER.forEach((id,i)=>{const n=MATS[id]||0,cx=x+(i%2)*(cw+8),cy=top+Math.floor(i/2)*rh;c.globalAlpha=n?1:.45;c.fillStyle='rgba(120,86,40,.08)';rr(cx,cy,cw,rh-5,8);c.fill();drawIcon(c,id,cx+18,cy+(rh-5)/2,26);
    c.textAlign='left';c.fillStyle='#4a3420';c.font='700 12.5px "Alegreya SC", Georgia, serif';c.fillText(ITEMS[id].name,cx+36,cy+16);
    c.font='italic 10.5px Alegreya, Georgia, serif';c.fillStyle='#7a6040';c.fillText(ingUse(id),cx+36,cy+30);
    c.textAlign='right';c.font='700 13px "Alegreya SC", Georgia, serif';c.fillStyle='#6a4a28';c.fillText('×'+n,cx+cw-8,cy+30);c.globalAlpha=1;});
  c.textAlign='center';}

