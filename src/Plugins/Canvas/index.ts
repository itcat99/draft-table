import Plugin from "modules/Plugin";
import { isCanvas } from "helpers/is";

// components
import Text from "components/Text";
import Rect from "components/Rect";
import Line from "components/Line";

import StyleCollection from "plugins/Canvas/Style";

// types
import { Config_I, Context_I } from "types/common.type";
import { Font_I } from "types/style.type";
import { Attrs_I, Context2d_I, Color_Type, SetAttrsOptions_I } from "types/plugins/canvas.types";
import { generatorFont } from "helpers";
import { isNumber } from "util";

class Canvas extends Plugin {
  public config: Config_I;
  public el: HTMLCanvasElement;
  public ctx: Context2d_I;
  public fontStyle: string;

  private _styleCollection: StyleCollection;
  private _currentFontStyle: Font_I;
  private _ratio: number;

  constructor(context: Context_I, options: any) {
    super(context, options);

    const { config: originConfig } = this.context;
    const { plugins, ...args } = originConfig;

    this.config = args;
    this._styleCollection = new StyleCollection();

    this._initialized();
  }

  // ============ APIS ===================
  /**
   * 设置ctx的属性，并存在Style集合列表内
   * 如果配置了once，则设置的属性只生效一次，完成后设置的属性将会回滚
   * 如果配置了once和id，则生效一次，并回滚到id指定的属性
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {Attrs_I} attrs
   * @param {SetAttrsOptions_I} [opts]
   * @returns {Canvas}
   * @memberof Canvas
   */
  setAttrs(attrs: Attrs_I, opts?: SetAttrsOptions_I): Canvas {
    opts = opts || {};
    const { once, cb, id } = opts;

    if (once) {
      let cacheColorId = this._styleCollection.now().id;

      if (id && this._styleCollection.has(id)) {
        cacheColorId = id;
      }
      this._setAttrs(attrs, this.ctx);
      cb();
      this._setAttrs(this._styleCollection.get(cacheColorId), this.ctx);
    } else {
      id &&
        this._styleCollection.add({
          data: attrs,
          id,
        });

      this._setAttrs(attrs, this.ctx);
    }

    return this;
  }

  /**
   * 清除区域 如果没有变量，则清除整个画布
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {number} [x] x坐标
   * @param {number} [y] y坐标
   * @param {number} [w] 宽
   * @param {number} [h] 高
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  clear(x?: number, y?: number, w?: number, h?: number): Canvas {
    const { canvas } = this.ctx;

    x = x || 0;
    y = y || 0;
    w = w || canvas.width;
    h = h || canvas.height;

    this.ctx.clearRect(x, y, w, h);
    return this;
  }

  /**
   * 绘制线条
   *
   * @author FreMaNgo
   * @date 2019-08-01
   * @param {Line[]} lines 一个子项为Line类的数组
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  drawLine(lines: Line[]): Canvas {
    if (!lines.length) return;

    this.ctx.beginPath();
    lines.forEach(line => {
      const { from, to } = line.getPos();
      this.ctx.moveTo(...from);
      this.ctx.lineTo(...to);
    });
    this.ctx.stroke();

    return this;
  }

  /**
   * 绘制矩形
   *
   * @author FreMaNgo
   * @date 2019-08-01
   * @param {Rect[]} rects 一个子项为Rect类的数组
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  drawRect(rects: Rect[]): Canvas {
    if (!rects.length) return;

    rects.forEach(rect => {
      const { pos, width, height } = rect.get();
      const [x, y] = pos;

      this.ctx.fillRect(x, y, width, height);
    });

    return this;
  }

  /**
   * 绘制文字
   *
   * @author FreMaNgo
   * @date 2019-08-01
   * @param {Text[]} texts 一个子项为Text类的数组
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  drawText(texts: Text[]): Canvas {
    if (!texts.length) return;

    texts.forEach(text => {
      const { pos, value } = text.get();
      this.ctx.fillText(value, ...pos);
    });

    return this;
  }

  /**
   * 设置字体、区域填充的颜色
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {Color_Type} color ctx上下文可接受的颜色值或对象
   * @param {SetAttrsOptions_I} opts
   * @returns {Canvas}
   * @memberof Canvas
   */
  color(color: Color_Type, opts?: SetAttrsOptions_I): Canvas {
    return this._color(color, opts, false);
  }

