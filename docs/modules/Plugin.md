# Plugin 模块

> Plugin 模块作为创建插件时，被继承的基础模块

## Usage

新建一个插件，只需要继承`Plugin`模块，然后根据具体需要，写相应逻辑即可。

```ts
import { Plugin } from "draft-table";

class A extends Plugin {
  constructor(context: Context_I, options: any) {
    super(context, options);
  }
}

export default A;
```

## Members

### namespace

描述：插件的命名空间

### context

描述：全局上下文。[详情]()

### options

描述：插件的配置属性。[详情]()

## Methods

### on

描述：注册监听事件

方法签名：**(key: string, cb:Function, target:string): Plugin**

返回值：插件实例

方法参数：

| name   | type     | default        | optional | desc                                 |
| ------ | -------- | -------------- | -------- | ------------------------------------ |
| key    | string   | -              | false    | 事件名称                             |
| cb     | Function | -              | false    | 回调函数                             |
| target | string   | this.namespace | true     | 目标命名空间，默认对于自身触发的事件 |

### once

描述：注册一次性的监听事件

方法签名：**(key: string, cb:Function, target:string): Plugin**

返回值：插件实例

方法参数：

| name   | type     | default        | optional | desc                                 |
| ------ | -------- | -------------- | -------- | ------------------------------------ |
| key    | string   | -              | false    | 事件名称                             |
| cb     | Function | -              | false    | 回调函数                             |
| target | string   | this.namespace | true     | 目标命名空间，默认对于自身触发的事件 |

### fire

描述：触发事件

方法签名：**(key: string, props: any[], namespace:string): void**

返回值：无

方法参数：

| name      | type   | default        | optional | desc                               |
| --------- | ------ | -------------- | -------- | ---------------------------------- |
| key       | string | -              | false    | 事件名称                           |
| props     | any[]  | -              | false    | 需要传递给回调函数的参数列表       |
| namespace | string | this.namespace | true     | 目标命名空间，默认自身的 namespace |

### removeEvent

描述：删除事件

方法签名：**(key: string, target:string): void**

返回值：无

方法参数：

| name   | type   | default        | optional | desc                               |
| ------ | ------ | -------------- | -------- | ---------------------------------- |
| key    | string | -              | false    | 事件名称                           |
| target | string | this.namespace | true     | 目标命名空间，默认自身的 namespace |
