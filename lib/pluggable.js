'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RESERVED_PLUGINS = {
  'compact': true,
  'minimal': true,
  'serialize': true,
  'filter': true
};

var Pluggable = exports.Pluggable = function () {
  _createClass(Pluggable, null, [{
    key: 'POST_EXTRACT',
    get: function get() {
      return 'postExtract';
    }
  }, {
    key: 'POST_VALUE',
    get: function get() {
      return 'postValue';
    }
  }, {
    key: 'STAGES',
    get: function get() {
      return [Pluggable.POST_EXTRACT, Pluggable.POST_VALUE];
    }
  }]);

  function Pluggable() {
    var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, Pluggable);

    this._plugins = plugins;
    this._stagePlugins = {};
  }

  _createClass(Pluggable, [{
    key: 'requirePlugin',
    value: function requirePlugin(plugin) {
      if (typeof plugin === 'string') {
        if (RESERVED_PLUGINS[plugin]) {
          return require('./plugins/' + plugin);
        } else {
          return require(plugin);
        }
      } else {
        return plugin;
      }
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      this._plugins.forEach(function (pluginDescription) {
        var plugin = pluginDescription.plugin ? pluginDescription.plugin : pluginDescription;
        var options = pluginDescription.options || {};

        var requiredPlugin = _this.requirePlugin(plugin);

        var pluginRun = requiredPlugin.run;

        if (typeof pluginRun !== 'function') {
          throw new Error('Plugins must provide a run function');
        }

        var pluginInstance = pluginRun(options);
        if (!pluginInstance) {
          throw new Error('Plugins must return a plugin interface from run function');
        }

        Pluggable.STAGES.forEach(function (stage) {
          if (typeof pluginInstance[stage] === 'function') {
            if (!_this._stagePlugins[stage]) {
              _this._stagePlugins[stage] = [];
            }

            _this._stagePlugins[stage].push(pluginInstance);
          }
        });
      });

      return this;
    }
  }, {
    key: 'run',
    value: function run(stage, data) {
      var stagePlugins = this._stagePlugins[stage] || [];

      return stagePlugins.reduce(function (nextData, pluginInstance) {
        return pluginInstance[stage](nextData);
      }, data);
    }
  }]);

  return Pluggable;
}();