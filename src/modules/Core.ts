// import Emitter from "./Emitter";
import Emitter from "./Emitter";
import Plugins from "./Plugins";
import Plugin from "./Plugin";
import Err from "./Err";
import Data from "./Data";

import DEFAULT_PROPS from "../config";
import { INTERNAL_PLUGIN_NAMESPACES } from "../constants";

/* internal Plugins */
import Canvas from "plugins/Canvas";
import Scrollbar from "plugins/Scrollbar";

/* types */
import { Config_I, Id_Type } from "types/common.type";
import { LineStyle_I, RectStyle_I, TextStyle_I } from "types/style.type";
import { RegisterOptions_I, PluginCollection_I } from "types/plugins.type";
import {
  Data_I,
  FinalCollection_I,
  RenderingData_I,
  CellData_I,
  RowData_I,
  CellDataArr_Type,
} from "types/collections.type";
import { Callback_I } from "types/emitter.type";
import { deepMerge, generatorFont } from "helpers";

import Line from "components/Line";
import Rect from "components/Rect";
import Text from "components/Text";
import { Line_I } from "types/plugins/canvas.types";
import { getSumByRange } from "helpers/calculate";

class Core {
  public COLLECTIONS: any;
  public STORE: any;
  public EMITTER: Emitter;
  public PLUGINS: Plugins;
  public ERR: Err;
  public DATA: Data;

  public config: Config_I;

  // === 内置插件实例 === //
  public canvas: Canvas;
  public scrollbar: Scrollbar;

  // === Informations === //
  public width: number; // canvas宽度
  public height: number; // canvas高度
  public viewWidth: number; // 可绘制区域宽度
  public viewHeight: number; // 可绘制区域高度
  public data: Data_I; // 原始集合
  public viewData: Data_I; // 视图集合
  public renderingData: RenderingData_I;
  public wrapperLines: FinalCollection_I<LineStyle_I, Line>;

  public dataHeight: number; // 数据总长度
  public dataWidth: number; // 数据总宽度
  public currentRowIndex: number; // 当前第一个row的索引
  public currentOffsetY: number; // 当前Y轴偏移量
  public currentOffsetX: number; // 当前X轴偏移量

  /**
   * 初始化：emitter,plugins,collection,store,err
   * 注册全局监听
   * @author FreMaNgo
   * @date 2019-07-29
   * @param {Config_I} props
   * @memberof Core
   */
  constructor(props: Config_I) {
    // 全局配置信息
    this.config = deepMerge(DEFAULT_PROPS, props);
    this._checkPlugin(this.config.plugins);

    const { scrollbar } = this.config;
    let internalPlugins = {
      canvas: {
        class: Canvas,
        options: {
          namespace: "canvas",
          auto: true,
        },
      },
    };

    if (scrollbar)
      internalPlugins = Object.assign({}, internalPlugins, {
        scrollbar: {
          class: Scrollbar,
          options: {
            namespace: "scrollbar",
            auto: true,
            autoProps: scrollbar,
          },
        },
      });

    this.config.plugins = Object.assign({}, internalPlugins, this.config.plugins);

    // 初始化各个模块
    this.EMITTER = new Emitter();
    this.ERR = new Err();
    this.PLUGINS = new Plugins({
      err: this.ERR,
      core: this,
      emitter: this.EMITTER,
      config: this.config,
    });

    // 注册所有插件
    this._registerPlugins();
    // 运行自动执行的插件
    this._runAutoPlugins();

    // 将内置插件的实例绑定到Core上
    this._bindInsidePlugin();

    // 初始化
    this._initialized();
    // 监听事件
    this._listener();
  }

  _initialized() {
    const { fillStyle } = this.config.style;
    const { width, height, ratio } = this.canvas.getSize();
    this.width = width / ratio;
    this.height = height / ratio;
    this.viewWidth = this.width;
    this.viewHeight = this.height;

    this.canvas.el.style.border = `1px solid ${fillStyle}`;

    if (this.scrollbar) {
      const { weight } = this.scrollbar.options;

      if (this.scrollbar.hasHScrollbar) this.viewHeight -= weight;
      if (this.scrollbar.hasVScrollbar) this.viewWidth -= weight;
    }

    this.currentRowIndex = 0;
    this.DATA = new Data({
      width: this.viewWidth,
      height: this.height,
      data: this.config.data,
      emitter: this.EMITTER,
    });

    this.viewData = this.DATA.get();
    this.renderingData = this._filterRenderingData(this.viewData);
    // this.draw();
  }

