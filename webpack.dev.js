const webpack = require("webpack");
const common = require("./webpack.common");

module.exports = Object.assign(
  {
    mode: "development",
    devtool: "source-map",
    devServer: {
      hot: true,
      contentBase: common.output.path,
      host: "0.0.0.0",
    },
  },
  common,
  {
    plugins: [...common.plugins, new webpack.HotModuleReplacementPlugin()],
  },
);

// const path = require("path");
// const webpack = require("webpack");
// const htmlPlugin = require("html-webpack-plugin");

// const root = path.resolve(__dirname);
// const src = path.join(root, "src");
// const modules = path.join(src, "modules");
// const plugins = path.join(src, "Plugins");
// const types = path.join(src, "types");
// const helpers = path.join(src, "helpers");

// // const src = path.resolve(__dirname, "src");
// const output = path.resolve(__dirname, "dist");

// // const entry = path.join(src, "index.ts");
// const entry = path.resolve(__dirname, "examples", "index.js");
// // const entry = path.resolve(__dirname, "test.ts");
// module.exports = {
//   mode: "development",
//   entry,
//   output: {
//     filename: "[name].[hash].js",
//     path: output,
//     publicPath: "/",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts?$/,
//         loader: "awesome-typescript-loader",
//       },
//       {
//         test: /\.js?$/,
//         loader: "babel-loader",
//       },
//     ],
//   },
//   resolve: {
//     extensions: [".ts", ".js", ".json"],
//     alias: {
//       plugins,
//       modules,
//       types,
//       helpers,
//     },
//   },
//   devServer: {
//     hot: true,
//     contentBase: output,
//     host: "0.0.0.0",
//   },
//   plugins: [new htmlPlugin(), new webpack.HotModuleReplacementPlugin()],
// };
