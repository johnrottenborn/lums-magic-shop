/* =====================================================================
   BATTLE: a turn-based storybook stage with timed action commands
   (tap as the staff lands for a Nice hit, tap just before a hit lands
   to Guard). Party of up to four; only Cosmic has joined so far.
   ===================================================================== */
const HEROES={jak:{id:'jak',name:'Jak',hp:5,maxHp:20,base:{atk:3,def:1,mag:2,spd:1}},cosmic:{id:'cosmic',name:'Cosmic',hp:12,maxHp:12,base:{atk:1,def:0,mag:0,spd:1}},lum:{id:'lum',name:'Lum',hp:14,maxHp:14,base:{atk:2,def:1,mag:3,spd:1}}};
const PARTY_ORDER=['cosmic'];                 // up to 4 heroes
const MATS={};                                // stackable crafting parts, e.g. {slimeparts:3}
const FOE_TYPES={slime:{name:'Slime',hp:5,atk:3,def:0,drop:'slimeparts'},slug:{name:'Slug',hp:4,atk:2,def:0,drop:'slimeparts'},jelly:{name:'Shimmer Slime',hp:7,atk:3,def:0,drop:'slimeparts'},mimic:{name:'Mimic',hp:10,atk:4,def:1,drop:'slimeparts'},fslime:{name:'Forest Slime',hp:5,atk:2,def:0,drop:'slimeparts'},wisp:{name:'Bramble Wisp',hp:6,atk:2,def:0,drop:'thornsprig'},rskel:{name:'Restless Skeleton',hp:7,atk:3,def:0,drop:'boneparts'},bat:{name:'Hollow Bat',hp:6,atk:3,def:0,drop:null},spider:{name:'Root Spider',hp:9,atk:3,def:1,drop:null},vixen:{name:'Vixen',hp:14,atk:3,def:1,drop:null},bigvixen:{name:'Elder Vixen',hp:34,atk:5,def:2,drop:null},reaper:{name:'Grave Reaper',hp:16,atk:3,def:1,drop:'boneparts'},slugking:{name:'Slug King',hp:10,atk:3,def:0,drop:'slimeparts'},skel:{name:'Skeleton',hp:80,atk:5,def:3,drop:'boneparts'},rslime:{name:'Red Slime',hp:7,atk:3,def:0,drop:'slimeparts'},rvixen:{name:'Red Fox',hp:12,atk:3,def:1,drop:null},bigspider:{name:'Broodmother',hp:52,atk:5,def:2,drop:null},flora:{name:'Flora',hp:12,atk:3,def:1,drop:'thornsprig'}};
const BATTLE={on:false,phase:'',t:0,heroes:[],foes:[],cur:0,menu:0,target:0,cmd:null,pops:[],msg:'',msgT:0,field:null,first:true,tut:{bonk:0,guard:0},items:null,spark:[],fx:[],hitstop:0};
const WIPE={p:0,dir:0,cb:null};
const BMUS={on:false};
function heroStats(id){const h=HEROES[id],t={...h.base};const eq=PARTY[id]||{};for(const k in eq){const it=eq[k]&&ITEMS[eq[k]];if(it&&it.stats)for(const s in it.stats)t[s]=(t[s]||0)+it.stats[s];}return t;}
function pageTurn(cb){if(WIPE.dir)return;WIPE.dir=1;WIPE.cb=cb;sfxPage(1.4);}
function updateWipe(dt){if(WIPE.dir===1){WIPE.p=Math.min(1,WIPE.p+dt/.5);if(WIPE.p>=1&&WIPE.label&&(WIPE.hold=(WIPE.hold||0)+dt)<.7)return;if(WIPE.p>=1){WIPE.hold=0;const cb=WIPE.cb;WIPE.cb=null;cb&&cb();WIPE.label='';WIPE.dir=-1;}}else if(WIPE.dir===-1){WIPE.p=Math.max(0,WIPE.p-dt/.55);if(WIPE.p<=0)WIPE.dir=0;}}
function drawWipe(){if(WIPE.p<=0)return;const e=WIPE.p<1?(1-Math.cos(Math.PI*WIPE.p))/2:1;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  let x0,x1;if(WIPE.dir!==-1){x0=W*(1-e);x1=W;}else{x0=0;x1=W*e;}
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#f8eed6');g.addColorStop(1,'#ead9b0');ctx.fillStyle=g;ctx.fillRect(x0,0,x1-x0,H);
  ctx.fillStyle='rgba(150,110,60,.08)';for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(hash(i,1,5)*W,hash(i,2,5)*H,60,40,0,0,TAU);ctx.save();ctx.beginPath();ctx.rect(x0,0,x1-x0,H);ctx.clip();ctx.beginPath();ctx.ellipse(hash(i,1,5)*W,hash(i,2,5)*H,60,40,0,0,TAU);ctx.fill();ctx.restore();}
  const ex=WIPE.dir!==-1?x0:x1,sd=WIPE.dir!==-1?-1:1;const sg=ctx.createLinearGradient(ex,0,ex+sd*40,0);sg.addColorStop(0,'rgba(60,40,20,.35)');sg.addColorStop(1,'rgba(60,40,20,0)');ctx.fillStyle=sg;ctx.fillRect(Math.min(ex,ex+sd*40),0,40,H);
  ctx.strokeStyle='rgba(150,110,60,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ex,0);ctx.lineTo(ex,H);ctx.stroke();
  if(WIPE.p>.7){ctx.globalAlpha=(WIPE.p-.7)/.3;ctx.fillStyle='#6a4a28';ctx.textAlign='center';ctx.font='700 13px "Alegreya SC", Georgia, serif';ctx.font='700 24px "Alegreya SC", Georgia, serif';ctx.fillText(WIPE.label||'',W/2,H/2);}
  ctx.restore();}

/* ---------- starting and ending ---------- */
/* Fox Ring (charm): a 50% chance on First Strike to steal the foe's ingredient */
function foxRingSteal(f){const d=FOE_TYPES[f.type]&&FOE_TYPES[f.type].drop;if(!d||!Object.values(PARTY).some(p=>p&&p.charm==='foxring')||Math.random()>=.5)return;
  MATS[d]=(MATS[d]||0)+1;if(!BAG.includes(d))BAG.push(d);BATTLE.loot&&BATTLE.loot.push(d);setTimeout(()=>pop(f.x,f.y-175*bS(),'Stole '+ITEMS[d].name+'!','info'),450);sfxItem&&sfxItem();}
function startEncounter(g,mode){if(BATTLE.on||WIPE.dir||WEVENT.on||g.dead||g.calm>0)return;BATTLE.capG=g;CAPTURE.want=true;BATTLE.pending=true;lum.vx=lum.vy=0;sfxEncounter();WIPE.label=mode==='first'?'First Strike!':g.kind==='bigvixen'?'The Elder Vixen awakens!':g.kind==='vixen'?'The Vixen bares her teeth!':g.kind==='slugking'?'The Slug King appears!':g.kind==='reaper'?'The Grave Reaper attacks!':g.kind==='bigspider'?`The ${(g.over&&g.over.name)||'Broodmother'} descends!`:(n=>`${/^[AEIOU]/.test(n)?'An':'A'} ${n} appears!`)(FOE_TYPES[g.kind||'slime'].name.split(' ').pop());
  pageTurn(()=>setupBattle(g,mode));}
function setupBattle(g,mode){const B=BATTLE;B.on=true;B.pending=false;B.field=g;B.pops=[];B.spark=[];B.fx=[];B.hitstop=0;B.msg='';B.items=null;B.cur=0;B.menu=0;B.target=0;B.defending={};B.t=0;BMUS.on=true;
  B.heroes=PARTY_ORDER.map((id,i)=>({id,home:i,x:0,y:0,ox:0,oy:0,fr:16,face:1,hurt:0,ko:0}));
  const n=g.pack||1,kind=g.kind||'slime';B.foes=[];for(let i=0;i<n;i++){const T_=Object.assign({},FOE_TYPES[kind],g.over||{});B.foes.push({type:kind,name:T_.name,hp:T_.hp,max:T_.hp,atk:T_.atk,def:T_.def,loot:i?null:T_.loot,flag:i?null:T_.flag,col:g.kind==='jelly'?['200,240,255','120,200,225','50,110,150']:(g.col||['190,240,255','150,210,230','60,110,130']),s:g.s*(i?.9:1),ox:0,oy:0,z:0,ph:rnd(0,TAU),blink:rnd(1,4),hit:0,angry:0,dead:0,face:-1,land:0,showHp:0});}
  layoutBattle();
  if(mode==='first'){B.phase='firstStrike';B.t=0;}else if(mode==='ambush'){B.phase='banner';B.bannerText=`The ${FOE_TYPES[g.kind||'slime'].name} ${g.kind==='slime'||!g.kind?'pounces':'lunges'}!`;B.after='foeTurn';B.t=0;}else{B.phase='heroMenu';}
  B.foeI=0;}
const STAGE_Y=.66;
function stageSlots(nH,nF){const S=bS(),fy=H*STAGE_Y,hs=[],fs=[];if(nH===2){hs.push([W*.3,fy+16*S],[W*.14,fy-16*S]);}else for(let i=0;i<nH;i++)hs.push([W*.26-i*22*S,fy+i*26*S]);
  const pos=[[[.72,0]],[[.64,-.03],[.84,.03]],[[.6,-.04],[.77,.02],[.9,-.03]]][Math.max(0,Math.min(3,nF)-1)];for(const p of pos)fs.push([W*p[0],fy+H*p[1]]);return {hs,fs};}
function layoutBattle(){const B=BATTLE,{hs,fs}=stageSlots(B.heroes.length,B.foes.length);
  B.heroes.forEach((h,i)=>{h.x=hs[i][0];h.y=hs[i][1];});B.foes.forEach((f,i)=>{f.x=fs[i][0];f.y=fs[i][1];});}
