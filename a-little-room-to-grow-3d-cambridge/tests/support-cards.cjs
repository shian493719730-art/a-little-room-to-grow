const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const script=id=>html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'))[1];
const env={};vm.runInNewContext(script('game-engine')+'\n'+script('game-support-cards')+'\nthis.G=Game;this.C=SupportCards;',env);const {G,C}=env;
const exact=['Clare Sutcliffe MBE (Co-founder, Code Club) is also a Pledger.','Marcel Gehrung (CEO, Cyted Health) is also a Pledger.','Edward Benthall (Jesus College, Cambridge) is also a Pledger.','Kathryn Chapman (Innovate Cambridge) is also a Pledger.'];
let ended=G.initial();for(let w=0;w<4;w++)ended=G.confirm(G.end(ended));
assert.equal(C.deck.length,12);assert.equal(new Set(C.deck.map(c=>c.id)).size,12);
const seen=new Set(),results=[];
for(const entropy of [Array(11).fill(0),Array(11).fill(4294967295),Array.from({length:11},(_,i)=>((i+1)*357913941)>>>0)]){
 const prepared=C.prepare(ended,entropy),json=JSON.stringify(prepared);assert(C.hasDeck(prepared));assert.equal(prepared.phase,'ended');assert.equal(prepared.supportRoll,null);assert.equal(prepared.money,ended.money);assert.equal(prepared.revision,ended.revision);assert.equal(C.prepare(prepared,Array(11).fill(1)),prepared,'No reshuffle');assert.equal(JSON.stringify(C.normalize(JSON.parse(json))),json,'Refresh preserves prepared deck');
 for(let slot=0;slot<12;slot++){
  const card=C.table(prepared)[slot],s=C.choose(prepared,slot);assert.equal(s.supportCard,card.id);assert.equal(card.line,exact[card.person]);assert.equal(s.supportRoll,card.kind);assert.equal(s.money,ended.money);assert.equal(s.flower,ended.flower);assert.equal(s.energy,ended.energy);
  for(let again=0;again<12;again++)assert.equal(C.choose(s,again),s,'A second card must never reveal');assert.equal(C.prepare(s,entropy),s);
  const restored=C.normalize(JSON.parse(JSON.stringify(s)));assert.equal(restored.supportCard,s.supportCard);assert.equal(restored.supportRoll,s.supportRoll);assert.deepEqual(restored.supportDeck,JSON.parse(JSON.stringify(s.supportDeck)));
  const play=C.start(restored);assert.equal(play.supportCard,card.id);assert.equal(C.start(play),play);assert.equal(play.money,card.kind==='cash'?160:40);assert.equal(play.capacity,card.kind==='food'?9:7);assert.equal(play.flower,60);
  const retry=C.retry({...play,phase:'ended'});assert.equal(retry.supportCard,card.id);assert.equal(retry.money,play.money);assert.equal(C.choose(retry,0),retry);
  seen.add(card.kind+'|'+card.line);results.push({slot,card:card.id,support:card.kind});
 }
}
assert.equal(seen.size,12);assert.equal(C.choose(ended,0),ended);assert.equal(C.prepare(ended,[]),ended);
const prepared=C.prepare(ended,Array(11).fill(1));for(const slot of [-1,12,NaN,1.5])assert.equal(C.choose(prepared,slot),prepared);
for(const kind of ['food','cash','volunteer']){const legacy=C.normalize({...ended,phase:'revealed',supportRoll:kind});assert.equal(C.get(legacy).kind,kind);assert.equal(C.get(legacy).line,exact[0]);assert.equal(C.table(legacy).length,12);assert.equal(C.choose(legacy,0),legacy);assert.equal(C.start(legacy).support,kind);}
assert.equal(C.get(G.initial()),null);assert.equal(C.prepare(G.initial(),Array(11).fill(1)).supportDeck,undefined);
const ui=script('game-ui');assert(ui.includes('state=SupportCards.prepare(state,random)'));assert(ui.includes('state=SupportCards.choose(state,slot)'));assert(!script('game-support-cards').includes('Math.random'));assert(ui.includes('class="pledger-footer"'));assert(!/provided by|funded by|paid for by/i.test(script('game-support-cards')));
fs.writeFileSync(__dirname+'/support-cards.json',JSON.stringify({date:'2026-10-22',cardFaces:12,supportMechanics:3,pledgers:4,allCrossCombinations:true,shuffleBeforeChoice:true,shufflePersisted:true,choiceRevealsOnlyOne:true,repeatDrawBlocked:true,refreshStable:true,supportAppliedOnce:true,retryKeepsCard:true,legacySaveMigration:'deterministic, revealed support preserved',exactVerbatimLines:true,source:C.source,choicesTested:results.length},null,2)+'\n');
console.log('Card table verified: 12 backs, 36 choices, saved shuffle, one reveal, one application, stable refresh/retry/legacy saves.');
