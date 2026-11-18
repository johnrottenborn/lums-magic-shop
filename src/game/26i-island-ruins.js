/* ===== The Island Ruins (Chapter 2): the old water temple, out past the underground ruins, up the stairs from room 5.
   A far-east region of the Stranglethorn world (like Breezevale), laid out from the designer's sketch: the stone mountain behind,
   a curve of broken, ghostly archways along the top, the chapel top-left, four broken goddess statues in an arc, the entrance
   (the way back down) top-right beside a whole goddess statue, the old font in the middle, a fallen goddess along the south shore,
   boulders round the edge. Cobbled ground, dead plants, everything washed blue, thick white fog. First layout pass for review. ===== */
const ISX=BVX+4200,ISY=500,ISW=2800,ISH=2250,IST={t:99};
const inIS=()=>lum.x>ISX-300;
const IS_TOP=330,IS_ARCHY=500;   /* the mountain's foot; the line of the archways (nothing walkable behind them) */
const ISLAND=(()=>{const P=[[170,IS_TOP]];for(let a=Math.PI;a>=0;a-=.05){const w=1+.035*Math.sin(a*7)+.025*Math.sin(a*13+1);P.push([1400+Math.cos(a)*1250*w,IS_TOP+Math.sin(a)*1560*w]);}P.push([2630,IS_TOP]);return P.reverse();})();   /* the shore: round on the sea sides, flat against the mountain */
const ISH_=(i,s)=>{const x=Math.sin(i*127.1+s*311.7)*43758.5453;return x-Math.floor(x);};
const IS_FONT={x:1400,y:1110,w:310},IS_CHAPEL={x:560,y:1060,w:560},IS_ENT={x:2310,y:880,k:.52,ax:400,ay:1520},IS_GODDESS={x:1690,y:1010,w:170},IS_SEAM={x:1985,y:960,w:470};   /* the font is the centre of the map; the entrance painting (top-right corner) is anchored at the foot of its stairs; a big broken arch hides its left edge */
const IS_STATUES=[[1000,800,.42,-.04],[1250,730,.3,.02],[1520,730,.55,-.02],[1790,800,.36,.05]];   /* x, y, how much has broken off the top, lean */
const IS_FALLEN={x:1330,y:1720,len:600};
const IS_LOWARCH=(()=>{const A=[];let i=0;for(let x=330;x<=2470;x+=190,i++){if(Math.abs(x-IS_FALLEN.x)<380)continue;const y=IS_TOP+1560*Math.sqrt(Math.max(0,1-((x-1400)/1250)**2))-290;A.push([x,y,['pillars','left','crown','left','pillars'][i%5],i%2===1]);}return A;})();   /* broken gateways following the south edge (a gap round the fallen goddess) */
const IS_DOOR={x:IS_ENT.x,y:IS_ENT.y-4};   /* the foot of the entrance stairs: the way back down to the underground ruins */
const IS_BOULDERS=(()=>{const B=[];for(let i=2;i<ISLAND.length-2;i+=1){const [x,y]=ISLAND[i];if(y<IS_TOP+120||(x>1980&&y<1000))continue;const dx=x-1400,dy=y-IS_TOP,L=Math.hypot(dx,dy)||1;for(const o of [10,85])B.push([x+dx/L*o+(ISH_(i,o)-.5)*40,y+dy/L*o*.6,90+ISH_(i,o+1)*80]);}for(let i=0;i<70;i++){const x=-200+ISH_(i,50)*(ISW+400),y=IS_TOP+150+ISH_(i,51)*(ISH-IS_TOP+200);if(inPoly(x,y,ISLAND))continue;B.push([x,y,80+ISH_(i,52)*110]);}return B;})();   /* boulders heaped all round the edge (no sea round the island) */
/* ---- the blue wash (and, for plants, dead grey-brown) baked into each image once ---- */
const ISTINT={};
function isTint(src,mode){const key=src+'|'+(mode||'');if(ISTINT[key])return ISTINT[key];const im=IMG[src];if(!ready(im))return null;
  const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;let r=p[i],gg=p[i+1],b=p[i+2];const L=.3*r+.59*gg+.11*b;
      if(mode==='dead'){r=L*.8;gg=L*.7;b=L*.56;}if(mode==='rock'){r*=.62;gg*=.63;b*=.68;}
      const k=mode==='ghost'?.7:.38;p[i]=r*(1-k)+L*.74*k;p[i+1]=gg*(1-k)+L*.88*k;p[i+2]=Math.min(255,b*(1-k)+L*1.15*k);}g.putImageData(d,0,0);}catch(e){}
  return ISTINT[key]=c;}
