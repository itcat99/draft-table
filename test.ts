import Data from "./src/modules/Data";

const arr = [
  {
    index: 0,
    value: 1,
    children: [
      {
        index: 0,
        value: "0-0",
        children: [{ index: 0, value: "0-0-0", parentIndex: [0, 0] }],
        parentIndex: [0],
      },
      {
        index: 1,
        value: "0-1",
        parentIndex: [0],
        children: [
          {
            index: 0,
            value: "0-1-0",
            parentIndex: [0, 1],
            children: [{ index: 0, value: "0-1-0-0", parentIndex: [0, 1, 0] }],
          },
          {
            index: 1,
            value: "0-1-1",
            parentIndex: [0, 1],
            children: [
              { index: 0, value: "0-1-1-0", parentIndex: [0, 1, 1] },
              { index: 1, value: "0-1-1-1", parentIndex: [0, 1, 1] },
              { index: 2, value: "0-1-1-2", parentIndex: [0, 1, 1] },
            ],
          },
        ],
      },
    ],
  },
  { index: 1, value: 3 },
];

function getRowByIndex(arr, index) {
  if (!arr) return; // 如果没有arr 返回
  const currentIndex = index[0];
  if (typeof currentIndex !== "number") return; // 如果传入的index没有值 返回

  let result = arr[currentIndex];
  if (!result) return; // 如果无法获取到value 返回
  const nextIndex = index[1];
  if (typeof nextIndex !== "number") return result; // 如果没有下一个索引 返回val

  const { children } = result;
  return getRowByIndex(children, index.slice(1)); // 返回children 的值
}

// console.log(getRowByIndex(arr, [0, 1, 1, 0]));
console.log(next(arr, [0, 0]));
console.log(next(arr, [0, 1]));
console.log(prev(arr, [1]));

function next(arr, currentIndex = [0]) {
  const current = getRowByIndex(arr, currentIndex);
  if (!current) return;
  const { children, parentIndex } = current;
  // 找子节点，有就return
  if (children && children.length) {
    return children[0];
  }
  // 找下一个兄弟节点，有就return
  const broIndex = currentIndex.slice(0);
  broIndex[currentIndex.length - 1] += 1;
  let next = getRowByIndex(arr, broIndex);
  if (next) return next;
  // 找父节点的下一个兄弟节点，有就return
  if (parentIndex) {
    const uncleIndex = parentIndex.slice(0);
    uncleIndex[uncleIndex.length - 1] += 1;
    const uncle = getRowByIndex(arr, uncleIndex);
    if (uncle) return uncle;
  }
  // 都没有，return undefined
  return;
}

function prev(arr, currentIndex = [0]) {
  const current = getRowByIndex(arr, currentIndex);
  if (!current) return;
  const { parentIndex } = current;
  const { length } = currentIndex;
  // 找兄弟节点的最深一级子节点的最后一个 有就return
  const broIndex = currentIndex.slice(0);

  broIndex[length - 1] -= 1;
  if (broIndex[length - 1] >= 0) {
    const bro = getRowByIndex(arr, broIndex);
    if (bro) {
      const lastChildren = getDeepestChild(bro);
      if (lastChildren) return lastChildren;
      // 兄弟节点没有子节点 return 兄弟节点
      return bro;
    }
  }
  // 没有兄弟节点 返回父节点
  if (parentIndex) {
    const parent = getRowByIndex(arr, parentIndex);
    if (parent) return parent;
  }

  return;
  // 没有父节点 返回undefined
}

function getDeepestChild(item) {
  const { children } = item;
  if (children && children.length) {
    const last = children[children.length - 1];
    const { children: lastChildren } = last;
    if (!lastChildren) return last;
    return getDeepestChild(last);
  }
}

// const data = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 0]];
// const data1 = {
//   rows: [
//     {
//       id: "hhh",
//       cells: [{ id: "aaa" }],
//       children: {
//         rows: [
//           {
//             id: "hhh1",
//             cells: [{ id: "aaa1" }],
//             children: {
//               rows: [{ id: "hhh2", cells: [{ id: "aaa2" }] }],
//             },
//           },
//         ],
//       },
//     },
//     {
//       cells: [{ id: "bbb" }],
//       children: {
//         rows: [
//           {
//             id: "hhh1",
//             cells: [{ id: "aaa1" }],
//             children: {
//               rows: [{ id: "hhh2", cells: [{ id: "aaa2" }] }],
//             },
//           },
//         ],
//       },
//     },
//   ],
// };

// const collection = new Data({ data: data1, width: 400, height: 300 });

// console.log(collection.getOrigin());

// console.log("arr: ", arr);

// /*
//   items需要转换成 Map结构，方便通过id查找

//   [{id:xxx}] => {id: {id: xxx}}

// */

// const data = {
//   hidden: false, // 是否隐藏所有格子
//   wrap: false, // 是否折行，如果为false，则超过长度的内容将被隐藏 覆盖row和cell内的设置
//   rowSize: 18, // 默认行高
//   colSize: 50, // 默认列宽
//   items: [
//     // 当前行内cell的配置
//     {
//       id: "", // 行id 唯一 Symbol,string,number
//       index: 0, // 行索引，可更改
//       hidden: false, // 是否隐藏当前行，如果为true，则覆盖items内的hidden属性
//       merge: 1, // 是否合并当前行 如果为true，则覆盖items内的merge属性
//       selected: false, // 是否被选中， 如果为true，则覆盖items内格子的selected属性
//       locked: false, // 是否锁定 如果为true时，则覆盖items内cell的locked属性
//       size: 20, // 行高 单位px 如果行高不为数字或字符串数字，则取默认行高
//       wrap: false, //* 是否折行，如果为false，则超过长度的内容将被隐藏 不覆盖items内cell的属性
//       style: {
//         bgColor: "red",
//         color: "blue",
//         size: 10,
//       },
//       children: {
//         deep: 1,
//         hidden: false,
//         parentId: "",
//         parentIndex: "",
//         items: [{}],
//       },
//       items: [
//         // 第一行items内cell的属性，定义了列的基本属性
//         {
//           style: {},
//           id: "", // 列id，唯一，第一行的元素id作为默认id
//           index: 0, // 列索引 可更改
//           type: "", // 列类型， 第一行的元素type作为默认type
//           value: "", // 内容
//           size: 100, // 列宽 单位 px 取相对位置上最大值
//           merge: [0, 1], // 传入的时候是结束点的坐标，原始集合内存true或false，判断当前格子的线段是否绘制 // 是否合并当前格子 会判断当相邻的几个格子merge属性都为true时，判断合并这几个格子
//           hidden: false, // 是否隐藏，只有当所有相对位置上的hidden属性都为true时，这个值才有意义。代表隐藏这一列
//           selected: false, // 是否被选中，如果相对位置所有的selected属性都为true，则代表这一列被选中
//           locked: false, // 是否锁定 如果相对位置所有的locked属性都为true，则代表这一列被锁定
//           wrap: false, // 是否折行，如果为false，则超过长度的内容将被隐藏，以第一行的元素为基准
//         },
//         {
//           index: 1,
//         },
//         {},
//       ],
//       customStyle() {}, // 当前行的样式回调函数
//     },
//     {},
//     {},
//   ], // 作为row的集合
//   merge: [],
//   customStyle() {}, // 作为所有row的样式回调函数
// };
