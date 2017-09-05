import { parse, stringify } from 'scss-parser';
import createQueryWrapper from 'query-ast';

/**
 * Check if a declaration node has a '!' operator followed by a '<flag>' identifier in its value
 */
function declarationHasFlag($ast, node, flag) {
  return $ast(node)
  .children('value').children('operator')
  .filter(operator => operator.node.value === '!')
  .nextAll('identifier') // nextAll to account for potential space tokens following operator
  .filter(identifier => identifier.node.value === flag)
  .length() > 0
}

/**
 * Check if a declaration node has a '!' operator followed by the 'default' identifier in its value
 */
function isExplicitGlobalDeclaration($ast, node) {
  return declarationHasFlag($ast, node, 'global');
}

/**
 * Check if a declaration node has a '!' operator followed by the 'global' identifier in its value
 */
function isDefaultDeclaration($ast, node) {
  return declarationHasFlag($ast, node, 'default');
}

/**
 * Parse the raw expression of a variable declaration excluding flags
 */
function parseExpression($ast, declaration) {
  let flagsReached = false;
  
  return stringify($ast(declaration)
  .children('value')
  .get(0))
  .trim();
}

/**
 * Parse declaration node into declaration object
 */
function parseDeclaration($ast, declaration) {
  const variable = {};
  
  variable.declarationClean = $ast(declaration)
  .children('property')
  .value();

  variable.declaration = `$${variable.declarationClean}`;

  variable.expression = parseExpression($ast, declaration);
  variable.flags = {
    default: isDefaultDeclaration($ast, declaration),
    global: isExplicitGlobalDeclaration($ast, declaration),
  };

  return variable;
}

/**
 * Parse variable declarations from a chunk of sass source
 */
export function parseDeclarations(data) {
  const ast = parse(data);
  const $ast = createQueryWrapper(ast);

  const implicitGlobalDeclarations = $ast('declaration').hasParent('stylesheet');
  const explicitGlobalDeclarations = $ast('declaration').hasParent('block')
  .filter(node => isExplicitGlobalDeclaration($ast, node));

  let implicitGlobals = implicitGlobalDeclarations.map(declaration => parseDeclaration($ast, declaration));
  let explicitGlobals = explicitGlobalDeclarations.map(declaration => parseDeclaration($ast, declaration));

  return { explicitGlobals, implicitGlobals };
}
