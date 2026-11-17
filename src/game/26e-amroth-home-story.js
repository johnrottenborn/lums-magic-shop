/* ---------- Chapter 2: the night at Amroth's home, and the morning after ----------
   Out of the Worldbind Passage it is night; smoke rises from the cottage chimney and Alma is inside.
   Inside: Amroth and Alma, Lum's story, Fokalur, Alma's sister Sage Luma in Breezevale Cove, Lum and Alma alike, the baby.
   Amroth leaves the party (Lum alone from here); Lum rests in the loft. Morning: Alma's hug; Amroth by the pond sends Lum east.
   HST.st: 0 not yet, 1 night outside, 2 the talk inside, 3 rest upstairs, 4 morning in the loft, 5 Alma downstairs, 6 see Amroth, 7 on to Breezevale */
const HST={st:0,t:0,smoke:[],heart:0};
const ALMA={x:860,y:650,face:-1,dir:'side',moving:0,ph:0,on:0,baby:0};
const ALMA_H=104;   /* the same height as Lum */
const hsNight=()=>HST.st>=1&&HST.st<=3;
function hsGoal(t){GOAL.tag='NEW TASK';GOAL.text=t;HINT.goalT=0;}
/* arriving from the passage: night falls on the home */
function hsArrive(){if(HST.st||!C2.joined)return;HST.st=1;hsGoal('Go inside Amroth’s home');}
function almaWalk(tx,ty,sp,dt){const dx=tx-ALMA.x,dy=ty-ALMA.y,d=Math.hypot(dx,dy);if(d<3){ALMA.x=tx;ALMA.y=ty;ALMA.moving=0;return true;}const m=Math.min(d,sp*dt);ALMA.x+=dx/d*m;ALMA.y+=dy/d*m;ALMA.ph+=m;ALMA.moving=1;
  if(Math.abs(dx)>Math.abs(dy)){ALMA.dir='side';ALMA.face=dx>0?1:-1;}else ALMA.dir=dy>0?'down':'up';return false;}
const ALMASEAT={x:1000,y:690,fx:986,fy:662};   /* the armchair by the fire: where she is spoken to, and where her feet rest */
function drawAlmaSeated(){const k=dunH(ALMASEAT.fy)/151,talking=DLG.active&&DLG.lines&&DLG.lines[DLG.i||0]&&DLG.lines[DLG.i||0][0]==='Alma',near=Math.hypot(lum.x-ALMA.x,lum.y-ALMA.y)<230;
  const fi=talking?0:near?1:3;c1Frame(ctx,'alma_sit','sitchair',fi,ALMASEAT.fx,ALMASEAT.fy,ALMA_H*240/250*k*1.1,false,1,0);}
function drawAlmaRoom(){if(!ALMA.on)return;if(ALMA.sit){drawAlmaSeated();return;}const k=dunH(ALMA.y)/151,an=ALMA.moving?(ALMA.dir==='side'?'side':ALMA.dir):(ALMA.dir==='up'?'up':ALMA.dir==='side'?'side':'idle'),n=C1ATL.alma.rows[an][1],
    fi=ALMA.moving?Math.floor(ALMA.ph/16)%n:an==='side'?3:0;   /* standing still: one still frame, no stepping on the spot */
  ctx.save();ctx.translate(ALMA.x,ALMA.y);ctx.scale(k,k);ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(0,2,28,8,0,0,TAU);ctx.fill();
  c1Frame(ctx,'alma',an,fi,0,0,ALMA_H,an==='side'&&ALMA.face<0,1,0);   /* her side rows face right */
  ctx.restore();}
/* the little hearts when Lum and Alma meet, and in the morning hug */
function drawHearts(x,y){if(HST.heart<=0)return;ctx.save();for(let i=0;i<5;i++){const q=(T*.6+i/5)%1,hx=x+Math.sin(i*2.1+T)*26,hy=y-q*70;ctx.globalAlpha=HST.heart*(1-q)*.9;ctx.fillStyle='#ff9fb6';ctx.beginPath();
  const s=7+3*Math.sin(i);ctx.moveTo(hx,hy+s*.6);ctx.bezierCurveTo(hx-s*1.2,hy-s*.2,hx-s*.4,hy-s*1.1,hx,hy-s*.4);ctx.bezierCurveTo(hx+s*.4,hy-s*1.1,hx+s*1.2,hy-s*.2,hx,hy+s*.6);ctx.fill();}ctx.restore();}
