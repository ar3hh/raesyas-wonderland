/* V49 offline preparation. Distinct devices keep their own local progress. */
(function(){'use strict';
const VERSION='wonderland-v49';
const ID='wonderland-offline-v49';
let busy=false,files=[];
function show(message,ok,working){
 // Keep the play screen clear whenever offline files are ready.
 if(ok){const existing=document.getElementById(ID);if(existing)existing.remove();return;}
 let root=document.getElementById(ID);
 if(!root){root=document.createElement('div');root.id=ID;root.setAttribute('role','status');
 root.style.cssText='position:fixed;bottom:calc(8px + env(safe-area-inset-bottom,0px));left:8px;right:8px;z-index:99998;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;color:#18324c;border:2px solid #dbc7f8;border-radius:14px;padding:9px 11px;font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 4px 20px #0002';
 const txt=document.createElement('span');txt.id=ID+'-text';root.appendChild(txt);
 const btn=document.createElement('button');btn.id=ID+'-button';btn.type='button';btn.style.cssText='background:#6555b4;color:#fff;border:0;border-radius:12px;padding:9px 12px;font:600 12px sans-serif;touch-action:manipulation';btn.onclick=()=>prepare(true);root.appendChild(btn);document.body.appendChild(root)}
 root.querySelector('#'+ID+'-text').textContent=(ok?'✅ ':working?'🔄 ':'⚠️ ')+message;
 const b=root.querySelector('#'+ID+'-button');b.textContent=working?'Saving…':ok?'Recheck':'Prepare Offline';b.disabled=!!working;b.style.opacity=working?'.6':'1';
}
async function loadList(){
 const response=await fetch('./offline-assets-v49.json',{cache:'no-store'});if(!response.ok)throw Error('Missing file list ('+response.status+')');
 const list=await response.json();if(list.version!==VERSION||!Array.isArray(list.files))throw Error('Offline list version mismatch');
 return list.files.concat(['./offline-assets-v49.json']);
}
async function getCacheState(list){const cache=await caches.open(VERSION);const missing=[];
 for(const item of list){if(!(await cache.match(new URL(item,location.href).href)))missing.push(item)}return missing;
}
async function saveItem(path){
 const url=new URL(path,location.href).href;const c=await caches.open(VERSION);
 if(await c.match(url))return;
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
 try{const r=await fetch(url,{cache:'reload',signal:controller.signal});if(!r.ok)throw Error('HTTP '+r.status+' '+path);await c.put(url,r.clone())}finally{clearTimeout(timeout)}
}
async function prepare(force){if(busy)return;busy=true;
 try{
 if(location.protocol==='file:'){show('Laptop: files are local. Open index.html; no Wi-Fi needed.',true,false);return}
 if(!('serviceWorker' in navigator)||!('caches' in window))throw Error('Offline storage unavailable. Use Safari/Chrome via HTTPS.');
 show('Checking Offline V49…',false,true);
 const reg=await navigator.serviceWorker.register('./service-worker.js?v=49',{scope:'./'});
 // No waiting on navigator.serviceWorker.ready: old broken workers can stall this indefinitely.
 if(force)try{await reg.update()}catch(_){}
 files=await loadList();
 let missing=await getCacheState(files);
 if(!missing.length){show('Offline Ready — iPhone & laptop',true,false);return}
 if(!navigator.onLine){show('Connect internet once, then tap Prepare Offline',false,false);return}
 let done=files.length-missing.length;const errors=[];
 show('Preparing offline '+done+'/'+files.length+'…',false,true);
 let next=0;const concurrency=3;
 await Promise.all(Array.from({length:concurrency},async()=>{while(next<missing.length){const path=missing[next++];let success=false;
 for(let attempt=0;attempt<2&&!success;attempt++){try{await saveItem(path);success=true}catch(e){if(attempt===1)errors.push(path)}}
 if(success)done++;show('Preparing offline '+done+'/'+files.length+'…',false,true);
 }}));
 missing=await getCacheState(files);
 if(missing.length){show('Offline incomplete ('+missing.length+' files). Tap retry with internet ON.',false,false);console.warn('Offline files still missing:',missing,errors)}
 else{show('Offline Ready — boleh cuba Airplane Mode',true,false);const worker=reg.active||navigator.serviceWorker.controller;if(worker)worker.postMessage({type:'CLEAN_OLD_CACHES'});}
 }catch(err){show('Offline not ready: '+String(err.message||err).slice(0,90),false,false);console.warn('WonderLand V49 offline:',err)}finally{busy=false}
}
function start(){prepare(false)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('online',()=>{if(!busy)prepare(false)});
})();
