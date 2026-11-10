/* =====================================================================
   EQUIPMENT & THE SPELLBOOK
   Every hero can wear five things: main hand, off hand, head, chest, boots.
   ===================================================================== */
const SLOTS=[['head','Head'],['chest','Body'],['boots','Boots'],['main','Main Hand'],['off','Off Hand'],['charm','Charm']];
const ITEMS={
  jakaxe:{name:"Simple Axe",slot:'main',stats:{atk:1},desc:"A woodsman's axe, notched and well loved. It has cleared more thorns than any blade should."},
  jakstick:{name:'Walking Stick',slot:'off',desc:"A gnarled branch worn smooth by long roads. Good for leaning on, and for the odd spark when Jak calls on it."},
  jakcoat:{name:"Traveller's Coat",slot:'chest',stats:{def:1},desc:"Heavy, patched and smelling of woodsmoke. Every pocket holds something useful."},
  staff:{name:"Apprentice's Staff",slot:'main',stats:{atk:1},desc:"A crooked willow staff with a crystal tied on with string. It sparkles… sometimes."},
  cloak:{name:'Apprentice Cloak',slot:'chest',stats:{def:1},desc:"Hand-stitched by Master Lum. The sleeves are still much too long."},
  boots:{name:'Old Boots',slot:'boots',stats:{spd:1},desc:"Scuffed, patched and very comfy. Excellent for running away from slugs."},
  bucket:{name:'Wooden Bucket',slot:'head',stats:{def:2},desc:"Smells faintly of well water. Surprisingly sturdy, and it only covers your eyes a little."},
  blade:{name:'Ancient Blade',slot:'main',stats:{atk:50},desc:"A sword older than the garden itself, given by a voice in the dark. Its blade is the color of old blood, and it hums when you hold it."},
  shroud:{name:"Undine's Shroud",slot:'chest',stats:{def:2},desc:"A faded blue shroud, frayed at every edge and very much past its prime. Still, the water spirits' blessing clings to it."},
  shedkey:{name:'Garden Shed Key',kind:'key',desc:"A little brass key with a leaf-shaped bow. The last garden slug was hiding it. Slugs love shiny things."},
  gboots:{name:'Garden Boots',slot:'boots',stats:{spd:2},desc:"Sturdy green boots for squelching through flowerbeds. They smell faintly of mint and rain."},
  boneparts:{name:'Bone Parts',kind:'mat',desc:"Old, brittle and faintly humming with dark magic. They still twitch now and then. Best not to tell Master Lum where these came from."},
  slimering:{name:'Slime Ring',slot:'charm',stats:{def:1},hp:2,desc:"The Slug King's royal ring: a little green slime orb held in a twist of living vine. Still warm. Still a bit squishy. +1 DEF, +2 max HP."},
  slimeparts:{name:'Slime Parts',kind:'mat',desc:"Wobbly, glowing and faintly lavender-scented. Master Lum could brew magic powders and potions from these."},
  potion:{name:'Healing Potion',kind:'use',heal:[5,7],short:'Restores 5\u20137 HP',desc:"One of Lum's own brews: swirling violet and green, with a little starlight in every sip. Restores 5 to 7 HP."},
  lumpouch:{name:"Lum's Powder Pouch",slot:'main',stats:{atk:1},desc:"A sealed leather pouch packed with Lum's handmade powders. Sparkdust for striking, and a few rarer blends for tricky foes."},
  lumrobe:{name:"Starry Shop Cape",slot:'chest',stats:{def:1},desc:"Lum's favorite cape, dusted with embroidered moons and stars. She claims it's just for keeping warm."},
  foxboots:{name:'Vixenstep Boots',slot:'boots',stats:{def:1,spd:2},desc:"Light as a fox's step, dropped by the Elder Vixen in the watching dark. +1 DEF, +2 SPD."},
  foxhood:{name:'Fox Hood',slot:'head',stats:{def:1,mag:2},desc:"A soft little hood with a fox's face, left behind in the Briar Den. Warm, quiet, and it makes every powder feel a touch more alive. +1 DEF, +2 MAG."},
  foxring:{name:'Fox Ring',slot:'charm',stats:{atk:2},desc:"A little gold ring with a sleeping fox curled around it, found behind the roots in Gaia's Hollow. Light fingers come with it. +2 ATK. On a First Strike, a 50% chance to steal an ingredient."},
  crystalpouch:{name:'Foxfire Pouch',slot:'main',stats:{atk:2,mag:1},desc:"A soft fox-fur pouch, found in a cobwebbed chest beneath the old oak. Powders thrown from it sting a little more. +2 ATK, +1 MAG."},
  vanecharm:{name:"Cross Necklace",slot:'charm',stats:{def:1,mag:1},desc:"Worn wooden beads and a little carved cross, polished smooth by years of thumbs. Someone must be missing it. +1 DEF, +1 MAG."},
  lantern:{name:"Gravekeeper's Lantern",kind:'key',desc:"Vane's old lantern. It has never once gone out. It will light the dark paths ahead."},
  duskberry:{name:'Duskberries',kind:'mat',desc:"Dark, sweet berries from Lum's garden. With a little heat they become a Healing Potion."},
  dewberry:{name:'Dewberries',kind:'mat',desc:"Blue berries that stay cold with morning dew, even at noon. Their chill goes into Frostbloom Powder."},
  emberberry:{name:'Emberberries',kind:'mat',desc:"Warm to the touch and sharp on the tongue. Their bite goes into Thornbane Powder."},
  moonleaf:{name:'Moonmint Leaves',kind:'mat',desc:"Cool, calming leaves from the moonmint beds. The heart of Moonmint Powder."},
  thornsprig:{name:'Thorn Sprigs',kind:'mat',desc:"Prickly twigs shed by a Bramble Wisp. Lum could grind these into a powder that saps an enemy's strength."},
  mooncharm:{name:"Lum's Moon Charm",slot:'charm',stats:{atk:1,def:1},hp:2,desc:"A crescent moon on a silver chain, earned for a legendary Prologue. +1 ATK, +1 DEF, +2 max HP."},
  moonmint:{name:'Silver Moonmint Sprig',slot:'charm',stats:{def:1},hp:2,desc:"A sprig of moonmint pressed into a moonstone ring. +1 DEF, +2 max HP."},
  duskflower:{name:'Pressed Duskberry Blossom',slot:'charm',stats:{def:1},desc:"A tiny duskberry blossom set in a heart-shaped charm. +1 DEF."},
  spark:{name:'Spark Powder',kind:'use',dmg:3,short:'Throw for 3 damage',desc:"A pinch of crackling stardust. Thrown in battle, it bursts for 3 damage (more with Magic)."}};
