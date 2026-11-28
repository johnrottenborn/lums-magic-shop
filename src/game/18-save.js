/* Slime Parts and Bone Parts were removed from the game: strip them from old saves */
function dropRetiredMats(){for(const id of ['slimeparts','boneparts']){delete MATS[id];for(let i=BAG.indexOf(id);i>=0;i=BAG.indexOf(id))BAG.splice(i,1);}}
/* ---------- save & continue (kept in this browser) ---------- */
const SAVE_KEY='lums-magic-shop-save-v1';const TITLE={hits:[],confirm:-1e9};const SAVEC={t:0};const LOADTRIM={};
function readSave(){try{const s=localStorage.getItem(SAVE_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function canSave(){return PLAYER()&&!MIX.on&&!INTRO.on&&!INTRO.waiting&&!BATTLE.on&&!BATTLE.pending&&!WIPE.dir&&!DLG.active&&!CHOICE.on&&!FADE.dir&&!WEVENT.on&&!busy()&&!WEV.fk&&!WEV.seal&&!(BED.sleeping&&!BED.cosAwake)&&!Object.keys(LOADTRIM).length;}
function snapshot(){if(C1.jak)C1.jakHp=HEROES.jak.hp;return {v:1,sv:SAVE_VER,t:Date.now(),scene:SCENE,dunRoom:DUN.room,x:lum.x,y:lum.y,face:lum.face,bag:[...BAG],mats:{...MATS},party:JSON.parse(JSON.stringify(PARTY)),hp:HEROES[HERO].hp,goal:{tag:GOAL.tag,text:GOAL.text},tut:TUT.stage,
  f:{kingState,bucketTaken,gotEquip,slimesDone,slimesSpawned,wellVisited,gardenDone,sslimesSpawned,mimicState,studyVisited,shedChestOpen,shedSpawned,shedVisited,pondSlimesSpawned,pondDone,shroudTaken,pondVisited,shopTalk,restTalk,skelDone,sayCount,slugTalk,slimeTalk,poolTalk},
  left:{well:WSLIMES.length,study:SSLIMES.length,shed:SHSLIMES.length,pond:PSLIMES.length,slugs:SLUGS.filter(g=>g.kind!=='slugking').length,skels:WSKELS.length},
  ch:CH,c1:{...C1,endCard:0,title:0},powders:{...POWDERS},wf:WFOES.map(g=>g.id),c1built:woodsC1Built,
  night:{on:NIGHT.on,cut:NIGHT.cut,rain:NIGHT.rain,nudged:NIGHT.nudged||0},stats:STATS,wev:{mid:WEV.mid,circle:WEV.circle,cem:WEV.cem,entered:WEV.entered||0},shopDoor,pondReturn,c2:CH>=2?c2Snapshot():null,c3:CH>=3?savePrim(C3):null};}
/* a finished chapter leaves no save behind, so the title menu drops Continue. Call finishChapter() at the end of every chapter. */
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
function finishChapter(id){try{const p=readProg();p[id]=Object.assign(p[id]||{},{done:1});localStorage.setItem(PROG_KEY,JSON.stringify(p));}catch(e){}clearSave();SAVEC.finished=1;}
function saveGame(){if(SAVEC.finished)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify(snapshot()));}catch(e){}}
function autosave(dt){SAVEC.t+=dt;if(SAVEC.t>1&&canSave()){SAVEC.t=0;saveGame();}
  // rooms fill with foes when first entered; on a continued game, trim them back to what was left
  const L_={well:[WSLIMES,()=>slimesSpawned],study:[SSLIMES,()=>sslimesSpawned],shed:[SHSLIMES,()=>shedSpawned],pond:[PSLIMES,()=>pondSlimesSpawned]};
  for(const k in LOADTRIM){const [arr,sp]=L_[k];if(sp()){arr.splice(LOADTRIM[k]);delete LOADTRIM[k];}}}
const canSaveNow=()=>PLAYER()&&!INTRO.on&&!INTRO.waiting&&!BATTLE.on&&!WEVENT.on&&!WEV.fk&&!WEV.seal&&!(BED.sleeping&&!BED.cosAwake)&&!Object.keys(LOADTRIM).length&&!FADE.cb;
addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&canSaveNow())saveGame();});addEventListener('pagehide',()=>{if(canSaveNow())saveGame();});addEventListener('beforeunload',()=>{if(canSaveNow())saveGame();});
/* ---- Chapter 2 saving: story flags and progress; events caught half-way simply replay ---- */
const savePrim=o=>{const r={};for(const k in o){const v=o[k];if(v==null||(typeof v!=='object'&&typeof v!=='function'))r[k]=v;}return r;};
function c2Snapshot(){const H={};for(const id of PARTY_ORDER)H[id]=HEROES[id].hp;
  return {c2:savePrim(C2),hst:savePrim(HST),alma:savePrim(ALMA),order:[...PARTY_ORDER],hp:H,home:{t:HOME.t},
    wb:{boDone:BO.done,wb8beat:WB8.beat,wb10:WB10.st===2?2:0,wbt:{lion:WBT.lion,raven:WBT.raven,serpent:WBT.serpent},wb5:savePrim(WB5)}};}
