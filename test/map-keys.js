const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');

const mapKeysFile = path.join(__dirname, 'sass', 'map-keys.scss');

function verifyMapKeys(rendered) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$map');

  expect(rendered.vars.global.$map.type).to.equal('SassMap');

  expect(rendered.vars.global.$map.value).to.have.property('string');
  expect(rendered.vars.global.$map.value).to.have.property('1px');
  expect(rendered.vars.global.$map.value).to.have.property('white');
  expect(rendered.vars.global.$map.value).to.have.property('#123456');
  expect(rendered.vars.global.$map.value).to.have.property('rgba(0,1,2,0.5)');
  expect(rendered.vars.global.$map.value).to.have.property('black');
  expect(rendered.vars.global.$map.value).to.have.property('true');
  expect(rendered.vars.global.$map.value).to.have.property('null');
  expect(rendered.vars.global.$map.value).to.have.property('1,2,3');
  expect(rendered.vars.global.$map.value).to.have.property('1 2 3 4');
  expect(rendered.vars.global.$map.value).to.have.property('(a: map)');
  expect(rendered.vars.global.$map.value).to.have.property('(b: nested),(c: maps)');
  expect(rendered.vars.global.$map.value).to.have.property('(d: map)');
  expect(rendered.vars.global.$map.value).to.have.property('#fcfcfc');
  expect(rendered.vars.global.$map.value).to.have.property('somekey');

  expect(rendered.vars.global.$map.value.string).to.deep.include({
    type: 'SassNumber',
    value: 1,
    unit: 'em',
  });
  expect(rendered.vars.global.$map.value['1px']).to.deep.include({
    type: 'SassString',
    value: 'number',
  });
  expect(rendered.vars.global.$map.value.white).to.deep.include({
    type: 'SassString',
    value: 'color-string',
  });
  expect(rendered.vars.global.$map.value['#123456']).to.deep.include({
    type: 'SassString',
    value: 'color-hex',
  });
  expect(rendered.vars.global.$map.value['rgba(0,1,2,0.5)']).to.deep.include({
    type: 'SassString',
    value: 'color-rgba',
  });
  expect(rendered.vars.global.$map.value.black).to.deep.include({
    type: 'SassString',
    value: 'color-black-rgba',
  });
  expect(rendered.vars.global.$map.value.true).to.deep.include({
    type: 'SassString',
    value: 'boolean',
  });
  expect(rendered.vars.global.$map.value.null).to.deep.include({
    type: 'SassString',
    value: 'null',
  });
  expect(rendered.vars.global.$map.value['1,2,3']).to.deep.include({
    type: 'SassString',
    value: 'list',
  });
  expect(rendered.vars.global.$map.value['1 2 3 4']).to.deep.include({
    type: 'SassString',
    value: 'list-spaces',
  });
  expect(rendered.vars.global.$map.value['(a: map)']).to.deep.include({
    type: 'SassString',
    value: 'map',
  });
  expect(rendered.vars.global.$map.value['(b: nested),(c: maps)']).to.deep.include({
    type: 'SassString',
    value: 'list-maps',
  });

  expect(rendered.vars.global.$map.value['(d: map)']).to.deep.include({
    type: 'SassMap',
  });
  expect(rendered.vars.global.$map.value['(d: map)'].value).to.have.property('nested');
  expect(rendered.vars.global.$map.value['(d: map)'].value.nested).to.deep.include({
    type: 'SassMap',
  });
  expect(rendered.vars.global.$map.value['(d: map)'].value.nested.value).to.have.property('1,2,3');
  expect(rendered.vars.global.$map.value['(d: map)'].value.nested.value['1,2,3']).to.deep.include({
    type: 'SassString',
    value: 'list',
  });
  expect(rendered.vars.global.$map.value['(d: map)'].value.nested.value).to.have.property(
    '1 2 3 4'
  );
  expect(rendered.vars.global.$map.value['(d: map)'].value.nested.value['1 2 3 4']).to.deep.include(
    {
      type: 'SassString',
      value: 'list-spaces',
    }
  );

  expect(rendered.vars.global.$map.value['#fcfcfc']).to.deep.include({
    type: 'SassString',
    value: 'darkened-white',
  });
  expect(rendered.vars.global.$map.value.somekey).to.deep.include({
    type: 'SassString',
    value: 'key-variable',
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
      return render({ file: mapKeysFile }).then((rendered) => {
        verifyMapKeys(rendered, mapKeysFile);
      });
    });
  });
});