/* ---- where Lum may walk ---- */
function isSolid(lx,ly){
  const rect=(x0,y0,x1,y1)=>lx>x0&&lx<x1&&ly>y0&&ly<y1,ell=(x,y,rx,ry)=>((lx-x)/rx)**2+((ly-y)/ry)**2<1;
  const C=IS_CHAPEL,E=IS_ENT,F=IS_FONT;
  if(rect(C.x-C.w*.47,C.y-230,C.x+C.w*.47,C.y-6))return true;
  if(rect(E.x-E.ax*E.k+60,E.y-800,E.x+(1206-E.ax)*E.k,E.y-14))return true;
  if(ell(F.x,F.y-60,F.w*.47,70))return true;
  {const A=IS_SEAM;if(rect(A.x-A.w*.5,A.y-30,A.x-A.w*.08,A.y-4)||rect(A.x+A.w*.1,A.y-30,A.x+A.w*.5,A.y-4))return true;}   /* the big arch's two pillars */
  for(const [x,y] of IS_STATUES)if(ell(x,y-10,62,22))return true;
  for(const [x,y] of IS_LOWARCH)if(rect(x-150,y-30,x+150,y-4))return true;
  if(rect(IS_FALLEN.x-IS_FALLEN.len*.5,IS_FALLEN.y-58,IS_FALLEN.x+IS_FALLEN.len*.5+90,IS_FALLEN.y+8))return true;
  for(const [x,y,w] of IS_BOULDERS)if(ell(x,y-8,w*.42,w*.16))return true;
  return false;}
function isFree(x,y){const lx=x-ISX,ly=y-ISY;if(ly<IS_ARCHY+10)return false;
  if(!inPoly(lx,ly,ISLAND))return false;let near=1e9;for(let i=0;i<ISLAND.length-1;i++){const [ax,ay]=ISLAND[i],[bx,by]=ISLAND[i+1],dx=bx-ax,dy=by-ay,t=clamp(((lx-ax)*dx+(ly-ay)*dy)/(dx*dx+dy*dy||1),0,1);near=Math.min(near,Math.hypot(lx-ax-dx*t,ly-ay-dy*t));}
  if(near<70&&ly>IS_TOP+60)return false;   /* keep off the cliff edge */
  return !isSolid(lx,ly);}
