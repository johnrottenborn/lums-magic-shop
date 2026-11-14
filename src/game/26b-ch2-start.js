/* ---------- Chapter 2: The Ashes of Awakening ----------
   Opens in the clearing where Chapter 1 ended (CLR in 21-stranglethorn). Scene 1: narration on black. Scene 2: light rain; Amroth the gatekeeper
   comes out of his gatehouse, walks down to the clearing, frees Lum from the stone, finds a baby in Spar's ashes, and joins Lum.
   Amroth (his own sprite, face always hidden in his helmet) joins the party at the end of the opening and follows Lum on the map.
   No saving yet. */
const C2={on:false,st:0,t:0,w:0,narr:-1,na:0,cam:null,title:0,heal:0,mound:1,shake:0,joined:0};
const AMR={x:0,y:0,face:1,dir:'side',moving:0,ph:0,a:1};
const C2NARR=["With the help of Spar, Lum finally found her lost apprentice, Cosmic.","But Cosmic had been deceived.",
  "Through his foolish curiosity, he unknowingly awakened an ancient evil thought to be lost to the ages…","A Demon God.","Fokalur.",
  "Freed from his thousand-year imprisonment, the demon unleashed his fury upon the world.",
  "Lum and Spar stood against him, but their combined strength was no match for the newly awakened god.",
  "The battle was over almost as quickly as it began.",
  "Days passed. Rain fell upon the scorched earth, slowly extinguishing the fires that had consumed the surrounding wilderness.","But the devastation remained…"];
/* Spar's ashes: the mound beside where Lum was turned to stone */
const ASHMOUND={get x(){return FKS.cx-240+120},get y(){return FKS.cy+8}};
function startChapter2(){audioInit();c1Reset();CH=2;HERO='lum';PC='lum';
  C1.introDone=1;C1.hedgeSeen=1;C1.thornBoss=1;C1.fkDone=1;C1.chEnd=0;C1I.on=false;INTRO.lumShown=true;
  for(let i=0;i<5;i++)C1['cosSeen'+i]=1;
  const k=bestCh1Keepsake();if(k)PARTY.lum.charm=k.id;   // Chapter 2 starts with the best Chapter 1 keepsake equipped
  enterThorn();GOAL.tag='';GOAL.text='';SAVEC.finished=1;
  // Lum stands in stone where the battle ended
  lum.x=FKS.cx-240;lum.y=FKS.cy;lum.face=1;lum.state='idle';lum.vx=lum.vy=0;LUMSTONE=1;
  Object.assign(C2,{on:true,st:0,t:0,w:0,narr:0,na:0,cam:null,title:0,heal:0,mound:1,shake:0,joined:0});
  Object.assign(AMR,{x:CPATH.xt+3,y:CPATH.ytop+10,face:1,dir:'down',moving:0,ph:0,a:0});
  WEVENT.on=true;FADE.a=0;FADE.dir=0;}
function c2NarrNext(){if(C2.narr<0)return;if(C2.na<.6)return;C2.narr++;C2.na=0;if(C2.narr>=C2NARR.length){C2.narr=-1;c2BeginGate();}}
function c2BeginGate(){C2.st=1;C2.t=0;C2.cam={x:CPATH.xt,y:CPATH.ytop+180};cam.x=C2.cam.x;cam.y=C2.cam.y;NIGHT.rain=true;NIGHT.rainSrc=null;startRain();C2.fadeIn=1;}
function c2Talk(lines,next){talk(lines,false,()=>{C2.st=next;C2.t=0;C2.w=0;});C2.st=-1;}
/* walk Amroth toward a point; returns true on arrival */
function amrWalk(tx,ty,sp,dt){const dx=tx-AMR.x,dy=ty-AMR.y,d=Math.hypot(dx,dy);if(d<3){AMR.x=tx;AMR.y=ty;AMR.moving=0;return true;}const m=Math.min(d,sp*dt);AMR.x+=dx/d*m;AMR.y+=dy/d*m;AMR.ph+=m;AMR.moving=1;
  if(Math.abs(dy)>Math.abs(dx)*1.2)AMR.dir=dy>0?'down':'up';else{AMR.dir='side';AMR.face=dx<0?-1:1;}return false;}
