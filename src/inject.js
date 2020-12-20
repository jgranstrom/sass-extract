import { createStructuredValue } from './struct';

const FN_PREFIX = '___SV_INJECT';
const FN_PREFIX_IMPLICIT_GLOBAL = 'IG';
const FN_PREFIX_EXPLICIT_GLOBAL = 'EG';
const FN_PREFIX_DEPENDENT_GLOBAL = 'DG';

/**
 * Create injection function and source for a file, category, declaration and result handler
 */
function createInjection(fileId, categoryPrefix, declaration, idx, declarationResultHandler) {
  const fnName = `${FN_PREFIX}_${fileId}_${categoryPrefix}_${declaration.declarationClean}_${idx}`;

  const injectedFunction = function (sassValue) {
    const value = createStructuredValue(sassValue);
    declarationResultHandler(declaration, value, sassValue);
    return sassValue;
  };

  let injectedCode = `@if global_variable_exists('${declaration.declarationClean}') { 
    $${fnName}: ${fnName}(${declaration.declaration}); 
  }\n`;

  return { fnName, injectedFunction, injectedCode };
}

/**
 * Create injection functions for extraction variable values
 * Returns injection sass source and the injected functions
 * Declaration result handlers will be called with the extracted value of each declaration
 * Provided file id will be used to ensure unique function names per file
 */
export function injectExtractionFunctions(
  fileId,
  declarations,
  dependentDeclarations,
  { globalDeclarationResultHandler }
) {
  let injectedData = ``;
  const injectedFunctions = {};

  // Create injections for implicit global variables
  declarations.implicitGlobals.forEach((declaration, idx) => {
    const { fnName, injectedFunction, injectedCode } = createInjection(
      fileId,
      FN_PREFIX_IMPLICIT_GLOBAL,
      declaration,
      idx,
      globalDeclarationResultHandler
    );
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  // Create injections for explicit global variables
  declarations.explicitGlobals.forEach((declaration, idx) => {
    const { fnName, injectedFunction, injectedCode } = createInjection(
      fileId,
      FN_PREFIX_EXPLICIT_GLOBAL,
      declaration,
      idx,
      globalDeclarationResultHandler
    );
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  dependentDeclarations.forEach(({ declaration, decFileId }, idx) => {
    // Do not add dependent injection if the declaration is in the current file
    // It will already be added by explicits
    if (decFileId === fileId) {
      return;
    }
    const { fnName, injectedFunction, injectedCode } = createInjection(
      fileId,
      FN_PREFIX_DEPENDENT_GLOBAL,
      declaration,
      idx,
      globalDeclarationResultHandler
    );
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  return { injectedData, injectedFunctions };
}
