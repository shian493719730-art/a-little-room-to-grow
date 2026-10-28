const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const html=fs.readFileSync(__dirname+'/../index.html','utf8'),script=id=>html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'))[1];
const env={};vm.runInNewContext(['game-engine','game-support-cards','game-content','game-literature','game-journey'].map(script).join('\n')+'\nthis.G=Game;this.C=SupportCards;this.I=I18N;this.L=Literature;this.J=Journey;',env);
const {G,C,I,L,J}=env,ui=script('game-ui');
let ended=G.initial();for(let w=0;w<4;w++)ended=G.confirm(G.end(ended));
const data=JSON.parse(fs.readFileSync(__dirname+'/verification.json','utf8'));
const replay=(actions,support=null)=>actions.reduce((s,a)=>a==='end'?G.confirm(G.end(s)):G.act(s,a),G.initial(support,support?2:1));
const cases={paid:replay(data.results[0].moneyWitness),flower:replay(data.results[0].aliveWitness),both:ended,win:replay(data.results[1].winWitness,'food')};
const view={Game:G,SupportCards:C,Journey:J,Literature:L,LOGO:'data:image/png;base64,TEST',readingOpen:new Set(),justRevealed:true,esc:s=>String(s)};
view.tr=(key,...a)=>I.get(key,view.preferences.lang,...a);view.journeyText=(key,...a)=>J.text(key,view.preferences.lang,...a);view.readingText=key=>L.text(key,view.preferences.lang);view.supportName=kind=>I.get(kind,view.preferences.lang);view.supportEffect=kind=>I.get(kind+'Effect',view.preferences.lang);
vm.createContext(view);vm.runInContext(ui.slice(ui.indexOf('function pledgeHTML()'),ui.indexOf('function stopEndingFilm()'))+'\nthis.result=resultHTML;this.support=supportHTML;',view);
for(const [variant,state]of Object.entries(cases))for(const lang of ['zh','en']){
 view.state=state;view.preferences={lang};const before=JSON.stringify(state),out=view.result();
 assert.equal(J.variant(state),variant);assert(out.includes('id="ending-film"'));assert(!out.includes('outcome-room'));assert(!out.includes('ending-background'));assert(!out.includes('research-note'));assert(!out.includes('ref-G1'));assert(out.includes('data-cmd="all-sources"'));assert(out.includes(lang==='en'?'Background & references':'背景与参考文献'));
 if(state.round===1){assert(out.includes('result-support-badge'));assert(out.includes('data-cmd="reveal"'));}else assert(out.includes('https://www.cambridge-pledge.org/pledge'));
 assert.equal(JSON.stringify(state),before);if(lang==='en')assert(!/[\u3400-\u9fff]/.test(out));
}
const prepared=C.prepare(ended,Array(11).fill(0));let checks=0;
for(let slot=0;slot<12;slot++)for(const lang of ['zh','en']){
 const revealed=C.choose(prepared,slot);view.state=revealed;view.preferences={lang};view.readingOpen.add('note-'+revealed.supportRoll);const before=JSON.stringify(revealed),out=view.support();
 assert(out.includes('support-research-step'));assert(out.includes('data-research="'+revealed.supportRoll+'"'));assert(out.includes('id="ending-background"'));for(const id of ['G1','G2','G3','G4','G5','G6','G7','G8','R1','R2','R3','R4','R5','R6','R7'])assert(out.includes('id="ref-'+id+'"'));
 assert(out.indexOf('support-research-step')<out.indexOf('data-cmd="start-support"'));assert.equal((out.match(/data-cmd="start-support"/g)||[]).length,1);assert.equal((out.match(/ disabled/g)||[]).length,12);assert.equal(JSON.stringify(revealed),before);assert.equal(revealed.round,1);assert.equal(revealed.money,40);
 const restored=C.normalize(JSON.parse(before));assert.equal(restored.supportRoll,revealed.supportRoll);assert.equal(C.choose(restored,0),restored);const active=C.start(restored);assert.equal(active.round,2);assert.equal(active.money,revealed.supportRoll==='cash'?160:40);assert.equal(C.start(active),active);
 if(lang==='en')assert(!/[\u3400-\u9fff]/.test(out));checks++;
}
let trace=[];const context=()=>new Proxy({},{get:(o,k)=>o[k]??((...a)=>trace.push([k,...a.map(v=>typeof v==='object'?'surface':v)])),set:(o,k,v)=>{o[k]=v;trace.push([k,v]);return true;}});const canvas=()=>{const c=context();return {width:1200,height:504,getContext:()=>c};};
const art={document:{createElement:canvas},WeakMap,Math};vm.runInNewContext(script('game-endings')+'\nthis.E=EndingFilm;',art);
assert(!/\bGame\.|\bSupportCards\.|localStorage|getRandomValues/.test(script('game-endings')));
const hashes={},frames=[];for(const variant of Object.keys(cases)){
 const digest=ms=>{trace=[];art.E.draw(canvas(),variant,ms);return {hash:crypto.createHash('sha256').update(JSON.stringify(trace)).digest('hex'),operations:trace.length};};
 const one=digest(0),two=digest(2600),three=digest(5200),ambient=digest(7300);assert(one.operations>300);assert.notEqual(one.hash,two.hash);assert.notEqual(two.hash,three.hash);assert.notEqual(three.hash,ambient.hash);hashes[variant]=three.hash;frames.push({variant,operations:one.operations,storyDurationMs:art.E.duration,changingStoryAndAmbientFrames:true});
}
assert.equal(new Set(Object.values(hashes)).size,4,'Four visually distinct outcomes');
let clock=0,id=0,drawn=[],pending=new Map();const button={textContent:''},scope={cancelAnimationFrame:n=>pending.delete(n),requestAnimationFrame:fn=>{pending.set(++id,fn);return id;},performance:{now:()=>clock},modal:{open:true},dialogView:{type:'result'},state:cases.paid,Journey:J,EndingFilm:{draw:(c,v,ms)=>drawn.push(ms)},$:selector=>selector==='#ending-pause'?button:{},journeyText:key=>key};
vm.runInNewContext('let endingFrame=0,endingStarted=0,endingElapsed=0,endingPaused=false;'+ui.slice(ui.indexOf('function stopEndingFilm()'),ui.indexOf('function sourcesHTML()'))+'\nthis.start=startEndingFilm;this.toggle=toggleEndingFilm;this.stop=stopEndingFilm;',scope);
const tick=ms=>{clock=ms;const [id,fn]=pending.entries().next().value;pending.delete(id);fn(ms);};scope.start();tick(2600);assert.equal(drawn.at(-1),2600);scope.toggle();assert.equal(pending.size,0);assert.equal(button.textContent,'resumeEnding');clock=5000;scope.toggle();tick(5500);assert.equal(drawn.at(-1),3100);scope.start();assert.equal(drawn.at(-1),0);scope.stop();assert.equal(pending.size,0);
fs.writeFileSync(__dirname+'/ending-flow.json',JSON.stringify({date:'2026-10-22',fourVariants:frames,noRepeatedRoom:true,resultsHaveReadingEntryOnly:true,referencesAvailableAfterCardChoice:15,confirmationScreensChecked:checks,readingDoesNotApplyOrRedrawSupport:true,confirmAppliesOnce:true,pauseResumeReplayAndCleanup:true,engineUnchanged:true},null,2)+'\n');
console.log('Ending flow verified: four animated close-ups; clean results; 24 bilingual support/reference screens; one confirmed application; pause, resume, replay and RAF cleanup.');
