# 以下是**Plugin**相关的类型定义

## Plugin_I

在 plugins 模块内，插件的对象接口

```ts
interface Plugin_I {
  class: typeof Plugin;
  options: RegisterOptions_I;
}
```

## RegisterOptions_I

注册插件的配置对象接口

```ts
interface RegisterOptions_I {
  auto?: boolean;
  autoProps?: object;
  namespace?: string;
}
```

## PluginCollection_I

Config 内插件集合的接口

```ts
interface PluginCollection_I {
  [namespace: string]: Plugin_I;
}
```

## PluginsProps_I

实例化 plugins 模块时，接收的参数对象的接口

```ts
interface PluginsProps_I {
  err: Err;
  core: Core;
  emitter: Emitter;
  config: Config_I;
}
```

## PluginsClasses_Type

插件类对象的集合类型

```ts
type PluginsClasses_Type = Map<string, Plugin_I>;
```

## PluginsInstances_Type

插件实例的集合类型

```ts
type PluginsInstances_Type = Map<string, Plugin>;
```
