import Component from "./Component";

const PROPS = {
  pos: [0, 0],
  width: 0,
  height: 0,
};

class Rect extends Component {
  constructor(props) {
    super(props);

    this.props = Object.assign({}, PROPS, props);
  }
}

export default Rect;