const STAT_NAME={atk:'Attack',def:'Defense',mag:'Magic',spd:'Speed'};
const PARTY={jak:{main:'jakaxe',off:'jakstick',head:null,chest:'jakcoat',boots:null,charm:null},cosmic:{main:'staff',off:null,head:null,chest:'cloak',boots:'boots',charm:null},
             lum:{main:'lumpouch',off:null,head:null,chest:'lumrobe',boots:null,charm:null}};
const BAG=[];let bucketTaken=false,gotEquip=false;
const MENU={open:false,a:0,sel:null,hits:[],S:1,ox:0,oy:0,note:'',noteT:0,newItems:0};
const TUT={stage:0,t:0};        // 1: open the book  2: tap the item  3: tap Equip  4: close the book
const TOAST={t:99,name:''};
// where Cosmic's head is in each atlas frame: [centre x, top of hair, head width]
const CHEAD_NEW=[[119,67,51],[120,67,53],[121,68,52],[119,66,53],[120,63,50],[118,63,50],[119,62,54],[120,62,54],[118,64,51],[120,63,54],[118,62,53],[119,61,53],[120,61,57],[120,61,59],[121,61,56],[120,62,57],[120,62,59],[121,61,56],[120,66,52],[119,66,52],[120,66,52],[119,66,52],[120,68,52],[120,67,52],[120,68,52],[120,69,52],[120,63,52],[120,62,52],[119,62,52],[120,62,52],[119,62,52],[120,60,52],[120,60,52],[119,60,52],[120,62,52],[119,62,52],[119,60,52],[120,56,52],[120,59,52],[119,58,52],[120,60,52],[119,59,52],[119,59,52],[120,59,52],[120,59,52]];
const HEADS=[[117,66],[120,64],[118,66],[118,64],[121,65],[119,64],[118,67],[119,65],[116,57],[115,55],[119,52],[118,57],[115,56],[118,56],[116,56],[115,58],[118,59],[122,59],[121,60],[113,61],[121,61],[122,67],[119,68],[120,68],[121,69],[119,67],[119,64],[119,64],[119,63],[119,63],[119,65],[119,64],[118,63],[119,62],[121,62],[120,62],[121,62],[120,63],[120,63],[121,62],[119,66],[120,66],[120,66],[119,65],[120,68],[119,67],[120,68],[120,69],[119,63],[119,62],[119,62],[119,62],[119,62],[120,60],[119,60],[119,60],[119,62],[120,61],[119,60],[120,56],[120,59],[119,59],[119,59],[119,59],[119,59],[119,59],[120,59]];
const CHEAD=[[117,66,54],[120,65,53],[118,66,53],[118,65,54],[120,65,54],[119,65,54],[118,67,54],[118,65,55],[116,57,50],[115,55,51],[118,52,51],[118,57,51],[115,56,49],[118,57,51],[116,56,50],[114,58,52],[117,59,55],[122,59,56],[120,60,55],[113,61,54],[121,62,56],[123,68,54]];

