const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const importedFunctionsFile = path.join(__dirname, 'sass', 'imported-functions.scss');
const functionsFile = path.join(__dirname, 'sass', 'nested', 'functions.scss');

function verifyImportedFunctions(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$functionVariable');
  expect(rendered.vars.global).to.have.property('$defaultedAtFirst');
  expect(rendered.vars.global).to.have.property('$someDefault');
  expect(rendered.vars.global).to.have.property('$someOtherDefault');
  expect(rendered.vars.global).to.have.property('$multipleDefault');

  expect(rendered.vars.global.$functionVariable.type).to.equal('SassString');
  expect(rendered.vars.global.$functionVariable.sources).to.have.length(1);
  expect(rendered.vars.global.$functionVariable.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$functionVariable.declarations).to.have.length(2);
  expect(rendered.vars.global.$functionVariable.declarations[0].expression).to.equal(
    `'function-variable' !global`
  );
  expect(rendered.vars.global.$functionVariable.declarations[0].flags.global).to.equal(true);
  expect(rendered.vars.global.$functionVariable.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$functionVariable.declarations[1].expression).to.equal(
    `'should-not-happen' !global`
  );
  expect(rendered.vars.global.$functionVariable.declarations[1].flags.global).to.equal(true);
  expect(rendered.vars.global.$functionVariable.declarations[1].flags.default).to.equal(false);
  expect(rendered.vars.global.$functionVariable.value).to.equal('function-variable');

  expect(rendered.vars.global.$defaultedAtFirst.type).to.equal('SassString');
  expect(rendered.vars.global.$defaultedAtFirst.sources).to.have.length(1);
  expect(rendered.vars.global.$defaultedAtFirst.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$defaultedAtFirst.declarations).to.have.length(2);
  expect(rendered.vars.global.$defaultedAtFirst.declarations[0].expression).to.equal(
    `'defaulted' !default !global`
  );
  expect(rendered.vars.global.$defaultedAtFirst.declarations[0].flags.global).to.equal(true);
  expect(rendered.vars.global.$defaultedAtFirst.declarations[0].flags.default).to.equal(true);
  expect(rendered.vars.global.$defaultedAtFirst.declarations[1].expression).to.equal(
    `'actual' !global`
  );
  expect(rendered.vars.global.$defaultedAtFirst.declarations[1].flags.global).to.equal(true);
  expect(rendered.vars.global.$defaultedAtFirst.declarations[1].flags.default).to.equal(false);
  expect(rendered.vars.global.$defaultedAtFirst.value).to.equal('actual');

  expect(rendered.vars.global.$someDefault.type).to.equal('SassString');
  expect(rendered.vars.global.$someDefault.sources).to.have.length(1);
  expect(rendered.vars.global.$someDefault.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$someDefault.declarations).to.have.length(3);
  expect(rendered.vars.global.$someDefault.declarations[0].expression).to.equal(`'b' !default`);
  expect(rendered.vars.global.$someDefault.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$someDefault.declarations[0].flags.default).to.equal(true);
  expect(rendered.vars.global.$someDefault.declarations[1].expression).to.equal(
    `'a' !default !global`
  );
  expect(rendered.vars.global.$someDefault.declarations[1].flags.global).to.equal(true);
  expect(rendered.vars.global.$someDefault.declarations[1].flags.default).to.equal(true);
  expect(rendered.vars.global.$someDefault.declarations[2].expression).to.equal(`'c' !global`);
  expect(rendered.vars.global.$someDefault.declarations[2].flags.global).to.equal(true);
  expect(rendered.vars.global.$someDefault.declarations[2].flags.default).to.equal(false);
  expect(rendered.vars.global.$someDefault.value).to.equal('c');

  expect(rendered.vars.global.$someOtherDefault.type).to.equal('SassNumber');
  expect(rendered.vars.global.$someOtherDefault.sources).to.have.length(1);
  expect(rendered.vars.global.$someOtherDefault.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$someOtherDefault.declarations).to.have.length(3);
  expect(rendered.vars.global.$someOtherDefault.declarations[0].expression).to.equal(`3`);
  expect(rendered.vars.global.$someOtherDefault.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$someOtherDefault.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$someOtherDefault.declarations[1].expression).to.equal(
    `1 !default !global`
  );
  expect(rendered.vars.global.$someOtherDefault.declarations[1].flags.global).to.equal(true);
  expect(rendered.vars.global.$someOtherDefault.declarations[1].flags.default).to.equal(true);
  expect(rendered.vars.global.$someOtherDefault.declarations[2].expression).to.equal(
    `2 !default !global`
  );
  expect(rendered.vars.global.$someOtherDefault.declarations[2].flags.global).to.equal(true);
  expect(rendered.vars.global.$someOtherDefault.declarations[2].flags.default).to.equal(true);
  expect(rendered.vars.global.$someOtherDefault.value).to.equal(3);

  expect(rendered.vars.global.$multipleDefault.type).to.equal('SassString');
  expect(rendered.vars.global.$multipleDefault.sources).to.have.length(1);
  expect(rendered.vars.global.$multipleDefault.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$multipleDefault.declarations).to.have.length(2);
  expect(rendered.vars.global.$multipleDefault.declarations[0].expression).to.equal(
    `'x' !default !global`
  );
  expect(rendered.vars.global.$multipleDefault.declarations[0].flags.global).to.equal(true);
  expect(rendered.vars.global.$multipleDefault.declarations[0].flags.default).to.equal(true);
  expect(rendered.vars.global.$multipleDefault.declarations[1].expression).to.equal(
    `'y' !default !global`
  );
  expect(rendered.vars.global.$multipleDefault.declarations[1].flags.global).to.equal(true);
  expect(rendered.vars.global.$multipleDefault.declarations[1].flags.default).to.equal(true);
  expect(rendered.vars.global.$multipleDefault.value).to.equal('x');
}

describe('imported-functions', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: importedFunctionsFile });
      verifyImportedFunctions(rendered, importedFunctionsFile, functionsFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: importedFunctionsFile }).then((rendered) => {
        verifyImportedFunctions(rendered, importedFunctionsFile, functionsFile);
      });
    });
  });
});
