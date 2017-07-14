import path from 'path';

/**
 * Search for the imported file in order of included paths
 */
function findImportedPath(url, includedFilesMap, includedPaths) {
  for(let i = 0; i < includedPaths.length; i++) {
    const includedPath = includedPaths[i];
    const candidatePath = path.posix.join(includedPath, url);

    if(includedFilesMap[candidatePath]) {
      return candidatePath;
    }
  }

  return null;
}

/**
 * Get the absolute file path for a relative @import like './sub/file.scsss'
 * If the @import is made from a raw data section a best guess path is returned
 */
function getImportAbsolutePath(extractions, url, prev, includedFilesMap, includedPaths = []) {
  // Ensure that both @import 'file' and @import 'file.scss' is mapped correctly
  let extension = path.posix.extname(prev);
  if(path.posix.extname(url) !== extension) {
    url += extension;
  }

  let absolutePath = path.posix.join(path.posix.dirname(prev), url);

  if(prev === 'stdin' || !includedFilesMap[absolutePath]) {
    // Find absolute path from included paths as url is not relative to statement origin
    absolutePath = findImportedPath(url, includedFilesMap, includedPaths);

    if(!absolutePath) {
      throw new Error(`Can not determine imported file for url '${url}' imported in ${prev}`);
    }
  }

  return absolutePath;
}

/**
 * Get the resulting source and path for a given @import request
 */
function getImportResult(extractions, url, prev, includedFilesMap, includedPaths) {
  const absolutePath = getImportAbsolutePath(extractions, url, prev, includedFilesMap, includedPaths);
  const contents = extractions[absolutePath].injectedData;

  return { file: absolutePath, contents };
}

function getIncludedFilesMap(includedFiles) {
  const includedFilesMap = {};
  includedFiles.forEach(file => includedFilesMap[file] = true);
  return includedFilesMap;
}

/**
 * Create an importer that will resolve @import directives with the injected
 * data found in provided extractions object
 */
export function makeImporter(extractions, includedFiles, includedPaths) {
  const includedFilesMap = getIncludedFilesMap(includedFiles);

  return function(url, prev, done) {
    try {
      const result = getImportResult(extractions, url, prev, includedFilesMap, includedPaths);
      done(result);
    } catch(err) {
      done(err);
    }
  }
}

/**
 * Create a synchronous importer that will resolve @import directives with the injected
 * data found in provided extractions object
 */
export function makeSyncImporter(extractions, includedFiles, includedPaths) {
  const includedFilesMap = getIncludedFilesMap(includedFiles);

  return function(url, prev) {
    try {
      const result = getImportResult(extractions, url, prev, includedFilesMap, includedPaths);
      return result;
    } catch(err) {
      // note: importer must return errors
      return err;
    }
  }
}
