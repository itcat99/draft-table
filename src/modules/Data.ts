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
import { isNumber, isString, isArray, isUndefined } from "util";
import { deepMerge } from "helpers";
import { Id_Type } from "types/common.type";
import Emitter from "./Emitter";
import Store from "./Store";

interface DataProps_I {
  data: Data_I | SimpleData_I; // 接受Data类型或者多维数组
  store: Store;
  width: number;
  height: number;
  emitter: Emitter;
}

interface ParseOpts_I {
  deep?: number;
  parentIndex?: GlobalIndex_Type;
  parentId?: Id_Type;
}

interface State_I {
  viewWidth: number; // 视图宽度
  viewHeight: number; // 视图高度
  originData: Data_I; // 源集合
  viewData: Data_I; // 视图集合
  currentIndex: GlobalIndex_Type; // 当前行的索引
  currentOffsetX: number; // 当前横向偏移量
  currentOffsetY: number; // 当前纵向偏移量
  totalHeight: number; // 行总长度
  totalWidth: number; // 列总宽度
}

class Data {
  // private _width: number; // 视图宽度
  // private _height: number; // 视图高度

  private _data: Data_I; // 传入的数据集合
  // private _originData: Data_I; // 源集合
  // private _viewData: Data_I; // 视图集合

  // private _index: GlobalIndex_Type; // 当前行的索引
  // private _deep: number; // 当前检查的深度

  // private _currentOffsetX: number; // 当前横向偏移量
  // private _currentOffsetY: number; // 当前纵向偏移量

  // private _totalHeight: number; // 行总长度
  // private _totalWidth: number; // 列总宽度

  private _emitter: Emitter;
  private _store: Store;

  public state: State_I;

