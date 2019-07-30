# 以下是**通用**类型定义

## Config_I

Core 配置文件对象接口

```ts
interface Config_I {
  [key: string]: any;
  target: HTMLCanvasElement | HTMLElement;
  width: number;
  height: number;
  ratio: number;
  strokeStyle: string;
  fillStyle: string;
  fontStyle: string;
  fontVariant: string;
  fontStretch: string;
  fontWeight: number;
  fontSize: number;
  fontFamily: string;
  lineHeight: number; // 字体的行高
  lineWidth: number; // 线的宽度
  textAlign: TextAlign_Enum;
  textBaseline: TextBaseline_Enum;
  plugins?: PluginCollection_I;
}
```

## Context_I

全局上下文对象接口，继承了[PluginsProps_I](/types/plugins?id=pluginsprops_i)

```ts
interface Context_I extends PluginsProps_I {
  plugins: Plugins;
}
```

## TextAlign_Enum

ctx 的`textAlign`属性的枚举

```ts
enum TextAlign_Enum {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  START = "start",
  END = "end",
}
```

## TextBaseline_Enum

ctx 的`textBaseline`属性的枚举

```ts
enum TextBaseline_Enum {
  TOP = "top",
  HANGING = "hanging",
  MIDDLE = "middle",
  ALPHABETIC = "alphabetic",
  IDEOGRAPHIC = "ideographic",
  BOTTOM = "bottom",
}
```
