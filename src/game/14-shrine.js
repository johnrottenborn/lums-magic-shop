/* =====================================================================
   THE SUNKEN SHRINE: a forgotten temple at the bottom of the koi pond
   ===================================================================== */
const PFLOOR=[[180,628],[395,648],[470,705],[940,705],[1015,652],[1215,632],[1250,670],[990,698],[955,768],[470,768],[445,698],[150,672]];
const POBST=[{k:'ell',x:705,y:694,rx:228,ry:30}];
function pondFree(x,y){if(!inPoly(x,y,PFLOOR))return false;for(const o of POBST)if(((x-o.x)/o.rx)**2+((y-o.y)/o.ry)**2<1)return false;return true;}
function solvePond(px,py,nx,ny){if(pondFree(nx,ny))return [nx,ny];if(pondFree(nx,py))return [nx,py];if(pondFree(px,ny))return [px,ny];return [px,py];}
const pondH=y=>124+(clamp(y,620,768)-620)*.24;
const PSLIMES=[];let pondSlimesSpawned=false,pondDone=0;
const PINT=[];let shroudTaken=false,pondVisited=false,pondReturn={x:POND.x,y:POND.y-POND.ry-40};
const PEXIT={x:905,y:742};
function setupPond(){PINT.length=0;
  PINT.push({x:705,y:735,reach:120,onInteract:()=>talk([['Cosmic',"Wait… this statue…"],['Cosmic',"It looks exactly like Master Lum!"],['Cosmic',"But that's impossible. This temple must be hundreds of years old. Maybe thousands."]])});
  if(!shroudTaken)PINT.push({x:455,y:700,reach:90,cloth:1,onInteract:()=>{shroudTaken=true;const i=PINT.findIndex(o=>o.cloth);if(i>=0)PINT.splice(i,1);giveItem('shroud');talk([['Cosmic',"It's the same blue as Master Lum's robes…"],['Cosmic',"Old and frayed… but strangely warm. Like it wants to be worn."]]);}});
  PINT.push({x:250,y:660,reach:80,onInteract:()=>say("Old clay pots, crusted with shells. One of them has the same rune that's carved over Master Lum's door.")});
  PINT.push({x:1150,y:655,reach:80,onInteract:()=>say("Through the arch… is that a shipwreck? In our POND? How big is this pond?!")});
  PINT.push({x:PEXIT.x,y:PEXIT.y,reach:70,onInteract:()=>askChoice("Leave the underwater temple?",[["Leave",()=>goScene(()=>enterGardenFromPond())],["Stay",()=>{}]])});}
function enterPond(){SCENE='pond';if(!pondSlimesSpawned){pondSlimesSpawned=true;for(const [x,y,s_] of [[330,665,.9],[1100,668,.95]])PSLIMES.push({kind:'jelly',scene:'pond',x,y,hx:x,hy:y,s:s_,col:SLIME_COL[2],z:0,vz:0,hop:null,wait:rnd(.5,2),hp:2,hit:0,angry:0,ph:rnd(0,TAU),blink:rnd(1,4),dead:0,face:-1});}for(const g of PSLIMES)g.calm=Math.max(g.calm||0,2.5);lum.x=700;lum.y=748;lum.face=1;lum.vx=lum.vy=0;lum.state='idleUp';WCAM.x=700;WTITLE.t=0;setupPond();
  if(!pondVisited){pondVisited=true;setTimeout(()=>playerQuip("I can breathe down here?! The pond magic must be protecting me!"),1100);}}
function pondVoiceEvent(){WEVENT.on=true;QUAKE.t=0;QUAKE.dur=3;QUAKE.amp=8;sfxRumble();
  for(let i=0;i<40;i++)PBUBBLES.push({x:rnd(100,1300),y:rnd(600,800),sp:rnd(60,120),r:rnd(2,6),ph:rnd(0,TAU),burst:1});
  setTimeout(()=>{sfxEerie();talk([['???',"She will never teach you the real power of magic…"]],false,()=>setTimeout(()=>talk([
    ['Cosmic',"…That voice!"],
    ['Cosmic',"I've watched Master Lum mix her powders a hundred times. Moonmint, bellglow, a pinch of stardust…"],
    ['Cosmic',"But I've never once seen her actually cast a spell…"]],false,()=>{WEVENT.on=false;for(let i=PBUBBLES.length-1;i>=0;i--)if(PBUBBLES[i].burst)PBUBBLES.splice(i,1);}),700));},2600);}
