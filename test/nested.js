const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../lib');
const { normalizePath } = require('../lib/util');

const nestedBasicFile = path.join(__dirname, 'sass', 'nested', 'nested-basic.scss');
const nestedSubFile = path.join(__dirname, 'sass', 'nested', 'sub', 'sub.scss');
const nestedSub2File = path.join(__dirname, 'sass', 'nested', 'sub', 'sub2.scss');
const nestedOverridesFile = path.join(__dirname, 'sass', 'nested', 'nested-overrides.scss');
const nestedOverridesSubFile = path.join(__dirname, 'sass', 'nested', 'sub', 'overrides.scss');

function verifyNestedBasic(rendered) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$a');
  expect(rendered.vars.global).to.have.property('$b');
  expect(rendered.vars.global).to.have.property('$c');
  expect(Object.keys(rendered.vars.global)).to.have.length(3);

  expect(rendered.vars.global.$a.value).to.equal(100);
  expect(rendered.vars.global.$a.unit).to.equal('px');
  expect(rendered.vars.global.$a.type).to.equal('SassNumber');
  expect(rendered.vars.global.$a.sources).to.have.length(1);
  expect(rendered.vars.global.$a.sources[0]).to.equal(normalizePath(nestedBasicFile));
  expect(rendered.vars.global.$a.expressions).to.have.length(1);
  expect(rendered.vars.global.$a.expressions[0]).to.equal('100px');

  expect(rendered.vars.global.$b.value).to.equal(200);
  expect(rendered.vars.global.$b.unit).to.equal('px');
  expect(rendered.vars.global.$b.type).to.equal('SassNumber');
  expect(rendered.vars.global.$b.sources).to.have.length(1);
  expect(rendered.vars.global.$b.sources[0]).to.equal(normalizePath(nestedSubFile));
  expect(rendered.vars.global.$b.expressions).to.have.length(1);
  expect(rendered.vars.global.$b.expressions[0]).to.equal('200px');

  expect(rendered.vars.global.$c.value).to.equal(300);
  expect(rendered.vars.global.$c.unit).to.equal('px');
  expect(rendered.vars.global.$c.type).to.equal('SassNumber');
  expect(rendered.vars.global.$c.sources).to.have.length(1);
  expect(rendered.vars.global.$c.sources[0]).to.equal(normalizePath(nestedSub2File));
  expect(rendered.vars.global.$c.expressions).to.have.length(1);
  expect(rendered.vars.global.$c.expressions[0]).to.equal('300px');
}

function verifyNestedOverrides(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$a');
  expect(rendered.vars.global).to.have.property('$b');
  expect(Object.keys(rendered.vars.global)).to.have.length(2);

  expect(rendered.vars.global.$a.value).to.equal(200);
  expect(rendered.vars.global.$a.unit).to.equal('px');
  expect(rendered.vars.global.$a.type).to.equal('SassNumber');
  expect(rendered.vars.global.$a.sources).to.have.length(2);
  expect(rendered.vars.global.$a.sources).to.include.members([normalizePath(nestedOverridesFile), normalizePath(nestedOverridesSubFile)]);
  expect(rendered.vars.global.$a.expressions).to.have.length(2);
  expect(rendered.vars.global.$a.expressions).to.include.members(['100px', '200px']);

  expect(rendered.vars.global.$b.value).to.equal(100);
  expect(rendered.vars.global.$b.unit).to.equal('px');
  expect(rendered.vars.global.$b.type).to.equal('SassNumber');
  expect(rendered.vars.global.$b.sources).to.have.length(1);
  expect(rendered.vars.global.$b.sources[0]).to.equal(normalizePath(nestedOverridesSubFile));
  expect(rendered.vars.global.$b.expressions).to.have.length(1);
  expect(rendered.vars.global.$b.expressions[0]).to.equal('$a');
}

describe('nested-basic', () => {
  describe('sync', () => {
    it('should extract variables not in comments', () => {
      const rendered = renderSync({ file: nestedBasicFile })
      verifyNestedBasic(rendered);
    });
  });

  describe('async', () => {
    it('should extract variables not in comments', () => {
      return render({ file: nestedBasicFile })
      .then(rendered => {
        verifyNestedBasic(rendered);
      });
    });
  });
});

describe('nested-overrides', () => {
  describe('sync', () => {
    it('should extract variables not in comments', () => {
      const rendered = renderSync({ file: nestedOverridesFile })
      verifyNestedOverrides(rendered);
    });
  });

  describe('async', () => {
    it('should extract variables not in comments', () => {
      return render({ file: nestedOverridesFile })
      .then(rendered => {
        verifyNestedOverrides(rendered);
      });
    });
  });
});
