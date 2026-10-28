(()=>{
'use strict';
const $=s=>document.querySelector(s),views=['3d1','home','3d2'];
const frames={'3d1':$('#frame-3d1'),home:$('#frame-home'),'3d2':$('#frame-3d2')};
let active='3d1',lang='en',reason='exit',gameCompleted=false;
try{const p=JSON.parse(localStorage.getItem('little-room-preferences-v2'));lang=p?.lang==='zh'?'zh':'en';reason=sessionStorage.getItem('cambridge-room-ending')||'exit';}catch{}
const copy={
 en:{title:'A Little Room to Grow',finish:'End this visit →',winKicker:'A LITTLE ROOM TO GROW',exitKicker:'THE STORY CONTINUES',win:'You made room for the flower. In real life, we can grow a future together.',exit:'Even if the game remains unfinished, in real life we can grow a future together.',save:'Your progress stays saved in this browser. The complete homepage, story and references are still there.',revisit:'Return to the homepage',review:'Review the ending & references',action:'Explore giving & pledging ↗'},
 zh:{title:'留一点，给花',finish:'结束游戏 →',winKicker:'生活，多了一点余地',exitKicker:'故事之外，花仍有未来',win:'你在游戏中为花留出了余地。现实中，我们也一起培育未来之花。',exit:'虽然游戏未通关，但现实中，我们一起培育未来之花。',save:'进度会保存在当前浏览器。完整主页、故事与研究资料仍可返回查看。',revisit:'返回主页，继续体验',review:'回看结局与研究资料',action:'了解捐赠与承诺 ↗'}
};
function renderCopy(){const t=copy[lang];document.documentElement.lang=lang==='zh'?'zh-CN':'en';$('#visit-title').textContent=t.title;$('#finish-visit').textContent=t.finish;$('#closing-kicker').textContent=t[reason==='win'?'winKicker':'exitKicker'];$('#closing-message').textContent=t[reason==='win'?'win':'exit'];$('#closing-save').textContent=t.save;$('#revisit-home').textContent=t[reason==='win'?'review':'revisit'];$('#real-world-action').textContent=t.action;}
function notifyRoom(view){frames[view].contentWindow?.postMessage({type:'cambridge-room-active',active:active===view},location.origin);}
function show(view,record=true){
 if(!views.includes(view))view='3d1';const previous=active;active=view;
 if(!frames[view].getAttribute('src'))frames[view].src=view==='home'?'./home.html'+(previous==='3d2'?'?review=1':''):'./room2.html';
 for(const name of views)$('#view-'+name).hidden=name!==view;
 for(const name of ['3d1','3d2'])notifyRoom(name);
 frames.home.contentWindow?.postMessage({type:'cambridge-home-active',active:view==='home'},location.origin);
 if(record&&location.hash!=='#'+view)history.pushState(null,'','#'+view);
 renderCopy();frames[view].focus();
}
function finish(why){reason=why;try{sessionStorage.setItem('cambridge-room-ending',reason);}catch{}show('3d2');}
window.addEventListener('message',e=>{
 if(e.origin!==location.origin||!e.data)return;
 const sender=views.find(name=>frames[name].contentWindow===e.source);if(!sender)return;
 if(e.data.type==='cambridge-room-play'&&active===sender&&(sender==='3d1'||sender==='3d2'))show('home');
 if(sender==='home'&&e.data.type==='cambridge-home-language'){lang=e.data.lang==='zh'?'zh':'en';renderCopy();}
 if(sender==='home'&&e.data.type==='cambridge-home-state')gameCompleted=e.data.completed===true;
 if(sender==='home'&&e.data.type==='cambridge-home-completed'&&active==='home')finish('win');
});
$('#finish-visit').addEventListener('click',()=>finish(gameCompleted?'win':'exit'));
$('#revisit-home').addEventListener('click',()=>show('home'));
window.addEventListener('hashchange',()=>show(location.hash.slice(1),false));
for(const name of ['3d1','3d2'])frames[name].addEventListener('load',()=>notifyRoom(name));
show(location.hash.slice(1)||'3d1',false);
})();
