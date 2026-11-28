/* ---------- Chapter 3: the Verdant Forest, through the east door of Amroth's home ----------
   About twice the size of Evergreen Grove. Lum comes in at the south-west corner. The grove's evergreens, bushes and flowers are
   scattered through it in clumps with open grass between; several small, shallow rivers wind through it (walkable: the party wade
   through) and all meet in the top-right corner, where a door leads on to the riverside trail (the Mountainside Trail, 26k).
   Built as another region of the Stranglethorn world, east of the Mountainside Trail. */
const VFX=MTX+4500,VFY=500,VFW=2600,VFH=3000,VFT={t:99};
const inVF=()=>lum.x>VFX-300;
const VFH_=(a,b)=>hash(a,b,5521);
const VF_IN={x:230,y:2830},VF_OUT={x:2440,y:250},VF_MEET={x:2330,y:360},VF_RW=36;   /* the way in (back to Amroth's home); the way on (the riverside trail); where the rivers meet */
/* the rivers, each winding to where they meet; the last runs out east past the door */
const VF_RIVERS=[[[-80,2360],[300,2280],[620,2050],[820,1720],[1180,1520],[1500,1220],[1760,980],[2040,720],[2330,360]],
  [[1560,3080],[1640,2700],[1900,2420],[2280,2150],[2420,1760],[2260,1380],[2380,1000],[2300,640],[2330,360]],
  [[-80,980],[300,1060],[620,880],[960,940],[1280,700],[1620,560],[1980,480],[2330,360]],
  [[880,-80],[1000,180],[1300,250],[1640,170],[1980,260],[2330,360]],
  [[2330,360],[2520,300],[2700,320]]].map(r=>splinePts(r.map(([x,y])=>[x+VFX,y+VFY]),18));