function statLine(who){return heroStats(who);}
function giveItem(id){BAG.push(id);if(typeof SAVEC!=='undefined')SAVEC.t=99;if(HIDDEN.some(([k])=>k===id))STATS.found[id]=1;TOAST.t=0;TOAST.name=ITEMS[id].name;TOAST.id=id;MENU.newItems++;sfxItem();}
function equip(who,id){if((SCENE==='shop'||SCENE==='bed')&&id==='blade'){MENU.note="Cosmic: Not in here! I don't want Master Lum to find out about the sword…";MENU.noteT=3;return;}const it=ITEMS[id],cur=PARTY[who][it.slot];const i=BAG.indexOf(id);if(i<0)return;BAG.splice(i,1);if(cur)BAG.splice(i,0,cur);PARTY[who][it.slot]=id;syncMaxHp(who);sfxEquip();
  MENU.sel={kind:'slot',slot:it.slot};if(TUT.stage===3&&id==='bucket'){TUT.stage=4;TUT.t=0;}}
function satchelSlots(){return new Set(BAG.filter(b=>ITEMS[b]&&ITEMS[b].kind!=='mat')).size;}
function unequip(who,slot){const id=PARTY[who][slot];if(!id)return;if(satchelSlots()>=8&&!BAG.includes(id)){MENU.note='Your satchel is full!';MENU.noteT=2;return;}PARTY[who][slot]=null;syncMaxHp(who);BAG.push(id);MENU.sel={kind:'bag',i:BAG.length-1};sfxPage(.5);}
function openMenu(){if(MENU.open||DLG.active||FADE.dir||INTRO.on||INTRO.waiting||busy())return;MENU.open=true;MENU.sel=null;MENU.newItems=0;MENU.who=HERO;MENU.tab="bag";MENU.pick=null;sfxBook(true);lum.vx=lum.vy=0;stick.id=null;
  if(TUT.stage===1){TUT.stage=2;TUT.t=0;}MENU.page=TUT.stage>=2?'bag':'char';}
function closeMenu(){if(!MENU.open)return;MENU.open=false;SAVEC.t=99;sfxBook(false);
  if(TUT.stage===4){TUT.stage=0;setTimeout(()=>say("How do I look? Very heroic, I bet. …Is it on backwards?"),450);}
  else if(TUT.stage>=2&&!PARTY[HERO].head){TUT.stage=1;TUT.t=0;}}

/* the bucket, the right way up (for icons) or upside down (for wearing) */
function bucketShape(c,rw,cw,h,lip){c.beginPath();c.moveTo(-rw,0);c.lineTo(-cw,-h);c.quadraticCurveTo(0,-h-lip,cw,-h);c.lineTo(rw,0);c.quadraticCurveTo(0,lip*1.6,-rw,0);c.closePath();}
const CHEMS={33:243,34:245,35:244,22:243,23:242,24:239,25:239,26:242,27:241,28:236,29:235,30:235,31:238,32:242};
/* Cosmic's legs for the up/down walks: two little boots that take turns stepping, tucked under his cloak */
function drawSideLegs(c,fr,ph,moving){const hem=CHEMS[fr]||244,ground=262;
  const legs=[-1,1].map(sd=>{const p=ph+(sd>0?Math.PI:0);return {sd,x:116-(moving?Math.sin(p)*13:0),lift:moving?Math.max(0,Math.cos(p))*7:0,near:sd>0};});
  legs.sort((a,b)=>a.near-b.near);
  for(const L of legs){const by=ground-L.lift-5,hx=116+(L.near?3:-3),top=hem-8,shade=L.near?1:.78;
    c.fillStyle=L.near?'#4a5c7e':'#3b4a68';c.strokeStyle='#232c45';c.lineWidth=2;c.beginPath();c.moveTo(hx-7,top);c.lineTo(hx+7,top);c.lineTo(L.x+6,by-3);c.lineTo(L.x-6,by-3);c.closePath();c.fill();c.stroke();
    const g=c.createLinearGradient(0,by-6,0,by+5);g.addColorStop(0,L.near?'#5e3f27':'#4a311e');g.addColorStop(1,'#3a2414');c.fillStyle=g;c.strokeStyle='#2b1a0d';
    c.beginPath();c.moveTo(L.x+6,by-6);c.lineTo(L.x+7,by+3);c.lineTo(L.x-13,by+3);c.quadraticCurveTo(L.x-14,by-3,L.x-6,by-5);c.closePath();c.fill();c.stroke();
    c.fillStyle='#2b1a0d';c.fillRect(L.x-13,by+3,20,2);}}
