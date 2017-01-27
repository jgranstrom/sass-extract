import Promise from 'bluebird';
import sass from 'node-sass';
import { extract, extractSync } from './extract';

Promise.promisifyAll(sass);

/**
 * Render with node-sass using provided compile options and augment variable extraction
 */
export function render(compileOptions = {}) {
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
export function renderSync(compileOptions = {}) {
  const rendered = sass.renderSync(compileOptions);
  rendered.vars = extractSync(rendered, { compileOptions })
  return rendered;
}