function applySaveC2(d){const s=d.c2||{};startChapter2();c2Skip();SAVEC.finished=0;C2.title=0;
  Object.assign(C1,d.c1||{});C1.endCard=0;C1.title=0;Object.assign(C2,s.c2||{},{on:false,cam:null,title:0,narr:-1});
  Object.assign(HST,s.hst||{},{heart:0});Object.assign(ALMA,s.alma||{});if(s.home)HOME.t=99;
  const w=s.wb||{};BO.done=w.boDone||0;if(BO.done)BO.st=0;WB8.beat=w.wb8beat||0;if(!WB8.beat){WB8.L=1;WB8.R=1;}WB10.st=w.wb10||0;Object.assign(WBT,w.wbt||{});
  for(const k of ['said','said18','jolt'])if(w.wb5&&w.wb5[k]!=null)WB5[k]=w.wb5[k];
  BAG.length=0;BAG.push(...(d.bag||[]));for(const k in MATS)delete MATS[k];Object.assign(MATS,d.mats||{});dropRetiredMats();
  if(d.party)for(const who in d.party)if(PARTY[who])Object.assign(PARTY[who],d.party[who]);Object.assign(POWDERS,d.powders||{});
  if(d.stats)Object.assign(STATS,d.stats,{found:Object.assign({},d.stats.found||{})});
  PARTY_ORDER.length=0;PARTY_ORDER.push(...(s.order||['lum']));syncMaxHp();for(const id of PARTY_ORDER)HEROES[id].hp=clamp((s.hp||{})[id]||HEROES[id].maxHp,1,HEROES[id].maxHp);
  if(C2.venom){C2.venom=0;learnVenom(true);}NIGHT.rain=true;
  if(d.scene==='dun')enterDun(d.dunRoom||11,d.x,d.y,d.face||1);else{SCENE='thorn';THORN.t=99;}
  lum.x=d.x;lum.y=d.y;lum.face=d.face||1;lum.state='idle';lum.vx=lum.vy=0;cam.x=lum.x;cam.y=lum.y-50;WCAM.x=lum.x;
  GVT.t=99;BWT.t=99;BVT.t=99;IST.t=99;   /* no area title on a continued game */
  if(C2.joined)resetAmrFollow();if(C2.jak)resetJak2Follow();
  GOAL.tag='TASK';GOAL.text=(d.goal&&d.goal.text)||'';HINT.goalT=0;}
