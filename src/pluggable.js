export class Pluggable {
  static get POST_EXTRACT() { return 'postExtract' };
  static get POST_VALUE() { return 'postValue' };

  static get STAGES() { 
    return [
      Pluggable.POST_EXTRACT,
      Pluggable.POST_VALUE,
    ]
  }

  constructor(plugins = []) {
    this._plugins = plugins;
    this._stagePlugins = {};
  }

  init() {
    this._plugins.forEach(plugin => {
      if(!plugin) {
        throw new Error('undefined plugin provided');
      }

      const pluginRun = plugin.run;

      if(typeof pluginRun !== 'function') {
        throw new Error('Plugins must provide a run function');
      }

      const pluginInstance = pluginRun();
      if(!pluginInstance) {
        throw new Error('Plugins must return a plugin interface from run function');
      }

      Pluggable.STAGES.forEach(stage => {
        if(typeof pluginInstance[stage] === 'function') {
          if(!this._stagePlugins[stage]) {
            this._stagePlugins[stage] = [];
          }

          this._stagePlugins[stage].push(pluginInstance);
        }
      });
    });

    return this;
  }

  run(stage, data) {
    const stagePlugins = this._stagePlugins[stage] || [];
    
    return stagePlugins.reduce((nextData, pluginInstace) => {
      return pluginInstace[stage](nextData);
    }, data);
  }
}