'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.renderSync = renderSync;

var _util = require('./util');

var _extract = require('./extract');

/**
 * Render with node-sass using provided compile options and augment variable extraction
 */
function render() {
  var compileOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var extractOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var sass = (0, _util.promisifySass)((0, _util.getSassImplementation)(extractOptions));
  return sass.renderAsync(compileOptions).then(function (rendered) {
    return (0, _extract.extract)(rendered, { compileOptions: compileOptions, extractOptions: extractOptions }).then(function (vars) {
      rendered.vars = vars;
      return rendered;
    });
  });
}

/**
 * Render synchronously with node-sass using provided compile options and augment variable extraction
 */
function renderSync() {
  var compileOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var extractOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var sass = (0, _util.getSassImplementation)(extractOptions);
  var rendered = sass.renderSync(compileOptions);
  rendered.vars = (0, _extract.extractSync)(rendered, { compileOptions: compileOptions, extractOptions: extractOptions });
  return rendered;
}