function drawWalkLegs(c,fr,ph,moving,back){if(fr>=33){drawSideLegs(c,fr,ph,moving);return;}const hem=CHEMS[fr]||238,ground=262;
  const feet=[-1,1].map(sd=>{const p=ph+(sd>0?Math.PI:0),lift=moving?Math.max(0,Math.sin(p))*8:0,fwd=moving?Math.cos(p)*4:0;return {sd,x:120+sd*12+(moving?Math.sin(p)*1.2:0),y:ground-lift+(back?-fwd:fwd)*.7,lift};});
  feet.sort((a,b)=>a.y-b.y);   // the foot further back is drawn first
  for(const f of feet){const top=hem-6,by=f.y-5;
    c.fillStyle='#4a5c7e';c.strokeStyle='#232c45';c.lineWidth=2;c.beginPath();c.moveTo(f.x-7,top);c.lineTo(f.x+7,top);c.quadraticCurveTo(f.x+8,(top+by)/2,f.x+6,by-2);c.lineTo(f.x-6,by-2);c.quadraticCurveTo(f.x-8,(top+by)/2,f.x-7,top);c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.12)';c.fillRect(f.x-4,top+2,3,Math.max(0,by-top-6));
    const g=c.createLinearGradient(0,by-6,0,by+5);g.addColorStop(0,'#5e3f27');g.addColorStop(1,'#3a2414');c.fillStyle=g;c.strokeStyle='#2b1a0d';c.lineWidth=2;
    c.beginPath();c.ellipse(f.x,by,back?8:9,back?6:6.5,0,0,TAU);c.fill();c.stroke();
    if(!back){c.fillStyle='rgba(255,230,190,.16)';c.beginPath();c.ellipse(f.x-2,by-2,3,1.6,0,0,TAU);c.fill();}
    c.fillStyle='#2b1a0d';c.fillRect(f.x-7,by+3.5,14,2);}}
function drawBucketHat(c,fr){const im=IMG.bucket_worn;if(!ready(im))return;const hd=HEADS[fr]||HEADS[16],cx=hd[0],top=hd[1],hw=52;
  // the very bucket from the well, turned upside down
  const w=hw*1.45,h=w*im.naturalHeight/im.naturalWidth,rimY=top+41;
  c.save();c.translate(cx,rimY);c.rotate(-.08);
  c.drawImage(im,-w/2,-h+3,w,h);
  c.restore();}
