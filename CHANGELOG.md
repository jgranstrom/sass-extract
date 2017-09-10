<a name="1.0.0"></a>
# 1.0.0 (2017-09-10)

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



