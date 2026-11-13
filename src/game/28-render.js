/* ---------- render ---------- */
let grainCv=null;
function resize(){
  const r=game.getBoundingClientRect();W=r.width;H=r.height;DPR=Math.min(devicePixelRatio||1,2.5);
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
  ZOOM0=Math.min(W/620,H/1150);zoom=ZOOM0*ZOOMK;
  {const nr=Math.min(1.5,zoom*DPR);if(Math.abs(nr-riverR)>.15||!estCv||!creekCv){buildCreek(nr);buildPond(Math.min(1.6,nr*1.2));dirtCache.clear();buildEstateGround(Math.min(1.5,nr*1.3));}}
  layoutButtons();
  if(!grainCv){grainCv=document.createElement('canvas');grainCv.width=grainCv.height=256;const g=grainCv.getContext('2d');const id=g.createImageData(256,256);
    for(let i=0;i<id.data.length;i+=4){const v=200+Math.random()*55;id.data[i]=v;id.data[i+1]=v*.98;id.data[i+2]=v*.92;id.data[i+3]=255;}g.putImageData(id,0,0);}
  for(const m of MOTES){m.x=cam.x+rnd(-W/zoom/2,W/zoom/2);m.y=cam.y+rnd(-H/zoom/2,H/zoom/2);}
}
addEventListener('resize',resize);

function drawGround(x0,y0,x1,y1){
  const g=IMG.ground;if(!ready(g)){ctx.fillStyle='#8fb768';ctx.fillRect(x0,y0,x1-x0,y1-y0);return;}
  const tw=g.naturalWidth*GS,th=g.naturalHeight*GS;
  for(let ty=Math.floor(y0/th)*th;ty<y1;ty+=th)for(let tx=Math.floor(x0/tw)*tw;tx<x1;tx+=tw)ctx.drawImage(g,tx,ty,tw+.6,th+.6);
}
function drawTuft(t){
  const dx=t.x-lum.x,dy=(t.y-lum.y)*1.6,d=Math.hypot(dx,dy);const push=d<52?(1-d/52)*Math.sign(dx||1)*1.2:0;
  const sway=Math.sin(T*2.2+t.hue*20+t.x*.01)*.22+wind(T,t.x,t.y)*.95+push+(t.lean||0);
  const cols=t.hue<.5?['#5d8c46','#94bb6c','#b9d48c']:['#6c9a4e','#a3c578','#cfe2a0'];
  for(let i=0;i<t.n;i++){const off=(i/(t.n-1)-.5)*16;const h=t.h*(.65+hash(i,t.n,7)*.55);const tipx=t.x+off*1.5+sway*h*.6,tipy=t.y-h;
    ctx.fillStyle=cols[i%3];ctx.beginPath();ctx.moveTo(t.x+off*.4-1.6,t.y);ctx.quadraticCurveTo(t.x+off,t.y-h*.55,tipx,tipy);ctx.quadraticCurveTo(t.x+off+1.2,t.y-h*.5,t.x+off*.4+1.8,t.y);ctx.fill();}
}
function drawFlower(f){
  const sw=Math.sin(T*1.7+f.ph)*2.5+wind(T,f.x,f.y)*4;const hx=f.x+sw,hy=f.y-f.h;
  ctx.strokeStyle='#5f8f4a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.quadraticCurveTo(f.x,f.y-f.h*.5,hx,hy);ctx.stroke();
  ctx.fillStyle='#7aa85a';ctx.beginPath();ctx.ellipse(f.x+3,f.y-f.h*.35,3.4,1.5,.5,0,TAU);ctx.fill();
  const s=f.s;
  if(f.yellow){ctx.fillStyle='#f2c33c';for(let i=0;i<5;i++){const a=i/5*TAU+f.ph;ctx.beginPath();ctx.ellipse(hx+Math.cos(a)*2.6*s,hy+Math.sin(a)*1.8*s,2.6*s,1.9*s,a,0,TAU);ctx.fill();}ctx.fillStyle='#ffe9a0';}
  else{ctx.fillStyle='#7fa6e6';for(let i=0;i<5;i++){const a=i/5*TAU+f.ph;ctx.beginPath();ctx.arc(hx+Math.cos(a)*2.5*s,hy+Math.sin(a)*1.7*s,2.1*s,0,TAU);ctx.fill();}
    ctx.fillStyle='#b9cff5';ctx.beginPath();ctx.arc(hx-1*s,hy-1*s,1.2*s,0,TAU);ctx.fill();ctx.fillStyle='#f6dc72';}
  ctx.beginPath();ctx.arc(hx,hy,1.2*s,0,TAU);ctx.fill();
}
function drawObj(o){
  const im=IMG[o.img];if(!ready(im))return;const w=im.naturalWidth*o.s,h=im.naturalHeight*o.s;
  ctx.save();ctx.globalAlpha=o.kind==='rock'?.45:.4;ctx.drawImage(glowCanvas('38,64,30'),o.x-w*.5+w*.06,o.y-h*.18,w*1.0,h*.42);ctx.restore();
  if(o.kind==='rock'){ctx.drawImage(im,o.x-w/2,o.y-h*.72,w,h);return;}
  const behind=lum.y<o.y-6&&lum.y>o.y-h*.9&&Math.abs(lum.x-o.x)<w*.42;o.fade=(o.fade??1)+((OCC|=behind,behind?1:1)-(o.fade??1))*.15;
  const sk=wind(T,o.x,o.y)*.055+Math.sin(T*1.2+o.ph)*.016;
  ctx.save();ctx.globalAlpha=o.fade;ctx.translate(o.x,o.y);ctx.transform(1,0,sk,1,0,0);if(o.flip)ctx.scale(-1,1);
  ctx.drawImage(im,-w/2,-h*.8,w,h);ctx.restore();
}
let OCC=0;const ghostCv=document.createElement('canvas');ghostCv.width=300;ghostCv.height=280;const gctx=ghostCv.getContext('2d');
function drawLumGhost(){if(!OCC||!ready(atlas))return;const a=ANIM[lum.state];let fr=a.frames[lum.state==='idle'?lum.fi%a.frames.length:lum.fi];if(lum.state==='idle'&&lum.blink>0)fr=a.blink;
  gctx.globalCompositeOperation='source-over';gctx.clearRect(0,0,300,280);gctx.drawImage(atlas,fr*FW,0,FW,FH,0,0,FW,FH);gctx.globalCompositeOperation='source-atop';gctx.fillStyle='rgba(225,236,255,.28)';gctx.fillRect(0,0,300,280);
  const flip=lum.face!==a.native,dw=FW*SPR,dh=FH*SPR;ctx.save();ctx.globalAlpha=.78;ctx.translate(lum.x,lum.y+3);if(PC!=='cosmic')ctx.scale(LUMK,LUMK);if(flip)ctx.scale(-1,1);ctx.drawImage(ghostCv,-dw/2,-dh*(274/280),dw,dh);ctx.restore();}
