import path from 'path';
import fs from 'fs';
import url from 'url';

const rootDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

copyHapiProtoPackageFiles();
copyHapiUtilPackageFiles();
copyHapiMirrorPackageFiles();

function copyHapiProtoPackageFiles() {
    const projDir = path.join(rootDir, 'packages', 'hapi-proto');
    const libDir = path.join(projDir, 'lib');

    fs.copyFileSync(path.join(projDir, 'package.publish.json'), path.join(libDir, 'package.json'));
}

function copyHapiUtilPackageFiles() {
    const projDir = path.join(rootDir, 'packages', 'hapi-util');
    const libDir = path.join(projDir, 'lib');

    fs.copyFileSync(path.join(projDir, 'package.publish.json'), path.join(libDir, 'package.json'));
}

function copyHapiMirrorPackageFiles() {
    const projDir = path.join(rootDir, 'packages', 'hapi-mirror');
    const libDir = path.join(projDir, 'lib');

    fs.copyFileSync(path.join(projDir, 'package.publish.json'), path.join(libDir, 'package.json'));
}
