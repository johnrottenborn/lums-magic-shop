/* ---------- the storm: little bats on the wind and lightning over the trees ---------- */
const BATS=[];const STORM={t:6,flash:0,ft:0,bolt:null,boltT:0,lastDraw:0};
function spawnBat(b,edge){const vw=W/zoom,vh=H/zoom,side=edge?(Math.random()<.5?-1:1):0;b.x=edge?cam.x+side*(vw/2+60):cam.x+rnd(-vw/2,vw/2);b.y=cam.y-vh/2+rnd(40,vh*.55);
  b.vx=(edge?-side:(Math.random()<.5?-1:1))*rnd(70,130);b.vy=rnd(-20,20);b.ph=rnd(0,TAU);b.fr=rnd(9,13);b.s=rnd(.75,1.15);b.turn=rnd(1,3);b.bob=rnd(0,TAU);return b;}
function updateStorm(dt){const out=SCENE==='woods'||(SCENE==='garden'&&NIGHT.rain);if(!out||!NIGHT.on)return;
  while(BATS.length<8)BATS.push(spawnBat({},false));const vw=W/zoom,vh=H/zoom;
  for(const b of BATS){b.ph+=dt*b.fr;b.bob+=dt*2.3;b.turn-=dt;if(b.turn<0){b.turn=rnd(.6,2.4);b.vy=rnd(-45,45);if(Math.random()<.25)b.vx*=-1;b.fr=rnd(9,14);}
    b.x+=b.vx*dt+Math.sin(b.bob*1.7)*20*dt;b.y+=b.vy*dt+Math.sin(b.bob)*30*dt;
    const top=cam.y-vh/2+20,bot=cam.y+vh*.1;if(b.y<top)b.vy=Math.abs(b.vy)+10;if(b.y>bot)b.vy=-Math.abs(b.vy)-10;
    if(Math.abs(b.x-cam.x)>vw/2+140)spawnBat(b,true);}
  STORM.t-=dt;STORM.flash=Math.max(0,STORM.flash-dt*3.2);STORM.boltT=Math.max(0,STORM.boltT-dt);
  if(STORM.ft>0){STORM.ft-=dt;if(STORM.ft<=0)STORM.flash=Math.max(STORM.flash,.85);}
  if(STORM.t<=0){STORM.t=rnd(8,17);STORM.flash=1;STORM.ft=rnd(.12,.22);STORM.boltT=.45;STORM.bolt=makeBolt();const d=rnd(.25,1.2);setTimeout(()=>sfxThunder(1.3-d*.4),d*1000);}}
function makeBolt(){const segs=[],x0=W*rnd(.15,.85),y1=H*rnd(.26,.4);const grow=(x,y,ang,len,w,depth)=>{const pts=[[x,y]];let cx=x,cy=y;const n=Math.round(len/14);
    for(let i=0;i<n;i++){ang+=rnd(-.5,.5);ang=clamp(ang,Math.PI*.25,Math.PI*.75);cx+=Math.cos(ang)*14;cy+=Math.sin(ang)*14;pts.push([cx,cy]);if(depth<2&&Math.random()<.09)grow(cx,cy,ang+(Math.random()<.5?-.7:.7),len*rnd(.25,.45),w*.5,depth+1);if(cy>y1+(depth?-40:0))break;}
    segs.push({pts,w});};grow(x0,-10,Math.PI/2+rnd(-.3,.3),y1+60,3.2,0);return segs;}
function sfxThunder(v=1){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.18,'highpass',1800,.7,.35*v,SND.sfx,600);noiseHit(t+.04,.9,'bandpass',420,.8,.4*v,SND.sfx,120);noiseHit(t+.1,3.2,'lowpass',260,.9,.55*v,SND.sfx,50);noiseHit(t+.9,2.4,'lowpass',160,1,.35*v,SND.sfx,40);}
function drawBat(x,y,s,ph){const f=Math.sin(ph),c=ctx;c.save();c.translate(x,y);c.scale(s,s);
  // wings: an upper arm, three long fingers and a scalloped membrane between them
  for(const sd of [-1,1]){c.save();c.scale(sd,1);const up=-f*13,mid=-f*6;
    const sh=[3,-1],el=[11,-4+mid*.6],tips=[[24,-9+up],[27,-1+up*.8],[22,6+up*.45],[13,8+mid*.3]];
    c.fillStyle='#17101e';c.beginPath();c.moveTo(sh[0],sh[1]);c.lineTo(el[0],el[1]);c.lineTo(tips[0][0],tips[0][1]);
    let prev=tips[0];for(let i=1;i<tips.length;i++){const t_=tips[i],mx=(prev[0]+t_[0])/2,my=(prev[1]+t_[1])/2;c.quadraticCurveTo(mx-2.5,my-1.5,t_[0],t_[1]);prev=t_;}
    c.quadraticCurveTo(7,6+mid*.2,2,5);c.closePath();c.fill();
    c.strokeStyle='rgba(150,130,200,.45)';c.lineWidth=.6;c.beginPath();c.moveTo(sh[0],sh[1]);c.lineTo(el[0],el[1]);for(const t_ of tips.slice(0,3)){c.moveTo(el[0],el[1]);c.lineTo(t_[0],t_[1]);}c.stroke();
    c.fillStyle='#2a2033';c.beginPath();c.arc(el[0],el[1],.9,0,TAU);c.fill();c.restore();}
  // body, head, pointed ears, feet tucked behind
  c.fillStyle='#1d1424';c.beginPath();c.ellipse(0,1.5,3.4,5.2,0,0,TAU);c.fill();c.fillStyle='#3a2c3e';c.beginPath();c.ellipse(0,0,2,3.2,0,0,TAU);c.fill();
  c.fillStyle='#1d1424';c.beginPath();c.arc(0,-4.4,2.6,0,TAU);c.fill();c.beginPath();c.moveTo(-2.4,-5);c.lineTo(-2.1,-9.2);c.lineTo(-.6,-6.4);c.moveTo(2.4,-5);c.lineTo(2.1,-9.2);c.lineTo(.6,-6.4);c.fill();
  c.strokeStyle='#1d1424';c.lineWidth=.8;c.beginPath();c.moveTo(-1,6);c.lineTo(-1.6,8.4);c.moveTo(1,6);c.lineTo(1.6,8.4);c.stroke();
  c.fillStyle='rgba(255,90,90,.9)';c.beginPath();c.arc(-1,-4.6,.45,0,TAU);c.arc(1,-4.6,.45,0,TAU);c.fill();
  c.restore();}
