'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchReadFile = patchReadFile;
exports.unpatchReadFile = unpatchReadFile;

var _fsMonkey = require('fs-monkey');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var originalReadFileSync = _fs2.default.readFileSync;
var originalReadFile = _fs2.default.readFile;

function getInjectedData(path, extractions, entryFilename) {
  path = _fs2.default.realpathSync(path);

  if (process.platform === 'win32') {
    path = path.replace(/\\/g, '/');
  }

  if (path in extractions && path !== entryFilename) {
    return extractions[path].injectedData;
  }
}

function patchReadFile(extractions, entryFilename) {

  (0, _fsMonkey.patchFs)({
    readFileSync: function readFileSync(path, options) {
      var injectedData = getInjectedData(path, extractions, entryFilename);

      if (injectedData) {
        return injectedData;
      }

      return originalReadFileSync(path, options);
    },
    readFile: function readFile(path, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }

      var injectedData = getInjectedData(path, extractions, entryFilename);

      if (injectedData) {
        callback(null, injectedData);
      } else {
        originalReadFile(path, options, callback);
      }
    }
  });
}

function unpatchReadFile() {
  _fs2.default.readFileSync = originalReadFileSync;
  _fs2.default.readFile = originalReadFile;
}