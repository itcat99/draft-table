import Plugin from "../../modules/Plugin";
import Canvas from "../Canvas";
import Bar from "./bar";

// types
import { Context_I, Pos_Type } from "../../types/common.type";
import { isInside } from "../../helpers/is";
import { ScrollbarProps_I, BarType_Enum } from "./scrollbar.type";

const DEFAULT: ScrollbarProps_I = {
  vScrollbar: true,
  hScrollbar: true,
  vPos: 0,
  hPos: 0,
  vSize: 600,
  hSize: 800,
  weight: 12,
  handleWeight: 10,
  delay: 300,
  opacity: 0.2,
  fixed: false,
};

class Scrollbar extends Plugin {
  private _canvas: Canvas;
  private _color: string;
  private _vScrollbar: Bar;
  private _hScrollbar: Bar;

  public options: ScrollbarProps_I;
  public hasVScrollbar: boolean;
  public hasHScrollbar: boolean;
  public vSize: number;
  public hSize: number;

  constructor(context: Context_I, options: any) {
    super(context, options);
    const { plugins } = this.context;
    this.options = Object.assign({}, DEFAULT, options);

    const { vScrollbar, hScrollbar, vSize, hSize, weight } = this.options;
    this.hasVScrollbar = vScrollbar;
    this.hasHScrollbar = hScrollbar;

    this.vSize = vSize;
    this.hSize = hSize;

    if (vScrollbar && hScrollbar) {
      this.vSize -= weight;
      this.hSize -= weight;
    }

    this._canvas = <Canvas>plugins.getInstance("canvas");

    this._initialized();
    this._listener();
  }
  // ============= APIs ============= //
  // ============= Private Methods ============= //
  private _initialized() {
    this._canvas.color(this._color, {
      id: "_SCROLLBAR_DEFAULT_",
    });

    const { vScrollbar, hScrollbar } = this.options;
    vScrollbar && this._initVScrollbar();
    hScrollbar && this._initHScrollbar();
  }

  /**
   * 绘制纵向滚动条
   *
   * @author FreMaNgo
   * @date 2019-08-05
   * @private
   * @memberof Scrollbar
   */
  private _initVScrollbar() {
    const { vPos, weight, handleWeight, opacity } = this.options;
    const x = parseInt(this._canvas.el.style.width, 10) - weight;
    const y = 0;

    this._vScrollbar = new Bar(this.context, {
      pos: [x, y],
      size: this.vSize,
      weight,
      canvas: this._canvas,
      type: BarType_Enum.V,
      opacity,
      handleWeight,
    });
  }

  /**
   * 绘制横向滚动条
   *
   * @author FreMaNgo
   * @date 2019-08-05
   * @private
   * @memberof Scrollbar
   */
  private _initHScrollbar() {
    const { vPos, weight, handleWeight, opacity } = this.options;
    const x = 0;
    const y = parseInt(this._canvas.el.style.height, 10) - weight;

    this._hScrollbar = new Bar(this.context, {
      pos: [x, y],
      size: this.hSize,
      weight,
      canvas: this._canvas,
      type: BarType_Enum.H,
      opacity,
      handleWeight,
    });
  }

  protected _listener() {
    super._listener();

    this.on(
      "mousemove",
      (e: MouseEvent) => {
        const { offsetX, offsetY } = e;
        const pos: Pos_Type = [offsetX, offsetY];
        let insideV = false,
          insideH = false;

        if (this._vScrollbar) insideV = isInside(pos, this._vScrollbar.get());
        if (this._hScrollbar) insideH = isInside(pos, this._hScrollbar.get());

        this.fire("hover", [{ v: insideV, h: insideH }]);
      },
      "_GLOBAL_",
    );

    this.on(
      "wheel",
      (e: WheelEvent) => {
        const { deltaY, deltaX } = e;

        this.fire("wheel", [{ deltaY, deltaX }]);
      },
      "_GLOBAL_",
    );
  }
}

export default Scrollbar;