/* Choose a camera for the battle backdrop so every hero and foe stands on ground they could really stand on. */
const WOFF={y:0};
function planStage(g){const {hs,fs}=stageSlots(PARTY_ORDER.length,g.pack||1);const pts=[...hs,...fs];
  // also check the ground between them, so nobody is split by a wall or the pond
  for(let k=1;k<6;k++)pts.push([hs[0][0]+(fs[0][0]-hs[0][0])*k/6,hs[0][1]+(fs[0][1]-hs[0][1])*k/6]);
  if(SCENE==='garden'||SCENE==='woods'||SCENE==='thorn'){const FREE_=SCENE==='woods'?woodsFree:SCENE==='thorn'?thornFree:gardenFree;const z=zoom,cx0=(lum.x+g.x)/2,cy0=(lum.y+g.y)/2;
    const camFor=(px,py)=>[px-(W*.5-W/2)/z,py-(H*STAGE_Y-H/2)/z];   // put the midpoint of the stage at the screen's stage centre
    const ok=(cx,cy)=>pts.every(([sx,sy])=>FREE_(cx+(sx-W/2)/z,cy+(sy-H/2)/z));
    for(let r=0;r<=700;r+=30){const n=r?Math.max(8,Math.round(r/20)):1;for(let k=0;k<n;k++){const a=k/n*TAU,[cx,cy]=camFor(cx0+Math.cos(a)*r,cy0+Math.sin(a)*r*.8);if(ok(cx,cy))return {scene:'garden',cx,cy};}}
    return {scene:'garden',cx:cam.x,cy:cam.y};}
  // rooms: pick a zoom and framing where everyone stands on open floor with clear floor in front of them (never on furniture)
  const free=roomFree();let best=null;
  const clear=(x,y)=>free(x,y)&&free(x-22,y)&&free(x+22,y)&&free(x,y+30)&&free(x,y+55);
  for(const z of [1,1.2,1.4,1.6,1.8,2.1,2.4]){const rz=H/768*z,hw=W/2/rz;if(hw*2>1375)continue;
    for(let wy=500;wy<=760;wy+=4)for(let wx=hw;wx<=1375-hw;wx+=8){const oy=H*STAGE_Y-wy*rz;if(oy>0||768*rz+oy<H)continue;
      if(!pts.every(([sx,sy])=>clear(wx+(sx-W/2)/rz,wy+(sy-H*STAGE_Y)/rz)))continue;
      const sc=z*60+Math.abs(wx-lum.x)*.05;if(!best||sc<best.sc)best={sc,wx,oy,z};}
    if(best)break;}
  return best?{scene:SCENE,wx:best.wx,oy:best.oy,z:best.z}:{scene:SCENE,wx:WCAM.x,oy:0,z:1};}
let ROOMZ=1;
function captureWithStage(){const P=planStage(BATTLE.capG);const sv={cx:cam.x,cy:cam.y,wx:WCAM.x,oy:WOFF.y,ti:WTITLE.t};
  if(P.scene==='garden'){cam.x=P.cx;cam.y=P.cy;}else{WCAM.x=P.wx;WOFF.y=P.oy;ROOMZ=P.z||1;WTITLE.t=99;}
  CAPTURE.on=true;render();ROOMZ=1;cam.x=sv.cx;cam.y=sv.cy;WCAM.x=sv.wx;WOFF.y=sv.oy;WTITLE.t=sv.ti;}
const bS=()=>clamp(Math.min(W/390,H/800),.8,1.35);
function endBattle(result){const B=BATTLE,g=B.field;BMUS.on=false;if(result!=='lose')for(const id of PARTY_ORDER)if(HEROES[id].hp<=0)HEROES[id].hp=1;SAVEC.t=99;if(result==='flee')STATS.flees++;if(result==='lose'&&!g.scripted)STATS.kos++;
  const G_=g.scene==='garden';
  if(result==='win'){pageTurn(()=>{B.on=false;const L_=g.scene==='thorn'?THFOES:g.scene==='dun'?DFOES:g.scene==='woods'?(CH===1?(g.kind==='reaper'?[]:WFOES):WSKELS):(g.kind==='slug'||g.kind==='slugking')?SLUGS:G_?GSLIMES:g.scene==='study'?SSLIMES:g.scene==='shed'?SHSLIMES:g.scene==='pond'?PSLIMES:WSLIMES,i=L_.indexOf(g);if(i>=0)L_.splice(i,1);
      for(let k=0;k<14;k++)PARTS.push({type:'fiz',x:g.x,y:g.y,z:30,vx:rnd(-60,60),vy:rnd(-20,20),vz:rnd(80,200),life:0,max:rnd(.6,1.2),s:rnd(2,3.5)});
      if(g.kind==='slugking'){kingState=2;STATS.kingSlain=1;GOAL.tag='GARDEN SLUGS';GOAL.text='The Slug King is defeated!';HINT.goalT=0;setTimeout(()=>talk([['Cosmic',"I did it! I beat the Slug King!"],['Cosmic',"He left something behind… a ring? It's warm and squishy… and kind of beautiful."]],false,()=>giveItem('slimering')),1200);return;}
      if(G_){gardenDone++;GOAL.tag='GARDEN SLUGS';GOAL.text=`${gardenDone} of 5 cleared`;HINT.goalT=0;if(gardenDone>=5)setTimeout(()=>talk([['Cosmic',"That's every slug in the garden! Master Lum's shrubs are safe!"],['Cosmic',"Huh? That last one left something shiny behind… a key! It has a little leaf on it."]],false,()=>{giveItem('shedkey');setTimeout(kingArrives,2500);}),1200);return;}
      if(g.scene==='thorn'){if(g.boss){C1.thornBoss=1;GOAL.tag='TASK';GOAL.text='Leave Stranglethorn Forest';HINT.goalT=0;setTimeout(()=>talk(jakInParty()?[['Jak',"It's dead… I can't believe it's dead."],['Lum',"The way out is just ahead. Come on."]]:[['Lum',"It's over… The way out is just ahead."]]),900);}else if(g.id){(C1.thDead=Array.isArray(C1.thDead)?C1.thDead:[]).push(g.id);}return;}
      if(g.scene==='dun'){if(g.kind==='vixen'){C1.vixen=1;setTimeout(()=>talk([['Lum',"The thief fled!"]]),900);}
        if(g.kind==='bigvixen'){C1.bigVixen=1;setTimeout(()=>talk([['Lum',"Lovely fox-fur boots!"]],false,()=>giveItem('foxboots')),900);}return;}
      if(g.scene==='woods'&&CH===1){if(g.kind==='reaper'){C1.reaper=2;REAPER=null;GOAL.tag='TASK';GOAL.text="Knock on the gravekeeper's door";HINT.goalT=0;setTimeout(()=>talk([['Lum',"It's gone… Whoever's inside must be terrified."],['Lum',"I should knock again."]]),900);}return;}
      if(g.scene==='woods'){skelDone++;GOAL.tag=skelDone>=3?'THE DEAD ARE SILENT':'RISEN DEAD SLAIN';GOAL.text=`${skelDone} of 3`;HINT.goalT=0;if(skelDone>=3)setTimeout(fokalurEvent,1400);return;}
      if(g.kind==='mimic'){mimicState=2;setTimeout(()=>say("I beat a chest with TEETH! Wait until Master Lum hears about this!"),900);return;}if(g.scene==='pond'){pondDone++;if(pondDone>=2)setTimeout(pondVoiceEvent,900);return;}if(g.scene==='study'||g.scene==='shed')return;
      slimesDone++;GOAL.tag=slimesDone>=3?'ALL SLIMES DEFEATED':'SLIMES DEFEATED';GOAL.text=`${slimesDone} of 3`;HINT.goalT=0;if(slimesDone>=3){WEVENT.on=true;WEVENT.t=0;WEVENT.stage=0;}});}
  else if(result==='flee'){pageTurn(()=>{B.on=false;g.calm=3.5;if(g.kind==='reaper'&&REAPER){REAPER.st='chase';REAPER.t=0;REAPER.calm=1.4;}g.angry=0;g.chase=false;lum.bumpT=3;const a=Math.atan2(lum.y-g.y,lum.x-g.x);for(let k=0;k<20;k++){const nx=lum.x+Math.cos(a)*6,ny=lum.y+Math.sin(a)*4;if((G_?gardenFree:roomFree())(nx,ny)){lum.x=nx;lum.y=ny;}}});}
  else if(result==='lose'&&g.scripted){FADE.white=true;goScene(()=>{B.on=false;FADE.white=false;for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;mimicState=1;
      SCENE='study';lum.x=440;lum.y=745;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';WCAM.x=440;WOFF.y=0;for(const s_ of SSLIMES)s_.calm=8;
      setTimeout(()=>{sfxEerie();talk([['???',"Try using this sword…"]],false,()=>{giveItem('blade');setTimeout(()=>talk([['Cosmic',"Wh-what? A sword just appeared in my hands!"],['Cosmic',"It's ancient… and it's humming. Maybe I should equip it in my spellbook."]]),700);});},900);});}
  else if(result==='lose'&&g.scene==='thorn'){FADE.white=true;goScene(()=>{B.on=false;FADE.white=false;for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;for(const f_ of THFOES)f_.calm=4;THBOSS.calm=4;lum.x=40;lum.y=TMZ.start*TCH+TCH/2+10;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x+120;cam.y=lum.y-50;resetJakFollow();setTimeout(()=>talk([['Lum',"Ugh… the thorns nearly had us."]]),900);});}
  else if(result==='lose'&&g.scene==='dun'){FADE.white=true;goScene(()=>{B.on=false;FADE.white=false;HEROES.lum.hp=HEROES.lum.maxHp;for(const f_ of DFOES)f_.calm=4;enterDun(1,560,650,1);setTimeout(()=>talk([['Lum',"Ugh… I need to be more careful down here."]]),900);});}
  else if(result==='lose'&&g.scene==='woods'&&CH===1){FADE.white=true;goScene(()=>{B.on=false;FADE.white=false;HEROES.lum.hp=HEROES.lum.maxHp;for(const f_ of WFOES)f_.calm=4;if(g.kind==='reaper'){C1.reaper=0;REAPER=null;}
      lum.x=70;lum.y=630;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=lum.x+120;cam.y=lum.y-50;setTimeout(()=>talk([['Lum',"Ugh… I'm not as nimble as I used to be."],['Lum',"I can't give up. Not while Cosmic is out there."]]),900);});}
  else if(result==='lose'&&g.scene==='woods'){FADE.white=true;goScene(()=>{B.on=false;FADE.white=false;for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;for(const s_ of WSKELS)s_.calm=4;lum.x=GATE.x;lum.y=GATE.y+70;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';
      setTimeout(()=>{sfxEerie();talk([['???',"Get up, child. You are not finished."],['Cosmic',"Ugh… everything hurts."]]);},900);});}
  else if(result==='lose'){FADE.white=true;goScene(()=>{B.on=false;FADE.white=false;for(const id of PARTY_ORDER)HEROES[id].hp=HEROES[id].maxHp;g.calm=2;g.angry=0;
      SCENE='garden';lum.x=0;lum.y=64;lum.face=1;lum.vx=lum.vy=0;lum.state='idle';cam.x=0;cam.y=14;if(!G_){GOAL.tag='TASK';GOAL.text='Head back down the well';HINT.goalT=0;}setTimeout(()=>talk([['Cosmic',"…Huh? I'm back at Lum's Magic Shop?"],['Cosmic',"Was that all a bad dream? It felt so real… and so sticky."]]),900);});}}

