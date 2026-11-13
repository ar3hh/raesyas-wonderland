
'use strict';
/* iOS Safari touch/pointer drag for Magic Shape. Loaded after all existing game scripts. */
(function(){
 var view=document.getElementById('view');if(!view)return;
 var gesture=null,ghost=null,lastDragAt=0;
 function cleanup(){
  if(ghost&&ghost.parentNode)ghost.parentNode.removeChild(ghost);ghost=null;
  if(gesture&&gesture.source)gesture.source.classList.remove('touch-drag-active');
  var d=view.querySelectorAll('[data-shape-pick][data-dragging]');for(var i=0;i<d.length;i++)delete d[i].dataset.dragging;
  var s=view.querySelectorAll('.shape-drop-slot.shape-touch-over');for(var j=0;j<s.length;j++)s[j].classList.remove('shape-touch-over');
  gesture=null;
 }
 function moved(x,y){
  if(!gesture)return;
  if(Math.abs(x-gesture.startX)+Math.abs(y-gesture.startY)>9)gesture.moved=true;
  if(gesture.moved){
   if(!ghost){ghost=document.createElement('div');ghost.className='shape-touch-ghost';var svg=gesture.source.querySelector('svg');if(svg)ghost.appendChild(svg.cloneNode(true));document.body.appendChild(ghost);gesture.source.classList.add('touch-drag-active');}
   ghost.style.left=x+'px';ghost.style.top=y+'px';
   var slot=document.elementFromPoint(x,y);slot=slot&&slot.closest('[data-shape-drop]');
   var all=view.querySelectorAll('[data-shape-drop]');for(var i=0;i<all.length;i++)all[i].classList.toggle('shape-touch-over',all[i]===slot);
  }
 }
 function finish(x,y){
  if(!gesture)return;
  var moving=gesture.moved,name=gesture.name;
  var hit=document.elementFromPoint(x,y),slot=hit&&hit.closest('[data-shape-drop]');
  cleanup();
  if(!moving)return; // Existing tap-shape, then tap-board option still works.
  lastDragAt=Date.now();
  if(slot){
   if(name===slot.dataset.shapeDrop){if(typeof rizqiCorrect==='function')rizqiCorrect()}
   else if(typeof rizqiWrong==='function')rizqiWrong();
  }
 }
 view.addEventListener('pointerdown',function(e){
  if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;
  var b=e.target.closest('[data-shape-pick]');if(!b)return;
  cleanup();gesture={id:e.pointerId,name:b.dataset.shapePick,source:b,startX:e.clientX,startY:e.clientY,moved:false};
  if(typeof shapeDrag!=='undefined')shapeDrag=gesture.name;
  e.preventDefault();e.stopImmediatePropagation();
 },true);
 view.addEventListener('pointermove',function(e){
  if(!gesture||gesture.id!==e.pointerId)return;
  e.preventDefault();e.stopImmediatePropagation();moved(e.clientX,e.clientY);
 },true);
 view.addEventListener('pointerup',function(e){
  if(!gesture||gesture.id!==e.pointerId)return;
  e.preventDefault();e.stopImmediatePropagation();finish(e.clientX,e.clientY);
 },true);
 view.addEventListener('pointercancel',function(e){if(!gesture||gesture.id!==e.pointerId)return;e.stopImmediatePropagation();cleanup()},true);
 view.addEventListener('click',function(e){if(Date.now()-lastDragAt<600&&e.target.closest('[data-shape-pick],[data-shape-drop]')){e.preventDefault();e.stopImmediatePropagation()}},true);
 // iOS < 13 fallback where Pointer Events are unavailable.
 if(!window.PointerEvent){
  view.addEventListener('touchstart',function(e){var b=e.target.closest('[data-shape-pick]');if(!b)return;var t=e.changedTouches[0];gesture={id:t.identifier,name:b.dataset.shapePick,source:b,startX:t.clientX,startY:t.clientY,moved:false};e.preventDefault()}, {capture:true,passive:false});
  view.addEventListener('touchmove',function(e){if(!gesture)return;var t=e.changedTouches[0];e.preventDefault();moved(t.clientX,t.clientY)},{capture:true,passive:false});
  view.addEventListener('touchend',function(e){if(!gesture)return;var t=e.changedTouches[0];e.preventDefault();finish(t.clientX,t.clientY)},{capture:true,passive:false});
 }
})();
