/* =====================================================================
   THE HOLLOW BENEATH THE OLD OAK: a five-room root dungeon
   ===================================================================== */
const DUN={room:1,eyes:[]};
const DROOMS={
  1:{name:"Gaia's Hollow",sub:'beneath the old oak',dark:.72,floor:[[160,620],[420,610],[500,590],[700,590],[900,600],[1100,570],[1230,560],[1300,600],[1290,700],[1150,740],[900,760],[400,760],[200,720]],
     light:[590,140,260]},
  2:{name:'Mossy Hollow',sub:'roots and old stone',dark:.8,floor:[[130,600],[180,560],[350,600],[500,640],[900,640],[1100,600],[1250,560],[1320,600],[1300,720],[1150,760],[200,760],[120,700]]},
  3:{name:'Webbed Grotto',sub:'something skitters in the dark',dark:.8,floor:[[220,520],[330,500],[450,560],[600,540],[800,540],[1000,540],[1150,550],[1300,560],[1320,650],[1250,740],[200,760],[150,660]],
     block:[{x:880,y:548,rx:46,ry:16}]},
  4:{name:"Gaia's Vault",sub:'a thief’s hiding place',dark:.82,floor:[[480,768],[520,640],[560,560],[620,470],[660,400],[760,400],[800,470],[850,560],[960,600],[1000,640],[920,768]],
     block:[{x:890,y:556,rx:48,ry:14}],light:[700,30,200]},
  10:{name:'Spider Lair',dark:.76,floor:[[190,610],[300,560],[410,590],[470,640],[600,672],[800,662],[940,645],[1010,690],[1120,700],[1210,768],[170,768]]},
  9:{name:'Ember Hollow',dark:.66,floor:[[230,700],[320,640],[430,600],[560,560],[640,520],[700,470],[760,432],[900,428],[970,455],[1010,500],[1070,560],[1130,625],[1180,700],[1200,768],[260,768]],block:[{x:792,y:510,rx:104,ry:30}]},
  8:{name:'Briar Den',dark:.76,floor:[[470,768],[500,690],[560,620],[640,570],[720,548],[880,548],[960,575],[1030,630],[1090,700],[1110,768]]},
  7:{name:'Thornroot Cellar',dark:.74,floor:[[330,640],[470,610],[600,575],[720,545],[1150,530],[1240,560],[1320,640],[1330,768],[420,768],[340,700]],block:[{x:945,y:614,rx:168,ry:38}]},
  6:{name:'Hidden Spring',dark:.72,floor:[[640,588],[760,576],[860,560],[885,505],[912,462],[958,462],[992,505],[1010,560],[1065,592],[1125,640],[1160,700],[1105,722],[1060,648],[980,614],[860,606],[740,608],[650,614]]},
  11:{name:'Worldbind Passage',dark:.42,floor:[[175,205],[300,205],[330,280],[420,330],[560,420],[680,500],[790,590],[900,610],[1040,590],[1100,520],[1200,500],[1230,600],[1170,690],[1000,740],[860,768],[470,768],[400,660],[300,520],[220,400],[165,290]],
     light:[240,170,190]},   /* Chapter 2: beyond the gatehouse arch. Stairs down from the archway (top left); a tunnel leads on (right) */
  12:{name:'Worldbind Passage',dark:.4,floor:[[120,500],[260,505],[420,540],[600,545],[800,545],[980,540],[1130,505],[1290,500],[1300,560],[1270,640],[1180,720],[1000,768],[350,768],[180,700],[110,610]]},   /* tunnels left (back to the stairs) and right (on into the mountain); torches either side */
  13:{name:'Worldbind Passage',dark:.42,floor:[[468,200],[615,200],[605,300],[645,400],[705,500],[825,580],[1000,600],[1150,600],[1185,680],[1110,768],[560,768],[430,650],[330,565],[240,455],[238,345],[300,300],[440,245]],
     light:[540,120,200]},   /* arrive at the top entrance (back to room 2); stairs down to a landing */
  5:{name:'Deeproot',sub:'turn back',dark:.86,floor:[[420,768],[480,640],[560,580],[620,540],[700,540],[800,580],[950,620],[1050,700],[1080,768]]}};
