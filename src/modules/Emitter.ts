import { Emitters_I, EventTypes_Enum, Event_I } from "types/emitter.type";

class Emitter {
  private _emitters: Emitters_I;

  constructor() {
    this._emitters = {};
  }

  /**
   * 注册事件监听
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @param {string} key 事件名称
   * @param {Function} cb 回调函数
   * @param {string} [namespace] 目标命名空间
   * @memberof Emitter
   */
  on(key: string, cb: Function, namespace?: string) {
    this._registerEvent(EventTypes_Enum.ON, key, cb, namespace);
  }

  /**
   * 注册事件监听，只执行一次
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @param {string} key 事件名称
   * @param {Function} cb 回调函数
   * @param {string} [namespace] 目标命名空间
   * @memberof Emitter
   */
  once(key: string, cb: Function, namespace?: string) {
    this._registerEvent(EventTypes_Enum.ONCE, key, cb, namespace);
  }

  /**
   * 注册事件监听
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @private
   * @param {EventTypes_Enum} type 事件类型
   * @param {string} key
   * @param {Function} cb
   * @param {string} [namespace="_GLOBAL_"]
   * @memberof Emitter
   */
  private _registerEvent(
    type: EventTypes_Enum,
    key: string,
    cb: Function,
    namespace: string = "_GLOBAL_",
  ) {
    const collection = this._emitters[namespace];
    const event = {
      type,
      cb,
    };

    if (collection) {
      const events = collection[key];
      if (events) {
        events.push(event);
      } else {
        collection[key] = [event];
      }
    } else {
      this._emitters[namespace] = {
        [key]: [event],
      };
    }
  }

  /**
   * 搜索目标events
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @private
   * @param {string} key 事件名称
   * @param {string} [namespace="_GLOBAL_"]
   * @returns {Event_I[]}
   * @memberof Emitter
   */
  private _search(key: string, namespace: string = "_GLOBAL_"): Event_I[] {
    const collection = this._emitters[namespace];
    if (collection) {
      const events = collection[key];
      if (events) return events;
    }
  }

  /**
   * 触发事件
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @param {string} key 事件名称
   * @param {any[]} [args=[]] 回调函数传入的参数
   * @param {string} [namespace="_GLOBAL_"]
   * @memberof Emitter
   */
  fire(key: string, args: any[] = [], namespace: string = "_GLOBAL_") {
    let events = this._search(key, namespace);
    if (events) {
      events = events.filter(event => {
        const { type, cb } = event;
        cb && cb(...args);

        if (type === EventTypes_Enum.ON) {
          return event;
        }
      });

      this._emitters[namespace][key] = events;
    }
  }

  /**
   * 删除事件
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @param {string} key 事件名称
   * @param {Function} cb 事件回调函数
   * @param {string} [namespace="_GLOBAL_"]
   * @memberof Emitter
   */
  del(key: string, cb: Function, namespace: string = "_GLOBAL_") {
    let events = this._search(key, namespace);

    if (events) {
      events = events.filter(event => {
        if (cb !== event.cb) return event;
      });

      this._emitters[namespace][key] = events;
    }
  }

  /**
   * 清空事件
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @param {string} [namespace] 命名空间，如果为undefinded，则清空所有事件，如果有，则清空这个命名空间下的事件
   * @memberof Emitter
   */
  clear(namespace?: string) {
    if (namespace) this._emitters[namespace] = {};
    else this._emitters = {};
  }
}

export default Emitter;
