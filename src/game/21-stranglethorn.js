/* ---------- Stranglethorn Forest: the bramble maze (art preview, no NPCs or enemies yet) ---------- */
const TMZ={R:12,C:15,rt:["110011101001001","100001101101011","011000000010000","100110010000011","011101010111101","111010100010101","111010110011011","000100100101001","101101001010111","111000011000111","011010001101011","010000000000001"],dn:["001110001010011","010111011010110","010101110111110","101001101101101","000011010100000","000100101100101","010101001110010","001101011101100","001010110011000","100011110010010","010111110001010","111111111111111"],start:6,finish:2};
const TCW=360,TCH=300,TW_=TMZ.C*TCW,TH_=TMZ.R*TCH;/* the clearing past the maze's exit, about the size of the woods graveyard */
/* the great round clearing where Stranglethorn meets the evergreens and the Worldbind mountains (Chapter 1's end, Chapter 2's start):
   west: the door back into the maze; north/south: brambles and red trees; east: pines, and a dirt path that runs east, then turns north up to the gatehouse in the mountain face */
const CLR={x0:TW_+260,cx:TW_+260+760,cy:TMZ.finish*TCH+TCH/2+10,rx:760,ry:440,x1:TW_+260+1520,hh:440};
const CPATH={y:CLR.cy+130,xt:CLR.x1+430,ytop:CLR.cy-430,hw:72};
const clrIn=(x,y)=>((x-CLR.cx)/(CLR.rx-70))**2+((y-CLR.cy)/(CLR.ry-60))**2<1;
/* the path is a gentle curve drawn with the woods' road painter (buildPath/drawPath in 17): east out of the clearing, bending up north to the gatehouse arch */
const CPATH_CTRL=[[CLR.cx+CLR.rx-470,CPATH.y+20],[CLR.cx+CLR.rx-300,CPATH.y+6],[CLR.x1+40,CPATH.y-4],[CPATH.xt-260,CPATH.y+14],[CPATH.xt-90,CPATH.y-60],[CPATH.xt-20,CPATH.y-250],[CPATH.xt+6,CPATH.ytop+120],[CPATH.xt+2,CPATH.ytop+10],[CPATH.xt+3,CPATH.ytop-40]];
const CPATH_PTS=splinePts(CPATH_CTRL,20);let CPATHP=null;
function cpathDist(x,y){let best=1e9;for(let i=0;i<CPATH_PTS.length-1;i++){const [ax,ay]=CPATH_PTS[i],[bx,by]=CPATH_PTS[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1),d=Math.hypot(x-ax-dx*t,y-ay-dy*t);if(d<best)best=d;}return best;}
const clrOnPath=(x,y)=>CH>=2&&cpathDist(x,y)<CPATH.hw;
function clrFree(x,y){if(x<CLR.x0+(CH>=2?190:70)||!(clrIn(x,y)||clrOnPath(x,y)))return false;if(!C1.fkDone&&Math.hypot((x-(CLR.x0+640))/70,(y-CLR.cy)/26)<1)return false;return true;}
const THORN={built:false,props:[],flowers:[],path:[],pockets:[],t:0,lightK:1};
// wall lines: hW(line,c) = horizontal wall on the top edge of row `line` at column c; vW(r,line) = vertical wall on the left edge of column `line` at row r
function hW(line,c){if(c<0||c>=TMZ.C)return false;if(line<=0||line>=TMZ.R)return true;return TMZ.dn[line-1][c]==='1';}
function vW(r,line){if(r<0||r>=TMZ.R)return false;if(line<=0)return r!==TMZ.start;if(line>=TMZ.C)return r!==TMZ.finish;return TMZ.rt[r][line-1]==='1';}
function tNb(r,c){const o=[];if(!vW(r,c+1)&&c<TMZ.C-1)o.push([r,c+1]);if(!vW(r,c)&&c>0)o.push([r,c-1]);if(!hW(r+1,c)&&r<TMZ.R-1)o.push([r+1,c]);if(!hW(r,c)&&r>0)o.push([r-1,c]);return o;}
function buildThorn(){if(THORN.built)return;THORN.built=true;const P=THORN.props;P.length=0;
  // solve the maze: the red flowers follow the one true path
  const S=[TMZ.start,0],F=[TMZ.finish,TMZ.C-1],key=(r,c)=>r*100+c,prev=new Map([[key(...S),null]]),q=[S];
  while(q.length){const u=q.shift();for(const v of tNb(...u)){const k=key(...v);if(!prev.has(k)){prev.set(k,u);q.push(v);}}}
  let u=F;THORN.path=[];while(u){THORN.path.unshift(u);u=prev.get(key(...u));}
  THORN.pockets=[];for(let r=0;r<TMZ.R;r++)for(let c=0;c<TMZ.C;c++)if(!prev.has(key(r,c)))THORN.pockets.push([r,c]);
  const H_=(a,b,s)=>hash(a,b,s);
  // horizontal hedges
  for(let line=0;line<=TMZ.R;line++)for(let c=0;c<TMZ.C;c++)if(hW(line,c)){const y=line*TCH;for(let k=0;k<2;k++){const x=c*TCW+90+k*180+(H_(line,c*2+k,3)-.5)*30;P.push({t:'hedge',x,y:y+6+(H_(line,c*2+k,5)-.5)*10,w:225+H_(line,c*2+k,7)*30,flip:H_(line,c*2+k,9)<.5});}}
  // vertical hedges: a receding line of bushes
  for(let r=0;r<TMZ.R;r++)for(let line=0;line<=TMZ.C;line++)if(vW(r,line)){const x=line*TCW;for(let k=0;k<4;k++){const y=r*TCH+38+k*75;P.push({t:'hedge',x:x+(H_(r*7+k,line,11)-.5)*16,y,w:150+H_(r*7+k,line,13)*24,flip:H_(r*7+k,line,15)<.5});}}
  // posts at every junction so corners look solid
  for(let vr=0;vr<=TMZ.R;vr++)for(let vc=0;vc<=TMZ.C;vc++){const any=hW(vr,vc-1)||hW(vr,vc)||vW(vr-1,vc)||vW(vr,vc);if(any&&H_(vr,vc,17)<.18&&vr>0&&vr<TMZ.R)P.push({t:'tree',img:['bwood_small_a','bwood_small_b','bwood2_small_a','bwood2_small_b'][Math.floor(H_(vr,vc,19)*4)],x:vc*TCW,y:vr*TCH+8,w:430+H_(vr,vc,21)*90,flip:H_(vr,vc,23)<.5});}
  // sealed pockets become thickets of red trees
  for(const [r,c] of THORN.pockets){const big=H_(r,c,29)<.5;P.push({t:'tree',img:big?(H_(r,c,37)<.5?'bwood_big':'bwood2_big'):['bwood_small_a','bwood_small_b','bwood2_small_a','bwood2_small_b'][Math.floor(H_(r,c,31)*4)],x:c*TCW+TCW/2+(H_(r,c,33)-.5)*60,y:r*TCH+TCH*.82,w:big?760:500,flip:H_(r,c,35)<.5});}
  // gateways: a bramble arch wherever the path passes through a gap flanked by hedges
  const pth=THORN.path;for(let i=1;i<pth.length;i++){const [r0,c0]=pth[i-1],[r1,c1]=pth[i];if(c0!==c1)continue;const line=Math.max(r0,r1);if(hW(line,c0-1)&&hW(line,c0+1)&&H_(line,c0,41)<.75)P.push({t:'arch',x:c0*TCW+TCW/2,y:line*TCH+14,w:430});}
  // Jak's resting place: the old oak frames the dead end (characters come later)
  P.push({t:'oak',x:1*TCW+TCW*.5,y:7*TCH-4,w:420});
  // the spider's tree guards the last stretch before the exit
  P.push({t:'web',x:12*TCW+TCW/2,y:2*TCH+70,w:560});
  // red flowers along the true path (none down the wrong turns)
  THORN.flowers=[];for(let i=0;i<pth.length;i++){const [r,c]=pth[i];const n=2;for(let k=0;k<n;k++){const a=H_(r,c*3+k,53)*TAU,d=60+H_(r,c*3+k,55)*50;const ri=Math.floor(H_(r,c*3+k,59)*3),RS=[['rose_bud',150,135/400],['rose_open',168,150/400],['rose_twin',180,214/400]][ri],hh=RS[1]*(.85+H_(r,c*3+k,57)*.3);P.push({t:'rose',img:RS[0],x:c*TCW+TCW/2+Math.cos(a)*d*1.4,y:r*TCH+TCH/2+15+Math.sin(a)*d*.7,w:hh*RS[2],flip:H_(r,c*3+k,61)<.5});}}
  // ground patches cut from the forest-floor painting: webs, little spiders, mushrooms, a mossy hollow
  const DEC=[['thdec_stickweb',330],['thdec_mushweb',200],['thdec_litterweb',230],['thdec_fernweb',270],['thdec_smallweb',175],['thdec_log',330]];THORN.decals=[];
  for(let r=0;r<TMZ.R;r++)for(let c=0;c<TMZ.C;c++){if(!prev.has(key(r,c)))continue;if(H_(r,c,81)>.42)continue;const d=DEC[Math.floor(H_(r,c,83)*DEC.length)];
    THORN.decals.push({n:d[0],w:d[1]*(.9+H_(r,c,85)*.2),x:c*TCW+TCW/2+(H_(r,c,87)-.5)*110,y:r*TCH+TCH/2+12+(H_(r,c,89)-.5)*70,flip:H_(r,c,91)<.5});}
  // extra webs gather near the spider's tree and around Jak's hollow
  for(const [n,w,x,y,f] of [['thdec_stickweb',300,13*TCW+TCW/2,2*TCH+175,false],['thdec_fernweb',220,11*TCW+TCW/2,2*TCH+190,true],['thdec_smallweb',130,12*TCW+60,2*TCH+230,false],['thdec_litterweb',175,7*TCW+TCW*.62,9*TCH+200,true]])THORN.decals.push({n,w,x,y,flip:f});
  // berry bushes Lum can pick: a few scattered through open cells, some down the wrong turns
  THORN.forage=[];{const busy_=(r,c)=>(r===0&&c===5)||(r===4&&(c===4||c===5))||(r===10&&c===11)||(r===TMZ.start&&c<=1)||(r===7&&c===1)||(r===TMZ.finish&&c>=11)||(r===2&&c>=11),cells=[];
    for(let r=0;r<TMZ.R;r++)for(let c=0;c<TMZ.C;c++)if(prev.has(key(r,c))&&!busy_(r,c))cells.push([r,c]);cells.sort((a,b)=>H_(a[0],a[1],97)-H_(b[0],b[1],97));
    const KS=[6,0,4],got=[];for(const [r,c] of cells){if(got.length>=5)break;if(got.some(([a,b])=>Math.abs(a-r)+Math.abs(b-c)<4))continue;got.push([r,c]);
      const k=KS[got.length%3],side=H_(r,c,99)<.5?-1:1,x=c*TCW+TCW/2+side*(45+H_(r,c,101)*25),y=r*TCH+TCH*.42+(H_(r,c,103)-.5)*40;
      P.push({t:'shrub',k,x,y,s:SHR[k].s*1.05,flip:side>0,ph:x*.01,w:180});THORN.forage.push({x,y,id:FORAGE_MAP[k],n:2,picked:0});}}
  // the clearing's rim: brambles all round the west half (red trees behind the north side), pines on the east side, a gap where the path leaves
  {const SM=['bwood_small_a','bwood_small_b','bwood2_small_a','bwood2_small_b'],per=2*Math.PI*Math.sqrt((CLR.rx*CLR.rx+CLR.ry*CLR.ry)/2),n=Math.round(per/150);
   for(let k=0;k<n;k++){const th=k/n*TAU,c=Math.cos(th),sn=Math.sin(th),deg=((th*180/Math.PI)+360)%360,east=deg<62||deg>298;if(east)continue;
     const off=30+95*Math.max(0,sn),x=CLR.cx+(CLR.rx+off)*c+(H_(k,1,231)-.5)*20,y=CLR.cy+(CLR.ry+off)*sn+(H_(k,2,231)-.5)*12;
     P.push({t:'hedge',x,y,w:(Math.abs(c)>.7?170:225)+H_(k,3,231)*28,flip:H_(k,4,231)<.5});}
   for(let k=0;k<9;k++){const th=Math.PI*(1.12+k*.095),x=CLR.cx+(CLR.rx+190)*Math.cos(th)+(H_(k,5,231)-.5)*60,y=CLR.cy+(CLR.ry+170)*Math.sin(th);
     P.push({t:'tree',img:SM[Math.floor(H_(k,6,231)*4)],x,y,w:440+H_(k,7,231)*90,flip:H_(k,8,231)<.5});}
   // the evergreens: the east rim, and both sides of the path (spruce and tall pine most often, saplings and twisted ones mixed in)
   const PN=[['pine_spruce',290],['pine_tall',250],['pine_spruce',300],['pine_twist_a',330],['pine_tall',240],['pine_sapling',270],['pine_twist_b',340]];
   const LOW=PN.filter(p=>p[0]!=='pine_tall');
   // Chapter 2 (after the hellfire): the evergreens nearest the clearing stand burned, some still smouldering
   const BURNT=[['burnt_charred_big',400],['burnt_smoulder_small',300],['burnt_charred_twist',290],['burnt_smoulder_big',390],['burnt_charred_small',300],['burnt_smoulder_twist',290]];
   const pine=(x,y,k,s0=1,low=false,burn=0)=>{if(cpathDist(x,y)<CPATH.hw+90)return;const L_=low?LOW:PN,[img,w]=L_[Math.floor(H_(k,9,233)*L_.length)],b=burn&&H_(k,17,233)<burn?BURNT[Math.floor(H_(k,18,233)*BURNT.length)]:null;const tr={t:'tree',img,img2:b&&b[0],w2:b&&b[1]*s0*(.9+H_(k,12,233)*.25),x:x+(H_(k,10,233)-.5)*40,y:y+(H_(k,11,233)-.5)*20,w:w*s0*(.9+H_(k,12,233)*.25),flip:H_(k,13,233)<.5,base:.95};P.push(tr);
     // the pines' wide spreads of roots are tucked under a few withered shrubs (hidden again once the tree is burned)
     if(img!=='pine_twist_a'&&img!=='pine_twist_b'){const DR=[2,4,6,4,0,6],sw=tr.w;[[-.24,2,.42],[.26,4,.38],[.02,10,.5]].forEach(([fx,dy,ws],j)=>{const d=DR[Math.floor(H_(k,20+j,233)*DR.length)];
       P.push({t:'tree',img:'drained'+d,x:tr.x+fx*sw+(H_(k,23+j,233)-.5)*14,y:tr.y+dy,w:sw*ws*(.9+H_(k,26+j,233)*.25),flip:H_(k,29+j,233)<.5,base:.93,under:tr});});}};
   let q=0;for(let d=-60;d<=60;d+=13){if(d>-4&&d<46)continue;const th=d*Math.PI/180;pine(CLR.cx+(CLR.rx+60)*Math.cos(th),CLR.cy+(CLR.ry+60+40*Math.max(0,Math.sin(th)))*Math.sin(th),q++,1,false,.85);}
   // path sides: trunks kept clear of the dirt so the trees never hide Lum on the path
   for(let x=CLR.x1+60;x<CPATH.xt+300;x+=210){const bn=x<CLR.x1+420?.6:.12;pine(x,CPATH.y+CPATH.hw+430,q++,.95,true,bn);if(x<CPATH.xt-260)pine(x,CPATH.y-CPATH.hw-20,q++,.95,false,bn);}
   for(let y=CPATH.ytop+150;y<CPATH.y-CPATH.hw;y+=210){pine(CPATH.xt-CPATH.hw-200,y,q++,.95);pine(CPATH.xt+CPATH.hw+200,y+60,q++,.95);}
   // the woods carry on south of the clearing: Stranglethorn trees to the south-west, evergreens to the south-east (kept well back so they never hide the clearing)
   for(let r=0;r<3;r++)for(let x=CLR.x0-260+(r%2)*130,k=0;x<CLR.x1+160;x+=260,k++){const y=CLR.cy+CLR.ry+500+r*230+(H_(k,r,241)-.5)*60;if(x>CLR.cx+260)pine(x,y,q++,1.05,false,.35);else P.push({t:'tree',img:SM[Math.floor(H_(k,r+3,241)*4)],x:x+(H_(k,r+5,241)-.5)*80,y,w:440+H_(k,r+7,241)*90,flip:H_(k,r+9,241)<.5});}
   for(let r=0;r<2;r++)for(let x=CLR.x1+160+(r%2)*110;x<CPATH.xt+700;x+=220)pine(x,CPATH.y+CPATH.hw+700+r*220,q++,1,false,.15);
   // the Worldbind: cliff faces behind the gatehouse and along the path's east side; the gatehouse sits in the mountain face where the path ends
   P.push({t:'tree',img:'worldbind_cliff',x:CPATH.xt+200,y:CPATH.ytop-40,w:2300,flip:false,cliff:1,solid:1});
   P.push({t:'tree',img:'worldbind_cliff',x:CPATH.xt+1350,y:CPATH.y+420,w:2300,flip:true,cliff:1,solid:1});
   homeProps(P,PN);
   P.push({t:'tree',img:'outpost',x:CPATH.xt+52,y:CPATH.ytop+18,sy:CPATH.ytop-30,w:430,flip:false,solid:1});   /* solid: never fades; sorted behind anyone standing in its archway */}
  THORN.mist=[];for(let i=0;i<40;i++)THORN.mist.push({x:hash(i,1,77)*TW_,y:hash(i,2,77)*TH_,r:160+hash(i,3,77)*220,ph:hash(i,4,77)*TAU});}
