import { Pos_Type } from "../types/common.type";
import Component from "./Component";

interface Props_I {
  pos: Pos_Type;
  value: string;
}

const PROPS: Props_I = {
  pos: [0, 0],
  value: "",
};

class Text extends Component {
  constructor(value: string, props: Props_I) {
    super(props);

    this.props = Object.assign({}, PROPS, this.props, {
      value,
    });
  }

  bind() {
    super.bind();

    this.on("click", () => {
      console.log("click");
    });
  }
}

export default Text;
