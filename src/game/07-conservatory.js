/* =====================================================================
   The Runic Conservatory: a secret room beneath the well.
   Coordinates here are painting pixels (1375 x 768); the room is shown
   at full screen height and pans sideways with Cosmic.
   ===================================================================== */
let SCENE='garden';const WCAM={x:330};const SHED_POS={x:530,y:560};let wellVisited=false;
const FADE={a:0,dir:0,cb:null};
function goScene(cb){if(FADE.dir)return;FADE.dir=1;FADE.cb=cb;}
function updateFade(dt){if(FADE.dir===1){FADE.a=Math.min(1,FADE.a+dt/.6);if(FADE.a>=1){const cb=FADE.cb;FADE.cb=null;cb&&cb();FADE.dir=-1;if(typeof SAVEC!=='undefined')SAVEC.t=99;}}else if(FADE.dir===-1){FADE.a=Math.max(0,FADE.a-dt/.7);if(FADE.a<=0)FADE.dir=0;}}
function drawSceneFade(){if(FADE.a>0){ctx.fillStyle=FADE.white?`rgba(255,250,240,${FADE.a.toFixed(3)})`:`rgba(8,10,16,${FADE.a.toFixed(3)})`;ctx.fillRect(0,0,W,H);}}
const wellH=y=>112+(clamp(y,480,768)-490)*.38;          // Cosmic's height at a given depth
const WFLOOR=[[330,590],[420,508],[640,494],[950,503],[1005,560],[1110,618],[1240,660],[1300,768],[70,768],[150,700],[250,640]];
const WOBST=[{k:'ell',x:690,y:604,rx:222,ry:82},{k:'rect',x0:950,x1:1192,y0:470,y1:614},{k:'rect',x0:802,x1:998,y0:470,y1:530},{k:'rect',x0:1108,x1:1240,y0:570,y1:658},{k:'ell',x:750,y:494,rx:26,ry:10,bucket:1}];
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;}return c;}
function wellFree(x,y){if(!inPoly(x,y,WFLOOR))return false;for(const o of WOBST){if(o.k==='rect'){if(x>o.x0&&x<o.x1&&y>o.y0&&y<o.y1)return false;}else if(((x-o.x)/o.rx)**2+((y-o.y)/o.ry)**2<1)return false;}return true;}
function solveWell(px,py,nx,ny){if(wellFree(nx,ny))return [nx,ny];if(wellFree(nx,py))return [nx,py];if(wellFree(px,ny))return [px,ny];return [px,py];}
// parts of the painting that stand in front of Cosmic when he walks behind them
const WOCC=[{base:600,clip:c=>{c.ellipse(690,606,224,86,0,0,TAU);}},{base:614,clip:c=>{c.rect(950,452,244,162);}},{base:530,clip:c=>{c.rect(802,300,198,230);}},{base:658,clip:c=>{c.rect(1108,562,134,96);}}];
const WINT=[];let poolTalk=0;
function setupWell(){WINT.length=0;
  const L=(x,y,reach,lines)=>{let i=0;WINT.push({x,y,reach,onInteract:()=>say(lines[(i++)%lines.length])});};
  L(690,705,120,["The water is swirling with every color at once… This is it. This is where the magic is coming from!","If I lean in close I can hear it humming. Like the runes are singing to each other.","I can see the sky reflected down there… but it's the night sky. With stars. In the morning?!"]);
  for(const [x,y] of [[470,620],[910,625],[560,525],[820,528],[600,690],[780,690]])L(x,y,85,["The water is swirling with every color at once… This is where the magic is coming from!","If I lean in close I can hear it humming. Like the runes are singing to each other.","I can see stars reflected down there. Stars! In the morning!"]);
  L(380,575,95,["Master's old potion bottles! Some of them are still bubbling. Don't touch, Cosmic. Don't. Touch."]);
  L(460,520,80,["Glowing crystals growing right out of the wall. Master says they only grow where magic is strongest."]);
  L(900,545,90,["A whole shelf of potions down here! Master Lum never told me about this room.","Moonlight tonic, ember draught, sleepy dust… and one that just says 'DO NOT'."]);
  L(1070,630,90,["Scrolls, a mortar and pestle… someone's been studying down here.","This scroll has a drawing of a giant slime with a crown. Oh no. Oh no no no."]);
  L(1175,672,90,["THE RUNIC CONSERVATORY. A secret room! Under our well! This whole time!"]);
  WINT.push({x:195,y:700,reach:80,onInteract:()=>goScene(()=>enterGarden())});
  if(!bucketTaken)WINT.push({x:750,y:510,reach:62,bucket:1,onInteract:()=>takeBucket()});
  WINT.push({x:676,y:510,reach:70,onInteract:()=>{if(studyVisited)goScene(()=>enterStudy());else talk([['Cosmic',"There's a shiny slime trail leading through that doorway…"],['Cosmic',"Okay. Brave apprentice. Very brave. Here I go."]],false,()=>goScene(()=>enterStudy()));}});
  L(140,720,90,["The runes glow brighter when I get close. They're warm, like sunlight."]);
  L(1270,720,90,["This rune looks like a little door. Or a little house. Or a very square bird."]);
}
function takeBucket(){if(bucketTaken)return;bucketTaken=true;const i=WINT.findIndex(o=>o.bucket);if(i>=0)WINT.splice(i,1);const j=WOBST.findIndex(o=>o.bucket);if(j>=0)WOBST.splice(j,1);
  puff(750,490,14,'fiz',{sp:60,vz:160,z:20,life:.9,size:2.4});giveItem('bucket');if(!gotEquip){gotEquip=true;TUT.stage=1;TUT.t=0;}}
