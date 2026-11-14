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
  14:{name:'Worldbind Passage',dark:.4,floor:[[120,500],[260,505],[420,540],[600,545],[800,545],[980,540],[1130,505],[1290,500],[1300,560],[1270,640],[1180,720],[1000,768],[350,768],[180,700],[110,610]]},   /* a copy of room 12's cavern: left tunnel back to room 13, right tunnel onward */
  18:{name:'Worldbind Passage',dark:.4,floor:[[120,500],[260,505],[420,540],[600,545],[800,545],[980,540],[1130,505],[1290,500],[1300,560],[1270,640],[1180,720],[1000,768],[350,768],[180,700],[110,610]]},   /* a copy of room 12's cavern: left tunnel back to room 17, right tunnel onward */
  16:{name:'Worldbind Passage',dark:.4,floor:[[120,500],[260,505],[420,540],[600,545],[800,545],[980,540],[1130,505],[1290,500],[1300,560],[1270,640],[1180,720],[1000,768],[350,768],[180,700],[110,610]]},   /* a copy of room 12's cavern: left tunnel back to room 15, right tunnel onward */
  13:{name:'Worldbind Passage',dark:.42,floor:[[468,200],[615,200],[605,300],[645,400],[705,500],[825,580],[1000,600],[1150,600],[1185,680],[1110,768],[560,768],[430,650],[330,565],[240,455],[238,345],[300,300],[440,245]],
     light:[540,120,200]},   /* arrive at the top entrance (back to room 2); stairs down to a landing */
  15:{name:'Worldbind Passage',dark:.42,floor:[[372,195],[470,195],[495,280],[550,400],[640,510],[760,575],[860,590],[1080,565],[1190,505],[1228,525],[1185,640],[1100,768],[560,768],[420,650],[300,520],[210,420],[190,320],[300,240]],
     light:[420,130,200]},   /* arrive at the top of the stairs (back to room 14); a lion-head brazier with a green flame; stairs on the right lead further down */
  17:{name:'Worldbind Passage',dark:.42,floor:[[375,195],[475,195],[530,275],[590,360],[650,450],[730,520],[790,580],[880,600],[1080,590],[1150,530],[1200,540],[1170,650],[1100,768],[480,768],[420,680],[300,560],[200,440],[180,330],[300,240]],
     block:[{x0:232,y0:498,x1:415,y1:690},{x0:180,y0:345,x1:300,y1:452},{x0:415,y0:296,x1:505,y1:372},{x0:225,y0:268,x1:295,y1:332},{x0:720,y0:462,x1:862,y1:575}],light:[420,130,200]},   /* arrive at the top of the stairs (back to room 16); stone pedestals; a raven-head brazier; the tunnel stairs on the right lead on */
  19:{name:'Worldbind Passage',dark:.42,floor:[[375,195],[475,195],[530,275],[590,360],[650,450],[730,520],[790,580],[880,600],[1080,590],[1150,530],[1200,540],[1170,650],[1100,768],[480,768],[420,680],[300,560],[200,440],[180,330],[300,240]],
     block:[{x0:232,y0:498,x1:415,y1:690},{x0:180,y0:345,x1:300,y1:452},{x0:415,y0:296,x1:505,y1:372},{x0:225,y0:268,x1:295,y1:332},{x0:720,y0:462,x1:862,y1:575},{x:860,y:525,rx:55,ry:16}],light:[420,130,200]},   /* arrive at the top of the stairs (back to room 18); stone pedestals; a coiled serpent statue with a green flame; the tunnel stairs on the right lead on */
  20:{name:'Worldbind Passage',dark:.38,floor:[[792,395],[935,395],[948,595],[1060,605],[1180,640],[1235,768],[565,768],[585,700],[605,625],[765,598]],
     light:[862,250,230]},
  /* Amroth's cottage (the designer's interiors). 21: the main room, front door on the left, spiral stair up on the right */
  21:{name:'',dark:0,home:1,hk:1.3,floor:[[605,612],[705,606],[930,604],[1150,628],[1160,768],[605,768]],   /* the table fills the floor in front of the door, so the way in is just to its right */
     block:[{x0:598,y0:664,x1:705,y1:769},{x0:910,y0:598,x1:1098,y1:692}],
     fg:[{y:690,poly:[[150,636],[612,646],[640,640],[700,636],[705,768],[120,768]]},{y:688,poly:[[912,600],[1098,595],[1098,700],[905,700]]}]},
  /* 23: the basement workshop under the cottage (behind the bookshelf left of the fireplace; opened by a story event) */
  23:{name:'',dark:0,home:1,hk:1.25,floor:[[140,522],[470,512],[1000,555],[1195,600],[1245,640],[1245,768],[350,768],[350,600],[140,575]],
     block:[{x0:500,y0:486,x1:945,y1:696},{x0:660,y0:705,x1:905,y1:769},{x0:920,y0:600,x1:1060,y1:665}],
     fg:[{y:698,poly:[[500,470],[950,470],[950,700],[496,700]]},{y:769,poly:[[680,712],[905,712],[905,768],[680,768]]},{y:769,poly:[[118,592],[360,592],[360,768],[118,768]]}]},
  /* 22: the loft, the bed under the thatch; the stair comes up on the right behind the rail */
  22:{name:'',dark:0,home:1,hk:1.5,floor:[[120,738],[460,730],[1050,726],[1050,612],[1185,612],[1185,768],[110,768]],
     block:[{x0:440,y0:430,x1:1052,y1:724}]},   /* the serpent gate (above): arrive in the lit stairwell behind the carved archway (back to room 19), walk down through it; the way on is in the foreground */
  5:{name:'Deeproot',sub:'turn back',dark:.86,floor:[[420,768],[480,640],[560,580],[620,540],[700,540],[800,580],[950,620],[1050,700],[1080,768]]}};
