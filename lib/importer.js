'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeImporter = makeImporter;
exports.makeSyncImporter = makeSyncImporter;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Search for the imported file in order of included paths
 */
function findImportedPath(url, prev, includedFilesMap, includedPaths) {
  var candidateFromPaths = void 0;

  if (prev !== 'stdin') {
    var prevPath = _path2.default.posix.dirname(prev);
    candidateFromPaths = [prevPath].concat(_toConsumableArray(includedPaths));
  } else {
    candidateFromPaths = [].concat(_toConsumableArray(includedPaths));
  }

  for (var i = 0; i < candidateFromPaths.length; i++) {
    var candidatePath = void 0;
    var candidateFromPath = (0, _util.normalizePath)((0, _util.makeAbsolute)(candidateFromPaths[i]));
    if (_path2.default.isAbsolute(url)) {
      candidatePath = (0, _util.normalizePath)(url);
    } else {
      // Get normalize absolute candidate from path
      candidatePath = _path2.default.posix.join(candidateFromPath, url);
    }

    if (includedFilesMap[candidatePath]) {
      return candidatePath;
    } else {
      var urlBasename = _path2.default.posix.basename(url);
      var indexOfBasename = url.lastIndexOf(urlBasename);
      var partialUrl = url.substring(0, indexOfBasename) + '_' + urlBasename;

      if (_path2.default.isAbsolute(partialUrl)) {
        candidatePath = (0, _util.normalizePath)(partialUrl);
      } else {
        candidatePath = _path2.default.posix.join(candidateFromPath, partialUrl);
      }

      if (includedFilesMap[candidatePath]) {
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
function getImportAbsolutePath(url, prev, includedFilesMap) {
  var includedPaths = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  // Ensure that both @import 'file' and @import 'file.scss' is mapped correctly
  var extension = _path2.default.posix.extname(prev);
  if (_path2.default.posix.extname(url) !== extension) {
    url += extension;
  }

  var absolutePath = findImportedPath(url, prev, includedFilesMap, includedPaths);

  if (!absolutePath) {
    throw new Error('Can not determine imported file for url \'' + url + '\' imported in ' + prev);
  }

  return absolutePath;
}

/**
 * Get the resulting source and path for a given @import request
 */
function getImportResult(extractions, url, prev, includedFilesMap, includedPaths) {
  if (!Array.isArray(url)) {
    url = [url];
  }

  var returnObj = url.map(function (url_item) {
    var absolutePath = getImportAbsolutePath(url_item, prev, includedFilesMap, includedPaths);
    var contents = extractions[absolutePath].injectedData;

    return { file: absolutePath, contents: contents };
  });

  return returnObj;
}

function getIncludedFilesMap(includedFiles) {
  var includedFilesMap = {};
  includedFiles.forEach(function (file) {
    return includedFilesMap[file] = true;
  });
  return includedFilesMap;
}

/**
 * Create an importer that will resolve @import directives with the injected
 * data found in provided extractions object
 */
function makeImporter(extractions, includedFiles, includedPaths, customImporter) {
  var includedFilesMap = getIncludedFilesMap(includedFiles);

  return function (url, prev, done) {
    try {
      var promises = [];
      if (customImporter) {
        if (!Array.isArray(customImporter)) {
          customImporter = [customImporter];
        }

        customImporter.forEach(function (importer) {
          promises.push(new _bluebird2.default(function (res) {
            importer.apply({}, [url, prev, res]);
          }));
        });
      }
      _bluebird2.default.all(promises).then(function (results) {
        return results.find(function (item) {
          return item !== null;
        });
      }).then(function (modifiedUrl) {
        if (modifiedUrl) {
          if (!Array.isArray(modifiedUrl)) {
            modifiedUrl = [modifiedUrl];
          }

          url = modifiedUrl.map(function (url_item) {
            return url_item.file;
          });
        }
        var result = getImportResult(extractions, url, prev, includedFilesMap, includedPaths);
        done(result);
      }).catch(function (err) {
        done(err);
      });
    } catch (err) {
      done(err);
    }
  };
}

/**
 * Create a synchronous importer that will resolve @import directives with the injected
 * data found in provided extractions object
 */
function makeSyncImporter(extractions, includedFiles, includedPaths, customImporter) {
  var includedFilesMap = getIncludedFilesMap(includedFiles);

  return function (url, prev) {
    try {
      if (customImporter) {
        var modifiedUrl = void 0;
        if (Array.isArray(customImporter)) {
          customImporter.forEach(function (importer) {
            modifiedUrl = modifiedUrl || importer(url, prev);
          });
        } else {
          modifiedUrl = customImporter(url, prev);
        }
        if (modifiedUrl && modifiedUrl.file) {
          url = modifiedUrl.file;
        }
      }
      var result = getImportResult(extractions, url, prev, includedFilesMap, includedPaths);
      return result;
    } catch (err) {
      // note: importer must return errors
      return err;
    }
  };
}