/* ---------- Chapter 2: Breezevale Cove, east of the Coastal Breezeway ----------
   Laid out from the designer's sketch: the town is a round green on a cliff over the sea, with cobbled paths round the fountain
   and out to each house. Shell house top-left, the Mayor's house top-right, clam houses bottom-left and bottom-right; a small
   bridge east over the water to a raised islet with the second shell house. The Breezevale gate at the south, a road down to the
   way back to the Breezeway; north, the way on to the Sanctuary of Water (still to come). Built as another region of the
   Stranglethorn world, east of the Breezeway. Townsfolk still to come. */
const BVX=BWX+5200,BVY=500,BVW=2400,BVH=2000,BVT={t:99};
const BVC={x:1000,y:850,r:600},BVI={x:2030,y:800,r:200};   /* the town green, and the islet */
const BVGATE={x:BVC.x,y:BVC.y+BVC.r+10},BVSOUTH={x:BVC.x,y:BVH-90},BVNORTH={x:BVC.x,y:BVC.y-BVC.r+70};
const BVBR={x0:1585,x1:1835,y:800,w:270};BVBR.h=BVBR.w*346/700;BVBR.rise=BVBR.h*.29;   /* the bridge: deck ends at y, the deck (between the two handrails) rises in the middle */
const BVHOUSES=[{img:'breeze_shellhouse',x:725,y:610,w:340,name:'shell'},{img:'breeze_mayorhouse',x:1290,y:600,w:460,name:'mayor'},
  {img:'breeze_clamhouse',x:700,y:1140,w:350,name:'clam'},{img:'breeze_clamhouse',x:1310,y:1140,w:350,name:'clam2',flip:true},{img:'breeze_shellhouse',x:2030,y:850,w:300,name:'shell2',flip:true}];
const BVFOUNT={x:1000,y:930,w:380};
const inBV=()=>lum.x>BVX-300;
const BVH_=(a,b)=>hash(a,b,6271);
/* the land outlines (region coords), each traced so the sea lies to the left of the way round: the green with the road down from its
   south edge, and the islet */
const BVROAD=100;
const BVLAND=(()=>{const P=[[BVC.x+BVROAD,BVH+300]],a0=Math.asin(BVROAD/BVC.r);for(let a=Math.PI/2-a0;a>-Math.PI*1.5+a0;a-=.035)P.push([BVC.x+Math.cos(a)*BVC.r,BVC.y+Math.sin(a)*BVC.r]);
  P.push([BVC.x-BVROAD,BVC.y+Math.sqrt(BVC.r*BVC.r-BVROAD*BVROAD)],[BVC.x-BVROAD,BVH+300]);return P;})();
const BVISLE=(()=>{const P=[];for(let a=Math.PI/2;a>-Math.PI*1.5;a-=.06)P.push([BVI.x+Math.cos(a)*BVI.r,BVI.y+Math.sin(a)*BVI.r]);return P;})();
/* cobbled paths: round the fountain, out to each door, the gate, the bridge and the north way */
const BVCOB=(()=>{const F=BVFOUNT,ring=[];for(let a=0;a<=TAU+.01;a+=.2)ring.push([F.x+Math.cos(a)*230,F.y-50+Math.sin(a)*135]);
  const to=(x,y)=>{const a=Math.atan2(y-(F.y-50),x-F.x);return [[F.x+Math.cos(a)*230,F.y-50+Math.sin(a)*135],[(F.x+x)/2+(BVH_(x,1)-.5)*40,(F.y-50+y)/2+(BVH_(y,2)-.5)*30],[x,y]];};
  return [ring,...BVHOUSES.slice(0,4).map(h=>to(h.x,h.y+40)),to(BVGATE.x,BVGATE.y-30),to(BVBR.x0+20,BVBR.y),to(BVNORTH.x,BVNORTH.y+30)].map(P=>smoothPath(P));})();
function bvSolid(lx,ly){for(const h of BVHOUSES){const cy=h.y-h.w*.13;if(((lx-h.x)/(h.w*.43))**2+((ly-cy)/(h.w*.17))**2<1)return true;}
  if(((lx-BVFOUNT.x)/(BVFOUNT.w*.47))**2+((ly-BVFOUNT.y+BVFOUNT.w*.12)/(BVFOUNT.w*.2))**2<1)return true;
  if(Math.abs(ly-BVGATE.y)<34&&Math.abs(lx-BVGATE.x)>74&&Math.abs(lx-BVGATE.x)<210)return true;   /* the gateposts and their stone footings */
  for(const [tx,ty] of BVTRUNKS)if(Math.abs(lx-tx)<32&&ly-ty<14&&ty-ly<22)return true;
  return false;}
