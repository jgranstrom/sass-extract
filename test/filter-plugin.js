const { expect } = require('chai');
const path = require('path');
const { renderSync } = require('../src');

const PROPS_ALL = { $number1: true, $number2: true, $string: true, $list: true };
const PROPS_NONE = {};

function verifyFilteredResult(rendered, expectedProps) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');

  if (expectedProps.$number1) {
    expect(rendered.vars.global).to.have.property('$number1');
    expect(rendered.vars.global.$number1.value).to.equal(123);
  } else {
    expect(rendered.vars.global).to.not.have.property('$number1');
  }

  if (expectedProps.$number2) {
    expect(rendered.vars.global).to.have.property('$number2');
    expect(rendered.vars.global.$number2.value).to.equal(456);
  } else {
    expect(rendered.vars.global).to.not.have.property('$number2');
  }

  if (expectedProps.$string) {
    expect(rendered.vars.global).to.have.property('$string');
    expect(rendered.vars.global.$string.value).to.equal('string');
  } else {
    expect(rendered.vars.global).to.not.have.property('$string');
  }

  if (expectedProps.$list) {
    expect(rendered.vars.global).to.have.property('$list');
    expect(rendered.vars.global.$list.value).to.have.length(3);
    expect(rendered.vars.global.$list.value[0].value).to.equal(1);
    expect(rendered.vars.global.$list.value[1].value).to.equal(2);
    expect(rendered.vars.global.$list.value[2].value).to.equal(3);
  } else {
    expect(rendered.vars.global).to.not.have.property('$list');
  }
}

const filterPluginFile = path.join(__dirname, 'sass', 'filter-plugin.scss');

describe('filter-plugin', () => {
  describe('all', () => {
    it('should include all props', () => {
      const rendered = renderSync({ file: filterPluginFile }, { plugins: ['filter'] });
      verifyFilteredResult(rendered, PROPS_ALL);
    });
  });

  describe('prop', () => {
    it('should include all props', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { props: ['$number1', '$number2', '$string', '$list'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_ALL);
    });

    it('should include all props', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { props: [] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_ALL);
    });

    it('should include all props', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                except: { props: ['$blahblah'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_ALL);
    });

    it('should include $number1', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { props: ['$number1'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, { $number1: true });
    });

    it('should include $number2 and $list', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { props: ['$number2', '$list'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, { $number2: true, $list: true });
    });
  });

  describe('type', () => {
    it('should include all types', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { types: ['SassNumber', 'SassString', 'SassList'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_ALL);
    });

    it('should include all types', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { types: [] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_ALL);
    });

    it('should include all types', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                except: { types: ['SassNotThere'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_ALL);
    });

    it('should include numbers', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { types: ['SassNumber'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, { $number1: true, $number2: true });
    });

    it('should include list', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { types: ['SassList'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, { $list: true });
    });

    it('should include numbers and string', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: { types: ['SassNumber', 'SassString'] },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, { $number1: true, $number2: true, $string: true });
    });
  });

  describe('mix', () => {
    it('should include $number1', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: {
                  props: ['$number1'],
                  types: ['SassNumber'],
                },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, { $number1: true });
    });

    it('should include $number2', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: {
                  types: ['SassNumber'],
                },
                except: {
                  props: ['$number1'],
                },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, { $number2: true });
    });

    it('should include nothing', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: {
                  types: ['SassNumber'],
                },
                except: {
                  types: ['SassNumber'],
                },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_NONE);
    });

    it('should include nothing', () => {
      const rendered = renderSync(
        { file: filterPluginFile },
        {
          plugins: [
            {
              plugin: 'filter',
              options: {
                only: {
                  props: ['$number1'],
                },
                except: {
                  props: ['$number1'],
                },
              },
            },
          ],
        }
      );
      verifyFilteredResult(rendered, PROPS_NONE);
    });
  });
});
