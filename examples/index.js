import DraftTable, { Plugin } from "../src/index";

// const A = props => {
//   const { app, emitter, plugins } = props;

//   console.log("outside register plugin: ", app);

//   emitter.on("_PLUGINS_::registered", name => console.log("register plugin name: ", name));
// };

const table = new DraftTable();

table
  .on(
    "mousemove",
    e => {
      console.log("canvas: ", e.x);
    },
    "canvas",
  )
  .on(
    "click",
    e => {
      console.log("canvas click: ", e.x);
    },
    "canvas",
  );
