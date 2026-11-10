/* ---------- player ---------- */
const lum={x:0,y:40,face:1,state:'idle',at:0,fi:0,ft:0,aimx:1,aimy:0,cool:0,stepF:-1,bubble:0,vx:0,vy:0,blinkT:2.5,blink:0,wet:false,sprayAcc:0};
const COOL=.75;
/* Speed matched to her stride (about 96 world units per 6-frame cycle) so boots plant instead of sliding. */
const RUN_SPEED=205,ACCEL=11,DECEL=15,CAST_T=[.13,.62],INTERACT_T=.42,SPRAY_T=.3;
/* Things Lum can talk to or examine with B, and foes the water spray can start a battle with. Empty for now. */
const INTERACTABLES=[],FOES=[];

/* ---------- input ---------- */
const keys={};
addEventListener('keydown',e=>{if(C1I.on&&e.code==='Escape'){skipC1Intro();e.preventDefault();return;}if(MIX.on&&!CHOICE.on){if(!keys[e.code])mixKey(e.code);keys[e.code]=true;e.preventDefault();return;}if(INTRO.waiting&&CHSEL.on){if(!keys[e.code])chselKey(e.code);keys[e.code]=true;e.preventDefault();return;}if(CHOICE.on){if(!keys[e.code]){if(e.code==='ArrowLeft'||e.code==='KeyA'||e.code==='ArrowRight'||e.code==='KeyD')CHOICE.sel=1-CHOICE.sel;if(e.code==='KeyE'||e.code==='KeyK'||e.code==='Enter'||e.code==='Space')pickChoice(CHOICE.sel);if(e.code==='Escape')pickChoice(1);}keys[e.code]=true;e.preventDefault();return;}if(BATTLE.on){if(!keys[e.code])battleKey(e.code);keys[e.code]=true;if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();return;}if(!keys[e.code]){if(e.code==='KeyI'||e.code==='Tab'){e.preventDefault();MENU.open?closeMenu():openMenu();}if(e.code==='Escape'&&MENU.open)closeMenu();}if(MENU.open){keys[e.code]=true;return;}if(!keys[e.code]){if(e.code==='KeyJ'||e.code==='Space')pressA();if(e.code==='KeyK'||e.code==='KeyE'||e.code==='Enter')pressB();}keys[e.code]=true;if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=false;});
const stick={id:null,bx:0,by:0,x:0,y:0,R:58};
const BTN={a:{x:0,y:0,r:44,down:false,id:null,pulse:0,shake:0},b:{x:0,y:0,r:36,down:false,id:null,pulse:0,shake:0}};
let W=0,H=0,DPR=1,zoom=1;
{const _el=CanvasRenderingContext2D.prototype.ellipse;CanvasRenderingContext2D.prototype.ellipse=function(x,y,rx,ry,...r){return _el.call(this,x,y,Math.max(0,rx),Math.max(0,ry),...r);};}
function layoutButtons(){const pad=Math.max(18,W*.05);
  BTN.a.r=clamp(W*.09,29,40);BTN.b.r=BTN.a.r*.86;
  BTN.a.x=W-pad-BTN.a.r;BTN.a.y=H-pad-BTN.a.r-BTN.a.r*1.1;
  BTN.b.x=BTN.a.x-BTN.a.r*1.9;BTN.b.y=BTN.a.y+BTN.a.r*.8;stick.R=clamp(W*.15,48,66);}
