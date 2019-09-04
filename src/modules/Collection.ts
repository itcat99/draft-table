/**
 * Collection  一个集合类, 内部定义了相关的操作，主要是 遍历 查找 增加 删除 修改;
 * 主要的集合存储目标，数组 和 map
 */

import { isObject, isArray, isNumber } from "util";
class Collection {
  private items: Array<any> | Object;
  constructor(collection: any) {
    if (
      collection === undefined ||
      collection === null ||
      (isNumber(collection) && isNaN(collection))
    ) {
      this.items = [];
    } else if (isArray(collection) || isObject(collection)) {
      //isObject(null)=====>false
      this.items = collection;
    } else {
      this.items = [collection];
    }
  }

  getItems() {
    return this.items;
  }

  forEach() {}
  search() {}
  add() {}
  delete() {}
}
export const collection = (collection: any) => new Collection(collection);
