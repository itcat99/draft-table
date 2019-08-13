import Emitter from "./Emitter";

import { Context_I } from "types/common.type";
import { RenderingData_I, Data_I } from "types/collections.type";
import { Callback_I } from "types/emitter.type";

class Plugin {
  private _emitter: Emitter;
  public namespace: string;

  constructor(public context: Context_I, public options?: any) {
    this._emitter = this.context.emitter;
    this.namespace = this.options.namespace;

    this._listener();
  }

  protected _listener() {
    this.on("update", this.didUpdate, "_STORE_"); // 监听store变动
  }

  /**
   * 设置store内的值
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {*} data 更新的值
   * @param {string} target 目标节点
   * @memberof Plugin
   */
  setStore(data: any, target: string) {
    // this.store.set(data, target);
  }

  /**
   * 当全局Store被更新时触发
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {*} nextStore 新的store对象
   * @memberof Plugin
   */
  didUpdate(nextStore: any) {}

  /**
   * 最终绘制之前，最后一次可以修改绘制结果的函数
   *
   * 接受旧参数，返回新参数
   *
   * @author FreMaNgo
   * @date 2019-08-13
   * @param {Data_I} viewData 视图集合
   * @param {RenderingData_I} renderingData 渲染集合
   * @returns {RenderingData_I} 返回渲染集合
   * @memberof Plugin
   */
  beforeDraw(viewData: Data_I, renderingData: RenderingData_I): RenderingData_I {
    return renderingData;
  }

  getPlugin<T>(name: string): T | Plugin {
    return <T>this.context.plugins.getInstance(name);
  }

  removeEvent(key: string, cb: Function, target: string = this.namespace) {
    this._emitter.del(key, cb, target);
  }

  on(key: string, cb: Callback_I, target: string = this.namespace): Plugin {
    this._emitter.on(key, cb, target);

    return this;
  }

  once(key: string, cb: Callback_I, target: string = this.namespace): Plugin {
    this._emitter.once(key, cb, target);

    return this;
  }

  fire(key: string, props?: any[], namespace: string = this.namespace) {
    this._emitter.fire(key, props, namespace);
  }
}

export default Plugin;
