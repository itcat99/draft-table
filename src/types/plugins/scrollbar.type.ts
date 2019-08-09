import { Pos_Type } from "types/common.type";
import { Color_Type } from "types/plugins/canvas.types";

export enum BarType_Enum {
  V = "v", // 纵向
  H = "h", // 横向
}

export interface BarProps_I {
  type: BarType_Enum;
  origin: Pos_Type;
  length: number;
  size: number;
  weight: number;
  handleWeight: number;
  color: Color_Type;
  handleColor: Color_Type;
  activeColor: Color_Type;
}

export interface ScrollbarProps_I {
  [key: string]: any;
  vScrollbar?: boolean; // 是否启用纵向滚动条
  hScrollbar?: boolean; // 是否启用横向滚动条
  vOrigin?: Pos_Type; // 纵向滚动条 原点坐标 默认为 [canvas.width - weight, 0]
  hOrigin?: Pos_Type; // 横向滚动条 原点坐标 默认为 [0, canvas.height - weight]
  vSize?: number; // 纵向滚动条的高度 默认为 canvas.height
  hSize?: number; // 横向滚动条的宽度 默认为 canvas.width
  vLength?: number; // 纵向滚动的总长度
  hLength?: number; // 横向滚动的总长度
  weight?: number; // 纵向滚动条的宽度 或 横向滚动条的高度 默认为16
  handleWeight?: number; // 纵向滚动条控制把的宽度 或 横向滚动条控制把的高度 默认为12
  delay?: number; // 触发延迟 *再议
  color?: Color_Type; // 滚动条的颜色 canvas的ctx可接受的color值 默认为 #f1f1f1
  handleColor?: Color_Type; // 控制把的颜色 canvas的ctx可接受的color值 默认为 #111111
  activeColor?: Color_Type; // 滚动条被激活时的颜色 默认为 #fafafa
}