/* glimpses of Cosmic at the edge of the lantern light along the red-rose path; each happens once */
const COSSEE=[],COS_LINES=["Cosmic? I am coming for you!","Cosmic! Wait for me!","Was that… Cosmic? Don't run off!","I saw you, Cosmic! Hold on, I'm coming!","Cosmic! Don't go…"];
function buildCosSightings(){if(COSSEE.length)return;const p=THORN.path,n=p.length;[.22,.42,.62,.8].forEach((f,i)=>{const [r,c]=p[Math.round(f*(n-1))];COSSEE.push({i,x:c*TCW+TCW/2,y:r*TCH+TCH/2+20,st:0,t:0,a:0,face:-1});});COSSEE.push({i:4,x:TW_-70,y:TMZ.finish*TCH+TCH/2+20,st:0,t:0,a:0,face:-1,needBoss:1});}
function updateCosSightings(dt){buildCosSightings();const Rw=Math.min(W,H)*.5/zoom,free=!DLG.active&&!BATTLE.on&&!BATTLE.pending&&!MENU.open&&!WEVENT.on&&!FADE.dir;
  for(const s of COSSEE){if(C1['cosSeen'+s.i]&&s.st<2){s.st=3;continue;}if(s.st===3)continue;if(s.needBoss&&!C1.thornBoss)continue;const d=Math.hypot(lum.x-s.x,(lum.y-s.y)*1.2);s.t+=dt;
    if(s.st===0&&free&&d<Rw*.95){s.st=1;s.t=0;s.face=lum.x<s.x?-1:1;}
    else if(s.st===1){s.a=Math.min(.95,s.a+dt*2);s.face=lum.x<s.x?-1:1;if(d<Rw*.38||s.t>4.5){s.st=2;s.t=0;s.face=-s.face;C1['cosSeen'+s.i]=1;if(!DLG.active)say(COS_LINES[s.i%COS_LINES.length]);}}
    else if(s.st===2){s.x+=s.face*55*dt;if(!DLG.active)s.w=(s.w||0)+dt;if(s.w>2.5)s.a=Math.max(0,s.a-dt*.8);if(s.a<=0)s.st=3;}}}
