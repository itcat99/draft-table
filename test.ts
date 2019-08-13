/* 
  items需要转换成 Map结构，方便通过id查找

  [{id:xxx}] => {id: {id: xxx}}

*/

const data = {
  hidden: false, // 是否隐藏所有格子
  adaptive: false, // 是否自适应行高列宽，如果为false，则超过长度的内容将被隐藏 覆盖row和cell内的设置
  rowSize: 18, // 默认行高
  colSize: 50, // 默认列宽
  items: [
    // 当前行内cell的配置
    {
      id: "", // 行id 唯一 Symbol,string,number
      index: 0, // 行索引，可更改
      hidden: false, // 是否隐藏当前行，如果为true，则覆盖items内的hidden属性
      merge: false, // 是否合并当前行 如果为true，则覆盖items内的merge属性
      selected: false, // 是否被选中， 如果为true，则覆盖items内格子的selected属性
      locked: false, // 是否锁定 如果为true时，则覆盖items内cell的locked属性
      size: 20, // 行高 单位px 如果行高不为数字或字符串数字，则取默认行高
      adaptive: false, // 是否自适应行高，如果为false，则超过长度的内容将被隐藏 不覆盖items内cell的属性
      items: [
        // 第一行items内cell的属性，定义了列的基本属性
        {
          id: "", // 列id，唯一，第一行的元素id作为默认id
          index: 0, // 列索引 可更改
          type: "", // 列类型， 第一行的元素type作为默认type
          value: "", // 内容
          size: 100, // 列宽 单位 px 取相对位置上最大值
          merge: false, // 是否合并当前格子 会判断当相邻的几个格子merge属性都为true时，判断合并这几个格子
          hidden: false, // 是否隐藏，只有当所有相对位置上的hidden属性都为true时，这个值才有意义。代表隐藏这一列
          selected: false, // 是否被选中，如果相对位置所有的selected属性都为true，则代表这一列被选中
          locked: false, // 是否锁定 如果相对位置所有的locked属性都为true，则代表这一列被锁定
          adaptive: false, // 是否自适应列宽，如果为false，则超过长度的内容将被隐藏，以第一行的元素为基准
        },
        {},
        {},
      ],
      style() {}, // 当前行的样式回调函数
    },
    {},
    {},
  ], // 作为row的集合
  style() {}, // 作为所有row的样式回调函数
};
