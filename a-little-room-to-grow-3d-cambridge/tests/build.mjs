import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const dist=path.join(root,'dist');
fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
const home=read('src/home-original.html');
if(!home.includes('</body>'))throw new Error('Original homepage is incomplete');
// Keep the exact original available for its existing regression suite.
fs.writeFileSync(path.join(root,'index.html'),home);
fs.writeFileSync(path.join(dist,'home.html'),home.replace('</body>','<script src="./home-bridge.js"></script>\n</body>'));
fs.writeFileSync(path.join(dist,'index.html'),read('src/integration-shell.html'));
for(const file of ['app.js','home-bridge.js','integration.css','room1.html','room2.html'])fs.copyFileSync(path.join(root,'src',file),path.join(dist,file));
fs.copyFileSync(path.join(root,'assets/pledge-logo-supplied.png'),path.join(dist,'assets/pledge-logo-supplied.png'));
const obsolete=path.join(dist,'room.html');if(fs.existsSync(obsolete))fs.unlinkSync(obsolete);
console.log('Built 3D1 → complete original homepage → 3D2, without editing original homepage content.');
