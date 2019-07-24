/**
 * 获取屏幕像素比
 */
export const getRatio = (): Number => {
  return window.devicePixelRatio || 1;
};

/**
 * 获取document.body默认fontFamily
 */
export const getFontFamily = (): String =>
  window.getComputedStyle(document.body).fontFamily.replace(/('|")/g, "");