/* ---- scenery ---- */
function isProps(P){const X=x=>x+ISX,Y=y=>y+ISY;
  for(let i=0,n=11;i<n;i++){const t=i/(n-1),x=280+t*1600,y=IS_ARCHY-30*Math.sin(Math.PI*t),cut=['crown','pillars','left','crown','left','pillars','crown','left','pillars','crown','left'][i];   /* the broken gateways along the top, in a gentle curve */
    P.push({t:'isarch',x:X(x),y:Y(y),w:300,flip:i%2===1,cut});
    for(const [u0,v0,u1,v1,dx,dy,rot,sz] of RUIN_RUBBLE[cut]||[])P.push({t:'isrub',src:[u0,v0,u1,v1],x:X(x)+dx*250*(i%2?-1:1),y:Y(y)+30+dy*80,w:250*sz*.55,rot});}
  for(const [x,y,cut,fl] of IS_LOWARCH){P.push({t:'isarch',x:X(x),y:Y(y),w:300,flip:fl,cut});   /* more broken gateways along the bottom */
    for(const [u0,v0,u1,v1,dx,dy,rot,sz] of RUIN_RUBBLE[cut]||[])P.push({t:'isrub',src:[u0,v0,u1,v1],x:X(x)+dx*250*(fl?-1:1),y:Y(y)-20-dy*60,w:250*sz*.55,rot});}
  P.push({t:'isp',img:'isle_chapel',x:X(IS_CHAPEL.x),y:Y(IS_CHAPEL.y),w:IS_CHAPEL.w});
  P.push({t:'isent',x:X(IS_ENT.x),y:Y(IS_ENT.y),w:700});
  P.push({t:'isarch',x:X(IS_SEAM.x),y:Y(IS_SEAM.y),w:IS_SEAM.w,flip:false,cut:'pillars',opaque:1});
  P.push({t:'isp',img:'isle_font',x:X(IS_FONT.x),y:Y(IS_FONT.y),w:IS_FONT.w});
    for(const [x,y,cut,lean] of IS_STATUES){P.push({t:'isbroken',x:X(x),y:Y(y),w:150,cut,lean});}   /* the broken statues */
  P.push({t:'isfallen',x:X(IS_FALLEN.x),y:Y(IS_FALLEN.y),len:IS_FALLEN.len,w:IS_FALLEN.len});
  for(const [x,y,w] of IS_BOULDERS)P.push({t:'isp',img:['crockegg','crockpile','crockheap'][Math.floor(ISH_(x,1)*3)],mode:'rock',x:X(x),y:Y(y),w,flip:ISH_(x,2)<.5,shadow:1});
  for(let i=0;i<46;i++){const x=300+ISH_(i,3)*2200,y=600+ISH_(i,4)*1250;if(i%2||!isFree(X(x),Y(y)))continue;   /* rubble through the ruins */
    P.push({t:'isrub',src:[[.6,.05,.8,.22],[.3,.04,.58,.2],[.62,.3,.95,.55],[.78,.2,.95,.4]][i%4],x:X(x),y:Y(y),w:60+ISH_(i,6)*50,rot:(ISH_(i,7)-.5)*3});}
}
function drawISProp(o){const S=o.t;
  if(S==='isent'){const im=isTint('isle_entrance');if(!im)return;const E=IS_ENT;ctx.drawImage(im,o.x-E.ax*E.k,o.y-E.ay*E.k,im.width*E.k,im.height*E.k);return;}   /* the designer's painting of the entrance, all but its sky */
  if(S==='isp'){const im=isTint(o.img,o.mode);if(!im)return;const w=o.w,h=w*im.height/im.width;ctx.save();ctx.translate(o.x,o.y);if(o.shadow){ctx.fillStyle='rgba(15,20,35,.25)';ctx.beginPath();ctx.ellipse(0,0,w*.4,w*.12,0,0,TAU);ctx.fill();}if(o.flip)ctx.scale(-1,1);ctx.drawImage(im,-w/2,-h*.97,w,h);ctx.restore();return;}
  if(S==='isarch'){const im=isTint('ruins_arch','ghost');if(!im)return;const w=o.w,h=w*im.height/im.width,P=RUIN_CUT[o.cut];   /* ethereal: see-through, glowing, shimmering */
    ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,o.x,o.y-h*.5,w*.75,'170,195,255',.07+.03*Math.sin(T*1.3+o.x));ctx.restore();
    for(const [al,dx,comp] of [[o.opaque?1:.8,0,'source-over'],[.2,Math.sin(T*1.7+o.x*.01)*3,'lighter']]){ctx.save();ctx.translate(o.x+dx,o.y);if(o.flip)ctx.scale(-1,1);ctx.globalCompositeOperation=comp;ctx.globalAlpha=al;
      if(P){ctx.beginPath();P.forEach(([u,v],i)=>{const x=-w/2+u*w,y=-h*.97+v*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.clip();}ctx.drawImage(im,-w/2,-h*.97,w,h);ctx.restore();}return;}
  if(S==='isrub'){const im=isTint('ruins_arch','ghost');if(!im)return;const [u0,v0,u1,v1]=o.src,iw=im.width,ih=im.height,sw=(u1-u0)*iw,sh=(v1-v0)*ih,k=o.w/sw;
    ctx.save();ctx.translate(o.x,o.y);ctx.fillStyle='rgba(15,20,35,.25)';ctx.beginPath();ctx.ellipse(0,0,o.w*.55,o.w*.16,0,0,TAU);ctx.fill();ctx.rotate(o.rot);ctx.globalAlpha=.75;ctx.drawImage(im,u0*iw,v0*ih,sw,sh,-sw*k/2,-sh*k*.8,sw*k,sh*k);ctx.restore();return;}
  if(S==='isbroken'||S==='isshard'){const im=isTint('isle_goddess');if(!im)return;const w=o.w,h=w*im.height/im.width,cut=o.cut,top=-h*.97+cut*h;
    const jag=(sgn)=>{ctx.lineTo(w/2,top);for(let i=8;i>=0;i--){const x=-w/2+i/8*w;ctx.lineTo(x,top+sgn*((i%2?14:-6)+ISH_(i,o.x)*10));}};
    ctx.save();ctx.translate(o.x,o.y);
    if(S==='isbroken'){ctx.fillStyle='rgba(15,20,35,.25)';ctx.beginPath();ctx.ellipse(0,0,w*.42,w*.13,0,0,TAU);ctx.fill();ctx.rotate(o.lean);ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(w/2,0);jag(1);ctx.closePath();ctx.clip();ctx.drawImage(im,-w/2,-h*.97,w,h);}
    else{const ph=cut*h;ctx.fillStyle='rgba(15,20,35,.22)';ctx.beginPath();ctx.ellipse(0,0,ph*.5,w*.12,0,0,TAU);ctx.fill();ctx.rotate(o.rot);ctx.translate(0,ph*.45);ctx.beginPath();ctx.moveTo(-w/2,-h*.97);ctx.lineTo(w/2,-h*.97);jag(1);ctx.closePath();ctx.clip();ctx.drawImage(im,-w/2,-h*.97,w,h);}
    ctx.restore();return;}
  if(S==='isfallen'){const im=isTint('isle_goddess');if(!im)return;const L=o.len,hw=L*im.width/im.height,base=.13;   /* the fallen goddess, lying with her head to the west; her plinth still stands at the east end */
    ctx.save();ctx.translate(o.x,o.y);ctx.fillStyle='rgba(15,20,35,.28)';ctx.beginPath();ctx.ellipse(0,-4,L*.5,hw*.35,0,0,TAU);ctx.fill();
    ctx.save();ctx.translate(-L*.06,-hw*.32);ctx.rotate(-Math.PI/2);ctx.beginPath();ctx.rect(-hw/2,-L*.5,hw,L*(1-base));ctx.clip();ctx.drawImage(im,-hw/2,-L*.5,hw,L);ctx.restore();
    const ph=L*base,pw=hw*1.05;ctx.drawImage(im,0,im.height*(1-base),im.width,im.height*base,L*.5-pw*.2,-ph,pw,ph);ctx.restore();return;}}
/* ---- the ground: the sea, the mountain behind, the cliff edge and the cobbles ---- */
let ISGROUND=null;
function buildISGround(){const K=.6,c=document.createElement('canvas');c.width=Math.ceil(ISW*K);c.height=Math.ceil((ISH-IS_TOP+60)*K);const g=c.getContext('2d');g.setTransform(K,0,0,K,0,-(IS_TOP-60)*K);
  const poly=()=>{g.beginPath();ISLAND.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();};
  poly();g.fillStyle='#7f7d72';g.fill();g.save();poly();g.clip();
  for(let y=IS_TOP-40,row=0;y<ISH;y+=COB_W*.8,row++){const sh=row%2?37:0;drawStrip(g,IMG.cobble_strip,smoothPath([[-80-sh,y],[ISW+80,y]]),false);}   /* the designer's cobbles in overlapping rows */
  for(let i=0;i<40;i++){const x=200+ISH_(i,20)*2400,y=IS_TOP+80+ISH_(i,21)*1500,r=24+ISH_(i,22)*60;g.save();g.translate(x,y);g.scale(1,.55);g.rotate(ISH_(i,23)*3);   /* broken patches: cobbles gone, bare earth and dead grass showing */
    g.fillStyle='rgba(98,88,70,.6)';g.beginPath();for(let j=0;j<10;j++){const a=j/10*TAU,rr=r*(.7+ISH_(i*10+j,24)*.5);j?g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):g.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}g.closePath();g.fill();
    g.strokeStyle='rgba(140,128,96,.6)';g.lineWidth=2;for(let j=0;j<8;j++){const a=ISH_(i*8+j,25)*TAU,rr=r*ISH_(i*8+j,26)*.8,bx=Math.cos(a)*rr,by=Math.sin(a)*rr;g.beginPath();g.moveTo(bx,by);g.lineTo(bx+3,by-12);g.moveTo(bx,by);g.lineTo(bx-4,by-9);g.stroke();}g.restore();}
  g.restore();
  g.setTransform(1,0,0,1,0,0);try{const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const L=.3*p[i]+.59*p[i+1]+.11*p[i+2];p[i]=p[i]*.55+L*.36;p[i+1]=p[i+1]*.55+L*.39;p[i+2]=Math.min(255,p[i+2]*.55+L*.47);}g.putImageData(d,0,0);}catch(e){}   /* washed blue */
  return [c,K];}
