const sass = require('node-sass');
const path = require('path');
const { parseDeclarations } = require('./parse');
const { loadSync } = require('./load');
const { injectFunctions } = require('./inject');

exports.extractSync = (rendered, { compileOptions = {} } = {}) => {
  const extractionMap = {};
  let completeExtractionFunctions = {};
  const entryFilename = rendered.stats.entry;


  rendered.stats.includedFiles.forEach(filename => {
    const includedData = loadSync(filename);
    const declarations = parseDeclarations(includedData);
    const variableResults = {};

    const declarationResultHandler = (context, declaration, value) => {
      if(!variableResults[context]) {
        variableResults[context] = {};
      }

      variableResults[context][declaration.declaration] = { value, expression: declaration.expression };
    }

    const injection = injectFunctions(filename, includedData, declarations, declarationResultHandler);
    completeExtractionFunctions = Object.assign({}, completeExtractionFunctions, injection.injectedFunctions);

    extractionMap[filename] = {
      includedData,
      declarations,
      variableResults,
      injectedData: injection.injectedData,
      injectedFunctions: injection.injectedFunctions,
    }
  });

  const extractionCompileOptions = Object.assign({}, compileOptions);

  extractionCompileOptions.functions = completeExtractionFunctions;
  extractionCompileOptions.filename = entryFilename;
  extractionCompileOptions.data = extractionMap[entryFilename].injectedData;
  extractionCompileOptions.importer = function(url, prev) {
    let absolutePath = path.join(path.dirname(prev), url);
    if(path.extname(absolutePath) !== '.scss') {
      absolutePath += '.scss';
    }
    return { file: absolutePath, contents: extractionMap[absolutePath].injectedData };
  }

  sass.renderSync(extractionCompileOptions);

  const extractedVariables = {};

  Object.keys(extractionMap).map(filename => {
    Object.keys(extractionMap[filename].variableResults).map(variableContext => {
      Object.keys(extractionMap[filename].variableResults[variableContext]).map(variableKey => {
        if(!extractedVariables[variableContext]) {
          extractedVariables[variableContext] = {};
        }

        if(!extractedVariables[variableContext][variableKey]) {
          extractedVariables[variableContext][variableKey] = Object.assign({}, extractionMap[filename].variableResults[variableContext][variableKey].value);

          extractedVariables[variableContext][variableKey].sources = [];
          extractedVariables[variableContext][variableKey].expressions = [];
        }

        extractedVariables[variableContext][variableKey].sources.push(filename);
        extractedVariables[variableContext][variableKey].expressions.push(extractionMap[filename].variableResults[variableContext][variableKey].expression);
      });
    });
  });

  return extractedVariables;
}
