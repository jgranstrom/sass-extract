const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

/**
 * Async load a file from filename
 */
exports.load = (filename, encoding = 'utf8') => {
  return fs.readFileAsync(filename, encoding);
}

/**
 * Sync load a file from filename
 */
exports.loadSync = (filename, encoding = 'utf8') => {
  return fs.readFileSync(filename, encoding);
}
