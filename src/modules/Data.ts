/* 
  目的：作为操作集合的模块
  成员： 
    0. data: 传入集合，就是new工程时随options传如的Data，只作为转化到源集合的初始集合
    1. originData: 源集合， 保存了Data_I结构的所有数据的集合
    2. viewData: 视图集合， 视图范围内的集合，过滤hidden行、列，生成mergeData
    3. mergeData: 合并集合，包含所有合并的格子


  ## 传入集合
  传入集合有可能是一个简单的多维数组结构，这时候，需要转化成标准Data_I 接口的集合
  data --> originData 只做一遍

  ## 源集合
  当从视图或API改变格子、行等的属性时，会改变orginData，然后再重新计算viewData。
  同时，会重新计算合并集合
  originData --> viewData 可能有许多遍，包含属性改变时、横纵轴偏移量改变时等
  orginData --> mergeData 可能有许多遍，包含属性改变时、横纵轴偏移量改变时等

  ## 视图集合
  是作为传递给外部的最终数据

  属性：
  index: number []: 当前的行指针

  方法：

  get -> viewData_I
  set: Data_I | SimpleData_I ----> OriginData_I ------> viewData_I
*/

import {
  Data_I,
  RowData_I,
  CellDataArr_Type,
  CellData_I,
  SimpleData_I,
  GlobalIndex_Type,
} from "types/collections.type";
import { DATA, CELL_DATA, ROW_DATA } from "../constants";
import { isNumber, isString, isArray } from "util";
import { deepMerge } from "helpers";
import { Id_Type } from "types/common.type";
import Emitter from "./Emitter";

interface DataProps_I {
  data: Data_I | SimpleData_I; // 接受Data类型或者多维数组
  width: number;
  height: number;
  emitter: Emitter;
}

interface ParseOpts_I {
  deep?: number;
  parentIndex?: GlobalIndex_Type;
  parentId?: Id_Type;
}

class Data {
  private width: number; // 视图宽度
  private height: number; // 视图高度

  private data: Data_I; // 传入的数据集合
  private originData: Data_I; // 源集合
  private viewData: Data_I; // 视图集合

  private index: GlobalIndex_Type; // 当前行的索引
  private deep: number; // 当前检查的深度

  private currentOffsetX: number; // 当前横向偏移量
  private currentOffsetY: number; // 当前纵向偏移量

  private emitter: Emitter;

  constructor(public props: DataProps_I) {
    const { data, width, height, emitter } = this.props;

    this.emitter = emitter;
    this.width = width;
    this.height = height;
    this.data = data;
    this.originData = this._parseData(this.data);
    this.viewData = this._parseViewData(this.originData);
    // this.index = [0];
  }

  /**
   * 解析传入的data到原始集合结构
   *
   * 传入的有可能是简单结构的数据，需要转化成正常的Data_I接口
   *
   * @author FreMaNgo
   * @date 2019-08-13
   * @param {Data_I} data 传入的集合
   * @param {number} deep 当前集合的深度
   * @returns {Data_I}
   * @memberof Core
   */
  private _parseData(data: Data_I | SimpleData_I, opts: ParseOpts_I = { deep: 0 }): Data_I {
    const { deep, parentId, parentIndex } = opts;

    let _data: Data_I = {};
    if (isArray(data)) {
      // 简单结构的数据，转化为正常Data_I的items
      _data = Object.assign({}, DATA, { deep, rows: data });
    } else {
      _data = Object.assign({}, deepMerge(DATA, data), { deep });
    }

    if (parentId) _data.parentId = parentId;
    if (parentIndex) _data.parentIndex = parentIndex;

    _data.rows = this._normailzedRows(_data.rows, deep, parentIndex);
    return _data;
  }

