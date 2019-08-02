import Emitter from "../modules/Emitter";

import { Context_I } from "../types/common.type";
import { Callback_I } from "../types/emitter.type";

class Plugin {
  private _emitter: Emitter;
  public namespace: string;

  constructor(public context: Context_I, public options?: any) {
    this._emitter = this.context.emitter;
    this.namespace = this.options.namespace;
  }

  setState() {}
  didUpdate() {}

  removeEvent(key: string, target: string = this.namespace) {
    this._emitter.del(key, target);
  }

  on(key: string, cb: Callback_I, target: string = this.namespace): Plugin {
    this._emitter.on(key, cb, target);

    return this;
  }

  once(key: string, cb: Callback_I, target: string = this.namespace): Plugin {
    this._emitter.once(key, cb, target);

    return this;
  }

  fire(key: string, props: any[], namespace: string = this.namespace) {
    this._emitter.fire(key, props, namespace);
  }
}

export default Plugin;
