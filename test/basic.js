const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');
const { EOL } = require('os');

const basicImplicitFile = path.join(__dirname, 'sass', 'basic-implicit.scss');
const basicExplicitFile = path.join(__dirname, 'sass', 'basic-explicit.scss');
const basicMixedFile = path.join(__dirname, 'sass', 'basic-mixed.scss');
const basicMixedFileWinLe = path.join(__dirname, 'sass', 'basic-mixed-win-le.scss');

function verifyBasic(rendered, sourceFile, explicit, mixed, expectedEol = EOL) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$number1');
  expect(rendered.vars.global).to.have.property('$number2');
  expect(rendered.vars.global).to.have.property('$color');
  expect(rendered.vars.global).to.have.property('$list');
  expect(rendered.vars.global).to.have.property('$listComma');
  expect(rendered.vars.global).to.have.property('$string');
  expect(rendered.vars.global).to.have.property('$boolean');
  expect(rendered.vars.global).to.have.property('$null');
  expect(rendered.vars.global).to.have.property('$map');

  expect(rendered.vars.global.$number1.value).to.equal(100);
  expect(rendered.vars.global.$number1.unit).to.equal('px');
  expect(rendered.vars.global.$number1.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number1.sources).to.have.length(1);
  expect(rendered.vars.global.$number1.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$number1.declarations).to.have.length(1);
  expect(rendered.vars.global.$number1.declarations[0].expression).to.equal(
    `100px${explicit || mixed ? ' !global' : ''}`
  );
  if (explicit || mixed) {
    expect(rendered.vars.global.$number1.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$number2.value).to.equal(200);
  expect(rendered.vars.global.$number2.unit).to.equal('px');
  expect(rendered.vars.global.$number2.type).to.equal('SassNumber');
  expect(rendered.vars.global.$number2.sources).to.have.length(1);
  expect(rendered.vars.global.$number2.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$number2.declarations).to.have.length(1);
  expect(rendered.vars.global.$number2.declarations[0].expression).to.equal(
    `$number1 * 2${explicit || mixed ? ' !global' : ''}`
  );
  if (explicit || mixed) {
    expect(rendered.vars.global.$number2.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$color.value.r).to.equal(255);
  expect(rendered.vars.global.$color.value.g).to.equal(0);
  expect(rendered.vars.global.$color.value.b).to.equal(0);
  expect(rendered.vars.global.$color.value.a).to.equal(1);
  expect(rendered.vars.global.$color.value.hex).to.equal('#ff0000');
  expect(rendered.vars.global.$color.type).to.equal('SassColor');
  expect(rendered.vars.global.$color.sources).to.have.length(1);
  expect(rendered.vars.global.$color.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$color.declarations).to.have.length(1);
  expect(rendered.vars.global.$color.declarations[0].expression).to.equal(
    `get-color()${explicit || mixed ? ' !global' : ''}`
  );
  if (explicit || mixed) {
    expect(rendered.vars.global.$color.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$list.value).to.have.length(3);
  expect(rendered.vars.global.$list.type).to.equal('SassList');
  expect(rendered.vars.global.$list.sources).to.have.length(1);
  expect(rendered.vars.global.$list.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$list.declarations).to.have.length(1);
  expect(rendered.vars.global.$list.declarations[0].expression).to.equal(
    `1px solid black${explicit ? ' !global' : ''}`
  );
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
  expect(rendered.vars.global.$list.separator).to.equal(' ');
  if (explicit) {
    expect(rendered.vars.global.$list.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$listComma.value).to.have.length(2);
  expect(rendered.vars.global.$listComma.type).to.equal('SassList');
  expect(rendered.vars.global.$listComma.sources).to.have.length(1);
  expect(rendered.vars.global.$listComma.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$listComma.declarations).to.have.length(1);
  expect(rendered.vars.global.$listComma.declarations[0].expression).to.equal(
    `tahoma, arial${explicit ? ' !global' : ''}`
  );
  expect(rendered.vars.global.$listComma.value[0].value).to.equal('tahoma');
  expect(rendered.vars.global.$listComma.value[0].type).to.equal('SassString');
  expect(rendered.vars.global.$listComma.value[1].value).to.equal('arial');
  expect(rendered.vars.global.$listComma.value[1].type).to.equal('SassString');
  expect(rendered.vars.global.$listComma.separator).to.equal(',');
  if (explicit) {
    expect(rendered.vars.global.$listComma.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$string.value).to.equal('string');
  expect(rendered.vars.global.$string.type).to.equal('SassString');
  expect(rendered.vars.global.$string.sources).to.have.length(1);
  expect(rendered.vars.global.$string.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$string.declarations).to.have.length(1);
  expect(rendered.vars.global.$string.declarations[0].expression).to.equal(
    `'string'${explicit ? ' !global' : ''}`
  );
  if (explicit) {
    expect(rendered.vars.global.$string.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$boolean.value).to.equal(true);
  expect(rendered.vars.global.$boolean.type).to.equal('SassBoolean');
  expect(rendered.vars.global.$boolean.sources).to.have.length(1);
  expect(rendered.vars.global.$boolean.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$boolean.declarations).to.have.length(1);
  expect(rendered.vars.global.$boolean.declarations[0].expression).to.equal(
    `true${explicit ? ' !global' : ''}`
  );
  if (explicit) {
    expect(rendered.vars.global.$boolean.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$null.value).to.equal(null);
  expect(rendered.vars.global.$null.type).to.equal('SassNull');
  expect(rendered.vars.global.$null.sources).to.have.length(1);
  expect(rendered.vars.global.$null.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$null.declarations).to.have.length(1);
  expect(rendered.vars.global.$null.declarations[0].expression).to.equal(
    `null${explicit ? ' !global' : ''}`
  );
  if (explicit) {
    expect(rendered.vars.global.$null.declarations[0].flags.global).to.equal(true);
  }

  expect(rendered.vars.global.$map.type).to.equal('SassMap');
  expect(rendered.vars.global.$map.value.number.value).to.equal(2);
  expect(rendered.vars.global.$map.value.number.unit).to.equal('em');
  expect(rendered.vars.global.$map.value.number.type).to.equal('SassNumber');
  expect(rendered.vars.global.$map.value.string.value).to.equal('mapstring');
  expect(rendered.vars.global.$map.value.string.type).to.equal('SassString');
  expect(rendered.vars.global.$map.sources).to.have.length(1);
  expect(rendered.vars.global.$map.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$map.declarations).to.have.length(1);
  expect(rendered.vars.global.$map.declarations[0].expression).to.be.oneOf([
    `(${expectedEol}  number: 2em,${expectedEol}  string: 'mapstring'${expectedEol})${
      explicit ? ' !global' : ''
    }`,
    `(\n  number: 2em,\n  string: 'mapstring'\n)${explicit ? ' !global' : ''}`,
  ]);
  if (explicit) {
    expect(rendered.vars.global.$map.declarations[0].flags.global).to.equal(true);
  }
}

describe('basic-implicit', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: basicImplicitFile });
      verifyBasic(rendered, basicImplicitFile, false, false);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: basicImplicitFile }).then((rendered) => {
        verifyBasic(rendered, basicImplicitFile, false, false);
      });
    });
  });
});

describe('basic-explicit', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: basicExplicitFile });
      verifyBasic(rendered, basicExplicitFile, true, false);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: basicExplicitFile }).then((rendered) => {
        verifyBasic(rendered, basicExplicitFile, true, false);
      });
    });
  });
});

describe('basic-mixed', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: basicMixedFile });
      verifyBasic(rendered, basicMixedFile, false, true);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: basicMixedFile }).then((rendered) => {
        verifyBasic(rendered, basicMixedFile, false, true);
      });
    });
  });
});

describe('basic-mixed-win-le', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: basicMixedFileWinLe });
      verifyBasic(rendered, basicMixedFileWinLe, false, true, '\r\n');
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: basicMixedFileWinLe }).then((rendered) => {
        verifyBasic(rendered, basicMixedFileWinLe, false, true, '\r\n');
      });
    });
  });
});
