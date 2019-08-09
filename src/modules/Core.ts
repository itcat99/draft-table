// import Emitter from "./Emitter";
import Emitter from "./Emitter";
import Plugins from "./Plugins";
import Plugin from "./Plugin";
import Err from "./Err";

import DEFAULT_PROPS from "../config";
import { INTERNAL_PLUGIN_NAMESPACES } from "../constants";

/* internal Plugins */
import Canvas from "plugins/Canvas";
import Scrollbar from "plugins/Scrollbar";

/* types */
import {
  Config_I,
  LineStyle_I,
  FinalCollection_I,
  RectStyle_I,
  TextStyle_I,
  DrawProps_I,
} from "types/common.type";
import { RegisterOptions_I, PluginCollection_I } from "types/plugins.type";
import { Callback_I } from "types/emitter.type";
import { deepMerge, generatorFont } from "helpers";
import { Line_I, Rect_I, Text_I } from "types/plugins/canvas.types";
import Line from "components/Line";
import Rect from "components/Rect";
import Text from "components/Text";

class Core {
  public COLLECTIONS: any;
  public STORE: any;
  public EMITTER: Emitter;
  public PLUGINS: Plugins;
  public ERR: Err;

  public config: Config_I;
  public pluginInstances: {
    [namespace: string]: Plugin;
  };

  public canvas: Canvas;
  public scrollbar: Scrollbar;

  /**
   * 初始化：emitter,plugins,collection,store,err
   * 注册全局监听
   * @author FreMaNgo
   * @date 2019-07-29
   * @param {Config_I} props
   * @memberof Core
   */
  constructor(props: Config_I) {
    this.pluginInstances = {};

    // 内置模块
    const internalPlugins = {
      canvas: {
        class: Canvas,
        options: {
          namespace: "canvas",
          auto: true,
        },
      },
      scrollbar: {
        class: Scrollbar,
        options: {
          namespace: "scrollbar",
          auto: true,
        },
      },
    };

    let plugins = { ...internalPlugins };
    if (props && props.plugins) {
      this._checkPlugin(props.plugins);

      plugins = Object.assign({}, plugins, props.plugins);
    }
    // 全局配置信息
    this.config = deepMerge(DEFAULT_PROPS, Object.assign({}, props, { plugins }));
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

    // 监听事件
    this._listener();
  }

  private _checkPlugin(plugins: PluginCollection_I) {
    for (let key of Object.keys(plugins)) {
      if (INTERNAL_PLUGIN_NAMESPACES.indexOf(key) < 0) {
        this.ERR.pop(
          `please checked register plugin's namespace, [${INTERNAL_PLUGIN_NAMESPACES}] list is not use.`,
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
    const instance = this.PLUGINS.run(name, options);
    this.pluginInstances[name] = instance;

    return instance;
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
  lockedRow() {}
  lockedCol() {}
  // 插入
  insertRow() {}
  insertCol() {}
  // 删除
  delRow() {}
  delCol() {}
  // 隐藏
  hiddenRow() {}
  hiddenCol() {}
  // 替换
  replaceCell() {}
  replaceRow() {}
  replaceCol() {}
  // 合并
  mergeCell() {}
  mergeCol() {}
  mergeRow() {}
  // 解除合并
  brokenMergeCell() {}
  brokenMergeRow() {}
  brokenMergeCol() {}

  // 裁剪显示区域绘制数据
  slice() {}

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
  draw(props: DrawProps_I) {
    const handleMethods = this.PLUGINS.getBeforeDrawMethods();
    props = handleMethods.reduce((preVal, currentVal) => {
      return currentVal(preVal);
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
      const { color, weight } = style;
      this.canvas.setAttrs(
        { fillStroke: color, lineWeight: weight },
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
      if (auto) this.pluginInstances[key] = this.PLUGINS.run(key, autoProps);
    }
  }
}

export default Core;