const EYES5=[[200,144],[290,106],[275,181],[331,319],[500,140],[652,129],[625,238],[731,190],[512,422],[612,444],[212,481],[212,512],[440,275],[420,412],[610,282]];
function dunFree(x,y){const R=DROOMS[DUN.room];if(!inPoly(x,y,R.floor))return false;if(DUN.room===20&&WB10.st&&y<615&&x>750&&x<965)return false;   /* the caved-in archway */
  for(const b of (R.block||[]))if(b.x0!==undefined?(x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1):((x-b.x)/b.rx)**2+((y-b.y)/b.ry)**2<1)return false;return true;}
function solveDun(px,py,nx,ny){if(dunFree(nx,ny))return [nx,ny];if(dunFree(nx,py))return [nx,py];if(dunFree(px,ny))return [px,ny];return [px,py];}
const dunH=y=>(150+(clamp(y,380,768)-620)*.28)*((DROOMS[DUN.room]||{}).hk||1);   /* hk: a room drawn closer up (the cottage) draws everyone bigger */
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
    DUNINT.push({x:1130,y:605,reach:80,door:true,onInteract:()=>{dunGo(14,200,560,1);}});L(470,610,70,["A worn stone marker. The carving has crumbled away."]);}
  if(r===14){D(150,520,80,()=>BO.lock?talk([['Lum',"I need to leave this place."]]):dunGo(13,1110,610,-1));D(1250,520,80,()=>dunGo(15,425,230,1));
    L(730,545,110,["More of the old stonework. Whoever built this passage built it to last.","The same cold, damp stones. The passage is longer than it looks."]);}
  if(r===15){D(425,205,70,()=>dunGo(14,1215,540,-1));DUNINT.push({x:818,y:560,reach:95,onInteract:()=>touchWBTorch('lion',["A bronze lion's head, set into the rock. Its green flame burns brighter now."])});
    D(1195,535,80,()=>dunGo(16,200,560,1));}
  if(r===16){D(150,520,80,()=>dunGo(15,1165,560,-1));D(1250,520,80,()=>dunGo(17,422,230,1));
    L(730,545,110,["Another stretch of the old wall. The passage keeps going down and down.","Moss has crept between the stones here."]);}
  if(r===17){D(422,205,70,()=>dunGo(16,1215,540,-1));DUNINT.push({x:825,y:575,reach:95,onInteract:()=>touchWBTorch('raven',["A carved raven's head, its beak open. Its green flame burns brighter now."])});
    L(330,700,95,["An empty stone pedestal. Whatever stood here is long gone."]);D(1165,545,80,()=>dunGo(18,200,560,1));}
  if(r===18){D(150,520,80,()=>dunGo(17,1150,560,-1));D(1250,520,80,()=>dunGo(19,422,230,1));
    L(730,545,110,["The old wall again. The air is getting colder the deeper we go.","Water drips somewhere behind the stones."]);}
  if(r===19){D(422,205,70,()=>dunGo(18,1215,540,-1));DUNINT.push({x:840,y:580,reach:95,onInteract:()=>touchWBTorch('serpent',["A great stone serpent, coiled and ready to strike. Its green flame burns brighter now."])});
    L(330,700,95,["Another empty pedestal."]);D(1165,545,80,()=>dunGo(20,862,425,1));}
  if(r===21){D(565,622,95,()=>leaveCottage());D(1172,662,70,()=>dunGo(22,1115,700,-1));
    L(820,612,90,["A warm fire crackles in the hearth. A kettle hangs over the flames."]);}
  if(r===21&&C2.basement)D(695,610,50,()=>dunGo(23,300,580,1));   /* the bookshelf door to the basement, once the story opens it */
  if(r===22){D(1160,728,70,()=>dunGo(21,1120,672,-1));}
  if(r===23){D(258,560,70,()=>dunGo(21,680,640,1));}
  if(r===20){if(!WB10.st)D(862,405,60,()=>dunGo(19,1150,560,-1));
    DUNINT.push({x:900,y:745,reach:95,door:true,onInteract:()=>goScene(enterHome)});   /* out into the open: Amroth's home */
    L(300,600,110,["A carving of a many-headed serpent.","Three empty pedestals stand in a row beneath it."]);L(862,600,70,["Runes are carved above the arch. I can't read them."]);}
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
function enterDun(room,x,y,face){const prevRoom=SCENE==='dun'?DUN.room:0;buildDFoes();SCENE='dun';DUN.room=room;if(room>=6)C1['seen'+room]=1;lum.x=x??560;lum.y=y??640;lum.face=face||1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=lum.x;WTITLE.t=(prevRoom>=11&&room>=11)||DROOMS[room].home?99:0;setupDun();   /* the area title shows once, on entering the Worldbind Passage, not between its rooms */
  if(room===1&&!C1.dunSeen){C1.dunSeen=1;setTimeout(()=>talk([['Lum',"Cosmic? …Cosmic!"]]),900);}
  if(room===5)DUN.eyes=EYES5.map(()=>({b:rnd(0,6),t:0}));}