function amrFace(x){AMR.dir='side';AMR.face=x<AMR.x?-1:1;AMR.moving=0;}
/* the path back down from the gatehouse, as waypoints */
function c2PathDown(){const P=CPATH_PTS,out=[];for(let i=P.length-1;i>=0;i-=3)out.push(P[i]);return out;}
function updateC2(dt){if(!C2.on)return;C2.t+=dt;
  if(C2.narr>=0){C2.na+=dt;const L=C2NARR[C2.narr];if(C2.na>2.6+L.length*.045)c2NarrNext();return;}
  if(C2.fadeIn)C2.fadeIn=Math.max(0,C2.fadeIn-dt*.6);
  const S=STONELUM,st=C2.st;C2.cam=st>=1?{x:(st>=5?(AMR.x+lum.x)/2:AMR.x),y:(st>=5?Math.min(AMR.y,lum.y):AMR.y)-60}:C2.cam;
  if(st===1){AMR.a=Math.min(1,C2.t/1.2);amrWalk(CPATH.xt+3,CPATH.ytop+130,40,dt);if(C2.t>2.4){AMR.moving=0;AMR.dir='down';c2Talk([['Amroth',"Ahh… rain. A welcome change."]],2);}}
  else if(st===2){if(C2.t>.8){AMR.dir='down';c2Talk([['Amroth',"Hm? What in the world happened here? Those flames…"]],3);C2.route=c2PathDown().filter(p=>p[1]>CPATH.ytop+150);C2.ri=0;}}
  else if(st===3){const R=C2.route;if(C2.ri<R.length){if(amrWalk(R[C2.ri][0],R[C2.ri][1],95,dt))C2.ri++;}else c2Talk([['Amroth',"I’ve patrolled these mountains for years, but I’ve never seen wildfires like this."]],4);}
  else if(st===4){if(amrWalk(S.x+300,S.y+30,85,dt)){amrFace(S.x);c2Talk([['Amroth',"Alma?!"]],5);}}
  else if(st===5){if(amrWalk(S.x+70,S.y+12,190,dt)){amrFace(S.x);c2Talk([['Amroth',"Alma! What happened to you?!"]],6);C2.route=[[S.x+30,S.y+55],[S.x-60,S.y+40],[S.x-80,S.y-10],[S.x-20,S.y-40],[S.x+60,S.y-20],[S.x+75,S.y+14]];C2.ri=0;}}
  else if(st===6){const R=C2.route;if(C2.ri<R.length){if(amrWalk(R[C2.ri][0],R[C2.ri][1],70,dt))C2.ri++;}else{amrFace(S.x);c2Talk([['Amroth',"Turned to stone…? What kind of magic could do this?"],['Amroth',"Well… it’s a good thing I carry a Stonebreak Elixir. And an even better thing I haven’t had to use it."]],7);}}
  else if(st===7){C2.heal=Math.min(1,C2.t/3);if(C2.t>.05&&!C2.chimed){C2.chimed=1;try{sfxEerie();}catch(e){}}
    if(C2.t>3&&LUMSTONE){LUMSTONE=0;C2.flash=1;try{sfxFizzle();}catch(e){}}if(C2.t>4.2){C2.heal=0;
    c2Talk([['Amroth',"Alma! You’re safe! Thank the gods. How did you—"],['Lum',"Thank you… but I’m afraid you’ve mistaken me for someone else."],['Amroth',"What?"],['Lum',"My name is Lum."],
      ['Amroth',"Lum…? But you look exactly like my wife. You’re her mirror image!"],['Lum',"That’s… a strange coincidence. But there’s little time to explain."],
      ['Amroth',"Then start with how you ended up turned to stone in the middle of a burned forest."],['Lum',"I was searching for my apprentice, Cosmic. I finally found him, but something was terribly wrong."],
      ['Lum',"A powerful demon named Fokalur had possessed his body. He had been imprisoned for centuries… and Cosmic unknowingly set him free."],['Amroth',"Fokalur?"],
      ['Amroth',"I’ve heard that name in the old accounts. An ancient demon god… sealed away long before my time."],['Lum',"He claimed the seal had held him shackled for a thousand years."],['Amroth',"A thousand years…?"],
      ['Lum',"He was far more powerful than we could have imagined. Spar and I tried to stop him, but…"],['Lum',"Spar didn’t survive."]],8);}}
  else if(st===8){if(C2.t>1.6)c2Talk([['Amroth',"I’m sorry."]],9);}
  else if(st===9){if(C2.t>.6){C2.shake=1;amrFace(ASHMOUND.x);c2Talk([['Amroth',"Wait…"]],10);}}
  else if(st===10){C2.shake=1;if(C2.t>1)c2Talk([['Amroth',"Something’s moving."]],11);}
  else if(st===11){C2.shake=.6;if(amrWalk(ASHMOUND.x-70,ASHMOUND.y+6,45,dt)){amrFace(ASHMOUND.x);c2Talk([['Amroth',"Show yourself, demon!"]],12);}}
  else if(st===12){C2.shake=0;if(C2.t>1.4&&!C2.cried){C2.cried=1;try{sfxBabyCry();}catch(e){}}if(C2.t>2.8)c2Talk([['Lum',"A baby…? How could a child possibly have survived this?"],['Amroth',"I don’t know. And I wish we had more time to find out."],
      ['Amroth',"I patrol the passage through the Worldbind Mountains. It’s not safe to linger here, especially after sunset."],['Lum',"What lies beyond the passage?"],['Amroth',"Darkness. And things best left undisturbed."],
      ['Amroth',"Whatever happened here, we need to get moving. I’ll escort you down the mountain."]],13);}
  else if(st===13){C2.mound=Math.max(0,1-C2.t/1.6);if(C2.t>.4&&!C2.cried2){C2.cried2=1;try{sfxBabyCry(.6);}catch(e){}}if(C2.t>1.2&&!BAG.includes('baby'))giveItem('baby');if(C2.t>2)c2Talk([['Lum',"Where did this little one come from?"],['Amroth',"That’s a question for another time."]],14);}
  else if(st===14){if(C2.t>1.4)c2Talk([['Amroth',"Come on. We need to reach the passage before nightfall."]],15);}
  else if(st===15){if(C2.t<1.2)amrWalk(S.x+420,S.y+40,60,dt);else AMR.moving=0;lum.face=1;if(C2.t>1.4&&!FADE.dir)goScene(c2Finish);}   /* Amroth turns for the path; Lum stays put, so the player takes over exactly where the scene ends */
  // Lum is still while the cutscene runs (she only walks at the very end)
  if(st!==15&&!LUMSTONE){lum.state='idle';lum.fi=0;}}
