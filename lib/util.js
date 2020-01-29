'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizePath = normalizePath;
exports.makeAbsolute = makeAbsolute;
exports.toColorHex = toColorHex;
exports.getSassImplementation = getSassImplementation;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NORMALIZED_PATH_SEPARATOR = '/';
var PLATFORM_PATH_SEPARATOR = _path2.default.sep;

/**
 * Normalize path across platforms
 */
function normalizePath(path) {
  return path.split(PLATFORM_PATH_SEPARATOR).join(NORMALIZED_PATH_SEPARATOR);
}

/**
 * Make a potentially relative path absolute relative to cwd
 */
function makeAbsolute(maybeRelativePath) {
  if (_path2.default.isAbsolute(maybeRelativePath)) {
    return maybeRelativePath;
  } else {
    return _path2.default.posix.join(process.cwd(), maybeRelativePath);
  }
}

/**
 * Convert a color value 0-255 to hex 00-FF
 */
function toColorHex(value) {
  var colorHex = Math.round(value).toString(16);

  if (colorHex.length < 2) {
    colorHex = '0' + colorHex;
  }

  return colorHex;
}

/**
 * Returns the Sass implementation based on the `extractOptions`. Resolves the implementation in the following order: `compileOptions.implementation` || `Node Sass` || `Dart Sass`
 */
function getSassImplementation() {
  var compileOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var implementation = compileOptions.implementation || require('node-sass') || require('sass');

  if (!implementation.info || !['node-sass', 'dart-sass'].includes(implementation.info.split('\t')[0])) {
    throw new Error('The given Sass implementation is invalid. Should be one of `node-sass` or `sass`.');
  }

  return implementation;
}