const EYES5=[[200,144],[290,106],[275,181],[331,319],[500,140],[652,129],[625,238],[731,190],[512,422],[612,444],[212,481],[212,512],[440,275],[420,412],[610,282]];
function dunFree(x,y){const R=DROOMS[DUN.room];if(!inPoly(x,y,R.floor))return false;for(const b of (R.block||[]))if(((x-b.x)/b.rx)**2+((y-b.y)/b.ry)**2<1)return false;return true;}
function solveDun(px,py,nx,ny){if(dunFree(nx,ny))return [nx,ny];if(dunFree(nx,py))return [nx,py];if(dunFree(px,ny))return [px,ny];return [px,py];}
const dunH=y=>150+(clamp(y,380,768)-620)*.28;
const DUNINT=[];
/* the Hidden Spring under Stranglethorn: a drink restores everyone's HP */
/* the Fox Hood waits on the Briar Den floor once both foxes there are gone */
const HOOD={x:780,y:610},DEN_LINES=["The webs and roots are knotted solid. There's no way through.","Nothing past this point but webs and roots. This is as far as the den goes."];
function hoodOut(){if(C1.hoodOut)return true;if(dfoesBuilt&&!DFOES.some(g=>g.room===8))C1.hoodOut=1;return !!C1.hoodOut;}
const SPRING_DOOR={x:5*360+180,y:150},CELLAR_DOOR={x:11*360+180,y:10*300+66},WEBWELL_DOOR={x:5*360+180,y:4*300+58};
function drinkSpring(){const all=PARTY_ORDER.filter(id=>HEROES[id]);let hurt=false;for(const id of all){const h=HEROES[id];if(h.hp<h.maxHp)hurt=true;h.hp=h.maxHp;}
  sfxItem&&sfxItem();for(let i=0;i<16;i++)PARTS.push({type:'fdust',x:lum.x+rnd(-30,30),y:lum.y,z:rnd(10,80),vx:rnd(-10,10),vy:rnd(-4,4),vz:rnd(20,40),life:0,max:rnd(.6,1.1),s:rnd(1,2.2),col:'170,230,255'});
  say(hurt?(C1.jak?"Every ache is gone. We're both good as new.":"Every ache is gone. I'm good as new."):"The water is cool and clear. I’m already full.");}
