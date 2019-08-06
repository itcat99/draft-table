import { Pos_Type, Context_I } from "../../types/common.type";
import Rect from "../../components/Rect";
import Canvas from "../Canvas";
import Plugin from "../../modules/Plugin";
import { BarProps_I, BarType_Enum } from "./scrollbar.type";
import { rangeNum } from "../../helpers";

class Bar extends Plugin {
  pos: Pos_Type;
  isActive: boolean; // 鼠标按下并拖动时的状态
  isHover: boolean; // 鼠标是否悬停在bar上
  size: number; // 主要尺寸，纵向时为高度，横向时为长度
  weight: number; // 次要尺寸，纵向时为宽度，横向时为高度
  opacity: number; // 透明度
  type: BarType_Enum; // Bar的类型，横向或纵向
  attr: { pos: Pos_Type; width: number; height: number };
  handleAttr: { pos: Pos_Type; width: number; height: number };
  canvas: Canvas;
  rect: Rect;
  handle: Rect;
  private _color: string;
  private _handleColor: string;

  constructor(context: Context_I, options: BarProps_I) {
    super(context, options);

    const { pos, size, weight, opacity, type, canvas } = this.options;

    this.pos = pos;
    this.opacity = opacity;
    this.type = type;
    this.size = size;
    this.weight = weight;
    this.canvas = canvas;

    this._color = `rgba(100, 100, 100, ${opacity})`;
    this._handleColor = `rgba(100, 100, 100, ${opacity + 0.5})`;

    this.attr = {
      pos: this.pos,
      width: this.type === BarType_Enum.H ? this.size : this.weight,
      height: this.type === BarType_Enum.H ? this.weight : this.size,
    };

    this.rect = new Rect(this.attr);
    this.handle = this.createHandle();

    this.canvas.color(this._color, { id: "_SCROLLBAR_DEFAULT_" });

    this.render();
    this._listener();
  }

  createHandle(): Rect {
    const { handleWeight } = this.options;
    const { pos, width, height } = this.attr;

    let x = pos[0] + (width - handleWeight) / 2;
    let y = 0;
    let handleWidth = handleWeight;
    let handleHeight = 30;

    if (this.type === BarType_Enum.H) {
      x = 0;
      y = pos[1] + (height - handleWeight) / 2;
      handleHeight = handleWeight;
      handleWidth = 30;
    }

    this.handleAttr = { pos: [x, y], width: handleWidth, height: handleHeight };

    return new Rect(this.handleAttr);
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
    return this.attr;
  }

  render() {
    const { pos, width, height } = this.attr;

    this.canvas
      .clear(pos[0], pos[1], width, height)
      .drawRect([this.rect])
      .color(this._handleColor)
      .drawRect([this.handle]);
  }

  protected _listener() {
    super._listener();

    this.on(
      "wheel",
      ({ deltaX, deltaY }) => {
        const [x, y] = this.handle.getPos();

        if (this.type === BarType_Enum.H) {
          this.handle.setPos({ x: rangeNum(x + deltaX, 0, this.size - 30) });
        } else {
          this.handle.setPos({ y: rangeNum(y + deltaY, 0, this.size - 30) });
        }

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
          this.canvas.color(`rgba(100, 100, 100, ${this.opacity + 0.2})`);
        } else {
          this.canvas.el.style.cursor = "";
          this.canvas.color(this._color);
        }

        this.render();
      },
      "scrollbar",
    );
  }
}

export default Bar;
