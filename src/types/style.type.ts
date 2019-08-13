import { Color_Type } from "./plugins/canvas.types";

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

// 绘制的Line样式
export interface LineStyle_I {
  color?: Color_Type;
  lineWidth?: number;
}
// 绘制的Rect样式
export interface RectStyle_I {
  color?: Color_Type;
}
// 绘制的text样式
export interface TextStyle_I extends Font_I {
  color: Color_Type;
}
