import { Data_I, RowData_I, CellData_I, CellType_Enum } from "types/collections.type";

export const RATIO_PROPS: String[] = ["fontSize", "lineWidth", "width", "height", "lineHeight"];
export const INTERNAL_PLUGIN_NAMESPACES = ["canvas", "scrollbar"];

export const DATA: Data_I = {
  deep: 0,
  hidden: false,
  wrap: false,
  rowSize: 20,
  colSize: 80,
  offsetWithViewX: 0,
  offsetWithViewY: 0,
};

export const ROW_DATA: RowData_I = {
  hidden: false,
  merge: false,
  selected: false,
  locked: false,
  wrap: false,
  size: 20,
};

export const CELL_DATA: CellData_I = {
  type: CellType_Enum.TEXT,
  value: "",
  size: 100,
  merge: false,
  hidden: false,
  selected: false,
  locked: false,
  wrap: false,
};

export const ORIGIN_X = 0;
export const ORIGIN_Y = 0;
