'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _render = require('./render');

Object.defineProperty(exports, 'render', {
  enumerable: true,
  get: function get() {
    return _render.render;
  }
});
Object.defineProperty(exports, 'renderSync', {
  enumerable: true,
  get: function get() {
    return _render.renderSync;
  }
});

var _extract = require('./extract');

Object.defineProperty(exports, 'extract', {
  enumerable: true,
  get: function get() {
    return _extract.extract;
  }
});
Object.defineProperty(exports, 'extractSync', {
  enumerable: true,
  get: function get() {
    return _extract.extractSync;
  }
});