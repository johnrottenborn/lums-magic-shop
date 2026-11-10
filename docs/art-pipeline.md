# Making art game-ready

The designer sends art as images: sprite sheets, single props, icon sheets and backgrounds. This is how it becomes a game file.

## Icons and props

1. Crop each item from the sheet. Turn the white background transparent: alpha comes from how far each pixel is from white, roughly `alpha = clamp((248 - min(r,g,b)) / 36)`. Keep only the main connected shape, so stray specks drop out.
2. Pad to a square and save a full-size master to `art/hq/`.
3. Save a game copy as `public/assets/<name>.webp` (icons are 128–160 px, quality 88–90). The game loads it as `IMG.<name>` with no other wiring.
4. For an item, add it to `ITEMS` in `src/game/08-equipment-and-icons.js` and map its icon in `IMGICON`.

## Sprite sheets

1. Cut each cell and upscale it 4× with Real-ESRGAN (anime6B model, `pip install realesrgan`; weights from the Real-ESRGAN GitHub releases).
2. Matte it the same way as icons. Then cut out enclosed near-white pockets (min channel above 205 and saturation below 26) so no white halo is left.
3. Align the frames on a stable band (feet, or the torso for walking) so the character doesn't jitter.
4. Pack an atlas `.webp` plus frame data, and add an entry to `C1ATL` (`src/game/20-ch1-start-and-woods.js`). Draw it with `c1Frame`.
5. Every enemy animation must face **left**. Flip any row that faces right.

`tools/art-pipeline/` has the original scripts for each batch: Jak, foxes, Flora, trees, roses, axes, shields and so on. Use them as examples. Their file paths point at an old workspace and need adjusting before they'll run.