function drawDun(){const R=DROOMS[DUN.room],im=IMG['dun'+DUN.room];if(!ready(im))return;const [rz]=roomView();
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#07080c';ctx.fillRect(0,0,W,H);
  const qk=DUN.room===20&&WB10.st?WB10.q:DUN.room>=15&&DUN.room<=20?WB5.q:[0,0];ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz+qk[0]),DPR*qk[1]);ctx.drawImage(im,0,0,1375,768);   /* room 5 trembles */
  if(DUN.room===20)drawWB10Rubble();
  if((DUN.room===14&&!BO.R&&BO.a<1)||(DUN.room===18&&!WB8.R)){const g=ctx.createLinearGradient(780,0,1180,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.94)');ctx.fillStyle=g;ctx.fillRect(780,-500,2600,1800);}
  if(DUN.room===14&&BO.a>0){ctx.fillStyle=`rgba(0,0,0,${BO.a})`;ctx.fillRect(-2000,-500,5375,1800);}
  if(((DUN.room===12&&!C2.torchLit)||(DUN.room===18&&!WB8.L))&&IMG.dun12_torch_out&&IMG.dun12_torch_out.complete){ctx.drawImage(IMG.dun12_torch_out,70,270);ctx.save();for(let i=0;i<4;i++){const q=(T*.25+i/4)%1;ctx.globalAlpha=.35*(1-q);drawGlow(ctx,110+Math.sin(T+i)*6*q,368-q*90,10+q*22,'150,160,170',.8);}ctx.restore();}
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
    if(CH===1&&jakInParty()&&JAKF){const kj=dunH(JAKF.y)/151;L.push([JAKF.y-1,()=>{ctx.save();ctx.translate(JAKF.x,JAKF.y);ctx.scale(kj,kj);ctx.translate(-JAKF.x,-JAKF.y);drawJakOW();ctx.restore();}]);}   /* Spar comes down into the rooms with Lum */
    if(CH>=2&&C2.joined){const ka=dunH(AMR.y)/151;L.push([AMR.y-1,()=>{ctx.save();ctx.translate(AMR.x,AMR.y);ctx.scale(ka,ka);ctx.translate(-AMR.x,-AMR.y);drawAmrOW(AMR,1);ctx.restore();}]);}
    if(DUN.room===7)L.push([614,()=>{const t=IMG.dun7_table;if(!ready(t))return;const hid=lum.y<614&&Math.abs(lum.x-945)<240;ctx.save();ctx.globalAlpha=hid?.62:1;ctx.drawImage(t,730,425);ctx.restore();}]);
    if(DUN.room===14){for(const d of BO.ow)L.push([d.y,()=>drawDemonOW(d.x,d.y,d.face,d.a,d.mv,0,d)]);const g=BO.chaser;if(g)L.push([g.y,()=>drawDemonOW(g.x,g.y,g.face,g.a,g.mv,0,g)]);}
    if(DUN.room===18&&WB8.boss){const g=WB8.boss;L.push([g.y,()=>drawDemonOW(g.x,g.y,g.face,g.a,g.mv,2,g)]);}
    if(DUN.room>=15&&DUN.room<=18)for(const g of [WB5.chaser,WB5.brown])if(g)L.push([g.y,()=>drawDemonOW(g.x,g.y,g.face,g.a,g.mv,g.big,g)]);
    for(const F of (R.fg||[]))L.push([F.y,()=>{ctx.save();ctx.beginPath();F.poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();ctx.drawImage(im,0,0,1375,768);ctx.restore();}]);   /* furniture that stands in front of whoever is behind it */
    L.sort((a,b)=>a[0]-b[0]);for(const [,f] of L)f();}
  if(DUN.room===14&&BO.a>0){ctx.fillStyle=`rgba(0,0,0,${BO.a*.55})`;ctx.fillRect(-2000,-500,5375,1800);}
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k2=dunH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k2,k2);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  if(wbQuaking())drawWB5Fall();
  if(DUN.room>=11&&DUN.room<=20&&!(DUN.room===14&&BO.a>.3))drawWorldbindAir(R);
  // darkness: only the little lantern's circle (and any daylight from above) cuts through
  ctx.setTransform(DPR,0,0,DPR,0,0);const lit=BAG.includes('lantern');const [sx,sy]=wellToScreen(lum.x,lum.y-70*k);const zr=rz*(lit?1:.45);
  const r0=(BAG.includes('lantern')?120:70)*zr,r1=(BAG.includes('lantern')?260:170)*zr,R_=Math.hypot(W,H)*1.2,fl=1+.03*Math.sin(T*9);
  const g=ctx.createRadialGradient(sx,sy,0,sx,sy,R_);g.addColorStop(0,'rgba(4,5,10,0)');g.addColorStop(Math.min(.99,r0*fl/R_),'rgba(4,5,10,0)');g.addColorStop(Math.min(.995,r1*fl/R_),`rgba(4,5,10,${DUN.room===18?wb8Dark():R.dark})`);g.addColorStop(1,`rgba(4,5,10,${DUN.room===18?wb8Dark():R.dark})`);
  ctx.fillStyle=g;if(!CAPTURE.on)ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';if(lit)drawGlow(ctx,sx,sy,r0*1.3,'255,200,120',.12);for(const g of here){if(g.kind!=='bat'&&g.kind!=='spider')continue;const sp_=g.kind==='spider',kk=dunH(g.y)/151,[ex,ey]=wellToScreen(g.x+(g.face>0?1:-1)*(sp_?22:18)*kk,sp_?g.y-30*kk:g.y-150*kk-Math.sin(g.ph*3)*8);const tw=.55+.45*Math.sin(T*5+g.ph);drawGlow(ctx,ex-3,ey,5,'255,90,90',.8*tw);drawGlow(ctx,ex+3,ey,5,'255,90,90',.8*tw);}
  /* the torches: a warm pool of light on the walls and floor, a hot core at the flame, flickering */
  if(DUN.room===12||DUN.room===14||DUN.room===16||DUN.room===18)for(const [tx,ty] of [[115,340],[1278,335]]){if(DUN.room===12&&tx<600&&!C2.torchLit)continue;if(DUN.room===14&&!(tx<600?BO.L:BO.R))continue;if(DUN.room===18&&!(tx<600?WB8.L:WB8.R))continue;const lk=DUN.room===12&&tx<600&&C2.lightT!=null?Math.min(1,C2.lightT):DUN.room===14&&tx<600?BO.lt:1;const [px,py]=wellToScreen(tx,ty),[fx,fy]=wellToScreen(tx+(tx<600?60:-60),ty+260),f=1+.06*Math.sin(T*9+tx)+.04*Math.sin(T*23+tx*2);
    drawGlow(ctx,px,py,320*rz*f,'255,140,60',.26*lk);drawGlow(ctx,fx,fy,260*rz*f,'255,150,80',.14*lk);drawGlow(ctx,px,py,90*rz*f,'255,200,120',.45*lk);drawGlow(ctx,px,py-14*rz,34*rz*f,'255,235,180',.6*lk);if(lk<1)drawGlow(ctx,px,py,140*rz,'255,240,200',(1-lk)*.8);}
  if(DUN.room===19){const [px,py]=wellToScreen(805,200);drawGlow(ctx,px,py,(160+10*Math.sin(T*5))*rz,'90,255,190',.26);;wbTorchGlow(19,px,py,rz);}
  if(DUN.room===17){const [px,py]=wellToScreen(818,280);drawGlow(ctx,px,py,(160+10*Math.sin(T*5))*rz,'90,255,190',.26);;wbTorchGlow(17,px,py,rz);}
  if(DUN.room===15){const [px,py]=wellToScreen(818,290);drawGlow(ctx,px,py,(170+10*Math.sin(T*5))*rz,'90,255,190',.26);;wbTorchGlow(15,px,py,rz);}
  if(DUN.room===23){ctx.save();ctx.globalCompositeOperation='lighter';const fl=1+.05*Math.sin(T*6);for(const [x,y,c] of [[608,470,'255,190,110'],[876,460,'255,190,110'],[950,610,'140,220,255'],[780,290,'140,220,255']]){const [px,py]=wellToScreen(x,y);drawGlow(ctx,px,py,120*rz*fl,c,.18);}ctx.restore();}   /* lamps on the bench, glowing crystals */
  if(DUN.room===21||DUN.room===22){ctx.save();ctx.globalCompositeOperation='lighter';const fl=1+.06*Math.sin(T*7)+.04*Math.sin(T*13);   /* the hearth fire / the oil lamp */
    const [fx,fy]=wellToScreen(...(DUN.room===21?[862,560]:[1122,430]));drawGlow(ctx,fx,fy,(DUN.room===21?330:220)*rz*fl,'255,150,70',.2);drawGlow(ctx,fx,fy,90*rz*fl,'255,210,140',.3);ctx.restore();}
  if(R.light){const [lx,ly,lr]=R.light,[px,py]=wellToScreen(lx,ly);drawGlow(ctx,px,py,lr*rz,'180,210,255',.22);}
  ctx.restore();
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(10,8,14,.5)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#e8eef6';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText(R.name,W/2,H*.3+10);ctx.restore();}}