function applySave(d){if(d.ch===3&&d.c2){applySaveC2(d);CH=3;Object.assign(C3,d.c3||{},{title:0});C3.boy.x=0;C3.boy.mode=C3.party?'follow':C3.amrIn?'practice':'idle';if(C3.party){ALMF.on=1;c3ResetFollow();}NIGHT.rain=false;return;}if(d.ch===2&&d.c2){applySaveC2(d);return;}if(d.ch===1){applySaveC1(d);return;}const f=d.f||{};if(d.stats)Object.assign(STATS,d.stats,{found:Object.assign({},d.stats.found||{})});
  ({bucketTaken,gotEquip,slimesDone,wellVisited,gardenDone,mimicState,studyVisited,shedChestOpen,shedVisited,pondDone,shroudTaken,pondVisited,shopTalk,restTalk,skelDone,sayCount,slugTalk,slimeTalk,poolTalk}=Object.assign({bucketTaken,gotEquip,slimesDone,wellVisited,gardenDone,mimicState,studyVisited,shedChestOpen,shedVisited,pondDone,shroudTaken,pondVisited,shopTalk,restTalk,skelDone,sayCount,slugTalk,slimeTalk,poolTalk},f));
  BAG.length=0;BAG.push(...(d.bag||[]));for(const k in MATS)delete MATS[k];Object.assign(MATS,d.mats||{});dropRetiredMats();if(d.party&&d.party.cosmic)Object.assign(PARTY[HERO],d.party.cosmic);HEROES[HERO].hp=clamp(d.hp||HEROES[HERO].maxHp,1,HEROES[HERO].maxHp);
  if(gardenDone>=5&&!BAG.includes('shedkey')&&!shedChestOpen)BAG.push('shedkey');
  if(bucketTaken){const j=WOBST.findIndex(o=>o.bucket);if(j>=0)WOBST.splice(j,1);}
  const L_=d.left||{};for(const [k,flag] of [['well','slimesSpawned'],['study','sslimesSpawned'],['shed','shedSpawned'],['pond','pondSlimesSpawned']])if(f[flag])LOADTRIM[k]=L_[k]??0;
  if(L_.slugs!=null)SLUGS.splice(L_.slugs);kingState=f.kingState||0;if(kingState===1)spawnKing(false);syncMaxHp();
  Object.assign(WEV,d.wev||{});
  if(d.night&&d.night.on){NIGHT.on=true;BED.night=1;BED.sleeping=true;BED.cosAwake=true;BED.slept=true;
    if(d.night.cut){NIGHT.cut=true;addHedgeDoor();for(let i=ESTATE.length-1;i>=0;i--){const o=ESTATE[i];if((o.t==='shrub'||o.t==='img')&&Math.abs(o.x-20)<135&&o.y>1575&&o.y<1720)ESTATE.splice(i,1);}}
    NIGHT.nudged=d.night.nudged||0;if(d.night.rain){NIGHT.rain=true;setTimeout(restartRain,600);}}
  if(d.shopDoor)shopDoor=d.shopDoor;if(d.pondReturn)pondReturn=d.pondReturn;
  const sc=d.scene||'garden';
  if(sc==='well')enterWell();else if(sc==='study')enterStudy();else if(sc==='shed')enterShed();else if(sc==='pond')enterPond();else if(sc==='shop')enterShop();else if(sc==='bed')enterBedroom();
  else if(sc==='woods'){WEV.entered=1;enterWoods();if(WEV.cem&&skelDone<3){spawnSkels();WSKELS.splice(L_.skels??0);for(const s of WSKELS){s.rise=1;s.calm=3;}}}else{SCENE='garden';}
  INTRO.on=false;INTRO.waiting=false;INTRO.fade=0;INTRO.ui=1;becomeCosmic(d.x,d.y,d.face||1);HINT.on=false;
  cam.x=lum.x;cam.y=lum.y-50;if(sc==='woods'){cam.x=lum.x+60;}WCAM.x=lum.x;
  TUT.stage=d.tut||0;GOAL.tag='TASK';GOAL.text=(d.goal&&d.goal.text)||GOAL.text;HINT.goalT=0;
  if(sc==='woods'&&skelDone>=3)setTimeout(fokalurEvent,1500);}
function newGame(){clearSave();SAVEC.finished=0;beginIntro();}
/* save versioning: bump SAVE_VER whenever a change could break older saves, and add a step to MIGRATIONS */
const SAVE_VER=3;
const MIGRATIONS={
  1:d=>{/* v1 -> v2: the Little Tin Lantern was removed */},
  2:d=>{/* v2 -> v3: Healing Powder was removed; any in the satchel becomes a Healing Potion */if(Array.isArray(d.bag))d.bag=d.bag.map(i=>i==='hpowder'?'potion':i);},
};
function migrateSave(d){d.sv=d.sv||1;while(d.sv<SAVE_VER){try{MIGRATIONS[d.sv]&&MIGRATIONS[d.sv](d);}catch(e){console.error('migrate',d.sv,e);}d.sv++;}
  // always: drop anything that no longer exists in the game
  d.bag=(d.bag||[]).filter(id=>ITEMS[id]);if(d.mats)for(const k in d.mats)if(!ITEMS[k])delete d.mats[k];
  if(d.party)for(const who in d.party)for(const sl in d.party[who]){const id=d.party[who][sl];if(id&&!ITEMS[id])d.party[who][sl]=null;}
  return d;}
