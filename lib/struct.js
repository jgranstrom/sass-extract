'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStructuredValue = createStructuredValue;

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

var _util = require('./util');

var _serialize = require('./serialize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Transform a sassValue into a structured value based on the value type
 */
function makeValue(sassValue) {
  switch (sassValue.constructor) {
    case _nodeSass2.default.types.String:
    case _nodeSass2.default.types.Boolean:
      return { value: sassValue.getValue() };

    case _nodeSass2.default.types.Number:
      return { value: sassValue.getValue(), unit: sassValue.getUnit() };

    case _nodeSass2.default.types.Color:
      var r = Math.round(sassValue.getR());
      var g = Math.round(sassValue.getG());
      var b = Math.round(sassValue.getB());

      return {
        value: {
          r: r, g: g, b: b,
          a: sassValue.getA(),
          hex: '#' + (0, _util.toColorHex)(r) + (0, _util.toColorHex)(g) + (0, _util.toColorHex)(b)
        }
      };

    case _nodeSass2.default.types.Null:
      return { value: null };

    case _nodeSass2.default.types.List:
      var listLength = sassValue.getLength();
      var listValue = [];
      for (var i = 0; i < listLength; i++) {
        listValue.push(createStructuredValue(sassValue.getValue(i)));
      }
      return { value: listValue, separator: sassValue.getSeparator() ? ',' : ' ' };

    case _nodeSass2.default.types.Map:
      var mapLength = sassValue.getLength();
      var mapValue = {};
      for (var _i = 0; _i < mapLength; _i++) {
        // Serialize map keys of arbitrary type for extracted struct
        var serializedKey = (0, _serialize.serialize)(sassValue.getKey(_i));
        mapValue[serializedKey] = createStructuredValue(sassValue.getValue(_i));
      }
      return { value: mapValue };

    default:
      throw new Error('Unsupported sass variable type \'' + sassValue.constructor.name + '\'');
  };
};

/**
 * Create a structured value definition from a sassValue object
 */
function createStructuredValue(sassValue) {
  var value = Object.assign({
    type: sassValue.constructor.name
  }, makeValue(sassValue));

  return value;
};