  constructor(public props: DataProps_I) {
    const { data, width, height, emitter, store } = this.props;

    this._data = data;
    this._store = store;

    this.state = {
      viewHeight: height,
      viewWidth: width,
      totalHeight: 0,
      totalWidth: 0,
      originData: null,
      viewData: null,
      currentIndex: [0],
      currentOffsetX: 0, // 当前横向偏移量
      currentOffsetY: 0, // 当前纵向偏移量
    };

    this._setStore(this.state);

    // this._currentOffsetY = 0;
    // this._currentOffsetX = 0;
    this._emitter = emitter;
    // this._width = width;
    // this._height = height;

    // this._totalHeight = 0;
    // this._totalWidth = 0;
    this._setStore({
      originData: this._parseData(this._data),
    });
    this._setStore({
      viewData: this._parseViewData(this._getStore("originData")),
    });

    // this._originData = this._parseData(this._data);
    // this._viewData = this._parseViewData(this._originData);
    // this._index = [0];
    this._setStore({
      totalWidth: this.updateTotlaWidth(),
    });
    // this._totalWidth = this.updateTotlaWidth();
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

    _data.rows = this._normailzedRows(_data, deep, parentIndex);
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
  private _normailzedRows(data: Data_I, deep: number = 0, parentIndex?: GlobalIndex_Type) {
    const { rows, hidden: dataHidden } = data;
    if (!rows) {
      return [];
    }
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

      const { hidden, size } = _row;
      const currentTotalHeight = this._getStore("totalHeight");

      if (!dataHidden && !hidden) this._setStore({ totalHeight: currentTotalHeight + size });

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
   *  <!--- 修改了this.originData的offsetWithViewY属性 ---!>
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
  private _parseViewData(data: Data_I, offset: number = 0, count?: number): Data_I {
    const currentIndex = this._getStore("currentIndex");
    if (!currentIndex) this._setStore({ currentIndex: [1] });

    const result = Object.assign({}, data);
    const { rows, offsetWithViewY } = result;

    const current = this.getRowByIndex(rows, currentIndex);

    // 正向偏移时， 当偏移量小于当前size + 视图纵向偏移 返回当前Data
    if (offset > 0 && offset < current.size + offsetWithViewY) return result;
    // 反向偏移时， 当偏移量大于等于当前视图纵向偏移 返回当前Data
    if (offset < 0 && offset >= offsetWithViewY) return result;

    if (isUndefined(count)) {
      count =
        Math.abs(offset) + (offset >= 0 ? Math.abs(offsetWithViewY) : -Math.abs(offsetWithViewY));
    }

    const handler = offset >= 0 ? this.getNextRow.bind(this) : this.getPrevRow.bind(this);

    let next = handler(rows, currentIndex);
    if (!next) {
      // 没有下一个就返回当前的
      return result;
    }

    const { size } = next;
    this._setStore({
      currentIndex: this.getIndexInTotal(next),
    });

    if (size > count) {
      result.offsetWithViewY = offset >= 0 ? -count : count - size;
      this._setStore({
        originData: {
          offsetWithViewY: result.offsetWithViewY,
        },
      });
    } else if (size === count) {
      result.offsetWithViewY = 0;
      this._setStore({
        originData: {
          offsetWithViewY: result.offsetWithViewY,
        },
      });
    } else {
      return this._parseViewData(result, offset, count - current.size);
    }

    result.rows = this.sliceCell(
      this.sliceRow({
        currentRow: current,
      }),
    );
    const originData = <Data_I>this._getStore("originData");
    result.offsetWithViewX = originData.offsetWithViewX;
    this._emitter.fire("viewDataChange", [result], "_DATA_");
    return result;
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
  private sliceRow({
    currentRow,
    rows = [],
    count = 0,
  }: {
    currentRow: RowData_I;
    rows?: RowData_I[];
    count?: number;
  }): RowData_I[] {
    const { rows: originRows, offsetWithViewY } = <Data_I>this._getStore("originData");
    const viewHeight = this._getStore("viewHeight");
    const _rows = <RowData_I[]>[].concat(originRows);

    if (currentRow) {
      const { size, hidden } = currentRow;

      if (!hidden) {
        const currentSize = count + size;
        rows.push(currentRow);

        if (currentSize + offsetWithViewY < viewHeight) {
          const next = this.getNextRow(_rows, this.getIndexInTotal(currentRow));
          if (!next) return rows;

          return this.sliceRow({
            currentRow: next,
            rows,
            count: currentSize,
          });
        }
      }
    }

    return rows;
  }

  /**
   * 根据视图宽度 过滤cell
   *
   * <!--- 会修改 this.originData的offsetWithViewX属性 ---!>
   *
   * @author FreMaNgo
   * @date 2019-08-30
   * @param {RowData_I[]} rows
   * @returns {RowData_I[]}
   * @memberof Data
   */
  sliceCell(rows: RowData_I[]): RowData_I[] {
    if (!rows || !rows.length) return rows;
    const currentOffsetX = this._getStore("currentOffsetX");
    const viewWidth = this._getStore("viewWidth");

    const { cells } = rows[0];
    let count = 0,
      start = undefined;

    for (let index = 0; index < cells.length; index++) {
      const { size } = <CellData_I>cells[index];
      count += size;

      if (count > currentOffsetX && isUndefined(start)) {
        start = index;
        this._setStore({
          originData: {
            offsetWithViewX: size - (count - currentOffsetX),
          },
        });
      }

      if (count - currentOffsetX >= viewWidth) {
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const { cells } = row;

          row.cells = cells.slice(start, index + 1);
        }

        return rows;
      }
    }
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
    const originData = <Data_I>this._getStore("originData");
    const parent = this.getRowByIndex(originData.rows, parentIndex);
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
    const originData = <Data_I>this._getStore("originData");
    const broIndex = this.getIndexInTotal(row);
    broIndex[broIndex.length - 1] += 1;

    return this.getRowByIndex(originData.rows, broIndex);
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
    const originData = <Data_I>this._getStore("originData");
    const broIndex = this.getIndexInTotal(row);
    broIndex[broIndex.length - 1] -= 1;

    return this.getRowByIndex(originData.rows, broIndex);
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
    return <Data_I>this._getStore("originData");
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
    return <Data_I>this._getStore("originView");
  }

  /**
   * 设置视图窗口大小 并更新viewData
   *
   * @author FreMaNgo
   * @date 2019-08-30
   * @param {{ width: number; height: number }} { width, height }
   * @memberof Data
   */
  setSize({ width, height }: { width: number; height: number }) {
    width = width || this._getStore("viewWidth");
    height = height || this._getStore("viewHeight");

    const { data, currentIndex }: { data: Data_I; currentIndex: GlobalIndex_Type } = this._getStore(
      ["originData", "currentIndex"],
    );

    const { rows, offsetWithViewX } = data;
    const newRows = this.sliceCell(
      this.sliceRow({
        currentRow: this.getRowByIndex(rows, currentIndex),
      }),
    );

    this._setStore({
      viewData: {
        rows: newRows,
        offsetWithViewX,
      },
    });
    this._emitter.fire("viewDataChange", [this.get()], "_DATA_");
  }

  /**
   * 获取当前的总体高度
   *
   * @author FreMaNgo
   * @date 2019-09-05
   * @returns
   * @memberof Data
   */
  getTotalHeight() {
    return this._getStore("totalHeight");
  }

  /**
   * 获取当前的总体宽度
   *
   * @author FreMaNgo
   * @date 2019-09-05
   * @returns
   * @memberof Data
   */
  getTotalWidth() {
    return this._getStore("totalWidth");
  }

  /**
   *  更新totalHeight并返回更新后的值
   *
   *  如果 rows有值，则在原有基础上增加或删除
   *  没有就算总体的
   *
   * @author FreMaNgo
   * @date 2019-09-05
   * @param {RowData_I[]} [rows] 行集合
   * @param {boolean} [minus=false] 是否减去
   * @returns
   * @memberof Data
   */
  updateTotalHeight(rows?: RowData_I[], minus: boolean = false) {
    const hasRows = rows ? true : false;
    const { hidden: dataHidden, rows: originRows } = this._getStore("originData");
    const totalHeight = <number>this._getStore("totalHeight");

    if (dataHidden) {
      this._setStore({
        totalHeight: 0,
      });
      return this._getStore("totalHeight");
    }

    rows = rows || originRows;
    const count = this.getRowsHeight(rows);
    this._setStore({
      totalHeight: hasRows ? (minus ? totalHeight - count : totalHeight + count) : count,
    });

    return this._getStore("totalHeight");
  }

  /**
   * 更新totalWidth并返回更新后的值
   *
   * @author FreMaNgo
   * @date 2019-09-05
   * @param {CellData_I[]} [cells] 格子集合
   * @param {boolean} [minus=false] 是否减去
   * @returns
   * @memberof Data
   */
  updateTotlaWidth(cells?: CellData_I[], minus: boolean = false) {
    const hasCells = cells ? true : false;
    const { originData, totalWidth }: { originData: Data_I; totalWidth: number } = this._getStore([
      "originData",
      "totalWidth",
    ]);
    let count = 0;
    cells = cells || <CellData_I[]>originData.rows[0].cells;

    cells.forEach(cell => {
      const { hidden, size } = cell;
      if (!hidden) count += size;
    });

    this._setStore({
      totalWidth: hasCells ? (minus ? totalWidth - count : totalWidth + count) : count,
    });
    return <number>this._getStore("totalWidth");
  }

  /**
   * 获取行集合的高度
   *
   * @author FreMaNgo
   * @date 2019-09-05
   * @param {RowData_I[]} rows
   * @returns
   * @memberof Data
   */
  getRowsHeight(rows: RowData_I[]) {
    if (!rows || !rows.length) return 0;
    let result = 0;

    rows.forEach(row => {
      const { hidden, size, children } = row;

      if (!hidden) result += size;
      if (children) {
        const { hidden: childrenHidden, rows: childrenRows } = children;
        if (!childrenHidden) result += this.getRowsHeight(childrenRows);
      }
    });

    return result;
  }

  private _setStore(data: { [key: string]: any }) {
    this._store.set(data);
  }

  private _getStore(key: string | string[]) {
    return this._store.get(key);
  }
}

export default Data;
