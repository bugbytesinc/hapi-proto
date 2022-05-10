import path from 'path';
import fs from 'fs';
import url from 'url';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const libDir = path.join(projDir, 'lib');
const srcDir = path.join(projDir, 'src');

fs.rmSync(libDir, { recursive: true, force: true });
fs.rmSync(srcDir, { recursive: true, force: true });