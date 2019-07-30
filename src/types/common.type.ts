import { PluginCollection_I, PluginsProps_I } from "./plugins.type";
import Plugins from "../modules/Plugins";

export type Pos_Type = [number, number];

export enum TextAlign_Enum {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  START = "start",
  END = "end",
}

export enum TextBaseline_Enum {
  TOP = "top",
  HANGING = "hanging",
  MIDDLE = "middle",
  ALPHABETIC = "alphabetic",
  IDEOGRAPHIC = "ideographic",
  BOTTOM = "bottom",
}

/* ========== INTERFACES ========= */
export interface Context_I extends PluginsProps_I {
  plugins: Plugins;
}

export interface Config_I {
  target: HTMLCanvasElement | HTMLElement;
  width: number;
  height: number;
  ratio: number;
  strokeStyle: string;
  fillStyle: string;
  fontStyle: string;
  fontVariant: string;
  fontStretch: string;
  fontWeight: number;
  fontSize: number;
  fontFamily: string;
  lineHeight: number; // 字体的行高
  lineWidth: number; // 线的宽度
  textAlign: TextAlign_Enum;
  textBaseline: TextBaseline_Enum;
  plugins?: PluginCollection_I;
  [key: string]: any;
}
