interface BasicStyle_I {
  id?: Symbol | string;
  data: any;
}

interface Style_I extends BasicStyle_I {
  index: number;
}

type Key_Type = number | string | Symbol;

class Style {
  private _index: number;
  private _collection: Array<Style_I>;

  constructor() {
    this._index = 0;
    this._collection = [];
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

  add(style: BasicStyle_I): Style {
    if (!style.id) style.id = Symbol();
    const size = this._collection.length;

    this._index = this._normailzeIndex(size);

    this._collection.push(Object.assign({}, style, { index: this._index }));
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
    const style = this._search(key);
    const { index: styleIndex } = style;

    const beforeArr = this._collection.slice(0, styleIndex);
    let afterArr = this._collection.slice(styleIndex + 1);
    afterArr = afterArr.map(item => {
      item.index = this._normailzeIndex(item.index - 1);
      return item;
    });

    this._collection = [].concat(beforeArr, afterArr);
    this._index = this._normailzeIndex(this._index);
    return this;
  }

  /**
   * 查找样式
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @private
   * @param {Key_Type} key 样式的key  可以是index或者id
   * @returns {Style_I} 返回查找到的样式
   * @memberof Style
   */
  private _search(key: Key_Type): Style_I {
    for (let index = 0; index < this._collection.length; index++) {
      const style = this._collection[index];

      if (typeof key === "number" && key === index) return style;
      if (style.id === key) return style;
    }
  }

  /**
   * 格式化当前的index
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @private
   * @param {number} index index的值
   * @returns {number} 返回格式化的index数值
   * @memberof Style
   */
  private _normailzeIndex(index: number): number {
    const maxSize = this._collection.length;
    const minSize = 0;

    return Math.max(Math.min(maxSize, index), minSize);
  }

  /**
   * 获取上一个储存的style
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @returns {object} 返回style
   * @memberof Style
   */
  prev(): object {
    const currentIndex = this._normailzeIndex(this._index - 1);
    this._index = currentIndex;

    return this._search(currentIndex).data;
  }

  /**
   * 获取下一个储存的style
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @returns {object} 返回style
   * @memberof Style
   */
  next(): object {
    const currentIndex = this._normailzeIndex(this._index + 1);
    this._index = currentIndex;

    return this._search(currentIndex).data;
  }

  /**
   * 获取当前的值
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @returns {object} 返回style
   * @memberof Style
   */
  now(): object {
    return this._collection[this._index].data;
  }

  /**
   * 获取集合所有内容
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @returns {Array<Style_I>} 返回集合
   * @memberof Style
   */
  all(): Array<Style_I> {
    return this._collection;
  }

  /**
   * 清空集合
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @memberof Style
   */
  clear() {
    this._collection = [];
  }

  /**
   * 获取指定的style
   *
   * @author FreMaNgo
   * @date 2019-08-02
   * @param {Key_Type} key 样式的key  可以是index或者id
   * @returns {object} 返回style
   * @memberof Style
   */
  pop(key: Key_Type): object {
    const style = this._search(key);
    const { index, data } = style;

    this._index = this._normailzeIndex(index);
    return data;
  }
}

export default Style;
