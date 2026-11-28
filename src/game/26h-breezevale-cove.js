/* ---------- Chapter 2: Breezevale Cove, east of the Coastal Breezeway ----------
   Laid out from the designer's sketch: the town is a round green on a cliff over the sea, with cobbled paths round the fountain
   and out to each house. Shell house top-left, the Mayor's house top-right, clam houses bottom-left and bottom-right; a small
   bridge east over the water to a raised islet with the second shell house. The Breezevale gate at the south, a road down to the
   way back to the Breezeway; north, the way on to the Sanctuary of Water (still to come). Built as another region of the
   Stranglethorn world, east of the Breezeway. Townsfolk still to come. */
const BVX=BWX+5200,BVY=500,BVW=2950,BVH=2400,BVT={t:99};
const BVC={x:1050,y:950,r:850},BVI={x:2450,y:850,r:350};   /* the town green, and the islet */
const BVGATE={x:BVC.x,y:BVC.y+BVC.r+10},BVSOUTH={x:BVC.x,y:BVC.y+BVC.r-58},BVBOT=BVC.y+BVC.r+420,BVNORTH={x:BVC.x,y:BVC.y-BVC.r+70};
/* the stone bridge north from the green over the sea toward the Sanctuary of Water (the designer's middle bridge, recoloured blue); its door is at the far end */
const BVSBR={x:BVC.x,y1:BVC.y-BVC.r+125,w:300,h:614};BVSBR.y0=BVSBR.y1-BVSBR.h;   /* its foot rests on the edge of the cobbles */
const BVTOP=BVSBR.y1-400;   /* the view stops with just the start of the bridge showing */
const BVSDOOR={x:BVSBR.x,y:BVSBR.y1-150};   /* the way on, a little way along the bridge */
const BVBR={x0:1880,x1:2130,y:850,w:270};BVBR.h=BVBR.w*346/700;BVBR.rise=BVBR.h*.29;   /* the bridge: deck ends at y, the deck (between the two handrails) rises in the middle */
/* door: where the front door is across the art (0..1, unflipped); smoke: the chimney top (u,v of the art), if it has one */
const BVHOUSES=[{img:'breeze_shellhouse',x:560,y:650,w:465,name:'shell',flip:true,noR:1,door:.34,smoke:[.28,.19]},{img:'breeze_shellhouse',x:1420,y:620,w:620,name:'mayor',door:.36,smoke:[.28,.19]},
  {img:'breeze_clamhouse',x:590,y:1370,w:600,name:'clam',door:.86},{img:'breeze_clamhouse',x:1510,y:1370,w:600,name:'clam2',flip:true,door:.86},{img:'breeze_shellhouse',x:2495,y:875,w:620,name:'shell2',door:.36,smoke:[.28,.19]}];
const bvDoorX=h=>h.x+(h.door-.5)*h.w*(h.flip?-1:1);
/* a house's yard: two curves of grass, from up each side of the house, round its front corners, to either side of the door */
function bvYard(h){const L=h.x-h.w*.45,R=h.x+h.w*.45,d=bvDoorX(h),y=h.y+8,up=h.y-h.w*.2,gap=80,out=[];
  if(!h.noL)out.push(d-L>gap+120?[[L-8,up],[L-14,y-30],[L+30,y],[d-gap,y]]:[[L-8,up],[L-14,y-30],[L+12,y]]);   /* a short side (door near the corner) only wraps the corner */
  if(!h.noR)out.push(R-d>gap+120?[[d+gap,y],[R-30,y],[R+14,y-30],[R+8,up]]:[[R-12,y],[R+14,y-30],[R+8,up]]);return out;}
const BVFOUNT={x:1050,y:990,w:760};
const BVFOUNT_ROWS=[[.40,.48,.28,.79],[.48,.68,.217,.851],[.68,.96,0,1],[.96,.99,.16,.84]]   /* down to where Lum would be drawn behind it, the full width */;
const bvFP=(u,v)=>{const F=BVFOUNT,h=F.w*633/1100;return [BVX+F.x+(u-.5)*F.w,BVY+F.y-h*.95+v*h];};   /* a point on the fountain art (u,v across it) */
const inBV=()=>lum.x>BVX-300&&lum.x<ISX-300;
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
function bvSolid(lx,ly){for(const h of BVHOUSES){const im=IMG[h.img],hh=ready(im)?h.w*im.naturalHeight/im.naturalWidth:h.w*.8;if(Math.abs(lx-h.x)<h.w*.45&&ly<h.y+16&&ly>h.y-hh*.6)return true;}   /* the house's ground, from its front step back to where the roof rises: in front Lum can't overlap the walls, behind it she stays visible above the roof line */   /* the whole footprint of each house, porches included */
  {const fh=BVFOUNT.w*633/1100,r=(ly-BVFOUNT.y)/fh+.95,u=(lx-BVFOUNT.x)/BVFOUNT.w+.5;   /* the basin, tier by tier, traced from the art's outline (row r, column u of the picture) */
   for(const [r0,r1,u0,u1] of BVFOUNT_ROWS)if(r>=r0&&r<r1&&u>u0-.02&&u<u1+.02)return true;}
  if(Math.abs(ly-BVGATE.y+60)<34&&Math.abs(lx-BVGATE.x)>128&&Math.abs(lx-BVGATE.x)<262)return true;   /* the gateposts and their stone footings */
  if(((lx-BVGIRL.x)/30)**2+((ly-BVGIRL.y)/14)**2<1)return true;   /* the townsgirl */
  for(const [tx,ty] of BVTRUNKS)if(Math.abs(lx-tx)<32&&ly-ty<14&&ty-ly<22)return true;
  return false;}