function drawCosGhost(s){if(!ready(catlas)||s.a<=0)return;const A=s.st===2?COS_BLADE.walk:COS_BLADE.idle,fr=s.st===2?A.frames[Math.floor(s.t*10)%A.frames.length]:A.frames[0];
  ctx.save();ctx.globalAlpha=s.a;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(s.x,s.y+2,26,7,0,0,TAU);ctx.fill();
  ctx.translate(s.x,s.y+3);if(s.face!==A.native)ctx.scale(-1,1);const dw=CFW*CSPR,dh=CFH*CSPR;ctx.save();ctx.globalCompositeOperation='lighter';const bg=s.st===2?[18,-32,44]:[34,-66,44];drawGlow(ctx,bg[0],bg[1],bg[2],'255,40,50',.7+.12*Math.sin(T*5));ctx.restore();ctx.drawImage(catlas,fr*CFW,0,CFW,CFH,-dw/2,-dh*(264/270),dw,dh);ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,bg[0],bg[1],bg[2]*.5,'255,70,60',.45);ctx.restore();ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,s.x,s.y-70,60,'140,170,255',.22*s.a);ctx.restore();}
function thornFree(x,y){if(x>HOMEX-300)return homeFree(x,y);if(x>TW_+40)return clrFree(x,y);if(x<18||y<14||y>TH_-14)return false;if(x>TW_-12&&Math.floor(y/TCH)!==TMZ.finish)return false;if(x>TW_+30)return false;
  const c=clamp(Math.floor(x/TCW),0,TMZ.C-1),r=clamp(Math.floor(y/TCH),0,TMZ.R-1),lx=x-c*TCW,ly=y-r*TCH,T_=34,B_=24,SX=42;
  if(ly<B_&&hW(r,c))return false;if(ly>TCH-T_&&hW(r+1,c))return false;if(lx<SX&&vW(r,c))return false;if(lx>TCW-SX&&vW(r,c+1))return false;
  const nearL=lx<SX,nearR=lx>TCW-SX,nearT=ly<B_,nearB=ly>TCH-T_;
  if((nearL||nearR)&&(nearT||nearB)){const vr=r+(nearB?1:0),vc=c+(nearR?1:0);if(hW(vr,vc-1)||hW(vr,vc)||vW(vr-1,vc)||vW(vr,vc))return false;}
  // tree trunks that stand inside a corridor
  if(Math.hypot((x-(12*TCW+TCW/2))/110,(y-(2*TCH+62))/34)<1)return false;
  for(const d of [CELLAR_DOOR,SPRING_DOOR,WEBWELL_DOOR])if(Math.hypot((x-d.x)/(CMOUTH.rx+6),(y-d.y)/(CMOUTH.ry+8))<1)return false;
  for(const f of THORN.forage||[])if(Math.hypot((x-f.x)/34,(y-f.y+4)/12)<1)return false;
  if(!C1.thornBoss&&r===TMZ.finish&&c>=13)return false;
  return true;}
