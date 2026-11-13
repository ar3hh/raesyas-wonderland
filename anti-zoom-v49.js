/* V49: guard multitouch pinch and double-tap without cancelling single-finger game gestures. */
(function(){'use strict';
 if(!('ontouchstart' in window))return;
 document.addEventListener('gesturestart',function(e){e.preventDefault();},{passive:false});
 document.addEventListener('gesturechange',function(e){e.preventDefault();},{passive:false});
 document.addEventListener('touchmove',function(e){if(e.touches.length>1)e.preventDefault();},{passive:false,capture:true});
 var lastEnd=0;
 document.addEventListener('touchend',function(e){
  if(e.changedTouches.length!==1||e.touches.length)return;
  var tag=e.target && e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]');
  if(tag){lastEnd=0;return;}
  var now=Date.now();
  if(now-lastEnd<290){e.preventDefault();lastEnd=0;}else lastEnd=now;
 },{passive:false});
})();
