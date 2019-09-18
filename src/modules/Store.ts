import Emitter from "./Emitter";
import { deepMerge } from "helpers";
import { isArray } from "util";

/**
 * 模块定位：
 *  （1）存储： 存储全局数据，存储全局状态，存储自定义数据
 *  （2）通讯： 1、变动 通知 core  和 相关的插件；2、接受相关的修改行为
 */

interface Data_I {
  [key: string]: any;
}
interface StoreProps_I {
  emitter: Emitter;
  data?: Data_I;
}

class Store {
  private _emitter: Emitter;
  private _data: Data_I;

  constructor(public props: StoreProps_I) {
    const { data, emitter } = this.props;

    this._data = data || {};
    this._emitter = emitter;
  }

  /**
   * 设置store的值
   *
   * @author FreMaNgo
   * @date 2019-09-09
   * @param {string} key
   * @param {*} value
   * @memberof Store
   */
  set(data: Data_I) {
    this._data = deepMerge(this._data, data);
    this._update(data, this._data);
  }

  /**
   * 获取储存的值
   * 当传入的是array时，返回array内所有key对应的 key:value 对象集合
   * 当传入是string时，返回这个key对应的值
   *
   * @author FreMaNgo
   * @date 2019-09-09
   * @param {(string | string[])} key
   * @returns
   * @memberof Store
   */
  get(key: string | string[]) {
    if (isArray(key)) {
      const result: { [key: string]: any } = {};
      key.forEach(item => {
        result[item] = this.get(item);
      });

      return result;
    }

    return this._data[key];
  }

  /**
   * 广播更新
   *
   * @author FreMaNgo
   * @date 2019-09-09
   * @private
   * @param {{ [key: string]: any }} upgradeData 更新的内容
   * @param {Data_I} data 更新后的data
   * @memberof Store
   */
  private _update(upgradeData: Data_I, data: Data_I) {
    this._emitter.fire("update", [upgradeData, data], "_STORE_");
  }

  /**
   * 销毁储存的值
   *
   * @author FreMaNgo
   * @date 2019-09-09
   * @param {string} key
   * @memberof Store
   */
  destory(key: string) {
    delete this._data[key];
  }
}

export default Store;
