/* =====================================================================
   Sound: everything is synthesized live with Web Audio (no files).
   Music box + harp theme, birds, stream, wind, and little effects.
   ===================================================================== */
const SND={ctx:null,on:true,ready:false,nextNote:0,step:0,birdT:2,runeCool:0,streamF:900};
try{SND.on=localStorage.getItem('lum_sound')!=='off';}catch(e){}
function audioInit(){if(SND.ctx){if(SND.ctx.state==='suspended')SND.ctx.resume();return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC();SND.ctx=c;
  const mk=(v,to)=>{const g=c.createGain();g.gain.value=v;g.connect(to);return g;};
  SND.master=mk(SND.on?.85:0,c.destination);
  // soft hall reverb from a decaying noise impulse
  const len=c.sampleRate*2.6,ir=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
  SND.verb=c.createConvolver();SND.verb.buffer=ir;SND.verbOut=mk(.9,SND.master);SND.verb.connect(SND.verbOut);
  SND.music=mk(.3,SND.master);SND.musicVerb=mk(.55,SND.verb);SND.music.connect(SND.musicVerb);
  SND.sfx=mk(.7,SND.master);SND.sfxVerb=mk(.35,SND.verb);SND.sfx.connect(SND.sfxVerb);
  SND.amb=mk(.55,SND.master);
  // noise sources
  const nb=(sec,brown)=>{const b=c.createBuffer(1,c.sampleRate*sec,c.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;if(brown){last=(last+.02*w)/1.02;d[i]=last*3.5;}else d[i]=w;}return b;};
  SND.white=nb(2,false);SND.brown=nb(5,true);
  const loop=(buf)=>{const s=c.createBufferSource();s.buffer=buf;s.loop=true;s.start();return s;};
  // stream: brown noise through a wandering band-pass, plus a sparkly top layer
  SND.streamBP=c.createBiquadFilter();SND.streamBP.type='bandpass';SND.streamBP.frequency.value=900;SND.streamBP.Q.value=.8;
  SND.streamG=mk(0,SND.amb);loop(SND.brown).connect(SND.streamBP);SND.streamBP.connect(SND.streamG);
  const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=3200;SND.streamHiG=mk(0,SND.amb);loop(SND.white).connect(hp);hp.connect(SND.streamHiG);
  // wind and leaf rustle
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=420;SND.windG=mk(0,SND.amb);loop(SND.brown).connect(lp);lp.connect(SND.windG);
  const lhp=c.createBiquadFilter();lhp.type='bandpass';lhp.frequency.value=5200;lhp.Q.value=.6;SND.leafG=mk(0,SND.amb);loop(SND.white).connect(lhp);lhp.connect(SND.leafG);
  SND.nextNote=c.currentTime+.4;SND.ready=true;
  document.addEventListener('visibilitychange',()=>{if(!SND.ctx)return;if(document.hidden)SND.ctx.suspend();else SND.ctx.resume();});}
for(const ev of ['pointerdown','pointerup','touchend','click','keydown'])addEventListener(ev,audioInit,{capture:true});
function setSound(on){SND.on=on;try{localStorage.setItem('lum_sound',on?'on':'off');}catch(e){}if(SND.master)SND.master.gain.setTargetAtTime(on?.85:0,SND.ctx.currentTime,.15);}

/* --- instruments --- */
function panNode(p){const c=SND.ctx;if(c.createStereoPanner){const n=c.createStereoPanner();n.pan.value=p;return n;}return c.createGain();}
function pluck(t,f,vel,dec,out,pan=0,bright=1){const c=SND.ctx,g=c.createGain(),pn=panNode(pan);g.connect(pn);pn.connect(out);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.006);g.gain.exponentialRampToValueAtTime(.0005,t+dec);
  for(const [m,a,typ] of [[1,1,'sine'],[2,.35*bright,'triangle'],[3.01,.12*bright,'sine']]){const o=c.createOscillator();o.type=typ;o.frequency.value=f*m;const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(g);o.start(t);o.stop(t+dec+.05);}}
function bell(t,f,vel,dec,out,pan=0){const c=SND.ctx,g=c.createGain(),pn=panNode(pan);g.connect(pn);pn.connect(out);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.003);g.gain.exponentialRampToValueAtTime(.0004,t+dec);
  for(const [m,a] of [[1,1],[2.76,.32],[5.4,.12],[8.93,.05]]){const o=c.createOscillator();o.type='sine';o.frequency.value=f*m;const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(g);o.start(t);o.stop(t+dec+.05);}}
