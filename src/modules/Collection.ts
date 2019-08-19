/**
 * Collection  一个集合类, 内部定义了相关的操作，主要是 遍历 查找 增加 删除 修改;
 * 主要的集合存储目标，数组 和 map
 */

import { isObject } from "util";
class Collection {
  private items: Array<any> | Object;
  constructor(collect: any) {
    if (collect !== undefined || !Array.isArray(collect) || !isObject(collect)) {
      this.items = [collect];
    } else {
      this.items = collect;
    }
  }
  search() {

  }
}
const collection = (collection: any) => new Collection(collection);

export default {collection};
