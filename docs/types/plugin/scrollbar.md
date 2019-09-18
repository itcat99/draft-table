定义了**内置插件 Scrollbar**的类型

## ScrollbarProps_I

Scrollbar 的构造函数参数接口

## 概览

```ts
interface ScrollbarProps_I {
  [key: string]: any;
  activeColor?: Color_Type;
  color?: Color_Type;
  delay?: number;
  handleColor?: Color_Type;
  handleWeight?: number;
  hLength?: number;
  hOrigin?: Pos_Type;
  hScrollbar?: boolean;
  hSize?: number;
  vLength?: number;
  vOrigin?: Pos_Type;
  vScrollbar?: boolean;
  vSize?: number;
  weight?: number;
}
```

### 详细定义

| name         | type       | default                     | optional | desc                                         |
| ------------ | ---------- | --------------------------- | -------- | -------------------------------------------- |
| activeColor  | Color_Type | "#fafafa"                   | true     | 滚动条被激活时的颜色                         |
| color        | Color_Type | "#f1f1f1"                   | true     | 滚动条的颜色                                 |
| delay        | number     | -                           | true     | 触发延迟 `再议`                              |
| handleColor  | Color_Type | "#111111"                   | true     | 滚动轴拖块的颜色                             |
| handleWeight | number     | -                           | true     | 滚动轴拖块的宽度（纵向）或高度（横向）       |
| hLength      | number     | -                           | true     | 横向滚动的总长度                             |
| hOrigin      | Pos_Type   | [0, canvas.height - weight] | true     | 横向滚动条 原点坐标                          |
| hScrollbar   | boolean    | false                       | true     | 是否启用横向滚动条                           |
| hSize        | number     | canvas.width                | true     | 横向滚动条的宽度                             |
| vLength      | number     | -                           | true     | 纵向滚动的总长度                             |
| vOrigin      | Pos_Type   | [canvas.width - weight, 0]  | true     | 纵向滚动条 原点坐标                          |
| vScrollbar   | boolean    | false                       | true     | 是否启用纵向滚动条                           |
| vSize        | number     | canvas.height               | true     | 纵向滚动条的高度                             |
| weight       | number     | 16                          | true     | 滚动轴的宽度（纵向）或高度（横向） 默认为 16 |

## BarProps_I

Bar 组件构造函数参数接口

### 概览

```ts
interface BarProps_I {
  activeColor: Color_Type;
  color: Color_Type;
  handleColor: Color_Type;
  handleWeight: number;
  length: number;
  origin: Pos_Type;
  size: number;
  type: BarType_Enum;
  weight: number;
}
```

### 详细定义

| name         | type         | default | optional | desc                                   |
| ------------ | ------------ | ------- | -------- | -------------------------------------- |
| activeColor  | Color_Type   | -       | false    | 激活时的颜色                           |
| color        | Color_Type   | -       | false    | 滚动轴初始颜色                         |
| handleColor  | Color_Type   | -       | false    | 滚动轴拖块的初始颜色                   |
| handleWeight | number       | -       | false    | 滚动轴拖块的宽度（纵向）或高度（横向） |
| length       | number       | -       | false    | 表格的总高度（纵向）或宽度（横向）     |
| origin       | Pos_Type     | -       | false    | 滚动轴左上角坐标                       |
| size         | number       | -       | false    | 滚动轴的高度（纵向）或宽度（横向）     |
| type         | BarType_Enum | -       | false    | 滚动轴的类型（横向或纵向）             |
| weight       | number       | -       | false    | 滚动轴的宽度（纵向）或高度（横向）     |