  /**
   * 检查外部plugin是否占有内置插件的namespace
   *
   * @author FreMaNgo
   * @date 2019-08-13
   * @private
   * @param {PluginCollection_I} plugins 插件集合
   * @memberof Core
   */
  private _checkPlugin(plugins: PluginCollection_I) {
    if (!plugins) return;
    for (let key of Object.keys(plugins)) {
      if (INTERNAL_PLUGIN_NAMESPACES.indexOf(key) < 0) {
        this.ERR.pop(
          `please checked register plugin's namespace, you can't use [${INTERNAL_PLUGIN_NAMESPACES}] list name.`,
        );
      }
    }
  }

  /**
   * 注册外部插件
   *
   * @author FreMaNgo
   * @date 2019-07-30
   * @param {string} name 插件名，如果没有设置options.namespace属性，插件名作为namespace
   * @param {typeof Plugin} plugin 插件类
   * @param {RegisterOptions_I} [options] 插件配置信息
   * @returns {Core} 返回Core的实例
   * @memberof Core
   */
  registerPlugin(name: string, plugin: typeof Plugin, options?: RegisterOptions_I): Core {
    this.PLUGINS.register(name, plugin, options);
    return this;
  }

  getPluginInstance<T>(name: string) {
    return <T>this.PLUGINS.getInstance(name);
  }

  /**
   *
   *
   * @author FreMaNgo
   * @date 2019-07-30
   * @param {string} name 插件名
   * @param {*} options 插件的配置属性
   * @returns {Plugin} 返回插件的实例
   * @memberof Core
   */
  run(name: string, options: any): Plugin {
    return this.PLUGINS.run(name, options);
  }

  removeEvent(key: string, cb?: Function, target?: string) {
    this.EMITTER.del(key, cb, target);
    return this;
  }

  on(key: string, cb: Callback_I, target?: string) {
    this.EMITTER.on(key, cb, target);
    return this;
  }

  once(key: string, cb: Callback_I, target?: string) {
    this.EMITTER.once(key, cb, target);
    return this;
  }

  fire(key: string, props?: any[], namespace?: string) {
    this.EMITTER.fire(key, props, namespace);
    return this;
  }
  // 锁定
  lockedRow(key: Id_Type) {}
  lockedCol(key: Id_Type) {}
  // 插入
  /**
   * @description 实现对往表格的位置插入行
   * @param key 用于定位的行的key标识
   * @param data 需要被插入的行的信息
   *  逻辑思路书写：
   *    根据key找到位置—-> key 可能是 显示 或 不显示； 可能是父，可能是子；
   *    将数据添加到其后
   *        --->  可能插入一行，可能插入一组；
   *        --->  插入数据后，需要行程配套的层级结构
   *
   * @consider :
   *  需要考虑支持多行插入的情况
   *  插入数据之后，如何告知变动
   *
   * @remind ：
   *    思路1  直接在原始集合上操作
   *          rows.splice()
   *    思路2[未尝试]  在一个新的数组上操作，替换rows
   *        rows && rows.findIndex()
   */
  // todo (1)缺失测试（2）缺失数据变动后的告知（3）缺失移出相关的说明性质注释
  //todo 暂时注释掉关于插入方法的实现络，原因：数据结构存在变动，故策略也需要调整
  // insertRow(key: Id_Type, data: RowData_I | Array<RowData_I>): void {
  //   const originData = this.data;
  //   let rows = originData.items || [];

  //   const insertRowBykey: Function = (
  //     rows: Array<RowData_I>,
  //     key: Id_Type,
  //     data: RowData_I | Array<RowData_I>,
  //   ) => {
  //     const insertData = isArray(data) ? data : [data];
  //     rows &&
  //       rows.forEach((row: any, index: number) => {
  //         const rowChildren = row.children;
  //         const isExistChild = rowChildren && isArray(rowChildren);
  //         if (isExistChild) {
  //           insertRowBykey(rowChildren, key, insertData);
  //         } else {
  //           const rowKey = row.id || "";
  //           if (rowKey === key) {
  //             rows.splice(index, 0, ...insertData);
  //           }
  //         }
  //       });
  //   };
  //   // 第一步，根据key获取到行所在的位置;
  //   // 第二步，统一要插入的数据，在固定位置上加入；
  //   insertRowBykey(rows, key, data);
  //   // 第三步，[未实现]触发this.data 的更新（emitter); ==> 调用store 更新数据
  // }
  insertCol(key: Id_Type, data: any) {}
  // 删除
  delRow(key: Id_Type) {}
  delCol(key: Id_Type) {}
  // 隐藏
  hiddenRow(key: Id_Type) {}
  hiddenCol(key: Id_Type) {}
  // 替换
  replaceCell(key: Id_Type, data: any) {}
  replaceRow(key: Id_Type, data: any) {}
  replaceCol(key: Id_Type, data: any) {}
  // 合并
  mergeCell() {}
  mergeCol() {}
  mergeRow() {}
  // 解除合并
  brokenMergeCell() {}
  brokenMergeRow() {}
  brokenMergeCol() {}

