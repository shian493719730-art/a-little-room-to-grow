/* Original Canvas close-ups for the four endings. Presentation only; no game state access. */
const EndingFilm=(()=>{
'use strict';
const surfaces=new WeakMap(),duration=5200;
const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>1-Math.pow(1-clamp(n),3);
function draw(canvas,variant,elapsed=0){
 if(!canvas)return;
 const alive=variant==='flower'||variant==='win',paid=variant==='paid'||variant==='win',win=variant==='win',p=clamp(elapsed/duration),t=elapsed/1000;
 let temp=surfaces.get(canvas);if(!temp){temp=document.createElement('canvas');temp.width=600;temp.height=252;surfaces.set(canvas,temp);}
 const c=temp.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,600,252);
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));};
 const poly=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();};
 const line=(x,y,xx,yy,color,width=2)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(Math.round(x),Math.round(y));c.lineTo(Math.round(xx),Math.round(yy));c.stroke();};
 // A desk and a close view of the windowsill, rather than the game's room scene.
 r(0,0,600,252,'#f0f1e4');r(0,0,294,252,'#eee9da');
 for(let i=0;i<48;i++)r((i*83)%600,(i*43)%252,1,1,'#e3e4d4');
 r(313,13,267,154,'#d3dfd5');r(322,21,248,136,win?'#e3ecda':'#dfe8e1');
 // Small Cambridge rooflines and brick details, without insignia or people.
 const shift=Math.sin(t*.22)*2;
 for(let i=0;i<7;i++){const x=326+i*35,y=90+(i%3)*9+shift; r(x,y,31,53,'#b7c9bd');poly([[x-2,y],[x+15,y-15],[x+33,y]],'#9fb7ab');r(x+5,y-13,4,12,'#a1b6a6');for(let k=0;k<3;k++)for(let j=0;j<3;j++)r(x+5+j*8,y+8+k*11,3,5,'#8ba69a');}
 r(320,145,251,8,'#c0d0bf');r(443,20,5,132,'#9cb4a4');r(321,78,250,4,'#aabfb0');r(313,153,267,8,'#9daf98');r(305,161,283,8,'#d9d1ad');r(305,169,283,4,'#b8b99c');
 // Moving sunlight stays warm and restrained in every outcome.
 c.globalAlpha=win?.16+.12*ease(p):.12;poly([[340,25],[401,25],[583,252],[497,252]],'#fff7cf');c.globalAlpha=1;
 poly([[19,149],[259,132],[312,207],[42,245]],'#dbc09a');poly([[42,245],[312,207],[312,216],[42,252]],'#b39370');poly([[19,149],[42,245],[42,252],[19,157]],'#c5a57d');
 for(let i=0;i<9;i++){line(28+i*26,154-i*1.4,54+i*27,238-i*3.2,'#cbb087',1);r(52+i*22,176+i%3*11,10,1,'#c7aa81');}
 // A little notebook, mug and pen retain the sense of everyday life.
 poly([[30,145],[67,141],[78,159],[40,165]],'#8fa69a');line(40,148,65,145,'#e7ecd9');r(262,134,19,20,'#a4bab0');r(260,130,23,5,'#c6d6c4');r(281,137,7,10,'#8fa79b');r(283,139,3,6,'#e7eadb');line(249,176,274,191,'#6d8c7e',3);
 const paperY=152-(1-ease(p*2.4))*26;
 c.save();c.translate(120,paperY);c.rotate(-.13);
 // Envelopes beneath the final receipt/open notice.
 for(let i=0;i<(paid?1:3);i++){const offset=(i-1)*4*ease(p*2);r(-48+offset,5+i*4,119,76,'#c5b396');r(-47+offset,4+i*4,117,74,'#f5e9cf');line(-47+offset,4+i*4,11+offset,39+i*4,'#d6c7a8',1);line(70+offset,4+i*4,11+offset,39+i*4,'#d6c7a8',1);}
 r(-45,-31,112,99,'#c9b899');r(-47,-33,112,99,'#fffaf0');r(-38,-24,68,3,'#8d9e86');r(-38,-15,89,2,'#d7d8c3');
 for(let j=0;j<4;j++){r(-38,1+j*8,46+j%2*9,2,'#c3c9b5');r(36,1+j*8,15,2,'#b4bda7');}r(-38,36,89,1,'#b6bea7');r(-38,43,27,3,'#a9b59d');r(25,42,26,5,'#869c81');
 // A payment stamp or a clearly unresolved notice, not an eviction event.
 const stamp=ease((p-.2)*2.8),stampY=-7-(1-stamp)*50;c.globalAlpha=stamp;
 c.save();c.translate(7,stampY);c.rotate(paid?-.1:.05);r(-21,-11,43,25,paid?'#6b9076':'#b38c60');r(-19,-9,39,21,paid?'#edf2df':'#fbefdb');
 if(paid){line(-10,0,-3,6,'#5d8468',3);line(-3,6,12,-6,'#5d8468',3);}else{r(-1,-5,3,10,'#9b744c');r(-1,8,3,3,'#9b744c');}
 c.restore();c.globalAlpha=1;c.restore();
 // Close-up flower: living swaying leaves or dry stems with falling petals.
 const sway=alive?Math.sin(t*1.8)*2.2:Math.sin(t*.7)*.25;
 c.save();c.translate(466,159);poly([[-30,7],[31,7],[45,13],[-19,20]],'#bac0a5');
 r(-22,-4,44,7,'#ac805f');r(-19,3,38,31,'#c89674');r(-14,6,7,25,'#dfb18a');r(12,6,5,24,'#b48967');r(-18,32,35,3,'#9a795c');r(-24,-8,48,7,'#d5a17e');r(-18,-6,36,3,'#7e7055');
 c.save();c.translate(sway,0);
 if(alive){
  const growth=ease(p*1.8);c.translate(0,-growth*8);line(0,-2,1,-55-growth*7,'#66865e',3);
  poly([[0,-21],[-10,-35],[-25,-36],[-16,-24]],'#8fa76c');line(-2,-24,-18,-32,'#6d8b60',1);
  poly([[1,-39],[13,-52],[26,-53],[17,-41]],'#9ab57c');line(3,-42,20,-49,'#6d8b60',1);
  if(win){poly([[0,-10],[12,-19],[20,-19],[14,-10]],'#a4bb7d');}
  const bloom=-63-growth*7;for(const [x,y,w,h,color]of [[-8,-10,9,13,'#d69d8b'],[3,-10,9,13,'#deb19b'],[-14,-2,13,10,'#e5b6a0'],[6,-1,12,10,'#e5baa5'],[-6,-16,12,11,'#efc5ae'],[-2,-5,9,12,'#f1d58f']])r(x,bloom+y,w,h,color);
  r(1,bloom,3,4,'#b99a58');
 }else{
  line(0,-2,0,-65,'#9a8867',3);line(0,-37,-15,-49,'#9a8867',3);line(0,-23,16,-36,'#9a8867',3);r(-18,-56,3,9,'#a28f6e');r(14,-44,3,8,'#a28f6e');
  for(let i=0;i<3;i++){const fall=ease((p-i*.16)*1.9),x=-10+i*11+Math.sin(fall*8+i)*9,y=-62+fall*(76+i*2);c.save();c.translate(x,y);c.rotate(fall*4+i);r(-3,-1,7,3,['#caa08a','#d9b49b','#bca88b'][i]);c.restore();}
  r(-38,19,7,3,'#d9b49b');r(29,22,6,3,'#c4a18a');
 }
 c.restore();c.restore();
 // A small clock and a drifting page corner: no character likenesses.
 r(31,34,35,35,'#c7c8ad');r(34,37,29,29,'#f7f2df');r(47,42,2,12,'#83957c');line(48,52,56,56,'#83957c',2);r(38,41,2,2,'#b5bea4');r(58,60,2,2,'#b5bea4');
 if(win){for(let i=0;i<6;i++){const xx=339+i*37,yy=40+(i*31)%110+Math.sin(t+i)*3;c.globalAlpha=.35+.2*Math.sin(t*1.5+i);r(xx,yy,2,2,'#fff8d6');}c.globalAlpha=1;}
 const out=canvas.getContext('2d');out.imageSmoothingEnabled=false;out.clearRect(0,0,canvas.width,canvas.height);out.drawImage(temp,0,0,canvas.width,canvas.height);
}
return Object.freeze({draw,duration});
})();
