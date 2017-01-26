const { createStructuredValue } = require('./struct');

const FN_PREFIX = '___SV_INJECT';
const FN_PREFIX_IMPLICIT_GLOBAL = 'IG';
const FN_PREFIX_EXPLICIT_GLOBAL = 'EG';
const FN_SUFFIX_VALUE = 'VALUE';

/**
 * Create injection function and source for a file, category, declaration and result handler
 */
function createInjection(fileId, categoryPrefix, declaration, declarationResultHandler) {
  const fnName = `${FN_PREFIX}_${fileId}_${categoryPrefix}_${declaration.declarationClean}`;

  const injectedFunction = function(sassValue) {
    const value = createStructuredValue(sassValue);
    declarationResultHandler(declaration, value, sassValue);
    return sassValue;
  };

  const injectedCode = `$${fnName}: ${fnName}(${declaration.declaration});\n`

  return { fnName, injectedFunction, injectedCode };
}

/**
 * Create injection functions for extraction variable values
 * Returns injection sass source and the injected functions
 * Declaration result handlers will be called with the extracted value of each declaration
 * Provided file id will be used to ensure unique function names per file
 */
function injectExtractionFunctions(fileId, declarations, { globalDeclarationResultHandler }) {
  let injectedData = ``;
  const injectedFunctions = {};

  // Create injections for implicit global variables
  declarations.implicitGlobals.forEach(declaration => {
    const { fnName, injectedFunction, injectedCode } = createInjection(fileId, FN_PREFIX_IMPLICIT_GLOBAL, declaration, globalDeclarationResultHandler);
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  // Create injections for explicit global variables
  declarations.explicitGlobals.forEach(declaration => {
    const { fnName, injectedFunction, injectedCode } = createInjection(fileId, FN_PREFIX_EXPLICIT_GLOBAL, declaration, globalDeclarationResultHandler);
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  return { injectedData, injectedFunctions };
}

exports.injectExtractionFunctions = injectExtractionFunctions;