const BVTRUNKS=[];
const BVISLEPATH=()=>{const h=BVHOUSES[4];return [[BVBR.x1-10,BVBR.y],[BVBR.x1+90,BVBR.y+40],[bvDoorX(h)-30,h.y+60],[bvDoorX(h),h.y+10],[bvDoorX(h),h.y-48]];};   /* right up under the door step */
function bvIslePathDist(x,y){const P=BVISLEPATH();let b=1e9;for(let i=0;i<P.length-1;i++){const [ax,ay]=P[i],[bx,by]=P[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);b=Math.min(b,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return b;}
/* where Lum may walk: the green, the road, the islet and over the bridge */
function bvBridgeY(lx){const t=clamp((lx-BVBR.x0)/(BVBR.x1-BVBR.x0),0,1);return BVBR.y-BVBR.h*(.02+.26*Math.sin(Math.PI*t)**.8);}   /* the middle of the deck, between the two handrails, all the way across */
function bvFree(x,y){const lx=x-BVX,ly=y-BVY;
  if(lx>BVBR.x0+30&&lx<BVBR.x1-30)return Math.abs(ly-bvBridgeY(lx))<40;   /* over the bridge */
  if(lx>BVBR.x0-60&&lx<=BVBR.x0+30&&Math.abs(ly-BVBR.y)<30)return true;
  if(lx>=BVBR.x1-30&&lx<BVBR.x1+60&&Math.abs(ly-BVBR.y)<30)return true;
  let ok=Math.hypot(lx-BVC.x,ly-BVC.y)<BVC.r-55||Math.hypot(lx-BVI.x,ly-BVI.y)<BVI.r-40||false;
  if(ly<BVNORTH.y-30)ok=false;
  if(Math.abs(lx-BVSBR.x)<36&&ly>BVSDOOR.y-12&&ly<BVSBR.y1)return true;   /* along the bridge deck, between its stone rails */
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
  P.push({t:'bvgirl',x:X(BVGIRL.x),y:Y(BVGIRL.y),w:80});
  P.push({t:'tree',img:'breeze_fountain',x:X(BVFOUNT.x),y:Y(BVFOUNT.y),w:BVFOUNT.w,flip:false,base:.95,solid:1});
  P.push({t:'tree',img:'breeze_gate2',x:X(BVGATE.x),y:Y(BVGATE.y-50),w:520,flip:false,base:.98,solid:1});   /* the designer's driftwood archway (no doors), its footing stones on the rim of the green */
  /* small boulders down both edges of the road, covering the seam where it meets the cliff faces */
  for(const side of [-1,1]){let y=BVGATE.y+15+BVH_(side,70)*40,i=0;while(y<BVBOT+120){const k=i*2+(side>0),r=BVH_(k,71),w=30+BVH_(k,73)**1.6*48;   /* uneven gaps, sizes and offsets so the rows don't read as rows */
    P.push({t:'tree',img:['crockegg','crockpile','crockheap','crockegg','crockpile'][Math.floor(BVH_(k,75)*5)],x:X(BVC.x+side*(BVROAD+4+r*26)),y:Y(y),w,flip:BVH_(k,74)<.5,base:.9});
    if(BVH_(k,76)<.4)P.push({t:'tree',img:BVH_(k,77)<.5?'crockegg':'crockpile',x:X(BVC.x+side*(BVROAD+w*.55+10+BVH_(k,78)*14)),y:Y(y+8+BVH_(k,79)*18),w:20+BVH_(k,80)*14,flip:BVH_(k,81)<.5,base:.9});   /* a pebble tucked beside some */
    y+=45+w*.6+BVH_(k,72)*90;i++;}}
  /* grass and small flowers tucked along the gate's footings, hiding where they meet the cliff and the road */
  for(const [dx,dy,k] of [[-262,-40,'t'],[-232,-30,'f'],[-196,-36,'t'],[-112,-46,'t'],[-96,-34,'f'],[96,-34,'f'],[112,-46,'t'],[196,-36,'t'],[232,-30,'f'],[262,-40,'t'],[-82,-6,'t'],[82,-6,'t']])
    if(k==='t')P.push({t:'tuft',w:40,x:X(BVGATE.x+dx),y:Y(BVGATE.y+dy),n:6,h:26+Math.abs(dx)%7*2,hue:.4});
    else P.push({t:'bvf',img:'hydrsmall',tint:['pink','blue','lilac'][Math.abs(dx)%3],x:X(BVGATE.x+dx),y:Y(BVGATE.y+dy),w:46,flip:dx<0});
  P.push({t:'tree',img:'breeze_bridge',x:X((BVBR.x0+BVBR.x1)/2),y:Y(BVBR.y+BVBR.h*.16),sy:Y(BVBR.y-BVBR.rise-60),w:BVBR.w,flip:false,base:1});   /* the whole bridge, behind Lum */
  for(const [dx,dy,img,w] of [[8,62,'crockpile',80],[60,84,'crockegg',46],[-40,78,'crockegg',42],[125,96,'crockegg',40],[190,84,'crockegg',44],[244,64,'crockpile',80],[290,82,'crockegg',42]])   /* small boulders in the water under the bridge, hiding where the shores drop away */
    P.push({t:'tree',img,x:X(BVBR.x0+dx),y:Y(BVBR.y+dy),w,flip:dx%2===0,base:.9});
  P.push({t:'bvbrf',x:X((BVBR.x0+BVBR.x1)/2),y:Y(BVBR.y+60),w:BVBR.w});   /* its front handrail and posts again, in front of her: she walks between the rails */
  /* hydrangeas at each doorstep, in that house's colours, and a few along the paths and round the fountain */
  const TINTS={shell:['blue','lilac'],mayor:['cream','white'],clam:['pink','coral'],clam2:['coral','pink'],shell2:['lilac','blue']},HY=['hydrsmall','hydrmid','hydrbig'];
  for(const h of BVHOUSES.slice(0,4)){const tt=TINTS[h.name];let j=0;for(const C_ of bvYard(h)){const sm=smoothPath(C_),L_=sm[sm.length-1].s;for(let d=20;d<L_-10;d+=62){const p=sm.find(q=>q.s>=d);j++;
    P.push({t:'bvf',img:HY[(j+h.x)%3],tint:tt[j%2],x:X(p.x),y:Y(p.y+14),w:(60+BVH_(j,h.y)*24),flip:BVH_(j,7)<.5});}}}
  {const h=BVHOUSES[4],tt=TINTS.shell2;let q=0;for(let a=0;a<TAU;a+=.32){for(const rr of [.62,.86]){q++;const lx=BVI.x+Math.cos(a+rr)*BVI.r*rr,ly=BVI.y+Math.sin(a+rr)*BVI.r*rr*.9+30;
      if(((lx-h.x)/(h.w*.47))**2+((ly-(h.y-h.w*.16))/(h.w*.22))**2<1)continue;if(bvIslePathDist(lx,ly)<70)continue;   /* not on the house, nor on the path from the bridge */
      P.push({t:'bvf',img:HY[q%3],tint:tt[q%2],x:X(lx),y:Y(ly),w:60+BVH_(q,31)*30,flip:q%2===0});}}}
  for(let i=0;i<0;i++){const a=i/10*TAU+.3,lx=BVFOUNT.x+Math.cos(a)*290,ly=BVFOUNT.y-50+Math.sin(a)*175;if(Math.abs(Math.sin(a))>.85||Math.abs(Math.cos(a))>.93)continue;
    P.push({t:'bvf',img:HY[i%3],tint:['pink','blue','lilac','cream','coral'][i%5],x:X(lx),y:Y(ly),w:62+BVH_(i,9)*22,flip:i%2===0});}
  /* a ring of evergreens and shrubs round the rim of the green, leaving the gate, the bridge and the north way open */
  let k=0;for(let a=0;a<TAU;a+=.13){k++;const r=BVC.r-38-BVH_(k,11)*14,lx=BVC.x+Math.cos(a)*r,ly=BVC.y+Math.sin(a)*r;
    const near=(px,py,m)=>Math.hypot(lx-px,ly-py)<m;if(near(BVGATE.x,BVGATE.y,250)||near(BVBR.x0,BVBR.y,330)||near(BVNORTH.x,BVNORTH.y,180)||BVHOUSES.some(h=>near(h.x,h.y-h.w*.2,h.w*.62)))continue;
    if(BVH_(k,12)<.42){const [img,w]=HTREES[Math.floor(BVH_(k,13)*HTREES.length)];BVTRUNKS.push([lx,ly]);P.push({t:'tree',img,x:X(lx),y:Y(ly),w:w*(.7+BVH_(k,14)*.25),flip:BVH_(k,15)<.5,base:.95});}
    else{const kk=[1,3,10,5][Math.floor(BVH_(k,16)*4)];P.push({t:'shrub',k:kk,x:X(lx),y:Y(ly),s:SHR[kk].s*(.7+BVH_(k,17)*.3),flip:BVH_(k,18)<.5,ph:lx*.01,w:120});}}
  /* rocks where the cliff face fades out (left and right of the green and the islet), softening the turn of the shore */
  for(const [C,r0,sc] of [[BVC,BVC.r,1],[BVI,BVI.r,.7]])for(const side of [-1,1])for(const [da,dr,img,w] of [[0,40,'crockheap',200],[.13,70,'crockpile',150],[-.12,30,'crockegg',90]]){
    const a=side>0?.24+da:Math.PI-.24-da,lx=C.x+Math.cos(a)*(r0+dr*sc),ly=C.y+Math.sin(a)*(r0+dr*sc);if(Math.abs(lx-(BVBR.x0+BVBR.x1)/2)<200&&Math.abs(ly-BVBR.y)<200)continue;
    P.push({t:'tree',img,x:X(lx),y:Y(ly+40*sc),w:w*sc,flip:side<0,base:.9});}
  /* rocks on the cliffs either side of the road down from the gate, and a few out in the sea */
  for(const [lx,ly,img,w] of [[840,1940,'crockheap',180],[1270,1980,'crockpile',160],[830,2250,'crockpile',150],[1280,2290,'crockheap',190],[200,1600,'crockspire',240],[1800,1550,'crockheap',220],[2250,1300,'crockspire',210],[180,300,'crockheap',200],[1750,250,'crockspire',220],[2300,500,'crockpile',170]])
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
  ctx.beginPath();ctx.rect(-400,BVTOP-400,BVW+800,BVH-BVTOP+800);poly(BVLAND);poly(BVISLE);ctx.fillStyle=waterPattern(ctx,'water_tile',.6)||'#2f5f78';ctx.fill('evenodd');   /* the designer's water art */
  drawBVStrip(BVLAND);drawBVStrip([...BVISLE,BVISLE[0]]);
  ctx.restore();
  if(!BVROADP)BVROADP=buildPath([[BVGATE.x,BVGATE.y-40],[BVGATE.x,BVGATE.y+200],[BVGATE.x-8,BVH-150],[BVGATE.x,BVH+300]].map(([x,y])=>[x+BVX,y+BVY]),150,6.1);
  drawPath(BVROADP,x0,x1);
  if(!BVCOBCV&&ready(IMG.cobble_strip))BVCOBCV=buildBVCobbles();
  if(BVCOBCV){const [cv,ox,oy,K]=BVCOBCV;ctx.drawImage(cv,BVX+ox,BVY+oy,cv.width/K,cv.height/K);}
  if(ready(IMG.sanctuary_bridge))ctx.drawImage(IMG.sanctuary_bridge,BVX+BVSBR.x-BVSBR.w/2,BVY+BVSBR.y0,BVSBR.w,BVSBR.h);   /* the bridge north, lying over the sea */
  if(ready(IMG.cobble_strip)){ctx.save();ctx.translate(BVX,BVY);drawStrip(ctx,IMG.cobble_strip,smoothPath(BVISLEPATH()),false);ctx.restore();}}   /* the islet's little path, bridge to door */
/* the cobbled paths, laid once onto their own canvas (a mossy bed, then the designer's cobble strip twice side by side) */
const BVPAVE=BVC.r-75;   /* the paved square: everything inside this radius is cobbled, with a ring of grass beyond it */
function buildBVCobbles(){const K=.9,R=BVPAVE+30,ox=BVC.x-R,oy=BVC.y-R,S=R*2,c=document.createElement('canvas');c.width=Math.ceil(S*K);c.height=Math.ceil(S*K);const g=c.getContext('2d');
  g.setTransform(K,0,0,K,-ox*K,-oy*K);
  g.fillStyle='#8f8b78';g.beginPath();g.arc(BVC.x,BVC.y,BVPAVE,0,TAU);g.fill();   /* a stone-grey bed, so nothing green shows between the rows */
  g.save();g.beginPath();g.arc(BVC.x,BVC.y,BVPAVE,0,TAU);g.clip();
  for(let y=BVC.y-BVPAVE-40,row=0;y<BVC.y+BVPAVE+40;y+=COB_W*.8,row++){const sh=row%2?37:0,sm=smoothPath([[BVC.x-BVPAVE-80-sh,y],[BVC.x+BVPAVE+80,y]]);drawStrip(g,IMG.cobble_strip,sm,false);}   /* rows of the designer's cobbles, overlapping, every other row shifted */
  g.restore();
  g.save();g.beginPath();g.arc(BVC.x,BVC.y,BVPAVE,0,TAU);g.clip();   /* yards stay inside the paved square: no odd patch on the grass ring */
  for(const h of BVHOUSES.slice(0,4))for(const P of bvYard(h)){   /* each house's yard: a strip of grass hugging its front and wrapping round its sides, cobbles left clear at the door */
    g.lineCap=g.lineJoin='round';g.beginPath();P.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.lineWidth=84;g.strokeStyle='rgba(70,76,52,.75)';g.stroke();g.lineWidth=74;g.strokeStyle='#5f7d45';g.stroke();
    g.fillStyle='rgba(120,150,80,.5)';for(let i=0;i<40;i++){const k=BVH_(i,h.x+P[0][0])*(P.length-1),j=Math.min(P.length-2,k|0),t=k-j,px=P[j][0]+(P[j+1][0]-P[j][0])*t+(BVH_(i,7)-.5)*50,py=P[j][1]+(P[j+1][1]-P[j][1])*t+(BVH_(i,8)-.5)*40;g.beginPath();g.ellipse(px,py,3,1.6,0,0,TAU);g.fill();}}
  g.restore();
  g.lineWidth=26;g.strokeStyle='rgba(84,92,58,.55)';g.beginPath();g.arc(BVC.x,BVC.y,BVPAVE,0,TAU);g.stroke();g.lineWidth=8;g.strokeStyle='rgba(60,66,44,.6)';g.stroke();   /* a mossy kerb where the paving meets the grass */
  return [c,ox,oy,K];}
/* the fountain plays: rings on its basin and a soft mist at the top jet */
function drawBVFx(){if(!inBV()||SCENE!=='thorn')return;if(C2.maiJoined&&jak2In()&&!C2.jakLeft&&!DLG.active&&!FADE.dir&&!WEVENT.on){JKLEAVE.w=(JKLEAVE.w||0)+1/60;if(JKLEAVE.w>.9)jakLeaves();}else JKLEAVE.w=0;   /* back from the ruins with Mai: Jak heads home */
drawJakLeaving();updateBVSnake();{const lx=lum.x-BVX;if(lx>BVBR.x0-20&&lx<BVBR.x1+20&&Math.abs(lum.y-BVY-bvBridgeY(lx))<45)lum.y=BVY+bvBridgeY(lx);}   /* on the bridge, Lum's feet follow the deck up and over the arch */const fx=BVX+BVFOUNT.x,fy=BVY+BVFOUNT.y,w=BVFOUNT.w;ctx.save();
  /* all of it kept tight to the art: rings on the lower pool, a little mist on the top jet, drops falling in the curtains, glints on the pool */
  for(let i=0;i<6;i++){const q=(T*.45+i/6)%1,[px,py]=bvFP(.3+BVH_(i,61)*.5,.665+BVH_(i,62)*.04),r=3+q*w*.025;ctx.strokeStyle=`rgba(235,245,250,${(.45*(1-q)).toFixed(3)})`;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(px,py,r,r*.35,0,0,TAU);ctx.stroke();}
  {const [jx,jy]=bvFP(.535,.06);drawGlow(ctx,jx,jy,w*.035+Math.sin(T*3)*3,'235,245,252',.3);}
  for(let i=0;i<16;i++){const q=(T*.8+i/16)%1,lane=[.45,.49,.53,.57,.61][i%5],[sx,sy]=bvFP(lane+(BVH_(i,63)-.5)*.01,.32+q*.32);ctx.fillStyle=`rgba(230,244,252,${(.5*(1-q*.6)).toFixed(3)})`;ctx.beginPath();ctx.arc(sx,sy,1.8,0,TAU);ctx.fill();}   /* drops in the falling curtains */
  for(let i=0;i<6;i++){const q=(T*.9+i/6)%1,[gx,gy]=bvFP(.3+BVH_(i,41)*.5,.665+BVH_(i,42)*.045);ctx.globalAlpha=Math.sin(q*Math.PI)*.7;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(gx,gy,1.5,0,TAU);ctx.fill();}ctx.globalAlpha=1;   /* glints on the pool */
  /* chimney smoke */
  for(const h of BVHOUSES){if(!h.smoke)continue;const im=IMG[h.img];if(!ready(im))continue;const hh=h.w*im.naturalHeight/im.naturalWidth,cx=BVX+h.x+(h.smoke[0]-.5)*h.w*(h.flip?-1:1),cy=BVY+h.y-hh*.97+h.smoke[1]*hh;
    for(let i=0;i<7;i++){const q=(T*.16+i/7+h.x*.001)%1,r=10+q*34;ctx.fillStyle=`rgba(225,228,232,${(.36*(1-q)*Math.min(1,q*6)).toFixed(3)})`;ctx.beginPath();ctx.arc(cx+Math.sin(q*5+i)*8+q*40,cy-q*150,r,0,TAU);ctx.fill();}}
  ctx.restore();
  /* white birds drifting over the town */
  const dt=1/60,vw=W/zoom,vh=H/zoom;if(!BVBIRDS.length)for(let i=0;i<3;i++)BVBIRDS.push({alive:false,t:-rnd(0,4),s:rnd(.42,.52),ph:rnd(0,TAU),flap:0});
  for(const b of BVBIRDS){if(!b.alive){b.t+=dt;if(b.t>0){const left=Math.random()<.5;b.x=cam.x+(left?-1:1)*(vw/2+60);b.y=cam.y-vh*.45+Math.random()*vh*.6;b.vx=(left?1:-1)*rnd(80,115);b.alive=true;b.t=0;b.spr=BIRD_SPR[(Math.random()*BIRD_SPR.length)|0];}continue;}
    b.t+=dt;b.x+=b.vx*dt;b.y+=Math.sin(b.t*1.3+b.ph)*-14*dt;b.flap+=dt*8;if(Math.abs(b.x-cam.x)>vw/2+160){b.alive=false;b.t=-rnd(3,8);continue;}
    const [idx,native]=b.spr,im=seabirdImg(idx);if(!im)continue;const bw=im.width*b.s,bh=im.height*b.s,beat=Math.sin(b.flap),dir=b.vx>0?1:-1;
    ctx.save();ctx.translate(b.x,b.y+beat*1.5);if(dir!==native)ctx.scale(-1,1);ctx.scale(1,.86+.14*beat);ctx.drawImage(im,-bw/2,-bh/2,bw,bh);ctx.restore();}}
const BVBIRDS=[];
/* a Breezevale townsgirl by the fountain */
const BVGIRL={x:BVFOUNT.x-130,y:BVFOUNT.y+60,face:1,talking:0};
function drawBVGirl(o){const G=BVGIRL,talking=DLG.active&&G.talking,an=talking&&Math.abs(lum.x-(BVX+G.x))>30?'side':'down';
  ctx.save();ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(o.x,o.y,22,7,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(o.x,0);ctx.scale(.86,1);ctx.translate(-o.x,0);c1Frame(ctx,'breeze_girl',an,0,o.x,o.y,BVFOLK_H,an==='side'&&lum.x>o.x,1,0);ctx.restore();if(!DLG.active)G.talking=0;}
function bvGirlTalk(){BVGIRL.talking=1;lum.face=lum.x<BVX+BVGIRL.x?1:-1;talk(C2.rainDone?[['Townsgirl',"The rain stopped… I can finally see the boats again."]]:[['Townsgirl',"Welcome to Breezevale Cove."],['Townsgirl',"The rain makes me so happy."]],false,()=>{BVGIRL.talking=0;});}
function enterBreezevale(){SCENE='thorn';lum.x=BVX+BVSOUTH.x;lum.y=BVY+BVSOUTH.y-4;lum.face=1;lum.dir='up';lum.state='idleUp';lum.at=-1e9;lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-200;THORN.t=99;BVT.t=0;if(!C2.bvArrived&&!C2.lumaMet){C2.bvArrived=1;setTimeout(()=>hsGoal('Find Sage Luma in Breezevale Cove'),1200);}}   /* first arrival: the task moves on */
/* playtest card: the story up to the morning after at Amroth's (Lum alone, Amroth stays home), then the Breezeway's east end */
function chPlaytestBreezeway(){HST.st=7;HST.amrOut=1;if(typeof C2!=='undefined'){C2.joined=0;}if(PARTY_ORDER.includes('amroth'))PARTY_ORDER.splice(PARTY_ORDER.indexOf('amroth'),1);
  {const i=BAG.indexOf('baby');if(i>=0)BAG.splice(i,1);}hsGoal('Follow the coast east to Breezevale Cove');enterBWEast();BWT.t=0;}
/* back on the Breezeway, at its east end */
function enterBWEast(){SCENE='thorn';let b=null;for(const p of BPATH_PTS)if(p[0]<BWX+BWW-125&&(!b||p[0]>b[0]))b=p;lum.x=b[0];lum.y=b[1];lum.face=-1;lum.dir='side';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BWT.t=99;}
function drawBVTitle(){if(!inBV()||BVT.t>=4.5||SCENE!=='thorn')return;BVT.t+=1/60;const a=Math.min(1,BVT.t*1.5,(4.5-BVT.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(20,16,12,.55)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f6ecd8';ctx.font=`600 ${Math.round(Math.min(30,W/13))}px Georgia,serif`;ctx.fillText('Breezevale Cove',W/2,H*.3+10);ctx.restore();}
/* the way back down to the Breezeway, the way north (the Sanctuary of Water, still to come), and the house doors (no one answers yet) */
THINT.push({get x(){return BVX+BVSOUTH.x;},get y(){return BVY+BVSOUTH.y;},get reach(){return inBV()?80:-1;},door:true,onInteract:()=>goScene(enterBWEast)},
  {get x(){return BVX+BVSDOOR.x;},get y(){return BVY+BVSDOOR.y;},get reach(){return inBV()&&lum.y<BVY+BVSBR.y1-60?85:-1;},door:true,onInteract:()=>dunGo(29,690,722,1)});
/* the clam houses can be entered: a shop (bottom-left) and a sitting room (bottom-right); their townsfolk (lines still to settle with the designer) */
const BVFOLK_H=158;   /* Lum stands about 98 tall; the townsfolk are about a head taller */
const BVNPC=[{room:25,atlas:'breeze_boy',x:850,y:525,name:'Breezevale Merchant',lines:[["Welcome in! Have a look around."]]},
  {room:26,atlas:'breeze_boy',x:115,y:708,name:'Townsman',lines:[["Oh! Hello there. Come in out of the rain."]],rain:[["Blue sky over Breezevale! I'd almost forgotten what it looked like."]],pre:[["Sage Luma? She lives at the Sanctuary of Water, across the stone bridge north of town."]],post:[["If you need help, you could ask Jak. He's the only explorer in town."]]},
  {room:28,atlas:'breeze_boy',x:870,y:722,name:'Fisherman',lines:[["Mind the nets! Come warm yourself by the fire."]],rain:[["That creature's gone quiet since the rain stopped. Was that you?"]],pre:[["Folks spotted a long, fish-like creature in the water, right from town!"],["The big fish eats the little ones, you know."]],preDry:[["The big fish eats the little ones, you know."]],post:[["Need a guide? Jak's the only real explorer around here. Ask him."]]},
  {room:38,atlas:'breeze_girl',x:955,y:528,name:'Innkeeper',lines:[["Welcome in, dear! You look soaked through."]]},   /* behind the bar; she offers a bed upstairs (innRest) */
  {room:28,atlas:'breeze_girl',x:965,y:730,name:'Fisherwoman',lines:[["The rain keeps the fish close to shore. A good season."]],rain:[["The fish have gone back out deep. We'll need the boats tomorrow."]],pre:[["Breezevale is a lovely little town. Good fishing, and such views of the sea."]],post:[["If anyone can help you, it's Jak. He's always off exploring somewhere."]]},
  {room:31,atlas:'luma',x:688,y:618,name:'Sage Luma',slim:1,idle:1,back:1,sc:.92,lines:[]},   /* Alma's older sister; she talks in lumaTalk */
  {room:27,atlas:'jak2',x:960,y:700,name:'Jak',sc:.97,slim:1,gone:()=>jak2In()||!C2.lumaMet,lines:[["…"]]},   /* home only once Lum has met Sage Luma, until he joins her */
  {room:26,atlas:'breeze_girl',x:205,y:694,name:'Townswoman',lines:[["Would you like some tea? The kettle's still warm."]],rain:[["The tea tastes better with the sun in the window, don't you think?"]],pre:[["Listen to that rain. So calming… perfect sleeping weather."],["It's been raining a whole week now!"]],preDry:[["A whole week of rain, and now not a cloud. Strange weather we've had."]],post:[["Jak lives in the shell house across the little bridge. He might be able to help you."]]}];
/* ---- townsfolk variety (for the Chapter 3 port town): the two Breezevale sheets recoloured and resized.
   folkSheet(base,look) makes (once) a copy of the sheet whose clothes and hair are hue-shifted, leaving skin tones alone, and registers it as its own
   atlas; an NPC entry can then use atlas:folkSheet('breeze_boy','teal') and sc for height. FOLK_LOOKS are the presets. ---- */
const FOLK_LOOKS={rose:{hue:-40,sat:1.1,lit:1},teal:{hue:150,sat:1,lit:1},moss:{hue:75,sat:.8,lit:.95},plum:{hue:-90,sat:.9,lit:.9},
  gold:{hue:25,sat:1.25,lit:1.05},slate:{hue:180,sat:.35,lit:.9},rust:{hue:-15,sat:1.2,lit:.85},sky:{hue:110,sat:.9,lit:1.08}};
function folkSheet(base,look){const key=base+'_'+look;if(IMG[key])return key;const L=FOLK_LOOKS[look],src=IMG[base];if(!L||!ready(src))return base;
  const cv=document.createElement('canvas');cv.width=src.naturalWidth;cv.height=src.naturalHeight;const g=cv.getContext('2d');g.drawImage(src,0,0);const d=g.getImageData(0,0,cv.width,cv.height),px=d.data;
  for(let i=0;i<px.length;i+=4){if(px[i+3]<8)continue;let r=px[i]/255,gg=px[i+1]/255,b=px[i+2]/255;const mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),l=(mx+mn)/2,dl=mx-mn;if(dl<.06)continue;
    const sa=dl/(1-Math.abs(2*l-1));let h=mx===r?((gg-b)/dl)%6:mx===gg?(b-r)/dl+2:(r-gg)/dl+4;h*=60;if(h<0)h+=360;
    if((h>=335||h<52)&&sa>.12&&(l>.52||(h<42&&sa>.22&&l>.4)))continue;   /* skin and blush: leave them */
    h=(h+L.hue+360)%360;const s2=Math.min(1,sa*L.sat),l2=Math.min(1,l*L.lit),c=(1-Math.abs(2*l2-1))*s2,x=c*(1-Math.abs((h/60)%2-1)),m=l2-c/2;
    const [R,G,B]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];px[i]=(R+m)*255;px[i+1]=(G+m)*255;px[i+2]=(B+m)*255;}
  g.putImageData(d,0,0);const im=new Image();im.src=cv.toDataURL();IMG[key]=im;C1ATL[key]=C1ATL[base];return key;}
function drawBVNpc(n){const k=dunH(n.y)/151,face=lum.x>n.x;ctx.save();ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(n.x,n.y,22*k,7*k,0,0,TAU);ctx.fill();ctx.restore();
  const talking=DLG.active&&DLG.lines&&DLG.lines[DLG.i||0]&&DLG.lines[DLG.i||0][0]===n.name,an=talking&&Math.abs(lum.x-n.x)>60?'side':talking&&n.back&&lum.y<n.y?'up':n.back&&!talking?'up':'down';   /* back: stands facing north, turns to Lum when she speaks with her */ctx.save();ctx.translate(n.x,0);ctx.scale(n.slim?1:.86,1);ctx.translate(-n.x,0);c1Frame(ctx,n.atlas,an==='down'&&n.idle?'idle':an,0,n.x,n.y,n.h||BVFOLK_H*k*(n.sc||1),an==='side'&&face,1,0);ctx.restore();}   /* townsfolk: a little taller than Lum, slim */
/* the Breezevale Merchant's trades */
function bvTakeMat(id,n){MATS[id]-=n;if(MATS[id]<=0){MATS[id]=0;const i=BAG.indexOf(id);if(i>=0)BAG.splice(i,1);}}
function bvMerchant(intro){const have=id=>MATS[id]||0,M=[['Fox Tail','foxtail',1,'potion','Healing Potion'],['Wisp Silk','wispsilk',1,'antidote','Antidote'],['Sea Gem','seagem',2,'seabait','Sea Bait']];
  const opts=M.map(([nm,id,n,get,gn])=>[gn,()=>{if(have(id)<n){talk([['Breezevale Merchant',n>1?`Bring me ${n} ${nm}s and it's yours.`:`Bring me a ${nm} and it's yours.`]],false,()=>bvMerchant());return;}bvTakeMat(id,n);giveItem(get);setTimeout(()=>bvMerchant(),350);},[id,n,get,`for ${n} ${nm}${n>1?'s':''} \u00b7 you have ${have(id)}`,have(id)<n]]);
  /* Healing Potion Potency (C2.potency, healRoll) is kept for later; the Sea Gems now buy Sea Bait */
  if(!C2.slippers){const has=BAG.includes('demonstone');opts.push(['Snake Slippers',()=>{if(!has){talk([['Breezevale Merchant',"Bring me a Demon Stone and they're yours."]],false,()=>bvMerchant());return;}BAG.splice(BAG.indexOf('demonstone'),1);C2.slippers=1;giveItem('wbboots');setTimeout(()=>bvMerchant(),350);},['demonstone',1,'wbboots',`for 1 Demon Stone \u00b7 you have ${has?1:0}`,!has]]);}   /* one pair only */
  opts.push(['Leave',()=>{}]);
  const go=()=>askChoice('Breezevale Merchant \u00b7 Trades',opts);if(intro)talk([['Breezevale Merchant',"Welcome in! I don't take coin, only trades. Have a look."]],false,go);else go();}
/* the innkeeper in the top-right shell house: a bed upstairs; Lum wakes rested at the foot of the stairs */
function innRest(n){talk([['Innkeeper',C2.rainDone?"You look dry for once, dear! Rooms are still upstairs if you need one.":"Welcome in, dear! You look soaked through."],['Innkeeper',"There's a warm bed upstairs if you'd like to rest."]],false,()=>setTimeout(()=>askChoice('Rest upstairs?',[['Yes',()=>restLullaby(()=>{for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;lum.x=INN_STAIR.x;lum.y=INN_STAIR.y;lum.state='idle';lum.face=-1;lum.vx=lum.vy=0;WEVENT.on=false;setTimeout(()=>talk([['Lum',"I feel well rested."]]),300);})],['No',()=>{}]]),200));}
const INN_STAIR={x:1150,y:556};   /* the foot of the stairs, room 38 */
function bvNpcTalk(n){if(n.name==='Jak'){lum.face=lum.x<n.x?1:-1;jakTalk();return;}if(n.name==='Breezevale Merchant'){lum.face=lum.x<n.x?1:-1;bvMerchant(true);return;}lum.face=lum.x<n.x?1:-1;if(n.back&&lum.y>n.y&&Math.abs(lum.x-n.x)<=60){lum.state='idleUp';lum.at=-1e9;}if(n.name==='Sage Luma'){lumaTalk();return;}if(n.name==='Innkeeper'){innRest(n);return;}talk([...(C2.rainDone&&n.rain?n.rain:n.lines),...(!C2.lumaMet&&n.pre?(C2.rainDone&&n.preDry||n.pre):[]),...(C2.lumaMet&&!jak2In()&&n.post?n.post:[])].map(l=>[n.name,l[0]]));}   /* pre: what the townsfolk say until Lum has met Sage Luma; post: after, until Jak joins her */   /* Lum looks up at whoever stands just above her */
/* the Sea Snake under the east bridge: from the middle of the deck Lum sees movement below; with Sea Bait she can drop it in, and the snake rises and attacks */
const BVSNK={t:-1,x:0,y:0};
function bvBridgeMid(){const mx=(BVBR.x0+BVBR.x1)/2;return [mx,bvBridgeY(mx)];}
function bvBridgeLook(){lum.state='idle';talk([['Lum',"There's some kind of movement down below…"]],false,()=>{if(BAG.includes('seabait'))setTimeout(()=>askChoice('Drop Sea Bait?',[['Yes',bvDropBait],['No',()=>{}]]),200);});}
function bvDropBait(){const i=BAG.indexOf('seabait');if(i<0)return;BAG.splice(i,1);const [mx]=bvBridgeMid();BVSNK.t=0;BVSNK.w0=performance.now();BVSNK.x=BVX+mx-30;BVSNK.y=BVY+BVBR.y+270;WEVENT.on=true;lum.vx=lum.vy=0;}
function updateBVSnake(){if(BVSNK.t<0)return;const t0=BVSNK.t;BVSNK.t=(performance.now()-BVSNK.w0)/1000;lum.vx=lum.vy=0;const t=BVSNK.t;
  if(t0<.55&&t>=.55){sfxSplash&&sfxSplash();}
  if(t0<1.1&&t>=1.1){sfxSplash&&sfxSplash();}
  if(t>=2.4){BVSNK.t=-1;WEVENT.on=false;startEncounter({kind:'seasnake',s:1,x:lum.x,y:lum.y,onWin:()=>{if(C2.rainDone)return;C2.rainDone=1;setTimeout(()=>talk([['Lum',"The rain… it's stopping."]]),2200);}},'normal');}}   /* beating the sea serpent the first time ends the rain for good (C2.rainDone) */
function drawBVSnake(){if(BVSNK.t<0||!inBV()||SCENE!=='thorn')return;const t=BVSNK.t,[mx,my]=bvBridgeMid(),bx=BVX+mx,by=BVY+my;
  if(t<.55){const u=t/.55;ctx.fillStyle='#8a6a4a';ctx.beginPath();ctx.ellipse(bx,by-40+u*(BVSNK.y-by+40),6,4,0,0,TAU);ctx.fill();}   /* the bait falls */
  const rings=(t0,x,y,big)=>{if(t<t0)return;const q=t-t0;for(let i=0;i<3;i++){const r=(q*1.2+i*.25);if(r>1.2)continue;ctx.strokeStyle=`rgba(225,240,250,${(.6*(1-r/1.2)).toFixed(3)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,big*(10+r*60),big*(3+r*18),0,0,TAU);ctx.stroke();}};
  rings(.55,BVSNK.x,BVSNK.y,1);rings(1.1,BVSNK.x,BVSNK.y,1.6);
  const im=IMG.seasnake;if(t>1.1&&ready(im)){const u=clamp((t-1.1)/.9,0,1),e=1-(1-u)**3,h=270,w=h*im.width/im.height;   /* it rises out of the water */
    ctx.save();ctx.beginPath();ctx.rect(BVSNK.x-w,BVSNK.y-h*1.4,w*2,h*1.4+4);ctx.clip();ctx.translate(BVSNK.x,BVSNK.y+h*(1-e)*.95);ctx.rotate(Math.sin(t*3)*.04);ctx.drawImage(im,-w*.5,-h,w,h);ctx.restore();
    ctx.save();ctx.globalAlpha=.5*(1-u*.5);ctx.fillStyle='rgba(235,245,252,.7)';for(let i=0;i<14;i++){const a=i/14*TAU+t,r=20+((t*90+i*13)%50);ctx.beginPath();ctx.arc(BVSNK.x+Math.cos(a)*r,BVSNK.y-Math.abs(Math.sin(a))*r*.6,2.2,0,TAU);ctx.fill();}ctx.restore();}}
THINT.push({get x(){return BVX+bvBridgeMid()[0];},get y(){return BVY+bvBridgeMid()[1];},get reach(){return inBV()&&BVSNK.t<0?60:-1;},onInteract:bvBridgeLook});
/* Jak in the islet shell house: he is hunting the Sea Serpent for its skin, to buy passage west across the sea and find his father, who sailed past the edge of the maps and never came back (placeholder lines); bring him a Sea Snake Skin and he joins Lum and will show her a secret way to the old ruins */
/* back in Breezevale after Mai joins Lum: Jak sends Lum to Sage Luma, plans to cross the island to the harbor town to trade his sea serpent skin, and walks home to the islet */
const JKLEAVE={t:-1,pts:null,i:0,x:0,y:0,face:1,dir:'up',ph:0};
function jakLeaves(){if(!jak2In()||C2.jakLeft||!inBV())return;WEVENT.on=true;lum.vx=lum.vy=0;JK2.x=lum.x+60;JK2.y=lum.y;JK2.dir='side';JK2.face=-1;JK2.moving=0;lum.face=1;
  talk([['Jak',"Breezevale at last… feels like we've been gone a lifetime."],['Jak',"Whatever that spirit gave you, Lum, Sage Luma will know what it means. Go and seek her guidance."],['Lum',"Aren't you coming?"],['Jak',"Not this time. I've still got that sea serpent skin, and no one in Breezevale can pay what it's worth."],['Jak',"I'm thinking of crossing the island to the other coastal town, the one with the harbor. Ships come in from all over. Someone there will give me a good trade."],['Jak',"But first, a hot meal and my own bed. Take care of yourself, Lum."],['Lum',"Thank you for everything, Jak."]],false,()=>{
    C2.jakLeft=1;C2.jak=0;const i=PARTY_ORDER.indexOf('jak');if(i>=0)PARTY_ORDER.splice(i,1);WEVENT.on=false;
    Object.assign(JKLEAVE,{t:0,i:0,x:JK2.x,y:JK2.y,face:1,dir:'up',ph:0,pts:[[BVX+BVSOUTH.x+60,BVY+BVSOUTH.y-260],[BVX+BVBR.x0-40,BVY+BVBR.y+30]]});});}
function drawJakLeaving(){if(JKLEAVE.t<0||!inBV())return;const J=JKLEAVE,dt=1/60;J.t+=dt;const P=J.pts[J.i];
  if(P){const dx=P[0]-J.x,dy=P[1]-J.y,d=Math.hypot(dx,dy),m=Math.min(d,150*dt);if(d<4)J.i++;else{J.x+=dx/d*m;J.y+=dy/d*m;J.ph+=m;if(Math.abs(dy)>Math.abs(dx))J.dir=dy<0?'up':'down';else{J.dir='side';J.face=dx<0?-1:1;}}}
  const a=J.i>=J.pts.length||J.t>7?Math.max(0,1-(J.t-Math.min(J.t,7))/.8):1;if(J.i>=J.pts.length&&!J.fade)J.fade=J.t;const al=J.fade?Math.max(0,1-(J.t-J.fade)/.8):1;if(al<=0||J.t>9){J.t=-1;return;}
  const an=J.dir==='side'?'side':J.dir,n=C1ATL.jak2.rows[an][1];ctx.save();ctx.globalAlpha=al*a;ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(J.x,J.y+2,30,8,0,0,TAU);ctx.fill();
  c1Frame(ctx,'jak2',an,Math.floor(J.ph/16)%n,J.x,J.y+3,JAK2_H,an==='side'&&J.face<0,al*a,0);ctx.restore();}
function jakTalk(){if(C2.jakLeft){talk([['Jak',"Still here, Lum? I'm packing for the trip to the harbor town. Go on, Sage Luma is waiting for you."]]);return;}if(!(MATS.snakeskin>0)){talk([['Jak',"These heavy rains over the last week have swallowed up the cave of the Sea Serpent."],['Jak',"I've been hunting it for its rare serpent skin. I saw it just off the coast. It comes close to shore to eat fish."],['Jak',"A skin like that is worth enough to buy passage on a ship across the sea."],['Jak',"My father sailed west years ago, to find what lies past the edge of the maps. He never came back."],['Jak',"I'd like to help you, I really would. But rain like this only comes along every few years. It's my best chance to catch it."]]);return;}
  talk([['Jak',"Wait… is that Sea Serpent skin?!"]],false,()=>setTimeout(()=>askChoice('Give Jak the Sea Snake Skin?',[['Yes',jakGetsSkin],['No',()=>talk([['Jak',"Well, if you change your mind, you know where to find me."]])]]),200));}
function jakGetsSkin(){bvTakeMat('snakeskin',1);sfxItem&&sfxItem();talk([['Jak',"You really caught it? The Sea Serpent? I've been chasing that beast for three seasons!"],['Lum',"It nearly caught me first."],['Jak',"Ha! Remind me never to get on your bad side."],['Jak',"So what brings you to my door with a serpent skin in hand?"],['Lum',"Sage Luma sent me. I need to reach the old ruins to the west, and she told me not to go alone."],['Jak',"Sage Luma sent you? Well, then… I suppose we have her rain-calling to thank for stirring up some mighty sea creatures."],['Jak',"The old ruins? I know a secret route there… my father showed it to me when I was small."],['Jak',"Why you'd want to go poking around some old ruins, I'll never know. Nothing ever happens there…"],['Jak',"…but for the one who landed the Sea Serpent, I'll gladly lead the way."]],false,jak2Join);}
function jak2Join(){C2.jak=1;if(!C2.ruinWay)hsGoal('Head to the west end of the Coastal Breezeway with Jak');if(!PARTY_ORDER.includes('jak'))PARTY_ORDER.push('jak');HEROES.jak.hp=HEROES.jak.maxHp;const n=BVNPC.find(n=>n.name==='Jak');JK2.x=n?n.x:lum.x;JK2.y=n?n.y:lum.y;JK2.dir='down';JK2.moving=0;JK2CRUMB.length=0;}
const JK2={x:0,y:0,face:1,dir:'down',moving:0,ph:0},JK2CRUMB=[];
function jak2In(){return CH>=2&&typeof C2!=='undefined'&&!!C2.jak;}
function resetJak2Follow(){JK2.x=lum.x;JK2.y=lum.y;JK2.moving=0;JK2.face=lum.face;JK2CRUMB.length=0;}
function updateJak2Follow(dt){if(!jak2In()||(SCENE!=='thorn'&&SCENE!=='dun'))return;const lc=JK2CRUMB[JK2CRUMB.length-1];
  if(!lc||Math.hypot(lc[0]-lum.x,lc[1]-lum.y)>6){JK2CRUMB.push([lum.x,lum.y]);if(JK2CRUMB.length>80)JK2CRUMB.shift();}
  const gap=SCENE==='dun'?56:70;let acc=0,tx=JK2.x,ty=JK2.y,px=lum.x,py=lum.y,found=false;for(let i=JK2CRUMB.length-1;i>=0;i--){const [cx,cy]=JK2CRUMB[i];acc+=Math.hypot(cx-px,cy-py);px=cx;py=cy;if(acc>=gap){tx=cx;ty=cy;found=true;break;}}
  if(!found){JK2.moving=0;if(!DLG.active){JK2.dir='side';JK2.face=lum.face;}return;}
  const dx=tx-JK2.x,dy=ty-JK2.y,d=Math.hypot(dx,dy);if(d<=2){JK2.moving=0;return;}const m=Math.min(d,Math.min(260,70+d*3)*dt);JK2.x+=dx/d*m;JK2.y+=dy/d*m;JK2.ph+=m;JK2.moving=1;
  if(Math.abs(dy)>Math.abs(dx)*1.2)JK2.dir=dy>0?'down':'up';else{JK2.dir='side';JK2.face=dx<0?-1:1;}}
function drawJak2OW(){if(CAPTURE.on)return;const vert=JK2.dir==='up'||JK2.dir==='down',an=vert?JK2.dir:'side',n=C1ATL.jak2.rows[an][1];ctx.fillStyle='rgba(10,10,20,.25)';ctx.beginPath();ctx.ellipse(JK2.x,JK2.y+2,30,8,0,0,TAU);ctx.fill();
  c1Frame(ctx,'jak2',an,JK2.moving?Math.floor(JK2.ph/16)%n:0,JK2.x,JK2.y+3,JAK2_H,!vert&&JK2.face<0,1,0);}   /* his side rows face right */
/* Sage Luma in the Sanctuary's altar chamber: she knew Lum would come; the ruins to the west hold someone who can tell her about Fokalur */
/* the end of Chapter 2: Lum returns to Sage Luma with Mai within her (placeholder lines, for the designer to revise) */
function lumaEnding(){WEVENT.on=true;talk([['Sage Luma',"Lum… you've come back. And you are not alone."],['Sage Luma',"I can feel her within you. After all this time, Mai has found her rest."],
    ['Lum',"She said four heroes bound a god… and that she was only a piece of one of them."],['Lum',"Mai, Alma, you… and me. Are we connected somehow?"],
    ['Sage Luma',"…The water carries many voices, child. Not all of them are mine to tell."],
    ['Sage Luma',"Four hundred years ago the old temple fell to ruin. I helped raise this sanctuary from its stones."],['Sage Luma',"Water flows through every corner of the world. Through it, I hear what others cannot."],
    ['Sage Luma',"Just over a year ago, I heard a voice calling out to a boy. To Cosmic."],['Sage Luma',"I did not know whose voice it was. I only knew he had to be hidden."],
    ['Sage Luma',"I could think of no safer place than the end of the world… and no one I trusted more than you."],['Sage Luma',"But the demon god is patient, and cunning. He deceived me. I am so sorry, Lum."],
    ['Lum',"All I ever wanted was a quiet life in my little shop… far away from everyone."],['Sage Luma',"I know. And now the one who wished to live apart from the world may be the one to save it."],
    ['Sage Luma',"My sister sent you to me because she believes I know everything. I do not."],['Sage Luma',"But I know someone who knows more. Some would say he knows everything."],
    ['Sage Luma',"King Bramt. His empire stretches across the western continent."],['Lum',"Across the sea…"],...(jak2In()?[['Jak',"Across the sea? …Then I'm coming too. I've a father to find out west."]]:[]),['Sage Luma',"Rest tonight, child. When the tide turns, so will your path."]],
  false,()=>{C2.done=1;setTimeout(()=>{finishChapter('ch2');startCh1Results('ch2');},400);});}
function lumaTalk(){if(CH>=3){c3LumaTalk();return;}if(C2.maiJoined&&!C2.done){lumaEnding();return;}if(C2.lumaMet){talk([['Sage Luma',"Seek the ruins to the west, Lum… and do not go alone."]]);return;}
  talk([['Sage Luma',"Ah… Lum. I knew you would visit one day. I have been waiting for you."],['Lum',"I've traveled far to ask you about Fokalur."],['Sage Luma',"Fokalur… Yes. I remember…"],
    ['Sage Luma',"To learn more about Fokalur, visit the ruins to the west."],['Sage Luma',"The old temple is in complete ruins… but not completely uninhabited."],['Sage Luma',"There is someone who may still be there…"],['Sage Luma',"…someone I have not felt in a very long time."],['Sage Luma',"If she still lingers, she will help you understand."],
    ['Sage Luma',"But there is no longer a way to the ruins. They are cut off from the land by rough waters."],['Sage Luma',"Do not go alone…"],['Sage Luma',"Promise me, Lum. The ruins are no place to explore by yourself. Find someone to go with you."],['Sage Luma',"An experienced trapper lives here in town. He may be of use to you… if he isn't out hunting."]],false,()=>{C2.lumaMet=1;hsGoal('Find a way to the ruins to the west');});}
function leaveSanctuary(){SCENE='thorn';lum.x=BVX+BVSDOOR.x;lum.y=BVY+BVSDOOR.y+30;lum.face=1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BVT.t=99;}   /* back out of the Sanctuary onto the blue bridge */
function leaveBVHouse(i){const h=BVHOUSES[i];SCENE='thorn';lum.x=BVX+bvDoorX(h);lum.y=BVY+h.y+60;lum.face=1;lum.dir='down';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y;THORN.t=99;BVT.t=99;}
for(const [i,h] of BVHOUSES.entries())THINT.push({x:BVX+bvDoorX(h),y:BVY+h.y+24,get reach(){return inBV()?78:-1;},door:true,onInteract:()=>i===0?dunGo(28,240,660,1):i===2?dunGo(25,470,690,1):i===3?dunGo(26,330,720,1):i===4?(C2.lumaMet&&CH<3?dunGo(27,590,650,1):say("It's locked. A sign on the door reads “Gone Fishing.”")):i===1?dunGo(38,690,712,1):say("Lum knocks. No one answers.")});

THINT.push({get x(){return BVX+BVGIRL.x;},get y(){return BVY+BVGIRL.y+10;},get reach(){return inBV()?85:-1;},onInteract:bvGirlTalk});