function dunGo(room,x,y,face){goScene(()=>enterDun(room,x,y,face));}
function setupDun(){DUNINT.length=0;const r=DUN.room,D=(x,y,reach,fn)=>DUNINT.push({x,y,reach,door:true,onInteract:fn}),L=(x,y,reach,lines)=>{let i=0;DUNINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  if(r===1){D(560,600,70,()=>goScene(()=>{buildWoods();buildWoodsC1();SCENE='woods';lum.x=HOLLOW.x;lum.y=HOLLOW.y+40;lum.face=1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-50;WTITLE.t=99;}));
    D(1270,590,64,()=>dunGo(2,200,600,1));
    // the dead-end tunnel on the left: too dark without the lantern; with it, the Fox Ring
    DUNINT.push({x:185,y:630,reach:64,onInteract:()=>{if(C1.foxRing){say("The tunnel twists away into the dark… and ends in a wall of roots. A dead end.");return;}if(!BAG.includes('lantern')){say("It's too dark to see without a lantern!");return;}
      talk([['Lum',"The lantern catches something at the end of the tunnel… something small and circular, glinting back at me."]],false,()=>{C1.foxRing=1;giveItem('foxring');});}});
}
  if(r===11){D(238,215,70,()=>goScene(()=>{SCENE='thorn';lum.x=CPATH.xt;lum.y=CPATH.ytop+95;lum.face=1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-50;THORN.t=99;AMR.x=lum.x-50;AMR.y=lum.y+20;}));
    D(1150,560,90,()=>dunGo(12,200,560,1));}
  if(r===12){D(150,520,80,()=>dunGo(11,1110,575,-1));D(1250,520,80,()=>dunGo(13,540,240,1));}
  if(r===13){D(540,210,70,()=>dunGo(12,1215,540,-1));
    /* the dark opening on the right leads to room 4 (art still to come): a door emote that, for now, only speaks */
    DUNINT.push({x:1130,y:605,reach:80,door:true,onInteract:()=>{if(DROOMS[14]&&ready(IMG.dun14))dunGo(14);else say("The passage winds on into the dark…");}});L(470,610,70,["A worn stone marker. The carving has crumbled away."]);}
  if(r===12){L(730,545,110,["Old stonework, set into the rock. Someone built this passage long ago.","The stones are cold and damp. Roots have pushed through the mortar."]);}
  if(r===2){D(175,590,64,()=>dunGo(1,1240,600,-1));D(1270,590,64,()=>dunGo(3,290,540,1));L(700,655,80,["The roots here are so thick they look woven together.","Purple fungus on the ceiling. Glowmold. Lovely in a powder, if only I could reach it."]);}
  if(r===3){D(270,525,60,()=>dunGo(2,1240,600,-1));
    DUNINT.push({x:700,y:540,reach:66,dynDoor:1,get door(){return !!C1.webCut},onInteract:webInteract});
    DUNINT.push({x:880,y:570,reach:66,grab:()=>!C1.dunChest,onInteract:()=>{if(C1.dunChest){say("Empty.");return;}C1.dunChest=1;sfxPage&&sfxPage(.8);giveItem('crystalpouch');}});
    DUNINT.push({x:1210,y:565,reach:70,onInteract:()=>askChoice("Drink from the pool?",[["Yes",()=>{const H_=HEROES[HERO];H_.hp=H_.maxHp;sfxItem&&sfxItem();for(let i=0;i<16;i++)PARTS.push({type:'fiz',col:'140,230,255',x:lum.x+rnd(-24,24),y:lum.y,z:rnd(10,90),vx:rnd(-10,10),vy:rnd(-4,4),vz:rnd(20,60),life:0,max:rnd(.6,1.1),s:rnd(1.4,2.6)});say("Cold and sweet. I feel completely restored.");}],["No",()=>{}]])});}
  if(r===4){D(700,760,70,()=>dunGo(3,700,560,-1));D(710,412,60,()=>dunGo(5,700,740,-1));
    DUNINT.push({x:880,y:575,reach:66,grab:()=>C1.vixen&&!C1.charmFound,onInteract:()=>{if(!C1.vixen){say("A nest of shiny things… and a fox curled right on top of it.");return;}if(C1.charmFound){say("A nest of twigs, buttons, and shiny bits.");return;}
      C1.charmFound=1;giveItem('vanecharm');talk([['Lum',C1.charmQ===1?"Wooden beads and a little carved cross. Vane's lucky cross!":"Wooden beads and a little carved cross, worn smooth. Somebody must be missing this."]],false,()=>{if(C1.charmQ===1){GOAL.tag='NEW TASK';GOAL.text="Return Vane's lucky cross (wear it so he sees)";HINT.goalT=0;}});}});
  }
  if(r===6){D(935,470,60,()=>goScene(()=>{enterThorn();lum.x=SPRING_DOOR.x;lum.y=SPRING_DOOR.y+CMOUTH.ry+30;lum.face=1;cam.x=lum.x;cam.y=lum.y-50;resetJakFollow();}));
    DUNINT.push({x:760,y:612,reach:85,onInteract:()=>askChoice("Drink from the spring?",[["Drink",drinkSpring],["Not now",()=>{}]])});}
  if(r===7){D(470,612,64,()=>goScene(()=>{enterThorn();lum.x=CELLAR_DOOR.x;lum.y=CELLAR_DOOR.y+CMOUTH.ry+30;lum.face=1;cam.x=lum.x;cam.y=lum.y-50;resetJakFollow();}));
    D(950,545,80,()=>dunGo(8,780,705,1));}
  if(r===9){D(300,660,72,()=>goScene(()=>{enterThorn();lum.x=WEBWELL_DOOR.x-75;lum.y=WEBWELL_DOOR.y+58;lum.face=1;cam.x=lum.x;cam.y=lum.y-50;resetJakFollow();}));
    D(860,445,70,()=>dunGo(10,260,660,1));
    DUNINT.push({x:792,y:540,reach:110,fire:true,onInteract:fireInteract});}
  if(r===10){D(290,752,72,()=>dunGo(9,860,470,1));}
  if(r===8){D(780,752,64,()=>dunGo(7,1040,560,-1));
    DUNINT.push({x:HOOD.x,y:HOOD.y,reach:80,grab:()=>hoodOut()&&!C1.foxHood,onInteract:()=>{if(!hoodOut()||C1.foxHood){say(DEN_LINES[(sayCount++)%2]);return;}C1.foxHood=1;giveItem('foxhood');}});
    L(780,552,90,DEN_LINES);}
  if(r===5){D(700,760,70,()=>dunGo(4,705,440,1));if(!C1.bigVixen)DUNINT.push({x:700,y:615,reach:95,onInteract:()=>{const g=DFOES.find(f=>f.kind==='bigvixen');if(!g)return;talk([['Lum',"…This one is much bigger than the little thief. It could be dangerous."]],false,()=>askChoice("Wake the fox?",[["Yes",()=>{g.asleep=0;startEncounter(g,'normal');}],["No",()=>say("Let sleeping foxes lie.")]]));}});L(560,600,60,["So many eyes…"]);}}
function webInteract(){if(C1.webCut){dunGo(4,700,730,-1);return;}
  if(POWDERS.thorn>0){talk([['Lum',"A thick wall of web stretches across the passage. It's sticky as honey."]],false,()=>askChoice("Throw Thornbane Powder?",[["Yes",()=>{POWDERS.thorn--;C1.webCut=1;sfxFizzle&&sfxFizzle(true);shake=3;for(let i=0;i<30;i++)PARTS.push({type:'fiz',col:'170,220,120',x:700+rnd(-70,70),y:520,z:rnd(20,180),vx:rnd(-30,30),vy:rnd(-6,6),vz:rnd(-10,60),life:0,max:rnd(.6,1.2),s:rnd(1.5,3)});
      setTimeout(()=>say("The web curls and withers away. Thornbane works on more than just monsters."),500);}],["No",()=>{}]]));return;}
  talk([['Lum',"A thick wall of web stretches across the passage. It's sticky as honey."],['Lum',"Thornbane Powder would wither it right away. I could mix some at a fire."]]);}
const DFOES=[];let dfoesBuilt=false;
function buildDFoes(){if(dfoesBuilt)return;dfoesBuilt=true;DFOES.length=0;let id=0;
  if(!C1.vixen)DFOES.push({id:90,kind:'vixen',scene:'dun',room:4,x:790,y:610,hx:790,hy:610,tx:790,ty:610,s:1,pack:1,calm:0,ph:0,t:0,face:1,still:1});
  if(!C1.bigVixen)DFOES.push({id:91,kind:'bigvixen',scene:'dun',room:5,x:720,y:585,hx:720,hy:585,tx:720,ty:585,s:1.4,pack:1,calm:0,ph:0,t:0,face:1,still:1,asleep:1});
  for(const [room,x,y] of [[3,520,660],[3,1050,650],[5,560,690]])DFOES.push({id:id++,kind:'spider',scene:'dun',room,x,y,hx:x,hy:y,tx:x,ty:y,s:1,pack:1,calm:0,ph:rnd(0,TAU),t:0,face:-1});
  for(const [room,x,y] of [[7,720,690],[7,1080,700],[7,1210,625],...(C1.hoodOut?[]:[[8,640,650],[8,960,660]])])DFOES.push({id:id++,kind:'rvixen',scene:'dun',room,x,y,hx:x,hy:y,tx:x,ty:y,s:1,pack:1,calm:2,ph:rnd(0,TAU),t:0,face:-1});
  if(!C1.lairBoss)DFOES.push({id:95,kind:'bigspider',scene:'dun',room:10,x:720,y:575,hx:720,hy:575,tx:720,ty:575,s:1,pack:1,calm:0,ph:0,t:0,face:-1,still:1,lair:1,over:{name:'Webmother',hp:46,atk:5,def:2,loot:'foxsuit',flag:'lairBoss'}});
  for(const [room,x,y] of [[2,520,700],[2,950,690],[5,900,690]])DFOES.push({id:id++,kind:'bat',scene:'dun',room,x,y,hx:x,hy:y,tx:x,ty:y,s:1,pack:1,calm:0,ph:rnd(0,TAU),t:0,face:-1});}
function updateDFoes(dt){const ok=!DLG.active&&!WEVENT.on&&!MENU.open&&!FADE.dir&&!BATTLE.on&&!BATTLE.pending&&!CHOICE.on&&!MIX.on;
  for(const g of DFOES){if(g.room!==DUN.room)continue;g.ph+=dt;g.t+=dt;g.calm=Math.max(0,g.calm-dt);const d=Math.hypot(lum.x-g.x,lum.y-g.y);
    if(g.still){if(g.lair){g.face=-1;if(ok&&d<190&&lum.bumpT<=0)startEncounter(g,'normal');continue;}g.face=g.asleep?1:lum.x<g.x?-1:1;if(g.kind==='vixen'&&ok&&!g.calm&&d<130&&lum.bumpT<=0)startEncounter(g,'normal');continue;}
    if(ok&&!g.calm&&d<230){g.tx=lum.x;g.ty=lum.y;if(d<60&&lum.bumpT<=0){startEncounter(g,'ambush');continue;}}
    else if(g.t>2.5||Math.hypot(g.tx-g.x,g.ty-g.y)<10){g.t=0;const a=rnd(0,TAU);g.tx=g.hx+Math.cos(a)*rnd(40,160);g.ty=g.hy+Math.sin(a)*rnd(10,50);}
    if(!ok)continue;const dx=g.tx-g.x,dy=g.ty-g.y,dd=Math.hypot(dx,dy)||1,sp=d<230&&!g.calm?95:55;const nx=g.x+dx/dd*sp*dt,ny=g.y+dy/dd*sp*dt;if(dunFree(nx,ny)){g.x=nx;g.y=ny;}else{g.tx=g.hx;g.ty=g.hy;}if(Math.abs(dx)>4)g.face=dx<0?-1:1;}}
function drawDFoe(g){const k=dunH(g.y)/151,bob=Math.sin(g.ph*3)*8;if(g.kind==='bigspider'){const h=330*k;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.5,h*.09,0,0,TAU);ctx.fill();ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x,g.y-h*.35,h*.6,'150,120,200',.16+.05*Math.sin(T*1.5));ctx.restore();ctx.save();ctx.filter='brightness(1.45) contrast(1.1)';c1Frame(ctx,'spider_dark','idle',Math.floor(g.ph*4)%4,g.x,g.y,h,true,1,0);ctx.restore();return;}if(g.kind==='rvixen'){const mv=Math.hypot(g.tx-g.x,g.ty-g.y)>8,h=118*k;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.42,h*.07,0,0,TAU);ctx.fill();c1Frame(ctx,'fox_red','run',mv?Math.floor(g.ph*14)%12:0,g.x,g.y,h,g.face>0,1,0);return;}if(g.kind==='spider'){const mv=Math.hypot(g.tx-g.x,g.ty-g.y)>8;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,34*k,7*k,0,0,TAU);ctx.fill();c1Frame(ctx,'spider',mv?'crawl':'idle',Math.floor(g.ph*(mv?12:4))%(mv?5:4),g.x,g.y,70*k,mv?g.face>0:g.face<0,1,0);return;}if(g.kind==='vixen'||g.kind==='bigvixen'){const h=(g.kind==='bigvixen'?230:120)*k,br=1+Math.sin(g.ph*(g.asleep?1.4:3))*.012;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.42,h*.07,0,0,TAU);ctx.fill();ctx.save();ctx.translate(g.x,g.y);ctx.scale(1,br);ctx.translate(-g.x,-g.y);c1Frame(ctx,'fox',g.asleep?'hurt':'run',0,g.x,g.y,h,g.face>0,1,0);ctx.restore();
    ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x,g.y-h*.4,h*.5,'255,170,90',.08+.03*Math.sin(g.ph*2));ctx.restore();return;}ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(g.x,g.y,26*k,6*k,0,0,TAU);ctx.fill();
  c1Frame(ctx,'bat','fly',Math.floor(g.ph*9)%3,g.x,g.y-110*k-bob,90*k,g.face>0,1,0);}
