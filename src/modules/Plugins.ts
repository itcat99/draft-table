import { Plugin_I, Plugin_Collection_I, RegisterOptions_I } from "../types/plugin.type";
import Emitter from "./Emitter";
import Err from "./Err";
import Plugin from "./Plugin";

const DEFAULT_REGISTER_OPTS: RegisterOptions_I = {
  auto: false,
};

class Plugins {
  private _plugins: Map<string, Plugin_I>;
  private _err: Err;

  /**
   *Creates an instance of Plugins.
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {Emitter} emitter 事件处理模块
   * @memberof Plugins
   */
  constructor(public emitter: Emitter) {
    this._plugins = new Map();
    this._err = new Err();
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
  register(
    name: string,
    plugin: typeof Plugin,
    defaultProps?: object,
    options?: RegisterOptions_I,
  ) {
    if (this._plugins.has(name)) this._err.pop(`Has the same namespace Plugin : [${name}]`);

    const opts = Object.assign({}, DEFAULT_REGISTER_OPTS, options);

    this._plugins.set(name, {
      class: plugin,
      defaultProps,
      options: opts,
    });

    this.emitter.fire("registered", [name], "_PLUGINS_");
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
   * @returns {Plugin_Collection_I}
   * @memberof Plugins
   */
  getAll(): Plugin_Collection_I {
    const result: Plugin_Collection_I = {};

    this._plugins.forEach((plugin, key) => {
      result[key] = plugin;
    });

    return result;
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
  run(name: string, props: object): Plugin | void {
    const _plugin = this._plugins.get(name);

    if (_plugin) {
      const { defaultProps, class: _class } = _plugin;

      return new _class({}, Object.assign({}, defaultProps, props));
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
  runAll(props: object): Plugin[] | void {
    const instances = [];
    this._plugins.forEach((plugin, namespace) => {
      instances.push(this.run(namespace, props));
    });

    if (instances.length > 0) return instances;
  }
}

export default Plugins;
