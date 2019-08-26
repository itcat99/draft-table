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
export type RowDataArr_Type = string[][] | number[][] | Array<RowData_I>;
export type CellDataArr_Type = string[] | number[] | Array<CellData_I>;

// interface customStyle_I<T, M> {
//   (collection: T, data?: Data_I<M>): {
//     line?: LineStyle_I;
//     rect?: RectStyle_I;
//     text?: TextStyle_I;
//   };
// }

interface CommonItem_I {
  [key: string]: any;
  hidden: boolean; // 是否隐藏
  id?: Id_Type; // 主键，唯一
  index?: number; // 在总集合内的索引
  locked: boolean; // 是否锁定
  // pos?: Pos_Type; // 在总视图内的位置信息 [x,y]
  selected: boolean; // 是否选中
  size?: number; // row的height或col的width
}

interface Cell_I {
  [key: string]: any;
  id?: Id_Type; // col的id
  index?: number; // 在row内的索引
  selected?: boolean; // 是否选中
  type?: CellType_Enum; // 格子的类型
  value?: CellValue_Type; // 格子的值
}

// 行集合
export interface RowItem_I extends CommonItem_I {
  data?: Cell_I[]; // 当前行包含的格子集合
}

// 列集合
export interface ColItem_I extends CommonItem_I {
  data?: Id_Type[]; // 和row上相对应的id集合
}

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

export interface SimpleData_I {
  [index: number]: number | string | SimpleData_I;
}

export interface Data_I {
  parentId?: Id_Type;
  parentIndex?: number[];
  colSize?: number;
  customStyle?: Function;
  deep?: number;
  hidden?: boolean;
  rows?: RowDataArr_Type;
  rowSize?: number;
  wrap?: boolean;
}

export interface RowData_I {
  parentIndex?: number[];
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
}

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
