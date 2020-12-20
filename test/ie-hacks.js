const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const ieHacksFile = path.join(__dirname, 'sass', 'ie-hacks.scss');

function verifyIeHacks(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$my');

  expect(rendered.vars.global.$my.type).to.equal('SassString');
  expect(rendered.vars.global.$my.sources).to.have.length(1);
  expect(rendered.vars.global.$my.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$my.declarations).to.have.length(1);
  expect(rendered.vars.global.$my.declarations[0].expression).to.equal(`'variable'`);
  expect(rendered.vars.global.$my.declarations[0].flags.global).to.equal(false);
  expect(rendered.vars.global.$my.declarations[0].flags.default).to.equal(false);
  expect(rendered.vars.global.$my.value).to.equal('variable');
}

describe('ie-hacks', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: ieHacksFile });
      verifyIeHacks(rendered, ieHacksFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: ieHacksFile }).then((rendered) => {
        verifyIeHacks(rendered, ieHacksFile);
      });
    });
  });
});