const BVTRUNKS=[];
/* where Lum may walk: the green, the road, the islet and over the bridge */
function bvBridgeY(lx){const t=clamp((lx-BVBR.x0)/(BVBR.x1-BVBR.x0),0,1);return BVBR.y-BVBR.rise*Math.sin(Math.PI*t);}
function bvFree(x,y){const lx=x-BVX,ly=y-BVY;
  if(lx>BVBR.x0+30&&lx<BVBR.x1-30)return Math.abs(ly-bvBridgeY(lx))<30;   /* over the bridge */
  if(lx>BVBR.x0-60&&lx<=BVBR.x0+30&&Math.abs(ly-BVBR.y)<30)return true;
  if(lx>=BVBR.x1-30&&lx<BVBR.x1+60&&Math.abs(ly-BVBR.y)<30)return true;
  let ok=Math.hypot(lx-BVC.x,ly-BVC.y)<BVC.r-55||Math.hypot(lx-BVI.x,ly-BVI.y)<BVI.r-40||(Math.abs(lx-BVC.x)<BVROAD-25&&ly>BVC.y&&ly<BVH-40);
  if(ly<BVNORTH.y-30)ok=false;
  return ok&&!bvSolid(lx,ly);}
/* hydrangeas, tinted per house so each doorstep has its own colour (the designer's coastal flowers, smaller here) */
const BVTINT={};
function bvTinted(img,k){const key=img+'|'+k;if(BVTINT[key])return BVTINT[key];const im=IMG[img];if(!ready(im))return null;
  const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);
  const T_={pink:[-35,1.25,.04],coral:[-65,1.3,.06],blue:[-12,1.15,0],lilac:[25,1.1,.03],cream:[0,.18,.22],white:[0,.08,.3]}[k]||[0,1,0];
  try{const d=g.getImageData(0,0,c.width,c.height),p=d.data,a=T_[0]*Math.PI/180,co=Math.cos(a),si=Math.sin(a);
    const M=[.213+co*.787-si*.213,.715-co*.715-si*.715,.072-co*.072+si*.928,.213-co*.213+si*.143,.715+co*.285+si*.140,.072-co*.072-si*.283,.213-co*.213-si*.787,.715-co*.715+si*.715,.072+co*.928+si*.072];
    for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const r=p[i],gg=p[i+1],b=p[i+2],sat=Math.max(r,gg,b)-Math.min(r,gg,b);if(sat<18&&r+gg+b<200)continue;   /* keep the ink lines */
      let R=M[0]*r+M[1]*gg+M[2]*b,G=M[3]*r+M[4]*gg+M[5]*b,B=M[6]*r+M[7]*gg+M[8]*b;const L=.3*R+.59*G+.11*B;R=L+(R-L)*T_[1];G=L+(G-L)*T_[1];B=L+(B-L)*T_[1];
      R+=(255-R)*T_[2];G+=(255-G)*T_[2];B+=(255-B)*T_[2];p[i]=R;p[i+1]=G;p[i+2]=B;}g.putImageData(d,0,0);}catch(e){}
  return BVTINT[key]=c;}
/* the bridge's front handrail and its posts (image px of the 700-wide art), redrawn over Lum */
function drawBVBridgeFront(o){const im=IMG.breeze_bridge;if(!ready(im))return;const k=o.w/im.naturalWidth,h=im.naturalHeight*k,x0=o.x-o.w/2,y0=o.y-60+BVBR.h*.16-h;
  const top=x=>47+90*((x-350)/290)**2;ctx.save();ctx.beginPath();
  ctx.moveTo(x0+0*k,y0+(top(0)-4)*k);for(let x=10;x<=700;x+=10)ctx.lineTo(x0+x*k,y0+(top(x)-4)*k);for(let x=700;x>=0;x-=10)ctx.lineTo(x0+x*k,y0+(top(x)+17)*k);ctx.closePath();
  for(const [a,b] of [[0,34],[166,186],[338,360],[512,534],[666,700]])ctx.rect(x0+a*k,y0+(top((a+b)/2)-2)*k,(b-a)*k,(232-top((a+b)/2))*k);
  ctx.clip('nonzero');ctx.drawImage(im,x0,y0,o.w,h);ctx.restore();}
