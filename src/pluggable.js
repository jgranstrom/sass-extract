const RESERVED_PLUGINS = {
  compact: true,
  minimal: true,
  serialize: true,
  filter: true,
};

export class Pluggable {
  static get POST_EXTRACT() {
    return 'postExtract';
  }
  static get POST_VALUE() {
    return 'postValue';
  }

  static get STAGES() {
    return [Pluggable.POST_EXTRACT, Pluggable.POST_VALUE];
  }

  constructor(plugins = []) {
    this._plugins = plugins;
    this._stagePlugins = {};
  }

  requirePlugin(plugin) {
    if (typeof plugin === 'string') {
      if (RESERVED_PLUGINS[plugin]) {
        return require(`./plugins/${plugin}`);
      } else {
        return require(plugin);
      }
    } else {
      return plugin;
    }
  }

  init() {
    this._plugins.forEach((pluginDescription) => {
      const plugin = pluginDescription.plugin ? pluginDescription.plugin : pluginDescription;
      const options = pluginDescription.options || {};

      const requiredPlugin = this.requirePlugin(plugin);

      const pluginRun = requiredPlugin.run;

      if (typeof pluginRun !== 'function') {
        throw new Error('Plugins must provide a run function');
      }

      const pluginInstance = pluginRun(options);
      if (!pluginInstance) {
        throw new Error('Plugins must return a plugin interface from run function');
      }

      Pluggable.STAGES.forEach((stage) => {
        if (typeof pluginInstance[stage] === 'function') {
          if (!this._stagePlugins[stage]) {
            this._stagePlugins[stage] = [];
          }

          this._stagePlugins[stage].push(pluginInstance);
        }
      });
    });

    return this;
  }

  run(stage, data) {
    const stagePlugins = this._stagePlugins[stage] || [];

    return stagePlugins.reduce((nextData, pluginInstance) => {
      return pluginInstance[stage](nextData);
    }, data);
  }
}