function enterDun(room,x,y,face){const prevRoom=SCENE==='dun'?DUN.room:0;buildDFoes();SCENE='dun';DUN.room=room;if(room>=6)C1['seen'+room]=1;lum.x=x??560;lum.y=y??640;lum.face=face||1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=lum.x;WTITLE.t=prevRoom>=11&&room>=11?99:0;setupDun();   /* the area title shows once, on entering the Worldbind Passage, not between its rooms */
  if(room===1&&!C1.dunSeen){C1.dunSeen=1;setTimeout(()=>talk([['Lum',"Cosmic? …Cosmic!"]]),900);}
  if(room===5)DUN.eyes=EYES5.map(()=>({b:rnd(0,6),t:0}));}
function drawDun(){const R=DROOMS[DUN.room],im=IMG['dun'+DUN.room];if(!ready(im))return;const [rz]=roomView();
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#07080c';ctx.fillRect(0,0,W,H);
  ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz),0);ctx.drawImage(im,0,0,1375,768);
  if(DUN.room===3){if(!C1.webCut){ctx.save();ctx.strokeStyle='rgba(225,240,245,.75)';ctx.lineWidth=1.4;const cx=700,cy=450;for(let i=0;i<14;i++){const a=i/14*Math.PI-Math.PI;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*120,cy+Math.sin(a)*-100+80);ctx.stroke();}
      for(let r_=20;r_<120;r_+=18){ctx.beginPath();for(let i=0;i<=14;i++){const a=i/14*Math.PI-Math.PI;const x=cx+Math.cos(a)*r_,y=cy+Math.sin(a)*-r_*.83+80*r_/120;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}ctx.restore();}
    ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const x=1150+i*28+Math.sin(T*1.3+i)*8,y=515+Math.sin(T*2+i*2)*4;drawGlow(ctx,x,y,14,'130,230,255',.25+.15*Math.sin(T*3+i));}ctx.restore();}
  if(DUN.room===5){ctx.save();ctx.fillStyle='#1c1f28';EYES5.forEach(([x,y],i)=>{const e=DUN.eyes[i];if(!e)return;e.b-=1/60;if(e.b<0){e.t=.22;e.b=rnd(2,7);}if(e.t>0){e.t-=1/60;ctx.beginPath();ctx.ellipse(x,y,16,7,0,0,TAU);ctx.fill();}});ctx.restore();}
  if(DUN.room===4&&C1.vixen&&!C1.charmFound){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,895,528,10+3*Math.sin(T*4),'235,240,255',.6);ctx.restore();}
  if(DUN.room===8&&hoodOut()&&!C1.foxHood){const im=IMG.icon5_hood_fox,b=Math.sin(T*2.2)*2;ctx.save();ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(HOOD.x,HOOD.y,22,6,0,0,TAU);ctx.fill();
    if(ready(im))ctx.drawImage(im,HOOD.x-22,HOOD.y-44+b,44,44);ctx.globalCompositeOperation='lighter';drawGlow(ctx,HOOD.x,HOOD.y-22,30,'255,226,150',.25+.12*Math.sin(T*3));ctx.restore();}
  // characters, depth-sorted; the cellar's table is drawn over anyone standing behind it
  const k=dunH(lum.y)/151,here=DFOES.filter(g=>g.room===DUN.room);{const L=here.map(g=>[g.y,()=>drawDFoe(g)]);
    L.push([lum.y,()=>{ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();}]);
    if(CH===1&&jakInParty()&&JAKF){const kj=dunH(JAKF.y)/151;L.push([JAKF.y,()=>{ctx.save();ctx.translate(JAKF.x,JAKF.y);ctx.scale(kj,kj);ctx.translate(-JAKF.x,-JAKF.y);drawJakOW();ctx.restore();}]);}   /* Spar comes down into the rooms with Lum */
    if(CH>=2&&C2.joined){const ka=dunH(AMR.y)/151;L.push([AMR.y,()=>{ctx.save();ctx.translate(AMR.x,AMR.y);ctx.scale(ka,ka);ctx.translate(-AMR.x,-AMR.y);drawAmrOW(AMR,1);ctx.restore();}]);}
    if(DUN.room===7)L.push([614,()=>{const t=IMG.dun7_table;if(!ready(t))return;const hid=lum.y<614&&Math.abs(lum.x-945)<240;ctx.save();ctx.globalAlpha=hid?.62:1;ctx.drawImage(t,730,425);ctx.restore();}]);
    L.sort((a,b)=>a[0]-b[0]);for(const [,f] of L)f();}
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k2=dunH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k2,k2);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  // darkness: only the little lantern's circle (and any daylight from above) cuts through
  ctx.setTransform(DPR,0,0,DPR,0,0);const lit=BAG.includes('lantern');const [sx,sy]=wellToScreen(lum.x,lum.y-70*k);const zr=rz*(lit?1:.45);
  const r0=(BAG.includes('lantern')?120:70)*zr,r1=(BAG.includes('lantern')?260:170)*zr,R_=Math.hypot(W,H)*1.2,fl=1+.03*Math.sin(T*9);
  const g=ctx.createRadialGradient(sx,sy,0,sx,sy,R_);g.addColorStop(0,'rgba(4,5,10,0)');g.addColorStop(Math.min(.99,r0*fl/R_),'rgba(4,5,10,0)');g.addColorStop(Math.min(.995,r1*fl/R_),`rgba(4,5,10,${R.dark})`);g.addColorStop(1,`rgba(4,5,10,${R.dark})`);
  ctx.fillStyle=g;if(!CAPTURE.on)ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';if(lit)drawGlow(ctx,sx,sy,r0*1.3,'255,200,120',.12);for(const g of here){if(g.kind!=='bat'&&g.kind!=='spider')continue;const sp_=g.kind==='spider',kk=dunH(g.y)/151,[ex,ey]=wellToScreen(g.x+(g.face>0?1:-1)*(sp_?22:18)*kk,sp_?g.y-30*kk:g.y-150*kk-Math.sin(g.ph*3)*8);const tw=.55+.45*Math.sin(T*5+g.ph);drawGlow(ctx,ex-3,ey,5,'255,90,90',.8*tw);drawGlow(ctx,ex+3,ey,5,'255,90,90',.8*tw);}
  if(DUN.room===12)for(const [tx,ty] of [[115,340],[1278,335]]){const [px,py]=wellToScreen(tx,ty);drawGlow(ctx,px,py,(150+8*Math.sin(T*7+tx))*rz,'255,150,70',.28);}
  if(R.light){const [lx,ly,lr]=R.light,[px,py]=wellToScreen(lx,ly);drawGlow(ctx,px,py,lr*rz,'180,210,255',.22);}
  ctx.restore();
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(10,8,14,.5)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#e8eef6';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText(R.name,W/2,H*.3+10);ctx.restore();}}

