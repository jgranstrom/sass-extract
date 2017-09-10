const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');
const { types } = require('node-sass');

const mapKeysFile = path.join(__dirname, 'sass', 'map-keys.scss');

function verifyMapKeys(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$map');

  expect(rendered.vars.global.$map.type).to.equal('SassMap');
  expect(rendered.vars.global.$map.value).to.deep.equal({
    string: { type: 'SassNumber', value: 1, unit: 'em' },
    '1px': { type: 'SassString', value: 'number' },
    white: { type: 'SassString', value: 'color-string' },
    '#123456': { type: 'SassString', value: 'color-hex' },
    'rgba(0,1,2,0.5)': { type: 'SassString', value: 'color-rgba' },
    black: { type: 'SassString', value: 'color-black-rgba' },
    true: { type: 'SassString', value: 'boolean' },
    null: { type: 'SassString', value: 'null' },
    '1 2 3': { type: 'SassString', value: 'list' },
    '(a: map)': { type: 'SassString', value: 'map' },
    '(b: nested) (c: maps)': { type: 'SassString', value: 'list-maps' },
    '(d: map)': { 
      type: 'SassMap',
      value: { 
        nested: { 
          type: 'SassMap',
          value: { 
            '1 2 3': { type: 'SassString', value: 'list' } 
          } 
        } 
      } 
    },
    '#807f7f': { type: 'SassString', value: 'darkened-white' },
    'somekey': { type: 'SassString', value: 'key-variable' },
  });
}

describe('map-keys', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: mapKeysFile });
      verifyMapKeys(rendered, mapKeysFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: mapKeysFile })
      .then(rendered => {
        verifyMapKeys(rendered, mapKeysFile);
      });
    });
  });
});