function localPt(e){const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
const TAPS={};
cv.addEventListener('pointerdown',e=>{e.preventDefault();if(WEV.end>6.5){const [rx,ry]=localPt(e);resultsTap(rx,ry);return;}{const [tx,ty]=localPt(e);TAPS[e.pointerId]={x:tx,y:ty,t:performance.now(),ok:!(BATTLE.on||MENU.open||INTRO.on||INTRO.waiting||Math.hypot(tx-(W-28),ty-28)<26||(PLAYER()&&Math.hypot(tx-BOOKBTN.x,ty-BOOKBTN.y)<BOOKBTN.r+10))};}{const [px,py]=localPt(e);if(Math.hypot(px-(W-28),py-28)<26){audioInit();setSound(!SND.on);return;}}if(INTRO.waiting){const [qx,qy]=localPt(e);titleTap(qx,qy);return;}if(INTRO.on){introSkip();return;}const [x,y]=localPt(e);if(C1I.on&&C1I.skipHit){const h=C1I.skipHit;if(x>h.x-6&&x<h.x+h.w+6&&y>h.y-8&&y<h.y+h.h+8){TAPS[e.pointerId].ok=false;skipC1Intro();return;}}if(MIX.on&&!CHOICE.on){TAPS[e.pointerId].ok=false;mixTap(x,y);return;}if(CHOICE.on){TAPS[e.pointerId].ok=false;for(const h of CHOICE.hits)if(x>h.x&&x<h.x+h.w&&y>h.y&&y<h.y+h.h){pickChoice(h.i);return;}return;}if(BATTLE.on){battlePointer(x,y);return;}if(BATTLE.pending||WIPE.dir)return;if(MENU.open){menuTap(x,y);return;}if(PLAYER()&&Math.hypot(x-BOOKBTN.x,y-BOOKBTN.y)<BOOKBTN.r+10){if(DLG.active)dlgNext();else openMenu();return;}
  if(stick.id===null&&x<W*.62&&e.pointerType!=='mouse'){stick.id=e.pointerId;stick.bx=x;stick.by=y;stick.x=x;stick.y=y;cv.setPointerCapture(e.pointerId);}
},{passive:false});
cv.addEventListener('pointermove',e=>{{const tp=TAPS[e.pointerId];if(tp){const [x,y]=localPt(e);if(Math.hypot(x-tp.x,y-tp.y)>=14)tp.ok=false;}}if(e.pointerId===stick.id){const [x,y]=localPt(e);stick.x=x;stick.y=y;const dx=x-stick.bx,dy=y-stick.by,d=Math.hypot(dx,dy);
  if(d>stick.R*1.35){stick.bx=x-dx/d*stick.R*1.35;stick.by=y-dy/d*stick.R*1.35;}}});
const endPtr=e=>{{const tp=TAPS[e.pointerId];delete TAPS[e.pointerId];if(tp&&tp.ok&&e.type==='pointerup'){const [x,y]=localPt(e);if(Math.hypot(x-tp.x,y-tp.y)<14&&performance.now()-tp.t<380)tapScreen();}}if(e.pointerId===stick.id)stick.id=null;for(const k in BTN)if(BTN[k].id===e.pointerId){BTN[k].down=false;BTN[k].id=null;}};
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
function inputVec(){if(INTRO.on||FADE.dir||MENU.open||WEVENT.on||CHOICE.on||MIX.on||BATTLE.pending||WIPE.dir)return [0,0,0];let x=0,y=0;
  if(keys.KeyA||keys.ArrowLeft)x-=1;if(keys.KeyD||keys.ArrowRight)x+=1;if(keys.KeyW||keys.ArrowUp)y-=1;if(keys.KeyS||keys.ArrowDown)y+=1;
  if(x||y){const d=Math.hypot(x,y);return [x/d,y/d,1];}
  if(stick.id!==null){const dx=(stick.x-stick.bx)/stick.R,dy=(stick.y-stick.by)/stick.R,m=Math.hypot(dx,dy);if(m<.14)return [0,0,0];return [dx/m,dy/m,(Math.min(1,m)-.14)/.86];}
  return [0,0,0];}
const busy=()=>lum.state==='cast'||lum.state==='interact';
/* A: water magic. Any droplet that lands on a foe starts a battle. */
function backToTitle(){if(backToTitle.go)return;backToTitle.go=1;FADE.dir=1;FADE.cb=()=>location.reload();}
function pressA(){if(WEV.end>9.7){backToTitle();return;}if(DLG.active&&!CHOICE.on&&!MIX.on&&!FADE.dir&&!MENU.open&&!BATTLE.pending&&!WIPE.dir&&!INTRO.on&&!INTRO.waiting&&performance.now()>=(CHOICE.until||0)){dlgNext();return;}if(CHOICE.on||MIX.on||FADE.dir||MENU.open||WEVENT.on||BATTLE.pending||WIPE.dir)return;if(INTRO.waiting){titleKey();return;}if(INTRO.on){introSkip();return;}if(DLG.active){dlgNext();return;}if(busy())return;pressB();}
/* B: interact with the nearest NPC or object in reach. */
/* the sword emote: an enemy close enough to strike first. Bosses, sleeping/still foes and scripted fights keep their own openings. */
const STRIKE_R=120,STRIKE_NO={slugking:1,reaper:1,bigspider:1,bigvixen:1};
function nearFoe(){if(!PLAYER())return null;const L=SCENE==='garden'?SLUGS:SCENE==='thorn'?THFOES:SCENE==='dun'?DFOES.filter(g=>g.room===DUN.room):roomSlimes();let best=null,bd=STRIKE_R;
  for(const g of L){if(!g||g.dead||g.calm>0||g.still||g.boss||g.scripted||STRIKE_NO[g.kind]||(g.rise!==undefined&&g.rise<1)||(g.scene&&g.scene!==SCENE))continue;const d=Math.hypot(g.x-lum.x,(g.y-lum.y)*1.4);if(d<bd){bd=d;best=g;}}return best;}
function strikeFirst(g){HINT.cast=1;lum.vx=lum.vy=0;startEncounter(g,'first');}
function nearInteract(){if(!PLAYER()||busy())return null;{const f=nearFoe();if(f)return {foe:f};}
  if(SCENE==='garden')for(const g of SLUGS)if(Math.hypot(g.x-lum.x,g.y-lum.y)<70)return {slug:g};
  if(SCENE!=='garden'&&SCENE!=='woods'&&SCENE!=='thorn')for(const g of roomSlimes())if(!g.dead&&Math.hypot(g.x-lum.x,g.y-lum.y)<90)return {slime:g};
  let best=null,bd=1e9;for(const o of (SCENE==='well'?WINT:SCENE==='study'?SINT:SCENE==='shed'?SHINT:SCENE==='pond'?PINT:SCENE==='shop'?SHOPINT:SCENE==='bed'?BEDINT:SCENE==='vhut'?VHINT:SCENE==='thgate'?THGINT:SCENE==='thorn'?THINT:SCENE==='dun'?DUNINT:SCENE==='woods'?WINTS:INTERACTABLES)){const d=Math.hypot(o.x-lum.x,o.y-lum.y);if(o.lum&&d<o.reach){best=o;break;}if(d<(o.reach||90)&&d<bd){bd=d;best=o;}}return best;}
let NEAR=null,nearA=0;
function tapScreen(){if(CHOICE.on||MIX.on||performance.now()<(CHOICE.until||0)||FADE.dir||MENU.open||BATTLE.pending||WIPE.dir||BATTLE.on)return;if(DLG.active){dlgNext();return;}if(NEAR&&!busy())pressB();}
function pressB(){if(WEV.end>9.7){backToTitle();return;}if(FADE.dir||MENU.open||BATTLE.pending||WIPE.dir)return;if(INTRO.waiting){titleKey();return;}if(INTRO.on){introSkip();return;}BTN.b.pulse=1;if(DLG.active){dlgNext();return;}if(busy())return;
  {const f=nearFoe();if(f){strikeFirst(f);return;}}
  if(SCENE==='garden')for(const g of SLUGS)if(Math.hypot(g.x-lum.x,g.y-lum.y)<70&&!DLG.active){lum.state='interact';lum.at=0;HINT.looked=1;g.shy=2.5;say(SLUG_LINES[(slugTalk++)%SLUG_LINES.length]);return;}
  if(SCENE!=='garden')for(const g of roomSlimes())if(!g.dead&&Math.hypot(g.x-lum.x,g.y-lum.y)<90){lum.state='interact';lum.at=0;say(['It\'s shimmering at me. Menacingly.','I can see little sparks of magic swirling inside it… like it swallowed a piece of the pool.','Its tentacles keep reaching for my staff. No! Mine!'][(slimeTalk++)%3]);return;}
  let best=null,bd=1e9;for(const o of (SCENE==='well'?WINT:SCENE==='study'?SINT:SCENE==='shed'?SHINT:SCENE==='pond'?PINT:SCENE==='shop'?SHOPINT:SCENE==='bed'?BEDINT:SCENE==='vhut'?VHINT:SCENE==='thgate'?THGINT:SCENE==='thorn'?THINT:SCENE==='dun'?DUNINT:SCENE==='woods'?WINTS:INTERACTABLES)){const d=Math.hypot(o.x-lum.x,o.y-lum.y);if(o.lum&&d<o.reach){best=o;break;}if(d<(o.reach||90)&&d<bd){bd=d;best=o;}}
  lum.state='interact';lum.at=0;
  if(best&&best.onInteract){best.onInteract();HINT.looked=1;}else{lum.bubble=1.1;}}
function startBattle(foe){/* battle scene goes here once foes exist */battleFlash=1;}
let battleFlash=0;

/* ---------- effects ---------- */
const PARTS=[];let shake=0;
function puff(x,y,n,type,o={}){for(let i=0;i<n;i++)PARTS.push({type,x,y,z:o.z??0,vx:rnd(-1,1)*(o.sp??40),vy:rnd(-1,1)*(o.sp??40)*.6,vz:o.vz?rnd(o.vz*.5,o.vz):0,life:0,max:rnd(.5,1)*(o.life??1),s:rnd(.6,1.2)*(o.size??4),rot:rnd(0,TAU),vr:rnd(-8,8),col:o.col||(type==='fiz'?undefined:'#fff')});}
const PUDDLES=[];
/* spray: a loose cone of droplets and mist thrown from the spear tip */
function emitSpray(n){
  let ax=lum.aimx,ay=lum.aimy;const d=Math.hypot(ax,ay)||1;ax/=d;ay/=d;
  if(Math.abs(ay)<.38||Math.sign(ax)!==lum.face){ax=lum.face*Math.max(.8,Math.abs(ax));ay*=.6;const dd=Math.hypot(ax,ay);ax/=dd;ay/=dd;}
  const ox=lum.x+lum.face*78,oy=lum.y+ay*10,oz=92;
  const base=Math.atan2(ay,ax);
  for(let i=0;i<n;i++){const big=Math.random()<.18;
    const a=base+(Math.random()+Math.random()-1)*.42,sp=rnd(220,520)*(big?.8:1);
    PARTS.push({type:'spray',x:ox+rnd(-4,4),y:oy+rnd(-3,3),z:oz+rnd(-6,6),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.62,vz:rnd(-30,150),life:0,max:1.6,s:big?rnd(2.6,3.8):rnd(1.1,2.4)});
    if(Math.random()<.2)PARTS.push({type:'mist',x:ox,y:oy,z:oz,vx:Math.cos(a)*sp*.55,vy:Math.sin(a)*sp*.35,vz:rnd(-10,40),life:0,max:rnd(.5,.9),s:rnd(8,14)});
  }
  if(Math.random()<.5)PARTS.push({type:'glint',x:ox+rnd(-10,30)*lum.face,y:oy,z:oz+rnd(-14,14),vx:ax*rnd(60,160),vy:ay*60,vz:rnd(-20,30),life:0,max:rnd(.3,.6),s:rnd(3,5)});
}
function landSpray(p){
  if(Math.random()<.35)PARTS.push({type:'ring',x:p.x,y:p.y,z:0,life:0,max:rnd(.35,.6),s:rnd(.12,.25)});
  if(p.s>2.5&&Math.random()<.5)for(let k=0;k<2;k++)PARTS.push({type:'drop',x:p.x,y:p.y,z:1,vx:rnd(-40,40),vy:rnd(-20,20),vz:rnd(60,120),life:0,max:.6,s:rnd(1,1.6)});
  if(Math.random()<.06)PUDDLES.push({x:p.x,y:p.y,t:0,r:rnd(10,20)});
  for(const f of FOES)if(Math.hypot(f.x-p.x,f.y-p.y)<(f.r||30)){startBattle(f);break;}
  for(const d of DRAINED)if(Math.hypot(d.x-p.x,(d.y-p.y)*1.4)<60){if(d.soaked<=0){d.soaked=2.2;for(let k=0;k<10;k++)PARTS.push({type:'wsp',x:d.x+rnd(-30,30),y:d.y-rnd(20,90),z:0,vx:rnd(-8,8),vy:-rnd(14,34),vz:0,life:0,max:rnd(1,2),s:rnd(1.4,2.4)});
      if(!d.toldWater&&!DLG.active){d.toldWater=1;say("It drank the water… but water alone won't bring its magic back.");}}break;}
}

/* ambient spirit lights drifting over the meadow */
const BUGS=[[-300,260,'#ffc6e0'],[480,170,'#c9e8ff'],[-160,420,'#fff1a8'],[620,300,'#e0ccff']].map(([x,y,col],i)=>({x,y,hx:x,hy:y,tx:x,ty:y,z:30,ph:i*2,col}));
const MOTES=[];for(let i=0;i<34;i++)MOTES.push({x:rnd(-300,300),y:rnd(-500,500),z:rnd(20,150),ph:rnd(0,TAU),sp:rnd(.4,1),hue:Math.random()});