function solveThorn(px,py,nx,ny){if(thornFree(nx,ny))return [nx,ny];if(thornFree(nx,py))return [nx,py];if(thornFree(px,ny))return [px,ny];return [px,py];}
function enterThorn(){buildThorn();if(!THORN.fint){THORN.fint=1;for(const f of THORN.forage)THINT.push({x:f.x,y:f.y,reach:76,lum:true,forage:f,onInteract:()=>pickForage(f)});}for(const f of THORN.forage)f.picked=0;if(!THORN.spiders)buildThornCritters();buildThornFoes();SCENE='thorn';lum.x=40;lum.y=TMZ.start*TCH+TCH/2+10;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';lum.alpha=1;cam.x=lum.x+120;cam.y=lum.y-50;THORN.t=0;resetJakFollow();if(!C1.jak&&!C1.jakSeenT)C1.jakSeenT=0;GOAL.tag='TASK';GOAL.text='Search for Cosmic';HINT.goalT=0;}
function startThornPreview(){SAVEC.finished=0;audioInit();c1Reset();C1.introDone=1;C1.hedgeSeen=1;C1I.on=false;WEVENT.on=false;INTRO.lumShown=true;if(!BAG.includes('lantern'))BAG.push('lantern');FADE.a=1;FADE.dir=-1;enterThorn();}
function updateThorn(dt){updateThornAtmos(dt);updateCosSightings(dt);updateThornCritters(dt);updateThornFoes(dt);updateJakFollow(dt);
  if(!C1.jak&&!C1.jakSpotted&&!DLG.active&&!FADE.dir&&Math.hypot(lum.x-JAKREST.x,lum.y-JAKREST.y)<300){C1.jakSpotted=1;talk([['Lum',"Someone's there… slumped against the roots of that old oak."]]);}
  if(!C1.thornBoss&&lum.x<TW_&&lum.x>12*TCW+TCW*.8&&Math.floor(lum.y/TCH)===2){lum.x=12*TCW+TCW*.8;}const k=Math.min(1,dt*4.5),fkCam=typeof FKS!=='undefined'&&FKS.st>=1&&FKS.st<7&&!C1.fkDone&&lum.x>TW_;const c2c=CH>=2&&typeof C2!=='undefined'&&C2.on&&C2.cam;cam.x+=((c2c?C2.cam.x:fkCam?(lum.x+FKS.cx)/2:lum.x+40)-cam.x)*k*(fkCam||c2c?.5:1);cam.y+=((c2c?C2.cam.y:fkCam?FKS.cy-250:lum.y-50)-cam.y)*k*(fkCam||c2c?.5:1);const vw=W/zoom,vh=H/zoom;cam.x=clamp(cam.x,vw/2-80,(lum.x>TW_+40?(inHome()?1e9:CH>=2?CPATH.xt+900:CLR.x1+(fkCam?420:60)):TW_+80)-vw/2);cam.y=clamp(cam.y,-200+vh/2,TH_+60-vh/2);if(inHome()){cam.x=vw>=HW?HOMEX+HW/2:clamp(cam.x,HOMEX+vw/2,HOMEX+HW-vw/2);cam.y=vh>=HH?HOMEY+HH/2:clamp(cam.y,HOMEY+vh/2,HOMEY+HH-vh/2);}THORN.t+=dt;
  updateClearing(dt);}
function drawRedFlowers(x,y,s,seed){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  for(let i=0;i<4;i++){const a=hash(seed,i,61)*TAU,l=10+hash(seed,i,63)*8;ctx.fillStyle='#2f4a24';ctx.beginPath();ctx.ellipse(Math.cos(a)*l*.6,Math.sin(a)*l*.3+2,l*.55,3,a,0,TAU);ctx.fill();}
  const n=3+(hash(seed,9,65)*3|0);for(let i=0;i<n;i++){const fx=(hash(seed,i,67)-.5)*30,fy=(hash(seed,i,69)-.5)*12-4,r=4.2+hash(seed,i,71)*2.2,sw=Math.sin(T*1.6+seed+i)*.12;
    ctx.save();ctx.translate(fx,fy);ctx.rotate(sw);ctx.fillStyle='#9a1424';for(let p=0;p<5;p++){const a=p/5*TAU;ctx.beginPath();ctx.ellipse(Math.cos(a)*r*.75,Math.sin(a)*r*.75,r*.62,r*.42,a,0,TAU);ctx.fill();}
    ctx.fillStyle='#e0363f';for(let p=0;p<5;p++){const a=p/5*TAU+.6;ctx.beginPath();ctx.ellipse(Math.cos(a)*r*.45,Math.sin(a)*r*.45,r*.42,r*.3,a,0,TAU);ctx.fill();}
    ctx.fillStyle='#2a0a0e';ctx.beginPath();ctx.arc(0,0,r*.28,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}
function drawThornProp(o,alpha){if(o.t==='shrub'){drawShrub(o);return;}if(o.under&&CH>=2&&o.under.img2)return;const name=o.t==='hedge'?'bramble_hedge':o.t==='arch'?'bramble_arch':o.t==='oak'?'oak_big':o.t==='web'?'webtree':(CH>=2&&o.img2)||o.img;const im=IMG[name];if(!ready(im))return;
  const w=(CH>=2&&o.img2?o.w2:o.w),h=w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.globalAlpha=alpha;ctx.translate(o.x,o.y);if(o.flip)ctx.scale(-1,1);
  if(o.t==='rose'&&THORN.blooms){const tw=o.img==='rose_twin';THORN.blooms.push([o.x+(tw?w*.3*(o.flip?-1:1):0),o.y-h*(o.img==='rose_bud'?.9:tw?.86:.88)]);}
  const base=o.base||(o.t==='oak'?.99:o.t==='web'?.97:o.t==='tree'?.985:.94);ctx.drawImage(im,-w/2,-h*base,w,h);ctx.restore();
  if(o.t==='oak'){ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,o.x-w*.32,o.y-h*.2,60,'120,230,220',.35+.12*Math.sin(T*2));ctx.restore();}
  if(CH>=2&&o.img2)drawBurnFx(o,w,h);}
/* Chapter 2: the hellfire's leftovers on each burned tree: a few small flames at the roots, embers, and smoke curling up through the branches */
function drawBurnFx(o,w,h){const sd=(o.x*.013+o.y*.007)%1,sm=o.img2.includes('smoulder');
  ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,o.x,o.y-8,w*.45,'255,110,40',(sm?.16:.1)+.04*Math.sin(T*3+sd*9));ctx.restore();
  const nf=sm?3:2;for(let i=0;i<nf;i++){const fx=o.x+(hash(i,1,o.x|0)-.5)*w*.5,fy=o.y+4+(hash(i,2,o.x|0)-.5)*14;drawFlames(ctx,fx,fy,(sm?38:26)+hash(i,3,o.x|0)*22,.95);}
  for(let i=0;i<6;i++){const t=(T*(.09+hash(i,4,o.x|0)*.05)+hash(i,5,o.x|0))%1,px=o.x+(hash(i,6,o.x|0)-.5)*w*.4+Math.sin(T*.7+i*1.3)*18*t,py=o.y-h*(.15+t*.95),r=(28+60*t)*(w/380);
    ctx.save();ctx.globalAlpha=(1-t)*Math.min(1,t*5)*.7;drawGlow(ctx,px,py,r,'120,112,118',.9);ctx.restore();}
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const t=(T*(.25+hash(i,7,o.x|0)*.2)+hash(i,8,o.x|0))%1;ctx.fillStyle=`rgba(255,${150+(hash(i,9,o.x|0)*80)|0},60,${(1-t)*.9})`;ctx.beginPath();ctx.arc(o.x+(hash(i,10,o.x|0)-.5)*w*.5+Math.sin(T*2+i)*8,o.y-10-t*h*.7,2.2*(1-t)+.8,0,TAU);ctx.fill();}ctx.restore();}

