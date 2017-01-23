const { renderSync } = require('./render');
const { extractSync } = require('./extract');

exports.renderSync = renderSync;
exports.extractSync = extractSync;

const res = exports.renderSync({
  file: require('path').join(__dirname, 'test.scss'),
});

/*console.log(require('util').inspect(res, { depth: null }));
console.log(res.css.toString());*/

setInterval(() => {

}, 1000);