function c2Finish(){if(!BAG.includes('baby'))BAG.push('baby');if(!PARTY_ORDER.includes('amroth'))PARTY_ORDER.push('amroth');HEROES.amroth.hp=HEROES.amroth.maxHp;C1.comboA=0;C2.on=false;C2.st=99;C2.cam=null;C2.joined=1;WEVENT.on=false;C2.title=.001;C2.mound=0;lum.state='idle';
  AMR.moving=0;AMR.a=1;GOAL.tag='NEW TASK';GOAL.text='Pass through the mountain to Amroth’s home';HINT.goalT=0;}
/* once he has joined, Amroth walks behind Lum along the exact path she took (breadcrumbs, like Spar), so he never cuts through walls */
const AMRCRUMB=[];
function resetAmrFollow(){AMR.x=lum.x;AMR.y=lum.y;AMR.moving=0;AMR.face=lum.face;AMRCRUMB.length=0;}
function updateAmrFollow(dt){updateC2Torch(dt);if(!C2.joined||CH<2||(SCENE!=='thorn'&&SCENE!=='dun')||C2.torchWalk||(C2.torchScene&&!C2.torchLit)||(BO.st>=1&&BO.st<10)||(WEVENT.on&&C2.torchScene&&DLG.active))return;const lc=AMRCRUMB[AMRCRUMB.length-1];
  if(!lc||Math.hypot(lc[0]-lum.x,lc[1]-lum.y)>6){AMRCRUMB.push([lum.x,lum.y]);if(AMRCRUMB.length>80)AMRCRUMB.shift();}
  let acc=0,tx=AMR.x,ty=AMR.y,px=lum.x,py=lum.y,found=false;for(let i=AMRCRUMB.length-1;i>=0;i--){const [cx,cy]=AMRCRUMB[i];acc+=Math.hypot(cx-px,cy-py);px=cx;py=cy;if(acc>=64){tx=cx;ty=cy;found=true;break;}}
  if(!found){AMR.moving=0;if(!DLG.active){AMR.dir='side';AMR.face=lum.face;}return;}
  const d=Math.hypot(tx-AMR.x,ty-AMR.y);if(d>2)amrWalk(tx,ty,Math.min(260,70+d*3),dt);else{AMR.moving=0;}}
