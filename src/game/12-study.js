/* =====================================================================
   THE HIDDEN STUDY: through the back doorway of the Runic Conservatory
   ===================================================================== */
const SFLOOR=[[400,690],[400,612],[545,612],[545,562],[640,562],[640,548],[820,548],[1000,550],[1000,578],[1165,580],[1238,625],[1262,700],[1285,768],[60,768],[95,700],[190,690],[320,690]];
const SOBST=[{k:'rect',x0:340,x1:500,y0:600,y1:712},{k:'rect',x0:598,x1:910,y0:585,y1:702},{k:'rect',x0:1046,x1:1156,y0:615,y1:688},{k:'rect',x0:1146,x1:1300,y0:560,y1:662},{k:'rect',x0:1000,x1:1170,y0:540,y1:602},{k:'rect',x0:955,x1:1018,y0:498,y1:552}];
const SOCC=[{img:'sfg_chest',x:341,y:585,base:706},{img:'sfg_table',x:585,y:407,base:697},{img:'sfg_tableleg',x:877,y:518,base:634},{img:'sfg_side',x:1133,y:433,base:692},{img:'sfg_lectern',x:1022,y:449,base:668},{img:'sfg_roots',x:1233,y:377,base:9999}];
const studyH=y=>112+(clamp(y,540,768)-540)*.4;
const SINT=[];let studyVisited=false;
const SSLIMES=[];let sslimesSpawned=false,mimicState=0;   // mimic: 0 hidden, 1 sword given, 2 beaten
function spawnStudySlimes(){if(sslimesSpawned)return;sslimesSpawned=true;for(const [x,y,s] of [[760,740,1],[1080,720,.95]])SSLIMES.push({kind:'jelly',scene:'study',x,y,hx:x,hy:y,s,col:SLIME_COL[2],z:0,vz:0,hop:null,wait:rnd(.5,2),hp:2,hit:0,angry:0,ph:rnd(0,TAU),blink:rnd(1,4),dead:0,face:-1,calm:2.5});}
function studyFree(x,y){if(!inPoly(x,y,SFLOOR))return false;for(const o of SOBST){if(x>o.x0&&x<o.x1&&y>o.y0&&y<o.y1)return false;}return true;}
function solveStudy(px,py,nx,ny){if(studyFree(nx,ny))return [nx,ny];if(studyFree(nx,py))return [nx,py];if(studyFree(px,ny))return [px,ny];return [px,py];}
const roomH=y=>SCENE==='study'?studyH(y):SCENE==='shed'?shedH(y):SCENE==='pond'?pondH(y):SCENE==='shop'?shopH(y):SCENE==='bed'?bedH(y):SCENE==='vhut'?vhutH(y):SCENE==='dun'?dunH(y):wellH(y);
const roomSlimes=()=>SCENE==='woods'?(CH===1?WFOES:WSKELS):SCENE==='well'?WSLIMES:SCENE==='study'?SSLIMES:SCENE==='shed'?SHSLIMES:SCENE==='pond'?PSLIMES:[];
const roomFree=()=>SCENE==='thorn'?thornFree:SCENE==='woods'?woodsFree:SCENE==='study'?studyFree:SCENE==='shed'?shedFree:SCENE==='pond'?pondFree:SCENE==='shop'?shopFree:SCENE==='bed'?bedFree:SCENE==='vhut'?vhutFree:SCENE==='dun'?dunFree:wellFree;
function setupStudy(){SINT.length=0;SINT.push({x:175,y:722,reach:85,onInteract:()=>goScene(()=>enterWellFromStudy())});const L=(x,y,reach,lines)=>{let i=0;SINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  L(470,632,95,["So many books! 'Moss and You', 'A Brief History of Toadstools', 'Advanced Napping'…","This one is called 'Slimes: A Gentle Guide'. Somebody dog-eared the chapter on feeding them. Hmm."]);
  L(595,585,80,["The shelves go all the way up. Master Lum would need a ladder. Or a levitation spell. I bet she has a levitation spell."]);
  L(740,712,110,["Bubbling potions, glowing crystals, and a book left open… like someone stepped away in the middle of something.","The page shows a drawing of a slime getting bigger, and bigger, and BIGGER. I don't like this book."]);
  L(905,575,80,["A cabinet with a hundred tiny drawers. 'Eye of newt'… 'moonmint'… 'buttons'… 'more buttons'."]);
  SINT.push({x:985,y:568,reach:60,onInteract:()=>say(bucketTaken?"Another bucket! …No. One bucket helmet is plenty.":"An old bucket stuffed with dried roots. Hmm… a sturdy bucket like this would make a pretty good helmet.")});
  L(1085,612,90,["The fire's still warm. Someone was here not long ago…","Dried herbs and two glowing crystals on the mantel. It smells like lavender and woodsmoke."]);
  L(1100,700,95,["A giant spellbook on a stand. The writing glows when I lean close… I can't read a single word. Yet!"]);
  L(1225,680,85,["A little lantern and an old scroll. It's a map of the garden! Someone circled the well and drew a tiny crown beside it."]);
  SINT.push({x:415,y:722,reach:85,onInteract:()=>{if(mimicState===2){say("Just a regular chest now. I think it's sulking.");return;}
    const fight=()=>startEncounter({kind:'mimic',scene:'study',x:415,y:705,s:1,calm:0,dead:0,scripted:mimicState===0},'ambush');
    if(mimicState===0)talk([['Cosmic',"A sturdy old chest… locked tight. Maybe there's treasure inside!"],['Cosmic',"Wait. Is the lock… warm? Is it BREATHING?!"]],false,fight);
    else talk([['Cosmic',"Okay, chest. Round two. And this time I have a sword."]],false,fight);}});
  L(1285,735,85,["Tree roots growing straight through the stone. Something up above must be very, very old."]);}
function enterStudy(){SCENE='study';spawnStudySlimes();for(const g of SSLIMES)g.calm=Math.max(g.calm||0,2.5);lum.x=330;lum.y=724;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=330;WTITLE.t=0;setupStudy();
  if(!studyVisited){studyVisited=true;setTimeout(()=>playerQuip('A secret study… behind the secret room!'),1100);}}
function enterWellFromStudy(){SCENE='well';lum.x=560;lum.y=530;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=676;setupWell();for(const g of WSLIMES)g.calm=Math.max(g.calm||0,2.5);}
function updateRoomDoors(){}
const SMOTES=[];for(let i=0;i<34;i++)SMOTES.push({x:rnd(420,1250),y:rnd(120,640),ph:rnd(0,TAU),sp:rnd(.2,.6)});
function drawStudy(){const im=IMG.studyroom;if(!ready(im))return;const rz=H/768*ROOMZ;
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#1a1d22';ctx.fillRect(0,0,W,H);
  ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz),DPR*WOFF.y);ctx.drawImage(im,0,0,1375,768);
  // the pool shimmering through the archway
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.beginPath();ctx.ellipse(178,512,100,26,0,0,TAU);ctx.clip();for(let i=0;i<3;i++){const a=T*.5+i*2.1;drawGlow(ctx,178+Math.cos(a)*50,512+Math.sin(a)*8,60,['150,220,255','230,180,255','170,255,220'][i],.18);}ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';
  {const g=ctx.createLinearGradient(80,0,330,0);g.addColorStop(0,'rgba(170,215,255,.05)');g.addColorStop(1,'rgba(170,215,255,0)');ctx.fillStyle=g;ctx.fillRect(80,100,250,620);}
  // lanterns flicker, the hearth breathes, crystals and books glow
  const fl=(s)=>.75+.15*Math.sin(T*9+s)+.1*Math.sin(T*23+s*3);
  for(const [x,y,r,s] of [[612,262,46,0],[851,258,46,1.7],[1206,480,54,3.1]]){drawGlow(ctx,x,y,r*fl(s),'255,205,130',.42);drawGlow(ctx,x,y,r*2.4,'255,190,120',.12*fl(s));}
  drawGlow(ctx,1095,500,110*fl(5),'255,150,70',.22);drawGlow(ctx,1095,520,60,'255,190,110',.25*fl(6));
  for(const [x,y,c,s] of [[1026,330,'210,150,255',0],[1182,318,'140,255,190',1.4],[760,478,'220,160,255',2.2],[808,486,'170,220,255',3.3]]){drawGlow(ctx,x,y,38+6*Math.sin(T*1.6+s),c,.32+.12*Math.sin(T*1.6+s));}
  drawGlow(ctx,722,512,52,'255,240,190',.16+.05*Math.sin(T*1.2));drawGlow(ctx,1098,470,70,'255,235,180',.18+.07*Math.sin(T*1.4));
  for(let i=0;i<6;i++){const t=(T*.35+i/6)%1;drawGlow(ctx,1080+Math.sin(i*2.3+T)*30,480-t*120,6,'255,230,160',.6*Math.sin(Math.PI*t));}
  for(let i=0;i<5;i++){const t=(T*.25+i/5)%1;drawGlow(ctx,700+Math.sin(i*1.7+T*.8)*40,500-t*110,5,'230,200,255',.5*Math.sin(Math.PI*t));}
  for(const m of SMOTES){const x=m.x+Math.sin(T*m.sp+m.ph)*18,y=m.y+Math.cos(T*m.sp*.7+m.ph)*12;const tw=.5+.5*Math.sin(T*2+m.ph*3);drawGlow(ctx,x,y,5*tw+2,'255,236,200',.3*tw);}
  ctx.restore();
  {const d=lum.x-120;if(d<260){const a=Math.max(0,1-d/260)*(.55+.25*Math.sin(T*3));ctx.save();ctx.globalAlpha=a;ctx.translate(108+Math.sin(T*3)*4,728);ctx.fillStyle='rgba(200,230,255,.9)';for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(-i*16,0);ctx.lineTo(14-i*16,-10);ctx.lineTo(9-i*16,0);ctx.lineTo(14-i*16,10);ctx.closePath();ctx.fill();}drawGlow(ctx,0,0,30,'170,215,255',.4);ctx.restore();}}
  // Cosmic, then whatever stands in front of him
  const L_=[[lum.y,()=>{const k=studyH(lum.y)/151;ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();}]];
  for(const o of SOCC)if(lum.y<o.base&&ready(IMG[o.img]))L_.push([Math.min(o.base,2000),()=>ctx.drawImage(IMG[o.img],o.x,o.y)]);
  for(const g of SSLIMES)L_.push([g.y,()=>drawWellSlime(g,studyH(g.y)/151)]);
  L_.sort((a,b)=>a[0]-b[0]);for(const [,f] of L_)f();
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k=studyH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k,k);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.3,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(14,10,8,0)');vg.addColorStop(1,'rgba(14,10,8,.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(14,10,8,.4)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#fff3dc';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('The Hidden Study',W/2,H*.3+10);ctx.restore();}}

