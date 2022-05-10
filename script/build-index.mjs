import path from 'path';
import fs from 'fs';
import url from 'url';
import ts from 'typescript';

const projDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const baseSrcDir = path.join(projDir, 'src');
const allSources = fs.readdirSync(path.join(baseSrcDir, 'services')).filter(f => f.endsWith('.ts')).map(f => path.join(baseSrcDir, 'services', f));
const protoSymbols = {};
const protoExcludes = [
  'DeepPartial'
];
const options = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext
};
const host = ts.createCompilerHost(options);
const program = ts.createProgram(allSources, options, host);
host.writeFile = (_fileName, _contents) => { }
program.emit();

for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    for (const statement of sourceFile.statements) {
      for (const name of tryGetExportedNames(statement)) {
        if (!protoExcludes.includes(name)) {
          if (protoSymbols[name]) {
            if (sourceFile.fileName.endsWith('.extensions.ts')) {
              protoSymbols[name] = sourceFile.fileName;
            } else if (!protoSymbols[name].endsWith('.extensions.ts')) {
              throw new Error(`Duplicate symbol ${name} from ${sourceFile.fileName}`);
            }
          } else {
            protoSymbols[name] = sourceFile.fileName;
          }
        }
      }
    }
  }
}

const protoExports = Object.keys(protoSymbols).sort();
const protoImports = {};
for (const symbol of protoExports) {
  const importPath = fileNameToImportPath(protoSymbols[symbol]);
  if (protoImports[importPath]) {
    protoImports[importPath].push(symbol);
  } else {
    protoImports[importPath] = [symbol];
  }
}

const outputFile = fs.createWriteStream(path.join(baseSrcDir, 'index.ts'));
for (const importPath of Object.keys(protoImports).sort()) {
  outputFile.write(`import { ${protoImports[importPath].join(', ')} } from '${importPath}';\n`);
}
outputFile.write(`export { ${protoExports.join(', ')} };\n`);
outputFile.end();

function tryGetExportedNames(statement) {
  const result = [];
  if ((ts.getCombinedModifierFlags(statement) & ts.ModifierFlags.Export) !== 0) {
    if (statement.symbol) {
      const name = statement.symbol.escapedName;
      if (name) {
        result.push(name);
      }
    }
  } else if (ts.isExportDeclaration(statement)) {
    for (const element of statement.exportClause.elements) {
      if (element.symbol) {
        const name = element.symbol.escapedName;
        if (name) {
          result.push(name);
        }
      }
    }
  }
  return result;
}

function fileNameToImportPath(fileName) {
  const parts = path.parse(fileName);
  return './' + path.join(path.relative(baseSrcDir, parts.dir), parts.name).split(path.sep).join('/');
}