## Plugins 模块

> Plugins 模块作为注册、运行、管理插件的工具

## Members/成员

无

## APIs/接口

### register

描述：注册插件

方法签名：**(name: string, plugin: typeof Plugin, options?: [RegisterOptions_I](/types/plugins?id=RegisterOptions_I)): void**

返回值：void

方法参数：

| name    | type                                                     | default | optional | desc                         |
| ------- | -------------------------------------------------------- | ------- | -------- | ---------------------------- |
| name    | string                                                   | -       | false    | 插件名，作为插件的 namespace |
| plugin  | typeof Plugin                                            | -       | false    | 插件的 class                 |
| options | [RegisterOptions_I](/types/plugins?id=RegisterOptions_I) | -       | true     | 注册插件的配置选项           |

### run

描述：创建并运行插件实例

方法签名：**(name: string, props?: object): Plugin**

返回值：插件实例

方法参数：

| name  | type   | default | optional | desc                           |
| ----- | ------ | ------- | -------- | ------------------------------ |
| name  | string | -       | false    | 插件名称                       |
| props | object | -       | true     | 创建实例时传递给插件的参数对象 |

### runAll

描述：按注册顺序创建并运行所有已注册的插件实例

方法签名：**(props: object): [PluginsInstances_Type](/types/plugins?id=PluginsInstances_Type)**

返回值：插件实例的集合

方法参数：

| name    | type   | default | optional | desc                           |
| ------- | ------ | ------- | -------- | ------------------------------ |
| options | object | -       | true     | 创建实例时传递给插件的参数对象 |

注意 ⚠️：当已存在运行的实例时，执行`runAll`新的实例会覆盖旧的那个。

### get

描述：获取插件对象

方法签名：**(name: string): [Plugin_I](/types/plugins?id=Plugin_I)**

返回值：插件对象

方法参数：

| name | type   | default | optional | desc     |
| ---- | ------ | ------- | -------- | -------- |
| name | string | -       | false    | 插件名称 |

### getAll

描述：获取所有插件对象

方法签名：**(): [PluginsClasses_Type](/types/plugins?id=PluginsClasses_Type)**

返回值：插件类对象集合

方法参数：无

### del

描述：删除指定插件

方法签名：**(name: string): void**

返回值：无

方法参数：

| name | type   | default | optional | desc     |
| ---- | ------ | ------- | -------- | -------- |
| name | string | -       | false    | 插件名称 |

注意 ⚠️：这会同时在`类集合`和`实例集合`内删除，请确保在删除之前处理好该插件所有的事务！

## Events/事件

### register

描述：当插件注册成功后触发

回调函数参数：

1. 插件名称

### delete

描述：当插件删除成功后触发

回调函数参数：

1. 插件名称

### run

描述：当插件创建并执行后触发

回调函数参数：

1. 插件名称