/* the cutscene's overlays: narration on black, the fade from black into the rain, the title card */
function drawC2UI(){if(CH<2)return;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  if(C2.on&&C2.narr>=0){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);const L=C2NARR[C2.narr],dur=2.6+L.length*.045,a=Math.min(1,C2.na*1.5,Math.max(0,(dur-C2.na)*1.6));
    ctx.globalAlpha=a;ctx.fillStyle='#e9dfc8';ctx.textAlign='center';const big=L.length<18;ctx.font=big?'italic 700 26px "Alegreya SC", Georgia, serif':'italic 18px Alegreya, Georgia, serif';
    const words=L.split(' '),lines=[];let cur='';const mw=Math.min(W-60,520);for(const w of words){const tt=cur?cur+' '+w:w;if(ctx.measureText(tt).width>mw){lines.push(cur);cur=w;}else cur=tt;}lines.push(cur);
    lines.forEach((l,i)=>ctx.fillText(l,W/2,H*.45+(i-(lines.length-1)/2)*28));ctx.globalAlpha=.4;ctx.font='12px Alegreya, Georgia, serif';ctx.fillText('tap to continue',W/2,H-40);}
  else if(C2.on&&C2.fadeIn>0){ctx.fillStyle=`rgba(0,0,0,${C2.fadeIn})`;ctx.fillRect(0,0,W,H);}
  if(C2.title){C2.title+=1/60;const t=C2.title;if(t>5)C2.title=0;else{const a=Math.min(1,t*1.2,(5-t)*1.2);ctx.globalAlpha=a;ctx.fillStyle='rgba(20,14,30,.55)';ctx.fillRect(0,H*.3-46,W,92);ctx.textAlign='center';
    ctx.fillStyle='#fdf6e4';ctx.font='700 24px "Alegreya SC", Georgia, serif';ctx.fillText('Chapter 2',W/2,H*.3);}}
  ctx.restore();}
/* world-space effects: the Stonebreak Elixir's light and cracks over the stone Lum, then a flash */
function drawC2World(){if(CH<2)return;const x=lum.x,y=lum.y;
  if(C2.heal>0){const u=C2.heal;ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y-60,90+40*u,'200,230,255',.35*u);const top=y-150*u;drawGlow(ctx,x,top,60,'230,245,255',.5*Math.sin(u*Math.PI));ctx.restore();
    ctx.save();ctx.strokeStyle=`rgba(40,36,34,${Math.min(.8,u*1.2)})`;ctx.lineWidth=1.4;for(let i=0;i<9;i++){if(hash(i,1,501)>u*1.4)continue;let px=x+(hash(i,2,501)-.5)*50,py=y-20-hash(i,3,501)*120;ctx.beginPath();ctx.moveTo(px,py);for(let k=0;k<4;k++){px+=(hash(i,k+4,501)-.5)*22;py+=(hash(i,k+9,501)-.3)*20;ctx.lineTo(px,py);}ctx.stroke();}ctx.restore();}
  if(C2.flash>0){C2.flash=Math.max(0,C2.flash-1/40);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,x,y-70,220,'255,255,240',C2.flash*.9);ctx.restore();
    for(let i=0;i<10;i++){const q=1-C2.flash,a=i/10*TAU;drawGlow(ctx,x+Math.cos(a)*q*90,y-70+Math.sin(a)*q*60,8,'255,250,220',C2.flash);}}}
/* Spar's ash mound beside Lum: shifts when something stirs beneath, cleared away when Amroth lifts the baby out */
function drawAshMound(){if(CH<2||C2.mound<=0)return;const m=C2.mound,sh=C2.shake?Math.sin(T*28)*2.5*C2.shake:0,x=ASHMOUND.x+sh,y=ASHMOUND.y;
  ctx.save();const g=ctx.createRadialGradient(x,y-10*m,0,x,y,70);g.addColorStop(0,'rgba(34,30,30,.98)');g.addColorStop(.7,'rgba(16,13,13,.9)');g.addColorStop(1,'rgba(16,13,13,0)');ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(x,y,64,26,0,0,TAU);ctx.fill();ctx.fillStyle='rgba(20,17,17,.95)';ctx.beginPath();ctx.ellipse(x,y-6*m,46*m+8,20*m+4,0,Math.PI,TAU);ctx.ellipse(x,y-6*m,46*m+8,8,0,0,Math.PI);ctx.fill();
  ctx.fillStyle='rgba(120,112,108,.45)';for(let i=0;i<16;i++){const a=hash(i,1,503)*Math.PI,r=hash(i,2,503);ctx.beginPath();ctx.ellipse(x-Math.cos(a)*40*r*m,y-6*m-Math.sin(a)*18*r*m,2.5,1.5,0,0,TAU);ctx.fill();}
  if(C2.shake)for(let i=0;i<5;i++){const t=(T*1.4+i/5)%1;ctx.fillStyle=`rgba(70,66,64,${.6*(1-t)})`;ctx.beginPath();ctx.arc(x+(hash(i,7,505)-.5)*60,y-10-t*30,2.4,0,TAU);ctx.fill();}ctx.restore();}
