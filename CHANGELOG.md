<a name="2.1.0"></a>
# 2.1.0 (2018-01-17)

* feat(importer): add support for custom importers ([fc919a0](https://github.com/jgranstrom/sass-extract/commit/fc919a0))
* docs(readme): add gitter badge ([88ea499](https://github.com/jgranstrom/sass-extract/commit/88ea499))



<a name="2.0.0"></a>
# 2.0.0 (2017-12-02)

* chore(editor): add editorconfig ([dc20a54](https://github.com/jgranstrom/sass-extract/commit/dc20a54))
* chore(package): remove package lock ([f046f82](https://github.com/jgranstrom/sass-extract/commit/f046f82))
* chore(release): 2.0.0 ([1f7cc43](https://github.com/jgranstrom/sass-extract/commit/1f7cc43))
* build(dep): upgrade chai@4 ([7f98676](https://github.com/jgranstrom/sass-extract/commit/7f98676))
* build(dep): upgrade cz-c-c@2.1 ([d561205](https://github.com/jgranstrom/sass-extract/commit/d561205))
* build(dep): upgrade mocha@4 ([88c3ed9](https://github.com/jgranstrom/sass-extract/commit/88c3ed9))
* build(package): remove node-sass as hard dependency ([1091bea](https://github.com/jgranstrom/sass-extract/commit/1091bea))
* feat(parse): replace scss-extract with gonzales-pe ([b1f26b5](https://github.com/jgranstrom/sass-extract/commit/b1f26b5)), closes [#18](https://github.com/jgranstrom/sass-extract/issues/18)
* feat(plugin): add plugin options support and a bundled filter plugin ([198a98a](https://github.com/jgranstrom/sass-extract/commit/198a98a))
* feat(process): modify processing order and dependent declarations injections to better handle dynami ([aedd820](https://github.com/jgranstrom/sass-extract/commit/aedd820))
* feat(serialize): generalize list separator and serialize lists with known separator ([0eb3443](https://github.com/jgranstrom/sass-extract/commit/0eb3443))
* feat(struct): add separator info to list ([2e44151](https://github.com/jgranstrom/sass-extract/commit/2e44151))
* test: add test for ie type hacks ([3f7498f](https://github.com/jgranstrom/sass-extract/commit/3f7498f))
* test: add tests against entire foundation-sites scss source tree ([d7a9594](https://github.com/jgranstrom/sass-extract/commit/d7a9594))
* test: add tests for variable arguments ([80d1924](https://github.com/jgranstrom/sass-extract/commit/80d1924))
* test(appveyor): retry npm install in test script ([bbd3a54](https://github.com/jgranstrom/sass-extract/commit/bbd3a54))
* test(function): add tests for combinations of functions with nested blocks, default values and overr ([0ff9893](https://github.com/jgranstrom/sass-extract/commit/0ff9893))
* test(mixin): add tests for combinations of mixins with default values and overrides ([2777abd](https://github.com/jgranstrom/sass-extract/commit/2777abd))
* test(win): add tests for windows line endings ([257db5f](https://github.com/jgranstrom/sass-extract/commit/257db5f))
* fix(dependencies): add missing scss-parser dependency ([c97153a](https://github.com/jgranstrom/sass-extract/commit/c97153a))
* fix(inject): remove implicit invocation of mixin and function dependencies ([ed90fbd](https://github.com/jgranstrom/sass-extract/commit/ed90fbd))
* fix(parse): fix declaration dependency parsing with gonzales-pe ([4bfa93c](https://github.com/jgranstrom/sass-extract/commit/4bfa93c))
* fix(parse): fix parsing flags and stringify ([64c7219](https://github.com/jgranstrom/sass-extract/commit/64c7219))
* refactor(deps): remove lodash from stringify ([bb8e560](https://github.com/jgranstrom/sass-extract/commit/bb8e560))
* Fix typo in code example ([e0531e5](https://github.com/jgranstrom/sass-extract/commit/e0531e5))



<a name="1.0.1"></a>
## 1.0.1 (2017-09-10)

* chore(release): 1.0.1 ([1eb9af1](https://github.com/jgranstrom/sass-extract/commit/1eb9af1))
* docs: update plugins doc ([1ce284a](https://github.com/jgranstrom/sass-extract/commit/1ce284a))
* feat(plugins): allow plugin to be applied by module name ([d755564](https://github.com/jgranstrom/sass-extract/commit/d755564))
* test: fix rounding issue across sass versions ([c1421de](https://github.com/jgranstrom/sass-extract/commit/c1421de))
* test: fix tested order of map test ([6f3a454](https://github.com/jgranstrom/sass-extract/commit/6f3a454))
* test: fix windows compat in order test ([9ead430](https://github.com/jgranstrom/sass-extract/commit/9ead430))



<a name="1.0.0"></a>
# 1.0.0 (2017-09-10)

* chore(release): 1.0.0 ([518411b](https://github.com/jgranstrom/sass-extract/commit/518411b))
* docs: add tests for mutliline comments ([0bb6fef](https://github.com/jgranstrom/sass-extract/commit/0bb6fef))
* docs: added docs for plugins ([62a1963](https://github.com/jgranstrom/sass-extract/commit/62a1963))
* feat(parse): add support for explicit global declarations within mixin and function blocks ([9780f13](https://github.com/jgranstrom/sass-extract/commit/9780f13))
* feat(parse): use AST for parsing declarations, removing usage of regex ([dfc9796](https://github.com/jgranstrom/sass-extract/commit/dfc9796))
* feat(plugins): add bundled plugins for alternative formatting ([b923f4d](https://github.com/jgranstrom/sass-extract/commit/b923f4d))
* feat(plugins): added basic plugin support ([a86528e](https://github.com/jgranstrom/sass-extract/commit/a86528e))
* feat(serialize): serialize map keys to support maps with arbitray key data types ([847d1bb](https://github.com/jgranstrom/sass-extract/commit/847d1bb))
* fix(extract): properly handle multiple overriding declarations in the same source file ([0216f20](https://github.com/jgranstrom/sass-extract/commit/0216f20))
* fix(serialize): serialize lists space separated without parenthesis unless nested ([5789815](https://github.com/jgranstrom/sass-extract/commit/5789815))
* fix(struct): make sure colors are properly rounded ([8cad631](https://github.com/jgranstrom/sass-extract/commit/8cad631))
* test: add previously failing sass examples mentioned in #12 ([b4551f3](https://github.com/jgranstrom/sass-extract/commit/b4551f3))
* test: add tests for default flag behavior ([223961f](https://github.com/jgranstrom/sass-extract/commit/223961f))


### BREAKING CHANGE

* the structure of returned declaration metadata has been changed, only affects the
previously available `expressions` field on extracted variables


<a name="0.5.3"></a>
## 0.5.3 (2017-08-15)

* chore: 0.5.3 ([bbf6694](https://github.com/jgranstrom/sass-extract/commit/bbf6694))
* fix(extract): fixes undefined ordering behavior on extraction ([bb0c34c](https://github.com/jgranstrom/sass-extract/commit/bb0c34c)), closes [#13](https://github.com/jgranstrom/sass-extract/issues/13)



<a name="0.5.2"></a>
## 0.5.2 (2017-07-20)

* chore: 0.5.2 ([023ca1b](https://github.com/jgranstrom/sass-extract/commit/023ca1b))
* docs: add appveyor badge ([72ae503](https://github.com/jgranstrom/sass-extract/commit/72ae503))
* ci: config type ([f1bad5c](https://github.com/jgranstrom/sass-extract/commit/f1bad5c))
* ci: globally install node-gyp ([a4cae31](https://github.com/jgranstrom/sass-extract/commit/a4cae31))
* ci: update version matrix ([60064ed](https://github.com/jgranstrom/sass-extract/commit/60064ed))
* test: add appveyor windows tests ([c21a9e9](https://github.com/jgranstrom/sass-extract/commit/c21a9e9))
* test: fix appveyor yaml ([2004cd5](https://github.com/jgranstrom/sass-extract/commit/2004cd5))
* test: supress npm warnings and update tested versions ([ee86a08](https://github.com/jgranstrom/sass-extract/commit/ee86a08))
* test(compat): ci compatibility fix ([89efb83](https://github.com/jgranstrom/sass-extract/commit/89efb83))
* fix(compat): fix window path resolution compatibility issues ([835f542](https://github.com/jgranstrom/sass-extract/commit/835f542))



<a name="0.5.1"></a>
## 0.5.1 (2017-07-17)

* chore: 0.5.1 ([a5d49e6](https://github.com/jgranstrom/sass-extract/commit/a5d49e6))
* fix(importer): fix @import of partials without leading underscore in url ([c1fce2b](https://github.com/jgranstrom/sass-extract/commit/c1fce2b)), closes [#9](https://github.com/jgranstrom/sass-extract/issues/9)
* fix(parse): reduce complexity of comments expression, prevent freeze ([f074c04](https://github.com/jgranstrom/sass-extract/commit/f074c04)), closes [#2](https://github.com/jgranstrom/sass-extract/issues/2)



<a name="0.5.0"></a>
# 0.5.0 (2017-07-14)

* chore: 0.5.0 ([277df0a](https://github.com/jgranstrom/sass-extract/commit/277df0a))
* docs(readme): fix badge ([3b70eb7](https://github.com/jgranstrom/sass-extract/commit/3b70eb7))
* fix(deps): node-sass peer dependency updated include all major 4 ([b8dbacb](https://github.com/jgranstrom/sass-extract/commit/b8dbacb))
* fix(importer): ensure relative included paths are normalized ([f2bc8b1](https://github.com/jgranstrom/sass-extract/commit/f2bc8b1))
* feat(extract): allow existing custom defined functions ([23090de](https://github.com/jgranstrom/sass-extract/commit/23090de))
* feat(importer): extend support for includePaths lookup in custom importer ([398659b](https://github.com/jgranstrom/sass-extract/commit/398659b))
* test: add udf to basic tests ([cc79568](https://github.com/jgranstrom/sass-extract/commit/cc79568))



<a name="0.4.0"></a>
# 0.4.0 (2017-03-31)

* chore: 0.4.0 ([98605ee](https://github.com/jgranstrom/sass-extract/commit/98605ee))
* chore: update changelog ([60a8ab8](https://github.com/jgranstrom/sass-extract/commit/60a8ab8))
* fix(extract): normalize paths from rendered stats ([65566ba](https://github.com/jgranstrom/sass-extract/commit/65566ba))
* fix(importer): path compatibility ([7e05980](https://github.com/jgranstrom/sass-extract/commit/7e05980))
* fix(parse): regex platform compatibility ([3c01dce](https://github.com/jgranstrom/sass-extract/commit/3c01dce))
* fix(test): normalize paths in tests ([9c3032d](https://github.com/jgranstrom/sass-extract/commit/9c3032d))
* docs: add repo to package.json ([d880120](https://github.com/jgranstrom/sass-extract/commit/d880120))



<a name="0.3.4"></a>
## 0.3.4 (2017-01-28)

* chore(release): 0.3.4 ([a6613cf](https://github.com/jgranstrom/sass-extract/commit/a6613cf))
* docs: added package description and keywords ([13937da](https://github.com/jgranstrom/sass-extract/commit/13937da))



<a name="0.3.3"></a>
## 0.3.3 (2017-01-28)

* chore(release): 0.3.3 ([8565afe](https://github.com/jgranstrom/sass-extract/commit/8565afe))
* docs(readme): add badges ([24dc6b8](https://github.com/jgranstrom/sass-extract/commit/24dc6b8))



<a name="0.3.2"></a>
## 0.3.2 (2017-01-28)

* chore(release): 0.3.2 ([1bd314b](https://github.com/jgranstrom/sass-extract/commit/1bd314b))
* build(do not include tests and ci config in package): ([29e5880](https://github.com/jgranstrom/sass-extract/commit/29e5880))
* build: narrow old version requirement on node-sass ([1462516](https://github.com/jgranstrom/sass-extract/commit/1462516))
* build(node-sass): update requirements on node-sass version ([76b5d36](https://github.com/jgranstrom/sass-extract/commit/76b5d36))
* ci: rename travis config ([afcef88](https://github.com/jgranstrom/sass-extract/commit/afcef88))
* ci: update ci tested node-sass versions ([11c6f7f](https://github.com/jgranstrom/sass-extract/commit/11c6f7f))



<a name="0.3.1"></a>
## 0.3.1 (2017-01-28)

* chore(release): 0.3.1 ([d4144d3](https://github.com/jgranstrom/sass-extract/commit/d4144d3))
* docs: add external assets for docs ([b68a293](https://github.com/jgranstrom/sass-extract/commit/b68a293))



<a name="0.3.0"></a>
# 0.3.0 (2017-01-27)

* chore: Npm ignore docs assets ([2279b6a](https://github.com/jgranstrom/sass-extract/commit/2279b6a))
* chore(project): Add license file ([613c702](https://github.com/jgranstrom/sass-extract/commit/613c702))
* chore(release): 0.3.0 ([0de5770](https://github.com/jgranstrom/sass-extract/commit/0de5770))
* docs(changelog): Added changelog automation ([5aec55d](https://github.com/jgranstrom/sass-extract/commit/5aec55d))
* docs(readme): Added commit and release guidelines ([386b5a6](https://github.com/jgranstrom/sass-extract/commit/386b5a6))
* docs(readme): Include demo gif in repo ([3128a4e](https://github.com/jgranstrom/sass-extract/commit/3128a4e))



<a name="0.2.0"></a>
# 0.2.0 (2017-01-27)

* 0.2.0 ([0982419](https://github.com/jgranstrom/sass-extract/commit/0982419))
* Add basic tests ([edcc898](https://github.com/jgranstrom/sass-extract/commit/edcc898))
* Add compile documentation ([76fd377](https://github.com/jgranstrom/sass-extract/commit/76fd377))
* Add explicit test ([a70de3c](https://github.com/jgranstrom/sass-extract/commit/a70de3c))
* Add mixed test ([73793b6](https://github.com/jgranstrom/sass-extract/commit/73793b6))
* Add support for comments ([c05685e](https://github.com/jgranstrom/sass-extract/commit/c05685e))
* Add tests for boolean and null types ([cd995f1](https://github.com/jgranstrom/sass-extract/commit/cd995f1))
* Add todo ([7a88879](https://github.com/jgranstrom/sass-extract/commit/7a88879))
* Add travis configuration ([d6cb10d](https://github.com/jgranstrom/sass-extract/commit/d6cb10d))
* Added read ([f7a5df3](https://github.com/jgranstrom/sass-extract/commit/f7a5df3))
* Added support for raw data rendering with imports ([51fe92c](https://github.com/jgranstrom/sass-extract/commit/51fe92c))
* Added tests for inline sass extraction ([08f4c4a](https://github.com/jgranstrom/sass-extract/commit/08f4c4a))
* Added variables to readme ([4557247](https://github.com/jgranstrom/sass-extract/commit/4557247))
* Change module name ([6bdb5b7](https://github.com/jgranstrom/sass-extract/commit/6bdb5b7))
* Change to import statements ([55e51d2](https://github.com/jgranstrom/sass-extract/commit/55e51d2))
* Cleanup ([36205c0](https://github.com/jgranstrom/sass-extract/commit/36205c0))
* Cleanup and comments for process and importer ([1d23ea8](https://github.com/jgranstrom/sass-extract/commit/1d23ea8))
* Cleanup render ([a909d43](https://github.com/jgranstrom/sass-extract/commit/a909d43))
* Fix extension and sync error handling ([f545999](https://github.com/jgranstrom/sass-extract/commit/f545999))
* Fix multiline parse ([ac782d2](https://github.com/jgranstrom/sass-extract/commit/ac782d2))
* Fix readme toc and highlighting ([80a290d](https://github.com/jgranstrom/sass-extract/commit/80a290d))
* Further refactoring of extract ([9f2e454](https://github.com/jgranstrom/sass-extract/commit/9f2e454))
* Include babel compilation for compatibility ([906f8a8](https://github.com/jgranstrom/sass-extract/commit/906f8a8))
* Include tests for nested files ([40c7882](https://github.com/jgranstrom/sass-extract/commit/40c7882))
* Increase node-sass min version ([f6ed728](https://github.com/jgranstrom/sass-extract/commit/f6ed728))
* Initial commit WIP ([ed5b7db](https://github.com/jgranstrom/sass-extract/commit/ed5b7db))
* Make node-sass a peer dependency ([b312fa6](https://github.com/jgranstrom/sass-extract/commit/b312fa6))
* Move files ([d4c9463](https://github.com/jgranstrom/sass-extract/commit/d4c9463))
* Move struct ([c78ffcf](https://github.com/jgranstrom/sass-extract/commit/c78ffcf))
* Refactor extract ([4157e92](https://github.com/jgranstrom/sass-extract/commit/4157e92))
* Refactor struct ([101b90d](https://github.com/jgranstrom/sass-extract/commit/101b90d))
* Refactor to add async API variant ([90c5797](https://github.com/jgranstrom/sass-extract/commit/90c5797))
* Refactored inject ([02e283d](https://github.com/jgranstrom/sass-extract/commit/02e283d))
* Refactoring of parser ([53156dd](https://github.com/jgranstrom/sass-extract/commit/53156dd))
* Remove anonymous exported functions ([3a16fb7](https://github.com/jgranstrom/sass-extract/commit/3a16fb7))
* Remove debug ([de9dbaa](https://github.com/jgranstrom/sass-extract/commit/de9dbaa))
* Remove debug files ([abd67a9](https://github.com/jgranstrom/sass-extract/commit/abd67a9))
* Remove todos ([8c31262](https://github.com/jgranstrom/sass-extract/commit/8c31262))
* Update demo link ([b50daad](https://github.com/jgranstrom/sass-extract/commit/b50daad))
* WIP extraction result aggregation ([648604e](https://github.com/jgranstrom/sass-extract/commit/648604e))



