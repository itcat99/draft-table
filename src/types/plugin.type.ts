// import Emitter from '../modules/Emitter'
import Core from "../modules/Core";
import Plugins from "../modules/Plugins";
import Plugin from "../modules/Plugin";

export interface RegisterOptions_I {
  auto: boolean;
}

export interface Plugin_Collection_I {
  [namespace: string]: Plugin_I;
}

export interface Plugin_I {
  class: typeof Plugin;
  defaultProps: any;
  options: RegisterOptions_I;
}

export interface Plugin_Props_I {
  app: Core;
  emitter: any;
  plugins: Plugins;
}
