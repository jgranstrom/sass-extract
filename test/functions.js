const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');
const { types } = require('node-sass');

const functionsFile = path.join(__dirname, 'sass', 'functions.scss');

function verifyFunctions(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$fColor');
  expect(rendered.vars.global).to.have.property('$fSize');

  expect(rendered.vars.global.$fColor.value.r).to.equal(0);
  expect(rendered.vars.global.$fColor.value.g).to.equal(255);
  expect(rendered.vars.global.$fColor.value.b).to.equal(0);
  expect(rendered.vars.global.$fColor.value.a).to.equal(1);
  expect(rendered.vars.global.$fColor.value.hex).to.equal('#00ff00');
  expect(rendered.vars.global.$fColor.type).to.equal('SassColor');
  expect(rendered.vars.global.$fColor.sources).to.have.length(1);
  expect(rendered.vars.global.$fColor.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$fColor.declarations).to.have.length(1);
  expect(rendered.vars.global.$fColor.declarations[0].expression).to.equal('fn-color()');

  expect(rendered.vars.global.$fSize.value).to.equal(20);
  expect(rendered.vars.global.$fSize.unit).to.equal('px');
  expect(rendered.vars.global.$fSize.type).to.equal('SassNumber');
  expect(rendered.vars.global.$fSize.sources).to.have.length(1);
  expect(rendered.vars.global.$fSize.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$fSize.declarations).to.have.length(1);
  expect(rendered.vars.global.$fSize.declarations[0].expression).to.equal('fn-size(2)');
}

const functions = {
  'fn-color()': () => new types.Color(0, 255, 0),
  'fn-size($multiplier)': (multiplier) => new types.Number(10 * multiplier.getValue(), 'px'),
};

describe('functions', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: functionsFile, functions });
      verifyFunctions(rendered, functionsFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: functionsFile, functions }).then((rendered) => {
        verifyFunctions(rendered, functionsFile);
      });
    });
  });
});
