import Core from "modules/Core";
import Plugin from "modules/Plugin";
import Emitter from "modules/Emitter";
import Err from "modules/Err";
import Store from "modules/Store";

import { Config_I } from "./common.type";

export interface RegisterOptions_I {
  auto?: boolean;
  autoProps?: object;
  namespace?: string;
}

export interface PluginCollection_I {
  [namespace: string]: Plugin_I;
}

export interface Plugin_I {
  class: typeof Plugin;
  options: RegisterOptions_I;
}

export interface PluginsProps_I {
  err: Err;
  core: Core;
  emitter: Emitter;
  config: Config_I;
  store: Store;
}

export type PluginsClasses_Type = Map<string, Plugin_I>;
export type PluginsInstances_Type = Map<string, Plugin>;
