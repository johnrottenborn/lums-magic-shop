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
  talk([['Amroth',"Sit down, Lum. Alma and I have been talking about the boy… and about you."]]);}
function c3BoyTalk(){const b=C3.boy;b.face=lum.x<b.x?-1:1;talk([['Lum',"Hello there!"],['Boy',"Hyah! Hyah! …Forty-one!"]]);}
/* the practice tree and the boy, sorted into the Stranglethorn draw list (22) */
function c3Props(L){if(CH<3||!inHome())return;const [tx,ty]=c3Pt(C3YARD.tree);L.push([ty,{t:'tree',img:'hfir',x:tx,y:ty,w:250,base:.95,flip:false,solid:1}]);L.push([C3.boy.y,{t:'c3boy'}]);}
function drawBoyOW(){const b=C3.boy;let an='down',i=0;const fps=9;
  if(b.mode==='run'){an='run';i=Math.floor(b.ph/14)%6;}
  else if(b.mode==='show'){an='swingf';i=Math.floor(b.t*fps)%6;}   /* showing off with the sword, facing Lum */
  else if(b.mode==='practice'){const c=b.t%1.3;an='swing';i=c<6/fps?Math.floor(c*fps):0;}   /* a swing at the tree, a breath, another */
  else{an='down';i=0;}
  ctx.save();ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(b.x,b.y,18,6,0,0,TAU);ctx.fill();ctx.restore();
  c1Frame(ctx,'boy',an,i,b.x,b.y,BOY_H,(an==='swing'||an==='run'||an==='side')&&b.face<0,1,0);}
THINT.push({get x(){return C3.boy.x;},get y(){return C3.boy.y+8;},get reach(){return CH>=3&&inHome()&&C3.boy.mode==='practice'&&!DLG.active?80:0;},onInteract:c3BoyTalk});
/* the chapter's title band as it opens (no subtitle) */
function drawC3UI(){if(CH<3||!C3.title)return;C3.title+=1/60;const t=C3.title;if(t>5){C3.title=0;return;}const a=Math.min(1,t*1.2,(5-t)*1.2);
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.fillStyle='rgba(20,14,30,.55)';ctx.fillRect(0,H*.3-46,W,92);ctx.textAlign='center';ctx.fillStyle='#f6ecd8';
  ctx.font=`600 ${Math.round(Math.min(34,W/11))}px Georgia,serif`;ctx.fillText('Chapter 3',W/2,H*.3+12);ctx.restore();}
