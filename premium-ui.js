
'use strict';
/* Batch 4: polished interactive UI. Year 3/4 and Art Studio untouched. */
(function(){
 const oldRizqiView = fullRizqiView;
 const oldGamesView = fullGamesView;
 let cachedAnswerKey='', cachedOptions=[];
 function paletteChoices(correct, kind, amount){
  const key=kind+'|'+correct+'|'+amount+'|'+(fullRizqi?.level||1)+'|'+(fullRizqi?.idx||0);
  if(key!==cachedAnswerKey){
   cachedAnswerKey=key;
   const pool=B3_PICTURES.filter(s=>s!==correct);
   cachedOptions=b3Shuffle([correct,...b3Shuffle(pool).slice(0,amount-1)]);
  }
  return cachedOptions;
 }
 function hero(title,kicker,sub){return `<div class="p37-banner"><div class="p37-stars" aria-hidden="true">✦ ✧ ✦</div><span class="p37-small">${kicker}</span><h2 class="p37-title">${title}</h2><p class="p37-sub">${sub}</p></div>`}
 function img(word){return `<div class="p37-image-stage">${b3DataPicture(word.toLowerCase(),'Picture of an object')}</div>`}
 fullRizqiView=function(m){
   if(state.detail!=='picture')return oldRizqiView(m);
   if(!fullRizqi || fullRizqi.kind!=='picture')fullRizqi=fullNewRizqi('picture');
   const g=fullRizqi;
   if(!Array.isArray(g.pairs)||!g.pairs.length)g.pairs=b3Shuffle(B3_PICTURES).slice(0,10).map(x=>[x,x.toLowerCase()]);
   const word=g.pairs[g.idx%g.pairs.length][0];
   const count=Math.min(4,Math.max(2,(Number(g.level)||1)+1));
   const options=paletteChoices(word,'picture',count);
   return `<section class="panel app-screen module-shell improved-module">${head(m)}<div class="p37-wrap">
     ${hero('Little Picture World','RIZQI EXPLORER','Level '+g.level+' · Picture '+(g.idx+1)+' of 10')}
     <h3 class="p37-quiz-heading">What is this?</h3>
     ${img(word)}<div class="p37-answers">${options.map(x=>`<button type="button" class="p37-answer" data-improve-rizqi="${qSafe(x)}">${qSafe(x)}</button>`).join('')}</div>
     <div class="p37-note">Look at the picture and tap the right word.</div><p id="rizqiFeedback" class="game-feedback" role="status"></p>
     </div></section>`;
 };
 fullGamesView=function(m){
   if(state.detail!=='spelling')return oldGamesView(m);
   if(!fullGame||fullGame.kind!=='spelling'){
     b3SpellingDeck=b3Shuffle(B3_PICTURES.map(x=>x.toUpperCase()));
     b3SpellingDone=0;b3SpellingCompleted=false;fullGame=b3SpellingWord();
   }
   if(b3SpellingCompleted)return `<section class="panel app-screen module-shell improved-module">${head(m)}<div class="p37-wrap">${hero('Picture Spelling','WONDERLAND GAMES','Great work!')}<div class="p37-finish"><h2>Brilliant!</h2><p>You finished ${b3SpellingDone} different pictures!</p><button class="p37-action primary" type="button" data-b3-restart>Play again</button></div></div></section>`;
   const buttons=[10,20].map(n=>`<button type="button" class="p37-count ${n===b3SpellingTarget?'selected':''}" data-b3-count="${n}">${n} Pictures</button>`).join('');
   return `<section class="panel app-screen module-shell improved-module">${head(m)}<div class="p37-wrap">
     ${hero('Picture Spelling Challenge','WONDERLAND GAMES','Look at the picture and spell the English word!')}
     <div class="p37-progress"><span class="p37-badge">Picture ${b3SpellingDone+1} / ${b3SpellingTarget}</span>${buttons}</div>
     <div class="p37-spell-card">${img(fullGame.picture)}<label for="gameWord" class="p37-input-label">Type the word</label>
     <input id="gameWord" class="p37-spell-input" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Your answer" aria-label="Type the English spelling">
     <div class="p37-actions"><button type="button" class="p37-action primary" data-improve-check>Check Answer</button><button type="button" class="p37-action" data-improve-hint>First Letter Hint</button></div><p id="gameFeedback" class="game-feedback" role="status"></p></div>
     </div></section>`;
 };
 document.getElementById('view').addEventListener('keydown',function(e){
   if(e.key==='Enter' && state.view==='games' && state.detail==='spelling' && e.target.id==='gameWord'){
     e.preventDefault();document.querySelector('[data-improve-check]')?.click();
   }
 });
})();