/* ---------- Stranglethorn atmosphere: drifting fog, motes, petals, cold grade, haunted sound ---------- */
let THFOG=null;
function makeFogTex(){const N=256,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),im=g.createImageData(N,N),d=im.data;
  const rnd_=(x,y,s)=>{const h=Math.sin(x*127.1+y*311.7+s*74.7)*43758.5453;return h-Math.floor(h);};
  const vn=(x,y,per,s)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=(a)=>((a%per)+per)%per;
    const a=rnd_(w(xi),w(yi),s),b=rnd_(w(xi+1),w(yi),s),c_=rnd_(w(xi),w(yi+1),s),e=rnd_(w(xi+1),w(yi+1),s);return a+(b-a)*u+(c_-a)*v+(a-b-c_+e)*u*v;};
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let f=0,amp=.5,tot=0;for(let o=0;o<5;o++){const per=4<<o;f+=vn(x/N*per,y/N*per,per,o)*amp;tot+=amp;amp*=.5;}f/=tot;
    const a=Math.max(0,Math.min(1,(f-.38)/.42));const i=(y*N+x)*4;d[i]=d[i+1]=d[i+2]=255;d[i+3]=Math.round(a*a*(3-2*a)*255);}
  g.putImageData(im,0,0);return c;}
function fogLayer(tex,scale,ox,oy,alpha,tint){const S=256*scale;const sx=((ox%S)+S)%S,sy=((oy%S)+S)%S;ctx.save();ctx.globalAlpha=alpha;
  const Si=Math.round(S);for(let y=-Math.round(sy);y<H;y+=Si)for(let x=-Math.round(sx);x<W;x+=Si)ctx.drawImage(tex,x,y,Si,Si);
  ctx.restore();}
