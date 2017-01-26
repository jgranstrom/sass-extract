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
      const contextVariables = extractionMap[filename].variableResults[variableContext];

      Object.keys(contextVariables).map(variableKey => {
        if(!extractedVariables[variableContext]) {
          extractedVariables[variableContext] = {};
        }

        let variable = extractedVariables[variableContext][variableKey];
        if(!variable) {
          variable = extractedVariables[variableContext][variableKey] = Object.assign({}, contextVariables[variableKey].value);

          variable.sources = [];
          variable.expressions = [];
        }

        variable.sources.push(filename);
        variable.expressions.push(contextVariables[variableKey].expression);
      });
    });
  });

  return extractedVariables;
}

function makeImporter(extractionMap) {
  return function(url, prev, done) {
    try {
      let absolutePath = path.join(path.dirname(prev), url);
      let extension = path.extname(prev);

      // Ensure import directive path include extension
      if(path.extname(absolutePath) !== extension) {
        absolutePath += extension;
      }

      if(prev === 'stdin') {
        // Imported from raw data, try to find the absolute path for import from relative path in extraction map keys
        const keys = Object.keys(extractionMap);
        for(let i = 0; i < keys.length; i++) {
          if(keys[i].match(url)) {
            absolutePath = keys[i];
            break;
          }
        }
      }

      done({ file: absolutePath, contents: extractionMap[absolutePath].injectedData });
    } catch(err) {
      done(err);
    }
  }
}

function makeSyncImporter(extractionMap) {
  return function(url, prev) {
    try {
      let absolutePath = path.join(path.dirname(prev), url);
      let extension = path.extname(prev);

      // Ensure import directive path include extension
      if(path.extname(absolutePath) !== extension) {
        absolutePath += extension;
      }

      if(prev === 'stdin') {
        // Imported from raw data, try to find the absolute path for import from relative path in extraction map keys
        const keys = Object.keys(extractionMap);
        for(let i = 0; i < keys.length; i++) {
          if(keys[i].match(url)) {
            absolutePath = keys[i];
            break;
          }
        }
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
    if(entryFilename === 'data' && compileOptions.data) {
      const includedData = compileOptions.data;
      return processFile(entryFilename, includedData, extractionMap, completeExtractionFunctions);
    }
  })
  .then(() => {
    return Promise.all(rendered.stats.includedFiles.map(filename => {
      return load(filename)
      .then(includedData => {
        return processFile(filename, includedData, extractionMap, completeExtractionFunctions);
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

  if(entryFilename === 'data' && compileOptions.data) {
    const includedData = compileOptions.data;
    processFile(entryFilename, includedData, extractionMap, completeExtractionFunctions);
  }

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
