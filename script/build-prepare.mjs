import path from 'path';
import fs from 'fs';
import url from 'url';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(projDir, 'src');
const libDir = path.join(projDir, 'lib');

fs.rmSync(libDir, { recursive: true, force: true });
fs.rmSync(srcDir, { recursive: true, force: true });
fs.mkdirSync(srcDir);
fs.mkdirSync(path.join(srcDir, 'services'));
fs.mkdirSync(path.join(srcDir, 'services', 'services'));
fs.mkdirSync(path.join(srcDir, 'mirror'));
fs.mkdirSync(path.join(srcDir, 'mirror', 'mirror'));
