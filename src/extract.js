import Promise from 'bluebird';
import sass from 'node-sass';
import { normalizePath, makeAbsolute } from './util';
import { loadCompiledFiles, loadCompiledFilesSync } from './load';
import { processFiles } from './process';
import { makeImporter, makeSyncImporter } from './importer';

Promise.promisifyAll(sass);

/**
 * Get rendered stats required for extraction
 */
function getRenderedStats(rendered, compileOptions) {
  return {
    entryFilename: normalizePath(rendered.stats.entry),
    includedFiles: rendered.stats.includedFiles.map(f => normalizePath(makeAbsolute(f))),
    includedPaths: (compileOptions.includePaths || []).map(normalizePath),
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

  extractionCompileOptions.functions = Object.assign(extractionFunctions, compileOptions.functions);
  extractionCompileOptions.data = extractions[entryFilename].injectedData;
  if(!makeExtractionCompileOptions.imported) {
    extractionCompileOptions.importer = importer;
  }

  return extractionCompileOptions;
}

/**
 * Compile extracted variables per file into a complete result object
 */
function compileExtractionResult(orderedFiles, extractions) {
  const extractedVariables = { global: {} };

  orderedFiles.map(filename => {
    const globalFileVariables = extractions[filename].variables.global;

    Object.keys(globalFileVariables).map(variableKey => {
      let variable = extractedVariables.global[variableKey];
      let variableSources = [];
      let variableExpressions = [];

      if(variable) {
        variableSources = variable.sources;
        variableExpressions = variable.expressions;
      }

      variable = extractedVariables.global[variableKey] = Object.assign({}, globalFileVariables[variableKey].value, {
        sources: [...variableSources, filename],
        expressions: [...variableExpressions, globalFileVariables[variableKey].expression],
      });
    });
  });

  return extractedVariables;
}

/**
 * Extract the variables from already rendered sass file(s)
 * Returns the extracted variables
 */
export function extract(rendered, { compileOptions = {} } = {}) {
  const { entryFilename, includedFiles, includedPaths } = getRenderedStats(rendered, compileOptions);

  return loadCompiledFiles(includedFiles, entryFilename, compileOptions.data)
  .then(({ compiledFiles, orderedFiles }) => {
    const extractions = processFiles(compiledFiles);
    const importer = makeImporter(extractions, includedFiles, includedPaths);
    const extractionCompileOptions = makeExtractionCompileOptions(compileOptions, entryFilename, extractions, importer);

    return sass.renderAsync(extractionCompileOptions)
    .then(() => {
      return compileExtractionResult(orderedFiles, extractions)
    });
  });
}

/**
 * Synchronously extract the variables from already rendered sass file(s)
 * Returns the extracted variables
 */
export function extractSync(rendered, { compileOptions = {} } = {}) {
  const { entryFilename, includedFiles, includedPaths } = getRenderedStats(rendered, compileOptions);

  const { compiledFiles, orderedFiles } = loadCompiledFilesSync(includedFiles, entryFilename, compileOptions.data);
  const extractions = processFiles(compiledFiles);
  const importer = makeSyncImporter(extractions, includedFiles, includedPaths);
  const extractionCompileOptions = makeExtractionCompileOptions(compileOptions, entryFilename, extractions, importer);

  sass.renderSync(extractionCompileOptions);

  return compileExtractionResult(orderedFiles, extractions);  
}
