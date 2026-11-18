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
  21:{name:'',dark:0,home:1,hk:1.3,floor:[[522,600],[705,594],[930,600],[1150,628],[1160,768],[606,768],[606,640],[522,632]],   /* the floor starts just right of the front door, so Lum never stands on the door itself; the table is solid */
     block:[{x0:598,y0:664,x1:705,y1:769},{x0:868,y0:590,x1:1120,y1:694}],
     fg:[{y:690,poly:[[120,650],[205,617],[315,609],[470,626],[612,645],[640,640],[700,636],[705,768],[120,768]]},   /* traced along the table top's back edge, so whoever walks behind it is hidden from the waist down */{y:688,poly:[[912,600],[1098,595],[1098,700],[905,700]]}]},
  /* 23: the basement workshop under the cottage (behind the bookshelf left of the fireplace; opened by a story event) */
  23:{name:'',dark:0,home:1,hk:1.25,floor:[[140,522],[470,512],[1000,555],[1195,600],[1245,640],[1245,768],[350,768],[350,600],[140,575]],
     block:[{x0:500,y0:486,x1:945,y1:696},{x0:660,y0:705,x1:905,y1:769},{x0:920,y0:600,x1:1060,y1:665}],
     fg:[{y:698,poly:[[500,470],[950,470],[950,700],[496,700]]},{y:769,poly:[[680,712],[905,712],[905,768],[680,768]]},{y:769,poly:[[118,592],[360,592],[360,768],[118,768]]}]},
  /* 24: the Ruins Overlook, off the west end of the Coastal Breezeway (the designer's painting): a stony path climbs to steps and a ring-walled lookout over the misty ruins */
  /* 25: inside the bottom-left clam house in Breezevale Cove, a seaside shop (the designer's painting); the shopkeeper stands behind the counter */
  25:{name:'',dark:0,home:1,hk:1.15,floor:[[300,595],[545,592],[560,566],[690,566],[690,602],[1012,602],[1018,592],[1150,592],[1180,604],[1150,628],[950,632],[950,742],[372,742],[368,640],[290,628]],
     fg:[{y:592,poly:[[680,470],[1012,476],[1012,590],[680,590]]}]},   /* the counter, in front of whoever stands behind it */
  /* 26: inside the bottom-right clam house, a cosy sitting room (the designer's painting) */
  26:{name:'',dark:0,home:1,hk:1.3,floor:[[40,700],[110,670],[430,650],[480,608],[600,602],[680,628],[1040,626],[1100,604],[1150,642],[1330,652],[1290,684],[1255,768],[40,768]],
     block:[{x0:555,y0:612,x1:852,y1:702},{x0:838,y0:640,x1:1142,y1:769},{x0:1255,y0:650,x1:1380,y1:769}],
     fg:[{y:700,poly:[[828,545],[1145,545],[1145,768],[828,768]]},{y:690,poly:[[553,588],[852,588],[852,702],[553,702]]}]},   /* the armchair and the tea table */
  /* 27: inside the shell house on the islet across the bridge (the designer's painting): a hearth, a dining table, books; Lum comes in through the open door at the back */
  27:{name:'',dark:0,home:1,hk:1.4,floor:[[240,722],[480,702],[500,640],[540,604],[650,600],[760,612],[1180,630],[1215,660],[1205,742],[110,742]],
     block:[{x0:20,y0:640,x1:245,y1:769},{x0:230,y0:612,x1:482,y1:692},{x0:792,y0:612,x1:1152,y1:680},{x0:1210,y0:600,x1:1380,y1:769}],
     fg:[{y:672,poly:[[790,495],[1152,495],[1152,680],[790,680]]}]},   /* the dining table and chairs */
  /* 39: the Hidden Grove (the designer's painting), reached from Evergreen Grove's top-right corner: a mossy clearing among giant trees, a stream running in from the back; Lum comes in at the front */
  39:{name:'Hidden Grove',dark:0,wide:1,hk:1.05,hp:.0042,floor:[[250,768],[330,722],[480,692],[640,662],[610,600],[650,562],[760,536],[900,516],[1060,492],[1200,502],[1290,560],[1330,660],[1345,768]]},
  /* 38: inside the top-right shell house (it replaced the Mayor's; the designer's painting): a long vaulted hall with a stone hearth, long tables, a bar of barrels and a stair to a loft; Lum comes in at the front */
  38:{name:'',dark:0,home:1,hk:1.35,floor:[[300,600],[400,560],[520,522],[640,500],[790,500],[790,565],[1100,565],[1100,546],[1200,546],[1230,575],[1300,640],[1310,768],[80,768],[80,700],[300,690]],
     block:[{x0:0,y0:575,x1:312,y1:768},{x0:505,y0:548,x1:848,y1:692},{x0:455,y0:488,x1:632,y1:560},{x0:1000,y0:590,x1:1092,y1:768},{x0:1092,y0:572,x1:1290,y1:768},{x0:818,y0:512,x1:872,y1:566},{x0:912,y0:518,x1:968,y1:576},{x0:1012,y0:528,x1:1076,y1:578}],
     fg:[{y:550,poly:[[500,535],[850,535],[850,700],[500,700]]},{y:577,poly:[[0,560],[312,560],[312,768],[0,768]]},{y:574,poly:[[1000,560],[1300,560],[1300,768],[1000,768]]},{y:540,poly:[[785,458],[1100,458],[1100,562],[785,562]]}]},   /* the long tables and benches; the bar counter, in front of the innkeeper */
  /* 28: inside the top-left shell house (the designer's painting): a fisher's home, table, hearth, bed; the door is on the left wall */
  28:{name:'',dark:0,home:1,hk:1.35,floor:[[150,622],[300,598],[480,566],[820,560],[1040,566],[1050,640],[1035,768],[340,768],[200,700],[150,680]],
     block:[{x0:470,y0:540,x1:815,y1:690},{x0:1040,y0:470,x1:1380,y1:769},{x0:0,y0:640,x1:150,y1:769},{x0:130,y0:680,x1:340,y1:769}],
     fg:[{y:688,poly:[[415,470],[815,470],[815,690],[415,690]]}]},   /* the table and chairs */
  24:{name:'Ruins Overlook',dark:0,wide:1,hk:.62,floor:[[690,768],[700,705],[738,655],[768,603],[782,560],[780,512],[766,488],[756,450],[788,433],[880,431],[922,450],[914,480],[872,498],[860,560],[868,612],[880,664],[902,715],[922,768]]},
  /* 29: the Sanctuary of Water's front (the designer's painting): carved double doors in a glass-domed hall, steps up between two fern planters, spouts pouring into pools either side */
  29:{name:'Sanctuary of Water',dark:0,wide:1,hk:1,floor:[[590,768],[596,720],[580,700],[568,640],[592,610],[596,592],[500,590],[420,588],[418,568],[600,574],[700,580],[800,574],[985,568],[985,588],[900,590],[806,592],[810,610],[808,640],[795,700],[782,720],[790,768]],
     fg:[{y:640,poly:[[478,500],[592,500],[592,652],[478,652]]},{y:640,poly:[[788,500],[905,500],[905,652],[788,652]]}]},   /* the fern planters */
  /* 30: the Sanctuary's great hall (the designer's painting), seen from the doorway: a cobbled walk winds between pools to a grand stair; two arched bridges cross the water */
  30:{name:'',dark:0,wide:1,hk:.715,hp:.005,floor:[[300,768],[392,700],[450,688],[440,640],[470,612],[555,580],[600,555],[648,548],[652,520],[690,500],[715,498],[790,498],[830,505],[855,515],[800,530],[760,548],[742,575],[730,595],[705,615],[690,640],[692,700],[680,768]],
     more:[[[402,518],[478,512],[486,540],[408,546]],[[738,506],[785,506],[810,410],[830,352],[796,352],[776,410]]],   /* + the grand stair up to the far door */   /* the stone ledge under the left waterfall, by the far doorway */
     arch:[{x0:470,x1:652,y0:538,y1:552,dy:9,top:[[470,535],[500,530],[520,524],[540,520],[560,520],[580,526],[600,536],[620,548],[652,552]]},{x0:728,x1:985,y0:590,y1:590,dy:8,top:[[728,590],[735,570],[760,565],[790,560],[810,556],[870,557],[900,560],[930,568],[960,578],[985,583]]}],   /* the two bridges: walked along their decks, feet just behind the front rail */
     fg:[{y:562,poly:[[470,526],[500,520],[520,514],[540,510],[560,510],[580,516],[600,526],[620,538],[648,543],[648,566],[470,562]]},{y:600,poly:[[728,560],[760,553],[790,548],[810,544],[870,545],[900,548],[930,556],[960,566],[995,576],[995,602],[728,602]]}]},   /* their front rails */
  /* 31: the Sanctuary's altar chamber (the designer's painting), at the top of the hall's grand stair: a crystal altar on a round mosaic floor under a stained-glass water maiden; Sage Luma is here */
  31:{name:'',dark:0,wide:1,hk:1.2,hd:.35,floor:[[400,768],[405,700],[412,640],[425,585],[448,540],[478,508],[560,500],[820,500],[905,508],[935,540],[955,585],[965,640],[975,700],[990,768]],
     block:[{x0:540,y0:470,x1:835,y1:598},{x:688,y:620,rx:34,ry:16}],   /* the altar; Sage Luma */
     fg:[{y:598,poly:[[538,395],[835,395],[838,598],[538,598]]}]},   /* the altar, in front of whoever walks behind it */
  /* 32: underground ruins room 1 (the designer's painting), down the sunken entrance off the Breezeway's secret way: Lum comes in at the steps on the left; a vaulted tunnel runs on to the next room */
  32:{name:'',dark:0,wide:1,hk:.95,hp:.0047,flat:{x0:430,x1:580,y:690},floor:[[350,725],[345,690],[320,640],[300,600],[292,565],[330,548],[420,560],[500,600],[560,578],[650,548],[720,518],[780,503],[900,503],[960,528],[1010,578],[1050,640],[1075,725]]},
  /* 33: underground ruins room 2 (the designer's painting): a five-headed hydra statue under a shaft of light, an altar with a cauldron and old books in front of it; the doorway on the left leads to room 3 */
  33:{name:'',dark:0,wide:1,hk:1.15,floor:[[410,705],[340,650],[325,575],[400,548],[470,530],[520,545],[530,610],[965,610],[975,560],[1000,545],[1020,600],[1000,640],[945,640],[905,700],[955,740],[380,740]]},
  /* 34: underground ruins room 3 (the designer's painting): a vaulted crypt of pillars, a trickle of water across the floor; a doorway straight ahead and a dark arch on the right */
  34:{name:'',dark:0,wide:1,hk:1.05,hp:.0042,floor:[[420,740],[470,680],[460,640],[480,580],[540,540],[580,512],[720,512],[800,540],[870,575],[990,560],[1050,530],[1150,530],[1150,560],[1010,600],[990,640],[930,700],[880,740]]},
  /* 35: underground ruins room 4 (the designer's painting): a long carved hall of arches, a stream running down it toward a dark tunnel at the far end */
  35:{name:'',dark:0,wide:1,hk:1.05,hp:.0046,floor:[[470,735],[440,670],[450,620],[540,575],[640,525],[700,505],[760,505],[820,535],[900,570],[940,600],[930,650],[880,700],[880,735]]},
  /* 36: underground ruins room 5 (the designer's painting): the carved hall opens round a still pool; stairs on the left climb up to the island ruins, a broken gap in the back wall is the passage to room 6 */
  36:{name:'',dark:0,wide:1,hk:1.05,hp:.0046,floor:[[470,735],[440,670],[450,620],[400,585],[395,555],[440,548],[560,545],[620,525],[700,512],[780,522],[830,545],[900,565],[940,600],[930,650],[880,700],[880,735]],
     block:[{x:752,y:576,rx:118,ry:22}]},   /* the pool */
  /* 37: underground ruins room 6 (the designer's painting): a dead-end chamber, roots over the back wall, a dark pool, an old adventurer's skeleton slumped by the right pillar. A big monster will wait here (still to come) */
  37:{name:'',dark:0,wide:1,hk:1.1,floor:[[560,735],[560,690],[600,652],[700,646],[800,632],[880,614],[930,622],[955,665],[955,705],[920,735]]},
  /* 22: the loft, the bed under the thatch; the stair comes up on the right behind the rail */
  22:{name:'',dark:0,home:1,hk:1.9,floor:[[120,738],[460,730],[1050,726],[1050,612],[1185,612],[1185,768],[110,768]],
     block:[{x0:440,y0:430,x1:1052,y1:724}]},   /* the serpent gate (above): arrive in the lit stairwell behind the carved archway (back to room 19), walk down through it; the way on is in the foreground */
  5:{name:'Deeproot',sub:'turn back',dark:.86,floor:[[420,768],[480,640],[560,580],[620,540],[700,540],[800,580],[950,620],[1050,700],[1080,768]]}};
