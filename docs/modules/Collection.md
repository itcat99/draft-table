
## 关于Collection：

### 定位：
  collection, 定义了一个集合；
  集合的功能：(1)集合存储的内容 (2)对于集合的操作
  集合的目标：(1)高效性 (2)解决特定集合结构的，特定操作的工具集合，主要针对 遍历、查找、增加、删除、修改等操作

## 约定：
  1、集合  存储的东西都具有单一性，即对于集合单体的单元是类型一致的，例如：var demo = [1,2,3,4]; 数组中的子元素，都是number类型的

## 使用方式：

抛出一个实例，比如new Collection()，入参为传入的集合；
```
const demoArray = [1,2,3,4];
const collectionDemoArray = collection(demoArray);
const resultIndex = collectionDemoArray.search("1");
```