/* the night talk inside, written from the designer's story notes */
/* Alma waits right of the fireplace by the chair (always facing left); Amroth walks in to the left of the fireplace, Lum just below him, both facing her */
const HSPOS={alma:[895,660],amr:[715,616],lum:[730,690]};
function hsNightTalk(){HST.st=2;{const i=BAG.indexOf('baby');if(i>=0)BAG.splice(i,1);}   /* the baby is handed over once they are inside */WEVENT.on=true;lum.vx=lum.vy=0;AMR.x=lum.x-20;AMR.y=lum.y-6;AMR.dir='side';AMR.face=1;AMR.moving=0;ALMA.on=1;[ALMA.x,ALMA.y]=HSPOS.alma;ALMA.face=-1;ALMA.dir='side';ALMA.moving=0;lum.face=1;HST.enter=1;HST.et=0;}
function hsEnterWalk(dt){HST.et+=dt;const a=amrWalk(HSPOS.amr[0],HSPOS.amr[1],85,dt),l=HST.et<.45||c1Walk(HSPOS.lum[0],HSPOS.lum[1],85,dt);if(a){AMR.dir='side';AMR.face=1;}
  if(a&&l&&HST.et>.45){HST.enter=2;c1Idle();lum.face=1;AMR.face=1;AMR.moving=0;setTimeout(hsNightLines,350);}}
function hsNightLines(){
  setTimeout(()=>talk([['Amroth',"Alma! Thank the stars, you’re safe."],['Alma',"Amroth! You’re home so late. What happened?"],
    ['Amroth',"I found this woman at the summit’s clearing, just outside Stranglethorn. She had been turned to stone."],['Amroth',"Her name is Lum."],
    ['Lum',"I live on the other side of Stranglethorn, at the edge of the world."],['Lum',"I was searching for my lost apprentice. His trail led me across Stranglethorn…"],
    ['Lum',"…and when I found him, he had been possessed by Fokalur."],['Alma',"Fokalur… I’ve heard that name before."],['Amroth',"As have I. Your sister would know more, Alma."],
    ['Alma',"Yes. My sister Luma is a sage in Breezevale Cove, the coastal town nearby. She knows the old stories better than anyone."]],false,hsMeet),700);}
function hsMeet(){HST.meet=1;}   /* Alma steps up to Lum; they look at each other */
function hsMeetTalk(){talk([['Alma',"…"],['Lum',"…"],['Alma',"You look just like me."],['Lum',"I was thinking the same thing. It’s strange… it feels like I’ve known you forever."],
    ['Alma',"So do I."]],false,()=>{HST.heart=0;setTimeout(hsBabyTalk,500);});}
function hsBabyTalk(){try{sfxBabyCry(.9);}catch(e){}
  setTimeout(()=>talk([['Amroth',"And that isn’t all. On the way through the passage we were attacked by demons."],['Amroth',"We found this baby, too, in the ashes at the clearing."],
    ['Amroth',"I have never seen demons before. I believe Fokalur is behind this invasion."],['Alma',"Oh… look at his kind eyes."]],false,()=>{
      const i=BAG.indexOf('baby');if(i>=0)BAG.splice(i,1);ALMA.baby=1;   /* Alma takes the baby */
      setTimeout(()=>talk([['Alma',"I’ll care for him for now."],['Alma',"Lum, you must be exhausted. Please, rest upstairs. We can talk more in the morning."]],false,hsToRest),600);}),1100);}
function hsToRest(){HST.st=3;WEVENT.on=false;HST.amrIn=1;HST.almaGo=1;AMR.x=700;AMR.y=640;AMR.dir='side';AMR.face=1;AMR.moving=0;
  C2.joined=0;const k=PARTY_ORDER.indexOf('amroth');if(k>=0)PARTY_ORDER.splice(k,1);   /* Lum goes on alone from here */
  hsGoal('Rest upstairs');setupDun();}
/* the loft bed */
function hsRest(){if(HST.st!==3){say("A big bed under a patchwork quilt.");return;}WEVENT.on=true;goScene(()=>{HST.st=4;HST.amrIn=0;HST.amrOut=1;ALMA.on=1;ALMA.baby=0;ALMA.sit=1;ALMA.x=ALMASEAT.x;ALMA.y=ALMASEAT.y;ALMA.face=-1;ALMA.dir='side';ALMA.moving=0;
  for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;lum.x=900;lum.y=735;lum.face=1;lum.state='idle';WEVENT.on=false;GOAL.tag='';GOAL.text='';setupDun();
  setTimeout(()=>{hsGoal('Go downstairs');},1500);});}
