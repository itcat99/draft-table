/**
 * @description 求和从start位置到end位置的数字的和
 * @params data 数字数组
 * @params start 起点位置
 * @params end 重点位置
 * @returns sum 数字
 * @rule :
 *  1. data不存在时或为空数组时，返回0
 *  2. start 和 end的默认入参均为0，当其中任意一个边界不存在时，则以存在的编辑为重点计算
 *  3. 当start> end 时，互换边界
 *  4. 当data中存在 空值时，将空值位置按0进行计算
 */
export const getSumByRange = (data: Array<number>, start: number = 0, end: number = 0) => {
  const length: number = (data && data.length) || 0;

  if (!length) return 0;

  let sum = 0;
  let startAddress: number = start > 0 ? start : 0;
  let endAddress: number = end > 0 ? end : 0;

  if (startAddress > endAddress) {
    let temp: number = endAddress;
    endAddress = startAddress;
    startAddress = temp;
  }

  endAddress = endAddress > length - 1 ? length - 1 : endAddress;

  for (let i = startAddress; i <= endAddress; i++) {
    sum += data[i] || 0;
  }
  return sum;
};
