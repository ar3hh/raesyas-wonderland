'use strict';
/* V15 scoped gameplay fix. No V14 files or saved marks touched. */
const B3_EXTRA_ART={};
const B3_SAFARI=['Lion','Tiger','Elephant','Rabbit','Cat','Dog','Duck','Bird','Fish','Butterfly'];
const B3_PICTURES=["Banana","Duck","Flower","Butterfly","Lemon","Tiger","Fish","Pear","Orange","Carrot","Rabbit","Grapes","Bird","Apple","Car","Bus","Ladybug","Frog","Cat","Dog","Panda","Cow","Horse","Sheep","Pig","Elephant","Soccer Ball","Basketball","Mushroom","Tree","Strawberry","Watermelon","Pineapple","Fire Truck","Dump Truck","Teddy Bear","Doll","Robot","Rocket","Kite","Helicopter","Sailboat","Seashell","Dolphin","Sun","Rainbow","Cherry","Lion","Star","Bicycle"];
let b3SpellingDeck=[],b3SpellingTarget=10,b3SpellingDone=0,b3SpellingCompleted=false;
function b3Shuffle(items){const a=items.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function b3DataPicture(id,label){
 const key=String(id).toLowerCase();let base=(window.LPW_V44_ART&&window.LPW_V44_ART[key])||B3_EXTRA_ART[key]||GAME_PREMIUM_3D[key];
 if(base)return `<img class="b3-object-img" src="data:image/webp;base64,${base}" alt="${qSafe(label)}" draggable="false">`;
 const svg=GAME_INLINE_PICTURES[key];
 if(svg)return `<img class="b3-object-img" src="data:image/svg+xml;base64,${svg}" alt="${qSafe(label)}" draggable="false">`;
 return `<span class="visual-error">Picture not available</span>`;
}
function b3UniquePool(kind){return kind==='safari'?B3_SAFARI:B3_PICTURES}
const b3OldRizqiNew=fullNewRizqi;
fullNewRizqi=function(kind){
 const g=b3OldRizqiNew(kind);
 if(kind!=='safari'&&kind!=='picture')return g;
 let all=b3Shuffle(b3UniquePool(kind));
 // 10 different objects per level; no repetition before completing that level.
 g.pairs=all.slice(0,10).map(s=>[s,s.toLowerCase()]);
 g.idx=Math.min(9,Math.max(0,Number(g.idx)||0));g.errors=0;
 return g;
};
const b3OldRizqiView=fullRizqiView;
fullRizqiView=function(m){
 const kind=state.detail;
 if(kind!=='safari'&&kind!=='picture')return b3OldRizqiView(m);
 if(!fullRizqi||fullRizqi.kind!==kind)fullRizqi=fullNewRizqi(kind);
 const g=fullRizqi, correct=g.pairs[g.idx][0];
 const pool=b3UniquePool(kind).filter(n=>n!==correct);
 const amount=Math.min(4,g.level+1);
 const opts=b3Shuffle([...b3Shuffle(pool).slice(0,amount-1),correct]);
 const title=kind==='safari'?'Safari Adventure':'Little Picture World';
 return `<section class="panel app-screen module-shell improved-module">${head(m)}
   <div class="game-hero rizqi-theme"><span class="game-kicker">RIZQI EXPLORER</span>
   <h2>${title}</h2><p>Level ${g.level} · Question ${g.idx+1} of 10</p>
   <button type="button" class="sound-test" data-rizqi-voice>Play happy voice</button></div>
   <div class="full-rizqi-game rizqi-play-area b3-game">
      <h3 class="b3-question">What is this?</h3>
      <div class="b3-visual-frame">${b3DataPicture(correct.toLowerCase(), 'Object to identify')}</div>
      <div class="b3-text-choices" style="--b3-columns:${amount===2?2:2}">
       ${opts.map((x,i)=>`<button type="button" data-improve-rizqi="${qSafe(x)}" class="b3-choice b3-choice-${i%4}">${qSafe(x)}</button>`).join('')}
      </div><p id="rizqiFeedback" role="status" class="game-feedback"></p>
   </div></section>`;
};
// Existing click listener continues to check the text answer against g.pairs[g.idx].
// Refresh the deck only AFTER all ten distinct questions have been answered.
const b3OldRizqiCorrect=rizqiCorrect;
rizqiCorrect=function(){
 const g=fullRizqi, kind=g&&g.kind;
 if(kind!=='safari'&&kind!=='picture')return b3OldRizqiCorrect();
 if(!g||g._b3Locked)return;
 g._b3Locked=true;
 const f=document.getElementById('rizqiFeedback');if(f){f.textContent='Yay! Great job!';f.classList.add('is-good')}
 improvePraise();g.idx++;g.errors=0;
 if(g.idx>=10){g.idx=0;g.level=Math.min(3,g.level+1);g.pairs=b3Shuffle(b3UniquePool(kind)).slice(0,10).map(x=>[x,x.toLowerCase()])}
 rizqiSave();
 setTimeout(()=>{if(state.view==='rizqi'&&state.detail===kind)render();g._b3Locked=false},850);
};
const b3OldGameNew=fullNewGame;
function b3SpellingWord(){
 if(!b3SpellingDeck.length)b3SpellingDeck=b3Shuffle(B3_PICTURES.map(x=>x.toUpperCase()));
 const word=b3SpellingDeck.pop();return {kind:'spelling',word,picture:word.toLowerCase(),letters:[],score:0};
}
fullNewGame=function(kind){return kind==='spelling'?b3SpellingWord():b3OldGameNew(kind)};
const b3OldGamesView=fullGamesView;
fullGamesView=function(m){
 if(state.detail!=='spelling')return b3OldGamesView(m);
 if(!fullGame||fullGame.kind!=='spelling'){b3SpellingDeck=b3Shuffle(B3_PICTURES.map(x=>x.toUpperCase()));b3SpellingDone=0;b3SpellingCompleted=false;fullGame=b3SpellingWord()}
 const g=fullGame;
 const buttons=[10,20,30,50].map(n=>`<button type="button" class="b3-count-btn ${n===b3SpellingTarget?'selected':''}" data-b3-count="${n}">${n} pictures</button>`).join('');
 if(b3SpellingCompleted)return `<section class="panel app-screen module-shell improved-module">${head(m)}<div class="b3-finish"><h2>Wonderful Spelling!</h2><p>You completed ${b3SpellingDone} different pictures!</p><button class="action primary" data-b3-restart>Play again</button></div></section>`;
 return `<section class="panel app-screen module-shell improved-module">${head(m)}<div class="game-viewport">
 <div class="game-hero spelling-theme"><span class="game-kicker">PICTURE SPELLING • ${b3SpellingDone+1}/${b3SpellingTarget}</span>
 <h2>Look, think & spell!</h2><p>Type the English name for the picture.</p></div>
 <div class="b3-count-row">${buttons}</div>
 <div class="b3-spell-picture">${b3DataPicture(g.picture,'Object to spell')}</div>
 <label class="game-input-label" for="gameWord">Your English word</label>
 <input id="gameWord" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="Type here">
 <div class="game-actions"><button class="action primary" data-improve-check>Check answer</button><button class="action" data-improve-hint>First-letter hint</button></div>
 <p id="gameFeedback" role="status" class="game-feedback"></p></div></section>`;
};
const b3OldSolved=gameSolved;
gameSolved=function(){
 if(!fullGame||fullGame.kind!=='spelling')return b3OldSolved();
 if(fullGame._b3Locked)return;
 fullGame._b3Locked=true;b3SpellingDone++;
 improveFeedback('Brilliant! You spelled it!',true);improvePraise();
 setTimeout(()=>{if(state.view==='games'&&state.detail==='spelling'){
   if(b3SpellingDone>=b3SpellingTarget){b3SpellingCompleted=true}
   else{fullGame=b3SpellingWord()}
   render();
 }},800);
};
document.getElementById('view').addEventListener('click',e=>{
 const btn=e.target.closest('[data-b3-count],[data-b3-restart]');if(!btn)return;
 if(btn.dataset.b3Count){b3SpellingTarget=Number(btn.dataset.b3Count)||10}
 b3SpellingDeck=b3Shuffle(B3_PICTURES.map(x=>x.toUpperCase()));b3SpellingDone=0;b3SpellingCompleted=false;fullGame=b3SpellingWord();render();
});
