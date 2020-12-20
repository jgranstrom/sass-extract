const { expect } = require('chai');
const path = require('path');
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const includeRootFile = path.join(__dirname, 'sass', 'include', 'root.scss');
const includeRoot2File = path.join(__dirname, 'sass', 'include', 'root2.scss');
const includeRoot3File = path.join(__dirname, 'sass', 'include', 'root3.scss');
const includeRoot4File = path.join(__dirname, 'sass', 'include', 'root4.scss');
const includeSubFile = path.join(__dirname, 'sass', 'include', 'sub', 'included.scss');
const includeSubFile2 = path.join(__dirname, 'sass', 'include', 'sub', 'included2.scss');
const includeSubDir = path.join(__dirname, 'sass', 'include', 'sub');
const includeSubConflictDir = path.join(__dirname, 'sass', 'include', 'sub-conflict');
const includeSubConflictFile = path.join(
  __dirname,
  'sass',
  'include',
  'sub-conflict',
  'included.scss'
);
const includeSubConflictFile2 = path.join(
  __dirname,
  'sass',
  'include',
  'sub-conflict',
  'included2.scss'
);
const relativeIncludeSubDir = path.join('./test/sass/include/sub');

const SUB_INCLUDED_COLOR = '#0000ff';
const SUB_INCLUDED2_COLOR = '#000000';
const SUB_CONFLICT_INCLUDED_COLOR = '#008000';
const SUB_CONFLICT_INCLUDED2_COLOR = '#ffffff';

function verifyFunctions(
  rendered,
  sourceFile,
  includedColor,
  separateColor,
  includedFile,
  included2File
) {
  expect(rendered.vars).to.exist;
  expect(rendered.vars).to.have.property('global');
  expect(rendered.vars.global).to.have.property('$color');
  expect(rendered.vars.global).to.have.property('$includedColor');
  expect(rendered.vars.global).to.have.property('$separateColor');

  expect(rendered.vars.global.$color.type).to.equal('SassColor');
  expect(rendered.vars.global.$color.value.hex).to.equal(includedColor);
  expect(rendered.vars.global.$color.sources).to.have.length(1);
  expect(rendered.vars.global.$color.sources[0]).to.equal(normalizePath(sourceFile));

  expect(rendered.vars.global.$includedColor.type).to.equal('SassColor');
  expect(rendered.vars.global.$includedColor.value.hex).to.equal(includedColor);
  expect(rendered.vars.global.$includedColor.sources).to.have.length(1);
  expect(rendered.vars.global.$includedColor.sources[0]).to.equal(normalizePath(includedFile));

  expect(rendered.vars.global.$separateColor.type).to.equal('SassColor');
  expect(rendered.vars.global.$separateColor.value.hex).to.equal(separateColor);
  expect(rendered.vars.global.$separateColor.sources).to.have.length(1);
  expect(rendered.vars.global.$separateColor.sources[0]).to.equal(normalizePath(included2File));
}

