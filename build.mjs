// Builds the game into dist/ — run with `node build.mjs` (Vercel runs this on every push).
// src/index.html is the page; src/game/*.js are joined in file-name order into its <script>.
// Every image in public/assets is cache-busted with a content hash (?v=…) and listed in ASSETS by name,
// so adding new art is just: drop a .webp into public/assets and use IMG.<name> in the game.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const R = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(R, 'public'), dist = path.join(R, 'dist'), gameDir = path.join(R, 'src/game');
const ref = f => `${f}?v=${crypto.createHash('sha1').update(fs.readFileSync(path.join(pub, f))).digest('hex').slice(0, 10)}`;

// sprite atlases are passed in separately, everything else goes into the ASSETS map
const ATLASES = { __ATLAS__: 'lum_atlas_v5', __COSMIC__: 'cosmic_atlas', __SLUG__: 'slug_atlas' };
const atlasNames = new Set(Object.values(ATLASES));
const assets = {};
for (const f of fs.readdirSync(path.join(pub, 'assets')).filter(f => f.endsWith('.webp')).sort()) {
  const n = f.slice(0, -5);
  if (!atlasNames.has(n)) assets[n] = ref('assets/' + f);
}

let js = fs.readdirSync(gameDir).filter(f => f.endsWith('.js')).sort()
  .map(f => fs.readFileSync(path.join(gameDir, f), 'utf8')).join('');
js = js.replace('__ASSETS__', JSON.stringify(assets));
for (const [tok, name] of Object.entries(ATLASES)) js = js.replace(tok, ref(`assets/${name}.webp`));

const page = fs.readFileSync(path.join(R, 'src/index.html'), 'utf8');
if (!page.includes('/*__GAME_JS__*/\n')) throw new Error('src/index.html lost its /*__GAME_JS__*/ marker');

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(pub, dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), page.replace('/*__GAME_JS__*/\n', () => js));
console.log(`built dist/index.html (${(fs.statSync(path.join(dist, 'index.html')).size / 1024).toFixed(0)} KB, ${Object.keys(assets).length + 3} images)`);
