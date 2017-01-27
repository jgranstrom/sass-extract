const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

const RAW_DATA_FILE = 'data';

/**
 * Include any raw compilation data as a 'data' file
 */
function includeRawDataFile(files, entryFilename, data) {
  if(entryFilename === RAW_DATA_FILE && data) {
    files[RAW_DATA_FILE] = data;
  }

  return files;
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
function loadCompiledFiles(includedFiles, entryFilename, data) {
  const files = {};

  return Promise.all(includedFiles.map(filename => {
    return load(filename)
    .then(data => { 
      files[filename] = data; 
    });
  }))
  .then(() => {
    return includeRawDataFile(files, entryFilename, data);
  });
}

/**
 * Synchronously load all files included in a sass compilations including potential raw data input
 */
function loadCompiledFilesSync(includedFiles, entryFilename, data) {
  const files = {};

  includedFiles.forEach(filename => {
    files[filename] = loadSync(filename);
  });

  return includeRawDataFile(files, entryFilename, data);
}

module.exports.loadCompiledFiles = loadCompiledFiles;
module.exports.loadCompiledFilesSync = loadCompiledFilesSync;