import DraftTable from "../src/core";

const A = props => {
  const { app, emitter, plugins } = props;

  console.log("outside register plugin: ", app);

  emitter.on("_PLUGINS_::registered", name => console.log("register plugin name: ", name));
};

const table = new DraftTable({
  plugins: {
    A_Plugin: A,
  },
});
