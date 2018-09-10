'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectExtractionFunctions = injectExtractionFunctions;

var _struct = require('./struct');

var FN_PREFIX = '___SV_INJECT';
var FN_PREFIX_IMPLICIT_GLOBAL = 'IG';
var FN_PREFIX_EXPLICIT_GLOBAL = 'EG';
var FN_PREFIX_DEPENDENT_GLOBAL = 'DG';
var FN_SUFFIX_VALUE = 'VALUE';

/**
 * Create injection function and source for a file, category, declaration and result handler
 */
function createInjection(fileId, categoryPrefix, declaration, idx, declarationResultHandler) {
  var fnName = FN_PREFIX + '_' + fileId + '_' + categoryPrefix + '_' + declaration.declarationClean + '_' + idx;

  var injectedFunction = function injectedFunction(sassValue) {
    var value = (0, _struct.createStructuredValue)(sassValue);
    declarationResultHandler(declaration, value, sassValue);
    return sassValue;
  };

  var injectedCode = '@if global_variable_exists(\'' + declaration.declarationClean + '\') { \n    $' + fnName + ': ' + fnName + '(' + declaration.declaration + '); \n  }\n';

  return { fnName: fnName, injectedFunction: injectedFunction, injectedCode: injectedCode };
}

/**
 * Create injection functions for extraction variable values
 * Returns injection sass source and the injected functions
 * Declaration result handlers will be called with the extracted value of each declaration
 * Provided file id will be used to ensure unique function names per file
 */
function injectExtractionFunctions(fileId, declarations, dependentDeclarations, _ref) {
  var globalDeclarationResultHandler = _ref.globalDeclarationResultHandler;

  var injectedData = '';
  var injectedFunctions = {};

  // Create injections for implicit global variables
  declarations.implicitGlobals.forEach(function (declaration, idx) {
    var _createInjection = createInjection(fileId, FN_PREFIX_IMPLICIT_GLOBAL, declaration, idx, globalDeclarationResultHandler),
        fnName = _createInjection.fnName,
        injectedFunction = _createInjection.injectedFunction,
        injectedCode = _createInjection.injectedCode;

    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  // Create injections for explicit global variables
  declarations.explicitGlobals.forEach(function (declaration, idx) {
    var _createInjection2 = createInjection(fileId, FN_PREFIX_EXPLICIT_GLOBAL, declaration, idx, globalDeclarationResultHandler),
        fnName = _createInjection2.fnName,
        injectedFunction = _createInjection2.injectedFunction,
        injectedCode = _createInjection2.injectedCode;

    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  dependentDeclarations.forEach(function (_ref2, idx) {
    var declaration = _ref2.declaration,
        decFileId = _ref2.decFileId;

    // Do not add dependent injection if the declaration is in the current file
    // It will already be added by explicits
    if (decFileId === fileId) {
      return;
    }

    var _createInjection3 = createInjection(fileId, FN_PREFIX_DEPENDENT_GLOBAL, declaration, idx, globalDeclarationResultHandler),
        fnName = _createInjection3.fnName,
        injectedFunction = _createInjection3.injectedFunction,
        injectedCode = _createInjection3.injectedCode;

    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  return { injectedData: injectedData, injectedFunctions: injectedFunctions };
}