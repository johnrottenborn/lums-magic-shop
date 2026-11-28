/* ---------- settings: music and sound volume, text speed, skipping dialogue already seen ----------
   Opened from the gear button beside the sound button (title screen and in game). The game pauses while it is open. */
const SET={music:5,sfx:5,text:'normal',skipSeen:1};   /* volumes are 0–5 pips */
try{Object.assign(SET,JSON.parse(localStorage.getItem('lum_settings')||'{}'));}catch(e){}
const SETUI={on:false,hits:[]};
const TXTK=()=>({slow:1.5,normal:1,fast:.65})[SET.text]||1;   /* how long a line stays up before it moves on by itself */
const TXTRATE=()=>22*(({slow:.7,normal:1,fast:1.6})[SET.text]||1);   /* letters a second for typed (eerie) lines */
function saveSettings(){try{localStorage.setItem('lum_settings',JSON.stringify(SET));}catch(e){}applyVolumes();}
function applyVolumes(){if(!SND.ctx||!SND.music)return;const t=SND.ctx.currentTime;SND.music.gain.setTargetAtTime(.3*SET.music/5,t,.1);SND.sfx.gain.setTargetAtTime(.7*SET.sfx/5,t,.1);if(SND.amb)SND.amb.gain.setTargetAtTime(.55*SET.sfx/5,t,.1);}
/* conversations already read (a short hash of their lines), so they can be skipped next time */
const SEEN=new Set();try{for(const h of JSON.parse(localStorage.getItem('lum_seen')||'[]'))SEEN.add(h);}catch(e){}
function dlgHash(lines){let h=5381;const s=lines.map(l=>l[0]+':'+l[1]).join('|');for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36);}
function markSeen(h){if(!h||SEEN.has(h))return;SEEN.add(h);try{localStorage.setItem('lum_seen',JSON.stringify([...SEEN].slice(-3000)));}catch(e){}}
const SKIPBTN={x:0,y:0,w:0,h:0,on:false};
function canSkipDlg(){return SET.skipSeen&&DLG.active&&DLG.seen&&DLG.lines.length>1&&!BATTLE.on&&!MENU.open&&!CHOICE.on;}
function dlgSkip(){if(!DLG.active)return;DLG.i=DLG.lines.length-1;DLG.t=99;dlgNext();}
function drawSkipBtn(){SKIPBTN.on=canSkipDlg();if(!SKIPBTN.on)return;const w=92,h=34,x=W-w-12,y=56;Object.assign(SKIPBTN,{x,y,w,h});
  ctx.save();ctx.globalAlpha=.85;ctx.fillStyle='rgba(30,22,40,.6)';rr(x,y,w,h,17);ctx.fill();ctx.strokeStyle='rgba(253,248,236,.6)';ctx.lineWidth=1.4;rr(x,y,w,h,17);ctx.stroke();
  ctx.fillStyle='#fdf8ec';ctx.font='700 15px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText('Skip ▸▸',x+w/2,y+22);ctx.restore();}
function skipHit(x,y){return SKIPBTN.on&&x>SKIPBTN.x-6&&x<SKIPBTN.x+SKIPBTN.w+6&&y>SKIPBTN.y-6&&y<SKIPBTN.y+SKIPBTN.h+6;}
/* the gear button, drawn beside the sound button */
const GEAR={x:0,y:28,r:17};
function drawGearBtn(){GEAR.x=W-68;const {x,y,r}=GEAR;ctx.save();ctx.globalAlpha=.75;ctx.fillStyle=INTRO.waiting?'rgba(47,42,58,.6)':'rgba(30,44,30,.35)';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.fillStyle='#fdf8ec';ctx.beginPath();for(let k=0;k<16;k++){const a=k/16*TAU+.2,rr_=k%2?6.2:8.6;ctx.lineTo(x+Math.cos(a)*rr_,y+Math.sin(a)*rr_);}ctx.closePath();ctx.fill();
  ctx.fillStyle=INTRO.waiting?'rgba(47,42,58,1)':'rgba(60,70,60,1)';ctx.beginPath();ctx.arc(x,y,2.8,0,TAU);ctx.fill();ctx.restore();}
function gearHit(x,y){return Math.hypot(x-(W-68),y-28)<24;}
function openSettings(){SETUI.on=true;audioInit();sfxPage&&sfxPage(.4);}
function closeSettings(){SETUI.on=false;saveSettings();}
function drawSettings(){if(!SETUI.on)return;SETUI.hits=[];const H_=(x,y,w,h,f)=>SETUI.hits.push({x,y,w,h,f});
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='rgba(10,8,16,.72)';ctx.fillRect(0,0,W,H);
  const pw=Math.min(W-28,380),ph=420,px=(W-pw)/2,py=Math.max(16,(H-ph)/2);
  ctx.fillStyle='rgba(0,0,0,.35)';rr(px+3,py+8,pw,ph,20);ctx.fill();ctx.fillStyle='#fbf3dd';rr(px,py,pw,ph,20);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=3;rr(px,py,pw,ph,20);ctx.stroke();
  ctx.textAlign='center';ctx.fillStyle='#5a2e22';ctx.font='700 26px "Alegreya SC", Georgia, serif';ctx.fillText('Settings',px+pw/2,py+44);
  let y=py+86;const lab=t=>{ctx.textAlign='left';ctx.fillStyle='#3b2a1c';ctx.font='700 16px "Alegreya SC", Georgia, serif';ctx.fillText(t,px+22,y);};
  const pips=(k)=>{const n=6,gw=pw-44,pwid=(gw-(n-1)*6)/n;for(let i=0;i<n;i++){const bx=px+22+i*(pwid+6),by=y+12,on=i<=SET[k]&&SET[k]>0;ctx.fillStyle=on?'#7a4f9a':'#efe2c2';rr(bx,by,pwid,26,8);ctx.fill();ctx.strokeStyle=on?'#5a3478':'#d6c39a';ctx.lineWidth=1.5;rr(bx,by,pwid,26,8);ctx.stroke();
      ctx.fillStyle=on?'#fbf3dd':'#8a7050';ctx.font='700 12px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(i===0?'Off':String(i*20)+'%',bx+pwid/2,by+18);H_(bx,by-6,pwid,38,()=>{SET[k]=i;saveSettings();if(k==='sfx')sfxPage(.6);});}y+=66;};
  const opts=(list,get,set)=>{const n=list.length,gw=pw-44,ow=(gw-(n-1)*8)/n;list.forEach(([v,l],i)=>{const bx=px+22+i*(ow+8),by=y+12,on=get()===v;ctx.fillStyle=on?'#7a4f9a':'#efe2c2';rr(bx,by,ow,34,10);ctx.fill();ctx.strokeStyle=on?'#5a3478':'#d6c39a';ctx.lineWidth=1.5;rr(bx,by,ow,34,10);ctx.stroke();
      ctx.fillStyle=on?'#fbf3dd':'#5a3d22';ctx.font='700 15px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(l,bx+ow/2,by+23);H_(bx,by-4,ow,42,()=>{set(v);saveSettings();sfxPage(.4);});});y+=72;};
  lab('Music');pips('music');
  lab('Sound effects');pips('sfx');
  lab('Text speed');opts([['slow','Slow'],['normal','Normal'],['fast','Fast']],()=>SET.text,v=>SET.text=v);
  lab('Skip dialogue already seen');opts([[1,'On'],[0,'Off']],()=>SET.skipSeen?1:0,v=>SET.skipSeen=v);
  const bw=150,bx=px+(pw-bw)/2,by=py+ph-58;ctx.fillStyle='#7a4f9a';rr(bx,by,bw,44,12);ctx.fill();ctx.fillStyle='#fbf3dd';ctx.font='700 17px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText('Done',bx+bw/2,by+28);H_(bx,by,bw,44,closeSettings);
  SETUI.box=[px,py,pw,ph];}
function settingsTap(x,y){for(const h of SETUI.hits)if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h){h.f();return;}const b=SETUI.box;if(b&&(x<b[0]||x>b[0]+b[2]||y<b[1]||y>b[1]+b[3]))closeSettings();}
function settingsKey(code){if(code==='Escape'||code==='Enter'||code==='KeyE'){closeSettings();return;}
  if(code==='ArrowLeft'||code==='KeyA'){SET.music=Math.max(0,SET.music-1);saveSettings();}if(code==='ArrowRight'||code==='KeyD'){SET.music=Math.min(5,SET.music+1);saveSettings();}}
