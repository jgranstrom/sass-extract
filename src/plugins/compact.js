function isPrimitive(value) {
  return Object(value) !== value;
}

/**
 * Use duck typing to distinguish between map and color objects
 */
function isColor(value) {
  return (
    value.r != null && value.g != null && value.b != null && value.a != null && value.hex != null
  );
}

function compactArray(arrayValue) {
  return arrayValue.map((element) => {
    return compactValue(element.value);
  });
}

function compactObject(objectValue) {
  if (isColor(objectValue)) {
    return objectValue;
  }
  const compactedObject = {};

  Object.keys(objectValue).forEach((key) => {
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
export function run() {
  return {
    postExtract: (extractedVariables) => {
      const compactedVariables = {
        global: compactValue(extractedVariables.global),
      };

      return compactedVariables;
    },
  };
}
