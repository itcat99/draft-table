import { isObj, isFun } from "../helpers/is";
import Emitter from "./Emitter";
import Err from "./Err";

const PROPS = {};
const EVENTS = {
  onSet() {}, // 当调用set的时候触发回调
};

interface Props {
  [key: string]: any;
}
interface SetPropsFn {
  (props: Props): Props;
}

/**
 * Draft-Table的组件类，实现了set、get和事件绑定，其他的组件类请继承此类
 *
 * this.props 结构:
 * {
 *  ...props,
 *  events: {
 *    ...event
 *  }
 * }
 *
 * events内放所有要注册的事件，调用bind时会自动绑定
 *
 * @class Component
 */
class Component {
  /**
   *Creates an instance of Component.
   * @param {any[]} props 参数列表，第一个参数始终为这个组件的配置对象
   * @memberof Component
   */
  public props: Props;
  public on: Function;
  public once: Function;
  public fire: Function;
  public del: Function;

  private _err: Err;
  private _emitter: Emitter;
  private _id: Symbol;

  constructor(...props: any[]) {
    const opts = props && props.length > 0 ? props[0] : null;

    this.props = Object.assign({}, PROPS, { events: EVENTS }, opts);
    const { id } = this.props;

    this._err = new Err();
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
    const { events } = this.props;

    for (let key of Object.keys(events)) {
      this.on(key, events[key]);
    }
  }

  /**
   * 注册事件，并重新绑定
   * @param {string} name 事件名
   * @param {function} fn 回调函数
   */
  registerEvent(name: string, fn: Function) {
    if (this.props.events[name]) this._err.pop("Has the same name event.");

    this.props.events[name] = fn;
    this.bind();
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
  get(key: string): any {
    return key ? this.props[key] : this.props;
  }

  /**
   * 设置属性
   * 有3种设置方式
   * 1. 当prop是object时，prop的键值对会覆盖相应this.props的值
   * 2. 当prop是function时，prop的返回值将作为新的this.props
   * 3. 当prop是string时，将prop作为key，第二个参数作为value，覆盖this.props内的相应属性
   *
   * @param {object|SetPropsFn|string} prop
   * @param {any} val
   * @memberof Component
   */
  set(prop: SetPropsFn | string | object, val: any) {
    if (isObj(prop)) {
      this.props = Object.assign({}, this.props, <object>prop);
    } else if (isFun(prop)) {
      this.props = (<SetPropsFn>prop)(this.props);
    } else {
      this.props[<string>prop] = val;
    }

    this.fire("set", { target: this });
  }
}

export default Component;
