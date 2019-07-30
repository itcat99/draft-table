import { Config_I, Context_I } from "../../types/common.type";
import { isCanvas } from "../../helpers/is";
import Plugin from "../../modules/Plugin";
import { Attrs_I, Context2d_I } from "./canvas.types";

class Canvas extends Plugin {
  public config: Config_I;
  el: HTMLCanvasElement;
  ctx: Context2d_I;

  constructor(context: Context_I, options: any) {
    super(context, options);

    const { config: originConfig } = this.context;
    const { plugins, ...args } = originConfig;

    this.config = args;
    this.initialized();
    this.listener();
  }

  /**
   * 初始化
   * 1. 新建canvas到DOM
   * 2. 格式化ctx的各项属性
   */
  initialized() {
    console.log("canvas");
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

    const font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize}px/${lineHeight}px ${fontFamily}`;
    this.setAttrs({ font }, this.ctx);

    this.setAttrs({ font, ...args }, this.ctx);
  }

  setAttrs(attrs: Attrs_I, ctx: Context2d_I) {
    for (let key of Object.keys(attrs)) {
      const val = attrs[key];
      ctx[key] = val;
    }

    ctx.save();
  }

  listener() {
    this.el.addEventListener("mousemove", e => {
      this.fire("mousemove", [e]);
    });
    this.el.addEventListener("click", e => {
      this.fire("click", [e]);
    });
  }

  // setAttrs(props, ctx) {
  //   for (let key of Object.keys(props)) {
  //     const val = props[key];

  //     ctx[key] = val;
  //   }

  //   ctx.save();
  // }

  /**
   * 绘制线条
   * @param {line[]} lines 一个子项为line结构的数组
   * @return {CanvasRenderingContext2D} 返回当前的ctx上下文
   */
  // drawLine(lines) {
  //   if (!lines.length) return false;

  //   this.ctx.beginPath();
  //   lines.forEach(line => {
  //     const { from, to } = line.get();
  //     this.ctx.moveTo(...from);
  //     this.ctx.lineTo(...to);
  //   });
  //   this.ctx.stroke();

  //   return this.ctx;
  // }

  /**
   * 绘制矩形
   * @param {rect[]} rects 一个子项为rect结构的数组
   * @return {CanvasRenderingContext2D} 返回当前的ctx上下文
   */
  // drawRect(rects) {
  //   if (!rects.length) return false;

  //   rects.forEach(rect => {
  //     const { pos, width, height } = rect.get();
  //     this.ctx.fillRect(...pos, width, height);
  //   });

  //   return this.ctx;
  // }

  /**
   * 绘制文字
   * @param {text[]} texts 一个子项为text结构的数组
   * @return {CanvasRenderingContext2D} 返回当前的ctx上下文
   */
  // drawText(texts) {
  //   if (!texts.length) return false;

  //   texts.forEach(text => {
  //     const { pos, value } = text.get();
  //     this.ctx.fillText(value, ...pos);
  //   });

  //   return this.ctx;
  // }
}

export default Canvas;