/* ---------- the turn engine ---------- */
const MENU_OPTS_C=[['bonk','Staff'],['items','Items'],['defend','Defend'],['run','Run']],MENU_OPTS_L=[['powder','Powders'],['items','Items'],['defend','Defend'],['run','Run']];const MENU_OPTS_LB=[['burst','Starfall'],...MENU_OPTS_L];const COMBO_MAX=5;const MENU_OPTS_J=[['bonk','Axe'],['items','Items'],['defend','Defend'],['run','Run']],MENU_OPTS_JB=[['burst','Staff Bolt'],...MENU_OPTS_J];
const curHeroId=()=>BATTLE.on&&BATTLE.heroes[BATTLE.cur]?BATTLE.heroes[BATTLE.cur].id:HERO;const comboOf=id=>id==='jak'?(C1.comboJ||0):(C1.combo||0);
const menuOpts=()=>{const id=curHeroId();if(id==='lum')return comboOf('lum')>=COMBO_MAX?MENU_OPTS_LB:MENU_OPTS_L;if(id==='jak')return comboOf('jak')>=COMBO_MAX?MENU_OPTS_JB:MENU_OPTS_J;return MENU_OPTS_C;};
function aliveFoes(){return BATTLE.foes.filter(f=>!f.dead);}
function aliveHeroes(){return BATTLE.heroes.filter(h=>!h.ko);}
function pop(x,y,text,kind){BATTLE.pops.push({x,y,text,kind,t:0,vx:rnd(-55,55)});}
function nextHero(){const B=BATTLE;if(!aliveFoes().length){B.phase='win';B.t=0;return;}
  B.cur++;while(B.cur<B.heroes.length&&B.heroes[B.cur].ko)B.cur++;
  if(B.cur>=B.heroes.length){B.phase='foeTurn';B.foeI=-1;nextFoe();}else beginHeroTurn();}
function beginHeroTurn(){const B=BATTLE,h=B.heroes[B.cur];if(h&&h.stuck){h.stuck=0;h.stuckImm=1;pop(h.x,h.y-150*bS(),'Stuck in goo!','info');sfxSlimeHop&&sfxSlimeHop(.7);B.phase='pause';B.t=0;B.after='nextHero';return;}B.phase='heroMenu';B.menu=0;}
function startRound(){const B=BATTLE;B.cur=0;B.defending={};for(const h of B.heroes)if(h.stuckImm>0&&!h.stuck)h.stuckImm--;while(B.cur<B.heroes.length&&B.heroes[B.cur].ko)B.cur++;if(B.cur>=B.heroes.length){B.phase='lose';B.t=0;return;}beginHeroTurn();}
function nextFoe(){const B=BATTLE;B.foeI++;while(B.foeI<B.foes.length&&B.foes[B.foeI].dead)B.foeI++;
  if(B.foeI>=B.foes.length){if(B.heroes.some(h=>h.poison>0&&!h.ko)){B.phase='poisonTick';B.t=0;B.ptDone=0;return;}startRound();return;}
  const f=B.foes[B.foeI];f.tgt=aliveHeroes()[(Math.random()*aliveHeroes().length)|0];f.heavyNow=0;
  if(f.skip>0){f.skip--;B.phase='foeSkip';B.t=0;pop(f.x,f.y-150*bS(),f.frozen?'Frozen solid!':f.drowsy?'Zzz…':'…dazed','info');if(f.frozen)f.thawT=1.1;f.drowsy=0;return;}
  if(f.type==='bigspider'){f.turn=(f.turn||0)+1;if(f.turn%3===0){f.web=1;pop(f.x,foeCenter(f).top-40*bS(),'Web Spray!','info');}}
  if(f.type==='flora'){f.turn=(f.turn||0)+1;if(f.turn%3===0&&f.hp<f.max){B.phase='foeRegrow';B.t=0;B.regrew=0;pop(f.x,foeCenter(f).top-40*bS(),'Closes into a bud…','info');return;}B.phase='foeWind';B.t=0;B.windD=.7+Math.random()*.35;B.cmd={guard:false,lock:0,tried:false};return;}
  if(f.type==='reaper'){f.turn=(f.turn||0)+1;if(f.charged){f.heavyNow=1;B.phase='foeWind';B.t=0;B.windD=1.0;B.cmd={guard:false,lock:0,tried:false};pop(f.x,f.y-190*bS(),'Dark Bolt!','info');return;}
    if(f.turn%3===0){f.charged=1;B.phase='foeCharge';B.t=0;pop(f.x,f.y-190*bS(),'Gathering dark power…','info');return;}}
  B.phase='foeWind';B.t=0;B.windD=.6+Math.random()*.45;B.cmd={guard:false,lock:0,tried:false};}
function chooseMenu(i){const B=BATTLE,o=menuOpts()[i][0];sfxPage(.6);
  if(o==='powder'){B.phase='powders';B.itemSel=0;return;}
  if(o==='burst'&&B.heroes[B.cur].id==='jak'){C1.comboJ=0;B.phase='jbolt';B.t=0;B.burstDone=0;sfxNice&&sfxNice();return;}
  if(o==='burst'){C1.combo=0;B.phase='burst';B.t=0;B.burstDone=0;sfxNice&&sfxNice();return;}
  if(o==='bonk'){if(aliveFoes().length>1){B.phase='target';B.target=B.foes.indexOf(aliveFoes()[0]);B.targetFor='bonk';}else{B.target=B.foes.indexOf(aliveFoes()[0]);startBonk();}}
  else if(o==='items'){B.phase='items';}
  else if(o==='defend'){B.defending[B.heroes[B.cur].id]=1;pop(B.heroes[B.cur].x,B.heroes[B.cur].y-150*bS(),'Bracing!','info');B.phase='pause';B.t=0;B.after='nextHero';}
  else if(o==='run'){B.phase='run';B.t=0;B.cmd={fill:0};}}
function startBonk(){const B=BATTLE;B.phase='bonkRun';B.t=0;B.cmd={nice:false,done:false,lock:0};}
function useItem(id){const B=BATTLE,it=ITEMS[id],h=B.heroes[B.cur];const i=BAG.indexOf(id);if(i<0)return;STATS.items++;BAG.splice(i,1);B.items=null;
  if(it.heal){const H_=HEROES[h.id];const amt=Math.min(healRoll(it),H_.maxHp-H_.hp);H_.hp+=amt;pop(h.x,h.y-140*bS(),'+'+amt,'heal');sfxItem();B.phase='pause';B.t=0;B.after='nextHero';}
  else if(it.dmg){const f=aliveFoes()[0];const dmg=it.dmg+heroStats(h.id).mag;sfxItem();hurtFoe(f,dmg,false);B.phase='pause';B.t=0;B.after='nextHero';}}
function hurtFoe(f,dmg,nice,label){f.hp=Math.max(BATTLE.field&&BATTLE.field.scripted?1:0,f.hp-dmg);f.hit=.4;f.showHp=1;f.angry=9;{const c_=foeCenter(f);pop(c_.x,c_.y-30*bS(),String(dmg),nice?'crit':'dmg');BATTLE.pops[BATTLE.pops.length-1].vx=rnd(25,70);if(nice){pop(c_.x-55*bS(),c_.top-20*bS(),label||'NICE!','nice');sfxNice();}BATTLE.fx.push({k:'burst',x:c_.x,y:c_.y,t:0,max:nice?.34:.24,big:nice,col:nice?'255,220,120':'255,245,230'});}f.wfl=f.wflMax=nice?.16:.09;if(nice){BATTLE.hitstop=.1;}sfxSlimeHit(1);
  if(f.hp<=0){f.dead=.001;STATS.kills++;setTimeout(sfxSlimePop,150);}}
function battleAction(){const B=BATTLE,c=B.cmd;    // the tap used for action commands
  if(B.phase==='bonkWind'&&c&&!c.done){c.done=true;const w=B.t/B.windD;if(w>.8&&w<=1.02){c.nice=true;}else c.early=true;return true;}
  if((B.phase==='foeWind'||B.phase==='foeLeap')&&c&&!c.tried){c.tried=true;if(B.phase==='foeLeap'&&B.t>B.leapD-.24)c.guard=true;return true;}
  if(B.phase==='run'&&c){c.fill=Math.min(1,c.fill+.11);sfxStep(true);return true;}
  return false;}
