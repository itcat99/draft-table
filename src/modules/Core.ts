import { Config_I } from "../types/common.type";
import Emitter from "./Emitter";
import Plugins from "./Plugins";
import Plugin from "./Plugin";
import Err from "./Err";
import DEFAULT_PROPS from "../config";

/* inside Plugins */
import canvas from "../Plugins/Canvas";
import { Plugin_I } from "../types/plugin.type";

class Core {
  public COLLECTIONS: any;
  public STORE: any;
  public EMITTER: Emitter;
  public PLUGINS: Plugins;
  public ERR: Err;

  public events: Map<string, any>;
  public config: Config_I;
  public fn: any;

  /**
   * 初始化：emitter,plugins,collection,store,err
   * 注册全局监听
   * @author FreMaNgo
   * @date 2019-07-29
   * @param {Config_I} props
   * @memberof Core
   */
  constructor(props: Config_I) {
    this.EMITTER = new Emitter();
    this.PLUGINS = new Plugins(this.EMITTER);

    const InsidePlugins = { canvas };

    this.config = Object.assign({}, DEFAULT_PROPS, props);

    // this.listener();
    // this.registerPlugins();
    // this.initiailzed();
  }

  registerPlugins() {
    const { plugins } = this.config;

    for (const name of Object.keys(plugins)) {
      this.PLUGINS.register(name, plugins[name]);
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
      this.PLUGINS.register(name, plugins[name]);
    }

    const allPlugins = this.PLUGINS.getAll();
    for (const name of Object.keys(allPlugins)) {
      this.PLUGINS.run(name, {
        app: this,
        emitter: this.getOnwerEmitter(name),
        plugins: this.PLUGINS,
      });
    }
  }

  listener() {
    this.EMITTER.on("_PLUGINS_::registered", (name: string) => {
      this.fn[name] = this.PLUGINS.get(name);
    });
  }

  private getOnwerEmitter(name: string) {
    return {
      events: this.EMITTER.events,
      on: this.EMITTER.on.bind(this.EMITTER),
      once: this.EMITTER.once.bind(this.EMITTER),
      fire: (key: string, ...props: any[]) =>
        this.EMITTER.fire.call(this.EMITTER, `${name}::${key}`, ...props),
      del: this.EMITTER.del.bind(this.EMITTER),
      clear: this.EMITTER.clear.bind(this.EMITTER),
    };
  }

  registerPlugin(key: string, plugin: Plugin_I, auto: boolean) {
    this.PLUGINS.register(key, plugin);

    auto && this.PLUGINS.run(key);
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
    if (!key) return this.PLUGINS.getAll();
    return this.PLUGINS.get(key);
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
