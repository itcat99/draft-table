定义了**样式、字体和颜色**相关的接口

## Font_I

字体接口

### 概览

```ts
interface Font_I {
  family?: string;
  lineHeight?: number | string;
  size?: number | string;
  stretch?: string;
  style?: string;
  variant?: string;
  weight?: number | string;
}
```

### 详细定义

| name       | type             | default  | optional | desc                                                                                     |
| ---------- | ---------------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| family     | string           | -        | true     | 字体名称                                                                                 |
| lineHeight | number \| string | -        | true     | 行高                                                                                     |
| size       | number \| string | -        | true     | 字体大小                                                                                 |
| stretch    | string           | "normal" | true     | 字体定义一个正常或经过伸缩变形的字体外观                                                 |
| style      | string           | "normal" | true     | 允许你选择 family 字体下的 italic 或 oblique 样式                                        |
| variant    | string           | "normal" | true     | [详情见 MDN:font-variant](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variant) |
| weight     | number \| string | "normal" | true     | 字重                                                                                     |

## Style_I

canvas 的样式相关接口

### 概览

```ts
interface Style_I {
  fillStyle?: string;
  lineWidth?: number;
  strokeStyle?: string;
  textAlign?: TextAlign_Enum;
  textBaseline?: TextBaseline_Enum;
}
```

### 详细定义

| name         | type              | default | optional | desc           |
| ------------ | ----------------- | ------- | -------- | -------------- |
| fillStyle    | string            | -       | true     | 文字和填充颜色 |
| lineWidth    | number            | -       | true     | 设置线宽       |
| strokeStyle  | string            | -       | true     | 笔画颜色       |
| textAlign    | TextAlign_Enum    | -       | true     | 文字对齐       |
| textBaseline | TextBaseline_Enum | -       | true     | 文字基线       |

## LineStyle_I

绘制的 Line 的样式

### 概览

```ts
interface LineStyle_I {
  color?: Color_Type;
  lineWidth?: number;
}
```

### 详细定义

| name      | type       | default | optional | desc     |
| --------- | ---------- | ------- | -------- | -------- |
| color     | Color_Type | -       | true     | 线条颜色 |
| lineWidth | number     | -       | true     | 线宽     |

## RectStyle_I

绘制的 Rect 的样式

### 概览

```ts
interface RectStyle_I {
  color?: Color_Type;
}
```

### 详细定义

| name  | type       | default | optional | desc     |
| ----- | ---------- | ------- | -------- | -------- |
| color | Color_Type | -       | true     | 填充颜色 |

## TextStyle_I

绘制的 Rect 的样式 继承了[Font_I 接口](/types/style?id=font_i)

### 概览

```ts
interface TextStyle_I extends Font_I {
  color?: Color_Type;
}
```

### 详细定义

| name  | type       | default | optional | desc     |
| ----- | ---------- | ------- | -------- | -------- |
| color | Color_Type | -       | true     | 填充颜色 |

## DataStyle_I

Data 数据中，有关样式部分的接口

### 概览

```ts
interface DataStyle_I {
  bgColor?: Color_Type;
  color?: Color_Type;
  fontFamily?: string;
  fontSize?: number | string;
  fontStretch?: string;
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: number | string;
  lineColor?: Color_Type;
  lineHeight?: number | string;
  lineWidth?: number;
  textAlign?: TextAlign_Enum;
  textBaseline?: TextBaseline_Enum;
}
```

### 详细定义

| name         | type              | default | optional | desc                                                                                     |
| ------------ | ----------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| bgColor      | Color_Type        | -       | true     | 背景颜色                                                                                 |
| color        | Color_Type        | -       | true     | 文字颜色                                                                                 |
| fontFamily   | string            | -       | true     | 字体名称                                                                                 |
| fontSize     | number \| string  | -       | true     | 字体大小                                                                                 |
| fontStretch  | string            | -       | true     | 字体定义一个正常或经过伸缩变形的字体外观                                                 |
| fontStyle    | string            | -       | true     | 允许你选择 family 字体下的 italic 或 oblique 样式                                        |
| fontVariant  | string            | -       | true     | [详情见 MDN:font-variant](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variant) |
| fontWeight   | number \| string  | -       | true     | 字重                                                                                     |
| lineColor    | Color_Type        | -       | true     | 线条颜色                                                                                 |
| lineHeight   | number \| string  | -       | true     | 行高                                                                                     |
| lineWidth    | number            | -       | true     | 线宽                                                                                     |
| textAlign    | TextAlign_Enum    | -       | true     | 文字对齐模式                                                                             |
| textBaseline | TextBaseline_Enum | -       | true     | 文字基线位置                                                                             |

## TextAlign_Enum

文字对齐枚举

### 概览

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

文字基线位置枚举

### 概览

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
