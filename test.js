const ts = require('typescript');
const path = require('path');

// **Note**: Relative path!
const tsconfigPath = 'src/tsconfig.json';

const parsed = parseTsconfigFile(tsconfigPath, path.dirname(tsconfigPath));
const host = ts.createCompilerHost(parsed.options, true);
const program = ts.createProgram(parsed.fileNames, parsed.options, host);

const testFile = program.getSourceFile(path.join(__dirname, 'src/test.ts'));
const testClass = testFile.statements[1];
const rendererParamTypeRef = testClass.members[0].parameters[0].type;

console.error(rendererParamTypeRef.parent.parent.getText());

// Resolve symbol for `Renderer` identifier of type reference.
const res = program.getTypeChecker().getSymbolAtLocation(rendererParamTypeRef.typeName);

console.error(res.name)

function parseTsconfigFile(tsconfigPath, basePath) {
    const {config} = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    const parseConfigHost = {
      useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
      fileExists: ts.sys.fileExists,
      readDirectory: ts.sys.readDirectory,
      readFile: ts.sys.readFile,
    };
  
    return ts.parseJsonConfigFileContent(config, parseConfigHost, basePath, {});
  }
  