type Key_Type = string;

interface Style_I {
  id: Key_Type;
  data: any;
}

class Style {
  private _collection: Map<Key_Type, any>;
  private _current: string;

  constructor() {
    this._current = "";
    this._collection = new Map();
  }

  /**
   * 添加一个样式
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {BasicStyle_I} style 样式
   * @returns {Style} 返回当前实例
   * @memberof Style
   */

  add(style: Style_I): Style {
    const { id, data } = style;
    this._collection.set(id, data);
    this._current = id;

    return this;
  }

  /**
   * 删除一个样式
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {Key_Type} key 样式的key  可以是index或者id
   * @returns {Style} 返回当前实例
   * @memberof Style
   */
  del(key: Key_Type): Style {
    this._collection.delete(key);

    return this;
  }

  /**
   * 获取当前的style
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @returns {Style_I} 返回style
   * @memberof Style
   */
  now(): Style_I {
    return {
      id: this._current,
      data: this._collection.get(this._current),
    };
  }

  /**
   * 清空集合
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @memberof Style
   */
  clear() {
    this._collection.clear();
  }

  /**
   * 获取指定id 的内容
   *
   * @author FreMaNgo
   * @date 2019-08-06
   * @param {string} [id] id
   * @returns {(object}
   * @memberof Style
   */
  get(id: string): object {
    return this._collection.get(id);
  }

  has(id: string): boolean {
    return this._collection.has(id);
  }

  /**
   * 获取集合所有内容
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @returns {Array<Style_I>} 返回集合
   * @memberof Style
   */
  getAll(): Map<Key_Type, object> {
    return this._collection;
  }

  /**
   * 获取指定的样式，并将当前的id指向传入的id
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {Key_Type} id 样式的id
   * @returns {object} 返回style
   * @memberof Style
   */
  pop(id: Key_Type): object {
    const data = this.get(id);

    if (data) {
      this._current = id;
      return data;
    }
  }
}

export default Style;
