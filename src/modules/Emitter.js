class Emitter {
  constructor() {
    this.events = {};
  }
  on(key, fn) {
    this.events[key] = { type: "on", fn };
  }
  once(key, fn) {
    this.events[key] = { type: "once", fn };
  }
  del(key) {
    delete this.events[key];
  }
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