/* the morning: Alma waits downstairs */
function hsMorningTalk(){HST.st=5;hsGoal('Speak with Alma');}   /* she waits by the fire; Lum goes to her */
function hsMorningAlma(){WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;talk([['Alma',"Good morning, Lum."]],false,hsHug);}
function hsHug(){
  setTimeout(()=>talk([['Lum',"Thank you for letting me rest."],['Alma',"You almost slept the day away!"],
    ['Lum',"I feel responsible for what has happened. Fokalur has my apprentice… I must go after him."],['Alma',"My sister will know more. Go and see her."],
    ['Alma',"Amroth is outside. Go and speak with him before you leave."]],false,()=>{HST.st=6;WEVENT.on=false;hsGoal('Speak with Amroth outside');}),400);}
/* outside in the morning: Amroth by the pond */
const HSAMR={x:0,y:0};
function hsAmrPos(){const [x,y]=pierPt(330,118);return [HOMEX+x,HOMEY+y];}   /* out at the end of the fishing pier */
function hsAmrTalk(){if(HST.st<6)return;if(HST.st>6){say("Follow the coast east to Breezevale Cove.");return;}
  talk([['Amroth',"Good morning, Lum."],['Amroth',"I must stay here and protect Alma and the baby, in case the demons come."],
    ['Amroth',"You are more than capable. You can make it to Breezevale on your own and seek guidance from Sage Luma."],
    ['Amroth',"I’ve opened the gate. Follow the coast east."]],false,()=>{HST.st=7;hsGoal('Follow the coast east to Breezevale Cove');});}
function updateHomeStory(dt){HST.t+=dt;
  if(SCENE==='thorn'&&inHome()&&C2.joined&&!HST.st)hsArrive();
  /* chimney smoke */
  if(SCENE==='thorn'&&inHome()&&Math.random()<dt*7){const [cx,cy]=[HOMEX+HOME.cot.x+31,HOMEY+HOME.cot.y-352];HST.smoke.push({x:cx+rnd(-5,5),y:cy,vx:rnd(4,14),vy:rnd(-28,-18),r:rnd(9,14),t:0});}
  for(const s of HST.smoke){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.r+=dt*9;}for(let i=HST.smoke.length-1;i>=0;i--)if(HST.smoke[i].t>4)HST.smoke.splice(i,1);
  /* inside, at night: the talk starts once Lum is through the door */
  if(SCENE==='dun'&&DUN.room===21&&HST.st===1&&!FADE.dir&&!DLG.active)hsNightTalk();
  if(SCENE==='dun'&&DUN.room===21&&HST.st===2&&HST.enter===1&&!FADE.dir)hsEnterWalk(dt);
  if(SCENE==='dun'&&DUN.room===21&&HST.meet===1&&!DLG.active){if(almaWalk(lum.x+95,lum.y+2,70,dt)){ALMA.face=-1;ALMA.dir='side';lum.face=1;HST.meet=2;HST.heart=1;hsMeetTalk();}}
  if(SCENE==='dun'&&DUN.room===21&&HST.st===4)hsMorningTalk();
  if(SCENE==='dun'&&DUN.room===21&&HST.st===3&&HST.almaGo&&!DLG.active){if(almaWalk(AMR.x+80,AMR.y+2,70,dt)){ALMA.face=-1;ALMA.dir='side';HST.almaGo=0;}}   /* Alma goes to stand beside Amroth */
  if(SCENE==='dun'&&DUN.room===21&&HST.st>=4&&ALMA.on&&!ALMA.moving&&!ALMA.sit){ALMA.dir='side';ALMA.face=lum.x<ALMA.x?-1:1;}   /* she stays by the fire and turns to follow Lum */
  if(HST.amrOut&&SCENE==='thorn'){const [x,y]=hsAmrPos();AMR.x=x;AMR.y=y;AMR.moving=0;AMR.dir='side';AMR.face=1;}   /* looking out over the water */
  if(HST.heart>0&&!DLG.active&&!HST.meet&&!HST.walk&&HST.st!==5)HST.heart=Math.max(0,HST.heart-dt);}
