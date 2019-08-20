import { collection } from "../../../src/modules/Collection";
test("construct 入参为 不存在 或 为否值", () => {
  const argArray = [undefined, null, NaN, 0, "", false];
  const expectArray = [
    { items: [] },
    { items: [] },
    { items: [] },
    { items: [0] },
    { items: [""] },
    { items: [false] },
  ];
  argArray.forEach((item, index) => {
    expect(collection(item)).toEqual(expectArray[index]);
  });
});

test("construct 入参为数组 或 对象", () => {
  const argArray = [[], [1, 2, 3], {}, { a: 1 }, new Map()];
  const expectArray = [
    { items: [] },
    { items: [1, 2, 3] },
    { items: {} },
    { items: { a: 1 } },
    { items: new Map() },
  ];
  argArray.forEach((item, index) => {
    expect(collection(item)).toEqual(expectArray[index]);
  });
});

test("getItems 数组，对象，map", () => {
  expect(collection([1, 2, 3]).getItems()).toEqual([1, 2, 3]);
  expect(collection([]).getItems()).toEqual([]);
  expect(collection({}).getItems()).toEqual({});
  expect(collection(new Map()).getItems()).toEqual(new Map());
  expect(collection(undefined).getItems()).toEqual([]);
  expect(collection(null).getItems()).toEqual([]);
  expect(collection("1").getItems()).toEqual(["1"]);
});
