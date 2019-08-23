import {
  Data_I,
  RowData_I,
  RowDataArr_Type,
  CellDataArr_Type,
  CellData_I,
} from "types/collections.type";
import { DATA, ORIGIN_X, CELL_DATA, ORIGIN_Y, ROW_DATA } from "../constants";
import { isNumber, isString, isArray } from "util";
import { deepMerge } from "helpers";

interface DataProps_I {
  data: RowDataArr_Type;
  width: number;
  height: number;
}

class Data {
  private width: number; // 视图宽度
  private height: number; // 视图高度

  private data: Data_I; // 传入的数据集合
  private originData: Data_I; // 源集合
  private viewData: Data_I; // 视图集合

  private index: number[]; // 当前行的索引
  private deep: number; // 当前检查的深度

  private currentOffsetX: number; // 当前横向偏移量
  private currentOffsetY: number; // 当前纵向偏移量

  constructor(public props: DataProps_I) {
    this.data = this._parseData(this.props.data);
    this.index = [0];
  }

  /**
   * 解析传入的data到原始集合结构
   *
   * @author FreMaNgo
   * @date 2019-08-13
   * @param {Data_I} data 传入的集合
   * @param {number} deep 当前集合的深度
   * @returns {Data_I}
   * @memberof Core
   */
  private _parseData(data: RowDataArr_Type, deep: number = 0): Data_I {
    const _data = Object.assign({}, DATA, data, { deep });
    const { items } = _data;

    _data.items = <RowData_I[]>this._normailzedRows(items, deep);
    return _data;
  }

  /**
   * 计算当前视图集合
   *
   * @author FreMaNgo
   * @date 2019-08-20
   * @private
   * @param {number} offset 偏移量
   * @param {boolean} [v=true] 视图方向，默认纵向
   * @memberof Data
   */
  private _parseViewData(offset: number, v: boolean = true) {
    let currentOffset = v ? this.currentOffsetY : this.currentOffsetX;
    currentOffset += offset;
    let currentIndex = this.index;

    const currentRow = this.getRowByIndex(this.index, <RowData_I[]>this.originData.items);
  }

  /**
   * 将传入的row转化为原始集合的row结构
   *
   * @author FreMaNgo
   * @date 2019-08-15
   * @private
   * @param {RowDataArr_Type} rows 传入集合的rows
   * @param {number} deep 当前集合的深度
   * @returns
   * @memberof Core
   */
  private _normailzedRows(rows: RowDataArr_Type, deep: number = 0) {
    if (!rows) return [];
    let result: RowData_I[] = [];
    let currentOffsetY = ORIGIN_Y;

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      let _row: RowData_I = {};

      if (isArray(row)) {
        _row = Object.assign({}, ROW_DATA, {
          items: row,
        });
      } else {
        _row = deepMerge(ROW_DATA, Object.assign({}, row));
      }

      const { size, items, id, children } = _row;
      _row = Object.assign({}, _row, {
        index,
        id: id || Symbol(),
        pos: [ORIGIN_X, currentOffsetY],
      });

      _row.items = <CellData_I[]>this._normailzedCells(items, currentOffsetY);
      currentOffsetY += size;

      if (children) {
        _row.children = this._parseData(children.items, deep + 1);
      }

      result.push(_row);
    }

    return result;
  }

  /**
   * 将传入集合的cell转化为原始集合的cell结构
   *
   * @author FreMaNgo
   * @date 2019-08-16
   * @private
   * @param {CellDataArr_Type} cells cell集合
   * @param {number} rowOffset cell所在行的Y轴偏移量
   * @returns
   * @memberof Core
   */
  private _normailzedCells(cells: CellDataArr_Type, rowOffset: number) {
    let result: CellData_I[] = [],
      currentOffsetX = ORIGIN_X;

    for (let index = 0; index < cells.length; index++) {
      let cell = cells[index];
      let _cell: CellData_I = {};

      if (isNumber(cell) || isString(cell)) {
        _cell = Object.assign({}, CELL_DATA, {
          value: cell,
        });
      } else {
        _cell = deepMerge(CELL_DATA, Object.assign({}, cell));
      }

      const { size, id } = _cell;
      _cell = Object.assign({}, _cell, {
        index,
        id: id || Symbol(),
        pos: [currentOffsetX, rowOffset],
      });

      currentOffsetX += size;

      result.push(_cell);
    }

    return result;
  }

  /**
   * 根据index数组查询row，当index数组有多个值的时候
   * 会查询当前行下的children属性下的items
   *
   * index为数组，索引代表深度
   * index=[1] 时代表获取第2行
   * index=[1,2]时代表获取第2行，子集第3行
   *
   * @author FreMaNgo
   * @date 2019-08-16
   * @param {number[]} index 索引
   * @param {RowData_I[]} rows rows集合
   * @returns
   * @memberof Data
   */
  getRowByIndex(index: number[], rows: RowData_I[]) {
    let result: RowData_I;
    const currentIndex = index[0];
    const childIndex = index[1];

    result = rows[currentIndex];
    const children = result.children;
    if (childIndex && children) {
      result = this.getRowByIndex(index.slice(1), <RowData_I[]>children.items);
    }

    return result;
  }

  /**
   * 获取下一个可用的Row
   *
   * @author FreMaNgo
   * @date 2019-08-21
   * @private
   * @param {number} offset 偏移量
   * @param {RowData_I} currentRow 当前的row
   * @returns {RowData_I}
   * @memberof Data
   */
  private getNextRow(offset: number, currentRow: RowData_I): RowData_I {
    const index = [].concat(this.index);
    let nextRow = this.getRowByIndex(index, <RowData_I[]>this.data.items);
    if (nextRow.hidden) {
      return this.getNextRow(offset, nextRow);
    }

    const currentOffset = nextRow.size - offset;
    if (currentOffset >= 0) {
      return this.getNextRow(currentOffset, nextRow);
    }

    return nextRow;
  }
}

export default Data;
