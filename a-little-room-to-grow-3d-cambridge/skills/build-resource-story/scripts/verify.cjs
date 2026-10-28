const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const htmlPath=process.argv[2]?path.resolve(process.argv[2]):path.resolve(__dirname,'../../../index.html');
const reportPath=process.argv[3]?path.resolve(process.argv[3]):path.join(path.dirname(htmlPath),'tests/verification.json');
const vm=require('node:vm');
const html=fs.readFileSync(htmlPath,'utf8');
const script=html.match(/<script id="game-engine">([\s\S]*?)<\/script>/)[1];
const ctx={module:{exports:{}}};vm.runInNewContext(script,ctx);const G=ctx.module.exports;
const A=Object.keys(G.LABEL);
const next=s=>G.confirm(G.end(s));
// Exact-state memoisation merges action permutations only when all future-relevant state agrees.
const key=s=>[s.week,s.money,s.flower,s.energy,s.capacity,s.job,s.misses,+s.exempt,...Object.values(s.counts)].join(',');
function explore(support){
  let frontier=new Map([[key(G.initial(support)),{s:G.initial(support),path:[]}]]),seenTotal=0,ends=new Map();
  for(let week=1;week<=4;week++){
    const all=new Map(frontier),queue=[...frontier.values()];
    for(let i=0;i<queue.length;i++){
      const {s,path}=queue[i];
      for(const a of A){if(G.reason(s,a))continue;const t=G.act(s,a);assert(t.energy>=0&&t.flower>=0&&t.flower<=100);assert(t.counts.restaurant<=2&&t.counts.delivery<=3&&t.counts.care<=1&&t.counts.rest<=1&&t.counts.borrow<=1&&t.counts.job<=1);if(['rest','borrow','care','job'].includes(a))assert.equal(G.act(t,a),t);const k=key(t);if(!all.has(k)){const v={s:t,path:[...path,a]};all.set(k,v);queue.push(v);}}
    }
    seenTotal+=all.size;const following=new Map();
    for(const {s,path} of all.values()){
      const t=next(s),k=key(t),v={s:t,path:[...path,'end']};
      (week===4?ends:following).set(k,v);
    }
    frontier=following;
  }
  const vals=[...ends.values()];const alive=vals.filter(x=>x.s.flower>0),win=alive.filter(x=>x.s.money>=700);
  const maxAlive=alive.reduce((a,b)=>b.s.money>a.s.money?b:a),maxMoney=vals.reduce((a,b)=>b.s.money>a.s.money?b:a);
  return {support:support||'none',visited:seenTotal,terminalStates:ends.size,winningStates:win.length,maxAlive:maxAlive.s.money,maxMoney:maxMoney.s.money,aliveWitness:maxAlive.path,moneyWitness:maxMoney.path,winWitness:win[0]?.path||null,losingStates:vals.filter(x=>x.s.money<700||x.s.flower===0).length};
}
const results=[null,'food','cash','volunteer'].map(explore);
assert.equal(results[0].winningStates,0);assert(results[0].maxMoney>=700);assert(results[0].maxAlive>40);
for(const r of results.slice(1)){assert(r.winningStates>0);assert(r.losingStates>0);}
let s=G.initial();assert.match(G.reason(s,'job'),/目前在职/);
s=next(s);assert.equal(s.job,'warning');s=next(s);assert.equal(s.job,'unemployed');assert.match(G.reason(s,'restaurant'),/失业/);
s=G.act(s,'job');assert.equal(s.job,'reemployed');assert.equal(s.misses,0);assert.equal(G.reason(s,'restaurant'),'');s=next(s);assert.equal(s.job,'reemployed');assert.equal(s.misses,0);s=next(s);assert.equal(s.job,'warning');
s=G.initial();s=G.act(s,'restaurant');assert.match(G.reason(s,'job'),/目前在职/);s=next(s);assert.equal(s.job,'employed');
s=G.initial();const rev=s.revision;s=G.act(s,'restaurant',rev);assert.equal(G.act(s,'restaurant',rev),s);
s=G.act(s,'rest');assert.equal(s.energy,6);assert.equal(G.act(s,'rest'),s);s=G.act(s,'borrow');assert.equal(s.energy,8);assert.equal(G.act(s,'borrow'),s);s=G.end(s);assert.equal(G.end(s),s);assert.equal(G.act(s,'delivery'),s);const summary=s.summary;assert.equal(summary.nextCapacity,4);s=G.confirm(s);assert.equal(s.energy,4);assert.equal(G.confirm(s),s);
s=G.initial();for(let i=0;i<2;i++)s=next(s);assert.equal(s.flower,0);assert.equal(G.act(s,'care'),s);s=G.end(s);assert.equal(s.flower,0);
s=G.initial('volunteer');s=G.end(s);assert.equal(s.flower,65);assert.equal(s.summary.supportCare,35);assert.equal(G.end(s).flower,65);
s=G.initial();for(let i=0;i<4;i++)s=next(s);let t=G.reveal(s,1);assert.equal(t.supportRoll,'cash');assert.equal(G.reveal(t,0),t);s=G.startSupport(t);assert.equal(s.money,160);assert.equal(G.startSupport(s),s);assert.equal(s.week,1);assert.equal(s.flower,60);assert.equal(s.job,'employed');
s=G.initial();for(let i=0;i<3;i++)s=next(s);assert.match(G.reason(s,'borrow'),/最后一周/);
for(const a of A){for(const state of [G.initial(),G.initial('food'),s])if(G.reason(state,a)){assert(G.reason(state,a).length>4);assert.equal(G.act(state,a),state);}}
assert.equal(G.initial().history.length,0);assert.equal(G.initial().supportRoll,null);
fs.mkdirSync(path.dirname(reportPath),{recursive:true});
fs.writeFileSync(reportPath,JSON.stringify({generatedAt:new Date().toISOString(),method:'Exact reachable-state exhaustive traversal of the embedded production reducer; action permutations merged by all future-relevant state; no income dominance pruning.',results,regressions:'passed'},null,2));
console.log(JSON.stringify(results.map(({support,visited,terminalStates,winningStates,maxAlive,maxMoney})=>({support,visited,terminalStates,winningStates,maxAlive,maxMoney})),null,2));console.log('All regression assertions passed.');