function pad(t,freqs,dur,vel){const c=SND.ctx;for(const f of freqs){const g=c.createGain();g.connect(SND.music);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur);
  const lpf=c.createBiquadFilter();lpf.type='lowpass';lpf.frequency.value=900;lpf.connect(g);for(const d of [-4,4]){const o=c.createOscillator();o.type='triangle';o.frequency.value=f;o.detune.value=d;o.connect(lpf);o.start(t);o.stop(t+dur+.1);}}}
function noiseHit(t,dur,type,freq,q,vel,out,sweepTo){const c=SND.ctx,s=c.createBufferSource();s.buffer=SND.white;const f=c.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(freq,t);f.Q.value=q;
  if(sweepTo)f.frequency.exponentialRampToValueAtTime(sweepTo,t+dur);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+Math.min(.01,dur*.2));g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  s.connect(f);f.connect(g);g.connect(out);s.start(t,Math.random()*1.5);s.stop(t+dur+.05);}

/* --- the theme: D major, a lullaby-paced music box over harp arpeggios --- */
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const PROG=[[50,[62,66,69,73]],[47,[59,62,66,69]],[43,[55,59,62,66]],[45,[57,61,64,69]],[50,[62,66,69,74]],[54,[57,61,66,69]],[43,[55,59,64,67]],[45,[57,61,64,67]]];
const MEL=[[78,-1,81,-1,78,76,-1,74],[76,-1,-1,74,73,-1,71,-1],[74,-1,79,-1,78,-1,74,-1],[76,-1,73,-1,69,-1,-1,-1],[78,-1,81,83,81,-1,78,-1],[76,-1,78,-1,73,-1,-1,-1],[74,76,79,-1,78,76,74,-1],[73,-1,76,-1,74,-1,-1,-1]];
const ARP=[0,1,2,3,2,1,2,1],EIGHTH=60/64/2;
function scheduleMusic(){if(BMUS.on){scheduleBattleMusic();return;}if(NIGHT.on){SND.nextNote=SND.ctx.currentTime+.1;return;}if(CH>0&&(SCENE==='woods'||SCENE==='dun'||SCENE==='thorn'||SCENE==='thgate')){scheduleWoodsMusic();return;}SND.wStep=0;const c=SND.ctx;while(SND.nextNote<c.currentTime+.25){const t=SND.nextNote,s=SND.step,bar=Math.floor(s/8)%PROG.length,e=s%8,[root,ch]=PROG[bar],section=Math.floor(s/64)%4;
    if(e===0){pluck(t,NOTE(root-12),.22,2.6,SND.music,0,.5);pad(t,ch.slice(0,3).map(NOTE),EIGHTH*8+.4,.012);}
    if(e===4)pluck(t,NOTE(root),.12,1.8,SND.music,0,.5);
    pluck(t+(Math.random()-.5)*.012,NOTE(ch[ARP[e]]),.07+(e===0?.03:0),1.6,SND.music,(ARP[e]-1.5)*.25,.7);
    if(section!==2){const m=MEL[bar][e];if(m>0)bell(t+.004,NOTE(m+(section===3?12:0)),section===3?.05:.075,2.2,SND.music,.12);}
    else if(e%2===0&&Math.random()<.5)bell(t,NOTE(ch[(Math.random()*4)|0]+24),.035,2,SND.music,(Math.random()-.5)*.6);
    SND.nextNote+=EIGHTH*(e%2?.94:1.06);SND.step++;}}

/* --- the Whispering Wood: slow, hushed and a little uneasy --- */
const WPROG=[[38,[50,53,57,62]],[34,[46,50,53,57]],[36,[48,51,55,60]],[33,[45,50,52,57]]],WSCALE=[74,76,77,79,81,82,84,86,89];
function scheduleWoodsMusic(){const c=SND.ctx,Q=60/46;if(!SND.wNext||SND.wNext<c.currentTime-1)SND.wNext=c.currentTime+.1;
  while(SND.wNext<c.currentTime+.3){const t=SND.wNext,s=SND.wStep||0,bar=Math.floor(s/8)%WPROG.length,e=s%8,[root,ch]=WPROG[bar],dun=SCENE==='dun';
    if(e===0){pluck(t,NOTE(root),dun?.2:.16,6,SND.music,0,.25);pad(t,ch.map(NOTE),Q*8+1,dun?.012:.009);}
    if(e===4&&Math.random()<.6)pluck(t,NOTE(root+7),.07,4,SND.music,-.2,.3);
    if((e===2||e===6)&&Math.random()<.55){const n=WSCALE[(Math.random()*WSCALE.length)|0];bell(t+Math.random()*.15,NOTE(n),.035,3.4,SND.music,(Math.random()-.5)*.9);
      if(Math.random()<.3)bell(t+Q*.5,NOTE(n-1),.022,3,SND.music,(Math.random()-.5)*.9);}
    if(e===7&&bar===3&&Math.random()<.5)bell(t,NOTE(73),.03,4,SND.music,.5);
    SND.wNext+=Q;SND.wStep=s+1;}
  SND.nextNote=c.currentTime+.1;}

