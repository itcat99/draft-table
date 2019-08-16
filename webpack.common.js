const path = require("path");
const htmlPlugin = require("html-webpack-plugin");

const root = path.resolve(__dirname);
const src = path.join(root, "src");
const modules = path.join(src, "modules");
const plugins = path.join(src, "Plugins");
const types = path.join(src, "types");
const helpers = path.join(src, "helpers");
const output = path.join(root, "dist");
const components = path.join(src, "components");

// const entry = path.join(src, "index.ts");
// const entry = path.join(root, "examples", "index.js");
const entry = path.resolve(__dirname, "test.ts");

module.exports = {
  entry,
  output: {
    filename: "[name].[hash].js",
    path: output,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.js?$/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      plugins,
      modules,
      types,
      helpers,
      components,
    },
  },
  plugins: [new htmlPlugin()],
};
