const Benchmark = require("benchmark");

const benchmark = new Benchmark({
  id: "test-next-[0,1]",
  fn() {
    prev(arr, [1]);
  },
  setup() {
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
  },
  onCycle(event) {
    // console.log(`${this.id}::: `, String(event.target));
  },
  onComplete(event) {
    console.log(String(event.target));
  },
});

const benchmark1 = benchmark.clone({
  id: "test-next-[0-1-1-0]",
  fn() {
    next(arr, [0, 1, 1, 0]);
  },
});

const result = benchmark.run();
// const result1 = benchmark1.run();

// console.log("Whoes faster? ", result.compare(result1) > -1 ? result.id : result1.id);