  /**
   * 最终绘制的函数
   * 到这个位置，只需要知道绘制哪些线，哪些矩形，哪些文字
   * 不关心这些线、矩形、文字具体是什么
   * 传入的每个参数都为一个二维数组，根据不同的style划分不同集合
   * 绘制顺序 line -> rect -> text
   *
   * @author FreMaNgo
   * @date 2019-08-09
   * @memberof Core
   */
  draw(props: RenderingData_I = {}) {
    // 这里是执行Plugin内的beforeDraw方法，在渲染之前拿到viewData和rendingData
    // 最终渲染之前，最后一次修改rendingData的地方
    const handleMethods = this.PLUGINS.getBeforeDrawMethods();
    props = handleMethods.reduce((preVal, currentVal) => {
      return currentVal(this.viewData, preVal);
    }, props);

    const { line, rect, text } = props;
    // draw lines
    line &&
      line.forEach(lines => {
        const { data, style } = lines;
        this._drawLines(data, style);
      });
    // draw rects
    rect &&
      rect.forEach(rects => {
        const { data, style } = rects;
        this._drawRects(data, style);
      });
    // draw texts
    text &&
      text.forEach(texts => {
        const { data, style } = texts;
        this._drawTexts(data, style);
      });

    this.fire("didDraw");
  }

  /**
   * 绘制线条
   *
   * @author FreMaNgo
   * @date 2019-08-09
   * @private
   * @param {Line[]} lines
   * @param {LineStyle_I} [style]
   * @memberof Core
   */
  private _drawLines(lines: Line[], style?: LineStyle_I) {
    if (!style) {
      this.canvas.drawLine(lines);
    } else {
      const { color, lineWidth } = style;
      this.canvas.setAttrs(
        { fillStroke: color, lineWidth },
        {
          once: true,
          cb: () => {
            this.canvas.drawLine(lines);
          },
        },
      );
    }
  }

  /**
   * 绘制矩形
   *
   * @author FreMaNgo
   * @date 2019-08-09
   * @private
   * @param {Rect[]} rects
   * @param {RectStyle_I} [style]
   * @memberof Core
   */
  private _drawRects(rects: Rect[], style?: RectStyle_I) {
    if (!style) {
      this.canvas.drawRect(rects);
    } else {
      this.canvas.setAttrs(
        { fillStyle: style.color },
        {
          once: true,
          cb: () => {
            this.canvas.drawRect(rects);
          },
        },
      );
    }
  }

  /**
   * 绘制文字
   *
   * @author FreMaNgo
   * @date 2019-08-09
   * @private
   * @param {Text[]} texts
   * @param {TextStyle_I} [style]
   * @memberof Core
   */
  private _drawTexts(texts: Text[], style?: TextStyle_I) {
    if (!style) {
      this.canvas.drawText(texts);
    } else {
      const { color, ...args } = style;
      const fontStyle = generatorFont(args, this.canvas.fontStyle);

      this.canvas.setAttrs(
        { fillStyle: color, font: fontStyle },
        {
          once: true,
          cb: () => {
            this.canvas.drawText(texts);
          },
        },
      );
    }
  }

  /**
   * 绑定内置插件实例到this上
   *
   * @author FreMaNgo
   * @date 2019-08-09
   * @private
   * @memberof Core
   */
  private _bindInsidePlugin() {
    // canvas 插件
    this.canvas = <Canvas>this.PLUGINS.getInstance("canvas");
    this.scrollbar = <Scrollbar>this.PLUGINS.getInstance("scrollbar");
  }

