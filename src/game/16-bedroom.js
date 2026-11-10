/* =====================================================================
   THE BEDROOM: two quilted beds under the eaves
   ===================================================================== */
const BEDFLOOR=[[60,662],[342,656],[346,612],[548,606],[560,578],[700,500],[790,468],[812,500],[736,540],[736,700],[748,726],[1030,726],[1196,602],[1375,602],[1375,768],[60,768]];
function bedFree(x,y){return inPoly(x,y,BEDFLOOR);}
function solveBed(px,py,nx,ny){if(bedFree(nx,ny))return [nx,ny];if(bedFree(nx,py))return [nx,py];if(bedFree(px,ny))return [px,ny];return [px,py];}
const bedH=y=>285+(clamp(y,440,768)-600)*.55;
const BEDOCC=[{base:702,poly:[[736,498],[768,486],[1065,555],[1085,768],[1028,768],[1012,712],[766,690],[736,692]]},{base:604,poly:[[506,438],[546,436],[548,606],[508,606]]}];
const BEDINT=[];const BED={night:0,sleeping:false,slept:false,t:0};
const BEDMOTES=[];for(let i=0;i<34;i++)BEDMOTES.push({x:rnd(380,900),y:rnd(40,560),ph:rnd(0,TAU),sp:rnd(.2,.5)});
const BEDFLIES=[];for(let i=0;i<10;i++)BEDFLIES.push({x:rnd(90,210),y:rnd(220,400),ph:rnd(0,TAU)});
function setupBedroom(){BEDINT.length=0;
  BEDINT.push({x:1268,y:622,reach:72,onInteract:()=>goScene(()=>{enterShop();lum.x=1250;lum.y=592;lum.face=-1;})});
  BEDINT.push({x:900,y:740,reach:130,onInteract:()=>{if(NIGHT.on){say("I can't sleep now. The voice is waiting for me…");return;}if(BED.slept){say("All rested up! My bed is officially the comfiest place in the whole world.");return;}
    askChoice("Rest for the night?",[["Rest",()=>talk([['Cosmic',"My bed! I could sleep for a hundred years…"],['Cosmic',"…but just one night will do. Goodnight, Master Lum."]],false,goToSleep)],["Not yet",()=>say("Maybe in a little bit. I'm not quite done with today.")]]);}});
  const L=(x,y,reach,lines)=>{let i=0;BEDINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  L(540,640,95,["Master Lum's bed. Every patch on her quilt has a tiny moon stitched into the corner.","She always says she's 'just resting her eyes.' She snores like a teakettle."]);
  L(205,680,100,["My treasure chest! A rock shaped like a frog, three marbles, and a feather I'm saving for a hat."]);
  L(790,640,90,["Master's reading glasses and a book called 'Quiet Magic for Loud Apprentices.' Hmm. Very funny."]);
  L(140,640,90,["Through the little window I can see the birches. They glow a bit at night, like they're dreaming too."]);
  L(1080,620,90,["Flower drawings on the shelf. Master Lum made those for me when I first came here. I pretend they're not my favorite."]);}
function enterBedroom(){SCENE='bed';lum.x=1240;lum.y=650;lum.face=-1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=900;WTITLE.t=0;if(!NIGHT.on){BED.night=0;BED.sleeping=false;}setupBedroom();if(CH===1)c1Bedroom();}
const NIGHT={on:false,cut:false,rain:false,end:0,rainSrc:null};
function goToSleep(){WEVENT.on=true;goScene(()=>{BED.night=1;BED.sleeping=true;BED.cosAwake=false;BED.t=0;lum.vx=lum.vy=0;WCAM.x=760;NIGHT.on=true;HEROES[HERO].hp=HEROES[HERO].maxHp;
  setTimeout(()=>{BED.glow=1;sfxEerie();talk([['???',"Wake up, little apprentice… Take the blade, and cut a path out of this magical garden."]],false,()=>{
    setTimeout(()=>{BED.cosAwake=true;BED.glow=0;lum.x=930;lum.y=744;lum.face=-1;lum.state='idle';WEVENT.on=false;
      talk([['Cosmic',"…That voice again. It wants me to leave? Tonight?"],['Cosmic',"Master Lum is fast asleep. If I'm quiet, she'll never know…"]],false,()=>{GOAL.tag='NEW TASK';GOAL.text='Take the blade and cut a path out of the garden';HINT.goalT=0;});},900);});},4200);});}
function drawNightShade(px,py,dark){const [sx,sy]=(SCENE==='garden'||SCENE==='woods'||SCENE==='thorn')?[(px-cam.x)*zoom+W/2,(py-60-cam.y)*zoom+H/2]:wellToScreen(px,py-80);
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);const r=Math.min(W,H)*.55,g=ctx.createRadialGradient(sx,sy,r*.15,sx,sy,r);
  g.addColorStop(0,`rgba(10,14,40,${(dark*.35).toFixed(3)})`);g.addColorStop(1,`rgba(6,8,26,${dark.toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
const RAIN=[];for(let i=0;i<160;i++)RAIN.push({x:Math.random(),y:Math.random(),sp:rnd(.9,1.4),l:rnd(10,20)});const SPLASH=[];
function drawRain(dt){if(!NIGHT.rain)return;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.strokeStyle='rgba(190,205,235,.42)';ctx.lineWidth=1.2;ctx.beginPath();
  for(const d of RAIN){d.y+=d.sp*dt*1.15;d.x-=dt*.12;if(d.y>1){d.y-=1;d.x=Math.random()*1.1;if(Math.random()<.35)SPLASH.push({x:d.x*W,y:H*rnd(.35,1),t:0});}if(d.x<-.05)d.x+=1.1;
    const x=d.x*W,y=d.y*H;ctx.moveTo(x,y);ctx.lineTo(x-d.l*.25,y+d.l);}ctx.stroke();
  for(let i=SPLASH.length-1;i>=0;i--){const p=SPLASH[i];p.t+=dt;if(p.t>.35){SPLASH.splice(i,1);continue;}const q=p.t/.35;ctx.strokeStyle=`rgba(200,215,240,${(.5*(1-q)).toFixed(3)})`;ctx.beginPath();ctx.ellipse(p.x,p.y,2+q*8,(2+q*8)*.35,0,0,TAU);ctx.stroke();}
  ctx.fillStyle='rgba(30,40,70,.12)';ctx.fillRect(0,0,W,H);ctx.restore();}
function startRain(){NIGHT.rain=true;if(!SND.ready||NIGHT.rainSrc)return;const c=SND.ctx,s=c.createBufferSource();s.buffer=SND.white;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1600;f.Q.value=.5;
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;const g=c.createGain();g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(.16,c.currentTime+2.5);s.connect(f);f.connect(lp);lp.connect(g);g.connect(SND.amb);s.start();NIGHT.rainSrc=s;}
function addHedgeDoor(){for(let i=INTERACTABLES.length-1;i>=0;i--)if(INTERACTABLES[i].hedge)INTERACTABLES.splice(i,1);if(INTERACTABLES.some(o=>o.hedgeDoor))return;INTERACTABLES.push({x:20,y:1665,reach:80,door:true,hedgeDoor:1,onInteract:()=>{if(CH===1&&!C1.hedgeSeen){C1.hedgeSeen=1;talk([['Lum',"The hedge… someone cut straight through it."],['Lum',"A clean, powerful cut… but clumsy. A mighty blade, swung by someone who's never held one before."],['Lum',"…Cosmic? No. It couldn't be. Where would he even find a sword?"]],false,()=>{GOAL.tag='TASK';GOAL.text='Search beyond the hedge';HINT.goalT=0;});return;}goScene(()=>CH===1?enterWoodsC1():enterWoods());}});}
function cutHedge(){if(NIGHT.cut)return;lum.state='cast';lum.at=0;lum.face=1;shake=10;
  if(SND.ready){const t=SND.ctx.currentTime;noiseHit(t,.35,'bandpass',2600,1.2,.35,SND.sfx,600);noiseHit(t+.05,.5,'lowpass',500,1,.3,SND.sfx);for(let i=0;i<5;i++)noiseHit(t+.12+i*.06,.15,'bandpass',1200+i*300,2,.15,SND.sfx);}
  for(let i=ESTATE.length-1;i>=0;i--){const o=ESTATE[i];if((o.t==='shrub'||o.t==='img')&&Math.abs(o.x-20)<120&&o.y>1575&&o.y<1720)ESTATE.splice(i,1);}
  for(let i=0;i<40;i++)PARTS.push({type:'bpetal',x:rnd(-80,120),y:rnd(1570,1640),z:rnd(20,80),vx:rnd(-90,90),vy:rnd(-30,40),vz:rnd(40,160),life:0,max:rnd(2,4),s:rnd(3,6),rot:rnd(0,TAU),vr:rnd(-8,8),col:Math.random()<.6?'#4f7a3a':'#6e9a4a',leaf:1});
  for(let i=0;i<24;i++)PARTS.push({type:'fiz',x:rnd(-60,100),y:rnd(1560,1620),z:rnd(30,90),vx:rnd(-60,60),vy:rnd(-20,20),vz:rnd(40,140),life:0,max:rnd(.6,1.2),s:rnd(2,3.5)});
  NIGHT.slash=1;NIGHT.cut=true;addHedgeDoor();
  setTimeout(()=>{startRain();sfxEerie();talk([['???',"Yes, child… do not turn back!"]],false,()=>{GOAL.tag='NEW TASK';GOAL.text='Follow the path beyond the garden';HINT.goalT=0;});},700);}
function drawSleeper(img,hx,hy,sc,rot,lump,breath,phase){const im=IMG[img];if(!ready(im))return;
  const b=Math.sin(T*1.4+phase);
  // the quilt rising over a body underneath: soft light on top, shadow along the far side
  ctx.save();ctx.globalAlpha=.9;const [bx0,by0,bx1,by1]=lump;const ang=Math.atan2(by1-by0,bx1-bx0),len=Math.hypot(bx1-bx0,by1-by0);
  ctx.translate((bx0+bx1)/2,(by0+by1)/2);ctx.rotate(ang);
  ctx.fillStyle='rgba(30,22,30,.22)';ctx.beginPath();ctx.ellipse(0,16,len*.5,26,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(0,-28-b*breath,0,18);g.addColorStop(0,'rgba(255,245,225,.32)');g.addColorStop(1,'rgba(255,245,225,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,-4-b*breath*.5,len*.48,22+b*breath*.6,0,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(60,40,30,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-4-b*breath*.5,len*.48,22+b*breath*.6,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();
  ctx.restore();
  // the head on the pillow
  ctx.save();ctx.translate(hx,hy-b*.8);ctx.rotate(rot);const w=im.naturalWidth*sc,h=im.naturalHeight*sc;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();
  // the sheet folded up under the chin
  ctx.save();ctx.translate(hx,hy+h*.38-b*.6);ctx.rotate(rot+.12);ctx.fillStyle='#efe6d4';ctx.strokeStyle='rgba(60,45,35,.7)';ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(-w*.85,8);ctx.quadraticCurveTo(-w*.3,-10,0,-6);ctx.quadraticCurveTo(w*.35,-12,w*.8,4);ctx.lineTo(w*.75,22);ctx.quadraticCurveTo(0,30,-w*.85,24);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(120,100,80,.35)';ctx.beginPath();ctx.moveTo(-w*.5,8);ctx.quadraticCurveTo(0,0,w*.5,6);ctx.stroke();ctx.restore();
  // drifting z's
  ctx.save();ctx.textAlign='center';for(let i=0;i<3;i++){const t=((T*.35+phase*.1)+i/3)%1;ctx.globalAlpha=Math.sin(Math.PI*t)*.85;ctx.fillStyle='#f4ecff';ctx.font=`italic 700 ${12+t*12}px Alegreya, Georgia, serif`;ctx.fillText('z',hx+20+t*30+Math.sin(T*2+i)*6,hy-30-t*70);}ctx.restore();}
function drawBedroom(){const im=IMG.bedroom;if(!ready(im))return;const rz=H/768*ROOMZ,n=BED.night;
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#231c18';ctx.fillRect(0,0,W,H);
  ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz),DPR*WOFF.y);ctx.drawImage(im,0,0,1375,768);
  if(n){ctx.fillStyle='rgba(18,26,62,.58)';ctx.fillRect(0,0,1375,768);}
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(!n){const a=.06+.03*Math.sin(T*.5);const g=ctx.createLinearGradient(400,0,800,560);g.addColorStop(0,`rgba(255,236,180,${a*2})`);g.addColorStop(1,'rgba(255,236,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(380,0);ctx.lineTo(560,0);ctx.lineTo(900,560);ctx.lineTo(620,600);ctx.closePath();ctx.fill();
    for(const m of BEDMOTES){const x=m.x+Math.sin(T*m.sp+m.ph)*16,y=m.y+Math.cos(T*m.sp*.7+m.ph)*10;const tw=.5+.5*Math.sin(T*2+m.ph*3);drawGlow(ctx,x,y,4*tw+2,'255,238,190',.32*tw);}}
  else{const g=ctx.createLinearGradient(400,0,800,560);g.addColorStop(0,'rgba(150,180,255,.22)');g.addColorStop(1,'rgba(150,180,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(380,0);ctx.lineTo(560,0);ctx.lineTo(900,560);ctx.lineTo(620,600);ctx.closePath();ctx.fill();
    for(let i=0;i<14;i++){const tw=.5+.5*Math.sin(T*2+i*1.7);drawGlow(ctx,395+((i*37)%150),40+((i*53)%200),3*tw+1.5,'230,240,255',.8*tw);}
    for(const f of BEDFLIES){const x=f.x+Math.sin(T*.7+f.ph)*20,y=f.y+Math.cos(T*.5+f.ph)*14;drawGlow(ctx,x,y,7,'230,255,150',.5+.4*Math.sin(T*3+f.ph));}
    drawGlow(ctx,1203,166,26,'120,190,255',.4+.15*Math.sin(T*1.3));drawGlow(ctx,1240,166,26,'120,200,255',.4+.15*Math.sin(T*1.5+1));drawGlow(ctx,1090,240,24,'120,180,255',.35);}
  // the bedside lamp, always a little alive, warm and bright at night
  {const fl=.8+.12*Math.sin(T*8)+.08*Math.sin(T*19);drawGlow(ctx,848,345,(n?140:60)*fl,'255,200,120',n?.5:.25);drawGlow(ctx,848,350,26,'255,235,170',.6*fl);}
  // a little wisp night-light that drifts around the shelves
  {const x=1080+Math.sin(T*.4)*90,y=200+Math.sin(T*.7)*30;drawGlow(ctx,x,y,14,'200,230,255',n?.75:.35);drawGlow(ctx,x,y,4,'255,255,255',n?.9:.5);}
  if(BED.glow){const a=.35+.3*Math.sin(T*2.4);drawGlow(ctx,770,700,70,'220,30,40',a*.6);drawGlow(ctx,770,700,18,'255,90,90',a);}
  ctx.restore();
  if(BED.sleeping){drawSleeper('sleep_lum',694,368,.62,-.18,[680,420,470,500],3,0);if(!BED.cosAwake)drawSleeper('sleep_cos',1066,414,.78,-.14,[1040,468,820,560],3.5,2.2);}
  const k=bedH(lum.y)/151;if(!BED.sleeping||BED.cosAwake){ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();
    for(const o of BEDOCC)if(lum.y<o.base){ctx.save();ctx.beginPath();o.poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();ctx.drawImage(im,0,0,1375,768);if(n){ctx.fillStyle='rgba(18,26,62,.58)';ctx.fillRect(0,0,1375,768);}ctx.restore();}}
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k2=bedH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k2,k2);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.35,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(40,25,15,0)');vg.addColorStop(1,n?'rgba(8,10,30,.55)':'rgba(40,25,15,.28)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(WTITLE.t<4.5&&!CAPTURE.on&&!n){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(40,26,12,.42)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#fff3dc';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('The Bedroom',W/2,H*.3+10);ctx.restore();}}

