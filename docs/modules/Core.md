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

## Usage

```ts
import DraftTable from "draft-table";

const table = new DraftTable();
```

## Constructor

构造函数签名：**(props: [Config_I](/types/common?id=config_i)): Core**

返回值：Core 实例

## Members

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

## APIs

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
| auto      | boolean | false   | false    | 注册完毕是否自动创建实例                           |
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