/* --- birds: little chirps and trills scattered around the clearing --- */
function bird(){const c=SND.ctx,t=c.currentTime+.05,n=2+((Math.random()*5)|0),base=2400+Math.random()*2200,pan=Math.random()*1.6-.8,kind=Math.random();
  for(let i=0;i<n;i++){const st=t+i*(kind<.5?.09:.14),o=c.createOscillator(),g=c.createGain(),pn=panNode(pan);o.type='sine';
    const f0=base*(1+(Math.random()-.5)*.15),f1=f0*(kind<.5?1.35:.72);o.frequency.setValueAtTime(f0,st);o.frequency.exponentialRampToValueAtTime(f1,st+.07);
    g.gain.setValueAtTime(0,st);g.gain.linearRampToValueAtTime(.045,st+.01);g.gain.exponentialRampToValueAtTime(.0005,st+.09);o.connect(g);g.connect(pn);pn.connect(SND.amb);pn.connect(SND.sfxVerb);o.start(st);o.stop(st+.12);}}

/* --- effects --- */
function sfxStep(stone){if(!SND.ready)return;const t=SND.ctx.currentTime;
  if(stone){noiseHit(t,.05,'bandpass',2400+Math.random()*700,3,.055,SND.sfx);const o=SND.ctx.createOscillator(),g=SND.ctx.createGain();o.frequency.value=150+Math.random()*25;g.gain.setValueAtTime(.03,t);g.gain.exponentialRampToValueAtTime(.0005,t+.06);o.connect(g);g.connect(SND.sfx);o.start(t);o.stop(t+.08);
    if(SND.runeCool<=0&&Math.random()<.45){SND.runeCool=.6;const sc=[86,88,90,93,95,98];bell(t+.03,NOTE(sc[(Math.random()*sc.length)|0]),.025,1.6,SND.sfx,(Math.random()-.5)*.4);}}
  else noiseHit(t,.1,'bandpass',1200+Math.random()*500,.9,.035,SND.sfx);}
function sfxWade(){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.22,'bandpass',1800+Math.random()*600,1.1,.12,SND.sfx,600);noiseHit(t+.03,.12,'highpass',3500,.7,.04,SND.sfx);}
function sfxSplash(){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.5,'bandpass',3200,1.2,.22,SND.sfx,700);noiseHit(t+.02,.28,'highpass',4000,.7,.06,SND.sfx);
  for(let i=0;i<6;i++){const st=t+.35+Math.random()*.6,o=SND.ctx.createOscillator(),g=SND.ctx.createGain(),f=1100+Math.random()*1300;o.frequency.setValueAtTime(f,st);o.frequency.exponentialRampToValueAtTime(f*.55,st+.05);
    g.gain.setValueAtTime(.04,st);g.gain.exponentialRampToValueAtTime(.0005,st+.07);o.connect(g);g.connect(SND.sfx);o.start(st);o.stop(st+.09);}}
