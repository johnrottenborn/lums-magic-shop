/* ---------- Chapter 3 (no name yet): Lum leaves Undinia for Noma ----------
   Starts where Chapter 2 ends, at Sage Luma's altar in the Sanctuary of Water. Sage Luma sends Lum west to King Bramt in Noma and tells her to ask her
   new friends to come. Jak is away ("Gone Fishing"); back at Amroth's home the baby is already a boy who swings a wooden sword, and Amroth asks Lum inside.
   Placeholder lines throughout, for the designer to revise. */
/* the boy (the designer's sheets, masters in art/hq/boy_*): front walk, back walk, side walk and run (facing right), sword swings from the side (facing right),
   front and back, and two back frames holding the sword */
C1ATL.boy={"cw":175,"ch":183,"rows":{"down":[0,6],"up":[1,5],"side":[2,4],"run":[3,6],"swing":[4,6],"swingf":[5,6],"swingb":[6,4],"holdb":[7,2]}};
const BOY_H=80;   /* a little boy beside Lum's 104 */
const C3={st:0,t:0,title:0,amrIn:0,boy:{x:0,y:0,face:1,mode:'idle',t:0,ph:0}};
/* where things stand in Amroth's yard (offsets from HOMEX/HOMEY) */
const C3YARD={tree:[925,1035],amr:[1200,1120],boy:[1130,1135],swing:[982,1042]};
const c3Pt=p=>[HOMEX+p[0],HOMEY+p[1]];
function startChapter3(){startChapter2();c2Skip();WB10.st=2;chPlaytestBreezeway();CH=3;
  /* a finished Chapter 2: the rain is over, the ruins are open, Mai is with Lum, Jak has gone home, Amroth stayed with Alma */
  Object.assign(C2,{on:false,joined:0,lumaMet:1,rainDone:1,bvArrived:1,jak:0,jakLeft:1,ruinWay:1,ruinsIn:1,maiGlimpse:1,maiSeen:1,maiJoined:1,done:1,gsnakeBeat:1,wraithBeat:1,vaultGhosts:1,homeMai:1,babyGrow:1,babyN:7,isl:15,title:0});
  learnVenom(true);learnPotency(true);NIGHT.rain=false;
  PARTY_ORDER.length=0;PARTY_ORDER.push('lum');HEROES.lum.hp=HEROES.lum.maxHp;
  {const k=bestCh2Keepsake();if(k)PARTY.lum.charm=k.id;}   // Chapter 3 starts with the best Chapter 2 keepsake equipped
  Object.assign(C3,{st:1,t:0,title:.001,amrIn:0});Object.assign(C3.boy,{mode:'idle',t:0,ph:0});
  GOAL.tag='';GOAL.text='';HINT.goalT=99;SAVEC.finished=0;
  enterDun(31,688,700,1);lum.dir='up';lum.face=1;WEVENT.on=true;setTimeout(c3LumaOpening,1600);}
/* Sage Luma at the altar */
function c3LumaOpening(){if(C3.st!==1)return;lum.state='idle';lum.vx=lum.vy=0;
  talk([['Sage Luma',"Good morning, Lum. The tide has turned, just as I said it would."],
    ['Sage Luma',"You cannot stay here in Undinia. The answers you need lie across the sea, on the continent of Noma."],
    ['Sage Luma',"Seek out King Bramt. If anyone knows how Fokalur can be stopped, it is him."],
    ['Lum',"Noma… I've only ever seen it on old maps."],
    ['Sage Luma',"The journey will not be easy. The sea is wide, and Noma is not kind to strangers."],
    ['Sage Luma',"You have made new friends on this side of the world. See if any of them will go with you."],
    ['Lum',"I will. Thank you, Sage Luma."]],false,()=>{C3.st=2;WEVENT.on=false;hsGoal('Ask your friends to join you on the journey to Noma');});}
