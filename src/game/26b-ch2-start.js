/* ---------- Chapter 2: the clearing the morning after Fokalur ----------
   For now this only opens the clearing so the layout can be walked: no story, no saving yet.
   Same map as Chapter 1's ending (CLR in 21-stranglethorn); from Chapter 2 on the east side is lit and the path to the gatehouse is open. */
function startChapter2(){audioInit();c1Reset();CH=2;HERO='lum';PC='lum';
  C1.introDone=1;C1.hedgeSeen=1;C1.thornBoss=1;C1.fkDone=1;C1.chEnd=0;C1I.on=false;WEVENT.on=false;INTRO.lumShown=true;LUMSTONE=0;
  for(let i=0;i<5;i++)C1['cosSeen'+i]=1;
  const k=bestCh1Keepsake();if(k)PARTY.lum.charm=k.id;   // Chapter 2 starts with the best Chapter 1 keepsake equipped
  enterThorn();GOAL.tag='TASK';GOAL.text='Look around the clearing';lum.x=CLR.cx-120;lum.y=CLR.cy+40;lum.face=1;cam.x=lum.x;cam.y=lum.y;SAVEC.finished=1;FADE.a=1;FADE.dir=-1;}
