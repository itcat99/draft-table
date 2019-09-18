# scrollbar/滚动条

> canvas 滚动条，依赖 canvas 插件

## Members

### options

类型：ScrollbarProps_I

描述：scrollbar 初始化选项

### hasVScrollbar

类型：boolean

描述：是否开启纵向滚动条

### hasHScrollbar

类型：boolean

描述：是否开启横向滚动条

### vSize

类型：number

描述：纵向 bar 的高度 单位 px

### hSize

类型：number

描述：横向 bar 的宽度 单位 px

## APIs/接口

## Events/事件

| name             | namespace | argument                                                                     | desc                                    |
| ---------------- | --------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| wheel            | scrollbar | { deltaY: Y 轴滚动的距离, deltaX:X 轴滚动的距离 }                            | 当滚轮滚动时触发                        |
| hover            | scrollbar | { v: 纵向是否 hover, h: 横向是否 hover }                                     | 当鼠标 hover 滚动轴时触发               |
| changeViewOffset | bar       | {{ type: 滚动轴类型（横向、纵向）, offset: 视图在总区域被的偏移量 单位 px }} | 当单击 scrollbar 或拖动滚动轴拖块时触发 |