/* little painted icons for the book */
const IMGICON={jakcoat:'icon_cloak_grey',jakaxe:'icon_axe_bearded',jakstick:'icon_stick',foxboots:'icon4_boots_fur',vanecharm:'icon2_cross_wood',shedkey:'icon2_key_gold',crystalpouch:'icon5_pouch_foxfur',foxring:'icon5_ring_fox',foxhood:'icon5_hood_fox',lantern:'tool_lantern',duskberry:'ing_duskberry',dewberry:'ing_dewberry',emberberry:'ing_emberberry',moonleaf:'ing_leavesB5',slimeparts:'ing_slime',boneparts:'ing_bones',thornsprig:'ing_twig',potion:'icon_potion',lumpouch:'icon_pouch_seal',lumrobe:'icon_cape_stars',mooncharm:'acc_moon_necklace',moonmint:'acc_moonstone_ring',duskflower:'acc_heart_ring'};
function drawIcon(c,id,x,y,s,ghost){c.save();c.translate(x,y);const G=ghost?'rgba(110,84,52,.22)':null;c.lineJoin='round';c.lineCap='round';
  if(!G&&IMGICON[id]&&ready(IMG[IMGICON[id]])){const im=IMG[IMGICON[id]],h=s*1.15,w=h*im.naturalWidth/im.naturalHeight,sc=Math.min(1,s*1.15/w);c.drawImage(im,-w*sc/2,-h*sc/2,w*sc,h*sc);c.restore();return;}
  if(id==='lantern'){c.strokeStyle='#3a2a18';c.lineWidth=s*.05;c.fillStyle=G||'#5a4428';c.beginPath();c.arc(0,-s*.38,s*.09,Math.PI,0);c.stroke();c.fillRect(-s*.2,-s*.32,s*.4,s*.08);c.fillRect(-s*.18,s*.3,s*.36,s*.08);
    if(!G){drawGlow(c,0,0,s*.45,'255,200,120',.5+.15*Math.sin(T*6));c.fillStyle='rgba(255,215,140,.9)';}c.beginPath();c.moveTo(-s*.16,-s*.24);c.lineTo(s*.16,-s*.24);c.lineTo(s*.14,s*.3);c.lineTo(-s*.14,s*.3);c.closePath();c.fill();c.stroke();c.restore();return;}
  if(id==='thornsprig'){c.strokeStyle=G||'#6a4a28';c.lineWidth=s*.06;for(const [a,l] of [[-.5,.45],[.3,.5],[1.1,.4]]){c.save();c.rotate(a);c.beginPath();c.moveTo(0,s*.3);c.lineTo(0,-s*l);c.stroke();for(let k=0;k<3;k++){c.beginPath();c.moveTo(0,-s*l*(k+1)/4);c.lineTo(s*.08,-s*l*(k+1)/4-s*.06);c.stroke();}c.restore();}c.restore();return;}
  if(id==='bucket'){const im=IMG.bucket_hat;if(ready(im)){const w=s*1.05,h=w*im.naturalHeight/im.naturalWidth;if(G){c.globalAlpha=.25;c.filter='grayscale(1) brightness(.8)';}c.drawImage(im,-w/2,-h/2,w,h);c.filter='none';c.globalAlpha=1;}}
  else if(id==='staff'&&!G&&ready(IMG.icon_staff_crystal)){const im=IMG.icon_staff_crystal,h=s*1.5,w=h*im.naturalWidth/im.naturalHeight;drawGlow(c,w*.24,-h*.32,s*.32,'190,150,255',.35+.12*Math.sin(T*2.2));c.drawImage(im,-w/2,-h/2,w,h);}
  else if(id==='staff'){c.rotate(.6);c.strokeStyle=G||'#6d4826';c.lineWidth=s*.11;c.beginPath();c.moveTo(0,s*.62);c.quadraticCurveTo(s*.06,0,-s*.02,-s*.42);c.stroke();
    c.lineWidth=s*.06;c.beginPath();c.moveTo(-s*.02,-s*.4);c.quadraticCurveTo(-s*.2,-s*.5,-s*.1,-s*.62);c.moveTo(-s*.02,-s*.4);c.quadraticCurveTo(s*.16,-s*.52,s*.08,-s*.64);c.stroke();
    if(!G){drawGlow(c,0,-s*.58,s*.45,'170,225,255',.55+.2*Math.sin(T*3));c.fillStyle='#e8f8ff';c.strokeStyle='#5d86b5';c.lineWidth=s*.03;c.beginPath();c.moveTo(0,-s*.78);c.lineTo(s*.09,-s*.6);c.lineTo(0,-s*.46);c.lineTo(-s*.09,-s*.6);c.closePath();c.fill();c.stroke();}}
  else if((id==='cloak'||id==='shroud')&&!G&&ready(IMG[id==='cloak'?'icon_cloak_apprentice':'icon_cloak_undine'])){const im=IMG[id==='cloak'?'icon_cloak_apprentice':'icon_cloak_undine'],h=s*1.32,w=h*im.naturalWidth/im.naturalHeight;if(id==='shroud')drawGlow(c,0,0,s*.6,'140,220,255',.25+.1*Math.sin(T*2));c.drawImage(im,-w/2,-h/2,w,h);}
  else if(id==='cloak'||id==='shroud'){c.beginPath();c.moveTo(-s*.16,-s*.42);c.quadraticCurveTo(0,-s*.66,s*.16,-s*.42);c.lineTo(s*.5,s*.52);c.quadraticCurveTo(0,s*.62,-s*.5,s*.52);c.closePath();
    if(G){c.fillStyle=G;c.fill();}else{const g=c.createLinearGradient(-s*.5,0,s*.5,0);g.addColorStop(0,'#2e477d');g.addColorStop(.45,'#5a7dc0');g.addColorStop(1,'#2a3f70');c.fillStyle=g;c.fill();c.strokeStyle='#1f2c4f';c.lineWidth=s*.04;c.stroke();
      c.strokeStyle='rgba(20,30,60,.45)';c.lineWidth=s*.03;c.beginPath();c.moveTo(-s*.08,-s*.2);c.lineTo(-s*.22,s*.5);c.moveTo(s*.1,-s*.2);c.lineTo(s*.24,s*.5);c.stroke();
      c.fillStyle='#e2b84e';c.beginPath();c.arc(0,-s*.3,s*.07,0,TAU);c.fill();}}
  else if(id==='boots'&&!G&&ready(IMG.icon_boots_leather)){const im=IMG.icon_boots_leather,h=s*1.12,w=h*im.naturalWidth/im.naturalHeight;c.drawImage(im,-w/2,-h/2,w,h);}
  else if(id==='boots'){for(const [dx,dy,k] of [[-s*.12,-s*.06,.85],[s*.1,s*.06,1]]){c.save();c.translate(dx,dy);c.scale(k,k);c.beginPath();c.moveTo(-s*.18,-s*.48);c.lineTo(s*.1,-s*.48);c.lineTo(s*.12,s*.08);c.quadraticCurveTo(s*.44,s*.1,s*.44,s*.3);c.lineTo(-s*.22,s*.3);c.closePath();
      if(G){c.fillStyle=G;c.fill();}else{const g=c.createLinearGradient(0,-s*.5,0,s*.3);g.addColorStop(0,'#8a5a32');g.addColorStop(1,'#5a361a');c.fillStyle=g;c.fill();c.strokeStyle='#3a220f';c.lineWidth=s*.04;c.stroke();c.fillStyle='#a87a4c';c.fillRect(-s*.2,-s*.48,s*.32,s*.08);c.fillStyle='#3a220f';c.fillRect(-s*.22,s*.24,s*.66,s*.06);}c.restore();}}
  else if(id==='blade'&&!G&&ready(IMG.icon_blade_dark)){const im=IMG.icon_blade_dark,h=s*1.45,w=h*im.naturalWidth/im.naturalHeight;drawGlow(c,0,0,s*.75,'220,30,40',.4+.15*Math.sin(T*3));c.drawImage(im,-w/2,-h/2,w,h);c.save();c.globalCompositeOperation='lighter';drawGlow(c,-w*.12,h*.13,s*.12,'255,60,70',.6+.3*Math.sin(T*3));c.restore();}
  else if(id==='blade'){const eq=!G;c.rotate(-.75);
    if(eq)drawGlow(c,0,-s*.1,s*.75,'220,30,40',.45+.15*Math.sin(T*3));
    const g=c.createLinearGradient(-s*.07,0,s*.07,0);if(G){g.addColorStop(0,G);g.addColorStop(1,G);}else if(eq){g.addColorStop(0,'#5a0a10');g.addColorStop(.5,'#e0303a');g.addColorStop(1,'#7a0d16');}else{g.addColorStop(0,'#6d7076');g.addColorStop(.5,'#c9ccd2');g.addColorStop(1,'#7c7f86');}
    c.fillStyle=g;c.beginPath();c.moveTo(0,-s*.62);c.lineTo(s*.075,-s*.48);c.lineTo(s*.065,s*.18);c.lineTo(-s*.065,s*.18);c.lineTo(-s*.075,-s*.48);c.closePath();c.fill();
    if(!G){c.strokeStyle=eq?'#3a0508':'#3b3d42';c.lineWidth=s*.025;c.stroke();c.strokeStyle=eq?'rgba(255,170,170,.7)':'rgba(255,255,255,.5)';c.beginPath();c.moveTo(0,-s*.55);c.lineTo(0,s*.14);c.stroke();}
    c.fillStyle=G||(eq?'#2a0a0c':'#6b5232');c.fillRect(-s*.24,s*.17,s*.48,s*.07);c.fillStyle=G||'#3e2a18';c.fillRect(-s*.045,s*.24,s*.09,s*.26);
    c.fillStyle=G||(eq?'#ff4a55':'#8fa3b8');c.beginPath();c.arc(0,s*.54,s*.065,0,TAU);c.fill();if(eq)drawGlow(c,0,s*.54,s*.16,'255,60,70',.8);}
  else if(id==='shedkey'){c.rotate(-.6);c.strokeStyle=G||'#b8892e';c.fillStyle=G||'#d9ad4a';c.lineWidth=s*.08;
    c.beginPath();c.ellipse(0,-s*.28,s*.18,s*.22,0,0,TAU);c.stroke();if(!G){c.fillStyle='#7fae55';c.beginPath();c.ellipse(0,-s*.28,s*.07,s*.12,0,0,TAU);c.fill();c.fillStyle='#d9ad4a';}
    c.fillRect(-s*.035,-s*.06,s*.07,s*.56);c.fillRect(0,s*.3,s*.14,s*.06);c.fillRect(0,s*.42,s*.1,s*.06);if(!G)drawGlow(c,0,-s*.28,s*.3,'255,220,140',.35);}
  else if(id==='gboots'&&!G&&ready(IMG.icon_boots_rubber_green)){const im=IMG.icon_boots_rubber_green,h=s*1.12,w=h*im.naturalWidth/im.naturalHeight;c.drawImage(im,-w/2,-h/2,w,h);}
  else if(id==='gboots'){for(const [dx,dy,k] of [[-s*.12,-s*.06,.85],[s*.1,s*.06,1]]){c.save();c.translate(dx,dy);c.scale(k,k);c.beginPath();c.moveTo(-s*.18,-s*.48);c.lineTo(s*.1,-s*.48);c.lineTo(s*.12,s*.08);c.quadraticCurveTo(s*.44,s*.1,s*.44,s*.3);c.lineTo(-s*.22,s*.3);c.closePath();
      if(G){c.fillStyle=G;c.fill();}else{const g=c.createLinearGradient(0,-s*.5,0,s*.3);g.addColorStop(0,'#6fae4e');g.addColorStop(1,'#3d6e2c');c.fillStyle=g;c.fill();c.strokeStyle='#22401a';c.lineWidth=s*.04;c.stroke();c.fillStyle='#9fd27a';c.fillRect(-s*.2,-s*.48,s*.32,s*.08);c.fillStyle='#22401a';c.fillRect(-s*.22,s*.24,s*.66,s*.06);}c.restore();}}
  else if(id==='boneparts'){const bone=(rot,len)=>{c.save();c.rotate(rot);c.fillStyle=G||'#ece2c8';c.strokeStyle=G?'transparent':'#5a4a36';c.lineWidth=s*.035;
      c.beginPath();c.rect(-len/2,-s*.055,len,s*.11);c.fill();c.stroke();for(const e of [-1,1]){for(const k of [-1,1]){c.beginPath();c.arc(e*len/2,k*s*.075,s*.085,0,TAU);c.fill();c.stroke();}}
      c.fillRect(-len/2+s*.02,-s*.05,len-s*.04,s*.1);if(!G){c.strokeStyle='rgba(120,100,70,.35)';c.beginPath();c.moveTo(-len/2+s*.08,s*.02);c.lineTo(len/2-s*.08,s*.02);c.stroke();}c.restore();};
    if(!G)drawGlow(c,0,0,s*.55,'190,160,255',.25+.1*Math.sin(T*2.5));bone(-.7,s*.78);bone(.7,s*.78);}
  else if(id==='slimering'&&!G&&ready(IMG.acc_slime_ring)){const im=IMG.acc_slime_ring,h=s*1.05,w=h*im.naturalWidth/im.naturalHeight;drawGlow(c,s*.05,-s*.12,s*.4,'140,230,160',.3+.1*Math.sin(T*2.5));c.drawImage(im,-w/2,-h/2,w,h);}
  else if(id==='charmghost'){c.strokeStyle=G||'#b58a3e';c.lineWidth=s*.05;c.beginPath();c.moveTo(-s*.2,-s*.38);c.quadraticCurveTo(0,-s*.12,s*.2,-s*.38);c.stroke();c.fillStyle=G||'#c9953e';c.beginPath();c.moveTo(0,-s*.14);c.lineTo(s*.2,s*.1);c.lineTo(0,s*.38);c.lineTo(-s*.2,s*.1);c.closePath();c.fill();}
  else if(id==='slimeparts'){if(G){c.fillStyle=G;c.beginPath();c.arc(0,0,s*.4,0,TAU);c.fill();}else{for(const [dx,dy,r_,col] of [[-s*.18,s*.12,.26,'120,200,150'],[s*.16,s*.16,.22,'110,190,170'],[0,-s*.14,.28,'150,225,170']]){const g=c.createRadialGradient(dx-s*.08,dy-s*.1,1,dx,dy,s*r_);g.addColorStop(0,`rgba(230,255,235,.95)`);g.addColorStop(.5,`rgba(${col},.9)`);g.addColorStop(1,`rgba(40,110,90,.9)`);c.fillStyle=g;c.beginPath();c.ellipse(dx,dy,s*r_,s*r_*.85,0,0,TAU);c.fill();c.strokeStyle='rgba(40,100,80,.7)';c.lineWidth=s*.025;c.stroke();c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.arc(dx-s*r_*.35,dy-s*r_*.35,s*.04,0,TAU);c.fill();}
    c.fillStyle='rgba(170,120,220,.8)';c.beginPath();c.ellipse(s*.02,-s*.12,s*.07,s*.03,.5,0,TAU);c.fill();}}
  else if(id==='potion'){c.fillStyle=G||'rgba(235,110,150,.9)';c.beginPath();c.arc(0,s*.12,s*.36,0,TAU);c.fill();if(!G){c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.arc(-s*.12,0,s*.08,0,TAU);c.fill();c.fillStyle='#e8eef4';c.fillRect(-s*.1,-s*.46,s*.2,s*.26);c.fillStyle='#8a5a32';c.fillRect(-s*.13,-s*.56,s*.26,s*.12);}}
  else if(id==='spark'){c.fillStyle=G||'#b78a5a';c.beginPath();c.moveTo(-s*.32,s*.4);c.quadraticCurveTo(-s*.42,-s*.1,-s*.12,-s*.22);c.lineTo(s*.12,-s*.22);c.quadraticCurveTo(s*.42,-s*.1,s*.32,s*.4);c.closePath();c.fill();if(!G){c.strokeStyle='#e2c068';c.lineWidth=s*.05;c.beginPath();c.moveTo(-s*.14,-s*.2);c.lineTo(s*.14,-s*.2);c.stroke();for(let k=0;k<4;k++)drawGlow(c,Math.sin(T*3+k*2)*s*.25,-s*.35-k*s*.08,s*.12,'255,230,140',.8);}}
  else if(id==='shield'){c.beginPath();c.moveTo(0,-s*.5);c.quadraticCurveTo(s*.32,-s*.38,s*.42,-s*.42);c.quadraticCurveTo(s*.44,s*.2,0,s*.55);c.quadraticCurveTo(-s*.44,s*.2,-s*.42,-s*.42);c.quadraticCurveTo(-s*.32,-s*.38,0,-s*.5);c.fillStyle=G||'#8a7a6a';c.fill();}
  else if(id==='hat'){c.beginPath();c.moveTo(-s*.5,s*.3);c.quadraticCurveTo(0,s*.12,s*.5,s*.3);c.quadraticCurveTo(s*.2,s*.12,s*.12,-s*.1);c.lineTo(-s*.1,-s*.6);c.lineTo(-s*.18,-s*.05);c.quadraticCurveTo(-s*.24,s*.14,-s*.5,s*.3);c.fillStyle=G||'#6a5a8a';c.fill();}
  c.restore();}