function updateBattle(dt){const B=BATTLE;if(B.hitstop>0){B.hitstop-=dt;return;}B.t+=dt;T+=dt;const S=bS();updateBattleFx(dt);
  for(const f of B.foes){f.ph+=dt;f.hit=Math.max(0,f.hit-dt);f.blink-=dt;if(f.blink<-.12)f.blink=rnd(1.5,4.5);f.land=Math.max(0,f.land-dt);if(f.dead)f.dead+=dt;f.showHp=Math.max(0,f.showHp-dt*.15);}
  for(const h of B.heroes)h.hurt=Math.max(0,h.hurt-dt);
  for(let i=B.pops.length-1;i>=0;i--){B.pops[i].t+=dt;if(B.pops[i].t>1.2)B.pops.splice(i,1);}
  for(let i=B.spark.length-1;i>=0;i--){const p=B.spark[i];p.t+=dt;p.vy+=500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t>1)B.spark.splice(i,1);}
  const h=B.heroes[B.cur]||B.heroes[0],f=B.foes[B.target];
  switch(B.phase){
    case 'firstStrike':if(B.t>.5&&!B.fsDone){B.fsDone=1;const t_=aliveFoes()[0];hurtFoe(t_,1,false);pop(t_.x,t_.y-130*S,'First Strike!','nice');foxRingSteal(t_);}if(B.t>1.6){B.fsDone=0;B.phase='heroMenu';B.cur=0;}break;
    case 'banner':if(B.t>1.3){if(B.after==='foeTurn'){B.foeI=-1;nextFoe();}else B.phase=B.after;}break;
    case 'pause':if(B.t>.9){if(B.after==='nextHero')nextHero();}break;
    case 'bonkRun':{const u=Math.min(1,B.t/.45),rg=h.id==='lum'?.12:1,tx=f.x-70*S-h.x;h.ox=tx*u*rg;h.oy=(f.y-h.y)*u*rg;h.fr=[0,1,2,3,4,5,6,7][Math.floor(B.t*16)%8];if(u>=1){B.phase='bonkWind';B.t=0;B.windD=.85;h.fr=17;}break;}
    case 'bonkWind':{h.fr=B.t<B.windD*.5?17:18;const c=B.cmd;if(B.t>=B.windD+.08||(c.done&&B.t>=B.windD)){h.fr=19;STATS.atk++;if(c.nice)STATS.nice++;if(h.id==='lum')lumPowderHit(h,f,c);else{const st=heroStats(h.id),dmg=Math.max(1,st.atk+(c.nice?1:0)-f.def);hurtFoe(f,dmg,c.nice);if(h.id==='jak'){if(c.nice){C1.comboJ=Math.min(COMBO_MAX,(C1.comboJ||0)+1);if(C1.comboJ===COMBO_MAX)setTimeout(()=>{if(BATTLE.on)pop(h.x,h.y-230*S,'Staff Bolt ready!','nice');},500);}else C1.comboJ=0;}};shake=c.nice?12:3;B.tut.bonk=1;B.phase='bonkHit';B.t=0;}break;}
    case 'bonkHit':h.fr=19;if(B.t>.45){B.phase='bonkBack';B.t=0;}break;
    case 'bonkBack':{const u=Math.min(1,B.t/.4);h.ox*=1-u;h.oy*=1-u;h.face=-1;h.fr=[0,1,2,3,4,5,6,7][Math.floor(B.t*16)%8];if(u>=1){h.ox=h.oy=0;h.face=1;h.fr=16;nextHero();}break;}
    case 'foeSkip':if(B.t>.9)nextFoe();break;
    case 'poisonTick':if(B.t>.25&&!B.ptDone){B.ptDone=1;for(const h_ of B.heroes)if(h_.poison>0&&!h_.ko){h_.poison--;const H_=HEROES[h_.id];H_.hp=Math.max(0,H_.hp-1);h_.hurt=.35;STATS.dmg++;pop(h_.x,h_.y-120*S,'1','poison');pop(h_.x,h_.y-175*S,h_.poison?'Poison':'Poison wears off','info');sfxSlimeHit&&sfxSlimeHit(.6);if(H_.hp<=0)h_.ko=1;}}if(B.t>1.1){if(!aliveHeroes().length){B.phase='lose';B.t=0;}else startRound();}break;
    case 'foeCharge':if(B.t>1.4)nextFoe();break;
    case 'jbolt':{const st=heroStats(h.id),sx=h.x+h.ox+95*S,sy=h.y+h.oy-118*S;if(B.t>.55&&!B.burstDone){B.burstDone=1;STATS.atk++;sfxFizzle&&sfxFizzle(true);for(const f_ of aliveFoes()){const c_=foeCenter(f_);B.fx.push({k:'bolt',sx,sy,tx:c_.x,ty:c_.y,t:0,max:.7,seed:Math.random()*99});
        const dmg=Math.max(5,st.atk*2+st.mag*2+2-f_.def);setTimeout(()=>{if(BATTLE.on&&!f_.dead)hurtFoe(f_,dmg,true,'STAFF BOLT!');},260);}B.fx.push({k:'flash',x:W/2,y:H*.45,r:W*.7,col:'150,200,255',t:0,max:.8,soft:1});setTimeout(()=>{if(BATTLE.on){shake=14;BATTLE.hitstop=.12;}},260);}
      if(B.t>1.8){B.phase='pause';B.t=.5;B.after='nextHero';}break;}
    case 'burst':{h.fr=B.t<.7?18:19;if(B.t<.7&&Math.random()<dt*30){B.fx.push({k:'star',x:h.x+rnd(-30,30)*S,y:h.y-rnd(60,150)*S,vx:rnd(-30,30)*S,vy:-rnd(60,160)*S,rot:rnd(0,TAU),vr:rnd(-6,6),s:rnd(5,9)*S,t:0,max:.6,ph:rnd(0,TAU)});}
      if(B.t>.7&&!B.burstDone){B.burstDone=1;STATS.atk++;const st=heroStats(h.id);for(const f_ of aliveFoes()){const c_=foeCenter(f_);for(let i=0;i<34;i++)B.fx.push({k:'star',x:rnd(c_.l-30*S,c_.r+30*S),y:c_.top-rnd(60,260)*S,vx:rnd(-20,20)*S,vy:rnd(250,420)*S,rot:rnd(0,TAU),vr:rnd(-7,7),s:rnd(8,15)*S,t:-rnd(0,.35),max:rnd(.8,1.1),ph:rnd(0,TAU)});
        const dmg=Math.max(4,st.atk*2+2-f_.def);setTimeout(()=>{if(BATTLE.on&&!f_.dead)hurtFoe(f_,dmg,true,'STARFALL!');},380);}B.fx.push({k:'flash',x:W/2,y:H*.4,r:W*.7,col:'255,220,140',t:0,max:.9,soft:1});setTimeout(()=>{if(BATTLE.on){shake=16;BATTLE.hitstop=.14;}},380);}
      if(B.t>2.1){B.phase='pause';B.t=.5;B.after='nextHero';}break;}
    case 'foeRegrow':{const f_=B.foes[B.foeI];if(B.t>.7&&!B.regrew){B.regrew=1;const hl=Math.min(3,f_.max-f_.hp);f_.hp+=hl;f_.showHp=1;const c_=foeCenter(f_);pop(c_.x,c_.y,'+'+hl,'heal');for(let i=0;i<10;i++)B.fx.push({k:'leaf',x:c_.x+rnd(-30,30)*S,y:c_.bot-rnd(0,40)*S,vx:rnd(-60,60)*S,vy:-rnd(80,180)*S,rot:rnd(0,TAU),vr:rnd(-6,6),s:rnd(4,7)*S,t:0,max:rnd(.6,1)});}if(B.t>1.5)nextFoe();break;}
    case 'foeWind':{const f_=B.foes[B.foeI];f_.wind=Math.min(1,B.t/B.windD);if(B.t>=B.windD){B.phase='foeLeap';B.t=0;B.leapD=.42;f_.wind=0;sfxSlimeHop(1.2);}break;}
    case 'foeLeap':{const f_=B.foes[B.foeI],tg=f_.tgt,u=clamp(B.t/B.leapD,0,1);const tx=(tg.x+tg.ox+(f_.type==='jelly'||f_.type==='fslime'||f_.type==='rslime'?100:f_.type==='skel'||f_.type==='reaper'?120:f_.type==='wisp'||f_.type==='bat'||f_.type==='vixen'||f_.type==='bigvixen'||f_.type==='spider'||f_.type==='rvixen'?90:f_.type==='bigspider'?140:40)*S)-f_.x,ty=tg.y-f_.y,kk=f_.type==='slugking'||f_.type==='rskel'||f_.type==='flora'||(f_.type==='reaper'&&f_.heavyNow)?0:1;const uu=f_.second?1-.35*Math.sin(Math.PI*u):u;f_.ox=tx*uu*kk;f_.oy=ty*uu*kk;f_.z=['skel','slugking','wisp','rskel','reaper','flora'].includes(f_.type)?0:Math.sin(Math.PI*u)*90*S;
      if(u>=1){const st=heroStats(tg.id),c=B.cmd;let dmg=Math.max(1,f_.atk+(f_.heavyNow?3:0)-(f_.weak>0?2:0)-st.def);if(f_.weak>0&&!f_.second)f_.weak--;if(f_.heavyNow)f_.charged=0;if(B.field&&B.field.scripted)dmg=Math.max(dmg,7);if(c.guard){dmg-=1;pop(tg.x+(f_.second?42*S:0),tg.y-170*S,'GUARD!','nice');sfxGuard();}if(B.defending[tg.id])dmg-=1;dmg=Math.max(0,dmg);if(f_.type==='bat')dmg=Math.max(1,dmg);
        STATS.foeAtk++;if(c.guard)STATS.guards++;STATS.dmg+=dmg;const H_=HEROES[tg.id];H_.hp=Math.max(0,H_.hp-dmg);tg.hurt=.5;if(f_.type==='rskel'&&dmg>0&&!c.guard&&!tg.chill){tg.chill=1;pop(tg.x,tg.y-190*S,'Chilled!','info');}pop(tg.x+(f_.second?42*S:0),tg.y-120*S,String(dmg),dmg?(c.guard?'guard':'hurt'):'zero');B.fx.push({k:'burst',x:tg.x+tg.ox-20*S,y:tg.y-85*S,t:0,max:.24,big:false,col:c.guard?'160,210,255':'255,170,150'});if(dmg)sfxSlimeHit(.8);shake=dmg?7:2;B.tut.guard=1;f_.land=.25;
        if(H_.hp<=0){tg.ko=1;}foeAbility(f_,tg,dmg,c);
        if(((f_.type==='skel'&&!(B.field&&B.field.scripted))||f_.type==='rskel')&&!f_.second&&!tg.ko){f_.second=1;B.phase='foeLeap';B.t=-.12;B.leapD=.42;B.cmd={guard:false,lock:0,tried:false};pop(f_.x+f_.ox,foeCenter(f_).top-40*S,'Double strike!','info');break;}
        f_.second=0;B.phase='foeBack';B.t=0;}break;}
    case 'foeBack':{const f_=B.foes[B.foeI],u=Math.min(1,B.t/.45);f_.ox*=1-u*.4;f_.oy*=1-u*.4;f_.z=['skel','slugking','wisp','rskel','reaper','flora'].includes(f_.type)?0:Math.sin(Math.PI*u)*40*S;if(u>=1){f_.ox=f_.oy=f_.z=0;if(!aliveHeroes().length){B.phase='lose';B.t=0;break;}nextFoe();}break;}
    case 'run':{const c=B.cmd;c.fill=Math.max(0,c.fill-dt*.28);h.fr=[0,1,2,3,4,5,6,7][Math.floor(B.t*14)%8];h.face=-1;if(B.t>2){h.face=1;h.fr=16;if(c.fill>=.6&&!(B.field&&B.field.scripted)){B.phase='fled';B.t=0;sfxFlee();}else{pop(h.x,h.y-150*S,"Can't escape!",'info');B.phase='pause';B.t=0;B.after='nextHero';}}break;}
    case 'fled':h.face=-1;h.ox-=dt*360;h.fr=[0,1,2,3,4,5,6,7][Math.floor(B.t*16)%8];if(B.t>.6&&!B.ending){B.ending=1;endBattle('flee');}break;
    case 'win':if(B.t>.9&&!B.rewarded){B.rewarded=1;sfxVictory();B.loot=[];for(const f_ of B.foes){if(f_.stolen)for(const id of f_.stolen){MATS[id]=(MATS[id]||0)+1;if(!BAG.includes(id))BAG.push(id);B.loot.push(id);}f_.stolen=null;const d=FOE_TYPES[f_.type].drop;if(d){MATS[d]=(MATS[d]||0)+1;if(!BAG.includes(d))BAG.push(d);B.loot.push(d);}
      if(f_.flag)C1[f_.flag]=1;if(f_.loot){giveItem(f_.loot);B.loot.unshift(f_.loot);}}}
      for(const h_ of B.heroes)if(!h_.ko)h_.fr=B.t>.9?(Math.floor(B.t*3)%2?20:19):16;break;
    case 'lose':{const h_=B.heroes[0];if(B.t>2.6&&!B.ending){B.ending=1;endBattle('lose');}break;}
  }
  if(B.phase!=='win'&&B.phase!=='fled'&&B.phase!=='lose'){B.rewarded=0;B.ending=0;}
  shake=Math.max(0,shake-dt*30);}

/* ---------- input ---------- */
function battlePointer(x,y){const B=BATTLE;if(WIPE.dir)return;
  if(battleAction())return;
  if(B.phase==='heroMenu'){for(const m of B.menuHits||[])if(Math.hypot(x-m.x,y-m.y)<m.r+6){chooseMenu(m.i);return;}return;}
  if(B.phase==='target'){for(let i=0;i<B.foes.length;i++){const f=B.foes[i];if(!f.dead&&Math.abs(x-f.x)<55*bS()&&Math.abs(y-(f.y-35*bS()))<60*bS()){B.target=i;startBonk();return;}}if(y>H*.75){B.phase='heroMenu';}return;}
  if(B.phase==='items'||B.phase==='powders'){for(const m of B.itemHits||[])if(x>m.x&&x<m.x+m.w&&y>m.y&&y<m.y+m.h){m.act();return;}B.phase='heroMenu';return;}
  if(B.phase==='win'&&B.t>1.6&&!B.ending){B.ending=1;endBattle('win');}}
