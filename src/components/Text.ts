import { Text_I } from "../Plugins/Canvas/canvas.types";
import { Pos_Type } from "../types/common.type";
import Component from "../modules/Component";

class Text extends Component {
  private _pos: Pos_Type;
  private _value: string;

  constructor(public props: Text_I) {
    super(props);
    const { pos, value } = this.props;

    this._pos = pos;
    this._value = value;
  }

  getPos() {
    return this._pos;
  }

  getValue() {
    return this._value;
  }

  get() {
    return { pos: this.getPos(), value: this.getValue() };
  }
}

export default Text;