const EYES5=[[200,144],[290,106],[275,181],[331,319],[500,140],[652,129],[625,238],[731,190],[512,422],[612,444],[212,481],[212,512],[440,275],[420,412],[610,282]];
function dunArch(x,y){const R=DROOMS[DUN.room];for(const a of (R&&R.arch)||[])if(x>=a.x0&&x<=a.x1){const t=(x-a.x0)/(a.x1-a.x0);const yg=a.y0+(a.y1-a.y0)*t;if(Math.abs(y-yg)<a.dy){const P=a.top;let k=0;while(k<P.length-2&&x>P[k+1][0])k++;const u=clamp((x-P[k][0])/(P[k+1][0]-P[k][0]),0,1);return Math.max(0,yg-(P[k][1]+(P[k+1][1]-P[k][1])*u));}}return -1;}   /* how high a bridge deck lifts whoever is on it (-1: not on one) */
function dunFree(x,y){const R=DROOMS[DUN.room];if(!inPoly(x,y,R.floor)&&!(R.more||[]).some(P=>inPoly(x,y,P))&&dunArch(x,y)<0)return false;if(DUN.room===20&&WB10.st&&y<615&&x>750&&x<965)return false;if(DUN.room===20&&WB10.chest&&((x-WB10.chest.x)/52)**2+((y-WB10.chest.y-2)/20)**2<1)return false;   /* the caved-in archway */
  for(const b of (R.block||[]))if(b.x0!==undefined?(x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1):((x-b.x)/b.rx)**2+((y-b.y)/b.ry)**2<1)return false;return true;}
