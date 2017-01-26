const { injectExtractionFunctions } = require('./inject');
const { parseDeclarations } = require('./parse');

function getFileId(filename) {
  return new Buffer(filename).toString('base64').replace(/=/g, '');
}

function processCompiledFile(filename, data) {
  const declarations = parseDeclarations(data);
  const variables = { global: {} };

  const globalDeclarationResultHandler = (declaration, value) => {
    variables.global[declaration.declaration] = { value, expression: declaration.expression };
  }

  const fileId = getFileId(filename);
  const injection = injectExtractionFunctions(fileId, declarations, { globalDeclarationResultHandler });
  const injectedData = `${data}\n\n${injection.injectedData}`;
  const injectedFunctions = injection.injectedFunctions;

  return {
    declarations,
    variables,
    injectedData,
    injectedFunctions,
  };
}

function processCompiledFiles(compiledFiles) {
  const extractions = {};

  Object.keys(compiledFiles).map(filename => {
    extractions[filename] = processCompiledFile(filename, compiledFiles[filename]);
  });

  return extractions;
}

exports.processCompiledFiles = processCompiledFiles;