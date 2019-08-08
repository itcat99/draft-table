const common = require("./webpack.common");

module.exports = Object.assign({ mode: "production" }, common);
// const path = require("path");
// const htmlPlugin = require("html-webpack-plugin");

// // const src = path.resolve(__dirname, "src");
// const output = path.resolve(__dirname, "dist");

// // const entry = path.join(src, "index.ts");
// // const entry = path.resolve(__dirname, "examples", "index.js")
// const entry = path.resolve(__dirname, "test.ts");
// module.exports = {
//   mode: "production",
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
//   },
//   plugins: [new htmlPlugin()],
// };
