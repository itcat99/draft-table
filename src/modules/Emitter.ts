enum EventTypeEnum {
  ON = "on",
  ONCE = "once",
}

interface Event {
  type: EventTypeEnum;
  fn: Function;
}

interface EventCollection {
  [key: string]: Event;
}

/**
 * 实现了自定义事件
 *
 * 1. 事件监听 -> on
 * 2. 事件监听一次 -> once
 * 3. 事件触发 -> fire
 * 4. 移出事件 -> del
 * 5. 清空事件 -> clear
 *
 * @class Emitter
 */
class Emitter {
  events: EventCollection;

  constructor() {
    this.events = {};
  }

  /**
   * 监听事件，当事件被触发时，执行回调函数
   *
   * @param {string} key 事件名称
   * @param {function} fn 回调函数
   * @memberof Emitter
   */
  on(key: string, fn: Function) {
    this.events[key] = { type: EventTypeEnum.ON, fn };
  }

  /**
   * 监听事件，当事件被触发时，执行回调函数，仅执行一次
   *
   * @param {string} key 事件名称
   * @param {function} fn 回调函数
   * @memberof Emitter
   */
  once(key: string, fn: Function) {
    this.events[key] = { type: EventTypeEnum.ON, fn };
  }

  /**
   * 删除绑定的事件
   *
   * @param {string} key 事件名称
   * @memberof Emitter
   */
  del(key: string) {
    if (key) delete this.events[key];
  }

  /**
   * 清空所有事件
   *
   * @memberof Emitter
   */
  clear() {
    this.events = {};
  }

  /**
   * 触发事件
   *
   * @param {string} key 事件名称
   * @param {any} props 需要传递给回调函数的参数
   * @memberof Emitter
   */
  fire(key: string, ...props: any[]) {
    const event = this.events[key];

    if (event) {
      const { type, fn } = event;

      switch (type) {
        case "on":
          fn && fn(...props);
          break;
        case "once":
          fn && fn(...props);
          this.del(key);
          break;
        default:
          break;
      }
    }
  }
}

export default Emitter;
