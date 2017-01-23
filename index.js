const { renderSync } = require('./lib/render');
const { extractSync } = require('./lib/extract');

exports.renderSync = renderSync;
exports.extractSync = extractSync;

const res = exports.renderSync({
  file: require('path').join(__dirname, 'test.scss'),
});

console.log('vars', res.vars);

setInterval(() => {

}, 1000);
