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
