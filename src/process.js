import { injectExtractionFunctions } from './inject';
import { parseDeclarations } from './parse';
import { Pluggable } from './pluggable';

/**
 * Get a string id for a filename
 */
function getFileId(filename) {
  return new Buffer(filename).toString('base64').replace(/=/g, '');
}

/**
 * Process a single sass files to get declarations, injected source and functions
 */
function processFile(filename, data, pluggable) {
  const declarations = parseDeclarations(data);
  const variables = { global: {} };

  const globalDeclarationResultHandler = (declaration, value, sassValue) => {
    if(!variables.global[declaration.declaration]) {
      variables.global[declaration.declaration] = [];
    }
    const variableValue = pluggable.run(Pluggable.POST_VALUE, { value, sassValue }).value;
    variables.global[declaration.declaration].push({ declaration, value: variableValue });
  }

  const fileId = getFileId(filename);
  const injection = injectExtractionFunctions(fileId, declarations, { globalDeclarationResultHandler });
  const injectedData = `${data}\n\n${injection.injectedData}`;
  const injectedFunctions = injection.injectedFunctions;

  return {
    fileId,
    declarations,
    variables,
    injectedData,
    injectedFunctions,
  };
}

/**
 * Process a set of sass files to get declarations, injected source and functions
 * Files are provided in a map of filename -> key entries
 */
export function processFiles(files, pluggable) {
  const extractions = {};

  Object.keys(files).map(filename => {
    extractions[filename] = processFile(filename, files[filename], pluggable);
  });

  return extractions;
}
