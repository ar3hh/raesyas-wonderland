Little Picture World v40 — progress package, NOT the final premium visual upgrade.

This build keeps the v39 anti-repeat improvements, and adds an optional art loader.
When a correctly named WebP file is in assets/premium/little-picture/ and is at least 256x256, it is displayed with object-fit: contain. Otherwise the existing illustration is retained so the game remains playable.

WARNING: No new premium 3D artwork is included. Image generation attempts generated game mockups with UI instead of individual objects, which cannot safely be repurposed as game art.

Do not deploy expecting upgraded visuals. Use this only as an integration-ready code checkpoint.

The game uses 20 existing objects; two consecutive 10-question decks can exhaust all 20. After that, recurrence is unavoidable until the image bank is expanded.

Existing other V15 features are carried over without intended changes.
