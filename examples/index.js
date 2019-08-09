import DraftTable, { Line, Text, Rect, Plugin } from "../src/index";
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

const table = new DraftTable({
  font: {
    size: 14,
  },
});

const rect = new Rect({ pos: [10, 10], width: 100, height: 100 });
const text = new Text({ pos: [10, 10], value: "Hello" });

table.draw({
  rect: [
    {
      data: [rect],
      style: {
        color: "rgba(255,0,0,.1)",
      },
    },
  ],
  text: [
    {
      data: [text],
      style: {
        size: 25,
      },
    },
  ],
});
