import { Font_I } from "types/style.type";
import { isObject, isArray } from "util";

/**
 * 获取屏幕像素比
 */
export const getRatio = (): number => {
  return window.devicePixelRatio || 1;
};

/**
 * 获取document.body默认fontFamily
 */
export const getFontFamily = (): string =>
  window.getComputedStyle(document.body).fontFamily.replace(/('|")/g, "");

/**
 * 获取min和max间的num
 *
 * @param num
 * @param min 最小值
 * @param max 最大值
 */
export const rangeNum = (num: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, num));

/**
 * 深合并两个对象
 * @param origin 合并源
 * @param target 要合并进去的目标
 */
export const deepMerge = <T>(origin: T, target: T): T => {
  const tempObj = Object.assign({}, origin);

  for (const key in target) {
    const targetVal = target[key];
    const originVal = origin[key];
    // if (!targetVal) continue;

    if (isObject(originVal) && targetVal) {
      tempObj[key] = deepMerge(originVal, targetVal);
      continue;
    }

    tempObj[key] = target[key];
  }

  return tempObj;
};

/**
 * 根据font的各个子属性，生成cavnas 的font属性
 * @param {Font_I} opts font的子属性
 * @param {string} [currentFont] 当前的font值
 * @returns 返回font属性值
 */
export const generatorFont = (opts: Font_I, currentFont?: string) => {
  let fontStyle = {};
  if (currentFont) {
    fontStyle = parseFont(currentFont);
  }
  opts = Object.assign({}, fontStyle, opts);
  const { variant, weight, stretch, family, style, lineHeight } = opts;
  let { size } = opts;

  if (typeof size === "number") size = `${size}px`;

  return `${style} ${variant} ${weight} ${stretch} ${size}/${lineHeight} ${family}`;
};

/**
 *  解析当前的font值
 * @param {string} font 当前的font值
 * @returns font子属性对象
 */
export const parseFont = (font: string): Font_I => {
  let [style, variant, weight, stretch, sizeAndLineHeight, ...args] = font.split(" ");
  const [size, lineHeight] = sizeAndLineHeight.split("/");

  return {
    style,
    variant,
    weight,
    stretch,
    size,
    lineHeight,
    family: args.join(" "),
  };
};