  /**
   * 将传入的row转化为原始集合的row结构
   *
   * @author FreMaNgo
   * @date 2019-08-15
   * @private
   * @param {RowData_I[]} rows 传入集合的rows
   * @param {number} deep 当前集合的深度
   * @returns
   * @memberof Core
   */
  private _normailzedRows(rows: RowData_I[], deep: number = 0, parentIndex?: GlobalIndex_Type) {
    if (!rows) return [];
    let result: RowData_I[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      let _row: RowData_I = {};

      if (isArray(row)) {
        _row = Object.assign({}, ROW_DATA, {
          cells: row,
        });
      } else {
        _row = deepMerge(ROW_DATA, Object.assign({}, row));
      }

      const { cells, id, children } = _row;
      _row = Object.assign({}, _row, {
        index,
        id: id || Symbol(),
      });

      _row.cells = <CellData_I[]>this._normailzedCells(cells);

      if (parentIndex) _row.parentIndex = parentIndex;
      if (children) {
        let { index } = _row;
        let childParentIndex: number[];

        if (parentIndex) {
          childParentIndex = [].concat(parentIndex);
          childParentIndex[deep] = index;
        } else {
          childParentIndex = [index];
        }

        _row.children = this._parseData(children, {
          deep: deep + 1,
          parentId: _row.id,
          parentIndex: childParentIndex,
        });
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
  private _normailzedCells(cells: CellDataArr_Type) {
    let result: CellData_I[] = [];
    if (!cells) return result;

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

      const { id } = _cell;
      _cell = Object.assign({}, _cell, {
        index,
        id: id || Symbol(),
      });

      result.push(_cell);
    }

    return result;
  }

  /**
   * 计算当前视图集合
   *
   *  根据当前的index和视图宽高计算视图内的数据
   *
   *  获取下一个或上一个的的index
   *  从index开始计算size的叠加 直到大于height
   *
   *  排除：
   *  1. hidden的row
   *  2. hidden的col
   *  3. hidden的折叠table
   *
   * @author FreMaNgo
   * @date 2019-08-27
   * @private
   * @param {Data_I} data
   * @param {number} [offset=0]
   * @memberof Data
   */
  private _parseViewData(data: Data_I, offset: number = 0, count: number = 0): Data_I {
    if (!this.index) {
      this.index = [0];
      const result = Object.assign({}, data);
      result.rows = this.sliceData(<RowData_I>result.rows[0]);

      this.emitter.fire("viewDataChange", [result], "_DATA_");
      return result;
    }

    const result = Object.assign({}, data);
    const squareOffset = Math.sqrt(offset);
    const rows = result.rows;
    const handler = offset >= 0 ? this.getNextRow.bind(this) : this.getPrevRow.bind(this);

    let next = handler(rows, this.index);
    if (!next) {
      return this.viewData;
    }

    const { size } = next;
    this.index = this.getIndexInTotal(next);

    const currentSize = count + size;
    if (currentSize >= squareOffset) {
      result.rows = this.sliceData(next);

      this.emitter.fire("viewDataChange", [result], "_DATA_");
      return result;
    } else {
      return this._parseViewData(result, offset, currentSize);
    }
  }

  /**
   * 根据当前的行和视图高度
   * 切片数据
   *
   * @author FreMaNgo
   * @date 2019-08-28
   * @private
   * @param {RowData_I} currentRow 当前行
   * @param {RowData_I[]} [rows=[]] 源数据行信息
   * @param {number} [count=0] 当前累加的高度
   * @returns {RowData_I[]}
   * @memberof Data
   */
  private sliceData(currentRow: RowData_I, rows: RowData_I[] = [], count: number = 0): RowData_I[] {
    const originRows = [].concat(this.originData.rows);

    if (currentRow) {
      const { size, hidden } = currentRow;

      if (!hidden) {
        const currentSize = count + size;
        rows.push(currentRow);

        if (currentSize >= this.height) {
          return rows;
        } else {
          const next = this.getNextRow(originRows, this.getIndexInTotal(currentRow));
          if (!next) return rows;

          return this.sliceData(next, rows, currentSize);
        }
      }
    }

    return rows;
  }

  /**
   * 获取当前行在总数据源中的索引位置
   *
   * @author FreMaNgo
   * @date 2019-08-27
   * @param {RowData_I} row
   * @memberof Data
   */
  getIndexInTotal(row: RowData_I) {
    const { index, parentIndex } = row;

    if (parentIndex) return [].concat(parentIndex, [index]);
    return [index];
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
  getRowByIndex(rows: RowData_I[], index: number[]): RowData_I {
    if (!rows) return; // 如果没有arr 返回
    const currentIndex = index[0];
    if (typeof currentIndex !== "number") return; // 如果传入的index没有值 返回

    let result = rows[currentIndex];
    if (!result) return; // 如果无法获取到value 返回
    const nextIndex = index[1];
    if (typeof nextIndex !== "number") return result; // 如果没有下一个索引 返回val

    const { children } = result;
    return this.getRowByIndex(children.rows, index.slice(1)); // 返回children 的值
  }

  /**
   * 获取下一个可用的row 如果没有返回undefined
   *
   * @author FreMaNgo
   * @date 2019-08-26
   * @param {RowData_I[]} rows 根节点rows集合
   * @param {number[]} [currentIndex=[0]] 当前的row指针
   * @returns
   * @memberof Data
   */
  getNextRow(rows: RowData_I[], currentIndex: number[] = [0]): RowData_I {
    const current = this.getRowByIndex(rows, currentIndex);
    if (!current) return;
    const { children } = current;
    // 找子节点，有就return
    if (children) {
      const rows = children.rows;
      if (rows && rows.length) return rows[0];
    }
    // 找下一个兄弟节点，有就return
    const broIndex = currentIndex.slice(0);
    broIndex[currentIndex.length - 1] += 1;
    let next = this.getRowByIndex(rows, broIndex);
    if (next) return next;
    // 找父节点的下一个兄弟节点，有就return
    // 没有就向上找 直到找到 就return
    const parentBro = this.getDeepestParentBro(current);
    if (parentBro) return parentBro;
    // 都没有，return undefined
    return;
  }

  /**
   * 获取上一个可用的row 如果没有 返回undefined
   *
   * @author FreMaNgo
   * @date 2019-08-26
   * @param {RowData_I[]} rows 根节点rows集合
   * @param {number[]} [currentIndex=[0]] 当前的row指针
   * @returns
   * @memberof Data
   */
  getPrevRow(rows: RowData_I[], currentIndex: number[] = [0]): RowData_I {
    const current = this.getRowByIndex(rows, currentIndex);
    if (!current) return;

    const { length } = currentIndex;
    // 找兄弟节点的最深一级子节点的最后一个 有就return
    const broIndex = currentIndex.slice(0);

    broIndex[length - 1] -= 1;
    if (broIndex[length - 1] >= 0) {
      const bro = this.getRowByIndex(rows, broIndex);
      if (bro) {
        const lastChildren = this.getDeepestChild(bro);
        if (lastChildren) return lastChildren;
        // 兄弟节点没有子节点 return 兄弟节点
        return bro;
      }
    }
    // 没有兄弟节点 返回父节点
    const { parentIndex } = current;
    if (parentIndex) {
      const parent = this.getRowByIndex(rows, parentIndex);
      if (parent) return parent;
    }

    return;
    // 没有父节点 返回undefined
  }

  /**
   * 获取行的最深的一个子集的最后一个子行
   *
   * @author FreMaNgo
   * @date 2019-08-26
   * @param {RowData_I} row 行
   * @returns {RowData_I}
   * @memberof Data
   */
  getDeepestChild(row: RowData_I): RowData_I {
    const lastChild = this.getLastChild(row);
    if (lastChild) {
      const { children } = lastChild;
      if (children) return this.getDeepestChild(lastChild);
      return lastChild;
    }
  }

  /**
   * 深度遍历 获取父级的兄弟节点
   * 如果父级没有 就再往上找
   *
   * @author FreMaNgo
   * @date 2019-08-28
   * @param {RowData_I} row
   * @returns {RowData_I}
   * @memberof Data
   */
  getDeepestParentBro(row: RowData_I): RowData_I {
    const { parentIndex } = row;
    if (!parentIndex) return;

    const parent = this.getRowByIndex(this.originData.rows, parentIndex);
    const bro = this.getNextBro(parent);
    if (bro) return bro;

    return this.getDeepestParentBro(parent);
  }

  /**
   * 获取下一个兄弟节点
   *
   * @author FreMaNgo
   * @date 2019-08-28
   * @param {RowData_I} row
   * @returns {RowData_I}
   * @memberof Data
   */
  getNextBro(row: RowData_I): RowData_I {
    const broIndex = this.getIndexInTotal(row);
    broIndex[broIndex.length - 1] += 1;

    return this.getRowByIndex(this.originData.rows, broIndex);
  }

  /**
   * 获取上一个兄弟节点
   *
   * @author FreMaNgo
   * @date 2019-08-28
   * @param {RowData_I} row
   * @returns {RowData_I}
   * @memberof Data
   */
  getPrevBro(row: RowData_I): RowData_I {
    const broIndex = this.getIndexInTotal(row);
    broIndex[broIndex.length - 1] -= 1;

    return this.getRowByIndex(this.originData.rows, broIndex);
  }

  /**
   * 获取行的最后一个子行
   *
   * @author FreMaNgo
   * @date 2019-08-26
   * @param {RowData_I} row 行
   * @returns {RowData_I}
   * @memberof Data
   */
  getLastChild(row: RowData_I): RowData_I {
    const { children } = row;
    if (children) {
      const { rows } = children;
      if (rows && rows.length) {
        return <RowData_I>rows[rows.length];
      }
    }
  }

  /**
   * 获取源集合
   *
   * @author FreMaNgo
   * @date 2019-08-23
   * @returns
   * @memberof Data
   */
  getOrigin() {
    return this.originData;
  }

  /**
   * 获取viewData集合
   *
   * @author FreMaNgo
   * @date 2019-08-23
   * @returns
   * @memberof Data
   */
  get() {
    return this.viewData;
  }

  setSize({ width, height }: { width: number; height: number }) {
    this.width = width || this.width;
    this.height = height || this.height;

    this.viewData.rows = this.sliceData(this.getRowByIndex(this.originData.rows, this.index));
    this.emitter.fire("viewDataChange", [this.viewData], "_DATA_");
  }
}

export default Data;
