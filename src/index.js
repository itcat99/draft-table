import config from "./config";
import { normalize } from "./helpers";
import Canvas from "./modules/Canvas";

class DraftTable {
  constructor(props) {
    const opts = Object.assign({}, config, props);
    const { ratio, width: viewWidth, height: viewHeight } = opts;
    const width = viewWidth * ratio;
    const height = viewHeight * ratio;

    this.props = Object.assign({}, opts, {
      width,
      height,
      // 显示在页面上实际的大小
      viewWidth,
      viewHeight,
    });

    console.log("this.props: ", this.props);

    this.initialized();
  }

  initialized() {
    this.canvas = new Canvas(this.props);

    this.ctx = this.canvas.ctx;
    this.el = this.canvas.el;

    // 绘制线段
    this.canvas.drawLine([{ from: [0, 0], to: [100, 100] }, { from: [100, 100], to: [200, 0] }]);
    // 绘制矩形
    this.canvas.drawRect([{ pos: [10, 10], width: 100, height: 100 }]);
    // 绘制文字
    this.canvas.drawText([{ pos: [100, 200], value: "Hello World." }]);
  }

  listener() {}

  /* public methods */

  // with add
  addRow() {}
  getRow() {}
  addCol() {}
  getCol() {}
  addCell() {}
  getCell() {}
  hiddenRow() {}
  showRow() {}
  haddenCol() {}
  showCol() {}
  mergeCell() {}
  brokeMergeCell() {}
  mergeRow() {}
  brokeMergeRow() {}
  mergeCol() {}
  brokeMergeCol() {}

  /* events */
  onClick() {}
}

export default DraftTable;
