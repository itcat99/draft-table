import { PluginsProps_I, PluginCollection_I } from "./plugins.type";
import Plugins from "modules/Plugins";
import { Color_Type } from "./plugins/canvas.types";
import Line from "components/Line";
import Rect from "components/Rect";
import Text from "components/Text";

export type Pos_Type = [number, number];
export type Id_Type = Symbol | string | number;

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

// 字体相关的属性
export interface Font_I {
  size?: number | string;
  family?: string;
  weight?: number | string;
  style?: string;
  lineHeight?: number | string;
  variant?: string;
  stretch?: string;
}

// 样式相关的canvas属性
export interface Style_I {
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number; // 线的宽度
  textAlign?: TextAlign_Enum;
  textBaseline?: TextBaseline_Enum;
}

export interface Context_I extends PluginsProps_I {
  plugins: Plugins;
}

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
}

export interface ComponentProps_I {
  id?: Symbol | string | number;
  [key: string]: any;
}

export interface FinalCollection_I<T, M> {
  style: T;
  data: M[];
}
export interface LineStyle_I {
  color?: Color_Type;
  weight?: number;
}

export interface RectStyle_I {
  color?: Color_Type;
}

export interface TextStyle_I extends Font_I {
  color: Color_Type;
}

export interface DrawProps_I {
  line?: FinalCollection_I<LineStyle_I, Line>[];
  rect?: FinalCollection_I<RectStyle_I, Rect>[];
  text?: FinalCollection_I<TextStyle_I, Text>[];
}