function drawISGround(x0,y0,x1,y1){if(x1<ISX-300)return;
  ctx.save();ctx.translate(ISX,ISY);
  const poly=P=>{P.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
  ctx.fillStyle='#3e4148';ctx.fillRect(-500,-700,ISW+1000,ISH+1200);   /* dark rocky ground beyond the ruins (no sea round the island) */
  ctx.fillStyle='rgba(90,92,98,.35)';for(let i=0;i<260;i++){const x=-400+ISH_(i,40)*(ISW+800),y=IS_TOP+ISH_(i,41)*(ISH-IS_TOP+500);if(inPoly(x,y,ISLAND))continue;ctx.beginPath();ctx.ellipse(x,y,20+ISH_(i,42)*50,8+ISH_(i,43)*18,0,0,TAU);ctx.fill();}
  const mc=isTint('worldbind_cliff');if(mc){const mh=560,mw=mh*mc.width/mc.height;for(let x=-500,i=0;x<ISW+500;x+=mw*.8,i++){ctx.save();ctx.translate(x+mw/2,IS_TOP+40);if(i%2)ctx.scale(-1,1);ctx.drawImage(mc,-mw/2,-mh,mw,mh);ctx.restore();}   /* the stone mountain behind the island */
    const mg=ctx.createLinearGradient(0,IS_TOP-560,0,IS_TOP+40);mg.addColorStop(0,'rgba(30,40,60,.3)');mg.addColorStop(.75,'rgba(30,40,60,.15)');mg.addColorStop(1,'rgba(30,40,60,0)');ctx.fillStyle=mg;ctx.fillRect(-500,IS_TOP-560,ISW+1000,600);}
  if(!ISGROUND&&ready(IMG.cobble_strip))ISGROUND=buildISGround();
  if(ISGROUND){const [c,K]=ISGROUND;ctx.drawImage(c,0,IS_TOP-60,c.width/K,c.height/K);}
  ctx.restore();}
/* ---- the fog: drifting banks over the ground, and a thick white veil that only thins right around Lum ---- */
function drawISFx(){if(!inIS()||SCENE!=='thorn')return;
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb(142,150,170)';ctx.fillRect(cam.x-3000,cam.y-3000,6000,6000);ctx.restore();   /* the whole island in a cool blue cast */
  ctx.save();for(let i=0;i<34;i++){const sp=8+ISH_(i,30)*14,x=ISX+((ISH_(i,31)*ISW+T*sp)%(ISW+800))-400,y=ISY+IS_TOP+ISH_(i,32)*1700+Math.sin(T*.2+i)*30,r=220+ISH_(i,33)*260;
    ctx.save();ctx.translate(x,y);ctx.scale(1,.5);const gr=ctx.createRadialGradient(0,0,0,0,0,r);gr.addColorStop(0,'rgba(228,234,242,.12)');gr.addColorStop(.5,'rgba(232,238,246,.06)');gr.addColorStop(1,'rgba(236,242,250,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}   /* the gradient follows the bank's oval, so no hard rim */
  {const cx=ISX+1400,cy=ISY+1110,br=Math.sin(T*.45)*70+Math.sin(T*.23+1)*40;   /* very dense fog round the edge of the map, breathing in and out */
    ctx.save();ctx.translate(cx,cy);ctx.scale(1,.66);const fg=ctx.createRadialGradient(0,0,1060+br,0,0,1480+br);fg.addColorStop(0,'rgba(226,232,240,0)');fg.addColorStop(.35,'rgba(226,232,240,.55)');fg.addColorStop(.7,'rgba(226,232,240,.9)');fg.addColorStop(1,'rgba(228,234,242,.98)');
    ctx.fillStyle=fg;ctx.fillRect(-4000,-5000,8000,10000);ctx.restore();
    for(let i=0;i<22;i++){const a=i/22*TAU+T*.02,rr=(1330+br+Math.sin(T*.5+i)*60),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.66,r=300+ISH_(i,60)*200,g2=ctx.createRadialGradient(0,0,0,0,0,r);g2.addColorStop(0,'rgba(232,238,246,.4)');g2.addColorStop(.55,'rgba(232,238,246,.15)');g2.addColorStop(1,'rgba(232,238,246,0)');ctx.save();ctx.translate(x,y);ctx.scale(1,.6);ctx.fillStyle=g2;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}}   /* rolling banks along the edge */
  const lx=lum.x,ly=lum.y-50,gr=ctx.createRadialGradient(lx,ly,230,lx,ly,900);gr.addColorStop(0,'rgba(232,238,246,0)');gr.addColorStop(.5,'rgba(226,232,240,.08)');gr.addColorStop(1,'rgba(226,232,240,.25)');
  ctx.fillStyle=gr;ctx.fillRect(lx-3000,ly-3000,6000,6000);ctx.restore();}
function drawISTitle(){if(!inIS()||IST.t>=4.5||SCENE!=='thorn')return;IST.t+=1/60;const a=Math.min(1,IST.t*1.5,(4.5-IST.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.font='700 30px "Alegreya SC", Georgia, serif';ctx.fillStyle='rgba(10,14,24,.55)';ctx.fillText('Island Ruins',W/2+2,H*.2+2);ctx.fillStyle='#eef3fb';ctx.fillText('Island Ruins',W/2,H*.2);ctx.restore();}
/* ---- in and out: up the stairs from underground ruins room 5, back down through the entrance ---- */
function enterIsland(){SCENE='thorn';lum.x=ISX+IS_DOOR.x;lum.y=ISY+IS_DOOR.y+40;lum.face=-1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-60;THORN.t=99;IST.t=0;if(typeof jak2In==='function'&&jak2In())resetJak2Follow();}
THINT.push({get x(){return ISX+IS_DOOR.x;},get y(){return ISY+IS_DOOR.y;},get reach(){return inIS()?75:-1;},door:true,onInteract:()=>dunGo(36,415,580,1)});
/* playtest shortcut from chapter select: underground ruins room 5, Jak in the party, ready to climb to the island */
function chPlaytestIsle(){chPlaytestBreezeway();Object.assign(C2,{lumaMet:1,jak:1,ruinWay:1,ruinsIn:1,bvArrived:1});if(!PARTY_ORDER.includes('jak'))PARTY_ORDER.push('jak');HEROES.jak.hp=HEROES.jak.maxHp;
  hsGoal('Climb the stairs to the island ruins');enterDun(36,450,640,1);resetJak2Follow();}
