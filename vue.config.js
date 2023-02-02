// eslint-disable-next-line no-unused-vars
const path = require("path");
const webpack = require("webpack");
module.exports = {
  publicPath: '/',
  configureWebpack: {
    context: __dirname,
    node: {
      __filename: true
    },
    mode: 'production',
    optimization: {
      nodeEnv: 'production',
      minimize: true,
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins:  [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    module: {
      rules: []
    }
  }
}
