const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const inlineData = `
  $number1: 123px;
  $number2: 2 * $number1;
  $color: red;
`;

const inlineNestedData = `
  @import './nested/inline.scss';

  $number2: 2 * $number1;
`;

const inlineNestedPath = path.join(__dirname, 'sass');
const inlineNested1File = path.join(__dirname, 'sass', 'nested', 'inline.scss');
const inlineNested2File = path.join(__dirname, 'sass', 'nested', 'inline2.scss');

function verifyInline(rendered, number1Source, number2Source, colorSource) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$number1');
  expect(rendered.vars.global).to.have.property('$number2');
  expect(rendered.vars.global).to.have.property('$color');

  expect(rendered.vars.global.$number1.value).to.equal(123);
  expect(rendered.vars.global.$number1.unit).to.equal('px');
  expect(rendered.vars.global.$number1.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number1.sources).to.have.length(1);
  expect(rendered.vars.global.$number1.sources[0]).to.equal(normalizePath(number1Source));
  expect(rendered.vars.global.$number1.declarations).to.have.length(1);
  expect(rendered.vars.global.$number1.declarations[0].expression).to.equal('123px');

  expect(rendered.vars.global.$number2.value).to.equal(246);
  expect(rendered.vars.global.$number2.unit).to.equal('px');
  expect(rendered.vars.global.$number2.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number2.sources).to.have.length(1);
  expect(rendered.vars.global.$number2.sources[0]).to.equal(normalizePath(number2Source));
  expect(rendered.vars.global.$number2.declarations).to.have.length(1);
  expect(rendered.vars.global.$number2.declarations[0].expression).to.equal('2 * $number1');

  expect(rendered.vars.global.$color.value.r).to.equal(255);
  expect(rendered.vars.global.$color.value.g).to.equal(0);
  expect(rendered.vars.global.$color.value.b).to.equal(0);
  expect(rendered.vars.global.$color.value.a).to.equal(1);
  expect(rendered.vars.global.$color.value.hex).to.equal('#ff0000');
  expect(rendered.vars.global.$color.type).to.equal('SassColor');
  expect(rendered.vars.global.$color.sources).to.have.length(1);
  expect(rendered.vars.global.$color.sources[0]).to.equal(normalizePath(colorSource));
  expect(rendered.vars.global.$color.declarations).to.have.length(1);
  expect(rendered.vars.global.$color.declarations[0].expression).to.equal('red');
}

describe('inline', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ data: inlineData });
      verifyInline(rendered, 'data', 'data', 'data');
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ data: inlineData }).then((rendered) => {
        verifyInline(rendered, 'data', 'data', 'data');
      });
    });
  });
});

describe('inline-nested', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ data: inlineNestedData, includePaths: [inlineNestedPath] });
      verifyInline(rendered, inlineNested1File, 'data', inlineNested2File);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ data: inlineNestedData, includePaths: [inlineNestedPath] }).then(
        (rendered) => {
          verifyInline(rendered, inlineNested1File, 'data', inlineNested2File);
        }
      );
    });
  });
});
