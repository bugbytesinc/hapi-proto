import path from 'path';
import fs from 'fs';
import url from 'url';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const libDir = path.join(projDir, 'lib');

fs.copyFileSync(path.join(projDir, 'package.publish.services.json'), path.join(libDir, 'services', 'package.json'));
fs.copyFileSync(path.join(projDir, 'package.publish.mirror.json'), path.join(libDir, 'mirror', 'package.json'));