import Promise from 'bluebird';
import fs from 'fs';

Promise.promisifyAll(fs);

const RAW_DATA_FILE = 'data';

/**
 * Include any raw compilation data as a 'data' file
 */
function includeRawDataFile(includedFiles, files, entryFilename, data) {
  let orderedFiles = includedFiles;

  if (entryFilename === RAW_DATA_FILE && data) {
    files[RAW_DATA_FILE] = data;
    orderedFiles = [...orderedFiles, RAW_DATA_FILE];
  } else if (orderedFiles.length > 0) {
    orderedFiles = [...orderedFiles.slice(1), orderedFiles[0]];
  }

  return {
    compiledFiles: files,
    orderedFiles,
  };
}

/**
 * Async load a file from filename
 */
function load(filename, encoding = 'utf8') {
  return fs.readFileAsync(filename, encoding);
}

/**
 * Sync load a file from filename
 */
function loadSync(filename, encoding = 'utf8') {
  return fs.readFileSync(filename, encoding);
}

/**
 * Load all files included in a sass compilations including potential raw data input
 */
export function loadCompiledFiles(includedFiles, entryFilename, data) {
  const files = {};

  return Promise.all(
    includedFiles.map((filename) => {
      return load(filename).then((data) => {
        files[filename] = data;
      });
    })
  ).then(() => {
    return includeRawDataFile(includedFiles, files, entryFilename, data);
  });
}

/**
 * Synchronously load all files included in a sass compilations including potential raw data input
 */
export function loadCompiledFilesSync(includedFiles, entryFilename, data) {
  const files = {};

  includedFiles.forEach((filename) => {
    files[filename] = loadSync(filename);
  });

  return includeRawDataFile(includedFiles, files, entryFilename, data);
}