function c3LumaTalk(){talk([['Sage Luma',"Seek King Bramt in Noma, Lum. And do not make that journey alone."]]);}
/* Amroth's yard: Amroth and the boy outdoors; Lum walking up starts the talk */
function c3HomeActive(){return CH>=3&&C3.st>=2&&!C3.amrIn;}
function c3AmrPos(){return C3.walk?[AMR.x,AMR.y]:c3Pt(C3YARD.amr);}
function updateC3(dt){if(CH<3)return;C3.t+=dt;const b=C3.boy;b.t+=dt;
  if(!b.x){[b.x,b.y]=c3Pt(C3YARD.boy);}
  if(b.mode==='run'){const [tx,ty]=c3Pt(C3YARD.swing),dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy);if(d<3){b.x=tx;b.y=ty;b.mode='practice';b.t=0;b.face=-1;}else{const m=Math.min(d,150*dt);b.x+=dx/d*m;b.y+=dy/d*m;b.ph+=m;b.face=dx<0?-1:1;}}
  /* Amroth in the yard, turning to Lum; after the talk he walks to the cottage door and goes in */
  if(SCENE==='thorn'&&inHome()&&!C3.amrIn){if(C3.walk){if(amrWalk(HOMEX+HOME.cot.x+HOME.cot.door,HOMEY+HOME.cot.y+24,90,dt)){C3.walk=0;C3.amrIn=1;}}
    else{const [x,y]=c3Pt(C3YARD.amr);AMR.x=x;AMR.y=y;AMR.moving=0;AMR.dir='side';AMR.face=lum.x<x?-1:1;}}
  if(SCENE==='thorn'&&inHome()&&C3.st===5&&!C3.out&&!FADE.dir)c3OutsideStart();
  updateC3Follow(dt);if(b.mode==='idle'&&C3.st>=5)b.face=lum.x<b.x?-1:1;
  if(SCENE==='thorn'&&inHome()&&C3.st===2&&!DLG.active&&!FADE.dir&&!WEVENT.on){const [ax,ay]=c3AmrPos();if(Math.hypot(lum.x-ax,lum.y-ay)<240)c3AmrTalk();}}
function c3AmrTalk(){if(C3.st!==2){if(C3.st===3)talk([['Amroth',"Inside, Lum. I'll be right behind you."]]);return;}
  C3.st=3;WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;lum.face=lum.x<AMR.x?1:-1;C3.boy.mode='show';C3.boy.t=0;
  talk([['Amroth',"Lum! You're back. Come here, you have to see this."],
    ['Lum',"Is that… the baby?"],
    ['Amroth',"Aye. Not only walking, mind you. Watch him with that wooden sword."],
    ['Amroth',"He's better with a blade than I am! And I've guarded the Worldbind gate for twenty years."],
    ['Amroth',"I've never seen anything like him. Never."],
    ['Amroth',"Come inside, Lum. There's something I must speak with you about… away from this little whirlwind."],
    ['Amroth',"You there, lad! Go and practice your swings against that tree. Fifty more, and mind your footwork!"]],false,()=>{
      C3.boy.mode='run';C3.boy.t=0;C3.walk=1;WEVENT.on=false;hsGoal('Speak with Amroth inside');});}
/* inside, beside Alma's chair: what he tells Lum is still to be written with the designer */
function c3AmrInside(){lum.state='idle';lum.vx=lum.vy=0;lum.face=lum.x<AMR.x?1:-1;
  if(C3.st>=5){talk([['Amroth',"Did you hear that? Come, outside!"]]);return;}
  if(C3.st!==3){talk([['Amroth',"Rest a moment, Lum."]]);return;}
  C3.st=4;WEVENT.on=true;
  talk([['Amroth',"Lum… that boy is not natural."],
    ['Amroth',"A babe in a basket one week, swinging a sword the next. I fear he may be kin to the demons."],
    ['Alma',"Amroth! Look at his eyes. They're angelic… and so kind."],
    ['Amroth',"Aye… his eyes, his manner. I see no darkness in him."],
    ['Amroth',"But no child grows like this. None."],
    ['Lum',"I met your sister, Alma. Sage Luma."],
    ['Lum',"She says I must cross the sea to Noma and seek out King Bramt."],
    ['Alma',"Noma… that is a long way to go alone."],
    ['Amroth',"Then perhaps we should at least see you as far as the port town, where the ships cross the sea."],
    ['Alma',"The river near here flows right down to the port. It's the safest way to travel."],
    ['Amroth',"And I wouldn't mind seeing the coastline again. It's been years."]],false,c3Commotion);}