function battleKey(code){const B=BATTLE;const act=code==='KeyJ'||code==='Space'||code==='KeyK'||code==='KeyE'||code==='Enter';
  if(act&&battleAction())return;
  if(B.phase==='heroMenu'){const nm=menuOpts().length;B.menu=Math.min(B.menu,nm-1);if(code==='ArrowLeft'||code==='KeyA')B.menu=(B.menu+nm-1)%nm;if(code==='ArrowRight'||code==='KeyD')B.menu=(B.menu+1)%nm;if(act)chooseMenu(B.menu);return;}
  if(B.phase==='target'){const al=B.foes.map((f,i)=>i).filter(i=>!B.foes[i].dead);let k=al.indexOf(B.target);if(code==='ArrowLeft'||code==='KeyA')B.target=al[(k+al.length-1)%al.length];if(code==='ArrowRight'||code==='KeyD')B.target=al[(k+1)%al.length];if(act)startBonk();if(code==='Escape')B.phase='heroMenu';return;}
  if(B.phase==='items'||B.phase==='powders'){const n=(B.itemHits||[]).length;B.itemSel=Math.min(B.itemSel||0,Math.max(0,n-1));if(code==='ArrowUp'||code==='KeyW')B.itemSel=Math.max(0,B.itemSel-1);if(code==='ArrowDown'||code==='KeyS')B.itemSel=Math.min(n-1,B.itemSel+1);if(act){if(n)B.itemHits[B.itemSel].act();else B.phase='heroMenu';}if(code==='Escape'||code==='Backspace')B.phase='heroMenu';return;}
  if(B.phase==='win'&&act&&B.t>1.6&&!B.ending){B.ending=1;endBattle('win');}}

/* ---------- drawing ---------- */
let BBG=null;const CAPTURE={want:false,on:false};
/* soft blur that looks the same on every browser: shrink, then a few box-blur passes on the pixels */
function blurBox(d,w,h,r){const t=new Uint8ClampedArray(d.length);for(let pass=0;pass<3;pass++){
  for(let y=0;y<h;y++){let sr=0,sg=0,sb=0;const row=y*w;for(let x=-r;x<=r;x++){const i=(row+clamp(x,0,w-1))*4;sr+=d[i];sg+=d[i+1];sb+=d[i+2];}
    for(let x=0;x<w;x++){const o=(row+x)*4,n=2*r+1;t[o]=sr/n;t[o+1]=sg/n;t[o+2]=sb/n;t[o+3]=255;const a=(row+clamp(x-r,0,w-1))*4,b=(row+clamp(x+r+1,0,w-1))*4;sr+=d[b]-d[a];sg+=d[b+1]-d[a+1];sb+=d[b+2]-d[a+2];}}
  for(let x=0;x<w;x++){let sr=0,sg=0,sb=0;for(let y=-r;y<=r;y++){const i=(clamp(y,0,h-1)*w+x)*4;sr+=t[i];sg+=t[i+1];sb+=t[i+2];}
    for(let y=0;y<h;y++){const o=(y*w+x)*4,n=2*r+1;d[o]=sr/n;d[o+1]=sg/n;d[o+2]=sb/n;d[o+3]=255;const a=(clamp(y-r,0,h-1)*w+x)*4,b=(clamp(y+r+1,0,h-1)*w+x)*4;sr+=t[b]-t[a];sg+=t[b+1]-t[a+1];sb+=t[b+2]-t[a+2];}}}}
function captureBackdrop(){CAPTURE.on=false;CAPTURE.want=false;const w=Math.max(40,Math.round(W/3)),h=Math.max(40,Math.round(H/3));BBG=document.createElement('canvas');BBG.width=w;BBG.height=h;const b=BBG.getContext('2d');
  // step down in halves so the shrink itself is smooth
  let src=cv,sw=cv.width,sh=cv.height;while(sw/2>w*1.2){const t=document.createElement('canvas');t.width=Math.round(sw/2);t.height=Math.round(sh/2);const c=t.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(src,0,0,t.width,t.height);src=t;sw=t.width;sh=t.height;}
  b.imageSmoothingEnabled=true;b.imageSmoothingQuality='high';b.drawImage(src,0,0,w,h);try{const im=b.getImageData(0,0,w,h);blurBox(im.data,w,h,3);b.putImageData(im,0,0);}catch(e){}BBG.full=true;}
