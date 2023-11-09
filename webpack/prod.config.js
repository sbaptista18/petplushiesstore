const { merge } = require('webpack-merge');
baseConfig = require('./base.config');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /\.js(\?.*)?$/i,
    })]
  }
})
