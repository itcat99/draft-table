import DraftTable, { Line } from "../src/index";
import { Random } from "mockjs";

function createLines(count) {
  const arr = [];

  for (; count > 0; count--) {
    const from = [Random.natural(0, 800), Random.natural(0, 600)];
    const to = [Random.natural(0, 800), Random.natural(0, 600)];

    arr.push(new Line({ from, to }));
  }

  return arr;
}

const table = new DraftTable();
// const line = new Line({ from: [10, 10], to: [100, 10] });
// const line2 = new Line({ from: [10, 20], to: [100, 20] });

// const text = new Text({ pos: [0, 0], value: "HEllo" });
// const text2 = new Text({ pos: [100, 100], value: "World" });
// const rect = new Rect({ pos: [200, 200], width: 100, height: 150 });
// const rect2 = new Rect({ pos: [100, 100], width: 50, height: 50 });
const canvas = table.canvas;

table.on("wheel", () => {
  // window.requestAnimationFrame(drawLines);
  drawLines();
});

function drawLines() {
  const lines = createLines(1000);
  canvas.drawLine(lines);
}
// canvas
//   .lineColor("#ff0000")
//   .drawLine([line])
//   .prevStyle()
//   .drawLine([line2])
//   .drawText([text])
//   .color("#f011ff", "color1")
//   .font({ size: 25, lineHeight: "25px" })
//   .drawText([text2])
//   .color("rgba(0,0,0,.5)")
//   .drawRect([rect])
//   .popStyle("color1")
//   .drawRect([rect2]);
