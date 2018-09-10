'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadCompiledFiles = loadCompiledFiles;
exports.loadCompiledFilesSync = loadCompiledFilesSync;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_bluebird2.default.promisifyAll(_fs2.default);

var RAW_DATA_FILE = 'data';

/**
 * Include any raw compilation data as a 'data' file
 */
function includeRawDataFile(includedFiles, files, entryFilename, data) {
  var orderedFiles = includedFiles;

  if (entryFilename === RAW_DATA_FILE && data) {
    files[RAW_DATA_FILE] = data;
    orderedFiles = [].concat(_toConsumableArray(orderedFiles), [RAW_DATA_FILE]);
  } else if (orderedFiles.length > 0) {
    orderedFiles = [].concat(_toConsumableArray(orderedFiles.slice(1)), [orderedFiles[0]]);
  }

  return {
    compiledFiles: files,
    orderedFiles: orderedFiles
  };
}

/**
 * Async load a file from filename
 */
function load(filename) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

  return _fs2.default.readFileAsync(filename, encoding);
}

/**
 * Sync load a file from filename
 */
function loadSync(filename) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

  return _fs2.default.readFileSync(filename, encoding);
}

/**
 * Load all files included in a sass compilations including potential raw data input
 */
function loadCompiledFiles(includedFiles, entryFilename, data) {
  var files = {};

  return _bluebird2.default.all(includedFiles.map(function (filename) {
    return load(filename).then(function (data) {
      files[filename] = data;
    });
  })).then(function () {
    return includeRawDataFile(includedFiles, files, entryFilename, data);
  });
}

/**
 * Synchronously load all files included in a sass compilations including potential raw data input
 */
function loadCompiledFilesSync(includedFiles, entryFilename, data) {
  var files = {};

  includedFiles.forEach(function (filename) {
    files[filename] = loadSync(filename);
  });

  return includeRawDataFile(includedFiles, files, entryFilename, data);
}