function enterGardenFromPond(){SCENE='garden';lum.x=pondReturn.x;lum.y=pondReturn.y;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x;cam.y=lum.y-50;}
function pondInteract(px,py){if(CH===1){say("The koi are huddled at the very bottom of the pond… they're frightened of something.");return;}pondReturn={x:px,y:py};
  if(!pondVisited)talk([['Cosmic',"The koi are all swimming in a circle… and the bottom of the pond is glowing."],['Cosmic',"There's something down there. Something big. Okay… deep breath!"]],false,()=>goScene(()=>enterPond()));
  else talk([['Cosmic',"Back down to the sunken temple!"]],false,()=>goScene(()=>enterPond()));}
/* a small two-button choice box */
const CHOICE={on:false,q:'',opts:[],sel:0,hits:[]};
function askChoice(q,opts){CHOICE.on=true;CHOICE.q=q;CHOICE.opts=opts;CHOICE.sel=0;}
function pickChoice(i){const o=CHOICE.opts[i];CHOICE.on=false;CHOICE.until=performance.now()+400;sfxPage(.6);if(o)setTimeout(o[1],0);}
function drawChoice(){if(!CHOICE.on)return;CHOICE.hits=[];ctx.save();ctx.fillStyle='rgba(10,20,26,.35)';ctx.fillRect(0,0,W,H);
  const w=Math.min(W-40,300),h=130,x=(W-w)/2,y=H*.38;ctx.fillStyle='rgba(20,10,10,.3)';rr(x+2,y+4,w,h,16);ctx.fill();ctx.fillStyle='#f6ecd2';rr(x,y,w,h,16);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#4a3420';ctx.font='500 17px Alegreya, Georgia, serif';ctx.textAlign='center';ctx.fillText(CHOICE.q,W/2,y+40);
  CHOICE.opts.forEach(([lab],i)=>{const bw=(w-50)/2,bx=x+18+i*(bw+14),by=y+68,bh=40,sel=CHOICE.sel===i;const g=ctx.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,i===0?'#e8b85a':'#b8a68a');g.addColorStop(1,i===0?'#b07a2a':'#8a7a62');ctx.fillStyle=g;rr(bx,by,bw,bh,12);ctx.fill();
    ctx.strokeStyle=sel?'#fff4d0':'#5a3a14';ctx.lineWidth=sel?2.5:1.5;ctx.stroke();ctx.fillStyle='#fffaf0';ctx.font='700 16px "Alegreya SC", Georgia, serif';ctx.fillText(lab,bx+bw/2,by+26);CHOICE.hits.push({x:bx,y:by,w:bw,h:bh,i});});ctx.restore();}
