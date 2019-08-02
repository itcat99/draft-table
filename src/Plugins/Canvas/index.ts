import Plugin from "../../modules/Plugin";
import { isCanvas } from "../../helpers/is";

// components
import Text from "../../components/Text";
import Rect from "../../components/Rect";
import Line from "../../components/Line";

import StyleCollection from "./Style";

// types
import { Config_I, Context_I } from "../../types/common.type";
import { Attrs_I, Context2d_I, Font_I } from "./canvas.types";

type color_Type = string | CanvasGradient | CanvasPattern;

class Canvas extends Plugin {
  public config: Config_I;
  public el: HTMLCanvasElement;
  public ctx: Context2d_I;
  private _styleCollection: StyleCollection;
  private _currentFontStyle: Font_I;

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
   *
   * @author FreMaNgo
   * @date 2019-08-01
   * @param {Attrs_I} attrs 属性对象
   * @param {Symbol | string} id 储存的id
   * @memberof Canvas
   */
  setAttrs(attrs: Attrs_I, id: Symbol | string): Canvas {
    this._styleCollection.add({
      data: attrs,
      id,
    });

    this._setAttrs(attrs, this.ctx);

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

    x = x | 0;
    y = y | 0;
    w = w | canvas.width;
    h = h | canvas.height;

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
   * @date 2019-08-02
   * @param {color_Type} color ctx上下文可接受的颜色值或对象
   * @param {Symbol | string} id
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  color(color: color_Type, id?: Symbol | string): Canvas {
    return this._color(color, false, id);
  }

  /**
   * 设置线条颜色
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {color_Type} color ctx上下文可接受的颜色值或对象
   * @param {Symbol | string} id
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  lineColor(color: color_Type, id?: Symbol | string): Canvas {
    return this._color(color, true, id);
  }

  /**
   * 设置线宽度
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {number} lineWidth 线宽 单位px
   * @param {Symbol | string} id
   * @returns
   * @memberof Canvas 返回当前实例
   */
  lineWidth(lineWidth: number, id: Symbol | string): Canvas {
    const style = { lineWidth };
    return this.setAttrs(style, id);
  }

  /**
   * 设置font属性
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {Font_I} opts
   * @param {(Symbol | string)} id
   * @returns {Canvas}
   * @memberof Canvas
   */
  font(opts: Font_I, id?: Symbol | string): Canvas {
    this._currentFontStyle = Object.assign({}, this._currentFontStyle, opts);
    const font = { font: this._normailzeFont(this._currentFontStyle) };
    console.log("font: ", font);
    return this.setAttrs(font, id);
  }

  /**
   * 回到上一个保存的style状态
   *
   * @author FreMaNgo
   * @date 2019-08-01
   * @returns {Canvas} 返回当前实例
   * @memberof Canvas
   */
  prevStyle(): Canvas {
    const style = this._styleCollection.prev();
    this._setAttrs(style, this.ctx);

    return this;
  }

  /**
   * 回到下一个保存的style状态
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @returns {Canvas}
   * @memberof Canvas
   */
  nextStyle(): Canvas {
    const style = this._styleCollection.next();
    this._setAttrs(style, this.ctx);

    return this;
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
  popStyle(key: number | Symbol | string): Canvas {
    const style = this._styleCollection.pop(key);
    this._setAttrs(style, this.ctx);
    return this;
  }

  // ============ PRIVATE METHODS ============

  /**
   * 初始化
   * 1. 新建canvas到DOM
   * 2. 格式化ctx的各项属性
   */
  private _initialized() {
    const { width, height, target, ratio, ...styles } = this.config;

    if (isCanvas(target)) {
      target.setAttribute("style", `width: ${width}px; height: ${height}px;`);
      (<HTMLCanvasElement>target).width = width * ratio;
      (<HTMLCanvasElement>target).height = height * ratio;

      this.el = <HTMLCanvasElement>target;
      this.ctx = this.el.getContext("2d");
    } else {
      const el = document.createElement("canvas");
      el.width = width * ratio;
      el.height = height * ratio;
      el.setAttribute("style", `width: ${width}px; height: ${height}px;`);

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

    this.ctx.scale(ratio, ratio);

    // set init attrs
    const {
      fontSize,
      lineHeight,
      fontFamily,
      fontWeight,
      fontStyle,
      fontVariant,
      fontStretch,
      ...args
    } = styles;

    this._currentFontStyle = {
      size: fontSize,
      family: fontFamily,
      lineHeight,
      weight: fontWeight,
      style: fontStyle,
      variant: fontVariant,
      stretch: fontStretch,
    };

    const font = this._normailzeFont(this._currentFontStyle);

    this.setAttrs({ font, ...args }, "_INIT_");
  }

  private _normailzeFont(opts: Font_I) {
    const { variant, weight, stretch, family, style, lineHeight } = opts;
    let { size } = opts;

    if (typeof size === "number") size = `${size}px`;

    return `${style} ${variant} ${weight} ${stretch} ${size}/${lineHeight} ${family}`;
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
  private _color(color: color_Type, stroke?: boolean, id?: Symbol | string): Canvas {
    const style = stroke ? { strokeStyle: color } : { fillStyle: color };
    return this.setAttrs(style, id);
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
      ctx[key] = val;
    }

    ctx.save();
  }
}

export default Canvas;
