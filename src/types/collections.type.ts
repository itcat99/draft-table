import Plugin from "modules/Plugin";
import { Id_Type, Pos_Type } from "types/common.type";
import { RectStyle_I, LineStyle_I, TextStyle_I, DataStyle_I } from "types/style.type";
import Line from "components/Line";
import Rect from "components/Rect";
import Text from "components/Text";

export enum CellType_Enum {
  PLUGIN = "plugin", // 插件类型
  TEXT = "text", // 文本类型
}

type CellValue_Type = Plugin | string | undefined | null | number; // 插件实例或字符串
export type CellDataArr_Type = string[] | number[] | Array<CellData_I>;
export type GlobalIndex_Type = number[];

// 最终绘制的集合结构
export interface FinalCollection_I<T, M> {
  data: M[];
  style: T;
}

// 渲染集合
export interface RenderingData_I {
  line?: FinalCollection_I<LineStyle_I, Line>[];
  rect?: FinalCollection_I<RectStyle_I, Rect>[];
  text?: FinalCollection_I<TextStyle_I, Text>[];
}

// 简单的data
export interface SimpleData_I {
  [index: number]: number | string | SimpleData_I;
}

// Data结构
export interface Data_I {
  parentId?: Id_Type;
  parentIndex?: GlobalIndex_Type;
  colSize?: number;
  customStyle?: Function;
  deep?: number;
  hidden?: boolean;
  rows?: RowData_I[];
  rowSize?: number;
  wrap?: boolean;
  offsetWithViewX?: number;
  offsetWithViewY?: number;
}

// 行结构
export interface RowData_I {
  parentIndex?: GlobalIndex_Type;
  children?: Data_I;
  customStyle?: Function;
  hidden?: boolean;
  id?: Id_Type;
  index?: number;
  cells?: CellDataArr_Type;
  locked?: boolean;
  merge?: boolean | number;
  // pos?: Pos_Type;
  selected?: boolean;
  size?: number;
  style?: DataStyle_I;
  wrap?: boolean;
  // offsetWithViewX?: number;
  // offsetWithViewY?: number;
}

// 格子结构
export interface CellData_I {
  hidden?: boolean;
  id?: Id_Type;
  index?: number;
  locked?: boolean;
  merge?: boolean | Pos_Type;
  // pos?: Pos_Type;
  selected?: boolean;
  size?: number;
  style?: DataStyle_I;
  type?: CellType_Enum;
  value?: CellValue_Type;
  wrap?: boolean;
}
