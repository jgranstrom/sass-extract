const Promise = require('bluebird');
const sass = require('node-sass');
const { extract, extractSync } = require('./extract');

Promise.promisifyAll(sass);

exports.render = (compileOptions = {}) => {
  return sass.renderAsync(compileOptions)
  .then(rendered => {
    return extract(rendered, { compileOptions} )
    .then(vars => {
      rendered.vars = vars;
      return rendered;
    })
  });
}

exports.renderSync = (compileOptions = {}) => {
  const rendered = sass.renderSync(compileOptions);
  rendered.vars = extractSync(rendered, { compileOptions })
  return rendered;
}