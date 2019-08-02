import { Pos_Type, ComponentProps_I } from "../../types/common.type";

export interface Attrs_I {
  [key: string]: any;
}

export interface Context2d_I extends CanvasRenderingContext2D {
  [key: string]: any;
}

export interface Line_I extends ComponentProps_I {
  from: Pos_Type;
  to: Pos_Type;
}

export interface Rect_I extends ComponentProps_I {
  pos: Pos_Type;
  width: number;
  height: number;
}

export interface Text_I extends ComponentProps_I {
  pos: Pos_Type;
  value: string;
}

export interface Font_I {
  size?: number | string;
  family?: string;
  weight?: number | string;
  style?: string;
  lineHeight?: number | string;
  variant?: string;
  stretch?: string;
}
