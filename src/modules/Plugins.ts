import {
  Plugin_I,
  RegisterOptions_I,
  PluginsProps_I,
  PluginsClasses_Type,
  PluginsInstances_Type,
} from "../types/plugins.type";
import { Context_I } from "../types/common.type";

import Emitter from "./Emitter";
import Err from "./Err";
import Plugin from "./Plugin";

const DEFAULT_REGISTER_OPTS: RegisterOptions_I = {
  auto: false,
};

class Plugins {
  private _instances: PluginsInstances_Type;
  private _plugins: PluginsClasses_Type;
  private _err: Err;
  private _emitter: Emitter;
  private _context: Context_I;

  /**
   *Creates an instance of Plugins.
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {Emitter} props
   * @memberof Plugins
   */
  constructor(props: PluginsProps_I) {
    this._context = Object.assign({}, props, { plugins: this });

    this._emitter = this._context.emitter;
    this._err = this._context.err;

    this._instances = new Map();
    this._plugins = new Map();
  }

  /**
   * 注册插件
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} name 插件名，作为插件的namespace
   * @param {Plugin_I} fn 插件函数，插件的逻辑写在这里面
   * @memberof Plugins
   */
  register(name: string, plugin: typeof Plugin, options?: RegisterOptions_I) {
    if (this._plugins.has(name)) this._err.pop(`Has the same namespace Plugin : [${name}]`);

    const opts = Object.assign({}, DEFAULT_REGISTER_OPTS, options);

    this._plugins.set(name, {
      class: plugin,
      options: opts,
    });

    this._emitter.fire("register", [name]);
  }

  /**
   * 删除插件，请确保在删除之前处理好该插件所有的事务！
   *
   * @author FreMaNgo
   * @date 2019-07-26
   * @param {string} name 插件名称
   * @memberof Plugins
   */
  del(name: string) {
    this._plugins.delete(name);
    this._instances.delete(name);
    this._emitter.fire("delete", [name]);
  }

  /**
   * 获取指定插件的实例
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} name 插件名
   * @returns {Plugin_I}
   * @memberof Plugins
   */
  get(name: string): Plugin_I {
    return this._plugins.get(name);
  }

  /**
   * 获取所有插件
   * 返回已注册的所有插件的实例集合
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @returns {PluginsClasses_Type}
   * @memberof Plugins
   */
  getAll(): PluginsClasses_Type {
    return this._plugins;
  }

  /**
   *  执行指定插件
   *
   * @author FreMaNgo
   * @date 2019-07-29
   * @param {string} name 插件名
   * @param {object} props 传递给插件函数的参数对象
   * @returns {(Plugin | void)} 当前插件的实例
   * @memberof Plugins
   */
  run(name: string, props?: object): Plugin {
    const _plugin = this._plugins.get(name);

    if (_plugin) {
      const { class: _class, options } = _plugin;

      const instance = new _class(this._context, Object.assign({}, options, props));
      this._instances.set(name, instance);

      this._emitter.fire("run", [name]);
      return instance;
    }
  }

  /**
   * 按注册顺序执行所有插件
   *
   * @author FreMaNgo
   * @date 2019-07-29
   * @param {object} props 传递给插件函数的参数对象
   * @returns {(Plugin[] | void)} plugin的实例集合
   * @memberof Plugins
   */
  runAll(props?: object): PluginsInstances_Type {
    this._plugins.forEach((plugin, name) => {
      this.run(name, props);
    });

    return this._instances;
  }
}

export default Plugins;
