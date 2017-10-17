import createQueryWrapper from 'query-ast';
import gonzales from 'gonzales-pe';
import { stringify } from './stringify';

const SCOPE_IMPICIT = 'implicit';
const SCOPE_EXPLICIT = 'explicit';
const DEP_KEYWORDS = {
  mixin: 'mixin',
  function: 'function',
};

/**
 * Check if a declaration node has a '!' operator followed by a '<flag>' identifier in its value
 */
function declarationHasFlag($ast, node, flag) {
  return $ast(node)
  .children('value').children(flag)
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

function getDeclarationDeps($ast, declaration, scope) {
  if(scope !== SCOPE_EXPLICIT) {
    return {};
  }

  let atruleNode = $ast(declaration)
  .hasParents('atrule');

  if(atruleNode.length() < 1) {
    return {};
  }

  atruleNode = atruleNode.parentsUntil('atrule').parent();

  const atKeywordNode = atruleNode.children('atkeyword');
  const atIdentifierNode = atruleNode.children('identifier');
  const argumentsNode = atruleNode.children('arguments');

  if(atKeywordNode.length() === 0 || atIdentifierNode.length() === 0) {
    return {};
  }

  const atKeyword = atKeywordNode.first().value();
  const atIdentifier = atIdentifierNode.first().value();

  // Count arguments to mixin/function @atrule
  const requiredArgsCount = argumentsNode.children('variable').length();
  const optionalArgsCount = argumentsNode.children('declaration').length();
  const totalArgsCount = requiredArgsCount + optionalArgsCount;

  if(!DEP_KEYWORDS[atKeyword]) {
    return {};
  }

  return {
    [DEP_KEYWORDS[atKeyword]]: {
      name: atIdentifier,
      argsCount: {
        total: totalArgsCount,
        required: requiredArgsCount,
        optional: optionalArgsCount,
      },
    },
  };
}

/**
 * Parse declaration node into declaration object
 */
function parseDeclaration($ast, declaration, scope) {
  const variable = {};

  const propertyNode = $ast(declaration)
  .children('property');

  variable.declarationClean = propertyNode.value();
  variable.position = propertyNode.get(0).start;

  variable.declaration = `$${variable.declarationClean}`;

  variable.expression = parseExpression($ast, declaration);
  variable.flags = {
    default: isDefaultDeclaration($ast, declaration),
    global: isExplicitGlobalDeclaration($ast, declaration),
  };

  variable.deps = getDeclarationDeps($ast, declaration, scope);

  return variable;
}

/**
 * Parse variable declarations from a chunk of sass source
 */
export function parseDeclarations(data) {
  const ast = JSON.parse(gonzales.parse(data, {syntax: 'scss'}).toJson());

  let options = {
    hasChildren: (node) => Array.isArray(node.content),
    getChildren: (node) => node.content,
    toJSON: (node, children) => {
      return Object.assign({}, node, {
        content: children ? children : node.content
      })
    },
    toString: (node) => {
      return typeof node.content === 'string' ? node.content : ''
    }
  }
  const $ast = createQueryWrapper(ast, options);

  const implicitGlobalDeclarations = $ast('declaration').hasParent('stylesheet');
  const explicitGlobalDeclarations = $ast('declaration').hasParent('block')
  .filter(node => isExplicitGlobalDeclaration($ast, node));

  let implicitGlobals = implicitGlobalDeclarations.map(declaration => parseDeclaration($ast, declaration, SCOPE_IMPICIT));
  let explicitGlobals = explicitGlobalDeclarations.map(declaration => parseDeclaration($ast, declaration, SCOPE_EXPLICIT));

  return { explicitGlobals, implicitGlobals };
}
