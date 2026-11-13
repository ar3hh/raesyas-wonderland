(function(){
'use strict';
const ID='offline-ready-v47-status';
let busy=false;
function show(message,good=false){
 let el=document.getElementById(ID);
 if(!el){
  el=document.createElement('div');el.id=ID;el.setAttribute('role','status');
  el.style.cssText='position:fixed;bottom:calc(8px + env(safe-area-inset-bottom, 0px));left:8px;right:8px;z-index:99999;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;color:#18324c;border:2px solid #dbc7f8;border-radius:14px;padding:9px 11px;font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 4px 20px #0002;';
  const text=document.createElement('span');text.id=ID+'-text';el.appendChild(text);
  const btn=document.createElement('button');btn.textContent='Check';btn.type='button';btn.style.cssText='background:#6555b4;color:#fff;border:0;border-radius:12px;padding:7px 12px;font:600 12px sans-serif;';btn.onclick=()=>check(true);el.appendChild(btn);
  document.body.appendChild(el);
 }
 el.querySelector('#'+ID+'-text').textContent=(good?'✅ ':'🔄 ')+message;
}
function deadline(p,ms,label){
 return Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(new Error(label+' timeout')),ms))]);
}
function ask(worker){
 return new Promise(resolve=>{
  const channel=new MessageChannel();let done=false;
  const timer=setTimeout(()=>{if(!done){done=true;resolve({ready:false,reason:'worker response timeout'})}},8000);
  channel.port1.onmessage=e=>{if(!done){done=true;clearTimeout(timer);resolve(e.data)}};
  try{worker.postMessage({type:'CHECK_OFFLINE'},[channel.port2]);}
  catch(e){clearTimeout(timer);resolve({ready:false,reason:String(e)})}
 });
}
async function check(force){
 if(busy)return;busy=true;
 try{
  show('Checking offline files…');
  if(!navigator.serviceWorker||!window.caches)throw Error('Safari storage not available');
  let reg=await deadline(navigator.serviceWorker.register('./service-worker.js?v=48',{scope:'./'}),12000,'registration');
  // Explicit update when Check tapped, necessary for cache-first legacy installations.
  if(force){show('Updating offline worker…');await deadline(reg.update(),12000,'update');}
  show('Preparing offline files…');
  const ready=await deadline(navigator.serviceWorker.ready,20000,'worker activation');
  const worker=ready.active||navigator.serviceWorker.controller;
  if(!worker)throw Error('worker is not active');
  const result=await ask(worker);
  if(result.ready&&result.version==='wonderland-v15-offline-v48')show('Offline Ready — boleh cuba Airplane Mode',true);
  else show('Offline belum siap: '+(result.reason||('missing '+(result.missing||[]).length+' files')).slice(0,75));
 }catch(e){show('Offline belum siap: '+String(e.message||e).slice(0,75));console.warn('v48 offline:',e);}
 finally{busy=false;}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>check(false),{once:true});else check(false);
})();
