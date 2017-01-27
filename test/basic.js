const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../lib');

const basicImplicitFile = path.join(__dirname, 'sass', 'basic-implicit.scss');
const basicExplicitFile = path.join(__dirname, 'sass', 'basic-explicit.scss');
const basicMixedFile = path.join(__dirname, 'sass', 'basic-mixed.scss');

function verifyBasic(rendered, sourceFile, mapIncluded) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$number1');
  expect(rendered.vars.global).to.have.property('$number2');
  expect(rendered.vars.global).to.have.property('$color');
  expect(rendered.vars.global).to.have.property('$list');
  expect(rendered.vars.global).to.have.property('$string');
  expect(rendered.vars.global).to.have.property('$boolean');
  expect(rendered.vars.global).to.have.property('$null');

  expect(rendered.vars.global.$number1.value).to.equal(100);
  expect(rendered.vars.global.$number1.unit).to.equal('px');
  expect(rendered.vars.global.$number1.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number1.sources).to.have.length(1);
  expect(rendered.vars.global.$number1.sources[0]).to.equal(sourceFile);
  expect(rendered.vars.global.$number1.expressions).to.have.length(1);
  expect(rendered.vars.global.$number1.expressions[0]).to.equal('100px');

  expect(rendered.vars.global.$number2.value).to.equal(200);
  expect(rendered.vars.global.$number2.unit).to.equal('px');
  expect(rendered.vars.global.$number2.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number2.sources).to.have.length(1);
  expect(rendered.vars.global.$number2.sources[0]).to.equal(sourceFile);
  expect(rendered.vars.global.$number2.expressions).to.have.length(1);
  expect(rendered.vars.global.$number2.expressions[0]).to.equal('$number1 * 2');

  expect(rendered.vars.global.$color.value.r).to.equal(255);
  expect(rendered.vars.global.$color.value.g).to.equal(0);
  expect(rendered.vars.global.$color.value.b).to.equal(0);
  expect(rendered.vars.global.$color.value.a).to.equal(1);
  expect(rendered.vars.global.$color.value.hex).to.equal('#ff0000');
  expect(rendered.vars.global.$color.type).to.equal('SassColor');
  expect(rendered.vars.global.$color.sources).to.have.length(1);
  expect(rendered.vars.global.$color.sources[0]).to.equal(sourceFile);
  expect(rendered.vars.global.$color.expressions).to.have.length(1);
  expect(rendered.vars.global.$color.expressions[0]).to.equal('red');

  expect(rendered.vars.global.$list.value).to.have.length(3);
  expect(rendered.vars.global.$list.type).to.equal('SassList');
  expect(rendered.vars.global.$list.sources).to.have.length(1);
  expect(rendered.vars.global.$list.sources[0]).to.equal(sourceFile);
  expect(rendered.vars.global.$list.expressions).to.have.length(1);
  expect(rendered.vars.global.$list.expressions[0]).to.equal('1px solid black');
  expect(rendered.vars.global.$list.value[0].value).to.equal(1);
  expect(rendered.vars.global.$list.value[0].unit).to.equal('px');
  expect(rendered.vars.global.$list.value[0].type).to.equal('SassNumber');
  expect(rendered.vars.global.$list.value[1].value).to.equal('solid');
  expect(rendered.vars.global.$list.value[1].type).to.equal('SassString');
  expect(rendered.vars.global.$list.value[2].value.r).to.equal(0);
  expect(rendered.vars.global.$list.value[2].value.g).to.equal(0);
  expect(rendered.vars.global.$list.value[2].value.b).to.equal(0);
  expect(rendered.vars.global.$list.value[2].value.a).to.equal(1);
  expect(rendered.vars.global.$list.value[2].value.hex).to.equal('#000000');
  expect(rendered.vars.global.$list.value[2].type).to.equal('SassColor');

  expect(rendered.vars.global.$string.value).to.equal('string');
  expect(rendered.vars.global.$string.type).to.equal('SassString');
  expect(rendered.vars.global.$string.sources).to.have.length(1);
  expect(rendered.vars.global.$string.sources[0]).to.equal(sourceFile);
  expect(rendered.vars.global.$string.expressions).to.have.length(1);
  expect(rendered.vars.global.$string.expressions[0]).to.equal('\'string\'');

  expect(rendered.vars.global.$boolean.value).to.equal(true);
  expect(rendered.vars.global.$boolean.type).to.equal('SassBoolean');
  expect(rendered.vars.global.$boolean.sources).to.have.length(1);
  expect(rendered.vars.global.$boolean.sources[0]).to.equal(sourceFile);
  expect(rendered.vars.global.$boolean.expressions).to.have.length(1);
  expect(rendered.vars.global.$boolean.expressions[0]).to.equal('true');

  expect(rendered.vars.global.$null.value).to.equal(null);
  expect(rendered.vars.global.$null.type).to.equal('SassNull');
  expect(rendered.vars.global.$null.sources).to.have.length(1);
  expect(rendered.vars.global.$null.sources[0]).to.equal(sourceFile);
  expect(rendered.vars.global.$null.expressions).to.have.length(1);
  expect(rendered.vars.global.$null.expressions[0]).to.equal('null');

  if(mapIncluded) {
    expect(rendered.vars.global.$map.type).to.equal('SassMap');
    expect(rendered.vars.global.$map.value.number.value).to.equal(2);
    expect(rendered.vars.global.$map.value.number.unit).to.equal('em');
    expect(rendered.vars.global.$map.value.number.type).to.equal('SassNumber');
    expect(rendered.vars.global.$map.value.string.value).to.equal('mapstring');
    expect(rendered.vars.global.$map.value.string.type).to.equal('SassString');
    expect(rendered.vars.global.$map.sources).to.have.length(1);
    expect(rendered.vars.global.$map.sources[0]).to.equal(sourceFile);
    expect(rendered.vars.global.$map.expressions).to.have.length(1);
    expect(rendered.vars.global.$map.expressions[0]).to.equal('(\n  number: 2em,\n  string: \'mapstring\'\n)');
  }
}

describe('basic-implicit', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: basicImplicitFile })
      verifyBasic(rendered, basicImplicitFile, true);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: basicImplicitFile })
      .then(rendered => {
        verifyBasic(rendered, basicImplicitFile, true);
      });
    });
  });
});

describe('basic-explicit', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: basicExplicitFile })
      verifyBasic(rendered, basicExplicitFile, false);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: basicExplicitFile })
      .then(rendered => {
        verifyBasic(rendered, basicExplicitFile, false);
      });
    });
  });
});

describe('basic-mixed', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: basicMixedFile })
      verifyBasic(rendered, basicMixedFile, true);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: basicMixedFile })
      .then(rendered => {
        verifyBasic(rendered, basicMixedFile, true);
      });
    });
  });
});