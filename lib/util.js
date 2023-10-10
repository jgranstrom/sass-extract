'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizePath = normalizePath;
exports.makeAbsolute = makeAbsolute;
exports.toColorHex = toColorHex;
exports.getSassImplementation = getSassImplementation;
exports.getConstructor = getConstructor;
exports.getConstructorName = getConstructorName;
exports.promisifySass = promisifySass;
exports.isDartSass = isDartSass;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

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

/**
 * The constructor of Dart Sass' Booleans and Null values do not match any of the constructors in `sass.types` in Dart Sass.
 */
function getConstructor(sassValue, sass) {
  switch (sassValue.constructor) {
    case sass.types.Boolean.TRUE.constructor:
    case sass.types.Boolean.FALSE.constructor:
      // Both TRUE and FALSE have the same constructor, but for clarity's sake
      return sass.types.Boolean;

    case sass.types.Null.NULL.constructor:
      return sass.types.Null;

    default:
      return sassValue.constructor;
  }
}

/**
 * Returns the constructor name of the given Sass value type.
 * Until 1.2.5, Dart Sass did not report the constructor name in a human readable format, this is why we need to use this helper.
 */
function getConstructorName(sassValue, sass) {
  switch (getConstructor(sassValue, sass)) {
    case sass.types.String:
      return 'SassString';

    case sass.types.Boolean:
      return 'SassBoolean';

    case sass.types.Number:
      return 'SassNumber';

    case sass.types.Color:
      return 'SassColor';

    case sass.types.Null:
      return 'SassNull';

    case sass.types.List:
      return 'SassList';

    case sass.types.Map:
      return 'SassMap';

    default:
      throw new Error('Unsupported sass constructor \'' + sassValue.constructor.name + '\'');
  }
}

function promisifySass(impl) {
  var _arr = ['render'];


  for (var _i = 0; _i < _arr.length; _i++) {
    var name = _arr[_i];
    var asyncName = name + 'Async';

    if (!(asyncName in impl)) {
      impl[asyncName] = _bluebird2.default.promisify(impl[name]);
    }
  }
  return impl;
}

function isDartSass(impl) {
  return impl.info.match(/dart/);
}