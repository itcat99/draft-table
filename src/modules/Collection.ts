/**
 * Collection  一个集合类, 内部定义了相关的操作，主要是 遍历 查找 增加 删除 修改
 */

/**
 * 构思：
 * collection, 定义了一个集合，
 * 集合: （1）集合存储的内容 （2）对于集合的操作
 * 问题：
 *  1、 集合 存储的东西是 单一性？
 *  2、 集合操作的性能
 *  3、 外部使用的情况
 *  4、 如何应对 复合结构
 * -----
 *  1、确定 集合  array | object
 *  2、目标对象，{key: new map(),key: new map()}
 *
 *
 */
import * as IS from "../helpers/is";
class Collection {
  private items: Array<any> | Object;
  constructor(collect: any) {
    if (collect !== undefined || !Array.isArray(collect) || !IS.isObj(collect)) {
      this.items = [collect];
    } else {
      this.items = collect;
    }
  }
  search() {
    console.info(this.items);
  }
}
