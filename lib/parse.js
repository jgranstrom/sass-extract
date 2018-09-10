'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDeclarations = parseDeclarations;

var _queryAst = require('query-ast');

var _queryAst2 = _interopRequireDefault(_queryAst);

var _gonzalesPe = require('gonzales-pe');

var _gonzalesPe2 = _interopRequireDefault(_gonzalesPe);

var _stringify = require('./stringify');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SCOPE_IMPICIT = 'implicit';
var SCOPE_EXPLICIT = 'explicit';

var DEP_KEYWORDS = {
  mixin: 'mixin',
  function: 'function'
};

var DEP_HOST = {
  mixin: function mixin(depParentNode) {
    return depParentNode;
  },
  function: function _function(depParentNode) {
    return depParentNode.children('function');
  }
};

/**
 * Check if a declaration node has a '!' operator followed by a '<flag>' identifier in its value
 */
function declarationHasFlag($ast, node, flag) {
  return $ast(node).children('value').children(flag).length() > 0;
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
  return (0, _stringify.stringify)($ast(declaration).children('value').get(0)).trim();
}

/**
 * Get dependencies required to extract variables such as mixins or function invocations
 */
function getDeclarationDeps($ast, declaration, scope) {
  if (scope !== SCOPE_EXPLICIT) {
    return {};
  }

  var depParentNodes = $ast(declaration).parents(function (node) {
    if (node.node.type === 'mixin') {
      return true;
    } else if (node.node.type === 'atrule') {
      var atruleIdentNode = $ast(node).children('atkeyword').children('ident');
      return atruleIdentNode.length() > 0 && atruleIdentNode.first().value() === 'function';
    } else {
      return false;
    }
  });

  if (depParentNodes.length() === 0) {
    return {};
  }

  var depParentNode = depParentNodes.last();
  var depKeywordNode = depParentNode.children('atkeyword').children('ident');

  if (depKeywordNode.length() === 0) {
    return {};
  }

  var atKeyword = depKeywordNode.first().value();

  if (!DEP_HOST[atKeyword]) {
    return {};
  }

  var depHostNode = DEP_HOST[atKeyword](depParentNode);
  var atKeywordIdentifierNode = depHostNode.children('ident');

  if (atKeywordIdentifierNode.length() === 0) {
    return {};
  }

  var atIdentifier = atKeywordIdentifierNode.first().value();
  var argumentsNode = depHostNode.children('arguments');

  // Count arguments to mixin/function @atrule
  var requiredArgsCount = argumentsNode.children('variable').length();
  var optionalArgsCount = argumentsNode.children('declaration').length();
  var totalArgsCount = requiredArgsCount + optionalArgsCount;

  if (!DEP_KEYWORDS[atKeyword]) {
    return {};
  }

  return _defineProperty({}, DEP_KEYWORDS[atKeyword], {
    name: atIdentifier,
    argsCount: {
      total: totalArgsCount,
      required: requiredArgsCount,
      optional: optionalArgsCount
    }
  });
}

/**
 * Parse declaration node into declaration object
 */
function parseDeclaration($ast, declaration, scope) {
  var variable = {};

  var propertyNode = $ast(declaration).children('property');

  variable.declarationClean = propertyNode.value();
  variable.position = propertyNode.get(0).start;

  variable.declaration = '$' + variable.declarationClean;

  variable.expression = parseExpression($ast, declaration);
  variable.flags = {
    default: isDefaultDeclaration($ast, declaration),
    global: isExplicitGlobalDeclaration($ast, declaration)
  };

  variable.deps = getDeclarationDeps($ast, declaration, scope);

  return variable;
}

/**
 * Parse variable declarations from a chunk of sass source
 */
function parseDeclarations(data) {
  var ast = JSON.parse(_gonzalesPe2.default.parse(data, { syntax: 'scss' }).toJson());

  var options = {
    hasChildren: function hasChildren(node) {
      return Array.isArray(node.content);
    },
    getChildren: function getChildren(node) {
      return node.content;
    },
    toJSON: function toJSON(node, children) {
      return Object.assign({}, node, {
        content: children ? children : node.content
      });
    },
    toString: function toString(node) {
      return typeof node.content === 'string' ? node.content : '';
    }
  };

  var $ast = (0, _queryAst2.default)(ast, options);

  var implicitGlobalDeclarations = $ast('declaration').hasParent('stylesheet');
  var explicitGlobalDeclarations = $ast('declaration').hasParent('block').filter(function (node) {
    return isExplicitGlobalDeclaration($ast, node);
  });

  var implicitGlobals = implicitGlobalDeclarations.map(function (declaration) {
    return parseDeclaration($ast, declaration, SCOPE_IMPICIT);
  });
  var explicitGlobals = explicitGlobalDeclarations.map(function (declaration) {
    return parseDeclaration($ast, declaration, SCOPE_EXPLICIT);
  });

  return { explicitGlobals: explicitGlobals, implicitGlobals: implicitGlobals };
}