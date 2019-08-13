import DraftTable, { Line, Text, Rect } from "../src/index";

const rows = {
  items: [{ size: 20, data: [{ id: "init", type: "text", value: "hello" }] }],
};
const cols = {
  items: [{ size: 100, data: ["init"] }],
};

const data = {
  items: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 0]],
};

const table = new DraftTable({
  data,
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
