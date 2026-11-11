/* ---------- the spellbook itself ----------
   Party portraits along the top, then either a two-page spread (wide screens)
   or a single page that flips between Character and Satchel (phones).
   Everything is drawn in "book space" and scaled to fit the screen. */
const HCOL={lum:'#7a4f9a',jak:'#7a5a32',cosmic:'#4a6fb5',spar:'#9a2f2f'};
const HSUB={lum:"Keeper of the magic shop  ·  powder-maker",jak:"Lost traveller  ·  axeman",spar:"Young swordsman  ·  fire blade",cosmic:"Lum's apprentice  ·  aspiring wizard"};
const HCOMBO={lum:'Starfall',jak:'Staff Bolt',spar:'Blazing Edge'};
const FACEIMG={lum:'face_lum',jak:'face_jak',cosmic:'face_cosmic',spar:'face_spar'};
const STATIMG={atk:'stat_atk',def:'stat_def',mag:'stat_mag',spd:'stat_spd'};
const BK={spread:false,W:380,H:590,top:108,bot:104,r:30};
function menuLayout(){const sp=W>H*1.15&&W>=640;BK.spread=sp;if(sp)Object.assign(BK,{W:780,H:500,top:118,bot:46,r:35});else Object.assign(BK,{W:380,H:590,top:108,bot:104,r:30});BK.task=GOAL&&GOAL.text?52:0;BK.top+=BK.task;}
function wrapText(c,text,maxW){const words=text.split(' '),out=[];let cur='';for(const w_ of words){const t=cur?cur+' '+w_:w_;if(c.measureText(t).width>maxW&&cur){out.push(cur);cur=w_;}else cur=t;}out.push(cur);return out;}
function hit(x,y,w,h,act){MENU.hits.push({x,y,w,h,act});}
function tutRing(c,x,y,r){const p=.5+.5*Math.sin(T*6);c.save();c.strokeStyle=`rgba(232,170,60,${(.6+.4*p).toFixed(3)})`;c.lineWidth=3;c.beginPath();c.arc(x,y,r+4+p*3,0,TAU);c.stroke();c.restore();}
function tutBox(c,x,y,w,h,r){const p=.5+.5*Math.sin(T*6);c.save();c.strokeStyle=`rgba(232,170,60,${(.6+.4*p).toFixed(3)})`;c.lineWidth=3;rr(x-5-p*2,y-5-p*2,w+10+p*4,h+10+p*4,r+4);c.stroke();c.restore();}
function tutArrow(c,x,y,dir){const b=Math.abs(Math.sin(T*4))*7;c.save();c.translate(x,y+dir*b);c.scale(1,dir);c.fillStyle='#e8aa3c';c.strokeStyle='#6b4318';c.lineWidth=1.5;c.beginPath();c.moveTo(0,0);c.lineTo(10,-13);c.lineTo(4,-13);c.lineTo(4,-26);c.lineTo(-4,-26);c.lineTo(-4,-13);c.lineTo(-10,-13);c.closePath();c.fill();c.stroke();c.restore();}
function drawStar5(c,x,y,r,on){c.beginPath();for(let k=0;k<10;k++){const a=k/10*TAU-Math.PI/2,q=k%2?r*.45:r;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();if(on){c.fillStyle='#e0b24a';c.fill();c.strokeStyle='#a87a22';}else c.strokeStyle='#c4ad7e';c.lineWidth=1.5;c.stroke();}
function hpCol(f){return f>.5?'#6a9a4a':f>.25?'#d9a03a':'#c8642e';}
function drawParch(c,x,y,w,h,rad){const g=c.createRadialGradient(x+w/2,y+h*.45,40,x+w/2,y+h/2,Math.max(w,h)*.68);g.addColorStop(0,'#fbf3dd');g.addColorStop(.75,'#f3e5c2');g.addColorStop(1,'#e2cc9c');c.fillStyle=g;rr(x,y,w,h,rad);c.fill();
  c.fillStyle='rgba(160,120,60,.05)';for(let i=0;i<6;i++){c.beginPath();c.ellipse(x+hash(i,1,77+x|0)*w,y+hash(i,2,77)*h,20+hash(i,3,77)*40,14+hash(i,4,77)*24,hash(i,5,77)*3,0,TAU);c.fill();}}
/* use a potion (or anything that heals) on one party member */
function useOn(who){const P=MENU.pick;if(!P)return;const it=ITEMS[P.id],H_=HEROES[who],i=BAG.indexOf(P.id);if(i<0||!it){MENU.pick=null;MENU.sel=null;return;}
  if(H_.hp>=H_.maxHp){MENU.note=H_.name+' is already feeling great!';MENU.noteT=2;return;}
  const amt=healRoll(it);H_.hp=Math.min(H_.maxHp,H_.hp+amt);BAG.splice(i,1);STATS.items++;sfxItem();MENU.note=`${H_.name} healed ${amt} HP!`;MENU.noteT=1.8;MENU.pick=null;MENU.sel=null;}
/* round portraits for everyone in the party; the open page's hero glows */
/* the current task, like the in-game TASK banner, above the party */
function drawMenuTask(c){if(!BK.task)return;const w=Math.min(BK.W-20,360),x=BK.W/2-w/2,y=-BK.top+4,h=44;c.save();c.fillStyle='rgba(24,26,22,.82)';rr(x,y,w,h,12);c.fill();c.textAlign='center';c.textBaseline='alphabetic';
  c.fillStyle='#e2c27a';c.font='700 11px "Alegreya SC", Georgia, serif';c.fillText('TASK',BK.W/2,y+16);c.fillStyle='#f4ecdc';c.font='15px Alegreya, Georgia, serif';let t=GOAL.text;while(c.measureText(t).width>w-24&&t.length>4)t=t.slice(0,-2);if(t!==GOAL.text)t=t.trimEnd()+'…';c.fillText(t,BK.W/2,y+35);c.restore();}
function drawParty(c,members,MH){drawMenuTask(c);const r=BK.r,cy=-BK.top+BK.task+10+r,gap=r*.8+12,tot=members.length*r*2+(members.length-1)*gap;let x=BK.W/2-tot/2+r;const pick=!!MENU.pick;
  for(const id of members){const H_=HEROES[id],on=id===MH,col=HCOL[id]||'#666';
    if(pick)drawGlow(c,x,cy,r*1.9,'255,215,120',.4+.2*Math.sin(T*5));else if(on)drawGlow(c,x,cy,r*1.7,'255,215,120',.32);
    c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.arc(x+1,cy+3,r+3,0,TAU);c.fill();
    c.fillStyle='#f3e6c4';c.beginPath();c.arc(x,cy,r,0,TAU);c.fill();
    const im=IMG[FACEIMG[id]];if(ready(im)){c.save();c.beginPath();c.arc(x,cy,r-1,0,TAU);c.clip();if(!on&&!pick)c.globalAlpha=.85;c.drawImage(im,x-r,cy-r,r*2,r*2);c.restore();}
    c.lineWidth=4;c.strokeStyle=col;c.beginPath();c.arc(x,cy,r,0,TAU);c.stroke();
    if(on||pick){c.lineWidth=3;c.strokeStyle=pick?`rgba(240,190,80,${(.7+.3*Math.sin(T*5)).toFixed(3)})`:'#e0b24a';c.beginPath();c.arc(x,cy,r+4.5,0,TAU);c.stroke();}
    const bw=r*1.7,by=cy+r+9,f=clamp(H_.hp/H_.maxHp,0,1);c.fillStyle='rgba(30,20,30,.8)';rr(x-bw/2,by,bw,6,3);c.fill();if(f>0){c.fillStyle=hpCol(f);rr(x-bw/2,by,Math.max(6,bw*f),6,3);c.fill();}
    c.fillStyle=on||pick?'#fdf6e3':'rgba(230,215,190,.85)';c.font='700 14px "Alegreya SC", Georgia, serif';c.textAlign='center';c.fillText(pick?`${H_.name}  ${H_.hp}/${H_.maxHp}`:H_.name,x,by+22);
    hit(x-r-8,cy-r-8,r*2+16,r*2+48,()=>{if(MENU.pick){useOn(id);return;}if(!on){MENU.who=id;MENU.sel=null;sfxPage(.4);}});
    x+=r*2+gap;}}
/* the hero standing in a slowly turning magic circle */
function drawDoll(c,MH,fx,fy,k){c.save();c.translate(fx,fy);c.scale(k,k);
  c.save();c.translate(0,-6);c.scale(1,.3);c.strokeStyle='rgba(90,120,190,.35)';c.lineWidth=2;c.beginPath();c.arc(0,0,74,0,TAU);c.stroke();c.lineWidth=1;c.beginPath();c.arc(0,0,62,0,TAU);c.stroke();c.rotate(T*.25);for(let q=0;q<12;q++){c.rotate(TAU/12);c.fillStyle='rgba(90,120,190,.4)';c.fillRect(64,-2,8,4);}c.restore();
  drawGlow(c,0,-90,90,'180,210,255',.18+.05*Math.sin(T*1.6));const b=Math.sin(T*2.2);c.scale(1-.004*b,1+.009*b);
  if(MH==='lum'&&ready(atlas)){const sp=.64,dw=FW*sp,dh=FH*sp;c.drawImage(atlas,37*FW,0,FW,FH,-dw/2,-dh*(274/280),dw,dh);}
  else if(MH==='jak'){c1Frame(c,'jak','idle',0,JAKDX*196,0,196,false,1,0);}
  else if(MH==='spar'){c1Frame(c,'spar','bidle',0,0,0,200,false,1,0);}
  else if(ready(catlas)){const sp=.74,dw=CFW*sp,dh=CFH*sp,fr=bladeFr(16);c.translate(-dw/2,-dh*(264/270));c.drawImage(cosSheet(),fr*CFW,0,CFW,CFH,0,0,dw,dh);c.scale(sp,sp);if(PARTY[MH].head==='bucket')drawBucketHat(c,fr);}
  c.restore();}
function drawSlot(c,MH,k,label,x,y,s){const id=PARTY[MH][k],sel=MENU.sel&&MENU.sel.kind==='slot'&&MENU.sel.slot===k;
  if(sel)drawGlow(c,x+s/2,y+s/2,s*.85,'255,215,120',.45);
  c.fillStyle=id?'#f3e6c4':'rgba(243,230,196,.4)';rr(x,y,s,s,12);c.fill();
  if(id){c.strokeStyle='#c49a4e';c.lineWidth=2;}else{c.strokeStyle='#d6c39a';c.lineWidth=2;c.setLineDash([5,4]);}rr(x,y,s,s,12);c.stroke();c.setLineDash([]);
  if(sel){c.strokeStyle='#e0a83a';c.lineWidth=3;rr(x-2,y-2,s+4,s+4,13);c.stroke();}
  c.save();if(!id)c.globalAlpha=.7;drawIcon(c,id||SLOT_GHOST[k],x+s/2,y+s*.42,s*.56,!id);c.restore();
  c.fillStyle=id?'#5a3d22':'#9a8060';c.font=`700 ${Math.round(s*.16)}px "Alegreya SC", Georgia, serif`;c.textAlign='center';c.fillText(label,x+s/2,y+s-7);
  hit(x,y,s,s,()=>{MENU.sel={kind:'slot',slot:k};MENU.pick=null;sfxPage(.35);});}
function previewDelta(MH){if(!MENU.sel||MENU.sel.kind!=='bag')return null;const id=BAG[MENU.sel.i],it=ITEMS[id];if(!it||!it.slot)return null;const cur=PARTY[MH][it.slot],cs=(cur&&ITEMS[cur]&&ITEMS[cur].stats)||{},ns=it.stats||{},d={};let any=0;for(const k of ['atk','def','mag','spd']){const v=(ns[k]||0)-(cs[k]||0);if(v){d[k]=v;any=1;}}return any?d:null;}
function drawCharPage(c,x,y,w,h,MH,prev){const col=HCOL[MH]||'#5a3d22',H_=HEROES[MH],st=statLine(MH);
  c.textAlign='left';c.fillStyle=col;c.font='700 30px "Alegreya SC", Georgia, serif';c.fillText(H_.name,x+18,y+42);
  c.font='italic 13.5px Alegreya, Georgia, serif';c.fillStyle='#7a5a3a';c.fillText(HSUB[MH]||'',x+18,y+62);
  const s=Math.min(BK.spread?70:80,Math.floor((h*.5-24)/3)),g=12,top=y+78,colH=s*3+g*2;
  [['main','Main'],['off','Off-hand'],['charm','Charm']].forEach(([k,l],i)=>drawSlot(c,MH,k,l,x+16,top+i*(s+g),s));
  [['head','Head'],['chest','Body'],['boots','Boots']].forEach(([k,l],i)=>drawSlot(c,MH,k,l,x+w-16-s,top+i*(s+g),s));
  const ax=x+16+s+12,aw=w-2*(16+s+12),ar=Math.min(aw/2,colH*.45);c.fillStyle='rgba(226,206,160,.5)';c.beginPath();c.moveTo(ax,top+colH);c.lineTo(ax,top+ar);c.quadraticCurveTo(ax,top,ax+aw/2,top);c.quadraticCurveTo(ax+aw,top,ax+aw,top+ar);c.lineTo(ax+aw,top+colH);c.closePath();c.fill();
  drawDoll(c,MH,ax+aw/2,top+colH-8,Math.min((colH-16)/205,aw/140));
  let yy=top+colH+28;
  c.font='700 15px "Alegreya SC", Georgia, serif';c.fillStyle='#4a3420';c.textAlign='left';c.fillText('Health',x+18,yy);c.textAlign='right';c.fillText(`${H_.hp} / ${H_.maxHp}`,x+w-18,yy);
  yy+=8;const f=clamp(H_.hp/H_.maxHp,0,1);c.fillStyle='#e6d6b0';rr(x+18,yy,w-36,10,5);c.fill();if(f>0){c.fillStyle=hpCol(f);rr(x+18,yy,Math.max(10,(w-36)*f),10,5);c.fill();}
  yy+=24;const tw_=(w-36-18)/4,th=56;
  ['atk','def','mag','spd'].forEach((k,i)=>{const tx=x+18+i*(tw_+6),d=prev&&prev[k];c.fillStyle='#f3e6c4';rr(tx,yy,tw_,th,10);c.fill();if(d){c.strokeStyle=d>0?'#6a9a4a':'#c0604a';c.lineWidth=2;rr(tx,yy,tw_,th,10);c.stroke();}
    const im=IMG[STATIMG[k]],is=Math.min(36,tw_*.48);if(ready(im))c.drawImage(im,tx+5,yy+(th-is)/2,is,is);
    c.textAlign='right';c.fillStyle='#3b2a1c';c.font='700 24px "Alegreya SC", Georgia, serif';c.fillText(st[k]+(d||0),tx+tw_-8,yy+(d?28:36));
    if(d){c.font='700 13px "Alegreya SC", Georgia, serif';c.fillStyle=d>0?'#3f7a2e':'#a8402e';c.fillText((d>0?'+':'')+d,tx+tw_-8,yy+46);}});
  yy+=th+30;if(CH>0&&HCOMBO[MH]){c.textAlign='left';c.font='700 15px "Alegreya SC", Georgia, serif';c.fillStyle='#4a3420';c.fillText('Combo · '+HCOMBO[MH],x+18,yy);const n=comboOf(MH);for(let i=0;i<COMBO_MAX;i++)drawStar5(c,x+w-27-(COMBO_MAX-1-i)*22,yy-5,9,i<n);}}
function bagVis(MH){const VIS=[],seen={};BAG.forEach((b,i)=>{if(MH!=='cosmic'&&!(ITEMS[b]&&ITEMS[b].kind!=='mat'))return;if(seen[b]!==undefined)return;seen[b]=i;VIS.push(i);});return VIS;}
function drawBagPage(c,x,y,w,h,MH){const col=HCOL[MH]||'#7a4f9a',showIng=MH!=='cosmic',tb=showIng?(MENU.tab||'bag'):'bag';
  const ty=y+22;let tx=x+18;c.font='700 16px "Alegreya SC", Georgia, serif';
  for(const [k,l] of (showIng?[['bag',`Satchel  ${satchelSlots()}/8`],['ing','Ingredients']]:[['bag','Satchel']])){const tw2=c.measureText(l).width+34,on=tb===k;
    if(on){c.fillStyle=col;rr(tx,ty,tw2,40,20);c.fill();}else{c.strokeStyle='#d6c39a';c.lineWidth=2;rr(tx+1,ty+1,tw2-2,38,19);c.stroke();}
    c.fillStyle=on?'#fbf3dd':'#5a3d22';c.textAlign='center';c.fillText(l,tx+tw2/2,ty+26);hit(tx,ty-4,tw2,48,()=>{MENU.tab=k;MENU.sel=null;MENU.pick=null;sfxPage(.35);});tx+=tw2+8;}
  const gy=ty+58;
  if(tb==='ing'){drawIngTab(c,x,w,gy,y+h-10);return;}
  /* every item is shown: a satchel pushed past 8 (pickups, swapping gear) grows extra rows instead of hiding things */
  const VIS=bagVis(MH),bagN=id=>BAG.filter(b=>b===id).length,gap=10,rows=Math.max(2,Math.ceil(VIS.length/4)),cs=Math.min(84,(w-36-gap*3)/4,(y+h-gy-48-gap*(rows-1))/rows),gx=x+(w-(cs*4+gap*3))/2;
  for(let i=0;i<rows*4;i++){const cx=gx+(i%4)*(cs+gap),cy=gy+Math.floor(i/4)*(cs+gap),bi=VIS[i],id=bi===undefined?undefined:BAG[bi],sel=bi!==undefined&&MENU.sel&&MENU.sel.kind==='bag'&&MENU.sel.i===bi;
    if(!id){c.strokeStyle='#e3d3ab';c.lineWidth=2;c.setLineDash([5,4]);rr(cx,cy,cs,cs,12);c.stroke();c.setLineDash([]);continue;}
    if(sel)drawGlow(c,cx+cs/2,cy+cs/2,cs*.85,'255,215,120',.45);
    c.fillStyle='#f3e6c4';rr(cx,cy,cs,cs,12);c.fill();c.strokeStyle=sel?col:'#d6c39a';c.lineWidth=sel?3:2;rr(cx,cy,cs,cs,12);c.stroke();
    drawIcon(c,id,cx+cs/2,cy+cs/2+1,cs*.6);
    {const nn=ITEMS[id].kind==='mat'?(MATS[id]||0):bagN(id);if(nn>1||ITEMS[id].kind==='mat'){c.fillStyle='#3b2a1c';c.font='700 15px "Alegreya SC", Georgia, serif';c.textAlign='right';c.fillText('×'+nn,cx+cs-6,cy+cs-6);}}
    hit(cx,cy,cs,cs,()=>{MENU.sel={kind:'bag',i:bi};MENU.pick=null;sfxPage(.35);if(TUT.stage===2&&id==='bucket'){TUT.stage=3;TUT.t=0;}});
    if(TUT.stage===2&&id==='bucket'){tutRing(c,cx+cs/2,cy+cs/2,cs*.55);tutArrow(c,cx+cs/2,cy-6,1);}}
  c.font='italic 14px Alegreya, Georgia, serif';c.fillStyle='#8a7050';c.textAlign='center';c.fillText(BAG.some(b=>MH==='cosmic'||(ITEMS[b]&&ITEMS[b].kind!=='mat'))?tw('Tap an item to read about it.','Click an item to read about it.'):'Your satchel is empty… for now.',x+w/2,gy+cs*rows+gap*(rows-1)+34);}
/* the parchment card for whatever is selected */
function drawItemCard(c,cx,cy,cw,MH,members){let id=null,fromSlot=null;if(MENU.sel.kind==='bag')id=BAG[MENU.sel.i];else{fromSlot=MENU.sel.slot;id=PARTY[MH][fromSlot];}
  const it=id?ITEMS[id]:null,pick=!!MENU.pick;
  hit(-5000,-5000,10000,10000,()=>{MENU.sel=null;MENU.pick=null;});
  c.font='italic 14.5px Alegreya, Georgia, serif';const lines=wrapText(c,it?it.desc:'Nothing is worn here yet.',cw-44);
  // gear in the satchel that fits this slot, so it can be equipped right here
  const opts=fromSlot&&!pick?[...new Set(BAG.filter(b=>ITEMS[b]&&ITEMS[b].slot===fromSlot))]:[],ots=54,ogap=10,operRow=Math.max(1,Math.floor((cw-36+ogap)/(ots+ogap))),orows=Math.ceil(opts.length/operRow),optH=fromSlot&&!pick?34+(opts.length?orows*(ots+30):24):0;
  const cmp=previewDelta(MH),nm=it?it.name:'Empty '+SLOTS.find(s=>s[0]===fromSlot)[1];
  const cnt=it&&!fromSlot?(it.kind==='mat'?(MATS[id]||0):BAG.filter(b=>b===id).length):0;
  const lab=pick?null:fromSlot&&id?'Unequip':it&&it.slot&&!fromSlot?'Equip':it&&it.heal?'Use':null;
  const chH=22+80+40+20+lines.length*19+(cmp?44:0)+(pick?58:0)+optH+74;const x0=cx-cw/2,y0=Math.max(-BK.top+BK.task+90,cy-chH/2);
  c.fillStyle='rgba(20,10,10,.35)';rr(x0+3,y0+8,cw,chH,18);c.fill();c.fillStyle='#fbf3dd';rr(x0,y0,cw,chH,18);c.fill();c.strokeStyle='#c49a4e';c.lineWidth=3;c.stroke();
  hit(x0,y0,cw,chH,()=>{});
  let yy=y0+22;c.fillStyle='#f3e6c4';c.beginPath();c.arc(cx,yy+40,40,0,TAU);c.fill();if(id){drawGlow(c,cx,yy+40,46,'255,225,150',.3);drawIcon(c,id,cx,yy+41,52);}else{c.save();c.globalAlpha=.7;drawIcon(c,SLOT_GHOST[fromSlot],cx,yy+40,50,true);c.restore();}
  yy+=80+30;c.textAlign='center';c.fillStyle='#5a2e22';let fs=24;c.font=`700 ${fs}px "Alegreya SC", Georgia, serif`;const full=nm+(cnt>1?'  ×'+cnt:'');while(c.measureText(full).width>cw-30&&fs>15){fs--;c.font=`700 ${fs}px "Alegreya SC", Georgia, serif`;}c.fillText(full,cx,yy);
  yy+=22;if(it){const sl=it.slot?SLOTS.find(s=>s[0]===it.slot)[1]:it.kind==='mat'?'Ingredient':it.kind==='key'?'Key Item':'Potion & Powder';const parts=[sl.toUpperCase()];for(const s in (it.stats||{}))parts.push(`+${it.stats[s]} ${STAT_NAME[s].toUpperCase()}`);if(it.hp)parts.push(`+${it.hp} MAX HP`);c.font='700 11.5px "Alegreya SC", Georgia, serif';c.fillStyle='#8a6a42';c.fillText(parts.join('  ·  '),cx,yy);}
  yy+=24;c.font='italic 14.5px Alegreya, Georgia, serif';c.fillStyle='#5a4630';lines.forEach((l,i)=>c.fillText(l,cx,yy+i*19));yy+=lines.length*19;
  if(cmp){yy+=8;const ks=Object.keys(cmp),uw=74,sx=cx-ks.length*uw/2;ks.forEach((k,i)=>{const ux=sx+i*uw,im=IMG[STATIMG[k]];if(ready(im))c.drawImage(im,ux+6,yy,28,28);c.textAlign='left';c.font='700 17px "Alegreya SC", Georgia, serif';c.fillStyle=cmp[k]>0?'#3f7a2e':'#a8402e';c.fillText((cmp[k]>0?'+':'')+cmp[k],ux+38,yy+21);});c.textAlign='center';yy+=36;}
  if(optH){yy+=18;c.strokeStyle='rgba(196,154,78,.5)';c.lineWidth=1;c.beginPath();c.moveTo(x0+24,yy-8);c.lineTo(x0+cw-24,yy-8);c.stroke();
    c.fillStyle='#8a6a42';c.font='700 12px "Alegreya SC", Georgia, serif';c.textAlign='center';c.fillText('FROM YOUR SATCHEL',cx,yy+8);yy+=20;
    if(!opts.length){c.font='italic 14px Alegreya, Georgia, serif';c.fillStyle='#8a7050';c.fillText('Nothing in your satchel fits here.',cx,yy+12);yy+=24;}
    else{opts.forEach((oid,i)=>{const r=Math.floor(i/operRow),q=i%operRow,inRow=Math.min(operRow,opts.length-r*operRow),rowW=inRow*ots+(inRow-1)*ogap,ox=cx-rowW/2+q*(ots+ogap),oy=yy+r*(ots+30);
        c.fillStyle='#f3e6c4';rr(ox,oy,ots,ots,10);c.fill();c.strokeStyle='#c49a4e';c.lineWidth=2;rr(ox,oy,ots,ots,10);c.stroke();drawIcon(c,oid,ox+ots/2,oy+ots/2,ots*.66);
        const st=ITEMS[oid].stats||{},sk=Object.keys(st)[0];c.font='700 10.5px "Alegreya SC", Georgia, serif';c.fillStyle='#6a5034';c.textAlign='center';c.fillText(sk?`+${st[sk]} ${{atk:'ATK',def:'DEF',mag:'MAG',spd:'SPD'}[sk]}`:'—',ox+ots/2,oy+ots+14);
        hit(ox,oy,ots,ots+18,()=>{equip(MH,oid);MENU.sel={kind:'slot',slot:fromSlot};MENU.pick=null;sfxPage(.45);});});
      yy+=orows*(ots+30);}}
  if(pick){yy+=14;c.fillStyle='#3b2a1c';c.font='700 18px "Alegreya SC", Georgia, serif';c.fillText('Who is this for?',cx,yy);c.font='italic 14px Alegreya, Georgia, serif';c.fillStyle='#8a6a42';c.fillText(tw('Tap a glowing portrait above','Click a glowing portrait above'),cx,yy+20);yy+=44;}
  const by=y0+chH-62,bh=46,gap=10;const btns=[];if(lab)btns.push([lab,true]);btns.push([pick?'Cancel':'Close',false]);const bw=(cw-36-gap*(btns.length-1))/btns.length;
  btns.forEach(([l,pri],i)=>{const bx=x0+18+i*(bw+gap);if(pri){c.fillStyle='rgba(60,30,10,.22)';rr(bx+1,by+3,bw,bh,12);c.fill();c.fillStyle=fromSlot?'#8a7258':(HCOL[MH]||'#7a4f9a');rr(bx,by,bw,bh,12);c.fill();c.fillStyle='#fbf3dd';}else{c.strokeStyle='#c49a4e';c.lineWidth=2;rr(bx+1,by+1,bw-2,bh-2,12);c.stroke();c.fillStyle='#5a3d22';}
    c.font='700 17px "Alegreya SC", Georgia, serif';c.textAlign='center';c.fillText(l,bx+bw/2,by+29);
    hit(bx,by,bw,bh,()=>{if(!pri){MENU.sel=null;MENU.pick=null;sfxPage(.3);return;}
      if(l==='Unequip'){unequip(MH,fromSlot);MENU.sel=null;}
      else if(l==='Equip'){equip(MH,id);MENU.sel=null;if(!BK.spread)MENU.page='char';}
      else if(l==='Use'){MENU.pick={id};if(members.length===1)useOn(members[0]);}});
    if(pri&&TUT.stage===3&&id==='bucket'){tutBox(c,bx,by,bw,bh,12);tutArrow(c,bx+bw/2,by-8,1);}});}
function drawMenu(dt){const members=CH>0?PARTY_ORDER:[HERO];const MH=(MENU.who&&members.includes(MENU.who))?MENU.who:HERO;MENU.a=clamp(MENU.a+(MENU.open?dt*5:-dt*6),0,1);if(MENU.a<=0)return;MENU.noteT=Math.max(0,MENU.noteT-dt);
  const e=1-Math.pow(1-MENU.a,3);MENU.hits=[];menuLayout();const BW=BK.W,BH=BK.H,col=HCOL[MH]||'#7a4f9a';
  if(MENU.sel&&MENU.sel.kind==='bag'&&BAG[MENU.sel.i]===undefined)MENU.sel=null;
  ctx.save();ctx.fillStyle=`rgba(14,12,24,${(.6*e).toFixed(3)})`;ctx.fillRect(0,0,W,H);
  const S=Math.min((W-16)/BW,(H-12)/(BH+BK.top+BK.bot),1.35);const ox=(W-BW*S)/2,oy=(H-(BH+BK.top+BK.bot)*S)/2+BK.top*S+(1-e)*40;MENU.S=S;MENU.ox=ox;MENU.oy=oy;
  ctx.globalAlpha=e;ctx.translate(ox,oy);ctx.scale(S,S);const c=ctx;
  drawParty(c,members,MH);
  // leather cover
  c.fillStyle='rgba(20,10,10,.4)';rr(4,8,BW,BH,20);c.fill();
  {const g=c.createLinearGradient(0,0,BW,BH);g.addColorStop(0,'#6e3b2c');g.addColorStop(.5,'#5a2e22');g.addColorStop(1,'#43211a');c.fillStyle=g;rr(0,0,BW,BH,20);c.fill();}
  c.strokeStyle='rgba(230,190,110,.55)';c.setLineDash([5,4]);c.lineWidth=1.4;rr(7,7,BW-14,BH-14,15);c.stroke();c.setLineDash([]);
  for(const [cx,cy,sx,sy] of [[0,0,1,1],[BW,0,-1,1],[0,BH,1,-1],[BW,BH,-1,-1]]){c.save();c.translate(cx,cy);c.scale(sx,sy);c.strokeStyle='#d8b060';c.fillStyle='#d8b060';c.lineWidth=2.4;c.beginPath();c.moveTo(10,34);c.quadraticCurveTo(10,10,34,10);c.stroke();c.beginPath();c.arc(17,17,3.4,0,TAU);c.fill();c.restore();}
  const prev=previewDelta(MH);let card=null;
  if(BK.spread){const pw=(BW-44)/2,ph=BH-36,lx=18,rx=BW/2+4,py=18;drawParch(c,lx,py,pw,ph,8);drawParch(c,rx,py,pw,ph,8);
    {const g=c.createLinearGradient(BW/2-10,0,BW/2+10,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,'rgba(60,30,10,.35)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(BW/2-14,py,28,ph);}
    drawCharPage(c,lx,py,pw,ph,MH,prev);drawBagPage(c,rx,py,pw,ph,MH);card=[rx+pw/2,BH/2,Math.min(pw-16,340)];}
  else{const page=MENU.page||'char';drawParch(c,18,18,BW-36,BH-36,8);if(page==='char')drawCharPage(c,18,18,BW-36,BH-36,MH,prev);else drawBagPage(c,18,18,BW-36,BH-36,MH);card=[BW/2,BH/2,BW-52];
    const ny=BH+14,nw=(BW-10)/2;[['char','Character'],['bag','Satchel']].forEach(([k,l],i)=>{const nx=i*(nw+10),on=page===k;if(on){c.fillStyle=col;rr(nx,ny,nw,48,24);c.fill();}else{c.strokeStyle='rgba(200,180,160,.55)';c.lineWidth=2;rr(nx+1,ny+1,nw-2,46,23);c.stroke();}
      c.fillStyle=on?'#fbf3dd':'#e6d6be';c.font='700 18px "Alegreya SC", Georgia, serif';c.textAlign='center';c.fillText(l,nx+nw/2,ny+31);
      hit(nx,ny,nw,48,()=>{if(!on){MENU.page=k;MENU.sel=null;MENU.pick=null;sfxPage(.45);}});
      if(k==='bag'&&!on&&TUT.stage===2)tutBox(c,nx,ny,nw,48,24);});}
  // ribbon bookmark in the hero's colour
  {const rx=BK.spread?BW/2-64:BW-74;c.fillStyle='rgba(0,0,0,.25)';c.fillRect(rx+3,-4,26,6);c.fillStyle=col;c.beginPath();c.moveTo(rx,-6);c.lineTo(rx+26,-6);c.lineTo(rx+26,64);c.lineTo(rx+13,54);c.lineTo(rx,64);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.15)';c.fillRect(rx+4,-6,3,64);}
  // wax-seal close button
  {const sx=BW-14,sy=14;c.fillStyle='rgba(40,10,10,.35)';c.beginPath();c.arc(sx+1.5,sy+2.5,17,0,TAU);c.fill();const g=c.createRadialGradient(sx-5,sy-5,2,sx,sy,17);g.addColorStop(0,'#d0504a');g.addColorStop(1,'#8a1e22');c.fillStyle=g;c.beginPath();for(let k=0;k<14;k++){const a=k/14*TAU,r_=k%2?15.5:17;c.lineTo(sx+Math.cos(a)*r_,sy+Math.sin(a)*r_);}c.closePath();c.fill();
    c.strokeStyle='#f6d2c4';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(sx-5,sy-5);c.lineTo(sx+5,sy+5);c.moveTo(sx+5,sy-5);c.lineTo(sx-5,sy+5);c.stroke();
    hit(sx-22,sy-22,44,44,closeMenu);if(TUT.stage===4)tutRing(c,sx,sy,17);}
  if(MENU.sel){c.fillStyle='rgba(20,12,24,.35)';rr(0,0,BW,BH,20);c.fill();drawItemCard(c,card[0],card[1],card[2],MH,members);if(MENU.pick){drawParty(c,members,MH);}}
  // tutorial words, written in the margin like a note from Lum
  const tip=TUT.stage===2?tw('Tap the Wooden Bucket in your satchel.','Click the Wooden Bucket in your satchel.'):TUT.stage===3?tw('Now tap Equip to wear it on your head.','Now click Equip to wear it on your head.'):TUT.stage===4?tw('Perfect fit! Tap the wax seal to close the book.','Perfect fit! Click the wax seal (or press I) to close the book.'):MENU.noteT>0?MENU.note:'';
  if(tip){c.textAlign='center';c.font='italic 15px Alegreya, Georgia, serif';const w=c.measureText(tip).width+30,ty=BH+(BK.spread?8:72);c.fillStyle='rgba(30,38,30,.85)';rr(BW/2-w/2,ty,w,30,15);c.fill();c.fillStyle='#fdf8ec';c.fillText(tip,BW/2,ty+20);}
  ctx.restore();}
function menuTap(x,y){const bx=(x-MENU.ox)/MENU.S,by=(y-MENU.oy)/MENU.S;for(let i=MENU.hits.length-1;i>=0;i--){const h=MENU.hits[i];if(bx>=h.x&&bx<=h.x+h.w&&by>=h.y&&by<=h.y+h.h){h.act();return;}}
  if(bx<-10||bx>BK.W+10||by<-BK.top||by>BK.H+BK.bot)closeMenu();}

/* sounds for all of the above */
function sfxItem(){if(!SND.ready)return;const t=SND.ctx.currentTime;[84,88,91,96,100].forEach((n,i)=>bell(t+i*.07,NOTE(n),.07,1.4,SND.sfx,(i-2)*.2));bell(t+.42,NOTE(103),.05,2.2,SND.sfxVerb||SND.sfx,0);}
function sfxEquip(){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.12,'bandpass',700,1.4,.18,SND.sfx);pluck(t+.02,NOTE(60),.12,.25,SND.sfx,0,.3);[91,96].forEach((n,i)=>bell(t+.08+i*.08,NOTE(n),.05,1,SND.sfx,0));}
function sfxPage(v=.5){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.18,'bandpass',2600,.8,.05*v,SND.sfx,1400);}
function sfxBook(open){if(!SND.ready)return;const t=SND.ctx.currentTime;noiseHit(t,.32,'bandpass',open?1800:1200,.7,.09,SND.sfx,900);noiseHit(t+.12,.1,'lowpass',300,1,.12,SND.sfx);if(open)bell(t+.1,NOTE(88),.03,1.2,SND.sfx,0);}

