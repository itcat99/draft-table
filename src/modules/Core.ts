// import Emitter from "./Emitter";
import Emitter from "./Emitter";
import Plugins from "./Plugins";
import Plugin from "./Plugin";
import Err from "./Err";

import DEFAULT_PROPS from "../config";
import { INTERNAL_PLUGIN_NAMESPACES } from "../constants";

/* internal Plugins */
import Canvas from "plugins/Canvas";
import Scrollbar from "plugins/Scrollbar";

/* types */
import { Config_I } from "types/common.type";
import { RegisterOptions_I, PluginCollection_I } from "types/plugins.type";
import { Callback_I } from "types/emitter.type";

class Core {
  public COLLECTIONS: any;
  public STORE: any;
  public EMITTER: Emitter;
  public PLUGINS: Plugins;
  public ERR: Err;

  public config: Config_I;
  public pluginInstances: {
    [namespace: string]: Plugin;
  };

  public canvas: Canvas;
  public scrollbar: Scrollbar;

  /**
   * 初始化：emitter,plugins,collection,store,err
   * 注册全局监听
   * @author FreMaNgo
   * @date 2019-07-29
   * @param {Config_I} props
   * @memberof Core
   */
  constructor(props: Config_I) {
    this.pluginInstances = {};

    // 内置模块
    const internalPlugins = {
      canvas: {
        class: Canvas,
        options: {
          namespace: "canvas",
          auto: true,
        },
      },
      scrollbar: {
        class: Scrollbar,
        options: {
          namespace: "scrollbar",
          auto: true,
        },
      },
    };

    let plugins = { ...internalPlugins };
    if (props && props.plugins) {
      this._checkPlugin(props.plugins);

      plugins = Object.assign({}, plugins, props.plugins);
    }
    // 全局配置信息
    this.config = Object.assign({}, DEFAULT_PROPS, props, {
      plugins,
    });

    // 初始化各个模块
    this.EMITTER = new Emitter();
    this.ERR = new Err();
    this.PLUGINS = new Plugins({
      err: this.ERR,
      core: this,
      emitter: this.EMITTER,
      config: this.config,
    });

    // 注册所有插件
    this._registerPlugins();
    // 运行自动执行的插件
    this._runAutoPlugins();

    // 将内置插件的实例绑定到Core上
    this._bindInsidePlugin();

    // 监听事件
    this._listener();
  }

  private _checkPlugin(plugins: PluginCollection_I) {
    for (let key of Object.keys(plugins)) {
      if (INTERNAL_PLUGIN_NAMESPACES.indexOf(key) < 0) {
        this.ERR.pop(
          `please checked register plugin's namespace, [${INTERNAL_PLUGIN_NAMESPACES}] list is not use.`,
        );
      }
    }
  }

  /**
   * 注册外部插件
   *
   * @author FreMaNgo
   * @date 2019-07-30
   * @param {string} name 插件名，如果没有设置options.namespace属性，插件名作为namespace
   * @param {typeof Plugin} plugin 插件类
   * @param {RegisterOptions_I} [options] 插件配置信息
   * @returns {Core} 返回Core的实例
   * @memberof Core
   */
  registerPlugin(name: string, plugin: typeof Plugin, options?: RegisterOptions_I): Core {
    this.PLUGINS.register(name, plugin, options);
    return this;
  }

  /**
   *
   *
   * @author FreMaNgo
   * @date 2019-07-30
   * @param {string} name 插件名
   * @param {*} options 插件的配置属性
   * @returns {Plugin} 返回插件的实例
   * @memberof Core
   */
  run(name: string, options: any): Plugin {
    const instance = this.PLUGINS.run(name, options);
    this.pluginInstances[name] = instance;

    return instance;
  }

  removeEvent(key: string, cb?: Function, target?: string) {
    this.EMITTER.del(key, cb, target);
    return this;
  }

  on(key: string, cb: Callback_I, target?: string) {
    this.EMITTER.on(key, cb, target);
    return this;
  }

  once(key: string, cb: Callback_I, target?: string) {
    this.EMITTER.once(key, cb, target);
    return this;
  }

  fire(key: string, props: any[], namespace?: string) {
    this.EMITTER.fire(key, props, namespace);
    return this;
  }

  private _bindInsidePlugin() {
    // canvas 插件
    this.canvas = <Canvas>this.PLUGINS.getInstance("canvas");
    this.scrollbar = <Scrollbar>this.PLUGINS.getInstance("scrollbar");
  }

  private _listener() {
    const el = this.canvas.el;

    el.addEventListener("wheel", e => {
      this.fire("wheel", [e]);
      e.preventDefault();
    });
    el.addEventListener("blur", e => {
      this.fire("blur", [e]);
    });
    el.addEventListener("focus", e => {
      this.fire("focus", [e]);
    });
    el.addEventListener("click", e => {
      this.fire("click", [e]);
    });
    el.addEventListener("dblclick", e => {
      this.fire("dbclick", [e]);
    });
    el.addEventListener("mousemove", e => {
      this.fire("mousemove", [e]);
    });
    el.addEventListener("mousedown", e => {
      this.fire("mousedown", [e]);
    });
    el.addEventListener("mouseup", e => {
      this.fire("mouseup", [e]);
    });
    el.addEventListener("keydown", e => {
      this.fire("keydown", [e]);
    });
    el.addEventListener("keyup", e => {
      this.fire("keyup", [e]);
    });
    el.addEventListener("keypress", e => {
      this.fire("keypress", [e]);
      e.preventDefault();
    });

    this.on(
      "changeViewOffset",
      result => {
        console.log("result: ", result);
      },
      "bar",
    );
  }

  private _registerPlugins() {
    const { plugins } = this.config;

    for (let key of Object.keys(plugins)) {
      const { class: plugin, options } = plugins[key];
      this.PLUGINS.register(key, plugin, options);
    }
  }

  private _runAutoPlugins() {
    const plugins = this.PLUGINS.getAll();

    for (let key of plugins.keys()) {
      const plugin = plugins.get(key);
      const { auto, autoProps } = plugin.options;
      if (auto) this.pluginInstances[key] = this.PLUGINS.run(key, autoProps);
    }
  }
}

export default Core;
