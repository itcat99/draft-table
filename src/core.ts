import { Plugin_I } from "./types/plugin.type";
import { Config_I } from "./types/common.type";
import Emitter from "./modules/Emitter";
import Plugins from "./modules/Plugins";
import Config from "./config";

/* inside Plugins */
import canvas from "./Plugins/Canvas";

class Core {
  public emitter: Emitter;
  public events: Map<string, any>;
  public plugins: Plugins;
  public config: Config_I;

  constructor(props: Config_I) {
    this.emitter = new Emitter();
    this.plugins = new Plugins(this.emitter);
    this.config = Object.assign({}, Config, props, {
      plugins: {
        canvas,
        ...props.plugins,
      },
    });

    this.listener();
    this.initiailzed();
  }

  /**
   * 注册并按顺序运行所有插件
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @private
   * @memberof Core
   */
  private initiailzed() {
    const { plugins } = this.config;

    for (const name of Object.keys(plugins)) {
      this.plugins.register(name, plugins[name]);
    }

    const allPlugins = this.plugins.getAll();
    for (const name of Object.keys(allPlugins)) {
      this.plugins.run(name, {
        app: this,
        emitter: {
          events: this.emitter.events,
          on: this.emitter.on.bind(this.emitter),
          once: this.emitter.once.bind(this.emitter),
          fire: (key: string, ...props: any[]) =>
            this.emitter.fire.call(this.emitter, `${name}::${key}`, ...props),
          del: this.emitter.del.bind(this.emitter),
          clear: this.emitter.clear.bind(this.emitter),
        },
        plugins: this.plugins,
      });
    }
  }

  listener() {
    this.emitter.on("_PLUGINS_::registered", (name: string) => {
      console.log("registered Plugin name is: ", name);
    });
  }

  // private parseEventKey(key: string) {
  //   const keyVals = key.split(EVENT_LINK);

  //   let [namespace, eventname] = keyVals;
  //   if (!event) {
  //     eventname = namespace;
  //     namespace = EVENT_NAMESPACE_GLOBAL;
  //   }

  //   return {
  //     namespace,
  //     eventname,
  //   };
  // }
}

export default Core;
