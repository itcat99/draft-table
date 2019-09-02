import { isArray } from "util";

/**
 * @description 一个可以获取树形结构中的节点标识的结构
 * 入参结构:
 * [ key1,  [key2,key3,key4],  key5, [key6, [key7,key8,key9,key10], key11 ], key12 ]
 * 约定 key1,key2,key3... 一定是真值。
 *
 * 入参结构解释：
 *  入参结构为，将层级的对象结构转换为多层平铺的数组结构的展示，每一个块（块可能是复合结构），表示一个行，
 *  块中的子元素为该块的字节点，字节中可能还存在有子块，如此循环往复，标识一个层级压缩后的结构；
 *
 * 查找依据（查找地图）：
 * 一个数组，每一位标识一个深度下的节点的位置，（深度从0开始），
 * 例如 [1，2，3，4]，可以翻译为，深度为0 的集合中的第二个的前提下，深度为1的第三个的前提下，深度为2的第四个的前提下，深度为5的节点key是多少
 *
 * 其存在3 个方法,
 * (1) 根据规范获取到对应的key并范围，对应getKey()方法
 * 逻辑约定：
 *  根据查找依据，返回结构中key值
 * (2) 获取节点前一个的值，对应next()方法, 返回索引[1,2,3] ==> 外层再根据索引去真实数据中找值
 * 逻辑约定：
 * 1.可以根据当前指针所指的位置，进行向下一个位置查找
 *    1.1. 往下一行可能遇到到达边界的情况， 到达编辑之后，需要往上级走，
 *      1.1.1. 在找到上级的时候，进入，从前往后找
 *      1.1.2. 在找不到上级时，返回该位置废弃 或返回false
 *
 * (3) 获取节点后一个的值，对应prev()方法，返回索引[1,2,3] ==> 外层再根据索引去真实数据中找值
 * 逻辑约定:
 * 1.可以根据当前指针所指的位置，向前移动查找，
 *    1.1. 往前遇到边界，则往上级走，
 *        1.1.1. 在找到上级的时候，进入，从后往前找
 *        1.1.2. 在无法找到上级时，返回该位置废弃 或返回false
 *
 */
class ChildrenIterator {
  private childPointer: number[];
  private data: Array<any>;
  constructor(arg: Array<any>) {
    this.data = arg;
    this.childPointer = [0];
  }
  setChildPointer(arg: Array<any>) {
    //todo 此处可以添加 arg的校验，2个方面，（1）入参合法性（2）规则合法性，即节点是否不存在
    this.childPointer = arg;
  }
  /**
   * @description 根据所给定的规则，查找结构中的值
   * 当查找失败时，返回false，表示同规则查找错误，
   * 当查找成功时，返回对应位置的值
   * @param arg 查找的地图规则
   * @returns 规则地图所对应的点的值
   *
   */
  getKey(arg: number[]): number | boolean {
    let result = false;
    const length = arg && arg.length;
    const getValue = (data: Array<any>, index: number, length: number) => {
      let resultData = data[index] || false;
      if (index < length) {
        if (isArray(resultData)) {
          getValue(data, index + 1, length);
        } else {
          return false;
        }
      } else {
        return resultData;
      }
    };
    arg.forEach(item => {
      result = getValue(this.data, item, length);
    });
    return result;
  }
  next() {
    return [1, 2, 3];
  }
  prev() {
    return [1, 2, 3];
  }
}

export const childrenIterator = (arg: Array<any>) => new ChildrenIterator(arg);
