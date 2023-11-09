const { merge } = require('webpack-merge');
baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: true,
      version: true,
      timings: true,
      assets: true,
      chunks: true,
      modules: true,
      reasons: true,
      children: true,
      source: true,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: true
    },
    compress: true,
    hot: true,
    proxy: {
      "/api": {
        target: '<api-server>',
        pathRewrite: {  "^/api": "" },
        secure: false,
        changeOrigin: true,
        ws: true
      }
    },
  }
})