function enterWell(){SCENE='well';lum.x=340;lum.y=705;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=330;setupWell();
  spawnWellSlimes();for(const g of WSLIMES)g.calm=Math.max(g.calm||0,2.5);if(slimesDone<3){GOAL.tag='NEW TASK';GOAL.text='Defeat the slimes in the chamber';}HINT.goalT=0;WTITLE.t=0;if(!wellVisited){wellVisited=true;setTimeout(()=>playerQuip('Whoa… a secret room under the well?!'),900);}}
function enterGarden(){SCENE='garden';lum.x=WELL.x;lum.y=WELL.y+70;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x;cam.y=lum.y-50;}
function wellInteract(){if(CH===1){say("The well is cold and silent. Whatever stirred down there is gone now.");return;}if(!wellVisited)talk([
    ['Cosmic',"Whoa… the well is humming. I can feel it all the way in my fingertips!"],
    ['Cosmic',"Something magic is down there. Something big."],
    ['Cosmic',"What if all the slugs and slimes are coming from one place? What if there's a… slime boss?!"],
    ['Cosmic',"If I take care of the boss, the whole garden is saved. And then Master Lum will HAVE to teach me magic!"],
    ['Cosmic',"Okay. Deep breath. Here I go…"]],false,()=>goScene(()=>enterWell()));
  else talk([['Cosmic',"The well is still humming. Back down I go!"]],false,()=>goScene(()=>enterWell()));wellMagic=2.4;sfxWell();}
