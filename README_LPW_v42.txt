Little Picture World v42 — broken images fix.

Nine premium WebP illustrations are embedded directly in little-picture-engine.js as base64. No separate premium image folder is required at deployment. The 13 remaining objects use existing embedded SVG/data images from game-improvements.js. If an image fails to decode, a visible status appears rather than a broken-image icon. Game rules, other modules and user data unchanged. Refresh after GitHub Actions Success, and if a service worker holds a stale old file, close all app tabs and reopen.