function drawStorm(){const out=SCENE==='woods'||(SCENE==='garden'&&NIGHT.rain);if(!out||!NIGHT.on||CAPTURE.on)return;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  const fl=STORM.flash;
  // bats: dark silhouettes, picked out sharply whenever lightning flares
  for(const b of BATS){const sx=(b.x-cam.x)*zoom+W/2,sy=(b.y-cam.y)*zoom+H/2;if(sx<-40||sx>W+40||sy<-40||sy>H+40)continue;
    if(fl>0){ctx.save();ctx.globalCompositeOperation='lighter';if(SCENE==='woods')drawGlow(ctx,sx,sy,8*zoom*b.s,'190,200,255',.25*fl);ctx.restore();}if(SCENE==='woods')drawBat(sx,sy,zoom*.5*b.s,b.ph);}
  if(fl>0){ctx.fillStyle=`rgba(205,215,255,${(fl*.42).toFixed(3)})`;ctx.fillRect(0,0,W,H);}
  if(STORM.boltT>0&&STORM.bolt){const a=Math.min(1,STORM.boltT/.3);ctx.lineCap='round';ctx.lineJoin='round';
    for(const pass of [[12,'rgba(170,180,255,',.25],[5,'rgba(220,225,255,',.6],[1.6,'rgba(255,255,255,',1]])for(const sgm of STORM.bolt){ctx.strokeStyle=pass[1]+(a*pass[2]).toFixed(3)+')';ctx.lineWidth=pass[0]*sgm.w/3.2;ctx.beginPath();sgm.pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}}
  ctx.restore();}

/* ---------- prologue results ---------- */
const STATS={time:0,steps:0,atk:0,nice:0,foeAtk:0,guards:0,dmg:0,kills:0,items:0,flees:0,kos:0,found:{}};
const HIDDEN=[['bucket','Wooden Bucket'],['shedkey','Garden Shed Key'],['gboots','Garden Boots'],['shroud',"Undine's Shroud"],['slimering','Slime Ring']];
function prologueScore(){const S_=STATS,fnd=HIDDEN.filter(([k])=>S_.found[k]).length,places=[wellVisited,studyVisited,shedVisited,pondVisited].filter(Boolean).length;
  const strike=S_.atk?S_.nice/S_.atk:0,guard=S_.foeAtk?S_.guards/S_.foeAtk:1,mins=S_.time/60;
  let pts=fnd/HIDDEN.length+Math.min(1,strike/.8)+Math.min(1,guard/.6)+(S_.kos===0?1:S_.kos===1?.5:0)+(mins<=20?1:mins>=50?0:1-(mins-20)/30);
  const stars=Math.round(clamp(pts,0,5)*2)/2;
  const rank=stars>=5?'Legendary Apprentice':stars>=4?'Brilliant Apprentice':stars>=3?'Promising Apprentice':stars>=2?'Curious Apprentice':'Sleepy Apprentice';
  return {stars,rank,fnd,places,strike,guard};}
function fmtTime(t){t=Math.floor(t);const h=Math.floor(t/3600),m=Math.floor(t/60)%60,s=t%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(s).padStart(2,'0');}
function drawStar(x,y,r,fill){ctx.save();ctx.translate(x,y);ctx.beginPath();for(let k=0;k<10;k++){const a=k/10*TAU-Math.PI/2,rr_=k%2?r*.45:r;ctx.lineTo(Math.cos(a)*rr_,Math.sin(a)*rr_);}ctx.closePath();
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();if(fill>0){ctx.save();ctx.clip();ctx.fillStyle='#f5c542';ctx.fillRect(-r,-r,2*r*fill,2*r);ctx.restore();ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,0,0,r*1.6,'255,200,90',.25*fill);ctx.restore();}
  ctx.strokeStyle=fill>0?'#ffe7a0':'rgba(232,226,242,.45)';ctx.lineWidth=1.6;ctx.stroke();ctx.restore();}
