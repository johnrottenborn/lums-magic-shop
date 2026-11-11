# Lum's Magic Shop — notes for Claude

A whimsical storybook adventure game (HTML canvas, plain JavaScript, no framework), played in portrait on phones and on desktop.
Live at https://lums-magic-shop.vercel.app. Story and lore: `docs/story.md`. Making new art game-ready: `docs/art-pipeline.md`.

## How the code is laid out

- `src/index.html` is the page (meta tags, CSS, the canvas). Its `/*__GAME_JS__*/` marker is where the game code goes.
- `src/game/*.js` is the game, split by job. `build.mjs` joins them **in file-name order** into one classic `<script>`, so every file shares one global scope. A function in one file can call any function in another. Keep the number prefixes and put new code where its job lives.
- `public/assets/*.webp` holds the game-ready images. Every file there is loaded automatically as `IMG.<name>` (the file name without `.webp`). To add art, drop a .webp in this folder.
- `art/hq/` holds full-resolution masters for redoing art. `tools/art-pipeline/` holds old one-off scripts used to cut and clean sprite sheets; they are for reference only, and their paths point at a workspace that no longer exists.
- `dist/` is build output. Never edit it and never commit it.

| File | What's in it |
|---|---|
| 00-boot | canvas setup, image loading, the `IMG` / atlas / `ASSET_SRC` tables, small helpers |
| 01-clearing | painted forest clearing, creek, koi pond, willows, sunbeams, birds, placed scenery |
| 02-player-input | Lum/Cosmic movement, touch and keyboard input, A (spell) and B (interact), spray effects |
| 03-garden | the cottage grounds: estate objects, shrubs, collisions, cobbled path, road south |
| 04-cosmic-and-dialogue | Cosmic's wandering AI, `talk`/`say` conversations, fairies, wisps, the opening scene |
| 05-audio | all music and sound (synthesised live with Web Audio, no sound files) |
| 06-hints-and-slugs | tutorial hints, garden slugs |
| 07-conservatory | the Runic Conservatory under the well |
| 08-equipment-and-icons | `ITEMS`, gear slots, `equip`/`unequip`, item icons, the HUD book button and toast |
| 09-spellbook | the spellbook menu (party portraits, character page, satchel, item card, potion target picker) |
| 10-conservatory-slimes | prologue slimes |
| 11-battle | the battle engine: `startEncounter`, turn phases, action commands, combo meter (`COMBO_MAX`), battle drawing, battle music |
| 12–16 | prologue rooms: study, shed, sunken shrine, Lum's shop, bedroom |
| 17-woods-and-cemetery | Whispering Woods, roads, cemetery, the restless dead, the seal |
| 18-save | save/continue and save migrations (bump `SAVE_VER` and add a migration when a change could break old saves) |
| 19-storm-results-chapter-select | the storm, prologue results card, chapter select, Slug King |
| 20-ch1-start-and-woods | Chapter 1 start (`C1` state), sprite atlases (`C1ATL`, `c1Frame`), the woods the morning after, boot prints |
| 21-stranglethorn | Stranglethorn maze (`TMZ`), fog and atmosphere, spiders and webs, the lantern-less gate view |
| 22-jak-and-thorn-foes | Jak (resting, follower, joining), roaming Stranglethorn foes, the Broodmother boss |
| 23-battle-kit | powders (`POWDERS`), weaknesses (`WEAKTO`), foe special moves, hit effects, battle drawing for new foes |
| 24-vane-hut-and-mixing | Vane's hut and mixing at the fire |
| 25-ch1-opening-and-foraging | Chapter 1 opening cutscene, foraging, ingredients |
| 26-oak-hollow | the five-room root dungeon under the old oak |
| 27-update / 28-render / 29-loop | the main update, the main draw, and the frame loop plus `window.__g` (test hooks) |

To find something, grep `src/game` for the function or constant name. Don't read whole files.

## Working on it

- `npm run build` builds into `dist/`. `npm run serve` serves it at http://localhost:8765.
- `npm test` builds, then plays the key moments (boot, prologue bucket tutorial, Chapter 1 spellbook and potion, a battle, Stranglethorn) on a phone-sized and a desktop-sized screen, and saves screenshots to `tests/screenshots/`. Run it after every change and look at the screenshots that matter. Add a case to `tests/smoke.mjs` when you build something new.
- `window.__g` exposes game state and functions so tests can jump straight to a scene. Add new things there when tests need them.
- **Shipping:** commit and push to `main`. Vercel builds (`node build.mjs`, see `vercel.json`) and deploys to the live link on its own. Keep the live URL the same.
- Make small edits in place. Never rewrite a whole file.
- Sprites are drawn from atlases with `c1Frame(c, sheet, anim, i, x, y, h, flip, alpha, flash)`, using the frame data in `C1ATL`.

## Standing rules from the game's designer (always follow)

- The game must work on **mobile and desktop**, with the standard controls on each (touch: drag left side to walk, tap to interact; desktop: WASD/arrows, E/Enter, Space, I for the spellbook).
- **Chapter 1 must stay playable and selectable** from chapter select for playtesting. The prologue is final; don't change it unless asked.
- **Only use icon art the designer provided** for items and equipment. Don't draw item icons in code.
- **Enemies always face left and attack to the left.** If a sprite sheet row faces the wrong way, flip that row.
- **Lum and Vane face each other when talking.**
- **Lum is drawn at 85% size** (`LUMK = .85`).
- **Hand-emote pickups show only the "Added to your satchel" toast.** Never a Lum/player text box. Keep a line only if it matters to the story.
- **Never put subtitles on area titles.**
- **Screen changes always use the small black door emote** that the player must interact with. No automatic transitions.
- **Every combo move needs 5 stars** (`COMBO_MAX = 5`). Lum's combo is Starfall; Jak's is Staff Bolt.
- **Finishing a chapter removes Continue from the title menu.** Call `finishChapter('<id>')` (in 18-save) at the end of every chapter; the prologue already does. Chapter 1's ending must call it too when it is built.
- **From Chapter 1 on, Cosmic is always drawn holding the red Ancient Blade** (the `COS_BLADE` frames), never the plain `COS_ANIM` ones.
- **Chapter results:** each chapter ends with the shared results card (`RESCH` in 19-storm-results-chapter-select). Chapter 1 needs all five Fox items (Foxfire Pouch, Fox Ring, Fox Hood, Fox Suit, Vixenstep Boots) for 5 stars, and gives a keepsake charm for 3/4/5 stars (Fox Tail Charm +1 SPD / Fox Pendant +1 SPD +1 MAG / Carved Fox Totem +1 SPD +1 MAG and the Fox Ring's 50% First Strike steal). The best one is stored in progress (`bestCh1Keepsake()`); **Chapter 2 must start with it equipped**, like Chapter 1 does with the prologue's.
- The spellbook party row shows only members who have joined (1–4). No empty placeholders.
- Chapter 1 has no final name yet. The title card "The Morning After" and the chapter-select labels are placeholders.
- Talk the story through with the designer before building new story content. Ask before big changes.

## Characters at a glance

- **Lum**: party colour `#7a4f9a`. Fights with powders and uses potions; only she can mix at fires.
- **Jak**: colour `#7a5a32`. Lost traveller with a sack and an axe. Simple Axe (+1 ATK), Walking Stick (no stats), coat (+1 DEF). Base ATK 3, DEF 1, MAG 2, 20 HP.
- **Cosmic**: colour `#4a6fb5`. The prologue hero. He is gone in Chapter 1 (the Demon God Fokalur uses his body).
