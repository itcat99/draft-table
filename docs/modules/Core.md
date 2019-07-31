# Core 模块

> core 是核心模块，作为整个项目的初始化入口

当 core 加载时，会做以下几件事情：

1. 初始化`Collections`模块
2. 初始化`Store`模块
3. 初始化`Emitter`模块
4. 初始化`Plugins`模块
5. 初始化`Err`模块
6. 初始化全局上下文`context`
7. 加载并初始化内置插件
8. 加载外部插件
9. 根据外部插件是否`autoStart`，初始化需要自动执行的外部插件

## Usage/使用

```ts
import DraftTable from "draft-table";

const table = new DraftTable();
```

## Constructor/构造函数

构造函数签名：**(props: [Config_I](/types/common?id=config_i)): Core**

返回值：Core 实例

## Members/成员

### config

描述：全局配置选项

### COLLECTIONS

描述：`Collections`模块的实例

### STORE

描述：`store`模块的实例

### PLUGINS

描述：`Plugins`模块的实例

### EMITTER

描述：`Emitter`模块的实例

### ERR

描述：`Err`模块的实例

### context

全局上下文，成员为以下：

| name    | desc             |
| ------- | ---------------- |
| core    | core 模块实例    |
| config  | 全局配置选项     |
| err     | err 模块实例     |
| emitter | emitter 模块实例 |
| plugins | plugins 模块实例 |

### pluginInstances

描述：以运行的插件实例集合

## APIs/接口

### on

描述：注册监听事件

方法签名：**(key: string, cb:[Callback_I](/types/emitter?id=Callback_I), target:string): Core**

返回值：Core 实例

方法参数：

| name   | type                                       | default        | optional | desc                                 |
| ------ | ------------------------------------------ | -------------- | -------- | ------------------------------------ |
| key    | string                                     | -              | false    | 事件名称                             |
| cb     | [Callback_I](/types/emitter?id=Callback_I) | -              | false    | 回调函数                             |
| target | string                                     | this.namespace | true     | 目标命名空间，默认对于自身触发的事件 |

### once

描述：注册一次性的监听事件

方法签名：**(key: string, cb:[Callback_I](/types/emitter?id=Callback_I), target:string): Core**

返回值：Core 实例

方法参数：

| name   | type                                       | default        | optional | desc                                 |
| ------ | ------------------------------------------ | -------------- | -------- | ------------------------------------ |
| key    | string                                     | -              | false    | 事件名称                             |
| cb     | [Callback_I](/types/emitter?id=Callback_I) | -              | false    | 回调函数                             |
| target | string                                     | this.namespace | true     | 目标命名空间，默认对于自身触发的事件 |

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

### registerPlugin

描述：注册外部插件

方法签名：**(name: string, plugin: typeof Plugin, options?: [RegisterOptions_I](/types/plugins?id=RegisterOptions_I)): Core**

返回值：Core 实例

方法参数：

| name    | type                                                     | default | optional | desc                                                                                                                      |
| ------- | -------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| name    | string                                                   | -       | false    | 插件的名称，如果没有配置`options.namespace`属性，则作为插件的 namespace，不可重复。[内置插件列表](/plugins/insidePlugins) |
| class   | Class                                                    | -       | false    | 插件的类，[详情](/plugins/callback)                                                                                       |
| options | [RegisterOptions_I](/types/plugins?id=RegisterOptions_I) | -       | true     | 注册插件的选项， [详情](/modules/core?id=options)                                                                         |

#### options

| name      | type    | default | optional | desc                                               |
| --------- | ------- | ------- | -------- | -------------------------------------------------- |
| namespace | string  | -       | true     | 插件的命名空间                                     |
| auto      | boolean | false   | true     | 注册完毕是否自动创建实例                           |
| autoProps | object  | -       | true     | 当`auto`属性为 true 时，用于创建实例的插件配置对象 |

### run

描述：运行插件，会执行`new`操作，并替换在`pluginInstances`成员上同名的插件实例

方法签名：**(name: string, options?:any): Plugin**

返回值：插件实例

方法参数：

| name    | type   | default | optional | desc           |
| ------- | ------ | ------- | -------- | -------------- |
| name    | string | -       | false    | 插件名称       |
| options | any    | -       | true     | 插件的配置选项 |

## Events/事件

### mousemove

描述：鼠标移动事件

回调函数参数：

1. DOM 原生`mousemove`事件回调参数

### click

描述：鼠标单击事件

回调函数参数：

1. DOM 原生`click`事件回调参数

### dbclick

描述：鼠标双击事件

回调函数参数：

1. DOM 原生`dbclick`事件回调参数

### mousedown

描述：鼠标按下事件

回调函数参数：

1. DOM 原生`mousedown`事件回调参数

### mouseup

描述：鼠标抬起事件

回调函数参数：

1. DOM 原生`mouseup`事件回调参数

### keydown

描述：键盘按下事件

回调函数参数：

1. DOM 原生`keydown`事件回调参数

### keyup

描述：键盘抬起事件

回调函数参数：

1. DOM 原生`keyup`事件回调参数

### keypress

描述：键盘按键触发事件

回调函数参数：

1. DOM 原生`keypress`事件回调参数
