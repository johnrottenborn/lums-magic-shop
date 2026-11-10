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
    await startCh1(p);
    await p.evaluate(() => { const g = window.__g; g.jakJoin(); g.DLG.active = false; g.BAG.push('potion'); }); await wait(200);
    await p.evaluate(() => { window.__g.DLG.active = false; window.__g.openMenu(); }); await wait(700);
    await p.evaluate(() => { const g = window.__g; g.MENU.page = 'bag'; g.MENU.sel = { kind: 'bag', i: g.BAG.indexOf('potion') }; }); await wait(300);
    await tapMenu(p, hits => hits.filter(h => h.h === 46)[0]); // Use
    check(await p.evaluate(() => !!window.__g.MENU.pick), 'Use did not ask who the potion is for');
    const before = await p.evaluate(() => window.__g.HEROES.jak.hp);
    await tapMenu(p, hits => { const top = hits.filter(h => h.y < -20); return top[top.length - 1]; }); // Jak's portrait
    const after = await p.evaluate(() => window.__g.HEROES.jak.hp);
    check(after > before, `potion did not heal Jak (${before} -> ${after})`);
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
