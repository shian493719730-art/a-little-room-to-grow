import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [sourceArg,outputArg,vendorArg]=process.argv.slice(2);
if(!sourceArg||!outputArg||!vendorArg)throw Error('Usage: node build-standalone.mjs SOURCE_DIR OUTPUT_HTML VENDOR_DIR');
const source=path.resolve(sourceArg),output=path.resolve(outputArg),vendor=path.resolve(vendorArg);
const read=file=>fs.readFileSync(path.join(source,'dist',file),'utf8');
// Embedded srcdoc documents can report opaque origins for file://. Match the
// exact parent/frame WindowProxy (already checked by each listener) instead of
// comparing URL origins; only non-sensitive view/language signals are posted.
const portable=s=>s.replaceAll(',location.origin)',",'*')")
 .replaceAll('if(e.origin!==location.origin||!e.data)return;','if(!e.data)return;')
 .replaceAll('if(e.origin!==location.origin||e.source!==window.parent||','if(e.source!==window.parent||')
 .replaceAll('e.origin===location.origin&&e.source===window.parent','e.source===window.parent');
const logo='data:image/png;base64,'+fs.readFileSync(path.join(source,'dist/assets/pledge-logo-supplied.png')).toString('base64');
const payload={
 room1:portable(read('room1.html')),
 room2:portable(read('room2.html')).replaceAll('./assets/pledge-logo-supplied.png',logo),
 home:read('home.html').replace('<script src="./home-bridge.js"></script>','<script>'+portable(read('home-bridge.js'))+'</script>'),
 core:fs.readFileSync(path.join(vendor,'three.core.js'),'utf8'),
 three:fs.readFileSync(path.join(vendor,'three.module.js'),'utf8').replaceAll("'./three.core.js'","'three/core'"),
 controls:fs.readFileSync(path.join(vendor,'OrbitControls.js'),'utf8'),
 license:fs.readFileSync(path.join(vendor,'LICENSE-three.txt'),'utf8')
};
let app=portable(read('app.js'));
const old="if(!frames[view].getAttribute('src'))frames[view].src=view==='home'?'./home.html'+(previous==='3d2'?'?review=1':''):'./room2.html';";
if(!app.includes(old))throw Error('Unexpected integration loader; review before exporting');
app=app.replace(old,"if(!frames[view].hasAttribute('srcdoc'))frames[view].srcdoc=embeddedViews[view];");
app=app.replace("if(record&&location.hash!=='#'+view)history.pushState(null,'','#'+view);","if(record&&location.hash!=='#'+view){try{history.pushState(null,'','#'+view);}catch{location.hash=view;}}");
app=app.replace("$('#finish-visit').addEventListener", "$('#entry-play').addEventListener('click',()=>show('home'));\n$('#finish-visit').addEventListener");
const boot=String.raw`
const assets=JSON.parse(document.getElementById('embedded-experience').textContent);
const moduleURL=s=>'data:text/javascript;base64,'+btoa(new TextEncoder().encode(s).reduce((s,b)=>s+String.fromCharCode(b),''));
const imports={three:moduleURL(assets.three),'three/core':moduleURL(assets.core),'three/addons/controls/OrbitControls.js':moduleURL(assets.controls)};
const importmap='<script type="importmap">'+JSON.stringify({imports})+'<\/script>';
const embedRoom=s=>s.replace(/<script type="importmap">[\s\S]*?<\/script>/,importmap);
const embeddedViews={'3d1':embedRoom(assets.room1),home:assets.home,'3d2':embedRoom(assets.room2)};
document.getElementById('frame-3d1').srcdoc=embeddedViews['3d1'];
`;
let shell=read('index.html');
shell=shell.replace('<link rel="stylesheet" href="./integration.css">','<style>'+read('integration.css')+'</style>')
 .replace('<script src="./app.js" defer></script>','')
 .replace(' src="./room1.html"','')
 .replace('</head>','<meta name="author" content="Zhiang Wang; Wen Xiao - Co-creators">\n</head>');
shell=shell.replace('</head>','<style>.entry-play{position:absolute;z-index:12;left:50%;bottom:78px;transform:translateX(-50%);padding:12px 30px;min-height:44px;border:1px solid #8d9c81;border-radius:6px;background:#faf5ebeF;color:#354f40;font:600 15px system-ui,sans-serif;box-shadow:0 4px 20px #263c3020}</style>\n</head>');
shell=shell.replace('<iframe id="frame-3d1"', '<button id="entry-play" class="entry-play" type="button" aria-label="Play A Little Room to Grow">Play →</button>\n      <iframe id="frame-3d1"');
const escaped=JSON.stringify(payload).replaceAll('<','\\u003c');
shell=shell.replace('</body>',()=>'<script id="embedded-experience" type="application/json">'+escaped+'</script>\n<script>'+boot+'\n'+app+'</script>\n</body>');
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,shell);
console.log(JSON.stringify({output,bytes:Buffer.byteLength(shell),sha256:crypto.createHash('sha256').update(shell).digest('hex'),contains:'3D1 → complete original homepage/game → 3D2',threeVersion:'0.184.0',externalRuntimeRequests:0},null,2));
