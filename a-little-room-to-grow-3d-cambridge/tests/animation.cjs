const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const html=fs.readFileSync(__dirname+'/../index.html','utf8'),script=id=>html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'))[1];let trace=[];
function context(){return new Proxy({},{get:(o,k)=>o[k]??((...args)=>{trace.push([k,...args.map(a=>typeof a==='object'?'surface':a)]);}),set:(o,k,v)=>{o[k]=v;trace.push(['set',k,v]);return true;}});}
function canvas(){const ctx=context();return {width:600,height:240,getContext:()=>ctx};}
const env={document:{createElement:canvas},Math,WeakMap};vm.runInNewContext(script('game-scene')+'\nthis.scene=PixelScene;',env);const scene=env.scene;
const digest=(a,p)=>{trace=[];scene.film(canvas(),a,p);return {operations:trace.length,hash:crypto.createHash('sha256').update(JSON.stringify(trace)).digest('hex')};};
const ui=script('game-ui'),animate=ui.slice(ui.indexOf('function animate('),ui.indexOf('function action('));
assert(!/prefers-reduced-motion|reduced\.matches/.test(ui),'UI must not automatically switch to stills');assert(!/prefers-reduced-motion/.test(html.match(/<style>([\s\S]*?)<\/style>/)[1]),'CSS must not disable motion for the system preference');
const result=[];for(const a of ['restaurant','delivery','care','rest','borrow','job']){
 const one=digest(a,.1),two=digest(a,.8);assert(one.operations>100);assert.notEqual(one.hash,two.hash,a+' must change across frames');
 // Run the actual shipped UI animation function with the old preference set true.
 const queue=[],frames=[],nodes={'#action-film':{hidden:true},'#film':{id:'film'},'#film-thumb':{id:'thumb'},'#room':{id:'room'},'#action-film .film-progress i':{style:{}}};
 const scope={reduced:{matches:true},matchMedia:()=>({matches:true}),performance:{now:()=>0},cancelAnimationFrame:()=>{},requestAnimationFrame:fn=>{queue.push(fn);return queue.length;},$:id=>nodes[id],updateFilmCopy:()=>{},renderFeedback:()=>{},attachThumb:()=>{},PixelScene:{film:(c,key,p)=>frames.push({surface:c.id,key,p}),room:()=>{}},state:{}};
 vm.runInNewContext('let filmFrame=0,filmAction=null,filmDone=true,filmStarted=0;'+animate+'\nthis.start=animate;this.done=()=>filmDone;',scope);scope.start(a);
 assert.equal(nodes['#action-film'].hidden,false);assert.equal(queue.length,1,'Always schedule full animation, including under reduced motion');
 queue.shift()(260);queue.shift()(2080);assert.equal(scope.done(),false);queue.shift()(2600);assert.equal(scope.done(),true);assert.equal(nodes['#action-film .film-progress i'].style.width,'100%');
 assert.deepEqual(frames.filter(f=>f.surface==='film').map(f=>f.p),[.1,.8,1]);assert.deepEqual(frames.filter(f=>f.surface==='thumb').map(f=>f.p),[.1,.8,1]);assert.equal(queue.length,0);
 result.push({action:a,operations:one.operations,framesDiffer:true,fullDurationMs:2600,fullMotionWithReducedPreference:true,thumbnailAnimated:true});
}
fs.writeFileSync(__dirname+'/animation.json',JSON.stringify({method:'Actual embedded renderers and UI requestAnimationFrame function; all six full 2.6-second animations run even with a simulated reduced-motion preference. No CSS motion suppression.',result},null,2)+'\n');console.log('Six full action animations verified, including a simulated reduced-motion preference; no automatic CSS or canvas still mode.');