function vfRiverDist(x,y){let best=1e9;for(const P of VF_RIVERS)for(let i=0;i<P.length-1;i++){const [ax,ay]=P[i],[bx,by]=P[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);best=Math.min(best,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return best;}
/* evergreens in clumps (a soft noise field), never on the water, the ways in and out kept open */
const VF_TRUNKS=[],VF_SPOTS=[],VF_SHRUBS=[];
{const field=(x,y)=>Math.sin(x*.0042+1.3)*Math.cos(y*.0037-.6)+.6*Math.sin((x+y)*.0061+2.1)+.4*Math.cos((x-y)*.0049);let k=0;
  for(let gy=80;gy<VFH;gy+=92)for(let gx=30;gx<VFW;gx+=100){k++;const lx=gx+(VFH_(k,1)-.5)*60,ly=gy+(VFH_(k,2)-.5)*50,x=lx+VFX,y=ly+VFY;
    if(Math.hypot(lx-VF_IN.x,ly-VF_IN.y)<300||Math.hypot(lx-VF_OUT.x,ly-VF_OUT.y)<300)continue;
    const rd=vfRiverDist(x,y);if(rd<VF_RW+40)continue;const f=field(lx,ly);
    if(f>.35&&VFH_(k,3)<.62){const [img,w]=HTREES[Math.floor(VFH_(k,4)*HTREES.length)];VF_TRUNKS.push([lx,ly]);VF_SPOTS.push({lx,ly,img,w:w*(.75+VFH_(k,5)*.35),flip:VFH_(k,6)<.5});}
    else if(f>.05&&VFH_(k,7)<.22&&rd>VF_RW+55)VF_SHRUBS.push({lx,ly,k:[1,3,10,5][Math.floor(VFH_(k,8)*4)],s:.75+VFH_(k,9)*.3,flip:VFH_(k,10)<.5});}}
const vfNearTree=(lx,ly)=>{let b=1e9;for(const [tx,ty] of VF_TRUNKS)b=Math.min(b,Math.hypot(lx-tx,(ly-ty)*1.4));return b;};
/* berry bushes to forage, along the tree line */
const VF_FORAGE=[[500,2500,6],[900,2200,0],[1300,2600,4],[700,1400,6],[1150,1100,0],[1900,1900,4],[2100,2600,6],[1500,800,0],[600,500,4],[2000,1300,6]]
  .map(([x,y,k])=>({x:x+VFX,y:y+VFY,k,id:FORAGE_MAP[k],n:2,picked:0}));
for(const f of VF_FORAGE){let best=null;for(let r=0;r<420&&!best;r+=12)for(let a=0;a<TAU;a+=TAU/24){const x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r,lx=x-VFX,ly=y-VFY,nt=vfNearTree(lx,ly);if(vfRiverDist(x,y)<VF_RW+60||nt<60||nt>130||lx<80||lx>VFW-80||ly<150||ly>VFH-120)continue;best=[x,y];break;}if(best)[f.x,f.y]=best;}
function vfFree(x,y){const lx=x-VFX,ly=y-VFY;
  if(lx<30||lx>VFW-30||ly<110||ly>VFH-60)return false;
  for(const [tx,ty] of VF_TRUNKS)if(Math.abs(lx-tx)<34&&ly-ty<14&&ty-ly<22)return false;   /* the grass and the shallow rivers are open; only the trunks are solid */
  for(const f of VF_FORAGE)if(((x-f.x)/40)**2+((y-f.y)/18)**2<1)return false;
  return true;}
function vfProps(P){const X=x=>x+VFX,Y=y=>y+VFY;
  for(const h of VF_SHRUBS)P.push({t:'shrub',k:h.k,x:X(h.lx),y:Y(h.ly),s:SHR[h.k].s*h.s,flip:h.flip,ph:h.lx*.01});
  for(const t of VF_SPOTS)P.push({t:'tree',img:t.img,x:X(t.lx),y:Y(t.ly),w:t.w,flip:t.flip,base:.95});
  for(let gy=0;gy<VFH+200;gy+=160){P.push({t:'tree',img:'hfir',x:X(-60),y:Y(gy),w:260,flip:false,base:.95});if(gy>500)P.push({t:'tree',img:'hbig',x:X(VFW+70),y:Y(gy),w:380,flip:true,base:.95});}   /* woods beyond the edges */
  for(let gx=0;gx<VFW;gx+=170)P.push({t:'tree',img:gx%340?'hfir':'hbig',x:X(gx),y:Y(70),w:gx%340?260:360,flip:gx%340===0,base:.95});
  const KINDS=['lavender','rose','delph','magic','mint'];
  for(let i=0;i<420;i++){const lx=60+VFH_(i,81)*(VFW-120),ly=160+VFH_(i,82)*(VFH-260),x=X(lx),y=Y(ly);if(!vfFree(x,y)||vfRiverDist(x,y)<VF_RW+30||vfNearTree(lx,ly)>150)continue;
    const n=1+Math.floor(VFH_(i,83)*3);for(let j=0;j<n;j++)P.push({t:'plant',w:70,kind:KINDS[Math.floor(VFH_(i,84)*KINDS.length)],i:Math.floor(VFH_(i+j,85)*4),x:x+j*22-20,y:y+(j%2)*10,s:.8+VFH_(i+j,86)*.4,flip:VFH_(i+j,87)<.5,ph:VFH_(i+j,88)*TAU});}
  for(const f of VF_FORAGE)P.push({t:'shrub',k:f.k,x:f.x,y:f.y,s:SHR[f.k].s*.85,flip:f.x%2<1,ph:f.x*.01});}
/* the rivers: muddy banks, the designer's stony-stream water, ripples running toward the meeting point; a ring round anyone wading */
function vfRibbon(P,off){const L=[],R=[];for(let i=0;i<P.length;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,[x,y]=P[i];L.push([x+nx*off,y+ny*off]);R.push([x-nx*off,y-ny*off]);}
  ctx.moveTo(...L[0]);for(const p of L)ctx.lineTo(...p);for(let i=R.length-1;i>=0;i--)ctx.lineTo(...R[i]);ctx.closePath();}
function drawVFGround(x0,y0,x1,y1){if(x1<VFX-300)return;ctx.save();const M=[VFX+VF_MEET.x,VFY+VF_MEET.y];
  const all=(off,mr)=>{ctx.beginPath();for(const P of VF_RIVERS)vfRibbon(P,off);ctx.moveTo(M[0]+mr,M[1]);ctx.ellipse(M[0],M[1],mr,mr*.7,0,0,TAU);};
  all(VF_RW+16,150);ctx.fillStyle='rgba(84,74,52,.42)';ctx.fill('nonzero');all(VF_RW+6,138);ctx.fillStyle='rgba(150,132,96,.5)';ctx.fill('nonzero');   /* muddy, pebbly banks */
  ctx.strokeStyle='rgba(40,32,20,.45)';ctx.lineWidth=3.2;all(VF_RW,128);ctx.stroke();   /* the water's edge, drawn first so the water covers the lines where rivers meet */
  all(VF_RW,128);ctx.fillStyle=waterPattern(ctx,'water_rocks',.5)||'#4d7b86';ctx.fill('nonzero');
  ctx.save();all(VF_RW,128);ctx.clip('nonzero');ctx.strokeStyle='rgba(232,246,250,.32)';ctx.lineWidth=1.4;
  for(const [ri,P] of VF_RIVERS.entries())for(let i=0;i<12;i++){const q=(T*.45+VFH_(ri,i+40))%1,j=Math.min(P.length-2,Math.floor(((VFH_(ri,i+60)+q*.08)%1)*(P.length-1))),[ax,ay]=P[j],[bx,by]=P[j+1],d=Math.hypot(bx-ax,by-ay)||1,ux=(bx-ax)/d,uy=(by-ay)/d,o=(VFH_(ri,i+80)-.5)*VF_RW*1.2;
    ctx.globalAlpha=Math.sin(q*Math.PI)*.9;ctx.beginPath();ctx.moveTo(ax-uy*o,ay+ux*o);ctx.lineTo(ax-uy*o+ux*22,ay+ux*o+uy*22);ctx.stroke();}   /* ripples running downstream */
  ctx.restore();
  for(const p of [lum,AMR,ALMF,C3.boy])if(p&&p.x>x0&&p.x<x1&&vfRiverDist(p.x,p.y)<VF_RW){const q=(T*1.3+(p===lum?0:.4))%1;ctx.globalAlpha=(1-q)*.6;ctx.strokeStyle='rgba(240,250,252,.9)';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(p.x,p.y,16+q*26,5+q*8,0,0,TAU);ctx.stroke();}   /* wading */
  ctx.restore();}
function drawVFTitle(){if(!inVF()||VFT.t>=4.5||SCENE!=='thorn')return;VFT.t+=1/60;const a=Math.min(1,VFT.t*1.5,(4.5-VFT.t)*1.2);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=a;ctx.textAlign='center';
  ctx.fillStyle='rgba(20,16,12,.55)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f6ecd8';ctx.font=`600 ${Math.round(Math.min(30,W/13))}px Georgia,serif`;ctx.fillText('Verdant Forest',W/2,H*.3+10);ctx.restore();}
function enterVF(fromTrail){SCENE='thorn';const p=fromTrail?VF_OUT:VF_IN;lum.x=VFX+p.x+(fromTrail?-80:60);lum.y=VFY+p.y+(fromTrail?60:-60);lum.face=fromTrail?-1:1;lum.dir=fromTrail?'down':'up';lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-50;THORN.t=99;VFT.t=fromTrail?99:0;}
THINT.push({get x(){return VFX+VF_IN.x;},get y(){return VFY+VF_IN.y;},get reach(){return inVF()?80:-1;},door:true,onInteract:()=>goScene(enterHomeFromMT)},   /* back to Amroth's home */
  {get x(){return VFX+VF_OUT.x;},get y(){return VFY+VF_OUT.y;},get reach(){return inVF()?80:-1;},door:true,onInteract:()=>goScene(()=>enterMT(false))});   /* on to the riverside trail */
for(const f of VF_FORAGE)THINT.push({x:f.x,y:f.y,get reach(){return inVF()?76:-1},forage:f,onInteract:()=>pickForage(f)});
/* roamers: Forest Foxes, Verdant Wisps and a Forest Dryad (ids 5700+, kept dead in C1.thDead) */
function addVFFoes(){if(CH<3||typeof VFX==='undefined'||THFOES.some(g=>g.vf))return;let id=5700;const dead=new Set(C1.thDead||[]);
  for(const [lx,ly,kind,pack] of [[700,2300,'ffox',1],[1300,2000,'gwisp',1],[1900,2600,'ffox',2],[600,1500,'gwisp',2],[1500,1500,'dryad',1],[1100,600,'ffox',1],[1900,1100,'gwisp',1],[2100,700,'dryad',1]]){
    const x=VFX+lx,y=VFY+ly,myid=id++;if(dead.has(myid)||!vfFree(x,y))continue;
    THFOES.push({kind,vf:1,scene:'thorn',x,y,hx:x,hy:y,tx:x,ty:y,cx:x-TCW/2,cy:y-TCH/2,s:1,pack,calm:1,dead:0,t:rnd(0,4),ph:rnd(0,TAU),face:-1,id:myid,bl:0});}}
/* the first time the party reach one of the little rivers, Alma sees the rains have flooded the forest (placeholder lines) */
function updateVF(){if(!inVF()||SCENE!=='thorn'||CH<3||!C3.party||C3.vfFlood||DLG.active||FADE.dir||BATTLE.on||BATTLE.pending||WEVENT.on||MENU.open)return;
  if(vfRiverDist(lum.x,lum.y)<VF_RW+110){C3.vfFlood=1;lum.vx=lum.vy=0;talk([['Alma',"Oh my… look at all these little streams running through the trees."],['Alma',"The heavy rains must have flooded the forest. These were never here before."]]);}}
