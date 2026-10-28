import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
execFileSync(process.execPath,['tests/build.mjs'],{cwd:root,stdio:'inherit'});
execFileSync(process.execPath,['export-tools/build-standalone.mjs','.', 'dist/index.html','vendor'],{cwd:root,stdio:'inherit'});
