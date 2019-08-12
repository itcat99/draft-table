import { PluginsProps_I, PluginCollection_I } from "./plugins.type";
import Plugins from "modules/Plugins";
import { Data_I } from "./collections.type";
import { Font_I, Style_I } from "./style.type";

export type Pos_Type = [number, number];
export type Id_Type = Symbol | string | number;

/* ========== INTERFACES ========= */
// 全局上下文
export interface Context_I extends PluginsProps_I {
  plugins: Plugins;
}
// draft-table传入的配置文件
export interface Config_I {
  [key: string]: any;
  target: HTMLCanvasElement | HTMLElement;
  width: number;
  height: number;
  ratio?: number;
  font?: Font_I;
  style?: Style_I;
  plugins?: PluginCollection_I;
  scrollbar?: boolean;
  extraColCount: number; // 额外渲染的列数量
  extraRowCount: number; // 额外渲染的行数量
  data?: Data_I; // 元数据
}

export interface ComponentProps_I {
  id?: Id_Type;
  [key: string]: any;
}
