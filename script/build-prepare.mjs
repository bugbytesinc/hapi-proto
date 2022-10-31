import path from 'path';
import fs from 'fs';
import url from 'url';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const protoMirrorDir = path.resolve(projDir, 'reference', 'hedera-protobufs', 'mirror');
const protoServicesDir = path.resolve(projDir, 'reference', 'hedera-protobufs', 'services');
const srcDir = path.join(projDir, 'src');
const srcProto = path.join(srcDir, 'proto-src');
const genProto = path.join(srcDir, 'proto');
const libDir = path.join(projDir, 'lib');

fs.rmSync(libDir, { recursive: true, force: true });
fs.rmSync(srcDir, { recursive: true, force: true });
fs.mkdirSync(srcDir);
fs.mkdirSync(srcProto);
fs.mkdirSync(genProto);
fs.copyFileSync(path.join(protoMirrorDir, 'consensus_service.proto'), path.join(srcProto, 'consensus_service.proto'));
for(const file of fs.readdirSync(protoServicesDir)) {
  fs.copyFileSync(path.join(protoServicesDir, file), path.join(srcProto, file));
}
