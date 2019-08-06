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
