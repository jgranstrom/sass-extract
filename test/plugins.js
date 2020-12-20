const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const serializePlugin = require('../src/plugins/serialize');
const compactPlugin = require('../src/plugins/compact');
const minimalPlugin = require('../src/plugins/minimal');

function verifySerializedResult(rendered) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$number');
  expect(rendered.vars.global).to.have.property('$string');
  expect(rendered.vars.global).to.have.property('$border');
  expect(rendered.vars.global).to.have.property('$map');

  expect(rendered.vars.global.$number.value).to.equal('123px');
  expect(rendered.vars.global.$string.value).to.equal('string');
  expect(rendered.vars.global.$border.value).to.equal('1px solid black');
  expect(rendered.vars.global.$map.value).to.equal('(a (b c d) c: 1 (2 3 4) 5)');
}

function verifyCompactResult(rendered) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$number');
  expect(rendered.vars.global).to.have.property('$string');
  expect(rendered.vars.global).to.have.property('$border');
  expect(rendered.vars.global).to.have.property('$map');

  expect(rendered.vars.global.$number).to.equal(123);
  expect(rendered.vars.global.$string).to.equal('string');
  expect(rendered.vars.global.$border).to.deep.equal([
    1,
    'solid',
    { r: 0, g: 0, b: 0, a: 1, hex: '#000000' },
  ]);
  expect(rendered.vars.global.$map).to.deep.equal({ 'a (b c d) c': [1, [2, 3, 4], 5] });
}

function verifyMinimalResult(rendered) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$number');
  expect(rendered.vars.global).to.have.property('$string');
  expect(rendered.vars.global).to.have.property('$border');
  expect(rendered.vars.global).to.have.property('$map');

  expect(rendered.vars.global.$number).to.equal('123px');
  expect(rendered.vars.global.$string).to.equal('string');
  expect(rendered.vars.global.$border).to.equal('1px solid black');
  expect(rendered.vars.global.$map).to.equal('(a (b c d) c: 1 (2 3 4) 5)');
}

const pluginsFile = path.join(__dirname, 'sass', 'plugins.scss');

describe('plugins', () => {
  describe('serialize', () => {
    describe('sync', () => {
      it('should serialize extracted results', () => {
        const rendered = renderSync({ file: pluginsFile }, { plugins: [serializePlugin] });
        verifySerializedResult(rendered);
      });
    });

    describe('async', () => {
      it('should serialize extracted results', () => {
        return render({ file: pluginsFile }, { plugins: [serializePlugin] }).then((rendered) =>
          verifySerializedResult(rendered)
        );
      });
    });
  });

  describe('compact', () => {
    describe('sync', () => {
      it('should compact extracted results', () => {
        const rendered = renderSync({ file: pluginsFile }, { plugins: [compactPlugin] });
        verifyCompactResult(rendered);
      });
    });

    describe('async', () => {
      it('should compact extracted results', () => {
        return render({ file: pluginsFile }, { plugins: [compactPlugin] }).then((rendered) =>
          verifyCompactResult(rendered)
        );
      });
    });
  });

  describe('compact+serialize', () => {
    describe('sync', () => {
      it('should run both compact and serialize plugins on extracted results', () => {
        const rendered = renderSync({ file: pluginsFile }, { plugins: [minimalPlugin] });
        verifyMinimalResult(rendered);
      });
    });

    describe('async', () => {
      it('should run both compact and serialize plugins on extracted results', () => {
        return render({ file: pluginsFile }, { plugins: [minimalPlugin] }).then((rendered) =>
          verifyMinimalResult(rendered)
        );
      });
    });
  });

  describe('minimal', () => {
    describe('sync', () => {
      it('should combine serialize and compact to get minimal extracted results', () => {
        const rendered = renderSync({ file: pluginsFile }, { plugins: [minimalPlugin] });
        verifyMinimalResult(rendered);
      });
    });

    describe('async', () => {
      it('should combine serialize and compact to get minimal extracted results', () => {
        return render({ file: pluginsFile }, { plugins: [minimalPlugin] }).then((rendered) =>
          verifyMinimalResult(rendered)
        );
      });
    });
  });
});
