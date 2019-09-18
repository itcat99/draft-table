定义了**内置插件 Canvas**的类型

## Line_I

Canvas 组件`Line`的构造函数属性接口，继承了[ComponentProps_I](/types/common?id=componentprops_i)接口

### 概览

```ts
interface Line_I extends ComponentProps_I {
  from: Pos_Type;
  to: Pos_Type;
}
```

### 详细定义

| name | type     | default | optional | desc     |
| ---- | -------- | ------- | -------- | -------- |
| from | Pos_Type | -       | false    | 初始坐标 |
| to   | Pos_Type | -       | false    | 结束坐标 |

## Rect_I

Canvas 组件`Rect`的构造函数属性接口，继承了[ComponentProps_I](/types/common?id=componentprops_i)接口

### 概览

```ts
interface Rect_I extends ComponentProps_I {
  pos: Pos_Type;
  width: number;
  height: number;
}
```

### 详细定义

| name   | type     | default | optional | desc           |
| ------ | -------- | ------- | -------- | -------------- |
| pos    | Pos_Type | -       | false    | 左上角顶点坐标 |
| width  | number   | -       | false    | 宽度           |
| height | number   | -       | false    | 高度           |

## Text_I

Canvas 组件`Rect`的构造函数属性接口，继承了[ComponentProps_I](/types/common?id=componentprops_i)接口

### 概览

```ts
interface Text_I extends ComponentProps_I {
  pos: Pos_Type;
  value: string;
}
```

### 详细定义

| name  | type     | default | optional | desc               |
| ----- | -------- | ------- | -------- | ------------------ |
| pos   | Pos_Type | -       | false    | 文字左上角顶点坐标 |
| value | string   | -       | false    | 文字内容           |

## SetAttrsOptions_I

`setAttrs`方法的选项接口

### 概览

```ts
interface SetAttrsOptions_I {
  id?: string;
  cb?: Function;
  once?: boolean;
}
```

### 详细定义

| name | type     | default | optional | desc                                                                                      |
| ---- | -------- | ------- | -------- | ----------------------------------------------------------------------------------------- |
| id   | string   | -       | true     | 属性 ID，如果有，则存在 Style 集合内                                                      |
| cb   | Function | -       | true     | 当配置了 once 时，设置属性完成后的回调函数                                                |
| once | boolean  | -       | true     | 如果为 true，则设置属性生效一次，生效后调用`cb`，然后属性会回滚到上一次或者指定 ID 的地方 |

## Color_Type

Canvas 可选的颜色类型

```ts
type Color_Type = string | CanvasGradient | CanvasPattern;
```

### 备注

- [CanvasGradient 详细定义](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasGradient)
- [CanvasPattern 详细定义](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasPattern)
