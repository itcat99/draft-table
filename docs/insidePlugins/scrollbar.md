# scrollbar/滚动条

> canvas 滚动条，依赖 canvas 组件

## Members

### vScrollbar

类型：boolean

描述：是否开启纵向滚动条

### hScrollbar

类型：boolean

描述：是否开启横向滚动条

### vPos

类型：number

描述：纵向滚动条的位置百分比

### hPos

类型：number

描述：横向滚动条的位置百分比

### vSize

类型：number

描述：纵向 bar 的高度 单位 px

### hSize

类型：number

描述：横向 bar 的宽度 单位 px

### weight

类型：number

描述：横向滚动条的高度 && 纵向滚动条的宽度 单位 px

### barWeight

类型：number

描述：横向 bar 的高度 && 纵向 bar 的宽度 单位 px

### delay

类型：number

描述：滚动条淡出延迟，单位 ms

### opacity

类型：number

描述：没有触发时，滚动条透明度 [0 - 1]

### fixed

类型：boolean

描述：是否固定滚动条，固定后，将不会有淡出淡出，并且滚动条占据一部分空间

## APIs/接口

### moveTo

描述：移动到某处

方法签名：**(pos: number): Scrollbar**

返回值：Scrollbar 实例

方法参数：

| name | type   | default | optional | desc       |
| ---- | ------ | ------- | -------- | ---------- |
| pos  | number | -       | false    | 移动的位置 |

### moveTop

描述：移至开始位置（纵向的顶端，横向的左边）

方法签名：**(): Scrollbar**

返回值：Scrollbar 实例

方法参数：无

### moveBottom

描述：移至结束位置（纵向的底端，横向的右边）

方法签名：**(): Scrollbar**

返回值：Scrollbar 实例

方法参数：无

### update

描述：

方法签名：

返回值：

方法参数：

| name | type   | default | optional | desc     |
| ---- | ------ | ------- | -------- | -------- |
| key  | string | -       | false    | 事件名称 |

### get

描述：

方法签名：

返回值：

方法参数：

| name | type   | default | optional | desc     |
| ---- | ------ | ------- | -------- | -------- |
| key  | string | -       | false    | 事件名称 |

### set

描述：

方法签名：

返回值：

方法参数：

| name | type   | default | optional | desc     |
| ---- | ------ | ------- | -------- | -------- |
| key  | string | -       | false    | 事件名称 |
