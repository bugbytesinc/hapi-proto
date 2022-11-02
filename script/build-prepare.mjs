import path from 'path';
import fs from 'fs';
import url from 'url';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(projDir, 'src');
const srcProtoDir = path.join(projDir, 'src', 'proto-src');
const libDir = path.join(projDir, 'lib');
const servicesSrcDir = path.join(projDir, 'reference', 'hedera-protobufs', 'services');
const mirrorSrcDir = path.join(projDir, 'reference', 'hedera-protobufs', 'mirror');

fs.rmSync(libDir, { recursive: true, force: true });
fs.rmSync(srcDir, { recursive: true, force: true });
fs.mkdirSync(srcDir);
fs.mkdirSync(srcProtoDir);
fs.mkdirSync(path.join(srcDir, 'proto'));

for(const file of fs.readdirSync(servicesSrcDir)) {
    fs.copyFileSync(path.join(servicesSrcDir, file), path.join(srcProtoDir, file));
}
for(const file of fs.readdirSync(mirrorSrcDir)) {
    fs.copyFileSync(path.join(mirrorSrcDir, file), path.join(srcProtoDir, file.startsWith('mirror_') ? file : 'mirror_' + file));
}