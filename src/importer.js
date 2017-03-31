import path from 'path';

/**
 * Search for the likely absolute path from a relative path using known paths from compilation
 */
function findAbsolutePath(extractions, relativePath) {
  const filenames = Object.keys(extractions);
  
  for(let i = 0; i < filenames.length; i++) {
    if(filenames[i].match(relativePath)) {
      return filenames[i];
    }
  }

  return relativePath;
}

/**
 * Get the absolute file path for a relative @import like './sub/file.scsss'
 * If the @import is made from a raw data section a best guess path is returned
 */
function getImportAbsolutePath(extractions, url, prev) {
  let absolutePath = path.posix.join(path.posix.dirname(prev), url);
  let extension = path.posix.extname(prev);

  // Ensure that both @import 'file' and @import 'file.scss' is mapped correctly
  if(path.posix.extname(absolutePath) !== extension) {
    absolutePath += extension;
  }

  if(prev === 'stdin') {
    absolutePath = findAbsolutePath(extractions, absolutePath);
  }

  return absolutePath;
}

/**
 * Get the resulting source and path for a given @import request
 */
function getImportResult(extractions, url, prev) {
  const absolutePath = getImportAbsolutePath(extractions, url, prev);
  const contents = extractions[absolutePath].injectedData;

  return { file: absolutePath, contents };
}

/**
 * Create an importer that will resolve @import directives with the injected
 * data found in provided extractions object
 */
export function makeImporter(extractions) {
  return function(url, prev, done) {
    try {
      const result = getImportResult(extractions, url, prev);
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
export function makeSyncImporter(extractions) {
  return function(url, prev) {
    try {
      const result = getImportResult(extractions, url, prev);
      return result;
    } catch(err) {
      // note: importer must return errors
      return err;
    }
  }
}
