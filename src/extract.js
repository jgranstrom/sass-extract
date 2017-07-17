import Promise from 'bluebird';
import sass from 'node-sass';
import path from 'path';
import { loadCompiledFiles, loadCompiledFilesSync } from './load';
import { processFiles } from './process';
import { makeImporter, makeSyncImporter } from './importer';

Promise.promisifyAll(sass);

const NORMALIZED_PATH_SEPARATOR = '/';
const PLATFORM_PATH_SEPARATOR = path.sep;

/**
 * Normalize path across platforms
 */
export function normalizePath(path) {
  return path.split(PLATFORM_PATH_SEPARATOR).join(NORMALIZED_PATH_SEPARATOR);
}

export function makeAbsolute(maybeRelativePath) {
  if(path.posix.isAbsolute(maybeRelativePath)) {
    return maybeRelativePath;
  } else {
    return path.posix.join(process.cwd(), maybeRelativePath);
  }
}

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
export function extract(rendered, { compileOptions = {} } = {}) {
  const { entryFilename, includedFiles, includedPaths } = getRenderedStats(rendered, compileOptions);

  return loadCompiledFiles(includedFiles, entryFilename, compileOptions.data)
  .then(compiledFiles => {
    const extractions = processFiles(compiledFiles);
    const importer = makeImporter(extractions, includedFiles, includedPaths);
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
export function extractSync(rendered, { compileOptions = {} } = {}) {
  const { entryFilename, includedFiles, includedPaths } = getRenderedStats(rendered, compileOptions);

  const compiledFiles = loadCompiledFilesSync(includedFiles, entryFilename, compileOptions.data);
  const extractions = processFiles(compiledFiles);
  const importer = makeSyncImporter(extractions, includedFiles, includedPaths);
  const extractionCompileOptions = makeExtractionCompileOptions(compileOptions, entryFilename, extractions, importer);

  sass.renderSync(extractionCompileOptions);

  return compileExtractionResult(extractions);  
}