function solveDun(px,py,nx,ny){if(dunFree(nx,ny))return [nx,ny];if(dunFree(nx,py))return [nx,py];if(dunFree(px,ny))return [px,ny];return [px,py];}
const dunH=(y,x)=>{const R=DROOMS[DUN.room]||{};if(R.flat&&x!=null){const F=R.flat,w=clamp((F.x1-x)/(F.x1-F.x0),0,1);y+=w*Math.max(0,F.y-y);}return R.hp?150*Math.exp((clamp(y,250,768)-620)*R.hp)*R.hk:dunH0(y);};   /* hp: true perspective, for deep views where people shrink a lot; flat: left of x0 people keep the size they have at y (a stairway climbing up the screen), blending back by x1 */
const dunH0=y=>(150+(clamp(y,380,768)-620)*((DROOMS[DUN.room]||{}).hd||.28))*((DROOMS[DUN.room]||{}).hk||1);   /* hd: how fast people shrink into the distance */   /* hk: a room drawn closer up (the cottage) draws everyone bigger */
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
  if(r===24){D(806,750,95,()=>goScene(leaveOverlook));DUNINT.push({x:838,y:440,reach:95,onInteract:()=>talk([['Lum',"Ancient ruins, rising out of the mist far across the water…"],['Lum',"There's no easy way down to them from here. I'll have to find another way."]])});}
  if(r===21){D(452,612,100,()=>goScene(leaveCottage));D(1172,662,70,()=>dunGo(22,1115,700,-1));
    DUNINT.push({x:820,y:612,reach:90,get fire(){return HST.st>=6;},onInteract:()=>{if(canLumMix()&&HST.st>=6)openMix();else say("A warm fire crackles in the hearth. A kettle hangs over the flames.");}});   /* Lum can mix at Alma's hearth in the morning */}
  if(r===21)DUNINT.push({get x(){return ALMA.x;},get y(){return ALMA.y+10;},get reach(){return ALMA.on&&(HST.st===3||HST.st>=5)&&!DLG.active&&!WEVENT.on?90:-1;},onInteract:almaTalk});   /* talk to Alma */
  if(r===21)DUNINT.push({get x(){return AMR.x;},get y(){return AMR.y+10;},get reach(){return (HST.amrIn&&HST.st===3||hsHome2())&&!DLG.active&&!WEVENT.on?90:-1;},onInteract:()=>hsHome2()?hsBabyGrow():hsBabyAdmire()});   /* Amroth, beside Alma, before Lum goes up to bed */
  if(r===21&&C2.basement)D(695,610,50,()=>dunGo(23,300,580,1));   /* the bookshelf door to the basement, once the story opens it */
  if(r===25){D(445,728,95,()=>goScene(()=>leaveBVHouse(2)));for(const n of BVNPC)if(n.room===25)DUNINT.push({x:n.x,y:n.y+60,reach:110,onInteract:()=>bvNpcTalk(n)});}
  if(r===26){D(330,758,100,()=>goScene(()=>leaveBVHouse(3)));DUNINT.push({x:540,y:612,reach:95,fire:true,onInteract:()=>{if(canLumMix())openMix();else say("A little iron stove, warm and ticking.");}});   /* the stove: Lum can mix here */for(const n of BVNPC)if(n.room===26)DUNINT.push({x:n.x,y:n.y+10,reach:95,onInteract:()=>bvNpcTalk(n)});}
  if(r===29){D(690,750,90,()=>goScene(leaveSanctuary));D(700,592,95,()=>dunGo(30,470,725,1));}
  if(r===30){D(470,748,95,()=>dunGo(29,700,612,1));D(814,360,40,()=>dunGo(31,690,728,1));}   /* the far door at the top of the stair, to the altar chamber */
  if(r===31){D(690,755,70,()=>dunGo(30,812,372,1));for(const n of BVNPC)if(n.room===31)DUNINT.push({x:n.x,y:n.y+10,reach:100,onInteract:()=>bvNpcTalk(n)});}
  if(r===32&&!C2.ruinsIn){C2.ruinsIn=1;hsGoal('Explore the underground ruins');}
  if(r===32){D(318,566,75,()=>goScene(leaveRuins));D(840,508,55,()=>dunGo(33,660,730,1));}   /* the steps back up; the way on to room 2 */
  if(r===37){RL6.t=-1;D(740,738,75,ruinsLeave6);DUNINT.push({x:905,y:640,reach:80,onInteract:ruinsSkeleton});}   /* the only way out; the old explorer's skeleton (touching it wakes the Wraith Lord) */
  if(r===36){D(660,738,80,()=>dunGo(35,728,525,1));D(412,560,55,()=>goScene(enterIsland));D(690,518,45,()=>dunGo(37,740,712,1));}   /* back to the long hall; the stairs up to the island ruins (still to come); the gap to room 6 */
  if(r===35){D(660,738,80,()=>dunGo(34,650,530,1));D(728,512,45,()=>dunGo(36,660,712,1));}   /* back to the crypt; the tunnel at the far end to room 5 */
  if(r===34){D(660,738,80,()=>dunGo(33,470,560,1));D(650,516,50,()=>dunGo(35,660,712,1));D(1100,535,55,()=>say("A dark archway…"));}   /* back to the hydra room; the passage ahead to room 4; the right arch (where it leads is still to come) */
  if(r===33){D(660,758,80,()=>dunGo(32,840,525,-1));D(470,540,55,()=>dunGo(34,660,712,1));DUNINT.push({x:770,y:618,reach:85,onInteract:ruinsBook});}   /* back to the tunnel; the doorway to room 3; the old book on the altar */
  if(r===39){D(720,752,90,()=>goScene(leaveHiddenGrove));DUNINT.push({x:660,y:566,reach:85,onInteract:hiddenStream});}   /* the way back to Evergreen Grove; the stream, where the Serpent Charm glints */
  if(r===38){D(690,752,90,()=>goScene(()=>leaveBVHouse(1)));for(const n of BVNPC)if(n.room===38)DUNINT.push({x:n.x,y:575,reach:110,onInteract:()=>bvNpcTalk(n)});DUNINT.push({x:300,y:612,reach:110,fire:true,onInteract:()=>{if(canLumMix())openMix();else say("A big fire roars in the stone hearth.");}});}   /* the way out at the front; the hearth: Lum can mix here */
  if(r===28){D(190,650,95,()=>goScene(()=>leaveBVHouse(0)));for(const n of BVNPC)if(n.room===28)DUNINT.push({x:n.x,y:n.y+10,reach:95,onInteract:()=>bvNpcTalk(n)});
    DUNINT.push({x:905,y:585,reach:110,fire:true,onInteract:()=>{if(canLumMix())openMix();else say("A warm fire crackles under the kettle.");}});}   /* the hearth: Lum can mix here */
  if(r===27){D(590,612,90,()=>goScene(()=>leaveBVHouse(4)));for(const n of BVNPC)if(n.room===27)DUNINT.push({x:n.x,y:n.y+10,get reach(){return n.gone&&n.gone()?-1:100;},onInteract:()=>bvNpcTalk(n)});
    DUNINT.push({x:330,y:640,reach:110,fire:true,onInteract:()=>{if(canLumMix())openMix();else say("A warm fire crackles in the hearth.");}});}   /* the hearth: Lum can mix here */
  if(r===22){D(1160,728,70,()=>dunGo(21,1120,672,-1));DUNINT.push({x:760,y:738,reach:95,dynDoor:1,door:false,onInteract:hsBed});   /* the bed: '…' bubble, asks to rest */}
  if(r===23){D(258,560,70,()=>dunGo(21,680,640,1));}
  if(r===20&&WB10.chest)DUNINT.push({x:WB10.chest.x+30,y:WB10.chest.y+28,reach:85,onInteract:openWB10Chest});
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
  for(const [room,x,y,pack] of [[32,760,610,1],[33,500,680,1],[34,560,560,1],[34,1080,545,1],[35,760,560,1],[36,520,600,1],[36,900,660,1]])DFOES.push({id:id++,kind:'ghost',scene:'dun',room,x,y,hx:x,hy:y,tx:x,ty:y,s:1,pack,calm:1,ph:rnd(0,TAU),t:0,face:-1});   /* ghosts drifting through underground ruins rooms 1–5 (2–3 foes a room with the skeletons) */
  for(const [room,x,y,pack] of [[32,900,560,1],[32,980,660,2],[33,880,690,1],[34,860,620,1],[35,560,600,1],[35,880,650,2],[36,840,600,1]])DFOES.push({id:id++,kind:'rskel',scene:'dun',room,x,y,hx:x,hy:y,tx:x,ty:y,s:1,pack,calm:1,ph:rnd(0,TAU),t:0,face:-1,over:{hp:18,atk:4,def:2}});   /* skeletons in underground ruins rooms 1–5 */
  for(const [room,x,y] of [[2,520,700],[2,950,690],[5,900,690]])DFOES.push({id:id++,kind:'bat',scene:'dun',room,x,y,hx:x,hy:y,tx:x,ty:y,s:1,pack:1,calm:0,ph:rnd(0,TAU),t:0,face:-1});}
