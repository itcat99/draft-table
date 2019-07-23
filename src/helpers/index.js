import { RATIO_PROPS } from "../constants";
import { isObj, isNum } from "./is";

/**
 * 获取屏幕像素比
 */
export const getRatio = () => {
  return window.devicePixelRatio || 1;
};

/**
 * 获取document.body默认fontFamily
 */
export const getFontFamily = () =>
  window.getComputedStyle(document.body).fontFamily.replace(/('|")/g, "");

/**
 * 将目标对象内，受devicePixelRatio影响的属性，乘以ratio
 * @param {any} target 目标对象，可以是一个对象，数字，字符串数字
 * @param {*} ratio devicePixelRatio倍数，默认1
 */
export const normalize = (target, ratio = 1) => {
  if (isObj(target)) {
    const obj = Object.assign({}, target);

    RATIO_PROPS.forEach(item => {
      if (obj[item]) obj[item] *= ratio;
    });

    return obj;
  }

  if (isNum(target, false)) return target * 1 * ratio;

  return target;
};

// export default {
//   getRatio,
//   isObj,
//   isArr,
//   isNum,
//   isStr,
//   isStrNum,
//   normalize,
// };
