/* WonderLand V49: fast activation, comprehensive offline bundle on demand */
const VERSION='wonderland-v49';
const ROOT=new URL('./',self.location.href);
const asset=s=>new URL(s,ROOT).href;
const SHELL=asset('./index.html');
const FILES=["./LPW_ASSET_MANIFEST.json","./LPW_ASSET_MANIFEST_v40.json","./LPW_V44_ASSET_MANIFEST.json","./LPW_VISUAL_MANIFEST_v41.json","./LPW_VISUAL_MANIFEST_v43.json","./anti-zoom-v49.js?v=49","./app.js?v=49","./art-rebuild.js?v=35","./assets/icon.svg","./assets/learning/apple.svg","./assets/learning/banana.svg","./assets/learning/bird.svg","./assets/learning/butterfly.svg","./assets/learning/carrot.svg","./assets/learning/cat.svg","./assets/learning/cherry.svg","./assets/learning/dog.svg","./assets/learning/duck.svg","./assets/learning/elephant.svg","./assets/learning/fish.svg","./assets/learning/flower.svg","./assets/learning/grapes.svg","./assets/learning/lemon.svg","./assets/learning/lion.svg","./assets/learning/orange.svg","./assets/learning/pear.svg","./assets/learning/rabbit.svg","./assets/learning/star.svg","./assets/learning/tiger.svg","./assets/raesya-main-header.webp","./assets/rizqi-header.webp","./assets/rizqi-mobile.webp","./curriculum-bank.json","./full-content.js?v=31","./full-features.js?v=31","./game-improvements.js?v=34","./game-polish.js?v=44","./index.html","./little-picture-engine.js?v=44","./lpw-v44-assets.js?v=44","./manifest.webmanifest","./mobile-fix-v45.js?v=49","./offline-ready-v48.js","./premium-ui.js?v=37","./revision.js?v=31","./styles.css?v=49","./offline-assets-v49.json"];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 // Do NOT download the multi-MB game scripts during install; Safari may abort activation.
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('message',e=>{
 if(e.data?.type==='CHECK_OFFLINE')e.waitUntil((async()=>{
  const cache=await caches.open(VERSION);const missing=[];
  for(const f of FILES){if(!(await cache.match(asset(f))))missing.push(f)}
  const ready=missing.length===0;
  try{e.ports[0]?.postMessage({ready,missing,version:VERSION,total:FILES.length})}catch(_){}
 })());
 if(e.data?.type==='CLEAN_OLD_CACHES')e.waitUntil((async()=>{
  const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('wonderland-v15-offline-')&&k!==VERSION).map(k=>caches.delete(k)));
 })());
});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;
 const u=new URL(req.url);if(u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 e.respondWith((async()=>{
  const cache=await caches.open(VERSION);
  if(req.mode==='navigate'){
    try{const net=await fetch(req);return net}catch(_){return await cache.match(SHELL)||new Response('Please reconnect once and tap Prepare Offline in WonderLand.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
  }
  const stored=await cache.match(req);if(stored)return stored;
  try{const net=await fetch(req);if(net.ok)try{await cache.put(req,net.clone())}catch(_){}return net}catch(_){return Response.error()}
 })());
});
