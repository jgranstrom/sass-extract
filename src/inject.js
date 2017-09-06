import { createStructuredValue } from './struct';

const FN_PREFIX = '___SV_INJECT';
const FN_PREFIX_IMPLICIT_GLOBAL = 'IG';
const FN_PREFIX_EXPLICIT_GLOBAL = 'EG';
const FN_SUFFIX_VALUE = 'VALUE';
const TMP_VAR_PREFIX = '____SV_TEMP_VAR';

/**
 * Create injection function and source for a file, category, declaration and result handler
 */
function createInjection(fileId, categoryPrefix, declaration, idx, declarationResultHandler) {
  const fnName = `${FN_PREFIX}_${fileId}_${categoryPrefix}_${declaration.declarationClean}_${idx}`;
  const tmpVariableName = `${TMP_VAR_PREFIX}_${fileId}`;

  const injectedFunction = function(sassValue) {
    const value = createStructuredValue(sassValue);
    declarationResultHandler(declaration, value, sassValue);
    return sassValue;
  };

  let injectedCode = `$${fnName}: ${fnName}(${declaration.declaration});\n`

  const mixinDep = declaration.deps.mixin;
  const functionDep = declaration.deps.function;

  // Inject mixin and function invocations if necessary
  if(mixinDep) {
    const mixinInvocation = `
    ${declaration.declaration}: null !default;
    @if ${declaration.declaration} == null {
      @include ${mixinDep.name}(${new Array(mixinDep.argsCount.required).fill('null').join(', ')});
    }
    `;
    injectedCode = `${mixinInvocation}${injectedCode}\n`;
  }

  if(functionDep) {
    const functionInvocation = `
    ${declaration.declaration}: null !default;
    @if ${declaration.declaration} == null {
      $${tmpVariableName}: ${functionDep.name}(${new Array(functionDep.argsCount.required).fill('null').join(', ')});
    }
    `;
    injectedCode = `${functionInvocation}${injectedCode}\n`; 
  }

  return { fnName, injectedFunction, injectedCode };
}

/**
 * Create injection functions for extraction variable values
 * Returns injection sass source and the injected functions
 * Declaration result handlers will be called with the extracted value of each declaration
 * Provided file id will be used to ensure unique function names per file
 */
export function injectExtractionFunctions(fileId, declarations, { globalDeclarationResultHandler }) {
  let injectedData = ``;
  const injectedFunctions = {};

  // Create injections for implicit global variables
  declarations.implicitGlobals.forEach((declaration, idx) => {
    const { fnName, injectedFunction, injectedCode } = createInjection(fileId, FN_PREFIX_IMPLICIT_GLOBAL, declaration, idx, globalDeclarationResultHandler);
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  // Create injections for explicit global variables
  declarations.explicitGlobals.forEach((declaration, idx) => {
    const { fnName, injectedFunction, injectedCode } = createInjection(fileId, FN_PREFIX_EXPLICIT_GLOBAL, declaration, idx, globalDeclarationResultHandler);
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  return { injectedData, injectedFunctions };
}