function safeSpot(){const ok=(f)=>{try{return f(lum.x,lum.y);}catch(e){return true;}};
  if(SCENE==='garden'){if(!ok(gardenFree)){lum.x=0;lum.y=160;}}
  else if(SCENE==='woods'){if(!ok(woodsFree)){lum.x=70;lum.y=630;}}
  else if(SCENE==='thorn'){if(!ok(thornFree)){lum.x=40;lum.y=TMZ.start*TCH+TCH/2+10;}}
  else if(SCENE==='dun'){if(!ok(dunFree)){const P={1:[560,650],2:[200,600],3:[290,560],4:[700,730],5:[700,740]}[DUN.room]||[560,650];lum.x=P[0];lum.y=P[1];}}
  else if(SCENE==='vhut'){if(!ok(vhutFree)){lum.x=400;lum.y=735;}}
  else{const f=roomFree();if(f&&!ok(f)){if(SCENE==='shop')enterShop();else if(SCENE==='bed')enterBedroom();else{SCENE='garden';lum.x=0;lum.y=160;}}}
  cam.x=lum.x;cam.y=lum.y-50;WCAM.x=lum.x;}
function continueGame(){const d=readSave();if(!d){newGame();return;}audioInit();migrateSave(d);
  try{applySave(d);safeSpot();}catch(e){console.error(e);try{if(d.ch===1){SCENE='garden';lum.x=0;lum.y=160;cam.x=0;cam.y=110;}}catch(e2){}}FADE.a=1;FADE.dir=-1;sfxPage&&sfxPage(1);}
function titleTap(x,y){if(CHSEL.on){chselTap(x,y);return;}for(const h of TITLE.hits)if(x>h.x&&x<h.x+h.w&&y>h.y&&y<h.y+h.h){
    if(h.id==='cont'){continueGame();return;}
    if(h.id==='new'){const pg=readProg();if((PLAYTEST||pg.prologue&&pg.prologue.done)){openChapterSelect();return;}if(readSave()&&performance.now()-TITLE.confirm>3500){TITLE.confirm=performance.now();sfxPage&&sfxPage(.6);return;}newGame();return;}}}
function titleKey(){if(CHSEL.on){chselKey('Enter');return;}if(readSave())continueGame();else{const pg=readProg();if((PLAYTEST||pg.prologue&&pg.prologue.done))openChapterSelect();else newGame();}}
function drawTitleMenu(){const has=!!readSave(),bw=Math.min(240,W-80),bh=50,x=W/2-bw/2;let y=H*.56;TITLE.hits=[];ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
  const btn=(id,label,primary)=>{const pulse=primary?.5+.5*Math.sin(T*2.4):0;ctx.fillStyle=primary?'#2f2a3a':'rgba(47,42,58,.08)';ctx.strokeStyle='rgba(47,42,58,.55)';ctx.lineWidth=1.5;rr(x,y,bw,bh,bh/2);ctx.fill();ctx.stroke();
    if(primary){ctx.strokeStyle=`rgba(196,154,78,${(.35+.4*pulse).toFixed(3)})`;ctx.lineWidth=2;rr(x-3,y-3,bw+6,bh+6,bh/2+3);ctx.stroke();}
    ctx.fillStyle=primary?'#fdf6e4':'#2f2a3a';ctx.font='700 19px "Alegreya SC", "Palatino Linotype", Georgia, serif';ctx.fillText(label,W/2,y+bh/2+1);TITLE.hits.push({id,x,y,w:bw,h:bh});y+=bh+18;};
  if(has){btn('cont','Continue',true);const sure=performance.now()-TITLE.confirm<3500;btn('new',sure?tw('Start over? Tap again','Start over? Click again'):'New Game',false);
    const d=readSave();if(d&&d.t){const m=Math.round((Date.now()-d.t)/60000),ago=m<1?'just now':m<60?`${m} min ago`:m<1440?`${Math.round(m/60)} hr ago`:`${Math.round(m/1440)} days ago`;ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillStyle='rgba(47,42,58,.6)';ctx.fillText(`last saved ${ago}`,W/2,y+4);}}
  else btn('new','New Game',true);
  ctx.restore();}