function drawThornFog(pass){if(!THFOG){THFOG=makeFogTex();THFOG.tint=document.createElement('canvas');THFOG.tint.width=THFOG.tint.height=256;const g=THFOG.tint.getContext('2d');g.drawImage(THFOG,0,0);g.globalCompositeOperation='source-in';g.fillStyle='rgb(188,182,204)';g.fillRect(0,0,256,256);
    THFOG.red=document.createElement('canvas');THFOG.red.width=THFOG.red.height=256;const g2=THFOG.red.getContext('2d');g2.drawImage(THFOG,0,0);g2.globalCompositeOperation='source-in';g2.fillStyle='rgb(150,96,112)';g2.fillRect(0,0,256,256);}
  const z=zoom,cx=cam.x*z,cy=cam.y*z;
  const fk=CH>=2?.5:1;   // Chapter 2's clearing: thinner haze (smoke rather than Stranglethorn fog)
  if(pass===0){fogLayer(THFOG.tint,3.6,cx*.9+T*14,cy*.9+T*3,.21*fk,0);fogLayer(THFOG.red,2.4,cx*1.05-T*9,cy*1.05+T*2,.16*fk,0);}
  else{fogLayer(THFOG.tint,4.6,cx*.6+T*22,cy*.6-T*4,.12*fk,0);
    // low ground haze hugging the bottom of the view
    const g=ctx.createLinearGradient(0,H*.55,0,H);g.addColorStop(0,'rgba(170,165,190,0)');g.addColorStop(1,'rgba(150,145,175,.16)');ctx.fillStyle=g;ctx.fillRect(0,H*.55,W,H*.45);}}
function updateThornAtmos(dt){const A=THORN.motes||(THORN.motes=[]);const vw=W/zoom,vh=H/zoom;
  while(A.length<46)A.push({x:cam.x+rnd(-vw/2,vw/2),y:cam.y+rnd(-vh/2,vh/2),z:rnd(20,160),vx:rnd(-6,6),vy:rnd(-4,4),ph:rnd(0,TAU),k:'mote',s:rnd(1.2,2.6)});
  if(Math.random()<dt*1.4)A.push({x:cam.x+rnd(-vw/2,vw/2),y:cam.y-vh/2-40,z:0,vx:rnd(10,30),vy:rnd(28,46),ph:rnd(0,TAU),k:'petal',s:rnd(4,6.5),rot:rnd(0,TAU)});
  for(let i=A.length-1;i>=0;i--){const m=A[i];m.x+=(m.vx+Math.sin(T*.7+m.ph)*8)*dt;m.y+=m.vy*dt;if(m.k==='petal')m.rot+=dt*2;
    if(Math.abs(m.x-cam.x)>vw*.7||Math.abs(m.y-cam.y)>vh*.7)A.splice(i,1);}
  // the forest whispers
  if(SND.ready&&SND.on){const c=SND.ctx,now=c.currentTime;
    if(!SND.thG){const mk=(v,o)=>{const g=c.createGain();g.gain.value=v;g.connect(o);return g;};SND.thG=mk(0,SND.amb);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=260;lp.connect(SND.thG);
      for(const [f,ty,v] of [[55,'sine',.5],[55.6,'triangle',.3],[82.4,'sine',.22],[110.3,'sine',.08]]){const o=c.createOscillator(),g=c.createGain();o.type=ty;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(lp);o.start();}
      const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.07;lg.gain.value=.35;lfo.connect(lg);lg.connect(SND.thG.gain);lfo.start();
      const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=4;bp.frequency.value=600;SND.thWind=bp;const ns=c.createBufferSource();ns.buffer=SND.brown;ns.loop=true;ns.start();ns.connect(bp);SND.thWindG=mk(0,SND.amb);bp.connect(SND.thWindG);SND.thT=4;}
    const on=SCENE==='thorn'&&!BATTLE.on;SND.thG.gain.setTargetAtTime(on?.06:0,now,1.2);SND.thWindG.gain.setTargetAtTime(on?.05+.03*Math.sin(T*.23):0,now,.8);SND.thWind.frequency.setTargetAtTime(420+260*Math.sin(T*.17)+120*Math.sin(T*.61),now,.5);
    if(on){SND.thT-=dt;if(SND.thT<=0){SND.thT=6+Math.random()*9;const r=Math.random();
      if(r<.45){// a breathy whisper drifting past
        const t=now;for(let k=0;k<3;k++)noiseHit(t+k*.22+Math.random()*.1,.32+Math.random()*.2,'bandpass',900+Math.random()*1400,9,.05,SND.sfxVerb||SND.sfx,600+Math.random()*900);}
      else if(r<.8){// an old branch creaking
        const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(70+Math.random()*30,now);o.frequency.linearRampToValueAtTime(48+Math.random()*20,now+1.1);f.type='bandpass';f.frequency.value=420;f.Q.value=6;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(.05,now+.25);g.gain.linearRampToValueAtTime(0,now+1.2);o.connect(f);f.connect(g);g.connect(SND.sfxVerb||SND.sfx);o.start(now);o.stop(now+1.3);}
      else{// a far, cold chime
        const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=[622,698,740,932][Math.floor(Math.random()*4)];g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(.025,now+.05);g.gain.exponentialRampToValueAtTime(.0005,now+3.5);o.connect(g);g.connect(SND.sfxVerb||SND.sfx);o.start(now);o.stop(now+3.6);}}}}}
function drawThornMotes(){const A=THORN.motes||[];ctx.save();for(const m of A){if(m.k==='mote'){ctx.globalCompositeOperation='lighter';const tw=.5+.5*Math.sin(T*2+m.ph);drawGlow(ctx,m.x,m.y-m.z,m.s*5,'200,190,230',.22*tw);}
  else{ctx.globalCompositeOperation='source-over';ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.rot);ctx.scale(1,.55+.45*Math.sin(m.rot*1.7));ctx.fillStyle='rgba(120,22,34,.85)';ctx.beginPath();ctx.ellipse(0,0,m.s,m.s*.55,0,0,TAU);ctx.fill();ctx.restore();}}ctx.restore();}