function updateDFoes(dt){const ok=!DLG.active&&!WEVENT.on&&!MENU.open&&!FADE.dir&&!BATTLE.on&&!BATTLE.pending&&!CHOICE.on&&!MIX.on;
  for(const g of DFOES){if(g.room!==DUN.room)continue;g.ph+=dt;g.t+=dt;g.calm=Math.max(0,g.calm-dt);const d=Math.hypot(lum.x-g.x,lum.y-g.y);
    if(g.still){if(g.lair){g.face=-1;if(ok&&d<190&&lum.bumpT<=0)startEncounter(g,'normal');continue;}g.face=g.asleep?1:lum.x<g.x?-1:1;if(g.kind==='vixen'&&ok&&!g.calm&&d<130&&lum.bumpT<=0)startEncounter(g,'normal');continue;}
    if(ok&&!g.calm&&d<230){g.tx=lum.x;g.ty=lum.y;if(d<60&&lum.bumpT<=0){startEncounter(g,'ambush');continue;}}
    else if(g.t>2.5||Math.hypot(g.tx-g.x,g.ty-g.y)<10){g.t=0;const a=rnd(0,TAU);g.tx=g.hx+Math.cos(a)*rnd(40,160);g.ty=g.hy+Math.sin(a)*rnd(10,50);}
    if(!ok)continue;const dx=g.tx-g.x,dy=g.ty-g.y,dd=Math.hypot(dx,dy)||1,sp=d<230&&!g.calm?95:55;const nx=g.x+dx/dd*sp*dt,ny=g.y+dy/dd*sp*dt;if(dunFree(nx,ny)){g.x=nx;g.y=ny;}else{g.tx=g.hx;g.ty=g.hy;}if(Math.abs(dx)>4)g.face=dx<0?-1:1;}}
