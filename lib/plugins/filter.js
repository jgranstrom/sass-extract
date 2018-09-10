"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
function filterResults(results, filterMaps) {
  var filteredResults = {};
  var resultKeys = Object.keys(results);

  resultKeys.forEach(function (key) {
    var prop = key;
    var type = results[key].type;

    if (filterMaps.except.props && filterMaps.except.props[prop]) {
      return;
    }
    if (filterMaps.except.types && filterMaps.except.types[type]) {
      return;
    }

    if (filterMaps.only.props && !filterMaps.only.props[prop]) {
      return;
    }
    if (filterMaps.only.types && !filterMaps.only.types[type]) {
      return;
    }

    filteredResults[key] = results[key];
  });

  return filteredResults;
}

function makeFilterMap(filterArray) {
  var filterMap = null;

  if (filterArray != null && filterArray.length > 0) {
    filterMap = {};
    filterArray.forEach(function (filterElement) {
      return filterMap[filterElement] = true;
    });
  }

  return filterMap;
}

/**
 * Filter end result by a combination of property names and variable types
 */
function run(options) {
  var filterMaps = {
    except: {
      props: makeFilterMap(options && options.except && options.except.props),
      types: makeFilterMap(options && options.except && options.except.types)
    },
    only: {
      props: makeFilterMap(options && options.only && options.only.props),
      types: makeFilterMap(options && options.only && options.only.types)
    }
  };

  return {
    postExtract: function postExtract(extractedVariables) {
      var compactedVariables = {
        global: filterResults(extractedVariables.global, filterMaps)
      };

      return compactedVariables;
    }
  };
}