import { Line_I } from "types/plugins/canvas.types";
import { Pos_Type } from "types/common.type";
import Component from "modules/Component";

class Line extends Component {
  private _from: Pos_Type;
  private _to: Pos_Type;

  constructor(public props: Line_I) {
    super(props);
    const { from, to } = this.props;
    this._from = from;
    this._to = to;
  }

  getPos() {
    return { from: this._from, to: this._to };
  }

  setPos(from: Pos_Type, to: Pos_Type) {
    this._from = from;
    this._to = to;
  }
}

export default Line;
