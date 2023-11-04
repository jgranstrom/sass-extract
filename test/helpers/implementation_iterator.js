const implementations = {
  'Node Sass': require('node-sass'),
  'Dart Sass': require('sass')
};

/**
 * Iterates a specDefinition over the different Sass implementations
 * @param {String} description Textual description of the group
 * @param {Function} specDefinitions Function for Jasmine to invoke that will define inner suites and specs
 * @param {Function} suite The suite function to be used (can be also `fdescribe` or `xdescribe`)
 */
function implementation_iterator(description, specDefinitions, suite) {
  if(typeof specDefinitions !== 'function') throw new Error('describe_implementation needs a function containing the specDefinitions');

  Object.keys(implementations).map((key, index) => {
    const implementation_description = description + ' with ' + key;
    const implementation = implementations[key];

    suite(implementation_description, specDefinitions.bind(null, implementation, key));
  });
}

/**
 * Create a group of specs (often called a suite).
 * @param {String} description Textual description of the group
 * @param {Function} specDefinitions Function for Jasmine to invoke that will define inner suites and specs
 */
function describe_implementation(description, specDefinitions) {
  return implementation_iterator(description, specDefinitions, describe);
}

/**
 * A focused [`describe_implementation`]{@link describe_implementation}
 * If suites or specs are focused, only those that are focused will be executed
 * @param {String} description Textual description of the group
 * @param {Function} specDefinitions Function for Jasmine to invoke that will define inner suites and specs
 */
function describe_implementation_only(description, specDefinitions) {
  return implementation_iterator(description, specDefinitions, describe.only);
}

/**
 * A temporarily disabled [`describe_implementation`]{@link describe_implementation}
 * Specs within an `describe_implementation.skip` will be marked pending and not executed
 * @param {String} description Textual description of the group
 * @param {Function} specDefinitions Function for Jasmine to invoke that will define inner suites and specs
 */
function describe_implementation_skip(description, specDefinitions) {
  return implementation_iterator(description, specDefinitions, describe.skip);
}

/**
 * Hacking our custom suite functions to the global `describe`
 */
(function() {
  global.describe_implementation = describe_implementation;
  global.describe_implementation.only = describe_implementation_only;
  global.describe_implementation.skip = describe_implementation_skip;
})();
