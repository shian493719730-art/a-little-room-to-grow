const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=Object.fromEntries([...html.matchAll(/<script id="([^"]+)">([\s\S]*?)<\/script>/g)].map(x=>[x[1],x[2]]));
for(const source of Object.values(scripts))new vm.Script(source);
const languageContext={};vm.runInNewContext(scripts['game-content']+'\nthis.catalog=I18N;',languageContext);const C=languageContext.catalog;
for(const key of C.keys){for(const lang of['zh','en']){const value=C.get(key,lang,1,2,3);assert(value!==undefined&&value!==null);assert.equal(typeof C.get(key,'en'),typeof C.get(key,'zh'));if(lang==='en')assert(!/[\u3400-\u9fff]/.test(JSON.stringify(value)),`English contains Chinese: ${key}`);}}
const researchContext={};vm.runInNewContext(scripts['game-literature']+'\nthis.catalog=Literature;',researchContext);const L=researchContext.catalog;
for(const [id,e] of Object.entries(L.refs)){assert(!/[\u3400-\u9fff]/.test(L.sourceBody(id,'en')),`English source contains Chinese: ${id}`);assert(/^https:\/\//.test(e.url));}
let contexts=0,nodes=[],samples=[];
class Param{setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));}linearRampToValueAtTime(v,t){assert(v<=.1&&t>=0);}exponentialRampToValueAtTime(v,t){assert(v>0&&t>=0);}}
class Node{constructor(){this.gain=new Param();this.frequency=new Param();this.frequency.value=0;this.stopped=false;nodes.push(this);}connect(){}disconnect(){}start(t){assert(t>=0);}stop(t){assert(t===undefined||t>=0);this.stopped=true;}}
class FakeContext{constructor(){contexts++;this.currentTime=0;this.sampleRate=48000;this.state='suspended';this.destination={};}resume(){this.state='running';this.onstatechange?.();return Promise.resolve();}createOscillator(){return new Node();}createGain(){return new Node();}createBufferSource(){return new Node();}createBiquadFilter(){return new Node();}createBuffer(channels,len,rate){const data=new Float32Array(len);samples.push(data);return {getChannelData:()=>data};}}
const audioContext={window:{AudioContext:FakeContext},document:{documentElement:{dataset:{}}},Math,Set};vm.runInNewContext(scripts['game-audio']+'\nthis.sound=SoundFX;',audioContext);const sound=audioContext.sound;
assert.equal(contexts,0);sound.configure(true,.4);assert.equal(contexts,0,'No autoplay or context before a user action');
for(const cue of sound.cueNames){assert.equal(sound.play(cue),true);assert.equal(sound.status().contextState,'running');assert(sound.status().activeVoices>0);sound.stop();assert.equal(sound.status().activeVoices,0);}
assert(samples.length>=5);for(const data of samples){assert(data.some(x=>x!==0));assert(data.every(Number.isFinite));assert(data.every(x=>Math.abs(x)<=1));}
sound.play('restaurant');sound.configure(false,.4);assert.equal(sound.status().activeVoices,0);const count=nodes.length;assert.equal(sound.play('care'),false);assert.equal(nodes.length,count,'Muted actions must not schedule audio');sound.configure(true,0);assert.equal(sound.play('care'),false);sound.configure(true,99);assert.equal(sound.status().volume,1);sound.configure(true,-5);assert.equal(sound.status().volume,0);
assert(!/<(?:script|link)[^>]+(?:src|href)=/.test(html),'The delivered HTML must not require external runtime assets');
const result={catalogueKeys:C.keys.length,languages:['zh-CN','en'],englishCJKLeaks:0,researchEntries:Object.keys(L.refs).length,media:{cues:[...sound.cueNames],noAutoplay:true,muteStopsScheduledVoices:true,volumeBounds:true,noiseBuffersFinite:true},engine:'Production engine unchanged; exhaustive verification remains separate',scope:'Unit checks plus browser QA; oscillator scheduling validated with an AudioContext test double, real browser context separately observed running'};
fs.writeFileSync(path.join(__dirname,'media-i18n.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
