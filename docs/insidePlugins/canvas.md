# Canvas 插件

> 提供 canvas 的一些包装方法，提供链式调用

## Members/成员

### config

类型：Config_I

描述：全局配置选项

### el

类型：HTMLCanvasElement

描述：DOM 上的 canvas 元素

### ctx

类型：Context2d_I

描述：canvas 的 2d 上下文

### fontStyle

类型： string

描述：当前的字体样式字符串

## APIs/接口方法

### drawText

描述：绘制文字

方法签名：**(texts: Text[]): Canvas**

返回值：Canvas 实例

方法参数：

| name  | type   | default | optional | desc          |
| ----- | ------ | ------- | -------- | ------------- |
| texts | Text[] | -       | false    | Text 类的数组 |

### drawLine

描述：绘制线条

方法签名：**(lines: Line[]): Canvas**

返回值：Canvas 实例

方法参数：

| name  | type   | default | optional | desc          |
| ----- | ------ | ------- | -------- | ------------- |
| lines | Line[] | -       | false    | Line 类的数组 |

### drawRect

描述：绘制矩形

方法签名：**(rects: Rect[]): Canvas**

返回值：Canvas 实例

方法参数：

| name  | type   | default | optional | desc          |
| ----- | ------ | ------- | -------- | ------------- |
| rects | Rect[] | -       | false    | Rect 类的数组 |

### clear

描述：清除区域 如果没有变量，则清除整个画布

方法签名：**(x?: number, y?: number, w?: number, h?: number): Canvas**

返回值：Canvas 实例

方法参数：

| name | type   | default | optional | desc   |
| ---- | ------ | ------- | -------- | ------ |
| x    | number | -       | true     | x 坐标 |
| y    | number | -       | true     | y 坐标 |
| w    | number | -       | true     | 宽     |
| h    | number | -       | true     | 高     |

### color

描述：设置字体、区域填充的颜色

方法签名：**(color: Color_Type, opts?: SetAttrsOptions_I): Canvas**

返回值：Canvas 实例

方法参数：

| name  | type                                                           | default | optional | desc                                                         |
| ----- | -------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------ |
| color | Color_Type                                                     | -       | false    | 颜色                                                         |
| opts  | [SetAttrsOptions_I](/types/plugin/canvas?id=SetAttrsOptions_I) | -       | true     | 参数选项 [详情见](/types/plugin/canvas?id=SetAttrsOptions_I) |

### lineColor

描述：设置线条颜色

方法签名：**(color: Color_Type, opts?: SetAttrsOptions_I): Canvas**

返回值：Canvas 实例

方法参数：

| name  | type                                                           | default | optional | desc                                                         |
| ----- | -------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------ |
| color | Color_Type                                                     | -       | false    | 颜色                                                         |
| opts  | [SetAttrsOptions_I](/types/plugin/canvas?id=SetAttrsOptions_I) | -       | true     | 参数选项 [详情见](/types/plugin/canvas?id=SetAttrsOptions_I) |

### lineWidth

描述：设置线条宽度

方法签名：**(lineWidth: number, opts?: SetAttrsOptions_I): Canvas**

返回值：Canvas 实例

方法参数：

| name      | type                                                           | default | optional | desc                                                         |
| --------- | -------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------ |
| lineWidth | number                                                         | -       | false    | 线宽度                                                       |
| opts      | [SetAttrsOptions_I](/types/plugin/canvas?id=SetAttrsOptions_I) | -       | true     | 参数选项 [详情见](/types/plugin/canvas?id=SetAttrsOptions_I) |

### font

描述：设置字体属性

方法签名：**(config: Font_I, opts?: SetAttrsOptions_I): Canvas**

返回值：Canvas 实例

方法参数：

| name   | type                                                           | default | optional | desc                                                         |
| ------ | -------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------ |
| config | Font_I                                                         | -       | false    | font 属性对象                                                |
| opts   | [SetAttrsOptions_I](/types/plugin/canvas?id=SetAttrsOptions_I) | -       | true     | 参数选项 [详情见](/types/plugin/canvas?id=SetAttrsOptions_I) |

### setAttrs

描述：设置 ctx 的属性 并存在 Style 列表内

如果配置了`once`则只生效一次，生效后，先执行`cb`的回调函数，然后回滚到上次的属性，或者`id`指定的属性

方法签名：**(attrs: Attrs_I, opts?: SetAttrsOptions_I): Canvas**

返回值：Canvas 实例

方法参数：

| name  | type                                                           | default | optional | desc                                                         |
| ----- | -------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------ |
| attrs | Attrs_I                                                        | -       | false    | 要设置的属性对象                                             |
| opts  | [SetAttrsOptions_I](/types/plugin/canvas?id=SetAttrsOptions_I) | -       | true     | 参数选项 [详情见](/types/plugin/canvas?id=SetAttrsOptions_I) |

### setSize

描述：设置 canvas 的尺寸

方法签名：**(width: number, height: number)**

返回值：无

方法参数：

| name   | type   | default | optional | desc |
| ------ | ------ | ------- | -------- | ---- |
| width  | number | -       | false    | 宽度 |
| height | number | -       | false    | 高度 |

### getSize

描述：获取当前 canvas 的大小和屏幕分辨率比值

方法签名：**(): {width: number, height: number, ratio: number}**

返回值：`{width, height, ratio}`

方法参数：无

### popStyle

描述：回到选择的 style 状态

方法签名：**(key: string): Canvas**

返回值：Canvas 实例

方法参数：

| name | type   | default | optional | desc           |
| ---- | ------ | ------- | -------- | -------------- |
| key  | string | -       | false    | 要回滚到的 key |

## Events/事件

| name        | namespace | argument                      | desc                     |
| ----------- | --------- | ----------------------------- | ------------------------ |
| initialized | canvas    | -                             | 当 canvas 实例化后触发   |
| resize      | canvas    | { width: 宽度, height: 高度 } | 当设置 canvas 尺寸后触发 |

## types/类型定义

参见 [plugin/canvas type](/types/plugin/canvas)