/* ---------- tiny crawling spiders and webs strung over the corridors ---------- */
function buildThornCritters(){const H_=(a,b,s)=>hash(a,b,s);THORN.spiders=[];THORN.webs=[];
  for(let r=0;r<TMZ.R;r++)for(let c=0;c<TMZ.C;c++){
    const n=1+Math.floor(H_(r,c,101)*3);for(let k=0;k<n;k++)THORN.spiders.push({x:c*TCW+40+H_(r,c*5+k,103)*(TCW-80),y:r*TCH+40+H_(r,c*5+k,105)*(TCH-80),cx:c*TCW,cy:r*TCH,a:H_(r,c*5+k,107)*TAU,v:0,t:H_(r,c*5+k,109)*3,ph:H_(r,c*5+k,111)*5,s:.8+H_(r,c*5+k,113)*.5});
    // a web across the corridor wherever both sides are hedged
    if(vW(r,c)&&vW(r,c+1)&&H_(r,c,121)<.45)THORN.webs.push(mkWeb(c*TCW+20,r*TCH+TCH*(.35+H_(r,c,123)*.35),(c+1)*TCW-20,0,r*1000+c));
    else if(hW(r,c)&&hW(r+1,c)&&H_(r,c,125)<.4)THORN.webs.push(mkWeb(c*TCW+TCW*(.3+H_(r,c,127)*.4),r*TCH+8,0,(r+1)*TCH-8,r*1000+c+500,true));}}
function mkWeb(x0,y0,x1,y1,seed,vert){// x0,y0 to x1 (horizontal span) or y0 to y1 (vertical span); drawn as a raised web overhead
  const R_=(k)=>hash(seed,k,131);let cx,cy,anch=[];
  if(!vert){cx=(x0+x1)/2+(R_(1)-.5)*60;cy=y0-150-R_(2)*40;anch=[[x0,y0-170-R_(3)*50],[x0+10,y0-70],[x1,y0-160-R_(4)*50],[x1-10,y0-60],[cx+(R_(5)-.5)*80,y0-300-R_(6)*40],[cx+(R_(7)-.5)*60,y0-40]];}
  else{cx=x0+(R_(1)-.5)*40;cy=(y0+y1)/2-150;anch=[[x0-90,y0-120],[x0+90,y0-130],[x0-80,y1-170],[x0+85,y1-160],[x0-150,cy+(R_(5)-.5)*40],[x0+150,cy+(R_(6)-.5)*40]];}
  return {cx,cy,anch,seed,y:vert?y1:y0,spider:R_(9)<.5,sway:R_(10)*TAU,can:null};}
function webCanvas(w){if(w.can)return w.can;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of w.anch){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  const pad=20,cw=Math.ceil(x1-x0+pad*2),ch=Math.ceil(y1-y0+pad*2),c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d');const ox=-x0+pad,oy=-y0+pad,cx=w.cx+ox,cy=w.cy+oy;
  g.lineCap='round';g.strokeStyle='rgba(235,232,245,.75)';g.lineWidth=1.3;
  // frame threads to the anchors, then radials, then the sticky spiral
  const A=w.anch.map(([x,y])=>[x+ox,y+oy]).sort((p,q)=>Math.atan2(p[1]-cy,p[0]-cx)-Math.atan2(q[1]-cy,q[0]-cx));
  for(const [x,y] of A){g.beginPath();g.moveTo(cx,cy);g.lineTo(x,y);g.stroke();}
  g.lineWidth=.9;g.strokeStyle='rgba(225,222,240,.55)';const rad=[];const NR=16;for(let i=0;i<NR;i++){const a=i/NR*TAU+hash(w.seed,i,141)*.2;let best=1e9;
    // radial length limited by the frame polygon
    for(let k=0;k<A.length;k++){const p=A[k],q=A[(k+1)%A.length];const dx=Math.cos(a),dy=Math.sin(a),ex=q[0]-p[0],ey=q[1]-p[1],den=dx*ey-dy*ex;if(Math.abs(den)<1e-6)continue;const t=((p[0]-cx)*ey-(p[1]-cy)*ex)/den,u=((p[0]-cx)*dy-(p[1]-cy)*dx)/den;if(t>0&&u>=0&&u<=1)best=Math.min(best,t);}
    if(best>1e8)best=60;rad.push([a,best]);g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*best,cy+Math.sin(a)*best);g.stroke();}
  for(let k=0;k<A.length;k++){const p=A[k],q=A[(k+1)%A.length];g.beginPath();g.moveTo(p[0],p[1]);g.quadraticCurveTo((p[0]+q[0])/2+(cx-(p[0]+q[0])/2)*.12,(p[1]+q[1])/2+(cy-(p[1]+q[1])/2)*.12,q[0],q[1]);g.stroke();}
  g.lineWidth=.8;g.strokeStyle='rgba(230,228,245,.5)';for(let ring=1;ring<=11;ring++){const f=ring/12;g.beginPath();for(let i=0;i<=NR;i++){const [a,L]=rad[i%NR],rr=L*f*(1+(hash(w.seed,ring*20+i,151)-.5)*.06);const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr+f*4;if(!i)g.moveTo(px,py);else{const [pa,pL]=rad[(i-1)%NR],pr=pL*f,mx=cx+Math.cos((pa+a)/2+(i===NR?Math.PI:0))*pr*.93,my=cy+Math.sin((pa+a)/2+(i===NR?Math.PI:0))*pr*.93+f*6;g.quadraticCurveTo(mx,my,px,py);}}g.stroke();}
  // a few torn strands hanging down
  g.strokeStyle='rgba(225,222,240,.4)';for(let i=0;i<4;i++){const [a,L]=rad[(i*5)%NR];const px=cx+Math.cos(a)*L*.7,py=cy+Math.sin(a)*L*.7;g.beginPath();g.moveTo(px,py);g.quadraticCurveTo(px+6,py+30,px+(hash(w.seed,i,161)-.5)*20,py+50+hash(w.seed,i,163)*50);g.stroke();}
  c.ox=x0-pad;c.oy=y0-pad;w.can=c;return c;}
