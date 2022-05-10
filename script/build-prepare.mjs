import path from 'path';
import fs from 'fs';
import url from 'url';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(projDir, 'src');
const servicesDir = path.join(srcDir, 'services');

if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir);
}

if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir);
}
