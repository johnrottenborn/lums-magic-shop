/* ---------- tutorial hints, shown once Cosmic takes over ---------- */
const GOAL={tag:'NEW TASK',text:'Prove to Lum you can handle the slimes'};
const HINT={on:false,t:0,step:0,moved:0,looked:0,cast:0,goalT:0};let casts=0;
const TOUCHUI=()=>typeof STICKUI!=='undefined'?STICKUI.touch:true,tw=(t,d)=>TOUCHUI()?t:d;
const HINT_TEXT={get length(){return 3},get 0(){return tw('Drag on the left side of the screen to walk','Use WASD or the arrow keys to walk')},get 1(){return tw('When a bubble pops up over Cosmic, tap anywhere to take a look','When a bubble pops up over Cosmic, press E or click to take a look')},get 2(){return tw('When a sword pops up over Cosmic, tap anywhere to strike first','When a sword pops up over Cosmic, press E or click to strike first')}};
function updateHints(dt){HINT.goalT+=dt;if(!HINT.on)return;HINT.t+=dt;if(Math.hypot(lum.vx,lum.vy)>40)HINT.moved+=dt;
  if(HINT.step===0&&HINT.moved>1.2){HINT.step=1;HINT.t=0;}if(HINT.step===1&&HINT.looked){HINT.step=2;HINT.t=0;}if(HINT.step===2&&HINT.cast){HINT.step=3;HINT.t=0;}if(HINT.step>=3&&HINT.t>1)HINT.on=false;}
function drawHints(){if(!HINT.on&&HINT.goalT>7)return;if(MENU.a>.01)return;
  if(HINT.goalT<7){const a=Math.min(1,HINT.goalT*2,(7-HINT.goalT)*1.5);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';
    ctx.font='500 15px Alegreya, Georgia, serif';const bw=Math.min(W-24,Math.max(300,ctx.measureText(GOAL.text).width+40));ctx.fillStyle='rgba(30,38,30,.55)';rr(W/2-bw/2,58,bw,52,14);ctx.fill();ctx.fillStyle='#f2d58a';ctx.font='700 11px "Alegreya SC", Georgia, serif';ctx.fillText(GOAL.tag,W/2,77);
    ctx.fillStyle='#fdf8ec';ctx.font='500 15px Alegreya, Georgia, serif';ctx.fillText(GOAL.text,W/2,98);ctx.restore();}
  if(HINT.on&&HINT.step<3&&HINT.goalT>1.5&&!(TUT.stage===1)&&!WEVENT.on){const txt=HINT_TEXT[HINT.step],a=Math.min(1,HINT.t*2)*(.8+.2*Math.sin(T*3));ctx.save();ctx.globalAlpha=a;ctx.font='500 15px Alegreya, Georgia, serif';ctx.textAlign='center';
    const w=ctx.measureText(txt).width+32,y=H*.62;ctx.fillStyle='rgba(30,38,30,.5)';rr(W/2-w/2,y-18,w,34,17);ctx.fill();ctx.fillStyle='#fdf8ec';ctx.fillText(txt,W/2,y+5);ctx.restore();}}

/* ---------- slugs: slow, sulky, shimmering, and very fond of Lum's garden ---------- */
const satlas=new Image();satlas.src=SLUG_SRC;const SFW=170,SFH=110;
const SROW=[[0,12],[12,10],[22,8],[30,10],[40,10],[50,10],[60,8],[68,10]]; // N, NE, E, NW, S, NE, W, NW
function slugRow(dx,dy){const a=Math.atan2(dy,dx)*180/Math.PI;
  if(a>-22.5&&a<=67.5)return a<=22.5?2:2; if(a>67.5&&a<=112.5)return 4; if(a>112.5||a<=-157.5)return 6;
  if(a>-157.5&&a<=-112.5)return 3; if(a>-112.5&&a<=-67.5)return 0; return 1;}
const SLUGS=[];const TRAIL=[];
function slugSpot(){for(let k=0;k<30;k++){const x=rnd(-520,620),y=rnd(140,1360);if(inStream(x,y,-30)||inPond(x,y,-40))continue;const [sx,sy]=solveEstate(x,y);if(Math.hypot(sx-x,sy-y)<1)return [x,y];}return [0,600];}
function slugNear(g){for(let k=0;k<30;k++){const a=rnd(0,TAU),r=rnd(60,180),x=g.x+Math.cos(a)*r,y=g.y+Math.sin(a)*r*.7;if(inStream(x,y,-30)||inPond(x,y,-40))continue;const [sx,sy]=solveEstate(x,y);if(Math.hypot(sx-x,sy-y)<1)return [x,y];}return [g.x,g.y];}
function spawnSlugs(){SLUGS.length=0;for(const [x0,y0,s_] of [[-330,560,.82],[400,520,.74],[-150,760,.78],[300,960,.86],[80,1180,.8]]){let x=x0,y=y0;{const [sx,sy]=solveEstate(x,y);if(Math.hypot(sx-x,sy-y)>.5||inStream(x,y,-30)||inPond(x,y,-40))[x,y]=slugSpot();}const tx=x+rnd(-60,60),ty=y+rnd(-30,30);SLUGS.push({kind:'slug',scene:'garden',x,y,tx,ty,s:s_,row:2,ft:Math.random()*10,state:'crawl',t:0,sp:rnd(10,15),trailT:0,ph:rnd(0,TAU),shy:0,flee:0});}}
/* slugs steer like slugs: a slow turning heading, and they only swap facing once a turn has really settled */
function slugSteer(g,tx,ty,sp,dt){const want=Math.atan2(ty-g.y,tx-g.x);if(g.hd===undefined)g.hd=want;let d=want-g.hd;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;
  g.hd+=clamp(d,-.9*dt,.9*dt);const go=Math.abs(d)<1.2?1:.25;     // nearly stop to turn around
  const v=sp*go*(.6+.4*Math.max(0,Math.sin(g.ft*1.1)));             // lurch... and lurch
  const nx=g.x+Math.cos(g.hd)*v*dt,ny=g.y+Math.sin(g.hd)*v*dt;const [sx,sy]=solveEstate(nx,ny);
  const ok=Math.hypot(sx-nx,sy-ny)<=.5&&!inStream(nx,ny,-24)&&!inPond(nx,ny,-30);if(ok){g.x=nx;g.y=ny;}
  const cand=slugRow(Math.cos(g.hd),Math.sin(g.hd));if(cand!==g.row){if(g.rowC===cand)g.rowT+=dt;else{g.rowC=cand;g.rowT=0;}if(g.rowT>.5)g.row=cand;}else g.rowT=0;
  g.ft+=dt*4.5*(.4+go*.6);g.trailT-=dt;if(g.trailT<=0){g.trailT=.6;TRAIL.push({x:g.x,y:g.y,t:0,a:g.hd});if(TRAIL.length>500)TRAIL.shift();}
  return ok;}
