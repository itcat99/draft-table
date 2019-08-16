/**
 * Collection  一个集合类, 内部定义了相关的操作，主要是 遍历 查找 增加 删除 修改;
 * 主要的集合存储目标，数组 和 map
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
