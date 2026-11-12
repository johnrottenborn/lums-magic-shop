const ATLAS_SRC="__ATLAS__";
const ASSET_SRC=__ASSETS__;
const COSMIC_SRC="__COSMIC__";
const SLUG_SRC="__SLUG__";
(()=>{
"use strict";
const TAU=Math.PI*2, rnd=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>v<a?a:v>b?b:v;
const game=document.getElementById('game'), cv=document.getElementById('c');let ctx=cv.getContext('2d');let WHITEPASS=false;

/* ---------- images ---------- */
const atlas=new Image(); atlas.src=ATLAS_SRC;
const IMG={};for(const k in ASSET_SRC){IMG[k]=new Image();IMG[k].src=ASSET_SRC[k];}
const ready=im=>im&&(im instanceof HTMLCanvasElement?im.width>0:im.complete&&im.naturalWidth>0);
const FW=300,FH=280,SPR=0.6;let LUMK=.85;
let PC='lum';let CH=0,HERO='cosmic';const PLAYER=()=>PC==='cosmic'||CH>0;
const LUM_ANIM={
  idle:{frames:[37],fps:1,blink:37,native:1},
  walk:{frames:[27,28,29,30],fps:8,native:1},
  walkUp:{frames:[22,23,24,25,26],fps:9,native:1},
  walkDown:{frames:[37,38,39,40,41,42],fps:9,native:1},
  idleUp:{frames:[22],native:1},
  interact:{frames:[11],native:1},
  cast:{frames:[32,35],native:1}
};
const COS_BLADE={idle:{frames:[40],fps:1,blink:40,native:1},walk:{frames:[53,54,55,56,57,58],fps:10,native:1},walkUp:{frames:[48,49,50,51,52],fps:9,native:1},walkDown:{frames:[40,41,42,43],fps:7,native:1},idleUp:{frames:[48],native:1},interact:{frames:[44],native:1},cast:{frames:[59,61,63,66],native:1}};
const bladeFr=(fr,who='cosmic')=>{if(!(PARTY[who]&&PARTY[who].main==='blade'))return fr;if(fr===16||fr===20||fr===21)return BATTLE.on?44:40;if(fr<=7)return 53+((fr*6/8)|0);if(fr===17||fr===18)return 60;if(fr===19)return 63;return fr;};
/* battle frames for the blade: ready stance, stride in, three-beat wind-up, four-beat slash */
function bladeBattleFr(h){const B=BATTLE,ph=B.phase,t=B.t,me=B.heroes[B.cur]===h;if(!me||h.ko)return 44;
  if(ph==='bonkRun')return 44+(Math.floor(t*12)%4);if(ph==='bonkWind')return 59+Math.min(2,Math.floor(t/B.windD*3));if(ph==='bonkHit')return 62+Math.min(4,Math.floor(t/.09));
  if(ph==='bonkBack'||ph==='run'||ph==='fled')return 53+(Math.floor(t*14)%6);return 44;}
const COS_ANIM={idle:{frames:[16],fps:1,blink:16,native:1},walk:{frames:[34,35,36,37,38,39],fps:10,native:1},walkUp:{frames:[26,27,28,29,30,31,32,33],fps:12,native:1},walkDown:{frames:[22,23,24,25],fps:7,native:1},
  idleUp:{frames:[26],native:1},interact:{frames:[17],native:1},cast:{frames:[17,18,19,20],native:1}};
let ANIM=LUM_ANIM;

/* ---------- helpers ---------- */
function hash(a,b,c=0){let h=(a*374761393+b*668265263+c*2147483647)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;}
function wind(t,x,y){return .35*Math.sin(t*1.1-x*.004-y*.002)+.55*Math.pow(Math.max(0,Math.sin(t*.35-x*.0015)),4);}
const glowCache={};
function glowCanvas(rgb){let g=glowCache[rgb];if(!g){g=document.createElement('canvas');g.width=g.height=128;const q=g.getContext('2d');const gr=q.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,`rgba(${rgb},1)`);gr.addColorStop(.3,`rgba(${rgb},.45)`);gr.addColorStop(1,`rgba(${rgb},0)`);q.fillStyle=gr;q.fillRect(0,0,128,128);glowCache[rgb]=g;}return g;}
function drawGlow(c,x,y,r,rgb,a){if(WHITEPASS)return;c.globalAlpha=a;c.drawImage(glowCanvas(rgb),x-r,y-r,r*2,r*2);c.globalAlpha=1;}


/* draw something turned to stone: render it offscreen, grey the pixels, draw it back (no ctx.filter, so Safari is fine) */
const STONE={};
function withStone(key,bx,by,bw,bh,fn){const m=ctx.getTransform(),sc=Math.max(.5,Math.hypot(m.a,m.b)),k=key+'|'+Math.round(bx)+'|'+Math.round(by)+'|'+sc.toFixed(2);let e=STONE[key];
  if(!e||e.k!==k){const oc=document.createElement('canvas');oc.width=Math.max(1,Math.ceil(bw*sc));oc.height=Math.max(1,Math.ceil(bh*sc));const ox=oc.getContext('2d');ox.setTransform(sc,0,0,sc,-bx*sc,-by*sc);
    const keep=ctx;ctx=ox;try{fn();}finally{ctx=keep;}
    try{const im=ox.getImageData(0,0,oc.width,oc.height),d=im.data;for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const L=(d[i]*.3+d[i+1]*.59+d[i+2]*.11)*.82+38;d[i]=L*1.02;d[i+1]=L;d[i+2]=L*.95;}ox.setTransform(1,0,0,1,0,0);ox.putImageData(im,0,0);}catch(err){}
    e=STONE[key]={k,c:oc};}
  ctx.drawImage(e.c,bx,by,bw,bh);}
/* a column of fire: flickering tongues, a hot glow and rising embers. x,y is the base, h its height */
/* flames (every fire in the game: clearing, root fires, Spar's hellfire, battle): soft glowing particles that rise slowly, shrink and cool from
   pale yellow to orange to deep red, then drift off as faint smoke. Each fire gets its own pattern from where it stands. */
function drawFlames(c,x,y,h,a){if(a<=0||h<=0)return;const sd=((x*.37+y*.11)|0)%97,ga=c.globalAlpha;c.save();
  c.globalCompositeOperation='lighter';drawGlow(c,x,y-h*.25,h*.85,'255,110,40',.18*a);
  const N=Math.round(clamp(18+h*.16,18,46));for(let i=0;i<N;i++){const sp=.32+hash(i,sd+1,71)*.22,t=(T*sp+hash(i,sd+2,71))%1,
    dx=(hash(i,sd+3,71)-.5)*h*.34*(1-t*.55)+Math.sin(T*1.6+i*1.3)*h*.04*t,px=x+dx,py=y-t*h*1.05,r=h*.2*(1-t)**.7+2;
    const col=t<.2?'255,214,140':t<.5?'250,130,60':'210,66,36';drawGlow(c,px,py,r,col,(1-t)*.24*a);}
  c.globalCompositeOperation='source-over';for(let i=0;i<7;i++){const t=(T*.16+hash(i,sd+7,71))%1,px=x+(hash(i,sd+8,71)-.5)*h*.3+Math.sin(T*.6+i)*h*.14*t,py=y-h*(.85+t*1.1),r=h*.14+h*.3*t;drawGlow(c,px,py,r,'110,102,108',.22*(1-t)*Math.min(1,t*4)*a);}
  c.restore();c.globalAlpha=ga;}