function drawResults(t){if(!RESULTS.r){RESULTS.r=prologueScore();RESULTS.badges=earnedBadges(RESULTS.r);RESULTS.keep=keepsakeFor(RESULTS.r.stars);recordPrologue(RESULTS.r.stars,RESULTS.badges,RESULTS.keep);finishChapter('prologue');RESULTS.fired=[];RESULTS.sp=[];}
  const R=RESULTS.r,S_=STATS,a=Math.min(1,t/1.2),dt=1/60;RESULTS.hits=[];ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.textBaseline='alphabetic';
  const pw=Math.min(W-32,390),px=W/2-pw/2;let y=Math.max(46,H*.06);
  ctx.fillStyle='rgba(232,226,242,.6)';ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillText('End of Prologue',W/2,y);y+=30;
  ctx.fillStyle='#efe6ff';ctx.font='700 25px "Alegreya SC", Georgia, serif';ctx.fillText('Prologue Complete',W/2,y);y+=40;
  // stars: each one chimes and bursts into sparkles as it fills
  const sy=y;for(let i=0;i<5;i++){const u=clamp((t-1-i*.32)/.35,0,1),f=clamp(R.stars-i,0,1)*u,sc=1+.35*Math.sin(Math.PI*u)*(f>0?1:0),sx=W/2+(i-2)*46;
    if(u>.35&&!RESULTS.fired[i]){RESULTS.fired[i]=1;if(R.stars-i>0){starChime(i);for(let k=0;k<16;k++){const an=rnd(0,TAU),sp=rnd(60,190);RESULTS.sp.push({x:sx,y:sy,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp-40,t:0,max:rnd(.5,1),gold:R.stars>=5});}}}
    drawStar(sx,sy,17*sc,f);}
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=RESULTS.sp.length-1;i>=0;i--){const p=RESULTS.sp[i];p.t+=dt;p.vy+=220*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t>p.max){RESULTS.sp.splice(i,1);continue;}drawGlow(ctx,p.x,p.y,5+4*(1-p.t/p.max),p.gold?'255,215,110':'255,240,200',.9*(1-p.t/p.max));}ctx.restore();
  // a perfect run earns the wax seal
  if(R.stars>=5&&t>2.9){const u=clamp((t-2.9)/.35,0,1),sc=1+1.6*(1-u)*(1-u),cx=W/2+pw/2-34,cy=sy-46;if(u>.9&&!RESULTS.sealT){RESULTS.sealT=1;sealThud();}
    ctx.save();ctx.translate(cx,cy);ctx.rotate(-.18);ctx.scale(sc,sc);ctx.globalAlpha*=u;ctx.fillStyle='#8e1f2a';ctx.beginPath();for(let k=0;k<18;k++){const an=k/18*TAU,rr_=30+(k%2?2.5:0)+Math.sin(k*2.3)*1.2;ctx.lineTo(Math.cos(an)*rr_,Math.sin(an)*rr_);}ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,190,190,.45)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,22,0,TAU);ctx.stroke();ctx.fillStyle='#ffe2d8';ctx.font='700 7.5px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText('LEGENDARY',0,-2);ctx.fillText('APPRENTICE',0,9);ctx.restore();}
  y+=38;ctx.fillStyle=`rgba(255,226,140,${clamp((t-2.7)/.6,0,1)})`;ctx.font='italic 600 18px Alegreya, Georgia, serif';ctx.fillText(R.rank,W/2,y);y+=18;
  // stats
  const rows=[['Time to complete',fmtTime(S_.time)],['Steps taken',S_.steps.toLocaleString()],['Hidden treasures',`${R.fnd} / ${HIDDEN.length}`],['Secret places found',`${R.places} / 4`],
    ['Timed strikes landed',S_.atk?Math.round(R.strike*100)+'%':'—'],['Enemy attacks guarded',S_.foeAtk?Math.round(R.guard*100)+'%':'—'],['Enemies defeated',String(S_.kills)],['Items used',String(S_.items)],
    ['Damage taken',String(S_.dmg)],['Times knocked out',String(S_.kos)],['Battles fled',String(S_.flees)]];
  const lh=clamp((H-y-275)/rows.length,17,27),fs=Math.round(clamp(lh*.56,12,15));ctx.fillStyle='rgba(20,14,34,.55)';rr(px,y,pw,rows.length*lh+12,14);ctx.fill();ctx.strokeStyle='rgba(196,154,78,.45)';ctx.lineWidth=1.2;ctx.stroke();y+=6;
  rows.forEach(([k,v],i)=>{const ra=clamp((t-1.6-i*.07)/.3,0,1);ctx.globalAlpha=a*ra;const yy=y+i*lh+lh*.68;ctx.font=`500 ${fs}px Alegreya, Georgia, serif`;ctx.textAlign='left';ctx.fillStyle='rgba(232,226,242,.82)';ctx.fillText(k,px+16,yy);
    ctx.textAlign='right';ctx.font=`700 ${fs}px "Alegreya SC", Georgia, serif`;ctx.fillStyle=(k==='Hidden treasures'&&R.fnd===HIDDEN.length)||(k==='Secret places found'&&R.places===4)?'#ffe27a':'#fdf6e4';ctx.fillText(v,px+pw-16,yy);});
  y+=rows.length*lh+18;ctx.globalAlpha=a;
  // badges
  const bA=clamp((t-3.3)/.5,0,1),bw_=pw/RESULTS.badges.length;RESULTS.badges.forEach((b,i)=>{const cx=px+bw_*(i+.5),cy=y+22,pop=clamp((t-3.3-i*.15)/.3,0,1);ctx.save();ctx.globalAlpha=a*bA*(b.got?1:.38);ctx.translate(cx,cy);const s_=(pop<1?1+.3*Math.sin(Math.PI*pop):1)*.88;ctx.scale(s_,s_);drawBadge(b.id,b.got);ctx.restore();
    ctx.save();ctx.globalAlpha=a*bA*(b.got?1:.45);ctx.textAlign='center';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.fillStyle=b.got?'#ffe7a8':'#c8c0d4';const nw=b.name.split(' ');ctx.fillText(nw[0],cx,cy+33);if(nw[1])ctx.fillText(nw[1],cx,cy+45);ctx.restore();});
  y+=84;
  // keepsake
  ctx.globalAlpha=a*clamp((t-3.8)/.5,0,1);ctx.textAlign='center';ctx.font='italic 13px Alegreya, Georgia, serif';ctx.fillStyle='rgba(232,226,242,.7)';ctx.fillText('Keepsake for Chapter 1',W/2,y);y+=19;
  if(RESULTS.keep){ctx.font='700 15px "Alegreya SC", Georgia, serif';ctx.fillStyle='#ffe2a0';ctx.fillText(RESULTS.keep.name,W/2,y);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,W/2-ctx.measureText(RESULTS.keep.name).width/2-12,y-5,8,'255,220,150',.8);ctx.restore();}
  else{const bk=bestKeepsake();ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillStyle='rgba(232,226,242,.6)';ctx.fillText(bk?`You still carry ${bk.name}`:'Earn 3 stars or more to receive one',W/2,y);}y+=20;
  // buttons
  if(t>3.6){const ba=Math.min(1,(t-3.6)*2),bh=44,gap=12,bw2=(pw-gap)/2,by=Math.min(H-bh-14,y+6);ctx.globalAlpha=ba;
    [['Share Results',true,shareResults],['Back to Title',false,backToTitle]].forEach(([lab,pri,fn],k)=>{const x=px+k*(bw2+gap);const g=ctx.createLinearGradient(0,by,0,by+bh);if(pri){g.addColorStop(0,'#f0c060');g.addColorStop(1,'#c88a2a');}else{g.addColorStop(0,'rgba(232,226,242,.18)');g.addColorStop(1,'rgba(232,226,242,.08)');}
      ctx.fillStyle=g;rr(x,by,bw2,bh,22);ctx.fill();ctx.strokeStyle=pri?'#fff2c8':'rgba(232,226,242,.5)';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=pri?'#3a2410':'#efe6ff';ctx.font='700 15px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(lab,x+bw2/2,by+bh/2+5);RESULTS.hits.push({x,y:by,w:bw2,h:bh,act:fn});});
    if(RESULTS.msgT>0){RESULTS.msgT-=dt;ctx.globalAlpha=Math.min(1,RESULTS.msgT*2);ctx.font='italic 13px Alegreya, Georgia, serif';ctx.fillStyle='#efe6ff';ctx.fillText(RESULTS.msg,W/2,by-8);}}
  ctx.restore();}
const RESULTS={r:null,hits:[],msg:'',msgT:0};
function earnedBadges(R){const S_=STATS;return [{id:'treasure',name:'Treasure Hunter',got:R.fnd>=HIDDEN.length},{id:'shield',name:'Untouchable',got:S_.kos===0},{id:'hourglass',name:'Quick Study',got:S_.time<=1200},{id:'target',name:'Perfect Timing',got:S_.atk>=3&&S_.nice/S_.atk>=.9},{id:'crown',name:'Royal Slayer',got:!!S_.kingSlain}];}
function keepsakeFor(st){return st>=5?{id:'mooncharm',name:"Lum's Moon Charm",tier:3}:st>=4?{id:'moonmint',name:'Silver Moonmint Sprig',tier:2}:st>=3?{id:'duskflower',name:'Pressed Duskberry Blossom',tier:1}:null;}
/* Chapter 1 opens with the best keepsake ever earned in the Prologue already in the Charm slot */
function bestKeepsake(){const p=readProg();return (p.prologue&&p.prologue.keepsake)||null;}
function equipStartingKeepsake(){const k=bestKeepsake();if(k)PARTY[HERO].charm=k.id;}
function starChime(i){if(!SND.ready)return;const t=SND.ctx.currentTime;const n=[76,79,83,86,88][i];bell(t,NOTE(n),.09,1.6,SND.sfx,(i-2)*.25);bell(t+.03,NOTE(n+12),.04,1.2,SND.sfx,(i-2)*.25);}
function sealThud(){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.15,'lowpass',400,1,.4,SND.sfx,120);[74,78,81,86].forEach((n,k)=>bell(t+.08+k*.07,NOTE(n),.08,1.8,SND.sfx,0));}
function drawBadge(id,got){const c=ctx;c.save();const g=c.createRadialGradient(-6,-8,2,0,0,24);g.addColorStop(0,got?'#fff3cc':'#a8a0b4');g.addColorStop(1,got?'#c9953e':'#5e5868');c.fillStyle=g;c.beginPath();c.arc(0,0,22,0,TAU);c.fill();c.strokeStyle=got?'#ffe7a0':'#8a8298';c.lineWidth=2;c.stroke();
  c.strokeStyle='#3a2410';c.fillStyle='#3a2410';c.lineWidth=2;c.lineJoin='round';c.lineCap='round';
  if(id==='treasure'){c.fillStyle=got?'#8a5a2a':'#4a4450';c.beginPath();c.rect(-11,-3,22,13);c.fill();c.stroke();c.beginPath();c.moveTo(-11,-3);c.quadraticCurveTo(0,-15,11,-3);c.closePath();c.fill();c.stroke();c.fillStyle=got?'#ffd56a':'#aaa';c.fillRect(-2.5,-1,5,6);}
  else if(id==='shield'){c.fillStyle=got?'#4a6fb0':'#4a4450';c.beginPath();c.moveTo(0,-13);c.quadraticCurveTo(8,-10,11,-11);c.quadraticCurveTo(11,5,0,13);c.quadraticCurveTo(-11,5,-11,-11);c.quadraticCurveTo(-8,-10,0,-13);c.fill();c.stroke();c.fillStyle=got?'#ffd56a':'#aaa';c.beginPath();c.arc(0,-1,3.5,0,TAU);c.fill();}
  else if(id==='hourglass'){c.beginPath();c.moveTo(-8,-12);c.lineTo(8,-12);c.lineTo(1.5,0);c.lineTo(8,12);c.lineTo(-8,12);c.lineTo(-1.5,0);c.closePath();c.fillStyle=got?'rgba(255,240,210,.9)':'#777';c.fill();c.stroke();c.fillStyle=got?'#e0a83a':'#999';c.beginPath();c.moveTo(-5,10);c.lineTo(5,10);c.lineTo(0,4);c.closePath();c.fill();}
  else if(id==='crown'){c.fillStyle=got?'#f2c440':'#888';c.beginPath();c.moveTo(-12,7);c.lineTo(-12,-6);c.lineTo(-6,0);c.lineTo(0,-10);c.lineTo(6,0);c.lineTo(12,-6);c.lineTo(12,7);c.closePath();c.fill();c.stroke();c.fillStyle=got?'#5cc08a':'#666';c.beginPath();c.arc(0,2,2.6,0,TAU);c.fill();}
  else{c.beginPath();c.arc(0,0,11,0,TAU);c.stroke();c.beginPath();c.arc(0,0,5.5,0,TAU);c.stroke();c.fillStyle=got?'#c8323e':'#666';c.beginPath();c.arc(0,0,2.6,0,TAU);c.fill();}
  c.restore();}