/* a crash outside: the boy has felled the trees */
function c3Commotion(){C3.felled=1;try{sfxCrumble();setTimeout(()=>{try{sfxCrumble();}catch(e){}},380);setTimeout(()=>{try{sfxCrumble();}catch(e){}},760);}catch(e){}if(typeof shake!=='undefined')shake=14;
  setTimeout(()=>talk([['Amroth',"What was that?!"],['Alma',"The boy!"]],false,()=>{C3.st=5;WEVENT.on=false;hsGoal('See what happened outside');}),1100);}
function c3AlmaTalk(){if(C3.st===3)talk([['Alma',"Amroth wants a word with you, Lum. Go on, I'll listen."]]);else if(C3.st>=5&&C3.st<7)talk([['Alma',"Quickly, Lum!"]]);else talk([['Alma',"The boy is a blessing, Lum. I'm sure of it."]]);}
/* outside again: Amroth and Alma come out with Lum and see what he has done */
function c3OutsideStart(){if(C3.st!==5||C3.out)return;C3.out=1;C3.amrIn=0;HST.amrOut=0;ALMA.on=0;
  const dx=HOMEX+HOME.cot.x+HOME.cot.door,dy=HOMEY+HOME.cot.y+30;AMR.x=dx-60;AMR.y=dy+10;AMR.dir='down';AMR.moving=0;Object.assign(ALMF,{x:dx+60,y:dy+10,dir:'down',moving:0,face:-1,on:1});
  const b=C3.boy;b.mode='idle';[b.x,b.y]=c3Pt([C3YARD.swing[0]+20,C3YARD.swing[1]+40]);
  WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;
  setTimeout(()=>talk([['Lum',"Oh my…"],['Amroth',"He felled them. With a wooden sword."],['Alma',"Are you hurt, little one?"],['Boy',"Fifty swings! …I think the trees got tired."],
    ['Amroth',"This is not natural for any child… but by the gods, I'm impressed."],
    ['Amroth',"That settles it. We leave together, all of us. I'll not leave him here alone, and I'll not let you go alone either, Lum."],
    ['Alma',"To the river, then."]],false,c3PartyJoins),900);}
function c3PartyJoins(){C3.st=7;WEVENT.on=false;C3.party=1;
  PARTY_ORDER.length=0;PARTY_ORDER.push('lum','amroth','alma','spar');for(const id of PARTY_ORDER){syncMaxHp(id);HEROES[id].hp=HEROES[id].maxHp;}
  PARTY.spar.main=null;   /* he fights with his wooden sword (no item icon for it yet) */
  C2.joined=1;C2.basement=1;resetAmrFollow();c3ResetFollow();C3.boy.mode='follow';hsGoal('Set out for the river with your companions');}
/* Alma and the boy follow Lum on the map, further back along the same trail as Amroth */
const ALMF={x:0,y:0,dir:'down',face:1,moving:0,ph:0,on:0};
function c3ResetFollow(){Object.assign(ALMF,{x:lum.x,y:lum.y,moving:0,face:lum.face});const b=C3.boy;b.x=lum.x;b.y=lum.y;}
function trailPt(dist){let acc=0,px=lum.x,py=lum.y;for(let i=AMRCRUMB.length-1;i>=0;i--){const [cx,cy]=AMRCRUMB[i];acc+=Math.hypot(cx-px,cy-py);px=cx;py=cy;if(acc>=dist)return [cx,cy];}return null;}
function stepTo(F,tx,ty,sp,dt){const dx=tx-F.x,dy=ty-F.y,d=Math.hypot(dx,dy);if(d<2){F.moving=0;return;}const m=Math.min(d,sp*dt);F.x+=dx/d*m;F.y+=dy/d*m;F.ph+=m;F.moving=1;
  if(Math.abs(dy)>Math.abs(dx)*1.2)F.dir=dy>0?'down':'up';else{F.dir='side';F.face=dx<0?-1:1;}}
