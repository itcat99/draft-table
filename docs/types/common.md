# 以下是**通用**类型定义

## Config_I

Core 配置文件对象接口

```ts
interface Config_I {
  [key: string]: any;
  target: HTMLCanvasElement | HTMLElement;
  width: number;
  height: number;
  ratio?: number;
  font?: Font_I;
  style?: Style_I;
  plugins?: PluginCollection_I;
  scrollbar?: ScrollbarProps_I;
  row?: number; // 行数量
  col?: number; // 列数量
  rowSize?: number; // 行高
  colSize?: number; // 列宽
  extraColCount: number; // 额外渲染的列数量
  extraRowCount: number; // 额外渲染的行数量
  data?: Data_I; // 元数据
}
```

## Context_I

全局上下文对象接口，继承了[PluginsProps_I](/types/plugins?id=pluginsprops_i)

```ts
interface Context_I extends PluginsProps_I {
  plugins: Plugins;
}
```

## ComponentProps_I

特指`Line`,`Rect`,`Text` component 的传入 props 接口

```ts
interface ComponentProps_I {
  id?: Id_Type;
  [key: string]: any;
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

## Pos_Type

定义坐标的类型

```ts
type Pos_Type = [number, number];
```

## Id_Type

定义 ID 的类型

```ts
type Id_Type = Symbol | string | number;
```
