import Promise from 'bluebird';
import { getSassImplementation } from './util';
import { extract, extractSync } from './extract';

/**
 * Render with node-sass using provided compile options and augment variable extraction
 */
export function render(compileOptions = {}, extractOptions = {}) {
  const sass = Promise.promisifyAll(getSassImplementation(extractOptions));
  return sass.renderAsync(compileOptions)
  .then(rendered => {
    return extract(rendered, { compileOptions, extractOptions })
    .then(vars => {
      rendered.vars = vars;
      return rendered;
    });
  });
}

/**
 * Render synchronously with node-sass using provided compile options and augment variable extraction
 */
export function renderSync(compileOptions = {}, extractOptions = {}) {
  const sass = getSassImplementation(extractOptions);
  const rendered = sass.renderSync(compileOptions);
  rendered.vars = extractSync(rendered, { compileOptions, extractOptions })
  return rendered;
}
