'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFiles = parseFiles;
exports.processFiles = processFiles;

var _inject = require('./inject');

var _parse = require('./parse');

var _pluggable = require('./pluggable');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Get a string id for a filename
 */
function getFileId(filename) {
  return new Buffer(filename).toString('base64').replace(/=/g, '');
}

function parseFile(filename, data) {
  return (0, _parse.parseDeclarations)(data);
}

function getDependentDeclarations(filename, declarations) {
  var fileId = getFileId(filename);
  var dependentDeclarations = [];

  declarations.explicitGlobals.forEach(function (declaration) {
    if (Object.keys(declaration.deps).length > 0) {
      dependentDeclarations.push({ filename: filename, declaration: declaration, decFileId: fileId });
    }
  });

  return dependentDeclarations;
}

/**
 * Process a single sass files to get declarations, injected source and functions
 */
function processFile(idx, count, filename, data, parsedDeclarations, pluggable) {
  var declarations = parsedDeclarations.files[filename];
  // Inject dependent declaration extraction to last file
  var dependentDeclarations = idx === count - 1 ? parsedDeclarations.dependentDeclarations : [];
  var variables = { global: {} };

  var globalDeclarationResultHandler = function globalDeclarationResultHandler(declaration, value, sassValue) {
    if (!variables.global[declaration.declaration]) {
      variables.global[declaration.declaration] = [];
    }
    var variableValue = pluggable.run(_pluggable.Pluggable.POST_VALUE, { value: value, sassValue: sassValue }).value;
    variables.global[declaration.declaration].push({ declaration: declaration, value: variableValue });
  };

  var fileId = getFileId(filename);
  var injection = (0, _inject.injectExtractionFunctions)(fileId, declarations, dependentDeclarations, { globalDeclarationResultHandler: globalDeclarationResultHandler });
  var injectedData = data + '\n\n' + injection.injectedData;
  var injectedFunctions = injection.injectedFunctions;

  return {
    fileId: fileId,
    declarations: declarations,
    variables: variables,
    injectedData: injectedData,
    injectedFunctions: injectedFunctions
  };
}

function parseFiles(files) {
  var parsedDeclarations = {
    files: {},
    dependentDeclarations: []
  };

  Object.keys(files).map(function (filename) {
    var _parsedDeclarations$d;

    var fileDeclarations = parseFile(filename, files[filename]);
    parsedDeclarations.files[filename] = fileDeclarations;
    (_parsedDeclarations$d = parsedDeclarations.dependentDeclarations).push.apply(_parsedDeclarations$d, _toConsumableArray(getDependentDeclarations(filename, fileDeclarations)));
  });

  return parsedDeclarations;
}

/**
 * Process a set of sass files to get declarations, injected source and functions
 * Files are provided in a map of filename -> key entries
 */
function processFiles(orderedFiles, files, parsedDeclarations, pluggable) {
  var extractions = {};

  orderedFiles.forEach(function (filename, idx) {
    extractions[filename] = processFile(idx, orderedFiles.length, filename, files[filename], parsedDeclarations, pluggable);
  });

  return extractions;
}