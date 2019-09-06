import { getSumByRange } from "../../src/helpers/calculate";

test("getSumByRange 参数不全或不存在的情况", () => {
  expect(getSumByRange(undefined, 0, 6)).toEqual(0);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], undefined, 10)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 4, undefined)).toEqual(15);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], undefined, -10)).toEqual(1);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], -4, undefined)).toEqual(1);
});
test("getSumByRange 被遍历集合的一些情况", () => {
  expect(getSumByRange(undefined, 0, 6)).toEqual(0);
  expect(getSumByRange([1], 0, 6)).toEqual(1);
  expect(getSumByRange([1, 2, 3, 4, 5, undefined, 7], 0, 6)).toEqual(22);
});
test("getSumByRange 求和在范围边界之内", () => {
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 0, 6)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 1, 6)).toEqual(27);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 1, 5)).toEqual(20);
});
test("getSumByRange 求和超出边界", () => {
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 0, 10)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], -10, 10)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 4, 10)).toEqual(18);
});
test("getSumByRange 求和超出边界", () => {
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 0, 10)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], -10, 10)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 4, 10)).toEqual(18);
});
test("getSumByRange 错误边界", () => {
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], -0, -10)).toEqual(1);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], -4, -10)).toEqual(1);
});
test("getSumByRange 范围颠倒的情况", () => {
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 10, 0)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 10, -10)).toEqual(28);
  expect(getSumByRange([1, 2, 3, 4, 5, 6, 7], 10, 4)).toEqual(18);
});
