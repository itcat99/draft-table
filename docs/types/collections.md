# Collections（集合）相关类型接口

## Data_I

数据集合对象接口，代表一个表格的所有元信息。

也可以表示嵌套表格中，`子表格`的元信息。

### 概览

```ts
interface Data_I {
  colSize?: number;
  customStyle?: Function;
  deep?: number;
  hidden?: boolean;
  offsetWithViewX?: number;
  offsetWithViewY?: number;
  parentId?: Id_Type;
  parentIndex?: GlobalIndex_Type;
  rows?: RowData_I[];
  rowSize?: number;
  wrap?: boolean;
}
```

### 详细定义

| name            | type             | default | optional | desc                                           |
| --------------- | ---------------- | ------- | -------- | ---------------------------------------------- |
| colSize         | number           | 100     | Y        | 当前表格的全局列宽，单位 px                    |
| customStyle     | Function         | -       | Y        | 自定义当前表格的全局的行样式回调函数           |
| deep            | number           | 0       | Y        | 层级深度                                       |
| hidden          | boolean          | false   | Y        | 是否隐藏所有行数据                             |
| offsetWithViewX | number           | 0       | Y        | 首列相对视图区域的横向偏移量                   |
| offsetWithViewY | number           | 0       | Y        | 首行相对视图区域的纵向偏移量                   |
| parentId        | Id_Type          | -       | Y        | 父级行的 Id                                    |
| parentIndex     | GlobalIndex_Type | -       | Y        | 父级在全局的索引，如果没有此项，则视为`根表格` |
| rows            | RowData_I[]      | []      | Y        | 行集合                                         |
| rowSize         | number           | 20      | Y        | 当前表格的全局行高，单位 px                    |
| wrap            | boolean          | false   | Y        | 当前表格的全局格子内文字是否折行               |

## SimpleData_I

简单数据集合对象接口

### 概览

```ts
interface SimpleData_I {
  [index: number]: number | string | SimpleData_I;
}
```

### 详细定义

接受 `number`,`string`,`SimpleData_I`类型的数组，支持多维数组。

嵌套的数组被当作子表格，其他的属性配置为默认值。

## RowData_I

行的对象接口

### 概览

```ts
interface RowData_I {
  cells?: CellDataArr_Type;
  children?: Data_I;
  customStyle?: Function;
  hidden?: boolean;
  id?: Id_Type;
  index?: number;
  locked?: boolean;
  merge?: boolean | number;
  parentIndex?: GlobalIndex_Type;
  selected?: boolean;
  size?: number;
  style?: DataStyle_I;
  wrap?: boolean;
}
```

### 详细定义

| name        | type              | default  | optional | desc                         |
| ----------- | ----------------- | -------- | -------- | ---------------------------- |
| cells       | CellDataArr_Type  | -        | Y        | 格子集合                     |
| children    | Data_I            | -        | Y        | 子表格                       |
| customStyle | Function          | -        | Y        | 自定义这一行的样式           |
| hidden      | boolean           | false    | Y        | 隐藏这一行                   |
| id          | Id_Type           | Symbol() | Y        | 行 Id                        |
| index       | number            | -        | Y        | 当前表格内行索引             |
| locked      | boolean           | false    | Y        | 是否锁定行，锁定的行不会刷新 |
| merge       | boolean \| number | false    | Y        | 是否合并行                   |
| parentIndex | GlobalIndex_Type  | -        | Y        | 父行的全局索引               |
| slected     | boolean           | false    | Y        | 是否被选中                   |
| size        | number            | 20       | Y        | 行高，单位 px                |
| style       | DataStyle_I       | -        | Y        | 行样式                       |
| wrap        | boolean           | false    | Y        | 行内格子的文字是否折行       |

## CellData_I

格子的对象接口

### 概览

```ts
interface CellData_I {
  hidden?: boolean;
  id?: Id_Type;
  index?: number;
  locked?: boolean;
  merge?: boolean | Pos_Type;
  selected?: boolean;
  size?: number;
  style?: DataStyle_I;
  type?: CellType_Enum;
  value?: CellValue_Type;
  wrap?: boolean;
}
```

### 详细定义

| name    | type              | default  | optional | desc                             |
| ------- | ----------------- | -------- | -------- | -------------------------------- |
| hidden  | boolean           | false    | Y        | 隐藏这个格子                     |
| id      | Id_Type           | Symbol() | Y        | 格子 Id                          |
| index   | number            | -        | Y        | 当前行内行索引                   |
| locked  | boolean           | false    | Y        | 是否锁定格子，锁定的格子不会刷新 |
| merge   | boolean \| number | false    | Y        | 是否合并格子                     |
| slected | boolean           | false    | Y        | 是否被选中                       |
| size    | number            | 100      | Y        | 格子宽度，单位 px                |
| style   | DataStyle_I       | -        | Y        | 行样式                           |
| type    | CellType_Enum     | "text"   | Y        | 格子类型                         |
| value   | CellValue_Type    | ""       | Y        | 格子内容                         |
| wrap    | boolean           | false    | Y        | 格子的文字是否折行               |

## RenderingData_I

渲染集合接口

### 概览

```ts
interface RenderingData_I {
  line?: FinalCollection_I<LineStyle_I, Line>[];
  rect?: FinalCollection_I<RectStyle_I, Rect>[];
  text?: FinalCollection_I<TextStyle_I, Text>[];
}
```

### 详细定义

| name | type                                   | default | optional | desc               |
| ---- | -------------------------------------- | ------- | -------- | ------------------ |
| line | FinalCollection_I<LineStyle_I, Line>[] | -       | true     | 线条的最终绘制集合 |
| rect | FinalCollection_I<RectStyle_I, Rect>[] | -       | true     | 矩形的最终绘制集合 |
| text | FinalCollection_I<TextStyle_I, Text>[] | -       | true     | 文字的最终绘制集合 |

## FinalCollection_I

最终绘制的`Line`,`Rect`,`Text`集合的结构

### 概览

```ts
interface FinalCollection_I<T, M> {
  data: M[];
  style: T;
}
```

### 详细定义

| name  | type | default | optional | desc                   |
| ----- | ---- | ------- | -------- | ---------------------- |
| data  | M[]  | -       | false    | 绘制的实例数组         |
| style | T    | -       | false    | 当前绘制实例的样式定义 |

## CellType_Enum

格子类型枚举

```ts
enum CellType_Enum {
  PLUGIN = "plugin", // 插件类型
  TEXT = "text", // 文本类型
}
```

## CellValue_Type

格子内值的类型

```ts
type CellValue_Type = Plugin | string | undefined | null | number;
```

## CellDataArr_Type

格子集合的类型

```ts
type CellDataArr_Type = string[] | number[] | Array<CellData_I>;
```

## GlobalIndex_Type

全局索引的类型

```ts
type GlobalIndex_Type = number[];
```