function renderBattle(){const B=BATTLE,S=bS();ctx.setTransform(DPR,0,0,DPR,0,0);
  const sx=(Math.random()-.5)*shake,sy=(Math.random()-.5)*shake;BSX=sx;BSY=sy;ctx.save();ctx.translate(sx,sy);
  // backdrop: the room itself, softened like a painted stage set
  const im=IMG.wellroom;ctx.fillStyle='#1d2230';ctx.fillRect(-20,-20,W+40,H+40);
  if(BBG&&BBG.full){ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(BBG,0,0,W,H);}else if(ready(im)){if(!BBG){BBG=document.createElement('canvas');BBG.width=688;BBG.height=384;const b=BBG.getContext('2d');b.imageSmoothingQuality='high';b.filter='blur(5px)';if(b.filter==='blur(5px)'){b.drawImage(im,-10,-10,708,404);}else{const t1=document.createElement('canvas');t1.width=172;t1.height=96;const c1=t1.getContext('2d');c1.imageSmoothingQuality='high';c1.drawImage(im,0,0,172,96);const t2=document.createElement('canvas');t2.width=344;t2.height=192;const c2=t2.getContext('2d');c2.imageSmoothingQuality='high';c2.drawImage(t1,0,0,344,192);b.drawImage(t2,0,0,688,384);}}const sc=Math.max(W/1375,H/768)*1.05,iw=1375*sc,ih=768*sc;const fx=WCAM.x*sc;ctx.imageSmoothingQuality='high';ctx.drawImage(BBG,clamp(W/2-fx,W-iw,0),(H-ih)/2,iw,ih);}
  const vg=ctx.createRadialGradient(W/2,H*.58,40,W/2,H*.55,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(20,16,40,.15)');vg.addColorStop(1,'rgba(14,10,28,.72)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  // the stage: a pool of warm light on the floor
  const fy=H*STAGE_Y;{const g=ctx.createRadialGradient(W/2,fy,10,W/2,fy,W*.6);g.addColorStop(0,'rgba(255,240,200,.32)');g.addColorStop(1,'rgba(255,240,200,0)');}
  for(let i=0;i<14;i++){const tw=.5+.5*Math.sin(T*1.7+i*2.3);drawGlow(ctx,(hash(i,4,61)*W+T*6*(i%3+1))%W,H*.15+hash(i,5,61)*H*.5,6*tw+3,i%2?'190,230,255':'230,210,255',.35*tw);}
  // y-sorted actors
  const L=[];for(const h of B.heroes)L.push([h.y+h.oy,()=>drawBattleHero(h)]);for(const f of B.foes)L.push([f.y+f.oy,()=>{drawBattleFoe(f);drawFoeStatus(f);}]);L.sort((a,b)=>a[0]-b[0]);for(const [,d] of L)d();
  for(const p of B.spark){const a=1-p.t;ctx.fillStyle=`rgba(${p.c},${a.toFixed(3)})`;ctx.beginPath();ctx.arc(p.x,p.y,3*S*(1-p.t*.5),0,TAU);ctx.fill();}
  drawBattleFx();
  drawCommandUI();
  ctx.restore();
  // storybook frame
  ctx.strokeStyle='rgba(230,200,140,.55)';ctx.lineWidth=2;rr(8,8,W-16,H-16,14);ctx.stroke();ctx.strokeStyle='rgba(230,200,140,.25)';ctx.lineWidth=1;rr(13,13,W-26,H-26,11);ctx.stroke();
  for(const p of B.pops)drawPop(p);
  drawPartyHUD();drawBattleMenu();drawPowderMenu();drawPowderPuff();drawBattleBanner();
  drawSoundBtn();drawWipe();drawSceneFade();}
function drawBattleJak(h){const S=bS(),B=BATTLE,x=h.x+h.ox,y=h.y+h.oy,me=B.heroes[B.cur]===h,ph=B.phase,t=B.t,H_=206*S;let an='idle',fi=0,flip=false;
  if(h.ko){an='ko';fi=Math.min(3,Math.floor((h.koT||0)/.14));}else if(h.hurt>0){an='hurt';fi=Math.min(3,Math.floor((.5-h.hurt)/.1));}else if(me&&ph==='bonkRun'){an='run';fi=Math.floor(t*12)%5;}else if(me&&(ph==='bonkBack'||ph==='run'||ph==='fled')){an='run';fi=Math.floor(t*12)%5;flip=h.face<0||ph==='bonkBack';}
  else if(me&&ph==='bonkWind'){an='chop';fi=Math.min(4,Math.floor(t/B.windD*5));}else if(me&&ph==='bonkHit'){an='swing';fi=Math.min(4,Math.floor(t/.08));}else if(me&&ph==='jbolt'){an='cast';fi=Math.min(7,Math.floor(t/.1));}
  if(h.ko)h.koT=(h.koT||0)+1/60;else h.koT=0;ctx.save();ctx.translate(x,y+3);if(an==='idle'&&!h.ko){const b=Math.sin(T*2.1);ctx.scale(1-.004*b,1+.008*b);}
  c1Frame(ctx,'jak',an,fi,JAKDX*H_*(flip?-1:1),0,H_,flip,1,h.hurt>.3?1:0);ctx.restore();
  if(h.stuck&&!h.ko){}}
function drawBattleHero(h){const S=bS(),sp=.62*S,x=h.x+h.ox,y=h.y+h.oy;
  bshadow(x,y+2,40*S,11*S,.35);
  if(h.id==='jak'){drawBattleJak(h);drawHeroStatus(h);if(BATTLE.defending&&BATTLE.defending[h.id]){ctx.strokeStyle='rgba(170,220,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-90*S,66*S,110*S,0,0,TAU);ctx.stroke();}return;}
  if(h.id==='lum'){drawBattleLum(h);if(BATTLE.defending&&BATTLE.defending[h.id]){ctx.strokeStyle='rgba(170,220,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-75*S,60*S,98*S,0,0,TAU);ctx.stroke();}return;}
  if(!ready(catlas))return;ctx.save();ctx.translate(x,y+3);
  if(h.ko){const u=Math.min(1,BATTLE.t/.5);ctx.rotate(-u*1.35);ctx.translate(0,-u*10);}
  if(h.hurt>0)ctx.translate(Math.sin(h.hurt*60)*4,0);
  if(h.face<0)ctx.scale(-1,1);
  if(h.fr===16&&!h.ko){const b=Math.sin(T*2.3);ctx.scale(1-.004*b,1+.009*b);}
  const dw=CFW*sp,dh=CFH*sp;const bf=(PARTY[h.id]&&PARTY[h.id].main==='blade')?bladeBattleFr(h):h.fr;ctx.drawImage(cosSheet(),bf*CFW,0,CFW,CFH,-dw/2,-dh*(264/270),dw,dh);
  if(PARTY[h.id]&&PARTY[h.id].head==='bucket'){ctx.save();ctx.translate(-dw/2,-dh*(264/270));ctx.scale(sp,sp);drawBucketHat(ctx,bf);ctx.restore();}
  if(h.hurt>0){ctx.globalCompositeOperation='source-atop';}
  ctx.restore();
  if(h.ko){for(let i=0;i<3;i++){const a=T*3+i*TAU/3;drawGlow(ctx,x-30*S+Math.cos(a)*22*S,y-40*S+Math.sin(a)*7*S,8,'255,240,150',.8);}}
  if(BATTLE.defending&&BATTLE.defending[h.id]){ctx.strokeStyle='rgba(170,220,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-70*S,58*S,92*S,0,0,TAU);ctx.stroke();}}
function bshadow(x,y,rx,ry,a){if(WHITEPASS||a<=0)return;ctx.fillStyle=`rgba(10,10,20,${a.toFixed(3)})`;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();}
function drawBattleFoe(f){const S=bS();if(f.type==='skel'){drawBattleSkel(f);return;}if(f.type==='slugking'){drawBattleKing(f);return;}if(f.type==='wisp'||f.type==='rskel'||f.type==='reaper'||f.type==='bat'||f.type==='vixen'||f.type==='bigvixen'||f.type==='spider'||f.type==='flora'||f.type==='rvixen'||f.type==='bigspider'){drawBattleC1Foe(f);return;}if(f.type==='fslime'||f.type==='rslime'){drawBattleJelly(f);return;}if(f.dead>.6)return;if(f.type==='slug'){drawBattleSlug(f);return;}if(f.type==='jelly'){drawBattleJelly(f);return;}if(f.type==='mimic'){drawBattleMimic(f);return;}const g={...f,x:f.x+f.ox,y:f.y+f.oy,z:f.z/((1.3*S))};
  g.hop=f.z>1?{t:.5}:null;if(f.wind){g.land=.25*f.wind;}g.dead=f.dead;
  drawWellSlime(g,1.3*S*f.s/f.s);
  if(f.showHp>0&&!f.dead){const w=54*S,x=f.x+f.ox-w/2,y=f.y+f.oy+16*S;ctx.save();ctx.globalAlpha=Math.min(1,f.showHp*3);ctx.fillStyle='rgba(20,20,30,.55)';rr(x-2,y-2,w+4,10,5);ctx.fill();ctx.fillStyle='#7ee08a';rr(x,y,w*f.hp/f.max,6,3);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(`${f.hp}/${f.max}`,x+w/2,y+20);ctx.restore();}
  if(BATTLE.phase==='target'&&BATTLE.foes[BATTLE.target]===f){tutArrow(ctx,f.x,f.y-100*S,1);}}
function drawBattleSlug(f){const S=bS(),sc=1.25*S*f.s,x=f.x+f.ox,y=f.y+f.oy-f.z,w=SFW*sc,h=SFH*sc;const dying=f.dead?Math.min(1,f.dead/.5):0;
  bshadow(f.x+f.ox,f.y+f.oy+2,w*.34,h*.1,.35*(1-Math.min(1,f.z/60))*(1-dying));
  drawGlow(ctx,x,y-h*.3,w*.45,'190,240,255',.22+.06*Math.sin(T*1.3+f.ph));
  if(ready(satlas)){const moving=BATTLE.phase==='foeLeap'||BATTLE.phase==='foeBack';const [o,n]=SROW[2];const fi=moving&&BATTLE.foes[BATTLE.foeI]===f?Math.floor(T*14)%n:0;
    let sqx=1+.03*Math.sin(T*2.2+f.ph),sqy=1-.03*Math.sin(T*2.2+f.ph);if(f.wind){sqy-=.25*f.wind;sqx+=.18*f.wind;}if(f.land>0){sqy-=.2*f.land/.25;sqx+=.2*f.land/.25;}if(f.hit>0){sqx+=.12*Math.sin(f.hit*40);}
    if(dying){sqx*=1-dying*.6;sqy*=1-dying*.8;}
    ctx.save();ctx.globalAlpha=1-dying;ctx.translate(x,y+2);ctx.scale(-sqx,sqy);ctx.filter=f.hit>0?'brightness(2.2)':'brightness(1.25) saturate(1.15)';ctx.drawImage(satlas,(o+fi)*SFW,0,SFW,SFH,-w/2,-h*(106/110),w,h);ctx.filter='none';ctx.restore();}
  if(f.showHp>0&&!f.dead){const bw=54*S,bx=f.x+f.ox-bw/2,by=f.y+f.oy+16*S;ctx.save();ctx.globalAlpha=Math.min(1,f.showHp*3);ctx.fillStyle='rgba(20,20,30,.55)';rr(bx-2,by-2,bw+4,10,5);ctx.fill();ctx.fillStyle='#7ee08a';rr(bx,by,bw*f.hp/f.max,6,3);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(`${f.hp}/${f.max}`,bx+bw/2,by+20);ctx.restore();}
  if(BATTLE.phase==='target'&&BATTLE.foes[BATTLE.target]===f)tutArrow(ctx,f.x,f.y-90*S,1);}
function drawBattleJelly(f){const S=bS(),me=BATTLE.foes[BATTLE.foeI]===f,lunging=me&&BATTLE.phase==='foeLeap',moss=f.type==='fslime',red=f.type==='rslime';const im=red?(lunging?IMG.jelly_lunge_red:IMG.jelly_idle_red):lunging?(moss?IMG.jelly_lunge_moss:IMG.jelly_lunge):(moss?IMG.jelly_idle_moss:IMG.jelly_idle);
  const w=(lunging?190:175)*S*f.s,h=w*(ready(im)?im.naturalHeight/im.naturalWidth:.7),x=f.x+f.ox,gy=f.y+f.oy,hov=(22+Math.sin(f.ph*1.6)*7)*S+f.z*.5,dying=f.dead?Math.min(1,f.dead/.5):0;
  let sq=1;if(f.wind)sq=1-.15*f.wind;if(f.land>0)sq=1-.15*f.land/.25;
  bshadow(x,gy+2,w*.3,w*.07,.3*(1-Math.min(1,hov/120))*(1-dying));
  drawGlow(ctx,x,gy-hov-h*.55,w*.8,'170,230,255',.32+.08*Math.sin(f.ph*2));
  drawJellySprite(im,x,gy-hov,w*(2-sq)*(1+dying*.5),h*sq*(1-dying*.4),f.ph*(f.wind?2:1),f.hit,1-dying);
  if(f.showHp>0&&!f.dead){const bw=54*S,bx=x-bw/2,by=gy+16*S;ctx.save();ctx.globalAlpha=Math.min(1,f.showHp*3);ctx.fillStyle='rgba(20,20,30,.55)';rr(bx-2,by-2,bw+4,10,5);ctx.fill();ctx.fillStyle='#7ee08a';rr(bx,by,bw*f.hp/f.max,6,3);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(`${f.hp}/${f.max}`,bx+bw/2,by+20);ctx.restore();}
  if(BATTLE.phase==='target'&&BATTLE.foes[BATTLE.target]===f)tutArrow(ctx,f.x,f.y-150*S,1);}
/* the mimic: frames 0 closed, 1 peek, 2 wide, 3 widest, 4 front gape (sheet cells 298x270) */
function mimicFrame(f){const me=BATTLE.foes[BATTLE.foeI]===f,ph=BATTLE.phase;
  if(me&&ph==='foeLeap')return 3;if(me&&ph==='foeWind')return f.wind>.6?2:1;if(me&&ph==='foeJiggle')return Math.floor(BATTLE.t*10)%2?2:0;
  if(f.hit>0)return 4;const c=(T*.7+f.ph)%3;return c<.18?1:c<.3?2:c<.42?1:0;}
function drawMimicSprite(c,fr,x,y,w,alpha,flash){const im=IMG.mimic;if(!ready(im))return;const h=w*270/298;c.save();c.globalAlpha=alpha;if(flash>0)c.filter='brightness(1.9)';c.drawImage(im,fr*298,0,298,270,x-w/2,y-h,w,h);c.filter='none';c.restore();}
function drawBattleMimic(f){const S=bS(),w=150*S*f.s,x=f.x+f.ox,y=f.y+f.oy,dying=f.dead?Math.min(1,f.dead/.5):0;
  bshadow(x,y-4,w*.4,w*.075,.35*(1-Math.min(1,f.z/80)));
  let sx=1,sy=1;if(f.wind){sy=1-.08*f.wind;sx=1+.06*f.wind;}if(f.land>0){sy=1-.12*f.land/.25;sx=1+.1*f.land/.25;}const fr=mimicFrame(f);
  const hop=fr===0&&!f.hit?0:Math.abs(Math.sin(T*14))*2*S;
  ctx.save();ctx.translate(x+(f.hit>0?Math.sin(f.hit*50)*4:0),y-f.z-hop);ctx.scale(sx*(1-dying*.3),sy*(1-dying*.5));drawMimicSprite(ctx,fr,0,6*S,w,1-dying,f.hit);ctx.restore();
  if(f.showHp>0&&!f.dead){const bw=60*S,bx=x-bw/2,by=y+16*S;ctx.save();ctx.globalAlpha=Math.min(1,f.showHp*3);ctx.fillStyle='rgba(20,20,30,.55)';rr(bx-2,by-2,bw+4,10,5);ctx.fill();ctx.fillStyle='#7ee08a';rr(bx,by,bw*f.hp/f.max,6,3);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText(`${f.hp}/${f.max}`,bx+bw/2,by+20);ctx.restore();}
  if(BATTLE.phase==='target'&&BATTLE.foes[BATTLE.target]===f)tutArrow(ctx,f.x,f.y-150*S,1);}
function drawPop(p){const S=bS(),u=p.t/1.2,y=p.y-Math.min(1,p.t*4)*24*S;ctx.save();ctx.globalAlpha=Math.min(1,(1.2-p.t)*4);ctx.textAlign='center';
  if(p.kind==='dmg'||p.kind==='crit'||p.kind==='hurt'||p.kind==='guard'||p.kind==='zero'||p.kind==='poison'){const t=p.t,crit=p.kind==='crit',x=p.x+p.vx*S*t,yy=p.y+(-300*t+350*t*t)*S;
    const sc=t<.1?.3+t/.1*1.05:Math.max(1,1.35-(t-.1)*2.2);ctx.translate(x,yy);ctx.scale(sc,sc);ctx.rotate(p.vx/55*.12*Math.min(1,t*3));
    if(p.kind!=='dmg'){const r=(crit?31:22)*S,col=crit?'#ffc93a':p.kind==='hurt'?'#e8605a':p.kind==='guard'?'#68b4f2':p.kind==='poison'?'#8fd45a':'#a8b4c8';
      if(crit){ctx.globalCompositeOperation='lighter';drawGlow(ctx,0,0,r*2.2,'255,210,90',.55*Math.min(1,(1.2-t)*3));ctx.globalCompositeOperation='source-over';ctx.globalAlpha=Math.min(1,(1.2-p.t)*4);}
      ctx.fillStyle=col;ctx.strokeStyle='rgba(60,30,10,.6)';ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<10;k++){const a=k/10*TAU-Math.PI/2,rr_=k%2?r*.56:r;ctx.lineTo(Math.cos(a)*rr_,Math.sin(a)*rr_);}ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.fillStyle=crit?'#fffbe8':'#fff';ctx.strokeStyle='rgba(50,24,10,.85)';ctx.lineWidth=crit?4:3.5;ctx.lineJoin='round';ctx.font=`700 ${Math.round((crit?25:p.kind==='dmg'?21:17)*S)}px "Alegreya SC", Georgia, serif`;ctx.strokeText(p.text,0,7*S);ctx.fillText(p.text,0,7*S);}
  else if(p.kind==='heal'){const r=22*S*(1+.3*Math.max(0,1-p.t*5));const col=p.kind==='hurt'?'#e8605a':p.kind==='heal'?'#6fd28a':p.kind==='zero'?'#a8b4c8':'#f5c542';
    ctx.translate(p.x,y);ctx.rotate(Math.sin(p.t*3)*.1);ctx.fillStyle=col;ctx.strokeStyle='rgba(60,30,10,.6)';ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<10;k++){const a=k/10*TAU-Math.PI/2,rr_=k%2?r*.55:r;ctx.lineTo(Math.cos(a)*rr_,Math.sin(a)*rr_);}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff';ctx.strokeStyle='rgba(60,30,10,.7)';ctx.lineWidth=3;ctx.font=`700 ${Math.round(17*S)}px "Alegreya SC", Georgia, serif`;ctx.strokeText(p.text,0,6*S);ctx.fillText(p.text,0,6*S);}
  else if(p.kind==='weak'){const sc=1+.6*Math.max(0,1-p.t*5);ctx.font=`700 ${Math.round(26*S)}px "Alegreya SC", Georgia, serif`;ctx.lineWidth=5;ctx.strokeStyle='rgba(70,10,10,.85)';ctx.fillStyle='#ff8a5c';ctx.translate(p.x,y);ctx.rotate(-.12);ctx.scale(sc,sc);ctx.strokeText(p.text,0,0);ctx.fillText(p.text,0,0);}
  else{const big=p.kind==='nice';ctx.font=`700 ${Math.round((big?24:15)*S)}px "Alegreya SC", Georgia, serif`;ctx.lineWidth=4;ctx.strokeStyle='rgba(40,20,50,.75)';ctx.fillStyle=big?'#ffe27a':'#fdf6e4';const sc=big?1+.4*Math.max(0,1-p.t*5):1;ctx.translate(p.x,y);ctx.scale(sc,sc);ctx.strokeText(p.text,0,0);ctx.fillText(p.text,0,0);}
  ctx.restore();}
function drawCommandUI(){const B=BATTLE,S=bS();drawBladeSlash();
  if(B.phase==='bonkWind'){const f=B.foes[B.target],cx=f.x,cy=f.y-40*S*f.s,w=B.t/B.windD,r=Math.max(18*S,(1-w)*110*S+18*S);
    ctx.save();ctx.strokeStyle=`rgba(255,240,180,${(.4+.6*w).toFixed(3)})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();
    const on=w>.8&&w<=1.02;drawGlow(ctx,cx,cy,on?40*S:24*S,'255,220,120',on?.9:.4);ctx.fillStyle=on?'#fff6c8':'#e8c060';ctx.beginPath();for(let k=0;k<10;k++){const a=k/10*TAU-Math.PI/2,rr_=k%2?7*S:16*S;ctx.lineTo(cx+Math.cos(a)*rr_,cy+Math.sin(a)*rr_);}ctx.closePath();ctx.fill();ctx.restore();
    if(!B.tut.bonk)tutText(tw('Tap just as the ring touches the star!','Press Space just as the ring touches the star!'));}
  if((B.phase==='foeWind'||B.phase==='foeLeap')&&!B.tut.guard)tutText(`${tw('Tap','Press Space')} just before the ${B.foes[B.foeI]?B.foes[B.foeI].name:'enemy'} hits to guard!`);
  if(B.phase==='run'){const h=B.heroes[B.cur],c=B.cmd,w=150*S,x=W/2-w/2,y=H*.75;ctx.fillStyle='rgba(20,20,30,.6)';rr(x-4,y-4,w+8,22,11);ctx.fill();ctx.fillStyle=c.fill>=.6?'#7ee08a':'#f2d58a';rr(x,y,w*c.fill,14,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w*.6,y-6);ctx.lineTo(x+w*.6,y+20);ctx.stroke();
    tutText(tw('Tap tap tap as fast as you can to run away!','Mash Space as fast as you can to run away!'));}}
function drawBladeSlash(){const B=BATTLE;if(PARTY[HERO].main!=='blade'||(B.phase!=='bonkHit'&&!(B.phase==='bonkWind'&&B.t>=B.windD)))return;const f=B.foes[B.target];if(!f)return;const S=bS(),u=B.phase==='bonkHit'?Math.min(1,B.t/.3):0,cx=f.x+f.ox,cy=f.y-50*S;
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-u*.8)*.55;ctx.lineCap='round';for(const [w,col] of [[16,'rgba(150,0,15,.6)'],[8,'rgba(230,40,50,.9)'],[3,'rgba(255,200,200,1)']]){ctx.strokeStyle=col;ctx.lineWidth=w*S;ctx.beginPath();ctx.arc(cx-30*S,cy+10*S,70*S,-1.9+u*.2,-.2+u*.6);ctx.stroke();}ctx.restore();drawGlow(ctx,cx,cy,80*S,'220,30,40',.4*(1-u));}
function tutText(t){ctx.save();ctx.font='italic 15px Alegreya, Georgia, serif';ctx.textAlign='center';const w=ctx.measureText(t).width+30,y=H*.84;ctx.fillStyle='rgba(30,26,40,.72)';rr(W/2-w/2,y-19,w,32,16);ctx.fill();ctx.fillStyle='#fdf6e4';ctx.fillText(t,W/2,y+2);ctx.restore();}
function drawPartyHUD(){const B=BATTLE;let x=20;for(const id of PARTY_ORDER){const H_=HEROES[id],w=140,y=20;ctx.save();ctx.fillStyle='rgba(246,236,210,.92)';rr(x,y,w,44,12);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#4a3420';ctx.font='700 13px "Alegreya SC", Georgia, serif';ctx.textAlign='left';ctx.fillText(H_.name,x+12,y+18);
  const hx=x+12,hy=y+31;ctx.fillStyle='#e8605a';ctx.beginPath();ctx.moveTo(hx+6,hy+5);ctx.bezierCurveTo(hx-4,hy-2,hx+1,hy-8,hx+6,hy-3);ctx.bezierCurveTo(hx+11,hy-8,hx+16,hy-2,hx+6,hy+5);ctx.fill();
  ctx.fillStyle='#5a4630';ctx.font='700 13px "Alegreya SC", Georgia, serif';ctx.fillText(`${H_.hp} / ${H_.maxHp}`,hx+22,hy+5);
  ctx.fillStyle='rgba(60,40,20,.2)';rr(x+80,y+26,48,7,3.5);ctx.fill();ctx.fillStyle=H_.hp/H_.maxHp>.35?'#7ec27e':'#e8605a';rr(x+80,y+26,48*H_.hp/H_.maxHp,7,3.5);ctx.fill();
  if((id==='lum'||id==='jak')&&CH>0){const cb=Math.min(COMBO_MAX,comboOf(id)),full=cb>=COMBO_MAX;ctx.fillStyle='rgba(246,236,210,.85)';rr(x+14,y+46,112,20,10);ctx.fill();ctx.strokeStyle=full?'#e0a83a':'rgba(196,154,78,.7)';ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle='#6a4a28';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.textAlign='left';ctx.fillText('COMBO',x+22,y+60);
    for(let i=0;i<COMBO_MAX;i++){const sx=x+68+i*12.5,sy=y+56;ctx.save();ctx.translate(sx,sy);if(i<cb){if(full){ctx.globalCompositeOperation='lighter';drawGlow(ctx,0,0,12,'255,210,100',.5+.3*Math.sin(T*6));ctx.globalCompositeOperation='source-over';}ctx.fillStyle='#ffd65a';ctx.strokeStyle='#8a5a10';}else{ctx.fillStyle='rgba(120,90,50,.18)';ctx.strokeStyle='rgba(120,90,50,.45)';}ctx.lineWidth=1;starPath(ctx,5.6);ctx.fill();ctx.stroke();ctx.restore();}}
  ctx.restore();x+=w+8;}}
function drawBattleMenu(){const B=BATTLE,S=bS();B.menuHits=[];B.itemHits=[];
  if(B.phase==='heroMenu'){const h=B.heroes[B.cur],nm=menuOpts().length,cy=H*.855,r=30*S*(nm>4?.86:1),gap=(W-40)/nm;
    ctx.save();ctx.textAlign='center';ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillStyle='rgba(253,246,228,.85)';ctx.fillText(`What will ${HEROES[h.id].name} do?`,W/2,cy-r-22);
    menuOpts().forEach(([k,label],i)=>{const x=20+gap*(i+.5),y=cy+((nm>4?(i>0&&i<nm-1):(i===1||i===2))?8:0)*S,sel=B.menu===i,bounce=sel?Math.sin(T*6)*2:0;
      if(sel)drawGlow(ctx,x,y,r*2,'255,215,120',.45);if(k==='burst')drawGlow(ctx,x,y,r*2.4,curHeroId()==='jak'?'140,200,255':'255,200,90',.45+.2*Math.sin(T*5));
      ctx.fillStyle='rgba(20,10,10,.35)';ctx.beginPath();ctx.arc(x+1,y+3,r,0,TAU);ctx.fill();
      const g=ctx.createRadialGradient(x-r*.3,y-r*.4,3,x,y,r);g.addColorStop(0,'#fbf1d8');g.addColorStop(1,'#d8bd85');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y+bounce,r,0,TAU);ctx.fill();ctx.strokeStyle=sel?'#e0a83a':'#a07a3a';ctx.lineWidth=sel?3:2;ctx.stroke();
      if(k==='bonk'){const mh=(PARTY[h.id]||{}).main;label=mh&&ITEMS[mh]?ITEMS[mh].name.split(' ').pop():'Attack';}
      drawMenuIcon(k,x,y+bounce,r);ctx.fillStyle='#fdf6e4';ctx.strokeStyle='rgba(30,20,10,.7)';ctx.lineWidth=3;ctx.font=`700 ${Math.round(12*S)}px "Alegreya SC", Georgia, serif`;ctx.strokeText(label,x,y+r+16*S);ctx.fillText(label,x,y+r+16*S);
      B.menuHits.push({x,y,r,i});});ctx.restore();}
  if(B.phase==='target')tutText(tw('Tap an enemy to bonk it','Click an enemy (or press Space) to attack it'));
  if(B.phase==='items'){const use=[...new Set(BAG.filter(id=>ITEMS[id].kind==='use'))];const w=Math.min(W-40,320),x=(W-w)/2,y=H*.55,h_=Math.max(120,use.length*46+70);
    ctx.save();ctx.fillStyle='rgba(20,10,10,.3)';rr(x+2,y+4,w,h_,14);ctx.fill();ctx.fillStyle='#f6ecd2';rr(x,y,w,h_,14);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle='#6a4a28';ctx.font='700 14px "Alegreya SC", Georgia, serif';ctx.textAlign='center';ctx.fillText('Potions & Powders',W/2,y+26);
    if(!use.length){ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillStyle='#8a7050';ctx.fillText("Nothing in your satchel yet…",W/2,y+60);ctx.fillText("Maybe the magic shop has something?",W/2,y+80);}
    use.forEach((id,i)=>{const yy=y+40+i*46;ctx.fillStyle='rgba(120,86,40,.12)';rr(x+12,yy,w-24,40,10);ctx.fill();if(!TOUCHUI()&&i===(B.itemSel||0)){ctx.strokeStyle='#e0a83a';ctx.lineWidth=2;ctx.stroke();}drawIcon(ctx,id,x+34,yy+20,26);ctx.fillStyle='#4a3420';ctx.textAlign='left';ctx.font='700 14px "Alegreya SC", Georgia, serif';ctx.fillText(ITEMS[id].name,x+58,yy+18);{const nn=BAG.filter(b=>b===id).length;ctx.textAlign='right';ctx.fillText('\u00D7'+nn,x+w-24,yy+26);ctx.textAlign='left';}ctx.font='italic 12px Alegreya, Georgia, serif';ctx.fillStyle='#7a6040';ctx.fillText(ITEMS[id].short||'',x+58,yy+33);
      B.itemHits.push({x:x+12,y:yy,w:w-24,h:40,act:()=>useItem(id)});});
    ctx.font='italic 12px Alegreya, Georgia, serif';ctx.fillStyle='#8a7050';ctx.textAlign='center';ctx.fillText(tw('tap outside to go back','click outside or press Esc to go back'),W/2,y+h_-12);ctx.restore();}}
function drawMenuIcon(k,x,y,r){ctx.save();ctx.translate(x,y);
  if(k==='powder'){drawIcon(ctx,'lumpouch',0,0,r*1.25);ctx.restore();return;}
  if(k==='burst'){const jb=curHeroId()==='jak';ctx.rotate(T*.8);ctx.fillStyle=jb?'#8fd0ff':'#ffd65a';ctx.strokeStyle=jb?'#2a5a8a':'#8a5a10';ctx.lineWidth=2;starPath(ctx,r*.62);ctx.fill();ctx.stroke();ctx.fillStyle='#fff8dc';starPath(ctx,r*.26);ctx.fill();ctx.restore();return;}
  if(k==='bonk'){const mh=(PARTY[curHeroId()]||{}).main;if(mh&&ITEMS[mh])drawIcon(ctx,mh,0,0,r*1.3);else drawIcon(ctx,'staff',0,0,r*1.3);}
  else if(k==='items'&&ready(IMG.icon_potion)){drawIcon(ctx,'potion',0,0,r*1.25);}
  else if(k==='items'){ctx.fillStyle='rgba(190,120,220,.85)';ctx.beginPath();ctx.arc(0,r*.12,r*.42,0,TAU);ctx.fill();ctx.fillStyle='#e8e0f0';ctx.fillRect(-r*.13,-r*.55,r*.26,r*.3);ctx.fillStyle='#8a5a32';ctx.fillRect(-r*.16,-r*.66,r*.32,r*.14);ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.arc(-r*.15,0,r*.1,0,TAU);ctx.fill();}
  else if(k==='defend'){const s=r*1.2,g=ctx.createLinearGradient(-s*.4,0,s*.4,0);g.addColorStop(0,'#5a7dc0');g.addColorStop(1,'#34508a');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-s*.5);ctx.quadraticCurveTo(s*.32,-s*.38,s*.42,-s*.42);ctx.quadraticCurveTo(s*.44,s*.2,0,s*.55);ctx.quadraticCurveTo(-s*.44,s*.2,-s*.42,-s*.42);ctx.quadraticCurveTo(-s*.32,-s*.38,0,-s*.5);ctx.fill();ctx.strokeStyle='#e2b84e';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#e2b84e';ctx.beginPath();for(let k_=0;k_<10;k_++){const a=k_/10*TAU-Math.PI/2,q=k_%2?s*.06:s*.15;ctx.lineTo(Math.cos(a)*q,Math.sin(a)*q);}ctx.closePath();ctx.fill();}
  else if(k==='run'){ctx.strokeStyle='#6a4a28';ctx.lineWidth=r*.12;ctx.lineCap='round';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-r*.5,-r*.3+i*r*.3);ctx.lineTo(-r*.1+i*r*.08,-r*.3+i*r*.3);ctx.stroke();}drawIcon(ctx,'boots',r*.2,0,r*.9);}
  ctx.restore();}
function drawBattleBanner(){const B=BATTLE,S=bS();
  if(B.phase==='banner'){const a=Math.min(1,B.t*4,(1.3-B.t)*4);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font=`700 ${Math.round(24*S)}px "Alegreya SC", Georgia, serif`;ctx.lineWidth=5;ctx.strokeStyle='rgba(40,20,50,.8)';ctx.fillStyle='#ffe27a';ctx.strokeText(B.bannerText,W/2,H*.3);ctx.fillText(B.bannerText,W/2,H*.3);ctx.restore();}
  if(B.phase==='win'&&B.t>.6){const a=Math.min(1,(B.t-.6)*3);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';const y=H*.24;
    ctx.font=`700 ${Math.round(38*S)}px "Alegreya SC", Georgia, serif`;ctx.lineWidth=6;ctx.strokeStyle='rgba(40,20,50,.8)';ctx.fillStyle='#ffe27a';const sc=1+.25*Math.max(0,1-(B.t-.6)*4);ctx.save();ctx.translate(W/2,y);ctx.scale(sc,sc);ctx.strokeText('Victory!',0,0);ctx.fillText('Victory!',0,0);ctx.restore();
    if(B.loot&&B.loot.length){const w=Math.min(W-60,250),x=(W-w)/2,yy=y+26;ctx.fillStyle='rgba(20,10,10,.3)';rr(x+2,yy+4,w,74,14);ctx.fill();ctx.fillStyle='#f6ecd2';rr(x,yy,w,74,14);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#8a6a3a';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.fillText(`THE ${B.foes[0].name.toUpperCase()} DROPPED`,W/2+18,yy+24);const lid=B.loot[0];drawGlow(ctx,x+38,yy+40,26,lid==='boneparts'?'200,170,255':'190,245,205',.6);drawIcon(ctx,lid,x+38,yy+40,34);
      ctx.fillStyle='#4f3c22';ctx.font='700 18px "Alegreya SC", Georgia, serif';ctx.fillText(`${ITEMS[B.loot[0]].name}  ×${B.loot.length}`,W/2+18,yy+48);}
    if(B.t>1.6){ctx.globalAlpha=.6+.4*Math.sin(T*4);ctx.font='italic 14px Alegreya, Georgia, serif';ctx.fillStyle='#fdf6e4';ctx.fillText(tw('tap to continue','click or press Space to continue'),W/2,H*.86);}ctx.restore();}
  if(B.phase==='lose'){const a=Math.min(1,B.t/1.2);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font=`italic ${Math.round(20*S)}px Alegreya, Georgia, serif`;ctx.fillStyle='#fdf6e4';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=8;ctx.fillText('Cosmic is all out of breath…',W/2,H*.3);ctx.restore();}}

/* ---------- battle music: a bouncy little march in D dorian ---------- */
const BPROG=[[38,[62,65,69]],[34,[58,62,65]],[36,[60,64,67]],[33,[61,64,69]]];
const BMEL=[[74,-1,77,-1,76,74,72,-1],[70,-1,74,-1,77,-1,74,-1],[72,-1,76,79,77,76,74,-1],[73,-1,76,-1,81,-1,-1,-1],[74,77,81,-1,79,77,76,-1],[74,-1,70,-1,74,77,-1,-1],[76,-1,72,-1,79,-1,76,-1],[73,76,73,69,-1,-1,-1,-1]];
const BEIGHTH=60/132/2;
function scheduleBattleMusic(){const c=SND.ctx;while(SND.nextNote<c.currentTime+.25){const t=SND.nextNote,s=SND.step,bar=Math.floor(s/8)%8,e=s%8,[root,ch]=BPROG[bar%4];
  if(e%2===0)pluck(t,NOTE(root+(e===2||e===6?12:0)),.16,.35,SND.music,0,.6);
  if(e%2===1)pluck(t,NOTE(ch[(e>>1)%3]),.06,.25,SND.music,(e%4-1.5)*.3,.9);
  if(e===0||e===4)noiseHit(t,.08,'lowpass',180,1,.18,SND.music);if(e===2||e===6)noiseHit(t,.06,'bandpass',1800,1.2,.05,SND.music);if(e%2)noiseHit(t,.03,'highpass',7000,.7,.025,SND.music);
  const m=BMEL[bar][e];if(m>0)bell(t+.004,NOTE(m),.07,.9,SND.music,.1);
  SND.nextNote+=BEIGHTH;SND.step++;}}

/* ---------- battle sounds ---------- */
function sfxEncounter(){if(!SND.ready)return;const t=SND.ctx.currentTime;[74,77,81,86].forEach((n,i)=>bell(t+i*.07,NOTE(n),.07,1,SND.sfx,(i-1.5)*.3));noiseHit(t,.4,'bandpass',2200,.7,.08,SND.sfx,600);}
function sfxNice(){if(!SND.ready)return;const t=SND.ctx.currentTime;[88,93].forEach((n,i)=>bell(t+i*.06,NOTE(n),.08,1.2,SND.sfx,0));}
function sfxGuard(){if(!SND.ready)return;const t=SND.ctx.currentTime;bell(t,NOTE(81),.08,1.4,SND.sfx,0);bell(t+.01,NOTE(88),.05,1.4,SND.sfx,0);noiseHit(t,.1,'highpass',3000,1,.08,SND.sfx);}
function sfxFlee(){if(!SND.ready)return;const t=SND.ctx.currentTime;for(let i=0;i<6;i++)noiseHit(t+i*.07,.06,'bandpass',1500+i*200,1,.08,SND.sfx);}
function sfxVictory(){if(!SND.ready)return;const t=SND.ctx.currentTime;[[74,0],[78,.12],[81,.24],[86,.36],[86,.6],[90,.72]].forEach(([n,d])=>bell(t+d,NOTE(n),.08,1.6,SND.sfx,0));pluck(t,NOTE(50),.2,1.5,SND.sfx,0,.5);pluck(t+.6,NOTE(62),.15,1.5,SND.sfx,0,.5);}

