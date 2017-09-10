import sass from 'node-sass';

const REGEX_VARIABLE_GLOBAL_IMPLICIT = /(\$[\w-]+)\s*:\s*(.+?|(.*[\r\n])*\s*\));/g;
const REGEX_VARIABLE_GLOBAL_EXPLICIT = /(\$[\w-_]+)\s*:\s*(.*?)\s+!global\s*;/g;
const REGEX_DEEP_CONTEXT = /({[^{}]*})/g;
const REGEX_COMMENTS = /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g;

/**
 * Strip a string for all occurences that matches provided regex
 */
function stripByRegex(data, regex) {
  let strippedData = data;

  let match;
  while(match = strippedData.match(regex)) {
    strippedData = strippedData.replace(match[0], '');
  }

  return strippedData;
}

/**
 * Extract variable declaration and expression from a chunk of sass source using provided regex
 */
function extractVariables(data, regex) {
  const variables = [];

  let matches;
  while(matches = regex.exec(data)) {
    const declaration = matches[1];
    const expression = matches[2];
    const declarationClean = declaration.replace('$', '');

    variables.push({ declaration, expression, declarationClean });
  }

  return variables;
}

/**
 * Parse variables declarations from a chunk of sass source
 */
export function parseDeclarations(data) {
  const decommentedData = stripByRegex(data, REGEX_COMMENTS);
  const decontextifiedData = stripByRegex(decommentedData, REGEX_DEEP_CONTEXT);

  const explicitGlobals = extractVariables(decommentedData, REGEX_VARIABLE_GLOBAL_EXPLICIT);
  const implicitGlobals = extractVariables(decontextifiedData, REGEX_VARIABLE_GLOBAL_IMPLICIT);

  return { explicitGlobals, implicitGlobals };
}
