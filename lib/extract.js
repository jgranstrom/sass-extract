const Promise = require('bluebird');
const sass = require('node-sass');
const { loadCompiledFiles, loadCompiledFilesSync } = require('./load');
const { processCompiledFiles } = require('./process');
const { makeImporter, makeSyncImporter } = require('./importer');

Promise.promisifyAll(sass);

/**
 * Make the compilation option for the extraction rendering
 * Set the data to be rendered to the injected source
 * Add compilation functions and custom importer for injected sources
 */
function makeExtractionCompileOptions(compileOptions, entryFilename, extractions, importer) {
  const extractionCompileOptions = Object.assign({}, compileOptions);
  const extractionFunctions = {};

  // Copy all extraction function for each file into one object for compilation
  Object.keys(extractions).forEach(extractionKey => {
    Object.assign(extractionFunctions, extractions[extractionKey].injectedFunctions);
  });

  extractionCompileOptions.functions = extractionFunctions;
  extractionCompileOptions.data = extractions[entryFilename].injectedData;
  extractionCompileOptions.importer = importer;

  return extractionCompileOptions;
}

function compileExtractionResult(extractions) {
  const extractedVariables = {};

   Object.keys(extractions).map(filename => {
    Object.keys(extractions[filename].variables).map(variableContext => {
      const contextVariables = extractions[filename].variables[variableContext];

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

function extract(rendered, { compileOptions = {} } = {}) {
  const entryFilename = rendered.stats.entry;
  const includedFiles = rendered.stats.includedFiles;

  return Promise.resolve()
  .then(() => {
    return loadCompiledFiles(includedFiles, entryFilename, compileOptions.data);
  })
  .then(compiledFiles => {
    const extractions = processCompiledFiles(compiledFiles);
    const importer = makeImporter(extractions);
    const extractionCompileOptions = makeExtractionCompileOptions(compileOptions, entryFilename, extractions,  importer);
    
    return sass.renderAsync(extractionCompileOptions)
    .then(() => {
      return compileExtractionResult(extractions);
    });
  });
}

function extractSync(rendered, { compileOptions = {} } = {}) {
  const entryFilename = rendered.stats.entry;
  const includedFiles = rendered.stats.includedFiles;
  const compiledFiles = loadCompiledFilesSync(includedFiles, entryFilename, compileOptions.data);
  const extractions = processCompiledFiles(compiledFiles);
  const importer = makeSyncImporter(extractions);
  const extractionCompileOptions = makeExtractionCompileOptions(compileOptions, entryFilename, extractions,  importer);

  sass.renderSync(extractionCompileOptions);

  return compileExtractionResult(extractions);  
}

exports.extract = extract;
exports.extractSync = extractSync;