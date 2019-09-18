# Config 配置文件

> 包含了核心以及内置插件的配置项

Config 应用了[Config_I](/types/common?id=config_i)接口

| name          | value                     | desc                             |
| ------------- | ------------------------- | -------------------------------- |
| target        | document.body             | 目标 DOM 对象                    |
| width         | 800                       | 宽                               |
| height        | 600                       | 高                               |
| ratio         | getRatio()                | 屏幕像素比，默认为函数计算的结果 |
| style         | [Style](/config?id=style) | canvas 默认样式                  |
| font          | [Font](/config?id=font)   | 默认字体样式                     |
| extraColCount | 3                         | 额外渲染列数 \*再议              |
| extraRowCount | 5                         | 额外渲染行数 \*再议              |

## Style

| name         | value                 |
| ------------ | --------------------- |
| strokeStyle  | "#000000"             |
| fillStyle    | "#000000"             |
| lineWidth    | 1                     |
| textAlign    | TextAlign_Enum.LEFT   |
| textBaseline | TextBaseline_Enum.TOP |

## Font

| name       | value           |
| ---------- | --------------- |
| style      | "normal"        |
| variant    | "normal"        |
| stretch    | "normal"        |
| weight     | 400             |
| size       | 16              |
| family     | getFontFamily() |
| lineHeight | "16px"          |