function sfxWell(){if(!SND.ready)return;const t=SND.ctx.currentTime;[86,90,93,98,100,105].forEach((n,i)=>bell(t+i*.12,NOTE(n),.07,2.6,SND.sfx,(i-2.5)*.15));noiseHit(t,1.2,'highpass',6000,.5,.02,SND.sfxVerb);}
function sfxFizzle(near){if(!SND.ready||!near)return;const t=SND.ctx.currentTime;[100,97,93,88].forEach((n,i)=>bell(t+i*.06,NOTE(n),.03,.5,SND.sfx,.2));noiseHit(t+.25,.3,'bandpass',900,1,.05,SND.sfx);}
/* possessed Cosmic (Chapter 1 on): a child's note that sags and splits into a low demonic growl, with a breathy whisper under it */
function sfxPossessed(){if(!SND.ready)return;const c=SND.ctx,t=c.currentTime,out=SND.sfx;
  const v=c.createOscillator(),vg=c.createGain();v.type='triangle';v.frequency.setValueAtTime(NOTE(81),t);v.frequency.exponentialRampToValueAtTime(NOTE(57),t+.55);
  vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(.05,t+.02);vg.gain.exponentialRampToValueAtTime(.001,t+.6);v.connect(vg);vg.connect(out);v.start(t);v.stop(t+.65);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=6;lp.frequency.setValueAtTime(900,t+.08);lp.frequency.exponentialRampToValueAtTime(180,t+1.1);
  const gg=c.createGain();gg.gain.setValueAtTime(0,t+.08);gg.gain.linearRampToValueAtTime(.09,t+.22);gg.gain.exponentialRampToValueAtTime(.001,t+1.15);lp.connect(gg);gg.connect(out);gg.connect(SND.sfxVerb);
  const trem=c.createOscillator(),tg=c.createGain();trem.frequency.value=23;tg.gain.value=.5;trem.connect(tg);tg.connect(gg.gain);trem.start(t);trem.stop(t+1.2);
  for(const [n,d] of [[33,0],[33,-17],[40,9]]){const o=c.createOscillator();o.type='sawtooth';o.detune.value=d;o.frequency.setValueAtTime(NOTE(n+5),t+.08);o.frequency.exponentialRampToValueAtTime(NOTE(n-3),t+1.1);o.connect(lp);o.start(t+.08);o.stop(t+1.2);}
  noiseHit(t+.05,.9,'bandpass',2400,4,.05,SND.sfxVerb,500);noiseHit(t+.1,.6,'lowpass',220,1,.12,out);}
function sfxBlip(who){if(!SND.ready)return;if(who==='Cosmic'&&CH>0){sfxPossessed();return;}const t=SND.ctx.currentTime;pluck(t,NOTE(who==='Cosmic'?81:76),.05,.35,SND.sfx,who==='Cosmic'?.2:-.2,.4);}

/* --- per-frame mix --- */
function audioUpdate(dt){if(!SND.ready||!SND.on)return;scheduleMusic();const c=SND.ctx,now=c.currentTime;SND.runeCool-=dt;
  const n=creekNearest(lum.x,lum.y);let d=n?Math.max(0,n.d-n.w):999;const dp=Math.hypot((lum.x-POND.x)/POND.rx,(lum.y-POND.y)/POND.ry);d=Math.min(d,Math.max(0,(dp-1)*POND.rx));
  const OUT=SCENE==='garden'||SCENE==='woods'||SCENE==='thorn',near=SCENE!=='garden'?0:Math.pow(Math.max(0,1-d/420),2);SND.streamF+=(700+Math.random()*900-SND.streamF)*.08;
  SND.streamBP.frequency.setTargetAtTime(SND.streamF,now,.08);SND.streamG.gain.setTargetAtTime(SCENE!=='garden'?0:(NIGHT.on?.25:1)*.006+(NIGHT.on?.25:1)*near*.15*(.85+.15*Math.sin(T*3.1)),now,.25);SND.streamHiG.gain.setTargetAtTime(near*.018,now,.3);
  const gust=SCENE!=='garden'?0:Math.max(0,wind(T,cam.x,cam.y)-.15);SND.windG.gain.setTargetAtTime(!OUT?0:NIGHT.on?.009:.006+gust*.04,now,.6);SND.leafG.gain.setTargetAtTime(!OUT?0:NIGHT.on?.001:.0008+gust*.006,now,.5);
  if(SND.sfxVerb)SND.sfxVerb.gain.setTargetAtTime(SCENE==='well'?.95:SCENE==='study'?.6:.35,now,.4);
  SND.birdT-=dt;if(SND.birdT<=0&&SCENE==='garden'&&!NIGHT.on){bird();SND.birdT=1.2+Math.random()*4.5;}}
function drawSoundBtn(){const x=W-28,y=28,r=17;ctx.save();ctx.globalAlpha=.75;ctx.fillStyle=INTRO.waiting?'rgba(47,42,58,.6)':'rgba(30,44,30,.35)';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.fillStyle='#fdf8ec';ctx.strokeStyle='#fdf8ec';ctx.lineWidth=1.6;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-8,y-3);ctx.lineTo(x-4,y-3);ctx.lineTo(x+1,y-8);ctx.lineTo(x+1,y+8);ctx.lineTo(x-4,y+3);ctx.lineTo(x-8,y+3);ctx.closePath();ctx.fill();
  if(SND.on){ctx.beginPath();ctx.arc(x+2,y,5,-.9,.9);ctx.stroke();ctx.beginPath();ctx.arc(x+2,y,9,-.9,.9);ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(x+4,y-4);ctx.lineTo(x+11,y+4);ctx.moveTo(x+11,y-4);ctx.lineTo(x+4,y+4);ctx.stroke();}ctx.restore();}

