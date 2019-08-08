import Plugin from "modules/Plugin";
import Canvas from "plugins/Canvas";
import Bar from "./bar";

// types
import { Context_I, Pos_Type } from "types/common.type";
import { isInside } from "helpers/is";
import { ScrollbarProps_I, BarType_Enum, BarProps_I } from "types/plugins/scrollbar.type";

const DEFAULT = {
  vScrollbar: true,
  hScrollbar: true,
  vPos: 0,
  hPos: 0,
  weight: 16,
  handleWeight: 12,
  color: "#f1f1f1",
  handleColor: "#111111",
  activeColor: "#d1d1d1",
  vLength: 1000,
  hLength: 1200,
};

class Scrollbar extends Plugin {
  private _canvas: Canvas;
  private _vScrollbar: Bar;
  private _hScrollbar: Bar;
  private _initVScrollbar: boolean;
  private _initHScrollbar: boolean;

  public options: ScrollbarProps_I;
  public hasVScrollbar: boolean;
  public hasHScrollbar: boolean;
  public vSize: number;
  public hSize: number;

  constructor(context: Context_I, options: ScrollbarProps_I) {
    super(context, options);
    const { plugins } = this.context;
    this.options = Object.assign({}, DEFAULT, options);
    this._canvas = <Canvas>plugins.getInstance("canvas");

    this._check();
    this._listener();
  }
  // ============= APIs ============= //
  // ============= Private Methods ============= //
  private _check() {
    const { vLength, vScrollbar, hLength, hScrollbar } = this.options;
    const { width, height, ratio } = this._canvas.getSize();

    this._initVScrollbar = vScrollbar && vLength > height / ratio;
    this._initHScrollbar = hScrollbar && hLength > width / ratio;

    if (this._initVScrollbar || this._initHScrollbar) this._initialized();
  }

  private _initialized() {
    this.options = this._normalizedOpts();

    if (this._initHScrollbar) {
      this._hScrollbar = new Bar(this.context, this._generateScrollbarProps(BarType_Enum.H));
    }

    if (this._initVScrollbar) {
      this._vScrollbar = new Bar(this.context, this._generateScrollbarProps(BarType_Enum.V));
    }
  }

  /**
   * 格式化options
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @private
   * @returns
   * @memberof Scrollbar
   */
  private _normalizedOpts() {
    const { weight, vOrigin, hOrigin, vSize, hSize } = this.options;
    const canvasSize = this._canvas.getSize();
    const canvasWidth = canvasSize.width / canvasSize.ratio;
    const canvasHeight = canvasSize.height / canvasSize.ratio;
    const normalizedOPts: { [key: string]: any } = {};

    if (!vOrigin) normalizedOPts.vOrigin = [canvasWidth - weight, 0];
    if (!hOrigin) normalizedOPts.hOrigin = [0, canvasHeight - weight];
    if (!hSize) normalizedOPts.vSize = canvasHeight;
    if (!vSize) normalizedOPts.hSize = canvasWidth;

    const result = Object.assign({}, this.options, normalizedOPts);
    if (this._initHScrollbar && this._initVScrollbar) {
      const { vSize, hSize } = result;
      result.vSize = vSize - weight;
      result.hSize = hSize - weight;
    }

    return result;
  }

  /**
   * 获取不同type创建bar时所需的配置属性
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @private
   * @param {string} type
   * @returns
   * @memberof Scrollbar
   */
  private _generateScrollbarProps(type: BarType_Enum): BarProps_I {
    const keys = ["origin", "length", "size"];
    const result: { [key: string]: any } = {};

    keys.forEach(key => {
      const targetKey = this._getExclusiveAttr(type, key);
      result[key] = this.options[targetKey];
    });

    const { weight, color, handleColor, handleWeight, activeColor } = this.options;

    return {
      type,
      origin: result.origin,
      length: result.length,
      size: result.size,
      weight,
      color,
      handleColor,
      handleWeight,
      activeColor,
    };
  }

  /**
   * 获取不同类型的scollbar专有属性
   *
   * @author FreMaNgo
   * @date 2019-08-07
   * @private
   * @param {BarType_Enum} type scrollbar类型
   * @param {string} name 属性名
   * @returns
   * @memberof Scrollbar
   */
  private _getExclusiveAttr(type: BarType_Enum, name: string) {
    return `${type}${name.slice(0, 1).toUpperCase()}${name.slice(1)}`;
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
