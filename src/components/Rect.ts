import { Rect_I } from "../Plugins/Canvas/canvas.types";
import { Pos_Type } from "../types/common.type";
import Component from "../modules/Component";

class Rect extends Component {
  private _pos: Pos_Type;
  private _width: number;
  private _height: number;

  constructor(public props: Rect_I) {
    super(props);
    const { pos, width, height } = this.props;

    this._pos = pos;
    this._width = width;
    this._height = height;
  }

  getPos() {
    return this._pos;
  }

  setPos({ x, y }: { x?: number; y?: number }) {
    const nextX = x || this._pos[0];
    const nextY = y || this._pos[1];

    const pos: Pos_Type = [nextX, nextY];
    this._pos = pos;
  }

  getSize() {
    return { width: this._width, height: this._height };
  }

  get() {
    return { pos: this.getPos(), ...this.getSize() };
  }
}

export default Rect;