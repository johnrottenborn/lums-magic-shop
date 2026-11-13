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
  else if(st===13){C2.mound=Math.max(0,1-C2.t/1.6);if(C2.t>.4&&!C2.cried2){C2.cried2=1;try{sfxBabyCry(.6);}catch(e){}}if(C2.t>2)c2Talk([['Lum',"Where did this little one come from?"],['Amroth',"That’s a question for another time."]],14);}
  else if(st===14){if(C2.t>1.4)c2Talk([['Amroth',"Come on. We need to reach the passage before nightfall."]],15);}
  else if(st===15){if(C2.t<1.2)amrWalk(S.x+420,S.y+40,60,dt);else AMR.moving=0;lum.face=1;if(C2.t>1.4&&!FADE.dir)goScene(c2Finish);}   /* Amroth turns for the path; Lum stays put, so the player takes over exactly where the scene ends */
  // Lum is still while the cutscene runs (she only walks at the very end)
  if(st!==15&&!LUMSTONE){lum.state='idle';lum.fi=0;}}
function c2Finish(){if(!PARTY_ORDER.includes('amroth'))PARTY_ORDER.push('amroth');HEROES.amroth.hp=HEROES.amroth.maxHp;C1.comboA=0;C2.on=false;C2.st=99;C2.cam=null;C2.joined=1;WEVENT.on=false;C2.title=.001;C2.mound=0;lum.state='idle';
  AMR.moving=0;AMR.a=1;GOAL.tag='TASK';GOAL.text='Follow Amroth to the passage';}
/* once he has joined, Amroth walks behind Lum along the exact path she took (breadcrumbs, like Spar), so he never cuts through walls */
const AMRCRUMB=[];
function resetAmrFollow(){AMR.x=lum.x;AMR.y=lum.y;AMR.moving=0;AMR.face=lum.face;AMRCRUMB.length=0;}
function updateAmrFollow(dt){if(!C2.joined||CH<2||(SCENE!=='thorn'&&SCENE!=='dun'))return;const lc=AMRCRUMB[AMRCRUMB.length-1];
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
  c1Frame(ctx,'amroth',an,an==='side'||an==='up'?fi:0,F.x,F.y+bob,AMR_H,an==='side'&&F.face>0,alpha,0);}
/* through the gatehouse arch: the first room of the Worldbind Passage (room 11 of the root-room engine in 26), arriving at the top of the stairs */
function enterWorldbind(){enterDun(11,238,250,1);AMR.x=lum.x+30;AMR.y=lum.y-30;AMR.dir='down';}
/* party followers snap onto Lum's spot whenever she changes place (see 27-update) */
const followSnap={};