let LUMSTONE=0;
function drawLum(){if(LUMSTONE&&!drawLum.raw){const t0=T;withStone('lumow',lum.x-110,lum.y-250,220,270,()=>{drawLum.raw=1;T=0;try{drawLum();}finally{T=t0;drawLum.raw=0;}});return;}
  if(!INTRO.lumShown||CAPTURE.on)return;
  if(PC==='spar'){const st=lum.state,F={x:lum.x,y:lum.y,face:lum.face,dir:st==='walkUp'?'up':st==='walkDown'?'down':'side',moving:st==='walk'||st==='walkUp'||st==='walkDown',ph:(lum.ft||0)*16};drawSparOW(F,lum.alpha);return;}
  const a=ANIM[lum.state]||ANIM.idle;let fr=a.frames[lum.state==='idle'?lum.fi%a.frames.length:lum.fi];if(fr===undefined)fr=a.frames[0];
  if(lum.state==='idle'&&lum.blink>0)fr=a.blink;
  if(PC!=='cosmic'&&lum.talkSide&&lum.state==='idle')fr=29;
  const flip=lum.face!==a.native;
  const moving=lum.state==='walk'||lum.state==='walkUp'||lum.state==='walkDown',ph=moving?Math.cos(lum.ft/a.frames.length*TAU*2):0;
  const sw=44*(1+.05*ph-.06*(lum.plant||0)),sa=(lum.wet?.12:.24)+.08*(lum.plant||0);
  const C=PC==='cosmic',sws=C?.7:LUMK;
  ctx.fillStyle=`rgba(40,62,30,${sa.toFixed(3)})`;ctx.beginPath();ctx.ellipse(lum.x,lum.y+2,sw*sws,12.5*sws,0,0,TAU);ctx.fill();
  ctx.fillStyle='rgba(30,50,25,.16)';ctx.beginPath();ctx.ellipse(lum.x,lum.y+2,sw*.55*sws,7*sws,0,0,TAU);ctx.fill();
  const IMG_=C?cosSheet():atlas,fw=C?CFW:FW,fh=C?CFH:FH,sp=C?CSPR:SPR,anc=C?264/270:274/280;
  if(!ready(IMG_))return;ctx.globalAlpha=lum.alpha??1;
  ctx.save();
  if(lum.wet){ctx.beginPath();ctx.rect(lum.x-200,lum.y-400,400,400-9);ctx.clip();}
  ctx.translate(lum.x,lum.y+3);if(!C)ctx.scale(LUMK,LUMK);if(flip)ctx.scale(-1,1);
  if(lum.state==='idle'||lum.state==='idleUp'){const b=Math.sin(T*2.3);ctx.scale(1-.004*b,1+.009*b);}
  const dw=fw*sp,dh=fh*sp;if(false){ctx.save();ctx.translate(-dw/2,-dh*anc);ctx.scale(sp,sp);drawWalkLegs(ctx,fr,moving?lum.ft/a.frames.length*TAU:0,moving,fr<=27);ctx.restore();}
  if(C&&moving){const sp_=lum.ft/a.frames.length*TAU;ctx.translate(0,-Math.abs(Math.sin(sp_))*1.5*sp);}
  ctx.drawImage(IMG_,fr*fw,0,fw,fh,-dw/2,-dh*anc,dw,dh);
  if(C&&PARTY[HERO].head==='bucket'){ctx.translate(-dw/2,-dh*anc);ctx.scale(sp,sp);drawBucketHat(ctx,fr);}
  ctx.restore();ctx.globalAlpha=1;
  if(C&&lum.state==='cast'&&lum.fi===1){drawGlow(ctx,lum.x+lum.face*58,lum.y-112,14+Math.sin(T*30)*3,'190,230,255',.55);}
  if(lum.wet){const r_=PC==='cosmic'?22:30;ctx.fillStyle='rgba(134,189,226,.6)';ctx.beginPath();ctx.ellipse(lum.x,lum.y-6,r_,r_*.24,0,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(lum.x,lum.y-6,r_+Math.sin(T*5)*1.5,r_*.24,0,0,TAU);ctx.stroke();}
}
function drawPart(o){const q=o.life/o.max;
  switch(o.type){
    case 'drop':ctx.fillStyle='rgba(200,236,255,.9)';ctx.beginPath();ctx.ellipse(o.x,o.y-o.z,o.s*.8,o.s*1.2,0,0,TAU);ctx.fill();break;
    case 'bpetal':{ctx.save();ctx.globalAlpha=Math.min(1,(o.max-o.life)/2);ctx.translate(o.x,o.y-o.z);ctx.rotate(o.rot);ctx.scale(1,o.z>0?.35+.65*Math.abs(Math.sin(o.rot*1.6)):.6);ctx.fillStyle=o.col;ctx.beginPath();ctx.ellipse(0,0,o.s,o.s*(o.leaf?.28:.62),0,0,TAU);ctx.fill();ctx.restore();break;}
    case 'sdrip':{const a=Math.min(1,(o.max-o.life)/1.2);ctx.fillStyle=`rgba(170,236,200,${(.85*a).toFixed(3)})`;if(o.z>0){ctx.beginPath();ctx.ellipse(o.x,o.y-o.z,o.s*.7,o.s*1.3,0,0,TAU);ctx.fill();}else{ctx.beginPath();ctx.ellipse(o.x,o.y,o.s*2.4,o.s*.9,0,0,TAU);ctx.fill();}ctx.fillStyle=`rgba(255,255,255,${(.7*a).toFixed(3)})`;ctx.fillRect(o.x-.5,o.y-o.z-o.s*.6,1,1);break;}
    case 'dust':ctx.fillStyle=`rgba(232,226,190,${(.35*(1-q)).toFixed(3)})`;ctx.beginPath();ctx.arc(o.x,o.y-2,o.s,0,TAU);ctx.fill();break;
    case 'spray':{const k=.022,x2=o.x-o.vx*k,y2=o.y-o.z-(o.vy-o.vz)*k*.5;ctx.strokeStyle='rgba(176,224,255,.85)';ctx.lineWidth=o.s*1.5;ctx.beginPath();ctx.moveTo(o.x,o.y-o.z);ctx.lineTo(x2,y2);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.95)';ctx.beginPath();ctx.arc(o.x,o.y-o.z,o.s*.62,0,TAU);ctx.fill();
      ctx.fillStyle='rgba(40,70,40,.10)';ctx.beginPath();ctx.ellipse(o.x,o.y,o.s*1.3,o.s*.5,0,0,TAU);ctx.fill();break;}
    case 'mist':{const a=Math.sin(Math.PI*q)*.13;drawGlow(ctx,o.x,o.y-o.z,o.s*1.3,'225,244,255',a);break;}
  }
}
function render(){if(SCENE==='thgate'){drawThornGate();drawUI();return;}if(SCENE==='thorn'){drawThorn();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='dun'){drawDun();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='vhut'){drawVHut();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='well'){drawWellRoom();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='study'){drawStudy();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='shed'){drawShed();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='pond'){drawPondRoom();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='shop'){drawShop();drawUI();return;}if(SCENE==='woods'){drawWoods();if(CAPTURE.on)captureBackdrop();drawUI();return;}if(SCENE==='bed'){drawBedroom();drawUI();return;}
  const sx=(Math.random()-.5)*shake,sy=(Math.random()-.5)*shake;
  ctx.setTransform(DPR*zoom,0,0,DPR*zoom,DPR*(W/2-cam.x*zoom+sx),DPR*(H/2-cam.y*zoom+sy));
  const vw=W/zoom,vh=H/zoom,x0=cam.x-vw/2-20,y0=cam.y-vh/2-20,x1=cam.x+vw/2+20,y1=cam.y+vh/2+60;
  drawGround(x0,y0,x1,y1);
  if(ready(IMG.forest_bg))ctx.drawImage(IMG.forest_bg,BACK.x,BACK.y,BACK.w,BACK.h);
  drawMist();
  if(estCv&&x1>EST.x0&&x0<EST.x1&&y1>EST.y0&&y0<EST.y1)ctx.drawImage(estCv,EST.x0,EST.y0,EST.x1-EST.x0,EST.y1-EST.y0);
  drawDirt(y0-40,y1+40);
  drawRuneGlow();
  for(const q of PUDDLES){const k=q.t/3.5,a=(q.t<.2?q.t/.2:1)*(1-k)*.5;ctx.fillStyle=`rgba(70,120,110,${(a*.5).toFixed(3)})`;ctx.beginPath();ctx.ellipse(q.x,q.y,q.r,q.r*.45,0,0,TAU);ctx.fill();}
  drawTrails();
  drawPond();
  ctx.save();ctx.beginPath();ctx.rect(-5000,-5000,10000,10000);pondPathNB(ctx,-10);ctx.clip('evenodd');drawStream();ctx.restore();
  drawPondMouth();
  drawStrands(x0,x1,y0,y1);
  const list=[];ctx.lineCap='round';
  for(let cy=Math.floor(y0/CELL);cy<=Math.floor(y1/CELL)+1;cy++)for(let cx=Math.floor(x0/CELL);cx<=Math.floor(x1/CELL);cx++){const t=tuftAt(cx,cy);if(t)list.push([t.y,0,t]);}
  for(const t of CREEK_TUFTS)if(t.x>x0-40&&t.x<x1+40&&t.y>y0&&t.y<y1+40)list.push([t.y,0,t]);
  for(const t of POND_REEDS)if(t.y>y0&&t.y<y1+40)list.push([t.y,0,t]);
  for(let cy=Math.floor(y0/FCELL);cy<=Math.floor(y1/FCELL)+1;cy++)for(let cx=Math.floor(x0/FCELL);cx<=Math.floor(x1/FCELL);cx++){const fl=flowersAt(cx,cy);if(fl)for(const f of fl)list.push([f.y,3,f]);}
  for(let cy=Math.floor((y0-80)/BIG);cy<=Math.floor((y1+250)/BIG);cy++)for(let cx=Math.floor((x0-200)/BIG);cx<=Math.floor((x1+200)/BIG);cx++){const o=objAt(cx,cy);if(o)list.push([o.y,4,o]);}
  for(const o of ESTATE){if(o.t==='hslice'){if(y0<120&&y1>-640)list.push([o.y,5,o]);continue;}if(o.x>x0-300&&o.x<x1+300&&o.y>y0-40&&o.y<y1+(o.t==='birch'||o.t==='willow'?640:520))list.push([o.y,5,o]);}
  list.push([lum.y,1,null]);
  const AIR={ring:1,glint:1,smoke:1,wsp:1,msmoke:1,mstar:1,fiz:1,puff:1,fdust:1,gpetal:1};
  for(const p of PARTS)if(!AIR[p.type])list.push([p.y+.5,2,p]);
  if(!cos.hidden)list.push([cos.y,6,null]);
  for(const g of SLUGS)if(g.y>y0-40&&g.y<y1+60&&g.x>x0-80&&g.x<x1+80)list.push([g.y,7,g]);
  for(const g of GSLIMES)if(g.y>y0-40&&g.y<y1+90&&g.x>x0-80&&g.x<x1+80)list.push([g.y,8,g]);
  list.sort((a,b)=>a[0]-b[0]);OCC=0;
  for(const [,k,o] of list){if(k===0)drawTuft(o);else if(k===1)drawLum();else if(k===2)drawPart(o);else if(k===3)drawFlower(o);else if(k===5)drawEstateObj(o);else if(k===6)drawCosmic();else if(k===7)drawSlug(o);else if(k===8)drawWellSlime(o,.9);else drawObj(o);}
  if(CH===1)drawForage();
  for(const p of PARTS){const q=p.life/p.max;
    if(p.type==='ring'&&p.life>=0){const rr=(10+q*60)*p.s*2;ctx.strokeStyle=`rgba(235,248,255,${(.7*(1-q)).toFixed(3)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(p.x,p.y,rr,rr*.45,0,0,TAU);ctx.stroke();}
    else if(p.type==='glint'){const a=Math.sin(Math.PI*q);drawGlow(ctx,p.x,p.y-p.z,p.s*3,'255,255,255',a*.8);}
    else if(p.type==='smoke'){const a=Math.sin(Math.PI*Math.min(1,q*1.3))*.42*(1-q*.5);drawGlow(ctx,p.x,p.y,p.s*2.2,'238,236,244',a);}
    else if(p.type==='wsp'){const a=Math.sin(Math.PI*q);drawGlow(ctx,p.x,p.y,p.s*4.5,'175,215,255',a*.55);ctx.fillStyle=`rgba(255,255,255,${(a*.9).toFixed(3)})`;ctx.beginPath();ctx.arc(p.x,p.y,p.s*.55,0,TAU);ctx.fill();}
    else if(p.type==='msmoke'){const a=Math.sin(Math.PI*Math.min(1,q*1.4))*(1-q)*.5;drawGlow(ctx,p.x,p.y,p.s*2.4,q<.4?'190,215,255':'215,205,255',a);}
    else if(p.type==='mstar'){const a=Math.sin(Math.PI*q)*(.6+.4*Math.sin(T*9+p.x));ctx.fillStyle=`rgba(255,255,255,${a.toFixed(3)})`;ctx.beginPath();for(let k=0;k<8;k++){const ang=k/8*TAU,r_=k%2?p.s*.3:p.s;ctx.lineTo(p.x+Math.cos(ang)*r_,p.y+Math.sin(ang)*r_);}ctx.closePath();ctx.fill();drawGlow(ctx,p.x,p.y,p.s*3,'200,220,255',a*.5);}
    else if(p.type==='fiz'&&p.col)drawSparkPart(p,q);
    else if(p.type==='fiz'){const a=1-q;drawGlow(ctx,p.x,p.y-p.z,p.s*3,'170,220,255',a*.6);ctx.fillStyle=`rgba(230,248,255,${a.toFixed(3)})`;ctx.fillRect(p.x-.8,p.y-p.z-.8,1.6,1.6);}
    else if(p.type==='puff'){drawGlow(ctx,p.x,p.y-p.z,p.s,'200,200,210',.35*(1-q));}
    else if(p.type==='fdust'){const a=Math.sin(Math.PI*q)*.8;drawGlow(ctx,p.x,p.y-p.z,p.s*3,p.col,a*.5);}
    else if(p.type==='gpetal'){ctx.save();ctx.translate(p.x,p.y-p.z);ctx.rotate(p.rot);ctx.scale(1,.35+.65*Math.abs(Math.sin(p.rot*1.7)));ctx.fillStyle=p.col;ctx.globalAlpha=Math.min(1,(p.max-p.life)*2,p.life*3);ctx.beginPath();ctx.ellipse(0,0,p.s,p.s*.6,0,0,TAU);ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
  if(y0<140&&y1>-560){drawGlow(ctx,WELL.x,WELL.y-WELL_TOP,wellMagic>0?70:34,'160,205,255',wellMagic>0?.35:.14+.05*Math.sin(T*1.5));}
  drawWisps();drawFairies();drawBeams();drawBirds();
  for(const b of BUGS){const f=Math.abs(Math.sin(T*13+b.ph));ctx.save();ctx.translate(b.x,b.y-b.z);ctx.fillStyle=b.col;
    for(const s_ of [-1,1]){ctx.beginPath();ctx.ellipse(s_*3.6*f,-1,4.4*f+.6,3.4,s_*.4,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(s_*2.6*f,2.6,3*f+.4,2.2,s_*.6,0,TAU);ctx.fill();}
    ctx.fillStyle='#4a4034';ctx.fillRect(-.6,-3,1.2,6.5);ctx.restore();ctx.fillStyle='rgba(40,60,30,.12)';ctx.beginPath();ctx.ellipse(b.x,b.y,3.5,1.3,0,0,TAU);ctx.fill();}
  for(const m of MOTES){const tw=.55+.45*Math.sin(T*2.1+m.ph*3),z=m.z+Math.sin(T*.9+m.ph)*10;const col=m.hue<.6?'215,250,255':'255,246,200';
    drawGlow(ctx,m.x,m.y-z,16*tw+4,col,.28*tw);ctx.fillStyle=`rgba(255,255,255,${(.85*tw).toFixed(3)})`;ctx.beginPath();ctx.arc(m.x,m.y-z,1.5,0,TAU);ctx.fill();}
  if(lum.bubble>0){const a=Math.min(1,lum.bubble*4),bx=lum.x+lum.face*-4,by=lum.y-(PC==='cosmic'?150:182)-(1-Math.min(1,(1.1-lum.bubble)*6))*8;ctx.globalAlpha=a;
    ctx.fillStyle='#fffdf6';ctx.strokeStyle='rgba(60,80,50,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(bx,by,24,16,0,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(bx-4,by+14);ctx.lineTo(bx+2,by+24);ctx.lineTo(bx+6,by+13);ctx.fill();
    ctx.fillStyle='#5a6a5a';for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(bx+i*8,by+Math.sin(T*8+i)*1.5,2.6,0,TAU);ctx.fill();}ctx.globalAlpha=1;}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(grainCv){ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.22;for(let y=0;y<H;y+=256)for(let x=0;x<W;x+=256)ctx.drawImage(grainCv,x,y);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  const vg=ctx.createRadialGradient(W/2,H*.45,Math.min(W,H)*.32,W/2,H*.45,Math.max(W,H)*.78);vg.addColorStop(0,'rgba(60,90,50,0)');vg.addColorStop(1,'rgba(52,80,46,.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(NIGHT.on&&!CAPTURE.on){drawNightShade(lum.x,lum.y,.7);if(NIGHT.slash>0){ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle=`rgba(200,20,30,${(NIGHT.slash*.35).toFixed(3)})`;ctx.fillRect(0,0,W,H);ctx.restore();}drawRain(1/60);drawStorm();}
  if(CAPTURE.on)captureBackdrop();
  drawUI();
  if(NIGHT.end){const a=Math.min(1,NIGHT.end/2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(0,0,W,H);ctx.globalAlpha=Math.max(0,Math.min(1,(NIGHT.end-2)/1.5));ctx.textAlign='center';ctx.fillStyle='#e8e2f2';ctx.font='italic 20px Alegreya, Georgia, serif';ctx.fillText('The road beyond the garden…',W/2,H*.45);ctx.font='700 15px "Alegreya SC", Georgia, serif';ctx.fillStyle='rgba(232,226,242,.7)';ctx.fillText('to be continued',W/2,H*.45+34);ctx.restore();}
}

let BUBBLE_BASE=null;
function bubbleAt(wx,wy,text,name,alpha,small){if(typeof text!=='string')return;let sx=(wx-cam.x)*zoom+W/2,sy=(wy-cam.y)*zoom+H/2;if(SCENE!=='garden'&&SCENE!=='woods'&&SCENE!=='thorn'&&SCENE!=='thgate'){const by_=BUBBLE_BASE??lum.y,k_=roomH(by_)/151;[sx,sy]=wellToScreen(wx,by_-(by_-wy)*k_);}ctx.save();ctx.globalAlpha=alpha;
  ctx.font=(small?'500 13px':'500 15px')+' Alegreya, "Palatino Linotype", Georgia, serif';const maxW=small?160:Math.min(240,W-80);
  const words=text.split(' '),lines=[];let cur='';for(const w_ of words){const t=cur?cur+' '+w_:w_;if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w_;}else cur=t;}lines.push(cur);
  const nameLbl=name?(name==='Fokalur'?'Demon God, Fokalur':name).toUpperCase():'',bodyF=ctx.font;let nameW=0;if(name){ctx.font='700 11px "Alegreya SC", Georgia, serif';nameW=ctx.measureText(nameLbl).width;ctx.font=bodyF;}
  const lh=small?17:20,top=name?16:0,bw=Math.max(...lines.map(l=>ctx.measureText(l).width),nameW)+28,bh=lines.length*lh+18+top;
  const bx=clamp(sx-bw/2,14,W-14-bw),by=Math.max(14,sy-bh);
  ctx.fillStyle='rgba(60,50,30,.18)';rr(bx+2,by+4,bw,bh,14);ctx.fill();ctx.fillStyle='#fffaf0';rr(bx,by,bw,bh,14);ctx.fill();ctx.strokeStyle='rgba(120,96,60,.45)';ctx.lineWidth=1.5;ctx.stroke();
  const tx=clamp(sx,bx+20,bx+bw-20);ctx.beginPath();ctx.moveTo(tx-7,by+bh-1);ctx.lineTo(tx,by+bh+10);ctx.lineTo(tx+7,by+bh-1);ctx.fillStyle='#fffaf0';ctx.fill();
  ctx.textAlign='left';ctx.textBaseline='top';
  if(name){ctx.font='700 11px "Alegreya SC", Georgia, serif';ctx.fillStyle=name==='Cosmic'?'#3f63a8':name==='Fokalur'?'#a3263a':'#7a4f9a';ctx.fillText(nameLbl,bx+14,by+9);ctx.font=(small?'500 13px':'500 15px')+' Alegreya, "Palatino Linotype", Georgia, serif';}
  ctx.fillStyle='#4f4433';lines.forEach((l,i)=>ctx.fillText(l,bx+14,by+9+top+i*lh));ctx.restore();}
function drawSay(){
  if(lum.quipT>0&&!DLG.active){bubbleAt(lum.x,lum.y-150,lum.quip,null,Math.min(1,lum.quipT*3,(2.4-lum.quipT)*6),true);}
  if(DLG.active&&DLG.lines[DLG.i][0]==='???'){drawEerie(DLG.lines[DLG.i][1],DLG.t);return;}
  if(DLG.active){const [who,text]=DLG.lines[DLG.i];const pcName=PC==='cosmic'?'Cosmic':PC==='spar'?'Spar':'Lum';const clr_=SCENE==='thorn'&&typeof FKS!=='undefined'&&FKS.st>0&&!C1.fkDone;let sp=who==='Fokalur'?(clr_?{x:FKS.cx,y:FKS.cy}:lum):who==='Cosmic'&&clr_?{x:FKS.cx,y:FKS.cy}:who===pcName?lum:who==='Amroth'?AMR:who==='Jak'||who==='Spar'?jakPos():who==='Vane'&&SCENE==='vhut'?VHVANE:who==='Vane'&&VANE?VANE:who==='Voice'?{x:HUTDOOR.x,y:HUTDOOR.y}:(who==='Cosmic'?cos:{x:0,y:-30});if(who==='Lum'&&PC==='cosmic')sp=SCENE==='shop'?SHOPLUM:{x:0,y:-30};BUBBLE_BASE=sp.y;const h=who==='Fokalur'?505:who==='Jak'?190:who==='Spar'?136:who==='Amroth'?132:who==='Cosmic'?160:who==='Vane'?165:who==='Voice'?120:(PC!=='cosmic'&&who==='Lum'?160:182);const a=Math.min(1,DLG.t*6);if(SCENE==='thgate'&&THGATE.lx){bubbleAt(cam.x+(THGATE.lx-W/2)/zoom,cam.y+(THGATE.ly-H/2)/zoom,text,who,a,false);}else bubbleAt(sp.x,sp.y-h,text,who,a,false);BUBBLE_BASE=null;}
  else if(cos.bubble>0&&!cos.hidden){bubbleAt(cos.x,cos.y-150,cos.bubbleText,null,Math.min(1,cos.bubble*3,(2.4-cos.bubble)*6),true);}}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function drawUI(){drawUIinner();drawC1IntroUI();drawC1Title();drawC2UI();drawMix();drawChoice();drawSceneFade();drawWipe();}
let menuLast=performance.now();
function drawUIinner(){const _n=performance.now(),_dt=Math.min(.05,(_n-menuLast)/1000);menuLast=_n;drawIntroOverlay();drawSoundBtn();if(INTRO.on&&!INTRO.talking)return;if(!INTRO.on&&!WEV.end&&!C1RES.t){ctx.save();UI_FADE=INTRO.ui;drawUI_();drawBookBtn();drawToast();ctx.restore();UI_FADE=1;drawMenu(_dt);}if(INTRO.on&&INTRO.talking){drawSay();}}
let UI_FADE=1;
const STICKUI={a:1,idle:0,touch:(()=>{try{return matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;}catch(e){return false;}})()};
addEventListener('pointerdown',e=>{if(e.pointerType==='touch')STICKUI.touch=true;else if(e.pointerType==='mouse'&&!navigator.maxTouchPoints)STICKUI.touch=false;},{capture:true});
function drawUI_(){drawHints();
  {const n_=performance.now(),d_=Math.min(.1,(n_-(STICKUI.last||n_))/1000);STICKUI.last=n_;if(stick.id!==null){STICKUI.idle=0;STICKUI.a=Math.min(1,STICKUI.a+d_*8);}else{STICKUI.idle+=d_;if(STICKUI.idle>1.5)STICKUI.a=Math.max(0,STICKUI.a-d_/1.2);}}
  if(!STICKUI.touch||STICKUI.a<=0){}else{ctx.save();ctx.globalAlpha*=STICKUI.a;
  if(stick.id!==null){const dx=stick.x-stick.bx,dy=stick.y-stick.by,d=Math.hypot(dx,dy),m=Math.min(d,stick.R);const kx=stick.bx+(d?dx/d*m:0),ky=stick.by+(d?dy/d*m:0);
    ctx.fillStyle='rgba(255,255,255,.14)';ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(stick.bx,stick.by,stick.R,0,TAU);ctx.fill();ctx.stroke();
    const kg=ctx.createRadialGradient(kx-6,ky-6,2,kx,ky,24);kg.addColorStop(0,'rgba(255,255,255,.98)');kg.addColorStop(1,'rgba(225,240,215,.85)');ctx.fillStyle=kg;ctx.beginPath();ctx.arc(kx,ky,22,0,TAU);ctx.fill();}
  else{const gx=Math.max(18,W*.05)+stick.R,gy=BTN.a.y;ctx.strokeStyle='rgba(255,255,255,.45)';ctx.setLineDash([4,6]);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(gx,gy,stick.R,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.arc(gx,gy,20,0,TAU);ctx.fill();}
  ctx.restore();}
  drawNearDots();
  drawSay();
  if(battleFlash>0){ctx.fillStyle=`rgba(255,255,255,${(battleFlash*.6).toFixed(3)})`;ctx.fillRect(0,0,W,H);}
}
/* the little ... bubble over Cosmic when there's something to look at; tap anywhere to look */
function drawNearDots(){if(nearA<=0||DLG.active)return;let sx,sy;const hy=lum.y-(PC==='cosmic'?158:150*LUMK);
  if(SCENE==='thgate'&&THGATE.lx){sx=THGATE.lx;sy=THGATE.ly;}else if(SCENE==='garden'||SCENE==='woods'||SCENE==='thorn'){sx=(lum.x-cam.x)*zoom+W/2;sy=(hy-cam.y)*zoom+H/2;}else{const k_=roomH(lum.y)/151;[sx,sy]=wellToScreen(lum.x,lum.y-(lum.y-hy)*k_);sy+=WOFF.y;}
  const e=1-Math.pow(1-nearA,3),bx=sx>W-60?sx-46:sx+14,by=sy-6-(1-e)*8+Math.sin(T*3)*1.5;ctx.save();ctx.globalAlpha=e;
  ctx.fillStyle='rgba(60,50,30,.18)';ctx.beginPath();ctx.ellipse(bx+1,by+3,25,17,0,0,TAU);ctx.fill();
  ctx.fillStyle='#fffdf6';ctx.strokeStyle='rgba(60,50,40,.45)';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(bx,by,24,16,0,0,TAU);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx-8,by+13);ctx.lineTo(bx-13,by+24);ctx.lineTo(bx-1,by+14);ctx.fill();
  if(NEAR&&NEAR.foe)drawSwordEmote(ctx,bx,by);
  else if(isGrab(NEAR))drawGrabHand(ctx,bx,by);
  else if(NEAR&&NEAR.fire&&canLumMix())drawMortar(ctx,bx,by+1,.95);
  else if(isDoor(NEAR)){const dw=11,dh=19,dx=bx-dw/2,dyb=by+dh/2-1,ope=.5+.5*Math.sin(T*3);
    ctx.fillStyle='#2a2622';ctx.beginPath();ctx.moveTo(dx,dyb);ctx.lineTo(dx,dyb-dh+dw/2);ctx.arc(bx,dyb-dh+dw/2,dw/2,Math.PI,0);ctx.lineTo(dx+dw,dyb);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,253,246,.28)';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(bx-1.8,dyb-1);ctx.lineTo(bx-1.8,dyb-dh+4);ctx.moveTo(bx+1.8,dyb-1);ctx.lineTo(bx+1.8,dyb-dh+4);ctx.stroke();
    ctx.fillStyle=`rgba(240,200,110,${(.7+.3*ope).toFixed(3)})`;ctx.beginPath();ctx.arc(dx+dw-2.6,dyb-dh*.42,1.3,0,TAU);ctx.fill();
    ctx.fillStyle='#2a2622';ctx.fillRect(dx-2,dyb-.4,dw+4,1.6);}
  else{ctx.fillStyle='#2a2622';for(let i=-1;i<=1;i++){const j=Math.max(0,Math.sin(T*5-i*.9))*2.2;ctx.beginPath();ctx.arc(bx+i*8,by-j,2.8,0,TAU);ctx.fill();}}
  ctx.restore();}
function drawSwordEmote(c,x,y){const im=IMG.emote_sword;if(!ready(im))return;const h=23,b=Math.sin(T*6)*.9;c.drawImage(im,x-h/2,y-h/2-b,h,h);}
function isGrab(o){if(!o)return false;if(o.grab)return o.grab();if(o.forage)return CH>0&&!o.forage.picked;return !!o.bucket||(!!o.cloth&&!shroudTaken);}
function drawGrabHand(c,x,y){const im=IMG.emote_grab;if(ready(im)){const h=21,w=h*im.naturalWidth/im.naturalHeight,b=Math.sin(T*4)*.8;c.drawImage(im,x-w/2,y-h/2-b,w,h);return;}c.save();c.translate(x,y+1);c.fillStyle='#2a2622';c.lineJoin='round';
  // palm
  c.beginPath();c.moveTo(-7,1);c.quadraticCurveTo(-8,9,-2,10);c.lineTo(4,10);c.quadraticCurveTo(9,9,8,2);c.lineTo(8,-2);c.lineTo(-7,-2);c.closePath();c.fill();
  // four fingers curling down to grab
  for(let i=0;i<4;i++){const fx=-6+i*4.1,h=[6,8,8,6][i],g=Math.max(0,Math.sin(T*4))*1.5;c.beginPath();c.roundRect?c.roundRect(fx-1.7,-2-h+g,3.4,h+2,1.7):c.rect(fx-1.7,-2-h+g,3.4,h+2);c.fill();}
  // thumb
  c.beginPath();c.moveTo(-6,3);c.quadraticCurveTo(-12,1,-11,-4);c.quadraticCurveTo(-10,-6,-8,-4);c.quadraticCurveTo(-8,0,-5,0);c.closePath();c.fill();
  c.restore();}
function isDoor(o){if(!o||!o.onInteract)return false;if(o.dynDoor)return !!o.door;if(CH>0&&o._noDoorC1===undefined)o._noDoorC1=/wellInteract|pondInteract/.test(o.onInteract.toString());if(CH>0&&o._noDoorC1)return false;if(o._door===undefined){let src=o.onInteract.toString();if(/^\(\)=>[A-Za-z]+\(/.test(src)||/^[A-Za-z]+$/.test(src)){}o._door=o.door??/goScene|tryEnterShop|wellInteract|pondInteract|Leave the underwater/.test(src);}return o._door;}
function drawBtn(b,x,col,label){
  const s=1-.08*(b.down?1:0)+.06*b.pulse;ctx.save();ctx.translate(x,b.y);ctx.scale(s,s);ctx.globalAlpha=(b.down?.78:.5)*UI_FADE;
  ctx.fillStyle='rgba(30,50,25,.3)';ctx.beginPath();ctx.arc(0,4,b.r,0,TAU);ctx.fill();
  const g=ctx.createRadialGradient(-b.r*.35,-b.r*.4,b.r*.1,0,0,b.r);g.addColorStop(0,col[0]);g.addColorStop(.55,col[1]);g.addColorStop(1,col[2]);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,b.r,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(255,245,220,.65)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,b.r-3,0,TAU);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.ellipse(-b.r*.2,-b.r*.5,b.r*.55,b.r*.25,-.3,0,TAU);ctx.fill();
  ctx.globalAlpha=(b.down?1:.85)*UI_FADE;ctx.fillStyle='#fff';ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;ctx.font=`700 ${Math.round(b.r*.95)}px "Alegreya SC", Georgia, serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.strokeText(label,0,b.r*.06);ctx.fillText(label,0,b.r*.06);ctx.textBaseline='alphabetic';
  ctx.restore();
}

