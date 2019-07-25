import { Plugin_I } from "./types/plugin.type";
import { Config_I } from "./types/common.type";
import Emitter from "./modules/Emitter";
import Plugins from "./modules/Plugins";
import Config from "./config";

class Core {
  public emitter: Emitter;
  public events: Map<string, any>;
  public plugins: Plugins;
  public config: Config_I;

  constructor(props: Config_I) {
    this.emitter = new Emitter();
    this.plugins = new Plugins(this.emitter);
    this.config = Object.assign({}, Config, props);

    this.initiailzed();
  }

  private initiailzed() {
    const { plugins } = this.config;
    for (const key of Object.keys(plugins)) {
    }
  }

  public registerPlugin(name: string, fn: Plugin_I) {}

  // private parseEventKey(key: string) {
  //   const keyVals = key.split(EVENT_LINK);

  //   let [namespace, eventname] = keyVals;
  //   if (!event) {
  //     eventname = namespace;
  //     namespace = EVENT_NAMESPACE_GLOBAL;
  //   }

  //   return {
  //     namespace,
  //     eventname,
  //   };
  // }
}

export default Core;