function drawDFoe(g){const k=dunH(g.y,g.x)/151,bob=Math.sin(g.ph*3)*8;if(g.kind==='ghost'){if(CAPTURE.on&&g===BATTLE.capG)return;const mv=Math.hypot(g.tx-g.x,g.ty-g.y)>8,up=mv&&g.ty<g.y-6&&Math.abs(g.ty-g.y)>Math.abs(g.tx-g.x),h=160*k,fy=g.y-10*k+Math.sin(g.ph*1.7)*6*k;ctx.save();ctx.fillStyle='rgba(10,10,30,.15)';ctx.beginPath();ctx.ellipse(g.x,g.y,24*k,6*k,0,0,TAU);ctx.fill();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x,fy-h*.5,h*.5,'190,200,255',.12);ctx.restore();ctx.save();ctx.globalAlpha=.66+.1*Math.sin(g.ph*2.3);c1Frame(ctx,'ghost',up?'up':mv?'side':'float',Math.floor(g.ph*(mv?7:5)),g.x,fy,h,!up&&g.face<0,.66,0);ctx.restore();return;}   /* see-through, drifting */if(g.kind==='rskel'){g.moving=Math.hypot(g.tx-g.x,g.ty-g.y)>8;ctx.save();ctx.translate(g.x,g.y);ctx.scale(k,k);ctx.translate(-g.x,-g.y);drawWFoe(g);ctx.restore();return;}if(g.kind==='bigspider'){const h=330*k;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.5,h*.09,0,0,TAU);ctx.fill();ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x,g.y-h*.35,h*.6,'150,120,200',.16+.05*Math.sin(T*1.5));ctx.restore();ctx.save();ctx.filter='brightness(1.45) contrast(1.1)';c1Frame(ctx,'spider_dark','idle',Math.floor(g.ph*4)%4,g.x,g.y,h,true,1,0);ctx.restore();return;}if(g.kind==='rvixen'){const mv=Math.hypot(g.tx-g.x,g.ty-g.y)>8,h=118*k;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.42,h*.07,0,0,TAU);ctx.fill();c1Frame(ctx,'fox_red','run',mv?Math.floor(g.ph*14)%12:0,g.x,g.y,h,g.face>0,1,0);return;}if(g.kind==='spider'){const mv=Math.hypot(g.tx-g.x,g.ty-g.y)>8;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,34*k,7*k,0,0,TAU);ctx.fill();c1Frame(ctx,'spider',mv?'crawl':'idle',Math.floor(g.ph*(mv?12:4))%(mv?5:4),g.x,g.y,70*k,mv?g.face>0:g.face<0,1,0);return;}if(g.kind==='vixen'||g.kind==='bigvixen'){const h=(g.kind==='bigvixen'?230:120)*k,br=1+Math.sin(g.ph*(g.asleep?1.4:3))*.012;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(g.x,g.y,h*.42,h*.07,0,0,TAU);ctx.fill();ctx.save();ctx.translate(g.x,g.y);ctx.scale(1,br);ctx.translate(-g.x,-g.y);c1Frame(ctx,'fox',g.asleep?'hurt':'run',0,g.x,g.y,h,g.face>0,1,0);ctx.restore();
    ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,g.x,g.y-h*.4,h*.5,'255,170,90',.08+.03*Math.sin(g.ph*2));ctx.restore();return;}ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(g.x,g.y,26*k,6*k,0,0,TAU);ctx.fill();
  c1Frame(ctx,'bat','fly',Math.floor(g.ph*9)%3,g.x,g.y-110*k-bob,90*k,g.face>0,1,0);}
