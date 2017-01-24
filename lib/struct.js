const sass = require('node-sass');

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
      listValue.push(exports.createStructuredValue(sassValue.getValue(i)));
    }
    return { value: listValue };
  } else if(sassValue instanceof sass.types.Map) {
    const mapLength = sassValue.getLength();
    const mapValue = {};
    for(let i = 0; i < mapLength; i++) {
      mapValue[sassValue.getKey(i).getValue()] = exports.createStructuredValue(sassValue.getValue(i));
    }
    return { value: mapValue };
  } else {
    throw new Error(`Unsupported sass variable type '${sassValue.constructor.name}'`)
  }
};

exports.createStructuredValue = (sassValue) => {
  const value = makeValue(sassValue);

  if(value) {
    value.type = sassValue.constructor.name;
  }

  return value;
};
