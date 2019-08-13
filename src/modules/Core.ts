// import Emitter from "./Emitter";
import Emitter from "./Emitter";
import Plugins from "./Plugins";
import Plugin from "./Plugin";
import Err from "./Err";

import DEFAULT_PROPS from "../config";
import { INTERNAL_PLUGIN_NAMESPACES, ROW_DATA, DATA } from "../constants";

/* internal Plugins */
import Canvas from "plugins/Canvas";
import Scrollbar from "plugins/Scrollbar";

/* types */
import { Config_I, Id_Type } from "types/common.type";
import { LineStyle_I, RectStyle_I, TextStyle_I } from "types/style.type";
import { RegisterOptions_I, PluginCollection_I } from "types/plugins.type";
import {
  Data_I,
  RenderingData_I,
  RowData_I,
  CellData_I,
  FinalCollection_I,
} from "types/collections.type";
import { Callback_I } from "types/emitter.type";
import { deepMerge, generatorFont } from "helpers";

import Line from "components/Line";
import Rect from "components/Rect";
import Text from "components/Text";
import { isUndefined, isNull, isArray } from "util";

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
  width: number; // canvas宽度
  height: number; // canvas高度
  viewWidth: number; // 可绘制区域宽度
  viewHeight: number; // 可绘制区域高度
  data: Data_I; // 原始集合
  viewData: Data_I; // 视图集合
  renderingData: RenderingData_I;
  wrapperLines: FinalCollection_I<LineStyle_I, Line>;

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

    const { data, extraColCount, extraRowCount } = this.config;
    if (!data) {
      const { row, col, rowSize, colSize } = this.config;
    } else {
      this.data = this.parseData(this.config.data);

      this.viewData = this._filterViewData(
        this.data,
        this.viewWidth,
        this.height,
        extraRowCount,
        extraColCount,
      );
      this.renderingData = this._filterRenderingData(this.viewData);
    }

    this.draw();
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
   * 解析传入的data到原始集合
   *
   * @author FreMaNgo
   * @date 2019-08-13
   * @param {Data_I} data
   * @returns {Data_I}
   * @memberof Core
   */
  parseData(data: Data_I): Data_I {
    const _data = Object.assign({}, DATA, data);
    const { items, rowSize, colSize } = _data;
    const resultRows: RowData_I[] = [];

    items.forEach((row: RowData_I | string[] | number[], rowIndex: number) => {
      let _row: RowData_I;

      if (isArray(row)) {
        _row = Object.assign({}, ROW_DATA, {
          id: Symbol(),
          index: rowIndex,
          size: rowSize,
          items: this._parseItems(row),
        });
      } else {
        _row = Object.assign({}, ROW_DATA, <RowData_I>row);
        const { id, index, items } = _row;
        if (isNull(id) || isUndefined(id)) _row.id = Symbol();
        if (isNull(index) || isUndefined(index)) _row.index = rowIndex;
        // _row.items = this._parseItems(items);
      }

      resultRows.push(_row);
    });

    return data;
  }

  private _parseItems(cells: CellData_I[] | string[] | number[], options?: object) {}

  /**
   * 过滤原始集合到视图集合
   *
   * @author FreMaNgo
   * @date 2019-08-12
   * @private
   * @param {Data_I} data 原始集合
   * @param {number} width 渲染视图宽
   * @param {number} height 渲染视图高
   * @param {number} extraRowCount 额外行数量
   * @param {number} extraColCount 额外列数量
   * @returns {Data_I} 返回视图集合
   * @memberof Core
   */
  private _filterViewData(
    data: Data_I,
    width: number,
    height: number,
    extraRowCount: number,
    extraColCount: number,
  ): Data_I {
    return data;
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
