import path from 'path';

const NORMALIZED_PATH_SEPARATOR = '/';
const PLATFORM_PATH_SEPARATOR = path.sep;

/**
 * Normalize path across platforms
 */
export function normalizePath(path) {
  return path.split(PLATFORM_PATH_SEPARATOR).join(NORMALIZED_PATH_SEPARATOR);
}

/**
 * Make a potentially relative path absolute relative to cwd
 */
export function makeAbsolute(maybeRelativePath) {
  if(path.isAbsolute(maybeRelativePath)) {
    return maybeRelativePath;
  } else {
    return path.posix.join(process.cwd(), maybeRelativePath);
  }
}

/**
 * Convert a color value 0-255 to hex 00-FF
 */
export function toColorHex(value) {
  let colorHex = Math.round(value).toString(16);

  if(colorHex.length < 2) {
    colorHex = `0${colorHex}`;
  }

  return colorHex;
}

/**
 * Returns the Sass implementation based on the `extractOptions`. Resolves the implementation in the following order: `compileOptions.implementation` || `Node Sass` || `Dart Sass`
 */
export function getSassImplementation(compileOptions = {}) {
  const implementation = compileOptions.implementation || require('node-sass') || require('sass');

  if(!implementation.info || !['node-sass', 'dart-sass'].includes(implementation.info.split('\t')[0])) {
    throw new Error('The given Sass implementation is invalid. Should be one of `node-sass` or `sass`.')
  }

  return implementation;
}
