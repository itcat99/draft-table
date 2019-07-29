import { Config_I } from "../types/common.type";
import Emitter from "./Emitter";
import Plugins from "./Plugins";
import Config from "../config";

/* inside Plugins */
import canvas from "../Plugins/Canvas";
import { Plugin_I } from "../types/plugin.type";

class Core {
  public emitter: Emitter;
  public events: Map<string, any>;
  public plugins: Plugins;
  public config: Config_I;
  public fn: any;

  /**
   * 初始化：emitter,plugins,collection,store
   * 注册全局监听
   * @author FreMaNgo
   * @date 2019-07-29
   * @param {Config_I} props
   * @memberof Core
   */
  constructor(props: Config_I) {
    this.emitter = new Emitter();
    this.plugins = new Plugins(this.emitter);

    const InsidePlugins = { canvas };

    this.config = Object.assign({}, Config, props, {
      plugins: {
        ...InsidePlugins,
        ...props.plugins,
      },
    });

    this.listener();
    this.registerPlugins();
    this.initiailzed();
  }

  registerPlugins() {
    const { plugins } = this.config;

    for (const name of Object.keys(plugins)) {
      this.plugins.register(name, plugins[name]);
    }
  }

  runInsidePlugins() {}
  runOutsidePlugins() {}

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
        emitter: this.getOnwerEmitter(name),
        plugins: this.plugins,
      });
    }
  }

  listener() {
    this.emitter.on("_PLUGINS_::registered", (name: string) => {
      this.fn[name] = this.plugins.get(name);
    });
  }

  private getOnwerEmitter(name: string) {
    return {
      events: this.emitter.events,
      on: this.emitter.on.bind(this.emitter),
      once: this.emitter.once.bind(this.emitter),
      fire: (key: string, ...props: any[]) =>
        this.emitter.fire.call(this.emitter, `${name}::${key}`, ...props),
      del: this.emitter.del.bind(this.emitter),
      clear: this.emitter.clear.bind(this.emitter),
    };
  }

  registerPlugin(key: string, plugin: Plugin_I, auto: boolean) {
    this.plugins.register(key, plugin);

    auto && this.plugins.run(key);
  }

  /**
   * 获取插件实例
   *
   * @author FreMaNgo
   * @date 2019-07-26
   * @param {(string | undefined)} key
   * @returns
   * @memberof Core
   */
  getPlugin(key: string | undefined) {
    if (!key) return this.plugins.getAll();
    return this.plugins.get(key);
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
