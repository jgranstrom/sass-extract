import Promise from 'bluebird';
import path from 'path';
import { normalizePath, makeAbsolute } from './util';

/**
 * Search for the imported file in order of included paths
 */
function findImportedPath(url, prev, includedFilesMap, includedPaths) {
  let candidateFromPaths;

  if(prev !== 'stdin') {
    const prevPath = path.posix.dirname(prev);
    candidateFromPaths = [prevPath, ...includedPaths];
  } else {
    candidateFromPaths = [...includedPaths];
  }

  for(let i = 0; i < candidateFromPaths.length; i++) {
    let candidatePath;
    let candidateFromPath = normalizePath(makeAbsolute(candidateFromPaths[i]));
    if (path.isAbsolute(url)) {
      candidatePath = normalizePath(url);
    } else {
      // Get normalize absolute candidate from path
      candidatePath = path.posix.join(candidateFromPath, url);
    }

    if(includedFilesMap[candidatePath]) {
      return candidatePath;
    } else {
      let urlBasename = path.posix.basename(url);
      let indexOfBasename = url.lastIndexOf(urlBasename);
      let partialUrl = `${url.substring(0, indexOfBasename)}_${urlBasename}`;

      if (path.isAbsolute(partialUrl)) {
        candidatePath = normalizePath(partialUrl);
      } else {
        candidatePath = path.posix.join(candidateFromPath, partialUrl);
      }

      if(includedFilesMap[candidatePath]) {
        return candidatePath;
      }
    }
  }

  return null;
}

/**
 * Get the absolute file path for a relative @import like './sub/file.scsss'
 * If the @import is made from a raw data section a best guess path is returned
 */
function getImportAbsolutePath(url, prev, includedFilesMap, includedPaths = []) {
  // Ensure that both @import 'file' and @import 'file.scss' is mapped correctly
  let extension = path.posix.extname(prev);
  if(path.posix.extname(url) !== extension) {
    url += extension;
  }

  const absolutePath = findImportedPath(url, prev, includedFilesMap, includedPaths);

  if(!absolutePath) {
    throw new Error(`Can not determine imported file for url '${url}' imported in ${prev}`);
  }

  return absolutePath;
}

/**
 * Get the resulting source and path for a given @import request
 */
function getImportResult(extractions, url, prev, includedFilesMap, includedPaths) {
  const absolutePath = getImportAbsolutePath(url, prev, includedFilesMap, includedPaths);
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
export function makeImporter(extractions, includedFiles, includedPaths, customImporter) {
  const includedFilesMap = getIncludedFilesMap(includedFiles);

  return function(url, prev, done) {
    try {
      let promise = Promise.resolve();
      if (customImporter) {
        promise = new Promise(resolve => {
          if (Array.isArray(customImporter)) {
            const promises = [];
            customImporter.forEach(importer => {
              const thisPromise = new Promise(res => {
                const modifiedUrl = importer.apply({}, [url, prev, res]);
                if (modifiedUrl !== undefined) {
                  res(modifiedUrl);
                }
              });
              promises.push(thisPromise);
            })
            Promise.all(promises).then(results => {
              resolve(results.find(item => item !== null));
            });
          } else {
            const modifiedUrl = customImporter.apply({}, [url, prev, resolve]);
            if (modifiedUrl !== undefined) {
              resolve(modifiedUrl);
            }
          }
        });
      }
      promise.then(modifiedUrl => {
        if (modifiedUrl && modifiedUrl.file) {
          url = modifiedUrl.file;
        }
        const result = getImportResult(extractions, url, prev, includedFilesMap, includedPaths);
        done(result);
      }).catch(err => {
        done(err);
      });
    } catch(err) {
      done(err);
    }
  }
}

/**
 * Create a synchronous importer that will resolve @import directives with the injected
 * data found in provided extractions object
 */
export function makeSyncImporter(extractions, includedFiles, includedPaths, customImporter) {
  const includedFilesMap = getIncludedFilesMap(includedFiles);

  return function(url, prev) {
    try {
      if (customImporter) {
        let modifiedUrl;
        if (Array.isArray(customImporter)) {
          customImporter.forEach(importer => {
            modifiedUrl = modifiedUrl || importer(url, prev);
          })
        } else {
          modifiedUrl = customImporter(url, prev);
        }
        if (modifiedUrl && modifiedUrl.file) {
          url = modifiedUrl.file;
        }
      }
      const result = getImportResult(extractions, url, prev, includedFilesMap, includedPaths);
      return result;
    } catch(err) {
      // note: importer must return errors
      return err;
    }
  }
}
