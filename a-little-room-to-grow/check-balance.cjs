const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements={};const context={console,document:{getElementById:id=>elements[id]??={style:{},classList:{add(){},remove(){}},scrollIntoView(){},close(){},showModal(){},getContext(){return{fillRect(){}}}},querySelectorAll:()=>[]}};
vm.createContext(context);for(const file of ['evidence-data.js','evidence.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),context);
vm.runInContext(`
render=()=>{};showActionFeedback=()=>{};showResult=()=>{};
function explore(mode){begin(mode);const queue=[{state:structuredCopy(s),start:{...weekStart}}];const seen=new Map();let bestAlive=-1,bestDead=-1,terminals=0;
while(queue.length){const entry=queue.pop();s=entry.state;weekStart=entry.start;s.history=[];
const key=JSON.stringify({...s,money:0,history:[]});if((seen.get(key)??-1)>=s.money)continue;seen.set(key,s.money);
if(s.done){terminals++;if(s.flower>0)bestAlive=Math.max(bestAlive,s.money);else bestDead=Math.max(bestDead,s.money);continue;}
const ids=actions().filter(a=>!a.disabled&&a.cost<=s.energy).map(a=>a.id);
const original=structuredCopy(s),start={...weekStart};
for(const id of ids){s=structuredCopy(original);weekStart={...start};act(id);queue.push({state:structuredCopy(s),start:{...weekStart}});}
s=structuredCopy(original);weekStart={...start};finishWeek();document.getElementById('continueWeek').onclick();queue.push({state:structuredCopy(s),start:{...weekStart}});
}return{mode:mode||'none',bestAlive,bestDead,states:seen.size};}
function structuredCopy(x){return JSON.parse(JSON.stringify(x));}
results=[null,'food','cash','volunteer'].map(explore);console.log(JSON.stringify(results,null,2));
`,context);
const r=context.results;assert(r[0].bestAlive<700,'Unsupported round must never win both');assert(r[0].bestDead>=700,'Bills alone must be achievable');for(const mode of r.slice(1))assert(mode.bestAlive>=700,mode.mode+' must enable both goals');console.log('All reachable action sequences checked: intended balance holds.');
