const commonConfig = require("./webpack.common");
const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const CONFIG = require('../../config.json');

const devServer = {
  contentBase: path.join(__dirname, "dist"),
  // enable HMR
  hot: true,
  // embed the webpack-dev-server runtime into the bundle
  inline: true,
  // serve index.html in place of 404 responses to allow HTML5 history
  historyApiFallback: true,
  host: '0.0.0.0',
  port: 9000
};

module.exports = merge(commonConfig, {
  devServer,
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "GLOBALS": JSON.stringify(CONFIG),
    })
  ]
});
