'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStructuredValue = createStructuredValue;

var _util = require('./util');

var _serialize = require('./serialize');

/**
 * Transform a sassValue into a structured value based on the value type
 */
function makeValue(sassValue, sass) {
  switch ((0, _util.getConstructor)(sassValue, sass)) {
    case sass.types.String:
    case sass.types.Boolean:
      return { value: sassValue.getValue() };

    case sass.types.Number:
      return { value: sassValue.getValue(), unit: sassValue.getUnit() };

    case sass.types.Color:
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

    case sass.types.Null:
      return { value: null };

    case sass.types.List:
      var listLength = sassValue.getLength();
      var listValue = [];
      for (var i = 0; i < listLength; i++) {
        listValue.push(createStructuredValue(sassValue.getValue(i), sass));
      }
      return { value: listValue, separator: sassValue.getSeparator() ? ',' : ' ' };

    case sass.types.Map:
      var mapLength = sassValue.getLength();
      var mapValue = {};
      for (var _i = 0; _i < mapLength; _i++) {
        // Serialize map keys of arbitrary type for extracted struct
        var serializedKey = (0, _serialize.serialize)(sassValue.getKey(_i), false, sass);
        mapValue[serializedKey] = createStructuredValue(sassValue.getValue(_i), sass);
      }
      return { value: mapValue };

    default:
      throw new Error('Unsupported sass variable type \'' + sassValue.constructor.name + '\'');
  };
};

/**
 * Create a structured value definition from a sassValue object
 */
function createStructuredValue(sassValue, sass) {
  var value = Object.assign({
    type: (0, _util.getConstructorName)(sassValue, sass)
  }, makeValue(sassValue, sass));

  return value;
};