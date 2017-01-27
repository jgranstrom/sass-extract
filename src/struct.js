import sass from 'node-sass';

/**
 * Convert a color value 0-255 to hex 00-FF
 */
function toColorHex(value) {
  let colorHex = value.toString(16);

  if(colorHex.length < 2) {
    colorHex = `0${colorHex}`;
  }

  return colorHex;
}

/**
 * Transform a sassValue into a structured value based on the value type
 */
function makeValue(sassValue) {
  switch(sassValue.constructor) {
    case sass.types.String:
    case sass.types.Boolean:
      return { value: sassValue.getValue() };

    case sass.types.Number:
      return { value: sassValue.getValue(), unit: sassValue.getUnit() };

    case sass.types.Color:
      return {
        value: {
          r: sassValue.getR(),
          g: sassValue.getG(),
          b: sassValue.getB(),
          a: sassValue.getA(),
          hex: `#${toColorHex(sassValue.getR())}${toColorHex(sassValue.getG())}${toColorHex(sassValue.getB())}`
        },
      };

    case sass.types.Null: 
      return { value: null };

    case sass.types.List:
      const listLength = sassValue.getLength();
      const listValue = [];
      for(let i = 0; i < listLength; i++) {
        listValue.push(exports.createStructuredValue(sassValue.getValue(i)));
      }
      return { value: listValue };

    case sass.types.Map:
      const mapLength = sassValue.getLength();
      const mapValue = {};
      for(let i = 0; i < mapLength; i++) {
        mapValue[sassValue.getKey(i).getValue()] = exports.createStructuredValue(sassValue.getValue(i));
      }
      return { value: mapValue };

    default:
      throw new Error(`Unsupported sass variable type '${sassValue.constructor.name}'`)
  };
};

/**
 * Create a structured value definition from a sassValue object
 */
export function createStructuredValue(sassValue) {
  const value = Object.assign({ 
    type: sassValue.constructor.name,
  }, makeValue(sassValue));

  return value;
};
