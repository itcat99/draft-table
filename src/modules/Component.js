import { isObj, isFun } from "../helpers/is";
import Emitter from "./Emitter";

const PROPS = {
  onSet() {}, // 当调用set的时候触发回调
};

/**
 * Draft-Table的组件类，实现了set、get和事件绑定，其他的组件类请继承此类
 *
 * @class Component
 */
class Component {
  /**
   *Creates an instance of Component.
   * @param {any[]} props 参数列表，第一个参数始终为这个组件的配置对象
   * @memberof Component
   */
  constructor(...props) {
    const opts = props && props.length > 0 ? props[0] : null;

    this.props = Object.assign({}, PROPS, opts);
    const { id } = this.props;

    this._emitter = new Emitter();
    this._id = id ? Symbol(id) : Symbol();

    const { on, once, fire, del } = this._emitter;

    this.on = on.bind(this._emitter);
    this.once = once.bind(this._emitter);
    this.fire = fire.bind(this._emitter);
    this.del = del.bind(this._emitter);

    this.bind();
  }

  /**
   * 绑定事件，创建实例后触发
   *
   * @memberof Component
   */
  bind() {
    const { onSet } = this.props;

    onSet && this.on("set", onSet);
  }

  /**
   * 获取属性值
   * 有两种获取方式
   * 1. 当有key参数或key参数不为假时，获取this.props上相应的值
   * 2. 当没有key参数或key为假时，返回this.props
   *
   * @param {string} key 属性键名
   * @returns {any} 返回相应的值
   * @memberof Component
   */
  get(key) {
    return key ? this.props[key] : this.props;
  }

  /**
   * 设置属性
   * 有3种设置方式
   * 1. 当prop是object时，prop的键值对会覆盖相应this.props的值
   * 2. 当prop是function时，prop的返回值将作为新的this.props
   * 3. 当prop是string时，将prop作为key，第二个参数作为value，覆盖this.props内的相应属性
   *
   * @param {object|function|string} prop
   * @param {any} val
   * @memberof Component
   */
  set(prop, val) {
    if (isObj(prop)) {
      this.props = Object.assign({}, this.props, prop);
    } else if (isFun(prop)) {
      this.props = prop(this.props);
    } else {
      this.props[prop] = val;
    }

    this.fire("set", { target: this });
  }
}

export default Component;
