import { EventType_Enum, EventsCollection_Type, Callback_I } from "../types/emitter.type";

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
  events: EventsCollection_Type;

  constructor() {
    this.events = new Map();
  }

  /**
   * 监听事件，当事件被触发时，执行回调函数
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} key 事件名称
   * @param {Callback_I} cb 回调函数
   * @param {string|undefined} namespace 命名空间
   * @memberof Emitter
   */
  on(key: string, cb: Callback_I, namespace?: string) {
    this.registerEvent(key, cb, EventType_Enum.ON, namespace);
  }

  /**
   * 监听事件，当事件被触发时，执行回调函数，仅执行一次
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @param {string} key 事件名称
   * @param {Callback_I} cb 回调函数
   * @param {string|undefined} namespace 命名空间
   * @memberof Emitter
   */
  once(key: string, cb: Callback_I, namespace?: string) {
    this.registerEvent(key, cb, EventType_Enum.ONCE, namespace);
  }

  /**
   * 注册监听事件
   *
   * @author FreMaNgo
   * @date 2019-07-25
   * @private
   * @param {string} key 事件名称
   * @param {Callback_I} cb 回调函数
   * @param {EventType_Enum} type 事件类型 on/once
   * @param {string|undefined} namespace 命名空间
   * @memberof Emitter
   */
  private registerEvent(
    key: string,
    cb: Callback_I,
    type: EventType_Enum,
    namespace: string = "_GLOBAL_",
  ) {
    const event = {
      type,
      cb,
    };
    namespace = namespace || "_GLOBAL_";
    const collection = this.events.get(namespace);

    if (collection) {
      const events = collection.get(key);
      if (events) {
        events.push(event);
        collection.set(key, events);
      } else {
        collection.set(key, [event]);
      }
    } else {
      const newCollection = new Map();

      newCollection.set(key, [event]);
      this.events.set(namespace, newCollection);
    }
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
  del(key: string, namespace: string = "_GLOBAL_") {
    const collection = this.events.get(namespace);

    if (collection) {
      collection.delete(key);
    }
  }

  /**
   * 清空所有事件，如果传入namespace，则清除这个namespace下的事件
   *
   * @author FreMaNgo
   * @date 2019-08-05
   * @param {string} namespace
   * @memberof Emitter
   */
  clear(namespace: string) {
    if (namespace) {
      const collection = this.events.get(namespace);
      collection.clear();
    } else {
      this.events.clear();
    }
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
  fire(key: string, props: any[], namespace: string = "_GLOBAL_") {
    const collection = this.events.get(namespace);

    if (collection) {
      let events = collection.get(key);

      if (events) {
        events = events
          .map(event => {
            const { type, cb } = event;

            switch (type) {
              case EventType_Enum.ON:
                cb && cb(...props);
                return event;
              case EventType_Enum.ONCE:
                cb && cb(...props);
                break;
              default:
                break;
            }
          })
          .filter(item => item);

        collection.set(key, events);
      }
    }
  }
}

export default Emitter;
