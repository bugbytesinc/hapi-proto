import path from 'path';
import fs from 'fs';
import url from 'url';

const rootDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

prepareHapiProto();
prepareHapiUtil();
prepareHapiMirror();
prepareHapiConnect();
prepareHapiMempool();

function prepareHapiProto() {
    const projDir = path.join(rootDir, 'packages', 'hapi-proto');
    const libDir = path.join(projDir, 'lib');
    const srcDir = path.join(projDir, 'src');
    const servicesProtoDir = path.join(rootDir, 'reference', 'hedera-protobufs', 'services');
    const mirrorProtoDir = path.join(rootDir, 'reference', 'hedera-protobufs', 'mirror');
    const combinedProtoDir = path.join(projDir, 'src', 'proto-src');
    const srcTypescriptProtoDir = path.join(projDir, 'src', 'proto');

    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(srcDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
    fs.mkdirSync(srcDir);
    fs.mkdirSync(combinedProtoDir);
    fs.mkdirSync(srcTypescriptProtoDir);

    for (const file of fs.readdirSync(servicesProtoDir)) {
        fs.copyFileSync(path.join(servicesProtoDir, file), path.join(combinedProtoDir, file));
    }
    for (const file of fs.readdirSync(mirrorProtoDir)) {
        fs.copyFileSync(path.join(mirrorProtoDir, file), path.join(combinedProtoDir, file.startsWith('mirror_') ? file : 'mirror_' + file));
    }
}

function prepareHapiUtil() {
    const projDir = path.join(rootDir, 'packages', 'hapi-util');
    const libDir = path.join(projDir, 'lib');

    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
}

function prepareHapiMirror() {
    const projDir = path.join(rootDir, 'packages', 'hapi-mirror');
    const libDir = path.join(projDir, 'lib');

    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
}

function prepareHapiConnect() {
    const projDir = path.join(rootDir, 'packages', 'hapi-connect');
    const libDir = path.join(projDir, 'lib');

    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
}

function prepareHapiMempool() {
    const projDir = path.join(rootDir, 'packages', 'hapi-mempool');
    const libDir = path.join(projDir, 'lib');

    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
}
