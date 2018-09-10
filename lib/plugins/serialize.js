'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _serialize = require('../serialize');

/**
 * Replace variables values with their serialized variant
 * e.g. Instead of { value: 123, unit: 'px' } output { value: '123px' }
 */
function run() {
  return {
    postValue: function postValue(_ref) {
      var value = _ref.value,
          sassValue = _ref.sassValue;

      return { value: { value: (0, _serialize.serialize)(sassValue) }, sassValue: sassValue };
    }
  };
}