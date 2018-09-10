"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
function isPrimitive(value) {
  return Object(value) !== value;
}

/**
 * Use duck typing to distinguish between map and color objects
 */
function isColor(value) {
  return value.r != null && value.g != null && value.b != null && value.a != null && value.hex != null;
}

function compactArray(arrayValue) {
  return arrayValue.map(function (element) {
    return compactValue(element.value);
  });
}

function compactObject(objectValue) {
  if (isColor(objectValue)) {
    return objectValue;
  }
  var compactedObject = {};

  Object.keys(objectValue).forEach(function (key) {
    compactedObject[key] = compactValue(objectValue[key].value);
  });

  return compactedObject;
}

function compactValue(value) {
  if (isPrimitive(value)) {
    return value;
  } else if (Array.isArray(value)) {
    return compactArray(value);
  } else {
    return compactObject(value);
  }
}

/**
 * Remove all metadata about variables and only output the variable value itself
 * Lists and maps are collapsed into their respective elements
 */
function run() {
  return {
    postExtract: function postExtract(extractedVariables) {
      var compactedVariables = {
        global: compactValue(extractedVariables.global)
      };

      return compactedVariables;
    }
  };
}