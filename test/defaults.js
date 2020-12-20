const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const defaultsFile = path.join(__dirname, 'sass', 'defaults.scss');

function verifyDefaults(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$variable');

  expect(rendered.vars.global.$variable.type).to.equal('SassNumber');
  expect(rendered.vars.global.$variable.sources).to.have.length(1);
  expect(rendered.vars.global.$variable.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$variable.declarations).to.have.length(4);
  expect(rendered.vars.global.$variable.declarations[0].expression).to.equal(`123px`);
  expect(rendered.vars.global.$variable.declarations[0].flags).to.deep.equal({
    global: false,
    default: false,
  });
  expect(rendered.vars.global.$variable.declarations[1].expression).to.equal(`456px !default`);
  expect(rendered.vars.global.$variable.declarations[1].flags).to.deep.equal({
    global: false,
    default: true,
  });
  expect(rendered.vars.global.$variable.declarations[2].expression).to.equal(`789px`);
  expect(rendered.vars.global.$variable.declarations[2].flags).to.deep.equal({
    global: false,
    default: false,
  });
  expect(rendered.vars.global.$variable.declarations[3].expression).to.equal(`100px !default`);
  expect(rendered.vars.global.$variable.declarations[3].flags).to.deep.equal({
    global: false,
    default: true,
  });

  expect(rendered.vars.global.$variable.value).to.equal(789);
  expect(rendered.vars.global.$variable.unit).to.equal('px');
}

describe('defaults', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: defaultsFile });
      verifyDefaults(rendered, defaultsFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: defaultsFile }).then((rendered) => {
        verifyDefaults(rendered, defaultsFile);
      });
    });
  });
});