function resultsTap(x,y){for(const h of RESULTS.hits||[])if(x>h.x&&x<h.x+h.w&&y>h.y&&y<h.y+h.h){h.act();return true;}return false;}
function makeResultCard(){const cw=1080,ch=1350,c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d'),R=RESULTS.r,S_=STATS;const sv=ctx;
  const g=x.createLinearGradient(0,0,0,ch);g.addColorStop(0,'#1d1830');g.addColorStop(1,'#0d0b18');x.fillStyle=g;x.fillRect(0,0,cw,ch);
  // painted banner of the shop
  x.save();x.beginPath();x.roundRect?x.roundRect(60,60,cw-120,470,36):x.rect(60,60,cw-120,470);x.clip();const bg=IMG.forest_bg,co=IMG.cottage;if(ready(bg)){const s=Math.max((cw-120)/bg.naturalWidth,470/bg.naturalHeight);x.drawImage(bg,60+((cw-120)-bg.naturalWidth*s)/2,60+(470-bg.naturalHeight*s)*.35,bg.naturalWidth*s,bg.naturalHeight*s);}
  if(ready(co)){const h=440,w=h*co.naturalWidth/co.naturalHeight;x.drawImage(co,cw*.6-w/2,60+470-h+20,w,h);}const gg=x.createLinearGradient(0,300,0,530);gg.addColorStop(0,'rgba(13,11,24,0)');gg.addColorStop(1,'rgba(13,11,24,.85)');x.fillStyle=gg;x.fillRect(60,60,cw-120,470);x.restore();
  x.strokeStyle='#c49a4e';x.lineWidth=4;x.beginPath();x.roundRect?x.roundRect(60,60,cw-120,470,36):x.rect(60,60,cw-120,470);x.stroke();
  x.textAlign='left';x.fillStyle='#fdf6e4';x.font='700 64px "Alegreya SC", Georgia, serif';x.fillText("Lum's Magic Shop",100,440);x.font='italic 38px Alegreya, Georgia, serif';x.fillStyle='rgba(253,246,228,.85)';x.fillText('Prologue Complete',100,495);
  // stars and rank
  ctx=x;for(let i=0;i<5;i++)drawStar(cw/2+(i-2)*120,640,46,clamp(R.stars-i,0,1));ctx=sv;
  x.textAlign='center';x.fillStyle='#ffe28c';x.font='italic 600 48px Alegreya, Georgia, serif';x.fillText(R.rank,cw/2,745);
  // badges
  ctx=x;RESULTS.badges.forEach((b,i)=>{x.save();x.globalAlpha=b.got?1:.35;x.translate(cw/2+(i-2)*190,850);x.scale(2,2);drawBadge(b.id,b.got);x.restore();x.save();x.globalAlpha=b.got?1:.45;x.textAlign='center';x.fillStyle=b.got?'#ffe7a8':'#c8c0d4';x.font='700 24px "Alegreya SC", Georgia, serif';x.fillText(b.name,cw/2+(i-2)*190,935);x.restore();});ctx=sv;
  // a few stats
  const st=[['Time',fmtTime(S_.time)],['Treasures',`${R.fnd}/${HIDDEN.length}`],['Timed strikes',S_.atk?Math.round(R.strike*100)+'%':'—'],['Guards',S_.foeAtk?Math.round(R.guard*100)+'%':'—'],['Enemies',String(S_.kills)],['Steps',S_.steps.toLocaleString()]];
  st.forEach(([k,v],i)=>{const col=i%3,row=(i/3)|0,cx=cw/2+(col-1)*300,cy=1020+row*110;x.textAlign='center';x.fillStyle='rgba(232,226,242,.7)';x.font='500 30px Alegreya, Georgia, serif';x.fillText(k,cx,cy);x.fillStyle='#fdf6e4';x.font='700 44px "Alegreya SC", Georgia, serif';x.fillText(v,cx,cy+50);});
  x.fillStyle='rgba(232,226,242,.55)';x.font='italic 30px Alegreya, Georgia, serif';x.fillText('lums-magic-shop.vercel.app',cw/2,ch-50);return c;}
