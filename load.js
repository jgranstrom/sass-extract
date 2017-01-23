const fs = require('fs');

exports.loadSync = (filename, encoding = 'utf8') => {
  return fs.readFileSync(filename, encoding);
}