function drawBVFlower(o){const im=bvTinted(o.img,o.tint);if(!im)return;const w=o.w,h=w*im.height/im.width;ctx.save();ctx.translate(o.x,o.y);if(o.flip)ctx.scale(-1,1);
  ctx.fillStyle='rgba(20,30,15,.22)';ctx.beginPath();ctx.ellipse(0,0,w*.36,w*.1,0,0,TAU);ctx.fill();ctx.drawImage(im,-w/2,-h*.96,w,h);ctx.restore();}
function bvProps(P){const X=x=>x+BVX,Y=y=>y+BVY;
  for(const h of BVHOUSES)P.push({t:'tree',img:h.img,x:X(h.x),y:Y(h.y),w:h.w,flip:!!h.flip,base:.97,solid:1});
  P.push({t:'tree',img:'breeze_fountain',x:X(BVFOUNT.x),y:Y(BVFOUNT.y),w:BVFOUNT.w,flip:false,base:.95,solid:1});
  P.push({t:'tree',img:'breeze_gate',x:X(BVGATE.x),y:Y(BVGATE.y+14),w:420,flip:false,base:.97,solid:1});
  P.push({t:'tree',img:'breeze_bridge',x:X((BVBR.x0+BVBR.x1)/2),y:Y(BVBR.y+BVBR.h*.16),sy:Y(BVBR.y-BVBR.rise-60),w:BVBR.w,flip:false,base:1});   /* the whole bridge, behind Lum */
  P.push({t:'bvbrf',x:X((BVBR.x0+BVBR.x1)/2),y:Y(BVBR.y+60),w:BVBR.w});   /* its front handrail and posts again, in front of her: she walks between the rails */
  /* hydrangeas at each doorstep, in that house's colours, and a few along the paths and round the fountain */
  const TINTS={shell:['blue','lilac'],mayor:['cream','white'],clam:['pink','coral'],clam2:['coral','pink'],shell2:['lilac','blue']},HY=['hydrsmall','hydrmid','hydrbig'];
  for(const h of BVHOUSES){const tt=TINTS[h.name];for(let j=0;j<4;j++){const side=j<2?-1:1,lx=h.x+side*(h.w*.3+(j%2)*58)+(BVH_(j,h.x)-.5)*16,ly=h.y+20+(j%2)*26;
    P.push({t:'bvf',img:HY[(j+h.x)%3],tint:tt[j%2],x:X(lx),y:Y(ly),w:(70+BVH_(j,h.y)*30),flip:BVH_(j,7)<.5});}}
  for(let i=0;i<10;i++){const a=i/10*TAU+.3,lx=BVFOUNT.x+Math.cos(a)*290,ly=BVFOUNT.y-50+Math.sin(a)*175;if(Math.abs(Math.sin(a))>.85||Math.abs(Math.cos(a))>.93)continue;
    P.push({t:'bvf',img:HY[i%3],tint:['pink','blue','lilac','cream','coral'][i%5],x:X(lx),y:Y(ly),w:62+BVH_(i,9)*22,flip:i%2===0});}
  /* a ring of evergreens and shrubs round the rim of the green, leaving the gate, the bridge and the north way open */
  let k=0;for(let a=0;a<TAU;a+=.13){k++;const r=BVC.r-80-BVH_(k,11)*40,lx=BVC.x+Math.cos(a)*r,ly=BVC.y+Math.sin(a)*r;
    const near=(px,py,m)=>Math.hypot(lx-px,ly-py)<m;if(near(BVGATE.x,BVGATE.y,250)||near(BVBR.x0,BVBR.y,190)||near(BVNORTH.x,BVNORTH.y,180)||BVHOUSES.some(h=>near(h.x,h.y-h.w*.2,h.w*.62)))continue;
    if(BVH_(k,12)<.42){const [img,w]=HTREES[Math.floor(BVH_(k,13)*HTREES.length)];BVTRUNKS.push([lx,ly]);P.push({t:'tree',img,x:X(lx),y:Y(ly),w:w*(.7+BVH_(k,14)*.25),flip:BVH_(k,15)<.5,base:.95});}
    else{const kk=[1,3,10,5][Math.floor(BVH_(k,16)*4)];P.push({t:'shrub',k:kk,x:X(lx),y:Y(ly),s:SHR[kk].s*(.7+BVH_(k,17)*.3),flip:BVH_(k,18)<.5,ph:lx*.01,w:120});}}
  /* rocks where the cliff face fades out (left and right of the green and the islet), softening the turn of the shore */
  for(const [C,r0,sc] of [[BVC,BVC.r,1],[BVI,BVI.r,.7]])for(const side of [-1,1])for(const [da,dr,img,w] of [[0,40,'crockheap',200],[.13,70,'crockpile',150],[-.12,30,'crockegg',90]]){
    const a=side>0?.24+da:Math.PI-.24-da,lx=C.x+Math.cos(a)*(r0+dr*sc),ly=C.y+Math.sin(a)*(r0+dr*sc);if(Math.abs(lx-(BVBR.x0+BVBR.x1)/2)<200&&Math.abs(ly-BVBR.y)<200)continue;
    P.push({t:'tree',img,x:X(lx),y:Y(ly+40*sc),w:w*sc,flip:side<0,base:.9});}
  /* rocks on the cliffs either side of the road down from the gate, and a few out in the sea */
  for(const [lx,ly,img,w] of [[790,1640,'crockheap',180],[1220,1680,'crockpile',160],[780,1900,'crockpile',150],[1230,1940,'crockheap',190],[200,1600,'crockspire',240],[1800,1550,'crockheap',220],[2250,1300,'crockspire',210],[180,300,'crockheap',200],[1750,250,'crockspire',220],[2300,500,'crockpile',170]])
    P.push({t:'tree',img,x:X(lx),y:Y(ly),w,flip:lx%2<1,base:.9});}