async function shareResults(){try{const c=makeResultCard();const blob=await new Promise(r=>c.toBlob(r,'image/png'));const file=new File([blob],'lums-magic-shop-prologue.png',{type:'image/png'});
    const text=`I finished the Prologue of Lum's Magic Shop with ${RESULTS.r.stars} stars — ${RESULTS.r.rank}! https://lums-magic-shop.vercel.app`;
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"Lum's Magic Shop",text});return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lums-magic-shop-prologue.png';document.body.appendChild(a);a.click();a.remove();RESULTS.msg='Result card saved!';RESULTS.msgT=2.5;}
  catch(e){if(e&&e.name==='AbortError')return;RESULTS.msg="Couldn't share from here, sorry!";RESULTS.msgT=2.5;}}


/* ---------- chapter select (unlocked after finishing the prologue) ---------- */
const PROG_KEY='lums-magic-shop-progress';
function readProg(){try{return JSON.parse(localStorage.getItem(PROG_KEY)||'{}')||{};}catch(e){return {};}}
function recordPrologue(stars,badges,keep){try{const p=readProg();p.prologue=p.prologue||{};p.prologue.done=1;p.prologue.best=Math.max(p.prologue.best||0,stars);p.prologue.badges=p.prologue.badges||{};for(const b of badges||[])if(b.got)p.prologue.badges[b.id]=1;const KR={duskflower:1,moonmint:2,mooncharm:3},cur=p.prologue.keepsake&&KR[p.prologue.keepsake.id]?p.prologue.keepsake:null;if(keep&&(!cur||KR[cur.id]<KR[keep.id]))p.prologue.keepsake=keep;else p.prologue.keepsake=cur;localStorage.setItem(PROG_KEY,JSON.stringify(p));}catch(e){}}
const PLAYTEST=true; // playtest build: Chapter 1 is always reachable from New Game
const CHSEL={on:false,sel:0,confirm:null,note:'',noteT:0,hits:[],t:0};
const CHAPTERS=[{id:'prologue',title:'Prologue'},{id:'ch1',title:'Chapter 1',sub:'Working Title'},{id:'thorn',title:'Stranglethorn',sub:'Art & maze preview'}];
function openChapterSelect(){CHSEL.on=true;CHSEL.sel=0;CHSEL.confirm=null;CHSEL.t=0;sfxPage&&sfxPage(.8);}
function chselPick(i){CHSEL.sel=i;CHSEL.confirm=i;sfxPage&&sfxPage(.6);}
function chselStart(){const c=CHAPTERS[CHSEL.confirm];CHSEL.confirm=null;
  if(c.id==='prologue'){CHSEL.on=false;newGame();return;}
  CHSEL.on=false;if(c.id==='thorn'){startThornPreview();return;}startChapter1();}
