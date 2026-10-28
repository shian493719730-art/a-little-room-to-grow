const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const html=fs.readFileSync(__dirname+'/../index.html','utf8'),script=id=>html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'))[1],env={};
vm.runInNewContext(script('game-engine')+'\n'+script('game-support-cards')+'\n'+script('game-journey')+'\nthis.G=Game;this.C=SupportCards;this.J=Journey;',env);const {G,C,J}=env;
for(const key of J.keys){assert(J.text(key,'zh'));assert(J.text(key,'en'));assert(!/[\u3400-\u9fff]/.test(J.text(key,'en')),key);}
let ended=G.initial();for(let w=0;w<4;w++)ended=G.confirm(G.end(ended));const table=C.prepare(ended,Array(11).fill(2147483647));
for(const lang of ['zh','en']){
 const intro=J.intro(lang,'data:image/png;base64,TEST',false);assert(intro.includes('data-cmd="intro-start"'));assert(intro.includes(J.links.pledge));assert(intro.includes(J.links.brief));assert(!intro.includes('data-action'));assert.equal((intro.match(/class="community-members"/g)||[]).length,1);
 const backs=J.table(table,lang,'data:image/png;base64,TEST');assert.equal((backs.match(/class="support-card-back /g)||[]).length,12);assert.equal((backs.match(/alt="The Cambridge Pledge"/g)||[]).length,12);assert.equal((backs.match(/is also a Pledger\./g)||[]).length,12);assert(!/data-kind|food-|cash-|volunteer-/.test(backs),'No support revealed in table markup');
 const locked=J.cards(C.choose(table,4),lang,'data:image/png;base64,TEST',true);assert.equal((locked.match(/ disabled/g)||[]).length,12);
 if(lang==='en'){assert(!/[\u3400-\u9fff]/.test(intro));assert(!/[\u3400-\u9fff]/.test(backs));}
}
const verification=JSON.parse(fs.readFileSync(__dirname+'/verification.json','utf8'));
function replay(actions,support=null){let s=G.initial(support,support?2:1);for(const a of actions)s=a==='end'?G.confirm(G.end(s)):G.act(s,a);return s;}
const cases={paid:replay(verification.results[0].moneyWitness),flower:replay(verification.results[0].aliveWitness),both:ended,win:replay(verification.results[1].winWitness,'food')};
const casesReport={};for(const [variant,s] of Object.entries(cases)){const before=JSON.stringify(s);assert.equal(J.variant(s),variant);for(const lang of ['zh','en']){const e=J.ending(s,lang);assert(e.documents.includes('bill-document'));assert(e.documents.includes('flower-document'));assert(e.documents.includes('£'+s.money));assert(e.documents.includes(s.flower+' / 100'));assert(e.documents.includes('£'+(s.money>=700?s.money-700:700-s.money)));assert.equal(JSON.stringify(s),before);if(lang==='en')assert(!/[\u3400-\u9fff]/.test(JSON.stringify(e)));}casesReport[variant]={money:s.money,flower:s.flower,title:J.ending(s,'en').title};}
assert.notEqual(J.ending(cases.paid,'en').documents,J.ending(cases.flower,'en').documents);
assert.equal(crypto.createHash('sha256').update(script('game-engine')).digest('hex'),'d260d24a10d7ea9d4173de61a2a3b4d44511127390e76a9517b9d5b945e64ab4');
fs.writeFileSync(__dirname+'/journey.json',JSON.stringify({date:'2026-10-22',languages:['zh-CN','en'],keys:J.keys.length,introBeforeActions:true,officialGivingLink:J.links.pledge,briefLink:J.links.brief,twelveLogosAndMembershipLines:true,noSupportInBackMarkup:true,disabledAfterReveal:true,distinctEndings:casesReport,engineUnchanged:true},null,2)+'\n');console.log('Journey checks passed: bilingual introduction, 12 logo/member backs, four distinct settlements, unchanged game engine.');