/* night over the home (screen space), with warm windows and door; the chimney smoke in world space */
function drawHomeSky(){if(SCENE!=='thorn'||!inHome())return;drawHomeNight();if(!HST.smoke.length)return;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);for(const s of HST.smoke){const x=(s.x-cam.x)*zoom+W/2,y=(s.y-cam.y)*zoom+H/2;ctx.globalAlpha=Math.max(0,.32*(1-s.t/4))*(hsNight()?.8:1);ctx.fillStyle=hsNight()?'#9aa0ab':'#cfd2d6';ctx.beginPath();ctx.arc(x,y,s.r*zoom,0,TAU);ctx.fill();}ctx.restore();}
function drawHomeNight(){if(!hsNight())return;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='rgba(8,12,34,.58)';ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';const sc=(wx,wy)=>[(wx-cam.x)*zoom+W/2,(wy-cam.y)*zoom+H/2],C=HOME.cot;
  for(const [dx,dy,r] of [[-150,-95,46],[-92,-60,40],[55,-95,46],[150,-110,46]]){const [x,y]=sc(HOMEX+C.x+dx,HOMEY+C.y+dy);drawGlow(ctx,x,y,r*zoom*2.2,'255,180,90',.32);drawGlow(ctx,x,y,r*zoom*.7,'255,220,150',.4);}
  const [lx,ly]=sc(lum.x,lum.y-60);drawGlow(ctx,lx,ly,170*zoom,'150,170,220',.12);ctx.restore();}
/* Amroth outside by the pond can be spoken to */
THINT.push({get x(){return hsAmrPos()[0];},get y(){return hsAmrPos()[1]+10;},get reach(){return HST.amrOut&&HST.st>=6?95:0;},onInteract:()=>hsAmrTalk()});

/* Alma teaches Poison Powder, once Lum carries Venomvine (talk to her in the cottage after the night) */
/* before Lum goes up to bed: Alma and Amroth stand together over the baby */
function hsBabyAdmire(){WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;
  talk([['Alma',"Look at him, Amroth. Such a sweet little face."],['Amroth',"And those eyes… I have never seen eyes so bright and kind."],
    ['Alma',"He’s fast asleep now. You should be too, Lum. Go and rest upstairs."],['Amroth',"Rest well, Lum. We will be right here."]],false,()=>{WEVENT.on=false;});}
function almaTalk(){if(HST.st===3){hsBabyAdmire();return;}if(HST.st===5){hsMorningAlma();return;}if(HST.st<6)return;if(!C2.venom&&(MATS.venomvine||0)>0){WEVENT.on=true;ALMA.face=lum.x<ALMA.x?-1:1;lum.face=-ALMA.face;
    talk([['Alma',"Is that Venomvine? Careful, its sap stings."],['Alma',"My sister taught me a trick with it when we were young. Grind the vine fine at a fire and it makes a powder that strikes, then leaves a poison behind."],
      ['Alma',"Here, let me show you."]],false,()=>{learnVenom();setTimeout(()=>talk([['Lum',"Poison Powder… Thank you, Alma!"],['Alma',"Feel free to mix it by the fire, right here."]],false,()=>{WEVENT.on=false;}),900);});return;}
  talk([['Alma',C2.venom?"Remember, Venomvine makes Poison Powder. Feel free to mix by the fire!":HST.st<7?"Amroth is outside by the pond. Go and speak with him.":"Safe travels, Lum. My sister will help you, I know it."]]);}
function learnVenom(){if(C2.venom)return;C2.venom=1;POWDER_LIST.push(['venom','Poison Powder','1–3 damage · poisons 1–3 turns','venom']);RECIPES.push({id:'venom',name:'Poison Powder',out:2,desc:'1–3 damage · poisons 1–3 turns',need:{venomvine:2}});
  TOAST.t=0;TOAST.name='Learned: Poison Powder';TOAST.id='venom';try{sfxItem();}catch(e){}}

/* the loft bed: ask first; resting passes the night and heals everyone */
function hsBed(){if(HST.st<3){say("A big bed under a patchwork quilt.");return;}
  askChoice("Rest until morning?",[["Rest",()=>{if(HST.st===3)hsRest();else{WEVENT.on=true;goScene(()=>{for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;lum.state='idle';WEVENT.on=false;setTimeout(()=>{TOAST.t=0;TOAST.name='Rested · HP restored';TOAST.id='potion';},300);});}}],["Not yet",()=>{}]]);}
