import Style from "./src/Plugins/Canvas/Style";

const style = new Style();

style.add({ data: { name: "Hello" } }).add({ data: { name: "world" }, id: "world" });

// console.log(style.prev());
// console.log(style.next());

const id = Symbol("zbp");
style.add({
  data: {
    name: "zbp",
    id,
  },
});

style.del(1);

console.log(style.pop(1));