function chselTap(x,y){for(const h of CHSEL.hits)if(x>h.x&&x<h.x+h.w&&y>h.y&&y<h.y+h.h){h.act();return;}if(CHSEL.confirm!==null)CHSEL.confirm=null;}
function chselKey(code){if(CHSEL.confirm!==null){if(code==='Enter'||code==='Space'||code==='KeyE')chselStart();if(code==='Escape'||code==='Backspace')CHSEL.confirm=null;return;}
  if(code==='ArrowUp'||code==='KeyW')CHSEL.sel=Math.max(0,CHSEL.sel-1);if(code==='ArrowDown'||code==='KeyS')CHSEL.sel=Math.min(CHAPTERS.length-1,CHSEL.sel+1);
  if(code==='Enter'||code==='Space'||code==='KeyE')chselPick(CHSEL.sel);if(code==='Escape'||code==='Backspace')CHSEL.on=false;}
function coverImg(im,x,y,w,h,fx=.5,fy=.5){if(!ready(im))return;const iw=im.naturalWidth,ih=im.naturalHeight,s=Math.max(w/iw,h/ih),dw=iw*s,dh=ih*s;ctx.drawImage(im,x+(w-dw)*fx,y+(h-dh)*fy,dw,dh);}
function drawChapterSelect(){const dt=1/60;CHSEL.t+=dt;CHSEL.noteT=Math.max(0,CHSEL.noteT-dt);CHSEL.hits=[];const prog=readProg(),best=(prog.prologue&&prog.prologue.best)||0;
  ctx.fillStyle='#fbf7ef';ctx.fillRect(0,0,W,H);ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
  // back
  ctx.font='700 15px "Alegreya SC", Georgia, serif';ctx.fillStyle='#2f2a3a';ctx.textAlign='left';ctx.fillText('‹ Back',20,30);CHSEL.hits.push({x:6,y:10,w:90,h:40,act:()=>{CHSEL.on=false;}});
  ctx.textAlign='center';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('Choose a Chapter',W/2,H*.11);
  const bw=Math.min(W-40,400),bx=W/2-bw/2,bh=Math.round(bw*.5);let y=H*.17;
  CHAPTERS.forEach((c,i)=>{const h=i===0?bh:Math.round(bh*.62),sel=CHSEL.sel===i&&!TOUCHUI(),pop=Math.min(1,Math.max(0,(CHSEL.t-.08*i)*4));ctx.save();ctx.globalAlpha=pop;ctx.translate(0,(1-pop)*16);
    ctx.fillStyle='rgba(40,30,20,.18)';rr(bx+2,y+5,bw,h,16);ctx.fill();
    ctx.save();rr(bx,y,bw,h,16);ctx.clip();
    if(c.id==='prologue'){coverImg(IMG.forest_bg,bx,y,bw,h,.5,.35);const ci=IMG.cottage;if(ready(ci)){const ch=h*.92,cw=ch*ci.naturalWidth/ci.naturalHeight;ctx.drawImage(ci,bx+bw*.62-cw/2,y+h-ch+h*.06,cw,ch);}
      const g=ctx.createLinearGradient(0,y+h*.35,0,y+h);g.addColorStop(0,'rgba(20,16,30,0)');g.addColorStop(1,'rgba(20,16,30,.78)');ctx.fillStyle=g;ctx.fillRect(bx,y,bw,h);
      ctx.textAlign='left';ctx.fillStyle='#fdf6e4';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('Prologue',bx+18,y+h-46);
      for(let k=0;k<5;k++)drawStar(bx+30+k*30,y+h-18,11,clamp(best-k,0,1));
}
    else{const g=ctx.createLinearGradient(bx,y,bx,y+h);g.addColorStop(0,'#efe4cc');g.addColorStop(1,'#dccaa4');ctx.fillStyle=g;ctx.fillRect(bx,y,bw,h);
      ctx.strokeStyle='rgba(120,90,50,.18)';ctx.lineWidth=1;for(let k=0;k<8;k++){ctx.beginPath();ctx.moveTo(bx,y+h*(k+.5)/8);ctx.bezierCurveTo(bx+bw*.3,y+h*(k+.2)/8,bx+bw*.7,y+h*(k+.8)/8,bx+bw,y+h*(k+.5)/8);ctx.stroke();}
      ctx.textAlign='left';ctx.fillStyle='#3a2c1a';ctx.font='700 24px "Alegreya SC", Georgia, serif';ctx.fillText(c.title,bx+18,y+h*.42);ctx.font='italic 16px Alegreya, Georgia, serif';ctx.fillStyle='#6a5232';ctx.fillText(c.sub,bx+18,y+h*.72);}
    ctx.restore();ctx.strokeStyle=sel?'#e0a83a':'#c49a4e';ctx.lineWidth=sel?3:1.6;rr(bx,y,bw,h,16);ctx.stroke();
    if(sel){ctx.save();ctx.globalCompositeOperation='multiply';ctx.restore();}
    ctx.restore();CHSEL.hits.push({x:bx,y,w:bw,h,act:()=>chselPick(i)});y+=h+22;});
  if(CHSEL.noteT>0){ctx.globalAlpha=Math.min(1,CHSEL.noteT*2);ctx.font='italic 15px Alegreya, Georgia, serif';ctx.fillStyle='#5a4a36';ctx.fillText(CHSEL.note,W/2,Math.min(H-40,y+16));ctx.globalAlpha=1;}
  ctx.restore();
  if(CHSEL.confirm!==null){const c=CHAPTERS[CHSEL.confirm];CHSEL.hits=[];ctx.save();ctx.fillStyle='rgba(20,16,30,.45)';ctx.fillRect(0,0,W,H);
    const mw=Math.min(W-50,330),mh=readSave()?190:160,mx=W/2-mw/2,my=H/2-mh/2;ctx.fillStyle='#f6ecd2';rr(mx,my,mw,mh,16);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.6;ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#3a2c1a';ctx.font='700 21px "Alegreya SC", Georgia, serif';ctx.fillText(`Start ${c.id==='prologue'?'the Prologue':c.title}?`,W/2,my+38);
    if(readSave()){ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillStyle='#7a6040';ctx.fillText('This will replace your current save.',W/2,my+70);}
    const bw2=(mw-50)/2,by2=my+mh-66;[['Start',true,chselStart],['Cancel',false,()=>{CHSEL.confirm=null;}]].forEach(([lab,pri,fn],k)=>{const x=mx+18+k*(bw2+14);
      const g=ctx.createLinearGradient(0,by2,0,by2+46);if(pri){g.addColorStop(0,'#f0c060');g.addColorStop(1,'#c88a2a');}else{g.addColorStop(0,'#c9b89c');g.addColorStop(1,'#9a8668');}ctx.fillStyle=g;rr(x,by2,bw2,46,23);ctx.fill();ctx.strokeStyle=pri?'#fff2c8':'#5a4a36';ctx.lineWidth=pri?2:1.6;ctx.stroke();
      ctx.fillStyle='#fffaf0';ctx.font='700 18px "Alegreya SC", Georgia, serif';ctx.fillText(lab,x+bw2/2,by2+24);CHSEL.hits.push({x,y:by2,w:bw2,h:46,act:fn});});
    ctx.restore();}}

