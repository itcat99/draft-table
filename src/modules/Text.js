import Component from "./Component";

const PROPS = {
  pos: [0, 0],
};

class Text extends Component {
  constructor(value, props) {
    super(props);

    this.props = Object.assign({}, PROPS, this.props, {
      value,
    });
  }
}

export default Text;
