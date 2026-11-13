WonderLand V15 Little Picture World v43 — 7 new 3D images + anti-repeat fixes.

New images: fish, pear, orange, carrot, rabbit, grapes, bird. Embedded WebP inside little-picture-engine.js; no missing image folder in deployment. Orange and bird are neatly framed from the generated 3D object grid.

Anti-repeat: 10 different answers per session, remember used answers in localStorage across sessions, use remaining images before returning to previously played images (current bank = 22). After 22 unique objects, some reuse is unavoidable. Preserves existing progress and does not touch other modules.

Upload all ZIP contents to GitHub repo root, replacing files with same name. Check Actions green, reload page. Back up V15 JSON before updates. If restarting the game repeatedly, note that incomplete sessions may restart the same questions; completed answers are remembered.

Syntax verified, archive verified. Live in-browser testing required.