  /**
   * 设置线条颜色
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {Color_Type} color ctx上下文可接受的颜色值或对象
   * @param {SetAttrsOptions_I} opts
   * @returns {Canvas}
   * @memberof Canvas
   */
  lineColor(color: Color_Type, opts?: SetAttrsOptions_I): Canvas {
    return this._color(color, opts, true);
  }

  /**
   * 设置线宽度
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {number} lineWidth 线宽 单位px
   * @param {SetAttrsOptions_I} opts
   * @returns {Canvas}
   * @memberof Canvas
   */
  lineWidth(lineWidth: number, opts?: SetAttrsOptions_I): Canvas {
    const style = { lineWidth };
    return this.setAttrs(style, opts);
  }

  /**
   * 设置font属性
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {Font_I} config
   * @param {SetAttrsOptions_I} opts
   * @returns {Canvas}
   * @memberof Canvas
   */
  font(config: Font_I, opts?: SetAttrsOptions_I): Canvas {
    this._currentFontStyle = Object.assign({}, this._currentFontStyle, config);
    return this.setAttrs({ font: generatorFont(this._currentFontStyle) }, opts);
  }

  /**
   * 回到选择的style状态
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {(number | Symbol | string)} key 选择的key， 可以是index或者id
   * @returns {Canvas}
   * @memberof Canvas
   */
  popStyle(key: string): Canvas {
    const style = this._styleCollection.pop(key);
    if (!style) return this;
    this._setAttrs(<object>style, this.ctx);
    return this;
  }

  /**
   * 设置canvas的尺寸
   *
   * @author FreMaNgo
   * @date 2019-08-05
   * @param {number} width 宽度 单位px
   * @param {number} height 高度 单位px
   * @memberof Canvas
   */
  setSize(width: number, height: number) {
    this.el.width = width * this._ratio;
    this.el.height = height * this._ratio;
    this.el.setAttribute("style", `width: ${width}px; height: ${height}px;`);
    this.ctx.scale(this._ratio, this._ratio);
    this.fire("resize", [{ width, height }]);
  }

  /**
   * 获取当前canvas 的大小和屏幕分辨率比值
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @returns
   * @memberof Canvas
   */
  getSize() {
    return { width: this.el.width, height: this.el.height, ratio: this._ratio };
  }

  // ============ PRIVATE METHODS ============

  /**
   * 初始化
   * 1. 新建canvas到DOM
   * 2. 格式化ctx的各项属性
   */
  private _initialized() {
    const { width, height, target, ratio, style, font: fontStyle } = this.config;

    this._ratio = ratio;

    if (isCanvas(target)) {
      this.el = <HTMLCanvasElement>target;
      this.ctx = this.el.getContext("2d");
    } else {
      const el = document.createElement("canvas");
      const ctx = el.getContext("2d");
      const scriptEl = target.querySelector("script");

      if (scriptEl) {
        target.insertBefore(el, scriptEl);
      } else {
        target.appendChild(el);
      }

      this.el = el;
      if (!this.el.tabIndex || this.el.tabIndex < 0) this.el.tabIndex = 0;
      this.ctx = ctx;
    }

    this.setSize(width, height);

    // set init attrs
    this._currentFontStyle = fontStyle;

    const font = generatorFont(this._currentFontStyle);
    this.setAttrs({ font, ...style }, { id: "_INIT_" });
    this.fire("initialized", []);
  }

  /**
   * 设置canvas颜色
   *
   * @author FreMaNgo
   * @date 2019-08-01
   * @param {(string | CanvasGradient | CanvasPattern)} color ctx上下文可接受的颜色值或对象
   * @param {boolean} stroke 如果为true，则设置描边色。默认为填充色
   * @param {Symbol | string} id
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  private _color(color: Color_Type, opts?: SetAttrsOptions_I, stroke?: boolean): Canvas {
    const style = stroke ? { strokeStyle: color } : { fillStyle: color };
    return this.setAttrs(style, opts);
  }

  /**
   * 设置ctx的属性
   *
   * @author FreMaNgo
   * @date 2019-08-01
   * @param {Attrs_I} attrs 属性对象
   * @param {Context2d_I} ctx canvas的context2d上下文
   * @memberof Canvas
   */
  private _setAttrs(attrs: Attrs_I, ctx: Context2d_I) {
    for (let key of Object.keys(attrs)) {
      const val = attrs[key];
      if (!isNumber(val) && !val) continue;
      if (key === "font") this.fontStyle = val;
      ctx[key] = val;
    }

    ctx.save();
  }
}

export default Canvas;
