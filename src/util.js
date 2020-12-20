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
  if (path.isAbsolute(maybeRelativePath)) {
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

  if (colorHex.length < 2) {
    colorHex = `0${colorHex}`;
  }

  return colorHex;
}
