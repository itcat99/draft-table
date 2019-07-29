# Core 模块

> core 是核心模块，作为整个项目的初始化入口

当 core 加载时，会做以下几件事情：

1. 初始化`Collections`模块
2. 初始化`Store`模块
3. 初始化`Emitter`模块
4. 初始化`Plugins`模块
5. 初始化`Err`模块
6. 加载并初始化内置插件
7. 加载外部插件
8. 根据外部插件是否`autoStart`，初始化需要自动执行的外部插件

## Usage

```
import DraftTable from 'draft-table';

const table = new DraftTable();
```

## Members

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

### plugins

描述：已注册的所有插件的集合，可以通过实例拿到插件，进行初始化等操作

```js
// 新建实例
const table = new DraftTable();

// 注册插件
table.registerPlugin("Hello", () => {});

// 获取插件并初始化
const hello = table.plugins.Hello();
```

## APIs

### registerPlugin _待定_

描述：注册外部插件

方法签名：(name: string, plugin: Class, default: object, options: object): void

方法参数：

| name    | type   | default | desc                                                                               |
| ------- | ------ | ------- | ---------------------------------------------------------------------------------- |
| name    | string | -       | 插件的名称，作为插件的 namespace，不可重复。[内置插件列表](/plugins/insidePlugins) |
| class   | Class  | -       | 插件的类，[详情](/plugins/callback)                                                |
| default | object | {}      | 插件的初始属性                                                                     |
| options | object | -       | 注册插件的选项， [详情](/modules/core?id=options)                                  |

#### options

| name | type    | default | desc                     |
| ---- | ------- | ------- | ------------------------ |
| auto | boolean | false   | 注册完毕是否自动创建实例 |

### getPluginInstance

描述：获取插件实例集合
