import Core from "modules/Core";

import _Plugin from "modules/Plugin";
import _Line from "components/Line";
import _Rect from "components/Rect";
import _Text from "components/Text";

export const Plugin = _Plugin;
export const Line = _Line;
export const Rect = _Rect;
export const Text = _Text;
export default Core;

// export default Core;

// import config from "./config";
// import Canvas from "modules/Canvas";
// import Text from "modules/Text";

// class DraftTable {
//   constructor(props) {
//     const opts = Object.assign({}, config, props);
//     const { ratio, width: viewWidth, height: viewHeight } = opts;
//     const width = viewWidth * ratio;
//     const height = viewHeight * ratio;

//     this.props = Object.assign({}, opts, {
//       width,
//       height,
//       // 显示在页面上实际的大小
//       viewWidth,
//       viewHeight,
//     });

//     console.log("this.props: ", this.props);

//     this.initialized();
//     this.listener();
//   }

//   initialized() {
//     this.canvas = new Canvas(this.props);

//     this.ctx = this.canvas.ctx;
//     this.el = this.canvas.el;
//     console.log(this.el);

//     // // 绘制线段
//     // this.canvas.drawLine([{ from: [0, 0], to: [100, 100] }, { from: [100, 100], to: [200, 0] }]);
//     // // 绘制矩形
//     // this.canvas.drawRect([{ pos: [10, 10], width: 100, height: 100 }]);
//     // // 绘制文字
//     // this.canvas.drawText([{ pos: [100, 200], value: "Hello World." }]);
//   }

//   test = () => {
//     this.canvas.ctx.clearRect(0, 0, 800, 600);
//     this.texts = [];

//     for (let i = 0; i < 1000; i++) {
//       const text = new Text("Hello", {
//         pos: [
//           Math.floor(Math.random() * this.props.viewWidth),
//           Math.floor(Math.random() * this.props.viewHeight),
//         ],
//       });

//       this.texts.push(text);
//     }

//     // console.log("texts: ", texts);
//     this.canvas.drawText(this.texts);
//   };

//   listener() {
//     this.el.onwheel = () => {
//       window.requestAnimationFrame(this.test);
//     };

//     this.canvas.on("beforeCreate", canvas => {
//       console.log("canvas: ", canvas);
//     });
//     this.canvas.on("click", e => {
//       console.log("on click", e);
//     });
//   }

//   /* public methods */

//   // about add/del
//   addRow() {}
//   delRow() {}
//   getRow() {}

//   addCol() {}
//   delCol() {}
//   getCol() {}

//   addCell() {}
//   delCell() {}
//   getCell() {}

//   // about visibility
//   hiddenRow() {}
//   showRow() {}
//   haddenCol() {}
//   showCol() {}

//   // about merge
//   mergeCell() {}
//   brokeMergeCell() {}
//   mergeRow() {}
//   brokeMergeRow() {}
//   mergeCol() {}
//   brokeMergeCol() {}

//   /* events */
//   onClick() {}
// }

// export default DraftTable;
