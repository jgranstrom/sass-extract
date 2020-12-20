const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const commentFile = path.join(__dirname, 'sass', 'comments.scss');

function verifyComment(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$number1');
  expect(rendered.vars.global).to.have.property('$number2');
  expect(rendered.vars.global).to.have.property('$color');
  expect(Object.keys(rendered.vars.global)).to.have.length(3);

  expect(rendered.vars.global.$number1.value).to.equal(100);
  expect(rendered.vars.global.$number1.unit).to.equal('px');
  expect(rendered.vars.global.$number1.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number1.sources).to.have.length(1);
  expect(rendered.vars.global.$number1.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$number1.declarations).to.have.length(1);
  expect(rendered.vars.global.$number1.declarations[0].expression).to.equal('100px');

  expect(rendered.vars.global.$number2.value).to.equal(200);
  expect(rendered.vars.global.$number2.unit).to.equal('px');
  expect(rendered.vars.global.$number2.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number2.sources).to.have.length(1);
  expect(rendered.vars.global.$number2.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$number2.declarations).to.have.length(1);
  expect(rendered.vars.global.$number2.declarations[0].expression).to.equal('$number1 * 2');

  expect(rendered.vars.global.$color.value.r).to.equal(255);
  expect(rendered.vars.global.$color.value.g).to.equal(0);
  expect(rendered.vars.global.$color.value.b).to.equal(0);
  expect(rendered.vars.global.$color.value.a).to.equal(1);
  expect(rendered.vars.global.$color.value.hex).to.equal('#ff0000');
  expect(rendered.vars.global.$color.type).to.equal('SassColor');
  expect(rendered.vars.global.$color.sources).to.have.length(1);
  expect(rendered.vars.global.$color.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$color.declarations).to.have.length(1);
  expect(rendered.vars.global.$color.declarations[0].expression).to.equal('red');
}

describe('comments', () => {
  describe('sync', () => {
    it('should extract variables not in comments', () => {
      const rendered = renderSync({ file: commentFile });
      verifyComment(rendered, commentFile);
    });
  });

  describe('async', () => {
    it('should extract variables not in comments', () => {
      return render({ file: commentFile }).then((rendered) => {
        verifyComment(rendered, commentFile);
      });
    });
  });
});
