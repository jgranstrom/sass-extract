'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _compact = require('./compact');

var compactPlugin = _interopRequireWildcard(_compact);

var _serialize = require('./serialize');

var serializePlugin = _interopRequireWildcard(_serialize);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Combine serialize and compact plugins to get a minimal output of variables
 */
function run() {
  var compactInstance = compactPlugin.run();
  var serializeInstance = serializePlugin.run();

  return {
    postValue: serializeInstance.postValue,
    postExtract: compactInstance.postExtract
  };
}