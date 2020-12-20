const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const partialFile = path.join(__dirname, 'sass', 'partial.scss');
const somePartialFile = path.join(__dirname, 'sass', '_somepartial.scss');

function verifyPartial(rendered, sourceFile, partialFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$color');
  expect(rendered.vars.global).to.have.property('$variable');

  expect(rendered.vars.global.$variable.value.hex).to.equal('#00ff00');
  expect(rendered.vars.global.$variable.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$color.value.hex).to.equal('#00ff00');
  expect(rendered.vars.global.$color.sources[0]).to.equal(normalizePath(partialFile));
}

describe('partial', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: partialFile });
      verifyPartial(rendered, partialFile, somePartialFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: partialFile }).then((rendered) => {
        verifyPartial(rendered, partialFile, somePartialFile);
      });
    });
  });
});
