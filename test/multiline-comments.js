const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const multilineCommentFile = path.join(__dirname, 'sass', 'multiline-comments.scss');

function verifyComment(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$_colorGray');
  expect(rendered.vars.global).to.have.property('$_colorLightGray');
  expect(rendered.vars.global).to.have.property('$_colorButtonGray');
  expect(rendered.vars.global).to.have.property('$_colorRed');
  expect(rendered.vars.global).to.have.property('$colorStroke');

  expect(rendered.vars.global.$_colorGray.value.r).to.equal(102);
  expect(rendered.vars.global.$_colorGray.value.g).to.equal(102);
  expect(rendered.vars.global.$_colorGray.value.b).to.equal(102);
  expect(rendered.vars.global.$_colorGray.value.a).to.equal(1);
  expect(rendered.vars.global.$_colorGray.value.hex).to.equal('#666666');
  expect(rendered.vars.global.$_colorGray.type).to.equal('SassColor');
  expect(rendered.vars.global.$_colorGray.sources).to.have.length(1);
  expect(rendered.vars.global.$_colorGray.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$_colorGray.declarations).to.have.length(1);
  expect(rendered.vars.global.$_colorGray.declarations[0].expression).to.equal('#666');

  expect(rendered.vars.global.$_colorLightGray.value.r).to.equal(238);
  expect(rendered.vars.global.$_colorLightGray.value.g).to.equal(238);
  expect(rendered.vars.global.$_colorLightGray.value.b).to.equal(238);
  expect(rendered.vars.global.$_colorLightGray.value.a).to.equal(1);
  expect(rendered.vars.global.$_colorLightGray.value.hex).to.equal('#eeeeee');
  expect(rendered.vars.global.$_colorLightGray.type).to.equal('SassColor');
  expect(rendered.vars.global.$_colorLightGray.sources).to.have.length(1);
  expect(rendered.vars.global.$_colorLightGray.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$_colorLightGray.declarations).to.have.length(1);
  expect(rendered.vars.global.$_colorLightGray.declarations[0].expression).to.equal('#eee');

  expect(rendered.vars.global.$_colorButtonGray.value.r).to.equal(101);
  expect(rendered.vars.global.$_colorButtonGray.value.g).to.equal(102);
  expect(rendered.vars.global.$_colorButtonGray.value.b).to.equal(102);
  expect(rendered.vars.global.$_colorButtonGray.value.a).to.equal(1);
  expect(rendered.vars.global.$_colorButtonGray.value.hex).to.equal('#656666');
  expect(rendered.vars.global.$_colorButtonGray.type).to.equal('SassColor');
  expect(rendered.vars.global.$_colorButtonGray.sources).to.have.length(1);
  expect(rendered.vars.global.$_colorButtonGray.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$_colorButtonGray.declarations).to.have.length(1);
  expect(rendered.vars.global.$_colorButtonGray.declarations[0].expression).to.equal('#656666');

  expect(rendered.vars.global.$_colorRed.value.r).to.equal(231);
  expect(rendered.vars.global.$_colorRed.value.g).to.equal(67);
  expect(rendered.vars.global.$_colorRed.value.b).to.equal(39);
  expect(rendered.vars.global.$_colorRed.value.a).to.equal(1);
  expect(rendered.vars.global.$_colorRed.value.hex).to.equal('#e74327');
  expect(rendered.vars.global.$_colorRed.type).to.equal('SassColor');
  expect(rendered.vars.global.$_colorRed.sources).to.have.length(1);
  expect(rendered.vars.global.$_colorRed.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$_colorRed.declarations).to.have.length(1);
  expect(rendered.vars.global.$_colorRed.declarations[0].expression).to.equal('#E74327');

  expect(rendered.vars.global.$colorStroke.value.r).to.equal(222);
  expect(rendered.vars.global.$colorStroke.value.g).to.equal(218);
  expect(rendered.vars.global.$colorStroke.value.b).to.equal(218);
  expect(rendered.vars.global.$colorStroke.value.a).to.equal(1);
  expect(rendered.vars.global.$colorStroke.value.hex).to.equal('#dedada');
  expect(rendered.vars.global.$colorStroke.type).to.equal('SassColor');
  expect(rendered.vars.global.$colorStroke.sources).to.have.length(1);
  expect(rendered.vars.global.$colorStroke.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$colorStroke.declarations).to.have.length(1);
  expect(rendered.vars.global.$colorStroke.declarations[0].expression).to.equal('#DEDADA');
}

describe('comments', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: multilineCommentFile });
      verifyComment(rendered, multilineCommentFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: multilineCommentFile }).then((rendered) => {
        verifyComment(rendered, multilineCommentFile);
      });
    });
  });
});
