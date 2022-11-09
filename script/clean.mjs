import path from 'path';
import fs from 'fs';
import url from 'url';

const rootDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

cleanHapiProto();
cleanHapiUtil();
cleanHapiMirror();

function cleanHapiProto() {
    const projDir = path.join(rootDir, 'packages', 'hapi-proto');
    const libDir = path.join(projDir, 'lib');
    const srcDir = path.join(projDir, 'src');
    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(srcDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
}

function cleanHapiUtil() {
    const projDir = path.join(rootDir, 'packages', 'hapi-util');
    const libDir = path.join(projDir, 'lib');
    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
}

function cleanHapiMirror() {
    const projDir = path.join(rootDir, 'packages', 'hapi-mirror');
    const libDir = path.join(projDir, 'lib');
    fs.rmSync(libDir, { recursive: true, force: true });
    fs.rmSync(path.join(projDir, 'tsconfig.tsbuildinfo'), { force: true });
}