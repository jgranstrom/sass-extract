const { expect } = require('chai');
const { getSassImplementation } = require('../src/util');

describe('getSassImplementation', () => {
  it('should use `node-sass` by default', () => {
    const implementation = getSassImplementation();

    expect(implementation.info.split('\t')[0]).to.equal('node-sass');
  });

  it('should use the given implementation, based on `extractOptions`', () => {
    const nodeSass = getSassImplementation({ implementation: require('node-sass') });
    const dartSass = getSassImplementation({ implementation: require('sass') });

    expect(nodeSass.info.split('\t')[0]).to.equal('node-sass');
    expect(dartSass.info.split('\t')[0]).to.equal('dart-sass');
  });

  it('should throw error if the given implementation is neither `node-sass`, nor `sass`', () => {
    expect(() => getSassImplementation({ implementation: require('path') })).to.throw(Error);
  });
});
