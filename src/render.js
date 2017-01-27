const Promise = require('bluebird');
const sass = require('node-sass');
const { extract, extractSync } = require('./extract');

Promise.promisifyAll(sass);

/**
 * Render with node-sass using provided compile options and augment variable extraction
 */
function render(compileOptions = {}) {
  return sass.renderAsync(compileOptions)
  .then(rendered => {
    return extract(rendered, { compileOptions })
    .then(vars => {
      rendered.vars = vars;
      return rendered;
    });
  });
}

/**
 * Render synchronously with node-sass using provided compile options and augment variable extraction
 */
function renderSync(compileOptions = {}) {
  const rendered = sass.renderSync(compileOptions);
  rendered.vars = extractSync(rendered, { compileOptions })
  return rendered;
}

exports.render = render;
exports.renderSync = renderSync;