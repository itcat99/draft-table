import { Pos_Type, Context_I } from "types/common.type";
import Rect from "components/Rect";
import Canvas from "plugins/Canvas";
import Plugin from "modules/Plugin";
import { BarProps_I, BarType_Enum } from "types/plugins/scrollbar.type";
import { rangeNum } from "helpers";
import { Color_Type } from "types/plugins/canvas.types";

interface BarAttr_I {
  pos: Pos_Type;
  width: number;
  height: number;
}

interface HandleAttr_I extends BarAttr_I {}

class Bar extends Plugin {
  type: BarType_Enum; // Bar的类型，横向或纵向size
  canvas: Canvas;
  bar: Rect;
  handle: Rect;

  private _color: Color_Type;
  private _handleColor: Color_Type;
  private _activeColor: Color_Type;

  private _barAttr: BarAttr_I;
  private _handleAttr: HandleAttr_I;

  length: number; // 总尺寸
  size: number; // 主要尺寸，纵向时为高度，横向时为长度
  weight: number; // 次要尺寸，纵向时为宽度，横向时为高度
  offset: number; // handle 在 bar 内的偏移量 单位 px
  viewOffset: number; // 视图在总区域被的偏移量 单位 px
  viewSize: number; // 视图的长度 纵向时为高度，横向时为长度
  handleSize: number; // 把手的主要尺寸，纵向时为高度，横向时为长度 计算得出

  origin: Pos_Type; // 原点坐标

  isActive: boolean; // 鼠标按下并拖动时的状态
  isHover: boolean; // 鼠标是否悬停在bar上

  constructor(context: Context_I, public options: BarProps_I) {
    super(context, options);

    const { color } = this.options;
    this.canvas = <Canvas>this.getPlugin("canvas");

    this._init();

    this.canvas.color(color, { id: "_SCROLLBAR_DEFAULT_" });

    this.render();
    this._listener();
  }

  private _init() {
    const { type, color, handleColor, activeColor, size, length, origin } = this.options;

    this.origin = origin;
    this.length = length;
    this.size = size;
    this.type = type;
    this._color = color;
    this._handleColor = handleColor;
    this._activeColor = activeColor;
    this.viewOffset = 0; // 初始化默认视图偏移量为0

    this._updateViewSize();
    this._updateOffsetWithView();
    this.bar = this._createBar();
    this.handle = this._createHandle();
  }

  private _createBar(): Rect {
    const { origin, size, weight } = this.options;
    this._barAttr = {
      pos: origin,
      width: weight,
      height: size,
    };

    if (this.type === BarType_Enum.H) {
      this._barAttr.width = size;
      this._barAttr.height = weight;
    }

    return new Rect(this._barAttr);
  }

  private _createHandle(): Rect {
    const { handleWeight } = this.options;
    const { pos, width, height } = this._barAttr;

    let x = pos[0] + (width - handleWeight) / 2;
    let y = this.offset;
    let handleWidth = handleWeight;
    this.handleSize = this._generatorHandleSize();
    let handleHeight = this.handleSize;

    if (this.type === BarType_Enum.H) {
      x = this.offset;
      y = pos[1] + (height - handleWeight) / 2;
      handleHeight = handleWeight;
      handleWidth = this.handleSize;
    }

    this._handleAttr = {
      pos: [x, y],
      width: handleWidth,
      height: handleHeight,
    };

    return new Rect(this._handleAttr);
  }

  private _generatorHandleSize() {
    return (this.viewSize / this.length) * this.size;
  }

  /**
   * 用视图上偏移量更新视图偏移量和handle偏移量
   *
   * @author FreMaNgo
   * @date 2019-08-08
   * @private
   * @param {number} [deltaSize=0] viewOffset 偏移量
   * @memberof Bar
   */
  private _updateOffsetWithView(deltaSize: number = 0) {
    this.viewOffset = rangeNum(this.viewOffset + deltaSize, 0, this.length - this.viewSize);
    this.offset = (this.viewOffset / this.length) * this.size;
  }

  /**
   * 用bar上的偏移量更新视图偏移量和handle偏移量
   *
   * @author FreMaNgo
   * @date 2019-08-08
   * @private
   * @param {number} offset
   * @memberof Bar
   */
  private _updateOffsetWithBar(offset: number) {
    this.offset = rangeNum(offset - this.handleSize / 2, 0, this.size - this.handleSize);
    this.viewOffset = (this.offset / this.size) * this.length;
  }

