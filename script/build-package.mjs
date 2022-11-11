import path from 'path';
import fs from 'fs';
import url from 'url';

const rootDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

copyPackageJsonFile('hapi-proto');
copyPackageJsonFile('hapi-util');
copyPackageJsonFile('hapi-mirror');
copyPackageJsonFile('hapi-connect');

function copyPackageJsonFile(project) {
    const projDir = path.join(rootDir, 'packages', project);
    const libDir = path.join(projDir, 'lib');
    const pkg = JSON.parse(fs.readFileSync(path.join(projDir, 'package.json'), 'utf-8'));
    pkg['main'] = './index.js';
    pkg['exports'] = './index.js';
    fs.writeFileSync(path.join(libDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8');
}
