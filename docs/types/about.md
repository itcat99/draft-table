# Types

这里提供所有以定义的类型，根据`common`、`plugins`、`emitter`划分不同集合

## type 定义规范

## 通用

1. 首字母大写
2. 名称采用驼峰法

### 定义接口(Interface)

1. 接口名称后加`_I`以表示这是一个接口类型

例如：

```ts
interface A_I {} // 正确
interface AbC_I {} // 正确

interface b {} // 错误
interface _b {} // 错误
interface A {} // 错误
interface A_b_I {} // 错误
```

### 定义枚举(Enum)

1. 枚举类型名称后要跟`_Enum`，表示这是一个枚举类型

### 定义类型别名(Type)

1. 类型别名后要跟`_Type`，表示这是一个类型别名

### 其他待添加
