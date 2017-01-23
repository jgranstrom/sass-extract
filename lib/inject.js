const sass = require('node-sass');

const FN_PREFIX = '_INJECT_';
const FN_PREFIX_IMPLICIT_GLOBAL = 'IG_';
const FN_PREFIX_EXPLICIT_GLOBAL = 'EG_';
const FN_SUFFIX_VALUE = '_VALUE';

function toColorHex(value) {
  let colorHex = value.toString(16);

  if(colorHex.length < 2) {
    colorHex = `0${colorHex}`;
  }

  return colorHex;
}

function makeValue(sassValue) {
  if(sassValue instanceof sass.types.Number) {
    return { value: sassValue.getValue(), unit: sassValue.getUnit() };
  } else if(sassValue instanceof sass.types.String || sassValue instanceof sass.types.Boolean) {
    return { value: sassValue.getValue() };
   } else if(sassValue instanceof sass.types.Color) {
    return {
      value: {
        r: sassValue.getR(),
        g: sassValue.getG(),
        b: sassValue.getB(),
        a: sassValue.getA(),
        hex: `#${toColorHex(sassValue.getR())}${toColorHex(sassValue.getG())}${toColorHex(sassValue.getB())}`
      },
    };
  } else if(sassValue instanceof sass.types.Null) {
    return { value: null };
  } else if(sassValue instanceof sass.types.List) {
    const listLength = sassValue.getLength();
    const listValue = [];
    for(let i = 0; i < listLength; i++) {
      listValue.push(makeValue(sassValue.getValue(i)));
    }
    return { value: listValue };
  } else if(sassValue instanceof sass.types.Map) {
    const mapLength = sassValue.getLength();
    const mapValue = {};
    for(let i = 0; i < mapLength; i++) {
      mapValue[sassValue.getKey(i)] = sassValue.getValue(i);
    }
    return { value: mapValue };
  } else {
    throw new Error(`Unsupported sass variable type '${sassValue.constructor.name}'`)
  }
}

function createStructuredValue(sassValue) {
  const value = makeValue(sassValue);

  if(value) {
    value.type = sassValue.constructor.name;
  }

  return value;
}

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
