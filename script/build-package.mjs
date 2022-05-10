import path from 'path';
import fs from 'fs';
import url from 'url';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const libDir = path.join(projDir, 'lib');

fs.copyFileSync(path.join(projDir, 'package.publish.json'), path.join(libDir, 'package.json'));