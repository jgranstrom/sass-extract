'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;

var _util = require('./util');

var _parseColor = require('parse-color');

var _parseColor2 = _interopRequireDefault(_parseColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serialize a given sass color into a color name like 'white', an rgba(r,g,b,a), or #000000 string
 * based on the color provided
 */
function serializeColor(sassColor) {
  var alpha = Math.round(sassColor.getA() * 100) / 100;
  var r = Math.round(sassColor.getR());
  var g = Math.round(sassColor.getG());
  var b = Math.round(sassColor.getB());

  if (alpha < 0.999) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  } else {
    var hex = '#' + (0, _util.toColorHex)(r) + (0, _util.toColorHex)(g) + (0, _util.toColorHex)(b);
    var parsedColor = (0, _parseColor2.default)(hex);
    if (parsedColor.keyword != null) {
      return parsedColor.keyword;
    } else {
      return hex;
    }
  }
}

/**
 * Transform a SassValue into a serialized string
 */
function serializeValue(sassValue, isInList, sass) {
  switch ((0, _util.getConstructor)(sassValue, sass)) {
    case sass.types.String:
    case sass.types.Boolean:
      return '' + sassValue.getValue();

    case sass.types.Number:
      return '' + sassValue.getValue() + sassValue.getUnit();

    case sass.types.Color:
      return serializeColor(sassValue);

    case sass.types.Null:
      return 'null';

    case sass.types.List:
      var listLength = sassValue.getLength();
      var listElement = [];
      var hasSeparator = sassValue.getSeparator();
      for (var i = 0; i < listLength; i++) {
        listElement.push(serialize(sassValue.getValue(i), true, sass));
      }
      // Make sure nested lists are serialized with surrounding parenthesis
      if (isInList) {
        return '(' + listElement.join(hasSeparator ? ',' : ' ') + ')';
      } else {
        return '' + listElement.join(hasSeparator ? ',' : ' ');
      }

    case sass.types.Map:
      var mapLength = sassValue.getLength();
      var mapValue = {};
      for (var _i = 0; _i < mapLength; _i++) {
        var key = serialize(sassValue.getKey(_i), false, sass);
        var value = serialize(sassValue.getValue(_i), false, sass);
        mapValue[key] = value;
      }
      var serializedMapValues = Object.keys(mapValue).map(function (key) {
        return key + ': ' + mapValue[key];
      });
      return '(' + serializedMapValues + ')';

    default:
      throw new Error('Unsupported sass variable type \'' + sassValue.constructor.name + '\'');
  };
};

/**
 * Create a serialized string from a sassValue object
 */
function serialize(sassValue, isInList, sass) {
  return serializeValue(sassValue, isInList, sass);
};