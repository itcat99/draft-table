# Emitter 模块

> Emitter 是事件池模块，在 Core 模块内实例化并作为全局的事件处理中心

## Members/成员

### events

描述：所有已注册的事件集合

## APIs/接口

### on

描述：注册监听事件

方法签名：**(key: string, cb:[Callback_I](/types/emitter?id=Callback_I), target:string): Core**

返回值：Core 实例

方法参数：

| name   | type                                       | default | optional | desc         |
| ------ | ------------------------------------------ | ------- | -------- | ------------ |
| key    | string                                     | -       | false    | 事件名称     |
| cb     | [Callback_I](/types/emitter?id=Callback_I) | -       | false    | 回调函数     |
| target | string                                     | -       | true     | 目标命名空间 |

### once

描述：注册一次性的监听事件

方法签名：**(key: string, cb:[Callback_I](/types/emitter?id=Callback_I), target:string): Core**

返回值：Core 实例

方法参数：

| name   | type                                       | default | optional | desc         |
| ------ | ------------------------------------------ | ------- | -------- | ------------ |
| key    | string                                     | -       | false    | 事件名称     |
| cb     | [Callback_I](/types/emitter?id=Callback_I) | -       | false    | 回调函数     |
| target | string                                     | -       | true     | 目标命名空间 |

### fire

描述：触发事件

方法签名：**(key: string, props: any[], namespace:string): void**

返回值：无

方法参数：

| name      | type   | default | optional | desc                         |
| --------- | ------ | ------- | -------- | ---------------------------- |
| key       | string | -       | false    | 事件名称                     |
| props     | any[]  | -       | false    | 需要传递给回调函数的参数列表 |
| namespace | string | -       | true     | 目标命名空间                 |

### del

描述：删除事件

方法签名：**(key: string, target:string): void**

返回值：无

方法参数：

| name   | type   | default | optional | desc         |
| ------ | ------ | ------- | -------- | ------------ |
| key    | string | -       | false    | 事件名称     |
| target | string | -       | true     | 目标命名空间 |

### clear

描述：删除所有注册的事件

方法签名：**(): void**

返回值：无

方法参数：无
