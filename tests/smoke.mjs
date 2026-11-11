// Smoke tests: build the game, serve dist/, and play through key moments on a phone and a desktop screen.
// Run with `node tests/smoke.mjs` (or `npm test`). Screenshots land in tests/screenshots/ for a visual check.
// Add `--only <name>` to run one case, e.g. `node tests/smoke.mjs --only battle`.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(R, 'dist'), SHOTS = path.join(R, 'tests/screenshots');
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

execFileSync('node', [path.join(R, 'build.mjs')], { stdio: 'inherit' });
fs.mkdirSync(SHOTS, { recursive: true });

const TYPES = { '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const f = path.join(DIST, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(DIST) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const URL_ = `http://localhost:${server.address().port}/index.html`;

const VIEWPORTS = { phone: { width: 390, height: 780 }, desktop: { width: 1280, height: 760 } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const check = (ok, msg) => { if (!ok) throw new Error(msg); };

// tap the centre of a spellbook hit-box chosen by `pick` (runs in the page; gets MENU.hits)
async function tapMenu(p, pick) {
  const pt = await p.evaluate(src => {
    const M = window.__g.MENU, h = new Function('hits', 'return (' + src + ')(hits)')(M.hits);
    return h && [M.ox + (h.x + h.w / 2) * M.S, M.oy + (h.y + h.h / 2) * M.S];
  }, pick.toString());
  check(pt, 'could not find the spellbook button to tap');
  await p.mouse.click(pt[0], pt[1]); await wait(300);
}
async function startCh1(p) {
  await p.evaluate(() => window.__g.startChapter1()); await wait(1200);
  await p.keyboard.press('Escape'); await wait(800);
  await p.evaluate(() => { window.__g.DLG.active = false; });
}

const CASES = {
  async boot(p) {
    check(await p.evaluate(() => !!window.__g && typeof window.__g.startChapter1 === 'function'), 'game did not start');
  },
  async 'prologue-bucket-tutorial'(p) {
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.BAG.push('bucket'); g.TUT.stage = 1; g.DLG.active = false; g.openMenu(); });
    await wait(600);
    await tapMenu(p, hits => { const sq = hits.filter(h => h.w > 60 && h.w < 95 && Math.abs(h.w - h.h) < 1); return sq.length > 6 ? sq[6] : sq[0]; }); // the bucket (after the 6 gear slots on wide screens)
    check(await p.evaluate(() => window.__g.TUT.stage) === 3, 'tapping the bucket did not open its card');
    await tapMenu(p, hits => hits.filter(h => h.h === 46)[0]); // Equip
    const r = await p.evaluate(() => [window.__g.TUT.stage, window.__g.PARTY.cosmic.head]);
    check(r[0] === 4 && r[1] === 'bucket', 'Equip did not put the bucket on Cosmic: ' + r);
  },
  async 'ch1-spellbook-potion'(p) {
    const vp = p.viewportSize().width < 600 ? 'phone' : 'desktop';
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.jakJoin(); g.DLG.active = false; g.BAG.push('potion'); }); await wait(200);
    await p.evaluate(() => { window.__g.DLG.active = false; window.__g.openMenu(); }); await wait(700);
    await p.evaluate(() => { const g = window.__g; g.MENU.page = 'bag'; g.MENU.sel = { kind: 'bag', i: g.BAG.indexOf('potion') }; }); await wait(300);
    await tapMenu(p, hits => hits.filter(h => h.h === 46)[0]); // Use
    check(await p.evaluate(() => !!window.__g.MENU.pick), 'Use did not ask who the potion is for');
    const before = await p.evaluate(() => window.__g.HEROES.spar.hp);
    await tapMenu(p, hits => { const top = hits.filter(h => h.y < -20); return top[top.length - 1]; }); // Spar's portrait
    const after = await p.evaluate(() => window.__g.HEROES.spar.hp);
    check(after > before, `potion did not heal Spar (${before} -> ${after})`);
    // Spar's character page shows his combo and stars, like Lum's
    await p.evaluate(() => { const g = window.__g; g.MENU.pick = null; g.MENU.page = 'char'; g.MENU.sel = null; g.MENU.who = 'spar'; g.C1X.comboS = 3; }); await wait(400);
    await p.screenshot({ path: path.join(SHOTS, `spar-character-page-${vp}.png`) });
  },
  async battle(p) {
    await startCh1(p);
    await p.evaluate(() => window.__g.startEncounter({ kind: 'spider', scene: 'dun', x: 0, y: 0, s: 1, pack: 1, calm: 0 }, 'normal'));
    const intro = await p.evaluate(() => window.__g.WIPEX.label);
    check(intro === 'A Spider appears!', `battle intro read "${intro}"`);
    let ph = '';
    for (let i = 0; i < 50 && ph !== 'heroMenu'; i++) { await wait(150); ph = await p.evaluate(() => window.__g.BATTLE.phase); }
    check(ph === 'heroMenu', 'battle never reached the hero menu (phase ' + ph + ')');
    await wait(1000); // let the stage finish sliding in before the screenshot
  },
  async stranglethorn(p) {
    await startCh1(p);
    await p.evaluate(() => window.__g.enterThornGate()); await wait(1500);
    check(await p.evaluate(() => window.__g.SCENE) === 'thgate', 'lantern-less gate view did not open');
    await p.evaluate(() => window.__g.enterThorn()); await wait(1800);
    check(await p.evaluate(() => window.__g.SCENE) === 'thorn', 'Stranglethorn maze did not open');
  },
  async 'foxfire-pouch-card'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.BAG.push('crystalpouch'); g.openMenu(); }); await wait(700);
    await p.evaluate(() => { const g = window.__g; g.MENU.page = 'bag'; g.MENU.sel = { kind: 'bag', i: g.BAG.indexOf('crystalpouch') }; }); await wait(500);
    check(await p.evaluate(() => window.__g.MENU.sel && window.__g.BAG.includes('crystalpouch')), 'Foxfire Pouch card did not open');
  },
  async 'sword-emote-first-strike'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.enterDun(1, 560, 640, 1);
      for (let i = g.DFOES.length - 1; i >= 0; i--) g.DFOES.splice(i, 1);
      g.lum.bumpT = 99; const x = 660, y = 640;
      g.DFOES.push({ id: 999, kind: 'spider', scene: 'dun', room: 1, x, y, hx: x, hy: y, tx: x, ty: y, s: 1, pack: 1, calm: 0, dead: 0, ph: 0, t: 0, face: -1 }); });
    await wait(1500);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; const f = g.DFOES[0]; f.x = f.tx = g.lum.x + 100; f.y = f.ty = g.lum.y; }); await wait(250);
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.foe)), 'no sword emote next to a spider');
    await p.screenshot({ path: path.join(SHOTS, 'sword-emote-bubble-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => window.__g.pressA());
    check(await p.evaluate(() => window.__g.WIPEX.label) === 'First Strike!', 'tapping by the sword did not start First Strike');
  },
  async 'prologue-end-clears-continue'(p) {
    check(await p.evaluate(() => { localStorage.setItem('lums-magic-shop-save-v1', JSON.stringify({ v: 1, sv: 1, t: Date.now(), scene: 'garden' })); return !!window.__g.readSave(); }), 'test save was not written');
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.enterWoods(); g.WEV.end = 7; });
    await wait(1200);
    check(await p.evaluate(() => window.__g.readSave()) === null, 'finishing the prologue left a save behind');
    await p.reload(); await p.waitForFunction(() => window.__g, null, { timeout: 15000 }); await wait(1500);
    check(await p.evaluate(() => window.__g.readSave()) === null, 'a save came back after reloading');
  },
  async 'bucket-pickup'(p) {
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.DLG.active = false; g.enterWell(); }); await wait(1200);
    await p.evaluate(() => { const g = window.__g; g.takeBucket(); }); await wait(1500);
    check(await p.evaluate(() => window.__g.bucketTaken), 'bucket was not taken');
  },
  async 'lum-search-hint'(p) {
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.DLG.active = false; g.enterShop(); }); await wait(1000);
    const lines = await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.BAG.length = 0; g.BAG.push('potion'); g.PARTY.cosmic.main = null; g.lumTalk(); return g.DLG.lines.map(l => l[1]); });
    check(lines.length === 4 && /imagination/.test(lines[1]) && /hardest places/.test(lines[2]), 'Lum\'s search hint is missing: ' + JSON.stringify(lines));
    await wait(600);
  },
  async 'stranglethorn-forage'(p) {
    await p.evaluate(() => window.__g.startThornPreview()); await wait(1500);
    const n = await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.THFOES.length = 0; const f = g.THORN.forage[0]; g.lum.x = f.x + (f.x > g.lum.x ? -60 : 60); g.lum.x = f.x - 60; g.lum.y = f.y + 30; return g.THORN.forage.length; });
    check(n >= 3, 'only ' + n + ' forage bushes in Stranglethorn');
    await wait(900);
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.forage)), 'no pick emote next to a Stranglethorn bush');
    await p.screenshot({ path: path.join(SHOTS, 'stranglethorn-forage-bush-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    const id = await p.evaluate(() => window.__g.THORN.forage[0].id);
    await p.evaluate(() => window.__g.pressA()); await wait(400);
    check(await p.evaluate(id => (window.__g.MATS[id] || 0) >= 2 && window.__g.THORN.forage[0].picked, id), 'picking the bush gave nothing');
  },
  async 'fox-ring'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.enterDun(1, 185, 640, 1); g.DFOES.length = 0; g.BAG.splice(0, g.BAG.length, ...g.BAG.filter(i => i !== 'lantern')); }); await wait(1200);
    const dark = await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lum.x = 185; g.lum.y = 640; g.pressA(); return g.DLG.active && g.DLG.lines[0][1]; });
    check(dark === "It's too dark to see without a lantern!", 'no-lantern line was: ' + dark);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.BAG.push('lantern'); }); await wait(1200);
    const seen = await p.evaluate(() => { const g = window.__g; g.pressA(); return g.DLG.lines[0][1]; });
    check(/small and circular/.test(seen), 'lantern line was: ' + seen);
    await p.evaluate(() => window.__g.pressA()); await wait(500);
    check(await p.evaluate(() => window.__g.BAG.includes('foxring')), 'Fox Ring was not given');
    const got = await p.evaluate(() => { const g = window.__g, r = Math.random; g.PARTY.lum.charm = 'foxring'; const before = g.MATS.slimeparts || 0; Math.random = () => 0.1;
      g.foxRingSteal({ type: 'slime', x: 0, y: 0 }); Math.random = r; return (g.MATS.slimeparts || 0) - before; });
    check(got === 1, 'Fox Ring did not steal on a successful roll');
  },
  async 'hidden-spring'(p) {
    await p.evaluate(() => window.__g.startThornPreview()); await wait(1200);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.THFOES.length = 0; g.lum.x = g.SPRING_DOOR.x; g.lum.y = g.SPRING_DOOR.y + 86; }); await wait(3600);
    check(await p.evaluate(() => { const g = window.__g, d = g.SPRING_DOOR; return g.thornFree(d.x, d.y + 86) && !g.thornFree(d.x, d.y); }), 'Lum can stand on the spring well, or not in front of it');
    await p.screenshot({ path: path.join(SHOTS, 'hidden-spring-well-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.door)), 'no door emote at the passage');
    await p.evaluate(() => window.__g.pressA()); await wait(300);
    check(await p.evaluate(() => /underground passage/.test(window.__g.DLG.lines[0][1])), 'Lum did not notice the passage');
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    check(await p.evaluate(() => window.__g.SCENE === 'dun' && window.__g.DUN.room === 6), 'did not reach the Hidden Spring');
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.HEROES_X.lum.hp = 3; g.lumS.x = 760; g.lumS.y = 618; }); await wait(900);
    await p.evaluate(() => window.__g.pressA()); await wait(400);
    check(await p.evaluate(() => window.__g.CHOICE.on && /Drink/.test(window.__g.CHOICE.q)), 'the spring did not offer a drink');
    await p.screenshot({ path: path.join(SHOTS, 'hidden-spring-drink-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.keyboard.press('Enter'); await wait(400);
    check(await p.evaluate(() => window.__g.HEROES_X.lum.hp === window.__g.HEROES_X.lum.maxHp), 'drinking did not restore HP');
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lumS.x = 935; g.lumS.y = 478; }); await wait(700);
    check(await p.evaluate(() => window.__g.dunFree(935, 478) && !!(window.__g.NEAR && window.__g.NEAR.door)), 'no door emote up the spring stairs');
    await wait(800);
  },
  async 'thornroot-cellar'(p) {
    await p.evaluate(() => window.__g.startThornPreview()); await wait(1200);
    const d = await p.evaluate(() => window.__g.CELLAR_DOOR);
    check(await p.evaluate(d => window.__g.thornFree(d.x, d.y + 86), d), 'the cellar entrance is inside a hedge');
    await p.evaluate(d => { const g = window.__g; g.DLG.active = false; g.THFOES.length = 0; g.lum.x = d.x; g.lum.y = d.y + 86; }, d); await wait(800);
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.door)), 'no door emote at the cellar entrance');
    await p.screenshot({ path: path.join(SHOTS, 'thornroot-cellar-mouth-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    check(await p.evaluate(() => window.__g.SCENE === 'dun' && window.__g.DUN.room === 7), 'did not reach the cellar');
    check(await p.evaluate(() => window.__g.DFOES.filter(f => f.room === 7 && f.kind === 'rvixen' && !f.dead).length) === 3, 'the cellar should have 3 foxes');
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lumS.bumpT = 99; }); await wait(300);
    await p.screenshot({ path: path.join(SHOTS, 'thornroot-cellar-room-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => { const g = window.__g; g.DFOES.length = 0; g.lumS.x = 470; g.lumS.y = 620; }); await wait(800);
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    const back = await p.evaluate(d => { const g = window.__g; return g.SCENE === 'thorn' && Math.abs(g.lumX.x - d.x) < 5; }, d);
    check(back, 'climbing the cellar stairs did not return to the entrance');
  },
  async 'briar-den-fox-hood'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.enterDun(7, 950, 560, 1); g.lumS.bumpT = 99; g.DLG.active = false; }); await wait(900);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lumS.x = 950; g.lumS.y = 548; }); await wait(400);
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.door)), 'no door emote at the cellar back wall');
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    check(await p.evaluate(() => window.__g.SCENE === 'dun' && window.__g.DUN.room === 8), 'back wall did not lead to the Briar Den');
    check(await p.evaluate(() => window.__g.DFOES.filter(f => f.room === 8 && f.kind === 'rvixen').length) === 2, 'the den should have 2 foxes');
    check(await p.evaluate(() => !window.__g.hoodOut()), 'the hood showed before the foxes were beaten');
    await p.evaluate(() => { const g = window.__g; for (let i = g.DFOES.length - 1; i >= 0; i--) if (g.DFOES[i].room === 8) g.DFOES.splice(i, 1); g.DLG.active = false; g.lumS.x = g.HOOD.x - 62; g.lumS.y = g.HOOD.y + 22; g.lumS.face = 1; }); await wait(900);
    check(await p.evaluate(() => window.__g.hoodOut() && !!(window.__g.NEAR && window.__g.NEAR.grab)), 'no pick-up emote by the hood');
    await p.screenshot({ path: path.join(SHOTS, 'briar-den-hood-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => window.__g.pressA()); await wait(500);
    check(await p.evaluate(() => window.__g.BAG.includes('foxhood') && !window.__g.DLG.active), 'Fox Hood was not picked up with just the toast');
  },
  async 'cellar-table-depth'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.enterDun(7, 945, 555, 1); g.DFOES.length = 0; g.DLG.active = false; }); await wait(1500);
    check(await p.evaluate(() => !window.__g.dunFree(945, 600) && !window.__g.dunFree(1050, 620)), 'Lum can walk onto the cellar table');
    check(await p.evaluate(() => window.__g.dunFree(945, 555) && window.__g.dunFree(945, 690)), 'Lum cannot get behind or in front of the cellar table');
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lumS.x = 945; g.lumS.y = 556; }); await wait(400);
    await p.screenshot({ path: path.join(SHOTS, 'cellar-table-behind-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => { const g = window.__g; g.lumS.x = 945; g.lumS.y = 690; }); await wait(400);
  },
  async 'healing-powder-migrates'(p) {
    const bag = await p.evaluate(() => { const g = window.__g, d = { v: 1, sv: 2, bag: ['hpowder', 'potion', 'bucket'] }; g.migrateSave(d); return d.bag; });
    check(JSON.stringify(bag) === JSON.stringify(['potion', 'potion', 'bucket']), 'old Healing Powder was not turned into potions: ' + JSON.stringify(bag));
    check(await p.evaluate(() => !window.__g.ITEMS.hpowder), 'Healing Powder still exists as an item');
  },
  async 'briar-den-dead-end'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.enterDun(8, 780, 560, 1); g.DFOES.length = 0; g.DLG.active = false; }); await wait(1300);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.C1X.foxHood = 1; g.lumS.x = 780; g.lumS.y = 560; }); await wait(400);
    const line = await p.evaluate(() => { const g = window.__g; g.pressA(); return g.DLG.active && g.DLG.lines[0][1]; });
    check(/no way through|as far as the den goes/.test(line || ''), 'the back of the den says nothing: ' + line);
  },
  async 'satchel-overfull'(p) {
    // a full satchel + Fox Ring pickup, then wearing the ring: the Moon Charm goes back to the satchel and must be visible there
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.PARTY.lum.charm = 'mooncharm'; g.BAG.length = 0; g.BAG.push('potion', 'lantern', 'vanecharm', 'crystalpouch', 'foxhood', 'foxsuit', 'foxboots', 'bucket', 'foxring'); g.openMenu(); }); await wait(700);
    await p.evaluate(() => { const g = window.__g; g.MENU.sel = { kind: 'slot', slot: 'charm' }; g.MENU.pick = null; }); await wait(400);
    await tapMenu(p, hits => hits.filter(h => h.w === 54 && h.h === 72).slice(-1)[0]);
    check(await p.evaluate(() => window.__g.PARTY.lum.charm === 'foxring' && window.__g.BAG.includes('mooncharm')), 'wearing the Fox Ring did not put the Moon Charm in the satchel');
    await p.evaluate(() => { const g = window.__g; g.MENU.sel = null; g.MENU.page = 'bag'; g.MENU.tab = 'bag'; }); await wait(500);
    const vp = p.viewportSize().width < 600 ? 'phone' : 'desktop';
    await p.screenshot({ path: path.join(SHOTS, `satchel-overfull-${vp}.png`) });
    check(await p.evaluate(() => window.__g.MENU.hits ? window.__g.MENU.hits.filter(h => h.w === h.h && h.w > 40).length >= 9 : true), 'not every satchel item has a slot');
  },
  async 'equip-from-slot'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.PARTY.lum.head = null; g.BAG.push('foxhood', 'bucket'); g.openMenu(); }); await wait(700);
    await p.evaluate(() => { const g = window.__g; g.MENU.sel = { kind: 'slot', slot: 'head' }; g.MENU.pick = null; }); await wait(400);
    await p.screenshot({ path: path.join(SHOTS, 'equip-from-slot-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await tapMenu(p, hits => hits.filter(h => h.w === 54 && h.h === 72)[0]);
    check(await p.evaluate(() => window.__g.PARTY.lum.head === 'foxhood' && !window.__g.BAG.includes('foxhood')), 'tapping the Fox Hood under the Head slot did not equip it');
    await tapMenu(p, hits => hits.filter(h => h.w === 54 && h.h === 72)[0]);
    check(await p.evaluate(() => window.__g.PARTY.lum.head === 'bucket' && window.__g.BAG.includes('foxhood')), 'swapping from the slot card did not return the old item to the satchel');
  },
  async 'web-well'(p) {
    await p.evaluate(() => window.__g.startThornPreview()); await wait(1200);
    const d = await p.evaluate(() => window.__g.WEBWELL_DOOR);
    check(await p.evaluate(d => window.__g.thornFree(d.x - 75, d.y + 58) && !window.__g.thornFree(d.x, d.y), d), 'the web well is not solid, or its side is blocked');
    await p.evaluate(d => { const g = window.__g; g.DLG.active = false; g.THFOES.length = 0; g.lum.x = d.x - 75; g.lum.y = d.y + 58; }, d); await wait(3600);
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.door)), 'no door emote at the web well');
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    check(await p.evaluate(() => window.__g.SCENE === 'dun' && window.__g.DUN.room === 9), 'the web well did not lead to the Ember Hollow');
    check(await p.evaluate(() => !window.__g.dunFree(792, 510)), 'Lum can walk onto the heat source');
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lumS.x = 792; g.lumS.y = 575; }); await wait(900);
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.fire)), 'no mixing spot at the heat source');
    await p.screenshot({ path: path.join(SHOTS, 'ember-hollow-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => { const g = window.__g; g.lumS.x = 320; g.lumS.y = 670; }); await wait(800);
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    check(await p.evaluate(() => window.__g.SCENE === 'thorn'), 'the Ember Hollow stairs did not lead back up');
  },
  async 'spider-lair'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.enterDun(9, 860, 470, 1); g.DLG.active = false; }); await wait(900);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lumS.x = 860; g.lumS.y = 450; }); await wait(400);
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    check(await p.evaluate(() => window.__g.SCENE === 'dun' && window.__g.DUN.room === 10), 'the Ember Hollow tunnel did not lead to the Spider Lair');
    check(await p.evaluate(() => window.__g.DFOES.some(f => f.room === 10 && f.lair)), 'no boss in the Spider Lair');
    check(await p.evaluate(() => { const g = window.__g; g.DLG.active = false; return g.dunFree(290, 745); }), 'the lair exit by the south wall is not walkable');
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.lumS.bumpT = 0; }); await wait(1500);
    await p.screenshot({ path: path.join(SHOTS, 'spider-lair-room-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => { const g = window.__g; g.lumS.x = 700; g.lumS.y = 670; }); await wait(1800);
    const f = await p.evaluate(() => { const B = window.__g.BATTLE; return B.foes && B.foes[0] && { name: B.foes[0].name, hp: B.foes[0].max, loot: B.foes[0].loot, label: window.__g.WIPEX.label }; });
    check(f && f.name === 'Webmother' && f.hp === 46 && f.loot === 'foxsuit', 'walking up to the boss did not start its battle: ' + JSON.stringify(f));
    await wait(2500);
    await p.evaluate(() => { const B = window.__g.BATTLE; B.phase = 'win'; B.t = 1; B.rewarded = 0; }); await wait(600);
    check(await p.evaluate(() => window.__g.BAG.includes('foxsuit') && window.__g.C1X.lairBoss === 1), 'beating the boss did not give the Fox Suit');
  },
  async 'cosmic-sightings'(p) {
    await p.evaluate(() => window.__g.startThornPreview()); await wait(4500);
    const n = await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.THFOES.length = 0; return g.COSSEE.length; });
    check(n === 5, 'expected 5 Cosmic sightings, got ' + n);
    const st = await p.evaluate(() => { const g = window.__g, s = g.COSSEE[0], Rw = Math.min(innerWidth, innerHeight) * .5; g.lum.x = s.x - Rw * .85; g.lum.y = s.y; g.lum.bumpT = 99; return 1; });
    await wait(700);
    check(await p.evaluate(() => window.__g.COSSEE[0].st === 1), 'Cosmic did not appear at the edge of the light');
    await p.screenshot({ path: path.join(SHOTS, 'cosmic-sighting-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => { const g = window.__g, s = g.COSSEE[0]; g.lum.x = s.x - 60; }); await wait(400);
    const r = await p.evaluate(() => { const g = window.__g; return { st: g.COSSEE[0].st, seen: g.C1X.cosSeen0, line: g.DLG.active && g.DLG.lines[0][1] }; });
    check(r.st >= 2 && r.seen === 1 && /Cosmic/.test(r.line || ''), 'Cosmic did not vanish with a line from Lum: ' + JSON.stringify(r));
    // he walks away in plain sight for a while before fading
    await p.evaluate(() => { window.__g.DLG.active = false; }); await wait(1800);
    await p.screenshot({ path: path.join(SHOTS, 'cosmic-walks-away-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    { const q = await p.evaluate(() => { const s = window.__g.COSSEE[0]; return { st: s.st, a: s.a, w: s.w, t: s.t }; }); check(q.st === 2 && q.a > .9, 'Cosmic faded before walking away: ' + JSON.stringify(q)); }
  },
  async 'fokalur-clearing'(p) {
    const vp = p.viewportSize().width < 600 ? 'phone' : 'desktop';
    const until = async (fn, ms = 20000) => { for (let t = 0; t < ms; t += 250) { if (await p.evaluate(fn)) return true; await p.evaluate(() => { const g = window.__g; if (g.DLG.active) g.pressA(); }); await wait(250); } return false; };
    await p.evaluate(() => window.__g.startThornPreview()); await wait(1500);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.C1X.thornBoss = 1; for (let i = 0; i < 4; i++) g.C1X['cosSeen' + i] = 1; g.THFOES.length = 0; }); await wait(400);
    await p.evaluate(() => { const g = window.__g, TW = g.CLR.x0 - 260; g.DLG.active = false; g.lum.x = TW - 70; g.lum.y = g.CLR.cy; }); await wait(900);
    check(await p.evaluate(() => window.__g.C1X.cosSeen4 === 1), 'Cosmic did not appear one last time at the exit');
    await p.evaluate(() => { window.__g.DLG.active = false; }); await wait(1800);
    check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.door)), 'no door emote at the maze exit');
    // anywhere in the exit gap, not just its middle
    for (const [dx, dy] of [[25, -125], [25, 105], [-60, -120], [10, 0]]) {
      await p.evaluate(([dx, dy]) => { const g = window.__g, TW = g.CLR.x0 - 260; g.lum.x = TW + dx; g.lum.y = g.CLR.cy + dy; }, [dx, dy]); await wait(500);
      check(await p.evaluate(() => !!(window.__g.NEAR && window.__g.NEAR.door)), `no door emote at the edge of the exit gap (${dx}, ${dy})`);
    }
    await p.evaluate(() => window.__g.pressA()); await wait(2200);
    check(await p.evaluate(() => window.__g.lum.x > window.__g.CLR.x0), 'the exit door did not lead to the clearing');
    await wait(1200); await p.screenshot({ path: path.join(SHOTS, `fokalur-clearing-arrive-${vp}.png`) });
    await p.evaluate(() => { const g = window.__g; g.lum.x = g.FKS.cx - 200; g.lum.y = g.FKS.cy; }); await wait(500);
    check(await p.evaluate(() => window.__g.FKS.st >= 1 && window.__g.DLG.active), 'walking up to Cosmic did not start the scene');
    check(await until(() => window.__g.FKS.st === 3), 'Cosmic did not transform');
    await wait(400); await p.screenshot({ path: path.join(SHOTS, `fokalur-clearing-reveal-${vp}.png`) });
    check(await until(() => !!window.__g.FKS.jakIn, 45000), 'Spar did not run into the clearing when Lum came alone');
    await wait(500); await p.screenshot({ path: path.join(SHOTS, `fokalur-spar-arrives-${vp}.png`) });
    check(await until(() => window.__g.BATTLE.on && window.__g.BATTLE.foes && window.__g.BATTLE.foes[0] && window.__g.BATTLE.foes[0].name === 'Fokalur'), 'the Fokalur battle did not start');
    check(await p.evaluate(() => window.__g.BATTLE.heroes.map(h => h.id).join(',')) === 'lum,spar', 'Lum and Spar should fight Fokalur together');
    await wait(3500);
    // Fokalur's turns: petrify Lum, then burn Jak
    await p.evaluate(() => { const g = window.__g; g.BATTLE.foeI = -1; g.nextFoe(); }); await wait(3300);
    check(await p.evaluate(() => { const h = window.__g.BATTLE.heroes.find(h => h.id === 'lum'); return h.stone === 1 && h.ko === 1; }), 'Fokalur did not turn Lum to stone');
    await p.evaluate(() => { const g = window.__g; g.BATTLE.foeI = -1; g.nextFoe(); }); await wait(1900);
    await p.screenshot({ path: path.join(SHOTS, `fokalur-battle-${vp}.png`) });
    check(await p.evaluate(() => !!window.__g.BATTLE.heroes.find(h => h.id === 'spar').burn), 'Fokalur did not engulf Spar in flames');
    check(await until(() => window.__g.FKS.st === 5 && !window.__g.BATTLE.on, 15000), 'the lost battle did not return to the clearing');
    await wait(1600); await p.screenshot({ path: path.join(SHOTS, `fokalur-aftermath-${vp}.png`) });
    check(await p.evaluate(() => window.__g.LUMSTONE === 1 && !!window.__g.FKS.fire), 'no stone Lum and fire in the clearing after the battle');
    check(await until(() => window.__g.FKS.st === 8, 40000), 'the scene did not pull back after Lum\'s last line');
    await wait(1800); await p.screenshot({ path: path.join(SHOTS, `fokalur-pullback-${vp}.png`) });
    check(await until(() => window.__g.C1X.fkDone === 1, 40000), 'the scene after the battle did not finish the chapter');
    check(await p.evaluate(() => window.__g.readSave() === null && window.__g.C1X.chEnd === 1), 'Chapter 1 end did not clear the save');
    await wait(8500);
    check(await p.evaluate(() => window.__g.RESULTS.ch === 'ch1' && !!window.__g.RESULTS.r), 'the Chapter 1 results card did not appear');
    await wait(4500); await p.screenshot({ path: path.join(SHOTS, `ch1-results-${vp}.png`) });
  },
  async 'garden-door-into-shop'(p) {
    check(await p.evaluate(() => window.__g.shopFree(1150, 640)), 'the shop arrival spot is not walkable');
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.INTRO.fade = 0; g.INTRO.ui = 1; g.HINT.on = false; g.DLG.active = false; g.becomeCosmic(0, 160, 1); g.tryEnterShop({ x: 0, y: 52 }); }); await wait(2200);
    const front = await p.evaluate(() => { const g = window.__g; g.DLG.active = false; return { scene: g.SCENE, x: Math.round(g.lum.x), y: Math.round(g.lum.y) }; });
    check(front.scene === 'shop' && front.x === 300 && front.y === 700, 'the front door did not land by the grinder bench: ' + JSON.stringify(front));

    await wait(2500);
  },
  async 'prologue-demon-god'(p) {
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.INTRO.fade = 0; g.INTRO.ui = 1; g.HINT.on = false; g.DLG.active = false; g.NIGHT.on = true; g.enterWoods(); g.becomeCosmic(700, 640, 1); }); await wait(1500);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.WEV.fk = 1; g.WEV.foka = 3.2; g.talk([['Fokalur', 'Thank you, foolish apprentice. Your body will serve as a suitable vessel.']]); }); await wait(1600);
    check(await p.evaluate(() => window.__g.IMGX.fokalur === undefined && !!window.__g.IMGX.fokalur_hd), 'the old Demon God sprite is still loaded');
  },
  async 'moon-charm-kept'(p) {
    // returning Vane's cross from the satchel must not take Lum's equipped Moon Charm
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.PARTY.lum.charm = 'mooncharm'; g.BAG.push('vanecharm'); g.vaneTrade(); }); await wait(300);
    const r = await p.evaluate(() => ({ charm: window.__g.PARTY.lum.charm, cross: window.__g.BAG.includes('vanecharm') }));
    check(r.charm === 'mooncharm' && !r.cross, 'Moon Charm lost when returning the cross: ' + JSON.stringify(r));
    // and wearing the cross: it comes off, nothing else is lost
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.PARTY.lum.charm = 'vanecharm'; g.vaneTrade(); }); await wait(300);
    check(await p.evaluate(() => window.__g.PARTY.lum.charm === null), 'the worn cross was not handed back');
  },
  async 'slug-king-night'(p) {
    // the Slug King still fights at night (other slugs sleep)
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.INTRO.fade = 0; g.INTRO.ui = 1; g.HINT.on = false; g.DLG.active = false; g.NIGHT.on = true; g.becomeCosmic(0, 900, 1); g.spawnKing(false); const k = g.SLUGS.find(s => s.kind === 'slugking'); k.calm = 0; k.x = g.lum.x + 40; k.y = g.lum.y; }); await wait(1500);
    check(await p.evaluate(() => window.__g.BATTLE.on || window.__g.BATTLE.pending), 'the Slug King did not start a battle at night');
  },
  async 'garden-hedge-cut'(p) {
    await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.INTRO.fade = 0; g.INTRO.ui = 1; g.HINT.on = false; g.DLG.active = false; g.NIGHT.on = true; g.becomeCosmic(0, 1490, 1); }); await wait(1200);
    const near = () => window.__g.ESTATE.filter(o => o.t === 'shrub' && Math.abs(o.x - 20) < 135 && o.y > 1575 && o.y < 1720).length;
    check(await p.evaluate(() => window.__g.ESTATE.some(o => o.t === 'shrub' && o.x === 20 && o.y === 1612)), 'no bush across the path before the cut');
    await p.evaluate(() => { const g = window.__g; g.NIGHT.on = false; }); await wait(900);
    await p.screenshot({ path: path.join(SHOTS, 'garden-path-blocked-' + (p.viewportSize().width < 600 ? 'phone' : 'desktop') + '.png') });
    await p.evaluate(() => { window.__g.NIGHT.on = true; });
    check(await p.evaluate(near) > 0, 'the hedge wall is missing before the cut');
    await p.evaluate(() => window.__g.cutHedge()); await wait(1500);
    check(await p.evaluate(near) === 0 && !(await p.evaluate(() => window.__g.ESTATE.some(o => o.t === 'shrub' && Math.abs(o.x + 106) < 25 && Math.abs(o.y - 1608) < 25))), 'the weeping shrub over the path is still there after the cut');
    await p.evaluate(() => { window.__g.DLG.active = false; }); await wait(1500);
  },
  async 'garden-sealed-side-door'(p) {
    const line = await p.evaluate(() => { const g = window.__g; g.INTRO.on = false; g.INTRO.waiting = false; g.DLG.active = false; const d = g.INTERACTABLES.find(o => /powerful magic/.test(String(o.onInteract))); if (!d) return null; d.onInteract(); return g.DLG.active ? g.DLG.lines[0][1] : (g.lum.quip || ''); });
    check(/shut by a powerful magic/.test(line || ''), 'the side door did not say it is sealed: ' + line);
  },

  async 'ch1-scoring'(p) {
    const r = await p.evaluate(() => { const g = window.__g, C = g.C1X, S = g.STATS, F = ['dunChest', 'foxRing', 'foxHood', 'lairBoss', 'bigVixen'];
      Object.assign(S, { time: 1800, atk: 10, nice: 10, foeAtk: 10, guards: 10, kos: 0 });
      F.forEach(f => C[f] = 1); const all = g.ch1Score();
      C.foxHood = 0; const four = g.ch1Score();
      return { all: all.stars, allFox: all.fox, four: four.stars, k5: g.ch1Keepsake(5).id, k4: g.ch1Keepsake(4).id, k3: g.ch1Keepsake(3).id, k2: g.ch1Keepsake(2.5) }; });
    check(r.all === 5 && r.allFox === 5, 'a perfect run with every Fox item should be 5 stars: ' + JSON.stringify(r));
    check(r.four <= 4.5, 'missing a Fox item still gave 5 stars');
    check(r.k5 === 'foxtotem' && r.k4 === 'foxpendant' && r.k3 === 'foxtails' && r.k2 === null, 'wrong keepsake charms: ' + JSON.stringify(r));
    const stole = await p.evaluate(() => { const g = window.__g, rnd = Math.random; g.PARTY.lum.charm = 'foxtotem'; const b = g.MATS.slimeparts || 0; Math.random = () => 0.1; g.foxRingSteal({ type: 'slime', x: 0, y: 0 }); Math.random = rnd; return (g.MATS.slimeparts || 0) - b; });
    check(stole === 1, 'the Carved Fox Totem did not steal on a successful roll');
  },
  async 'chapter-select-lock'(p) {
    const vp = p.viewportSize().width < 600 ? 'phone' : 'desktop';
    await p.evaluate(() => { localStorage.removeItem('lums-magic-shop-progress'); window.__g.openChapterSelect(); }); await wait(900);
    check(await p.evaluate(() => window.__g.CHAPTERS.map(c => c.id).join(',')) === 'prologue,ch1', 'chapter list should be Prologue and Chapter 1 only');
    await p.screenshot({ path: path.join(SHOTS, `chapter-select-locked-${vp}.png`) });
    check(await p.evaluate(() => { const g = window.__g; g.chselPick(1); return g.CHSEL.confirm === null && /unlock/.test(g.CHSEL.note); }), 'Chapter 1 could be picked before finishing the Prologue');
    await p.evaluate(() => { localStorage.setItem('lums-magic-shop-progress', JSON.stringify({ prologue: { done: 1, best: 5 }, ch1: { done: 1, best: 4 } })); const g = window.__g; g.CHSEL.noteT = 0; g.CHSEL.t = 1; }); await wait(700);
    await p.screenshot({ path: path.join(SHOTS, `chapter-select-open-${vp}.png`) });
    check(await p.evaluate(() => { const g = window.__g; g.chselPick(1); return g.CHSEL.confirm === 1; }), 'Chapter 1 stayed locked after finishing the Prologue');
  },
  async 'battle-ko-fade'(p) {
    await startCh1(p);
    await p.evaluate(() => window.__g.startEncounter({ kind: 'spider', scene: 'dun', x: 0, y: 0, s: 1, pack: 1, calm: 0 }, 'normal'));
    for (let i = 0; i < 50; i++) { await wait(150); if (await p.evaluate(() => window.__g.BATTLE.phase) === 'heroMenu') break; }
    await p.evaluate(() => { const B = window.__g.BATTLE; const h = B.heroes.find(h => h.id === 'lum'); h.ko = 1; B.foes[0].dead = .001; }); await wait(1400);
    const r = await p.evaluate(() => { const B = window.__g.BATTLE; return { koF: B.heroes.find(h => h.id === 'lum').koF, dead: B.foes[0].dead }; });
    check(r.koF >= 0.9, 'a knocked-out Lum did not fade away: ' + JSON.stringify(r));
    check(r.dead > 0.72, 'the spider did not finish fading: ' + JSON.stringify(r));
  },
  async 'spar'(p) {
    const vp = p.viewportSize().width < 600 ? 'phone' : 'desktop';
    await p.evaluate(() => window.__g.startThornPreview()); await wait(1500);
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.THFOES.length = 0; const R = g.JAKRESTX; let best = null; for (let dx = -260; dx <= 260; dx += 20) for (let dy = -40; dy <= 220; dy += 20) { const x = R.x + dx, y = R.y + dy, d = Math.hypot(dx, dy); if (d > 110 && g.thornFree(x, y) && (!best || d < best.d)) best = { x, y, d }; } g.lum.x = best.x; g.lum.y = best.y; g.lum.face = R.x < best.x ? -1 : 1; }); await wait(1500);
    await p.screenshot({ path: path.join(SHOTS, `spar-resting-${vp}.png`) });
    await p.evaluate(() => { const g = window.__g; g.DLG.active = false; g.jakJoin(); g.C1X.fkDone = 1; g.enterClearing(); g.lum.x = g.CLR.x0 + 300; g.lum.y = g.CLR.cy; }); await wait(600);
    // walk east so he follows
    await p.evaluate(() => { const g = window.__g; g.lum.x = g.TMZX.start === undefined ? g.lum.x : g.lum.x; }); for (const k of ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp']) { await p.keyboard.down(k); await wait(450); await p.keyboard.up(k); }
    await wait(400);
    const f = await p.evaluate(() => { const g = window.__g; return { inParty: g.PARTY_ORDER.join(','), moved: !!g.JAKFX && Math.round(Math.hypot(g.JAKFX.x - g.JAKRESTX.x, g.JAKFX.y - g.JAKRESTX.y)), near: !!g.JAKFX && Math.round(Math.hypot(g.lum.x - g.JAKFX.x, g.lum.y - g.JAKFX.y)) }; });
    check(f.inParty === 'lum,spar' && f.moved > 30 && f.near < 220, 'Spar did not join and follow Lum: ' + JSON.stringify(f));
    await p.screenshot({ path: path.join(SHOTS, `spar-follow-${vp}.png`) });
    // Spar can lead, alone
    await p.evaluate(() => { const g = window.__g; g.becomeSpar(g.lum.x, g.lum.y, 1, false); }); await wait(300);
    for (const k of ['ArrowRight', 'ArrowDown']) { await p.keyboard.down(k); await wait(500); await p.keyboard.up(k); } await wait(300);
    await p.screenshot({ path: path.join(SHOTS, `spar-leads-lum-${vp}.png`) });
    await p.evaluate(() => { const g = window.__g; g.becomeSpar(g.lum.x, g.lum.y, 1, true); }); await wait(300);
    await p.keyboard.down('ArrowDown'); await wait(500); await p.keyboard.up('ArrowDown'); await wait(200);
    check(await p.evaluate(() => window.__g.PC === 'spar' && window.__g.PARTY_ORDER.join(',') === 'spar'), 'Spar could not lead alone');
    await p.screenshot({ path: path.join(SHOTS, `spar-leader-${vp}.png`) });
    await p.evaluate(() => window.__g.startEncounter({ kind: 'spider', scene: 'thorn', x: 0, y: 0, s: 1, pack: 1, calm: 0 }, 'normal'));
    for (let i = 0; i < 50; i++) { await wait(150); if (await p.evaluate(() => window.__g.BATTLE.phase) === 'heroMenu') break; }
    check(await p.evaluate(() => window.__g.BATTLE.heroes.map(h => h.id).join(',')) === 'spar', 'Spar did not fight alone');
    // sword attack: runs right toward the foe, winds up, swings forward (no running backwards)
    const ox0 = await p.evaluate(() => { const g = window.__g; g.startBonk(); return g.BATTLE.heroes[0].ox; }); await wait(200);
    await p.screenshot({ path: path.join(SHOTS, `spar-attack-run-${vp}.png`) });
    check(await p.evaluate(o => window.__g.BATTLE.heroes[0].ox > o, ox0), 'Spar did not run toward the foe');
    for (let i = 0; i < 30 && await p.evaluate(() => window.__g.BATTLE.phase) !== 'bonkHit'; i++) await wait(60);
    await wait(150); await p.screenshot({ path: path.join(SHOTS, `spar-attack-swing-${vp}.png`) });
    for (let i = 0; i < 80 && await p.evaluate(() => window.__g.BATTLE.phase) !== 'heroMenu'; i++) await wait(150);
    await p.evaluate(() => { window.__g.C1X.comboS = 5; }); await wait(1800);
    await p.screenshot({ path: path.join(SHOTS, `spar-battle-${vp}.png`) });
    check(await p.evaluate(() => window.__g.battleMenuOpts().some(o => o[0] === 'burst' && o[1] === 'Blazing Edge')), 'no Blazing Edge combo at 5 stars');
    await p.evaluate(() => { const g = window.__g, B = g.BATTLE; B.phase = 'sflame'; B.t = 0; B.burstDone = 0; }); await wait(800);
    await p.screenshot({ path: path.join(SHOTS, `spar-blazing-edge-${vp}.png`) });
  },
  async 'battle-loot-resets'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.BATTLE.loot = ['slimeparts']; g.BATTLE.rewarded = 1;
      g.startEncounter({ kind: 'wisp', scene: 'dun', x: 0, y: 0, s: 1, pack: 1, calm: 0 }, 'normal'); });
    for (let i = 0; i < 40 && !(await p.evaluate(() => window.__g.BATTLE.on)); i++) await wait(100);
    const r = await p.evaluate(() => ({ loot: window.__g.BATTLE.loot.length, rewarded: window.__g.BATTLE.rewarded }));
    check(r.loot === 0 && r.rewarded === 0, 'last battle\'s loot carried into a new battle: ' + JSON.stringify(r));
  },
  async 'spar-resting-closeup'(p) {
    if (p.viewportSize().width > 600) return;
    await p.evaluate(() => window.__g.startThornPreview()); await wait(1500);
    await p.evaluate(() => { const g = window.__g, R = g.JAKRESTX; g.DLG.active = false; g.THFOES.length = 0; g.lum.x = R.x + 70; g.lum.y = R.y - 10; }); await wait(3800);
    await p.evaluate(() => { window.__g.DLG.active = false; }); await wait(300);
    await p.screenshot({ path: path.join(SHOTS, 'spar-resting-closeup.png') });
  },
  async 'deeproot-sleeping-fox'(p) {
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.C1X.bigVixen = 0; g.enterDun(5, 900, 600, -1);
      for (let i = g.DFOES.length - 1; i >= 0; i--) if (g.DFOES[i].kind !== 'bigvixen') g.DFOES.splice(i, 1); }); await wait(1500);
    const fox = await p.evaluate(() => { const f = window.__g.DFOES.find(f => f.kind === 'bigvixen'); return f && { face: f.face, asleep: f.asleep }; });
    check(fox && fox.asleep, 'sleeping fox missing from Deeproot');
    check(fox.face > 0, 'sleeping fox turned to face Lum instead of facing right');
  },
};

const browser = await chromium.launch();
let failed = 0;
for (const [name, run] of Object.entries(CASES)) {
  if (only && name !== only) continue;
  for (const [vp, size] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage({ viewport: size });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    try {
      await page.goto(URL_);
      await page.waitForFunction(() => window.__g, null, { timeout: 15000 }); await wait(1200);
      await run(page);
      check(!errors.length, 'page errors: ' + errors.slice(0, 3).join(' | '));
      console.log(`  ok    ${name} (${vp})`);
    } catch (e) {
      failed++; console.log(`  FAIL  ${name} (${vp}): ${e.message}`);
    }
    await page.screenshot({ path: path.join(SHOTS, `${name}-${vp}.png`) }).catch(() => {});
    await page.close();
  }
}
await browser.close(); server.close();
console.log(failed ? `\n${failed} failed — see tests/screenshots/` : '\nall passed — screenshots in tests/screenshots/');
process.exit(failed ? 1 : 0);
