const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const varArgsFile = path.join(__dirname, 'sass', 'var-args.scss');

function verifyVarArgs(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$echoedArgs');
  expect(rendered.vars.global).to.have.property('$echoedArg');
  expect(rendered.vars.global).to.have.property('$optionallySingle');
  expect(rendered.vars.global).to.have.property('$optionallyMultiple');
  expect(rendered.vars.global).to.have.property('$oneString');
  expect(rendered.vars.global).to.have.property('$oneNumber');
  expect(rendered.vars.global).to.have.property('$oneList');
  expect(rendered.vars.global).to.have.property('$echoedMixin');

  expect(rendered.vars.global.$echoedArgs.type).to.equal('SassList');
  expect(rendered.vars.global.$echoedArgs.sources).to.have.length(1);
  expect(rendered.vars.global.$echoedArgs.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$echoedArgs.declarations).to.have.length(1);
  expect(rendered.vars.global.$echoedArgs.declarations[0].expression).to.equal(`echo(1, 2, 3)`);
  expect(rendered.vars.global.$echoedArgs.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$echoedArgs.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$echoedArgs.value).to.have.length(3);
  expect(rendered.vars.global.$echoedArgs.value).to.deep.equal([
    { type: 'SassNumber', value: 1, unit: '' },
    { type: 'SassNumber', value: 2, unit: '' },
    { type: 'SassNumber', value: 3, unit: '' },
  ]);

  expect(rendered.vars.global.$echoedArg.type).to.equal('SassList');
  expect(rendered.vars.global.$echoedArg.sources).to.have.length(1);
  expect(rendered.vars.global.$echoedArg.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$echoedArg.declarations).to.have.length(1);
  expect(rendered.vars.global.$echoedArg.declarations[0].expression).to.equal(`echo('hello')`);
  expect(rendered.vars.global.$echoedArg.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$echoedArg.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$echoedArg.value).to.have.length(1);
  expect(rendered.vars.global.$echoedArg.value).to.deep.equal([
    { type: 'SassString', value: 'hello' },
  ]);

  expect(rendered.vars.global.$optionallySingle.type).to.equal('SassList');
  expect(rendered.vars.global.$optionallySingle.sources).to.have.length(1);
  expect(rendered.vars.global.$optionallySingle.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$optionallySingle.declarations).to.have.length(1);
  expect(rendered.vars.global.$optionallySingle.declarations[0].expression).to.equal(
    `optionally('last')`
  );
  expect(rendered.vars.global.$optionallySingle.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$optionallySingle.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$optionallySingle.value).to.have.length(1);
  expect(rendered.vars.global.$optionallySingle.value).to.deep.equal([
    { type: 'SassString', value: 'last' },
  ]);

  expect(rendered.vars.global.$optionallyMultiple.type).to.equal('SassList');
  expect(rendered.vars.global.$optionallyMultiple.sources).to.have.length(1);
  expect(rendered.vars.global.$optionallyMultiple.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$optionallyMultiple.declarations).to.have.length(1);
  expect(rendered.vars.global.$optionallyMultiple.declarations[0].expression).to.equal(
    `optionally('last', 1, 2, 3)`
  );
  expect(rendered.vars.global.$optionallyMultiple.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$optionallyMultiple.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$optionallyMultiple.value).to.have.length(4);
  expect(rendered.vars.global.$optionallyMultiple.value).to.deep.equal([
    { type: 'SassNumber', value: 1, unit: '' },
    { type: 'SassNumber', value: 2, unit: '' },
    { type: 'SassNumber', value: 3, unit: '' },
    { type: 'SassString', value: 'last' },
  ]);

  expect(rendered.vars.global.$oneString.type).to.equal('SassString');
  expect(rendered.vars.global.$oneString.sources).to.have.length(1);
  expect(rendered.vars.global.$oneString.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$oneString.declarations).to.have.length(1);
  expect(rendered.vars.global.$oneString.declarations[0].expression).to.equal(
    `oneOf(2, 'a', 'b', 'c')`
  );
  expect(rendered.vars.global.$oneString.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$oneString.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$oneString.value).to.equal('b');

  expect(rendered.vars.global.$oneNumber.type).to.equal('SassNumber');
  expect(rendered.vars.global.$oneNumber.sources).to.have.length(1);
  expect(rendered.vars.global.$oneNumber.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$oneNumber.declarations).to.have.length(1);
  expect(rendered.vars.global.$oneNumber.declarations[0].expression).to.equal(
    `oneOf(3, 'a', 'b', 5, ('d', 'e'))`
  );
  expect(rendered.vars.global.$oneNumber.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$oneNumber.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$oneNumber.value).to.equal(5);

  expect(rendered.vars.global.$oneList.type).to.equal('SassList');
  expect(rendered.vars.global.$oneList.sources).to.have.length(1);
  expect(rendered.vars.global.$oneList.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$oneList.declarations).to.have.length(1);
  expect(rendered.vars.global.$oneList.declarations[0].expression).to.equal(
    `oneOf(4, 'a', 'b', 5, ('d', 'e'), 1, 2)`
  );
  expect(rendered.vars.global.$oneList.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$oneList.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$oneList.value).to.have.length(2);
  expect(rendered.vars.global.$oneList.value).to.deep.equal([
    { type: 'SassString', value: 'd' },
    { type: 'SassString', value: 'e' },
  ]);

  expect(rendered.vars.global.$echoedMixin.type).to.equal('SassList');
  expect(rendered.vars.global.$echoedMixin.sources).to.have.length(1);
  expect(rendered.vars.global.$echoedMixin.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$echoedMixin.declarations).to.have.length(1);
  expect(rendered.vars.global.$echoedMixin.declarations[0].expression).to.equal(`$vars !global`);
  expect(rendered.vars.global.$echoedMixin.declarations[0].flags.global).to.equal(true);
  expect(rendered.vars.global.$echoedMixin.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$echoedMixin.value).to.have.length(3);
  expect(rendered.vars.global.$echoedMixin.value).to.deep.equal([
    { type: 'SassNumber', value: 5, unit: '' },
    { type: 'SassNumber', value: 6, unit: '' },
    { type: 'SassNumber', value: 7, unit: '' },
  ]);
}

describe('var-args', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: varArgsFile });
      verifyVarArgs(rendered, varArgsFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: varArgsFile }).then((rendered) => {
        verifyVarArgs(rendered, varArgsFile);
      });
    });
  });
});
