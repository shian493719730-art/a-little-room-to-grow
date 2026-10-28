const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=Object.fromEntries([...html.matchAll(/<script id="([^"]+)">([\s\S]*?)<\/script>/g)].map(m=>[m[1],m[2]]));
const ctx={};vm.runInNewContext(scripts['game-literature']+'\nthis.L=Literature;',ctx);const L=ctx.L;
const ids=[...Array.from({length:8},(_,i)=>'G'+(i+1)),...Array.from({length:7},(_,i)=>'R'+(i+1))];
assert.deepEqual(Object.keys(L.refs),ids);
const mappings={restaurant:['G1'],delivery:['G3','G2'],rest:['G4'],borrow:['G1','G4'],care:['G5','G6'],job:['G8'],food:['R7'],cash:['G7'],volunteer:['G4']};
for(const [key,refs] of Object.entries(mappings)){
 assert.deepEqual(JSON.parse(JSON.stringify(L.notes[key].refs)),refs);
 for(const lang of ['zh','en']){const markup=L.note(key,lang);assert(markup.includes('<aside'));assert(markup.includes('<details'));assert(!/<button|data-action|data-cmd/.test(markup));assert.equal((markup.match(/<article /g)||[]).length,refs.length);assert(markup.includes(lang==='en'?'View research':'查看研究'));assert(markup.includes('target="_blank"'));if(lang==='en')assert(!/[\u3400-\u9fff]/.test(markup),key+' English leak');}
}
for(const id of ids){const r=L.refs[id];for(const f of ['authors','year','title','venue','url','kind','finding','limits'])assert(r[f],id+' '+f);assert(/^https:\/\//.test(r.url));assert.equal(!!r.pending,['R4','R5'].includes(id));}
for(const lang of ['zh','en']){
 const bg=L.background(lang);for(const id of ids)assert.equal((bg.match(new RegExp('id="ref-'+id+'"','g'))||[]).length,1,id);
 assert.equal((bg.match(/class="interpretation-card"/g)||[]).length,4);
 assert(bg.indexOf('background-title')<bg.indexOf('family-background'));assert(bg.indexOf('family-background')<bg.indexOf('interpretation-cards'));assert(bg.indexOf('interpretation-cards')<bg.indexOf('full-references'));
 assert(!/<details[^>]*\sopen[ >]/.test(bg),'References start collapsed');
 assert(bg.includes('data-ref="R1"')&&bg.includes('data-ref="R2"')&&bg.includes('data-ref="R3"')&&bg.includes('data-ref="R6"'));
 assert(bg.includes('131')&&bg.includes('75%')&&bg.includes('2016')&&bg.includes('2026'));
 assert(bg.indexOf('id="ref-R4"')>bg.indexOf('class="pending-references"'));assert(bg.indexOf('id="ref-R5"')>bg.indexOf('class="pending-references"'));
 if(lang==='en')assert(!/[\u3400-\u9fff]/.test(bg),'Background English leak');
 assert(!/10\s*(hours|小时)/i.test(bg));assert(!/10\s*(hours|小时)/i.test(L.note('delivery',lang)));
 const links=[...bg.matchAll(/<a [^>]+>/g)].map(m=>m[0]);for(const link of links.filter(s=>s.includes('href="https:')))assert(link.includes('target="_blank"')&&link.includes('noopener'));
}
assert(L.sourceBody('G3','en').includes('33.99%'));assert(L.sourceBody('G7','en').includes('136 counts studies, not participants'));assert(L.sourceBody('G7','en').includes('86'));
// The new layer must have no ability to mutate game progress or draw a card.
assert(!/\bGame\.|\bSupportCards\.|localStorage|sessionStorage|getRandomValues/.test(scripts['game-literature']));
const expected={
 'game-engine':'d260d24a10d7ea9d4173de61a2a3b4d44511127390e76a9517b9d5b945e64ab4',
 'game-scene':'5392237b2f6e697b6f37b6f341622d92cf2c0c10488e6ca338734a885c6e44b4',
 'game-audio':'fb3cb6ba01e4c36ea4b5215374ff42e6b8b9e69a0d04368ba419f147a595ed82'};
for(const [id,hash] of Object.entries(expected))assert.equal(crypto.createHash('sha256').update(scripts[id]).digest('hex'),hash,id+' changed');
const ui=scripts['game-ui'];assert(ui.includes('</button>${Literature.note(a,'));assert(ui.includes('Literature.background(preferences.lang)'));const resultView=ui.slice(ui.indexOf('function resultHTML()'),ui.indexOf('function supportHTML()'));const supportView=ui.slice(ui.indexOf('function supportHTML()'),ui.indexOf('function stopEndingFilm()'));assert(!resultView.includes('Literature.background('),'Result keeps only a reading entry');assert(supportView.includes('Literature.background(preferences.lang)'),'Context remains available after card choice');assert(resultView.includes('data-cmd="all-sources"'));assert(ui.includes("data-research")===false);assert(ui.includes("if(ref){e.preventDefault()"));assert(ui.includes('readingOpen.clear()'));
const result={references:ids,actionMappings:mappings,languages:['zh-CN','en'],englishCJKLeaks:0,eachReferenceExpandable:true,allExternalSourcesNewTab:true,pendingGroup:['R4','R5'],noUnverifiedWaitingDuration:true,studyCountNotParticipantCount:true,pureReadingLayer:true,unchangedSha256:expected,scope:'Production embedded literature, bilingual HTML contracts and immutable existing engine/support/media checks. Browser interaction and responsive QA recorded separately.'};
fs.writeFileSync(path.join(__dirname,'literature.json'),JSON.stringify(result,null,2)+'\n');console.log('Literature checks passed: 15 references, 9 context mappings, 2 languages; mechanics, audio and scenery byte-identical; card selection tested separately.');
