/* ---------- loop ---------- */
let last=performance.now();
let LOADED=false,LOAD_T0=0;
function allImgs(){return [atlas,catlas,satlas,...Object.values(IMG)];}
function drawLoading(now){if(!LOAD_T0)LOAD_T0=now;const L=allImgs(),done=L.filter(im=>im.complete).length,u=done/L.length;
  if(u>=1||now-LOAD_T0>25000){LOADED=true;return false;}
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#f6efe0';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#6a4a28';ctx.font='700 24px "Alegreya SC", Georgia, serif';ctx.fillText("Lum's Magic Shop",W/2,H*.44);
  const bw=Math.min(240,W*.6),bx=(W-bw)/2,by=H*.44+26;ctx.fillStyle='rgba(106,74,40,.15)';rr(bx,by,bw,8,4);ctx.fill();ctx.fillStyle='#c49a4e';rr(bx,by,Math.max(8,bw*u),8,4);ctx.fill();
  ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillStyle='rgba(106,74,40,.75)';ctx.fillText('gathering powders…',W/2,by+32);return true;}
function frame(now){if(!LOADED&&drawLoading(now)){last=now;requestAnimationFrame(frame);return;}const dt=Math.min(.05,(now-last)/1000);last=now;if(!INTRO.waiting&&!WEV.end)STATS.time+=dt;if(BATTLE.on){updateBattle(dt);audioUpdate(dt);updateFade(dt);renderBattle();}else{update(dt);if(CAPTURE.want)captureWithStage();render();}updateWipe(dt);requestAnimationFrame(frame);}
function start(data){
  const resume=!!(data&&data.lum);if(resume){lum.x=data.lum.x;lum.y=data.lum.y;}
  placeEstate();spawnSlugs();cam.x=lum.x;cam.y=lum.y-50;resize();
  if(resume){INTRO.on=false;INTRO.fade=0;INTRO.ui=1;becomeCosmic(lum.x,lum.y,1);HINT.on=false;HINT.goalT=99;}else{introStart();audioInit();INTRO.waiting=true;}
  requestAnimationFrame(frame);
}
window.__g={openMenu,MENU,jakJoin,THFOES,THBOSS,PARTY_ORDER,HEROES,enterThornGate,enterThorn,startThornPreview,THORN,get lumX(){return lum},get C1X(){return C1},chooseMenu,nextFoe,get MATSX(){return MATS},startBonk,pressA,get lumS(){return lum},get DLGX(){return DLG},get WEVX(){return WEVENT},lumPowderHit,hurtFoe,spawnPowderFx,foeShape,get FSHAPE(){return FSHAPE},get FADEX(){return FADE},get WIPEX(){return WIPE},get KEYS(){return keys},DFOES,graveRise,get WGRAVES(){return WGRAVES},enterDun,DUN,DUNINT,dunFree,WOBJ,get INTERACTABLES(){return INTERACTABLES},C1I,skipC1Intro,FORAGE,pickForage,PARTS,enterWoodsC1,set LUMK(v){LUMK=v},enterVHut,MIX,openMix,doMix,RECIPES,get NEAR(){return NEAR},startChapter1,C1,WFOES,get REAPER(){return REAPER},get VANE(){return VANE},hutDoorC1,POWDERS,get CH(){return CH},spawnKing,kingArrives,get kingState(){return kingState},makeResultCard,CHSEL,recordPrologue,finishChapter,lumTalk,migrateSave,drinkSpring,SPRING_DOOR,CELLAR_DOOR,HOOD,hoodOut,thornFree,HEROES_X:HEROES,foxRingSteal,ITEMS,readSave,SAVEC,STATS,RESULTS,STORM,BATS,WSKELS,spawnSkels,fokalurEvent,get skelDone(){return skelDone},set skelDone(v){skelDone=v},enterWoods,woodsFree,WEV,NIGHT,cutHedge,goToSleep,enterGarden,enterBedroom,BED,bedFree,enterShop,SHOPLUM,shopFree,get restTalk(){return restTalk},PSLIMES,pondVoiceEvent,enterPond,pondFree,CHOICE,pickChoice,giveItem,get shedChestOpen(){return shedChestOpen},enterShed,SHSLIMES,shedFree,SHFLOOR,planStage,stageSlots,SSLIMES,get mimicState(){return mimicState},FOE_TYPES,enterStudy,studyFree,SFLOOR,GSLIMES,gardenFree,BATTLE,HEROES,MATS,startEncounter,battleAction,chooseMenu,WSLIMES,hitSlimes,defeatSlime,WEVENT,DLG,MENU,PARTY,BAG,TUT,takeBucket,openMenu,closeMenu,menuTap,get bucketTaken(){return bucketTaken},get SCENE(){return SCENE},WCAM,goScene,enterWell,SLUGS,lum,CK,BRIDGE,creekNearest,cos,INTRO,get PC(){return PC}};window.claude?.hot?.snapshot?.(()=>({lum:{x:lum.x,y:lum.y}}));
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
})();
