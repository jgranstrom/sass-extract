import sass from 'node-sass';
import { toColorHex } from './util';
import { serialize } from './serialize';

/**
 * Transform a sassValue into a structured value based on the value type
 */
function makeValue(sassValue) {
  switch (sassValue.constructor) {
    case sass.types.String:
    case sass.types.Boolean: {
      return { value: sassValue.getValue() };
    }

    case sass.types.Number: {
      return { value: sassValue.getValue(), unit: sassValue.getUnit() };
    }

    case sass.types.Color: {
      const r = Math.round(sassValue.getR());
      const g = Math.round(sassValue.getG());
      const b = Math.round(sassValue.getB());

      return {
        value: {
          r,
          g,
          b,
          a: sassValue.getA(),
          hex: `#${toColorHex(r)}${toColorHex(g)}${toColorHex(b)}`,
        },
      };
    }

    case sass.types.Null: {
      return { value: null };
    }

    case sass.types.List: {
      const listLength = sassValue.getLength();
      const listValue = [];
      for (let i = 0; i < listLength; i++) {
        listValue.push(createStructuredValue(sassValue.getValue(i)));
      }
      return { value: listValue, separator: sassValue.getSeparator() ? ',' : ' ' };
    }

    case sass.types.Map: {
      const mapLength = sassValue.getLength();
      const mapValue = {};
      for (let i = 0; i < mapLength; i++) {
        // Serialize map keys of arbitrary type for extracted struct
        const serializedKey = serialize(sassValue.getKey(i));
        mapValue[serializedKey] = createStructuredValue(sassValue.getValue(i));
      }
      return { value: mapValue };
    }

    default:
      throw new Error(`Unsupported sass variable type '${sassValue.constructor.name}'`);
  }
}

/**
 * Create a structured value definition from a sassValue object
 */
export function createStructuredValue(sassValue) {
  const value = Object.assign(
    {
      type: sassValue.constructor.name,
    },
    makeValue(sassValue)
  );

  return value;
}
