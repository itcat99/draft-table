// import Emitter from "./Emitter";
import Emitter from "./Emitter";
import Plugins from "./Plugins";
import Plugin from "./Plugin";
import Err from "./Err";

import DEFAULT_PROPS from "../config";
import {
  INTERNAL_PLUGIN_NAMESPACES,
  ROW_DATA,
  DATA,
  ORIGIN_X,
  ORIGIN_Y,
  CELL_DATA,
} from "../constants";

/* internal Plugins */
import Canvas from "plugins/Canvas";
import Scrollbar from "plugins/Scrollbar";

/* types */
import { Config_I, Id_Type } from "types/common.type";
import { LineStyle_I, RectStyle_I, TextStyle_I } from "types/style.type";
import { RegisterOptions_I, PluginCollection_I } from "types/plugins.type";
import {
  CellData_I,
  CellDataArr_Type,
  Data_I,
  FinalCollection_I,
  RenderingData_I,
  RowData_I,
  RowDataArr_Type,
} from "types/collections.type";
import { Callback_I } from "types/emitter.type";
import { deepMerge, generatorFont } from "helpers";

import Line from "components/Line";
import Rect from "components/Rect";
import Text from "components/Text";
import { isArray, isNumber, isString } from "util";
import { BarType_Enum } from "types/plugins/scrollbar.type";

class Core {
  public COLLECTIONS: any;
  public STORE: any;
  public EMITTER: Emitter;
  public PLUGINS: Plugins;
  public ERR: Err;

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
    this.data = this._parseData(this.config.data);
    this.viewData = this._getViewData();

    console.log("this.viewData", this.viewData);
    console.log("this.data: ", this.data);
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
  insertRow(key: Id_Type, data: any) {}
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

  // 裁剪显示区域绘制数据
  slice(rows: any, cols: any, width: number, height: number) {}

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
    );
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
  private _parseData(data: Data_I, deep: number = 0): Data_I {
    const _data = Object.assign({}, DATA, data, { deep });
    const { items } = _data;

    _data.items = <RowData_I[]>this._normailzedRows(items, deep);
    return _data;
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
        _row.children = this._parseData(children, deep + 1);
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
   * 过滤原始集合到视图集合
   *
   * @author FreMaNgo
   * @date 2019-08-12
   * @private
   * @returns {Data_I} 返回视图集合
   * @memberof Core
   */
  private _getViewData(offset: number = 0, direction: BarType_Enum = BarType_Enum.H): Data_I {
    const height = this.viewHeight,
      width = this.viewWidth,
      originData = this.data;

    const { items, ...otherProps } = originData;
    const resultData: Data_I = { ...otherProps };
    const resultRows: RowData_I[] = [];

    return resultData;
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
    return {};
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