/* ---------- the Slug King: a secret mini-boss after all five garden slugs ---------- */
const KCW=420,KCH=300,KROW={idle:[0,8],move:[1,8],spell:[2,8],hurt:[3,6],die:[4,8]};let kingState=0;   // 0 not yet, 1 roaming, 2 defeated
function kingFrame(c,anim,i,x,y,h,flip,alpha,flash){const im=IMG.slugking;if(!ready(im))return;const [r,n]=KROW[anim];i=clamp(i|0,0,n-1);const k=h/KCH;
  c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.globalAlpha*=alpha;if(flash>0)c.filter='brightness(1.9)';c.drawImage(im,i*KCW,r*KCH,KCW,KCH,-KCW*k/2,-KCH*k*.97,KCW*k,KCH*k);c.filter='none';c.restore();}
function kingSpot(){const C=[[-150,760],[300,960],[-330,560],[80,1180],[400,520]];let best=null,bd=-1;for(const [x,y] of C){const [sx,sy]=solveEstate(x,y);if(Math.hypot(sx-x,sy-y)>.5||inStream(x,y,-30)||inPond(x,y,-40))continue;const d=Math.hypot(x-lum.x,y-lum.y),sc_=d<230?9999+d:d;if(bd<0||sc_<bd){bd=sc_;best=[x,y];}}return best||slugSpot();}
function spawnKing(rise){if(SLUGS.some(g=>g.kind==='slugking'))return;const [x,y]=kingSpot();SLUGS.push({kind:'slugking',scene:'garden',x,y,tx:x,ty:y,s:1,row:2,ft:0,state:'crawl',t:0,sp:9,trailT:0,ph:0,shy:0,flee:0,calm:rise?4:1.5,rise:rise?0:1,pack:1});kingState=1;}
function kingArrives(){spawnKing(true);sfxRumble&&sfxRumble(1.6,.5);GOAL.tag='NEW TASK';GOAL.text='Defeat the Slug King';HINT.goalT=0;
  setTimeout(()=>talk([['Cosmic',"Huh? The ground is… bubbling?"],['Cosmic',"A giant slug… wearing a crown?! That must be the Slug King!"]]),1800);}