/* underwater life */
const PKOI=[];for(let i=0;i<4;i++)PKOI.push({a:i*TAU/4+rnd(-.3,.3),r:rnd(150,260),cy:rnd(110,190),sp:rnd(.12,.2)*(i%2?1:-1),s:rnd(.8,1.2),c:['255,150,70','255,250,240','255,120,60','250,200,140'][i],ph:rnd(0,TAU)});
const PBUBBLES=[];for(let i=0;i<34;i++)PBUBBLES.push({x:rnd(80,1300),y:rnd(0,768),sp:rnd(18,45),r:rnd(1.5,4.5),ph:rnd(0,TAU)});
const KOIPAT=[[[.25,.0,.32,.2],[-.35,.05,.25,.18]],[[.1,-.05,.28,.16]],[[.3,.02,.2,.15],[-.1,-.06,.3,.18],[-.55,.04,.18,.12]],[[-.2,0,.35,.2]]];
const KOIBASE=['255,246,236','255,250,244','255,240,226','255,214,160'],KOISPOT=['236,110,50','228,80,40','220,96,46','245,150,70'];
function drawPKoi(k){const a=T*k.sp+k.a,x=705+Math.cos(a)*k.r,y=k.cy+Math.sin(a)*k.r*.22,i=PKOI.indexOf(k),s=34*k.s;
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(Math.cos(a)*k.r*.22*k.sp,-Math.sin(a)*k.r*k.sp));ctx.globalAlpha=.78;
  const w=Math.sin(T*5+k.ph),w2=Math.sin(T*5+k.ph-1.2);
  // soft shadow-blur under it, like seen through water
  ctx.fillStyle='rgba(10,40,45,.25)';ctx.beginPath();ctx.ellipse(4,8,s*1.1,s*.3,0,0,TAU);ctx.fill();
  // tail: flowing, two lobes that wave
  ctx.fillStyle=`rgba(${KOISPOT[i]},.75)`;ctx.strokeStyle='rgba(60,30,20,.55)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(-s*.8,0);ctx.quadraticCurveTo(-s*1.2,-s*.15+w*s*.15,-s*1.6,-s*.42+w2*s*.25);ctx.quadraticCurveTo(-s*1.35,0,-s*1.6,s*.42+w2*s*.25);ctx.quadraticCurveTo(-s*1.2,s*.15+w*s*.15,-s*.8,0);ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.35)';for(let t=-2;t<=2;t++){ctx.beginPath();ctx.moveTo(-s*.9,0);ctx.lineTo(-s*1.5,t*s*.15+w2*s*.2);ctx.stroke();}
  // pectoral and pelvic fins, translucent and fluttering
  ctx.fillStyle='rgba(255,240,225,.55)';ctx.strokeStyle='rgba(60,30,20,.4)';
  for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(s*.35,sd*s*.2);ctx.quadraticCurveTo(s*.2,sd*s*(.55+.12*w),s*.02,sd*s*(.48+.1*w));ctx.quadraticCurveTo(s*.15,sd*s*.25,s*.35,sd*s*.2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-s*.35,sd*s*.18);ctx.quadraticCurveTo(-s*.45,sd*s*(.38+.08*w2),-s*.58,sd*s*.3);ctx.closePath();ctx.fill();}
  // body
  const g=ctx.createLinearGradient(0,-s*.32,0,s*.32);g.addColorStop(0,`rgba(${KOIBASE[i]},1)`);g.addColorStop(1,'rgba(225,210,195,1)');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(s*.92,0);ctx.bezierCurveTo(s*.85,-s*.34,s*.1,-s*.38,-s*.85,-s*.06);ctx.lineTo(-s*.85,s*.06);ctx.bezierCurveTo(s*.1,s*.38,s*.85,s*.34,s*.92,0);ctx.fill();
  ctx.save();ctx.clip();
  // koi patches
  for(const [px,py,rx,ry] of KOIPAT[i]){ctx.fillStyle=`rgba(${KOISPOT[i]},.9)`;ctx.beginPath();ctx.ellipse(px*s,py*s,rx*s,ry*s,.3,0,TAU);ctx.fill();}
  if(i===2){ctx.fillStyle='rgba(30,30,40,.55)';ctx.beginPath();ctx.ellipse(-s*.2,s*.08,s*.12,s*.07,0,0,TAU);ctx.ellipse(s*.15,-s*.12,s*.08,s*.05,0,0,TAU);ctx.fill();}
  // scale shimmer
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=.8;for(let sx=-.6;sx<.6;sx+=.14)for(let sy=-.2;sy<=.2;sy+=.13){ctx.beginPath();ctx.arc((sx+(Math.round(sy*8)%2)*.07)*s,sy*s,s*.065,-.9,.9);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.ellipse(s*.15,-s*.16,s*.45,s*.06,0,0,TAU);ctx.fill();
  ctx.restore();
  ctx.strokeStyle='rgba(60,30,20,.65)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(s*.92,0);ctx.bezierCurveTo(s*.85,-s*.34,s*.1,-s*.38,-s*.85,-s*.06);ctx.moveTo(s*.92,0);ctx.bezierCurveTo(s*.85,s*.34,s*.1,s*.38,-s*.85,s*.06);ctx.stroke();
  // dorsal fin ridge
  ctx.strokeStyle=`rgba(${KOISPOT[i]},.8)`;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(s*.4,-s*.01);ctx.quadraticCurveTo(0,-s*.05+w*s*.03,-s*.5,0);ctx.stroke();
  // eye and whiskers
  ctx.fillStyle='#1d1a22';ctx.beginPath();ctx.arc(s*.68,-s*.12,s*.05,0,TAU);ctx.arc(s*.68,s*.12,s*.05,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(80,50,30,.6)';ctx.lineWidth=.9;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(s*.9,sd*s*.05);ctx.quadraticCurveTo(s*1.02,sd*s*.12,s*1.0+w*s*.04,sd*s*.22);ctx.stroke();}
  ctx.restore();ctx.globalAlpha=1;}
function drawBlueCloth(){const x=448,y=432,len=96,N=14;ctx.save();
  const sway=t=>Math.sin(T*1.1+t*2.6)*t*13+Math.sin(T*.7+t*1.3)*t*4,half=t=>15+t*9+Math.sin(T*1.5+t*3)*1.5;
  const L=[],R=[];for(let i=0;i<=N;i++){const t=i/N;L.push([x-half(t)+sway(t),y+t*len]);R.push([x+half(t)+sway(t),y+t*len]);}
  // tattered hem: jagged threads and two long torn strips
  const hem=[];for(let k=0;k<=9;k++){const u=k/9,bx=L[N][0]+(R[N][0]-L[N][0])*u,d=(k%2?6:-2)+hash(k,3,77)*12+(k===3||k===7?18:0);hem.push([bx+Math.sin(T*1.8+k)*2,y+len+d+Math.sin(T*1.4+k*.8)*3]);}
  const path=()=>{ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(const p of L)ctx.lineTo(p[0],p[1]);for(const p of hem)ctx.lineTo(p[0],p[1]);for(let i=N;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.closePath();};
  const g=ctx.createLinearGradient(0,y,0,y+len+20);g.addColorStop(0,'#4f6f9a');g.addColorStop(.6,'#3f5f86');g.addColorStop(1,'#56807f');
  path();ctx.fillStyle=g;ctx.fill();
  ctx.save();path();ctx.clip();
  // faded watercolor blotches and algae creeping up from the hem
  for(let k=0;k<7;k++){ctx.fillStyle=k%2?'rgba(150,180,200,.18)':'rgba(30,50,70,.18)';ctx.beginPath();ctx.ellipse(x-10+hash(k,1,91)*22+sway(.5),y+12+hash(k,2,91)*70,8+hash(k,4,91)*10,5+hash(k,5,91)*8,0,0,TAU);ctx.fill();}
  const ag=ctx.createLinearGradient(0,y+len*.55,0,y+len+20);ag.addColorStop(0,'rgba(90,140,80,0)');ag.addColorStop(1,'rgba(90,140,80,.55)');ctx.fillStyle=ag;ctx.fillRect(x-60,y,120,len+40);
  // faded silver embroidery: a little wave rune
  ctx.strokeStyle='rgba(215,225,235,.45)';ctx.lineWidth=1.3;const ex=x+sway(.45),ey=y+len*.45;ctx.beginPath();for(let k=-1;k<=1;k++){ctx.moveTo(ex-12,ey+k*6);ctx.quadraticCurveTo(ex-6,ey+k*6-4,ex,ey+k*6);ctx.quadraticCurveTo(ex+6,ey+k*6+4,ex+12,ey+k*6);}ctx.stroke();
  ctx.beginPath();ctx.arc(ex,ey-16,4,0,TAU);ctx.stroke();
  // folds
  ctx.strokeStyle='rgba(20,35,55,.4)';ctx.lineWidth=1.4;for(const f of [-.45,.1,.55]){ctx.beginPath();for(let i=0;i<=N;i++){const t=i/N,p=[L[i][0]+(R[i][0]-L[i][0])*(.5+f*.5),L[i][1]];i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  // two small moth holes
  ctx.fillStyle='rgba(20,40,40,.85)';ctx.beginPath();ctx.ellipse(x-6+sway(.3),y+len*.3,2.5,3.5,.3,0,TAU);ctx.ellipse(x+8+sway(.7),y+len*.68,3.5,2.5,0,0,TAU);ctx.fill();
  ctx.restore();
  // ink outline like the rest of the painting
  path();ctx.strokeStyle='rgba(22,28,40,.85)';ctx.lineWidth=1.6;ctx.stroke();
  // a strand of seaweed tangled through the hem
  ctx.strokeStyle='rgba(80,130,70,.85)';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(hem[2][0],hem[2][1]-20);for(let k=0;k<5;k++)ctx.quadraticCurveTo(hem[2][0]+8+Math.sin(T+k)*6,hem[2][1]-14+k*10,hem[2][0]+Math.sin(T*1.2+k)*5,hem[2][1]-6+k*10);ctx.stroke();
  // frayed rope tying it to the pillar
  ctx.strokeStyle='#7a6a4a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-30,y-4);ctx.quadraticCurveTo(x,y+2,x+30,y-4);ctx.stroke();ctx.strokeStyle='rgba(30,25,15,.7)';ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle='#6a5a3c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+6,y-1);ctx.quadraticCurveTo(x+14,y+12+Math.sin(T)*2,x+10,y+22);ctx.moveTo(x+6,y-1);ctx.quadraticCurveTo(x+2,y+14,x-2,y+20+Math.sin(T+1)*2);ctx.stroke();
  ctx.fillStyle='#7a6a4a';ctx.beginPath();ctx.ellipse(x+6,y-1,4.5,3.5,0,0,TAU);ctx.fill();
  drawGlow(ctx,x+sway(.5),y+len*.5,40,'150,220,230',.12+.06*Math.sin(T*1.7));
  ctx.restore();}
function drawPondRoom(){const im=IMG.pondroom;if(!ready(im))return;const rz=H/768*ROOMZ;
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#0f2a2c';ctx.fillRect(0,0,W,H);
  let qx=0,qy=0;if(SCENE==='pond'&&QUAKE.t<QUAKE.dur){const e=Math.sin(Math.PI*Math.min(1,QUAKE.t/QUAKE.dur))*QUAKE.amp;qx=rnd(-1,1)*e;qy=rnd(-1,1)*e*.6;}
  ctx.setTransform(DPR*rz,0,0,DPR*rz,DPR*(W/2-WCAM.x*rz+qx),DPR*(WOFF.y+qy));ctx.drawImage(im,0,0,1375,768);
  // lift the gloom a touch and tint it with pond light
  ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(40,90,95,.22)';ctx.fillRect(0,0,1375,768);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';
  // shifting sun shafts from the surface
  for(let i=0;i<5;i++){const x=300+i*190+Math.sin(T*.25+i*1.7)*40,a=.05+.03*Math.sin(T*.6+i*2.1);const g=ctx.createLinearGradient(0,0,0,700);g.addColorStop(0,`rgba(180,240,230,${a*1.6})`);g.addColorStop(1,'rgba(180,240,230,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-25,0);ctx.lineTo(x+35,0);ctx.lineTo(x+120,700);ctx.lineTo(x-20,700);ctx.closePath();ctx.fill();}
  // the statue glows faintly
  drawGlow(ctx,700,420,190,'150,230,210',.12+.05*Math.sin(T*1.1));drawGlow(ctx,733,388,22,'190,240,255',.35+.2*Math.sin(T*2));
  // caustic ripples dancing over the floor
  for(let i=0;i<16;i++){const x=200+((i*137+T*14)%1000),y=640+((i*53)%120)+Math.sin(T+i)*4,a=.06+.05*Math.sin(T*2+i);drawGlow(ctx,x,y,50,'170,240,230',a);}
  ctx.restore();
  for(const k of PKOI)drawPKoi(k);
  if(!shroudTaken)drawBlueCloth();
  // the exit: a little shimmering pool of light
  {const a=.5+.25*Math.sin(T*2.2);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,PEXIT.x,PEXIT.y,60,'150,240,255',a*.6);ctx.strokeStyle=`rgba(210,250,255,${(a*.8).toFixed(3)})`;ctx.lineWidth=1.5;
    for(let i=0;i<3;i++){const t=(T*.5+i/3)%1;ctx.globalAlpha=1-t;ctx.beginPath();ctx.ellipse(PEXIT.x,PEXIT.y,10+t*40,(10+t*40)*.3,0,0,TAU);ctx.stroke();}
    for(let i=0;i<5;i++){const t=(T*.6+i/5)%1;drawGlow(ctx,PEXIT.x+Math.sin(i*2.3+T)*14,PEXIT.y-t*70,5,'220,255,255',(1-t)*.8);}ctx.restore();}
  const L_=[[lum.y,()=>{const k=pondH(lum.y)/151;ctx.save();ctx.restore();ctx.save();ctx.translate(lum.x,lum.y);ctx.scale(k,k);ctx.translate(-lum.x,-lum.y);drawLum();ctx.restore();}]];
  for(const g of PSLIMES)L_.push([g.y,()=>drawWellSlime(g,pondH(g.y)/151)]);
  L_.sort((a,b)=>a[0]-b[0]);for(const [,f] of L_)f();
  for(const p of PARTS)if(p.type==='fiz'||p.type==='puff'||p.type==='dust'){const k=pondH(p.y)/151;ctx.save();ctx.translate(p.x,p.y);ctx.scale(k,k);ctx.translate(-p.x,-p.y);drawPartWell(p);ctx.restore();}
  if(ready(IMG.pcol_l))ctx.drawImage(IMG.pcol_l,0,667);if(ready(IMG.pcol_r))ctx.drawImage(IMG.pcol_r,947,675);
  // bubbles drifting up past everything
  for(const b of PBUBBLES){const y=((b.y-T*b.sp)%800+800)%800-20,x=b.x+Math.sin(T*1.5+b.ph)*6;ctx.strokeStyle='rgba(220,250,255,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,b.r,0,TAU);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(x-b.r*.35,y-b.r*.35,b.r*.3,0,TAU);ctx.fill();}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  // gentle water wobble vignette
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.3,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(5,30,35,0)');vg.addColorStop(1,'rgba(5,30,35,.5)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(WTITLE.t<4.5&&!CAPTURE.on){const a=Math.min(1,WTITLE.t*1.5,(4.5-WTITLE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(5,25,30,.45)';ctx.fillRect(0,H*.3-40,W,80);
    ctx.fillStyle='#e6fbf6';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('The Sunken Shrine',W/2,H*.3+10);ctx.restore();}}

