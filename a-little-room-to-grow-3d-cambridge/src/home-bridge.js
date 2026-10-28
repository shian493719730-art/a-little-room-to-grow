/* Additive integration only. The original homepage and its game stay intact. */
(()=>{
'use strict';
if(window.parent===window)return;
let reportedWin=false,lastLang='',skipInitialWin=true;
const send=data=>window.parent.postMessage(data,location.origin);
function inspect(){
 const lang=document.documentElement.lang.startsWith('zh')?'zh':'en';
 if(lang!==lastLang){lastLang=lang;send({type:'cambridge-home-language',lang});}
 const modal=document.getElementById('modal');
 if(!reportedWin&&modal?.open&&modal.dataset.view==='result'&&modal.querySelector('.ending-cinema.win')){
  reportedWin=true;send({type:'cambridge-home-state',completed:true});
  if(!skipInitialWin)send({type:'cambridge-home-completed'});
 }
 skipInitialWin=false;
}
new MutationObserver(inspect).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['open','data-view','lang']});
document.addEventListener('click',e=>{if(['restart-now','retry-support','start-support'].includes(e.target.closest('[data-cmd]')?.dataset.cmd)){reportedWin=false;send({type:'cambridge-home-state',completed:false});}},true);
window.addEventListener('message',e=>{
 if(e.origin!==location.origin||e.source!==window.parent||e.data?.type!=='cambridge-home-active')return;
 if(!e.data.active&&typeof SoundFX!=='undefined')SoundFX.stop();
});
inspect();
})();
