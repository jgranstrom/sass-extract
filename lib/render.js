const sass = require('node-sass');
const { extractSync } = require('./extract');

exports.renderSync = (compileOptions = {}) => {
  const rendered = sass.renderSync(compileOptions);
  rendered.vars = extractSync(rendered, { compileOptions })
  return rendered;
}