function drawKing(g){if(CAPTURE.on&&g===BATTLE.capG)return;const h=150;if(g.rise<1){g.rise=Math.min(1,g.rise+1/60/1.6);for(let k=0;k<2;k++)TRAIL.push({x:g.x+rnd(-50,50),y:g.y+rnd(-10,10),a:rnd(0,TAU),t:30});}
  const e=g.rise<1?1-Math.pow(1-g.rise,2):1,flip=Math.cos(g.hd||0)<0,moving=g.chase||g.state==='crawl';
  ctx.fillStyle='rgba(30,50,40,.25)';ctx.beginPath();ctx.ellipse(g.x,g.y+2,62*e,13*e,0,0,TAU);ctx.fill();
  drawGlow(ctx,g.x,g.y-50,80,'190,240,255',.2+.08*Math.sin(T*1.3));
  ctx.save();ctx.beginPath();ctx.rect(g.x-200,g.y-300,400,300+4);ctx.clip();kingFrame(ctx,moving?'move':'idle',Math.floor(T*(moving?9:6))%8,g.x,g.y+4+(1-e)*h,h,flip,1,0);ctx.restore();
  // a little golden crown so everyone knows who's in charge
  const hx=g.x+(flip?-1:1)*30,hy=g.y-h*.84*e+(1-e)*h+Math.sin(T*3)*1.5;ctx.save();ctx.translate(hx,hy);ctx.fillStyle='#f2c440';ctx.strokeStyle='#7a5410';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-11,4);ctx.lineTo(-11,-5);ctx.lineTo(-5,0);ctx.lineTo(0,-8);ctx.lineTo(5,0);ctx.lineTo(11,-5);ctx.lineTo(11,4);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#d24a5a';ctx.beginPath();ctx.arc(0,-1,1.8,0,TAU);ctx.fill();ctx.restore();ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,hx,hy,14,'255,220,120',.35+.15*Math.sin(T*4));ctx.restore();}
function drawBattleKing(f){const S=bS(),B=BATTLE,me=B.foes[B.foeI]===f,h=170*S*f.s,x=f.x+f.ox,y=f.y+f.oy;let anim='idle',fi=Math.floor(T*6+f.ph)%8;
  if(f.dead){anim='die';fi=Math.min(7,Math.floor(f.dead/.18));}else if(f.hit>0){anim='hurt';fi=Math.min(5,Math.floor((.4-f.hit)/.07));}
  else if(me&&B.phase==='foeWind'){anim='spell';fi=Math.min(5,Math.floor(f.wind*6));}else if(me&&(B.phase==='foeLeap')){anim='spell';fi=5;}else if(me&&B.phase==='foeJiggle'){anim='move';fi=Math.floor(B.t*10)%8;}
  const al=f.dead>1.8?Math.max(0,1-(f.dead-1.8)/.6):1;if(al<=0)return;
  bshadow(x,y-4,h*.36,h*.06,.35*al);
  drawGlow(ctx,x,y-h*.35,h*.5,'190,240,255',.2*al);
  kingFrame(ctx,anim,fi,x+(f.hit>0?Math.sin(f.hit*50)*4:0),y,h,true,al,0);
  if(!f.dead){const hx=x-30*S,hy=y-h*.84+Math.sin(T*3)*1.5;ctx.save();ctx.translate(hx,hy);ctx.scale(1.3*S,1.3*S);ctx.fillStyle='#f2c440';ctx.strokeStyle='#7a5410';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-11,4);ctx.lineTo(-11,-5);ctx.lineTo(-5,0);ctx.lineTo(0,-8);ctx.lineTo(5,0);ctx.lineTo(11,-5);ctx.lineTo(11,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#d24a5a';ctx.beginPath();ctx.arc(0,-1,1.8,0,TAU);ctx.fill();ctx.restore();}
  // the spell: a bolt of starry slime from his shell to the hero
  if(me&&B.phase==='foeLeap'&&f.tgt){const u=Math.min(1,B.t/B.leapD),sx=x-h*.25,sy=y-h*.5,tx=f.tgt.x+f.tgt.ox,ty=f.tgt.y-80*S,px=sx+(tx-sx)*u,py=sy+(ty-sy)*u-Math.sin(Math.PI*u)*40*S;
    ctx.save();ctx.globalCompositeOperation='lighter';for(let k=0;k<6;k++){const v=u-k*.04;if(v<0)continue;drawGlow(ctx,sx+(tx-sx)*v,sy+(ty-sy)*v-Math.sin(Math.PI*v)*40*S,(16-k*2)*S,'170,230,255',.7-k*.1);}drawGlow(ctx,px,py,26*S,'220,250,255',.9);ctx.restore();
    if(u>.85){const im=IMG.slugking;if(ready(im)){const k=110*S/KCH;ctx.save();ctx.globalAlpha=(u-.85)/.15;ctx.drawImage(im,7*KCW,2*KCH,KCW,KCH,tx-KCW*k/2,ty+40*S-KCH*k,KCW*k,KCH*k);ctx.restore();}}}
  if(f.showHp>0&&!f.dead){const bw=80*S,bx=x-bw/2,by=y+16*S;ctx.save();ctx.globalAlpha=Math.min(1,f.showHp*3);ctx.fillStyle='rgba(20,20,30,.55)';rr(bx-2,by-2,bw+4,10,5);ctx.fill();ctx.fillStyle='#7ee08a';rr(bx,by,bw*f.hp/f.max,6,3);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(`${f.hp}/${f.max}`,bx+bw/2,by+20);ctx.restore();}
  if(B.phase==='target'&&B.foes[B.target]===f)tutArrow(ctx,f.x,f.y-h*.95,1);}
function syncMaxHp(who=HERO){const H_=HEROES[who];let b=0;for(const k in PARTY[who]){const it=ITEMS[PARTY[who][k]];if(it&&it.hp)b+=it.hp;}H_.maxHp=(who==='lum'?14:who==='jak'?20:12)+b;H_.hp=Math.min(H_.hp,H_.maxHp);}

