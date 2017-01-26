const Promise = require('bluebird');
const sass = require('node-sass');
const { loadCompiledFiles, loadCompiledFilesSync } = require('./load');
const { processFiles } = require('./process');
const { makeImporter, makeSyncImporter } = require('./importer');

Promise.promisifyAll(sass);

/**
 * Get rendered stats required for extraction
 */
function getRenderedStats(rendered) {
  return {
    entryFilename: rendered.stats.entry,
    includedFiles: rendered.stats.includedFiles,
  };
}

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

/**
 * Compile extracted variables per file into a complete result object
 */
function compileExtractionResult(extractions) {
  const extractedVariables = { global: {} };

  Object.keys(extractions).map(filename => {
    const globalFileVariables = extractions[filename].variables.global;

    Object.keys(globalFileVariables).map(variableKey => {
      let variable = extractedVariables.global[variableKey];

      if(!variable) {
        variable = extractedVariables.global[variableKey] = Object.assign({}, globalFileVariables[variableKey].value, {
          sources: [],
          expressions: [],
        });
      }

      variable.sources.push(filename);
      variable.expressions.push(globalFileVariables[variableKey].expression);
    });
  });

  return extractedVariables;
}

/**
 * Extract the variables from already rendered sass file(s)
 * Returns the extracted variables
 */
function extract(rendered, { compileOptions = {} } = {}) {
  const { entryFilename, includedFiles } = getRenderedStats(rendered);

  return loadCompiledFiles(includedFiles, entryFilename, compileOptions.data)
  .then(compiledFiles => {
    const extractions = processFiles(compiledFiles);
    const importer = makeImporter(extractions);
    const extractionCompileOptions = makeExtractionCompileOptions(compileOptions, entryFilename, extractions, importer);
    
    return sass.renderAsync(extractionCompileOptions)
    .then(() => {
      return compileExtractionResult(extractions)
    });
  });
}

/**
 * Synchronously extract the variables from already rendered sass file(s)
 * Returns the extracted variables
 */
function extractSync(rendered, { compileOptions = {} } = {}) {
  const { entryFilename, includedFiles } = getRenderedStats(rendered);

  const compiledFiles = loadCompiledFilesSync(includedFiles, entryFilename, compileOptions.data);
  const extractions = processFiles(compiledFiles);
  const importer = makeSyncImporter(extractions);
  const extractionCompileOptions = makeExtractionCompileOptions(compileOptions, entryFilename, extractions, importer);

  sass.renderSync(extractionCompileOptions);

  return compileExtractionResult(extractions);  
}

exports.extract = extract;
exports.extractSync = extractSync;