/* ground: the sea round everything, the designer's cliff strip down every edge, the road, and the cobbles */
let BVROADP=null,BVCOBCV=null;
function drawBVStrip(pts){const im=IMG.cliff_edge;if(!ready(im))return;const BAND=140,k=BAND/im.naturalHeight,iw=im.naturalWidth;let u=0;
  for(let i=0;i<pts.length-1;i++){const [ax,ay]=pts[i],[bx,by]=pts[i+1],dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,ox=-dy/L,oy=dx/L;let left=(L+10)/k,du=-5/k;
    const vis=clamp((oy-.12)/.3,0,1);if(vis<=0){u=(u+L/k)%iw;continue;}   /* seen from the south: only the cliff faces turned toward us show */
    ctx.save();ctx.globalAlpha=vis;ctx.translate(ax,ay);ctx.transform(dx/L,dy/L,ox,oy,0,0);while(left>0){const sw=Math.min(left,iw-u);ctx.drawImage(im,u,0,sw,im.naturalHeight,du*k,0,sw*k,BAND);du+=sw;left-=sw;u=(u+sw)%iw;}u=(u-10/k+iw*4)%iw;ctx.restore();}}
function drawBVGround(x0,y0,x1,y1){if(x1<BVX-300)return;
  ctx.save();ctx.translate(BVX,BVY);
  const poly=P=>{P.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
  ctx.beginPath();ctx.rect(-400,-400,BVW+800,BVH+800);poly(BVLAND);poly(BVISLE);ctx.fillStyle=waterPattern(ctx,'water_tile',.6)||'#2f5f78';ctx.fill('evenodd');   /* the designer's water art */
  for(const P of [BVLAND,BVISLE]){ctx.beginPath();poly(P);ctx.lineJoin='round';ctx.strokeStyle='rgba(235,245,250,.45)';ctx.lineWidth=18;ctx.stroke();ctx.strokeStyle='#6b5639';ctx.lineWidth=9;ctx.stroke();}   /* a low earthy bank with a line of surf where the far shore meets the sea */
  drawBVStrip(BVLAND);drawBVStrip([...BVISLE,BVISLE[0]]);
  ctx.restore();
  if(!BVROADP)BVROADP=buildPath([[BVGATE.x,BVGATE.y-40],[BVGATE.x,BVGATE.y+200],[BVGATE.x-8,BVH-150],[BVGATE.x,BVH+300]].map(([x,y])=>[x+BVX,y+BVY]),150,6.1);
  drawPath(BVROADP,x0,x1);
  if(!BVCOBCV&&ready(IMG.cobble_strip))BVCOBCV=buildBVCobbles();
  if(BVCOBCV){const [cv,ox,oy,K]=BVCOBCV;ctx.drawImage(cv,BVX+ox,BVY+oy,cv.width/K,cv.height/K);}}
/* the cobbled paths, laid once onto their own canvas (a mossy bed, then the designer's cobble strip twice side by side) */
const BVPAVE=BVC.r-150;   /* the paved square: everything inside this radius is cobbled, with a ring of grass beyond it */
function buildBVCobbles(){const K=.9,R=BVPAVE+30,ox=BVC.x-R,oy=BVC.y-R,S=R*2,c=document.createElement('canvas');c.width=Math.ceil(S*K);c.height=Math.ceil(S*K);const g=c.getContext('2d');
  g.setTransform(K,0,0,K,-ox*K,-oy*K);
  g.fillStyle='#8f8b78';g.beginPath();g.arc(BVC.x,BVC.y,BVPAVE,0,TAU);g.fill();   /* a stone-grey bed, so nothing green shows between the rows */
  g.save();g.beginPath();g.arc(BVC.x,BVC.y,BVPAVE,0,TAU);g.clip();
  for(let y=BVC.y-BVPAVE-40,row=0;y<BVC.y+BVPAVE+40;y+=COB_W*.8,row++){const sh=row%2?37:0,sm=smoothPath([[BVC.x-BVPAVE-80-sh,y],[BVC.x+BVPAVE+80,y]]);drawStrip(g,IMG.cobble_strip,sm,false);}   /* rows of the designer's cobbles, overlapping, every other row shifted */
  g.restore();
  g.lineWidth=26;g.strokeStyle='rgba(84,92,58,.55)';g.beginPath();g.arc(BVC.x,BVC.y,BVPAVE,0,TAU);g.stroke();g.lineWidth=8;g.strokeStyle='rgba(60,66,44,.6)';g.stroke();   /* a mossy kerb where the paving meets the grass */
  return [c,ox,oy,K];}
/* the fountain plays: rings on its basin and a soft mist at the top jet */
function drawBVFx(){if(!inBV()||SCENE!=='thorn')return;const fx=BVX+BVFOUNT.x,fy=BVY+BVFOUNT.y,w=BVFOUNT.w;ctx.save();
  for(let i=0;i<5;i++){const q=(T*.45+i/5)%1,a=i*1.3;ctx.strokeStyle=`rgba(235,245,250,${(.5*(1-q)).toFixed(3)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(fx+Math.cos(a)*w*.22,fy-w*.18+Math.sin(a)*w*.05,6+q*26,(6+q*26)*.35,0,0,TAU);ctx.stroke();}
  drawGlow(ctx,fx,fy-w*.78,46+Math.sin(T*3)*6,'235,245,252',.35);ctx.restore();}
function enterBreezevale(){SCENE='thorn';lum.x=BVX+BVSOUTH.x;lum.y=BVY+BVSOUTH.y-60;lum.face=1;lum.dir='up';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-200;THORN.t=99;BVT.t=0;}
/* playtest card: the story up to the morning after at Amroth's (Lum alone, Amroth stays home), then the Breezeway's east end */
function chPlaytestBreezeway(){HST.st=7;HST.amrOut=1;if(typeof C2!=='undefined'){C2.joined=0;}if(PARTY_ORDER.includes('amroth'))PARTY_ORDER.splice(PARTY_ORDER.indexOf('amroth'),1);
  {const i=BAG.indexOf('baby');if(i>=0)BAG.splice(i,1);}hsGoal('Follow the coast east to Breezevale Cove');enterBWEast();BWT.t=0;}
/* back on the Breezeway, at its east end */
function enterBWEast(){SCENE='thorn';let b=null;for(const p of BPATH_PTS)if(p[0]<BWX+BWW-125&&(!b||p[0]>b[0]))b=p;lum.x=b[0];lum.y=b[1];lum.face=-1;lum.dir='side';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BWT.t=99;}
function drawBVTitle(){if(!inBV()||BVT.t>=4.5||SCENE!=='thorn')return;BVT.t+=1/60;const a=Math.min(1,BVT.t*1.5,(4.5-BVT.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(20,16,12,.55)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f6ecd8';ctx.font=`600 ${Math.round(Math.min(30,W/13))}px Georgia,serif`;ctx.fillText('Breezevale Cove',W/2,H*.3+10);ctx.restore();}
/* the way back down to the Breezeway, the way north (the Sanctuary of Water, still to come), and the house doors (no one answers yet) */
THINT.push({get x(){return BVX+BVSOUTH.x;},get y(){return BVY+BVSOUTH.y;},get reach(){return inBV()?80:-1;},door:true,onInteract:()=>goScene(enterBWEast)},
  {get x(){return BVX+BVNORTH.x;},get y(){return BVY+BVNORTH.y;},get reach(){return inBV()?85:-1;},door:true,onInteract:()=>say("The way to the Sanctuary of Water lies beyond.")});
for(const h of BVHOUSES)THINT.push({x:BVX+h.x+(h.flip?-1:1)*h.w*.04,y:BVY+h.y+24,get reach(){return inBV()?78:-1;},onInteract:()=>say(h.name==='mayor'?"The Mayor's house. No one answers.":"Lum knocks. No one answers.")});
