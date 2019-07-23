const path = require("path");
const webpack = require("webpack");
const htmlPlugin = require("html-webpack-plugin");

const src = path.resolve(__dirname, "src");
const output = path.resolve(__dirname, "dist");

const entry = path.join(src, "index.js");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "examples", "index.js"),
  output: {
    filename: "[name].[hash].js",
    path: output,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
      },
    ],
  },
  devServer: {
    hot: true,
    contentBase: output,
  },
  plugins: [new htmlPlugin(), new webpack.HotModuleReplacementPlugin()],
};