function updateSlugs(dt){for(const g of SLUGS){g.t+=dt;g.shy=Math.max(0,g.shy-dt);g.flee=Math.max(0,g.flee-dt);
  const dl=Math.hypot(lum.x-g.x,lum.y-g.y);
  if(BATTLE.pending||BATTLE.on)continue;g.calm=Math.max(0,(g.calm||0)-dt);g.alert=Math.max(0,(g.alert||0)-dt);
  const awake=(!NIGHT.on||g.kind==='slugking')&&PLAYER()&&!INTRO.on&&!DLG.active&&!MENU.open&&!WEVENT.on&&SCENE==='garden';
  if(awake&&!g.chase&&!g.calm&&!g.shy&&dl<160){g.chase=true;g.alert=.9;g.state='crawl';sfxSlimeHop(.5);}
  if(g.chase&&(dl>280||g.calm||!awake))g.chase=false;
  if(g.rise!==undefined&&g.rise<1)continue;
  if(g.chase){if(dl<(g.kind==='slugking'?62:36)&&lum.bumpT<=0){startEncounter(g,'ambush');continue;}
    slugSteer(g,lum.x,lum.y,g.sp*1.6,dt);continue;}
  if(g.state==='nibble'){if(g.t>g.dur&&!g.shy){g.state='crawl';[g.tx,g.ty]=slugNear(g);g.t=0;}continue;}
  if(g.shy)continue;
  const dx=g.tx-g.x,dy=g.ty-g.y,d=Math.hypot(dx,dy);if(d<12){g.state='nibble';g.t=0;g.dur=rnd(4,9);continue;}
  if(!slugSteer(g,g.tx,g.ty,g.sp*(g.flee?1.8:1),dt)){g.stuck=(g.stuck||0)+dt;if(g.stuck>1.5){g.stuck=0;[g.tx,g.ty]=slugNear(g);}}else g.stuck=0;}
  for(let i=TRAIL.length-1;i>=0;i--){TRAIL[i].t+=dt;if(TRAIL[i].t>40)TRAIL.splice(i,1);}}
function drawTrails(){for(const p of TRAIL){const a=Math.max(0,1-p.t/40)*.28;ctx.fillStyle=`rgba(150,230,200,${a.toFixed(3)})`;ctx.beginPath();ctx.ellipse(p.x,p.y,7,3.4,p.a,0,TAU);ctx.fill();
  if(((p.x*7+p.y*3)|0)%5===0){ctx.fillStyle=`rgba(240,255,250,${(a*2).toFixed(3)})`;ctx.beginPath();ctx.arc(p.x-1,p.y-1,1.1,0,TAU);ctx.fill();}}}
function drawSlug(g){if(g.kind==='slugking'){drawKing(g);return;}if(!ready(satlas)||(CAPTURE.on&&g===BATTLE.capG))return;const W_=g.row===6,[o,n]=SROW[W_?2:g.row];let fi=Math.floor(g.ft)%n;if(g.state==='nibble'||g.shy)fi=0;
  const w=SFW*g.s,h=SFH*g.s,squash=g.state==='nibble'?1+.05*Math.sin(g.t*5+g.ph):g.shy?.88:1;
  ctx.fillStyle='rgba(30,50,40,.22)';ctx.beginPath();ctx.ellipse(g.x,g.y+1,w*.34,h*.1,0,0,TAU);ctx.fill();
  drawGlow(ctx,g.x,g.y-h*.3,w*.42,'190,240,255',.18+.06*Math.sin(T*1.3+g.ph));
  ctx.save();ctx.translate(g.x,g.y+2);ctx.scale((2-squash)*(W_?-1:1),squash);ctx.filter='brightness(1.25) saturate(1.15)';ctx.drawImage(satlas,(o+fi)*SFW,0,SFW,SFH,-w/2,-h*(106/110),w,h);ctx.filter='none';ctx.restore();
  if(Math.sin(T*1.7+g.ph)>.92)drawGlow(ctx,g.x+Math.sin(g.ph)*w*.2,g.y-h*.5,8,'200,255,240',.5);
  if(g.alert>0){const a=Math.min(1,g.alert*4);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='700 30px "Alegreya SC", Georgia, serif';ctx.lineWidth=4;ctx.strokeStyle='#3a2a1a';ctx.fillStyle='#ffe27a';const yy=g.y-h*.95-(1-a)*8;ctx.strokeText('!',g.x,yy);ctx.fillText('!',g.x,yy);ctx.restore();}}

