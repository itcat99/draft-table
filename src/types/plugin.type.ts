// import Emitter from '../modules/Emitter'
import Core from "../modules/Core";
import Plugins from "../modules/Plugins";

export interface Plugin_Collection_I {
  [namespace: string]: Plugin_I;
}

export interface Plugin_I {
  (...props: any[]): void;
}

export interface Plugin_Props_I {
  app: Core;
  emitter: any;
  plugins: Plugins;
}