  private _listener() {
    const el = this.canvas.el;

    el.addEventListener("wheel", e => {
      this.fire("wheel", [e]);
      e.preventDefault();
    });
    el.addEventListener("blur", e => {
      this.fire("blur", [e]);
    });
    el.addEventListener("focus", e => {
      this.fire("focus", [e]);
    });
    el.addEventListener("click", e => {
      this.fire("click", [e]);
    });
    el.addEventListener("dblclick", e => {
      this.fire("dbclick", [e]);
    });
    el.addEventListener("mousemove", e => {
      this.fire("mousemove", [e]);
    });
    el.addEventListener("mousedown", e => {
      this.fire("mousedown", [e]);
    });
    el.addEventListener("mouseup", e => {
      this.fire("mouseup", [e]);
    });
    el.addEventListener("keydown", e => {
      this.fire("keydown", [e]);
    });
    el.addEventListener("keyup", e => {
      this.fire("keyup", [e]);
    });
    el.addEventListener("keypress", e => {
      this.fire("keypress", [e]);
      e.preventDefault();
    });

    this.on(
      "changeViewOffset",
      result => {
        console.log("result: ", result);
      },
      "bar",
    ).on(
      "viewDataChange",
      viewData => {
        console.log("this viewData", viewData);
        this.viewData = viewData;
      },
      "_DATA_",
    );
  }

  /**
   * 过滤视图集合到渲染集合
   *
   * @author FreMaNgo
   * @date 2019-08-12
   * @private
   * @param {Data_I} data 视图集合
   * @memberof Core
   */
  private _filterRenderingData(data: Data_I): RenderingData_I {
    // todo 关于外层定义了，wrap为true，当齐换行的逻辑为true时的影响
    const { hidden, wrap } = data;
    if (hidden) {
      // 当viewdata中的最外层hidden为true时，直接返回空的渲染集合
      return {};
    }
    const line = this._getLine(data);
    console.info(line, "line");
    return { line };
  }
  /**
   * @description 根据数据集合获取需要绘制的线条的集合
   * @private
   * @param data Data_I 即viewData
   */
  private _getLine(data: Data_I): any {
    const { rows } = data;
    let result: Line_I[] = [];
    const coordinate: number[][][] = this._getCoordinate(rows);
    console.log(coordinate, "coordinate");
    return result;
  }

  /**
   *@description 构建参考点做构成的二维的坐标系
   * @private
   * @param {RowData_I} rows
   * @returns {number[]}
   * @memberof Core
   */
  private _getCoordinate(rows: RowData_I[]): number[][][] {
    let result: number[][][] = [];
    //todo 参考起点 需要考虑根据屏幕滚动变动计算
    const referenceStartPoint: number[] = [0, 0];
    let rowSizeArray =
      rows &&
      rows.map((row: RowData_I): number => {
        return row.size;
      });
    // 增加第0行的单元格的参考点的计算
    rowSizeArray.splice(0, 0, 0);
    rows &&
      rows.forEach((row: RowData_I, index: number) => {
        let rowPointArray: number[][] = [];
        const cells = <CellData_I[]>row.cells;
        const rowStartPoint: number[] = this._getPoint(
          "ROW",
          referenceStartPoint,
          index,
          rowSizeArray,
        );
        rowPointArray.push(rowStartPoint);

        const cellSizeArray: number[] =
          cells &&
          cells.map((cell: CellData_I): number => {
            return cell.size;
          });

        // const length = (cells && cells.length) || 0;
        // for (let i = 0; i < length; i++) {
        //   const point: number[] = this.getCellPoint(rowStartPoint, i, cellSizeArray);
        //   result.push(point);
        // }
        //todo:此处cell无用
        cells &&
          cells.forEach((cell: CellData_I, index: number) => {
            const point: number[] = this._getPoint("CELL", rowStartPoint, index, cellSizeArray);
            rowPointArray.push(point);
          });
        result.push(rowPointArray);
      });
    return result;
  }
  private _getPoint(
    type: string,
    referencePoint: number[],
    index: number,
    sizeArray: number[],
  ): number[] {
    let [x, y] = referencePoint;
    switch (type) {
      case "ROW":
        y = getSumByRange(sizeArray, 0, index);
        break;
      case "CELL":
        x = getSumByRange(sizeArray, 0, index);
        break;
      default:
        return [x, y];
    }
    return [x, y];
  }

  private _registerPlugins() {
    const { plugins } = this.config;

    for (let key of Object.keys(plugins)) {
      const { class: plugin, options } = plugins[key];
      this.PLUGINS.register(key, plugin, options);
    }
  }

  private _runAutoPlugins() {
    const plugins = this.PLUGINS.getAll();

    for (let key of plugins.keys()) {
      const plugin = plugins.get(key);
      const { auto, autoProps } = plugin.options;
      if (auto) this.PLUGINS.run(key, autoProps);
    }
  }
}

export default Core;
