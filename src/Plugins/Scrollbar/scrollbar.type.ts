import Canvas from "../Canvas";
import { Pos_Type } from "../../types/common.type";

export enum BarType_Enum {
  V = "v", // 纵向
  H = "h", // 横向
}

export interface BarProps_I {
  pos: Pos_Type;
  type: BarType_Enum;
  size: number;
  weight: number;
  opacity: number;
  canvas: Canvas;
  handleWeight: number;
}

export interface ScrollbarProps_I {
  vScrollbar: boolean;
  hScrollbar: boolean;
  vPos: number;
  hPos: number;
  vSize: number;
  hSize: number;
  weight: number;
  handleWeight: number;
  delay: number;
  opacity: number;
  fixed: boolean;
}
