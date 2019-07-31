import DraftTable, { Plugin } from "../src/index";

// const A = props => {
//   const { app, emitter, plugins } = props;

//   console.log("outside register plugin: ", app);

//   emitter.on("_PLUGINS_::registered", name => console.log("register plugin name: ", name));
// };

const table = new DraftTable();

table
  .on("wheel", e => {
    console.log("wheel: ", e);
  })
  .on("scroll", e => {
    console.log("scroll", e);
  });
