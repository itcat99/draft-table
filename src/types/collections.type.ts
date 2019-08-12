import Plugin from "modules/Plugin";
import { Id_Type, Pos_Type } from "types/common.type";
import { RectStyle_I, LineStyle_I, TextStyle_I } from "types/style.type";
import Line from "components/Line";
import Rect from "components/Rect";
import Text from "components/Text";

enum CellType_Enum {
  PLUGIN = "plugin", // 插件类型
  TEXT = "text", // 文本类型
  VOID = "void", // 空类型
}

type CellValue_Type = Plugin | string | undefined | null | number; // 插件实例或字符串

interface customStyle_I<T> {
  (collection: T, data?: Data_I): {
    line?: LineStyle_I;
    rect?: RectStyle_I;
    text?: TextStyle_I;
  };
}

interface CommonItem_I {
  [key: string]: any;
  id?: Id_Type; // 主键，唯一
  index?: number; // 在总集合内的索引
  pos?: Pos_Type; // 在总视图内的位置信息 [x,y]
  locked: boolean; // 是否锁定
  hidden: boolean; // 是否隐藏
  selected: boolean; // 是否选中
}

interface Cell_I {
  [key: string]: any;
  id?: Id_Type; // col的id
  index?: number; // 在row内的索引
  type?: CellType_Enum; // 格子的类型
  value?: CellValue_Type; // 格子的值
  selected?: boolean; // 是否选中
  width?: number; // 文字宽度
  height?: number; // 文字高度
}

// 行集合
export interface RowItem_I extends CommonItem_I {
  data?: Cell_I[]; // 当前行包含的格子集合
}

// 列集合
export interface ColItem_I extends CommonItem_I {
  data?: Id_Type[]; // 和row上相对应的id集合
}

// row或col的原始集合
export interface Collection_I<T> {
  customStyle?: customStyle_I<T>; // 自定义样式回调函数
  items?: T; // 集合内容
}

export interface Data_I {
  rows?: Collection_I<Map<Id_Type, RowItem_I>>;
  cols?: Collection_I<Map<Id_Type, ColItem_I>>;
}

// 最终绘制的集合
export interface FinalCollection_I<T, M> {
  style: T;
  data: M[];
}

export interface RenderingData_I {
  line?: FinalCollection_I<LineStyle_I, Line>[];
  rect?: FinalCollection_I<RectStyle_I, Rect>[];
  text?: FinalCollection_I<TextStyle_I, Text>[];
}