/* tests: jump past the opening straight to walking with Amroth */
function c2Skip(){if(!C2.on)return;DLG.active=false;C2.narr=-1;LUMSTONE=0;NIGHT.rain=true;c2Finish();C2.title=0;AMR.x=lum.x+60;AMR.y=lum.y+4;}
/* Amroth on the map: walking side frames face LEFT in his atlas (flipped for right); facing down is a single pose that bobs as he walks */
function drawnAmr(){}drawnAmr.n=0;
function drawAmrOW(F,alpha){if(!F||alpha<=0)return;drawnAmr.n++;const an=F.dir==='up'?'up':F.dir==='down'?'down':'side',n=C1ATL.amroth.rows[an][1],fi=F.moving?Math.floor((F.ph||0)/18)%n:0,bob=F.moving&&an==='down'?Math.abs(Math.sin((F.ph||0)*.09))*-4:0;
  ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle='rgba(10,10,20,.28)';ctx.beginPath();ctx.ellipse(F.x,F.y,26,8,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(F.x,0);ctx.scale(.88,1);ctx.translate(-F.x,0);   /* same slim build as in battle */
  c1Frame(ctx,'amroth',an,an==='side'||an==='up'?fi:0,F.x,F.y+bob,AMR_H,an==='side'&&F.face>0,alpha,0);ctx.restore();}
/* through the gatehouse arch: the first room of the Worldbind Passage (room 11 of the root-room engine in 26), arriving at the top of the stairs */
function enterWorldbind(){enterDun(11,238,250,1);
  /* first time in: the baby cries, and Amroth talks as they start down the stairs */
  if(!C2.wbSeen){C2.wbSeen=1;setTimeout(()=>{try{sfxBabyCry(.8);}catch(e){}},700);
C2.wbLine=0;}AMR.x=lum.x+30;AMR.y=lum.y-30;AMR.dir='down';}
/* party followers snap onto Lum's spot whenever she changes place (see 27-update) */
const followSnap={};
/* Worldbind room 2, first visit: the first torch is out. Amroth walks over, explains, and relights it */
function c2TorchScene(){if(C2.torchLit||C2.torchScene||DUN.room!==12)return;C2.torchScene=1;WEVENT.on=true;
  setTimeout(()=>talk([['Amroth',"Hm. The first torch has gone out."],['Amroth',"Keeping these torches lit is my job, too."]],false,()=>{C2.torchWalk=1;}),900);}
function updateC2Torch(dt){updateBlackout(dt);updateWorldbind5(dt);updateWorldbind10(dt);
  /* Worldbind room 3, first visit: Amroth reassures Lum about the bats */
  /* rooms 1 and 3: Amroth speaks once Lum is about a third of the way along the walk from the entrance to the exit
     (down the stairs, then across): room 1's walk is ~1000 long, room 3's ~770 */
  const third=(x0,y0,d)=>Math.hypot(lum.x-x0,lum.y-y0)>=d;
  const wbSay=(lines,flag)=>{C2[flag]=1;WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;talk(lines,false,()=>{WEVENT.on=false;});};
  if(SCENE==='dun'&&C2.joined&&!FADE.dir&&!DLG.active){
    if(DUN.room===11&&C2.wbSeen&&!C2.wbLine&&third(238,250,330))wbSay([['Amroth',"We will take you to my home, little one."],['Amroth',"It’s much easier walking down these stairs than climbing up them. I climb them every day."],['Amroth',"My job is to make sure no one tries to use this passage anymore…"]],'wbLine');
    if(DUN.room===13&&!C2.batLine&&third(540,240,255))wbSay([['Amroth',"We may see a few small bats, but the passage is safe."]],'batLine');}
  if(SCENE!=='dun'||DUN.room!==12)return;if(!C2.torchLit&&!C2.torchScene&&C2.joined&&!FADE.dir)c2TorchScene();
  if(C2.torchWalk){if(amrWalk(150,500,90,dt)){C2.torchWalk=0;AMR.dir='side';AMR.face=-1;AMR.moving=0;setTimeout(()=>{C2.torchLit=1;C2.lightT=0;try{sfxIgnite();}catch(e){}
      setTimeout(()=>talk([['Amroth',"There. That's better."]],false,()=>{WEVENT.on=false;resetAmrFollow();AMR.x=150;AMR.y=500;}),900);},500);}}
  if(C2.lightT!=null&&C2.lightT<1)C2.lightT+=dt*1.5;}
/* Worldbind room 4, first visit: halfway across, both torches go out and everything goes black. Amroth goes to relight
   the left torch; when it catches, two demons are flanking Lum. (Demons are stand-ins until their art arrives.) */
const BO={st:0,t:0,a:0,L:1,R:1,lt:1,ow:[],done:0,lock:0,chaser:null};
function boHeal(){for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;}
/* after the two fights a demon keeps coming from the left (room 3's side): running right gets away, beating it brings another */
function spawnChaser(){const [sx,sy]=nearestFree(150,540);BO.chaser={kind:'demon',scene:'dun',x:sx,y:sy,face:1,s:1,pack:1,calm:0,ph:0,a:0,
  onWin:()=>{BO.chaser=null;BO.respawn=1.2;runLine();},   /* after every fight with the left-side demons, a nudge to keep going */onLose:()=>{boHeal();BO.chaser=null;BO.respawn=2;lum.x=900;lum.y=575;lum.face=1;resetAmrFollow();}};}
const onFloor=(x,y)=>dunFree(x,y)?[x,y]:nearestFree(x,y);
function demonPair(){return [-1,1].map(s=>{const [x,y]=onFloor(lum.x+s*125,lum.y+4);return {x,y,face:-s,a:.001};});}
function updateBlackout(dt){if(SCENE!=='dun'||DUN.room!==14){if(BO.st&&BO.st<9){BO.st=0;BO.a=0;BO.L=BO.R=1;BO.lt=1;BO.ow=[];WEVENT.on=false;}BO.chaser=null;return;}
  const go=n=>{BO.st=n;BO.t=0;};BO.t+=dt;
  for(const d of BO.ow)if(d.a>0&&d.a<1)d.a=Math.min(1,d.a+dt*2);
  if(!BO.st){if(!BO.done&&C2.joined&&lum.x>687&&!FADE.dir&&!DLG.active){go(1);WEVENT.on=true;lum.state='idle';lum.vx=lum.vy=0;BO.L=BO.R=0;try{sfxSnuff();}catch(e){}}}
  else if(BO.st===1){BO.a=Math.min(1,BO.t/.35);if(BO.t>1.4&&!DLG.active){go(2);talk([['Amroth',"Stand still while I relight the torches."],['Amroth',"I know this passage like the back of my hand!"]],false,()=>go(3));}}
  else if(BO.st===3){const there=amrWalk(150,520,130,dt);if(!there){AMR.dir='side';AMR.face=-1;}
    if(BO.t>1.3&&!BO.said){BO.said=1;talk([['Lum',"Amroth? Do you hear something?"]],false,()=>{});}
    if(there&&BO.said&&!DLG.active){AMR.moving=0;go(4);}}
  else if(BO.st===4){if(BO.t>.6&&!BO.L){BO.L=1;BO.lt=0;BO.ow=demonPair();try{sfxIgnite();}catch(e){}}if(BO.L){BO.lt=Math.min(1,BO.lt+dt*1.5);BO.a=Math.max(0,1-BO.lt);}
    if(BO.t>2.2){go(5);WEVENT.on=false;startEncounter({kind:'demon',scene:'dun',x:lum.x+125,y:lum.y,s:1,pack:2,calm:0,noFlee:1,
      onWin:()=>{BO.ow=[];BO.R=1;go(11);WEVENT.on=true;resetAmrFollow();},
      onLose:()=>{boHeal();BO.st=0;BO.a=0;BO.L=BO.R=1;BO.lt=1;BO.ow=[];BO.said=0;BO.done=0;enterDun(14,200,560,1);resetAmrFollow();}},'ambush');}}
  /* first fight won: Amroth's warning, then two more demons close in from either side */
  else if(BO.st===11){if(BO.t>.8&&!DLG.active&&!BO.warned){BO.warned=1;talk([['Amroth',"Demons should not be here!"]],false,()=>{go(12);const y=lum.y+4;const far=s=>{let x=lum.x+s*125;for(let k=0;k<44&&dunFree(x+s*10,y);k++)x+=s*10;return x;};BO.ow=[-1,1].map(s=>{const [tx]=onFloor(lum.x+s*125,y);return {x:far(s),y,face:-s,a:1,tx};});});}}
  else if(BO.st===12){let all=1;for(const d of BO.ow){const dx=d.tx-d.x;if(Math.abs(dx)>2){d.x+=Math.sign(dx)*Math.min(Math.abs(dx),150*dt);d.mv=1;all=0;}else d.mv=0;}lum.face=BO.t%2.4<1.2?-1:1;
    if(all&&BO.t>.6)go(13);}
  else if(BO.st===13){if(BO.t>.7){go(14);WEVENT.on=false;startEncounter({kind:'demon',scene:'dun',x:lum.x+125,y:lum.y,s:1,pack:2,calm:0,noFlee:1,
      onWin:()=>{BO.ow=[];go(15);WEVENT.on=true;resetAmrFollow();},
      onLose:()=>{boHeal();go(13);WEVENT.on=true;resetAmrFollow();}},'normal');}}
  /* second fight won: Amroth urges them on, and from now on the demons keep coming from the left */
  else if(BO.st===15){if(BO.t>.8&&!DLG.active&&!BO.urged){BO.urged=1;talk([['Amroth',"Let’s move quickly!"]],false,()=>{go(20);WEVENT.on=false;BO.done=1;BO.lock=1;spawnChaser();});}}
  if(BO.st>=3&&BO.st<9)lum.face=AMR.x<lum.x?-1:1;
  /* the chaser walks in from the left edge and stalks Lum; touching her starts a fight */
  if(BO.lock&&!BATTLE.on&&!BATTLE.pending&&!WIPE.dir&&!FADE.dir){
    if(!BO.chaser){BO.respawn=(BO.respawn||0)-dt;if(BO.respawn<=0&&!WEVENT.on)spawnChaser();}
    else{const g=BO.chaser;g.a=Math.min(1,g.a+dt*2);if(g.calm>0){g.calm-=dt;g.mv=0;}
      else if(!WEVENT.on&&!DLG.active){const dx=lum.x-g.x,dy=lum.y-g.y,d=Math.hypot(dx,dy);
        if(d>4)demonStep(g,lum.x,lum.y,118,dt);
        if(d<62&&lum.bumpT<=0)startEncounter(g,'ambush');}
      else g.mv=0;}}}
/* the two demons flanking Lum in the overworld (designer's art faces left; the one on her left is flipped to face her) */
/* each demon roars once, the first time it comes into view (a short gap between roars when two appear together) */
let ROAR_T=0,ROARS=0;
function demonRoarCheck(o,x,big){if(!o||o.roared||CAPTURE.on)return;const m=ctx.getTransform(),sx=m.a*x+m.e;if(sx<-20||sx>ctx.canvas.width+20)return;
  o.roared=1;ROARS++;const now=performance.now(),at=Math.max(now,ROAR_T);ROAR_T=at+380;setTimeout(()=>{try{sfxDemonRoar(big);}catch(e){}},at-now);}
function drawDemonOW(x,y,face,a,mv,big,o){demonRoarCheck(o,x,big);const im=demonArt(big);if(!ready(im)||CAPTURE.on)return;   /* kept out of the battle backdrop; big = the brown demons, half again as large */
  const k=dunH(y)/151,h=175*k*(big?1.5:1),w=h*im.width/im.height,br=1+.02*Math.sin(T*2.6+x),hop=mv?Math.abs(Math.sin(T*9))*6*k:0,tilt=mv?Math.sin(T*9)*.05:0;
  ctx.save();ctx.globalAlpha=a*.35;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y,40*k,10*k,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.globalAlpha=a;ctx.translate(x,y-hop);ctx.rotate(tilt);ctx.scale(face>0?-1:1,br);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();}