  /**
   * 更新视图的尺寸 V时指canvas高度， H时指宽度
   *
   * @author FreMaNgo
   * @date 2019-08-08
   * @private
   * @memberof Bar
   */
  private _updateViewSize() {
    const { width, height, ratio } = this.canvas.getSize();
    this.viewSize = this.type === BarType_Enum.H ? width / ratio : height / ratio;
  }

  /**
   * 获取坐标和长宽属性
   *
   * @author FreMaNgo
   * @date 2019-08-05
   * @returns
   * @memberof Bar
   */
  get() {
    return this._barAttr;
  }

  render() {
    const { pos, width, height } = this._barAttr;

    if (this.isHover) this.canvas.color(this._activeColor);

    this.canvas
      .clear(pos[0], pos[1], width, height)
      .drawRect([this.bar])
      .color(this._handleColor)
      .drawRect([this.handle]);
  }

  protected _listener() {
    super._listener();

    this.on(
      "wheel",
      ({ deltaX, deltaY }) => {
        let deltaOffset = deltaY,
          posType = "y";

        if (this.type === BarType_Enum.H) {
          deltaOffset = deltaX;
          posType = "x";
        }
        this._updateOffsetWithView(deltaOffset);
        this.handle.setPos({ [posType]: this.offset });
        this.canvas.popStyle("_SCROLLBAR_DEFAULT_");
        this.render();
      },
      "scrollbar",
    );

    this.on(
      "hover",
      result => {
        const cacheIsHover = this.isHover;
        const { v, h } = result;

        if (this.type === BarType_Enum.V) {
          this.isHover = v;
        } else {
          this.isHover = h;
        }

        if (this.isHover === cacheIsHover) return;

        if (this.isHover) {
          this.canvas.el.style.cursor = "pointer";
          this.canvas.color(this._activeColor);
          this.on("click", this._onClick);
          this.on("mousedown", this._onMousedown);
        } else {
          this.canvas.el.style.cursor = "";
          this.canvas.popStyle("_SCROLLBAR_DEFAULT_");
          this.removeEvent("click", this._onClick);
          this.removeEvent("mousedown", this._onMousedown);
          this.removeEvent("mouseup", this._onMouseup);
          this.removeEvent("mousemove", this._onMousemove);
        }

        this.render();
      },
      "scrollbar",
    );

    this.on(
      "blur",
      () => {
        this.removeEvent("click", this._onClick);
        this.removeEvent("mousedown", this._onMousedown);
        this.removeEvent("mouseup", this._onMouseup);
        this.removeEvent("mousemove", this._onMousemove);
      },
      "_GLOBAL_",
    );
  }

  _onMousedown = (e: MouseEvent) => {
    this.on("mousemove", this._onMousemove);
    this.on("mouseup", this._onMouseup);
  };

  _onMousemove = (e: MouseEvent) => {
    const offset =
      this.type === BarType_Enum.H ? e.offsetX - this.origin[0] : e.offsetY - this.origin[1];
    this._updateOffsetWithBar(offset);

    const nextOffset = { [this.type === BarType_Enum.H ? "x" : "y"]: this.offset };
    this.handle.setPos(nextOffset);
    this.fire("changeViewOffset", [{ type: this.type, offset: this.viewOffset }], "bar");
    this.canvas.popStyle("_SCROLLBAR_DEFAULT_");
    this.render();
  };

  _onMouseup = (e: MouseEvent) => {
    this.removeEvent("mousemove", this._onMousemove);
  };

  _onClick = (e: MouseEvent) => {
    const offset =
      this.type === BarType_Enum.H ? e.offsetX - this.origin[0] : e.offsetY - this.origin[1];
    this._updateOffsetWithBar(offset);

    const nextOffset = { [this.type === BarType_Enum.H ? "x" : "y"]: this.offset };

    this.handle.setPos(nextOffset);
    this.fire("changeViewOffset", [{ type: this.type, offset: this.viewOffset }], "bar");
    this.canvas.popStyle("_SCROLLBAR_DEFAULT_");
    this.render();
  };
}

export default Bar;
