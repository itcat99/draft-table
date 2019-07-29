import { EventType_Enum, Events_Type } from "../types/emitter.type";

/**
 * 实现了自定义事件
 *
 * 1. 事件监听 -> on
 * 2. 事件监听一次 -> once
 * 3. 事件触发 -> fire
 * 4. 移除事件 -> del
 * 5. 清空事件 -> clear
 *
 * @class Emitter
 */
class Emitter {
  events: Events_Type;

  constructor() {
    this.events = new Map();
  }

  /**
   * 监听事件，当事件被触发时，执行回调函数
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} key 事件名称
   * @param {Function} fn 回调函数
   * @param {string|undefined} namespace 命名空间
   * @memberof Emitter
   */
  on(key: string, fn: Function, namespace?: string) {
    this.registerEvent(key, fn, EventType_Enum.ON, namespace);
  }

  /**
   * 监听事件，当事件被触发时，执行回调函数，仅执行一次
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} key 事件名称
   * @param {Function} fn 回调函数
   * @param {string|undefined} namespace 命名空间
   * @memberof Emitter
   */
  once(key: string, fn: Function, namespace?: string) {
    this.registerEvent(key, fn, EventType_Enum.ONCE, namespace);
  }

  /**
   * 注册监听事件
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @private
   * @param {string} key 事件名称
   * @param {Function} fn 回调函数
   * @param {EventType_Enum} type 事件类型 on/once
   * @param {string|undefined} namespace 命名空间
   * @memberof Emitter
   */
  private registerEvent(key: string, fn: Function, type: EventType_Enum, namespace?: string) {
    const event = {
      type,
      fn,
    };

    const name = namespace ? `${namespace}::${key}` : key;
    this.events.set(name, event);
  }

  /**
   * 删除绑定的事件
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} key 事件名称
   * @param {string} namespace 命名空间
   * @memberof Emitter
   */
  del(key: string, namespace?: string) {
    const name = namespace ? `${namespace}::${key}` : key;
    this.events.delete(name);
  }

  /**
   * 清空所有事件
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @memberof Emitter
   */
  clear() {
    this.events.clear();
  }

  /**
   * 触发事件
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} key 事件名称
   * @param {any[]} props 需要传递给回调函数的参数列表
   * @param {string|undefined} namespace 命名空间
   * @memberof Emitter
   */
  fire(key: string, props: any[], namespace?: string) {
    const name = namespace ? `${namespace}::${key}` : key;
    const event = this.events.get(name);

    if (event) {
      const { type, fn } = event;
      switch (type) {
        case EventType_Enum.ON:
          fn && fn(...props);
          break;
        case EventType_Enum.ONCE:
          fn && fn(...props);
          this.del(name);
          break;
        default:
          break;
      }
    }
  }
}

export default Emitter;