function updateC3Follow(dt){if(!C3.party||(SCENE!=='thorn'&&SCENE!=='dun'))return;if(AMRCRUMB.length>80)return;
  for(const [F,dist] of [[ALMF,118],[C3.boy,170]]){const p=trailPt(dist);if(!p){F.moving=0;continue;}const d=Math.hypot(p[0]-F.x,p[1]-F.y);stepTo(F,p[0],p[1],Math.min(260,70+d*3),dt);}}
function drawAlmaOW(k){const F=ALMF,an=F.moving?(F.dir==='side'?'side':F.dir):(F.dir==='up'?'up':F.dir==='side'?'side':'idle'),n=C1ATL.alma.rows[an][1],fi=F.moving?Math.floor(F.ph/16)%n:an==='side'?3:0;
  ctx.save();ctx.translate(F.x,F.y);ctx.scale(k,k);ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(0,2,26,8,0,0,TAU);ctx.fill();c1Frame(ctx,'alma',an,fi,0,0,ALMA_H,an==='side'&&F.face<0,1,0);ctx.restore();}
function c3DunProps(L){if(!C3.party||CH<3)return;const ka=dunH(ALMF.y,ALMF.x)/151,kb=dunH(C3.boy.y,C3.boy.x)/151;L.push([ALMF.y-2,()=>drawAlmaOW(ka)]);L.push([C3.boy.y-3,()=>{ctx.save();ctx.translate(C3.boy.x,C3.boy.y);ctx.scale(kb,kb);ctx.translate(-C3.boy.x,-C3.boy.y);drawBoyOW();ctx.restore();}]);}
function c3BoyTalk(){const b=C3.boy;b.face=lum.x<b.x?-1:1;talk([['Lum',"Hello there!"],['Boy',"Hyah! Hyah! …Forty-one!"]]);}
/* the practice tree and the boy, sorted into the Stranglethorn draw list (22) */
const C3TREES=[[925,1035,250,0],[860,985,220,1],[995,975,235,0]];   /* the practice tree and two neighbours; the boy fells all three */
function c3Props(L){if(CH<3)return;
  if(inHome())for(const [x,y,w,f] of C3TREES){const [tx,ty]=c3Pt([x,y]);if(C3.felled)L.push([ty,{t:'c3fell',x:tx,y:ty,w,f}]);else L.push([ty,{t:'tree',img:'hfir',x:tx,y:ty,w,base:.95,flip:!!f,solid:1}]);}
  if(inHome()||C3.party)L.push([C3.boy.y-2,{t:'c3boy'}]);
  if(ALMF.on||C3.party)L.push([ALMF.y-1,{t:'c3alma'}]);}
