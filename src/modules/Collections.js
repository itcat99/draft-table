import { isFun, isArr, isObj, isNum } from "../helpers/is";
import Err from "./Err";

class Collection {
  constructor(props) {
    this.props = props;

    this.collection = null;
    this.type = null;
    this.error = new Err();
  }

  /**
   * 给集合排序
   * @param {function} fn 处理排序的方法
   * @return 返回当前的Collection实例
   */
  sort(fn) {
    if (!isFun(fn)) this.error.pop("Collection.sort must be a [Function], please check your code.");
    this.collection = fn(this.collection);

    return this;
  }

  insert(item) {
    // 插入一个元素
  }
  insertMultiple() {
    // 插入多个元素
  }
  remove() {
    // 删除一个元素
  }
  removeMultiple() {
    // 删除多个元素
  }

  /**
   * 新建一个集合
   * @param {any} collection 集合的源数据，当类型为array时，生成set，当类型为obj时，生成map
   */
  create(collection) {
    if (!isArr(collection) && !isObj(collection))
      this.error.pop(
        "create Collection must be a [Array] or [Object] type, please check your code.",
      );
    if (isArr(collection)) {
      this.collection = new Set(collection);
      this.type = "set";
    } else {
      this.collection = this.obj2map(collection);
      this.type = "map";
    }
  }

  obj2map(obj) {
    const map = new Map();
    for (let k of Object.keys(obj)) {
      map.set(k, obj[k]);
    }
    return map;
  }

  /**
   *
   * @param {number|object|array} key 查找的值，当为number时，查找集合内下标为key的值；当为obj时，查找同时满足obj内key：value对的值；当为array时，查找包含这些array内值的元素
   * @return {array} 返回一个数组，存储所有查找到的结果
   */
  find(key) {
    if (!isNum(key) && !isObj(key) && !isArr(key))
      this.error.pop(
        "find item must be a [Array] or [Object] or [Number] type, please check your code.",
      );

    if (isNum(key)) {
      return [this._findWidthIndex(key)];
    }

    if (isObj(key)) {
      return this._findInObj(key);
    }

    if (isArr(key)) {
      return this._findInSet(key);
    }
  }

  _findWidthIndex(index) {
    let count = 0,
      result;
    for (let value of this.collection.values()) {
      if (count >= index) {
        result = value;
        break;
      }

      count += 1;
    }

    return result;
  }

  _findInObj(obj, map = this.collection) {
    const result = new Map();

    map.forEach((val, key) => {
      const objKeys = Object.keys(obj);

      for (let objKey of objKeys) {
        if (key === objKey && val === val) {
          result.set(key, val);
        }
      }
    });

    return [];
  }
  _findInSet(arr, set = this.collection) {}

  destory() {
    // 销毁集合
  }
}

export default Collection;
