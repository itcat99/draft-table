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
