/* Original code-drawn pixel art. The reference informs depth/detail, not its composition or assets. */
const PixelScene=(()=>{
const surfaces=new WeakMap();
const palette={outline:'#65736a',cream:'#fff3d8',wood:'#c59b74',woodLight:'#e4bf8d',woodDark:'#9e7959',sage:'#8fa786',sageLight:'#b2c59c',teal:'#709a98',rose:'#c99382',floor:'#e3c69c'};
function renderer(canvas,w,h){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;let temp=surfaces.get(canvas);if(!temp||temp.width!==w||temp.height!==h){temp=document.createElement('canvas');temp.width=w;temp.height=h;surfaces.set(canvas,temp);}const x=temp.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,w,h);x.imageSmoothingEnabled=false;const rect=(a,b,ww,hh,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),Math.ceil(ww),Math.ceil(hh));};const poly=(ps,col,edge)=>{x.fillStyle=col;x.beginPath();ps.forEach(([a,b],i)=>i?x.lineTo(Math.round(a),Math.round(b)):x.moveTo(Math.round(a),Math.round(b)));x.closePath();x.fill();if(edge){x.strokeStyle=edge;x.lineWidth=1;x.stroke();}};return {x,rect,poly,finish(){c.clearRect(0,0,canvas.width,canvas.height);c.drawImage(temp,0,0,canvas.width,canvas.height);}};}
function room(canvas,s,{time=0,ending=false}={}){if(!canvas)return;const {x:c,rect:r,poly,finish}=renderer(canvas,640,480);const P=(u,v,z=0)=>[320+(u-v)*1.09,190+(u+v)*.54-z];
const line=(a,b,col='#b69a79',width=1)=>{c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();};
const slab=(u,v,z,du,dv,col,edge)=>poly([P(u,v,z),P(u+du,v,z),P(u+du,v+dv,z),P(u,v+dv,z)],col,edge);
const faceU=(u,v,z,w,h,col,edge)=>poly([P(u,v,z),P(u+w,v,z),P(u+w,v,z+h),P(u,v,z+h)],col,edge);
const faceV=(u,v,z,w,h,col,edge)=>poly([P(u,v,z),P(u,v+w,z),P(u,v+w,z+h),P(u,v,z+h)],col,edge);
const box=(u,v,z,du,dv,dz,top='#e6c697',left='#c6a279',right='#ad8967',edge='#8b7963')=>{faceV(u,v+0,z,dv,dz,left);faceU(u,v+dv,z,du,dz,right,edge);faceV(u+du,v,z,dv,dz,left,edge);slab(u,v,z+dz,du,dv,top,edge);};
const shadow=(u,v,w,d)=>slab(u,v,.1,w,d,'#8f8c7425');
function flower(u,v,z,health,scale=1){let[a,b]=P(u,v,z);c.save();c.translate(Math.round(a),Math.round(b));c.scale(scale,scale);const rr=(xx,yy,w,h,col)=>r(xx,yy,w,h,col);rr(-9,-2,18,5,'#c58c6d');rr(-7,3,14,14,'#d6a17f');rr(-4,5,3,11,'#e8b38b');rr(-6,16,12,2,'#a67e62');rr(-6,-1,12,2,'#796c50');if(health<=0){rr(0,-30,2,30,'#9d8a68');rr(-8,-20,8,2,'#9d8a68');rr(-9,-25,2,6,'#9d8a68');rr(2,-12,8,2,'#9d8a68');rr(8,-18,2,6,'#9d8a68');rr(-17,12,4,2,'#d8ad91');rr(13,13,5,2,'#d8ad91');}else{const vivid=health>30;rr(0,-36,2,36,vivid?'#638457':'#8c9564');rr(-9,-20,9,4,vivid?'#8fa56e':'#b2b078');rr(-12,-23,6,4,vivid?'#a5b97f':'#c0b785');rr(2,-28,10,4,'#829d63');rr(10,-32,6,4,'#9db57b');rr(-5,-44,6,7,'#e3afa0');rr(3,-44,6,7,'#e3afa0');rr(-8,-38,7,6,'#eab9a4');rr(6,-38,6,6,'#eab9a4');rr(-2,-47,6,7,'#f0c5ad');rr(-1,-40,6,7,'#f4db95');rr(1,-38,2,3,'#bb9859');if(health>60){rr(2,-11,8,3,'#829d63');rr(8,-14,6,3,'#9db57b');}}c.restore();}
function books(u,v,z,axis='u',num=7){const colors=['#b88976','#94aa9b','#cdb16f','#7c9695','#dcc5a0','#9a9f78','#b3abc1'];for(let i=0;i<num;i++){let uu=u+(axis==='u'?i*5:0),vv=v+(axis==='v'?i*5:0);const hh=13+(i*7%10);box(uu,vv,z,axis==='u'?4:8,axis==='v'?4:8,hh,colors[i%7],colors[i%7],colors[(i+1)%7],'#8a8875');const[a,b]=P(uu+2,vv+8,z+hh-5);r(a,b,3,1,'#f2e8d0');}}
// Soft exterior field and a floating dollhouse base.
r(0,0,640,480,'#f2f3e7');for(let i=0;i<26;i++){const xx=25+(i*83)%595,yy=20+(i*67)%433;r(xx,yy,2,2,'#e5ead7');}
poly([[79,328],[320,448],[573,323],[592,340],[322,475],[61,345]],'#dce1ca');
box(0,0,-9,230,230,9,'#e4c79e','#a89372','#b49c77','#a18b6f');
// Fine plank courses, joints and individual wood-grain pixels.
for(let v=0;v<230;v+=15){slab(0,v,.2,230,14,['#e4c79f','#e8ceaa','#dfbf96','#e6c9a2'][(v/15)%4]);line(P(0,v,.3),P(230,v,.3),'#cbb18a');for(let u=(v/15%2)*37;u<230;u+=74){line(P(u,v,.4),P(u,v+14,.4),'#d2b58c');for(let k=0;k<2;k++){const uu=Math.min(225,u+14+k*18);line(P(uu,v+5+k*3,.5),P(Math.min(230,uu+12),v+5+k*3,.5),'#d9bc94');}}}
// Both cutaway walls have thickness, skirting and subtle plaster flecks.
faceV(0,0,0,230,157,'#e4e9da','#a7b99f');faceU(0,0,0,230,157,'#f5edda','#b8ba9f');
poly([P(-5,-5,162),P(0,0,162),P(0,230,162),P(-5,230,162)],'#bdcbb6');poly([P(0,0,162),P(230,0,162),P(235,-5,162),P(-5,-5,162)],'#d9dcc7');
faceV(0,0,0,230,5,'#b9c4a8');faceU(0,0,0,230,5,'#c5c5a5');
for(let i=0;i<35;i++){const v=9+(i*37)%210,z=16+(i*23)%128;const[a,b]=P(0,v,z);r(a,b,1,1,'#d3ddc6');}
// Window on the right wall, with fictional Cambridge buildings behind the glass.
faceU(43,0,71,141,80,'#7c8f83','#6d8275');faceU(47,0,75,133,72,'#c7deda');faceU(48,0,76,131,18,'#c8d3bd');faceU(48,0,77,131,5,'#8ebdb7');
for(let i=0;i<6;i++){const u=50+i*22,h=28+(i*13)%23;faceU(u,0,82,20,h,['#cfbe9e','#d7c9ad','#b6beaa'][i%3]);faceU(u-1,0,82+h,22,3,'#98a18c');for(let a=0;a<2;a++)for(let b=0;b<3;b++)faceU(u+5+a*9,0,87+b*10,4,6,'#8caaa1');}
faceU(96,0,124,11,14,'#b7b8a0');faceU(99,0,138,5,6,'#adb59e');faceU(101,0,144,2,5,'#9aaa98');
for(let i=0;i<3;i++){faceU(60+i*42,0,134-i%2*5,13,3,'#e6ede0');faceU(65+i*42,0,137-i%2*5,12,3,'#e6ede0');}
faceU(47,-.1,75,4,72,'#9bad97');faceU(111,-.1,75,4,72,'#829985');faceU(176,-.1,75,4,72,'#9bad97');faceU(47,-.2,111,133,3,'#8da18d');box(39,0,67,149,9,5,'#e1d4ad','#b9b296','#a9a88c');
// Curtains, folds, pull cord.
faceU(39,-1,76,9,77,'#e9d8b9');faceU(42,-1.5,76,2,77,'#d1c6a7');faceU(180,-1,76,10,77,'#e9d8b9');faceU(184,-1.5,76,2,77,'#d1c6a7');faceU(35,-1,154,159,3,'#84967e');line(P(190,0,151),P(190,0,115),'#b2ae91');
// A framed botanical print and a little four-week calendar.
faceV(0,81,83,37,49,'#b58e6e','#95785e');faceV(-.4,84,86,31,43,'#fbf1d8');line(P(-.5,98,91),P(-.5,99,121),'#819467',2);for(let i=0;i<4;i++){const p=P(-.8,94+(i%2)*9,99+i*5);poly([p,[p[0]-5,p[1]-5],[p[0]-2,p[1]-8]],'#9fb188');}
faceV(0,137,96,23,28,'#f5edda','#bac3aa');faceV(-.2,137,118,23,6,'#c99d87');for(let i=0;i<4;i++){const[a,b]=P(-.4,141+i*4,109);r(a,b,2,3,i<s.week?'#6d8d69':'#d5d9bd');}
// Sunlight stays gentle in every outcome: no poverty grading or sombre room filter.
slab(99,33,.7,85,120,'#fff3b52b');
// Woven rug: border, muted geometric stitchwork and fringes.
slab(74,74,1,120,116,'#9ba99d','#81958b');slab(80,80,1.2,108,104,'#c9d1b7');slab(86,86,1.3,96,92,'#b0c2ad');
for(let u=88;u<180;u+=12)for(let v=89;v<175;v+=12){slab(u,v,1.4,3,3,'#dce1c5');if((u+v)%3===0)slab(u+4,v+4,1.5,3,3,'#9caf98');}
for(let u=75;u<195;u+=5){line(P(u,191,1),P(u,195,1),'#ced5bb');line(P(u,70,1),P(u,74,1),'#ced5bb');}
// Furniture is drawn from far to near to keep depth consistent.
const objects=[];const obj=(depth,fn)=>objects.push({depth,fn});
obj(45,()=>{ // open bookcase with individual spines, cubbies and small ceramics
box(2,10,0,27,62,108,'#d6b88c','#c0a17c','#a58665');faceV(29,13,9,56,89,'#8f846a');for(const z of[8,35,66,98])box(1,10,z,30,62,3,'#e1c398','#c4a47b','#ac8d67');books(23,17,69,'v',7);books(23,19,38,'v',5);box(19,51,11,10,14,12,'#b1b9a0','#9da58b','#88987d');flower(20,57,102,75,.52);});
obj(58,()=>{ // kitchenette/sideboard with tile detail and a kettle
box(13,3,0,65,29,43,'#dfc9a4','#c3ae8a','#b59c77');for(let u=17;u<77;u+=21){faceU(u,32,6,18,32,'#d8bf96','#aa9577');const[a,b]=P(u+9,33,32);r(a,b,3,2,'#8e947d');}box(11,2,43,69,33,4,'#f5e9cd','#d1c6a8','#c3b695');box(20,13,47,18,12,2,'#8f9c8b','#788d7c','#71816f');box(21,14,49,15,10,9,'#b8c7ae','#96ad91','#8a9c84');let[a,b]=P(27,18,60);r(a-5,b-2,11,3,'#dce0bd');r(a-2,b-5,5,3,'#92a08a');box(54,12,47,9,8,9,'#e6b69b','#c99b83','#b58d75');});
obj(128,()=>{ // sofa with cushions, seams, a folded throw
shadow(6,101,50,91);for(let v of[108,173])box(12,v,0,6,6,7,'#b09c79','#8b8166','#8b8166');box(5,100,7,43,89,19,'#a0b291','#7f9678','#7d9074');box(5,100,26,11,89,29,'#acbd9a','#93a688','#8a9f80');box(16,100,26,32,9,20,'#c0ccb0','#a6b596','#99aa8b');box(16,180,26,32,9,20,'#c0ccb0','#a6b596','#99aa8b');box(18,112,26,28,32,8,'#b6c5a1','#9caf8c','#91a682');box(18,147,26,28,30,8,'#b6c5a1','#9caf8c','#91a682');box(18,114,34,15,18,13,'#e7c4a0','#caa985','#ba9c7c');for(let v=157;v<179;v+=4)slab(18,v,35,29,2,['#d7c9aa','#bba88e'][v%3?0:1]);});
obj(155,()=>{ // desk legs, top, drawer, vintage monitor, keyboard and stationery
shadow(96,10,103,48);for(const u of[100,187])for(const v of[13,45])box(u,v,0,4,4,53,'#c7a17c','#a88766','#967958');box(96,10,53,103,42,5,'#e5c394','#c4a079','#a98a66');box(167,14,40,28,32,12,'#d8b78c','#bc9c73','#ac8e68');faceU(171,47,43,21,7,'#c9aa80','#a48b69');let[a,b]=P(181,48,47);r(a,b,4,1,'#7b8c74');box(106,17,58,27,13,25,'#f3e3bb','#d7c79f','#c1b894');faceU(109,30.5,64,21,17,'#697f75','#acb99c');faceU(111,31,66,17,13,'#a2bcb0');faceU(113,31.2,73,12,1,'#dce8ce');faceU(113,31.2,70,8,1,'#dce8ce');box(108,34,58,28,12,2,'#e9d8af','#c9ba94','#b6aa88');for(let u=111;u<134;u+=4)for(let v=36;v<43;v+=3)slab(u,v,60.3,2,1,'#baa98a');box(144,20,58,8,8,9,'#7eaaa0','#70988c','#63887d');let[aa,bb]=P(149,24,69);r(aa-3,bb-1,6,2,'#c5d8b9');box(179,24,58,9,9,13,'#c0b6c5','#a49dac','#93919b');for(let i=0;i<4;i++){const[q,z]=P(180+i*2,28,73+i%2*3);r(q,z,1,9,['#be8d70','#7f9d85','#d2b16d','#9d9db0'][i]);}
// Bill paper stays legible through a coloured status strip; no automatic eviction props.
slab(147,36,58.5,24,13,'#fff2d3','#d0bf9a');for(let i=0;i<3;i++)line(P(150,40+i*3,59),P(165,40+i*3,59),'#b5b99c');if(ending){slab(149,37,59.5,14,3,s.money>=700?'#87a77b':'#c99778');if(s.money<700)slab(166,32,59,16,11,'#efc9a6','#c3a17c');}});
obj(193,()=>{ // the flower gets its own sill and sun
flower(183,5,76,s.flower,1.05);});
obj(208,()=>{ // reading lamp with warm paper shade
const u=28,v=202;box(u-8,v-8,0,16,16,3,'#929c7e','#7d896e','#7b856b');box(u-1,v-1,3,2,2,86,'#8b9677','#748666','#6d7b60');box(u-12,v-12,81,24,24,15,'#edc99a','#d5b489','#c4a37c');slab(u-7,v-7,97,14,14,'#f5dcb3');});
obj(219,()=>{ // reading table and tea
shadow(57,151,49,45);for(const u of[60,97])for(const v of[154,186])box(u,v,0,3,3,37,'#b99370','#a18060','#8c7256');box(55,149,37,51,42,5,'#eccd9f','#d3ae80','#b4956c');box(62,159,42,20,15,2,'#b7b8a3','#939e89','#84917c');box(63,158,44,19,14,2,'#d4ae90','#ba967c','#a7886c');const[a,b]=P(93,165,43);r(a-4,b-7,9,9,'#e2d8b6');r(a-4,b-8,9,2,'#8a9379');r(a+5,b-5,3,5,'#c1baa0');});
obj(237,()=>{ // chair, woven seat, backrest and wheels
shadow(110,103,39,40);for(const u of[113,137])for(const v of[107,132]){box(u,v,0,3,3,27,'#8f927b','#77866e','#6b7962');let[a,b]=P(u,v,0);r(a-2,b,5,3,'#6e7e68');}box(110,102,27,34,36,5,'#c6947c','#ab806a','#98755f');for(let i=0;i<4;i++)slab(114,107+i*7,32.3,26,1,'#d4ad8e');box(111,130,32,3,4,34,'#b59570','#947f60','#88745c');box(139,130,32,3,4,34,'#b59570','#947f60','#88745c');faceU(112,135,49,28,17,'#c89f80','#9c8264');faceU(115,135.2,52,22,1,'#dfbb94');});
obj(304,()=>{ // houseplant, watering can and tidy small floor stack
box(27,213,0,14,14,16,'#d0a27e','#b68b6a','#a07e60');let[a,b]=P(34,219,17);r(a,b-45,2,47,'#718f63');for(let i=0;i<7;i++){let side=i%2?1:-1,yy=b-12-i*5;poly([[a+1,yy],[a+side*15,yy-9],[a+side*17,yy-16],[a+side*4,yy-12]],i%3?'#9ab477':'#b0c48b');}
box(191,185,0,17,14,13,'#8daf9f','#789a8a','#648c7c');let[ca,cb]=P(205,186,9);poly([[ca,cb],[ca+14,cb-8],[ca+16,cb-5],[ca+2,cb+3]],'#8daf9f');let[ha,hb]=P(192,185,18);line([ha,hb],[ha-6,hb-6],'#789a8a',2);line([ha-6,hb-6],[ha-10,hb-1],'#789a8a',2);box(190,207,0,23,15,3,'#d9c9aa','#bdae8c','#a6997d');box(190,207,3,21,14,3,'#a8bba5','#899f88','#79937a');});
objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.fn());
// A small threshold and two stitched slipper shapes suggest a lived-in home.
slab(148,220,1,42,10,'#c6b895');for(let i=0;i<7;i++)line(P(151+i*5,222,1.3),P(151+i*5,228,1.3),'#a99f80');
// Gentle moving detail only while an action is playing.
if(time>0){const p=(Math.sin(time*2)+1)/2;const[a,b]=P(155,25,75);r(a,b-p*6,1,4,'#c1d2bb');r(a+5,b-3-p*5,1,4,'#c1d2bb');}
finish();}
function film(canvas,action,p=0,reduced=false){if(!canvas)return;if(reduced)p=.6;const {x:c,rect:r,poly,finish}=renderer(canvas,600,240);const line=(a,b,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();};const step=Math.sin(p*Math.PI*8),t=reduced?0:p;
function person(px,py,{apron=true,lean=0,cycle=false}={}){c.save();c.translate(Math.round(px),Math.round(py));const sway=cycle?Math.round(step*2):0;
// A fully clothed, rear-facing pixel character. No skin, facial identity or beneficiary likeness.
r(-9,-74+sway,18,14,'#687f6d');r(-11,-70+sway,22,5,'#89a08a');r(-7,-60+sway,14,6,'#9cae96');r(-13+lean,-54+sway,26,36,apron?'#a8b8a0':'#839b8b');r(-8+lean,-48+sway,16,29,apron?'#ead7ac':'#97ad9a');r(-17+lean,-49+sway,6,25,'#829c89');r(11+lean,-49+sway,6,25,'#829c89');r(-18+lean,-25+sway,8,6,'#e8dfc6');r(11+lean,-25+sway,8,6,'#e8dfc6');r(-11,-18+sway,9,18,'#637a74');r(2,-18+sway,9,18,'#637a74');r(-13,0+sway,12,5,'#526c65');r(2,0-sway,12,5,'#526c65');c.restore();}
const plant=(px,py)=>{r(px-12,py,24,5,'#c59675');r(px-9,py+5,18,17,'#dcb18b');r(px,py-47,3,47,'#7a985f');r(px-14,py-25,14,5,'#a2bc7c');r(px+3,py-33,14,5,'#8faa6c');r(px-7,py-55,9,9,'#dfaa9d');r(px+4,py-55,8,9,'#dfaa9d');r(px-9,py-47,23,7,'#e5b7a3');r(px,py-50,6,8,'#f4d693');};
r(0,0,600,240,'#f6edda');r(0,174,600,66,'#dcc5a0');for(let y=177;y<240;y+=14){r(0,y,600,1,'#ceb48e');for(let i=0;i<7;i++)r(i*91+(y%2)*14,y,1,14,'#d0b995');}
if(action==='restaurant'){
r(0,0,600,152,'#e6ebda');for(let x=0;x<600;x+=28)for(let y=22;y<154;y+=20){r(x,y,27,19,(x+y)%3?'#eaf0df':'#dde5d2');}r(20,16,155,11,'#8aa089');r(25,31,145,70,'#9bb7a6');r(30,35,135,62,'#c9dbca');r(95,35,4,62,'#8da58e');r(30,64,135,4,'#8da58e');r(402,29,161,5,'#a78d6c');for(let i=0;i<7;i++){r(411+i*20,13,12,15,['#d0b18a','#95b5a2','#c8a38d'][i%3]);r(411+i*20,11,12,2,'#f9edd4');}r(458,66,59,55,'#faf1db');r(464,73,47,3,'#bdc7a8');for(let i=0;i<4;i++)r(464,84+i*8,30+i%2*10,2,'#bdc7a8');
person(306+Math.sin(t*Math.PI*2)*26,168,{lean:Math.round(step*2)});r(81,169,436,9,'#e6be8c');r(87,178,424,48,'#ba9872');for(let i=0;i<13;i++)r(96+i*32,181,2,43,'#ac8b67');r(115,153,45,13,'#e1dfc1');r(120,149,35,4,'#faf0d5');r(429,156,16,13,'#9ab39b');r(424,166,27,3,'#b9c3a5');let xx=228+t*142;r(xx,159,42,5,'#e9e1c2');r(xx+9,153,24,6,'#d1a67f');r(xx+12,150,18,3,'#99ae74');if(t>.35&&t<.8){r(xx+13,141-Math.sin(t*9)*3,1,5,'#bac9ac');r(xx+23,139-Math.sin(t*8)*2,1,6,'#bac9ac');}
}else if(action==='delivery'){
r(0,0,600,121,'#d9e9dd');for(let i=0;i<7;i++){let xx=i*94-18;r(xx,35+i%2*16,77,112,['#d9c4a5','#d0d0b7','#dfcdb1'][i%3]);poly([[xx-3,35+i%2*16],[xx+38,14+i%2*16],[xx+80,35+i%2*16]],'#9da88e');for(let a=0;a<3;a++)for(let b=0;b<3;b++){r(xx+9+a*22,48+i%2*16+b*28,11,17,'#9cb7ab');r(xx+14+a*22,48+i%2*16+b*28,1,17,'#d7d9bc');}}r(0,146,600,94,'#c8d2b9');r(0,155,600,3,'#a9b89e');r(0,216,600,2,'#b8c3aa');const xx=70+t*460;for(let w of[-22,28]){c.strokeStyle='#5f8175';c.lineWidth=3;c.beginPath();c.arc(xx+w,201,16,0,Math.PI*2);c.stroke();line([xx+w,201],[xx+w+Math.sin(t*22)*13,201+Math.cos(t*22)*13],'#99ae95',1);}line([xx-22,201],[xx-4,175],'#5f8175');line([xx-4,175],[xx+13,201],'#5f8175');line([xx+13,201],[xx-22,201],'#5f8175');line([xx-4,175],[xx+22,175],'#5f8175');line([xx+22,175],[xx+28,201],'#5f8175');r(xx-3,132,15,33,'#8caa95');r(xx-1,120,12,13,'#6d8d79');r(xx-5,119,21,5,'#afc1a3');r(xx+6,165,9,22,'#6d867c');r(xx-20,143,18,25,'#c7aa7e');r(xx-19,143,16,4,'#e5c99b');line([xx+11,147],[xx+24,173],'#8caa95',6);r(27,155,11,16,'#94b17f');r(22,165,24,4,'#bda984');
}else if(action==='care'){
r(0,0,600,168,'#e5ebda');r(154,19,268,117,'#8aa390');r(161,26,254,104,'#c8e0d1');r(287,26,5,104,'#8aa390');r(161,75,254,4,'#8aa390');r(147,136,282,9,'#d6c4a0');plant(312,154);const xx=244+Math.sin(t*Math.PI)*24;r(xx-33,95,45,28,'#94b6a4');r(xx-28,93,35,4,'#c4d2ad');poly([[xx+12,106],[xx+53,121],[xx+51,126],[xx+9,114]],'#94b6a4');line([xx-31,99],[xx-45,81],'#7a9a87',4);line([xx-45,81],[xx-50,102],'#7a9a87',4);if(t>.15&&t<.9)for(let i=0;i<7;i++){const yy=127+((t*130+i*9)%30);r(301+i%3*7,yy,2,4,'#85b5b1');}r(116,182,334,8,'#c8aa7e');for(let i=0;i<4;i++){const yy=115-((t*45+i*12)%48);r(348+i*8,yy,2,2,'#b6c89a');}
}else if(action==='rest'){
r(0,0,600,167,'#e5e8d8');r(31,21,156,106,'#b2c9b3');r(37,27,144,94,'#dce8cb');r(105,27,4,94,'#a7bca3');r(37,74,144,4,'#a7bca3');r(230,125,219,54,'#9db293');r(218,113,23,81,'#aac09d');r(440,113,23,81,'#aac09d');r(237,95,204,22,'#a7bc9d');r(243,139,88,32,'#b9c8ab');r(336,139,99,32,'#b9c8ab');r(253,107,48,36,'#dfbea0');for(let i=0;i<8;i++)r(373,112+i*7,49,3,i%2?'#d4c5a4':'#b29d85');r(144,187,147,7,'#ddbf92');r(151,194,6,34,'#b29773');r(278,194,6,34,'#b29773');r(200,164,26,22,'#eddfbd');r(202,162,22,4,'#8a9b80');r(226,168,8,12,'#ccb995');for(let i=0;i<3;i++){const yy=149-((t*22+i*7)%23);r(204+i*7+Math.sin(t*5+i)*2,yy,1,5,'#bccab0');}r(62,149,3,51,'#c2b38c');r(45,139,38,14,'#efd5a9');
}else if(action==='borrow'){
r(0,0,600,174,'#e5e9da');r(367,29,75,75,'#b9b499');r(373,35,63,63,'#fbf1d7');r(402,44,3,27,'#81947d');const angle=t*Math.PI*2;line([405,69],[405+Math.sin(angle)*22,69-Math.cos(angle)*22],'#b19977',3);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;r(404+Math.sin(a)*25,67-Math.cos(a)*25,2,3,'#c0b99a');}person(255,179,{lean:Math.round(Math.sin(t*5)*3)});r(143,170,270,8,'#dfc196');r(152,178,6,56,'#ba9d77');r(396,178,6,56,'#ba9d77');r(298,154,45,15,'#f6ead0');for(let i=0;i<4;i++)r(302,156+i*3,31,1,'#c1c8aa');r(354,148,15,22,'#a7b7a3');
}else if(action==='job'){
r(0,0,600,174,'#e9ebda');r(105,25,164,119,'#c3ab84');r(113,33,148,103,'#e1d8b6');for(let i=0;i<4;i++){r(124+i%2*66,46+Math.floor(i/2)*42,53,33,['#f6ead1','#c7d4b8','#e3c6a7','#c1d4c8'][i]);r(129+i%2*66,51+Math.floor(i/2)*42,34,2,'#9dac8b');r(129+i%2*66,58+Math.floor(i/2)*42,25,2,'#9dac8b');}person(341,185,{apron:false,lean:Math.round(Math.sin(t*4)*2)});r(296,129,35,28,'#f5ecd3');for(let i=0;i<3;i++)r(301,135+i*5,24,2,'#b2c0a0');if(t>.55){line([382,87],[388,94],'#8faa78',3);line([388,94],[402,77],'#8faa78',3);}
}
finish();}
function icon(canvas,type){const {rect:r,poly,finish}=renderer(canvas,32,32);const ink='#718c72',light='#b2c39c',warm='#d5ae80';if(type==='restaurant'){r(4,20,24,3,ink);r(8,15,16,5,light);r(10,11,12,4,light);r(14,8,4,3,warm);r(3,24,26,2,warm);}else if(type==='delivery'){r(6,10,20,17,light);r(11,5,10,3,ink);r(9,8,3,5,ink);r(20,8,3,5,ink);r(9,15,14,3,warm);r(15,19,3,8,ink);}else if(type==='care'){r(13,14,3,13,ink);r(5,16,8,4,light);r(16,11,8,4,light);r(10,3,5,6,'#d6a08c');r(17,4,5,6,'#d6a08c');r(13,8,6,5,warm);r(9,26,14,4,warm);}else if(type==='rest'){r(6,13,18,13,light);r(24,15,4,8,ink);r(8,10,14,3,ink);r(10,3,2,5,warm);r(18,2,2,6,warm);r(3,28,25,2,warm);}else if(type==='borrow'){r(6,6,21,23,light);r(3,3,25,4,ink);r(15,10,3,10,ink);r(18,18,6,3,ink);r(14,1,5,3,warm);}else{r(7,4,20,25,light);r(10,8,13,2,ink);r(10,13,10,2,ink);r(10,18,13,2,ink);r(10,23,8,2,warm);}finish();}
return {room,film,icon};
})();
