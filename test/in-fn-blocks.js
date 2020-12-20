const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const inFnBlocksFile = path.join(__dirname, 'sass', 'in-fn-blocks.scss');

function verifyInFnBlocks(rendered, sourceFile) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$mixin1');
  expect(rendered.vars.global).to.have.property('$mixin2');
  expect(rendered.vars.global).to.have.property('$mixin3');
  expect(rendered.vars.global).to.have.property('$function1');
  expect(rendered.vars.global).to.have.property('$function2');
  expect(rendered.vars.global).to.have.property('$function3');
  expect(rendered.vars.global).to.have.property('$someGlobalSetOnInvoke1');
  expect(rendered.vars.global).to.have.property('$someGlobalSetOnInvoke2');

  expect(rendered.vars.global.$mixin1.type).to.equal('SassString');
  expect(rendered.vars.global.$mixin1.sources).to.have.length(1);
  expect(rendered.vars.global.$mixin1.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$mixin1.declarations).to.have.length(1);
  expect(rendered.vars.global.$mixin1.declarations[0].expression).to.equal(
    `'m-variable-1' !global`
  );
  expect(rendered.vars.global.$mixin1.value).to.equal('m-variable-1');

  expect(rendered.vars.global.$mixin2.type).to.equal('SassString');
  expect(rendered.vars.global.$mixin2.sources).to.have.length(1);
  expect(rendered.vars.global.$mixin2.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$mixin2.declarations).to.have.length(1);
  expect(rendered.vars.global.$mixin2.declarations[0].expression).to.equal(
    `'m-variable-2' !global`
  );
  expect(rendered.vars.global.$mixin2.value).to.equal('m-variable-2');

  expect(rendered.vars.global.$mixin3.type).to.equal('SassString');
  expect(rendered.vars.global.$mixin3.sources).to.have.length(1);
  expect(rendered.vars.global.$mixin3.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$mixin3.declarations).to.have.length(1);
  expect(rendered.vars.global.$mixin3.declarations[0].expression).to.equal(`$someDefault !global`);
  expect(rendered.vars.global.$mixin3.value).to.equal('default-val');

  expect(rendered.vars.global.$function1.type).to.equal('SassString');
  expect(rendered.vars.global.$function1.sources).to.have.length(1);
  expect(rendered.vars.global.$function1.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$function1.declarations).to.have.length(1);
  expect(rendered.vars.global.$function1.declarations[0].expression).to.equal(
    `'fn-variable-1' !global`
  );
  expect(rendered.vars.global.$function1.value).to.equal('fn-variable-1');

  expect(rendered.vars.global.$function2.type).to.equal('SassString');
  expect(rendered.vars.global.$function2.sources).to.have.length(1);
  expect(rendered.vars.global.$function2.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$function2.declarations).to.have.length(1);
  expect(rendered.vars.global.$function2.declarations[0].expression).to.equal(
    `'fn-variable-2' !global`
  );
  expect(rendered.vars.global.$function2.value).to.equal('fn-variable-2');

  expect(rendered.vars.global.$function3.type).to.equal('SassString');
  expect(rendered.vars.global.$function3.sources).to.have.length(1);
  expect(rendered.vars.global.$function3.sources[0]).to.equal(normalizePath(sourceFile));
  expect(rendered.vars.global.$function3.declarations).to.have.length(1);
  expect(rendered.vars.global.$function3.declarations[0].expression).to.equal(`$param7 !global`);
  expect(rendered.vars.global.$function3.value).to.equal('provided-val');

  expect(rendered.vars.global.$someGlobalSetOnInvoke1.type).to.equal('SassString');
  expect(rendered.vars.global.$someGlobalSetOnInvoke1.sources).to.have.length(1);
  expect(rendered.vars.global.$someGlobalSetOnInvoke1.sources[0]).to.equal(
    normalizePath(sourceFile)
  );
  expect(rendered.vars.global.$someGlobalSetOnInvoke1.declarations).to.have.length(1);
  expect(rendered.vars.global.$someGlobalSetOnInvoke1.declarations[0].expression).to.equal(
    `$param !global`
  );
  expect(rendered.vars.global.$someGlobalSetOnInvoke1.value).to.equal('default');

  expect(rendered.vars.global.$someGlobalSetOnInvoke2.type).to.equal('SassString');
  expect(rendered.vars.global.$someGlobalSetOnInvoke2.sources).to.have.length(1);
  expect(rendered.vars.global.$someGlobalSetOnInvoke2.sources[0]).to.equal(
    normalizePath(sourceFile)
  );
  expect(rendered.vars.global.$someGlobalSetOnInvoke2.declarations).to.have.length(1);
  expect(rendered.vars.global.$someGlobalSetOnInvoke2.declarations[0].expression).to.equal(
    `$param !global`
  );
  expect(rendered.vars.global.$someGlobalSetOnInvoke2.value).to.equal('provided');
}

describe('in-fn-blocks', () => {
  describe('sync', () => {
    it('should extract all variables', () => {
      const rendered = renderSync({ file: inFnBlocksFile });
      verifyInFnBlocks(rendered, inFnBlocksFile);
    });
  });

  describe('async', () => {
    it('should extract all variables', () => {
      return render({ file: inFnBlocksFile }).then((rendered) => {
        verifyInFnBlocks(rendered, inFnBlocksFile);
      });
    });
  });
});