describe('include', () => {
  describe('sub only', () => {
    describe('root1', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({ file: includeRootFile, includePaths: [includeSubDir] });
          verifyFunctions(
            rendered,
            includeRootFile,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({ file: includeRootFile, includePaths: [includeSubDir] }).then(
            (rendered) => {
              verifyFunctions(
                rendered,
                includeRootFile,
                SUB_INCLUDED_COLOR,
                SUB_INCLUDED2_COLOR,
                includeSubFile,
                includeSubFile2
              );
            }
          );
        });
      });
    });

    describe('root2', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({ file: includeRoot2File, includePaths: [includeSubDir] });
          verifyFunctions(
            rendered,
            includeRoot2File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({ file: includeRoot2File, includePaths: [includeSubDir] }).then(
            (rendered) => {
              verifyFunctions(
                rendered,
                includeRoot2File,
                SUB_INCLUDED_COLOR,
                SUB_INCLUDED2_COLOR,
                includeSubFile,
                includeSubFile2
              );
            }
          );
        });
      });
    });

    describe('root3', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({ file: includeRoot3File, includePaths: [includeSubDir] });
          verifyFunctions(
            rendered,
            includeRoot3File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({ file: includeRoot3File, includePaths: [includeSubDir] }).then(
            (rendered) => {
              verifyFunctions(
                rendered,
                includeRoot3File,
                SUB_INCLUDED_COLOR,
                SUB_INCLUDED2_COLOR,
                includeSubFile,
                includeSubFile2
              );
            }
          );
        });
      });
    });
  });

  describe('sub, conflict', () => {
    describe('root1', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRootFile,
            includePaths: [includeSubDir, includeSubConflictDir],
          });
          verifyFunctions(
            rendered,
            includeRootFile,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({
            file: includeRootFile,
            includePaths: [includeSubDir, includeSubConflictDir],
          }).then((rendered) => {
            verifyFunctions(
              rendered,
              includeRootFile,
              SUB_INCLUDED_COLOR,
              SUB_INCLUDED2_COLOR,
              includeSubFile,
              includeSubFile2
            );
          });
        });
      });
    });

    describe('root2', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRoot2File,
            includePaths: [includeSubDir, includeSubConflictDir],
          });
          verifyFunctions(
            rendered,
            includeRoot2File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({
            file: includeRoot2File,
            includePaths: [includeSubDir, includeSubConflictDir],
          }).then((rendered) => {
            verifyFunctions(
              rendered,
              includeRoot2File,
              SUB_INCLUDED_COLOR,
              SUB_INCLUDED2_COLOR,
              includeSubFile,
              includeSubFile2
            );
          });
        });
      });
    });

    describe('root3', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRoot3File,
            includePaths: [includeSubDir, includeSubConflictDir],
          });
          verifyFunctions(
            rendered,
            includeRoot3File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({
            file: includeRoot3File,
            includePaths: [includeSubDir, includeSubConflictDir],
          }).then((rendered) => {
            verifyFunctions(
              rendered,
              includeRoot3File,
              SUB_INCLUDED_COLOR,
              SUB_INCLUDED2_COLOR,
              includeSubFile,
              includeSubFile2
            );
          });
        });
      });
    });
  });

  describe('conflict, sub', () => {
    describe('root1', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRootFile,
            includePaths: [includeSubConflictDir, includeSubDir],
          });
          verifyFunctions(
            rendered,
            includeRootFile,
            SUB_CONFLICT_INCLUDED_COLOR,
            SUB_CONFLICT_INCLUDED2_COLOR,
            includeSubConflictFile,
            includeSubConflictFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({
            file: includeRootFile,
            includePaths: [includeSubConflictDir, includeSubDir],
          }).then((rendered) => {
            verifyFunctions(
              rendered,
              includeRootFile,
              SUB_CONFLICT_INCLUDED_COLOR,
              SUB_CONFLICT_INCLUDED2_COLOR,
              includeSubConflictFile,
              includeSubConflictFile2
            );
          });
        });
      });
    });

    describe('root2', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRoot2File,
            includePaths: [includeSubConflictDir, includeSubDir],
          });
          verifyFunctions(
            rendered,
            includeRoot2File,
            SUB_CONFLICT_INCLUDED_COLOR,
            SUB_CONFLICT_INCLUDED2_COLOR,
            includeSubConflictFile,
            includeSubConflictFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({
            file: includeRoot2File,
            includePaths: [includeSubConflictDir, includeSubDir],
          }).then((rendered) => {
            verifyFunctions(
              rendered,
              includeRoot2File,
              SUB_CONFLICT_INCLUDED_COLOR,
              SUB_CONFLICT_INCLUDED2_COLOR,
              includeSubConflictFile,
              includeSubConflictFile2
            );
          });
        });
      });
    });

    describe('root3', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRoot3File,
            includePaths: [includeSubConflictDir, includeSubDir],
          });
          verifyFunctions(
            rendered,
            includeRoot3File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({
            file: includeRoot3File,
            includePaths: [includeSubConflictDir, includeSubDir],
          }).then((rendered) => {
            verifyFunctions(
              rendered,
              includeRoot3File,
              SUB_INCLUDED_COLOR,
              SUB_INCLUDED2_COLOR,
              includeSubFile,
              includeSubFile2
            );
          });
        });
      });
    });
  });

  describe('relative include path', () => {
    describe('root1', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRootFile,
            includePaths: [relativeIncludeSubDir],
          });
          verifyFunctions(
            rendered,
            includeRootFile,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({ file: includeRootFile, includePaths: [relativeIncludeSubDir] }).then(
            (rendered) => {
              verifyFunctions(
                rendered,
                includeRootFile,
                SUB_INCLUDED_COLOR,
                SUB_INCLUDED2_COLOR,
                includeSubFile,
                includeSubFile2
              );
            }
          );
        });
      });
    });

    describe('root2', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRoot2File,
            includePaths: [relativeIncludeSubDir],
          });
          verifyFunctions(
            rendered,
            includeRoot2File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({ file: includeRoot2File, includePaths: [relativeIncludeSubDir] }).then(
            (rendered) => {
              verifyFunctions(
                rendered,
                includeRoot2File,
                SUB_INCLUDED_COLOR,
                SUB_INCLUDED2_COLOR,
                includeSubFile,
                includeSubFile2
              );
            }
          );
        });
      });
    });

    describe('root3', () => {
      describe('sync', () => {
        it('should extract all variables', () => {
          const rendered = renderSync({
            file: includeRoot3File,
            includePaths: [relativeIncludeSubDir],
          });
          verifyFunctions(
            rendered,
            includeRoot3File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });

      describe('async', () => {
        it('should extract all variables', () => {
          return render({ file: includeRoot3File, includePaths: [relativeIncludeSubDir] }).then(
            (rendered) => {
              verifyFunctions(
                rendered,
                includeRoot3File,
                SUB_INCLUDED_COLOR,
                SUB_INCLUDED2_COLOR,
                includeSubFile,
                includeSubFile2
              );
            }
          );
        });
      });
    });
  });

  describe('custom importer', () => {
    const getNewUrl = (url) => (url === 'foo' ? './included.scss' : url);

    describe('sync', () => {
      it('should extract all variables', () => {
        const rendered = renderSync({
          file: includeRoot4File,
          includePaths: [includeSubDir],
          importer: (url) => ({ file: getNewUrl(url) }),
        });
        verifyFunctions(
          rendered,
          includeRoot4File,
          SUB_INCLUDED_COLOR,
          SUB_INCLUDED2_COLOR,
          includeSubFile,
          includeSubFile2
        );
      });
    });

    describe('async', () => {
      it('should extract all variables', () => {
        return render({
          file: includeRoot4File,
          includePaths: [includeSubDir],
          importer: (url, prev, done) => {
            done({ file: getNewUrl(url) });
          },
        }).then((rendered) => {
          verifyFunctions(
            rendered,
            includeRoot4File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });
    });
  });

  describe('array of custom importers', () => {
    const getNewUrl = (url) => (url === 'foo' ? './included.scss' : url);

    describe('sync', () => {
      it('should extract all variables', () => {
        const rendered = renderSync({
          file: includeRoot4File,
          includePaths: [includeSubDir],
          importer: [() => null, (url) => ({ file: getNewUrl(url) })],
        });
        verifyFunctions(
          rendered,
          includeRoot4File,
          SUB_INCLUDED_COLOR,
          SUB_INCLUDED2_COLOR,
          includeSubFile,
          includeSubFile2
        );
      });
    });

    describe('async', () => {
      it('should extract all variables', () => {
        return render({
          file: includeRoot4File,
          includePaths: [includeSubDir],
          importer: [
            (url, prev, done) => {
              done(null);
            },
            (url, prev, done) => {
              done({ file: getNewUrl(url) });
            },
          ],
        }).then((rendered) => {
          verifyFunctions(
            rendered,
            includeRoot4File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });
    });
  });

  describe('absolute include path', () => {
    const getNewUrl = (url) =>
      url === 'foo' ? path.join(__dirname, 'sass', 'include', 'sub', 'included.scss') : url;

    describe('sync', () => {
      it('should extract all variables', () => {
        const rendered = renderSync({
          file: includeRoot4File,
          importer: (url) => ({ file: getNewUrl(url) }),
        });
        verifyFunctions(
          rendered,
          includeRoot4File,
          SUB_INCLUDED_COLOR,
          SUB_INCLUDED2_COLOR,
          includeSubFile,
          includeSubFile2
        );
      });
    });

    describe('async', () => {
      it('should extract all variables', () => {
        return render({
          file: includeRoot4File,
          importer: (url, prev, done) => {
            done({ file: getNewUrl(url) });
          },
        }).then((rendered) => {
          verifyFunctions(
            rendered,
            includeRoot4File,
            SUB_INCLUDED_COLOR,
            SUB_INCLUDED2_COLOR,
            includeSubFile,
            includeSubFile2
          );
        });
      });
    });
  });
});
