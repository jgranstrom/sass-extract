const sass = require('node-sass');

const REGEX_VARIABLE = /(\$[\w-_]+)\s*:\s*((.*?\n?)+?);/g;
const REGEX_GLOBAL_VARIABLE = /(\$[\w-_]+)\s*:\s*(.*?)\s+!global\s*;/g;
const REGEX_DEEP_CONTEXT = /({[^{}]*})/g;

function decontextify(data) {
  let strippedData = data;

  let match;
  while(match = strippedData.match(REGEX_DEEP_CONTEXT)) {
    strippedData = strippedData.replace(match[0], '');
  }

  return strippedData;
}

function extractExplicitGlobals(data) {
  const explicitGlobals = [];

  let matches;
  while(matches = REGEX_GLOBAL_VARIABLE.exec(data)) {
    const declaration = matches[1];
    const expression = matches[2];
    const declarationClean = declaration.replace('$', '');

    explicitGlobals.push({ declaration, expression, declarationClean });
  }

  return explicitGlobals;
}

function extractImplicitGlobals(data) {
  const decontextifiedData = decontextify(data);
  const implicitGlobals = [];

  let matches;
  while(matches = REGEX_VARIABLE.exec(decontextifiedData)) {
    const declaration = matches[1];
    const expression = matches[2];
    const declarationClean = declaration.replace('$', '');

    implicitGlobals.push({ declaration, expression, declarationClean });
  }

  return implicitGlobals;
}

exports.parseDeclarations = (data) => {
  const explicitGlobals = extractExplicitGlobals(data);
  const implicitGlobals = extractImplicitGlobals(data);

  return { explicitGlobals, implicitGlobals };
}