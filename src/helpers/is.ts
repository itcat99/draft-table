import { Pos_Type } from "types/common.type";

/* 判断是否 */

/**
 * 是否是一个canvas dom
 * @param {DOM} dom
 */
export const isCanvas = (dom: any) => dom.nodeName.toLowerCase() === "canvas";

interface Target_I {
  pos: Pos_Type;
  width: number;
  height: number;
}

/**
 *  测试当前点是否在目标区域内 （仅矩形区域）
 * @param {Pos_Type} pos 测试的点的坐标
 * @param {Target_I} target 矩形区域的属性
 * @param {Pos_Type} target.pos 矩形左上角坐标
 * @param {number} target.width 矩形宽度
 * @param {number} target.height 矩形高度
 */
export const isInside = (pos: Pos_Type, target: Target_I) => {
  const { pos: _pos, width, height } = target;
  const [x, y] = pos;
  const [_x_start, _y_start] = _pos;
  const _x_end = _x_start + width;
  const _y_end = _y_start + height;

  if (_x_start <= x && _x_end >= x && _y_start <= y && _y_end >= y) return true;
  return false;
};
