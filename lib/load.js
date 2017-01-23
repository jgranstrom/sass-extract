const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

exports.load = (filename, encoding = 'utf8') => {
  return fs.readFileAsync(filename, encoding);
}

exports.loadSync = (filename, encoding = 'utf8') => {
  return fs.readFileSync(filename, encoding);
}