function updateThornCritters(dt){const vw=W/zoom,vh=H/zoom;for(const sp of THORN.spiders||[]){if(Math.abs(sp.x-cam.x)>vw||Math.abs(sp.y-cam.y)>vh)continue;sp.t-=dt;
    if(sp.t<=0){if(Math.random()<.35){sp.v=0;sp.t=rnd(.6,2.2);}else{sp.v=rnd(20,46);sp.a+=rnd(-1.6,1.6);sp.t=rnd(.8,2.6);}}
    // scatter from Lum's feet
    const dx=sp.x-lum.x,dy=sp.y-lum.y,d=Math.hypot(dx,dy);if(d<70){sp.a=Math.atan2(dy,dx);sp.v=80;sp.t=.6;}
    if(sp.v>0){let nx=sp.x+Math.cos(sp.a)*sp.v*dt,ny=sp.y+Math.sin(sp.a)*sp.v*dt*.7;if(nx<sp.cx+16||nx>sp.cx+TCW-16){sp.a=Math.PI-sp.a;nx=sp.x;}if(ny<sp.cy+10||ny>sp.cy+TCH-10){sp.a=-sp.a;ny=sp.y;}sp.x=nx;sp.y=ny;sp.ph+=dt*sp.v*.25;}}}
function drawThornCritters(x0,y0,x1,y1){const im=IMG.spider;if(ready(im))for(const sp of THORN.spiders||[]){if(sp.x<x0||sp.x>x1||sp.y<y0||sp.y>y1)continue;const flip=Math.cos(sp.a)<0;
    c1Frame(ctx,'spider',sp.v>0?'crawl':'idle',sp.v>0?Math.floor(sp.ph)%5:Math.floor(T*3+sp.ph)%4,sp.x,sp.y,54*sp.s,sp.v>0?!flip:flip,.95,0);}}
function drawThornWebs(x0,y0,x1,y1){for(const w of THORN.webs||[]){if(w.cx<x0-250||w.cx>x1+250||w.cy<y0-250||w.cy>y1+400)continue;const c=webCanvas(w);
    // brighter when the lantern catches it
    const d=Math.hypot(w.cx-lum.x,w.cy+120-lum.y),lit=clamp(1-d/520,0,1);ctx.save();ctx.globalAlpha=.42+.5*lit;const sw=Math.sin(T*.8+w.sway)*2;ctx.translate(sw,0);ctx.drawImage(c,c.ox,c.oy);
    if(w.spider&&ready(IMG.spider)){c1Frame(ctx,'spider','idle',Math.floor(T*2+w.sway)%4,w.cx,w.cy+14,30,false,.95,0);}
    if(lit>.2){ctx.globalCompositeOperation='lighter';drawGlow(ctx,w.cx,w.cy,60,'220,215,255',.12*lit);}ctx.restore();}}

/* ---------- the edge of Stranglethorn without a lantern: a still view of the forest, and no way in ---------- */
const THGATE={t:0};
const THGINT=[{x:40,y:600,reach:110,door:true,onInteract:()=>goScene(()=>{SCENE='woods';lum.x=2610;lum.y=628;lum.face=-1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x+60;cam.y=lum.y-50;})},
  {x:520,y:600,reach:470,onInteract:()=>say(["It's far too dark to go any further.","I can't find the path without a proper light.","The thorns swallow every bit of light. I will need something bright."][(sayCount++)%3])}];
function enterThornGate(){SCENE='thgate';THGATE.t=0;WEVENT.on=true;lum.x=500;lum.y=600;lum.vx=lum.vy=0;lum.state='idle';lum.face=1;
  setTimeout(()=>talk([['Lum',"The path disappears into the dark…"],['Lum',"I can't see a thing past the trees."]],false,()=>{WEVENT.on=false;}),900);}
function drawThornGate(){THGATE.t+=1/60;const im=IMG.thorngate;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#0c0608';ctx.fillRect(0,0,W,H);
  let px=W*.6,py=H*.62;if(ready(im)){const k=1.04+THGATE.t*.006,sc=Math.max(W/im.naturalWidth,H/im.naturalHeight)*k,iw=im.naturalWidth*sc,ih=im.naturalHeight*sc,ix=(W-iw)/2,iy=(H-ih)/2;ctx.drawImage(im,ix,iy,iw,ih);px=ix+iw*.585;py=iy+ih*.69;}
  // as dark as Gaia's Hollow: only the faint glimmer of the path beyond shows through
  {const R_=Math.hypot(W,H),r0=Math.min(W,H)*.06,r1=Math.min(W,H)*.42,fl=1+.04*Math.sin(THGATE.t*1.3);const g=ctx.createRadialGradient(px,py,0,px,py,R_);g.addColorStop(0,'rgba(4,3,8,.42)');g.addColorStop(r0*fl/R_,'rgba(4,3,8,.5)');g.addColorStop(r1*fl/R_,'rgba(4,3,8,.86)');g.addColorStop(1,'rgba(4,3,8,.9)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  if(typeof drawThornFog==='function'){drawThornFog(0);drawThornFog(1);}
  const vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.3,W/2,H*.5,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(6,2,6,0)');vg.addColorStop(1,'rgba(6,2,6,.65)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(ready(atlas)){const moving=lum.state==='walk',an=moving?LUM_ANIM.walk:LUM_ANIM.idleUp,fr=moving?an.frames[Math.floor(THGATE.t*an.fps)%an.frames.length]:an.frames[0],dh=Math.min(H*.25,W*.525),dw=dh*FW/FH,lx=W*.2+(W*.62)*clamp(lum.x/1000,0,1),ly=H*.95,b=moving?0:Math.sin(THGATE.t*2.3);THGATE.lx=lx;THGATE.ly=ly-dh*.86;
    ctx.save();ctx.translate(lx,ly);if(moving&&lum.face!==an.native)ctx.scale(-1,1);ctx.scale(1-.004*b,1+.009*b);ctx.filter='brightness(.5) saturate(.7)';ctx.drawImage(atlas,fr*FW,0,FW,FH,-dw/2,-dh*(274/280),dw,dh);ctx.filter='none';ctx.restore();
    ctx.save();ctx.globalCompositeOperation='lighter';drawGlow(ctx,lx+dw*.08,ly-dh*.62,dw*.5,'210,190,150',.07);ctx.restore();}
  if(THGATE.t<4.5){const a=Math.min(1,THGATE.t*1.2,(4.5-THGATE.t)*1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='rgba(20,5,10,.45)';ctx.fillRect(0,H*.3-40,W,80);ctx.fillStyle='#f0dede';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('Stranglethorn Forest',W/2,H*.3+10);ctx.restore();}}