function enterDun(room,x,y,face){DUN.entry=[room,x,y,face];   /* where Lum came in: Chapter 2 sends her back here after a lost battle */
  const prevRoom=SCENE==='dun'?DUN.room:0;buildDFoes();SCENE='dun';DUN.room=room;if(room>=6)C1['seen'+room]=1;lum.x=x??560;lum.y=y??640;lum.face=face||1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=lum.x;WTITLE.t=(prevRoom>=11&&room>=11)||DROOMS[room].home||!DROOMS[room].name?99:0;   /* no empty title band for unnamed rooms */setupDun();   /* the area title shows once, on entering the Worldbind Passage, not between its rooms */
  if(room===1&&!C1.dunSeen){C1.dunSeen=1;setTimeout(()=>talk([['Lum',"Cosmic? …Cosmic!"]]),900);}
  if(room===5)DUN.eyes=EYES5.map(()=>({b:rnd(0,6),t:0}));}
function drawDun(){const R=DROOMS[DUN.room],im=IMG['dun'+DUN.room];if(!ready(im))return;const [rz,roy]=roomView();
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#07080c';ctx.fillRect(0,0,W,H);
  const qk=DUN.room===20&&WB10.st?WB10.q:DUN.room>=15&&DUN.room<=20?WB5.q:[0,0];ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz+qk[0]),DPR*(qk[1]+roy));ctx.drawImage(im,0,0,1375,768);   /* room 5 trembles */
  if(DUN.room>=21&&DUN.room<=22&&HST.st<4&&ready(IMG['dun'+DUN.room+'_night']))ctx.drawImage(IMG['dun'+DUN.room+'_night'],0,0,1375,768);   /* night outside the cottage windows until Lum has slept */
  if(DUN.room===20){drawWB10Rubble();drawWB10Glow();}
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
  const k=dunH(lum.y,lum.x)/151,here=DFOES.filter(g=>g.room===DUN.room);{const L=here.map(g=>[g.y,()=>drawDFoe(g)]);
    L.push([lum.y,()=>{ctx.save();ctx.translate(lum.x,lum.y-Math.max(0,dunArch(lum.x,lum.y)));ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();}]);
    if(CH===1&&jakInParty()&&JAKF){const kj=dunH(JAKF.y,JAKF.x)/151;L.push([JAKF.y-1,()=>{ctx.save();ctx.translate(JAKF.x,JAKF.y);ctx.scale(kj,kj);ctx.translate(-JAKF.x,-JAKF.y);drawJakOW();ctx.restore();}]);}   /* Spar comes down into the rooms with Lum */
    for(const n of BVNPC)if(n.room===DUN.room&&!(n.gone&&n.gone()))L.push([n.y,()=>drawBVNpc(n)]);
    if(jak2In()){const kj=dunH(JK2.y,JK2.x)/151;L.push([JK2.y-1,()=>{ctx.save();ctx.translate(JK2.x,JK2.y);ctx.scale(kj,kj);ctx.translate(-JK2.x,-JK2.y);drawJak2OW();ctx.restore();}]);}   /* Jak follows Lum into rooms once he joins in Chapter 2 */
    if(DUN.room===21){L.push([ALMA.y,()=>{drawAlmaRoom();}]);if(HST.heart>0)L.push([9999,()=>drawHearts((lum.x+ALMA.x)/2,Math.min(lum.y,ALMA.y)-150*dunH(lum.y)/151)]);}
    if(CH>=2&&(C2.joined||((HST.amrIn||hsHome2())&&DUN.room===21))){const ka=dunH(AMR.y,AMR.x)/151;L.push([AMR.y-1,()=>{ctx.save();ctx.translate(AMR.x,AMR.y);ctx.scale(ka,ka);ctx.translate(-AMR.x,-AMR.y);drawAmrOW(AMR,1);ctx.restore();}]);}
    if(DUN.room===7)L.push([614,()=>{const t=IMG.dun7_table;if(!ready(t))return;const hid=lum.y<614&&Math.abs(lum.x-945)<240;ctx.save();ctx.globalAlpha=hid?.62:1;ctx.drawImage(t,730,425);ctx.restore();}]);
    if(DUN.room===14){for(const d of BO.ow)L.push([d.y,()=>drawDemonOW(d.x,d.y,d.face,d.a,d.mv,0,d)]);const g=BO.chaser;if(g)L.push([g.y,()=>drawDemonOW(g.x,g.y,g.face,g.a,g.mv,0,g)]);}
    if(DUN.room===20&&(WB10.chest||WB10.spark>0)){const cy=WB10.chest?WB10.chest.y:WB10.sy;L.push([cy,drawWB10Chest]);}
    if(DUN.room===18&&WB8.boss){const g=WB8.boss;L.push([g.y,()=>drawDemonOW(g.x,g.y,g.face,g.a,g.mv,2,g)]);}
    if(DUN.room>=15&&DUN.room<=19)for(const g of [WB5.chaser,WB5.brown])if(g){L.push([g.y,()=>drawDemonOW(g.x,g.y,g.face,g.a,g.mv,g.big,g)]);if(g.trio)for(const [tx,ty] of trioPos(g))L.push([ty,()=>drawDemonOW(tx,ty,g.face,g.a,g.mv,0)]);}
    for(const F of (R.fg||[]))L.push([F.y,()=>{ctx.save();ctx.beginPath();F.poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();ctx.drawImage(im,0,0,1375,768);ctx.restore();}]);   /* furniture that stands in front of whoever is behind it */
    if(DUN.room===37&&RL6.t>=0)L.push([RL6.y,drawRL6]);
    if((DUN.room===29||DUN.room===24)&&NIGHT.rain)L.push([9997,()=>{ctx.save();ctx.beginPath();ctx.rect(0,0,1375,768);ctx.clip();drawRain(1/60);ctx.restore();}]);   /* only over the painting, not the dark bands around it */   /* the Sanctuary's front is out in the rain */
    if(DUN.room===24){L.unshift([-1,()=>drawOverlookMist(0)]);L.push([9998,()=>drawOverlookMist(1)]);}   /* mist over the sea behind, low wisps drifting in front */
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
