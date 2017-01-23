const Promise = require('bluebird');
const sass = require('node-sass');
const path = require('path');
const { parseDeclarations } = require('./parse');
const { load, loadSync } = require('./load');
const { injectFunctions } = require('./inject');

Promise.promisifyAll(sass);

function compileResult(extractionMap) {
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

function makeImporter(extractionMap) {
  return function(url, prev, done) {
    // TOOD: Add async variant of importer
    try {
      let absolutePath = path.join(path.dirname(prev), url);
      let extension = path.extname(prev);

      // Ensure import directive path include extension
      if(path.extname(absolutePath) !== extension) {
        absolutePath += extension;
      }

      done({ file: absolutePath, contents: extractionMap[absolutePath].injectedData });
    } catch(err) {
      // note: importer has to return any error
      done(err);
    }
  }
}

function makeSyncImporter(extractionMap) {
  return function(url, prev) {
    // TOOD: Add async variant of importer
    try {
      let absolutePath = path.join(path.dirname(prev), url);
      let extension = path.extname(prev);

      // Ensure import directive path include extension
      if(path.extname(absolutePath) !== extension) {
        absolutePath += extension;
      }

      return { file: absolutePath, contents: extractionMap[absolutePath].injectedData };
    } catch(err) {
      // note: importer has to return any error
      return err;
    }
  }
}

function augmentExtractionCompilerOption(compileOptions, completeExtractionFunctions, entryFilename, extractionMap) {
  const extractionCompileOptions = Object.assign({}, compileOptions);

  extractionCompileOptions.functions = completeExtractionFunctions;
  extractionCompileOptions.filename = entryFilename;
  extractionCompileOptions.data = extractionMap[entryFilename].injectedData;

  return extractionCompileOptions;
}

function processFile(filename, includedData, extractionMap, completeExtractionFunctions) {
  const declarations = parseDeclarations(includedData);
  const variableResults = {};

  const declarationResultHandler = (context, declaration, value) => {
    if(!variableResults[context]) {
      variableResults[context] = {};
    }

    variableResults[context][declaration.declaration] = { value, expression: declaration.expression };
  }

  const injection = injectFunctions(filename, includedData, declarations, declarationResultHandler);
  completeExtractionFunctions = Object.assign(completeExtractionFunctions, injection.injectedFunctions);

  extractionMap[filename] = {
    includedData,
    declarations,
    variableResults,
    injectedData: injection.injectedData,
    injectedFunctions: injection.injectedFunctions,
  };
}

exports.extract = (rendered, { compileOptions = {} } = {}) => {
  const extractionMap = {};
  let completeExtractionFunctions = {};
  const entryFilename = rendered.stats.entry;

  return Promise.resolve()
  .then(() => {
    return Promise.all(rendered.stats.includedFiles.map(filename => {
      return load(filename)
      .then(includedData => {
        processFile(filename, includedData, extractionMap, completeExtractionFunctions);
      })
    }));
  })
  .then(() => {
    const extractionCompileOptions = augmentExtractionCompilerOption(compileOptions, completeExtractionFunctions, entryFilename, extractionMap);
    extractionCompileOptions.importer = makeImporter(extractionMap);
    return sass.renderAsync(extractionCompileOptions);
  })
  .then(() => {
    const extractedVariables = compileResult(extractionMap);
    return extractedVariables;
  });
}

exports.extractSync = (rendered, { compileOptions = {} } = {}) => {
  const extractionMap = {};
  let completeExtractionFunctions = {};
  const entryFilename = rendered.stats.entry;


  rendered.stats.includedFiles.forEach(filename => {
    const includedData = loadSync(filename);
    processFile(filename, includedData, extractionMap, completeExtractionFunctions);
  });

  const extractionCompileOptions = augmentExtractionCompilerOption(compileOptions, completeExtractionFunctions, entryFilename, extractionMap);
  extractionCompileOptions.importer = makeSyncImporter(extractionMap);

  sass.renderSync(extractionCompileOptions);

  const extractedVariables = compileResult(extractionMap);

  return extractedVariables;
}
