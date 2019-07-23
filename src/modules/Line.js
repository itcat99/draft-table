import Component from "./Component";

const PROPS = {
  from: [0, 0],
  to: [0, 0],
  lineWidth: 1,
};

class Line extends Component {
  constructor(props) {
    super(props);

    this.props = Object.assign({}, PROPS, props);
  }
}

export default Line;