/* a felled fir: a stump, and the tree lying on the grass beside it */
function drawFelled(o){const im=IMG.hfir;if(!ready(im))return;const w=o.w*.82,h=w*im.naturalHeight/im.naturalWidth,dir=o.f?1:-1;
  ctx.save();ctx.translate(o.x+dir*14,o.y+6);ctx.rotate(dir*1.42);ctx.globalAlpha=.97;ctx.drawImage(im,-w/2,-h*.95,w,h);ctx.restore();
  ctx.save();ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(o.x,o.y+3,22,7,0,0,TAU);ctx.fill();ctx.fillStyle='#6a4a30';ctx.fillRect(o.x-12,o.y-18,24,20);
  ctx.fillStyle='#c8a070';ctx.beginPath();ctx.ellipse(o.x,o.y-18,12,4.5,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(120,80,40,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(o.x,o.y-18,7,2.6,0,0,TAU);ctx.stroke();ctx.restore();}
function drawBoyOW(){const b=C3.boy;let an='down',i=0;const fps=9;
  if(b.mode==='follow'){an=b.moving?(b.dir==='side'?'run':b.dir==='up'?'up':'down'):(b.dir==='up'?'up':b.dir==='side'?'side':'down');i=b.moving?Math.floor(b.ph/(an==='run'?14:16))%C1ATL.boy.rows[an][1]:0;}
  else if(b.mode==='run'){an='run';i=Math.floor(b.ph/14)%6;}
  else if(b.mode==='show'){an='swingf';i=Math.floor(b.t*fps)%6;}   /* showing off with the sword, facing Lum */
  else if(b.mode==='practice'){const c=b.t%1.3;an='swing';i=c<6/fps?Math.floor(c*fps):0;}   /* a swing at the tree, a breath, another */
  else{an='down';i=0;}
  ctx.save();ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(b.x,b.y,18,6,0,0,TAU);ctx.fill();ctx.restore();
  c1Frame(ctx,'boy',an,i,b.x,b.y,BOY_H,(an==='swing'||an==='run'||an==='side')&&b.face<0,1,0);}
THINT.push({get x(){return C3.boy.x;},get y(){return C3.boy.y+8;},get reach(){return CH>=3&&inHome()&&C3.boy.mode==='practice'&&!C3.felled&&!DLG.active?80:0;},onInteract:c3BoyTalk});
/* the chapter's title band as it opens (no subtitle) */
function drawC3UI(){if(CH<3||!C3.title)return;C3.title+=1/60;const t=C3.title;if(t>5){C3.title=0;return;}const a=Math.min(1,t*1.2,(5-t)*1.2);
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.fillStyle='rgba(20,14,30,.55)';ctx.fillRect(0,H*.3-46,W,92);ctx.textAlign='center';ctx.fillStyle='#f6ecd8';
  ctx.font=`600 ${Math.round(Math.min(34,W/11))}px Georgia,serif`;ctx.fillText('Chapter 3',W/2,H*.3+12);ctx.restore();}

/* ---- Alma in the party: a healer ---- */
HEROES.alma={id:'alma',name:'Alma',hp:16,maxHp:16,base:{atk:1,def:1,mag:3,spd:2}};
PARTY.alma={main:null,off:null,head:null,chest:null,boots:null,charm:null};
HCOL.alma='#3f8a86';HSUB.alma="Amroth's wife  ·  healer";HCOMBO.alma='Mending Tide';FACEIMG.alma='face_alma';
Object.defineProperty(FACEIMG,'spar',{get(){return CH>=3?'face_boy':'face_spar';},enumerable:true});   /* from Chapter 3 Spar is the boy */
Object.defineProperty(HSUB,'spar',{get(){return CH>=3?"A boy who grows too fast  ·  wooden sword":"Young swordsman  ·  fire blade";},enumerable:true});
MOVEDESC.alma={atk:"A light swat. Her strength is healing.",combo:"A wave of healing water washes over the whole party and cures poison."};
const MENU_OPTS_AL=[['heal','Heal'],['bonk','Attack'],['items','Items'],['run','Run']],MENU_OPTS_ALB=[['burst','Mending Tide'],...MENU_OPTS_AL];
/* Heal: one friend (chosen like Jak's trap); every heal earns a combo star */
function almaHeal(i){const B=BATTLE,h=B.heroes[i],st=heroStats('alma'),H_=HEROES[h.id],n=Math.min(H_.maxHp-H_.hp,2+st.mag+Math.floor(Math.random()*3));H_.hp+=n;pop(h.x,h.y-150*bS(),n>0?'+'+n:'Full health','heal');
  B.fx.push({k:'healglow',x:h.x,y:h.y,t:0,max:1});try{sfxNice();}catch(e){}C1.comboAl=Math.min(COMBO_MAX,(C1.comboAl||0)+1);if(C1.comboAl===COMBO_MAX){const a=B.heroes[B.cur];setTimeout(()=>{if(BATTLE.on)pop(a.x,a.y-230*bS(),'Mending Tide ready!','nice');},500);}
  B.phase='pause';B.t=0;B.after='nextHero';}
function almaTide(){const B=BATTLE,st=heroStats('alma');C1.comboAl=0;for(const h of B.heroes){if(h.ko)continue;const H_=HEROES[h.id],n=Math.min(H_.maxHp-H_.hp,5+st.mag);H_.hp+=n;h.poison=0;pop(h.x,h.y-150*bS(),'+'+n,'heal');B.fx.push({k:'healglow',x:h.x,y:h.y,t:0,max:1.2});}
  try{sfxNice();}catch(e){}B.phase='pause';B.t=0;B.after='nextHero';}
/* in battle: Alma stands side-on facing the foes, glows while she heals, and steps in for an attack; Spar in Chapter 3 is the boy with his wooden sword */
function drawBattleAlma(h){const S=bS(),B=BATTLE,x=h.x+h.ox,y=h.y+h.oy,me=B.heroes[B.cur]===h,ph=B.phase;let an='side',fi=3,flip=false;
  if(me&&(ph==='bonkRun'||ph==='bonkBack'||ph==='run'||ph==='fled')){an='side';fi=Math.floor(B.t*10)%4;flip=ph!=='bonkRun';}
  const glow=B.fx.some(f=>f.k==='healglow'&&Math.abs(f.x-h.x)<1&&f.t<f.max)||(me&&(ph==='tpick'));
  bshadow(x,y+2,34*S,10*S,.35);if(glow)drawGlow(ctx,x,y-70*S,80*S,'150,240,210',.35+.15*Math.sin(T*6));
  ctx.save();ctx.translate(x,y+3);if(h.hurt>0)ctx.translate(Math.sin(h.hurt*60)*4,0);c1Frame(ctx,'alma',an,fi,0,0,ALMA_H*1.45*S,flip,1,h.hurt>.3?1:0);ctx.restore();}
function drawBattleBoy(h){const S=bS(),B=BATTLE,x=h.x+h.ox,y=h.y+h.oy,me=B.heroes[B.cur]===h,ph=B.phase,t=B.t;let an='swing',fi=0,flip=false;
  if(me&&(ph==='bonkRun'||ph==='bonkBack'||ph==='run'||ph==='fled')){an='run';fi=Math.floor(t*12)%6;flip=ph!=='bonkRun';}
  else if(me&&ph==='bonkWind'){an='swing';fi=t<B.windD*.5?2:3;}
  else if(me&&ph==='bonkHit'){an='swing';fi=t<.12?4:5;}
  else if(me&&ph==='sflame'){an='swing';fi=3;}
  bshadow(x,y+2,30*S,9*S,.35);ctx.save();ctx.translate(x,y+3);if(h.hurt>0)ctx.translate(Math.sin(h.hurt*60)*4,0);c1Frame(ctx,'boy',an,fi,0,0,128*S,flip,1,h.hurt>.3?1:0);ctx.restore();
  if(me&&ph==='sflame')drawFlames(ctx,x+40*S,y-118*S,30*S,1);}

/* Chapter 3: the woods east of the cottage have been cleared (stumps left), and a new way east opens there for the party of four */
const C3CLEAR={x0:1560,x1:1960,y0:480,y1:1240},C3EAST=[1850,1000];
function c3Cleared(o){if(o.c3cut===undefined){const lx=o.x-HOMEX,ly=o.y-HOMEY;o.c3cut=['hfir','hbig','htwist'].includes(o.img)&&lx>C3CLEAR.x0&&lx<C3CLEAR.x1&&ly>C3CLEAR.y0&&ly<C3CLEAR.y1;}return o.c3cut;}
function drawStump(o){const r=Math.max(9,o.w*.05);ctx.save();ctx.fillStyle='rgba(10,10,20,.22)';ctx.beginPath();ctx.ellipse(o.x,o.y+3,r*1.8,r*.6,0,0,TAU);ctx.fill();
  ctx.fillStyle='#6a4a30';ctx.fillRect(o.x-r,o.y-r*1.4,r*2,r*1.5);ctx.fillStyle='#c8a070';ctx.beginPath();ctx.ellipse(o.x,o.y-r*1.4,r,r*.38,0,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(120,80,40,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(o.x,o.y-r*1.4,r*.55,r*.2,0,0,TAU);ctx.stroke();ctx.restore();}
function c3EastDoor(){talk([['Amroth',"This way leads east, down to the river."],['Lum',"(The next area is still to come.)"]]);}
THINT.push({get x(){return HOMEX+C3EAST[0];},get y(){return HOMEY+C3EAST[1];},get reach(){return CH>=3&&C3.party&&inHome()?85:0;},door:true,onInteract:c3EastDoor});
