/* 判断是否 */

/**
 * 是否是一个对象
 * @param {any} obj
 * @return {boolean}
 */
export const isObj = obj => Object.prototype.toString.call(obj).indexOf("Object") >= 0;

/**
 * 是否是一个数组
 * @param {any[]} arr
 * @return {boolean}
 */
export const isArr = arr => Array.isArray(arr);

/**
 * 是否是一个字符串
 * @param {any} str
 * @return {boolean}
 */
export const isStr = str => typeof str === "string";

/**
 * 是否是一个数字
 * @param {any} num 检测的变量
 * @param {boolean} strict 严格模式，默认开启。当开启严格模式后，仅当num是真数字才返回true，关闭后，也可以检测string类型的数字
 * @return {boolean}
 */
export const isNum = (num, strict = true) => typeof (strict ? num : num * 1) === "number";

/**
 * 是否是一个字符串数字
 * @param {any} num
 * @return {boolean}
 */
export const isStrNum = num => isStr(num) && isNum(num, false);

/**
 * 是否是一个函数
 * @param {any} fun
 * @returns {boolean}
 */
export const isFun = fun => Object.prototype.toString.call(fun).indexOf("Function") >= 0;

/**
 * 是否是一个canvas dom
 * @param {DOM} dom
 */
export const isCanvas = dom => dom.nodeName.toLowerCase() === "canvas";
