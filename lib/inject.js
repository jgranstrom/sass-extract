const { createStructuredValue } = require('./struct');

const FN_PREFIX = '_INJECT_';
const FN_PREFIX_IMPLICIT_GLOBAL = 'IG_';
const FN_PREFIX_EXPLICIT_GLOBAL = 'EG_';
const FN_SUFFIX_VALUE = '_VALUE';

function inject(context, filename, fnPrefix, declaration, declarationResultHandler) {
  const fileId = new Buffer(filename).toString('base64').replace(/=/g, '');
  const fnName = `${fileId}_${context}_${FN_PREFIX}${fnPrefix}${declaration.declarationClean}`;

  const injectedFunction = (sassValue) => {
    const value = createStructuredValue(sassValue);
    declarationResultHandler(context, declaration, value, sassValue);
    return sassValue;
  };

  const injectedCode = `$${fnName}${FN_SUFFIX_VALUE}: ${fnName}(${declaration.declaration});\n`

  return { fnName, injectedFunction, injectedCode };
}

exports.injectFunctions = (filename, data, declarations, declarationResultHandler) => {
  let injectedData = `${data}\n\n`;
  const injectedFunctions = {};

  declarations.implicitGlobals.forEach((declaration) => {
    const { fnName, injectedFunction, injectedCode } = inject('global', filename, FN_PREFIX_IMPLICIT_GLOBAL, declaration, declarationResultHandler);
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  declarations.explicitGlobals.forEach((declaration) => {
    const { fnName, injectedFunction, injectedCode } = inject('global', filename, FN_PREFIX_EXPLICIT_GLOBAL, declaration, declarationResultHandler);
    injectedFunctions[fnName] = injectedFunction;
    injectedData += injectedCode;
  });

  return { injectedData, injectedFunctions };
}
