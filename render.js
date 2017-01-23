const sass = require('node-sass');
const { extractSync } = require('./extract');

exports.renderSync = (compileOptions = {}) => {
  const rendered = sass.renderSync(compileOptions);
  const renderedWithExtracted = extractSync(rendered, { compileOptions })
  return renderedWithExtracted;
}
