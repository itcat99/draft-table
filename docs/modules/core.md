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

| name          | type            | desc                       |
| ------------- | --------------- | -------------------------- |
| config        | Config_I        | 全局配置选项               |
| COLLECTIONS   | -               | `Collections`模块的实例    |
| STORE         | Store           | `Store`模块的实例          |
| PLUGINS       | Plugins         | `Plugins`模块的实例        |
| EMITTER       | Emitter         | `Emitter`模块的实例        |
| ERR           | Err             | `Err`模块的实例            |
| DATA          | Data            | `Data`模块的实例           |
| canvas        | Canvas          | `Canvas` 内置插件的实例    |
| scrollbar     | Scrollbar       | `Scrollbar` 内置插件的实例 |
| width         | number          | canvas 宽度                |
| height        | number          | canvas 高度                |
| viewWidth     | number          | 可绘制区域宽度             |
| viewHeight    | number          | 可绘制区域高度             |
| data          | Data_I          | 原始集合                   |
| viewData      | Data_I          | 视图集合                   |
| renderingData | RenderingData_I | 渲染集合                   |

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

### lockedRow

描述：锁定行

### lockedCol

描述：锁定列

### insertRow

描述：插入行

### insertCol

描述：插入列

### delRow

描述：删除行

### delCol

描述：删除列

### hiddenRow

描述：隐藏行

### hiddenCol

描述：隐藏列

### replaceCell

描述：替换格子

### replaceRow

描述：替换行

### replaceCol

描述：替换列

### mergeCell

描述：合并格子

### mergeCol

描述：合并列

### mergeRow

描述：合并行

### brokenMergeCell

描述：解除合并格子

### brokenMergeRow

描述：解除合并行

### brokenMergeCol

描述：解除合并列

### draw

描述：最终绘制的函数

绘制顺序 line -> rect -> text

方法签名：**(props: RenderingData_I = {}): void**

返回值：无

方法参数：

| name  | type            | default | optional | desc         |
| ----- | --------------- | ------- | -------- | ------------ |
| props | RenderingData_I | -       | true     | 最终绘制集合 |

## Events/事件

### wheel

描述：鼠标滚轮事件

回调函数参数：

1. DOM 原生`wheel`事件回调参数

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