const WTITLE={t:99};const WMOTES=[];for(let i=0;i<30;i++)WMOTES.push({x:rnd(100,1300),y:rnd(80,740),ph:rnd(0,TAU),sp:rnd(.3,.9),c:Math.random()<.6?'190,230,255':'230,210,255'});
const CHANNELS=[[[545,650],[500,700],[430,740],[380,768]],[[838,650],[900,700],[960,740],[1000,768]],[[520,478],[545,500],[575,520]],[[360,585],[330,600],[300,610]]];
function drawWellRoom(){const im=IMG.wellroom;if(!ready(im))return;const rz=H/768*ROOMZ;
  let qx=0,qy=0;if(QUAKE.t<QUAKE.dur){const e=Math.sin(Math.PI*Math.min(1,QUAKE.t/QUAKE.dur))*QUAKE.amp;qx=rnd(-1,1)*e;qy=rnd(-1,1)*e*.6;}
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#1c2028';ctx.fillRect(0,0,W,H);ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz+qx),DPR*(qy+WOFF.y));
  ctx.fillStyle='#1c2028';ctx.fillRect(-200,0,1800,768);ctx.drawImage(im,0,0,1375,768);if(bucketTaken&&ready(IMG.wellroom_nobucket))ctx.drawImage(IMG.wellroom_nobucket,712,440);
  // sunlight pouring down from the opening above
  ctx.save();ctx.globalCompositeOperation='lighter';{const a=.07+.025*Math.sin(T*.6);const g=ctx.createLinearGradient(0,40,0,640);g.addColorStop(0,`rgba(255,248,215,${a*1.6})`);g.addColorStop(1,'rgba(255,248,215,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(560,40);ctx.lineTo(820,40);ctx.lineTo(900,640);ctx.lineTo(480,640);ctx.closePath();ctx.fill();}
  // the runes breathe
  if(ready(IMG.wellroom_runes)){ctx.globalAlpha=.35+.3*Math.sin(T*1.3);ctx.drawImage(IMG.wellroom_runes,0,0,1375,768);ctx.globalAlpha=1;}
  // the magic pool swirls
  ctx.save();ctx.beginPath();ctx.ellipse(690,578,180,50,0,0,TAU);ctx.clip();
  for(let i=0;i<4;i++){const a=T*.4+i*1.6,x=690+Math.cos(a)*90,y=578+Math.sin(a)*22;const col=['150,220,255','230,180,255','170,255,220','255,210,240'][i];drawGlow(ctx,x,y,90,col,.22);}
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.6;for(let i=0;i<4;i++){const t=(T*.25+i/4)%1,r=20+t*160;ctx.globalAlpha=Math.sin(Math.PI*t)*.6;ctx.beginPath();ctx.ellipse(690,578,r,r*.28,0,0,TAU);ctx.stroke();}ctx.globalAlpha=1;
  for(let i=0;i<10;i++){const tw=Math.pow(Math.max(0,Math.sin(T*2+i*2.4)),6);if(tw<.05)continue;drawGlow(ctx,690+(hash(i,1,1101)-.5)*300,578+(hash(i,2,1101)-.5)*70,8,'255,255,255',tw);}
  ctx.restore();
  // little streams of light flowing in the floor channels
  for(const P of CHANNELS)for(let k=0;k<3;k++){const t=(T*.35+k/3)%1,n=P.length-1,seg=Math.min(n-1,Math.floor(t*n)),u=t*n-seg,x=P[seg][0]+(P[seg+1][0]-P[seg][0])*u,y=P[seg][1]+(P[seg+1][1]-P[seg][1])*u;drawGlow(ctx,x,y,14,'170,225,255',.55*Math.sin(Math.PI*t));}
  for(const m of WMOTES){m.ph+=.016*m.sp;const x=m.x+Math.sin(m.ph)*20,y=m.y+Math.cos(m.ph*.7)*14-((T*6*m.sp)%40);const tw=.5+.5*Math.sin(T*2+m.ph*3);drawGlow(ctx,x,y,7*tw+3,m.c,.35*tw);}
  ctx.restore();
  {const d=Math.hypot(lum.x-190,lum.y-700);if(d<240){const a=Math.max(0,1-d/240)*(.55+.25*Math.sin(T*3));ctx.save();ctx.globalAlpha=a;ctx.translate(175+Math.sin(T*3)*4,705);ctx.fillStyle='rgba(200,230,255,.9)';for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(-i*16,0);ctx.lineTo(14-i*16,-10);ctx.lineTo(9-i*16,0);ctx.lineTo(14-i*16,10);ctx.closePath();ctx.fill();}drawGlow(ctx,0,0,30,'170,215,255',.4);ctx.restore();}}
  // Cosmic, scaled for depth, then anything in the painting that stands in front of him
  const L_=[[lum.y,()=>{const k=wellH(lum.y)/151;ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();}]];
  for(const g of WSLIMES)L_.push([g.y,()=>drawWellSlime(g)]);
  for(const o of WOCC)L_.push([o.base,()=>{ctx.save();ctx.beginPath();o.clip(ctx);ctx.clip();ctx.drawImage(im,0,0,1375,768);if(bucketTaken&&ready(IMG.wellroom_nobucket))ctx.drawImage(IMG.wellroom_nobucket,712,440);ctx.restore();},1]);
  L_.sort((a,b)=>a[0]-b[0]);
  // occluders only matter once someone stands behind them; skip the ones nobody is behind
  const ys=[lum.y,...WSLIMES.map(g=>g.y)];for(const [y_,f,occ] of L_){if(occ&&!ys.some(v=>v<y_&&v>y_-260))continue;f();}
  for(const p of PARTS){if(p.type==='goo')drawGooPart(p);else if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k=wellH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k,k);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}}
  drawWellDust();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.3,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(10,14,24,0)');vg.addColorStop(1,'rgba(10,14,24,.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(10,14,24,.4)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#e9f4ff';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('The Runic Conservatory',W/2,H*.3+10);ctx.restore();}}
function drawSparkPart(o,q){const a=1-q,y=o.y-o.z,tw=.6+.4*Math.sin(T*30+o.x);if(o.star){const r=o.s*(q<.15?q/.15:1);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,o.x,y,o.s*4.5,o.col,a*.7);ctx.restore();ctx.save();ctx.translate(o.x,y);ctx.rotate(o.rot+q*6);ctx.globalAlpha=Math.min(1,a*1.4)*tw;ctx.fillStyle='#ffe58a';ctx.strokeStyle='rgba(170,110,20,.85)';ctx.lineWidth=.8;starPath(ctx,r);ctx.fill();ctx.stroke();ctx.fillStyle='#fffbe6';starPath(ctx,r*.42);ctx.fill();ctx.restore();return;}ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,o.x,y,o.s*4,o.col,a*.75);ctx.restore();ctx.fillStyle=`rgba(255,250,225,${(a*tw).toFixed(3)})`;ctx.beginPath();ctx.arc(o.x,y,o.s*.55,0,TAU);ctx.fill();}
function drawPartWell(o){const q=o.life/o.max;if(o.type==='fiz'&&o.col){drawSparkPart(o,q);return;}if(o.type==='fiz'){const a=1-q;drawGlow(ctx,o.x,o.y-o.z,o.s*3,'170,220,255',a*.6);}else if(o.type==='puff'){drawGlow(ctx,o.x,o.y-o.z,o.s,'200,200,210',.35*(1-q));}}
const SHOPZ=.82;function roomView(){const rz=H/768*(SCENE==='shop'?SHOPZ:1);return [rz,SCENE==='shop'?H-768*rz:0];}
function wellToScreen(wx,wy){const [rz,oy]=roomView();return [(wx-WCAM.x)*rz+W/2,wy*rz+oy];}