/* ---------- the Worldbind Passage's air: a spiritual mist flowing low over the floor and stairs, and very tiny bats ---------- */
function wbMist(R){const k='mist'+DUN.room;if(DUN[k])return DUN[k];const pts=[],F=R.floor;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const [x,y] of F){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  for(let i=0;i<400&&pts.length<56;i++){const x=x0+hash(i,1,DUN.room*7)*(x1-x0),y=y0+hash(i,2,DUN.room*7)*(y1-y0);if(inPoly(x,y,F))pts.push({x,y,r:80+hash(i,3,DUN.room)*120,ph:hash(i,4,DUN.room)*TAU,sp:6+hash(i,5,DUN.room)*10});}
  return DUN[k]={pts,x0,x1};}
function drawWorldbindAir(R){const M=wbMist(R),span=M.x1-M.x0+300;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const m of M.pts){const x=M.x0-150+(((m.x-M.x0+150)+T*m.sp)%span+span)%span,y=m.y+Math.sin(T*.4+m.ph)*8,a=.24+.08*Math.sin(T*.6+m.ph);
    ctx.save();ctx.translate(x,y);ctx.scale(1,.3);drawGlow(ctx,0,0,m.r,'160,232,240',a);drawGlow(ctx,m.r*.25*Math.sin(T*.3+m.ph),-m.r*.15,m.r*.45,'215,250,255',a*.6);ctx.restore();}
  ctx.restore();
  // very tiny bats, flitting high in the dark
  ctx.save();ctx.fillStyle='rgba(12,14,22,.9)';for(let i=0;i<5;i++){const s=T*(.18+hash(i,1,DUN.room+40)*.12)+hash(i,2,DUN.room+40)*9,x=687+Math.sin(s)*(420+hash(i,3,DUN.room)*200)+Math.sin(s*3.1)*40,y=110+hash(i,4,DUN.room)*170+Math.sin(s*2.3)*30+Math.sin(s*7)*6,
    fl=Math.sin(T*28+i*2),w=6,dir=Math.cos(s)>0?1:-1;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-w*.6*dir,y-3*fl-1,x-w,y-2*fl);ctx.quadraticCurveTo(x-w*.5,y+.8,x,y+1.2);ctx.quadraticCurveTo(x+w*.5,y+.8,x+w,y-2*fl);ctx.quadraticCurveTo(x+w*.6*dir,y-3*fl-1,x,y);ctx.fill();}
  ctx.restore();}
