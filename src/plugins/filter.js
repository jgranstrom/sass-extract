function filterResults(results, filterMaps) {
  const filteredResults = {};
  const resultKeys = Object.keys(results);

  resultKeys.forEach((key) => {
    const prop = key;
    const type = results[key].type;

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
  let filterMap = null;

  if (filterArray != null && filterArray.length > 0) {
    filterMap = {};
    filterArray.forEach((filterElement) => (filterMap[filterElement] = true));
  }

  return filterMap;
}

/**
 * Filter end result by a combination of property names and variable types
 */
export function run(options) {
  const filterMaps = {
    except: {
      props: makeFilterMap(options && options.except && options.except.props),
      types: makeFilterMap(options && options.except && options.except.types),
    },
    only: {
      props: makeFilterMap(options && options.only && options.only.props),
      types: makeFilterMap(options && options.only && options.only.types),
    },
  };

  return {
    postExtract: (extractedVariables) => {
      const compactedVariables = {
        global: filterResults(extractedVariables.global, filterMaps),
      };

      return compactedVariables;
    },
  };
}