const SLOT_GHOST={head:'hat',chest:'cloak',boots:'boots',main:'staff',off:'shield',charm:'charmghost'};

/* ---------- HUD: the spellbook button and the "you found something" toast ---------- */
const BOOKBTN={x:30,y:30,r:19};
function drawBookBtn(){if(INTRO.on||INTRO.waiting||!PLAYER())return;const {x,y,r}=BOOKBTN;const tut=TUT.stage===1&&!MENU.open;
  ctx.save();ctx.globalAlpha=UI_FADE;
  if(tut){drawGlow(ctx,x,y,46+Math.sin(T*5)*6,'255,220,140',.55);}
  ctx.fillStyle='rgba(30,44,30,.35)';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.translate(x,y);ctx.rotate(-.12);
  ctx.fillStyle='#f3e6c4';ctx.fillRect(-9,-11,19,22);
  ctx.fillStyle='#6b3a5a';rr(-11,-12,19,24,3);ctx.fill();ctx.strokeStyle='#e6c068';ctx.lineWidth=1.2;rr(-9,-10,15,20,2);ctx.stroke();
  ctx.fillStyle='#f2d58a';ctx.beginPath();for(let k=0;k<10;k++){const a=k/10*TAU-Math.PI/2,rr_=k%2?2:5;ctx.lineTo(-1.5+Math.cos(a)*rr_,Math.sin(a)*rr_);}ctx.closePath();ctx.fill();
  ctx.fillStyle='#c8a050';ctx.fillRect(7,-3,4,6);
  ctx.restore();
  {const H_=HEROES[HERO];if(SCENE!=='garden'||H_.hp<H_.maxHp){ctx.save();ctx.globalAlpha=UI_FADE*.9;ctx.fillStyle='rgba(30,44,30,.35)';rr(x+24,y-12,78,24,12);ctx.fill();const hx=x+36,hy=y+1;ctx.fillStyle='#ff8a84';ctx.beginPath();ctx.moveTo(hx,hy+5);ctx.bezierCurveTo(hx-10,hy-2,hx-5,hy-8,hx,hy-3);ctx.bezierCurveTo(hx+5,hy-8,hx+10,hy-2,hx,hy+5);ctx.fill();ctx.fillStyle='#fdf8ec';ctx.font='700 12px "Alegreya SC", Georgia, serif';ctx.textAlign='left';ctx.fillText(`${H_.hp}/${H_.maxHp}`,hx+12,y+5);ctx.restore();}}
  if(MENU.newItems>0){ctx.save();ctx.globalAlpha=UI_FADE;drawGlow(ctx,x+14,y-13,12,'255,230,150',.6+.3*Math.sin(T*4));ctx.fillStyle='#ffe7a0';ctx.beginPath();ctx.arc(x+14,y-13,4,0,TAU);ctx.fill();ctx.restore();}
  if(tut&&!DLG.active){const by=y+r+18+Math.abs(Math.sin(T*4))*8;ctx.save();ctx.fillStyle='#fdf0c8';ctx.strokeStyle='rgba(60,40,20,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,by-10);ctx.lineTo(x+9,by+4);ctx.lineTo(x+3,by+4);ctx.lineTo(x+3,by+14);ctx.lineTo(x-3,by+14);ctx.lineTo(x-3,by+4);ctx.lineTo(x-9,by+4);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
    const txt=tw('New equipment! Tap the spellbook to wear it','New equipment! Click the spellbook (or press I) to wear it'),a=Math.min(1,TUT.t*2);ctx.save();ctx.globalAlpha=a;ctx.font='500 15px Alegreya, Georgia, serif';ctx.textAlign='center';const w=ctx.measureText(txt).width+32,yy=H*.62;ctx.fillStyle='rgba(30,38,30,.55)';rr(W/2-w/2,yy-18,w,34,17);ctx.fill();ctx.fillStyle='#fdf8ec';ctx.fillText(txt,W/2,yy+5);
    ctx.font='italic 12px Alegreya, Georgia, serif';ctx.fillStyle='rgba(253,248,236,.7)';ctx.fillText('(or press I on a keyboard)',W/2,yy+32);ctx.restore();}}
function drawToast(){if(TOAST.t>3.6)return;const a=Math.min(1,TOAST.t*3,(3.6-TOAST.t)*2),y=H*.2-(1-Math.min(1,TOAST.t*3))*12;ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';
  const w=Math.min(W-40,250);ctx.fillStyle='rgba(60,40,20,.25)';rr(W/2-w/2+2,y-30,w,62,14);ctx.fill();ctx.fillStyle='#f6ecd2';rr(W/2-w/2,y-32,w,62,14);ctx.fill();ctx.strokeStyle='#c49a4e';ctx.lineWidth=1.5;ctx.stroke();
  drawGlow(ctx,W/2-w/2+32,y-1,26,'255,225,150',.5);drawIcon(ctx,TOAST.id||'bucket',W/2-w/2+32,y-1,34);
  ctx.fillStyle='#8a6a3a';ctx.font='700 10px "Alegreya SC", Georgia, serif';ctx.fillText('ADDED TO YOUR SATCHEL',W/2+20,y-11);ctx.fillStyle='#4f3c22';ctx.font='700 18px "Alegreya SC", Georgia, serif';ctx.fillText(TOAST.name,W/2+20,y+11);ctx.restore();}

