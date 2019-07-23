class Emitter {
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
  on(key, fn) {
    this.events[key] = { type: "on", fn };
  }

  /**
   * 监听事件，当事件被触发时，执行回调函数，仅执行一次
   *
   * @param {string} key 事件名称
   * @param {function} fn 回调函数
   * @memberof Emitter
   */
  once(key, fn) {
    this.events[key] = { type: "once", fn };
  }

  /**
   * 删除绑定的事件
   *
   * @param {string} key 事件名称
   * @memberof Emitter
   */
  del(key) {
    delete this.events[key];
  }

  /**
   * 触发事件
   *
   * @param {string} key 事件名称
   * @param {any} props 需要传递给回调函数的参数
   * @memberof Emitter
   */
  fire(key, ...props) {
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
