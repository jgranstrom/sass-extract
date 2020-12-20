const { expect } = require('chai');
const path = require('path');
const { renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const orderFile = path.join(__dirname, 'sass', 'order.scss');
const order1File = path.join(__dirname, 'sass', 'order', '1.scss');
const order2File = path.join(__dirname, 'sass', 'order', '2.scss');

function verifyOrder(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$var');
  expect(rendered.vars.global).to.have.property('$var2');

  expect(rendered.vars.global.$var.value).to.equal(2);
  expect(rendered.vars.global.$var.sources[0]).to.equal(normalizePath(order1File));
  expect(rendered.vars.global.$var.sources[1]).to.equal(normalizePath(order2File));
  expect(rendered.vars.global.$var.declarations).to.have.length(2);
  expect(rendered.vars.global.$var.declarations[0].in).to.equal(normalizePath(order1File));
  expect(rendered.vars.global.$var.declarations[1].in).to.equal(normalizePath(order2File));
  expect(rendered.vars.global.$var.declarations[0].expression).to.equal('1');
  expect(rendered.vars.global.$var.declarations[1].expression).to.equal('2');

  expect(rendered.vars.global.$var2.value).to.equal(3);
  expect(rendered.vars.global.$var2.sources[0]).to.equal(normalizePath(order1File));
  expect(rendered.vars.global.$var2.sources[1]).to.equal(normalizePath(order2File));
  expect(rendered.vars.global.$var2.sources[2]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$var2.declarations).to.have.length(3);
  expect(rendered.vars.global.$var2.declarations[0].in).to.equal(normalizePath(order1File));
  expect(rendered.vars.global.$var2.declarations[1].in).to.equal(normalizePath(order2File));
  expect(rendered.vars.global.$var2.declarations[2].in).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$var2.declarations[0].expression).to.equal('1');
  expect(rendered.vars.global.$var2.declarations[1].expression).to.equal('2');
  expect(rendered.vars.global.$var2.declarations[2].expression).to.equal('3');
}

describe('partial', () => {
  describe('sync', () => {
    it('should extract in the right order', () => {
      for (let i = 0; i < 20; i++) {
        const rendered = renderSync({ file: orderFile });
        verifyOrder(rendered, orderFile);
      }
    });
  });
});
